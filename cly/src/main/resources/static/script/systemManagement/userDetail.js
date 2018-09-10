(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var id = initData.id;
    var setting = null;
    $(document).ready(function(){
        init();

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
            callback : {
                beforeDrop: function(treeId, treeNodes, targetNode, moveType, isCopy) {
                    return false ;
                }
            }
        };
    });

    function init(){
        $.ajax({
            url:context + '/account/findAccountById',
            data:{id:id},
            type:"post",
            dataType:"json",
            success:function(map){
                $("#accountName").text(map.pojo.accountName);
                $("#password").text(map.pojo.password);
                $("#person").text(map.pojo.person);
                $("#status").text(map.pojo.status);
                $("#organizationName").text(map.pojo.organizationName);
                $("#yxsj").text(map.pojo.startDateStr + "至" + map.pojo.endDateStr );
                if(map.pojo.intro){
                    $("#intro").text(map.pojo.intro);
                }
                $.fn.zTree.init($("#ztree-roleTree"), setting, map.roleLis);
            }
        })
    }
    function getFontCss(treeId, treeNode){
        return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
    }

})(jQuery);