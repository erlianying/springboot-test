$.personnelBulkImportDialog5 = $.personnelBulkImportDialog5 || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData
    var sourceFileId=initData.sourceFileId;

    $(document).ready(function() {
        initDate();
    });




    /**
     * 初始化下载页面的id
     */
    function initDate(){
        $.ajax({ //不断请求后台获取数据
            url:context + '/crowd/findsuccessAndErrorCount',
            data:{sourceFileId:sourceFileId},
            type:"post",
            dataType:"json",
            success:function(data){
                $('#successBtn').text(data.finishCount);
                $('#errBtn').text(parseInt(data.errFileCount));

            }
        })

    }

})(jQuery);