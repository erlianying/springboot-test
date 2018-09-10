
(function($){
    "use strict";
    $(document).ready(function() {
        var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
        initData();
    });

    function initData(){
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.DQZT_PSJB},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#level", successData, "id", "name", true, true);
            }
        });
    }

    jQuery.extend($.common, {
        getSelected: function(){
            var demo = $.validform.getValidFormObjById("validform") ;
            var flag = $.validform.check(demo) ;
            if(!flag){
                return false;
            }
            var obj = {};
            obj.level = $.select2.val("#level");
            obj.instTimeLong = $.laydate.getTime("#instTime", "date");
            obj.content = $("#content").val();
            return obj;
        }
    });
})(jQuery);