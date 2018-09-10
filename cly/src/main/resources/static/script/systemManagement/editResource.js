$.editResource = $.editResource || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var id = initData.id;
    var flag = true;
    var oldUrl = null;
    $(document).ready(function(){
        init();
        $(document).on("blur" , "#resourceUrl", function(e){
          //  checkResourceUrl();
        });
    });


    //校验字典类型编码是否相同
    function checkResourceUrl() {
        var resourceUrl = $("#resourceUrl").val();
        if(resourceUrl != oldUrl){
            $.ajax({
                url: context + '/person/checkPersonCode',
                data: {code: code},
                type: 'post',
                success: function (bool) {
                    if (bool) {
                        flag = false;
                        $.util.topWindow().$.layerAlert.alert({msg:"资源路径重复!",title:"提示"})
                    }else{
                        flag = true;
                    }
                }
            })
        }
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

        $.ajax({
            url: context+"/resource/findResourceById",
            data:{id:id},
            type: 'POST',
            dataType:"json",
            success:function(pojo){
                initResourceData(pojo)
            }
        });


    }
    function initResourceData(pojo){
        $("#resourceName").val(pojo.resourceName);
        $("#resourceUrl").val(pojo.resourceUrl);
        oldUrl = pojo.resourceUrl;
        $("#resourceType").select2("val",pojo.resourceType);
    }

    function getPojo(){
        var dictionaryItem = {
            id:id,
            resourceName: $("#resourceName").val(),
            resourceUrl: $("#resourceUrl").val(),
            resourceType:$.select2.val("#resourceType")
        };
        return dictionaryItem;
    }

    function edit(){
        var demo = $.validform.getValidFormObjById("validformType") ;
        var tag = $.validform.check(demo) ;
        if(!tag){
            return false;
        }
        if(!flag){
            $.util.topWindow().$.layerAlert.alert({msg:"资源路径重复!",title:"提示"})
            return falses;
        }
        var pojo = getPojo();
        $.ajax({
            url:context + '/resource/updateResource',
            type:"post",
            data:pojo,
            success:function(successData){
                if(successData){
                    $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示",end : function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                }
            },
            error:function(){
                $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
            }
        })

    }



    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.editResource, {
        edit : edit
    });


})(jQuery);