
(function($){
    "use strict";
    var personTable = null; //关联人员
    var groupTable = null;  //关联群组
    var instructionsTable = null;   //领导批示
    var workFeedbackRecordTable = null; //工作情况反馈
    var inspectFeedbackRecordTable = null;//落地核查反馈
    var regTranContent = "";
    $(document).ready(function() {
        $.ajax({
            url:context +'/clueFlow/editCheckFlag',
            type:'post',
            data:{clueId : clueId},
            dataType:'json',
            success:function(successData){
            }
        })
        regTranContent = new RegExp(tranContent,"gim");
        btnCtrl();
        initData();
        initTimeLine();
        events();
    });

    function initTimeLine(){
        $.ajax({
            url: context + '/clueFlow/findClueFollowing',
            type: 'post',
            data: {clueId: clueId},
            dataType: 'json',
            success: function (dataLst) {
                if(dataLst != null && dataLst.length > 0){
                    dataLst[0].liclass = 'active';
                    var obj = {};
                    obj.list = dataLst;
                    var html = template('timeLineObj', obj);
                    document.getElementById('testTpl').innerHTML = html;
                }
            }
        });
    }

    function events(){

        $(document).on("click",".exportWord",function(){
            $.layerAlert.alert({title:"提示",msg:"文件下载中,请等待..",icon : 1,time:1000});
            var form = $.util.getHiddenForm(context+'/clue/exportWordByClue',{clueId : clueId});
            $.util.subForm(form);
        });

        $(document).on("click",".editClue",function(){
            window.location = context + '/show/page/web/clue/modifyClue?clueId=' + clueId;
        });
        $(document).on("click",".check",function(){
            window.location = context + "/show/page/web/clue/checkClue?clueId=" + clueId;
        });
        $(document).on("click",".feedback",function(){
            window.location = context + "/show/page/web/clue/feedbackState?clueId=" + clueId;
        });
        $(document).on("click","#backUrl",function(){
            window.top.history.back();
        });
        $(document).on("click","#fileObj",function(){
            var fileId = $(this).attr("fileId");
            var form = $.util.getHiddenForm(context+'/clue/downloadFile', {"metaId": fileId});
            $.util.subForm(form);
        });
        $(document).on("click",".instructions",function(){
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

        $(document).on("click",".evaluate",function(){
            var data = {};
            window.top.$.layerAlert.dialog({
                content : context +  '/show/page/web/clue/clueEvaluateLayer',
                pageLoading : true,
                title:"评价",
                width : "500px",
                height : "500px",
                shadeClose : false,
                initData:function(){
                    return $.util.exist(data)?data:{} ;
                },
                success:function(layero, index){

                },
                end:function(){
                },
                btn:["评价", "关闭"],
                callBacks:{
                    btn1:function(index, layero){
                        var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                        var evaluateInfoBean = $.util.cloneObj(cm.getSelected());
                        if(cm.getSelected() == false){
                            return;
                        }
                        var dataMap = {};
                        $.util.objToStrutsFormData(evaluateInfoBean, "evaluateInfoBean", dataMap);
                        $.util.objToStrutsFormData(clueId, "clueId", dataMap);
                        $.ajax({
                            url:context +'/clueFlow/evaluateClue',
                            type:'post',
                            data:dataMap,
                            dataType:'json',
                            success:function(successData){
                                if(successData){
                                    window.top.$.layerAlert.alert({msg:"评价成功！",icon:"1",end : function(){
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

        $(document).on("click",".endProcessing",function(){
            $.ajax({
                url:context +'/clueFlow/endProcessing',
                type:'post',
                data:{clueId : clueId},
                dataType:'json',
                success:function(successData){
                    if(successData){
                        window.top.$.layerAlert.alert({msg:"办结成功！",icon:"1",end : function(){
                            btnCtrl();
                            initData();
                        }});
                    }else{
                        window.top.$.layerAlert.alert({msg:"办结失败，存在未布控的关联人员！",icon:"1",end : function(){
                        }});
                    }
                }
            });
        });

        $(document).on("click",".cancelEndProcessing",function(){
            $.ajax({
                url:context +'/clueFlow/cancelEndProcessing',
                type:'post',
                data:{clueId : clueId},
                dataType:'json',
                success:function(successData){
                    window.top.$.layerAlert.alert({msg:"取消办结成功！",icon:"1",end : function(){
                        btnCtrl();
                        initData();
                    }});
                }
            });
        });

        $(document).on("click",".deleteClue",function(){
            window.top.$.layerAlert.confirm({
                msg:"删除后不可恢复，确认删除线索？",
                title:"提示",	  //弹出框标题
                yes:function(index, layero){
                    $.ajax({
                        url:context +'/clue/delete',
                        type:'post',
                        data:{id : clueId},
                        dataType:'json',
                        success:function(successData){
                            window.top.$.layerAlert.alert({msg:"删除成功！",icon:"1",end : function(){
                                btnCtrl();
                                initData();
                            }});
                        }
                    });
                }
            });
        });

        $(document).on("click",".inform",function(){
            var inData = {
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
                    return $.util.exist(inData)?inData:{} ;
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
                        var windowIndex = index;
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
                                    window.top.layer.close(windowIndex);
                                    btnCtrl();
                                    initData();
                                }});
                            }
                        });
                    },
                    btn2:function(index, layero){
                        window.top.layer.close(index);
                    }
                }
            });
        });

        $(document).on("click",".showPerson",function(){
            var initData = {
                id : $(this).attr("id")
            }
            window.top.$.layerAlert.dialog({
                content : context +  '/show/page/web/clue/personnelDetailLayer',
                pageLoading : true,
                title:"关联人员详情",
                width : "700px",
                height : "700px",
                shadeClose : false,
                initData:function(){
                    return $.util.exist(initData)?initData:{} ;
                },
                success:function(layero, index){

                },
                end:function(){
                },
                btn:["关闭"],
                callBacks:{
                    btn1:function(index, layero){
                        window.top.layer.close(index);
                    }
                }
            });

        });
    }

    function btnCtrl(){
        $(".btnDiv").find("button").hide();
        $.ajax({
            url: context + '/clue/btnCtrl',
            type: 'post',
            data: {clueId: clueId},
            dataType: 'json',
            success: function (btnClassLst) {
                for(var i in btnClassLst){
                    $("." + btnClassLst[i]).show();
                }
            }
        });
    }
    function initData(){

        $.ajax({
            url:context +'/clue/findClueDetail',
            type:'post',
            data:{clueId : clueId},
            dataType:'json',
            success:function(clueBean){
                $("#code").text(clueBean.code);
                if(!$.util.isBlank(clueBean.fileId)){
                    $(".fileDiv").show();
                    $("#fileObj").text(clueBean.fileName);
                    $("#fileObj").attr("fileId", clueBean.fileId);
                }
                if(clueBean.level == $.common.dict.QBJB_YJ){
                    $("#level").addClass("level1");
                }else if(clueBean.level == $.common.dict.QBJB_EJ){
                    $("#level").addClass("level2");
                }else if(clueBean.level == $.common.dict.QBJB_SJ){
                    $("#level").addClass("level3");
                }
                $("#status").text(clueBean.statusName);

                var str = clueBean.content;
                str = str.replace(regTranContent, "<span style='color:#ff674e'>" + tranContent + "</span>");
                $("#content").html(str);
                if($.util.isBlank(clueBean.remark)){
                    $(".remarkDiv").hide();
                }else{
                    var str = clueBean.remark;
                    str = str.replace(regTranContent, "<span style='color:#ff674e'>" + tranContent + "</span>");
                    $("#remark").html(str);
                }
                if(clueBean.undefinedStartTime == $.common.dict.SF_S){
                    $("#undefinedStartTime").text("确定");
                    $(".undefinedEndTimeDiv").hide();
                }else{
                    $("#undefinedStartTime").text("不确定");
                    $(".undefinedEndTimeDiv").show();
                    $("#undefinedEndTime").text(clueBean.undefinedEndTime);
                }
                $("#type").text(clueBean.typeName);
                $("#sourceUnit").text($.util.isBlank(clueBean.otherSourceUnit)?($.util.isBlank(clueBean.sourceUnitTwoName)?"":clueBean.sourceUnitTwoName):clueBean.otherSourceUnit);
                $("#fileNum").text(clueBean.fileNum);
                $("#levelName").text(clueBean.levelName);
                var str = "";
                if(clueBean.targetSiteBeanList != null){
                    for(var i = 0; i< clueBean.targetSiteBeanList.length; i++){
                        str += clueBean.targetSiteBeanList[i].site + " ";
                    }
                }
                $("#targetSite").text(str);
                $("#wayOfAct").text(clueBean.wayOfActOneName + clueBean.wayOfActTwoName);
                $("#source").text(clueBean.sourceName);

                var htmlStr = "";
                if(clueBean.additionalInfoBeanList != null){
                    for(var i = 0; i< clueBean.additionalInfoBeanList.length; i++){
                        var obj = clueBean.additionalInfoBeanList[i];
                        if(i%2 == 0){
                            htmlStr += '<div class="row row-mar">' + createKeyValueDiv(obj.name, obj.content);
                            if(i == clueBean.additionalInfoBeanList.length - 1){
                                htmlStr += '</div>';
                            }
                        }
                        if(i%2 == 1){
                            htmlStr += createKeyValueDiv(obj.name, obj.content) + '</div>';
                        }
                    }
                }
                $("#additionalInfo").empty();
                $("#additionalInfo").append(htmlStr);
                if(!$.util.isBlank(clueBean.startTimeLong)){
                    $("#startTime").text($.date.timeToStr(clueBean.startTimeLong, "yyyy-MM-dd"));
                }
                if(!$.util.isBlank(clueBean.endTimeLong)){
                    $("#endTime").text($.date.timeToStr(clueBean.endTimeLong, "yyyy-MM-dd"));
                }
                $("#inBeijing").text(clueBean.inBeijingName);
                $("#involveCrowd").text(clueBean.involveCrowdOneName + " " + clueBean.involveCrowdTwoName);
                $("#sensitiveInfo").text(clueBean.sensitiveInfoName);
                $("#placeOfOrigin").text(($.util.isBlank(clueBean.placeOfOriginOneName)?" ":(clueBean.placeOfOriginOneName + " "))
                    + ($.util.isBlank(clueBean.placeOfOriginTwoName)?"":clueBean.placeOfOriginTwoName));
                $("#writePerson").text(clueBean.writePerson);
                $("#writePersonPhone").text(clueBean.writePersonPhone);
                $("#writeTime").text($.date.timeToStr(clueBean.writeTimeLong, "yyyy-MM-dd HH:mm"));
                //TODO 附件
                $("#mainUnit").text($.util.isBlank(clueBean.mainUnit)?"":clueBean.mainUnit);
                $("#coopUnit").text(clueBean.coopUnit);
                $("#instrTime").text($.util.isBlank(clueBean.sendDate)?"":clueBean.sendDate);
                initPersonTable(clueBean.relevantPersonList);
                initGroupTable(clueBean.relevantNetGroupList);
                // 领导批示
                initInstructionsTable(clueBean.instructionsBeanList);
                // 工作情况反馈
                initWorkFeedbackRecordTable(clueBean.workFeedbackRecordBeanList);
                // 核查结果反馈
                initInspectFeedbackRecordTable(clueBean.inspectFeedbackRecordBeanList);
                // 线索评价
                if(clueBean.evaluateInfoBeanList != null){
                    var val = clueBean.evaluateInfoBeanList[0];
                    if(val != null){
                        $("#evaluateTime").text(val.evaluateTime);
                        $("#evaluateUnit").text(val.evaluateUnit);
                        $("#integrality").text(val.integralityName);
                        $("#quality").text(val.qualityName);
                        $("#rich").text(val.richName);
                        $("#veracity").text(val.veracityName);
                        $("#warning").text(val.warningName);
                        $("#evaluateContent").text(val.content);
                    }
                }
            }
        });
    }

    function createKeyValueDiv(key, value){
        return '<div class="col-xs-3"><p class="control-p">' + key + '：</p></div><div class="col-xs-3">' + value + '</div>'
    }

    function initPersonTable(data){
        if(personTable != null){
            personTable.destroy();
        }
        var personTableSettings = $.uiSettings.getLocalOTableSettings();
        personTableSettings.data = data;
        personTableSettings.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return '<a href="##" id="' + full.id + '" class="showPerson">' + data + '</a>';
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "身份证号",
                "data" : "identityNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "人员属地",
                "data" : "placeOfDomicile",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "当前位置",
                "data" : "locationName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "人员等级",
                "data" : "levelName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "是否稳控",
                "data" : "underControlName",
                "render" : function(data, type, full, meta) {
                    return data + " " + full.disposalWayName + " " + full.controlInfo;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "手机号",
                "data" : "cellphoneNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "网络ID类型",
                "data" : "networkIDTypeName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "网络ID",
                "data" : "networkID",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 9,
                "width" : "",
                "title" : "网络名称",
                "data" : "networkName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        //是否排序
        personTableSettings.ordering = false ;
        //是否分页
        personTableSettings.paging = false ;
        //默认搜索框
        personTableSettings.searching = false ;
        //能否改变lengthMenu
        personTableSettings.lengthChange = false ;
        //自动TFoot
        personTableSettings.autoFooter = false ;
        //自动列宽
        personTableSettings.autoWidth = false ;
        //请求参数
        personTable = $("#personTable").DataTable(personTableSettings);
    }

    function initGroupTable(data){
        if(groupTable != null){
            groupTable.destroy();
        }
        var groupTableSettings = $.uiSettings.getLocalOTableSettings();
        groupTableSettings.data = data;
        groupTableSettings.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "网络ID类型",
                "data" : "networkIDTypeName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "网络ID",
                "data" : "networkID",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "网络名称",
                "data" : "networkName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        //是否排序
        groupTableSettings.ordering = false ;
        //是否分页
        groupTableSettings.paging = false ;
        //默认搜索框
        groupTableSettings.searching = false ;
        //能否改变lengthMenu
        groupTableSettings.lengthChange = false ;
        //自动TFoot
        groupTableSettings.autoFooter = false ;
        //自动列宽
        groupTableSettings.autoWidth = false ;
        //请求参数
        groupTable = $("#groupTable").DataTable(groupTableSettings);
    }

    function initInstructionsTable(data){
        if(instructionsTable != null){
            instructionsTable.destroy();
        }
        var instructionsTableSettings = $.uiSettings.getLocalOTableSettings();
        instructionsTableSettings.data = data;
        instructionsTableSettings.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "批示时间",
                "data" : "instTimeStr",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "批示级别",
                "data" : "level",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "批示内容",
                "data" : "content",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        //是否排序
        instructionsTableSettings.ordering = false ;
        //是否分页
        instructionsTableSettings.paging = false ;
        //默认搜索框
        instructionsTableSettings.searching = false ;
        //能否改变lengthMenu
        instructionsTableSettings.lengthChange = false ;
        //自动TFoot
        instructionsTableSettings.autoFooter = false ;
        //自动列宽
        instructionsTableSettings.autoWidth = false ;
        //请求参数
        instructionsTable = $("#instructionsTable").DataTable(instructionsTableSettings);
    }

    function initWorkFeedbackRecordTable(data){
        if(workFeedbackRecordTable != null){
            workFeedbackRecordTable.destroy();
        }
        var workFeedbackRecordTableSettings = $.uiSettings.getLocalOTableSettings();
        workFeedbackRecordTableSettings.data = data;
        workFeedbackRecordTableSettings.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "反馈时间",
                "data" : "sendTimeLong",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data, "yyyy-MM-dd HH:mm:ss");
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "反馈单位",
                "data" : "sendUnit",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "反馈内容",
                "data" : "content",
                "render" : function(data, type, full, meta) {
                    var content = "";
                    if(full.happened == $.common.dict.SF_S){
                        var content =  full.happenedName + "，发生时间：" + $.date.timeToStr(full.happenedTimeLong, "yyyy-MM-dd HH:mm")
                            + "，发生地点：" + ($.util.isBlank(full.happenedSite) ? "未知" : full.happenedSite)
                            + "，人员规模：" + ($.util.isBlank(full.peopleQuantity) ? "未知" : (full.peopleQuantity + "人"))
                            + "，过激行为：" + ($.util.isBlank(full.severityBehaviourName) ? "未知" : full.severityBehaviourName)
                            + "，现场情况：" + ($.util.isBlank(full.situation) ? "未知" : full.situation)
                            + "，持续时间：" + ($.util.isBlank(full.timeOfDuration) ? "未知" : (full.timeOfDuration + "小时"));
                    }else{
                        var content =  full.happenedName + "，未发生原因：" + full.notHappenedReasonName
                            + "，跟进情况：" + ($.util.isBlank(full.followStatus) ? "未知" : full.followStatus);
                    }
                    return content;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "反馈人",
                "data" : "sendPerson",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        //是否排序
        workFeedbackRecordTableSettings.ordering = false ;
        //是否分页
        workFeedbackRecordTableSettings.paging = false ;
        //默认搜索框
        workFeedbackRecordTableSettings.searching = false ;
        //能否改变lengthMenu
        workFeedbackRecordTableSettings.lengthChange = false ;
        //自动TFoot
        workFeedbackRecordTableSettings.autoFooter = false ;
        //自动列宽
        workFeedbackRecordTableSettings.autoWidth = false ;
        //请求参数
        workFeedbackRecordTable = $("#workFeedbackRecordTable").DataTable(workFeedbackRecordTableSettings);
    }

    function initInspectFeedbackRecordTable(data){
        if(inspectFeedbackRecordTable != null){
            inspectFeedbackRecordTable.destroy();
        }
        var inspectFeedbackRecordTableSettings = $.uiSettings.getLocalOTableSettings();
        inspectFeedbackRecordTableSettings.data = data;
        inspectFeedbackRecordTableSettings.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "反馈时间",
                "data" : "sendTimeLong",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data, "yyyy-MM-dd HH:mm:ss");
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "反馈单位",
                "data" : "sendUnit",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "跟进情况",
                "data" : "content",
                "render" : function(data, type, full, meta) {
                    return data.replace(regTranContent, "<span style='color:#ff674e'>" + tranContent + "</span>");
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "反馈人",
                "data" : "sendPerson",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        //是否排序
        inspectFeedbackRecordTableSettings.ordering = false ;
        //是否分页
        inspectFeedbackRecordTableSettings.paging = false ;
        //默认搜索框
        inspectFeedbackRecordTableSettings.searching = false ;
        //能否改变lengthMenu
        inspectFeedbackRecordTableSettings.lengthChange = false ;
        //自动TFoot
        inspectFeedbackRecordTableSettings.autoFooter = false ;
        //自动列宽
        inspectFeedbackRecordTableSettings.autoWidth = false ;
        //请求参数
        inspectFeedbackRecordTable = $("#inspectFeedbackRecordTable").DataTable(inspectFeedbackRecordTableSettings);
    }



    jQuery.extend($.common, {

    });
})(jQuery);