
var nodes =   [
    { "name": "张三", "id": 110000199908221122, "tag": "man"},
    { "name": "李四", "id": 110000199908221122, "tag": "man"},
    { "name": "王五", "id": 110000199908221122, "tag": "man"},
    { "name": "赵六", "id": 110000199908221122, "tag": "man"},
    { "name": "毛毛", "id": 110000199908221122, "tag": "woman"},
    { "name": "飞飞", "id": 110000199908221122, "tag": "woman"},
    { "name": "北京饭店", "date": "2017-10-20", "tag": "hotel"},
    { "name": "首都饭店", "date": "2017-10-20", "tag": "hotel"},
    { "name": "菲律宾-广州白云", "date": "2017-10-23", "tag": "plane", "number": '308738'}
];
var links = [
    { "source": 0 , "target": 6 , "relation":"同入住" },
    { "source": 0 , "target": 8 , "relation":"同乘" },
    { "source": 1 , "target": 6 , "relation":"同入住" },
    { "source": 1 , "target": 8 , "relation":"同乘" },
    { "source": 2 , "target": 6 , "relation":"同入住" },
    { "source": 2 , "target": 8 , "relation":"同乘" },
    { "source": 3 , "target": 7 , "relation":"同房入住" },
    { "source": 3 , "target": 8 , "relation":"同乘" },
    { "source": 5 , "target": 7 , "relation":"同房入住" },
    { "source": 5 , "target": 8 , "relation":"同乘" },
    { "source": 4 , "target": 7 , "relation":"同入住" },
    { "source": 4 , "target": 8 , "relation":"同乘" },
];

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
    var force = d3.forceSimulation()
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
            highlightObject(d);
            d3.event.stopPropagation();
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
            return d.date
        });
    // 描述文字(出行交通工具的车次或航班号)
    var textNum = node.append("svg:text")
        .attr("class", "nodetextDtl")
        .attr("dy", "65px")
        .attr('text-anchor','middle')
        .attr("fill", "#fff")
        .text(function(d) {
            if(d.tag == "plane") {
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
                        console.log(txt)
                        var t = txt.split('\n'), str = '';
                        console.log(t)
                        for(var i = 0; i < t.length; i++){
                            str += '<tspan class="linetspan" x="' + d3.select(this).attr("x") + '" dy="1em">' + t[i] + '</tspan>'
                        }
                       return str
                    }
                    return d.relation
            });
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    };

    // 鼠标移入节点上显示的详细文本
    function highlightToolTip(obj){
        if(obj){
            tooltip.html('<div class="tooltip_list">' +
                '<p>姓名:</p><p>' + obj.name + '</p>' +
                '</div><div class="tooltip_list">' +
                '<p>身份证号:</p><p>' + obj.id + '</p>' +
                '</div><div class="tooltip_list">' +
                '<p>手机号:</p><p>' + obj.num + '</p>' +
                '</div><div class="tooltip_list">' +
                '<p>所属群体:</p>' +
                '<p>' + obj.crowd + '</p>' +
                '</div>')
                .style("left",(d3.event.pageX+20)+"px")
                .style("top", (d3.event.pageY-20)+"px")
                .style("opacity",1.0);
        }else{
            tooltip.style("opacity",0.0);
        }
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


