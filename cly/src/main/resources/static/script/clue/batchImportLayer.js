$.clueBachImportExcel = $.clueBachImportExcel || {};
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
        // setting.url = context+'/clue/chickClueBatchImport';
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
                        openWindow(obj);//弹窗
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
     * 打开确认导入界面
     */
    function openWindow(data){
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/clue/bulkImportDialog2',
            pageLoading : true,
            title : '确定导入数据',
            width : "500px",
            height : "400px",
            btn:["确定导入","取消"],
            callBacks:{
                btn1:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index);
                    onloadup(data);

                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index);
                    //关闭弹窗
                }

            },
            success:function(layero, index){

            },
            initData:{
                data : data,//将检查的结果反馈到前台页面
            },
            end:function(){

            }
        });
    }


    /**
     * 上传
     */
    function onloadup(data){
        var url=context + '/clue/clueBatchImport';

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
                data : data,
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
        if(obj.sourceFileId==null){
            $.plupload.start("container") ;
        }else{
            openWindow(type,obj);//弹窗
        }
    }


    /**
     * 继承
     */
    jQuery.extend($.clueBachImportExcel,{
        submitMethod:submitMethod,
        findObj:findObj
    })


})(jQuery);