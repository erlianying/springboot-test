$.trackAnalyse = $.trackAnalyse ||{};

(function ($) {

    "use strict";

    var nodes = [];
    var links = [];
    var force = null;

    var neo4jInitInfo ;

    $(document).ready(function () {

        setDefaultQueryDate();
        initRootInfo();
        initNodeAndLink();

        /**
         * 重置
         */
        $(document).on("click","#reset",function () {
            $("#identity").val("");
            $("#identityValue").val("");
            setDefaultQueryDate();
        });

        /**
         * 分析按钮
         */
        $(document).on("click", "#analyseBut", function(){
            $("#identityValue").val($("#identity").val());
            nodes = [];
            links = [];
            queryNodesAndLinks();
        });

        /**
         * 关系条件选中事件
         */
        $(document).on("ifChecked", "input[name='relationCheckbox']", function () {
            // queryNodesAndLinks();
        });

        /**
         * 关系条件取消选中事件
         */
        $(document).on("ifUnchecked", "input[name='relationCheckbox']", function () {
            // queryNodesAndLinks();
        });
    });

    /**
     * 设置默认查询时间
     */
    function setDefaultQueryDate(){
        var nowDate = new Date();
        var startDateLong = nowDate.getTime() - 1000*60*60*24;
        var startDateStr = $.date.timeToStr(startDateLong, "yyyy-MM-dd HH:mm:ss");
        var endDateStr = $.date.dateToStr(nowDate, "yyyy-MM-dd HH:mm:ss");
        $.laydate.setRange(startDateStr, endDateStr, "#dateRange");
    }




    /**
     * 验证查询条件
     */
    function verifyQueryCondition(){
        var demo = $.validform.getValidFormObjById("queryValidForm") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }
        var startTimeLong = $.laydate.getTime("#dateRange", "start");
        var endTimeLong = $.laydate.getTime("#dateRange", "end");
        if($.util.isBlank(startTimeLong)){
            $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请设置轨迹开始时间。",time:3000}) ;
            return false;
        }
        if($.util.isBlank(endTimeLong)){
            $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请设置轨迹结束时间。",time:3000}) ;
            return false;
        }
        return true;
    }

    /**
     * 初始化Neo4j查询用参数
     */
    function initRootInfo(){
        $.ajax({
            url:context + '/dataAnalysePersonTraceRelation/getInitInfo',
            type:"post",
            dataType:"json",
            success:function(successData){
                neo4jInitInfo = successData ;
            }
        })
    }

    /**
     * 获取查询SQL对象
     */
    function getQuerySqlObj(){

        var identity = $("#identityValue").val();

        //时间条件
        var startTime = $.laydate.getTime("#dateRange", "start");
        var endTime = $.laydate.getTime("#dateRange", "end");

        var requestBody = {};

        var sqlObjArr = [];
        //火车同行
        if($("#trainRelation").prop("checked")){
            var sqlObj = {};
            sqlObj["statement"] =
                "match(ha:HrskPerson{identity:{identity}})-[tra:TRACK]-(ta:Train),(hb:HrskPerson)-[trb:TRACK]-(tb:Train) " +
                "where ta.startTime = tb.startTime and ta.trainNumber = tb.trainNumber and ta.startTime > {startTime} and ta.startTime < {endTime}" +
                "return '" + $.common.relationshipAnalysis.TRAIN_TRACK + "', ha, hb, ta, tb";
            sqlObj["parameters"] = {
                identity : identity ,
                startTime : startTime ,
                endTime : endTime
            };
            sqlObjArr.push(sqlObj);
        }
        //飞机同行
        if($("#planeRelation").prop("checked")){
            var sqlObj = {};
            sqlObj["statement"] =
                "match(ha:HrskPerson{identity:{identity}})-[tra:TRACK]-(pa:Plane),(hb:HrskPerson)-[trb:TRACK]-(pb:Plane) " +
                "where pa.startTime = pb.startTime and pa.planeNumber = pb.planeNumber and pa.startTime > {startTime} and pa.startTime < {endTime}" +
                "return '" + $.common.relationshipAnalysis.PLANE_TRACK + "', ha, hb, pa, pb";
            sqlObj["parameters"] = {
                identity : identity ,
                startTime : startTime ,
                endTime : endTime
            };
            sqlObjArr.push(sqlObj);
        }
        //网吧同上网
        if($("#netBarRelation").prop("checked")){
            var sqlObj = {};
            sqlObj["statement"] =
                "match(ha:HrskPerson{identity:{identity}})-[tra:TRACK]-(nba:NetBar)-[htpa:HEAD_TO_PLACE]-(p:Place)-[htpb:HEAD_TO_PLACE]-(nbb:NetBar)-[trb:TRACK]-(hb:HrskPerson) " +
                "where nba.startTime = nbb.startTime and nba.startTime > {startTime} and nba.startTime < {endTime} " +
                "return '" + $.common.relationshipAnalysis.NET_BAR_TRACK + "', ha, hb, p, nba, nbb";
            sqlObj["parameters"] = {
                identity : identity ,
                startTime : startTime ,
                endTime : endTime
            };
            sqlObjArr.push(sqlObj);
        }
        //旅店同住
        if($("#hotelRelation").prop("checked")){
            var sqlObj = {};
            sqlObj["statement"] =
                "match(ha:HrskPerson{identity:{identity}})-[tra:TRACK]-(hoa:Hotel)-[htpa:HEAD_TO_PLACE]-(p:Place)-[htpb:HEAD_TO_PLACE]-(hob:Hotel)-[trb:TRACK]-(hb:HrskPerson) " +
                "where hoa.startTime = hob.startTime and hoa.startTime > {startTime} and hoa.startTime < {endTime} " +
                "return '" + $.common.relationshipAnalysis.HOTEL_TRACK + "', ha, hb, p, hoa, hob";
            sqlObj["parameters"] = {
                identity : identity ,
                startTime : startTime ,
                endTime : endTime
            };
            sqlObjArr.push(sqlObj);
        }
        requestBody["statements"] = sqlObjArr;
        console.log(requestBody);
        return requestBody;
    }

    /**
     * 查询数据
     */
    function queryNodesAndLinks(){
        //强制结束力学运算，否则会报错
        if($.util.exist(force)){
            force.stop();
        }
        //暴力更新--删除所有，重新生成
        d3.select('.svgBox')
            .selectAll('*')
            .remove();
        //验证查询条件
        var flag = verifyQueryCondition();
        if(!flag){
            return ;
        }
        //开始查询
        var req = {
            url:neo4jInitInfo["serviceRoot"]["transaction"] + "/commit",
            restMethod:neo4jInitInfo["restMethods"]["POST"],
            requestBody:getQuerySqlObj()
        }

        $.util.topWindow().$.common.showOrHideLoading(true);
        $.ajax({
            url:context + '/dataAnalysePersonTraceRelation/queryNeo4j',
            data:JSON.stringify(req),
            type:"post",
            contentType:"application/json;charset=utf-8",
            dataType:"json",
            success:function(successData){
                $.util.topWindow().$.common.showOrHideLoading(false);
                var sourceData = successData.sourceData;
                var dataMapList = successData.dataMapList;
                console.log(sourceData) ;
                console.log(successData.dataMapList) ;
                setNodesAndLinks(dataMapList);
            }
        })
    }

    /**
     * 设置节点和关系数组
     *
     * @param resultObj 查询结果
     */
    function setNodesAndLinks(dataObjArray) {
        if(dataObjArray.length < 1){
            // nodes = [];
            // links = [];
            initNodeAndLink();
            return false;
        }
        //循环数据添加node节点和link关系
        $.each(dataObjArray, function (d, data) {
            var rowObjArray = data.row;
            addRelationLink(rowObjArray);
        });
        console.log("====nodes start====");
        console.log(nodes);
        console.log("====nodes end====");
        console.log("====links start====");
        console.log(links);
        console.log("====links end====");
        initNodeAndLink();
    }

    /**
     * 添加关系Link
     */
    function addRelationLink(rowObjArray) {
        var relationType = rowObjArray[0];
        var target = null;
        var relationName = "";
        if(relationType == $.common.relationshipAnalysis.TRAIN_TRACK){
            target = addTrainNode(rowObjArray[3]);
            relationName = "火车同行" ;
        }else if(relationType == $.common.relationshipAnalysis.PLANE_TRACK){
            target = addPlaneNode(rowObjArray[3]);
            relationName = "飞机同行" ;
        }else if(relationType == $.common.relationshipAnalysis.NET_BAR_TRACK){
            target = addNetBarNode(rowObjArray[3], rowObjArray[4]);
            relationName = "网吧同上网" ;
        }else if(relationType == $.common.relationshipAnalysis.HOTEL_TRACK){
            target = addHotelNode(rowObjArray[3], rowObjArray[4]);
            relationName = "旅店同住" ;
        }

        var linkObjOne = {
            source : addPersonNode(rowObjArray[1]) ,
            target : target ,
            relation : relationName
        };
        addLink(linkObjOne);
        var linkObjTwo = {
            source : addPersonNode(rowObjArray[2]) ,
            target : target ,
            relation : relationName
        };
        addLink(linkObjTwo);
    }

    /**
     * 添加关系到数组
     *
     * @param link 关系对象
     */
    function addLink(link){
        if(!$.util.exist(link)){
            return ;
        }
        link["id"] = link.source.toString() + link.target.toString();
        //是空的，直接添加
        if(links.length < 1){
            links.push(link);
            return ;
        }
        //循环查找是否已存在关系
        var isExist = false;
        $.each(links, function (i, val) {
            if(link.id == val.id){
                isExist = true;
                val.relation = link.relation;
                return false;
            }
        });
        if(!isExist){
            links.push(link);
        }
    }

    /**
     * 添加旅店住宿节点
     *
     * @param placeObj 地点
     * @param traceObj 旅店住宿轨迹
     */
    function addHotelNode(placeObj, traceObj) {
        if(!$.util.exist(placeObj) && !$.util.exist(traceObj)){
            return null;
        }
        var isExist = false;
        var index = 0;
        var identity = traceObj.startTime + placeObj.name;
        $.each(nodes, function (n, node) {
            var id = node.id;
            if(id == identity){
                isExist = true;
                index = n;
                return false;
            }
        });
        if(isExist){
            return index;
        }else{
            var nodeObj = {
                id : identity ,
                name : traceObj.hotelName ,
                date : $.date.timeToStr(traceObj.startTime, "yyyy-MM-dd") ,
                tag : "hotel" ,
                address : placeObj.name
            };
            nodes.push(nodeObj);
            return nodes.length - 1;
        }
    }

    /**
     * 添加网吧上网节点
     *
     * @param placeObj 地点
     * @param traceObj 网吧上网轨迹
     */
    function addNetBarNode(placeObj, traceObj) {
        if(!$.util.exist(placeObj) && !$.util.exist(traceObj)){
            return null;
        }
        var isExist = false;
        var index = 0;
        var identity = traceObj.startTime + placeObj.name;
        $.each(nodes, function (n, node) {
            var id = node.id;
            if(id == identity){
                isExist = true;
                index = n;
                return false;
            }
        });
        if(isExist){
            return index;
        }else{
            var nodeObj = {
                id : identity ,
                name : traceObj.netBarName ,
                date : $.date.timeToStr(traceObj.startTime, "yyyy-MM-dd") ,
                tag : "netBar" ,
                address : placeObj.name
            };
            nodes.push(nodeObj);
            return nodes.length - 1;
        }
    }

    /**
     * 添加民航轨迹节点
     */
    function addPlaneNode(rowObj) {
        if(!$.util.exist(rowObj)){
            return null;
        }
        var isExist = false;
        var index = 0;
        var identity = rowObj.planeNumber + rowObj.startTime;
        $.each(nodes, function (n, node) {
            var id = node.id;
            if(id == identity){
                isExist = true;
                index = n;
                return false;
            }
        });
        if(isExist){
            return index;
        }else{
            var nodeObj = {
                id : identity ,
                name : rowObj.startTerminal + "-" + rowObj.arrivedTerminal ,
                date : $.date.timeToStr(rowObj.startTime, "yyyy-MM-dd") ,
                tag : "plane" ,
                number : rowObj.planeNumber
            };
            nodes.push(nodeObj);
            return nodes.length - 1;
        }
    }

    /**
     * 添加火车轨迹节点
     */
    function addTrainNode(rowObj) {
        if(!$.util.exist(rowObj)){
            return null;
        }
        var isExist = false;
        var index = 0;
        var identity = rowObj.trainNumber + rowObj.startTime;
        $.each(nodes, function (n, node) {
            var id = node.id;
            if(id == identity){
                isExist = true;
                index = n;
                return false;
            }
        });
        if(isExist){
            return index;
        }else{
            var nodeObj = {
                id : identity ,
                name : rowObj.startStation + "-" + rowObj.arrivedStation ,
                date : $.date.timeToStr(rowObj.startTime, "yyyy-MM-dd") ,
                tag : "train" ,
                number : rowObj.trainNumber
            };
            nodes.push(nodeObj);
            return nodes.length - 1;
        }
    }

    /**
     * 添加人员节点
     */
    function addPersonNode(rowObj) {
        if(!$.util.exist(rowObj)){
            return null;
        }
        var isExist = false;
        var index = 0;
        var identity = rowObj.identity;
        $.each(nodes, function (n, node) {
            var id = node.id;
            if(id == identity){
                isExist = true;
                index = n;
                return false;
            }
        });
        if(isExist){
            return index;
        }else{
            var nodeObj = {
                id : identity ,
                name : rowObj.personName ,
                identity : identity ,
                tag : getPersonSexByIdentity(identity)
            };
            nodes.push(nodeObj);
            return nodes.length - 1;
        }
    }

    /**
     * 根据身份证号判断性别
     *
     * @param identity 身份证号
     */
    function getPersonSexByIdentity(identity){
        var length = identity.length;
        var number = null;
        if(length == 15){
            number = parseInt(identity.substring(length - 1, length));
        }else if(length == 18){
            number = parseInt(identity.substring(length - 2, length - 1));
        }
        if(!$.util.isBlank(number) && (number % 2) == 0){
            return "woman";
        }else{
            return "man";
        }
    }

    /**
     * 初始化关系节点
     */
    function initNodeAndLink(){
        // 画布尺寸 关系线条距离
        var W = $(".svgBox").width();
        var H = 600;
        var dis = 200;

        var highlighted=null,dependsNode=[],dependsLinkAndText=[];

        // 缩放规则
        var zoom = d3.zoom()
            .scaleExtent([0.7,10])
            .on("zoom",zoomed);

        // 绘制画布 + 添加缩放功能
        var svg = d3.select(".svgBox")
            .append("svg")
            .attr("width", "100%")
            .attr("height", H)
            .call(zoom)
            .on("dblclick.zoom", null); // 阻止双击放大画布

        // 避免直接缩放svg画布，添加g标签作为大容器
        var g = svg.append('g').attr('class','all');

        // 定义力学仿真模型 + 配置作用力等参数
        force = d3.forceSimulation()
            .nodes(nodes)
            .force("link", d3.forceLink(links).distance(dis))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(W / 2, H / 2))
            .force("collide",d3.forceCollide(30).strength(2).iterations(2))
            .on("tick", tick);

        // 准备小箭头
        var arr = g.append("svg:defs").selectAll("marker")
            .data(["end"])
            .enter().append("svg:marker")
            .attr("id","arrow")
            .attr('class','arrow')
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 30)
            .attr("refY", 0)
            .attr("markerWidth", 9)
            .attr("markerHeight", 16)
            .attr("markerUnits","userSpaceOnUse")
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr('fill','#8bd2ff');

        // 绘制关系线
        var link = g.selectAll("line.link")
            .data(links)
            .enter().append("svg:line")
            .attr("class", "link")
            .attr('stroke-width',1)
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .attr("marker-end","url(#arrow)") // 给线的一端添加小箭头
            .attr('stroke','#8bd2ff');

        // 定义拖拽方法
        var dragstart=function(d, i) {
            force.stop();
            d3.event.sourceEvent.stopPropagation();
        };
        var dragmove=function(d, i) {
            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy;
            tick();
        };
        var dragend=function(d, i) {
            d3.event.subject.fx = null;
            d3.event.subject.fy = null;
            force.restart();
            tick();
        };
        var nodeDrag = d3.drag()
            .on("start", dragstart)
            .on("drag", dragmove)
            .on("end", dragend);

        // 关系线上的描述文字
        var linetext = g.selectAll('.linetext')
            .data(links)
            .enter()
            .append("text")
            .attr("class", "linetext")
            .attr("x",function(d){ return (d.source.x + d.target.x) / 2})
            .attr("y",function(d){ return (d.source.y + d.target.y) / 2})
            .attr("fill", "#ccc")
            // .attr("dx", "-0.4em")
            .html(function(d, i){
                return d.relation
            })
            .call(d3.drag());

        // 定义容器用来放节点图标和文字
        var node = g.selectAll("g.node")
            .data(nodes)
            .enter().append("svg:g")
            .attr("class", "node")
            .call(nodeDrag)
            .on('dblclick',function(d){
                // 双击某节点高亮显示与之有关联的节点
                // highlightObject(d);
                // d3.event.stopPropagation();
                var nodeType = d.tag ;
                if(nodeType == "man" || nodeType == "woman"){
                    $("#identityValue").val(d.id);
                    queryNodesAndLinks();
                }
            });

        // 点击空白处取消高亮显示节点
        d3.select("body").on('dblclick',function(){
            dependsNode=dependsLinkAndText=[];
            highlightObject(null);
        });

        // 图片
        var img =  node.append("svg:image")
            .data(nodes)
            .attr("class", "circle")
            .attr("x", "-20px")
            .attr("y", "-20px")
            .attr("width", "40px")
            .attr("height", "40px")
            .attr("xlink:href", function(d, i){
                switch (d.tag){
                    case "man":
                        return "../../../../images/d3/man.png";
                        break;
                    case "woman":
                        return "../../../../images/d3/woman.png";
                        break;
                    case "hotel":
                        return "../../../../images/d3/hotel.png";
                        break;
                    case "netBar":
                        return "../../../../images/d3/netBar.png";
                        break;
                    case "train":
                        return "../../../../images/d3/train.png";
                        break;
                    case "plane":
                        return "../../../../images/d3/plane.png";
                        break;
                }
            })
        // 文字
        var text = node.append("svg:text")
            .attr("class", "nodetext")
            .attr("dy", "35px")
            .attr('text-anchor','middle')
            .attr("fill", "#fff")
            .text(function(d) {
                return d.name
            });
        // 描述文字(入住宾馆和出行的日期)
        var textDtl = node.append("svg:text")
            .attr("class", "nodetextDtl")
            .attr("dy", "50px")
            .attr('text-anchor','middle')
            .attr("fill", "#fff")
            .text(function(d) {
                if(d.tag == "man" || d.tag == "woman"){
                    return d.identity
                }else{
                    return d.date
                }
            });
        // 描述文字(出行交通工具的车次或航班号)
        var textNum = node.append("svg:text")
            .attr("class", "nodetextDtl")
            .attr("dy", "65px")
            .attr('text-anchor','middle')
            .attr("fill", "#fff")
            .text(function(d) {
                if(d.tag == "train" || d.tag == "plane") {
                    return d.number
                }
            });

        // 缩放方法
        function zoomed() {
            g.attr("transform", d3.event.transform);
        };

        // 更新位置
        function tick() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x})
                .attr("y2", function(d) { return d.target.y;});
            linetext.attr("x",function(d){ return (d.source.x + d.target.x) / 2})
                .attr("y",function(d){ return (d.source.y + d.target.y) / 2})
                .html(function(d, i){
                    var txt = d.relation;
                    if(txt.indexOf('\n') > 0) {
                        var t = txt.split('\n'), str = '';
                        for(var i = 0; i < t.length; i++){
                            str += '<tspan class="linetspan" x="' + d3.select(this).attr("x") + '" dy="1em">' + t[i] + '</tspan>'
                        }
                        return str
                    }
                    return d.relation
                });
            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        };

        var tooltip=d3.select("body").append("div")
            .attr("class","tooltip")
            .attr("opacity",1.0);



        //  点击某节点高亮显示与之有关联关系的节点，可继续点击其他节点，高亮显示可累计
        function highlightObject(obj){
            if (obj) {
                var objIndex= obj.index;
                dependsNode=dependsNode.concat([objIndex]);
                dependsLinkAndText=dependsLinkAndText.concat([objIndex]);
                links.forEach(function(lkItem){
                    if(objIndex==lkItem['source']['index']){
                        dependsNode=dependsNode.concat([lkItem.target.index])
                    }else if(objIndex==lkItem['target']['index']){
                        dependsNode=dependsNode.concat([lkItem.source.index])
                    }
                });
                node.classed('inactive',function(d){
                    return (dependsNode.indexOf(d.index)==-1)
                });
                link.classed('inactive', function(d) {

                    return ((dependsLinkAndText.indexOf(d.source.index)==-1)&&(dependsLinkAndText.indexOf(d.target.index)==-1))
                });
            } else {
                node.classed('inactive', false);
                link.classed('inactive', false);
            }
        };
    }



    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.trackAnalyse, {

    });

})(jQuery);