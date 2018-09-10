$.addPerson = $.addPerson || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var organization = initData.organization;
    var organizationName = initData.organizationName;
    var flag = true;

    var setting = null;
    var zTree;
    var treeNodes;
    $(document).ready(function(){
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

        init();

        $(document).on("blur" , "#code", function(e){
            checkCode();
        });

        $(document).on("blur" , "#idNumber", function(e){
            checkIdNumber();
        });

        $(document).on("click" , "#pa_newPage_unitFind", function(e){
            showMenu();
        });
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
    function checkIdNumber() {
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
        reloadTree();
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
                $("#organizationName").val(organizationName);
            }
        })
    }

    function getPojo(){
        var dictionaryItem = {
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

    function save(){
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

    function zTreeOnCheck(event, treeId, treeNode) {
        alert("111");
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


    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.addPerson, {
        save : save
    });


})(jQuery);