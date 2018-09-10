(function($){
    "use strict";
    $(document).ready(function() {
        var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
        initData();
        events();
    });

    function initData() {
        $.ajax({
            url:context +'/screen/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_QTLX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#involveCrowdOne", successData, "id", "name", true, true);
            }
        });
    }

    function events(){
        $(document).on("select2:select","#involveCrowdOne",function(){
            $.ajax({
                url:context +'/screen/findDictionaryItemsByParentId',
                type:'post',
                data:{parentId : $.select2.val("#involveCrowdOne")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#involveCrowdTwo", true);
                    $.select2.addByList("#involveCrowdTwo", successData, "id", "name", true, true);
                }
            });
        });
        $(document).on("select2:unselect","#involveCrowdOne",function(){
            $.select2.empty("#involveCrowdTwo", true);
        });
    }

    jQuery.extend($.common, {
        getSelected: function(){
            var obj = {
                startTime: $.laydate.getTime("#startTime", "date"),
                involveCrowd: $.select2.val("#involveCrowdTwo"),
                involveCrowdOne: $.select2.val("#involveCrowdOne"),
                involveCrowdTwo: $.select2.val("#involveCrowdTwo")
            };
            return obj;
        }
    });
})(jQuery);