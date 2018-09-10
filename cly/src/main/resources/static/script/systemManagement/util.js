
function updateNodes(highlight, treeId) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    var nodeList = zTree.nodeSearchList ;
    var treeNodes =  zTree.getNodes ();
    for(var j in treeNodes ){
        treeNodes[j].target="unselected";
        zTree.updateNode(treeNodes[j]);
    }
    if(nodeList){
        for( var i=0; i < nodeList.length; i++) {
            nodeList[i].target = highlight;
            zTree.updateNode(nodeList[i]);
        }
    }
    chengeSelect();
}

function searchNode(value, treeId){
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    var keyType = "name";
    zTree.lastSearchValue = value ;
    if (value === "") {
        updateNodes("unselected", treeId);
        return;
    }
    zTree.nodeSearchList = zTree.getNodesByParamFuzzy(keyType, value);
    updateNodes("selected", treeId);
}

function chengeSelect(){
    $("a[target='selected']").attr("style","color:rgb(244,91,91);")
    $("a[target='unselected']").attr("style","")
}

function  searchNodeBtnClick(){
    var key = $(selectTree).val();
    searchNode(key, "ztree-demo") ;
}