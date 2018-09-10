$.bjqb = $.bjqb || {} ;
$.bjqb.whiteListManageTable = $.bjqb.whiteListManageTable || {} ;
(function($){
    "use strict";

    var table = null;

    $(document).ready(function (){
        initPageDatas();
        initTable();
    });

    //非高级查询中的查询按钮
    $(document).on("click","#briefQuery",function(){
        var infos = $("#infos").val();
        var arr = infos.split(",");
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        var idNumberReg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
        $.each(arr,function(index,val){
            if(reg.test(val)){
                $("#personName").val(val);
            }else if(idNumberReg.test(val)){
                $("#idnumber").val(val);
            }
            return
        })
        table.draw();
    })

    //高级查询
    $(document).on("click","#advancedQuery",function(){
        table.draw();
    })
    //重置
    $(document).on("click","#reset",function(){
        $("#infos").val("");
        $("#personName").val("");
        $("#idnumber").val("");
        $.select2.val("#crowdType","");
        $.select2.empty("#crowdName");
        $.select2.val("#city","");
        $.select2.val("#sex","");
        $.select2.empty("#personnelSubclassOne");
        $.select2.empty("#personnelSubclassTwo");
        $.select2.empty("#personnelSubclassThree");
        $.select2.empty("#personnelSubclassFour");
        table.draw();
    })
    //从白名单删除
    $(document).on("click","#deleteWhite",function(){
        var arr = $.icheck.getChecked("signTr") ;
        if(arr.length > 0) {
            var crowdIds = [];
            $.each(arr, function (i,val) {
                var tr = $(val).parents("tr");
                var row = table.row(tr);
                var data = row.data();
                crowdIds.push(data.id);
            });
            $.util.topWindow().$.layerAlert.confirm({
                msg:"确定要从白名单中删除吗？",
                title:"删除",	  //弹出框标题
                width:'300px',
                hight:'200px',
                shade: [0.5,'black'],  //遮罩
                icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
                shift:1,  //弹出时的动画效果  有0-6种
                yes:function(index, layero){
                    //点击确定按钮后执行
                    var cpp = {
                        "ids" : crowdIds
                    };
                    var obj = {};
                    $.util.objToStrutsFormData(cpp, "cpp", obj);
                    $.ajax({
                        url:context + '/personMessageManage/removeWhiteList',
                        data:obj,
                        type:"post",
                        dataType:"json",
                        customizedOpt:{
                            ajaxLoading:true,//设置是否loading
                        },
                        success:function(successData){
                            if(successData.status){
                                $.util.topWindow().$.layerAlert.alert({icon:6, msg:"删除成功。"}) ;
                                table.draw();
                            }else{
                                $.util.topWindow().$.layerAlert.alert({icon:5, msg:"删除失败。"}) ;
                            }
                        }
                    });
                }
            });
        }else {
            $.layerAlert.alert({msg:"请选择人员进行操作！"}) ;
            return false ;
        }

    })

    /**
     * 群体类型选中事件
     */
    $("#crowdType").on("select2:close", function() {
        var arr = {"crowdTypes":$.select2.val("#crowdType")};
        if(arr.crowdTypes != null){
            var obj = new Object();
            $.util.objToStrutsFormData(arr, "crowdQueryPojo", obj);
            $.ajax({
                url: context +"/crowdManage/queryCrowdNames",
                type: "POST",
                global: false,
                data: obj,
                success: function (data) {
                    $.select2.empty("#crowdName");
                    $.select2.addByList("#crowdName", data.crowdNames,"id", "name");
                    $.select2.val("#crowdName","");
                }
            });
        }else{
            $.select2.empty("#crowdName");
        }
    });

    /**
     * 群体名称选中事件
     */
    $("#crowdName").on("select2:close", function() {
            $.ajax({
                url: context +"/personMessageManage/findPersonTypeByParentId",
                type: "POST",
                global: true,
                data: {
                    "parentId":$.select2.val("#crowdName")
                },
                success: function (data) {
                    $.select2.empty("#personnelSubclassOne");
                    $.select2.empty("#personnelSubclassTwo");
                    $.select2.empty("#personnelSubclassThree");
                    $.select2.empty("#personnelSubclassFour");
                    $.select2.addByList("#personnelSubclassOne", data.personTypes,"id", "name");
                    $.select2.val("#personnelSubclassOne","");
                }
            });
    });

    /**
     * 细类一事件
     */
    $("#personnelSubclassOne").on("select2:close", function() {
            $.ajax({
                url: context +"/personMessageManage/findPersonTypeByParentId",
                type: "POST",
                global: true,
                data: {
                    "parentId":$.select2.val("#personnelSubclassOne")
                },
                success: function (data) {
                    $.select2.empty("#personnelSubclassTwo");
                    $.select2.empty("#personnelSubclassThree");
                    $.select2.empty("#personnelSubclassFour");
                    $.select2.addByList("#personnelSubclassTwo", data.personTypes,"id", "name");
                    $.select2.val("#personnelSubclassTwo","");
                }
            });
    });

    /**
     * 细类二事件
     */
    $("#personnelSubclassTwo").on("select2:close", function() {
            $.ajax({
                url: context +"/personMessageManage/findPersonTypeByParentId",
                type: "POST",
                global: true,
                data: {
                    "parentId":$.select2.val("#personnelSubclassTwo")
                },
                success: function (data) {
                    $.select2.empty("#personnelSubclassThree");
                    $.select2.empty("#personnelSubclassFour");
                    $.select2.addByList("#personnelSubclassThree", data.personTypes,"id", "name");
                    $.select2.val("#personnelSubclassThree","");
                }
            });
    });

    /**
     * 细类三事件
     */
    $("#personnelSubclassThree").on("select2:close", function() {
            $.ajax({
                url: context +"/personMessageManage/findPersonTypeByParentId",
                type: "POST",
                global: true,
                data: {
                    "parentId":$.select2.val("#personnelSubclassThree")
                },
                success: function (data) {
                    $.select2.empty("#personnelSubclassFour");
                    $.select2.addByList("#personnelSubclassFour", data.personTypes,"id", "name");
                    $.select2.val("#personnelSubclassFour","");
                }
            });
    });



    /**
     * 初始化页面字典项
     */
    function initPageDatas(){
        $.ajax({
            url: context + "/personMessageManage/queryCrowdType",
            type: "POST",
            global: false,
            success: function (data) {
                $.select2.empty("#crowdType");
                $.select2.empty("#city");
                $.select2.empty("#sex");
                $.select2.addByList("#crowdType", data.types,"id", "name");
                $.select2.addByList("#city", data.citys,"id", "name");
                $.select2.addByList("#sex", data.sexs,"id", "name");
                $.select2.val("#crowdType","");
                $.select2.val("#city","");
                $.select2.val("#sex","");
            }
        });
    }

    function initTable(){
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personMessageManage/findWhiteListPager";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "50px",
                "title": "选择",
                "className":"table-checkbox",
                "data": "id" ,
                "render": function ( data, type, full, meta ) {
                    var a = '<input type="checkbox" name="signTr" class="icheckbox"  />' ;
                    return a;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "人员姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "身份证号码",
                "data" : "idnumber",
                "render" : function(data, type, full, meta) {
                    return  data
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "所属群体",
                "data" : "crowdName",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "群体类型",
                "data" : "type",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "人员细类1",
                "data" : "personnelSubclassOne",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "人员细类2",
                "data" : "personnelSubclasstwo",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "人员细类3",
                "data" : "personnelSubclassthree",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            }
            ,
            {
                "targets" : 8,
                "width" : "",
                "title" : "人员细类4",
                "data" : "personnelSubclassfour",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            }
            ,
            {
                "targets" : 9,
                "width" : "",
                "title" : "加入白名单时间",
                "data" : "joinWhiteListTimeStr",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 10,
                "width" : "",
                "title" : "操作人",
                "data" : "operationPeople",
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
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var flag = false;
            if(!$.util.isEmpty($.select2.val("#city")) || !$.util.isEmpty($.select2.val("#crowdType"))
            || !$.util.isEmpty($.select2.val("#crowdName")) || !$.util.isEmpty($.select2.val("#personnelSubclassOne"))){
                flag = true;
            }
            var obj = {"name":$("#personName").val(),
                "crowdName":$.select2.val("#crowdName"),
                "type":$.select2.val("#crowdType"),
                "idnumber":$("#idnumber").val(),
                "city":$.select2.val("#city"),
                "sex":$.select2.val("#sex"),
                "personnelSubclassOne":$.select2.val("#personnelSubclassOne"),
                "personnelSubclassTwo":$.select2.val("#personnelSubclassTwo"),
                "personnelSubclassThree":$.select2.val("#personnelSubclassThree"),
                "personnelSubclassFour":$.select2.val("#personnelSubclassFour"),
                "flag" : flag
            };
            $.util.objToStrutsFormData(obj, "whiteListPojo", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.whiteListPojo;
            json.recordsFiltered = json.totalNumber;
            json.recordsTotal = json.totalNumber;
        };
        table = $("#example1").DataTable(tb);
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.bjqb.whiteListManageTable, {

    });
})(jQuery);