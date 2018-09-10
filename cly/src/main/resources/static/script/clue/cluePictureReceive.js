
(function($){
    "use strict";
    var dataIdLst = {};
    $(document).ready(function() {
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_QTLX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#involveCrowdOne", successData, "id", "name", true, true);
            }
        });
        $.laydate.setTimeRange((new Date()).getTime() + 1000*60*60*24, (new Date()).getTime() + 1000*60*60*24*10, "#startTime", "yyyy-MM-dd");
        initData();
        events();
    });

    function events(){
        $(document).on("select2:select","#involveCrowdOne",function(){
            $.ajax({
                url:context +'/dictionary/findDictionaryItemsByParentId',
                type:'post',
                data:{parentId : $.select2.val("#involveCrowdOne")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#involveCrowdTwo", true);
                    $.select2.addByList("#involveCrowdTwo", successData, "id", "name", true, true);
                }
            });
        });
        $(document).on("select2:unselect","#involveCrowdOne",function(){
            $.select2.empty("#involveCrowdTwo", true);
        });
        $(document).on("click",".query",function(){
            initData();
        });
        $(document).on("click",".showClue",function(){
            var form = $.util.getHiddenForm(context + "/show/page/web/clue/clueQuery", {showIdList: dataIdLst[$(this).attr("id")]});
            form.submit();//TODO 改了 用 showClueLstLayer
        });
    }

    function initData(){
        $.ajax({
            url:context +'/clue/findClueInfoReceiveByStartTime',
            type:'post',
            data:{
                startTimeOne : $.laydate.getTime("#startTime", "start"),
                startTimeTwo : $.date.endRangeByTime($.laydate.getTime("#startTime", "end"),"yyyy-MM-dd"),
                involveCrowdOne : $.select2.val("#involveCrowdOne"),
                involveCrowdTwo : $.select2.val("#involveCrowdTwo")
            },
            dataType:'json',
            success:function(data){
                columnGraphInit(data.date, data.dateData);
                barGraphInit(data.crowd, data.crowdData);
                barCrowdInit(data.crowdName, data.crowdNum);
                bubbleTargetSiteInit(data.targetSiteName, data.targetSiteData);
            }
        });
        // $.ajax({
        //     url:context +'/clue/findClueAlertReceive',
        //     type:'post',
        //     data:{
        //         startTimeOne : $.laydate.getTime("#startTime", "start"),
        //         startTimeTwo : $.date.endRangeByTime($.laydate.getTime("#startTime", "end"),"yyyy-MM-dd")
        //     },
        //     dataType:'json',
        //     success:function(data){
        //         bubbleTargetSiteInit(data.targetSiteName, data.targetSiteData);
        //         bubbleCrowdInit(data.crowdName, data.crowdData);
        //     }
        // });
    }

    function columnGraphInit(str, data){
        $("#container1Title").text($.date.timeToStr($.laydate.getTime("#startTime", "start"), "yyyy-MM-dd") + "到" + $.date.timeToStr($.laydate.getTime("#startTime", "end"), "yyyy-MM-dd")+"线索指向情况");
        $('#highchart-container1').highcharts({
            chart: {
                type: 'column'
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
                        click: function(e) {

                            var data = {
                                startTime : parseInt(e.point.options.targetId, 10),
                                endTime : parseInt(e.point.options.targetId, 10) + 3600*24*1000,
                                crowdOne : $.select2.val("#involveCrowdOne"),
                                crowdTwo : $.select2.val("#involveCrowdTwo")
                            };
                            showWindow(data);
                        }
                    }
                }
            },
            series: [{
                name: "线索",
                data: data
            }]
        });
    }

    function barGraphInit(str, data){
        $("#container2Title").text($.date.timeToStr($.laydate.getTime("#startTime", "start"), "yyyy-MM-dd") + "到" + $.date.timeToStr($.laydate.getTime("#startTime", "end"), "yyyy-MM-dd")+"群体线索数量排名");
        $('#highchart-container2').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: ""
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
                        click: function(e) {
                            var data = {
                                crowdTwo : e.point.options.targetId,
                                startTime : $.laydate.getTime("#startTime", "start"),
                                endTime : $.date.endRangeByTime($.laydate.getTime("#startTime", "end"),"yyyy-MM-dd")
                            };
                            showWindow(data);
                        }
                    }
                }
            },
            series: [{
                name: "线索",
                color: '#ffb980',
                data: data
            }]
        });
    }

    function bubbleTargetSiteInit(str, data){
        $('#highchart-container3').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
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
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function(e) {
                            var data = {
                                targetSite : e.point.options.targetId,
                                startTime : parseInt(e.point.options.queryTime, 10),
                                endTime : parseInt(e.point.options.queryTime, 10) + 3600*24*1000
                            };
                            showWindow(data);
                        }
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
        $('#highchart-container4').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
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
                        click: function(e) {
                            var data = {
                                crowdOne : e.point.options.targetId,
                                startTime : parseInt(e.point.options.queryTime, 10),
                                endTime : parseInt(e.point.options.queryTime, 10) + 3600*24*1000
                            };
                            showWindow(data);
                        }
                    }
                }
            },
            series: data
        })
    }


    function barCrowdInit(str, data){
        $('#highchart-container4').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: ""
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
                        click: function(e) {
                            var crowd = e.point.options.targetId;
                            if(crowd == "qtlx00070007" || crowd == "qtlx00070011") {
                                var data = {
                                    crowdTwo : crowd,
                                    startTime : $.laydate.getTime("#startTime", "start"),
                                    endTime : $.date.endRangeByTime($.laydate.getTime("#startTime", "end"),"yyyy-MM-dd")
                                };
                                showWindow(data);
                            } else {
                                var data = {
                                    crowdOne : crowd,
                                    startTime : $.laydate.getTime("#startTime", "start"),
                                    endTime : $.date.endRangeByTime($.laydate.getTime("#startTime", "end"),"yyyy-MM-dd")
                                };
                                showWindow(data);
                            }
                        }
                    }
                }
            },
            series: [{
                name: "线索",
                color: '#ffb980',
                data: data
            }]
        });
    }

    function showWindow(tranData){
        //post
        //var form = $.util.getHiddenForm(context + "/show/page/web/clue/clueQuery",tranData);
        //$.util.subForm(form);

        //get
        var str = context + "/show/page/web/clue/clueReceive?";
        for(var i in tranData){
            str += i + "=" + ($.util.isBlank(tranData[i])?"":tranData[i]) + "&&";
        }
        window.location = str;

        // $.util.topWindow().$.layerAlert.dialog({
        //     content : context + "/show/page/web/clue/myClueLayer",
        //     pageLoading : true,
        //     title : '线索列表',
        //     width : "1300px",
        //     height : "600px",
        //     btn:["返回"],
        //     callBacks:{
        //         btn1:function(index, layero){
        //             $.util.topWindow().$.layerAlert.closeAll();
        //         },
        //     },
        //     success:function(layero, index){
        //
        //     },
        //     initData:{
        //         p$ : $,
        //         data : tranData,
        //         otherQuery : true
        //     },
        //     end:function(){
        //
        //     }
        // });
    }

    jQuery.extend($.common, {

    });
})(jQuery);