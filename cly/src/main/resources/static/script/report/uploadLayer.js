(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var p$ = frameData.initData.p$;
    var reportId = frameData.initData.reportId;
    var pictureId;
    var pageIndex = null;
    $(document).ready(function() {
        initPlupload();
    });

    /**
     * 初始化上传控件
     */
    function initPlupload(){
        var setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "container"; //容器id
        setting.url = context + "/clue/scanImport";
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
        setting.filters.max_file_size = '50mb';
        setting.filters.mime_types = [{title: "图片类型", extensions: "jpg,JPG,png,PNG,pdf,PDF"}];
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = false;
        setting.multi_file_num = 1;//设置上传的文件数
        setting.multi_file_num_callback = function(max_file_size, totalSize){
             // alert(1);
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){

                var i = 0;
                var arr=[];
                for (var key in finishedFiles) {
                    arr.push(key);
                }
                pictureId=arr[0];
                $.ajax({
                    url:context +'/organizeReport/updatePicId',
                    type:'post',
                    data:{
                        picId : pictureId,
                        reportId : reportId
                    },
                    dataType:'json',
                    success:function(successData){
                        p$.common.drawTable(pageIndex);
                    }
                });
            },
            multi_file_num_callback:function(max_file_size, totalSize){
                $.layerAlert.alert({title:"提示",msg:"每次只能上传一个附件",icon : 5});
            },
        }
        $.plupload.init(setting) ;
    }

    /**
     * 提交
     */
    jQuery.extend($.common,{
        submitMethod:function(index){
            $.plupload.start("container") ;
            pageIndex = index;
        }
    })

})(jQuery);