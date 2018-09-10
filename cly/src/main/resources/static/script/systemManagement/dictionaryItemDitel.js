(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var dicTypeId = initData.dicTypeId;
    var id = initData.id;
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

    function init(){
        $.ajax({
            url:context + '/dictionary/initEditItemDictionary',
            data:{dicTypeId:dicTypeId,id:id},
            type:"post",
            dataType:"json",
            success:function(map){
                $("#dicTypeName").text(map.dicTypeName);
                initDate(map.dicItem);
                for(var i in map.state){
                    if(map.state[i].code == map.dicItem.state){
                        $("#state").text(map.state[i].name)
                    }
                }
            }
        })
    }

    function initDate(dicItem){
        $("#name").text(dicItem.name);
        $("#code").text(dicItem.code);
        if(dicItem.description){
            $("#description").text(dicItem.description);
        }else{
            $("#description").text("");
        }


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

})(jQuery);