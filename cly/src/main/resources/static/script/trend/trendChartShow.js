$.trendChartShow = $.trendChartShow ||{};
var dateFormatDay = "MM月dd日";
var dateFormatHour = "dd日HH时";

/**
 * 页面共用基础
 */
$.trendChartShow.basic = $.trendChartShow.basic ||{};
(function ($) {

    "use strict";

    $(document).ready(function () {
        /**
         * 群体类型选择事件
         */
        $(document).on("select2:select","#type",function () {
            var typeId = $.select2.val("#type");
            setNetTrackTypeCheckboxStatus(typeId);
            $.select2.empty("#name");
            findCrowdNameByTypeId(typeId);
        });

        /**
         * 进京页签
         */
        $(document).on("click","#commingBeijingTabs",function () {
            $(".titleName").text("进京情况监测及展示");
        });

        /**
         * 在京页签
         */
        $(document).on("click","#stayingBeijingTabs",function () {
            $(".titleName").text("在京情况监测及展示");
        });


        // 切换标签页是重新加载highchart图表，解决图表在隐藏tabs下宽度异常的问题
        $(document).click('a.ui-tabs-anchor', function(){
            $('.chart-box2').each(function(i, e){
                console.log($(e))
                var chart = $(e).highcharts();
                chart.reflow();
            });
        });

        //根据点击的菜单设置默认展示的tab签
        if(tabsType == "stayingBeijing"){
            $("#tabs").tabs({active: 1});
            $(".titleName").text("在京情况监测及展示");
        }else{
            $(".titleName").text("进京情况监测及展示");
        }

        initTrackTypeValue();
        initChartTypeSelect();
        initPageDict();
        setDefaultStartDateAndEndDate();
    });

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
     * 设置互联网轨迹类型选择框的状态
     *
     * @param crowdType 群体类型
     */
    function setNetTrackTypeCheckboxStatus(crowdType) {
        if(crowdType == $.common.dict.QTLX_SJ){//群体，涉军类型，展示互联网轨迹
            $(".netTrackType").show();
        }else{
            $(".netTrackTypeCheckbox").iCheck("uncheck");
            $(".netTrackType").hide();
        }
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
                // if(typeId == $.common.dict.QTLX_SJ){
                //     names.unshift({name : "全部",id : "all"});
                // }
                $.select2.addByList("#name", names,"id","name",true,false);
            }
        });
    }

    /**
     * 设置默认开始结束时间
     */
    function setDefaultStartDateAndEndDate() {
        $.trendChartShow.commingBjDay.setDefaultStartDateAndEndDate();
        $.trendChartShow.commingBjHour.setDefaultStartDateAndEndDate();
        $.trendChartShow.stayingBjDay.setDefaultStartDateAndEndDate();
        $.trendChartShow.stayingBjHour.setDefaultStartDateAndEndDate();
    }

    /**
     * 初始化轨迹类型多选框值
     */
    function initTrackTypeValue() {
        $(".train").val($.common.cbtt.TRAIN.traceName);
        $(".airline").val($.common.cbtt.PLANE.traceName);
        $(".bus").val($.common.cbtt.COACH.traceName);
        $(".bjPass").val($.common.cbtt.ENTER_BEIJING_PERMISSION.traceName);

        $(".hotel").val($.common.sbtt.HOTEL.traceName);
        $(".check").val($.common.sbtt.INSPECTION.traceName);
        $(".netbar").val($.common.sbtt.NET_BAR.traceName);
        $(".electronicRail").val($.common.osbtt.ELENCTRONIC_FENCE.traceName);
        $(".wifiRail").val($.common.osbtt.WIFI_FENCE.traceName);
        $(".food").val($.common.osbtt.TAKE_OUT_FOOD.traceName);
        $(".changAn").val($.common.osbtt.DATA_CA.traceName);
        $(".bookcar").val($.common.osbtt.ONLINE_TAXI.traceName);
        $(".house").val($.common.osbtt.ONLINE_RENTING.traceName);
        $(".bike").val($.common.osbtt.BKIE_SHARE.traceName);
        $(".shopping").val($.common.osbtt.EXPRESS_DELIVERY.traceName);
    }

    /**
     * 初始化图表类型
     */
    function initChartTypeSelect() {
        var types = [];
        types.push({type:"line", name : "折线图(默认)"});
        types.push({type:"column", name : "柱状图"});
        $.select2.addByList(".chartTypeSelect", types, "type", "name", false , false);
    }

    /**
     * 验证查询条件
     *
     * @param countDateId 统计时间控件id
     * @param trackCheckboxName 轨迹类型多选框name
     */
    function verifySearchCondition(countDateId, trackCheckboxName) {
        var msg = "";
        var type = $.select2.val("#type");
        if($.util.isBlank(type)){
            msg += "请选择群体类型";
        }

        var startTime = $.laydate.getTime("#" + countDateId, "start");
        var endTime = $.laydate.getTime("#" + countDateId, "end");
        if($.util.isBlank(startTime)){
            if(msg.length < 1){
                msg += "请选择统计开始时间";
            }else{
                msg += "、统计开始时间";
            }
        }
        if($.util.isBlank(endTime)){
            if(msg.length < 1){
                msg += "请选择统计结束时间";
            }else{
                msg += "、统计结束时间";
            }
        }
        var arr = $.icheck.getChecked(trackCheckboxName);
        if(arr.length < 1){
            if(msg.length < 1){
                msg += "请选择轨迹类型";
            }else{
                msg += "、轨迹类型";
            }
        }
        if(msg.length > 0){
            $.util.topWindow().$.layerAlert.alert({icon:0, msg:msg + "。"}) ;
            return false;
        }else{
            return true;
        }
    }

    /**
     * 获取人员选择结果
     *
     * @returns {{isIncludeResidentAndTemporary: 是否不包含常暂口, isVip: 是否重点人}}
     */
    function getPersonType() {
        var comparePersonArr = $.icheck.getChecked("comparePerson");
        var comparePerson = $(comparePersonArr[0]).val();
        var isIncludeResidentAndTemporary = true;
        var isVip = false;
        if(comparePerson == "all"){
            isIncludeResidentAndTemporary = true;
            isVip = false;
        }else if(comparePerson == "allPart"){
            isIncludeResidentAndTemporary = false;
            isVip = false;
        }else if(comparePerson == "backbone"){
            isIncludeResidentAndTemporary = true;
            isVip = true;
        }else if(comparePerson == "backbonePart"){
            isIncludeResidentAndTemporary = false;
            isVip = true;
        }
        return {
            isIncludeResidentAndTemporary : isIncludeResidentAndTemporary ,
            isVip : isVip
        }
    }

    /**
     * 获取群体类型和群体名称
     */
    function getCrowdTypeAndNameCode() {
        var crowdTypeCode = $.select2.val("#type");
        var crowdNameCode = $.select2.val("#name");
        // if(type == $.common.dict.QTLX_SJ){
        //     if(name == "all"){
        //         crowdTypeCode = type;
        //         crowdNameCode = null;
        //     }else{
        //         crowdTypeCode = null;
        //         crowdNameCode = name;
        //     }
        // }else{
        //     crowdTypeCode = null;
        //     crowdNameCode = name;
        // }
        if($.util.isBlank(crowdNameCode)){
            crowdNameCode = null;
        }else{
            crowdTypeCode = null;
        }
        return {
            crowdTypeCode : crowdTypeCode ,
            crowdNameCode : crowdNameCode
        }
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.trendChartShow.basic, {
        verifySearchCondition : verifySearchCondition ,
        getPersonType : getPersonType ,
        getCrowdTypeAndNameCode : getCrowdTypeAndNameCode
    });
})(jQuery);

/**
 * 进京情况--按日统计
 */
$.trendChartShow.commingBjDay = $.trendChartShow.commingBjDay ||{};
(function ($) {

    "use strict";

    var lineAndColumnDataArray = [];//按日统计图表数据
    var average = 0;// 默认均值
    var hrskpersonArray = [];// 按日统计人员列表
    var traceTypes = [];// 按日期统计轨迹图表数据

    var lineOrColumnHighchartsObj = null;// 折线图/柱状图对象
    var pieHighchartsObj = null;// 饼图对象

    var averageResultFlag = false;// 均线是否查询完成
    var lineAndColumnDataFlag = false;// 折现图数据是否查询完成

    $(document).ready(function () {
        /**
         * 重置
         */
        $(document).on("click","#commingBjDayReset",function () {
            $("#comparePerson_1").iCheck("check");
            $("input[name='commingBjTypeDay']").iCheck("check");
            $("input[name='commingBjDayAverage']").iCheck("uncheck");
            $("#commingBjDayAverageLineLegendDiv").hide();
            $.select2.clear("#type");
            $.select2.empty("#name");
            lineAndColumnDataArray = [];
            hrskpersonArray = [];
            traceTypes = [];
            $("#commingBjDayHrskpersonCount").text("0人");
            average = 0;
            $.select2.selectByOrder("#commingBjDayChartType", 1);
            var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, average, dateFormatDay);
            refreshChart(data);
            var pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
            $.trendChartShow.highcharts.refreshPieChart("#toBeijing-day-pie", pieArray);
            setDefaultStartDateAndEndDate();
            averageResultFlag = false;
            lineAndColumnDataFlag = false;
        });

        /**
         * 查询
         */
        $(document).on("click","#commingBjDaySearch",function () {
            var flag = $.trendChartShow.basic.verifySearchCondition("dateRangeCommingBjDay", "commingBjTypeDay");
            if(flag){
                $("#commingBjDayHrskpersonList").hide();
                countCommingBeijingTrackByDay();
                countCommingBeijingHrskpersonByDay();
                countCommingBeijingTraceTypeByDay();
                var averageArr = $.icheck.getChecked("commingBjDayAverage");
                if($.util.exist(averageArr) && averageArr.length > 0){
                    countCommingBeijingAverageByDay();
                }else{
                    averageResultFlag = true;
                }
            }
        });

        /**
         * 图表类型改变
         */
        $(document).on("select2:select","#commingBjDayChartType",function () {
            var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, average, dateFormatDay);
            refreshChart(data);
        });

        /**
         * 均值点击事件
         */
        $(document).on("ifChecked","input[name='commingBjDayAverage']",function () {
            var value = $(this).val();
            $("#commingBjDayAverageLineLegendDiv").show();
            $("#commingBjDayAverageLineLegendValue").text(value + "日均值");
        });

        /**
         * 人员列表
         */
        $(document).on("click","#commingBjDayHrskpersonList",function () {
            var param = getSearchCondition();
            param["param.type"] = "commingDay";
            var form = $.util.getHiddenForm(context+'/trendAnalysis/exportExcelToHrskperson', param);
            $.util.subForm(form);
        });

        /**
         * 饼图导出图表
         */
        $(document).on("click","#commingBjDayExportPieHighcharts",function () {
            var exportParam = {
                type : "image/jpeg" ,
                filename : "按日统计进京轨迹类型占比饼图"
            };
            if($.util.exist(pieHighchartsObj)){
                pieHighchartsObj.exportChartLocal(exportParam);
            }
        });

        /**
         * 折线图导出图表
         */
        $(document).on("click","#commingBjDayExportLineHighcharts",function () {
            var exportParam = {
                type : "image/jpeg" ,
                filename : "按日统计进京轨迹情况"
            };
            if($.util.exist(lineOrColumnHighchartsObj)){
                lineOrColumnHighchartsObj.exportChartLocal(exportParam);
            }
        });

        //默认初始化折线图
        var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, average, dateFormatDay);
        $.trendChartShow.highcharts.refreshLineChart("#toBeijing-day-column", data);
        //默认初始化饼图
        var pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
        $.trendChartShow.highcharts.refreshPieChart("#toBeijing-day-pie", pieArray);
    });

    /**
     * 按日统计进京轨迹类型情况
     */
    function countCommingBeijingTraceTypeByDay() {
        var pieArray = $.trendChartShow.highcharts.formatPieData([]);
        $.trendChartShow.highcharts.refreshPieChart("#toBeijing-day-pie", pieArray);

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countCommingBeijingTraceTypeByDay',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                traceTypes = successData.ttcs;
                pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
                pieHighchartsObj = $.trendChartShow.highcharts.refreshPieChart("#toBeijing-day-pie", pieArray);
            }
        });
    }

    /**
     * 按日统计进京轨迹人员情况
     */
    function countCommingBeijingHrskpersonByDay() {
        var personCount = 0;
        $("#commingBjDayHrskpersonCount").text(personCount + "人");

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countCommingBeijingHrskpersonByDay',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                hrskpersonArray = successData.hcs;
                personCount = successData.count;
                $("#commingBjDayHrskpersonCount").text(personCount + "人");
                if(hrskpersonArray.length < 1){
                    $("#commingBjDayHrskpersonList").hide();
                }else{
                    $("#commingBjDayHrskpersonList").show();
                }
            }
        });
    }

    /**
     * 按日统计进京轨迹均线值
     */
    function countCommingBeijingAverageByDay() {
        averageResultFlag = false;

        var averageArr = $.icheck.getChecked("commingBjDayAverage");
        var value = $(averageArr[0]).val();
        $("#commingBjDayAverageLineLegendValue").text(value + "日均值");
        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countCommingBeijingAverageByDay',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                averageResultFlag = true;
                average = successData.average;
                if(averageResultFlag && lineAndColumnDataFlag){
                    var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, average,  dateFormatDay);
                    refreshChart(data);
                }
                //设置均线值
                if(!$("#commingBjDayAverageLineLegendDiv").is(":hidden")){
                    $("#commingBjDayAverageLineLegendValue").text(value + "日均值：" + average);
                }
            }
        });
    }

    /**
     * 按日统计进京轨迹情况
     */
    function countCommingBeijingTrackByDay() {
        lineAndColumnDataFlag = false;

        var data = $.trendChartShow.highcharts.formatLineAndColumnData([], 0,  dateFormatDay);
        refreshChart(data);

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countCommingBeijingTrackByDay',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                lineAndColumnDataFlag = true;
                lineAndColumnDataArray = successData.ttcs;
                if(averageResultFlag && lineAndColumnDataFlag){
                    data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, average,  dateFormatDay);
                    refreshChart(data);
                }
            }
        });
    }

    /**
     * 刷新图表
     *
     * @param data 拼装好数据
     */
    function refreshChart(data){
        var type = $.select2.val("#commingBjDayChartType");
        var dataObj = {
            titleArray : [] ,
            dataArray : [] ,
            averageNumber : 0
        }
        if($.util.exist(data)){
            dataObj.dataArray = data.dataArray;
            dataObj.titleArray = data.titleArray;
            dataObj.averageNumber = data.averageNumber;
        }
        if(type == "line"){
            lineOrColumnHighchartsObj = $.trendChartShow.highcharts.refreshLineChart("#toBeijing-day-column", dataObj);
        }else if(type == "column"){
            lineOrColumnHighchartsObj = $.trendChartShow.highcharts.refreshColumnChart("#toBeijing-day-column", dataObj);
        }
    }

    /**
     * 获取查询条件
     */
    function getSearchCondition() {
        //获取选择的轨迹类型数组
        var trackTypes = [];
        var trackTypeArr = $.icheck.getChecked("commingBjTypeDay");
        $.each(trackTypeArr, function (i,val) {
            trackTypes.push($(val).val());
        });
        if(trackTypeArr.length < 1){// || trackTypeArr.length == $("input[name='commingBjTypeDay']").length
            trackTypes = null;
        }
        //获取均线值开始时间
        var startTimeLong = $.laydate.getTime("#dateRangeCommingBjDay", "start");
        var averageArr = $.icheck.getChecked("commingBjDayAverage");
        var averageLineStartTimeLong = null;
        if($.util.exist(averageArr) && averageArr.length > 0){
            var value = $(averageArr[0]).val();
            averageLineStartTimeLong = startTimeLong - (1000*60*60*24*value);
        }else{
            averageLineStartTimeLong = null;
        }
        //人员
        var personObj = $.trendChartShow.basic.getPersonType();
        //群体类型和名称
        var crowdObj = $.trendChartShow.basic.getCrowdTypeAndNameCode();
        var endTimeLong = $.laydate.getTime("#dateRangeCommingBjDay", "end");
        endTimeLong = $.date.endRangeByTime(endTimeLong, "yyyy-MM-dd HH");
        var obj = {
            crowdTypeCode : crowdObj.crowdTypeCode ,
            crowdNameCode : crowdObj.crowdNameCode ,
            includeResidentAndTemporary : personObj.isIncludeResidentAndTemporary,
            vip : personObj.isVip,
            startTimeLong : startTimeLong,
            endTimeLong : endTimeLong,
            averageLineStartTimeLong : averageLineStartTimeLong ,
            trackTypes : trackTypes
        }

        var param = {};
        $.util.objToStrutsFormData(obj, "param", param);
        return param;
    }

    /**
     * 设置默认开始结束时间
     */
    function setDefaultStartDateAndEndDate() {
        var nowDate = new Date();
        var startDateLongDay = nowDate.getTime() - 1000*60*60*24*9;
        var startDateStrDay = $.date.timeToStr(startDateLongDay, "yyyy-MM-dd HH");
        var endDateStrDay = $.date.dateToStr(nowDate, "yyyy-MM-dd HH");
        $.laydate.setRange(startDateStrDay, endDateStrDay, "#dateRangeCommingBjDay");
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.trendChartShow.commingBjDay, {
        setDefaultStartDateAndEndDate : setDefaultStartDateAndEndDate
    });
})(jQuery);

/**
 * 进京情况--按时统计
 */
$.trendChartShow.commingBjHour = $.trendChartShow.commingBjHour ||{};
(function ($) {

    "use strict";

    var lineAndColumnDataArray = [];//按日统计图表数据
    var hrskpersonArray = [];// 按日统计人员列表
    var traceTypes = [];// 按日期统计轨迹图表数据

    var lineOrColumnHighchartsObj = null;// 折线图/柱状图对象
    var pieHighchartsObj = null;// 饼图对象

    $(document).ready(function () {
        /**
         * 重置
         */
        $(document).on("click","#commingBjHourReset",function () {
            $("#comparePerson_1").iCheck("check");
            $("input[name='commingBjTypeHour']").iCheck("check");
            $.select2.clear("#type");
            $.select2.empty("#name");
            lineAndColumnDataArray = [];
            hrskpersonArray = [];
            traceTypes = [];
            $("#commingBjHourHrskpersonCount").text("0人");
            $.select2.selectByOrder("#commingBjHourChartType", 1);
            var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, 0, dateFormatHour);
            refreshChart(data);
            var pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
            $.trendChartShow.highcharts.refreshPieChart("#toBeijing-time-pie", pieArray);
            setDefaultStartDateAndEndDate();
        });

        /**
         * 查询
         */
        $(document).on("click","#commingBjHourSearch",function () {
            var flag = $.trendChartShow.basic.verifySearchCondition("dateRangeCommingBjHour", "commingBjTypeHour");
            if(flag){
                $("#commingBjHourHrskpersonList").hide();
                countCommingBeijingTraceTypeByHour();
                countCommingBeijingHrskpersonByHour();
                countCommingBeijingTrackByHour();
            }
        });

        /**
         * 图表类型改变
         */
        $(document).on("select2:select","#commingBjHourChartType",function () {
            var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, 0, dateFormatHour);
            refreshChart(data);
        });

        /**
         * 人员列表
         */
        $(document).on("click","#commingBjHourHrskpersonList",function () {
            var param = getSearchCondition();
            param["param.type"] = "commingHour";
            var form = $.util.getHiddenForm(context+'/trendAnalysis/exportExcelToHrskperson', param);
            $.util.subForm(form);
        });

        /**
         * 饼图导出图表
         */
        $(document).on("click","#commingBjHourExportPieHighcharts",function () {
            var exportParam = {
                type : "image/jpeg" ,
                filename : "按时统计进京轨迹类型占比饼图"
            };
            if($.util.exist(pieHighchartsObj)){
                pieHighchartsObj.exportChartLocal(exportParam);
            }
        });

        /**
         * 折线图导出图表
         */
        $(document).on("click","#commingBjHourExportLineHighcharts",function () {
            var exportParam = {
                type : "image/jpeg" ,
                filename : "按时统计进京轨迹情况"
            };
            if($.util.exist(lineOrColumnHighchartsObj)){
                lineOrColumnHighchartsObj.exportChartLocal(exportParam);
            }
        });

        //默认初始化折线图
        var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, 0, dateFormatHour);
        $.trendChartShow.highcharts.refreshLineChart("#toBeijing-time-column", data);
        //默认初始化饼图
        var pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
        $.trendChartShow.highcharts.refreshPieChart("#toBeijing-time-pie", pieArray);
    });

    /**
     * 按时统计进京轨迹类型情况
     */
    function countCommingBeijingTraceTypeByHour() {
        var pieArray = $.trendChartShow.highcharts.formatPieData([]);
        $.trendChartShow.highcharts.refreshPieChart("#toBeijing-time-pie", pieArray);

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countCommingBeijingTraceTypeByHour',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                traceTypes = successData.ttcs;
                pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
                pieHighchartsObj = $.trendChartShow.highcharts.refreshPieChart("#toBeijing-time-pie", pieArray);
            }
        });
    }

    /**
     * 按时统计进京轨迹人员情况
     */
    function countCommingBeijingHrskpersonByHour() {
        var personCount = 0;
        $("#commingBjHourHrskpersonCount").text(personCount + "人");

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countCommingBeijingHrskpersonByHour',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                hrskpersonArray = successData.hcs;
                personCount = successData.count;
                $("#commingBjHourHrskpersonCount").text(personCount + "人");
                if(hrskpersonArray.length < 1){
                    $("#commingBjHourHrskpersonList").hide();
                }else{
                    $("#commingBjHourHrskpersonList").show();
                }
            }
        });
    }

    /**
     * 按时统计进京轨迹情况
     */
    function countCommingBeijingTrackByHour() {
        var data = $.trendChartShow.highcharts.formatLineAndColumnData([], 0,  dateFormatDay);
        refreshChart(data);

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countCommingBeijingTrackByHour',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                lineAndColumnDataArray = successData.ttcs;
                data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, 0, dateFormatHour);
                refreshChart(data);
            }
        });
    }

    /**
     * 刷新图表
     *
     * @param data 拼装好数据
     */
    function refreshChart(data){
        var type = $.select2.val("#commingBjHourChartType");
        var dataObj = {
            titleArray : [] ,
            dataArray : [] ,
            averageNumber : 0
        }
        if($.util.exist(data)){
            dataObj.dataArray = data.dataArray;
            dataObj.titleArray = data.titleArray;
            dataObj.averageNumber = data.averageNumber;
        }
        if(type == "line"){
            lineOrColumnHighchartsObj = $.trendChartShow.highcharts.refreshLineChart("#toBeijing-time-column", dataObj);
        }else if(type == "column"){
            lineOrColumnHighchartsObj = $.trendChartShow.highcharts.refreshColumnChart("#toBeijing-time-column", dataObj);
        }
    }

    /**
     * 获取查询条件
     */
    function getSearchCondition() {
        //获取选择的轨迹类型数组
        var trackTypes = [];
        var trackTypeArr = $.icheck.getChecked("commingBjTypeHour");
        $.each(trackTypeArr, function (i,val) {
            trackTypes.push($(val).val());
        });
        if(trackTypeArr.length < 1){// || trackTypeArr.length == $("input[name='commingBjTypeHour']").length
            trackTypes = null;
        }
        //人员
        var personObj = $.trendChartShow.basic.getPersonType();
        //群体类型和名称
        var crowdObj = $.trendChartShow.basic.getCrowdTypeAndNameCode();
        var endTimeLong = $.laydate.getTime("#dateRangeCommingBjHour", "end");
        endTimeLong = $.date.endRangeByTime(endTimeLong, "yyyy-MM-dd HH");
        var obj = {
            crowdTypeCode : crowdObj.crowdTypeCode ,
            crowdNameCode : crowdObj.crowdNameCode ,
            includeResidentAndTemporary : personObj.isIncludeResidentAndTemporary,
            vip : personObj.isVip,
            startTimeLong : $.laydate.getTime("#dateRangeCommingBjHour", "start"),
            endTimeLong : endTimeLong,
            averageLineStartTimeLong : null ,
            trackTypes : trackTypes
        }

        var param = {};
        $.util.objToStrutsFormData(obj, "param", param);
        return param;
    }

    /**
     * 设置默认开始结束时间
     */
    function setDefaultStartDateAndEndDate() {
        var nowDate = new Date();
        var startDateLongHour = nowDate.getTime() - 1000*60*60*23;
        var startDateStrHour = $.date.timeToStr(startDateLongHour, "yyyy-MM-dd HH");
        var endDateStrHour = $.date.dateToStr(nowDate, "yyyy-MM-dd HH");
        $.laydate.setRange(startDateStrHour, endDateStrHour, "#dateRangeCommingBjHour");
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.trendChartShow.commingBjHour, {
        setDefaultStartDateAndEndDate : setDefaultStartDateAndEndDate
    });
})(jQuery);


/**
 * 在京情况--按日统计
 */
$.trendChartShow.stayingBjDay = $.trendChartShow.stayingBjDay ||{};
(function ($) {

    "use strict";

    var lineAndColumnDataArray = [];//按日统计图表数据
    var average = 0;// 默认均值
    var hrskpersonArray = [];// 按日统计人员列表
    var traceTypes = [];// 按日期统计轨迹图表数据

    var lineOrColumnHighchartsObj = null;// 折线图/柱状图对象
    var pieHighchartsObj = null;// 饼图对象

    var averageResultFlag = false;// 均线是否查询完成
    var lineAndColumnDataFlag = false;// 折线图数据是否查询完成

    $(document).ready(function () {
        /**
         * 重置
         */
        $(document).on("click","#stayingBjDayReset",function () {
            $("#comparePerson_1").iCheck("check");
            $(".stayingTrackTypeCheckbox").iCheck("check");
            $(".netTrackTypeCheckbox").iCheck("uncheck");
            $("input[name='stayingBjDayAverage']").iCheck("uncheck");
            $("#stayingBjDayAverageLineLegendDiv").hide();
            $.select2.clear("#type");
            $.select2.empty("#name");
            lineAndColumnDataArray = [];
            hrskpersonArray = [];
            traceTypes = [];
            $("#stayingBjDayHrskpersonCount").text("0人");
            average = 0;
            $.select2.selectByOrder("#stayingBjDayChartType", 1);
            var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, average, dateFormatDay);
            refreshChart(data);
            var pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
            $.trendChartShow.highcharts.refreshPieChart("#inBeijing-day-pie", pieArray);
            setDefaultStartDateAndEndDate();
            averageResultFlag = false;
            lineAndColumnDataFlag = false;
        });

        /**
         * 查询
         */
        $(document).on("click","#stayingBjDaySearch",function () {
            var flag = $.trendChartShow.basic.verifySearchCondition("dateRangeStayingBjDay", "stayingBjTypeDay");
            if(flag){
                $("#stayingBjDayHrskpersonList").hide();
                countStayingBeijingTrackByDay();
                countStayingBeijingHrskpersonByDay();
                countStayingBeijingTraceTypeByDay();
                var averageArr = $.icheck.getChecked("stayingBjDayAverage");
                if($.util.exist(averageArr) && averageArr.length > 0){
                    countStayingBeijingAverageByDay();
                }else{
                    averageResultFlag = true;
                }
            }
        });

        /**
         * 图表类型改变
         */
        $(document).on("select2:select","#stayingBjDayChartType",function () {
            var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, average, dateFormatDay);
            refreshChart(data);
        });

        /**
         * 均值点击事件
         */
        $(document).on("ifChecked","input[name='stayingBjDayAverage']",function () {
            var value = $(this).val();
            $("#stayingBjDayAverageLineLegendDiv").show();
            $("#stayingBjDayAverageLineLegendValue").text(value + "日均值");
        });

        /**
         * 人员列表
         */
        $(document).on("click","#stayingBjDayHrskpersonList",function () {
            var param = getSearchCondition();
            param["param.type"] = "stayingDay";
            var form = $.util.getHiddenForm(context+'/trendAnalysis/exportExcelToHrskperson', param);
            $.util.subForm(form);
        });

        /**
         * 饼图导出图表
         */
        $(document).on("click","#stayingBjDayExportPieHighcharts",function () {
            var exportParam = {
                type : "image/jpeg" ,
                filename : "按日统计在京轨迹类型占比饼图"
            };
            if($.util.exist(pieHighchartsObj)){
                pieHighchartsObj.exportChartLocal(exportParam);
            }
        });

        /**
         * 折线图导出图表
         */
        $(document).on("click","#stayingBjDayExportLineHighcharts",function () {
            var exportParam = {
                type : "image/jpeg" ,
                filename : "按日统计在京轨迹情况"
            };
            if($.util.exist(lineOrColumnHighchartsObj)){
                lineOrColumnHighchartsObj.exportChartLocal(exportParam);
            }
        });

        //默认初始化折线图
        var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, average, dateFormatDay);
        $.trendChartShow.highcharts.refreshLineChart("#inBeijing-day-line", data);
        //默认初始化饼图
        var pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
        $.trendChartShow.highcharts.refreshPieChart("#inBeijing-day-pie", pieArray);
    });

    /**
     * 按日统计在京轨迹类型情况
     */
    function countStayingBeijingTraceTypeByDay() {
        var pieArray = $.trendChartShow.highcharts.formatPieData([]);
        $.trendChartShow.highcharts.refreshPieChart("#inBeijing-day-pie", pieArray);

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countStayingBeijingTraceTypeByDay',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                traceTypes = successData.ttcs;
                pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
                pieHighchartsObj = $.trendChartShow.highcharts.refreshPieChart("#inBeijing-day-pie", pieArray);
            }
        });
    }

    /**
     * 按日统计在京轨迹人员情况
     */
    function countStayingBeijingHrskpersonByDay() {
        var personCount = 0;
        $("#stayingBjDayHrskpersonCount").text(personCount + "人");

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countStayingBeijingHrskpersonByDay',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                hrskpersonArray = successData.hcs;
                personCount = successData.count;
                $("#stayingBjDayHrskpersonCount").text(personCount + "人");
                if(hrskpersonArray.length < 1){
                    $("#stayingBjDayHrskpersonList").hide();
                }else{
                    $("#stayingBjDayHrskpersonList").show();
                }
            }
        });
    }

    /**
     * 按日统计在京轨迹情况
     */
    function countStayingBeijingTrackByDay() {
        lineAndColumnDataFlag = false;

        var data = $.trendChartShow.highcharts.formatLineAndColumnData([], 0,  dateFormatDay);
        refreshChart(data);

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countStayingBeijingTrackByDay',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                lineAndColumnDataFlag = true;
                lineAndColumnDataArray = successData.ttcs;
                if(averageResultFlag && lineAndColumnDataFlag){
                    data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, average, dateFormatDay);
                    refreshChart(data);
                }
            }
        });
    }

    /**
     * 按日统计在京轨迹均线值
     */
    function countStayingBeijingAverageByDay() {
        averageResultFlag = false;

        var averageArr = $.icheck.getChecked("stayingBjDayAverage");
        var value = $(averageArr[0]).val();
        $("#stayingBjDayAverageLineLegendValue").text(value + "日均值");
        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countStayingBeijingAverageByDay',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                averageResultFlag = true;
                average = successData.average;
                if(averageResultFlag && lineAndColumnDataFlag){
                    var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, average, dateFormatDay);
                    refreshChart(data);
                }
                //设置均线值
                if(!$("#stayingBjDayAverageLineLegendDiv").is(":hidden")){
                    $("#stayingBjDayAverageLineLegendValue").text(value + "日均值：" + average);
                }
            }
        });
    }

    /**
     * 刷新图表
     *
     * @param data 拼装好数据
     */
    function refreshChart(data){
        var type = $.select2.val("#stayingBjDayChartType");
        var dataObj = {
            titleArray : [] ,
            dataArray : [] ,
            averageNumber : 0
        }
        if($.util.exist(data)){
            dataObj.dataArray = data.dataArray;
            dataObj.titleArray = data.titleArray;
            dataObj.averageNumber = data.averageNumber;
        }
        if(type == "line"){
            lineOrColumnHighchartsObj = $.trendChartShow.highcharts.refreshLineChart("#inBeijing-day-line", dataObj);
        }else if(type == "column"){
            lineOrColumnHighchartsObj = $.trendChartShow.highcharts.refreshColumnChart("#inBeijing-day-line", dataObj);
        }
    }

    /**
     * 获取查询条件
     */
    function getSearchCondition() {
        //获取选择的轨迹类型数组
        var trackTypes = [];
        var trackTypeArr = $.icheck.getChecked("stayingBjTypeDay");
        $.each(trackTypeArr, function (i,val) {
            trackTypes.push($(val).val());
        });
        if(trackTypeArr.length < 1){// || trackTypeArr.length == $("input[name='stayingBjTypeDay']").length
            trackTypes = null;
        }
        //获取均线值开始时间
        var startTimeLong = $.laydate.getTime("#dateRangeStayingBjDay", "start");
        var averageArr = $.icheck.getChecked("stayingBjDayAverage");
        var averageLineStartTimeLong = null;
        if($.util.exist(averageArr) && averageArr.length > 0){
            var value = $(averageArr[0]).val();
            averageLineStartTimeLong = startTimeLong - (1000*60*60*24*value);
        }else{
            averageLineStartTimeLong = null;
        }
        //人员
        var personObj = $.trendChartShow.basic.getPersonType();
        //群体类型和名称
        var crowdObj = $.trendChartShow.basic.getCrowdTypeAndNameCode();
        var endTimeLong = $.laydate.getTime("#dateRangeStayingBjDay", "end");
        endTimeLong = $.date.endRangeByTime(endTimeLong, "yyyy-MM-dd HH");
        var obj = {
            crowdTypeCode : crowdObj.crowdTypeCode ,
            crowdNameCode : crowdObj.crowdNameCode ,
            includeResidentAndTemporary : personObj.isIncludeResidentAndTemporary,
            vip : personObj.isVip,
            startTimeLong : startTimeLong,
            endTimeLong : endTimeLong,
            averageLineStartTimeLong : averageLineStartTimeLong ,
            trackTypes : trackTypes
        }

        var param = {};
        $.util.objToStrutsFormData(obj, "param", param);
        return param;
    }

    /**
     * 设置默认开始结束时间
     */
    function setDefaultStartDateAndEndDate() {
        var nowDate = new Date();
        var startDateLongDay = nowDate.getTime() - 1000*60*60*24*9;
        var startDateStrDay = $.date.timeToStr(startDateLongDay, "yyyy-MM-dd HH");
        var endDateStrDay = $.date.dateToStr(nowDate, "yyyy-MM-dd HH");
        $.laydate.setRange(startDateStrDay, endDateStrDay, "#dateRangeStayingBjDay");
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.trendChartShow.stayingBjDay, {
        setDefaultStartDateAndEndDate : setDefaultStartDateAndEndDate
    });
})(jQuery);

/**
 * 在京情况--按时统计
 */
$.trendChartShow.stayingBjHour = $.trendChartShow.stayingBjHour ||{};
(function ($) {

    "use strict";

    var lineAndColumnDataArray = [];//按日统计图表数据
    var hrskpersonArray = [];// 按日统计人员列表
    var traceTypes = [];// 按日期统计轨迹图表数据

    var lineOrColumnHighchartsObj = null;// 折线图/柱状图对象
    var pieHighchartsObj = null;// 饼图对象

    $(document).ready(function () {
        /**
         * 重置
         */
        $(document).on("click","#stayingBjHourReset",function () {
            $("#comparePerson_1").iCheck("check");
            $(".stayingTrackTypeCheckbox").iCheck("check");
            $(".netTrackTypeCheckbox").iCheck("uncheck");
            $.select2.clear("#type");
            $.select2.empty("#name");
            lineAndColumnDataArray = [];
            hrskpersonArray = [];
            traceTypes = [];
            $("#stayingBjHourHrskpersonCount").text("0人");
            $.select2.selectByOrder("#stayingBjHourChartType", 1);
            var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, 0, dateFormatHour);
            refreshChart(data);
            var pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
            $.trendChartShow.highcharts.refreshPieChart("#inBeijing-time-pie", pieArray);
            setDefaultStartDateAndEndDate();
        });

        /**
         * 查询
         */
        $(document).on("click","#stayingBjHourSearch",function () {
            var flag = $.trendChartShow.basic.verifySearchCondition("dateRangeStayingBjHour", "stayingBjTypeHour");
            if(flag){
                $("#stayingBjHourHrskpersonList").hide();
                countStayingBeijingTraceTypeByHour();
                countStayingBeijingHrskpersonByHour();
                countStayingBeijingTrackByHour();
            }
        });

        /**
         * 图表类型改变
         */
        $(document).on("select2:select","#stayingBjHourChartType",function () {
            var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, 0, dateFormatHour);
            refreshChart(data);
        });

        /**
         * 人员列表
         */
        $(document).on("click","#stayingBjhourHrskpersonList",function () {
            var param = getSearchCondition();
            param["param.type"] = "stayingHour";
            var form = $.util.getHiddenForm(context+'/trendAnalysis/exportExcelToHrskperson', param);
            $.util.subForm(form);
        });

        /**
         * 饼图导出图表
         */
        $(document).on("click","#stayingBjHourExportPieHighcharts",function () {
            var exportParam = {
                type : "image/jpeg" ,
                filename : "按时统计在京轨迹类型占比饼图"
            };
            if($.util.exist(pieHighchartsObj)){
                pieHighchartsObj.exportChartLocal(exportParam);
            }
        });

        /**
         * 折线图导出图表
         */
        $(document).on("click","#stayingBjHourExportLineHighcharts",function () {
            var exportParam = {
                type : "image/jpeg" ,
                filename : "按时统计在京轨迹情况"
            };
            if($.util.exist(lineOrColumnHighchartsObj)){
                lineOrColumnHighchartsObj.exportChartLocal(exportParam);
            }
        });

        //默认初始化折线图
        var data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, 0, dateFormatHour);
        $.trendChartShow.highcharts.refreshLineChart("#inBeijing-time-line", data);
        //默认初始化饼图
        var pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
        $.trendChartShow.highcharts.refreshPieChart("#inBeijing-time-pie", pieArray);
    });

    /**
     * 按时统计在京轨迹类型情况
     */
    function countStayingBeijingTraceTypeByHour() {
        var pieArray = $.trendChartShow.highcharts.formatPieData([]);
        $.trendChartShow.highcharts.refreshPieChart("#inBeijing-time-pie", pieArray);

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countStayingBeijingTraceTypeByHour',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                traceTypes = successData.ttcs;
                pieArray = $.trendChartShow.highcharts.formatPieData(traceTypes);
                pieHighchartsObj = $.trendChartShow.highcharts.refreshPieChart("#inBeijing-time-pie", pieArray);
            }
        });
    }

    /**
     * 按时统计在京轨迹人员情况
     */
    function countStayingBeijingHrskpersonByHour() {
        var personCount = 0;
        $("#stayingBjHourHrskpersonCount").text(personCount + "人");

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countStayingBeijingHrskpersonByHour',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                hrskpersonArray = successData.hcs;
                personCount = successData.count;
                $("#stayingBjHourHrskpersonCount").text(personCount + "人");
                if(hrskpersonArray.length < 1){
                    $("#stayingBjhourHrskpersonList").hide();
                }else{
                    $("#stayingBjhourHrskpersonList").show();
                }
            }
        });
    }

    /**
     * 按时统计在京轨迹情况
     */
    function countStayingBeijingTrackByHour() {
        var data = $.trendChartShow.highcharts.formatLineAndColumnData([], 0,  dateFormatDay);
        refreshChart(data);

        var param = getSearchCondition();
        $.ajax({
            url:context +'/trendAnalysis/countStayingBeijingTrackByHour',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                lineAndColumnDataArray = successData.ttcs;
                data = $.trendChartShow.highcharts.formatLineAndColumnData(lineAndColumnDataArray, 0, dateFormatHour);
                refreshChart(data);
            }
        });
    }

    /**
     * 刷新图表
     *
     * @param data 拼装好数据
     */
    function refreshChart(data){
        var type = $.select2.val("#stayingBjHourChartType");
        var dataObj = {
            titleArray : [] ,
            dataArray : [] ,
            averageNumber : 0
        }
        if($.util.exist(data)){
            dataObj.dataArray = data.dataArray;
            dataObj.titleArray = data.titleArray;
            dataObj.averageNumber = data.averageNumber;
        }
        if(type == "line"){
            lineOrColumnHighchartsObj = $.trendChartShow.highcharts.refreshLineChart("#inBeijing-time-line", dataObj);
        }else if(type == "column"){
            lineOrColumnHighchartsObj = $.trendChartShow.highcharts.refreshColumnChart("#inBeijing-time-line", dataObj);
        }
    }

    /**
     * 获取查询条件
     */
    function getSearchCondition() {
        //获取选择的轨迹类型数组
        var trackTypes = [];
        var trackTypeArr = $.icheck.getChecked("stayingBjTypeHour");
        $.each(trackTypeArr, function (i,val) {
            trackTypes.push($(val).val());
        });
        if(trackTypeArr.length < 1){// || trackTypeArr.length == $("input[name='stayingBjTypeHour']").length
            trackTypes = null;
        }
        //人员
        var personObj = $.trendChartShow.basic.getPersonType();
        //群体类型和名称
        var crowdObj = $.trendChartShow.basic.getCrowdTypeAndNameCode();
        var endTimeLong = $.laydate.getTime("#dateRangeStayingBjHour", "end");
        endTimeLong = $.date.endRangeByTime(endTimeLong, "yyyy-MM-dd HH");
        var obj = {
            crowdTypeCode : crowdObj.crowdTypeCode ,
            crowdNameCode : crowdObj.crowdNameCode ,
            includeResidentAndTemporary : personObj.isIncludeResidentAndTemporary,
            vip : personObj.isVip,
            startTimeLong : $.laydate.getTime("#dateRangeStayingBjHour", "start"),
            endTimeLong : endTimeLong,
            averageLineStartTimeLong : null ,
            trackTypes : trackTypes
        }

        var param = {};
        $.util.objToStrutsFormData(obj, "param", param);
        return param;
    }

    /**
     * 设置默认开始结束时间
     */
    function setDefaultStartDateAndEndDate() {
        var nowDate = new Date();
        var startDateLongHour = nowDate.getTime() - 1000*60*60*23;
        var startDateStrHour = $.date.timeToStr(startDateLongHour, "yyyy-MM-dd HH");
        var endDateStrHour = $.date.dateToStr(nowDate, "yyyy-MM-dd HH");
        $.laydate.setRange(startDateStrHour, endDateStrHour, "#dateRangeStayingBjHour");
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.trendChartShow.stayingBjHour, {
        setDefaultStartDateAndEndDate : setDefaultStartDateAndEndDate
    });
})(jQuery);


/**
 * 刷新图表
 *
 */
$.trendChartShow.highcharts = $.trendChartShow.highcharts ||{};
(function ($) {

    "use strict";

    $(document).ready(function () {

    });

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
    function formatLineAndColumnData(data, averageLine, dateFormat) {
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
     * 刷新饼图
     *
     * @param highchartsId 图表容器id
     * @param data 数据
     */
    function refreshPieChart(highchartsId, data) {
        var highchartsObj = null;
        $(highchartsId).highcharts({
            chart: {
                type: 'pie'
            },
            title: {
                text: null
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.percentage:.1f} % <br>{point.y} 条',
                        style: {
                            color:  'black'
                        }
                    }
                }
            },
            series: [{
                name: "轨迹数量",
                data: data
            }]
        }, function(c){ // 回调函数，传递图表对象
            highchartsObj = c;
        });
        return highchartsObj;
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
                color: '#FFF',
                // dashStyle: 'shortDash',
                width: 2,
                value: data.averageNumber,
                zIndex: 50 ,
                label: {
                    text : data.averageNumber == 0 ? "" : "均线值：" + data.averageNumber
                }
            }];
        }
        var highchartsObj = null;
        $(highchartsId).highcharts({
            chart: {
                type: 'column',
                marginTop: 20
            },
            title: {
                text: null
            },
            xAxis: {
                categories: data.titleArray ,
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
                align: 'right',
                verticalAlign: 'top',
            },
            tooltip: {
                // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
            },
            series: [{
                name: '人员总数',
                // color: '#ffb980',
                data: data.dataArray
                // [99, 58, 69, 120, 45, 180, 220, 140, 60, 88]
            }]
        }, function(c){ // 回调函数，传递图表对象
            highchartsObj = c;
        });
        return highchartsObj;
    }

    /**
     * 刷新折线图
     *
     * @param highchartsId 图表容器id
     * @param data 数据
     */
    function refreshLineChart(highchartsId, data) {
        var plotLines = []
        if(data.averageNumber > 0){
            plotLines = [{
                color: '#FFF',
                // dashStyle: 'shortDash',
                width: 2,
                value: data.averageNumber,
                zIndex: 50 ,
                label: {
                    text : data.averageNumber == 0 ? "" : "均线值：" + data.averageNumber
                }
            }];
        }
        var highchartsObj = null;
        $(highchartsId).highcharts({
            chart: {
                type: 'line',
                marginTop: 20
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
                plotLines: plotLines,
                min: 0
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }
                },
                enableMouseTracking: false
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
            },
            tooltip: {
                // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
            },
            series: [{
                name: '人员总数',
                // color: '#ffb980',
                data: data.dataArray
            }]
        }, function(c){ // 回调函数，传递图表对象
            highchartsObj = c;
        });
        return highchartsObj;
    }






    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.trendChartShow.highcharts, {
        formatPieData : formatPieData ,
        formatLineAndColumnData : formatLineAndColumnData ,
        refreshPieChart : refreshPieChart ,
        refreshColumnChart : refreshColumnChart ,
        refreshLineChart : refreshLineChart
    });
})(jQuery);