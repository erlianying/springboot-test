$.editPerson = $.editPerson || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var id = initData.id;
    var flag = true;
    var organization = null;

    var zTree;
    var treeNodes;
    var setting
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

        $(document).on("click" , "#pa_newPage_unitFind", function(e){
            showMenu();
        });



        setting = {
            isSimpleData : true,              //数据是否采用简单 Array 格式，默认false
            treeNodeKey : "id",               //在isSimpleData格式下，当前节点id属性
            treeNodeParentKey : "searchingTypeId",        //在isSimpleData格式下，当前节点的父节点id属性
            showLine : true,                  //是否显示节点间的连线
            checkable : true  ,
            global:false,
            async: {
                enable: true,
                global: false,
                url : context + "/organization/findAllSubOrganizationByParId",
                type : "post",
                autoParam: ["id"],
                dataFilter: function(treeId, parentNode, ztreeBeanList) {
                    return eval(ztreeBeanList);
                }
            },
            callback : { //回调函数
                onClick : zTreeOnCheck,
            }
        };

    });


    //校验字典类型编码是否相同
    function checkCode() {
        var code = $("#code").val();
        $.ajax({
            url: context + '/person/checkPersonCode',
            data: {code: code},
            type: 'post',
            success: function (bool) {
                if (bool) {
                    flag = false;
                    $.util.topWindow().$.layerAlert.alert({msg:"警号重复!",title:"提示"})
                }else{
                    flag = true;
                }
            }
        })
    }

    //校验字典类型编码是否相同
    function checkCode() {
        var code = $("#code").val();
        $.ajax({
            url: context + '/person/checkPersonIdNumber',
            data: {code: code},
            type: 'post',
            success: function (bool) {
                if (bool) {
                    flag = false;
                    $.util.topWindow().$.layerAlert.alert({msg:"身份证号重复!",title:"提示"})
                }else{
                    flag = true;
                }
            }
        })
    }



    function init(){
        $.ajax({
            url:context + '/person/initPersonDictionary',
            type:"post",
            dataType:"json",
            success:function(map){
                $.select2.addByList("#sex",map.sex,"id","name",true,true);
                $.select2.addByList("#position",map.position,"id","name",true,true);
                $.select2.addByList("#nationality",map.nationality,"id","name",true,true);
                $.select2.addByList("#degree",map.degree,"id","name",true,true);
                $.select2.addByList("#status",map.status,"id","name",true,true);
                $.select2.addByList("#politicalStatus",map.politicalStatus,"id","name",true,true);
                $.ajax({
                    url: context + '/person/findPersonById',
                    data: {id: id},
                    type: "post",
                    dataType: "json",
                    success: function (pojo) {
                        initPersonData(pojo);
                        reloadTree();
                    }
                })
            }
        })
    }

    function initPersonData(pojo){
        organization = pojo.organization;
        $("#name").val(pojo.name);
        $("#code").val(pojo.code);
        $("#idNumber").val(pojo.idNumber);
        $("#telephone").val(pojo.telephone);
        $("#officePhone").val(pojo.officePhone)
        $("#organizationName").val(pojo.organizationName);
        $("#sex").select2("val",pojo.sex);
        $("#position").select2("val",pojo.position);
        $("#nationality").select2("val",pojo.nationality);
        $("#politicalStatus").select2("val",pojo.politicalStatus);
        $("#degree").select2("val",pojo.degree);
        $("#status").select2("val",pojo.status);
    }

    function getPojo(){
        var dictionaryItem = {
            id:id,
            organization :organization,
            name: $("#name").val(),
            code: $("#code").val(),
            idNumber: $("#idNumber").val(),
            telephone: $("#telephone").val(),
            officePhone: $("#officePhone").val(),
            sex:$.select2.val("#sex"),
            position:$.select2.val("#position"),
            nationality:$.select2.val("#nationality"),
            politicalStatus:$.select2.val("#politicalStatus"),
            degree:$.select2.val("#degree"),
            status:$.select2.val("#status"),
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
            $.util.topWindow().$.layerAlert.alert({msg:"警号或身份证号重复!",title:"提示"})
            return false;
        }

        var person = getPojo();
        $.ajax({
            url:context + '/person/savePerson',
            type:"post",
            data:person,
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

    function reloadTree() {
        $.ajax({
            cache: false,
            type: 'POST',
            global: false,
            dataType: "json",
            url: context + "/organization/findAllFirstOrganization",//请求的action路径
            error: function () {
                $.layerAlert.alert({msg: "请求失败!", title: "提示"});
            },
            success: function (ztreeBeanList) {
                treeNodes = ztreeBeanList;
                zTree = $.fn.zTree.init($("#ztree-demo"), setting, treeNodes);
            }
        });
    }

    function zTreeOnCheck(event, treeId, treeNode) {
        organization = treeNode.id;
        $("#organizationName").val(treeNode.name);
        $("#menuContent").hide();
    };

    function showMenu() {
        var obj = $("#organizationName");
        var oOffset = $("#organizationName").offset();
        $("#menuContent").css({left:oOffset.left + "px", top:oOffset.top + obj.outerHeight() + "px"}).slideDown("fast");
        $("body").on("mousedown", onBodyDown);
       // $("#menuContent").show();
    }

    function onBodyDown(event) {
        if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
            hideMenu();
        }
    }
    function hideMenu() {
        $("#menuContent").fadeOut("fast");
        $("body").off("mousedown", onBodyDown);
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.editPerson, {
        edit : edit
    });


})(jQuery);