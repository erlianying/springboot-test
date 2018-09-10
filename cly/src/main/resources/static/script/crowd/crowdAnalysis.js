$.trendChartShow = $.trendChartShow ||{};
var dateFormatDay = "MM月dd日";

/**
 * 页面共用基础
 */
$.trendChartShow.basic = $.trendChartShow.basic ||{};
(function ($) {

    "use strict";

    var comingLineAndColumnDataArray = [];      //进京图表数据
    var stayingLineAndColumnDataArray = [];     //在京图表数据
    var fzdLineAndColumnDataArray = [];         //非重点集访登记数据
    var phoneLineAndColumnDataArray = [];       //手机检测数据

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

        initTrackTypeValue();
        initChartTypeSelect();
        initPageDict();
        setDefaultStartDateAndEndDate();

        /**
         * 重置
         */
        $(document).on("click","#reset",function () {
            $.select2.clear("#type");
            $.select2.empty("#name");

            comingLineAndColumnDataArray = [];
            stayingLineAndColumnDataArray = [];
            fzdLineAndColumnDataArray = [];
            phoneLineAndColumnDataArray = [];

            setDefaultStartDateAndEndDate();

            var data = $.trendChartShow.highcharts.formatLineAndColumnDataBatch(comingLineAndColumnDataArray, stayingLineAndColumnDataArray, fzdLineAndColumnDataArray, phoneLineAndColumnDataArray, dateFormatDay);
            refreshChart(data);
        });


        /**
         * 查询
         */
        $(document).on("click","#search",function () {
            var flag = $.trendChartShow.basic.verifySearchCondition("dateRangeBjDay");
            if(flag){
                var param = getSearchCondition();
                $.ajax({
                    url:context +'/trendAnalysis/countCrowdAnalysisTrackByDay',
                    data:param,
                    type:"post",
                    dataType:"json",
                    customizedOpt:{
                        ajaxLoading:true,//设置是否loading
                    },
                    success:function(successData){
                        comingLineAndColumnDataArray = successData.comingTtcs;
                        stayingLineAndColumnDataArray = successData.stayingTtcs;
                        fzdLineAndColumnDataArray = successData.fzdTtcs;
                        phoneLineAndColumnDataArray = successData.phoneTtcs;

                        data = $.trendChartShow.highcharts.formatLineAndColumnDataBatch(comingLineAndColumnDataArray, stayingLineAndColumnDataArray, fzdLineAndColumnDataArray, phoneLineAndColumnDataArray, dateFormatDay);
                        refreshChart(data);
                    }
                });
            }
        });

        /**
         * 图表类型改变
         */
        $(document).on("select2:select","#BjDayChartType",function () {
            var data = $.trendChartShow.highcharts.formatLineAndColumnDataBatch(comingLineAndColumnDataArray, stayingLineAndColumnDataArray, fzdLineAndColumnDataArray, phoneLineAndColumnDataArray, dateFormatDay);
            refreshChart(data);
        });

        //默认初始化折线图
        var data = $.trendChartShow.highcharts.formatLineAndColumnDataBatch([], [], [], [], dateFormatDay);
        $.trendChartShow.highcharts.refreshLineChart("#Beijing-day-column", data);
    });

    /**
     * 获取查询条件
     */
    function getSearchCondition() {
        //获取选择的轨迹类型数组   进京
        var comingTrackTypes = ["铁路订票", "民航", "进京证", "长途汽车"];
        //获取选择的轨迹类型数组   在京      ["旅店", "在京核录", "网吧", "长安数据(含身份证号)", "网约车", "短租", "共享单车"]
        var stayingTrackTypes = ["旅店", "在京核录", "网吧"];

        //获取均线值开始时间
        var startTimeLong = $.laydate.getTime("#dateRangeBjDay", "start");
        //人员
        var personObj = $.trendChartShow.basic.getPersonType();
        //群体类型和名称
        var crowdObj = $.trendChartShow.basic.getCrowdTypeAndNameCode();
        var endTimeLong = $.laydate.getTime("#dateRangeBjDay", "end");
        endTimeLong = $.date.endRangeByTime(endTimeLong, "yyyy-MM-dd HH");
        var obj = {
            crowdTypeCode : crowdObj.crowdTypeCode ,
            crowdNameCode : crowdObj.crowdNameCode ,
            includeResidentAndTemporary : personObj.isIncludeResidentAndTemporary,
            vip : personObj.isVip,
            startTimeLong : startTimeLong,
            endTimeLong : endTimeLong,
            comingTrackTypes : comingTrackTypes,
            stayingTrackTypes : stayingTrackTypes
        }

        var param = {};
        $.util.objToStrutsFormData(obj, "param", param);
        return param;
    }

    /**
     * 刷新图表
     *
     * @param data 拼装好数据
     */
    function refreshChart(data){
        var type = $.select2.val("#BjDayChartType");
        var dataObj = {
            titleArray : [] ,
            comingDataArray : [] ,
            stayingDataArray : [] ,
            fzdDataArray : [] ,
            phoneDataArray : []
        }
        if($.util.exist(data)){
            dataObj.titleArray = data.titleArray;
            dataObj.comingDataArray = data.comingDataArray;
            dataObj.stayingDataArray = data.stayingDataArray;
            dataObj.fzdDataArray = data.fzdDataArray;
            dataObj.phoneDataArray = data.phoneDataArray;
        }
        if(type == "line"){
            $.trendChartShow.highcharts.refreshLineChart("#Beijing-day-column", dataObj);
        }else if(type == "column"){
            $.trendChartShow.highcharts.refreshColumnChart("#Beijing-day-column", dataObj);
        }
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
        var nowDate = new Date();
        var startDateLongDay = nowDate.getTime() - 1000*60*60*24*9;
        var startDateStrDay = $.date.timeToStr(startDateLongDay, "yyyy-MM-dd HH");
        var endDateStrDay = $.date.dateToStr(nowDate, "yyyy-MM-dd HH");
        $.laydate.setRange(startDateStrDay, endDateStrDay, "#dateRangeBjDay");
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
     */
    function verifySearchCondition(countDateId) {
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

        var isIncludeResidentAndTemporary = true;
        var isVip = false;

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
     * 格式化折线图、柱状图用的数据
     *
     * @param data 查询出来的原始数据
     * @param averageLine 均线值
     * @param dateFormat 格式化时间格式
     * @returns {{titleArray: Array, dataArray: Array}}
     */
    function formatLineAndColumnDataBatch(comingData, stayingData, fzdData, phoneData, dateFormat) {
        var titleArray = [];
        var comingDataArray = [];
        var stayingDataArray = [];
        var fzdDataArray = [];
        var phoneDataArray = [];
        //拼装数据
        if($.util.exist(comingData) && comingData.length > 0){
            $.each(comingData, function (i,val) {
                titleArray.push($.date.timeToStr(val.time, dateFormat));
                var count = val.count;
                comingDataArray.push({y : count});
            });
        }
        if($.util.exist(stayingData) && stayingData.length > 0){
            $.each(stayingData, function (i,val) {
                //titleArray.push($.date.timeToStr(val.time, dateFormat));
                var count = val.count;
                stayingDataArray.push({y : count});
            });
        }
        if($.util.exist(fzdData) && fzdData.length > 0){
            $.each(fzdData, function (i,val) {
                var count = val.count;
                fzdDataArray.push({y : count});
            });
        }
        if($.util.exist(phoneData) && phoneData.length > 0){
            $.each(phoneData, function (i,val) {
                var count = val.count;
                phoneDataArray.push({y : count});
            });
        }
        return {
            titleArray : titleArray ,
            comingDataArray : comingDataArray ,
            stayingDataArray : stayingDataArray ,
            fzdDataArray : fzdDataArray ,
            phoneDataArray : phoneDataArray
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
        var plotLines = [];
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
            series: [
                {
                    name: '进京人员总数',
                    color: '#ffb980',
                    data: data.comingDataArray
                },
                {
                    name: '在京人员总数',
                    color: '#b9ff80',
                    data: data.stayingDataArray
                },
                {
                    name: '非重点区集访人员总数',
                    color: '#b980ff',
                    data: data.fzdDataArray
                },
                {
                    name: '手机监测人员总数',
                    color: '#ff80b9',
                    data: data.phoneDataArray
                }
            ]
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
        var plotLines = [];

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
            series: [
                {
                    name: '进京人员总数',
                    color: '#ffb980',
                    data: data.comingDataArray
                },
                {
                    name: '在京人员总数',
                    color: '#b9ff80',
                    data: data.stayingDataArray
                },
                {
                    name: '非重点区集访人员总数',
                    color: '#b980ff',
                    data: data.fzdDataArray
                },
                {
                    name: '手机监测人员总数',
                    color: '#ff80b9',
                    data: data.phoneDataArray
                }
            ]
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
        formatLineAndColumnDataBatch : formatLineAndColumnDataBatch,
        refreshPieChart : refreshPieChart ,
        refreshColumnChart : refreshColumnChart ,
        refreshLineChart : refreshLineChart
    });
})(jQuery);