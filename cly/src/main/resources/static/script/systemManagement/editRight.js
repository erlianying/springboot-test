$.editRight = $.editRight || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var id = initData.id;
    var flag = true;
    var setting = null;
    var name = "";
    var code = "";
    $(document).ready(function(){
       setting = {
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

        init();
        $(document).on("blur" , "#code", function(e){
            checkCode();
        });

        $(document).on("blur" , "#name", function(e){
            checkName();
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
        $.fn.zTree.init($("#tree-right"), setting,tree2Nodes);
    }

    function init(){
        $.ajax({
            url:context + '/resource/initAllResource',
            type:"post",
            dataType:"json",
            success:function(treeNodes){
                $.fn.zTree.init($("#tree-left"), setting, treeNodes);

            }
        })

        $.ajax({
            url:context + '/authority/findAuthorityById',
            data:{id:id},
            type:"post",
            dataType:"json",
            success:function(map){
                name = map.pojo.name;
                code = map.pojo.code;
                $("#name").val(map.pojo.name);
                $("#code").val(map.pojo.code);
                $.fn.zTree.init($("#tree-right"), setting, map.resList);
            }
        })
    }

    //校验字典类型编码是否相同
    function checkName() {
        var newName = $("#name").val();
        if(newName == name){
            return false;
        }
        $.ajax({
            url: context + '/authority/checkAuthorityName',
            data: {name: newName},
            type: 'post',
            success: function (bool) {
                if (bool) {
                    flag = false;
                    $.util.topWindow().$.layerAlert.alert({msg:"名称编码重复!",title:"提示"})
                }else{
                    flag = true;
                }
            }
        })
    }

    //校验字典类型编码是否相同
    function checkCode() {
        var newCode = $("#code").val();
        if(code = newCode){
            return false;
        }
        $.ajax({
            url: context + '/authority/checkAuthorityCode',
            data: {code: newCode},
            type: 'post',
            success: function (bool) {
                if (bool) {
                    flag = false;
                    $.util.topWindow().$.layerAlert.alert({msg:"权限编码重复!",title:"提示"})
                }else{
                    flag = true;
                }
            }
        })
    }


    function getPojo(){
        var tree2list = $.fn.zTree.getZTreeObj("tree-right").getNodes ();
        var resourceIdList = [];
        for(var i in tree2list){
            resourceIdList.push(tree2list[i].id);
        }
        var authorityItem = {
            id:id,
            name: $("#name").val(),
            code: $("#code").val(),
            resourceIdList:resourceIdList
        };
        return authorityItem;
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

        var pojo = getPojo();
        var obj = new Object();
        $.util.objToStrutsFormData(pojo, "pojo", obj);
        $.ajax({
            url:context + '/authority/saveAuthority',
            type:"post",
            data:obj,
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

    function getFontCss(treeId, treeNode){
        return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
    }






    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.editRight, {
        edit : edit
    });


})(jQuery);