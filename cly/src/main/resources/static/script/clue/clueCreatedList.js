(function($){
    "use strict";

    var queryStatus = "fullQuery";
    var clueTable = null;
    var fullQuery = true;
    var otherQuery = "clueQuery";
    var qtlb = [];
    var selectedLst = [];
    //综合查询字典项初始化状态
    var sourceUnitQueryInitStatus = false;
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
        }else if($("#queryStatusInput").val() == "clueQuery"){
            $(".fullQuery").click();
            $("#queryStatusInput").val("clueQuery");
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
        $(document).on("click","#enterClue",function(){
            window.location = context + '/show/page/web/clue/enterClue';
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
        $(document).on("select2:select","#sourceUnitOneQuery",function(){
            if($.select2.val("#sourceUnitOneQuery") == "000"){
                $.select2.empty("#sourceUnitTwoQuery", true);
                var obj = [{id:"000",name:"来源单位"}];
                $.select2.addByList("#sourceUnitTwoQuery", obj, "id", "name", true, true);
                $.select2.selectByOrder("#sourceUnitTwoQuery","1",true);
            }else{
                $.ajax({
                    url:context +'/clue/findSourceUnit',
                    type:'post',
                    data:{groupType : $.select2.val("#sourceUnitOneQuery")},
                    dataType:'json',
                    success:function(successData){
                        $.select2.empty("#sourceUnitTwoQuery", true);
                        successData.unshift({id:"000", name:"来源单位"});
                        $.select2.addByList("#sourceUnitTwoQuery", successData, "id", "name", true, true);
                        $.select2.selectByOrder("#sourceUnitTwoQuery","1",true);
                    }
                });
            }
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
        var sourceUnitOneQueryInput = $("#sourceUnitOneQueryInput").val();
        var sourceUnitTwoQueryInput = $("#sourceUnitTwoQueryInput").val();
        sourceUnitQueryInitStatus = false;
        $.ajax({
            url:context +'/clue/findSourceUnitDictByOneLevelAndTwoLeveCode',
            type:'post',
            data:{oneCode : $.common.dict.TYPE_LYDWFZ, twoCode : sourceUnitOneQueryInput},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#sourceUnitOneQuery", true);
                successData.oneDis.unshift({id:"000", name:"分组"});
                $.select2.addByList("#sourceUnitOneQuery", successData.oneDis, "id", "name", true, true);
                //应对返回页面的情况设置默认值
                if(!$.util.isBlank(sourceUnitOneQueryInput)){
                    $.select2.val("#sourceUnitOneQuery", sourceUnitOneQueryInput);
                    successData.twoDis.unshift({id:"000", name:"来源单位"});
                    $.select2.addByList("#sourceUnitTwoQuery", successData.twoDis, "id", "name", true, true);
                    $("#sourceUnitOneQueryInput").val(sourceUnitOneQueryInput);
                    if(!$.util.isBlank(sourceUnitTwoQueryInput)){
                        $.select2.val("#sourceUnitTwoQuery", sourceUnitTwoQueryInput);
                        $("#sourceUnitTwoQueryInput").val(sourceUnitTwoQueryInput);
                    }else{
                        $.select2.selectByOrder("#sourceUnitTwoQuery","1",true);
                    }
                }else{
                    $.select2.selectByOrder("#sourceUnitOneQuery","1",true);
                    $.select2.empty("#sourceUnitTwoQuery", true);
                    var obj = [{id:"000", name:"来源单位"}];
                    $.select2.addByList("#sourceUnitTwoQuery", obj, "id", "name", true, true);
                    $.select2.selectByOrder("#sourceUnitTwoQuery","1",true);
                }
                sourceUnitQueryInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
                    verifyDictInitStatusAndSearch();
                }
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
                if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
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
                if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
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
                if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
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
                if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
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
                if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
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
                if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
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
                if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
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
        if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
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
                if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
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
                if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
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
                if($("#queryStatusInput").val() == "fullQuery" || $("#queryStatusInput").val() == "clueQuery"){
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
            functionName = "/clue/findCluePageByFullForCreated";
        }else if(queryStatus == "clueQuery"){
            functionName = "/clue/findCluePageByClueForCreated";
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
            if(queryStatus == "fullQuery"){
                var obj = {};
                obj.startTime = "指向时间"==$("#startTimeInput").val()?"":$("#startTimeInput").val();
                obj.targetSite = "指向地点"==$("#targetSiteQuery").val()?"":$("#targetSiteQuery").val();
                obj.content = "关键字"==$("#contentQuery").val()?"":$("#contentQuery").val();
                obj.involveCrowd = "群体"==$("#involveCrowdQuery").val()?"":$("#involveCrowdQuery").val();
                obj.sourceUnitOne = "000"==$.select2.val("#sourceUnitOneQuery")?"":$.select2.val("#sourceUnitOneQuery");
                $("#sourceUnitOneQueryInput").val(obj.sourceUnitOne);
                obj.sourceUnitTwo = "000"==$.select2.val("#sourceUnitTwoQuery")?"":$.select2.val("#sourceUnitTwoQuery");
                $("#sourceUnitTwoQueryInput").val(obj.sourceUnitTwo);
                obj.start = d.start;
                obj.length = d.length;
                $("#pageStart").val(d.start);
                $.util.objToStrutsFormData(obj, "cqpfk", d);
                tranContent = obj.content;
            }else if(queryStatus == "clueQuery"){
                var obj = {};
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
                obj.name = $("#name").val();
                obj.identityNumber = $("#identityNumber").val();
                obj.cellphoneNumber = $("#cellphoneNumber").val();
                obj.placeOfDomicile = $("#placeOfDomicile").val();
                obj.wechat = $("#wechat").val();
                obj.qqNum = $("#qqNum").val();
                obj.otherNet = $("#otherNet").val();
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
                tranContent = obj.content;
                $.util.objToStrutsFormData(obj, "cqp", d);
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
        $("#queryStatusInput").val(queryStatus);
        if(queryStatus == "fullQuery"){
            url = context + "/clue/exportCluePageByFullForCreated";
            var obj = {};
            obj.startTime = "指向时间"==$("#startTimeInput").val()?"":$("#startTimeInput").val();
            obj.targetSite = "指向地点"==$("#targetSiteQuery").val()?"":$("#targetSiteQuery").val();
            obj.content = "关键字"==$("#contentQuery").val()?"":$("#contentQuery").val();
            obj.involveCrowd = "群体"==$("#involveCrowdQuery").val()?"":$("#involveCrowdQuery").val();
            obj.sourceUnitOne = "000"==$.select2.val("#sourceUnitOneQuery")?"":$.select2.val("#sourceUnitOneQuery");
            obj.sourceUnitTwo = "000"==$.select2.val("#sourceUnitTwoQuery")?"":$.select2.val("#sourceUnitTwoQuery");
            obj.start = 0;

            var d={};
            $.util.objToStrutsFormData(obj, "cqpfk", d);
            $.util.objToStrutsFormData(btnType, "btnType", d);//**
            form = $.util.getHiddenForm(url,d);
        }else if(queryStatus == "clueQuery"){
            url =context +  "/clue/exportCluePageByClueForCreated";
            var obj = {};
            obj.content = $("#clueContent").val();
            obj.doneTimeOneLong = $.laydate.getTime("#doneTime", "start");
            obj.doneTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#doneTime", "end"),"yyyy-MM-dd HH:mm");
            obj.undefinedStartTime = $.select2.val("#undefinedStartTime");
            obj.type = $.select2.val("#clueType");
            obj.source = $.select2.val("#source");
            obj.level = $.select2.val("#level");
            obj.sensitiveInfo = $.select2.val("#sensitiveInfo");
            obj.sourceUnitOne = $.select2.val("#sourceUnitOne");
            obj.sourceUnitTwo = $.select2.val("#sourceUnitTwo");
            obj.status = $.select2.val("#status");
            obj.inBeijing = $.select2.val("#inBeijing");
            obj.targetSiteType = $.select2.val("#targetSiteOne");
            obj.targetSiteArea = $.select2.val("#targetSiteTwo");
            if($.select2.text("#targetSiteThree") != null){
                obj.targetSiteSite = $.select2.text("#targetSiteThree")[0];
            }else{
                obj.targetSiteSite = "";
            }
            obj.startTimeOneLong = $.laydate.getTime("#startTime", "start");
            obj.startTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#startTime", "end"),"yyyy-MM-dd");
            obj.writeTimeOneLong = $.laydate.getTime("#writeTime", "start");
            obj.writeTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#writeTime", "end"),"yyyy-MM-dd HH:mm");
            obj.involveCrowdOne = $.select2.val("#involveCrowdOne");
            obj.involveCrowdTwo = $.select2.val("#involveCrowdTwo");
            obj.wayOfActOne = $.select2.val("#wayOfActOne");
            obj.wayOfActTwo = $.select2.val("#wayOfActTwo");
            obj.name = $("#name").val();
            obj.identityNumber = $("#identityNumber").val();
            obj.cellphoneNumber = $("#cellphoneNumber").val();
            obj.placeOfDomicile = $("#placeOfDomicile").val();
            obj.wechat = $("#wechat").val();
            obj.qqNum = $("#qqNum").val();
            obj.otherNet = $("#otherNet").val();
            obj.happened = $.select2.val("#happened");
            obj.happenedTimeOneLong = $.laydate.getTime("#happenedTime", "start");
            obj.happenedTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#happenedTime", "end"),"yyyy-MM-dd");
            obj.happenedSite = $("#happenedSite").val();
            obj.peopleQuantity = $("#peopleQuantity").val();
            obj.severityBehaviour = $.select2.val("#severityBehaviour");
            obj.situation = $("#situation").val();
            obj.timeOfDuration = $("#timeOfDuration").val();
            obj.start = 0;
            // $("#pageStart").val(0);
            // cqp.length = d.length;
            var d={};
            $.util.objToStrutsFormData(obj, "cqp", d);
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
            happenedAndSeverityBehaviourInitStatus &&
            sourceUnitQueryInitStatus){
            initClueTable();
        }
    }

})(jQuery);