$.newPersonnelInfoRepeatLayer = $.newPersonnelInfoRepeatLayer || {};
(function($) {
    "use strict";

    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var person = initData.person;

    $(document).ready(function() {
        init();
    });

    function init(){
        $("#name").text(person.name)
        $("#idNumber").text(person.idNumber)
        $("#recordTimeStr").text(person.recordTimeStr)
    }

    function deleteOrUpdateFun(){
        var deleteOrUpdate = $(".checked .icheckradio").attr("id");
        return {
            "id":person.id,
            "deleteOrUpdate" : deleteOrUpdate
        }

    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.newPersonnelInfoRepeatLayer, {
        deleteOrUpdateFun : deleteOrUpdateFun
    });


})(jQuery);