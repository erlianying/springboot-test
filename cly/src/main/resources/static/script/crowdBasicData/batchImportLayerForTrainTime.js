$.batchImportLayerForTrainTime = $.batchImportLayerForTrainTime || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData;
    var downloadURL=initData.downloadURL;
    var updateURL=initData.updateURL;
    var  obj={};

    $(document).ready(function() {
        initPlupload();
        $(document).on("click","#downloadBtn",function(){
            downLoadClueExportExcelModel();
        })

    });

    /**
     * 下载线索导入模板
     */
    function downLoadClueExportExcelModel(){
        window.open(context+downloadURL) ;

    }





    /**
     * 初始化上传控件
     */
    function initPlupload(){
        var setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "container"; //容器id
        setting.url = context+updateURL;
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
        setting.filters.max_file_size = '30mb';
        setting.filters.mime_types = [{title: "excel类型", extensions: "xls,xlsx"}];
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = false;
        setting.multi_file_num = 1;//设置上传的文件数
        setting.multi_file_num_callback = function(max_file_size, totalSize){//文件超出规格后的回调
            // alert(1);
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){
                for (var key in finishedFiles) {
                    obj = finishedFiles[key].id;
                    if(obj.msg!="true"){
                        $.layerAlert.alert({title:"提示",msg:obj.msg,icon : 5});
                        // $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }else{
                        openFinishWindow();
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
     * 打开完成界面
     */
    function openFinishWindow(){
        $.util.topWindow().$.layerAlert.dialog({//完成界面
            content : context + "/show/page/web/history/historyBulkImportDialog5",
            pageLoading : true,
            title : '导入完成',
            width : "400px",
            height : "300px",
            btn:["查看错误日志","确定"],
            callBacks:{
                btn1:function(index, layero){
                    if(obj.sourceFileId){
                        $.ajax({ //不断请求后台获取数据
                            url:context + '/crowd/findsuccessAndErrorCount',
                            data:{sourceFileId:obj.sourceFileId},
                            type:"post",
                            dataType:"json",
                            success:function(data){
                                var errFileId=data.errFileId;
                                // window.open(context+"/crowd/downloadAttachment/"+errFileId) ;
                                window.open(context+"/crowd/downloadAttachment?metaId="+errFileId) ;
                            }
                        })

                    }
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeAll();
                },


            },
            success:function(layero, index){

            },
            initData:{
                sourceFileId:obj.sourceFileId,
            },
            end:function(){

            }
        });
    }



    function findObj(){
        return obj.sourceFileId;
    }

    /**
     * 提交
     */
    function submitMethod(){
        $.plupload.start("container") ;
    }


    /**
     * 继承
     */
    jQuery.extend($.batchImportLayerForTrainTime,{
        submitMethod:submitMethod,
        findObj:findObj
    })


})(jQuery);