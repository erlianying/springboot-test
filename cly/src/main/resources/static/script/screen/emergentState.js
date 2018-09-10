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
            colors: ['#0db1ff', '#e1b26f', '#f06c80', '#00D9E1'],
            dataLabels: {
                enabled: true,
                distance: -10,
                useHTML: true,
                style: {
                    fontSize: '16px',
                    color:  '#fff'
                }
            }
        },
        column: {
            borderWidth: 0,
            borderRadius: 2,
            colors: ['#0096eb'],
            series:{
                dataLabels: {
                    enabled: true,
                    useHTML: true,
                    style: {
                        color: '#fff'
                    }
                }
            }
        }
    }
});


(function($){
    "use strict";

    var arr = [];
    var arrKey = [88, 83, 83, 90];
    //var arrKey = [38,38,40,40,37,39,37,39,66,65,66,65];
    var queryData = null;

    var dateFormatDay = "MM月dd日";
    //进京
    var commingAverage = 0;
    var commingColumnDataArray = [];
    var commingColumnDataFlag = false;
    var commingAverageResultFlag = false;
    //在京
    var stayingAverage = 0;
    var stayingColumnDataArray = [];
    var stayingColumnDataFlag = false;
    var stayingAverageResultFlag = false;

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
            content : context +  '/show/page/web/screen/emergentStateLayer',
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
            btn:["查询", "跳转常态"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                    var obj = cm.getSelected();
                    queryData = obj;
                    query(queryData);
                    window.top.layer.close(index);
                },
                btn2:function(index, layero){
                    window.top.location = context + "/show/page/web/screen/normalState.html";
                    window.top.layer.close(index);
                }
            }
        });
    }

    function bubbleTargetSiteInit(str, data){
        $('#emergentState1').highcharts({
            chart: {
                // type: 'bubble',
                // zoomType: 'xy',
                type: 'column',
                marginBottom: 100
            },
            colors: ['#fb5667', '#FFC84D', '#41c2ff', '#2eff51'],
            title: {
                text: null
            },
            legend: {
                y: 20
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

    function query(data){
        var today,involveCrowdOne,involveCrowdTwo;

        if(data == null || data.startTime == null){
            today = new Date();
        }else{
            today = new Date(data.startTime);
        }
        if(data == null || data.involveCrowdOne == null){
            $.ajax({
                url:context +'/screen/findDefaultCrowdTypeForEmergentState',
                type:'post',
                data:{
                    queryTime : today.getTime()
                },
                dataType:'json',
                success:function(successData){
                    involveCrowdOne = (successData.crowdType);
                    involveCrowdTwo = "";
                    queryDetail(today, involveCrowdOne, involveCrowdTwo)
                }
            });
        }else{
            involveCrowdOne = data.involveCrowdOne;
            involveCrowdTwo = data.involveCrowdTwo;
            queryDetail(today, involveCrowdOne, involveCrowdTwo)
        }

    }

    function queryDetail(today, involveCrowdOne, involveCrowdTwo){
        var start,end;
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        start = today.getTime() + 1000*60*60*24;
        end = today.getTime() + 1000*60*60*24*10;

        $.ajax({
            url:context +'/screen/findCountForEmergentState',
            type:'post',
            data:{
                queryTime : today.getTime(),
                involveCrowdOne: involveCrowdOne,
                involveCrowdTwo: involveCrowdTwo
            },
            dataType:'json',
            success:function(successData){
                $(".queryDate").text(successData.queryDate);
                $(".crowdName").text(successData.crowdName);
                $(".clueCount").text(successData.clueCount);
                $(".count1").text(successData.count1);
                $(".count2").text(successData.count2);
                $(".count3").text(successData.count3);
                $(".count4").text(successData.count4);
                $(".count5").text(successData.count5);
                $(".count6").text(successData.count6);
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
                bubbleTargetSiteInit(successData.targetSiteName, successData.targetSiteData);
            }
        });

        refreshCommingStayBeijingCharts(today, involveCrowdOne, involveCrowdTwo);
    }

    /**
     * 刷新进京在京轨迹图表
     *
     * @param dateTime 时间
     * @param crowdTypeCode 群体类型编码
     * @param crowdNameCode 群体名称编码
     */
    function refreshCommingStayBeijingCharts(dateTime, crowdTypeCode, crowdNameCode){
        var endTime = dateTime.getTime() + 1000*60*60*24;
        var startTime = endTime - 1000*60*60*24*10;

        var averageStartTime = startTime - 1000*60*60*24*10;
        var averageEndTime = startTime;

        findCommingBeijingTrack(startTime, endTime, crowdTypeCode, crowdNameCode);
        findCommingBeijingTrackPie(startTime, endTime, crowdTypeCode, crowdNameCode);
        findCommingBeijingTrackAverage(averageStartTime, averageEndTime, crowdTypeCode, crowdNameCode);

        findStayingBeijingTrack(startTime, endTime, crowdTypeCode, crowdNameCode);
        findStayingBeijingTrackPie(startTime, endTime, crowdTypeCode, crowdNameCode);
        findStayingBeijingTrackAverage(averageStartTime, averageEndTime, crowdTypeCode, crowdNameCode);
    }

    /**
     * 查询进京轨迹均值
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param crowdTypeCode 群体类型编码
     * @param crowdNameCode 群体名称编码
     */
    function findCommingBeijingTrackAverage(startTime, endTime, crowdTypeCode, crowdNameCode){
        commingAverageResultFlag = false;
        $.ajax({
            url:context +'/screen/countCommingBeijingAverageByDay',
            type:'post',
            data:{
                startTime : startTime ,
                endTime : endTime ,
                crowdTypeCode : crowdTypeCode ,
                crowdNameCode : crowdNameCode
            },
            dataType:'json',
            success:function(data){
                commingAverageResultFlag = true;
                commingAverage = data.average;
                if(commingAverageResultFlag && commingColumnDataFlag){
                    var data = formatColumnData(commingColumnDataArray, commingAverage,  dateFormatDay);
                    refreshColumnChart("#emergentState2", data);
                }
            }
        });
    }

    /**
     * 查询进京轨迹趋势
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param crowdTypeCode 群体类型编码
     * @param crowdNameCode 群体名称编码
     */
    function findCommingBeijingTrack(startTime, endTime, crowdTypeCode, crowdNameCode){
        commingColumnDataFlag = false;
        $.ajax({
            url:context +'/screen/countCommingBeijingTrackByDay',
            type:'post',
            data:{
                startTime : startTime ,
                endTime : endTime ,
                crowdTypeCode : crowdTypeCode ,
                crowdNameCode : crowdNameCode
            },
            dataType:'json',
            success:function(data){
                commingColumnDataFlag = true;
                commingColumnDataArray = data.ttcs;
                if(commingAverageResultFlag && commingColumnDataFlag){
                    var data = formatColumnData(commingColumnDataArray, commingAverage,  dateFormatDay);
                    refreshColumnChart("#emergentState2", data);
                }
            }
        });
    }

    /**
     * 查询进京轨迹类型饼图
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param crowdTypeCode 群体类型编码
     * @param crowdNameCode 群体名称编码
     */
    function findCommingBeijingTrackPie(startTime, endTime, crowdTypeCode, crowdNameCode){
        $.ajax({
            url:context +'/screen/countCommingBeijingTraceTypeByDay',
            type:'post',
            data:{
                startTime : startTime ,
                endTime : endTime ,
                crowdTypeCode : crowdTypeCode ,
                crowdNameCode : crowdNameCode
            },
            dataType:'json',
            success:function(data){
                var data = formatPieData(data.ttcs);
                refreshPieChart("#emergentState3", data);
            }
        });
    }

    /**
     * 查询在京轨迹均值
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param crowdTypeCode 群体类型编码
     * @param crowdNameCode 群体名称编码
     */
    function findStayingBeijingTrackAverage(startTime, endTime, crowdTypeCode, crowdNameCode){
        stayingAverageResultFlag = false;
        $.ajax({
            url:context +'/screen/countStayingBeijingAverageByDay',
            type:'post',
            data:{
                startTime : startTime ,
                endTime : endTime ,
                crowdTypeCode : crowdTypeCode ,
                crowdNameCode : crowdNameCode
            },
            dataType:'json',
            success:function(data){
                stayingAverageResultFlag = true;
                stayingAverage = data.average;
                if(stayingAverageResultFlag && stayingColumnDataFlag){
                    var data = formatColumnData(stayingColumnDataArray, stayingAverage,  dateFormatDay);
                    refreshColumnChart("#emergentState4", data);
                }
            }
        });
    }

    /**
     * 查询在京轨迹趋势
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param crowdTypeCode 群体类型编码
     * @param crowdNameCode 群体名称编码
     */
    function findStayingBeijingTrack(startTime, endTime, crowdTypeCode, crowdNameCode){
        stayingColumnDataFlag = false;
        $.ajax({
            url:context +'/screen/countStayingBeijingTrackByDay',
            type:'post',
            data:{
                startTime : startTime ,
                endTime : endTime ,
                crowdTypeCode : crowdTypeCode ,
                crowdNameCode : crowdNameCode
            },
            dataType:'json',
            success:function(data){
                stayingColumnDataFlag = true;
                stayingColumnDataArray = data.ttcs;
                if(stayingAverageResultFlag && stayingColumnDataFlag){
                    var data = formatColumnData(stayingColumnDataArray, stayingAverage,  dateFormatDay);
                    refreshColumnChart("#emergentState4", data);
                }
            }
        });
    }

    /**
     * 查询在京轨迹类型饼图
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param crowdTypeCode 群体类型编码
     * @param crowdNameCode 群体名称编码
     */
    function findStayingBeijingTrackPie(startTime, endTime, crowdTypeCode, crowdNameCode){
        $.ajax({
            url:context +'/screen/countStayingBeijingTraceTypeByDay',
            type:'post',
            data:{
                startTime : startTime ,
                endTime : endTime ,
                crowdTypeCode : crowdTypeCode ,
                crowdNameCode : crowdNameCode
            },
            dataType:'json',
            success:function(data){
                var data = formatPieData(data.ttcs);
                refreshPieChart("#emergentState5", data);
            }
        });
    }

    /**
     * 格式化饼图用的数据
     *
     * @param data 查询出来的原始数据
     * @returns
     */
    function formatPieData(data) {
        var pieArray = [];
        if($.util.exist(data) && data.length > 0){
            $.each(data, function (i,val) {
                var array = [];
                array.push(val.traceTypeName);
                array.push(val.traceTypeCount);
                pieArray.push(array);
            });
        }
        return pieArray;
    }

    /**
     * 格式化折线图、柱状图用的数据
     *
     * @param data 查询出来的原始数据
     * @param averageLine 均线值
     * @param dateFormat 格式化时间格式
     * @returns {{titleArray: Array, dataArray: Array}}
     */
    function formatColumnData(data, averageLine, dateFormat) {
        var titleArray = [];
        var dataArray = [];
        var averageNumber = 0;
        //拼装数据
        if($.util.exist(data) && data.length > 0){
            $.each(data, function (i,val) {
                titleArray.push($.date.timeToStr(val.time, dateFormat));
                var count = val.count;
                //没有平均线
                if($.util.isBlank(averageLine) || averageLine == 0){
                    dataArray.push({y : count});
                    return true;
                }
                //根据平均线设置需要展示的颜色
                var surpass = (count - averageLine) / averageLine;
                if(surpass <= 0.2){
                    dataArray.push({y : count});
                }else if(surpass > 0.2 && surpass <= 0.5){
                    dataArray.push({y : count, color : '#eada0f'});
                }else{
                    dataArray.push({y : count, color : '#ff0000'});
                }
                averageNumber = averageLine;
            });
        }
        return {
            titleArray : titleArray ,
            dataArray : dataArray ,
            averageNumber : averageNumber
        }
    }

    /**
     * 刷新柱状图
     *
     * @param highchartsId 图表容器id
     * @param data 数据
     */
    function refreshColumnChart(highchartsId, data) {
        var plotLines = []
        if(data.averageNumber > 0){
            plotLines = [{
                color: '#e28e10',
                // dashStyle: 'shortDash',
                width: 2,
                value: data.averageNumber,
                zIndex: 50 ,
                label: {
                    text : data.averageNumber == 0 ? "" : "均线值：" + data.averageNumber ,
                    style: {color: '#FFF'}
                }
            }];
        }
        $(highchartsId).highcharts({
            chart: {
                type: 'column',
                marginBottom: 110  // 留出位置放图例
            },
            title: {
                text: null
            },
            xAxis: {
                categories: data.titleArray,
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: null
                },
                plotLines: plotLines
            },
            legend: {
                enabled: false
            },
            tooltip: {
                // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
            },
            series: [{
                name: '轨迹单日总和',
                borderWidth: 0,
                borderRadius: 2,
                // color: '#ffb980',
                dataLabels: {
                    enabled: true,
                    useHTML: true,
                    style: {
                        color: '#fff'
                    }
                },
                data: data.dataArray
            }]
        });

    }

    /**
     * 刷新饼图
     *
     * @param highchartsId 图表容器id
     * @param data 数据
     */
    function refreshPieChart(highchartsId, data) {
        $(highchartsId).highcharts({
            chart: {
                type: 'pie',
                marginTop: 20
            },
            title: {
                text: null
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y} <br /> <span style="font-size: 12px;">(条)</span>',
                        distance: 3,
                        useHTML: true,
                        style: {
                            fontSize: '14px',
                            color:  '#fff'
                        }
                    },
                    showInLegend: true
                }
            },
            legend: {
                align: 'center',
                layout: 'vertical',
                y: -20
            },
            series: [{
                name: null,
                size: '60%',
                innerSize: '40%',
                center: [100, 100],
                data: data
            }]
        });

    }
})(jQuery);