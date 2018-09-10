
(function($){
    "use strict";

    var personTable;
    var newRowNum = 0;
    var groupTable;
    var personTableSettings;
    var groupTableSettings;
    var personLevelData = [];
    var underCtrlData = [];
    var netTypePersonData = [];
    var netTypeGroupData = [];
    var tempSiteData = [];
    var instLevelData = [];
    var personLocationData = [];
    var targetSiteSite = [];
    var saving = false;
    $(document).ready(function() {
        if(!$.util.isBlank(pictureId)){
            //ajax 调用接口获取线索内容，参数为pictureId(Controller未实现)
            $.ajax({
                url:context +'/clue/findContextByPictureId',
                type:'post',
                data:{pictureId : pictureId},
                dataType:'json',
                success:function(successData){
                    $(".fileDiv").show();
                    //在fileDiv生成下载链接a标签，图片名字叫通过ajax查出来
                    $("#fileObj").text(successData.fileName);
                    $("#fileObj").attr("fileId", pictureId);
                },
                error:function(errorData){
                    console.log(errorData);
                }
            });
            var pojoData = {
                id : pictureId
            }
            window.top.$.layerAlert.dialog({
                content : context +  '/show/page/web/clue/compareText',
                pageLoading : true,
                title:"比对录入",
                width : "1400px",
                height : "700px",
                shadeClose : false,
                initData:function(){
                    return $.util.exist(pojoData)?pojoData:{} ;
                },
                success:function(layero, index){

                },
                end:function(){
                },
                btn:["保存", "关闭"],
                callBacks:{
                    btn1:function(index, layero){
                        var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                        $("#content").val(cm.getSelected());
                        window.top.layer.close(index);
                    },
                    btn2:function(index, layero){
                        window.top.layer.close(index);
                    }
                }
            });
        }
        initData();
        events();
        initPersonTable();
        initGroupTable();
    });

    function initData(){
        //动态控件数据查询
        $.ajax({
            url:context +'/clue/findAllTargetSite',
            type:'post',
            data:{},
            dataType:'json',
            success:function(successData){
                targetSiteSite = successData;
                $.select2.addByList("#row3Id0", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_RYDJ},
            dataType:'json',
            success:function(successData){
                personLevelData = successData;
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_SF},
            dataType:'json',
            success:function(successData){
                underCtrlData = successData;
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_WLIDRLX},
            dataType:'json',
            success:function(successData){
                netTypePersonData = successData;
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_WLIDQLX},
            dataType:'json',
            success:function(successData){
                netTypeGroupData = successData;
            }
        });

        //控件数据初始化
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
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_XSLB},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#type", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_QBJB},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#level", successData, "id", "name", true, true);
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
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_HQFS},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#source", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_QTLX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#involveCrowdOne", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_XWFS},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#wayOfActOne", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_RYSD},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#placeOfOriginOne", successData, "id", "name", true, true);
                personLocationData = successData;
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_MGZX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#sensitiveInfo", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_LYDWFZ},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#sourceUnitOne", true);
                $.select2.addByList("#sourceUnitOne", successData, "id", "name", true, true);
                var tempSourceUnitTypeLst = successData;
                $.ajax({
                    url:context +'/clue/findSourceUnitForMe',
                    type:'post',
                    data:{},
                    dataType:'json',
                    success:function(unitData){
                        for(var i in tempSourceUnitTypeLst){
                            if(unitData.unitType == tempSourceUnitTypeLst[i].id){
                                $.select2.val("#sourceUnitOne", unitData.unitType);
                                $.ajax({
                                    url:context +'/clue/findSourceUnit',
                                    type:'post',
                                    data:{groupType : $.select2.val("#sourceUnitOne")},
                                    dataType:'json',
                                    success:function(successData){
                                        $.select2.empty("#sourceUnitTwo", true);
                                        $.select2.addByList("#sourceUnitTwo", successData, "id", "name", true, true);
                                        $.select2.val("#sourceUnitTwo", unitData.unitId);
                                    }
                                });
                                break;
                            }
                        }
                    }
                });

            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.DQZT_PSJB},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#instLevel", successData, "id", "name", true, true);
                instLevelData = successData;
            }
        });
    }

    function events(){
        eventsForPersonTable();
        eventsForGroupTable();

        $(document).on("select2:select","#undefinedStartTime",function(){
            var day = 0;
            if($.select2.val("#undefinedStartTime") == $.common.dict.SF_F){
                $(".undefinedEndTimeDiv").show();
                $("#undefinedEndTime").attr("dataType","*0-80");
                day = 7;
            }else{
                $(".undefinedEndTimeDiv").hide();
                $("#undefinedEndTime").attr("dataType","*0-80");
                $("#undefinedEndTime").val("");
            }
            var startTimeLong =  $.laydate.getTime("#targetTime", "start");
            var endTimeLong = $.laydate.getTime("#targetTime", "end");
            if(startTimeLong != null && endTimeLong == null){
                endTimeLong = startTimeLong + 1000 * 60 * 60 * 24 * day;
                $.laydate.setTimeRange(startTimeLong, endTimeLong, "#targetTime", "yyyy-MM-dd", "both");
            }
        });

        $(document).on("select2:select","#sourceUnitTwo",function(){
            if($.select2.val("#sourceUnitTwo") == $.common.orgAttr.QT){
                $(".otherSourceUnitDiv").show();
                $("#otherSourceUnit").attr("dataType","*1-80");
            }else{
                $(".otherSourceUnitDiv").hide();
                $("#otherSourceUnit").attr("dataType","*0-80");
                $("#otherSourceUnit").val("");
            }
        });

        $(document).on("click","#addCrowd",function(){
            alertCrowdEditPage();
        });
        $(document).on("click","#undefinedTargetSite",function(){
            $.ajax({
                url:context +'/clue/findAllTargetSite',
                type:'post',
                data:{},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#row3Id0", true);
                    $.select2.addByList("#row3Id0", successData, "id", "name", true, true);
                    $.select2.selectByText("#row3Id0", "北京市", true);
                }
            });
        });
        $(document).on("click","#backUrl",function(){
            window.top.history.back();
        });
        $(document).on("click",".showYaoSu",function(){
            $.ajax({
                url:context +'/clue/sentenceAnalysis',
                type:'post',
                data:{text : $("#content").val()},
                dataType:'json',
                success:function(successData){
                    var personLst = successData.relevantPersonList;
                    for(var i in personLst){
                        addRowForPerson(personLst[i]);
                    }
                    var groupLst = successData.relevantNetGroupList;
                    for(var i in groupLst){
                        addRowForGroup(groupLst[i]);
                    }
                }
            });
        });
        $(document).on("click","#fileObj",function(){
            var fileId = $(this).attr("fileId");
            var form = $.util.getHiddenForm(context+'/clue/downloadFile', {"metaId": fileId});
            $.util.subForm(form);
        });
        $(document).on("click",".pictureRead",function(){
            //TODO show上传页面，获附件id，并调用下列方法跳转到输入页面，传递附件id
             scanImport();
            // var form = $.util.getHiddenForm(context + "/show/page/web/clue/enterClue", {pictureId:"123"});
            // form.submit();
        });
        $(document).on("click",".addTargetSite",function(){
            addTargetSite();
        });
        $(document).on("click",".deleteTargetSite",function(){
            $($(this).parents(".newTargetSite")[0]).remove();
        });
        $(document).on("click",".addInst",function(){
            addInst();
        });
        $(document).on("click",".deleteInst",function(){
            $($(this).parents(".newInstGroup")[0]).remove();
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
        $(document).on("select2:select","#placeOfOriginOne",function(){
            $.ajax({
                url:context +'/dictionary/findDictionaryItemsByParentId',
                type:'post',
                data:{parentId : $.select2.val("#placeOfOriginOne")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#placeOfOriginTwo", true);
                    $.select2.addByList("#placeOfOriginTwo", successData, "id", "name", true, true);
                }
            });
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
        $(document).on("select2:select","#source",function(){
            $.ajax({
                url:context +'/dictionary/findDictionaryItemsByParentId',
                type:'post',
                data:{parentId : $.select2.val("#source")},
                dataType:'json',
                success:function(successData){
                    $(".addInfoDiv").empty();
                    initAdditionalInfo(successData);
                }
            });
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
                    $(".otherSourceUnitDiv").hide();
                    $("#otherSourceUnit").attr("dataType","*0-80");
                    $("#otherSourceUnit").val("");
                }
            });
        });

        $(document).on("click","#save",function(){
            $(".save").attr("disabled", "disabled");
            save();
        });
        $(document).on("click","#inform",function(){
            $(".save").attr("disabled", "disabled");
            saveAndInform();
        });
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
                    $($(obj).parents("tr")[0]).remove();
                }
            });
        });
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
                    $($(obj).parents("tr")[0]).remove();
                }
            });
        });
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

    function addRowForPerson(personData){
        if(personData == null){
            personData = {};
        }
        $($("#personTable .dataTables_empty").parent()).remove();
        newRowNum++;
        var data = {};
        data.locationOptions = '<option></option>';
        for(var i in personLocationData){
            var obj = personLocationData[i];
            data.locationOptions += '<option value="' +  obj.id + '">' + obj.name + '</option>';
        }
        data.levelOptions = '<option></option>';
        for(var i in personLevelData){
            var obj = personLevelData[i];
            data.levelOptions += '<option value="' +  obj.id + '">' + obj.name + '</option>';
        }
        data.netTypeOptions = '<option></option>';
        for(var i in netTypePersonData){
            var obj = netTypePersonData[i];
            data.netTypeOptions += '<option';
            if(personData.networkIDType == obj.id){
                data.netTypeOptions += ' selected';
            }
            data.netTypeOptions +=' value="' +  obj.id + '">' + obj.name + '</option>';
        }
        $.dataTable.addRow("#personTable", "after", personTableSettings,[
            '<input datatype="*0-80" class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(personData.name)?"":personData.name) + '"/>',
            '<input datatype="/^$|^[0-9]{17}[0-9Xx]$/" class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(personData.identityNumber)?"":personData.identityNumber) + '"/>',

            '<input datatype="*0-80" class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(personData.placeOfDomicile)?"":personData.placeOfDomicile) + '"/>',
            '<select id="p1s' + newRowNum + '" class="select2 form-control input-sm allowClear">' + data.locationOptions + '</select>',

            '<select id="p2s' + newRowNum + '" class="select2 form-control input-sm allowClear">' + data.levelOptions + '</select>',
            '<input datatype="/^$|^[0-9]{11}$/" class="form-control input-sm valiform-keyup" value="' + ($.util.isBlank(personData.cellphoneNumber)?"":personData.cellphoneNumber) + '"/>',
            '<select id="p3s' + newRowNum + '" class="select2 form-control input-sm allowClear">' + data.netTypeOptions + '</select>',
            '<input datatype="*0-80" class="form-control input-sm valiform-keyup" placeholder="多个请用分号隔开" value="' + ($.util.isBlank(personData.networkID)?"":personData.networkID) + '"/>',
            '<input datatype="*0-80" class="form-control input-sm valiform-keyup" placeholder="多个请用分号隔开" value="' + ($.util.isBlank(personData.networkName)?"":personData.networkName) + '"/>',
            '<p class="text-center"><a href="##" class="deleteForPerson">删除</a></p>'
        ]);
    }

    function saveAndInform(){
        var dataMap = {};
        var thisWindow = window;
        var demo = $.validform.getValidFormObjById("validform") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            $(".save").removeAttr("disabled");
            setTimeout(function(){
                $.validform.closeAllTips("validform");
            },8000);
            return ;
        }
        var instructionsBeanList = getInst();
        if(instructionsBeanList == "Error"){
            return;
        }
        var instructionsBeanPackage = {
            instructionsBeanList : instructionsBeanList
        };
        $.util.objToStrutsFormData(instructionsBeanPackage, "instructionsBeanPackage", dataMap);

        var clueBean = getClueData();
        clueBean.targetSiteBeanList = getTargetSite();
        if(clueBean.targetSiteBeanList == false){
            window.top.$.layerAlert.alert({msg:"指向地点有重复，请修改！",icon:"1",end : function(){
                $(".save").removeAttr("disabled");
            }});
            return;
        }
        clueBean.additionalInfoBeanList = getAdditionalInfo();
        clueBean.relevantPersonList = getRelevantPerson();
        clueBean.relevantNetGroupList = getRelevantNetGroup();

        $.util.objToStrutsFormData(clueBean, "clueBean", dataMap);
        var localSez = false;
        for(var n = 0; n < clueBean.relevantPersonList.length; n++){
            if(!$.util.isBlank(clueBean.relevantPersonList[n].cellphoneNumber)){
                localSez = true;
            }
        }
        var initData = {
            id : null,
            sez : localSez,
            qtlx : $.select2.val("#involveCrowdOne"),
            xslb : $.select2.val("#type")
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
                $(".save").removeAttr("disabled");
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
                    $.util.objToStrutsFormData(obj["mainObj"], "mainUnit", dataMap);
                    $.util.objToStrutsFormData(coopUnit, "coopUnit", dataMap);
                    if(!saving) {
                        saving = true;
                        $.ajax({
                            url: context + '/clueFlow/saveAndInform',
                            type: 'post',
                            data: dataMap,
                            dataType: 'json',
                            success: function (successData) {
                                saving = false;
                                if (successData.flag == "true") {
                                    window.top.$.layerAlert.alert({
                                        msg: "保存并通报成功！", icon: "1", end: function () {
                                            window.top.layer.close(index);
                                            thisWindow.location = context + '/show/page/web/clue/viewClue?clueId=' + successData.returnData;
                                        }
                                    });
                                } else {
                                    window.top.$.layerAlert.alert({
                                        msg: "保存并通报失败!" + successData.errorMessage, icon: "2", end: function () {
                                            $(".save").removeAttr("disabled");
                                        }
                                    });
                                }
                            }
                        });
                    }
                },
                btn2:function(index, layero){
                    window.top.layer.close(index);
                    $(".save").removeAttr("disabled");
                }
            }
        });
    }

    function initPersonTable(){
        personTableSettings = $.uiSettings.getLocalOTableSettings();
        personTableSettings.data = [];
        personTableSettings.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return '<input class="form-control input-sm"/>';
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "身份证号",
                "data" : "idNum",
                "render" : function(data, type, full, meta) {
                    return '<input class="form-control input-sm"/>';
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "人员属地",
                "data" : "idNum",
                "render" : function(data, type, full, meta) {
                    return '<input class="form-control input-sm"/>';
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "当前位置",
                "data" : "idNum",
                "render" : function(data, type, full, meta) {
                    return '<select class="select2 form-control input-sm"/>';
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "人员等级",
                "data" : "level",
                "render" : function(data, type, full, meta) {
                    return '<select class="select2 form-control input-sm"/>';
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "手机号",
                "data" : "cellphone",
                "render" : function(data, type, full, meta) {
                    return '<input class="form-control input-sm"/>';
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "网络ID类型",
                "data" : "netType",
                "render" : function(data, type, full, meta) {
                    return '<select class="select2 form-control input-sm"/>';
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "网络ID",
                "data" : "netId",
                "render" : function(data, type, full, meta) {
                    return '<input class="form-control input-sm" placeholder="多个请用分号隔开"/>';
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "网络名称",
                "data" : "netName",
                "render" : function(data, type, full, meta) {
                    return '<input class="form-control input-sm" placeholder="多个请用分号隔开"/>';
                }
            },
            {
                "targets" : 9,
                "width" : "",
                "title" : "操作",
                "data" : "",
                "render" : function(data, type, full, meta) {
                    return '<p class="text-center"><a href="##" class="saveForPerson">保存</a></p>'+'<p class="text-center"><a href="##" class="deleteForPerson">删除</a></p>';
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

    function initGroupTable(){
        groupTableSettings = $.uiSettings.getLocalOTableSettings();
        groupTableSettings.data = [];
        groupTableSettings.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "网络ID类型",
                "data" : "netType",
                "render" : function(data, type, full, meta) {
                    return '<select class="select2 form-control input-sm"/>';
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "网络ID",
                "data" : "netId",
                "render" : function(data, type, full, meta) {
                    return '<input class="form-control input-sm" placeholder="多个请用分号隔开"/>';
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "网络名称",
                "data" : "netName",
                "render" : function(data, type, full, meta) {
                    return '<input class="form-control input-sm" placeholder="多个请用分号隔开"/>';
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "操作",
                "data" : "",
                "render" : function(data, type, full, meta) {
                    return '<p class="text-center"><a href="##" class="saveForGroup">保存</a></p>'+'<p class="text-center"><a href="##" class="deleteForGroup">删除</a></p>';
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

    function getClueData(){
        var bean = {};
        if(!$.util.isBlank($("#fileObj").attr("fileId"))){
            bean.fileId = $("#fileObj").attr("fileId");
        }
        bean.content = $("#content").val();
        bean.remark = $("#remark").val();
        bean.type = $.select2.val("#type");
        bean.fileNum = $("#fileNum").val();
        bean.sourceUnitTwo = $.select2.val("#sourceUnitTwo");
        bean.otherSourceUnit = $("#otherSourceUnit").val();
        bean.level = $.select2.val("#level");
        bean.inBeijing = $.select2.val("#inBeijing");
        bean.source = $.select2.val("#source");
        bean.startTimeLong =  $.laydate.getTime("#targetTime", "start");
        bean.undefinedStartTime = ($("#undefinedStartTime").val() == "预计时间")?"":$("#undefinedStartTime").val();
        bean.endTimeLong = $.laydate.getTime("#targetTime", "end");
        bean.undefinedEndTime = ($("#undefinedEndTime").val() == "预计时间")?"":$("#undefinedEndTime").val();
        bean.involveCrowdTwo = $.select2.val("#involveCrowdTwo");
        bean.wayOfActOne = $.select2.val("#wayOfActOne");
        if($.select2.text("#wayOfActTwo") != null){
            bean.wayOfActTwo = $.select2.text("#wayOfActTwo")[0];
        }else{
            bean.wayOfActTwo = null;
        }
        bean.placeOfOriginOne = $("#placeOfOriginOne").val();
        // bean.placeOfOriginOne = $.select2.val("#placeOfOriginOne");
        // bean.placeOfOriginTwo = $.select2.val("#placeOfOriginTwo");
        bean.sensitiveInfo = $.select2.val("#sensitiveInfo");
        return bean;
    }

    function getTargetSite(){
        var result = [];
        var arr = $(".targetSiteDiv").find(".row");
        for(var i = 0; i < arr.length; i++){
            var obj = {};
            obj.site = $.select2.text("#" + $($(arr[i]).find(".tsSite")[0]).attr("id"))[0];
            for(var n in result){
                if(result[n].site == obj.site){
                    return false;
                }
            }
            result.push(obj);
        }
        return result;
    }
    function getInst(){
        var result = [];
        var arr = $(".instDiv").find(".newInstGroup");
        if(arr == null || arr.length == 0){
            if(!$.util.isBlank($("#instContent").val())){
                var obj = {};
                obj.level = $.select2.val("#instLevel");
                obj.instTimeLong = $.laydate.getTime("#instTime", "date");
                obj.content = $("#instContent").val();
                if($.util.isBlank(obj.level)){
                    window.top.$.layerAlert.alert({msg:"请选择批示级别！",icon:"1",end : function(){
                        $(".save").removeAttr("disabled");
                    }});
                    return "Error";
                }
                if($.util.isBlank(obj.instTimeLong)){
                    window.top.$.layerAlert.alert({msg:"请填写批示时间！",icon:"1",end : function(){
                        $(".save").removeAttr("disabled");
                    }});
                    return "Error";
                }
                if(obj.content.length > 2000){
                    window.top.$.layerAlert.alert({msg:"批示内容超长（2000字）！",icon:"1",end : function(){
                        $(".save").removeAttr("disabled");
                    }});
                    return "Error";
                }
                result.push(obj);
            }
        }else{
            for(var i = 0; i < $(".newInstGroup, .instGroup").length; i++){
                var htmlObj = $(".newInstGroup, .instGroup")[i];
                var obj = {};
                obj.level = $($(htmlObj).find(".instLevel")[0]).select2("val");
                var timeCtrlId = $($(htmlObj).find(".instTime")[0]).attr("id");
                obj.instTimeLong = $.laydate.getTime("#"+timeCtrlId, "date");
                obj.content = $($(htmlObj).find(".instContent")[0]).val();
                if($.util.isBlank(obj.level)){
                    window.top.$.layerAlert.alert({msg:"请选择批示级别！",icon:"1",end : function(){
                        $(".save").removeAttr("disabled");
                    }});
                    return "Error";
                }
                if($.util.isBlank(obj.instTimeLong)){
                    window.top.$.layerAlert.alert({msg:"请填写批示时间！",icon:"1",end : function(){
                        $(".save").removeAttr("disabled");
                    }});
                    return "Error";
                }
                if(obj.content.length == 0){
                    window.top.$.layerAlert.alert({msg:"请填写批示内容！",icon:"1",end : function(){
                        $(".save").removeAttr("disabled");
                    }});
                    return "Error";
                }
                if(obj.content.length > 2000){
                    window.top.$.layerAlert.alert({msg:"批示内容超长（2000字）！",icon:"1",end : function(){
                        $(".save").removeAttr("disabled");
                    }});
                    return "Error";
                }
                result.push(obj);
            }
        }
        return result;
    }

    function getAdditionalInfo(){
        var result = [];
        var arr = $(".addInfoDiv").find("input");
        for(var i = 0; i < arr.length; i++){
            var obj = {};
            obj.dicItem = $(arr[i]).attr("id");
            obj.content = $(arr[i]).val();
            obj.dicType = $.common.dict.TYPE_HQFS;
            result.push(obj);
        }
        return result;
    }

    function getRelevantPerson(){
        var result = [];
        var arr = $("#personTable tbody").find("tr");
        if(arr.length == 0 || $("#personTable .dataTables_empty").length != 0){
            return result;
        }
        for(var i = 0; i < arr.length; i++){
            var obj = {};
            obj.name = $($($(arr[i]).find("td")[0]).find("input")[0]).val();
            obj.identityNumber = $($($(arr[i]).find("td")[1]).find("input")[0]).val();
            obj.placeOfDomicile = $($($(arr[i]).find("td")[2]).find("input")[0]).val();
            obj.location = $($($(arr[i]).find("td")[3]).find("select")[0]).select2("val");
            obj.level = $($($(arr[i]).find("td")[4]).find("select")[0]).select2("val");
            obj.cellphoneNumber = $($($(arr[i]).find("td")[5]).find("input")[0]).val();
            obj.networkIDType = $($($(arr[i]).find("td")[6]).find("select")[0]).select2("val");
            obj.networkID = $($($(arr[i]).find("td")[7]).find("input")[0]).val();
            obj.networkName = $($($(arr[i]).find("td")[8]).find("input")[0]).val();
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
            obj.networkIDType = $($($(arr[i]).find("td")[0]).find("select")[0]).select2("val");
            obj.networkID = $($($(arr[i]).find("td")[1]).find("input")[0]).val();
            obj.networkName = $($($(arr[i]).find("td")[2]).find("input")[0]).val();
            result.push(obj);
        }
        return result;
    }

    function save(){
        var dataMap = {};
        var demo = $.validform.getValidFormObjById("validform") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            $(".save").removeAttr("disabled");
            setTimeout(function(){
                $.validform.closeAllTips("validform");
            },3000);
            return ;
        }

        var instructionsBeanList = getInst();
        if(instructionsBeanList == "Error"){
            return;
        }
        var instructionsBeanPackage = {
            instructionsBeanList : instructionsBeanList
        };
        $.util.objToStrutsFormData(instructionsBeanPackage, "instructionsBeanPackage", dataMap);

        var clueBean = getClueData();
        clueBean.targetSiteBeanList = getTargetSite();
        if(clueBean.targetSiteBeanList == false){
            window.top.$.layerAlert.alert({msg:"指向地点有重复，请修改！",icon:"1",end : function(){
                $(".save").removeAttr("disabled");
            }});
            return;
        }
        clueBean.additionalInfoBeanList = getAdditionalInfo();
        clueBean.relevantPersonList = getRelevantPerson();
        clueBean.relevantNetGroupList = getRelevantNetGroup();

        $.util.objToStrutsFormData(clueBean, "clueBean", dataMap);
        if(!saving) {
            saving = true;
            $.ajax({
                url: context + '/clue/save',
                type: 'post',
                data: dataMap,
                dataType: 'json',
                success: function (successData) {
                    saving = false;
                    if (successData.flag == "true") {
                        window.top.$.layerAlert.alert({
                            msg: "保存成功！", icon: "1", end: function () {
                                window.location = context + '/show/page/web/clue/viewClue?clueId=' + successData.returnData;
                            }
                        });
                    } else {
                        window.top.$.layerAlert.alert({
                            msg: "保存失败" + successData.errorMessage, icon: "2", end: function () {
                                $(".save").removeAttr("disabled");
                            }
                        });
                    }
                }
            });
        }
    }

    function initAdditionalInfo(data){
        var htmlStr = "";
        for(var i in data){
            if(i % 3 == 0){
                htmlStr += '<div class="row">'+ addAIInput(data[i]);
                if(data.length - 1 == i){
                    htmlStr += '</div>';
                }
            }
            if(i % 3 == 1){
                htmlStr += addAIInput(data[i]);
                if(data.length - 1 == i){
                    htmlStr += '</div>';
                }
            }
            if(i % 3 == 2){
                htmlStr += addAIInput(data[i]) + '</div>';
            }
        }
        $(".addInfoDiv").append(htmlStr);
    }
    function addAIInput(data){
        return '<div class="col-xs-2">' + '<label class="control-label">' + data.name + '：<span class="red-star">*</span></label>'+
        '</div>'+
        '<div class="col-xs-2">'+
        '<input id="' + data.id + '" datatype="n1-7" class="form-control input-sm valiform-keyup">'+
        '</div>'
    }
    function addTargetSite(){
        newRowNum++;
        var siteOptions = '';
        for(var i in targetSiteSite){
            var obj = targetSiteSite[i];
            siteOptions += '<option value="' +  obj.id + '">' + obj.name + '</option>';
        }
        var htmlStr = '<div style="margin-top: 10px;" class="row newTargetSite" >'+
            '<div class="col-xs-3">'+
                '<select id="row3Id' + newRowNum + '" datatype="*" class="tsSite select2-multiple-tag form-control input-sm valiform-keyup"' +
                    'multiple="multiple" maxSelected="1" maxWritten="50">' + siteOptions + '</select>' +
            '</div>'+
            '<div class="col-xs-1">'+
                '<button class="deleteTargetSite btn btn-primary btn-sm glyphicon glyphicon-minus"><span class=""></span></button>'+
            '</div>'+
        '</div>';
        $('.targetSiteDiv').append(htmlStr);
    }

    function addInst(){
        newRowNum++;
        var jbOptions = '';
        for(var i in instLevelData){
            var obj = instLevelData[i];
            jbOptions += '<option value="' +  obj.id + '">' + obj.name + '</option>';
        }
        var htmlStr = '<div class="newInstGroup">'+
            '<div class="row row-mar2">'+
                '<div class="col-xs-2"> <label class="control-label">批示时间：</label></div>'+
                '<div class="col-xs-2">'+
                    '<div id="instTime' + newRowNum + '" class="instTime input-group laydate">'+
                        '<input type="hidden" class="laydate-fmt dateFmt" value="yyyy-MM-dd HH:mm" />'+
                        '<input type="text" class="form-control input-sm laydate-value" id="fixed_date" readonly="readonly">'+
                        '<span class="laydate-value-span input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>'+
                    '</div>'+
                '</div>'+
                '<div class="col-xs-2"> <label class="control-label">批示级别：</label></div>'+
                '<div class="col-xs-2">'+
                    '<select id="instLevel' + newRowNum + '" class="instLevel select2 form-control input-sm">'+
                        jbOptions +
                    '</select>'+
                '</div>'+
                '<div class="col-xs-1">'+
                    '<button class="deleteInst btn btn-primary btn-sm glyphicon glyphicon-minus"><span class=""></span></button>'+
                '</div>'+
            '</div>'+
            '<div class="row row-mar2">'+
                '<div class="col-xs-2"> <label class="control-label">批示内容：</label></div>'+
                '<div class="col-xs-6">'+
                    '<textarea name="" class="instContent form-control" style="height: 100px"></textarea>'+
                '</div>'+
            '</div><br/><br/>'+
        '</div>';
        $(".instDiv").append(htmlStr);
        var div = ($('.instDiv').find(".newInstGroup"))[$('.instDiv').find(".newInstGroup").length - 1];
        $($(div).find(".instLevel")[0]).val("");
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
     * 弹出修改页面
     *
     * @param crowdId 群体id
     */
    function alertCrowdEditPage(crowdId){
        var title = "修改群体信息";
        if($.util.isBlank(crowdId)){
            title = "新建群体";
        }

        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/crowd/addCrowdInfoLayer',
            pageLoading : true,
            title : title,
            width : "608px",
            height : "535px",
            btn:["保存","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.addCrowdInfoLayer ;
                    cm.saveCrowd();
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
                crowdId : crowdId
            },
            end:function(){
                var str = $.select2.val("#involveCrowdOne");
                if(!$.util.isBlank(str)){
                    $.ajax({
                        url:context +'/dictionary/findDictionaryItemsByParentId',
                        type:'post',
                        data:{parentId : str},
                        dataType:'json',
                        success:function(successData){
                            $.select2.empty("#involveCrowdTwo", true);
                            $.select2.addByList("#involveCrowdTwo", successData, "id", "name", true, true);
                        }
                    });
                }
            }
        });
    }

    jQuery.extend($.common, {

    });
})(jQuery);