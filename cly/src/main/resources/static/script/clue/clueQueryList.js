(function($){
    "use strict";

    var queryStatus = "fullQuery";
    var clueTable = null;
    var fullQuery = true;
    var otherQuery = "clueQuery";
    var qtlb = [];
    var selectedLst = [];
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

        $.ajax({
            url:context +'/clue/getLoggedUnit',
            type:'post',
            dataType:'json',
            success:function(successData){
                if(successData){
                    if(successData.organizationId == "015002") {
                        $("#batchImport").show();
                        $(".modify").show();
                        $(".inform").show();
                    }
                    else {
                        $("#batchImport").remove();
                        $(".modify").remove();
                        $(".inform").remove();
                    }
                }
            }
        });

        events();
        //如果是综合查询，返回回来自动打开综合查询条件输入区域
        if( ($.util.isBlank($("#isQuery")) || $("#isQuery").val() == "" || $("#isQuery").val() == "false") && !$.util.isBlank(startTime)){
            initData();
            initClueTable();
        }else if($("#queryStatusInput").val() == "fullQuery"){
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
        $(document).on("click",".clearSelect",function() {
            selectedLst = [];
            $(".selectCount").text(selectedLst.length);
            $.icheck.check(".rowSelect",false,true);
        });
        $(document).on("ifChecked",".rowSelect",function() {
            if(selectedLst.indexOf($(this).val()) == -1){
                selectedLst.push($(this).val());
            }
            $(".selectCount").text(selectedLst.length);
        });
        $(document).on("ifUnchecked",".rowSelect",function() {
            var tempIndex = selectedLst.indexOf($(this).val());
            if(tempIndex != -1){
                selectedLst.splice(tempIndex, 1);
            }
            $(".selectCount").text(selectedLst.length);
        });
        $(document).on("click",".fixed_nine",function() {
            if($.util.isBlank($(this).val())){
                $("#laydate-hour").find("input").val("09");
            }
        });
        $(document).on("focus",".fixed_nine",function() {
            var obj = this;
            setTimeout(function(){
                if($.util.isBlank($(obj).val())){
                    $("#laydate-hour").find("input").val("09");
                }
            },200)
        });

        $(document).on("click",".btnView",function() {
            $("#useLastPage").val("true");
            window.location = context + '/show/page/web/clue/viewClue?clueId=' + $(this).attr("ClueId") + '&&tranContent=' + $.util.encode(tranContent);
        });

        $(document).on("dblclick","table tbody tr",function(){
            var clueId = $($($(this).find("td")[0]).find("span")[0]).attr("clueId");
            if(!$.util.isBlank(clueId)){
                $("#useLastPage").val("true");
                window.location = context + '/show/page/web/clue/viewClue?clueId=' + clueId + '&&tranContent=' + $.util.encode(tranContent);
            }
        });

        $(document).on("click",".check",function(){
            if(selectedLst.length != 1){
                window.top.$.layerAlert.alert({msg:"请选择一条线索！" ,icon:"1",end : function(){
                    return;
                }});
                return;
            }
            var clueId = selectedLst[0];
            $.ajax({
                url:context +'/clueFlow/checkStatus',
                type:'post',
                data:{
                    id: clueId
                },
                dataType:'json',
                success:function(successData){
                    if(successData){
                        $("#useLastPage").val("true");
                        window.location = context + "/show/page/web/clue/checkClue?clueId=" + clueId;
                    }else{
                        window.top.$.layerAlert.alert({msg:"线索已办结！" ,icon:"1",end : function(){
                            return;
                        }});
                        return;
                    }
                }
            });
        });
        $(document).on("click",".feedback",function(){
            if(selectedLst.length == 0){
                window.top.$.layerAlert.alert({msg:"请选择至少一条线索！" ,icon:"1",end : function(){
                    return;
                }});
                return;
            }
            if(selectedLst.length == 1){
                var clueId = selectedLst[0];
                $.ajax({
                    url:context +'/clueFlow/checkStatus',
                    type:'post',
                    data:{
                        id: clueId
                    },
                    dataType:'json',
                    success:function(successData){
                        if(successData){
                            $("#useLastPage").val("true");
                            window.location = context + "/show/page/web/clue/feedbackState?clueId=" + clueId;
                        }else{
                            window.top.$.layerAlert.alert({msg:"线索已办结！" ,icon:"1",end : function(){
                                return;
                            }});
                            return;
                        }
                    }
                });
                return;
            }

            var clueIds = "";
            for(var i = 0;i < selectedLst.length;++i) {
                var clueId = selectedLst[i];
                if(i != selectedLst.length - 1) {
                    clueIds += clueId + ",";
                }
                else {
                    clueIds += clueId;
                }
            }
            $.ajax({
                url:context +'/clueFlow/checkStatusList',
                type:'post',
                data:{
                    id: clueIds
                },
                dataType:'json',
                success:function(successData){
                    if(successData){
                        $("#useLastPage").val("true");
                        window.location = context + "/show/page/web/clue/feedbackStateList?clueIdList=" + clueIds;
                    }else{
                        window.top.$.layerAlert.alert({msg:"线索已办结！" ,icon:"1",end : function(){
                            return;
                        }});
                        return;
                    }
                }
            });
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

        /*******************************/
        $(document).on("click","#exportExcel",function(){
            exportExcel("full");
        })
        $(document).on("click","#exportExcelForShort",function(){
            exportExcel("short");
        })

        $(document).on("click","#batchImport",function(){
            batchImport();
        })
        $(document).on("click","#makeClueReport",function(){
            $.ajax({
                url: context + "/clueReport/saveClueReportWord",
                data:new Date(),
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
        })
        $(document).on("click","#scanImport",function(){
            scanImport();
        })
        /*******************************/



        $(document).on("click", "#laydate_clear",function(){
            $("#startTimeInput").val("指向时间");
        })

        $(document).on("click",".instructions",function(){
            if(selectedLst.length != 1){
                window.top.$.layerAlert.alert({msg:"请选择一条线索！" ,icon:"1",end : function(){
                    return;
                }});
                return;
            }
            var clueId = selectedLst[0];
            var data = {};
            window.top.$.layerAlert.dialog({
                content : context +  '/show/page/web/clue/leaderCommentLayer',
                pageLoading : true,
                title:"批示",
                width : "500px",
                height : "400px",
                shadeClose : false,
                initData:function(){
                    return $.util.exist(data)?data:{} ;
                },
                success:function(layero, index){

                },
                end:function(){
                },
                btn:["批示", "关闭"],
                callBacks:{
                    btn1:function(index, layero){
                        var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                        var instructionsBean = $.util.cloneObj(cm.getSelected());
                        if(instructionsBean == false){
                            return;
                        }
                        var dataMap = {};
                        $.util.objToStrutsFormData(instructionsBean, "instructionsBean", dataMap);
                        $.util.objToStrutsFormData(clueId, "clueId", dataMap);
                        $.ajax({
                            url:context +'/clueFlow/instructionClue',
                            type:'post',
                            data:dataMap,
                            dataType:'json',
                            success:function(successData){
                                if(successData){
                                    window.top.$.layerAlert.alert({msg:"批示成功！",icon:"1",end : function(){
                                        initData();
                                        window.top.layer.close(index);
                                    }});
                                }
                            }
                        });
                    },
                    btn2:function(index, layero){
                        window.top.layer.close(index);
                    }
                }
            });
        });

        $(document).on("click",".modify",function(){
            if(selectedLst.length != 1){
                window.top.$.layerAlert.alert({msg:"请选择一条线索！" ,icon:"1",end : function(){
                    return;
                }});
                return;
            }
            var clueId = selectedLst[0];
            if(!$.util.isBlank(clueId)){
                $("#useLastPage").val("true");
                window.location = context + '/show/page/web/clue/modifyClue?clueId=' + clueId;
            }
        });

        $(document).on("click",".endProcessing",function(){
            if(selectedLst.length != 1){
                window.top.$.layerAlert.alert({msg:"请选择一条线索！" ,icon:"1",end : function(){
                    return;
                }});
                return;
            }
            var clueId = selectedLst[0];
            $.ajax({
                url:context +'/clueFlow/checkStatus',
                type:'post',
                data:{
                    id: clueId
                },
                dataType:'json',
                success:function(successData){
                    if(successData){
                        $.ajax({
                            url:context +'/clueFlow/endProcessing',
                            type:'post',
                            data:{clueId : clueId},
                            dataType:'json',
                            success:function(successData){
                                if(successData){
                                    window.top.$.layerAlert.alert({msg:"办结成功！",icon:"1",end : function(){
                                        clueTable.draw(false);
                                    }});
                                }else{
                                    window.top.$.layerAlert.alert({msg:"办结失败，存在未布控的关联人员！",icon:"1",end : function(){
                                    }});
                                }
                            }
                        });
                    }else{
                        window.top.$.layerAlert.alert({msg:"线索已办结！" ,icon:"1",end : function(){
                            return;
                        }});
                        return;
                    }
                }
            });
        });

        $(document).on("click",".inform",function(){
            if(selectedLst.length != 1){
                window.top.$.layerAlert.alert({msg:"请选择一条线索！" ,icon:"1",end : function(){
                    return;
                }});
                return;
            }
            var clueId = selectedLst[0];
            $.ajax({
                url:context +'/clueFlow/checkStatus',
                type:'post',
                data:{
                    id: clueId
                },
                dataType:'json',
                success:function(successData){
                    if(successData){
                        var initData = {
                            id : clueId
                        }
                        window.top.$.layerAlert.dialog({
                            content : context +  '/show/page/web/clue/chooseInformUnitLayer',
                            pageLoading : true,
                            title:"通报",
                            width : "500px",
                            height : "500px",
                            shadeClose : false,
                            initData:function(){
                                return $.util.exist(initData)?initData:{} ;
                            },
                            success:function(layero, index){

                            },
                            end:function(){
                            },
                            btn:["通报", "关闭"],
                            callBacks:{
                                btn1:function(index, layero){
                                    var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                                    var obj = cm.getSelected();
                                    if(obj.flag == false){
                                        window.top.$.layerAlert.alert({msg:obj.msg ,icon:"1",end : function(){
                                            return;
                                        }});
                                        return;
                                    }
                                    var coopUnit = "";
                                    for(var i = 0; i < obj.coopLst.length; i++){
                                        coopUnit += obj.coopLst[i];
                                        if(i != obj.coopLst.length - 1){
                                            coopUnit += ";"
                                        }
                                    }
                                    $.ajax({
                                        url:context +'/clueFlow/inform',
                                        type:'post',
                                        data:{
                                            clueId : clueId,
                                            mainUnit : obj["mainObj"],
                                            coopUnit : coopUnit
                                        },
                                        dataType:'json',
                                        success:function(successData){
                                            window.top.$.layerAlert.alert({msg:"通报成功！",icon:"1",end : function(){
                                                clueTable.draw(false);
                                                window.top.layer.close(index);
                                            }});
                                        }
                                    });
                                },
                                btn2:function(index, layero){
                                    window.top.layer.close(index);
                                }
                            }
                        });
                    }else{
                        window.top.$.layerAlert.alert({msg:"线索已办结！" ,icon:"1",end : function(){
                            return;
                        }});
                        return;
                    }
                }
            });
        });

        $(document).on("click",".query",function(){
            startTime = null;
            $("#isQuery").val(true);
            $(".clearSelect").click();
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
        if( ($.util.isBlank($("#isQuery")) || $("#isQuery").val() == "" || $("#isQuery").val() == "false") && !$.util.isBlank(startTime)){
            functionName = "/clueFlow/findClueListForLittleWindow";
        }else if(queryStatus == "fullQuery"){
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
                "targets": 0,
                "width": "",
                "title": "",
                "data": "id" ,
                "render": function ( data, type, full, meta ) {
                    var str = '<span clueId="' + data + '" style="display:none"></span>';
                    str += '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + data + '">';
                    return str;
                }
            },
            {
                "targets": 1,
                "width": "",
                "title": "序号",
                "data": "id" ,
                "render": function ( data, type, full, meta ) {
                    var level = "";
                    if(full.level == $.common.dict.QBJB_YJ){
                        level = "level1";
                    }
                    if(full.level == $.common.dict.QBJB_EJ){
                        level = "level2";
                    }
                    if(full.level == $.common.dict.QBJB_SJ){
                        level = "level3";
                    }
                    return '<span class="fa fa-star ' + level + '" clueId="' + data + '"></span>' + (meta.row + 1);
                }
            },
            {
                "targets" : 2,
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
                "targets" : 3,
                "width" : "",
                "title" : "来源单位",
                "data" : "sourceUnitTwoName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "涉访群体",
                "data" : "involveCrowdTwoName",
                "render" : function(data, type, full, meta) {
                    if(full.involveCrowdTwoSituation != null && full.involveCrowdTwoSituation.length > 0) {
                        var str = '<div class="fi-ceng-out">';
                        if(data.length > 6){
                            str += data.substr(0,6) + '...';
                        }else{
                            str += data + '...';
                        }
                        str += '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '<br/>背景:' + full.involveCrowdTwoSituation + '</p></div></div>';
                        return str;
                    } else {
                        if(data.length > 6){
                            var str = '<div class="fi-ceng-out">' + data.substr(0,6) + '...' +
                                '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                            return str;
                        }else{
                            return data;
                        }
                    }
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "内容",
                "data" : "content",
                "render" : function(data, type, full, meta) {
                    if(data.length > 12){
                        var str = '<div class="fi-ceng-out">' + data.substr(0,12) + '...' +
                            '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "指向开始时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSiteBeanList",
                "render" : function(data, type, full, meta) {
                    var str = "";
                    if(data != null){
                        for (var i in data){
                            str += data[i].site + ";";
                        }
                    }
                    if(str != ""){
                        str = str.substr(0, str.length - 1);
                    }
                    if(str.length > 5){
                        var htmlStr = '<div class="fi-ceng-out">' + str.substr(0,5) + '...' +
                            '<div class="fi-ceng"><p style="padding: 5px 10px;">' + str + '</p></div></div>';
                        return htmlStr;
                    }else{
                        return str;
                    }
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "线索编号",
                "data" : "code",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 9,
                "width" : "",
                "title" : "线索状态",
                "data" : "statusName",
                "render" : function(data, type, full, meta) {
                    if(full.irStatusList != null && full.irStatusList.length > 0){
                        var str = '<div class="fi-ceng-out"><span class="ztName">' + data +
                            '</span><div class="fi-ceng fi-ceng-s"><table class="table table-border table-condensed">' +
                            '<thead><tr><th>通报单位</th><th>接收状态</th></tr></thead><tbody>';
                        for(var i in full.irStatusList){
                            var obj = full.irStatusList[i];
                            if(obj.name == "待接收"){
                                str += '<tr>'+
                                    '<td>' + obj.code + '</td>'+
                                    '<td class="fc-red">' + obj.name + '</td>'+
                                    '</tr>';
                            }else{
                                str += '<tr>'+
                                    '<td>' + obj.code + '</td>'+
                                    '<td>' + obj.name + '</td>'+
                                    '</tr>';
                            }
                        }
                        str += '</tbody></table></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
            },
            {
                "targets" : 10,
                "width" : "",
                "title" : "操作",
                "data" : "",
                "render" : function(data, type, full, meta) {
                    var str = '<p class="text-center">'+
                        '<a href="###" class="btn btn-default btn-xs btnView" clueId="' + full.id + '">查看</a>'+
                        '</p>';
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
            if( ($.util.isBlank($("#isQuery")) || $("#isQuery").val() == "" || $("#isQuery").val() == "false") && !$.util.isBlank(startTime)){
                obj.targetSiteSite = targetSite;
                obj.startTimeOneLong = startTime;
                obj.startTimeTwoLong = endTime;
                obj.involveCrowdOne = crowdOne;
                obj.involveCrowdTwo = crowdTwo;
                obj.start = d.start;
                obj.length = d.length;
                $("#pageStart").val(d.start);
                $.util.objToStrutsFormData(obj, "cqp", d);
                $.util.objToStrutsFormData("false", "myClue", d);
                tranContent = "";
            }else if(queryStatus == "fullQuery"){
                obj.startTime = "指向时间"==$("#startTimeInput").val()?"":$("#startTimeInput").val();
                obj.targetSite = "指向地点"==$("#targetSiteQuery").val()?"":$("#targetSiteQuery").val();
                obj.content = "关键字"==$("#contentQuery").val()?"":$("#contentQuery").val();
                obj.involveCrowd = "群体"==$("#involveCrowdQuery").val()?"":$("#involveCrowdQuery").val();
                obj.start = d.start;
                obj.length = d.length;
                $("#pageStart").val(d.start);
                $.util.objToStrutsFormData(obj, "cqpfk", d);

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

                tranContent = "";
            }

        };
        tb.paramsResp = function(json) {

        };
        tb.drawCallback = function(row,data, index) {
            for(var i in selectedLst){
                $.icheck.check("input[value='" + selectedLst[i] + "']",true,true);
            }
        };
        clueTable = $("#clueTable").DataTable(tb);
    }


    /**
     * 批量导入
     */
    function batchImport(){
        checkImportStatus();
    }


    /**
     * 检查是否有没有上传完的东西
     */
    function checkImportStatus(){
        $.ajax({
            url:context + '/clue/checkImportStatus',
            // data:data,
            type:"post",
            dataType:"json",
            success:function(res){
                var bn=res.status;
                if(bn==false){
                    var result=res.data;
                    //导入等待界面
                    $.util.topWindow().$.layerAlert.dialog({
                        content : context + "/show/page/web/clue/bulkImportDialog4",
                        pageLoading : true,
                        title : '确定导入数据',
                        width : "400px",
                        height : "400px",
                        btn:["返回"],
                        callBacks:{
                            btn1:function(index, layero){
                                $.util.topWindow().$.layerAlert.closeAll();
                            },
                        },
                        success:function(layero, index){

                        },
                        initData:{
                            data : result,
                        },
                        end:function(){

                        }
                    });
                }else{
                    openOnload();
                }

            }
        })

    }

    /**
     * 打开选择导入的界面
     */
    function openOnload(){
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/clue/batchImportLayer',
            pageLoading : true,
            title : '线索批量导入',
            width : "508px",
            height : "400px",
            btn:["导入","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.clueBachImportExcel;  //获取弹窗界面的操作对象
                    cm.submitMethod();//弹窗界面的方法

                },
                btn2:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.clueBachImportExcel;  //获取弹窗界面的操作对象
                    var id= cm.findObj();//获取值
                    if(id){
                        removeAttachment(id);//如果有上传id的话
                    }
                    $.util.topWindow().$.layerAlert.closeWithLoading(index);
                }

            },
            success:function(layero, index){

            },
            initData:{
                downloadURL : "/petitionRegistrationExportExcel/downloadPetitionModel?fileName=clueImportModel.xlsx",
                updateURL : "/clue/chickClueBatchImport"
            },
            end:function(){

            }
        });
    }

    /**
     * 删除已经上传的附件
     */
    function removeAttachment(id){
        $.ajax({//處理數據
            url:context + '/crowd/deleteAttachment',
            data:{"uploadfileId":id},
            type:"post",
            dataType:"json",
            success:function(){

            }
        })
    }


    /**
     * 扫描件导入
     */
    function  scanImport(){
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/clue/scanImportLayer',
            pageLoading : true,
            title : "扫描件导入",
            width : "500px",
            height : "400px",
            btn:["导入","取消"],
            callBacks:{
                btn1:function(index, layero){

                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.scan;  //获取弹窗界面的操作对象
                    cm.submitMethod(window, index);//弹窗界面的方法

                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index);
                    //关闭弹窗
                }

            },
            success:function(layero, index){

            },
            initData:{
                // crowdTypeId : crowdTypeId
            },
            end:function(index){

            }
        });
    }

    /**
     * 结果导出事件
     */
    function exportExcel(btnType){
        if(selectedLst.length != 0){
            var form = $.util.getHiddenForm(context+'/clue/exportOneExcelByClue',{clueId : selectedLst.join(","),btnType:btnType});
            $.util.subForm(form);
            return;
        }
        $.layerAlert.alert({title:"提示",msg:"文件下载中,请等待..",icon : 1,time:1000});
        var url="";
        var form ="";
        if(!$.util.isBlank(startTime)){
            url = context +  "/clue/exportClueListForLittleWindowExcel";
            var obj = {};
            obj.targetSiteSite = targetSite;
            obj.startTimeOneLong = startTime;
            obj.startTimeTwoLong = endTime;
            obj.involveCrowdOne = crowdOne;
            obj.involveCrowdTwo = crowdTwo;
            obj.start = 0;
            // obj.length = d.length;
            var d={};
            $.util.objToStrutsFormData(obj, "cqp", d);

            $.util.objToStrutsFormData(btnType, "btnType", d);//**
            form = $.util.getHiddenForm(url,d);
        }else if(queryStatus == "fullQuery"){
            url = context + "/clue/exportFullQueryExcel";
            var obj = {};
            obj.startTime = "指向时间"==$("#startTimeInput").val()?"":$("#startTimeInput").val();
            obj.targetSite = "指向地点"==$("#targetSiteQuery").val()?"":$("#targetSiteQuery").val();
            obj.content = "关键字"==$("#contentQuery").val()?"":$("#contentQuery").val();
            obj.involveCrowd = "群体"==$("#involveCrowdQuery").val()?"":$("#involveCrowdQuery").val();

            var d={};
            $.util.objToStrutsFormData(obj, "cqpfk", d);

            $.util.objToStrutsFormData(btnType, "btnType", d);//**
            form = $.util.getHiddenForm(url,d);
        }else if(queryStatus == "clueQuery"){
            url =context +  "/clue/exportClueQueryExcel";
            var cqp={};
            cqp.content = $("#clueContent").val();
            cqp.type = $.select2.val("#clueType");
            cqp.source = $.select2.val("#source");
            cqp.level = $.select2.val("#level");
            cqp.sensitiveInfo = $.select2.val("#sensitiveInfo");
            cqp.sourceUnitOne = $.select2.val("#sourceUnitOne");
            cqp.sourceUnitTwo = $.select2.val("#sourceUnitTwo");
            cqp.status = $.select2.val("#status");
            cqp.inBeijing = $.select2.val("#inBeijing");
            cqp.targetSiteType = $.select2.val("#targetSiteOne");
            cqp.targetSiteArea = $.select2.val("#targetSiteTwo");
            if($.select2.text("#targetSiteThree") != null){
                cqp.targetSiteSite = $.select2.text("#targetSiteThree")[0];
            }else{
                cqp.targetSiteSite = "";
            }
            cqp.undefinedStartTime = $.select2.val("#undefinedStartTime");
            cqp.startTimeOneLong = $.laydate.getTime("#startTime", "start");
            cqp.startTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#startTime", "end"),"yyyy-MM-dd");
            cqp.writeTimeOneLong = $.laydate.getTime("#writeTime", "start");
            cqp.writeTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#writeTime", "end"),"yyyy-MM-dd HH:mm");
            cqp.involveCrowdOne = $.select2.val("#involveCrowdOne");
            cqp.involveCrowdTwo = $.select2.val("#involveCrowdTwo");
            cqp.wayOfActOne = $.select2.val("#wayOfActOne");
            cqp.wayOfActTwo = $.select2.val("#wayOfActTwo");
            cqp.start = 0;
            // cqp.length = d.length;
            var d={};
            $.util.objToStrutsFormData(cqp, "cqp", d);

            $.util.objToStrutsFormData(btnType, "btnType", d);//**
            form = $.util.getHiddenForm(url,d);
        }else if(queryStatus == "personQuery"){
            url = context + "/clue/exportPersonQueryExcel";
            var rpqp={};
            rpqp.name = $("#name").val();
            rpqp.identityNumber = $("#identityNumber").val();
            rpqp.cellphoneNumber = $("#cellphoneNumber").val();
            rpqp.placeOfDomicile = $("#placeOfDomicile").val();
            rpqp.wechat = $("#wechat").val();
            rpqp.qqNum = $("#qqNum").val();
            rpqp.otherNet = $("#otherNet").val();
            rpqp.start = 0;
            d={};
            $.util.objToStrutsFormData(rpqp, "rpqp", d);

            $.util.objToStrutsFormData(btnType, "btnType", d);//**
            form = $.util.getHiddenForm(url,d);
        }else if(queryStatus == "feedbackQuery"){
            url = context + "/clue/exportFeedbackQueryExcel";
            var frqp={};
            frqp.happened = $.select2.val("#happened");
            frqp.happenedTimeOneLong = $.laydate.getTime("#happenedTime", "start");
            frqp.happenedTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#happenedTime", "end"),"yyyy-MM-dd");
            frqp.happenedSite = $("#happenedSite").val();
            frqp.peopleQuantity = $("#peopleQuantity").val();
            frqp.severityBehaviour = $.select2.val("#severityBehaviour");
            frqp.situation = $("#situation").val();
            frqp.timeOfDuration = $("#timeOfDuration").val();
            frqp.start = 0;
            // frqp.length = d.length;
            var d={};
            $.util.objToStrutsFormData(frqp, "frqp", d);

            $.util.objToStrutsFormData(btnType, "btnType", d);//**
            form = $.util.getHiddenForm(url,d);
        }
        $.util.subForm(form);
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