$.newCrowdType = $.newCrowdType || {};

(function($){

    "use strict";

    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;

    $(document).ready(function() {
        /**
         * 群体类型选择事件
         */
        $(document).on("select2:select","#parent",function () {
            var typeId = $.select2.val("#parent");
            if("null" == typeId){
                $("#valueTitle").text("群体类型：");
            }else{
                $("#valueTitle").text("群体名称：");
            }
        });
        /**
         * 群体类型或者名称修改事件
         */
        $(document).on("keyup change", "#value", function () {
            var typeId = $.select2.val("#parent");
            if("null" == typeId){// 群体类型
                verificationTypeIsOnly();
            }else{// 群体名称
                verificationNameIsOnly();
            }
        });

        initPageDict();
    });

    /**
     * 验证群体类型是否唯一
     *
     * @param func 验证通过后执行的方法
     * @param obj 执行方法参数
     */
    function verificationTypeIsOnly(func, obj){
        var param = {
            "id" : null ,
            "type" : $("#value").val()
        };
        $.ajax({
            url:context + "/crowdBasicDataManage/verificationTypeIsOnly",
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:false,//设置是否loading
            },
            success:function(successData){
                var status = successData.status;
                if(status){
                    if($.util.isFunction(func)){
                        func(obj);
                    }
                }else{
                    $.layerAlert.tips({
                        msg:'该群体类型已存在。',
                        selector:"#value",  //需要弹出层的元素选择器
                        color:'#F66646',
                        position:1,
                        closeBtn:2,
                        time:2000,
                        shift:1
                    });
                }
            }
        });
    }

    /**
     * 验证群体名称是否唯一
     *
     * @param func 验证通过后执行的方法
     * @param obj 执行方法参数
     */
    function verificationNameIsOnly(func, obj){
        var param = {
            "id" : null ,
            "type" : $.select2.val("#parent") ,
            "name" : $("#value").val()
        };
        $.ajax({
            url:context + "/crowdBasicDataManage/verificationNameIsOnly",
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:false,//设置是否loading
            },
            success:function(successData){
                var status = successData.status;
                if(status){
                    if($.util.isFunction(func)){
                        func(obj);
                    }
                }else{
                    $.layerAlert.tips({
                        msg:'该群体名称已存在。',
                        selector:"#value",  //需要弹出层的元素选择器
                        color:'#F66646',
                        position:1,
                        closeBtn:2,
                        time:2000,
                        shift:1
                    });
                }
            }
        });
    }

    /**
     * 初始化页面默认字典项
     *
     * @returns
     */
    function initPageDict(){
        $.ajax({
            url:context +'/crowdBasicDataManage/initCrowdType',
            data:{},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                //设置群体类型
                var types = successData.types;
                types.unshift({id:"null",name:"空",code:"null"});
                $.select2.addByList("#parent", types,"id","name",true,true);
                $.select2.selectByOrder("#parent", 1, true)
            }
        });
    }

    /**
     * 保存群体类型
     */
    function saveCrowdType(){
        var demo = $.validform.getValidFormObjById("validformCrowdType") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }
        var parent = $.select2.val("#parent");
        var obj = null;
        if("null" == parent){
            obj = {
                "type" : $("#value").val() ,
                "name" : null
            }
            verificationTypeIsOnly(saveAjax, obj);
        }else{
            obj = {
                "type" : parent ,
                "name" : $("#value").val()
            }
            verificationNameIsOnly(saveAjax, obj);
        }
    }

    /**
     * 保存请求
     *
     * @param obj 保存对象
     */
    var saveAjax = function(obj){
        $.ajax({
            url: context + "/crowdBasicDataManage/saveCrowdDictionary",
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                if(successData.status){
                    $.util.topWindow().$.layerAlert.alert({icon:6, closeBtn:false, msg:"保存成功。", yes:function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({icon:6, closeBtn:false, msg:"保存失败。", yes:function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗
                    }});
                }
            }
        });
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.newCrowdType, {
        saveCrowdType : saveCrowdType
    });
})(jQuery);