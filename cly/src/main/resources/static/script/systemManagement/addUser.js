$.addUser = $.addUser || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var organization = initData.organization;
    var organizationName = initData.organizationName;
    var flag = true;
    var roleSetting = null;
    var setting = null;
    var zTree;
    var treeNodes;
    $(document).ready(function(){
        roleSetting = {
            view: {
                fontCss: getFontCss
            },
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false,
                drag: {
                    autoExpandTrigger: true
                }
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            check : {
                enable : true,
                chkStyle: "checkbox",
                radioType: "all",
                chkboxType : {
                    "Y" : "s",
                    "N" : "s"
                }
            },
            callback : {
                beforeDrop: function(treeId, treeNodes, targetNode, moveType, isCopy) {
                    return false ;
                }
            }
        };

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
        $(document).on("blur" , "#accountName", function(e){
            checkAccountName();
        });

        $(document).on("click" , "#pa_newPage_unitFind", function(e){
            showMenu();
        });

        $(document).on("click", "#toRight", function(){
            var tree1 = $.fn.zTree.getZTreeObj("tree-left");
            var tree2 = $.fn.zTree.getZTreeObj("tree-right");
            var nodes = tree1.getCheckedNodes(true);
            var cpNodes = [] ;
            $.each(nodes, function(i, val){
                if(!val.getCheckStatus().half){
                    cpNodes.push(val) ;
                }
            });
            copyNodesToRight(cpNodes) ;
        });

        $(document).on("click", "#remove", function(){
            var tree2 = $.fn.zTree.getZTreeObj("tree-right");
            var nodes = tree2.getCheckedNodes(true);
            $.each(nodes, function(i, val){
                tree2.removeNode(val);
            });
        });

        $(document).on('keyup change', '#keyLeft', function () {
            var key = $(this).val();
            searchNode(key, "tree-left") ;
        });

        $(document).on('keyup change', '#keyRight', function () {
            var key = $(this).val();
            searchNode(key, "tree-right") ;
        });
    });

    function copyNodesToRight(nodes){
        var tree1 = $.fn.zTree.getZTreeObj("tree-left");
        var tree2 = $.fn.zTree.getZTreeObj("tree-right");
        var tree2Nodes =  tree2.getNodes ();
        $.each(nodes, function(i, val){
            var parent = val.getParentNode() ;
            var id = val.id ;
            var parentId = val.parentId ;
            var self = tree2.getNodeByParam("id", id, null) ;
            if(self!=null){
                return true ;
            }
            var copyList = [] ;
            copyList.push($.util.cloneObj(val)) ;
            var tree2ParentNode = tree2.getNodeByParam("id", parentId, null) ;
            if(tree2ParentNode == null){
                while(parent!=null){
                    var parentTree2Parent = tree2.getNodeByParam("id", parent.parentId, null) ;
                    if(parentTree2Parent!=null){
                        break ;
                    }else{
                        copyList.push($.util.cloneObj(parent)) ;
                        parent = parent.getParentNode() ;
                    }
                }
            }
            for(var j=copyList.length-1; j>=0; j--){
                var copyNode = copyList[j] ;
                if(tree2Nodes.length > 0){
                    var flag = true;
                    for(var i in tree2Nodes ){
                        if(copyNode.id == tree2Nodes[i].id){
                            flag = false;
                        }
                    }
                    if(flag){
                        tree2Nodes.push(copyNode);
                    }
                }else{
                    tree2Nodes.push(copyNode);
                }
                // tree2.copyNode(null, copyNode, "inner") ;
            }
        });
        $.fn.zTree.init($("#tree-right"), roleSetting,tree2Nodes);
    }

    function init(){
        reloadTree();
        $.ajax({
            url:context + '/role/findAllRoleTreePojoList',
            type:"post",
            dataType:"json",
            success:function(treeNodes){
                $.fn.zTree.init($("#tree-left"), roleSetting, treeNodes);
                $.fn.zTree.init($("#tree-right"), roleSetting);
            }
        })

        $.ajax({
            url:context + '/account/findDictionary',
            type:"post",
            dataType:"json",
            success:function(map){
                $.select2.addByList("#status",map.status,"id","name",true,true);
                if(organization){
                    findAllNoAccountPersonByOrganizationId(organization);
                    $("#organizationName").val(organizationName);
                }
            }
        })
    }

    //校验字典类型编码是否相同
    function checkAccountName() {
        var accountName = $("#accountName").val();
        $.ajax({
            url: context + '/account/checkAccountByAccountName',
            data: {accountName: accountName},
            type: 'post',
            success: function (bool) {
                if (bool) {
                    flag = false;
                    $.util.topWindow().$.layerAlert.alert({msg:"用户名重复!",title:"提示"})
                }else{
                    flag = true;
                }
            }
        })
    }

    function getPojo(){
        var tree2list = $.fn.zTree.getZTreeObj("tree-right").getNodes ();
        var roleIdList = [];
        for(var i in tree2list){
            roleIdList.push(tree2list[i].id);
        }

        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        var  startDateLong = new Date(startDate).getTime();

        var endDate = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end");
        var  endDateLong = new Date(endDate).getTime();

        var userItem = {
            accountName: $("#accountName").val(),
            "status" : $.select2.val("#status"),
            password: $("#password").val(),
            intro: $("#intro").val(),
            person: $.select2.val("#person"),
            roleIdList:roleIdList,
            startDateLong : startDateLong,
            endDateLong : endDateLong,
        };
        return userItem;
    }

    function save(){
        var demo = $.validform.getValidFormObjById("validformPersonType") ;
        var tag = $.validform.check(demo);
        if(!tag){
            return false;
        }
        if(!flag){
            $.util.topWindow().$.layerAlert.alert({msg:"用户名重复!",title:"提示"})
            return false;
        }

        var pojo = getPojo();
        var obj = new Object();
        $.util.objToStrutsFormData(pojo, "pojo", obj);
        $.ajax({
            url:context + '/account/saveAccount',
            type:"post",
            data:obj,
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
        findAllNoAccountPersonByOrganizationId(organization);
        $("#organizationName").val(treeNode.name);
        $("#menuContent").hide();
    };

    function findAllNoAccountPersonByOrganizationId(organizationId){
        $.ajax({
            url:context + '/account/findAllNoAccountPersonByOrganizationId',
            data:{organizationId:organizationId},
            type:"post",
            dataType:"json",
            success:function(personList){
                $.select2.empty("#person");
                if(personList &&personList.length >0){
                    $.select2.addByList("#person",personList,"id","name",true,true);
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"该单位没有未分配用户的人员!",title:"提示"});
                }

            }
        })
    }

    function getFontCss(treeId, treeNode){
        return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
    }


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
    jQuery.extend($.addUser, {
        save : save
    });


})(jQuery);