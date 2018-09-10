$.editDictionaryType = $.editDictionaryType || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var id = initData.id;
    var oldName = "";
    var oldCode = "";
    var flag = true;
    $(document).ready(function(){
        init();
        $(document).on("click" , "#addBtn", function(e){
            addBtnClick();
        });
        $(document).on("click" , "#cancel", function(e){
            cancelBtnClick();
        });

        $(document).on("blur" , "#name", function(e){
            checkName();
        });

        $(document).on("blur" , "#code", function(e){
            checkCode();
        });
    });

    //校验是字典类型的名称是否相同
    function checkName() {
        var name = $("#name").val();
        if("" != name && name != oldName){
            $.ajax({
                url: context + '/dictionary/checkDictionaryTypeName',
                data: {name: name},
                type: 'post',
                success: function (bool) {
                    if (bool) {
                        flag = false;
                        $.util.topWindow().$.layerAlert.alert({msg:"字典类型名称重复!",title:"提示"})
                    }else {
                        flag = true;
                    }
                }
            })
        }else if(code == oldName){
            flag = true;
        }
    }

    //校验字典类型编码是否相同
    function checkCode() {
        var code = $("#code").val();
        if("" != code && code != oldCode){
            $.ajax({
                url: context + '/dictionary/checkDictionaryTypeCode',
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
        }else if(code == oldCode){
            flag = true;
        }
    }

    function init(){
        $.ajax({
            url:context + '/dictionary/findAddTypeDictionary',
            type:"post",
            dataType:"json",
            success:function(map){
                $.select2.addByList("#state",map.state,"id","name",true,true);
                $.select2.addByList("#classifier",map.classifier,"name","name",true,true);
                $.ajax({
                    url:context + '/dictionary/findDicTypeById',
                    data: {id: id},
                    type:"post",
                    dataType:"json",
                    success:function(type){
                        initDate(type);
                    }
                })
            }
        })
    }

    function initDate(type){
        $("#name").val(type.name);
        oldName = type.name;
        $("#code").val(type.code);
        oldCode = type.code;
        $("#state").select2("val",type.state)
        $("#classifier").select2("val",type.classifier)
        $("#description").val(type.description);
    }

    function getPojo(){
        var dictionaryType = {
            id :id,
            name: $("#name").val(),
            code: $("#code").val(),
            state:$.select2.val("#state"),
            classifier: $.select2.val("#classifier"),
            description:$("#description").val(),
        };
        return dictionaryType;
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

        var dictionaryType = getPojo();
        $.ajax({
            url:context + '/dictionary/updateDictionaryType',
            type:"post",
            data:dictionaryType,
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
    jQuery.extend($.editDictionaryType, {
        edit : edit
    });


})(jQuery);