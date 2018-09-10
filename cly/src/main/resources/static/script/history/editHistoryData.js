(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window);
    var dataId = frameData.initData;
    var pojo = null;
    $(document).ready(function() {
        initData();
    });

    function initData(){
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_LSZL},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#type", successData, "id", "name", true, true);
                if(!$.util.isBlank(dataId)){
                    initHistoryData();
                }
            }
        });
    }

    function initHistoryData(){
        $.ajax({
            url:context + '/historyData/findHistoryDataById',
            type:'post',
            data:{
                id: dataId
            },
            dataType:'json',
            success:function(successData){
                pojo = successData.pojo;
                $("#title").val(pojo.title);
                $.select2.val("#type", pojo.type);
                $("#keyword").val(pojo.keyword);
                $("#content").val(pojo.content);
            }
        });
    }

    function getData(){
        var demo = $.validform.getValidFormObjById("validform") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }
        if(!$.util.exist(pojo)){
            pojo = {};
        }
        pojo.title = $("#title").val();
        pojo.type = $.select2.val("#type");
        pojo.keyword = $("#keyword").val();
        pojo.content = $("#content").val();
        return pojo;
    }

    jQuery.extend($.common, {
        getData : getData
    });
})(jQuery);