(function($){
    "use strict";
    var table = null;
    $(document).ready(function(){
        //点击查询按钮
        $(document).on("click" , "#search", function(e){
            initTable();
        });

        $(document).on("click" , "#reset", function(e){
            location.reload();
        });

        $(document).on("click" , "#add", function(e){
            addBtnClick();
        });
        $(document).on("click" , "#edit", function(e){
            editBtnClick();
        });
        $(document).on("click" , "#delete", function(e){
            deleteBtnClick();
        });



        init();
    })

    function init(){
        initTable();
        $.ajax({
            url: context+"/resource/findResourceDictionary",
            type: 'POST',
            dataType:"json",
            success:function(map){
                $.select2.addByList("#resourceType",map.resourceType,"name","name",true,true);
            }
        });
    }

    function  deleteBtnClick(){
        if(getIdList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"至少勾选一项进行删除!",title:"提示"});
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
                deletePerson();
            }
        });
    }

    function deletePerson(){

        var data = {
            idList : getIdList()
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "idList", obj);
        $.ajax({
            url:context +'/resource/deleteResource',
            data:obj,
            type:'post',
            success:function(successData){
                if(successData){
                    $.util.topWindow().$.layerAlert.alert({msg:"删除成功!",title:"提示",end:function(){
                        initTable();
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"删除失败!",title:"提示",end:function(){
                    }});
                }
            },
            error:function () {
                $.util.topWindow().$.layerAlert.alert({msg:"删除失败!",title:"提示",end:function(){
                }});
            }
        })

    }


    /**
     * 资源 table
     */
    function initTable(){
        if(table != null) {
            table.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/resource/findResourceByParameter";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "选择",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    return "<div class='divid' valid='"+data+"'><input name=\"check\" type=\"checkbox\" class=\"icheckbox\"></div>";
                }
            },{
                "targets" : 1,
                "width" : "",
                "title" : "资源名称",
                "data" : "resourceName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 2,
                "width" : "",
                "title" : "资源类型",
                "data" : "resourceType",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :3,
                "width" : "",
                "title" : "资源链接",
                "data" : "resourceUrl",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
        //是否分页
        tb.paging = true;
        //每页条数
        tb.lengthMenu = [ 10 ];
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var obj = {
                "resourceName" : $("#resourceName").val(),
                "resourceType" : $("#resourceType").val(),
            };
            $.util.objToStrutsFormData(obj, "parameterPojo", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.pageList;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
        };
        table = $("#table").DataTable(tb);
    }

    function addBtnClick(){
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/addResource',
            pageLoading: true,
            title: "新增资源",
            width: "400px",
            height: "320px",
            btn: ["新增", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.addResource;
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
                initTable();
            }
        });
    }

    function editBtnClick(){

        if(getIdList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"您未勾选,请勾选一项进行编辑!",title:"提示"});
            return false;
        }
        if(getIdList().length > 1){
            $.util.topWindow().$.layerAlert.alert({msg:"您选择的大资源于一项,请勾选一项进行编辑!",title:"提示"});
            return false;
        }
        var id = getIdList()[0];
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/editResource',
            pageLoading: true,
            title: "编辑资源",
            width: "400px",
            height: "320px",
            btn: ["修改", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.editResource;
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
                id:id
            },
            end: function () {
                initTable();
            }
        });
    }

    function getIdList(){
        var idList = [];
        $.each($("#table .checked"), function (e,m) {
            var str = $(m).parent(".divid").attr("valid");
            idList.push(str);
        })
        return idList;
    }


})(jQuery);


