(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var initData = frameData.initData;
    var index = null;
    var downloadUrl=initData.downloadUrl;
    var uploadUrl=initData.uploadUrl;
    var win$ = initData.win$;
    var  obj={};

    $(document).ready(function() {
        initPlupload();
        $(document).on("click","#downloadBtn",function(){
            window.open(context+downloadUrl) ;
        })
    });

    /**
     * 初始化上传控件
     */
    function initPlupload(){
        var setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "container"; //容器id
        setting.url = context + uploadUrl;
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
        setting.filters.max_file_size = '15mb';
        setting.filters.mime_types = [{title: "excel类型", extensions: "xls,xlsx"}];
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = false;
        setting.multi_file_num = 1;//设置上传的文件数
        setting.multi_file_num_callback = function(max_file_size, totalSize){//文件超出规格后的回调
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){
                var obj = null;
                for (var key in finishedFiles) {
                    obj = finishedFiles[key].id;
                }
                if(obj == "Error"){
                    $.layerAlert.alert({title:"提示",msg:"Excel读取失败，请检查文件",icon : 5, end:function(){
                        window.top.layer.close(index);
                    }});
                }else{
                    $.layerAlert.alert({title:"提示",msg:"上传成功",icon : 1, end:function(){
                        window.top.layer.close(index);
                    }});
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
     * 继承
     */
    jQuery.extend($.common,{
        submitMethod:function(i){
            index = i;
            $.plupload.start("container");
        },
    })


})(jQuery);