(function($) {
    "use strict";
    var number;
    var aAndM;
    var powerId;
    $(document).ready(function(){
        /**判断是否为IE浏览器*/
        if(!+"\v1"){
            var win = $.util.rootWindow() ;		//找父级页面
            var	flag = win.$.common.getParentObj() ;	//取父级页面数据
            var	ids = win.$.common.getParentObj1() ;
            aAndM=flag;
            powerId=ids;
            findAllResource();
            if(!$.util.isEmpty(ids)){
                $.ajax({
                    url:context +'/authority/findAuthorityById.action',
                    async:true,
                    type:'post',
                    dataType:'json',
                    data:{
                        "id":ids,
                        "stage":flag,		//用于判断是新增或修改的阶段
                    },
                    success:function(json){
                        $("#powerName").val(json.authorityBean.authorityName);
                        $("#powerCategory").val(json.authorityBean.authorityCode);
                        initMoveAuthorityTree(json.authorityZTreeBean);
                        zTreeSetValue(json.availabeAuthorityZTreeBean);
                    },
                    error:function(errorData){
                    }
                });
            }
        }else{
            /**获取父页面的参数*/
            jQuery.extend($.common, {
                setTestObj2:function(index){
                    number=index;	//从父页面获取当前弹出层   用于关闭
                },
                addAndModify:function(flag,ids){
                    aAndM=flag;
                    powerId=ids;
                    findAllResource();
                    if(!$.util.isEmpty(ids)){
                        $.ajax({
                            url:context +'/authority/findAuthorityById.action',
                            async:true,
                            type:'post',
                            dataType:'json',
                            data:{
                                "id":ids,
                                "stage":flag,	//用于判断是新增或修改的阶段
                            },
                            success:function(json){
                                initMoveAuthorityTree(json.authorityZTreeBean);
                                zTreeSetValue(json.availabeAuthorityZTreeBean);
                                $("#powerName").val(json.authorityBean.authorityName);
                                $("#powerCategory").val(json.authorityBean.authorityCode);
                            },
                            error:function(errorData){
                            }
                        });
                    }


                },
            });
        }
    });
    function takeValue(){
        //右树取值#ztree-roleRight"
        //var data = new Object();
        var rbsl = [];
        var treeTemp = $.fn.zTree.getZTreeObj("ztree-roleRight");	//找到取值的树
        var nodes = treeTemp.getNodes();
        var obj;
        for(var i in nodes){
            var arr=nodes[i];
            if($.util.exist(arr)){
                obj = new Object();
                obj.id =arr.id;
                rbsl.push(obj);

            }
        }
        return rbsl;
    }

    /**查询所有资源*/
    function findAllResource(){
        $.ajax({
            url:context +'/authority/findAllResource.action',
            async:false,
            type:'post',
            dataType:'json',
            success:function(data){
                if(aAndM=="add"){
                    initMoveAuthorityTree(data.authorityZTreeBean);
                }
            },

        });
    }



    /**保存*/
    $(document).on('click','#savePower',function(){
        /**表单验证*/
        var demo = $.validform.getValidFormObjById("validformId") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return;
        }
        var dataMap = new Object();
        dataMap["authorityBean.authorityName"] = $("#powerName").val();
        dataMap["authorityBean.authorityCode"] = $("#powerCategory").val();
        var powerKey=takeValue();
        $(powerKey).each(function(index,itm){
            dataMap["authorityBean.resourceLibBeans["+index+"].id"]=itm.id;
        });
        if(!$.util.isEmpty(powerId)||aAndM=="modify"){
            dataMap["authorityBean.id"] = powerId;
            $.ajax({url : context + '/authority/updateAuthority.action',
                type : "POST",
                async: true,
                dataType : "json",
                data :dataMap,
                success : function(data) {
                    if(data.flag == "true"){
                        powerId = data.authorityBean.id;
                        alertHint("修改成功",6);
                        $("#modify").css("display","inline");
                        $("#savePower").css("display","none");
                        $("#powerName").attr("readonly","readonly");
                        $("#powerCategory").attr("readonly","readonly");
                        $("#rightshift").attr("disabled","true");
                        $("#leftshift").attr("disabled","true");
                        $("#cancel").attr("disabled","true");
                    }else{
                        alertHint(data.msg,5);
                        return;
                    }
                }
            });
        }else {
            $.ajax({url : context + '/authority/addAuthority.action',
                type : "POST",
                async: true,
                dataType : "json",
                data : dataMap,
                success : function(data) {
                    if(data.flag == "true"){
                        alertHint("保存成功",6);
                        $("#modify").css("display","inline");
                        $("#savePower").css("display","none");
                        $("#powerName").attr("readonly","readonly");
                        $("#powerCategory").attr("readonly","readonly");
                        $("#rightshift").attr("disabled","true");
                        $("#leftshift").attr("disabled","true");
                        $("#cancel").attr("disabled","true");
                        powerId = data.authorityBean.id;
                    }else{
                        alertHint(data.msg,5);
                        return;
                    }
                }
            });
        }

    });

    $(document).on('click','#modify',function(){
        $("#modify").css("display","none");
        $("#savePower").css("display","inline");
        $("#powerName").removeAttr("readOnly");
        $("#powerCategory").removeAttr("readOnly");
        $('#rightshift').removeAttr("disabled");
        $('#leftshift').removeAttr("disabled");
        $('#cancel').removeAttr("disabled");		//移除disabled状态
    });


    /**取消*/
    $(document).on('click','#cancel',function(){
        window.top.$.layerAlert.closeAll();	//关闭所有层
    });
    function alertHint(msg,icon){
        $.layerAlert.alert({
            msg:msg,
            title:"提示",		//弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:icon,				//弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            shift:1,			//弹出时的动画效果  有0-6种
        });
    }
    var setting = {
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
    /**初始化已选树*/
    function zTreeSetValue(data){
        //右树赋值
        reAddAllNodes("ztree-roleRight", data);
    }
    /**
     * 清空树节点
     */
    function removeAllNodes(treeId){
        var treeTemp = $.fn.zTree.getZTreeObj(treeId);
        if(!$.util.exist(treeTemp)){
            return;
        }
        var nodes = treeTemp.getNodes();
        if(!$.util.exist(nodes)){
            return;
        }
        $.each(nodes, function(i, val){
            treeTemp.removeNode(val);
        });
    }
    /**
     * 重新添加树的节点
     */
    function cleanZTree(){
        //清空已选树
        removeAllNodes("ztree-roleSelected");
        //清空右树
        removeAllNodes("ztree-roleRight");
    }
    function reAddAllNodes(treeId, nodes){
        removeAllNodes(treeId);
        var treeTemp = $.fn.zTree.getZTreeObj(treeId);
        if(!$.util.exist(treeTemp)){
            return;
        }
        //父节点Id，节点List，后边别管了
        treeTemp.addNodes(null, nodes, null, null);
    }
    function initSelectedRoleTree(){
        $.fn.zTree.init($("#ztree-ztree-roleSelected"), setting);
    }
    function initMoveAuthorityTree(powerList) {
        $(document).on("click", "#toRight", function(){
            var tree1 = $.fn.zTree.getZTreeObj("ztree-roleLeft");
            var tree2 = $.fn.zTree.getZTreeObj("ztree-roleRight");
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
            var tree2 = $.fn.zTree.getZTreeObj("ztree-roleRight");
            var nodes = tree2.getCheckedNodes(true);
            $.each(nodes, function(i, val){
                tree2.removeNode(val);
            });
        });

        $(document).on('focus', '#keyLeft', function () {
            var key = $(this) ;
            focusKey(key) ;
        });

        $(document).on('blur', '#keyLeft', function () {
            var key = $(this) ;
            blurKey(key) ;
        });

        $(document).on('keyup change', '#keyLeft', function () {
            var key = $(this) ;
            searchNode(key, "ztree-roleLeft") ;
        });

        $(document).on('focus', '#keyRight', function () {
            var key = $(this) ;
            focusKey(key) ;

        });

        $(document).on('blur', '#keyRight', function () {
            var key = $(this) ;
            blurKey(key) ;
        });

        $(document).on('keyup change', '#keyRight', function () {
            var key = $(this) ;
            searchNode(key, "ztree-roleRight") ;
        });

        var zTreeRoleLeft = $.fn.zTree.init($("#ztree-roleLeft"), setting, powerList);
        zTreeRoleLeft.lastSearchValue = "" ;
        zTreeRoleLeft.nodeSearchList = [] ;
        zTreeRoleLeft.fontSearchCss = {} ;
        var zTreeRoleRight = $.fn.zTree.init($("#ztree-roleRight"), setting);
        zTreeRoleRight.lastSearchValue = "" ;
        zTreeRoleRight.nodeSearchList = [] ;
        zTreeRoleRight.fontSearchCss = {} ;
    }
    function copyNodesToRight(nodes){
        var tree1 = $.fn.zTree.getZTreeObj("ztree-roleLeft");
        var tree2 = $.fn.zTree.getZTreeObj("ztree-roleRight");
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
                copyNode.children = null ;
                if(copyNode.getParentNode()!=null){
                    var target = tree2.getNodeByParam("id", copyNode.parentId, null) ;
                    tree2.copyNode(target, copyNode, "inner") ;
                }else{
                    tree2.copyNode(null, copyNode, "inner") ;
                }
            }
            var children = tree1.getNodesByParam("parentId", val.id, val);
            $.each(children, function(k, val1){
                var target = tree2.getNodeByParam("id", val.id, null) ;
                tree2.copyNode(target, val1, "inner") ;
            });
        });
    }
    function updateNodes(highlight, treeId) {
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        var nodeList = zTree.nodeSearchList ;
        for( var i=0, l=nodeList.length; i<l; i++) {
            nodeList[i].highlight = highlight;
            zTree.updateNode(nodeList[i]);
        }
    }

    function searchNode(key, treeId){
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        var value = $.trim(key.get(0).value);
        var keyType = "name";
        if (key.hasClass("empty")) {
            value = "";
        }
        if (zTree.lastSearchValue === value) return;
        zTree.lastSearchValue = value ;
        if (value === "") {
            updateNodes(false, treeId);
            return;
        }
        zTree.nodeSearchList = zTree.getNodesByParamFuzzy(keyType, value);
        updateNodes(true, treeId);
    }
    function focusKey(key) {
        if (key.hasClass("empty")) {
            key.removeClass("empty");
        }
    }

    function blurKey(key) {
        if (key.get(0).value === "") {
            key.addClass("empty");
        }
    }
    function getFontCss(treeId, treeNode){
        return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
    }
    function showMenu() {
        var obj = $("#upUnit");
        var oOffset = $("#upUnit").offset();
        $("#menuContent").css({left:oOffset.left + "px", top:oOffset.top + obj.outerHeight() + "px"}).slideDown("fast");
        $("body").on("mousedown", onBodyDown);
    }
    function hideMenu() {
        $("#menuContent").fadeOut("fast");
        $("body").off("mousedown", onBodyDown);
    }
    function onBodyDown(event) {
        if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
            hideMenu();
        }
    }
})(jQuery);