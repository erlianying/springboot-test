(function($){
    "use strict";

    var queryStatus = "fullQuery";
    var clueTable = null;
    var fullQuery = true;
    var otherQuery = "clueQuery";
    var qtlb = [];

    //综合查询字典项初始化状态
    var undefinedStartTimeInitStatus = false;
    var involveCrowdInitStatus = false;
    var sourceUnitInitStatus = false;
    var targetSiteInitStatus = false;
    var wayOfActInitStatus = false;
    var statusInitStatus = false;
    var clueTypeInitStatus = false;
    var sourceInitStatus = false;
    var levelInitStatus = false;
    var sensitiveInfoInitStatus = false;
    var happenedAndSeverityBehaviourInitStatus = false;
    var tranContent = "";

    $(document).ready(function() {

        events();
        //如果是综合查询，返回回来自动打开综合查询条件输入区域
        if($("#queryStatusInput").val() == "fullQuery"){
            $("#queryStatusInput").val("fullQuery");
            initData();
            initClueTable();
        }else if($("#queryStatusInput").val() == "clueQuery"){
            $(".fullQuery").click();
            $("#queryStatusInput").val("clueQuery");
            initData();
        }else if($("#queryStatusInput").val() == "personQuery"){
            $(".fullQuery").click();
            $(".personQuery").click();
            $("#queryStatusInput").val("personQuery");
            initData();
        }else if($("#queryStatusInput").val() == "feedbackQuery"){
            $(".fullQuery").click();
            $(".feedbackQuery").click();
            $("#queryStatusInput").val("feedbackQuery");
            initData();
        }else{
            initData();
            initClueTable();
        }
    });

    function events(){

        $(document).on("click",".btnView",function() {
            $("#useLastPage").val("true");
            window.location = context + '/show/page/web/crowd/viewClueLayer?clueId=' + $(this).attr("ClueId") + '&&tranContent=' + $.util.encode(tranContent);
        });

        $(document).on("dblclick","table.table-select tbody tr",function(){
            var clueId = $($($(this).find("td")[0]).find("span")[0]).attr("clueId");
            if(!$.util.isBlank(clueId)){
                $("#useLastPage").val("true");
                window.location = context + '/show/page/web/clue/viewClueLayer?clueId=' + clueId + '&&tranContent=' + $.util.encode(tranContent);
            }
        });


        $(document).on("keyup", "#involveCrowdQuery",function(){
            var str = "";
            if($.util.isBlank($(this).val())){
                for(var i in qtlb){
                    str += "<li>" + qtlb[i] + "</li>";
                }
            }else{
                for(var i in qtlb){
                    if(-1 != qtlb[i].indexOf($(this).val())){
                        str += "<li>" + qtlb[i] + "</li>";
                    }
                }
            }
            $(".involveCrowdQueryUl").empty();
            $(".involveCrowdQueryUl").append(str);
        })




        $(document).on("click", "#laydate_clear",function(){
            $("#startTimeInput").val("指向时间");
        })



        $(document).on("click",".query",function(){
            initClueTable();
        });
        $(document).on("click",".fullQuery",function(){
            if(fullQuery == true){
                fullQuery = false;
                queryStatus = otherQuery;
                $(".keyQueryObject").hide();
            }else{
                fullQuery = true;
                queryStatus = "fullQuery";
                $(".keyQueryObject").show();
            }
        });
        $(document).on("click",".clueQuery",function(){
            otherQuery = "clueQuery";
            queryStatus = "clueQuery";
        });
        $(document).on("click",".personQuery",function(){
            otherQuery = "personQuery";
            queryStatus = "personQuery";
        });
        $(document).on("click",".feedbackQuery",function(){
            otherQuery = "feedbackQuery";
            queryStatus = "feedbackQuery";
        });
        $(document).on("select2:select","#sourceUnitOne",function(){
            $.ajax({
                url:context +'/clue/findSourceUnit',
                type:'post',
                data:{groupType : $.select2.val("#sourceUnitOne")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#sourceUnitTwo", true);
                    $.select2.addByList("#sourceUnitTwo", successData, "id", "name", true, true);
                }
            });
        });
        $(document).on("select2:unselect","#sourceUnitOne",function(){
            $.select2.empty("#sourceUnitTwo", true);
        });
        $(document).on("select2:select","#targetSiteOne, #targetSiteTwo",function(){
            var tsType = $("#targetSiteOne").select2("val");
            var tsArea = $("#targetSiteTwo").select2("val");
            $.select2.empty("#targetSiteThree");
            if($.util.isBlank(tsType) || $.util.isBlank(tsType)){
                return;
            }
            $.ajax({
                url:context +'/clue/findTargetSiteByTypeAndArea',
                type:'post',
                data:{tsType : tsType,
                    tsArea : tsArea},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#targetSiteThree", true);
                    $.select2.addByList("#targetSiteThree", successData, "id", "name", true, true);
                }
            });
        });
        $(document).on("select2:unselect","#targetSiteOne, #targetSiteTwo",function(){
            $.select2.empty("#targetSiteThree", true);
        });
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
        $(document).on("select2:select","#wayOfActOne",function(){
            $.ajax({
                url:context +'/dictionary/findDictionaryItemsByParentId',
                type:'post',
                data:{parentId : $.select2.val("#wayOfActOne")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#wayOfActTwo", true);
                    $.select2.addByList("#wayOfActTwo", successData, "id", "name", true, true);
                }
            });
        });
        $(document).on("select2:unselect","#wayOfActOne",function(){
            $.select2.empty("#wayOfActTwo", true);
        });
    }

    function initData(){
        //控件数据初始化
        $.ajax({
            url:context +'/clue/findAllCrowdName',
            type:'post',
            data:{},
            dataType:'json',
            success:function(successData){
                qtlb = successData;
                var str = "";
                for(var i in qtlb){
                    str += "<li>" + qtlb[i] + "</li>";
                }
                $(".involveCrowdQueryUl").empty();
                $(".involveCrowdQueryUl").append(str);
            }
        });

        //获取上次查询条件
        var undefinedStartTimeInput = $("#undefinedStartTimeInput").val();
        undefinedStartTimeInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_SF},
            dataType:'json',
            success:function(successData){
                for(var i in successData){
                    if(successData[i].id == $.common.dict.SF_S){
                        successData[i].name = "确定";
                    }
                    if(successData[i].id == $.common.dict.SF_F){
                        successData[i].name = "不确定";
                    }
                }
                $.select2.addByList("#undefinedStartTime", successData, "id", "name", true, true);
                if(!$.util.isBlank(undefinedStartTimeInput)){
                    $.select2.val("#undefinedStartTime", undefinedStartTimeInput);
                    $("#undefinedStartTimeInput").val(undefinedStartTimeInput);
                }
                undefinedStartTimeInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                if($("#queryStatusInput").val() == "clueQuery" || $("#queryStatusInput").val() == "personQuery" || $("#queryStatusInput").val() == "feedbackQuery"){
                    verifyDictInitStatusAndSearch();
                }
            }
        });
        //获取上次查询条件
        var clueTypeInput = $("#clueTypeInput").val();
        clueTypeInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_XSLB},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#clueType", successData, "id", "name", true, true);
                if(!$.util.isBlank(clueTypeInput)){
                    $.select2.val("#clueType", clueTypeInput);
                    $("#clueTypeInput").val(clueTypeInput);
                }
                clueTypeInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                if($("#queryStatusInput").val() == "clueQuery" || $("#queryStatusInput").val() == "personQuery" || $("#queryStatusInput").val() == "feedbackQuery"){
                    verifyDictInitStatusAndSearch();
                }
            }
        });
        //获取上次查询条件
        var sourceInput = $("#sourceInput").val();
        sourceInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_HQFS},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#source", successData, "id", "name", true, true);
                if(!$.util.isBlank(sourceInput)){
                    $.select2.val("#source", sourceInput);
                    $("#sourceInput").val(sourceInput);
                }
                sourceInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                if($("#queryStatusInput").val() == "clueQuery" || $("#queryStatusInput").val() == "personQuery" || $("#queryStatusInput").val() == "feedbackQuery"){
                    verifyDictInitStatusAndSearch();
                }
            }
        });
        //获取上次查询条件
        var levelInput = $("#levelInput").val();
        levelInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_QBJB},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#level", successData, "id", "name", true, true);
                if(!$.util.isBlank(levelInput)){
                    $.select2.val("#level", levelInput);
                    $("#levelInput").val(levelInput);
                }
                levelInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                if($("#queryStatusInput").val() == "clueQuery" || $("#queryStatusInput").val() == "personQuery" || $("#queryStatusInput").val() == "feedbackQuery"){
                    verifyDictInitStatusAndSearch();
                }
            }
        });
        //获取上次查询条件
        var sensitiveInfoInput = $("#sensitiveInfoInput").val();
        sensitiveInfoInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_MGZX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#sensitiveInfo", successData, "id", "name", true, true);
                if(!$.util.isBlank(sensitiveInfoInput)){
                    $.select2.val("#sensitiveInfo", sensitiveInfoInput);
                    $("#sensitiveInfoInput").val(sensitiveInfoInput);
                }
                sensitiveInfoInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                if($("#queryStatusInput").val() == "clueQuery" || $("#queryStatusInput").val() == "personQuery" || $("#queryStatusInput").val() == "feedbackQuery"){
                    verifyDictInitStatusAndSearch();
                }
            }
        });
        //获取上次查询条件
        var sourceUnitOneInput = $("#sourceUnitOneInput").val();
        var sourceUnitTwoInput = $("#sourceUnitTwoInput").val();
        sourceUnitInitStatus = false;
        $.ajax({
            url:context +'/clue/findSourceUnitDictByOneLevelAndTwoLeveCode',
            type:'post',
            data:{oneCode : $.common.dict.TYPE_LYDWFZ, twoCode : sourceUnitOneInput},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#sourceUnitOne", true);
                $.select2.addByList("#sourceUnitOne", successData.oneDis, "id", "name", true, true);
                //应对返回页面的情况设置默认值
                if(!$.util.isBlank(sourceUnitOneInput)){
                    $.select2.val("#sourceUnitOne", sourceUnitOneInput);
                    $.select2.addByList("#sourceUnitTwo", successData.twoDis, "id", "name", true, true);
                    $("#sourceUnitOneInput").val(sourceUnitOneInput);
                    if(!$.util.isBlank(sourceUnitTwoInput)){
                        $.select2.val("#sourceUnitTwo", sourceUnitTwoInput);
                        $("#sourceUnitTwoInput").val(sourceUnitTwoInput);
                    }
                }
                sourceUnitInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                if($("#queryStatusInput").val() == "clueQuery" || $("#queryStatusInput").val() == "personQuery" || $("#queryStatusInput").val() == "feedbackQuery"){
                    verifyDictInitStatusAndSearch();
                }
            }
        });
        //获取上次查询条件
        var targetSiteOneInput = $("#targetSiteOneInput").val();
        var targetSiteThreeInput = $("#targetSiteThreeInput").val();
        targetSiteInitStatus = false;
        $.ajax({
            url:context +'/clue/findTargetSiteDictByOneLevelAndTwoLeveCode',
            type:'post',
            data:{oneCode : $.common.dict.TYPE_ZXDDLX, twoCode : targetSiteOneInput},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#targetSiteOne", successData.oneDis, "id", "name", true, true);
                //应对返回页面的情况设置默认值
                if(!$.util.isBlank(targetSiteOneInput)){
                    $.select2.val("#targetSiteOne", targetSiteOneInput);
                    $.select2.addByList("#targetSiteThree", successData.twoDis, "id", "name", true, true);
                    $("#targetSiteOneInput").val(targetSiteOneInput);
                    if(!$.util.isBlank(targetSiteThreeInput)){
                        var id = "";
                        if($.util.exist(successData.twoDis)){
                            $.each(successData.twoDis,function(i,val){
                                if(val.name == targetSiteThreeInput){
                                    id = val.id;
                                    return false;
                                }
                            });
                        }
                        $.select2.val("#targetSiteThree", [id]);
                        $("#targetSiteThreeInput").val(targetSiteThreeInput);
                    }
                }
                targetSiteInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                if($("#queryStatusInput").val() == "clueQuery" || $("#queryStatusInput").val() == "personQuery" || $("#queryStatusInput").val() == "feedbackQuery"){
                    verifyDictInitStatusAndSearch();
                }
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_ZXDDQY},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#targetSiteTwo", successData, "id", "name", true, true);
            }
        });
        //获取上次查询条件
        var statusInput = $("#statusInput").val();
        statusInitStatus = false;
        var arrStatus = [];
        var statusOption = {
            id : "xszt0000",
            name : "未办结"
        }
        arrStatus.push(statusOption);
        statusOption = {
            id : "xszt0003",
            name : "已办结"
        }
        arrStatus.push(statusOption);
        $.select2.addByList("#status", arrStatus, "id", "name", true, true);
        if(!$.util.isBlank(statusInput)){
            $.select2.val("#status", statusInput);
            $("#statusInput").val(statusInput);
        }
        statusInitStatus = true;
        //如果是综合查询，验证条件是否都初始化完成
        if($("#queryStatusInput").val() == "clueQuery" || $("#queryStatusInput").val() == "personQuery" || $("#queryStatusInput").val() == "feedbackQuery"){
            verifyDictInitStatusAndSearch();
        }
        //获取上次查询条件
        var involveCrowdOneInput = $("#involveCrowdOneInput").val();
        var involveCrowdTwoInput = $("#involveCrowdTwoInput").val();
        involveCrowdInitStatus = false;
        $.ajax({
            url:context +'/clue/findDictByOneLevelAndTwoLeveCode',
            type:'post',
            data:{oneCode : $.common.dict.TYPE_QTLX, twoCode : involveCrowdOneInput},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#involveCrowdOne", successData.oneDis, "id", "name", true, true);
                //应对返回页面的情况设置默认值
                if(!$.util.isBlank(involveCrowdOneInput)){
                    $.select2.val("#involveCrowdOne", involveCrowdOneInput);
                    $.select2.addByList("#involveCrowdTwo", successData.twoDis, "id", "name", true, true);
                    $("#involveCrowdOneInput").val(involveCrowdOneInput);
                    if(!$.util.isBlank(involveCrowdTwoInput)){
                        $.select2.val("#involveCrowdTwo", involveCrowdTwoInput);
                        $("#involveCrowdTwoInput").val(involveCrowdTwoInput);
                    }
                }
                involveCrowdInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                if($("#queryStatusInput").val() == "clueQuery" || $("#queryStatusInput").val() == "personQuery" || $("#queryStatusInput").val() == "feedbackQuery"){
                    verifyDictInitStatusAndSearch();
                }
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_SFZJ},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#inBeijing", successData, "id", "name", true, true);
            }
        });
        //获取上次查询条件
        var wayOfActOneInput = $("#wayOfActOneInput").val();
        var wayOfActTwoInput = $("#wayOfActTwoInput").val();
        wayOfActInitStatus = false;
        $.ajax({
            url:context +'/clue/findDictByOneLevelAndTwoLeveCode',
            type:'post',
            data:{oneCode : $.common.dict.TYPE_XWFS, twoCode : wayOfActOneInput},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#wayOfActOne", successData.oneDis, "id", "name", true, true);
                //应对返回页面的情况设置默认值
                if(!$.util.isBlank(wayOfActOneInput)){
                    $.select2.val("#wayOfActOne", wayOfActOneInput);
                    $.select2.addByList("#wayOfActTwo", successData.twoDis, "id", "name", true, true);
                    $("#wayOfActOneInput").val(wayOfActOneInput);
                    if(!$.util.isBlank(wayOfActTwoInput)){
                        $.select2.val("#wayOfActTwo", wayOfActTwoInput);
                        $("#wayOfActTwoInput").val(wayOfActTwoInput);
                    }
                }
                wayOfActInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                if($("#queryStatusInput").val() == "clueQuery" || $("#queryStatusInput").val() == "personQuery" || $("#queryStatusInput").val() == "feedbackQuery"){
                    verifyDictInitStatusAndSearch();
                }
            }
        });
        //获取上次查询条件
        var happenedInput = $("#happenedInput").val();
        var severityBehaviourInput = $("#severityBehaviourInput").val();
        happenedAndSeverityBehaviourInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_SF},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#happened", successData, "id", "name", true, true);
                if(!$.util.isBlank(happenedInput)){
                    $.select2.val("#happened", happenedInput);
                    $("#happenedInput").val(happenedInput);
                }
                $.select2.addByList("#severityBehaviour", successData, "id", "name", true, true);
                if(!$.util.isBlank(severityBehaviourInput)){
                    $.select2.val("#severityBehaviour", severityBehaviourInput);
                    $("#severityBehaviourInput").val(severityBehaviourInput);
                }
                happenedAndSeverityBehaviourInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                if($("#queryStatusInput").val() == "clueQuery" || $("#queryStatusInput").val() == "personQuery" || $("#queryStatusInput").val() == "feedbackQuery"){
                    verifyDictInitStatusAndSearch();
                }
            }
        });
    }

    /**
     * 初始化线索表
     */
    function initClueTable(){
        if(clueTable != null){
            clueTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        var functionName = "";
        if(queryStatus == "fullQuery"){
            functionName = "/clue/findCluePageByFull";
        }else if(queryStatus == "clueQuery"){
            functionName = "/clue/findCluePageByClue";
        }else if(queryStatus == "personQuery"){
            functionName = "/clue/findCluePageByPerson";
        }else if(queryStatus == "feedbackQuery"){
            functionName = "/clue/findCluePageByFeedback";
        }
        if($("#useLastPage").val() == "true"){
            tb.displayStart = $("#pageStart").val();
            $("#useLastPage").val(false);
        }
        tb.ajax.url = context + functionName;
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "录入时间",
                "data" : "writeTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd <br/>HH:mm:ss");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "线索内容",
                "data" : "content",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        if(data.length > 12){
                            var str = '<div class="fi-ceng-out">' + data.substr(0,12) + '...' +
                                '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                            return str;
                        }else{
                            return data;
                        }
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "操作",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    var str = '<a href="###" class="btn btn-default btn-xs btnView" clueId=' + data + ">查看</a>";
                    return str;
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
        //每页条数
        tb.lengthMenu = [ 10 ] ;
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = false ;
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            $("#queryStatusInput").val(queryStatus);
            var obj = {};
            if(queryStatus == "fullQuery"){
                obj.startTime = "指向时间"==$("#startTimeInput").val()?"":$("#startTimeInput").val();
                obj.targetSite = "指向地点"==$("#targetSiteQuery").val()?"":$("#targetSiteQuery").val();
                obj.content = "关键字"==$("#contentQuery").val()?"":$("#contentQuery").val();
                obj.involveCrowd = "群体"==$("#involveCrowdQuery").val()?"":$("#involveCrowdQuery").val();
                obj.start = d.start;
                obj.length = d.length;
                $("#pageStart").val(d.start);
                $.util.objToStrutsFormData(obj, "cqpfk", d);
                $.util.objToStrutsFormData("false", "myClue", d);
                tranContent = obj.content;
            }else if(queryStatus == "clueQuery"){
                obj.content = $("#clueContent").val();
                obj.doneTimeOneLong = $.laydate.getTime("#doneTime", "start");
                obj.doneTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#doneTime", "end"),"yyyy-MM-dd HH:mm");
                obj.undefinedStartTime = $.select2.val("#undefinedStartTime");
                $("#undefinedStartTimeInput").val(obj.undefinedStartTime);
                obj.type = $.select2.val("#clueType");
                $("#clueTypeInput").val(obj.type);
                obj.source = $.select2.val("#source");
                $("#sourceInput").val(obj.source);
                obj.level = $.select2.val("#level");
                $("#levelInput").val(obj.level);
                obj.sensitiveInfo = $.select2.val("#sensitiveInfo");
                $("#sensitiveInfoInput").val(obj.sensitiveInfo);
                obj.sourceUnitOne = $.select2.val("#sourceUnitOne");
                $("#sourceUnitOneInput").val(obj.sourceUnitOne);
                obj.sourceUnitTwo = $.select2.val("#sourceUnitTwo");
                $("#sourceUnitTwoInput").val(obj.sourceUnitTwo);
                obj.status = $.select2.val("#status");
                $("#statusInput").val(obj.status);
                obj.inBeijing = $.select2.val("#inBeijing");
                obj.targetSiteType = $.select2.val("#targetSiteOne");
                $("#targetSiteOneInput").val(obj.targetSiteType);
                obj.targetSiteArea = $.select2.val("#targetSiteTwo");
                $("#targetSiteTwoInput").val(obj.targetSiteArea);
                if($.select2.text("#targetSiteThree") != null){
                    obj.targetSiteSite = $.select2.text("#targetSiteThree")[0];
                }else{
                    obj.targetSiteSite = "";
                }
                $("#targetSiteThreeInput").val(obj.targetSiteSite);
                obj.startTimeOneLong = $.laydate.getTime("#startTime", "start");
                obj.startTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#startTime", "end"),"yyyy-MM-dd");
                obj.writeTimeOneLong = $.laydate.getTime("#writeTime", "start");
                obj.writeTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#writeTime", "end"),"yyyy-MM-dd HH:mm");
                obj.involveCrowdOne = $.select2.val("#involveCrowdOne");
                $("#involveCrowdOneInput").val(obj.involveCrowdOne);
                obj.involveCrowdTwo = $.select2.val("#involveCrowdTwo");
                $("#involveCrowdTwoInput").val(obj.involveCrowdTwo);
                obj.wayOfActOne = $.select2.val("#wayOfActOne");
                $("#wayOfActOneInput").val(obj.wayOfActOne);
                obj.wayOfActTwo = $.select2.val("#wayOfActTwo");
                $("#wayOfActTwoInput").val(obj.wayOfActTwo);
                obj.start = d.start;
                obj.length = d.length;
                $("#pageStart").val(d.start);
                $.util.objToStrutsFormData(obj, "cqp", d);
                $.util.objToStrutsFormData("false", "myClue", d);
                tranContent = obj.content;
            }else if(queryStatus == "personQuery"){
                obj.name = $("#name").val();
                obj.identityNumber = $("#identityNumber").val();
                obj.cellphoneNumber = $("#cellphoneNumber").val();
                obj.placeOfDomicile = $("#placeOfDomicile").val();
                obj.wechat = $("#wechat").val();
                obj.qqNum = $("#qqNum").val();
                obj.otherNet = $("#otherNet").val();
                obj.start = d.start;
                obj.length = d.length;
                $("#pageStart").val(d.start);
                $.util.objToStrutsFormData(obj, "rpqp", d);
                $.util.objToStrutsFormData("false", "myClue", d);
                tranContent = "";
            }else if(queryStatus == "feedbackQuery"){
                obj.happened = $.select2.val("#happened");
                $("#happenedInput").val(obj.happened);
                obj.happenedTimeOneLong = $.laydate.getTime("#happenedTime", "start");
                obj.happenedTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#happenedTime", "end"),"yyyy-MM-dd");
                obj.happenedSite = $("#happenedSite").val();
                obj.peopleQuantity = $("#peopleQuantity").val();
                obj.severityBehaviour = $.select2.val("#severityBehaviour");
                $("#severityBehaviourInput").val(obj.severityBehaviour);
                obj.situation = $("#situation").val();
                obj.timeOfDuration = $("#timeOfDuration").val();
                obj.start = d.start;
                obj.length = d.length;
                $("#pageStart").val(d.start);
                $.util.objToStrutsFormData(obj, "frqp", d);
                $.util.objToStrutsFormData("false", "myClue", d);
                tranContent = "";
            }

        };
        tb.paramsResp = function(json) {

        };
        tb.rowCallback = function(row,data, index) {

        };
        clueTable = $("#clueTable").DataTable(tb);
    }

    /**
     * 验证字典项是否都初始化完成，然后执行查询
     */
    function verifyDictInitStatusAndSearch(){
        if(undefinedStartTimeInitStatus &&
            sourceUnitInitStatus &&
            targetSiteInitStatus &&
            involveCrowdInitStatus &&
            wayOfActInitStatus &&
            statusInitStatus &&
            clueTypeInitStatus &&
            sourceInitStatus &&
            levelInitStatus &&
            sensitiveInfoInitStatus &&
            happenedAndSeverityBehaviourInitStatus){
            initClueTable();
        }
    }

})(jQuery);