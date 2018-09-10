(function($){
    "use strict";
    var zTree;
    var treeNodes;
    var setting
    var organization = null;
    var  organizationName = null;
    var table = null;
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
                url : context + "/organization/findAllSubOrganizationByParId",
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
            }
        };


        //点击编辑按钮
        $(document).on("click" , "#search", function(e){
            initTable();
        });
        //点击新增按钮
        $(document).on("click" , "#add", function(e){
            addBtnClick();
        });

        //点击编辑按钮
        $(document).on("click" , "#edit", function(e){
            editBtnClick();
        });

        //点击重置密码
        $(document).on("click" , "#resetPassword", function(e){
            resetPasswordBtnClick();
        });

        //点击删除按钮
        $(document).on("click" , "#delete", function(e){
            deleteBtnClick();
        });

        $(document).on("click" , "#reset", function(e){
            location.reload();
        })

        $(document).on("click" , ".lookUserDetail", function(e){
            var id = $(this).attr("valId")
            lookUserDetailBtnClick(id);
        })

        //点击启用按钮
        $(document).on("click" , "#enableBtn", function(e){
            enableBtnBtnClick();
        });

        //点击停用按钮
        $(document).on("click" , "#disableBtn", function(e){
            disableBtnBtnBtnClick();
        });

        $(document).on('keyup change', '#selectTree', function () {
            var key = $(this).val();
            searchNode(key, "ztree-demo") ;
        });

        init();
    })

    function init(){
        reloadTree();
        initTable();
        $.ajax({
            url: context+"/account/findDictionary",
            type: 'POST',
            dataType:"json",
            success:function(map){
                $.select2.addByList("#status",map.status,"code","name",true,true);
            }
        });
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
        organizationName = treeNode.name;
        initTable();
    };

    function zTreeDblClick(event, treeId, treeNode) {
        var str = $(".curSelectedNode").attr("class");
        str = str.substring(0,str.indexOf("curSelectedNode"));
        $(".curSelectedNode").attr("class",str);
        organization = null;
        organizationName = null;
        initTable();
    }

    function editBtnClick(){
        if(getIdList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"您未勾选,请勾选一项进行编辑!",title:"提示"});
            return false;
        }
        if(getIdList().length > 1){
            $.util.topWindow().$.layerAlert.alert({msg:"您选择的人员大于一项,请勾选一项进行编辑!",title:"提示"});
            return false;
        }
        var id = getIdList()[0];
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/editPerson',
            pageLoading: true,
            title: "编辑人员",
            width: "800px",
            height: "620px",
            btn: ["修改", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.editPerson;
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
                id :id
            },
            end: function () {
                initTable();
            }
        });
    }

    function disableBtnBtnBtnClick(){
        if(getIdList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"至少勾选一项进行停用!",title:"提示"});
            return false;
        }

        var data = {
            idList : getIdList()
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "idList", obj);
        $.ajax({
            url: context + "/account/disableAccount",
            data:obj,
            type: 'POST',
            dataType: "json",
            success: function (successData) {
                if (successData) {
                    $.util.topWindow().$.layerAlert.alert({
                        msg: "停用成功!", title: "提示", end: function () {
                            initTable();
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
        if(getIdList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"至少勾选一项进行启用!",title:"提示"});
            return false;
        }

        var data = {
            idList : getIdList()
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "idList", obj);
        $.ajax({
            url: context + "/account/enableAccount",
            data: obj,
            type: 'POST',
            dataType: "json",
            success: function (successData) {
                if (successData) {
                    $.util.topWindow().$.layerAlert.alert({
                        msg: "启用成功!", title: "提示", end: function () {
                            initTable();
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
                deleteUser();
            }
        });
    }

    function deleteUser(){

        var data = {
            idList : getIdList()
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "idList", obj);
        $.ajax({
            url:context +'/account/deleteUser',
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
     * 人员table
     */
    function initTable(){
        if(table != null) {
            table.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/account/findAccountByParameter";
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
                "title" : "用户名",
                "data" : "accountName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 2,
                "width" : "",
                "title" : "用户所属单位",
                "data" : "organizationName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :3,
                "width" : "",
                "title" : "生效时间",
                "data" : "startDateStr",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "失效时间",
                "data" : "endDateStr",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "状态",
                "data" : "status",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "备注",
                "data" : "intro",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "操作",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    return "<a class='lookUserDetail' valId='"+data+"'  href='###'>查看用户</a>";
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
                "organization": organization,
                "accountName" : $("#accountName").val(),
                startTimeLong:getstartTime(),
                endTimeLong : getEndTime(),
                "status": $.select2.val("#status"),
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

    function lookUserDetailBtnClick(id){
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/userDetail',
            pageLoading: true,
            title: "查看详情",
            width: "620px",
            height: "600px",
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
                id: id,
            },
            end: function () {
            }
        });
    }


    function addBtnClick(){

        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/addUser',
            pageLoading: true,
            title: "新增用户",
            width: "800px",
            height: "620px",
            btn: ["新增", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.addUser;
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
                organizationName:organizationName,
                organization:organization,
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
            $.util.topWindow().$.layerAlert.alert({msg:"您选择的用户大于一项,请勾选一项进行编辑!",title:"提示"});
            return false;
        }
        var id = getIdList()[0];
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/editUser',
            pageLoading: true,
            title: "编辑用户",
            width: "810px",
            height: "540px",
            btn: ["修改", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.editUser;
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
                userId:id
            },
            end: function () {
                initTable();
            }
        });
    }


    function resetPasswordBtnClick(){

        if(getIdList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"您未勾选,请勾选一项进行修改密码!",title:"提示"});
            return false;
        }
        if(getIdList().length > 1){
            $.util.topWindow().$.layerAlert.alert({msg:"您选择的用户大于一项,请勾选一项进行修改密码!",title:"提示"});
            return false;
        }
        var id = getIdList()[0];
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/systemManagement/resetPassword',
            pageLoading: true,
            title: "修改密码",
            width: "810px",
            height: "540px",
            btn: ["修改", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.resetPassword;
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
                userId:id
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


    function  getstartTime(){
        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        if(startDate){
            return new Date(startDate).getTime();
        }else{
            return 0;
        }
    }
    function  getEndTime(){
        var endDate = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end");
        if(endDate){
            endDate = $.date.endRange(endDate,"yyyy-MM-dd");
            return new Date(endDate).getTime();
        }else{
            return  new Date().getTime();
        }
    }

})(jQuery);


