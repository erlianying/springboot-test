Highcharts.setOptions({
    chart: {
        backgroundColor: 'none'
    },
    title: {
        style: {
            color: '#fff',
            fontSize: '22px'
        }
    },
    colors: ['#00d9e1', '#e1b26f', '#f55971'],
    xAxis: {
        lineColor: '#447488',
        tickColor:　'#447488',
        labels: {
            style: {
                fontSize: '16px',
                fontFamily: 'Verdana, sans-serif',
                color: '#eee'
            }
        },
    },
    yAxis: {
        title: null,
        gridLineColor: '#03415a',
        labels: {
            style: {
                fontSize: '16px',
                fontFamily: 'Verdana, sans-serif',
                color: '#eee'
            }
        },
    },
    legend: {
        symbolPadding: 10,
        itemStyle: {  // 图例的文字样式
            color: '#eee',
            fontSize: '22px',
            fontWeight: 'normal'
        },
        itemHoverStyle: {
            color: '#eee',
            fontSize: '22px',
            fontWeight: 'normal'
        }
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        pie: {
            cursor: 'pointer',
            borderWidth: 0,
            showInLegend: true,
            colors: ['#0db1ff', '#e1b26f', '#f06c80'],
            dataLabels: {
                enabled: true,
                distance: -20,
                useHTML: true,
                style: {
                    fontSize: '25px',
                    color:  '#fff'
                }
            }
        },
        column: {
            borderWidth: 0,
            borderRadius: 2,
            colors: ['#0096eb']
        }
    }
});


(function($){
    "use strict";
    var arr = [];
    var arrKey = [88, 83, 83, 90];
    //var arrKey = [38,38,40,40,37,39,37,39,66,65,66,65];
    var queryData = null;

    $(document).ready(function() {
        for(var i = 0; i < arrKey.length; i++){
            arr.push(0);
        }
        $(document).keyup(function(e){
            arr.push(e.keyCode);
            arr.shift();
            var n = 0;
            for(var i = 0; i < arrKey.length; i++){
                if(arr[i] == arrKey[i]){
                    n++;
                }
            }
            if(n == arrKey.length){
                showLayer();
            }
        })
        $(document).on("click", ".configBtn", function(){
            showLayer();
        })
        query(queryData);
        setInterval(function(){
            query(queryData)
        },1000*60*15);
    });

    function showLayer(){
        window.top.$.layerAlert.dialog({
            content : context +  '/show/page/web/screen/normalStateLayer',
            pageLoading : true,
            title:"设置",
            width : "600px",
            height : "400px",
            shadeClose : false,
            initData:function(){
                return null;
            },
            success:function(layero, index){

            },
            end:function(){
            },
            btn:["查询", "跳转应急"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                    var obj = cm.getSelected();
                    queryData = obj;
                    query(queryData);
                    window.top.layer.close(index);
                },
                btn2:function(index, layero){
                    window.top.location = context + "/show/page/web/screen/emergentState.html";
                    window.top.layer.close(index);
                }
            }
        });


    }

    function columnGraphInit(str, data){
        $('#normalState1').highcharts({
            chart: {
                type: 'column',
                marginTop: 20
            },
            title: {
                text: null
            },
            xAxis: {
                categories: str,
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    enabled: false
                }
            },
            legend: {
                enabled:false
            },
            tooltip: {
                pointFormat: '{point.y:,.0f} 条'
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        // click: function(e) {
                        //
                        //     var data = {
                        //         startTime : parseInt(e.point.options.targetId, 10),
                        //         endTime : parseInt(e.point.options.targetId, 10) + 3600*24*1000
                        //     };
                        //     showWindow(data);
                        // }
                    }
                }
            },
            series: [{
                name: "线索",
                dataLabels: {
                    enabled: true,
                    useHTML: true,
                    style: {
                        color: '#fff'
                    }
                },
                data: data
            }]
        });
    }

    function bubbleTargetSiteInit(str, data){
        $('#normalState3').highcharts({
            chart: {
                // type: 'bubble',
                // zoomType: 'xy'
                type: 'column'
            },
            colors: ['#fb5667', '#FFC84D', '#41c2ff', '#2eff51'],
            title: {
                text: null
            },
            xAxis: {
                // labels:{enabled:false
                // },
                categories: str,
                title: {
                    enabled: false
                }
            },
            yAxis: {
                // labels:{enabled:false
                // },
                title: {
                    enabled: false
                }
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        // click: function(e) {
                        //     var data = {
                        //         targetSite : e.point.options.targetId,
                        //         startTime : parseInt(e.point.options.queryTime, 10),
                        //         endTime : parseInt(e.point.options.queryTime, 10) + 3600*24*1000
                        //     };
                        //     showWindow(data);
                        // }
                    }
                }
            },
            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2"><h4>地点：{point.name}</h4></th></tr>' +
                '<tr><th>指向开始时间:</th><td>{point.queryDate}</td></tr>'+
                '<tr><th>指向线索数量:</th><td>{point.z}条</td></tr>'+
                '<tr><th>关联人员数量:</th><td>{point.personNum}个</td></tr>'+
                '<tr><th>关联群组数量:</th><td>{point.groupNum}个</td></tr>',
                footerFormat: '</table>'
            },
            series: data
        })
    }

    function bubbleCrowdInit(str, data){
        $('#normalState2').highcharts({
            chart: {
                // type: 'bubble',
                // zoomType: 'xy'
                type: 'column'
            },
            colors: ['#fb5667', '#FFC84D', '#41c2ff', '#2eff51'],
            title: {
                text: null
            },
            xAxis: {
                // labels:{enabled:false
                // },
                categories: str,
                title: {
                    enabled: false
                }
            },
            yAxis: {
                // labels:{enabled:false
                // },
                title: {
                    enabled: false
                }
            },
            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2"><h4>群体：{point.name}</h4></th></tr>' +
                '<tr><th>指向开始时间:</th><td>{point.queryDate}</td></tr>'+
                '<tr><th>指向线索数量:</th><td>{point.z}条</td></tr>'+
                '<tr><th>关联人员数量:</th><td>{point.personNum}个</td></tr>'+
                '<tr><th>关联群组数量:</th><td>{point.groupNum}个</td></tr>',
                footerFormat: '</table>'
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        // click: function(e) {
                        //     var data = {
                        //         crowd : e.point.options.targetId,
                        //         startTime : parseInt(e.point.options.queryTime, 10),
                        //         endTime : parseInt(e.point.options.queryTime, 10) + 3600*24*1000
                        //     };
                        //     showWindow(data);
                        // }
                    }
                }
            },
            series: data
        })
    }

    function query(data){
        var today,start,end;
        if(data == null || data.startTime == null){
            today = new Date();

        }else{
            today = new Date(data.startTime);
        }
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        start = today.getTime() + 1000*60*60*24;
        end = today.getTime() + 1000*60*60*24*10;

        $.ajax({
            url:context +'/screen/findCountForNormalState',
            type:'post',
            data:{
                queryTime : today.getTime()
            },
            dataType:'json',
            success:function(successData){
                $(".queryDate").text(successData.queryDate);
                $(".clueCount").text(successData.clueCount);
                $(".name1").text(successData.name1);
                $(".count1").text(successData.count1);
                $(".name2").text(successData.name2);
                $(".count2").text(successData.count2);
                $(".count3").text(successData.count3);
                $(".count4").text(successData.count4);
                $(".count5").text(successData.count5);
                $(".count6").text(successData.count6);
            }
        });

        $.ajax({
            url:context +'/screen/findClueInfoByStartTime',
            type:'post',
            data:{
                startTimeOne : start,
                startTimeTwo : end
            },
            dataType:'json',
            success:function(successData){
                columnGraphInit(successData.date, successData.dateData);
            }
        });
        $.ajax({
            url:context +'/screen/findClueAlert',
            type:'post',
            data:{
                startTimeOne : start,
                startTimeTwo : end
            },
            dataType:'json',
            success:function(successData){
                bubbleTargetSiteInit(successData.targetSiteName , successData.targetSiteData);
                bubbleCrowdInit(successData.crowdName , successData.crowdData);
            }
        });

        //TODO 群体类型code involveCrowdOne
        //TODO 群体名称code involveCrowdTwo
    }
})(jQuery);