$.buildReportLayer = $.buildReportLayer || {};

(function($){

    "use strict";

    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;

    $(document).ready(function() {
        /**
         * 群体类型选择事件
         */
        $(document).on("select2:select","#type",function () {
            var typeId = $.select2.val("#type");
            //setNetTrackTypeCheckboxStatus(typeId);
            $.select2.empty("#name");
            findCrowdNameByTypeId(typeId);
        });

        /**
         * 时间类型
         */
        $(document).on("ifChecked","input[name='timeRadio']",function () {
            var type = $(this).val();
            if(type == "day"){
                $("#hourTimeDiv").hide();
                $("#dayTimeDiv").show();
                $("#chartsTimeHourDiv").hide();
                $("#chartsTimeDayDiv").show();
                $("#dayTimeSelectDiv").show();
            }else if(type == "hour"){
                $("#dayTimeDiv").hide();
                $("#hourTimeDiv").show();
                $("#chartsTimeDayDiv").hide();
                $("#chartsTimeHourDiv").show();
                $("#dayTimeSelectDiv").hide();
            }
        });

        $(document).on("ifChecked","input[name='chartsTimeDay']",function () {
            var type = $(this).val();

            var endTimeLong = $.laydate.getTime("#dayTimeDiv", "end");
            var startTimeLong = endTimeLong - (type - 1) * 24 * 3600 * 1000 - 1000;

            var endTimeStr = $.date.dateToStr(new Date(endTimeLong), "yyyy-MM-dd HH");
            var startTimeStr = $.date.dateToStr(new Date(startTimeLong), "yyyy-MM-dd 00");

            $.laydate.setRange(startTimeStr, endTimeStr, "#dateRangeDay");
        });

        $(document).on("ifChecked","input[name='chartsTimeHour']",function () {
            var type = $(this).val();

            var endTimeLong = $.laydate.getTime("#hourTimeDiv", "end");
            var startTimeLong = endTimeLong - type * 3600 * 1000;

            var endTimeStr = $.date.dateToStr(new Date(endTimeLong), "yyyy-MM-dd HH");
            var startTimeStr = $.date.dateToStr(new Date(startTimeLong), "yyyy-MM-dd HH");

            $.laydate.setRange(startTimeStr, endTimeStr, "#dateRangeDay");
        });

        /**
         * 时间类型
         */
        $(document).on("ifChecked","input[name='dayTimeSelect']",function () {
            var type = $(this).val();

            if(type != ""){
                var startTimeLong = $.laydate.getTime("#dayTimeDiv", "start");
                var startTimeStr = $.date.dateToStr(new Date(startTimeLong), "yyyy-MM-dd 00");

                var endTimeLong = $.laydate.getTime("#dayTimeDiv", "end");
                var endTimeStr = $.date.dateToStr(new Date(endTimeLong), "yyyy-MM-dd " + type);

                $.laydate.setRange(startTimeStr, endTimeStr, "#dateRangeDay");
            }
        });

        //选择群体
        $(document).on("click",".addCrowdType",function(){
            var selectUnit = $.select2.val("#type");
            if(selectUnit == null || selectUnit == ""){
                window.top.$.layerAlert.alert({msg:"请先选择群体！" ,icon:"1"});
                return;
            }
            var coopLst = $(".selectCrowdDiv").find("p");
            var onlyFlag = true;

            $.each(coopLst, function(i, val){
                if(selectUnit == $(val).attr("myselect")){
                    onlyFlag = false;
                }
            });

            if(onlyFlag){
                var str = '<p class="pull-left newSelect" style="margin: 5px 25px 5px 0;" myselect="' + $.select2.val("#type") + '"><span class="m-ui-color1">' + $.select2.text("#type") + '</span>'+
                    '<button class="btn btn-default btn-xs remove"><span class="glyphicon glyphicon-remove m-ui-nogap" aria-hidden="true"></span></button></p>';
                $(".selectCrowdDiv").append(str);
            }else{
                window.top.$.layerAlert.alert({msg:"群体选择重复！" ,icon:"1"});
            }
        });
        $(document).on("click",".addCrowdName",function(){
            var selectUnit = $.select2.val("#name");
            if(selectUnit == null || selectUnit == ""){
                window.top.$.layerAlert.alert({msg:"请先选择群体！" ,icon:"1"});
                return;
            }
            var coopLst = $(".selectUnitDiv").find("p");
            var onlyFlag = true;

            $.each(coopLst, function(i, val){
                if(selectUnit == $(val).attr("myselect")){
                    onlyFlag = false;
                }
            });

            if(onlyFlag){
                var str = '<p class="pull-left newSelect" style="margin: 5px 25px 5px 0;" myselect="' + $.select2.val("#name") + '"><span class="m-ui-color1">' + $.select2.text("#name") + '</span>'+
                    '<button class="btn btn-default btn-xs remove"><span class="glyphicon glyphicon-remove m-ui-nogap" aria-hidden="true"></span></button></p>';
                $(".selectUnitDiv").append(str);
            }else{
                window.top.$.layerAlert.alert({msg:"群体选择重复！" ,icon:"1"});
            }
        });
        $(document).on("click",".remove",function(){
            $($(this).parents("p")[0]).remove();
        });

        initTrackTypeValue();
        setDefaultTime();
        initPageDict();
        initSelectedCrowd();
    });

    /**
     * 设置互联网轨迹类型选择框的状态
     *
     * @param crowdType 群体类型
     */
    function setNetTrackTypeCheckboxStatus(crowdType) {
        if(crowdType == $.common.dict.QTLX_SJ){//群体，涉军类型，展示互联网轨迹
            $(".netTrackType").show();
            $(".train").iCheck("uncheck");
        }else{
            $(".netTrackTypeCheckbox").iCheck("uncheck");
            $(".netTrackType").hide();
        }
    }

    /**
     * 设置页面默认时间
     */
    function setDefaultTime() {
        var nowDate = new Date();
        var startDayDateTime = nowDate.getTime() - 9 * 24 * 3600 * 1000 - 1000;
        var startDayDateStr = $.date.dateToStr(new Date(startDayDateTime), "yyyy-MM-dd 00")
        var endDayDateStr = $.date.dateToStr(nowDate, "yyyy-MM-dd HH")
        $.laydate.setRange(startDayDateStr, endDayDateStr, "#dateRangeDay");

        var startHourDateTime = nowDate.getTime() - (1000*60*60*24);
        var startHourDateStr = $.date.dateToStr(new Date(startHourDateTime), "yyyy-MM-dd HH")
        var endHourDateStr = $.date.dateToStr(nowDate, "yyyy-MM-dd HH")
        $.laydate.setRange(startHourDateStr, endHourDateStr, "#dateRangeHour");

        $("#createTimeLong").text($.date.dateToStr(nowDate, "yyyy年MM月dd日 HH:mm"));
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
     * 初始化页面默认字典项
     *
     * @returns
     */
    function initPageDict(){
        $.ajax({
            url:context +'/crowdManage/initPageDictionary',
            data:{},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                //设置群体类型
                var types = successData.types;
                $.select2.addByList("#type", types,"id","name",true,false);
            }
        });
    }

    /**
     * 初始化已选择群体
     */
    function initSelectedCrowd(){
        var crowdType = initData.crowdType;
        if(crowdType != null && crowdType != "") {
            var crowdTypeArr = crowdType.split(",");
            var crowdTypeNameArr = initData.crowdTypeName.split("、");
            for(var i in crowdTypeArr) {
                var str = '<p class="pull-left newSelect" style="margin: 5px 25px 5px 0;" myselect="' + crowdTypeArr[i] + '"><span class="m-ui-color1">' + crowdTypeNameArr[i] + '</span>'+
                    '<button class="btn btn-default btn-xs remove"><span class="glyphicon glyphicon-remove m-ui-nogap" aria-hidden="true"></span></button></p>';
                $(".selectCrowdDiv").append(str);
            }
        }
        var crowdName = initData.crowdName;
        if(crowdName != null && crowdName != "") {
            var crowdNameArr = crowdName.split(",");
            var crowdNameNameArr = initData.crowdNameName.split("、");
            for(var i in crowdNameArr) {
                var str = '<p class="pull-left newSelect" style="margin: 5px 25px 5px 0;" myselect="' + crowdNameArr[i] + '"><span class="m-ui-color1">' + crowdNameNameArr[i] + '</span>'+
                    '<button class="btn btn-default btn-xs remove"><span class="glyphicon glyphicon-remove m-ui-nogap" aria-hidden="true"></span></button></p>';
                $(".selectUnitDiv").append(str);
            }
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
                $.select2.addByList("#name", names,"id","name",true,false);
            }
        });
    }


    function getCrowdTypeSelected(){
        var lst = [];
        var unitLst = $(".selectCrowdDiv").find(".newSelect");
        $.each(unitLst, function(i, val){
            lst.push($(val).attr("myselect"));
        })
        return lst;
    }
    function getCrowdNameSelected(){
        var lst = [];
        var unitLst = $(".selectUnitDiv").find(".newSelect");
        $.each(unitLst, function(i, val){
            lst.push($(val).attr("myselect"));
        })
        return lst;
    }

    /**
     * 导出word报告
     */
    function saveReport(){
        var timeRadio = $($.icheck.getChecked("timeRadio")[0]).val();
        var chartsType = $($.icheck.getChecked("chartsType")[0]).val();

        var startTimeLong = $.laydate.getTime("#dayTimeDiv", "start");
        var endTimeLong = $.laydate.getTime("#dayTimeDiv", "end");
        //endTimeLong = $.date.endRangeByTime(endTimeLong, "yyyy-MM-dd");
        var chartsTime = $($.icheck.getChecked("chartsTimeDay")[0]).val();
        if(timeRadio == "hour"){
            startTimeLong = $.laydate.getTime("#hourTimeDiv", "start");
            endTimeLong = $.laydate.getTime("#hourTimeDiv", "end");
            endTimeLong = $.date.endRangeByTime(endTimeLong, "yyyy-MM-dd HH");
            chartsTime = $($.icheck.getChecked("chartsTimeHour")[0]).val();
        }
        var crowdTypeArr = getCrowdTypeSelected();
        var crowdNameArr = getCrowdNameSelected();
        if($.util.isBlank(crowdTypeArr) && $.util.isBlank(crowdNameArr)){
            $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体。"}) ;
            return ;
        }
        if($.util.isBlank(startTimeLong) || $.util.isBlank(endTimeLong)){
            $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请设置完整时间段。"}) ;
            return ;
        }

        //验证文档名称
        var demo = $.validform.getValidFormObjById("reportNameValidform") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return;
        }

        //获取群体
        var crowdTypeCodes = null;
        if($.util.exist(crowdTypeArr) && crowdTypeArr.length > 0){
            crowdTypeCodes = crowdTypeArr;
        }
        var crowdNameCodes = null;
        if($.util.exist(crowdNameArr) && crowdNameArr.length > 0){
            crowdNameCodes = crowdNameArr;
        }
        //获取选择的进京轨迹类型数组
        var commingTrackTypes = [];
        var commingTrackTypeArr = $.icheck.getChecked("commingBjTypeDay");
        $.each(commingTrackTypeArr, function (i,val) {
            commingTrackTypes.push($(val).val());
        });
        //获取选择的在京轨迹类型数组
        var stayingTrackTypes = [];
        var stayingTrackTypeArr = $.icheck.getChecked("stayingBjTypeDay");
        $.each(stayingTrackTypeArr, function (i,val) {
            stayingTrackTypes.push($(val).val());
        });
        var isInclude = false;
        if($($.icheck.getChecked("isInclude")[0]).val() == "true") {
            isInclude = true;
        }
        var obj = {};
        var param = {
            crowdTypeCodes : crowdTypeCodes ,
            crowdNameCodes : crowdNameCodes ,
            name : $("#reportName").val() ,
            timeRadio : timeRadio ,
            chartsType : chartsType ,
            startTimeLong : startTimeLong ,
            endTimeLong : endTimeLong ,
            chartsTime : chartsTime ,
            commingTrackTypes : commingTrackTypes ,
            stayingTrackTypes : stayingTrackTypes ,
            includeResidentAndTemporary : isInclude
        };
        $.util.objToStrutsFormData(param, "param", obj);
        $.util.topWindow().$.common.showOrHideLoading(true);
        $.ajax({
            url: context + "/dataDigReport/saveReportWord",
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:false,//设置是否loading
            },
            success:function(successData){
                $.util.topWindow().$.common.showOrHideLoading(false);
                var fileId = successData.attachmentId;
                if(successData.status){
                    var win = $.util.rootWindow();
                    win.$.fileId = fileId;
                    $.util.topWindow().$.layerAlert.alert({icon:6, closeBtn:false, msg:"生成文档成功。", yes:function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({icon:5, closeBtn:false, msg:"生成文档失败。", yes:function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗
                    }});
                }
            },
            error:function(errorData){
                $.util.topWindow().$.common.showOrHideLoading(false);
            }
        });
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.buildReportLayer, {
        saveReport : saveReport
    });
})(jQuery);