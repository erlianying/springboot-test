$.editSecretLayer = $.editSecretLayer || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var id = initData.id;
    var fileName = new Array();
    var fileId = new Array();
    var unit = "";
    var createUnitId = "";
    var editSecretToDbObj;
    var instructionNum = 0;

    $(document).ready(function(){

        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_LYDWFZ},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#insideOutside", true);
                $.select2.addByList("#insideOutside", successData, "id", "name", true, true);
                var tempSourceUnitTypeLst = successData;
                $.ajax({
                    url:context +'/clue/findSourceUnitForMe',
                    type:'post',
                    data:{},
                    dataType:'json',
                    success:function(unitData){
                        for(var i in tempSourceUnitTypeLst){
                            if(unitData.unitType == tempSourceUnitTypeLst[i].id){
                                $.select2.val("#insideOutside", unitData.unitType);
                                $.ajax({
                                    url:context +'/clue/findSourceUnit',
                                    type:'post',
                                    data:{groupType : $.select2.val("#insideOutside")},
                                    dataType:'json',
                                    success:function(successData){
                                        $.select2.empty("#unit", true);
                                        $.select2.addByList("#unit", successData, "id", "name", true, true);
                                        window.setTimeout(function(){
                                            $.select2.val("#unit", unitData.unitId);
                                        },100);
                                    }
                                });
                                break;
                            }
                        }
                    }
                });

            }
        });

        $("select#insideOutside").change(function(){
            $.ajax({
                url:context +'/clue/findSourceUnit',
                type:'post',
                data:{groupType : $.select2.val("#insideOutside")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#unit", true);
                    $.select2.addByList("#unit", successData, "id", "name", true, true);
                    $("#unit").find("option:contains(" + unit + ")").attr("selected",true).trigger("change");
                }
            });
        });

        events();
        init();
    });

    function events(){

        $(document).on("click",".remove",function(){
            $($(this).parents("p")[0]).remove();
        });

        $(document).on("click" , "#addInstruction", function(e){
            ++instructionNum;
            var addInstructionStr = '<textarea id="instruction' + instructionNum + '" class="form-control valiform-keyup" dataType="*0-70" rows="3"></textarea>';
            $("#instruction").append(addInstructionStr);
        });
    }

    function editSecret(){
        var demo = $.validform.getValidFormObjById("validformPersonType") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }

        var i = 0;
        var j = 0;

        $("a.name0").each(function(){
            if($(this).text() != ""){
                ++i;
            }
        })
        $("a.name").each(function(){
            if($(this).text() != ""){
                ++j;
            }
        })
        if(i + j > 30){
            $.layerAlert.alert({title:"提示",msg:"最多上传30个附件",icon : 5});
            return;
        }

        var oldFiles = getOldFiles();
        var oldFilesObj = new Object();
        $.util.objToStrutsFormData(oldFiles, "srp", oldFilesObj);

        $.ajax({
            url:context + '/clue/judgeSecretDeleteFiles',
            type:"post",
            data:oldFilesObj,
            success:function(successData){

            }
        });

        var secret = getSecret();
        editSecretToDbObj = new Object();
        $.util.objToStrutsFormData(secret, "srp", editSecretToDbObj);

        //window.top.$.common.showOrHideLoading(true);

        if(j > 0) {

            $.plupload.start("container") ;     //上传附件
        }
        else {
            editSecretToDb(editSecretToDbObj);
        }

    }

    function getOldFiles(){

        var oldFilesName = new Array();
        var oldFilesId = new Array();
        var i = 0;

        $("a.name0").each(function(){
            if($(this).text() != ""){
                oldFilesName.push( $(this).text() );
                oldFilesId.push( $(this).attr("id") );
            }
        })

        var secret = {
            id:id,
            fileName:oldFilesName,
            fileId:oldFilesId
        };
        return secret;
    }

    function editSecretToDb(obj){
        $.ajax({
            url:context + '/clue/editSecret',
            type:"post",
            data:obj,
            success:function(successData){
                window.top.$.common.showOrHideLoading(false);
                if(successData){
                    $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示",end : function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                }
            },
            error:function(){
                window.top.$.common.showOrHideLoading(false);
            }
        })
    }

    function getSecret(){

        var instruction = [];
        for(var i = 0;i <= instructionNum;++i) {
            var instructionId = "#instruction" + i;
            var obj = {};
            obj.id = $(instructionId).attr("secretInstructionId");
            obj.content = $(instructionId).val();
            instruction.push( obj );
        }

        var secret = {
            id:id,
            //dataTime:$("#dataTime").val()==""?null:$("#dataTime").val(),
            //insideOutside:$("#insideOutside").val(),
            //unit:$("#unit").val(),
            insideOutside:$("#insideOutside option:selected").text(),
            unit:$("#unit option:selected").text(),
            originalNumber:$("#originalNumber").val(),
            title:$("#title").val(),
            secretInstructionPojoList:instruction,
            createUnitId:createUnitId
        };
        return secret;
    }


    function init(){
        $.ajax({
            url:context + '/clue/findSecretById',
            data:{id:id},
            type:"post",
            dataType:"json",
            success:function(pojo){

                initSecretData(pojo);
            }
        })
        initPlupload();
    }

    function initSecretData(pojo) {
        //$("#dataTime").val(pojo.dataTime);
        $("#type").append('<label class="control-label" style="text-align:left">' + pojo.type + '</label>');
        $("#dataTime").val($.date.timeToStr(pojo.dataTime, "yyyy-MM-dd HH:mm:ss"));
        //$("#insideOutside").val(pojo.insideOutside).trigger("change");
        //$("#unit").val(pojo.unit);
        unit = pojo.unit;
        $("#insideOutside").trigger("change");
        $("#insideOutside").find("option:contains(" + pojo.insideOutside + ")").attr("selected",true).trigger("change");
        $("#originalNumber").val(pojo.originalNumber);
        $("#title").val(pojo.title);

        //批示
        var secretInstructionPojoList = pojo.secretInstructionPojoList;
        for(var i = 0;i < secretInstructionPojoList.length;++i) {
            var obj = secretInstructionPojoList[i];

            var instructionId = "#instruction" + instructionNum;
            ++instructionNum;
            $(instructionId).val(obj.content);
            $(instructionId).attr("secretInstructionId",obj.id);

            var addInstructionStr = '<textarea id="instruction' + instructionNum + '" secretInstructionId="" class="form-control valiform-keyup" dataType="*0-70" rows="3"></textarea>';
            $("#instruction").append(addInstructionStr);
        }

        fileName = pojo.fileName;
        fileId = pojo.fileId;

        createUnitId = pojo.createUnitId;

        initFileList();
    }

    function initFileList() {

        var str = "";

        for(var i in fileName) {
            str += '<p><a class="name0" href="#" id=' + fileId[i] + '>' + fileName[i] + '</a>' + '&nbsp;<a href="#" class="remove">删除</a></p>';
        }

        $("#container0").empty();
        $("#container0").append(str);
    }

    /**
     * 初始化上传控件
     */
    function initPlupload(){

        var setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "container"; //容器id
        setting.url = context+'/clue/scanImport';
        setting.controlBtn = {
            container:{
                className:"upload-btn"
            },
            selectBtn:{
                className:"btn btn-primary",
                html:'<span class="glyphicon glyphicon-edit" aria-hidden="true" style="margin-right:10px;"></span>选择'
            },
            uploadBtn:{
                init:false
                // selector:'importBtn',
            }
        } ;
        setting.finishlistDom = {
            className:"upload-text",
            downloadBtn:{
                init:false
            },
            deleteBtn:{
                init:false
            }
        };
        setting.filelistDom = {
            className:"upload-text"
        };
        setting.totalInfoDom = {
            className:"upload-text"
        };
        setting.customParams = {
            testCustom1:"123",
            testCustom:function(up, file){
                return Math.random() ;
            }
        } ;
        setting.chunk_size = '0' ;
        setting.filters.max_file_size = '10mb';
        setting.filters.mime_types = [{title: "文件类型", extensions: "*"}];
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = true;
        setting.multi_file_num = 30;//设置上传的文件数
        setting.multi_file_num_callback = function(max_file_size, totalSize){//文件超出规格后的回调
            // alert(1);
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){

                var i = 0;
                var arr=[];
                for (var key in finishedFiles) {
                    arr.push(key);

                    $.ajax({
                        url:context +'/clue/updateFileId',
                        type:'post',
                        data:{
                            fileId : arr[i],
                            secretId : id
                        },
                        dataType:'json',
                        success:function(successData){
                            //p$.common.drawTable(pageIndex);
                        }
                    });

                    ++i;
                }

                editSecretToDb(editSecretToDbObj);
            },
            multi_file_num_callback:function(max_file_size, totalSize){
                $.layerAlert.alert({title:"提示",msg:"最多上传30个附件",icon : 5});
            },
            filesAdded:function (up, files){

            }
        };

        $.plupload.init(setting) ;
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.editSecretLayer, {
        editSecret : editSecret
    });


})(jQuery);