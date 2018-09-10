$.scan = $.scan || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    // var initData = frameData.initData
    var pictureId;
    var changeWindow = null;
    var thisIndex = null;
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
        setting.bind
        setting.multi_file_num_callback = function(max_file_size, totalSize){
             // alert(1);
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){

                var i = 0;
                var arr=[]
                for (var key in finishedFiles) {
                    arr.push(key);
                }
                pictureId=arr[0];
                var form = changeWindow.$.util.getHiddenForm(context + "/show/page/web/clue/enterClue", {pictureId:pictureId});
                form.submit();
                $.util.topWindow().$.layerAlert.closeWithLoading(thisIndex);
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
    jQuery.extend($.scan,{
        submitMethod:function(win, windex){
            $.plupload.start("container") ;
            changeWindow = win;
            thisIndex = windex;
        }
    })

})(jQuery);