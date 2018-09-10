

(function($){
    "use strict";

    $(document).ready(function() {

        /** 当天信息初始化 **/
        $(function(){
            var dayDate = new Date();
            var lunarDate = lunar(dayDate);
            var w = moment(dayDate).format("dddd");
            var m = moment(dayDate).format("YYYY年MM月DD日");
            $(".alm_date").html(m + "&nbsp;&nbsp;&nbsp;&nbsp;" + w);
            // $(".today_date").html(dayDate.getDate());

            // $("#alm_cnD").html("农历"+ lunarDate.lMonth + "月" + lunarDate.lDate);
            // $("#alm_cnY").html(lunarDate.gzYear+"年&nbsp;"+lunarDate.gzMonth+"月&nbsp;"+lunarDate.gzDate+"日");
            // $("#alm_cnA").html("【"+lunarDate.animal+"年】");
            // var fes = lunarDate.festival();
            // if(fes.length>0){
            //     $(".alm_lunar_date").html($.trim(lunarDate.festival()[0].desc));
            //     $(".alm_lunar_date").show();
            // }else{
            //     $(".alm_lunar_date").hide();
            // }

        });

        $('#calendar').fullCalendar({
            header: {
                left: 'prevYear, nextYear',
                center: 'title',
                right: 'today prev, next'
            },
            buttonIcons: {
                prev: 'left-single-arrow',
                next: 'right-single-arrow',
                prevYear: 'left-double-arrow',
                nextYear: 'right-double-arrow'
            },
            buttonText: {
                today: '返回今日'
            },
            height: 610,
            firstDay: 0,
            editable: false,
            // eventLimit: true, // allow "more" link when too many events
            events: [
                // {
                //     title: '节日',
                //     start: '2017-12-01',
                //     duration: 2, // 表示持续天数
                //     detail: '今天是什么节日'  // 描述内容
                // },
                // {
                //     title: '线索',
                //     start: '2017-12-01',
                //     duration: 2, // 表示持续天数
                //     detail: '今天是什么节日',  // 描述内容
                //     moreInfo: [  // 所包含内容
                //         {
                //             title: "线索1",
                //             duration: 2,
                //             detail: "我就是第一个线索"
                //         },
                //         {
                //             title: "线索2",
                //             duration: 1,
                //             detail: "我就是第二个线索"
                //         }
                //     ]
                // },
                // {
                //     title: '历史历史历史',
                //     start: '2017-12-01',
                //     duration: 2, // 表示持续天数
                //     detail: '今天是什么节日',  // 描述内容
                //     moreInfo: [  // 所包含内容
                //         {
                //             title: "历史线索1",
                //             duration: 2,
                //             detail: "我就是第一个历史线索"
                //         },
                //         {
                //             title: "历史线索2",
                //             duration: 1,
                //             detail: "我就是第二个历史线索"
                //         }
                //     ]
                // }
            ],
            dayClick: function(dayDate, jsEvent, view, resourceObj){
                //  点击某天同步右侧日期
                var lunarDate = lunar(dayDate);
                var w = moment(dayDate).format("dddd");
                var m = moment(dayDate).format("YYYY年MM月DD日");
                $(".alm_date").html(m + "&nbsp;&nbsp;&nbsp;&nbsp;" + w);
                var startDateStrDay = $.date.timeToStr(moment(dayDate), "yyyy-MM-dd");
                $.laydate.setDate(startDateStrDay,"#totalTime");
                initCalendarData();
                // $(".today_date").html(dayDate.date());

                // $("#alm_cnD").html("农历"+ lunarDate.lMonth + "月" + lunarDate.lDate);
                // $("#alm_cnY").html(lunarDate.gzYear+"年&nbsp;"+lunarDate.gzMonth+"月&nbsp;"+lunarDate.gzDate+"日");
                // $("#alm_cnA").html("【"+lunarDate.animal+"年】");
                // var fes = lunarDate.festival();
                // if(fes.length>0){
                //     $(".alm_lunar_date").html($.trim(lunarDate.festival()[0].desc));
                //     $(".alm_lunar_date").show();
                // }else{
                //     $(".alm_lunar_date").hide();
                // }



                var events = $('#calendar').fullCalendar('clientEvents', function(event) {
                    var eventStart = event.start.format('YYYY-MM-DD');
                    var eventEnd = event.end ? event.end.format('YYYY-MM-DD') : null;
                    var theDate = dayDate.format('YYYY-MM-DD');
                    // Make sure the event starts on or before date and ends afterward
                    // Events that have no end date specified (null) end that day, so check if start = date
                    return (eventStart <= theDate && (eventEnd >= theDate) && !(eventStart < theDate && (eventEnd == theDate))) || (eventStart == theDate && (eventEnd === null));
                });

                console.log($(this))

                // events 就是当日所包含的所有数据
                console.log(events)

            }
        });

        //设置统计时间
        var nowDate = new Date();
        var startDateStrDay = $.date.timeToStr(nowDate.getTime()+(1000*60*60*24), "yyyy-MM-dd");
        $.laydate.setDate(startDateStrDay,"#totalTime");
        initData();
        initCalendarData();


    });

    /** 绑定事件到日期下拉框 **/
    $(function(){
        $("#fc-dateSelect").delegate("select","change",function(){
            var fcsYear = $("#fcs_date_year").val();
            var fcsMonth = $("#fcs_date_month").val();
            var m = '0' + (++fcsMonth);
            var month = m.slice(-2);
            var date = fcsYear + '-' + month;
            $("#calendar").fullCalendar('gotoDate', date);
        });
    });

    $(document).on("click",".newClue",function(){
        var clueId = $(this).attr("clueId");
        if(!$.util.isBlank(clueId)){
            window.location = context + '/show/page/web/clue/viewClue?clueId=' + clueId;
        }
    });

    $(document).on("click",".newReport",function(){
        window.location = context + '/show/page/web/report/registerList2.html';
    });

    $(document).on("click",".newFile",function(){
        window.location = context + '/show/page/web/clue/secretRegister.html';
    });

    // /**
    //  * 减一天
    //  */
    // $(document).on("click","#reduceDay",function(){
    //     var day = $.laydate.getTime("#totalTime", "date");
    //     var startDateStrDay = $.date.timeToStr(day-(1000*60*60*24), "yyyy-MM-dd");
    //     $.laydate.setDate(startDateStrDay,"#totalTime");
    //     initCalendarData();
    // });
    //
    // /**
    //  * 加一天
    //  */
    // $(document).on("click","#plusDay",function(){
    //     var day = $.laydate.getTime("#totalTime", "date");
    //     var startDateStrDay = $.date.timeToStr(day+(1000*60*60*24), "yyyy-MM-dd");
    //     $.laydate.setDate(startDateStrDay,"#totalTime");
    //     initCalendarData();
    // });

    /**
     * 点击日期选择框选择时间事件
     */
    $(document).on("change","#fixed_date",function(){
        if($.util.isEmpty($.laydate.getDate("#totalTime", "date"))){
            window.top.$.layerAlert.alert({msg:"请选择时间" ,icon:"5"});
            return;
        }
        initCalendarData();
    });

    /**
     * 线索详情点击事件
     */
    $(document).on("click",".clue" ,function(){
        location.href=context + "/show/page/web/clue/viewClue?clueId=" + this.id;
        // $("#clueId").val(this.id);
        // $("#clueInfo").attr("action",context + "/show/page/web/clue/viewClue");
        // $("#clueInfo").submit();
    });

    /**
     * 搜索
     */
    $(document).on("click","#search",function(){
        var fullText = $("#fullValue").val();
        if(fullText == "请输入任何您想查询的内容，无论是线索、人员、群体……"){
            return;
        }
        location.href=context + '/show/page/web/history/searchResult?fullText=' + fullText;
        // $("#clueInfo").attr("action",context + '/show/page/web/history/searchResult?fullText=' + fullText);
        // $("#clueInfo").submit();
    })

    /**
     * 初始化日历数据
     */
    function initCalendarData(){
        holiday();
        sameDayClue();
        sameDayHistorySituation();
    }

    /**
     * 获取查询条件
     * @returns {{}}
     */
    function queryData(){
        var obj = {
            startTimeLong : $.laydate.getTime("#totalTime", "date"),
            startTime :$.laydate.getDate("#totalTime", "date") + " 00:00:00",
            endTime :$.laydate.getDate("#totalTime", "date") + " 23:59:59"
        }
        var param = {};
        $.util.objToStrutsFormData(obj, "queryUtilPojo", param);
        return param;
    }

    /**
     * 初始化线索表
     */
    function initData() {
        //我的线索
        var obj = {};
        obj.start = 0;
        obj.length = 1000;
        var map = {};
        $.util.objToStrutsFormData(obj, "mcp", map);
        $.ajax({
            url: context + '/clueFlow/findMyNewClueForIndex',
            type: 'post',
            data: map,
            dataType: 'json',
            success: function (successData) {
                var data = {};
                data.list = successData;
                var html = template('attentionTP', data);
                document.getElementById('attention').innerHTML = html;
            }
        });
        //我的编报
        $.ajax({
            url: context + '/organizeReport/findMyReport',
            type: 'post',
            data: map,
            dataType: 'json',
            success: function (successData) {
                if(successData.show == false){
                    $(".reportBtn").hide();
                    return;
                }
                var source = successData.data;
                for(var i in source){
                    source[i].time = $.date.timeToStr(new Date(source[i].createTime), "yyyy-MM-dd HH:mm");
                    source[i].contentName = source[i].sourceUnit;
                    source[i].content = source[i].title;
                }
                var data = {};
                data.list = source;
                var html = template('attentionTP1', data);
                document.getElementById('attention1').innerHTML = html;
            }
        });
        //我的密件
        $.ajax({
            url: context + '/clue/findNewSecretsToMe',
            type: 'post',
            data: map,
            dataType: 'json',
            success: function (successData) {
                var source = successData.data;
                for(var i in source){
                    source[i].time = source[i].dataTime;
                    source[i].contentName = source[i].unit;
                    source[i].content = source[i].title;
                }
                var data = {};
                data.list = source;
                var html = template('attentionTP2', data);
                document.getElementById('attention2').innerHTML = html;
            }
        });
    }

    /**
     * 节日及主要活动情况
     */
    function holiday(){
        $.ajax({
            url: context + '/indexCalendarController/holiday',
            type: 'post',
            data: queryData(),
            dataType: 'json',
            success: function (successData) {
                var data = successData.calendarPojo;
                $("#holiday").empty();
                if(data.length == 0){
                    $("#holiday").append('<li class="list-group-item text-center">无</li>');
                }
                $.each(data,function(index,val){
                    var remark = $.util.isEmpty(val.remark) ? '' : val.remark;
                    var pointname = $.util.isEmpty(val.pointname) ? '' : val.pointname;
                    if(remark.length > 24){
                        var html = '<li class="list-group-item">' +
                            '<div class="fi-ceng-out"><h5>'+pointname+'</h5>' +
                            '<div class="fi-ceng" style="width: 100%;">' +
                            '<p style="padding: 0;width: 100%;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + remark + '</p>' +
                            '</div>' +
                            '</div>' +
                            '</li>';
                        $("#holiday").append(html);
                    }else{
                        var html = '<li class="list-group-item">' +
                            '<h5>'+pointname+'</h5>' +
                            '<p>' + remark + '</p>' +
                            '</li>';
                        $("#holiday").append(html);
                    }

                })
            }
        });
    }

    /**
     * 当日指向线索
     */
    function sameDayClue(){
        $.ajax({
            url: context + '/indexCalendarController/sameDayClue',
            type: 'post',
            data: queryData(),
            dataType: 'json',
            success: function (successData) {
                var data = successData.clue;
                $("#sameDayClue").empty();
                if(data.length == 0){
                    $("#sameDayClue").append('<li class="list-group-item text-center">无</li>');
                };
                $("#sameDayClueCount").text(data.length);
                $.each(data,function(index,val){
                    var content = $.util.isEmpty(val.content) ? '' : val.content;
                    if(content.length > 24){
                        var html = '<li class="list-group-item">' +
                            '<div class="fi-ceng-out"><a href="###" id="'+val.id+'" class="textSlice clue">' + content.substr(0,24) +'...</a>' +
                            '<div class="fi-ceng" style="width: 100%; left: 0;">' +
                            '<p style="padding: 0;width: 100%;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + content + '</p>' +
                            '</div>' +
                            '</div>' +
                            '</li>';
                        $("#sameDayClue").append(html);
                    }else{
                        var html = '<li class="list-group-item">' +
                            '<p>' + content + '</p>' +
                            '</li>';
                        $("#sameDayClue").append(html);
                    }

                })
            }
        });
    }

    /**
     * 当日历史情况
     */
    function sameDayHistorySituation(){
        $.ajax({
            url: context + '/indexCalendarController/sameDayHistorySituation',
            type: 'post',
            data: queryData(),
            dataType: 'json',
            success: function (successData) {
                var data = successData.calendarPojo;
                $("#sameDayHistorySituation").empty();
                if(data.length == 0){
                    $("#sameDayHistorySituation").append('<li class="list-group-item text-center">无</li>');
                };
                $("#sameDayHistorySituationCount").text(data.length);
                $.each(data,function(index,val){
                    var crowdName = $.util.isEmpty(val.crowdName) ? '' : val.crowdName;
                    var position = $.util.isEmpty(val.position) ? '' : val.position;
                    var count = $.util.isEmpty(val.count) ? 0 : val.count;
                    var html = '<li class="list-group-item">' +
                                    '<p class="textSlice">'+crowdName+'  '+position+'  '+count+'人</p>' +
                                '</li>';
                    $("#sameDayHistorySituation").append(html);
                })
            }
        });
    }



})(jQuery);