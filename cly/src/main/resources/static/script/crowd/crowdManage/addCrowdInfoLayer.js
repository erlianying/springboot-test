$.addCrowdInfoLayer = $.addCrowdInfoLayer || {};

(function($){

    "use strict";

    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var crowdId = initData.crowdId;

    $(document).ready(function() {
        /**
         * 群体类型选择事件
         */
        $(document).on("select2:select","#type",function () {
            var typeId = $.select2.val("#type");
            $.select2.empty("#name");
            findCrowdNameByTypeId(typeId);
        });

        /**
         * 添加群体名称
         */
        $(document).on("click","#addCrowdName",function () {
            $(this).hide();
            $("#nameSelectDiv").hide();
            $("#nameTextDiv").show();
            $("#nameText").val("").attr("nameId","");
            $("#nameText").addClass("valiform-keyup");
            $("#nameText").attr("dataType", "*1-70");
            $("#cancelAddCrowdName").show();
        });

        /**
         * 取消添加群体名称
         */
        $(document).on("click","#cancelAddCrowdName",function () {
            $(this).hide();
            $("#nameTextDiv").hide();
            $("#nameSelectDiv").show();
            $("#nameText").removeClass("valiform-keyup");
            $("#nameText").removeAttr("dataType", "*1-70");
            $.select2.clear("#name");
            $("#addCrowdName").show();
        });

        /**
         * 群体名称修改事件
         */
        $(document).on("keyup change", "#nameText", function () {
            verificationNameIsOnly();
        });

        initPageDict();

        $("#createTime").text($.date.timeToStr(new Date().getTime(), "yyyy-MM-dd HH:mm"));
        $("#updateTime").text($.date.timeToStr(new Date().getTime(), "yyyy-MM-dd HH:mm"));

        if(!$.util.isBlank(crowdId)){
            $("#nameSelectDiv").hide();
            $("#nameTextDiv").show();
            $("#addCrowdName").hide();
            $("#cancelAddCrowdName").hide();
        }
    });

    /**
     * 根据id查询群体
     */
    function findCrowdById(){
        var data = {
            "id" : $.util.isBlank(crowdId)?"":crowdId
        };
        $.ajax({
            url:context +'/crowdManage/findCrowdById',
            data:data,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                var crowd = successData.crowd;
                setCrowdPage(crowd);
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
            url:context +'/crowdManage/initPageDictionary',
            data:{},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                //设置群体类型
                var types = successData.types;
                $.select2.addByList("#type", types,"id","name",true,false);
                //设置省市
                var citys = successData.citys;
                $.select2.addByList("#city", citys,"id","name",true,false);
                //设置主责单位
                var units = successData.units;
                $.select2.addByList("#unit", units,"id","name",true,false);

                if(!$.util.isBlank(crowdId)){
                    findCrowdById();
                }
            }
        });
    }


    /**
     * 根据群体类型查询群体名称
     *
     * @param typeId 类型id
     * @returns
     */
    function findCrowdNameByTypeId(typeId){
        $.ajax({
            url:context +'/crowdManage/findNoCrowdInfoNameByTypeId',
            data:{typeId : typeId},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                var names = successData.names;
                $.select2.addByList("#name", names,"id","name",true,false);
            }
        });
    }

    /**
     * 保存群体
     */
    function saveCrowd(){
        if(!verification()){
            return ;
        }
        var crowdObj = getCrowdObj();

        var obj = new Object();
        $.util.objToStrutsFormData(crowdObj, "cp", obj);

        var saveAjax = function (obj) {
            $.util.topWindow().$.common.showOrHideLoading(true);
            var url = context + "/crowdManage";
            var msg = "";
            if($.util.isBlank(crowdId)){
                url += "/saveCrowd";
                msg = "保存";
            }else{
                url += "/updateCrowd";
                msg = "修改";
            }
            $.ajax({
                url:url,
                data:obj,
                type:"post",
                dataType:"json",
                customizedOpt:{
                    ajaxLoading:false,//设置是否loading
                },
                success:function(successData){
                    $.util.topWindow().$.common.showOrHideLoading(false);
                    if(successData.status){
                        $.util.topWindow().$.layerAlert.alert({icon:6, closeBtn:false, msg:msg + "成功。", yes:function(){
                            $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗
                        }});
                    }else{
                        $.util.topWindow().$.layerAlert.alert({icon:6, closeBtn:false, msg:msg + "失败。", yes:function(){
                            $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗
                        }});
                    }
                },
                error:function(errorData){
                    $.util.topWindow().$.common.showOrHideLoading(false);
                }
            });
        }

        verificationNameIsOnly(saveAjax, obj);
    }

    /**
     * 表单验证
     */
    function verification() {
        if($.util.isBlank($.select2.val("#type"))){
            $.layerAlert.tips({
                msg:'请选择群体类型。',
                selector:"#type",  //需要弹出层的元素选择器
                color:'#F66646',
                position:1,
                closeBtn:2,
                time:2000,
                shift:1
            });
            return false;
        }
        //验证群体名称的正确性
        if(!$("#nameSelectDiv").is(":hidden")){
            if($.util.isBlank($.select2.val("#name"))){
                $.layerAlert.tips({
                    msg:'请选择群体名称。',
                    selector:"#name",  //需要弹出层的元素选择器
                    color:'#f66646',
                    position:1,
                    closeBtn:2,
                    time:2000,
                    shift:1
                });
                return false;
            }
        }

        var demo = $.validform.getValidFormObjById("validformSituation") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }
        return true;
    }

    /**
     * 设置群体信息
     *
     * @param obj 群体Pojo
     */
    function setCrowdPage(obj){
        if(!$.util.exist(obj)){
            return ;
        }
        $.select2.val("#type", obj.type);
        $.select2.able("#type", false);
        $("#nameText").val(obj.name);
        $("#nameText").attr("nameId", obj.nameCode);
        $("#nameText").attr("oldTypeId", obj.type);
        var city = obj.city;
        if(!$.util.isBlank(city)){
            var array = city.split(",");
            $.select2.val("#city",array);
        }
        $.select2.val("#unit",obj.unit);
        $("#situation").val(obj.situation);
        $("#createTime").text(obj.createTime==null?"":$.date.timeToStr(obj.createTime, "yyyy-MM-dd HH:mm"));
        $("#updateTime").text(obj.updateTime==null?"":$.date.timeToStr(obj.updateTime, "yyyy-MM-dd HH:mm"));
    }

    /**
     * 获取页面表单数据组成群体对象
     *
     * @returns {Object} 群体对象
     */
    function getCrowdObj(){
        var obj = new Object();
        obj.id = crowdId;
        obj.ruleName = $("#ruleName").val();
        obj.type = $.select2.val("#type");
        if($("#nameSelectDiv").is(":hidden")){
            obj.name = $("#nameText").val();
            obj.nameCode = $("#nameText").attr("nameId");
            if(obj.type != $("#nameText").attr("oldTypeId")){
                obj.nameCode = null;
            }
        }else{
            obj.nameCode = $.select2.val("#name");
        }
        obj.situation = $("#situation").val();
        obj.unit = $.select2.val("#unit");
        var cityArr = $.select2.val("#city");
        var city = "";
        if($.util.exist(cityArr)){
            $.each(cityArr,function (i,val) {
                city += val;
                if(i < cityArr.length - 1){
                    city += ",";
                }
            })
        }
        obj.city = city;
        return obj;
    }

    /**
     * 验证群体名称是否唯一
     *
     * @param func 验证通过后执行的方法
     * @param obj 执行方法参数
     */
    function verificationNameIsOnly(func, obj){
        var param = {
            "typeId" : $.select2.val("#type") ,
            "nameCode" : $("#nameText").attr("nameId") ,
            "name" : $("#nameText").val()
        };
        $.ajax({
            url:context + "/crowdManage/verificationNameIsOnly",
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
                        selector:"#nameText",  //需要弹出层的元素选择器
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
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.addCrowdInfoLayer, {
        saveCrowd : saveCrowd
    });
})(jQuery);