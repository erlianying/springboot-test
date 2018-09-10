$.activityTrackExport = $.activityTrackExport ||{};

(function ($) {

    "use strict";
    var win = $.util.rootWindow();
    var paramJsonObj = win.$.rowData ;

    $(document).ready(function () {

        findCrowdByTypeAndName();
        initTables();

        /**
         * 导出Excel
         */
        $(document).on("click","#exportExcel",function () {
            var arr = $.select2.val("#exportTrackType");
            var trackTypes = [];
            if($.util.exist(arr) && arr.length > 0){
                $.each(arr, function (i,val) {
                    trackTypes.push(val);
                });
            }else{
                $("#exportTrackType option").each(function(i,val){
                    trackTypes.push($(val).val());
                });
            }
            var param = {
                crowdNameCode : paramJsonObj.name ,
                includeResidentAndTemporary : paramJsonObj.includeResidentAndTemporary ,
                vip : paramJsonObj.vip ,
                startTimeLong : paramJsonObj.startTimeLong ,
                endTimeLong : paramJsonObj.endTimeLong ,
                crowdName : $("#crowdName").text() ,
                trackTypes : trackTypes
            };
            var obj = {};
            $.util.objToStrutsFormData(param, "param", obj);
            var form = $.util.getHiddenForm(context+'/activityCompare/exportExcelTrack', obj);
            $.util.subForm(form);
        });
    });

    /**
     * 初始化所有轨迹表
     */
    function initTables() {
        if(paramJsonObj.exportType == "commingBeijingTrack"){
            $("option[name='staying']").remove();
            $("option[name='onlineStaying']").remove();

            $("#stayingBeijingDiv").hide();
            $("#commingBeijingDiv").show();
            //初始化进京轨迹
            initTrainTable();
            initAirlineTable();
            initBusTable();
            initBjPassTable();

            findCommingTrackCount();
        }else if(paramJsonObj.exportType == "stayingBeijingTrack"){
            $("option[name='comming']").remove();

            $("#commingBeijingDiv").hide();
            $("#stayingBeijingDiv").show();
            //初始化在京轨迹
            initHotelTable();
            initCheckTable();
            initNetbarTable();

            if(paramJsonObj.type == $.common.dict.QTLX_SJ){
                //初始化网络轨迹
                initFoodTable();
                initBookcarTable();
                initHouseTable();
                initBikeTable();
                initShoppingTable();
            }else{
                $("option[name='onlineStaying']").remove();
            }

            findStayingTrackCount();
        }
    }

    /**
     * 获取查询参数
     *
     * @param 已有查询参数对象
     */
    function getQueryParam(d) {
        var param = {
            crowdNameCode : paramJsonObj.name ,
            length : d.length ,
            start : d.start ,
            includeResidentAndTemporary : paramJsonObj.includeResidentAndTemporary ,
            vip : paramJsonObj.vip ,
            startTimeLong : paramJsonObj.startTimeLong ,
            endTimeLong : paramJsonObj.endTimeLong
        };
        $.util.objToStrutsFormData(param, "param", d);
        return d;
    }

    /**
     * 根据群体类型和名称查询群体详情，并展示
     */
    function findCrowdByTypeAndName() {
        var obj = {
            type : paramJsonObj.type ,
            name : paramJsonObj.name
        }
        $.ajax({
            url:context +'/activityCompare/findCrowdByTypeAndName',
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                var crowd = successData.crowd;
                $("#crowdTitle").text(crowd.crowdName + "活动轨迹导出");
                $("#crowdType").text(crowd.crowdType);
                $("#crowdName").text(crowd.crowdName);
                $("#situation").text(crowd.situation);
                var exportTimeStr = $.date.timeToStr(paramJsonObj.startTimeLong, "yyyy年MM月dd日HH:mm") + "--" + $.date.timeToStr(paramJsonObj.endTimeLong, "yyyy年MM月dd日HH:mm")
                $("#exportTime").text(exportTimeStr);
            }
        });
    }

    /**
     * 统计进京轨迹相关信息
     */
    function findCommingTrackCount() {
        var d = {
            start : 0 ,
            length : 0
        }
        $.ajax({
            url:context +'/activityCompare/commingBeijingCount',
            data:getQueryParam(d),
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                $(".trackCount").text(successData.commingCount);
                $(".personCount").text(successData.personCount);
                $(".trackTypeStr").text(successData.trackTypeStr);
            }
        });
    }

    /**
     * 统计在京轨迹相关信息
     */
    function findStayingTrackCount() {
        var d = {
            start : 0 ,
            length : 0
        }
        $.ajax({
            url:context +'/activityCompare/stayingBeijingCount',
            data:getQueryParam(d),
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                $(".trackCount").text(successData.commingCount);
                $(".personCount").text(successData.personCount);
                $(".trackTypeStr").text(successData.trackTypeStr);
            }
        });
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.activityTrackExport, {
        getQueryParam : getQueryParam
    });

})(jQuery);