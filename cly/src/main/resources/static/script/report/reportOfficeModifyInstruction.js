$.reportOfficeModifyInstructionLayer = $.reportOfficeModifyInstructionLayer || {};
(function($){
    "use strict";

    var orp = {};

    var fileCode = null;

    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index

    $(document).ready(function() {
        $.ajax({
            url:context +'/organizeReport/findOne',
            type:'post',
            data:{
                id:reportId
            },
            dataType:'json',
            success:function(successData){
                orp = successData.returnData;
                fileCode = orp.code;
                $("#instruction").val(orp.instruction);
            }
        });
    });

    function modify(){
        var dataMap = {};
        orp.instruction = $("#instruction").val();

        $.util.objToStrutsFormData(orp, "orp", dataMap);
        $.ajax({
            url:context +'/organizeReport/officeModify',
            type:'post',
            data:dataMap,
            dataType:'json',
            success:function(successData){
                $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示",end : function(){
                    $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                }});
            }
        });
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.reportOfficeModifyInstructionLayer, {
        modify : modify
    });

})(jQuery);


