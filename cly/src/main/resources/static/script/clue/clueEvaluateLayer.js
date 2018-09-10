
(function($){
    "use strict";
    $(document).ready(function() {
        var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
        initData();

        $(document).on("select2:select","#quality",function(){
            if($.select2.val("#quality") != $.common.dict.BBZL_YB){
                $("#content").attr("datatype", "*0-2000");
            }else{
                $("#content").attr("datatype", "*1-2000");
            }
        })
    });

    function initData(){
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.DQZT_WZX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#integrality", successData, "id", "name");
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.DQZT_BBZL},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#quality", successData, "id", "name");
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.DQZT_ZHX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#rich", successData, "id", "name");
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.DQZT_ZQX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#veracity", successData, "id", "name");
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.DQZT_YJX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#warning", successData, "id", "name");
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
            obj.integrality = $.select2.val("#integrality");
            obj.quality = $.select2.val("#quality");
            obj.rich = $.select2.val("#rich");
            obj.veracity = $.select2.val("#veracity");
            obj.warning = $.select2.val("#warning");
            obj.content = $("#content").val();
            return obj;
        }
    });
})(jQuery);