$.addResource = $.addResource || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var flag = true;
    $(document).ready(function(){
        init();
        $(document).on("blur" , "#resourceUrl", function(e){
          //  checkResourceUrl();
        });
    });


    //校验字典类型编码是否相同
    function checkResourceUrl() {
        var resourceUrl = $("#resourceUrl").val();
        $.ajax({
            url: context + '/person/checkPersonCode',
            data: {code: code},
            type: 'post',
            success: function (bool) {
                if (bool) {
                    flag = false;
                    $.util.topWindow().$.layerAlert.alert({msg:"url重复!",title:"提示"})
                }else{
                    flag = true;
                }
            }
        })
    }

    function init(){
        $.ajax({
            url: context+"/resource/findResourceDictionary",
            type: 'POST',
            dataType:"json",
            success:function(map){
                $.select2.addByList("#resourceType",map.resourceType,"name","name",true,true);
            }
        });
    }

    function getPojo(){
        var dictionaryItem = {
            resourceName: $("#resourceName").val(),
            resourceUrl: $("#resourceUrl").val(),
            resourceType:$.select2.val("#resourceType"),
        };
        return dictionaryItem;
    }

    function save(){
        var demo = $.validform.getValidFormObjById("validformType") ;
        var tag = $.validform.check(demo) ;
        if(!tag){
            return false;
        }
        if(!flag){
            $.util.topWindow().$.layerAlert.alert({msg:"url重复!",title:"提示"})
            return false;
        }

        var pojo = getPojo();
        $.ajax({
            url:context + '/resource/saveResource',
            type:"post",
            data:pojo,
            success:function(successData){
                if(successData){
                    $.util.topWindow().$.layerAlert.alert({msg:"添加成功!",title:"提示",end : function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"添加失败!",title:"提示"});
                }
            },
            error:function(){
                $.util.topWindow().$.layerAlert.alert({msg:"添加失败!",title:"提示"});
            }
        })

    }



    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.addResource, {
        save : save
    });


})(jQuery);