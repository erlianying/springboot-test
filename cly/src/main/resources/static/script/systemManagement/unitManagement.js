(function($){
    "use strict";
    var zTree;
    var treeNodes;
    var setting
    var parentId = null;
    var parentName = null;
    var id = null;
    var oldName ="";
    var oldCode = "";
    var flag = true;
    var editFlag = true;
    var addFlag = false;
    var edit = false;
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
                url : context + "/unit/findAllSubUnitByParId",
                type : "post",
                autoParam: ["id"],
                dataFilter: function(treeId, parentNode, ztreeBeanList) {
                    return eval(ztreeBeanList);
                }
            },
            callback : { //回调函数
                onClick : zTreeOnCheck,
                onExpand :searchNodeBtnClick,
                onDblClick:zTreeDblClick
            },
            view : {
                autoCancelSelected: true,
            }
        };

        $(document).on("click" , "#addBtn", function(e){
            $("#state").select2("val","zt0001");
            addFlag = true;
            $("#code").attr("datatype","*1-30");
            $("#name").attr("datatype","*1-30");
            $("#shortName").attr("datatype","*1-30");
            removeValue();
            removeDisable();
            $("#superOrg").attr("valId",parentId);
            $("#superOrg").val(parentName);
            //addOrganizationBtnClick();
            $("#addDownDiv").show();
            $("#topBtn").hide();
        });

        // //点击添加按钮
        // $(document).on("click" , ".cancel", function(e){
        //     addFlag = false;
        //     $("#addDownDiv").hide();
        //     $("#editDownDiv").hide();
        //     $("#topBtn").show();
        //     lookOrganizationDetial();
        // });


        //点击添加按钮
        $(document).on("click" , "#save", function(e){
            addOrganizationBtnClick();
        });


        $(document).on("click" , "#editBtn", function(e){
            $("#code").attr("datatype","*1-30");
            $("#name").attr("datatype","*1-30");
            $("#shortName").attr("datatype","*1-30");
            removeDisable();
            $("#editDownDiv").show();
            $("#topBtn").hide();
            edit = true;
        });

        //点击编辑按钮
        $(document).on("click" , "#edit", function(e){
            editOrganizationBtnClick();
        });

        //点击添加按钮
        $(document).on("click" , ".cancel", function(e){
            flag = true;
            edit = false;
            addFlag = false;
            $("#code").attr("datatype","*0-30");
            $("#name").attr("datatype","*0-30");
            $("#shortName").attr("datatype","*0-30");
            $("#addDownDiv").hide();
            $("#editDownDiv").hide();
            $("#topBtn").show();
            inputDisable();
            lookOrganizationDetial();
            editFlag = true;
        });

        //点击添加按钮
        $(document).on("click" , "#deleteBtn", function(e){
            deleteBtnClick();
        });

        //点击启用按钮
        $(document).on("click" , "#enableBtn", function(e){
            enableBtnBtnClick();
        });

        //点击停用按钮
        $(document).on("click" , "#disableBtn", function(e){
            disableBtnBtnBtnClick();
        });

        $(document).on("blur" , "#code", function(e){
            if(edit){
                checkEditCode();
            }
            if(addFlag){
                checkCode();
            }
        });

        $(document).on("blur" , "#name", function(e){
            if(edit){
                checkEditName();
            }
            if(addFlag){
                checkName();
            }
        });

        $(document).on('keyup change', '#selectTree', function () {
            var key = $(this).val();
            searchNode(key, "ztree-demo") ;
        });

        init();
    })

    function zTreeDblClick(event, treeId, treeNode) {
        var str = $(".curSelectedNode").attr("class");
        str = str.substring(0,str.indexOf("curSelectedNode"));
       $(".curSelectedNode").attr("class",str);
        id = null;
        parentName = null;
        window.setTimeout(function(){
            removeValue();
        },1000);
    }

    function checkCode(){
        var code = $("#code").val();
        $.ajax({
            url: context + '/organization/checkOrganizationCode',
            data: {code: code},
            type: 'post',
            success: function (bool) {
                if (bool) {
                    flag = false;
                    $.util.topWindow().$.layerAlert.alert({msg: "单位编码重复!", title: "提示"})
                } else {
                    flag = true;
                }
            }
        })
    }

    function checkEditCode(){
        var code = $("#code").val();
        if(code != oldCode){
            $.ajax({
                url: context + '/organization/checkOrganizationCode',
                data: {code: code},
                type: 'post',
                success: function (bool) {
                    if (bool) {
                        editFlag = false;
                        $.util.topWindow().$.layerAlert.alert({msg:"单位编码重复!",title:"提示"})
                    }else{
                        editFlag = true;
                    }
                }
            })
        }else{
            editFlag = true;
        }
    }


    function checkName(){
        var name = $("#name").val();
        $.ajax({
            url: context + '/organization/checkOrganizationName',
            data: {name: name},
            type: 'post',
            success: function (bool) {
                if (bool) {
                    flag = false;
                    $.util.topWindow().$.layerAlert.alert({msg: "单位名称重复!", title: "提示"})
                } else {
                    flag = true;
                }
            }
        })
    }
    function checkEditName(){
        var name = $("#name").val();
        if(name != oldName){
            $.ajax({
                url: context + '/organization/checkOrganizationName',
                data: {name: name},
                type: 'post',
                success: function (bool) {
                    if (bool) {
                        editFlag = false;
                        $.util.topWindow().$.layerAlert.alert({msg:"单位名称重复!",title:"提示"})
                    }else{
                        editFlag = true;
                    }
                }
            })
        }else{
            editFlag = true;
        }

    }
    function init(){
        reloadTree();
        $.ajax({
            url: context+"/organization/findDictionary",
            type: 'POST',
            dataType:"json",
            success:function(map){
                $.select2.addByList("#state",map.state,"id","name",true,true);
                $.select2.able("#state",false);
            }
        });
    }


    function disableBtnBtnBtnClick(){
        if(!id || "" == id){
            $.util.topWindow().$.layerAlert.alert({msg:"您没有选中单位!",title:"提示"})
            return false;
        }
        $.ajax({
            url: context + "/organization/disableBtnBtnBtnClick",
            data: {id: id},
            type: 'POST',
            dataType: "json",
            success: function (successData) {
                if (successData) {
                    $.util.topWindow().$.layerAlert.alert({
                        msg: "停用成功!", title: "提示", end: function () {
                            lookOrganizationDetial();
                        }
                    });
                } else {
                    $.util.topWindow().$.layerAlert.alert({msg: "停用失败!", title: "提示"});
                }
            },
            error: function () {
                $.util.topWindow().$.layerAlert.alert({msg: "停用失败!", title: "提示"});
            }
        });
    }



    function enableBtnBtnClick(){
        if(!id || "" == id){
            $.util.topWindow().$.layerAlert.alert({msg:"您没有选中单位!",title:"提示"})
            return false;
        }
        $.ajax({
            url: context + "/organization/enableOrganization",
            data: {id: id},
            type: 'POST',
            dataType: "json",
            success: function (successData) {
                if (successData) {
                    $.util.topWindow().$.layerAlert.alert({
                        msg: "启用成功!", title: "提示", end: function () {
                            lookOrganizationDetial();
                        }
                    });
                } else {
                    $.util.topWindow().$.layerAlert.alert({msg: "启用失败!", title: "提示"});
                }
            },
            error: function () {
                $.util.topWindow().$.layerAlert.alert({msg: "启用失败!", title: "提示"});
            }
        });
    }



    function deleteBtnClick(){
        if(!id || "" == id){
            $.util.topWindow().$.layerAlert.alert({msg:"您没有选中单位!",title:"提示"})
            return false;
        }

        $.util.topWindow().$.layerAlert.confirm({
            msg:"确认删除吗？",
            title:"提示",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            yes:function(index, layero) {
                deleteUnit();
            }
        })
    }

    function deleteUnit(){
        $.ajax({
            url: context + "/organization/findSubOrgsAndSubPersonsById",
            data: {id: id},
            type: 'POST',
            dataType: "json",
            success: function (map) {
                if (map.subOrgs.length > 0 || map.persons.length > 0) {
                    var str = "";
                    if (map.subOrgs.length > 0) {
                        str += "该单位有:"
                        var len = map.subOrgs.length;
                        for (var i = 0; i < len; i++) {
                            if (i < len - 1) {
                                str += map.subOrgs[i] + ",";
                            } else {
                                str += map.subOrgs[i];
                            }
                        }
                        str += "下级单位"
                        if(map.persons.length > 0){
                            str += "及"
                        }
                    }

                    if (map.persons.length > 0) {
                        str += ""
                        var len = map.persons.length;
                        for (var i = 0; i < len; i++) {
                            if (i < len - 1) {
                                str += map.persons[i] + ",";
                            } else {
                                str += map.persons[i];
                            }
                        }
                        str += "人员,"
                    }
                    $.util.topWindow().$.layerAlert.alert({msg:str + "不能进行删除!",title:"提示"});
                    return false;
                }else{
                    $.ajax({
                        url: context + "/unit/deteleUnit",
                        data: {id: id,name:parentName},
                        type: 'POST',
                        dataType: "json",
                        success: function (successData) {
                            if (successData) {
                                $.util.topWindow().$.layerAlert.alert({
                                    msg: "删除成功!", title: "提示", end: function () {
                                        location.reload();
                                    }
                                });
                            } else {
                                $.util.topWindow().$.layerAlert.alert({msg: "删除失败!", title: "提示"});
                            }
                        },
                        error: function () {
                            $.util.topWindow().$.layerAlert.alert({msg: "删除失败!", title: "提示"});
                        }
                    });
                }
            }
        })

    }

    function initDate(organization){
        $("#code").val(organization.code);
        oldCode = organization.code;
        $("#name").val(organization.name);
        oldName = organization.name;
        $("#shortName").val(organization.shortName);
        $("#telephone").val(organization.telephone);
        $("#portraiture").val(organization.portraiture);
        $("#state").select2("val",organization.status);
        $("#address").val(organization.address);
        $("#fax").val(organization.fax);
        if(organization.superOrg){
            var superOrgLst = organization.superOrg.split(",");
            parentId = superOrgLst[0];
            $("#superOrg").attr("valId",superOrgLst[1]);
            $("#superOrg").val(superOrgLst[1]);
        }else{
            $("#superOrg").attr("valId","");
            $("#superOrg").val("");
        }
        $("#remark").val(organization.remark);
       // inputDisable();
    }

    function inputDisable(){
        $("#code").attr("readonly","readonly");
        $("#name").attr("readonly","readonly");
        $("#shortName").attr("readonly","readonly");
        $("#telephone").attr("readonly","readonly");
        $("#portraiture").attr("readonly","readonly");
        $.select2.able("#state",false);
        $("#address").attr("readonly","readonly");
        $("#fax").attr("readonly","readonly");
        $("#superOrg").attr("readonly","readonly");
        $("#remark").attr("readonly","readonly");
    }

    function removeDisable(){
        $("#code").removeAttr("readonly");
        $("#name").removeAttr("readonly");
        $("#shortName").removeAttr("readonly");
        $("#telephone").removeAttr("readonly");
        $("#portraiture").removeAttr("readonly");
        $.select2.able("#state",true);
        $("#address").removeAttr("readonly");
        $("#fax").removeAttr("readonly");
        $("#superOrg").removeAttr("readonly");
        $("#remark").removeAttr("readonly");
    }

    function removeValue(){
        $("#code").val("");
        $("#name").val("");
        $("#shortName").val("");
        $("#telephone").val("");
        $("#portraiture").val("");
        $("#address").val("");
        $("#fax").val("");
        $("#superOrg").val("");
        $("#remark").val("");
    }


    function reloadTree() {
        $.ajax({
            cache: false,
            type: 'POST',
            global: false,
            dataType: "json",
            url: context + "/unit/findAllFirstUnit",//请求的action路径
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
        parentId = treeNode.id;
        id = treeNode.id;
        parentName = treeNode.name;
        if(addFlag){
            $("#superOrg").attr("valId",parentId);
            $("#superOrg").val(parentName);
            return false;
        }
        lookOrganizationDetial(treeNode.id);
    };

    function lookOrganizationDetial(){

        $.ajax({
            url: context+"/organization/findOrganizationById",
            data:{id:id},
            type: 'POST',
            dataType:"json",
            success:function(organization){
                initDate(organization);
            }
        });
    }

    function addOrganizationBtnClick(){
        var demo = $.validform.getValidFormObjById("validformType") ;
        var tag = $.validform.check(demo) ;
        if(!tag){
            return false;
        }

        if(!flag){
            $.util.topWindow().$.layerAlert.alert({msg:"单位名称或编码重复!",title:"提示"})
            return false;
        }
        var pojo = getPojo();
        pojo.superOrg = id;
        $.ajax({
            url: context+"/unit/saveUnit",
            data:pojo,
            type: 'POST',
            dataType:"json",
            success:function(successData){
                flag = true;
                addFlag = false;
                if(successData){
                    $.util.topWindow().$.layerAlert.alert({msg:"新增成功!",title:"提示",end : function(){
                        location.reload();
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"新增失败!",title:"提示"});
                }
            },
            error:function(){
                $.util.topWindow().$.layerAlert.alert({msg:"新增失败!",title:"提示"});
            }
        });
    }


    function editOrganizationBtnClick(){

        var demo = $.validform.getValidFormObjById("validformType") ;
        var tag = $.validform.check(demo) ;
        if(!tag){
            return false;
        }
        if(!editFlag){
            $.util.topWindow().$.layerAlert.alert({msg:"单位名称或编码重复!",title:"提示"})
            return false;
        }

        var pojo = getPojo();
        pojo.id = id;
        $.ajax({
            url: context+"/unit/updateUnit",
            data:pojo,
            type: 'POST',
            dataType:"json",
            success:function(successData){
                edit = false;
                inputDisable();
                if(successData){
                    $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示",end : function(){
                        $("#code").attr("datatype","*0-30");
                        $("#name").attr("datatype","*0-30");
                        $("#shortName").attr("datatype","*0-30");
                        $("#topBtn").show();
                        $("#editDownDiv").hide();
                        lookOrganizationDetial();
                        reloadTree();
                        editFlag = true;
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                }
            },
            error:function(){
                $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
            }
        });
    }

})(jQuery);

//新增组织机构
(function($){
    "use strict";
    var parId = null;
    $(document).ready(function(){

    })




})(jQuery);

function  getPojo(){
    var  pojo = {
        name:$("#name").val(),
        code:$("#code").val(),
        shortName:$("#shortName").val(),
        telephone:$("#telephone").val(),
        fax:$("#fax").val(),
        address:$("#address").val(),
        remark:$("#remark").val(),
        status:$.select2.val("#state"),
        superOrg:$("#superOrg").attr("valId")
    }
    return pojo;
}

