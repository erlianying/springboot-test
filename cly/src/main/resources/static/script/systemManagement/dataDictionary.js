(function($){
    "use strict";
    var table = null;
    $(document).ready(function(){

        $(document).on("click" , "#search", function(e){
            $.fn.zTree.destroy("ztree-demo");
            searchTable();
        });

        $(document).on("click" , "#reset", function(e){
            location.reload();
        })

        $(document).on("click" , ".updateDictionaryType", function(e){
            var id = $(this).attr("valId")
            updateDictionaryTypeBtnClick(id);
        });

        $(document).on("click" , "#add", function(e){
            addDictionaryTypeBtnClick();
        });

        searchTable();
        init();
    })

    function init(){
        $.ajax({
            url:context + '/dictionary/findAllDictionaryTypeClassifier',
            type:"post",
            dataType:"json",
            success:function(dictionaryPojo){
                $.select2.addByList("#classifier",dictionaryPojo,"name","name",true,true);
            }
        })
    }

    function searchTable(){
        var  classifier = $.select2.val("#classifier");
        var  name = $("#name").val();
        $.ajax({
            url:context + '/dictionary/findAllDictionaryTyBypeParameterPojo',
            type:"post",
            dataType:"json",
            data:{name:name,classifier:classifier},
            success:function(dictionaryTypeList){
                initTable(dictionaryTypeList);
            }
        })
    }
    function updateDictionaryTypeBtnClick(id){
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/editDictionaryType',
            pageLoading: true,
            title: "修改字典类型",
            width: "400px",
            height: "400px",
            btn: ["修改", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.editDictionaryType;
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
                id: id
            },
            end: function () {
                searchTable();
            }
        });
    }

    function addDictionaryTypeBtnClick(){
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/addDictionaryType',
            pageLoading: true,
            title: "新增字典类型",
            width: "400px",
            height: "400px",
            btn: ["新增", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.addDictionaryType;
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
            },
            end: function () {
                searchTable();
            }
        });
    }


    function initTable(tableInfoLst){
        if(table != null) {
            table.destroy();
        }
        var tb = $.uiSettings.getLocalOTableSettings();
        $.util.log(tb);
        tb.data = tableInfoLst;
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "16%",
                "title" : "序号",
                "data" : "num",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 1,
                "width" : "20%",
                "title" : "类型名称",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },{
                "targets" : 2,
                "width" : "16%",
                "title" : "类型编码",
                "data" : "code",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :3,
                "width" : "16%",
                "title" : "类型划分",
                "data" : "classifier",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 4,
                "width" : "16%",
                "title" : "描述",
                "data" : "description",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "16%",
                "title" : "操作",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    var str = "<a class='updateDictionaryType'  valId='"+data+"'  href='###'>修改</a><br>"
                                + "<a class='lookAllDicItem'  valId='"+data+"'  href='###'>查看字典项</a>";
                    return str;
                }
            }
        ];
        tb.ordering = false;
        tb.hideHead = false;
        tb.dom = null;
        tb.searching = false;
        tb.lengthChange = false;
        tb.paging = true;
        tb.info = true;
        tb.lengthMenu = [ 10 ];
        tb.initComplete = function(){ //表格加载完成后执行的函数
        }
        table = $("#dictionaryTypeTable").DataTable(tb);
    }





})(jQuery);