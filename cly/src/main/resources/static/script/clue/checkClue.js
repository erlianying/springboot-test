
(function($){
    "use strict";
    var newRowNum = 0;
    var personTableSettings = null;
    var groupTableSettings = null;
    var personTable = null; //关联人员
    var groupTable = null;  //关联群组
    var inspectFeedbackRecordTable = null;//落地核查反馈
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
            url:context +'/clueFlow/editCheckFlag',
            type:'post',
            data:{clueId : clueId},
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
        })
        events();
    });

    function events(){
        eventsForPersonTable();
        eventsForGroupTable();
        $(document).on("click","#fileObj",function(){
            var fileId = $(this).attr("fileId");
            var form = $.util.getHiddenForm(context+'/clue/downloadFile', {"metaId": fileId});
            $.util.subForm(form);
        });
        $(document).on("click","#backUrl",function(){
            window.top.history.back();
        });


        $(document).on("click",".showPhoneNum",function(){
            var str = $(this).text();
            showAddPersonDialog(str,"phone");
        });
        $(document).on("click",".showIdNum",function(){
            var str = $(this).text();
            showAddPersonDialog(str,"id");
        });

        $(document).on("click","#check",function(){
            $("#check").attr("disabled", "disabled");
            var demo = $.validform.getValidFormObjById("validform") ;
            var flag = $.validform.check(demo) ;
            if(!flag){
                $("#check").removeAttr("disabled");
                return ;
            }
            var obj = getData();
            var dataMap = {};
            $.util.objToStrutsFormData(clueId, "clueId", dataMap);
            $.util.objToStrutsFormData(obj, "clueCheckBean", dataMap);
            $.ajax({
                url:context +'/clueFlow/check',
                type:'post',
                data:dataMap,
                dataType:'json',
                success:function(successData){
                    window.top.$.layerAlert.alert({msg:"核查成功！",icon:"1",end : function(){
                        window.top.history.back();
                    }});
                }
            });
        });
    }

    function showUploadDialog(tranData){
        window.top.$.layerAlert.dialog({
            content : context +  '/show/page/web/clue/batchImportLayerForCheckClue',
            pageLoading : true,
            title:"导入",
            width : "500px",
            height : "350px",
            shadeClose : false,
            initData:function(){
                return $.util.exist(tranData)?tranData:{} ;
            },
            success:function(layero, index){

            },
            end:function(){
            },
            btn:["导入", "取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                    var obj = cm.submitMethod(index);
                },
                btn2:function(index, layero){
                    window.top.layer.close(index);
                }
            }
        });
    }
    function eventsForPersonTable(){
        $(document).on("click",".importForPerson",function(){
            var tranData = {
                downloadUrl : '/petitionRegistrationExportExcel/downloadPetitionModel?fileName=relevantPersonModel.xlsx',
                uploadUrl : '/clue/relevantPersonBatchImport',
                win$ : $
            };
            showUploadDialog(tranData);
        });

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

    }

    function eventsForGroupTable(){
        $(document).on("click",".importForGroup",function(){
            var tranData = {
                downloadUrl : '/petitionRegistrationExportExcel/downloadPetitionModel?fileName=relevantNetGroupModel.xlsx',
                uploadUrl : '/clue/relevantNetGroupBatchImport',
                win$ : $
            };
            showUploadDialog(tranData);
        });

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
                $("#content").text(clueBean.content);
                $.ajax({
                    url:context +'/clueFlow/findNumbers',
                    type:'post',
                    data:{content : clueBean.content},
                    dataType:'json',
                    success:function(map){
                        var tempContent = clueBean.content;
                        if(map != null){
                            for(var i in map.idNum){
                                tempContent = tempContent.replace(map.idNum[i], "<a href='###' class='showIdNum'>" + map.idNum[i] + "</a>");
                            }
                            for(var i in map.phoneNum){
                                tempContent = tempContent.replace(map.phoneNum[i], "<a href='###' class='showPhoneNum'>" + map.phoneNum[i] + "</a>");
                            }
                        }
                        $("#content").html(tempContent);
                    }
                });
                if($.util.isBlank(clueBean.remark)){
                    $(".remarkDiv").hide();
                }else{
                    $("#remark").text(clueBean.remark);
                }
                $("#type").text(clueBean.typeName);

                $("#sourceUnit").text($.util.isBlank(clueBean.otherSourceUnit)?clueBean.sourceUnitTwoName:clueBean.otherSourceUnit);
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
                        if(i%4 == 0){
                            htmlStr += '<div class="row row-mar">' + createKeyValueDiv(obj.name, obj.content, 3);
                            if(i == clueBean.additionalInfoBeanList.length - 1){
                                htmlStr += '</div>';
                            }
                        }
                        if(i%4 == 1 || i%4 == 2){
                            htmlStr += createKeyValueDiv(obj.name, obj.content, 3);
                            if(i == clueBean.additionalInfoBeanList.length - 1){
                                htmlStr += '</div>';
                            }
                        }
                        if(i%4 == 3){
                            htmlStr += createKeyValueDiv(obj.name, obj.content, 3) + '</div>';
                        }
                    }
                }
                $($("#source").parents("div")[0]).after(htmlStr);
                if(!$.util.isBlank(clueBean.endTimeLong)){
                    $("#startTime").text($.date.timeToStr(clueBean.startTimeLong, "yyyy-MM-dd"));
                }
                if(!$.util.isBlank(clueBean.endTimeLong)){
                    $("#endTime").text($.date.timeToStr(clueBean.endTimeLong, "yyyy-MM-dd"));
                }
                if(clueBean.undefinedStartTime == $.common.dict.SF_S){
                    $("#undefinedStartTime").text("确定");
                    $(".undefinedEndTimeDiv").hide();
                }else{
                    $("#undefinedStartTime").text("不确定");
                    $(".undefinedEndTimeDiv").show();
                    $("#undefinedEndTime").text(clueBean.undefinedEndTime);
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
                // 核查结果反馈
                initInspectFeedbackRecordTable(clueBean.inspectFeedbackRecordBeanList);
            }
        });
    }

    function createKeyValueDiv(key, value, num){
        return '<div class="col-xs-' + num + '"><p class="control-p">' + key + '：</p></div><div class="col-xs-1">' + value + '</div>'
    }

    function initInspectFeedbackRecordTable(data){
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

                    return data;
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

    function getData(){
        var clueCheckBean = {};
        clueCheckBean.content = $("#feedbackContent").val();
        clueCheckBean.deletePersonIdLst = deletePersonIdLst;
        clueCheckBean.deleteGroupIdLst = deleteGroupIdLst;
        clueCheckBean.relevantPersonList = getRelevantPerson();
        clueCheckBean.relevantNetGroupList = getRelevantNetGroup();
        return clueCheckBean;
    }

    function showAddPersonDialog(str, type){
        var tranObj = {
            "str" : str,
            "type" : type,
            "clueId" : clueId,
            "parentCommon" : $.common
        }
        window.top.$.layerAlert.dialog({
            content : context +  '/show/page/web/clue/addPersonDialog',
            pageLoading : true,
            title:"添加人员",
            width : "1200px",
            height : "750px",
            shadeClose : false,
            initData:function(){
                return $.util.exist(tranObj)?tranObj:{} ;
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
    }
    jQuery.extend($.common, {
        transformData : function(obj, index, downloadUrl){
            if(downloadUrl == '/petitionRegistrationExportExcel/downloadPetitionModel?fileName=relevantNetGroupModel.xlsx'){
                for(var i in obj){
                    addRowForGroup(obj[i]);
                }
            }else{
                for(var i in obj){
                    addRowForPerson(obj[i]);
                }
            }
            window.top.layer.close(index);
        },
        addPerson : function(obj, index){
            addRowForPerson(obj);
            if(!$.util.isBlank(obj.otherRemark)){
                $("#feedbackContent").val($("#feedbackContent").val() +"  " + obj.otherRemark);
            }
            if($("#feedbackContent").val() == "") {
                $("#feedbackContent").val("无最新跟进情况。");
            }
            window.top.layer.close(index);
        }
    });
})(jQuery);