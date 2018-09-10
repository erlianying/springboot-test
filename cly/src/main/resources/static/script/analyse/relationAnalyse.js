$.relationAnalyse = $.relationAnalyse ||{};

(function ($) {

    "use strict";

    var dependsNode = null;
    var dependsLinkAndText = null;

    var nodes = [];
    var links = [];

    var neo4jInitInfo ;

    $(document).ready(function () {

        initPageDict();
        setDefaultQueryDate();
        initRootInfo();
        initNodeAndLink();

        /**
         * 群体类型选择事件
         */
        $(document).on("select2:select","#type",function () {
            var typeId = $.select2.val("#type");
            $.select2.empty("#name");
            findCrowdNameByTypeId(typeId);
        });

        /**
         * 重置
         */
        $(document).on("click","#reset",function () {
            $.select2.clear("#type");
            $.select2.clear("#name");
            $.select2.empty("#name");
            $("#comparePerson_1").iCheck("check");
            setDefaultQueryDate();
        });

        /**
         * 分析按钮
         */
        $(document).on("click", "#analyseBut", function(){
            queryNodesAndLinks();
        });

        /**
         * 关系条件选中事件
         */
        $(document).on("ifChecked", "input[name='relationCheckbox']", function () {
            // var valueInput = $(this).parent().parent().parent().find("input")[1];
            // $(valueInput).attr("dataType","n1-2");
            // queryNodesAndLinks();
        });

        /**
         * 关系条件取消选中事件
         */
        $(document).on("ifUnchecked", "input[name='relationCheckbox']", function () {
            // var valueInput = $(this).parent().parent().parent().find("input")[1];
            // $(valueInput).attr("dataType","*");
            // queryNodesAndLinks();
        });

        /**
         * 关系条件次数修改事件
         */
        $(document).on("change", ".w-xxs", function () {
            // queryNodesAndLinks();
        });
    });

    /**
     * 设置默认查询时间
     */
    function setDefaultQueryDate(){
        var nowDate = new Date();
        var startDateLong = nowDate.getTime() - 1000*60*60*24*30;
        var startDateStr = $.date.timeToStr(startDateLong, "yyyy-MM-dd");
        var endDateStr = $.date.dateToStr(nowDate, "yyyy-MM-dd");
        $.laydate.setRange(startDateStr, endDateStr, "#dateRange");
    }

    /**
     * 初始化页面默认字典项
     *
     * @returns
     */
    function initPageDict(){
        $.ajax({
            url:context +'/crowdBasicDataManage/initCrowdType',
            data:{},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                //设置群体类型
                var types = successData.types;
                $.select2.addByList("#type", types,"id","name",true,true);
            }
        });
    }

    /**
     * 根据群体类型查询群体名称
     *
     * @param typeId 类型id
     * @returns
     */
    function findCrowdNameByTypeId(typeId){
        $.ajax({
            url:context +'/crowdManage/findCrowdNameByTypeId',
            data:{typeId : typeId},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                var names = successData.names;
                $.select2.addByList("#name", names,"id","name",true,false);
            }
        });
    }

    /**
     * 弹出关系详细信息页面
     *
     * @param data 关系详情数据
     */
    function alertRelationDetailsPage(data){
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/analyse/relationDetails',
            pageLoading : true,
            title : "关系详细信息",
            width : "80%",
            height : "80%",
            btn:["关闭"],
            callBacks:{
                btn1:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
                relationData : data
            },
            end:function(){

            }
        });
    }

    /**
     * 验证查询条件
     */
    function verifyQueryCondition(){
        var demo = $.validform.getValidFormObjById("relationValidform") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }

        var type = $.select2.val("#type");
        if($.util.isBlank(type)){
            $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类别。",time:3000}) ;
            return false;
        }

        var startTimeLong = $.laydate.getTime("#dateRange", "start");
        var endTimeLong = $.laydate.getTime("#dateRange", "end");
        if($.util.isBlank(startTimeLong)){
            $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请设置分析开始时间。",time:3000}) ;
            return false;
        }
        if($.util.isBlank(endTimeLong)){
            $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请设置分析结束时间。",time:3000}) ;
            return false;
        }
        return true;
    }

    /**
     * 初始化Neo4j查询用参数
     */
    function initRootInfo(){
        $.ajax({
            url:context + '/dataAnalyse/getInitInfo',
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

        var crowdTypeCode = $.select2.val("#type");
        var crowdNameCode = $.select2.val("#name");

        //群体条件
        var crowdCondition = "";
        if($.util.isBlank(crowdNameCode)){
            crowdCondition = "{codeOfCrowdType:'" + crowdTypeCode + "'}";
        }else{
            crowdCondition = "{codeOfCrowdName:'" + crowdNameCode + "'}";
        }
        var arr = $.icheck.getChecked("comparePerson");
        var personCondition = $(arr[0]).val();

        //重点人
        var personPositionCondition = "";
        if(personCondition == "backbone" || personCondition == "backbonePart"){
            personPositionCondition = "{personPosition:1}"
        }
        //排除常暂口
        var livingStatusCondition = "";
        if(personCondition == "allPart" || personCondition == "backbonePart"){
            livingStatusCondition = "where ha.livingStatus <> 1 and hb.livingStatus <> 2";
        }
        //时间条件
        var startTime = $.laydate.getTime("#dateRange", "start");
        var endTime = $.laydate.getTime("#dateRange", "end");

        var requestBody = {};

        var sqlObjArr = [];
        //基础的相同的sql语句
        var baseSql =
            "match(ha:HrskPerson)-[jca:JOIN_CROWD" + personPositionCondition + "]-(ca:Crowd" + crowdCondition + ")," +
            "(hb:HrskPerson)-[jcb:JOIN_CROWD" + personPositionCondition + "]-(cb:Crowd" + crowdCondition + ") " + livingStatusCondition + " with ha, hb ";

        //火车同行
        if($("#trainRelation").prop("checked")){
            var sqlObj = {};
            sqlObj["statement"] = 
                "match(ca:Crowd" + crowdCondition + ")-[jca:JOIN_CROWD" + personPositionCondition + "]-(h1:HrskPerson)-[tr1:TRACK]-(t1:Train)," +
                "(cb:Crowd" + crowdCondition + ")-[jcb:JOIN_CROWD" + personPositionCondition + "]-(h2:HrskPerson)-[tr2:TRACK]-(t2:Train) " +
                "where t1.startTime > {startTime} and t1.startTime < {endTime} and t2.startTime > {startTime} and t2.startTime < {endTime} and t1.startTime = t2.startTime and t1.trainNumber = t2.trainNumber " +
                "with h1, h2, collect(DISTINCT t1) as colt1, collect(DISTINCT t2) as colt2 where length(colt1) > {countNum} " +
                "return '" + $.common.relationshipAnalysis.TRAIN_TRACK + "', h1, h2, length(colt1), colt1, colt2";
            sqlObj["parameters"] = {
                startTime : startTime,
                endTime : endTime,
                countNum : parseInt($("#trainCount").val())
            };
            sqlObjArr.push(sqlObj);
        }
        //飞机同行
        if($("#planeRelation").prop("checked")){
            var sqlObj = {};
            sqlObj["statement"] = 
                "match(ca:Crowd" + crowdCondition + ")-[jca:JOIN_CROWD" + personPositionCondition + "]-(h1:HrskPerson)-[tr1:TRACK]-(p1:Plane)," +
                "(cb:Crowd" + crowdCondition + ")-[jcb:JOIN_CROWD" + personPositionCondition + "]-(h2:HrskPerson)-[tr2:TRACK]-(p2:Plane) " +
                "where p1.startTime > {startTime} and p1.startTime < {endTime} and p2.startTime > {startTime} and p2.startTime < {endTime} and p1.startTime = p2.startTime and p1.planeNumber = p2.planeNumber " +
                "with h1, h2, collect(DISTINCT p1) as colt1, collect(DISTINCT p2) as colt2 where length(colt1) > {countNum} " +
                "return '" + $.common.relationshipAnalysis.PLANE_TRACK + "', h1, h2, length(colt1), colt1, colt2";
            sqlObj["parameters"] = {
                startTime : startTime,
                endTime : endTime,
                countNum : parseInt($("#planeCount").val())
            };
            sqlObjArr.push(sqlObj);
        }
        //网吧同上网
        if($("#netBarRelation").prop("checked")){
            var sqlObj = {};
            sqlObj["statement"] = 
                "match(ca:Crowd" + crowdCondition + ")-[jca:JOIN_CROWD" + personPositionCondition + "]-(h1:HrskPerson)-[tr1:TRACK]-(nb1:NetBar)-[htp1:HEAD_TO_PLACE]-(p:Place)-[htp2:HEAD_TO_PLACE]-(nb2:NetBar)-[tr2:TRACK]-(h2:HrskPerson)-[jcb:JOIN_CROWD" + personPositionCondition + "]-(cb:Crowd" + crowdCondition + ") " +
                "where nb1.startTime > {startTime} and nb1.startTime < {endTime} and nb2.startTime > {startTime} and nb2.startTime < {endTime} and nb1.startTime = nb2.startTime and h1 <> h2 " +
                "with h1, h2, collect(DISTINCT p) as col, collect(DISTINCT nb1) as colt1, collect(DISTINCT nb2) as colt2 where length(colt1) > {countNum} " +
                "return '" + $.common.relationshipAnalysis.NET_BAR_TRACK + "', h1, h2, length(colt1), colt1, colt2";
            sqlObj["parameters"] = {
                startTime : startTime,
                endTime : endTime,
                countNum : parseInt($("#netBarCount").val())
            };
            sqlObjArr.push(sqlObj);
        }
        //旅店同住
        if($("#hotelRelation").prop("checked")){
            var sqlObj = {};
            sqlObj["statement"] = 
                "match(ca:Crowd" + crowdCondition + ")-[jca:JOIN_CROWD" + personPositionCondition + "]-(h1:HrskPerson)-[tr1:TRACK]-(ho1:Hotel)-[htp1:HEAD_TO_PLACE]-(p:Place)-[htp2:HEAD_TO_PLACE]-(ho2:Hotel)-[tr2:TRACK]-(h2:HrskPerson)-[jcb:JOIN_CROWD" + personPositionCondition + "]-(cb:Crowd" + crowdCondition + ") " +
                "where ho1.startTime > {startTime} and ho1.startTime < {endTime} and ho2.startTime > {startTime} and ho2.startTime < {endTime} and ho1.startTime = ho2.startTime and h1 <> h2 " +
                "with h1, h2, collect(DISTINCT p) as col, collect(DISTINCT ho1) as colt1, collect(DISTINCT ho2) as colt2 where length(colt1) > {countNum} " +
                "return '" + $.common.relationshipAnalysis.HOTEL_TRACK + "', h1, h2, length(colt1), colt1, colt2";
            sqlObj["parameters"] = {
                startTime : startTime,
                endTime : endTime,
                countNum : parseInt($("#hotelCount").val())
            };
            sqlObjArr.push(sqlObj);
        }
        //同线索关系
        if($("#clueRelation").prop("checked")){
            var sqlObj = {};
            sqlObj["statement"] = baseSql +
                "match(h1:HrskPerson{identity:ha.identity})-[rtp1:RELATE_TO_PERSON]-(c:Clue)-[rtp2:RELATE_TO_PERSON]-(h2:HrskPerson{identity:hb.identity}) " +
                "with h1 ,h2, collect(DISTINCT c) as col where length(col) > {countNum} " +
                "return '" + $.common.relationshipAnalysis.CLUE_TRACK + "', h1, h2, length(col), col";
            sqlObj["parameters"] = {
                countNum : parseInt($("#clueCount").val())
            };
            sqlObjArr.push(sqlObj);
        }
        //同群体关系
        if($("#crowdRelation").prop("checked")){
            var sqlObj = {};
            sqlObj["statement"] = baseSql +
                "match(h1:HrskPerson{identity:ha.identity})-[jc1:JOIN_CROWD" + personPositionCondition + "]-(c:Crowd)-[jc2:JOIN_CROWD" + personPositionCondition + "]-(h2:HrskPerson{identity:hb.identity}) " +
                "with h1, h2, collect(DISTINCT c) as col where length(col) > {countNum} " +
                "return '" + $.common.relationshipAnalysis.JOIN_CROWD + "', h1, h2, length(col), col";
            sqlObj["parameters"] = {
                countNum : parseInt($("#crowdCount").val())
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
        //暴力更新--删除所有，重新生成
        d3.select('.svgBox')
            .selectAll('*')
            .remove();
        //删除弹出信息模版
        $("body .chart-tooltip").remove();
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
            url:context + '/dataAnalyse/query',
            data:JSON.stringify(req),
            type:"post",
            contentType:"application/json;charset=utf-8",
            dataType:"json",
            success:function(successData){
                $.util.topWindow().$.common.showOrHideLoading(false);
                console.log(successData) ;
                nodes = successData.nodeList;
                links = successData.linkList;
                initNodeAndLink();
            }
        })
    }

    /**
     * 初始化关系节点
     */
    function initNodeAndLink(){
        // 画布尺寸 关系线条距离
        var W = $(".svgBox").width();
        var H = 600;
        var dis = 200;

        // 缩放规则
        var zoom = d3.zoom()
            .scaleExtent([0.5,10])
            .on("zoom",zoomed);

        // 绘制画布 + 添加缩放功能
        var svg = d3.select(".svgBox")
            .append("svg")
            .attr("width", "100%")
            .attr("height", H)
            .call(zoom)
            .on("dblclick.zoom", null);

        // 避免直接缩放svg画布，添加g标签作为大容器
        var g = svg.append('g').attr('class','all');

        // 定义力学仿真模型 + 配置作用力等参数
        var force = d3.forceSimulation()
            .nodes(nodes)
            .force("link", d3.forceLink(links).distance(dis))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(W / 2, H / 2))
            .force("collide",d3.forceCollide(50).strength(8).iterations(5))
            .on("tick", tick);

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
            //.attr("marker-end","url(#arrow)")
            .attr('stroke','#8bd2ff')
            .on('dblclick',function(d){
                console.log(d);
                alertRelationDetailsPage(d);
            });

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
            .attr("dx", "-40px")
            .html(function(d, i){
                var txt = d.relation; // 若relation有多个，添加tspan标签，并设置其x、dy属性，实现换行
                if(txt.indexOf('\n') > 0) {
                    var t = txt.split('\n'), str = '';
                    for(var i = 0; i < t.length; i++){
                        str += '<tspan class="linetspan" x="' + d3.select(this).attr("x") + '" dy="1em">' + t[i] + '</tspan>'
                    }
                    return str
                }
                return d.relation
            })
            .call(d3.drag())
            .on('dblclick',function(d){
                console.log(d);
                alertRelationDetailsPage(d);
            });

        // 定义容器用来放节点图标和文字
        var node = g.selectAll("g.node")
            .data(nodes)
            .enter().append("svg:g")
            .attr("class", "node")
            .call(nodeDrag)
            .on("mouseover",function(d,i){
                highlightToolTip(d)
            })
            .on("mouseout",function(d,i){
                highlightToolTip(null)
            })
            .on('dblclick',function(d){
                // 双击某节点高亮显示与之有关联的节点
                highlightObject(d);
                d3.event.stopPropagation();
            });

        // 点击空白处取消高亮显示节点
        d3.select("body").on('dblclick',function(){
            dependsNode=dependsLinkAndText=[];
            highlightObject(null);
        });

        // 圆圈
        var circle =  node.append("svg:circle")
            .data(nodes)
            .attr("class", "circle")
            .attr("cx", "0px")
            .attr("cy", "0px")
            .attr("r", "25px")
            .attr("fill", "#50cafc");
        // 文字
        var text = node.append("svg:text")
            .attr("class", "nodetext")
            .attr("dy", "5px")
            .attr('text-anchor','middle')
            .attr("fill", "#fff")
            .text(function(d) {
                return d.personName
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
                        // console.log(txt)
                        var t = txt.split('\n'), str = '';
                        // console.log(t)
                        for(var i = 0; i < t.length; i++){
                            str += '<tspan class="linetspan" x="' + d3.select(this).attr("x") + '" dy="1em">' + t[i] + '</tspan>'
                        }
                        return str
                    }
                    return d.relation
                });
            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
            // linetspan.attr("x",function(d){ console.log(d)})
        };

        // 鼠标移入节点上显示的详细文本
        function highlightToolTip(obj){
            if(obj){
                tooltip.html('<div class="tooltip_list clearfix">' +
                    '<p>姓名:</p><p>' + obj.personName + '</p>' +
                    '</div><div class="tooltip_list clearfix">' +
                    '<p>身份证号:</p><p>' + obj.identity + '</p>' +
                    '</div><div class="tooltip_list clearfix">' +
                    '<p>手机号:</p><p>' + obj.phone + '</p>' +
                    '</div><div class="tooltip_list clearfix">' +
                    '<p>所属群体:</p>' +
                    '<p>' + obj.crowdName + '</p>' +
                    '</div>')
                    .style("left",(d3.event.pageX+20)+"px")
                    .style("top", (d3.event.pageY-20)+"px")
                    .style("opacity",1.0);
            }else{
                tooltip.style("opacity",0.0);
                tooltip.html("");
            }
        };
        var tooltip=d3.select("body").append("div")
            .attr("class","chart-tooltip");


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
    jQuery.extend($.relationAnalyse, {

    });

})(jQuery);