$.substationaActivityTrackCompareResult = $.substationaActivityTrackCompareResult ||{};

(function ($) {

    "use strict";

    $(document).ready(function () {
        /**
         * 群体类型选择事件
         */
        $(document).on("select2:select","#type",function () {
            var typeId = $.select2.val("#type");
            if(typeId == $.common.dict.QTLX_SJ){
               $("#allNationTabs").show();
            }else{
                $("#allNationTabs").hide();
                if(!$("#tabs-6").is(":hidden")){
                    $("#commingBeijingTagA").click();
                }
            }
            $.select2.empty("#name");
            findCrowdNameByTypeId(typeId);
        });

        /**
         * 查詢
         */
        $(document).on("click","#compareTrack",function () {
            var type = $.select2.val("#type");
            if($.util.isBlank(type)){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类别。",time:3000}) ;
                return ;
            }
            findThreeKindsTrackCount();
            searchActivityTrack();
        });

        /**
         * 查询轨迹表
         */
        function searchActivityTrack(){

            $(".exportTrack").hide();
            hotelTable.draw(true);
            checkTable.draw(true);
            // checkPointTable.draw(true);
            netbarTable.draw(true);


            initGatherHotelTable();
           // initGatherCheckPointTable()
            initGatherNetbarTable();

            var typeId = $.select2.val("#type");
            if(typeId == $.common.dict.QTLX_SJ){
                allNationChangAnTable.draw(true);
            }
        }


        /**
         * 重置
         */
        $(document).on("click","#reset",function () {
            $.select2.clear("#type");
            $.select2.clear("#name");
            setDefaultStartDateAndEndDate();
            $("#comparePerson_1").iCheck("check");

            searchActivityTrack();
            // $("#commingCount").text(0);
            $("#stayingCount").text(0);
            $("#onlineStayingCount").text(0);
            $("#petitionInfoCount").text(0);
            $("#gatherInfoCount").text(0);
            $("#allNationCount").text(0);
            $("#countSum").text(0);
        });

        /**
         * 户籍分布导出
         */
        $(document).on("click","#hotelSpecialExcel",function () {
            var type = $.select2.val("#type");
            if($.util.isBlank(type)){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类别。",time:3000}) ;
                return ;
            }
            var type = $.select2.val("#type");
            if($.util.isBlank(type)){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类别。",time:3000}) ;
                return ;
            }

            var endTimeLong = $.laydate.getTime("#dateRangeActivity", "end");
            endTimeLong = $.date.endRangeByTime(endTimeLong, "yyyy-MM-dd HH:mm");
            var personTypeObj = getPersonType();

            var crowdNameCode = $.select2.val("#name");
            if($.util.isBlank(crowdNameCode)){
                crowdNameCode = null;
            }else{
                type = null;
            }
            var param = {
                crowdTypeCode : type ,
                crowdNameCode : crowdNameCode ,
                includeResidentAndTemporary : personTypeObj.includeResidentAndTemporary ,
                vip : personTypeObj.vip ,
                startTimeLong : $.laydate.getTime("#dateRangeActivity", "start") ,
                endTimeLong : endTimeLong ,
                substation:true
            };

            param["trackTypes"] = "hotelSpecial";
            var obj = {};
            $.util.objToStrutsFormData(param, "param", obj);
            var form = $.util.getHiddenForm(context+'/activityCompare/exportExcelSpecialHotel', obj);
            $.util.subForm(form);

        });
        /**
         * 进京、在京单类轨迹导出
         */
        $(document).on("click",".exportTrack",function () {
            var type = $.select2.val("#type");
            if($.util.isBlank(type)){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类别。",time:3000}) ;
                return ;
            }
            var trackType = $(this).attr("trackType");
            exportTrackExcel([trackType]);
        });

        /**
         * 上访单类信息导出
         */
        $(document).on("click",".exportPetitionInfo",function () {
            var type = $.select2.val("#type");
            if($.util.isBlank(type)){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类别。",time:3000}) ;
                return ;
            }
            var petitionType = $(this).attr("petitionType");
            exportPetitionExcel([petitionType]);
        });

        /**
         * 聚团单类信息导出
         */
        $(document).on("click",".exportGatherTrack",function () {
            var type = $.select2.val("#type");
            if($.util.isBlank(type)){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类别。",time:3000}) ;
                return ;
            }
            var gatherType = $(this).attr("gatherType");
            exportGatherExcel([gatherType]);
        });

        /**
         * 全国轨迹单类信息导出
         */
        $(document).on("click",".exportAllNation",function () {
            var type = $.select2.val("#type");
            if($.util.isBlank(type)){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类别。",time:3000}) ;
                return ;
            }
            var allNationType = $(this).attr("allNationType");
            exportAllNationExcel([allNationType]);
        });

        /**
         * 上访、进京、在京、聚团、全国轨迹全部类型轨迹导出
         */
        $(document).on("click","#exportAll",function () {
            var type = $.select2.val("#type");
            if($.util.isBlank(type)){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类别。",time:3000}) ;
                return ;
            }
            var exportType = $(this).attr("exportType");
            if(exportType == "petitionInfo"){
                var petitionTypeArr = ["noPetition", "normalPetition"];
                exportPetitionExcel(petitionTypeArr);
            }else if(exportType == "commingBeijing"){
                var trackTypeArr = [];
                // trackTypeArr.push($.common.cbtt.TRAIN.traceName);
                // trackTypeArr.push($.common.cbtt.PLANE.traceName);
                // trackTypeArr.push($.common.cbtt.COACH.traceName);
                // trackTypeArr.push($.common.cbtt.ENTER_BEIJING_PERMISSION.traceName);
                trackTypeArr.push($.common.sbtt.SUPSTATION_CHECK_POINIT.traceName);
                exportTrackExcel(trackTypeArr);
            }else if(exportType == "stayingBeijing"){
                var trackTypeArr = [];
                trackTypeArr.push($.common.sbtt.SUBSTATION_HOTEL.traceName);
                trackTypeArr.push($.common.sbtt.SUBSTATION_INSPECTION.traceName);
                trackTypeArr.push($.common.sbtt.SUBSTATION_NET_BAR.traceName);
                exportTrackExcel(trackTypeArr);
            }else if(exportType == "gatherInfo"){
                //var petitionTypeArr = ["gatherHotel", "gatherNetbar","gatherCheckPoint"];
                var petitionTypeArr = ["gatherHotel", "gatherNetbar"];
                exportGatherExcel(petitionTypeArr);
            }else if(exportType == 'allNationTrack'){
                var allNationTypeArr = ["allNationChangAn"];
                exportAllNationExcel(allNationTypeArr);
            }
        });

        /**
         * tabs页签点击事件
         */
        $(document).on("click", ".tabsType", function () {
            var exportType = $(this).attr("exportType");
            var exportButName = $(this).attr("exportButName");
            $("#exportAll").attr("exportType", exportType);
            $("#exportAllButName").text(exportButName);
        });

        initPageDict();
        setDefaultStartDateAndEndDate();
        initTrackTypeValue();


        //初始化进京轨迹
        //initCheckPointTable();

        //初始化在京轨迹
        initHotelTable();
        initCheckTable();
        initNetbarTable();

        //初始化聚团情况
        initGatherHotelTable();
        initGatherNetbarTable();
       // initGatherCheckPointTable()
        
        //初始化全国轨迹数据
        initAllNationChangAnTable();
    });

    /**
     * 初始化轨迹类型多选框值
     */
    function initTrackTypeValue() {
        $(".train").attr("trackType", $.common.cbtt.TRAIN.traceName);
        $(".airline").attr("trackType", $.common.cbtt.PLANE.traceName);
        $(".bus").attr("trackType", $.common.cbtt.COACH.traceName);
        $(".bjPass").attr("trackType", $.common.cbtt.ENTER_BEIJING_PERMISSION.traceName);

        $(".hotel").attr("trackType", $.common.sbtt.HOTEL.traceName);
        $(".check").attr("trackType", $.common.sbtt.INSPECTION.traceName);
        $(".checkPoint").attr("trackType", $.common.sbtt.CHECK_POINIT.traceName);
        $(".netbar").attr("trackType", $.common.sbtt.NET_BAR.traceName);
    }

    /**
     * 获取导出Excel查询条件
     *
     * @returns {{crowdTypeCode, crowdNameCode, includeResidentAndTemporary: 是否不包含常暂口, vip: 是否重点人, startTimeLong: (number|*), endTimeLong: (number|*)}}
     */
    function getExportQueryParam(){
        var type = $.select2.val("#type");
        if($.util.isBlank(type)){
            $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类别。",time:3000}) ;
            return ;
        }

        var endTimeLong = $.laydate.getTime("#dateRangeActivity", "end");
        endTimeLong = $.date.endRangeByTime(endTimeLong, "yyyy-MM-dd HH:mm");
        var personTypeObj = getPersonType();

        var crowdNameCode = $.select2.val("#name");
        if($.util.isBlank(crowdNameCode)){
            crowdNameCode = null;
        }else{
            type = null;
        }
        var param = {
            crowdTypeCode : type ,
            crowdNameCode : crowdNameCode ,
            includeResidentAndTemporary : personTypeObj.includeResidentAndTemporary ,
            vip : personTypeObj.vip ,
            startTimeLong : $.laydate.getTime("#dateRangeActivity", "start") ,
            endTimeLong : endTimeLong,
            substation:true,
        };
        return param;
    }

    /**
     * 导出轨迹Excel
     *
     * @param trackTypeArr 轨迹类型数组
     */
    function exportTrackExcel(trackTypeArr){
        var param = getExportQueryParam();
        param["trackTypes"] = trackTypeArr;
        var obj = {};
        $.util.objToStrutsFormData(param, "param", obj);
        var form = $.util.getHiddenForm(context+'/activityCompare/exportExcelTrack', obj);
        $.util.subForm(form);
    }

    /**
     * 导出上访情况Excel
     *
     * @param trackTypeArr 上访情况类型数组
     */
    function exportPetitionExcel(trackTypeArr){
        var param = getExportQueryParam();
        param["trackTypes"] = trackTypeArr;
        var obj = {};
        $.util.objToStrutsFormData(param, "param", obj);
        var form = $.util.getHiddenForm(context+'/activityCompare/exportExcelPetition', obj);
        $.util.subForm(form);
    }

    /**
     * 导出聚团情况Excel
     *
     * @param trackTypeArr 上访情况类型数组
     */
    function exportGatherExcel(trackTypeArr){
        var param = getExportQueryParam();
        param["trackTypes"] = trackTypeArr;
        var obj = {};
        $.util.objToStrutsFormData(param, "param", obj);
        var form = $.util.getHiddenForm(context+'/activityCompare/exportExcelGather', obj);
        $.util.subForm(form);
    }

    /**
     * 导出全国轨迹Excel
     *
     * @param trackTypeArr 轨迹类型数组
     */
    function exportAllNationExcel(trackTypeArr){
        var param = getExportQueryParam();
        param["trackTypes"] = trackTypeArr;
        var obj = {};
        $.util.objToStrutsFormData(param, "param", obj);
        var form = $.util.getHiddenForm(context+'/activityCompare/exportExcelAllNation', obj);
        $.util.subForm(form);
    }

    /**
     * 获取人员选择结果
     *
     * @returns {{includeResidentAndTemporary: 是否不包含常暂口, vip: 是否重点人}}
     */
    function getPersonType() {
        var comparePersonArr = $.icheck.getChecked("comparePerson");
        var comparePerson = $(comparePersonArr[0]).val();
        var includeResidentAndTemporary = true;
        var vip = false;
        if(comparePerson == "all"){
            includeResidentAndTemporary = true;
            vip = false;
        }else if(comparePerson == "allPart"){
            includeResidentAndTemporary = false;
            vip = false;
        }else if(comparePerson == "backbone"){
            includeResidentAndTemporary = true;
            vip = true;
        }else if(comparePerson == "backbonePart"){
            includeResidentAndTemporary = false;
            vip = true;
        }
        return {
            includeResidentAndTemporary : includeResidentAndTemporary ,
            vip : vip
        }
    }

    /**
     * 获取查询参数
     *
     * @param 已有查询参数对象
     */
    function getQueryParam(d) {
        var personTypeObj = getPersonType();
        var endTimeLong = $.laydate.getTime("#dateRangeActivity", "end");
        endTimeLong = $.date.endRangeByTime(endTimeLong, "yyyy-MM-dd HH:mm");

        var type = $.select2.val("#type");
        var crowdNameCode = $.select2.val("#name");
        if($.util.isBlank(crowdNameCode)){
            crowdNameCode = null;
        }else{
            type = null;
        }
        var param = {
            crowdTypeCode : type ,
            crowdNameCode : crowdNameCode ,
            length : d.length ,
            start : d.start ,
            includeResidentAndTemporary : personTypeObj.includeResidentAndTemporary ,
            vip : personTypeObj.vip ,
            startTimeLong : $.laydate.getTime("#dateRangeActivity", "start") ,
            endTimeLong : endTimeLong,
            substation : true,
        };
        $.util.objToStrutsFormData(param, "param", d);
        return d;
    }

    /**
     * 设置默认开始结束时间
     */
    function setDefaultStartDateAndEndDate() {
        var nowDate = new Date();
        var startDateLong = nowDate.getTime() - 1000*60*60*24;
        var startDateStr = $.date.timeToStr(startDateLong, "yyyy-MM-dd");
        var endDateStr = $.date.dateToStr(nowDate, "yyyy-MM-dd HH:mm");
        $.laydate.setRange(startDateStr + " 22:00", endDateStr, "#dateRangeActivity");
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
     * 统计符合条件三种类型轨迹的总数
     */
    function findThreeKindsTrackCount() {
        var d = {
            start : 0 ,
            length : 0
        }
        gatherCountNum = 0;
        gatherCount = 0;
        gatherInfoCount = 0;
        countSum = 0;

       // var commingCount = 0;
        var stayingCount = 0;
        var allNationCount = 0;
       // $("#commingCount").text(commingCount);
        $("#stayingCount").text(stayingCount);
        $("#allNationCount").text(allNationCount);
        $("#gatherInfoCount").text(0);
        $("#countSum").text(0);
        var allNationCountUrl = context +'/activityCompare/findSubstationAllNationTrackCount';
        var typeId = $.select2.val("#type");
        if(typeId == $.common.dict.QTLX_SJ){// 涉军
            $("#gatherInfoCountSuffixSpan").text(" 条，");
            $("#allNationCountSpan").show();
        }else{
            $("#gatherInfoCountSuffixSpan").text(" 条。");
            $("#allNationCountSpan").hide();
            allNationCountUrl = context +'/activityCompare/findTrackCountByFalse';
        }

        $.when(
            // $.ajax({//进京轨迹总和
            //     url:context +'/activityCompare/findSubstationCommingBeijingTrackCount',
            //     data:getQueryParam(d),
            //     type:"post",
            //     dataType:"json",
            //     customizedOpt:{
            //         ajaxLoading:false,//设置是否loading
            //     },
            //     success:function(successData){
            //         commingCount = successData.count;
            //         $("#commingCount").text(commingCount);
            //     }
            // }),
            $.ajax({//在京轨迹总和
                url:context +'/activityCompare/findSubstationStayingBeijingTrackCount',
                data:getQueryParam(d),
                type:"post",
                dataType:"json",
                customizedOpt:{
                    ajaxLoading:false,//设置是否loading
                },
                success:function(successData){
                    stayingCount = successData.count;
                    $("#stayingCount").text(stayingCount);
                }
            }),
            $.ajax({//全国数据总和
                url: allNationCountUrl,
                data: getQueryParam(d),
                type: "post",
                dataType: "json",
                customizedOpt: {
                    ajaxLoading: false,//设置是否loading
                },
                success: function (successData) {
                    allNationCount = successData.count;
                    $("#allNationCount").text(allNationCount);
                }
            })
        ).done(function(){
            if(gatherCount == gatherCountNum){
                $("#countSum").text( stayingCount + allNationCount + gatherInfoCount );
            }else{
                countSum =  stayingCount + allNationCount ;
            }
        });

    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.substationaActivityTrackCompareResult, {
        getQueryParam : getQueryParam
    });

})(jQuery);