$.editDictionaryItem = $.editDictionaryItem || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var dicTypeId = initData.dicTypeId;
    var id = initData.id;
    var flag = true;
    $(document).ready(function(){
        init();
        $(document).on("click" , "#addBtn", function(e){
            addBtnClick();
        });
        $(document).on("click" , "#cancel", function(e){
            cancelBtnClick();
        });

        $(document).on("blur" , "#code", function(e){
            checkCode();
        });
    });


    //校验字典类型编码是否相同
    function checkCode() {
        var code = $("#code").val();
        $.ajax({
            url: context + '/dictionary/checkDictionaryItemCode',
            data: {code: code},
            type: 'post',
            success: function (bool) {
                if (bool) {
                    flag = false;
                    $.util.topWindow().$.layerAlert.alert({msg:"字典类型编码重复!",title:"提示"})
                }else{
                    flag = true;
                }
            }
        })
    }



    function init(){
        $.ajax({
            url:context + '/dictionary/initEditItemDictionary',
            data:{dicTypeId:dicTypeId,id:id},
            type:"post",
            dataType:"json",
            success:function(map){
                $.select2.addByList("#state",map.state,"id","name",true,true);
                $("#dicTypeName").text(map.dicTypeName);
                initDate(map.dicItem);
                window.setTimeout(function(){
                    $("#state").select2("val",map.ztqy)
                },1000);
            }
        })
    }

    function initDate(dicItem){
        $("#name").val(dicItem.name);
        $("#code").val(dicItem.code);
        $("#description").val(dicItem.description);
    }

    function getPojo(){
        var dictionaryItem = {
            dicTypeId :dicTypeId,
            id :id,
            name: $("#name").val(),
            code: $("#code").val(),
            state:$.select2.val("#state"),
            description:$("#description").val(),
        };
        return dictionaryItem;
    }

    function edit(){
        var demo = $.validform.getValidFormObjById("validformPersonType") ;
        var tag = $.validform.check(demo) ;
        if(!tag){
            return false;
        }
        if(!flag){
            $.util.topWindow().$.layerAlert.alert({msg:"字典类型名称或编码重复!",title:"提示"})
            return false;
        }

        var dictionaryItem = getPojo();
        $.ajax({
            url:context + '/dictionary/editDictionaryItem',
            type:"post",
            data:dictionaryItem,
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
    jQuery.extend($.editDictionaryItem, {
        edit : edit
    });


})(jQuery);