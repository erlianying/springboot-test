
(function($){
    "use strict";
    //var workFeedbackRecordTable = null; //工作情况反馈
    var newRowNum = 0;
    var personTableSettings = null;
    var groupTableSettings = null;
    var personTable = null; //关联人员
    var groupTable = null;  //关联群组
    var personLevelData = [];
    var personLocationData = [];
    var personDisposalWayData = [];
    var underCtrlData = [];
    var netTypePersonData = [];
    var netTypeGroupData = [];
    var deletePersonIdLst = [];
    var deleteGroupIdLst = [];
    $(document).ready(function() {
        $.ajax({
            url:context +'/clueFlow/editCheckFlagByBatch',
            type:'post',
            data:{clueIdList : clueIdList},
            dataType:'json',
            success:function(successData){
            }
        })

        $.when(
            $.ajax({
                url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
                type:'post',
                data:{dicTypeId : $.common.dict.TYPE_RYDJ},
                dataType:'json',
                success:function(successData){
                    personLevelData = successData;
                }
            }),
            $.ajax({
                url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
                type:'post',
                data:{dicTypeId : $.common.dict.TYPE_RYSD},
                dataType:'json',
                success:function(successData){
                    personLocationData = successData;
                }
            }),
            $.ajax({
                url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
                type:'post',
                data:{dicTypeId : $.common.dict.DQZT_CZFS},
                dataType:'json',
                success:function(successData){
                    personDisposalWayData = successData;
                }
            }),
            $.ajax({
                url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
                type:'post',
                data:{dicTypeId : $.common.dict.TYPE_SF},
                dataType:'json',
                success:function(successData){
                    underCtrlData = successData;
                }
            }),
            $.ajax({
                url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
                type:'post',
                data:{dicTypeId : $.common.dict.TYPE_WLIDRLX},
                dataType:'json',
                success:function(successData){
                    netTypePersonData = successData;
                }
            }),
            $.ajax({
                url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
                type:'post',
                data:{dicTypeId : $.common.dict.TYPE_WLIDQLX},
                dataType:'json',
                success:function(successData){
                    netTypeGroupData = successData;
                }
            })
        ).done(function(){
            initData();
            initClueTable();
        })
        events();

    });

    function events(){
        eventsForPersonTable();
        eventsForGroupTable();
        $(document).on("click","#backUrl",function(){
            window.top.history.back();
        });

        $(document).on("click","#fileObj",function(){
            var fileId = $(this).attr("fileId");
            var form = $.util.getHiddenForm(context+'/clue/downloadFile', {"metaId": fileId});
            $.util.subForm(form);
        });


        /*      LGQ
        $(document).on("select2:select","#infoRight",function(){
            if($.select2.val("#infoRight") == $.common.dict.SFXXZQX_BZQ){
                $(".checkDiv").show();
            }else{
                $(".checkDiv").hide();
            }
        });
        */
        $(".checkDiv").hide();

        $(document).on("select2:select","#happened",function(){
            if($.select2.val("#happened") == $.common.dict.SF_F){
                $(".happenedDiv").hide();
                $(".notHappenedDiv").show();
            }else{
                $(".notHappenedDiv").hide();
                $(".happenedDiv").show();
            }
        });

        $(document).on("click","#feedback",function(){
            $("#feedback").attr("disabled", "disabled");
            /*      LGQ
            if($.util.isBlank($.select2.val("#infoRight"))){
                window.top.$.layerAlert.alert({msg:"请选择身份信息准确性",icon:"1",end : function(){
                    $("#feedback").removeAttr("disabled");
                }});
                return;
            }
            */
            if($.select2.val("#happened") == $.common.dict.SF_S){
                if($.util.isBlank($("#happenedSite").val())){
                    window.top.$.layerAlert.alert({msg:"请填写发生地点",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                if($("#happenedSite").val().length > 80){
                    window.top.$.layerAlert.alert({msg:"发生地点过长(80个字)",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                if($.util.isBlank($.laydate.getTime("#happenedTime","date"))){
                    window.top.$.layerAlert.alert({msg:"请填写发生时间",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                if($.util.isBlank($("#peopleQuantity").val())){
                    window.top.$.layerAlert.alert({msg:"请填写人员规模",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                var peopleQuantity = $("#peopleQuantity").val();
                var reg = /^[1-9][0-9]*|[0]$/;
                if(!reg.test(peopleQuantity)){
                    window.top.$.layerAlert.alert({msg:"请填写正确的人员规模（零或正整数）",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                if($("#peopleQuantity").val().length > 80){
                    window.top.$.layerAlert.alert({msg:"人员规模过长(80个字)",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                if($.util.isBlank($.select2.val("#severityBehaviour"))){
                    window.top.$.layerAlert.alert({msg:"请选择是否有过激行为",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                if($.util.isBlank($("#situation").val())){
                    window.top.$.layerAlert.alert({msg:"请填写现场情况",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                if($("#situation").val().length > 2000){
                    window.top.$.layerAlert.alert({msg:"现场情况过长(2000个字)",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                if($.util.isBlank($("#timeOfDuration").val())){
                    window.top.$.layerAlert.alert({msg:"请填写持续时间",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                if($("#timeOfDuration").val().length > 80){
                    window.top.$.layerAlert.alert({msg:"持续时间过长(80个字)",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
            }else{
                if($.util.isBlank($.select2.val("#notHappenedReason"))){
                    window.top.$.layerAlert.alert({msg:"请选择未发生原因",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                if($.util.isBlank($("#followStatus").val())){
                    window.top.$.layerAlert.alert({msg:"请填写跟进情况",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
                if($("#followStatus").val().length > 2000){
                    window.top.$.layerAlert.alert({msg:"跟进情况过长(2000个字)",icon:"1",end : function(){
                        $("#feedback").removeAttr("disabled");
                    }});
                    return;
                }
            }


            var obj = {
                //infoRight : $.select2.val("#infoRight"),      //LGQ
                happened : $.select2.val("#happened"),
                happenedSite : $("#happenedSite").val(),
                happenedTimeLong : $.laydate.getTime("#happenedTime","date"),
                notHappenedReason : $.select2.val("#notHappenedReason"),
                peopleQuantity : $("#peopleQuantity").val(),
                severityBehaviour : $.select2.val("#severityBehaviour"),
                situation : $("#situation").val(),
                timeOfDuration : $("#timeOfDuration").val(),
                followStatus : $("#followStatus").val()
            }
            var dataMap = {};

            /*  LGQ
            if(obj.infoRight == $.common.dict.SFXXZQX_BZQ){
                var demo = $.validform.getValidFormObjById("validform") ;
                var flag = $.validform.check(demo) ;
                if(!flag){
                    $("#feedback").removeAttr("disabled");
                    return ;
                }
                var checkData = getCheckData();
                $.util.objToStrutsFormData(checkData, "clueCheckBean", dataMap);
            }
            */

            $.util.objToStrutsFormData(clueIdList, "clueIdList", dataMap);

            $.util.objToStrutsFormData(obj, "feedbackRecordBean", dataMap);
            $.ajax({
                url:context +'/clueFlow/feedbackByBatch',
                type:'post',
                data:dataMap,
                dataType:'json',
                success:function(successData){
                    window.top.$.layerAlert.alert({msg:"反馈成功！",icon:"1",end : function(){
                    }});
                }
            });

        });
    }

    function getCheckData(){
        var clueCheckBean = {};
        clueCheckBean.deletePersonIdLst = deletePersonIdLst;
        clueCheckBean.deleteGroupIdLst = deleteGroupIdLst;
        clueCheckBean.relevantPersonList = getRelevantPerson();
        clueCheckBean.relevantNetGroupList = getRelevantNetGroup();
        return clueCheckBean;
    }

    function initData(){
        /*      LGQ
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_SFXXZQX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#infoRight", successData, "id", "name", true, true);
            }
        });
        */
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_SF},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#happened", successData, "id", "name", false, true);
                $.select2.addByList("#severityBehaviour", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_WFSYY},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#notHappenedReason", successData, "id", "name", true, true);
            }
        });

    }

    function initClueTable(){
        var tb = $.uiSettings.getOTableSettings();
        var functionName = "/clue/findCluePageByClueIdList";

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
                "title" : "来源单位",
                "data" : "sourceUnitTwoName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "涉访群体",
                "data" : "involveCrowdTwoName",
                "render" : function(data, type, full, meta) {
                    if(data.length > 6){
                        var str = '<div class="fi-ceng-out">' + data.substr(0,6) + '...' +
                            '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
            },
            {
                "targets" : 3,
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
                "targets" : 4,
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
                "targets" : 5,
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
                "targets" : 6,
                "width" : "",
                "title" : "线索编号",
                "data" : "code",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
        //每页条数
        tb.lengthMenu = [ -1 ] ;
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
            var obj = {};
            obj.content = clueIdList;
            $.util.objToStrutsFormData(obj, "cqp", d);
        };
        tb.paramsResp = function(json) {

        };
        $("#clueTable").DataTable(tb);
    }

    function createKeyValueDiv(key, value, num){
        return '<div class="col-xs-' + num + '"><p class="control-p">' + key + '：</p></div><div class="col-xs-1">' + value + '</div>'
    }

    // function initWorkFeedbackRecordTable(data){
    //     var workFeedbackRecordTableSettings = $.uiSettings.getLocalOTableSettings();
    //     workFeedbackRecordTableSettings.data = data;
    //     workFeedbackRecordTableSettings.columnDefs = [
    //         {
    //             "targets" : 0,
    //             "width" : "",
    //             "title" : "反馈时间",
    //             "data" : "sendTimeLong",
    //             "render" : function(data, type, full, meta) {
    //                 return $.date.timeToStr(data, "yyyy-MM-dd HH:mm:ss");
    //             }
    //         },
    //         {
    //             "targets" : 1,
    //             "width" : "",
    //             "title" : "反馈单位",
    //             "data" : "sendUnit",
    //             "render" : function(data, type, full, meta) {
    //                 return data;
    //             }
    //         },
    //         {
    //             "targets" : 2,
    //             "width" : "",
    //             "title" : "反馈内容",
    //             "data" : "content",
    //             "render" : function(data, type, full, meta) {
    //                 var content = "";
    //                 if(full.happened == $.common.dict.SF_S){
    //                     var content =  full.happenedName + "，发生时间：" + $.date.timeToStr(full.happenedTimeLong, "yyyy-MM-dd HH:mm")
    //                         + "，发生地点：" + ($.util.isBlank(full.happenedSite) ? "未知" : full.happenedSite)
    //                         + "，人员规模：" + ($.util.isBlank(full.peopleQuantity) ? "未知" : (full.peopleQuantity + "人"))
    //                         + "，过激行为：" + ($.util.isBlank(full.severityBehaviourName) ? "未知" : full.severityBehaviourName)
    //                         + "，现场情况：" + ($.util.isBlank(full.situation) ? "未知" : full.situation)
    //                         + "，持续时间：" + ($.util.isBlank(full.timeOfDuration) ? "未知" : (full.timeOfDuration + "小时"));
    //                 }else{
    //                     var content =  full.happenedName + "，未发生原因：" + full.notHappenedReasonName;
    //                 }
    //                 return content;
    //             }
    //         },
    //         {
    //             "targets" : 3,
    //             "width" : "",
    //             "title" : "反馈人",
    //             "data" : "sendPerson",
    //             "render" : function(data, type, full, meta) {
    //                 return data;
    //             }
    //         }
    //     ];
    //     //是否排序
    //     workFeedbackRecordTableSettings.ordering = false ;
    //     //是否分页
    //     workFeedbackRecordTableSettings.paging = false ;
    //     //默认搜索框
    //     workFeedbackRecordTableSettings.searching = false ;
    //     //能否改变lengthMenu
    //     workFeedbackRecordTableSettings.lengthChange = false ;
    //     //自动TFoot
    //     workFeedbackRecordTableSettings.autoFooter = false ;
    //     //自动列宽
    //     workFeedbackRecordTableSettings.autoWidth = false ;
    //     //请求参数
    //     workFeedbackRecordTable = $("#workFeedbackRecordTable").DataTable(workFeedbackRecordTableSettings);
    // }

    function initPersonTable(data){
        personTableSettings = $.uiSettings.getLocalOTableSettings();
        personTableSettings.data = data;
        personTableSettings.columnDefs = [
            {
                "targets" : 0,
                "width" : "55px",
                "title" : "姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    newRowNum++;
                    return '<input datatype="*0-80" objid="' + full.id + '"class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(full.name)?"":full.name) + '"/>';
                }
            },
            {
                "targets" : 1,
                "width" : "160px",
                "title" : "身份证号",
                "data" : "idNum",
                "render" : function(data, type, full, meta) {
                    return '<input datatype="/^$|^[0-9]{17}[0-9Xx]$/" class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(full.identityNumber)?"":full.identityNumber) + '"/>';
                }
            },
            {
                "targets" : 2,
                "width" : "60px",
                "title" : "人员属地",
                "data" : "placeOfDomicile",
                "render" : function(data, type, full, meta) {
                    return '<input datatype="*0-80" class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(full.placeOfDomicile)?"":full.placeOfDomicile) + '"/>';
                }
            },
            {
                "targets" : 3,
                "width" : "70px",
                "title" : "当前位置",
                "data" : "location",
                "render" : function(data, type, full, meta) {
                    var locationOptions = '<option></option>';
                    for(var i in personLocationData){
                        var obj = personLocationData[i];
                        locationOptions += '<option';
                        if(full.location == obj.id){
                            locationOptions += ' selected';
                        }
                        locationOptions += ' value="' +  obj.id + '">' + obj.name + '</option>';
                    }

                    return '<select id="p1s' + newRowNum + '" class="select2 form-control input-sm allowClear">' + locationOptions + '</select>';
                }
            },
            {
                "targets" : 4,
                "width" : "70px",
                "title" : "人员等级",
                "data" : "level",
                "render" : function(data, type, full, meta) {
                    var levelOptions = '<option></option>';
                    for(var i in personLevelData){
                        var obj = personLevelData[i];
                        levelOptions += '<option';
                        if(full.level == obj.id){
                            levelOptions += ' selected';
                        }
                        levelOptions += ' value="' +  obj.id + '">' + obj.name + '</option>';
                    }

                    return '<select id="p2s' + newRowNum + '" class="select2 form-control input-sm allowClear">' + levelOptions + '</select>';
                }
            },
            {
                "targets" : 5,
                "width" : "200px",
                "title" : "是否稳控",
                "data" : "underCtrl",
                "render" : function(data, type, full, meta) {
                    var underCtrlOptions = '<option></option>';
                    for(var i in underCtrlData){
                        var obj = underCtrlData[i];
                        underCtrlOptions += '<option';
                        if(full.underControl == obj.id){
                            underCtrlOptions += ' selected';
                        }
                        underCtrlOptions += ' value="' +  obj.id + '">' + obj.name + '</option>';
                    }
                    var disposalWayOptions = '<option></option>';
                    for(var i in personDisposalWayData){
                        var obj = personDisposalWayData[i];
                        disposalWayOptions += '<option';
                        if(full.disposalWay == obj.id){
                            disposalWayOptions += ' selected';
                        }
                        disposalWayOptions += ' value="' +  obj.id + '">' + obj.name + '</option>';
                    }
                    return '<div class="pull-left" style="width: 17%; margin-right: 3%;">' +
                        '<select id="p3s' + newRowNum + '" class="underCtrlSelect select2 form-control input-sm allowClear">' +
                        underCtrlOptions +
                        '</select>' +
                        '</div>' +
                        '<div class="pull-left" style="width: 37%; margin-right: 3%;">' +
                        '<select id="p4s' + newRowNum + '" class="disposalWaySelect select2 form-control input-sm allowClear">' +
                        disposalWayOptions +
                        '</select>' +
                        '</div>' +
                        '<div class="pull-left" style="width: 40%;">' +
                        '<input datatype="*0-80" class="ctrlInfoInput form-control input-sm valiform-keyup" value="' + ($.util.isBlank(full.controlInfo)?"":full.controlInfo) + '"/>' +
                        '</div>';
                }
            },
            {
                "targets" : 6,
                "width" : "110px",
                "title" : "手机号",
                "data" : "cellphone",
                "render" : function(data, type, full, meta) {
                    return '<input datatype="/^$|^[0-9]{11}$/" class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(full.cellphoneNumber)?"":full.cellphoneNumber) + '"/>';
                }
            },
            {
                "targets" : 7,
                "width" : "75px",
                "title" : "网络ID类型",
                "data" : "netType",
                "render" : function(data, type, full, meta) {
                    var netTypeOptions = '<option></option>';
                    for(var i in netTypePersonData){
                        var obj = netTypePersonData[i];
                        netTypeOptions += '<option';
                        if(full.networkIDType == obj.id){
                            netTypeOptions += ' selected';
                        }
                        netTypeOptions +=' value="' +  obj.id + '">' + obj.name + '</option>';
                    }
                    return '<select id="p5s' + newRowNum + '" class="select2 form-control input-sm allowClear">' + netTypeOptions + '</select>';
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "网络ID",
                "data" : "netId",
                "render" : function(data, type, full, meta) {
                    return '<input datatype="*0-80" class="form-control input-sm valiform-keyup" placeholder="多个请用分号隔开" value="' + ($.util.isBlank(full.networkID)?"":full.networkID) + '"/>';
                }
            },
            {
                "targets" : 9,
                "width" : "",
                "title" : "网络名称",
                "data" : "netName",
                "render" : function(data, type, full, meta) {
                    return '<input datatype="*0-80" class="form-control input-sm valiform-keyup" placeholder="多个请用分号隔开" value="' + ($.util.isBlank(full.networkName)?"":full.networkName) + '"/>';
                }
            },
            {
                "targets" : 10,
                "width" : "",
                "title" : "操作",
                "data" : "",
                "render" : function(data, type, full, meta) {
                    return '<p class="text-center"><a href="##" class="deleteForPerson">删除</a></p>';
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
        groupTableSettings = $.uiSettings.getLocalOTableSettings();
        groupTableSettings.data = data;
        groupTableSettings.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "网络ID类型",
                "data" : "netType",
                "render" : function(data, type, full, meta) {
                    newRowNum++;
                    var netGroupTypeOptions = '<option></option>';
                    for(var i in netTypeGroupData){
                        var obj = netTypeGroupData[i];
                        netGroupTypeOptions += '<option';
                        if(full.networkIDType == obj.id){
                            netGroupTypeOptions += ' selected';
                        }
                        netGroupTypeOptions += ' value="' +  obj.id + '">' + obj.name + '</option>';
                    }
                    return '<select id="g1s' + newRowNum + '" objid="' + full.id + '" class="select2 form-control input-sm allowClear">' + netGroupTypeOptions + '</select>';
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "网络ID",
                "data" : "netId",
                "render" : function(data, type, full, meta) {
                    return '<input datatype="*0-80" class="form-control input-sm valiform-keyup" placeholder="多个请用分号隔开" value="' + ($.util.isBlank(full.networkID)?"":full.networkID) + '"/>';
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "网络名称",
                "data" : "netName",
                "render" : function(data, type, full, meta) {
                    return '<input datatype="*0-80" class="form-control input-sm valiform-keyup" placeholder="多个请用分号隔开" value="' + ($.util.isBlank(full.networkName)?"":full.networkName) + '"/>';
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "操作",
                "data" : "",
                "render" : function(data, type, full, meta) {
                    return '<p class="text-center"><a href="##" class="deleteForGroup">删除</a></p>';
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

    function addRowForPerson(personData){
        if(personData == null){
            personData = {};
        }
        $($("#personTable .dataTables_empty").parent()).remove();
        newRowNum++;
        var levelOptions = '<option></option>';
        for(var i in personLevelData){
            var obj = personLevelData[i];
            levelOptions += '<option';
            if(personData.level == obj.id){
                levelOptions += ' selected';
            }
            levelOptions += ' value="' +  obj.id + '">' + obj.name + '</option>';
        }
        var underCtrlOptions = '<option></option>';
        for(var i in underCtrlData){
            var obj = underCtrlData[i];
            underCtrlOptions += '<option';
            if(personData.underControl == obj.id){
                underCtrlOptions += ' selected';
            }
            underCtrlOptions += ' value="' +  obj.id + '">' + obj.name + '</option>';
        }
        var netTypeOptions = '<option></option>';
        for(var i in netTypePersonData){
            var obj = netTypePersonData[i];
            netTypeOptions += '<option';
            if(personData.networkIDType == obj.id){
                netTypeOptions += ' selected';
            }
            netTypeOptions +=' value="' +  obj.id + '">' + obj.name + '</option>';
        }
        var locationOptions = '<option></option>';
        for(var i in personLocationData){
            var obj = personLocationData[i];
            locationOptions += '<option';
            if(personData.location == obj.id){
                locationOptions += ' selected';
            }
            locationOptions +=' value="' +  obj.id + '">' + obj.name + '</option>';
        }
        var disposalWayOptions = '<option></option>';
        for(var i in personDisposalWayData){
            var obj = personDisposalWayData[i];
            disposalWayOptions += '<option';
            if(personData.disposalWay == obj.id){
                disposalWayOptions += ' selected';
            }
            disposalWayOptions +=' value="' +  obj.id + '">' + obj.name + '</option>';
        }
        $.dataTable.addRow("#personTable", "after", personTableSettings,[
            '<input datatype="*0-80" objid="" class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(personData.name)?"":personData.name) + '"/>',
            '<input datatype="/^$|^[0-9]{17}[0-9Xx]$/" class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(personData.identityNumber)?"":personData.identityNumber) + '"/>',
            '<input datatype="*0-80" class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(personData.placeOfDomicile)?"":personData.placeOfDomicile) + '"/>',
            '<select id="p1s' + newRowNum + '" class="select2 form-control input-sm allowClear">' + locationOptions + '</select>',
            '<select id="p2s' + newRowNum + '" class="select2 form-control input-sm allowClear">' + levelOptions + '</select>',

            '<div class="pull-left" style="width: 17%; margin-right: 3%;">' +
            '<select id="p3s' + newRowNum + '" class="underCtrlSelect select2 form-control input-sm allowClear">' +
            underCtrlOptions +
            '</select>' +
            '</div>' +
            '<div class="pull-left" style="width: 37%;">' +
            '<select id="p4s' + newRowNum + '" class="disposalWaySelect select2 form-control input-sm allowClear">' +
            disposalWayOptions +
            '</select>' +
            '</div>' +
            '<div class="pull-left" style="width: 40%;">' +
            '<input datatype="*0-80" class="ctrlInfoInput form-control input-sm valiform-keyup" value="' + ($.util.isBlank(personData.controlInfo)?"":personData.controlInfo) + '"/>' +
            '</div>',

            '<input datatype="/^$|^[0-9]{11}$/" class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(personData.cellphoneNumber)?"":personData.cellphoneNumber) + '"/>',
            '<select id="p5s' + newRowNum + '" class="select2 form-control input-sm allowClear">' + netTypeOptions + '</select>',
            '<input datatype="*0-80" class="form-control input-sm valiform-keyup" placeholder="多个请用分号隔开" value="' + ($.util.isBlank(personData.networkID)?"":personData.networkID) + '"/>',
            '<input datatype="*0-80" class="form-control input-sm valiform-keyup" placeholder="多个请用分号隔开" value="' + ($.util.isBlank(personData.networkName)?"":personData.networkName) + '"/>',
            '<p class="text-center"><a href="##" class="deleteForPerson">删除</a></p>'
        ]);
    }

    function addRowForGroup(groupData){
        if(groupData == null){
            groupData = {};
        }
        $($("#groupTable .dataTables_empty").parent()).remove();
        newRowNum++;
        var netGroupTypeOptions = '<option></option>';
        for(var i in netTypeGroupData){
            var obj = netTypeGroupData[i];
            netGroupTypeOptions += '<option';
            if(groupData.networkIDType == obj.id){
                netGroupTypeOptions += ' selected';
            }
            netGroupTypeOptions += ' value="' +  obj.id + '">' + obj.name + '</option>';
        }
        $.dataTable.addRow("#groupTable", 0, groupTableSettings,[
            '<select id="g1s' + newRowNum + '" objid="" class="select2 form-control input-sm allowClear">' + netGroupTypeOptions + '</select>',
            '<input datatype="*0-80" class="form-control input-sm valiform-keyup" placeholder="多个请用分号隔开" value="' + ($.util.isBlank(groupData.networkID)?"":groupData.networkID) + '"/>',
            '<input datatype="*0-80" class="form-control input-sm valiform-keyup" placeholder="多个请用分号隔开" value="' + ($.util.isBlank(groupData.networkName)?"":groupData.networkName) + '"/>',
            '<p class="text-center"><a href="##" class="deleteForGroup">删除</a></p>'
        ]);
    }

    function getRelevantPerson(){
        var result = [];
        var arr = $("#personTable tbody").find("tr");
        if(arr.length == 0 || $("#personTable .dataTables_empty").length != 0){
            return result;
        }
        for(var i = 0; i < arr.length; i++){
            var obj = {};
            obj.id = $($($(arr[i]).find("td")[0]).find("input")[0]).attr("objid");
            obj.name = $($($(arr[i]).find("td")[0]).find("input")[0]).val();
            obj.identityNumber = $($($(arr[i]).find("td")[1]).find("input")[0]).val();
            obj.placeOfDomicile = $($($(arr[i]).find("td")[2]).find("input")[0]).val();
            obj.location = $($($(arr[i]).find("td")[3]).find("select")[0]).select2("val");
            obj.level = $($($(arr[i]).find("td")[4]).find("select")[0]).select2("val");
            obj.underControl = $($($(arr[i]).find("td")[5]).find("select")[0]).select2("val");
            obj.disposalWay = $($($(arr[i]).find("td")[5]).find("select")[1]).select2("val");
            obj.controlInfo = $($($(arr[i]).find("td")[5]).find("input")[0]).val();
            obj.cellphoneNumber = $($($(arr[i]).find("td")[6]).find("input")[0]).val();
            obj.networkIDType = $($($(arr[i]).find("td")[7]).find("select")[0]).select2("val");
            obj.networkID = $($($(arr[i]).find("td")[8]).find("input")[0]).val();
            obj.networkName = $($($(arr[i]).find("td")[9]).find("input")[0]).val();
            result.push(obj);
        }
        return result;
    }

    function getRelevantNetGroup(){
        var result = [];
        var arr = $("#groupTable tbody").find("tr");
        if(arr.length == 0 || $("#groupTable .dataTables_empty").length != 0){
            return result;
        }
        for(var i = 0; i < arr.length; i++){
            var obj = {};
            obj.id = $($($(arr[i]).find("td")[0]).find("select")[0]).attr("objid");
            obj.networkIDType = $($($(arr[i]).find("td")[0]).find("select")[0]).select2("val");
            obj.networkID = $($($(arr[i]).find("td")[1]).find("input")[0]).val();
            obj.networkName = $($($(arr[i]).find("td")[2]).find("input")[0]).val();
            result.push(obj);
        }
        return result;
    }

    function eventsForPersonTable(){
        $(document).on("click",".addRowForPerson",function(){
            addRowForPerson();
        });

        $(document).on("click",".deleteForPerson",function(){
            var obj = this;
            window.top.$.layerAlert.confirm({
                msg:"删除后不可恢复，确认删除？",
                title:"提示",	  //弹出框标题
                yes:function(index, layero){
                    var tr = $(obj).parents("tr")[0]
                    var id = $($($(tr).find("td")[0]).find("input")[0]).attr("objid");
                    if(!$.util.isBlank(id)){
                        deletePersonIdLst.push(id);
                    }
                    $(tr).remove();
                }
            });
        });

        // $(document).on("select2:select",".underCtrlSelect",function(){
        //     if($(this).select2("val") == $.common.dict.SF_S){
        //         $($(this).parents("td").find(".ctrlInfoInput")[0]).removeAttr("disabled");
        //     }else{
        //         $($(this).parents("td").find(".ctrlInfoInput")[0]).attr("disabled", "disabled");
        //         $($(this).parents("td").find(".ctrlInfoInput")[0]).val("");
        //     }
        // });
        // $(document).on("select2:unselect",".underCtrlSelect",function(){
        //     $($(this).parents("td").find(".ctrlInfoInput")[0]).attr("disabled", "disabled");
        //     $($(this).parents("td").find(".ctrlInfoInput")[0]).val("");
        // });

    }

    function eventsForGroupTable(){
        $(document).on("click",".addRowForGroup",function(){
            addRowForGroup();
        });

        $(document).on("click",".deleteForGroup",function(){
            var obj = this;
            window.top.$.layerAlert.confirm({
                msg:"删除后不可恢复，确认删除？",
                title:"提示",	  //弹出框标题
                yes:function(index, layero){
                    var tr = $(obj).parents("tr")[0];
                    var id = $($($(tr).find("td")[0]).find("select")[0]).attr("objid");
                    if(!$.util.isBlank(id)){
                        deleteGroupIdLst.push(id);
                    }
                    $(tr).remove();
                }
            });
        });
    }
    jQuery.extend($.common, {

    });
})(jQuery);