$.activityTrackCompareResult = $.activityTrackCompareResult ||{};

(function ($) {

    "use strict";

    $(document).ready(function () {
        /**
         * 群体类型选择事件
         */
        $(document).on("select2:select","#type",function () {
            var typeId = $.select2.val("#type");
            if(typeId == $.common.dict.QTLX_SJ){
                // （完全显示互联网轨迹修改）注释掉了下行
                //$("#netInfo").show();
                $("#allNationTabs").show();
            }else{
                // （完全显示互联网轨迹修改）注释掉了下行
                //$("#netInfo").hide();
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
            // $(".main-block").show();
            $(".exportTrack").hide();

            trainTable.draw(true);
            airlineTable.draw(true);
            busTable.draw(true);
            bjPassTable.draw(true);

            hotelTable.draw(true);
            checkTable.draw(true);
            checkPointTable.draw(true);
            netbarTable.draw(true);

            noPetitionTable.draw(true);
            normalPetitionTable.draw(true);

            initGatherTrainTable();
            initGatherAirlineTable();
            initGatherHotelTable();
            initGatherCheckPointTable()
            initGatherNetbarTable();

            // （完全显示互联网轨迹修改）下面4个轨迹，原来放在if语句里
            changAnTable.draw(true);
            bookcarTable.draw(true);
            houseTable.draw(true);
            bikeTable.draw(true);
            var typeId = $.select2.val("#type");
            if(typeId == $.common.dict.QTLX_SJ){
                // foodTable.draw(true);
                // shoppingTable.draw(true);
                elenctronicTable.draw(true);
                wifiTable.draw(true);
                allNationTrainTable.draw(true);
                allNationAirlineTable.draw(true);
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
            $("#commingCount").text(0);
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
            // var petitionType = $(this).attr("hotelSpecial");
            // exportPetitionExcel([petitionType]);

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
                endTimeLong : endTimeLong
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
                trackTypeArr.push($.common.cbtt.TRAIN.traceName);
                trackTypeArr.push($.common.cbtt.PLANE.traceName);
                trackTypeArr.push($.common.cbtt.COACH.traceName);
                trackTypeArr.push($.common.cbtt.ENTER_BEIJING_PERMISSION.traceName);
                trackTypeArr.push($.common.sbtt.CHECK_POINIT.traceName);
                exportTrackExcel(trackTypeArr);
            }else if(exportType == "stayingBeijing"){
                var trackTypeArr = [];
                trackTypeArr.push($.common.sbtt.HOTEL.traceName);
                trackTypeArr.push($.common.sbtt.INSPECTION.traceName);
                trackTypeArr.push($.common.sbtt.NET_BAR.traceName);
                var typeId = $.select2.val("#type");
                if(typeId == $.common.dict.QTLX_SJ){
                    trackTypeArr.push($.common.osbtt.ELENCTRONIC_FENCE.traceName);
                    trackTypeArr.push($.common.osbtt.WIFI_FENCE.traceName);
                    // trackTypeArr.push($.common.osbtt.TAKE_OUT_FOOD.traceName);
                    trackTypeArr.push($.common.osbtt.DATA_CA.traceName);
                    trackTypeArr.push($.common.osbtt.ONLINE_TAXI.traceName);
                    trackTypeArr.push($.common.osbtt.ONLINE_RENTING.traceName);
                    trackTypeArr.push($.common.osbtt.BKIE_SHARE.traceName);
                    // trackTypeArr.push($.common.osbtt.EXPRESS_DELIVERY.traceName);
                }
                exportTrackExcel(trackTypeArr);
            }else if(exportType == "gatherInfo"){
                var petitionTypeArr = ["gatherTrain", "gatherAirline", "gatherHotel", "gatherNetbar","gatherCheckPoint"];
                exportGatherExcel(petitionTypeArr);
            }else if(exportType == 'allNationTrack'){
                var allNationTypeArr = ["allNationTrain", "allNationAirline", "allNationChangAn"];
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
        initTrainTable();
        initAirlineTable();
        initBusTable();
        initBjPassTable();
        //初始化在京轨迹
        initHotelTable();
        initCheckTable();
        initCheckPointTable();
        initNetbarTable();
        //初始化在京互联网轨迹
        // initFoodTable();
        initChangAnTable();
        initBookcarTable();
        initHouseTable();
        initBikeTable();
        // initShoppingTable();
        initElenctronicTable();
        initWifiTable();
        //初始化上访情况
        initNoPetitionTable();
        initNormalPetitionTable();
        //初始化聚团情况
        initGatherTrainTable();
        initGatherAirlineTable();
        initGatherHotelTable();
        initGatherNetbarTable();
        initGatherCheckPointTable()
        //初始化全国轨迹数据
        initAllNationTrainTable();
        initAllNationAirlineTable();
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
        $(".electronicRail").attr("trackType", $.common.osbtt.ELENCTRONIC_FENCE.traceName);
        $(".wifiRail").attr("trackType", $.common.osbtt.WIFI_FENCE.traceName);
        $(".food").attr("trackType", $.common.osbtt.TAKE_OUT_FOOD.traceName);
        $(".changAn").attr("trackType", $.common.osbtt.DATA_CA.traceName);
        $(".bookcar").attr("trackType", $.common.osbtt.ONLINE_TAXI.traceName);
        $(".house").attr("trackType", $.common.osbtt.ONLINE_RENTING.traceName);
        $(".bike").attr("trackType", $.common.osbtt.BKIE_SHARE.traceName);
        $(".shopping").attr("trackType", $.common.osbtt.EXPRESS_DELIVERY.traceName);
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
            endTimeLong : endTimeLong
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
            endTimeLong : endTimeLong
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

        gatherCount = 0;
        gatherInfoCount = 0;
        countSum = 0;

        var commingCount = 0;
        var stayingCount = 0;
        var onlineStayingCount = 0;
        var petitionInfoCount = 0;
        var allNationCount = 0;
        $("#commingCount").text(commingCount);
        $("#stayingCount").text(stayingCount);
        $("#onlineStayingCount").text(onlineStayingCount);
        $("#petitionInfoCount").text(petitionInfoCount);
        $("#gatherInfoCount").text(0);
        $("#allNationCount").text(allNationCount);
        $("#countSum").text(commingCount + stayingCount + onlineStayingCount + petitionInfoCount + gatherInfoCount);

        //根据选择的群体类型，设置互联网在京、全国轨迹总数的显示影藏
        var onlineStayingCountUrl = context +'/activityCompare/findOnlineStayingBeijingTrackCount';
        var allNationCountUrl = context +'/activityCompare/findAllNationTrackCount';
        var typeId = $.select2.val("#type");
        if(typeId == $.common.dict.QTLX_SJ){// 涉军
            $("#gatherInfoCountSuffixSpan").text(" 条，");
            // （完全显示互联网轨迹修改）注释掉了下行
            //$("#onlineStayingCountSpan").show();
            $("#allNationCountSpan").show();
        }else{
            $("#gatherInfoCountSuffixSpan").text(" 条。");
            // （完全显示互联网轨迹修改）注释掉了下行
            //$("#onlineStayingCountSpan").hide();
            $("#allNationCountSpan").hide();
            // （完全显示互联网轨迹修改）注释掉了下行
            //onlineStayingCountUrl = context +'/activityCompare/findTrackCountByFalse';
            allNationCountUrl = context +'/activityCompare/findTrackCountByFalse';
        }

        $.when(
            $.ajax({//进京轨迹总和
                url:context +'/activityCompare/findCommingBeijingTrackCount',
                data:getQueryParam(d),
                type:"post",
                dataType:"json",
                customizedOpt:{
                    ajaxLoading:false,//设置是否loading
                },
                success:function(successData){
                    commingCount = successData.count;
                    $("#commingCount").text(commingCount);
                }
            }),
            $.ajax({//在京轨迹总和
                url:context +'/activityCompare/findStayingBeijingTrackCount',
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
            $.ajax({//网络在京轨迹总和
                url:onlineStayingCountUrl,
                data:getQueryParam(d),
                type:"post",
                dataType:"json",
                customizedOpt:{
                    ajaxLoading:false,//设置是否loading
                },
                success:function(successData){
                    onlineStayingCount = successData.count;
                    $("#onlineStayingCount").text(onlineStayingCount);
                }
            }),
            $.ajax({//在京上访情况总和
                url:context +'/activityCompare/findPetitionInfoCount',
                data:getQueryParam(d),
                type:"post",
                dataType:"json",
                customizedOpt:{
                    ajaxLoading:false,//设置是否loading
                },
                success:function(successData){
                    petitionInfoCount = successData.count;
                    $("#petitionInfoCount").text(petitionInfoCount);
                }
            }),
            // $.ajax({//聚团情况总和
            //     url:context +'/activityCompare/findGatherInfoCount',
            //     data:getQueryParam(d),
            //     type:"post",
            //     dataType:"json",
            //     customizedOpt:{
            //         ajaxLoading:false,//设置是否loading
            //     },
            //     success:function(successData){
            //         gatherInfoCount = successData.count;
            //         $("#gatherInfoCount").text(gatherInfoCount);
            //     }
            // }),
            $.ajax({//全国数据总和
                url:allNationCountUrl,
                data:getQueryParam(d),
                type:"post",
                dataType:"json",
                customizedOpt:{
                    ajaxLoading:false,//设置是否loading
                },
                success:function(successData){
                    allNationCount = successData.count;
                    $("#allNationCount").text(allNationCount);
                }
            })
        ).done(function(){
            if(gatherCount == 5){
                $("#countSum").text(commingCount + stayingCount + onlineStayingCount + petitionInfoCount + gatherInfoCount + allNationCount);
            }else{
                countSum =  commingCount + stayingCount + onlineStayingCount + petitionInfoCount + allNationCount;
            }
        });

    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.activityTrackCompareResult, {
        getQueryParam : getQueryParam
    });

})(jQuery);