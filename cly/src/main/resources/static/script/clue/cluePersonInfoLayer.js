$.cluePersonInfoLayer = $.cluePersonInfoLayer || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var initData = frameData.initData ;
    var id = initData.id;

    $(document).ready(function(){
        init();
    });

    function init(){
        $.ajax({
            url:context + '/clueFlow/findCluePersonInfoById',
            data:{cluePersonInfoId:id},
            type:"post",
            dataType:"json",
            success:function(pojo){

                if(pojo != null){
                    if(pojo.name != null) {
                        $("#name").append('<label class="control-label" style="text-align:left">' + pojo.name + '</label>');
                    }
                    if(pojo.identityNumber != null) {
                        $("#identityNumber").append('<label class="control-label" style="text-align:left">' + pojo.identityNumber + '</label>');
                    }
                    if(pojo.placeOfDomicile != null) {
                        $("#placeOfDomicile").append('<label class="control-label" style="text-align:left">' + pojo.placeOfDomicile + '</label>');
                    }
                    if(pojo.location != null) {
                        $("#location").append('<label class="control-label" style="text-align:left">' + pojo.location + '</label>');
                    }
                    if(pojo.cellphoneNumber != null) {
                        $("#cellphoneNumber").append('<label class="control-label" style="text-align:left">' + pojo.cellphoneNumber + '</label>');
                    }
                    if(pojo.networkIdType != null) {
                        $("#networkIdType").append('<label class="control-label" style="text-align:left">' + pojo.networkIdType + '</label>');
                    }
                    if(pojo.networkId != null) {
                        $("#networkId").append('<label class="control-label" style="text-align:left">' + pojo.networkId + '</label>');
                    }
                    if(pojo.networkName != null) {
                        $("#networkName").append('<label class="control-label" style="text-align:left">' + pojo.networkName + '</label>');
                    }
                    if(pojo.content != null) {
                        $("#content").append('<label class="control-label" style="text-align:left">' + pojo.content + '</label>');
                    }
                    if(pojo.remark != null) {
                        $("#remark").append('<label class="control-label" style="text-align:left">' + pojo.remark + '</label>');
                    }
                    if(pojo.updateTime != null) {
                        var timeStr = $.date.dateToStr(new Date(pojo.updateTime), "yyyy-MM-dd HH:mm:ss");
                        $("#updateTime").append('<label class="control-label" style="text-align:left">' + timeStr + '</label>');
                    }
                }
            }
        });
    }

})(jQuery);