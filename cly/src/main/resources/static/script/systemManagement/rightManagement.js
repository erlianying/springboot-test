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

        //点击删除按钮
        $(document).on("click" , "#delete", function(e){
            deleteBtnClick();
        });

        init();
    })

    function init(){
        initTable();
    }

    function  deleteBtnClick(){
        if(getIdList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"您未勾选,请勾选一项进行删除!",title:"提示"});
            return false;
        }
        if(getIdList().length > 1){
            $.util.topWindow().$.layerAlert.alert({msg:"您选择的角色大于一项,请勾选一项进行删除!",title:"提示"});
            return false;
        }
        var id = getIdList()[0];
        $.util.topWindow().$.layerAlert.confirm({
            msg:"确认删除吗？",
            title:"提示",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            yes:function(index, layero){
                deleteUser(id);
            }
        });
    }

    function deleteUser(id){


        $.ajax({
            url:context +'/role/findRoleByAuthorityId',
            data:{id:id},
            type:'post',
            success:function(successData){
                if(null != successData && successData.length >0){
                    var str = "";
                    var len  = successData.length;
                    for( var i = 0 ;i < len ;i++){
                        if(i< len -1){
                            str += successData[i].name + ",";
                        }else{
                            str += successData[i].name;
                        }
                    }
                    $.util.topWindow().$.layerAlert.alert({msg:"该权限有:"+str+"角色在用,不能删除!",title:"提示"});
                }else{

                    $.ajax({
                        url:context +'/authority/deleteAuthority',
                        data:{id:id},
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
        tb.ajax.url = context +"/authority/findAuthorityByParameter";
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
                "title" : "权限名称",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 2,
                "width" : "",
                "title" : "权限编码",
                "data" : "code",
                "render" : function(data, type, full, meta) {
                    return data;
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
                "name" : $("#name").val(),
                "code" : $("#code").val(),
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
            content: context + '/show/page/web/systemManagement/addRight',
            pageLoading: true,
            title: "新增权限",
            width: "810px",
            height: "540px",
            btn: ["新增", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.addRight;
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
            $.util.topWindow().$.layerAlert.alert({msg:"您选择的权限大于一项,请勾选一项进行编辑!",title:"提示"});
            return false;
        }
        var id = getIdList()[0];
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/editRight',
            pageLoading: true,
            title: "编辑权限",
            width: "810px",
            height: "540px",
            btn: ["修改", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.editRight;
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


