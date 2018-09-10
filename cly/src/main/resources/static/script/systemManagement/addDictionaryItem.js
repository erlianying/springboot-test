$.addDictionaryItem = $.addDictionaryItem || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var dicTypeId = initData.dicTypeId;
    var parentId = initData.parentId;
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
                    $.util.topWindow().$.layerAlert.alert({msg:"字典类项编码重复!",title:"提示"})
                }else{
                    flag = true;
                }
            }
        })
    }



    function init(){
        $.ajax({
            url:context + '/dictionary/initAddItemDictionary',
            data:{dicTypeId:dicTypeId,parentId:parentId},
            type:"post",
            dataType:"json",
            success:function(map){
                $.select2.addByList("#state",map.state,"id","name",true,true);
                $("#dicTypeName").text(map.dicTypeName);
                $("#parentName").text(map.parentName);
                window.setTimeout(function(){
                    $("#state").select2("val",map.ztqy)
                },1000);
            }
        })
    }

    function getPojo(){
        var dictionaryItem = {
            dicTypeId :dicTypeId,
            parentId :parentId,
            name: $("#name").val(),
            code: $("#code").val(),
            state:$.select2.val("#state"),
            description:$("#description").val(),
        };
        return dictionaryItem;
    }

    function save(){
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
            url:context + '/dictionary/saveDictionaryItem',
            type:"post",
            data:dictionaryItem,
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
    jQuery.extend($.addDictionaryItem, {
        save : save
    });


})(jQuery);