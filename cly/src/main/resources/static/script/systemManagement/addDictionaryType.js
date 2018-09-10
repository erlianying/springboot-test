$.addDictionaryType = $.addDictionaryType || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
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
    }

    //校验字典类型编码是否相同
    function checkCode() {
        var code = $("#code").val();
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
    }



    function init(){
        $.ajax({
            url:context + '/dictionary/findAddTypeDictionary',
            type:"post",
            dataType:"json",
            success:function(map){
                $.select2.addByList("#state",map.state,"id","name",true,true);
                $.select2.addByList("#classifier",map.classifier,"name","name",true,true);
                window.setTimeout(function(){
                    $("#state").select2("val",map.ztqy)
                },1000);
            }
        })
    }

    function getPojo(){
        var dictionaryType = {
            name: $("#name").val(),
            code: $("#code").val(),
            state:$.select2.val("#state"),
            classifier: $.select2.val("#classifier"),
            description:$("#description").val(),
        };
        return dictionaryType;
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

        var dictionaryType = getPojo();
        var obj = new Object();
        $.util.objToStrutsFormData(dictionaryType, "dictionaryTypeRegisterPojo", obj);
        $.ajax({
            url:context + '/dictionary/saveDictionaryType',
            type:"post",
            data:dictionaryType,
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
    jQuery.extend($.addDictionaryType, {
        save : save
    });


})(jQuery);