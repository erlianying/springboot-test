$.personnelBulkImportDialog2 = $.personnelBulkImportDialog2 || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData
    var data=initData.data;//获取上传类型

    $(document).ready(function() {
        initDate();
        //源文件
        $(document).on("click","#sourceCountBtn",function(){
            var id=data.sourceFileId;
            window.open(context+"/crowd/downloadAttachment?metaId="+id) ;
        })
        //错误文件
        $(document).on("click","#errCountBtn",function(){
            var id=data.errFileId;
            window.open(context+"/crowd/downloadAttachment?metaId="+id);
        })

        //正确文件
        $(document).on("click","#okCountBtn",function(){
            var id=data.rightFileId;
            window.open(context+"/crowd/downloadAttachment?metaId="+id) ;
        })
    });


    /**
     * 初始化下载页面的id
     */
    function initDate(){
        $('#sourceCountBtn').text(data.sourceCount);
        $('#errCountBtn').text(data.errCount);
        $('#okCountBtn').text(parseInt(data.sourceCount)-parseInt(data.errCount));
    }

})(jQuery);