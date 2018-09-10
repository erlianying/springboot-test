(function($){
    "use strict";
    var table = null;
    var zTree;
    var treeNodes;
    var setting
    var dicTypeId = null;
    var parentId = null;
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
                url : context + "/dictionary/findAllSubDictItemsByParId",
                type : "post",
                autoParam: ["id"],
                dataFilter: function(treeId, parentNode, ztreeBeanList) {
                    return eval(ztreeBeanList);
                }
            },
            callback : { //回调函数
                onClick : zTreeOnCheck,
                onDblClick:zTreeDblClick
            }
        };
        //加载字典树
        $(document).on("click" , ".lookAllDicItem", function(e){
           var typeId =   $(this).attr("valId");
            dicTypeId = typeId;
            parentId = null;
            reloadTree(typeId);
        });
        //新增字典项
        $(document).on("click" , "#m_add", function(e){
            addDictionaryItemBtnClick();
        });
        //编辑字典项
        $(document).on("click" , "#m_edit", function(e){
            editDictionaryItemBtnClick();
        });

        //点击页码(上一页、下一页、首页、尾页）时，销毁字典树。
        $(document).on("click" , ".paginate_button", function(e){
            $.fn.zTree.destroy("ztree-demo");
             dicTypeId = null;
             parentId = null;
        });
        //删除字典项
        $(document).on("click" , "#m_del", function(e){
            delDictionaryItem();
        });
        //停用字典项
        $(document).on("click" , "#m_stop", function(e){
            stopUseDictionaryItem();
        });
        //停用字典项
        $(document).on("click" , "#m_start", function(e){
            startUseDictionaryItem();
        });



        //查看字典项详情
        $(document).on("click" , "#m_query", function(e){
            findDictionaryItemDetil();
        });

    })

    function delDictionaryItem(){
        if(!parentId || "" == parentId){
            $.util.topWindow().$.layerAlert.alert({msg:"您没有选中字典项!",title:"提示"})
            return false;
        }
        $.util.topWindow().$.layerAlert.confirm({
            msg:"确认删除吗？",
            title:"提示",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            yes:function(index, layero){
                $.ajax({
                    url: context + '/dictionary/delDictionaryItem',
                    data: {id: parentId},
                    type: 'post',
                    success: function (bool) {
                        if (bool) {
                            $.util.topWindow().$.layerAlert.alert({msg:"删除成功!",title:"提示"})
                            reloadTree();
                        }else{
                            $.util.topWindow().$.layerAlert.alert({msg:"删除失败!",title:"提示"})
                        }
                    },
                    error:function(){
                        $.util.topWindow().$.layerAlert.alert({msg:"删除失败!",title:"提示"})
                    }
                })
            }
        });
    }

    function startUseDictionaryItem(){
        if(!parentId || "" == parentId){
            $.util.topWindow().$.layerAlert.alert({msg:"您没有选中字典项!",title:"提示"})
            return false;
        }
        $.ajax({
            url: context + '/dictionary/startUseDictionaryItem',
            data: {id: parentId},
            type: 'post',
            success: function (bool) {
                if (bool) {
                    $.util.topWindow().$.layerAlert.alert({msg:"启用成功!",title:"提示"})
                    reloadTree();
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"启用失败!",title:"提示"})
                }
            },
            error:function(){
                $.util.topWindow().$.layerAlert.alert({msg:"启用失败!",title:"提示"})
            }
        })
    }

    function stopUseDictionaryItem(){
        if(!parentId || "" == parentId){
            $.util.topWindow().$.layerAlert.alert({msg:"您没有选中字典项!",title:"提示"})
            return false;
        }
        $.ajax({
            url: context + '/dictionary/stopUseDictionaryItem',
            data: {id: parentId},
            type: 'post',
            success: function (bool) {
                if (bool) {
                    $.util.topWindow().$.layerAlert.alert({msg:"停用成功!",title:"提示"})
                    reloadTree();
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"停用失败!",title:"提示"})
                }
            },
            error:function(){
                $.util.topWindow().$.layerAlert.alert({msg:"停用失败!",title:"提示"})
            }
        })
    }
    function addDictionaryItemBtnClick(){
        if(!dicTypeId || "" == dicTypeId){
            $.util.topWindow().$.layerAlert.alert({msg:"您没有选中字典类型!",title:"提示"})
            return false;
        }

        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/addDictionaryItem',
            pageLoading: true,
            title: "新增字典项",
            width: "400px",
            height: "400px",
            btn: ["新增", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.addDictionaryItem;
                    cm.save();
                },
                btn2: function (index, layero) {
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose: false,
            success: function (layero, index) {

            },
            initData: {
                dicTypeId: dicTypeId,
                parentId :parentId
            },
            end: function () {
                reloadTree();
            }
        });
    }

    function editDictionaryItemBtnClick(){
        if(!parentId || "" == parentId){
            $.util.topWindow().$.layerAlert.alert({msg:"您没有选中字典项!",title:"提示"})
            return false;
        }
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/editDictionaryItem',
            pageLoading: true,
            title: "编辑字典项",
            width: "400px",
            height: "400px",
            btn: ["修改", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.editDictionaryItem;
                    cm.edit();

                },
                btn2: function (index, layero) {
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose: false,
            success: function (layero, index) {

            },
            initData: {
                dicTypeId: dicTypeId,
                id :parentId
            },
            end: function () {
                reloadTree();
            }
        });
    }

    function findDictionaryItemDetil(){
        if(!parentId || "" == parentId){
            $.util.topWindow().$.layerAlert.alert({msg:"您没有选中字类项!",title:"提示"})
            return false;
        }
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/dictionaryItemDitel',
            pageLoading: true,
            title: "字典项详情",
            width: "400px",
            height: "400px",
            btn: ["关闭"],
            callBacks: {
                btn1: function (index, layero) {
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose: false,
            success: function (layero, index) {

            },
            initData: {
                dicTypeId: dicTypeId,
                id :parentId
            },
            end: function () {
            }
        });
    }

    function zTreeDblClick(event, treeId, treeNode){
        parentId = treeNode.id;
        findDictionaryItemDetil();
    }
    function zTreeOnCheck(event, treeId, treeNode) {
        parentId = treeNode.id;
        $.ajax({
            url:context + '/dictionary/findItemById',
            data:{id:treeNode.id},
            type:"post",
            dataType:"json",
            success:function(pojo){
                if(pojo.state == "zt0001"){
                    $("#m_stop").show();
                    $("#m_start").hide();
                }else {
                    $("#m_stop").hide();
                    $("#m_start").show();
                }
            }
        })
    };

    function reloadTree() {
        //加载树时隐藏右键菜单功能
        $(function(){
            $.ajax({
                data:{dicId:dicTypeId},
                cache:false,
                type: 'POST',
                global:false,
                dataType : "json",
                url: context+"/dictionary/findAllDicItemByDicTypeId",//请求的action路径
                error: function () {
                    $.layerAlert.alert({msg:"请求失败!",title:"提示"});
                },
                success:function(ztreeBeanList){
                    treeNodes = ztreeBeanList;
                    zTree = $.fn.zTree.init($("#ztree-demo"), setting, treeNodes);
                    $("#m_stop").hide();
                    $("#m_start").hide();
                    parentId = null;
                }
            });
        });
    }





})(jQuery);