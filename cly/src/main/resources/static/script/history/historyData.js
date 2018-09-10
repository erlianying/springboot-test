(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window);
    var dataId = frameData.initData;
    $(document).ready(function() {
        initHistoryData();
    });

    function initHistoryData(){
        $.ajax({
            url:context + '/historyData/findHistoryDataById',
            type:'post',
            data:{
                id: dataId
            },
            dataType:'json',
            success:function(successData){
                var pojo = successData.pojo;
                $("#title").text(pojo.title);
                $("#type").text(pojo.typeName);
                $("#keyword").text(pojo.keyword);
                $("#content").text(pojo.content);
                $("#createUnit").text(pojo.createUnitName);
                $("#createPerson").text(pojo.createPersonName);
                $("#createTime").text($.date.timeToStr(pojo.createTimeLong, "yyyy-MM-dd HH:mm"));
            }
        });
    }

})(jQuery);