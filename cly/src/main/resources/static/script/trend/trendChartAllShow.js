$.trendChartAllShow = $.trendChartAllShow || {};

$.trendChartAllShow.charts = $.trendChartAllShow.charts || {};
(function ($) {
    "use strict";

    var isKeyAttentions = null;
    var teanUrl = null;
    var hourUrl = null;
    var average = 10;

    /**
     * 页签初始状态
     * 用于页面初始查询
     * 初始查询 进京情况
     * @type {boolean}
     */
    var toBeijingTabs = true;
    var onBeijingTabs = false;
    var tenId = "toTenContainer";
    var hourId = "toHourContainer";
    $(document).ready(function() {
        initTrackTypeValue();//初始化轨迹类型多选框值
        //设置统计时间
        var nowDate = new Date();
        var startDateStrDay = $.date.timeToStr(nowDate, "yyyy-MM-dd HH");
        $.laydate.setDate(startDateStrDay,"#totalTime");
        //设置默认均线时间
        $("#toBeijingAverage").text(10);
        $("#onBeijingAverage").text(10);
        teanUrl = context + "/trendChartAllShow/queryToBeijngTenData";
        hourUrl = context + "/trendChartAllShow/queryToBeijngHourData";
        queryKeyAttentionCrowd();//查询所有重点关注群体
    });
    /**
     * 监测-查询
     */
    $(document).on("click","#monitorQuery",function(){
        query();
    });

    //执行查询入口
    function query(){
        if(getToBeijingTenDayValues().length == 0 || getToBeijing24hourValues().length == 0 || getOnBeijingTenDayValues().length == 0 || getOnBeijing24hourValues().length == 0){
            window.top.$.layerAlert.alert({icon:0, closeBtn:false, msg:"请至少勾选一个轨迹类型"});
            return ;
        }
        var toArr = $.icheck.getChecked("toBeijingAverage");
        var to = toArr[0].value;
        var onArr = $.icheck.getChecked("onBeijingAverage");
        var on = onArr[0].value;
        $("#toBeijingAverage").text(to);
        $("#onBeijingAverage").text(on);
        // 判断 进京或在京
        if(toBeijingTabs){
            average = to;
            $("#toTenContainer").empty();
            $("#toHourContainer").empty();
        }else{
            average = on;
            $("#onTenContainer").empty();
            $("#onHourContainer").empty();
        }
        // 判断是执行 默认查询  还是选择了某个群体进行查询
        if(!$.util.isEmpty($.select2.val("#keyAttentionCrowd"))){
            setChartDataSource($.select2.val("#keyAttentionCrowd"),$.select2.text("#keyAttentionCrowd"));
        }else{
            $.each(isKeyAttentions,function(i,val){
                setChartDataSource(val.code,val.name);
            })
        }
    }
    /**
     *监测-重置
     */
    $(document).on("click","#monitorReset",function(){
        $("input[name='toBeijingTenDay']").iCheck('uncheck');
        $("input[name='toBeijing24hour']").iCheck('uncheck');
        $("input[name='onBeijingTanDay']").iCheck('uncheck');
        $("input[name='onBeijingHour']").iCheck('uncheck');

        $("#onBeijingHour_hotel").iCheck('check');
        $("#onBeijingTanDay_hotel").iCheck('check');
        $("#toBeijing24hour_train").iCheck('check');
        $("#toBeijingTenDay_train").iCheck('check');

        $("#defaultCheckedClue").iCheck('check');
        $("#toBeijingAverageRadio").iCheck('check');
        $("#onBeijingAverageRadio").iCheck('check');
        average = 30;
        if(toBeijingTabs){
            $("#toTenContainer").empty();
            $("#toHourContainer").empty();
        }else{
            $("#onTenContainer").empty();
            $("#onHourContainer").empty();
        }
        $.each(isKeyAttentions,function(i,val){
            setChartDataSource(val.code,val.name);
        })
        $.select2.clear("#keyAttentionCrowd");
        //设置统计时间
        var nowDate = new Date();
        var startDateStrDay = $.date.timeToStr(nowDate, "yyyy-MM-dd HH");
        $.laydate.setDate(startDateStrDay,"#totalTime");
    });

    /**
     * 进京页签点击事件
     */
    $(document).on("click","#toBeijingTabs",function(){
        average = $("#toBeijingAverage").text();
        tenId = "toTenContainer";
        hourId = "toHourContainer";
        toBeijingTabs = true;
        onBeijingTabs = false;
        teanUrl = context + "/trendChartAllShow/queryToBeijngTenData";
        hourUrl = context + "/trendChartAllShow/queryToBeijngHourData";
        var len = $("#toTenContainer").children();
        if(len.length == 0){
            query();
        }
    });
    /**
     * 在京页签点击事件
     */
    $(document).on("click","#onBeijingTabs",function(){
        average = $("#onBeijingTabs").text();
        tenId = "onTenContainer";
        hourId = "onHourContainer";
        toBeijingTabs = false;
        onBeijingTabs = true;
        teanUrl = context + "/trendChartAllShow/queryOnBeijngTenData";
        hourUrl = context + "/trendChartAllShow/queryOnBeijngHourData";
        var len = $("#onTenContainer").children();
        if(len.length == 0){
            query();
        }
    });

    /**
     * 配置重点关注群体
     */
    $(document).on("click","#settingCrowd",function(){
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/trend/addOrCancelKeyAttention',
            pageLoading : true,
            title : "配置重点群体",
            width : "850px",
            height : "535px",
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

            },
            end:function(){
                location.reload(true)
            }
        });
    });

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
     * 查询所有重点关注群体
     */
    function queryKeyAttentionCrowd(){
        $.ajax({
            url: context + '/crowdManage/queryKeyAttentionCrowd',
            type: "post",
            dataType: "json",
            async : true,
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (data) {
                isKeyAttentions = data.isKeyAttentions;
                if(isKeyAttentions == null || isKeyAttentions.length == 0){
                    window.top.$.layerAlert.alert({icon:0, closeBtn:false, msg:"请点击“配置重点关注群体”按钮配置重点关注群体"});
                }else{
                    $.select2.empty("#keyAttentionCrowd");
                    $.select2.addByList("#keyAttentionCrowd", isKeyAttentions,"code", "name");
                    $.select2.val("#keyAttentionCrowd","");
                    $.each(isKeyAttentions,function(i,val){
                        setChartDataSource(val.code,val.name);
                    })
                }

            }
        });
    }


    /**
     * 为图表设置数据源
     * @param code 群体编码/群体类型编码
     * @param name 群体名称/群体类型名称
     */
    function setChartDataSource(code,name){
        queryTenData(code,name);
        query24HourData(code,name);
    }

    /**
     * 查询近十日轨迹信息
     * @param keyAttentionCrowd 重点关注群体 code
     */
    function queryTenData(keyAttentionCrowd,name){
        // 近十日折线图
        var tenHtml = '<div class="col-xs-6">' +
            '<div id='+tenId+keyAttentionCrowd+' class="chart-box"></div>' +
            '</div>';
        $("#"+tenId).append(tenHtml);
        $.ajax({
            url: teanUrl,
            type: "post",
            dataType: "json",
            data : getQueryCondition(keyAttentionCrowd),
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (data) {
                var ttc = data.traceTimeCount;
                var lineValue = data.line;
                var title = [];
                var values = [];
                $.each(ttc,function(i,val){
                    title.push($.date.timeToStr(val.time,"MM月dd日"))
                    //没有平均线
                    if($.util.isBlank(lineValue) || lineValue == 0){
                        values.push({y : val.count});
                    }else{
                        var surpass = (val.count -lineValue) / lineValue;
                        if(surpass <= 0.2){
                            values.push({y : val.count})
                        }else if(surpass > 0.2 && surpass <= 0.5){
                            values.push({y : val.count, color : '#eada0f'})
                        }else{
                            values.push({y : val.count, color : '#ff0000'})
                        }
                    }
                });
                $('#'+tenId+keyAttentionCrowd).highcharts({
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: name+" 均线值:"+lineValue
                    },
                    xAxis: {
                        categories: title,
                        title: {
                            enabled: false
                        }
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
                        plotLines: [{
                            color: '#e28e10',
                            width: 2,
                            value: lineValue,
                            zIndex: 2,
                            label: {
                                text : average+"日均值：" + lineValue,
                                style: {
                                    color: '#fff'
                                }
                            }
                        }]
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'top',
                    },
                    tooltip: {
                        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
                    },
                    series: [{
                        name: '数量',
                        // color: '#ffb980',
                        data:
                            values

                        // [99, 58, 69, 120, 45, 180, 220, 140, 60, 88]
                    }]
                });

            }
        });
    }

    /**
     * 查询24小时轨迹信息
     * @param keyAttentionCrowd 重点关注群体 code
     */
    function query24HourData(keyAttentionCrowd,name){
        // 近24小时折线图
        var hourHtml = '<div class="col-xs-6">' +
            '<div id='+hourId+keyAttentionCrowd+' class="chart-box"></div>' +
            '</div>';
        $("#"+hourId).append(hourHtml);
        $.ajax({
            url : hourUrl,
            type : "post",
            dataType : "json",
            data : getQueryCondition(keyAttentionCrowd),
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (data) {
                var ttc = data.traceTimeCount;
                var title = [];
                var values = [];
                $.each(ttc,function(i,val){
                    title.push($.date.timeToStr(val.time,"dd日HH时"))
                    values.push({y : val.count});
                });
                $('#'+hourId+keyAttentionCrowd).highcharts({
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: name
                    },
                    xAxis: {
                        categories: title,
                        title: {
                            enabled: false
                        }
                    },
                    yAxis: {
                        title: {
                            text: null
                        }
                    },
                    legend: {
                        enabled: false,
                        align: 'right',
                        verticalAlign: 'top',
                    },
                    tooltip: {
                        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
                    },
                    series: [{
                        name: '数量',
                        data: values
                    }]
                });
            }
        });
    }

    /**
     * 获取查询条件
     */
    function getQueryCondition(keyAttentionCrowd){
        var averageValue = null;    //均线long值
        var tenDayValues = null;    //十日中复选框值
        var hourValues = null;      //24小时中复选框值
        var vip = false; //不是重点人
        var includeResidentAndTemporary = true; //不排除常暂口
        //a 查询所有类型的人，包括常暂口  b 查询所有类型的人，排除常暂口
        //c 只查询重点人，包括常暂口  d 查询重点人，不包括常暂口
        switch (getPersonTypeValue()){
            case "a" : vip = false,includeResidentAndTemporary = true
                break;
            case "b" : vip = false,includeResidentAndTemporary = false
                break;
            case "c" : vip = true,includeResidentAndTemporary = true
                break;
            case "d" : vip = true,includeResidentAndTemporary = false
                break;
        }
        if(toBeijingTabs){  //当前查询进京页签
            averageValue = getToBeijingAverageValue();
            tenDayValues = getIcheckArrValue(getToBeijingTenDayValues());
            hourValues = getIcheckArrValue(getToBeijing24hourValues());

        }else if(onBeijingTabs){    //当前查询在京页签
            averageValue = getOnBeijingAverageValue();
            tenDayValues = getIcheckArrValue(getOnBeijingTenDayValues());
            hourValues = getIcheckArrValue(getOnBeijing24hourValues());
        }else{                      //当前页签为预警消息 点击查询 刷新页面
            location.reload(true);
            return;
        }
        var obj = {
            startTimeLong : getTenDayStartTimeLong(),
            endTimeLong : getEndTimeLong(),
            startTimeOneLong : get24HourStartTimeLong(),
            startTimeTwoLong : getEndTimeLong(),
            averageLineStartTimeLong : averageValue ,
            onBeujingTrackTypes : hourValues,
            trackTypes : tenDayValues,
            vip : vip,
            includeResidentAndTemporary : includeResidentAndTemporary,
            crowdNameCode : keyAttentionCrowd
        }

        var param = {};
        $.util.objToStrutsFormData(obj, "param", param);
        return  param;
    }

    /**
     * 获取近十日的起始时间点
     *
     * 近十日 含今天 故当前时间减去九天得到近十天得开始时间
     *
     * @returns {number}  long值
     */
    function getTenDayStartTimeLong(){
        var date = new Date($.laydate.getTime("#totalTime", "date"));
        var timeLong =  date.getTime();
        return timeLong - (1000*60*60*24*9);
    }

    /**
     * 获取 近24小时的起始时间
     * @returns {number} long值
     */
    function get24HourStartTimeLong(){
        var date = new Date($.laydate.getTime("#totalTime", "date"));
        var timeLong =  date.getTime();
        return timeLong - (1000*60*60*23);
    }

    /**
     * 获取 当前时间 （结束时间）
     * @returns {number} long值
     */
    function getEndTimeLong(){
        var date = $.laydate.getTime("#totalTime", "date");
        return $.date.endRangeByTime(date, "yyyy-MM-dd HH");
    }

    /**
     * 获取 icheck 选中的value
     * @param arr icheck选中对象数组
     * return arr
     */
    function getIcheckArrValue(icheckArray){
        var arr = [];
        $.each(icheckArray,function(i,val){
            arr.push(val.value);
        })
        return arr;
    }

    /**
     * 获取人员类型 单选框值
     */
    function getPersonTypeValue(){
       var arr = $.icheck.getChecked("person");
       return arr.length == 0 ? null : arr[0].value
    }

    /**
     * 获取进京 均线 单选框值
     * 均线含今天
     */
    function getToBeijingAverageValue(){
        var arr = $.icheck.getChecked("toBeijingAverage");
        var val = arr[0].value;
        var date = new Date($.laydate.getTime("#totalTime", "date"));
        var timeLong =  date.getTime();
        return timeLong - (1000*60*60*24*(val-1));
    }

    /**
     * 获取进京 日 检索复选框值
     */
    function getToBeijingTenDayValues(){
        return $.icheck.getChecked("toBeijingTenDay");
    }

    /**
     * 获取进京 24小时 检索复选框值
     */
    function getToBeijing24hourValues(){
        return $.icheck.getChecked("toBeijing24hour");
    }

    /**
     * 获取在京 均线 单选框值
     * 均线含今天
     */
    function getOnBeijingAverageValue(){
        var arr = $.icheck.getChecked("onBeijingAverage");
        var val = arr[0].value;
        var date = new Date($.laydate.getTime("#totalTime", "date"));
        var timeLong =  date.getTime();
        return timeLong - (1000*60*60*24*(val-1));
    }

    /**
     * 获取在京 日 检索复选框值
     */
    function getOnBeijingTenDayValues(){
        return $.icheck.getChecked("onBeijingTanDay");
    }

    /**
     * 获取在京 24小时 检索复选框值
     */
    function getOnBeijing24hourValues(){
        return $.icheck.getChecked("onBeijingHour");
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.trendChartAllShow.charts, {

    });


})(jQuery);

/**
 * 预警信息
 * @type {{}}
 */
$.trendChartAllShow.alarmMessage = $.trendChartAllShow.alarmMessage || {};
(function ($) {
    "use strict";

    var warningTable = null;
    $(document).ready(function() {
        $.laydate.setRange($.date.timeToStr(new Date().getTime(),"yyyy-MM-dd"), $.date.timeToStr(new Date().getTime(),"yyyy-MM-dd"), "#dateRangeId");
        queryRule();

    });

    /**
     * 点击预警信息页签  在初始化table
     */
    $(document).on("click","#alarmLi",function(){
        initWarningTable();
    });

    /**
     * 预警-查询
     */
    $(document).on("click","#warningQuery",function(){
        warningTable.draw();
    });
    /**
     * 预警-重置
     */
    $(document).on("click","#warningReset",function(){
        $('#all').iCheck('check');
        $.select2.val("#rule","");
        $.laydate.setRange($.date.timeToStr(new Date().getTime(),"yyyy-MM-dd"), $.date.timeToStr(new Date().getTime(),"yyyy-MM-dd"), "#dateRangeId");
        warningTable.draw();
    });

    /**
     * 标记为已读
     */
    $(document).on("click","#sign",function(){
        var arr = $.icheck.getChecked("warning") ;
        if(arr.length > 0) {
            var crowdIds = [];
            $.each(arr, function (i,val) {
                var tr = $(val).parents("tr");
                var row = warningTable.row(tr);
                var data = row.data();
                crowdIds.push(data.id);
            });
            var status= $.common.dict.DQZT_YD;
            var cpp = {"status":status,"ids":crowdIds};
            var obj = {};
            $.util.objToStrutsFormData(cpp, "queryUtilPojo", obj);
            $.ajax({
                url: context + '/comprehensiveDisplayController/uodateAlarmMessage',
                data: obj,
                type: "post",
                dataType: "json",
                customizedOpt: {
                    ajaxLoading: true,//设置是否loading
                },
                success: function (successData) {
                    warningTable.draw(true);
                }
            });
        }else {
            window.top.$.layerAlert.alert({msg:"请选择预警消息进行操作！"}) ;
            return false ;
        }
    });

    function queryRule() {
        $.ajax({
            url:context +'/comprehensiveDisplayController/findAllRule',
            type:'post',
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#rule", successData.rule, "id", "name", true, true);
            }
        });
    }

    /**
     * 预警消息table
     */
    function initWarningTable(){
        if(warningTable != null){
            warningTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/comprehensiveDisplayController/findClueByPager";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "50px",
                "title" : "选择",
                "className":"table-checkbox",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    var a = '<input type="checkbox" name="warning" class="icheckbox"  />' ;
                    return a;
                }
            },
            {
                "targets" : 1,
                "width" : "50px",
                "title" : "序号",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    return meta.row+1;
                }
            },
            {
                "targets" : 2,
                "width" : "200px",
                "title" : "预警时间",
                "data" : "alarmDateLong",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,"yyyy年MM月dd日HH:mm");
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "预警规则",
                "data" : "alarmRuleName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "预警内容",
                "data" : "alarmContent",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "50px",
                "title" : "状态",
                "data" : "statusName",
                "render" : function(data, type, full, meta) {
                    var status = '';
                    if(full.status == $.common.dict.DQZT_YD){
                        status = '<span class="state state-green2">'+data+'</span>';
                    }else{
                        status = '<span class="state state-red2">'+data+'</span>';
                    }
                    return status;
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
        //是否分页
        tb.paging = true;
        //每页条数
        tb.lengthMenu = [ 10 ];
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var arr = $.icheck.getChecked("status");
            var startTime = $.laydate.getTime("#dateRangeId","start");
            var endTime = $.laydate.getTime("#dateRangeId","start") == null ? null : $.date.strToTime($.date.endRange($.laydate.getDate("#dateRangeId","end"), "yyyy-MM-dd"),"yyyy-MM-dd");
            var obj = {
                "status":$(arr[0]).val() == "全部" ? null : $(arr[0]).val(),
                "startTimeLong": startTime,
                "endTimeLong": endTime,
                "id": $.select2.val("#rule"),
            };
            $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.alarmMessage;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
        };
        warningTable = $("#warningTable").DataTable(tb);
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.trendChartAllShow.alarmMessage, {

    });

})(jQuery);