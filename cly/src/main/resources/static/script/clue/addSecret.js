$.addSecretLayer = $.addSecretLayer || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var  objFile={};
    var secretId = "";
    var saveSecretToDbObj;
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
                }
            });
        });

        var nowDate = new Date();
        var startDateLong = nowDate.getTime();
        var startDateStr = $.date.timeToStr(startDateLong, "yyyy-MM-dd HH:mm:ss");
        $.laydate.setRange(startDateStr, "", "#dataTime");

        $.ajax({
            url:context +'/clue/findFileType',
            type:'post',
            data:{},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#type", true);
                $.select2.addByList("#type", successData, "id", "name", true, true);
            }
        });

        $(document).on("click" , "#addInstruction", function(e){
            ++instructionNum;
            var addInstructionStr = '<textarea id="instruction' + instructionNum + '" class="form-control valiform-keyup" dataType="*0-70" rows="3"></textarea>';
            $("#instruction").append(addInstructionStr);
        });

        init();

    });

    function saveSecret(){

        var demo = $.validform.getValidFormObjById("validformPersonType") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }

        var secret = getSecret();
        saveSecretToDbObj = new Object();
        $.util.objToStrutsFormData(secret, "srp", saveSecretToDbObj);

        saveSecretToDb(saveSecretToDbObj);

        $.plupload.start("container") ;     //上传附件

    }

    function saveSecretToDb(obj){

        $.ajax({
            url:context + '/clue/saveSecret',
            type:"post",
            data:obj,
            success:function(successData){
                if(successData != null){

                    secretId = successData;

                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"添加失败!",title:"提示"});
                }
            }
        })
    }


    function getSecret(){

        var instruction = [];
        for(var i = 0;i <= instructionNum;++i) {
            var instructionId = "#instruction" + i;
            instruction.push( $(instructionId).val() );
        }

        var secret = {
            //dataTime:$.laydate.getDate("#dataTime","start"),
            //insideOutside:$("#insideOutside").val(),
            //unit:$("#unit").val(),
            insideOutside:$("#insideOutside option:selected").text(),
            unit:$("#unit option:selected").text(),
            originalNumber:$("#originalNumber").val(),
            title:$("#title").val(),
            //type:$("#type").val(),
            type:"wjlx0001",
            secretInstructionList:instruction
        };
        return secret;
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
                            secretId : secretId
                        },
                        dataType:'json',
                        success:function(successData){
                            //p$.common.drawTable(pageIndex);
                        }
                    });

                    ++i;
                }

                //$.layerAlert.alert({title:"上传成功",msg:obj.msg,icon : 5});

                $.util.topWindow().$.layerAlert.alert({msg:"添加成功!",title:"提示",end : function(){

                    //会商不通报
                    if($("#type").val() == "wjlx0002"){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                        return ;
                    }
                    window.top.$.layerAlert.dialog({
                        content : context +  '/show/page/web/clue/chooseSecretInformUnitLayer',
                        pageLoading : true,
                        title:"通报",
                        width : "300px",
                        height : "400px",
                        shadeClose : false,
                        initData:{
                            secretId : secretId
                        },
                        success:function(layero, index){

                        },
                        end:function(){
                            //$(".save").removeAttr("disabled");
                            $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                        },
                        btn:["通报", "关闭"],
                        callBacks:{
                            btn1:function(index, layero){

                                var dataMap = {};
                                var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                                var obj = cm.getSelected();
                                if(obj.flag == false){
                                    window.top.$.layerAlert.alert({msg:obj.msg ,icon:"1",end : function(){
                                        return;
                                    }});
                                    return;
                                }
                                var unitLst = "";
                                for(var i = 0; i < obj.unitLst.length; i++){
                                    unitLst += obj.unitLst[i];
                                    if(i != obj.unitLst.length - 1){
                                        unitLst += ";"
                                    }
                                }
                                $.util.objToStrutsFormData(secretId, "secretId", dataMap);
                                $.util.objToStrutsFormData(unitLst, "unitLst", dataMap);

                                $.ajax({
                                    url: context + '/clue/saveSecretInform',
                                    type: 'post',
                                    data: dataMap,
                                    dataType: 'json',
                                    success: function (successData) {

                                        if (successData.flag == "true") {
                                            window.top.$.layerAlert.alert({msg:"保存并通报成功！" ,icon:"1",end : function(){
                                                window.top.layer.close(index);
                                                return;
                                            }});
                                        } else {
                                            window.top.$.layerAlert.alert({
                                                msg: "保存并通报失败!" , icon: "2", end: function () {
                                                    //$(".save").removeAttr("disabled");
                                                }
                                            });
                                        }
                                    }
                                });

                                $.util.topWindow().$.layerAlert.closeWithLoading(index);
                            },
                            btn2:function(index, layero){

                                $.util.topWindow().$.layerAlert.closeWithLoading(index);
                                /*
                                $(".save").removeAttr("disabled");
                                */
                            }
                        }
                    });



                }});

            },
            multi_file_num_callback:function(max_file_size, totalSize){
                $.layerAlert.alert({title:"提示",msg:"最多上传30个附件",icon : 5});
            },
            filesAdded:function (up, files){

            }

        }
        $.plupload.init(setting) ;
    }


    function init(){

        initPlupload();

    }


    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.addSecretLayer, {
        saveSecret : saveSecret
    });


})(jQuery);