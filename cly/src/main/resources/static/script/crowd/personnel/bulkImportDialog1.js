$.personBulkImportDialog1 = $.personBulkImportDialog1 || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData;
    var type='replace';
    var  obj={};

    $(document).ready(function() {
        initPlupload();
        // checkImportStatus();
        $('.icheckradio').on("ifChecked",function(even){
            var b=$('input[type="radio"]:checked');
            type=$(b).attr("checkType");
        })
        $(document).on("click" , "#downloadBtn", function(e){
            window.open(context+"/petitionRegistrationExportExcel/downloadPetitionModel?fileName=hrskpersonImportModel.xlsx") ;
        });
    });

    /**
     * 检查是否有没有上传完的东西
     */
    function checkImportStatus(){
        $.ajax({
            url:context + '/crowd/checkImportStatus',
            // data:data,
            type:"post",
            dataType:"json",
            success:function(res){
                var bn=res.status;
                if(bn==false){
                    var result=res.data;
                    //导入等待界面
                    $.util.topWindow().$.layerAlert.dialog({
                        content : context + "/show/page/web/personnel/bulkImportDialog4",
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
                }

            }
        })

    }


    /**
     * 初始化上传控件
     */
    function initPlupload(){
        var setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "container"; //容器id
        setting.url = context + "/crowd/personBatchImport";
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
        setting.chunk_size = '50mb' ;
        setting.filters.max_file_size = '50mb';
        setting.filters.mime_types = [{title: "excel类型", extensions: "xls,xlsx"}];
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = false;
        setting.multi_file_num = 1;//设置上传的文件数
        setting.bind
        setting.multi_file_num_callback = function(max_file_size, totalSize){
            // alert(1);
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){
                for (var key in finishedFiles) {
                    obj = finishedFiles[key].id;
                    // parent$.uploadfileId=obj.sourceFileId;
                    if(obj.msg!="true"){
                        $.layerAlert.alert({title:"提示",msg:obj.msg,icon : 5});
                        // $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }else{
                        openWindow(type,obj);//弹窗
                    }

                }
            },
            multi_file_num_callback:function(max_file_size, totalSize){
                $.layerAlert.alert({title:"提示",msg:"每次只能上传一个附件",icon : 5});
            },
            filesAdded:function (up, files){

            }
        }
        $.plupload.init(setting) ;
    }

    /**
     *
     */
    function openWindow(type,data){
        if(type=='replace'){//替换导入
            $.util.topWindow().$.layerAlert.dialog({
                content : context + '/show/page/web/personnel/bulkImportDialog3',
                pageLoading : true,
                title : '确定导入数据',
                width : "500px",
                height : "400px",
                btn:["确定导入","取消"],
                callBacks:{
                    btn1:function(index, layero){
                        $.util.topWindow().$.layerAlert.closeWithLoading(index);
                        onloadup(type,data);

                    },
                    btn2:function(index, layero){
                        $.util.topWindow().$.layerAlert.closeWithLoading(index);
                        //关闭弹窗
                    }

                },
                success:function(layero, index){

                },
                initData:{
                    data : data,
                },
                end:function(){

                }
            });
        }else{//追加导入
            $.util.topWindow().$.layerAlert.dialog({
                content : context + '/show/page/web/personnel/bulkImportDialog2',
                pageLoading : true,
                title : '确定导入数据',
                width : "500px",
                height : "400px",
                btn:["确定导入","取消"],
                callBacks:{
                    btn1:function(index, layero){
                        $.util.topWindow().$.layerAlert.closeWithLoading(index);
                        onloadup(type,data);
                    },
                    btn2:function(index, layero){
                        $.util.topWindow().$.layerAlert.closeWithLoading(index);
                        //关闭弹窗
                    }

                },
                success:function(layero, index){

                },
                initData:{
                    data : data,
                },
                end:function(){

                }
            });
        }

    }

    /**
     * 上传
     */
    function onloadup(type,data){
        var url="";
        if(type=='replace'){
            url=context + '/crowd/personReplacenBatchImport';
        }else{
            url=context + '/crowd/personAppendBatchImport';
        }
        $.ajax({//處理數據
            url:url,
            data:data,
            type:"post",
            dataType:"json",
            success:function(map){

            }
        })

        //导入等待界面
        $.util.topWindow().$.layerAlert.dialog({
            content : context + "/show/page/web/personnel/bulkImportDialog4",
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
                data : data,
            },
            end:function(){

            }
        });
        // $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);//關閉當前彈窗

    }


    /**
     * 提交
     */
    function submitMethod(){
        if(obj.sourceFileId==null){
            $.plupload.start("container") ;
        }else{
            openWindow(type,obj);//弹窗
        }

    }

    function findObj(){
        return obj.sourceFileId;
    }


    /**
     * 继承
     */
    jQuery.extend($.personBulkImportDialog1,{
        submitMethod:submitMethod,
        findObj:findObj
    })

})(jQuery);