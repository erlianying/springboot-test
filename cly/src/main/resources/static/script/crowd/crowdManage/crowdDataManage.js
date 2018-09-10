
$.bjqb = $.bjqb || {} ;
$.bjqb.crowd = $.bjqb.crowd || {} ;
(function($){
    "use strict";
    var table = null;
    var fullQuery = false;

    $(document).ready(function() {

        $(document).on("click","#exportExcel",function(){
            exportExcel();
        })

        /**
         * 全选按钮--选中
         */
        $(document).on("ifChecked","#selectAllBtn",function(){
            $.icheck.check(".rowCheckBoxClass", true);
            // selectAll();
        });
        /**
         * 全选按钮--取消选中
         */
        $(document).on("ifUnchecked","#selectAllBtn",function(){
            // selectAll();
            $.icheck.check(".rowCheckBoxClass", false);
        });

        $(document).on("click",".fullQuery",function(){
            if(fullQuery == true){
                fullQuery = false;
                $(".keyQueryObject").show();
            }else{
                fullQuery = true;
                $(".keyQueryObject").hide();
            }
        });

        initQueryCondition();
    });

    /**
     * 新建群体
     */
    $(document).on("click","#createCrowd",function(){
        alertCrowdEditPage();
    });

    /**
     * 修改群体
     */
    $(document).on("click","#updateCrowd",function(){
        var arr = $.icheck.getChecked("signTr") ;
        if(arr.length == 1) {
            var tr = $(arr[0]).parents("tr");
            var row = table.row(tr);
            var data = row.data();
            alertCrowdEditPage(data.crowdId);
        }else {
            $.layerAlert.alert({msg:"请选择一个群体！"}) ;
            return false ;
        }
    });
    $(document).on("dblclick","table tbody tr",function(){
        var row = table.row($(this));
        var data = row.data()
        alertCrowdEditPage(data.crowdId);
    });

    /**
     * 删除群体
     */
    $(document).on("click","#deleteCrowd",function(){
        var arr = $.icheck.getChecked("signTr") ;
        if(arr.length > 0) {
            var crowdIds = [];
            $.each(arr, function (i,val) {
                var tr = $(val).parents("tr");
                var row = table.row(tr);
                var data = row.data();
                crowdIds.push(data.crowdId);
            });
            deleteCrowdByIds(crowdIds);
        }else {
            $.layerAlert.alert({msg:"请选择一个群体！"}) ;
            return false ;
        }
    });

    /**
     * 查询
     */
    $(document).on("click","#query",function(){
        initTable();
    });

    /**
     * 重置
     */
    $(document).on("click","#reset",function(){
        $.laydate.reset("#dateRangeId_2");
        $.select2.val("#crowdNames","");
        $.select2.val("#crowdTypes","");
        initTable();
    });

    /**
     * 弹出修改页面
     *
     * @param crowdId 群体id
     */
    function alertCrowdEditPage(crowdId){
        var title = "修改群体信息";
        if($.util.isBlank(crowdId)){
            title = "新建群体";
        }

        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/crowd/addCrowdInfoLayer',
            pageLoading : true,
            title : title,
            width : "608px",
            height : "535px",
            btn:["保存","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.addCrowdInfoLayer ;
                    cm.saveCrowd();
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
                crowdId : crowdId
            },
            end:function(){
                initTable();
            }
        });
    }

    /**
     * 根据id删除群体
     *
     * @param ids id数组
     */
    function deleteCrowdByIds(ids){
        if(!$.util.exist(ids) || ids.length < 1){
            return ;
        }
        $.util.topWindow().$.layerAlert.confirm({
            msg:"确定要删除吗？",
            title:"删除",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            shift:1,  //弹出时的动画效果  有0-6种
            yes:function(index, layero){
                //点击确定按钮后执行
                var cpp = {
                    "ids" : ids
                };
                var obj = {};
                $.util.objToStrutsFormData(cpp, "cpp", obj);
                $.ajax({
                    url:context + '/crowdManage/judgeDeleteCrowdByIds',
                    data:obj,
                    type:"post",
                    dataType:"json",
                    customizedOpt:{
                        ajaxLoading:true,//设置是否loading
                    },
                    success:function(successData){
                        if(successData.status){
                            $.util.topWindow().$.layerAlert.alert({icon:6, msg:"删除成功。",yes:function(){
                                initTable();
                            }}) ;
                        }else{
                            if(successData.deleteCrowds.length > 0) {

                                var str="由于选择的群体关联了线索或人员等原因 , 以下群体不可删除 : ";
                                var remainCrowd = "<span style='color:red'>";
                                for(var crowd in successData.remainCrowds) {
                                    remainCrowd += successData.remainCrowds[crowd] + " , ";
                                }
                                remainCrowd = remainCrowd.substr(0,remainCrowd.lastIndexOf(",")) + "</span>";
                                str += remainCrowd + "<br/>";
                                str += "以下群体可以删除 : ";
                                var deleteCrowd = "<span style='color:green'>";
                                for(var crowd in successData.deleteCrowds) {
                                    deleteCrowd += successData.deleteCrowds[crowd] + " , ";
                                }
                                deleteCrowd = deleteCrowd.substr(0,deleteCrowd.lastIndexOf(",")) + "</span>";
                                str += deleteCrowd + "<br/>";
                                str += "确定要删除 " + deleteCrowd + " 吗？";
                                $.util.topWindow().$.layerAlert.confirm({
                                    msg:str,
                                    title:"删除",	  //弹出框标题
                                    width:'400px',
                                    hight:'200px',
                                    shade: [0.5,'black'],  //遮罩
                                    icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
                                    shift:1,  //弹出时的动画效果  有0-6种
                                    yes:function(index, layero){
                                        //点击确定按钮后执行
                                        var cpp = {
                                            "ids" : ids
                                        };
                                        var obj = {};
                                        $.util.objToStrutsFormData(cpp, "cpp", obj);
                                        $.ajax({
                                            url:context + '/crowdManage/deleteNoPersonOrClueCrowdByIds',
                                            data:obj,
                                            type:"post",
                                            dataType:"json",
                                            customizedOpt:{
                                                ajaxLoading:true,//设置是否loading
                                            },
                                            success:function(successData){
                                                if(successData.status){
                                                    $.util.topWindow().$.layerAlert.alert({icon:6, msg:"删除成功。",yes:function(){
                                                        initTable();
                                                    }}) ;
                                                }else{
                                                    $.util.topWindow().$.layerAlert.alert({icon:5, msg:"删除失败。"}) ;
                                                }
                                            }
                                        });
                                    }
                                });

                            } else {
                                $.util.topWindow().$.layerAlert.alert({icon:5, msg:"删除失败。原因可能为选择的群体关联了线索或人员。"}) ;
                            }
                        }
                    }
                });
            }
        });
    }

    /**
     * 初始化查询条件
     */
    function initQueryCondition(){
        $.ajax({
            url: context +"/crowdManage/initPageDictionary",
            type: "POST",
            dataType: "json",
            global: false,
            success: function (data) {
                $.select2.empty("#crowdTypes");
                $.select2.addByList("#crowdTypes", data.types,"id", "name", true, true);
                $.select2.addByList("#city", data.citys,"id","name",true,false);
                initTable();
            }
        });
    }


    /**
     * 群体类型选中事件
     */
    $("#crowdTypes").on("select2:close", function(e) {
        crowdTypesClose();
    });

    function crowdTypesClose(){
        var arr = {"crowdTypes":$.select2.val("#crowdTypes")};
        if(arr.crowdTypes != null){
            var obj = new Object();
            $.util.objToStrutsFormData(arr, "crowdQueryPojo", obj);
            $.ajax({
                url: context +"/crowdManage/queryCrowdNames",
                type: "POST",
                global: false,
                data: obj,
                success: function (data) {
                    $.select2.empty("#crowdNames");
                    $.select2.addByList("#crowdNames", data.crowdNames,"id", "name");
                }
            });
        }else{
            $.select2.empty("#crowdNames");
        }
    }

    $(document).on("click",".showUploadDialog",function(){
        var tranData = {
            downloadUrl : '/petitionRegistrationExportExcel/downloadPetitionModel?fileName=crowdImportModel.xlsx',
            uploadUrl : '/crowd/crowdBatchImport',
            win$ : $
        };
        showUploadDialog(tranData);
    });
    function showUploadDialog(tranData){
        window.top.$.layerAlert.dialog({
            content : context +  '/show/page/web/crowd/batchImportLayerForCrowd',
            pageLoading : true,
            title:"导入",
            width : "500px",
            height : "350px",
            shadeClose : false,
            initData:function(){
                return $.util.exist(tranData)?tranData:{} ;
            },
            success:function(layero, index){

            },
            end:function(){
            },
            btn:["导入", "取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                    var obj = cm.submitMethod(index);
                },
                btn2:function(index, layero){
                    window.top.layer.close(index);
                }
            }
        });
    }

    /**
     * 结果导出事件
     */
    function exportExcel(){
        var arr = $.icheck.getChecked("signTr") ;
        if(arr.length > 0) {
            var crowdIds = [];
            $.each(arr, function (i,val) {
                var tr = $(val).parents("tr");
                var row = table.row(tr);
                var data = row.data();
                crowdIds.push(data.crowdId);
            });
            var queryUtilPojo = {"ids":crowdIds};
            //$.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            var form = $.util.getHiddenForm(context+'/crowd/exportCrowdExcelByIdsForShort',queryUtilPojo);
        }else {
            var crowdQueryPojo=findInputValue();
            var form = $.util.getHiddenForm(context+'/crowd/exportCrowdExcelForShort',crowdQueryPojo);
        }
        $.util.subForm(form);
    }

    function findInputValue(){
        var flag = false;

        if (fullQuery) {
            var crowdNames = $.select2.val("#crowdNames");
            var crowdTypes = $.select2.val("#crowdTypes");
            var startTime = $.laydate.getDate("#dateRangeId_2","start") == null ? null : $.laydate.getDate("#dateRangeId_2","start")+" 00:00:00";
            var endTime = $.laydate.getDate("#dateRangeId_2","end") == null ? null : $.laydate.getDate("#dateRangeId_2","end")+" 23:59:59";
            var situation = $("#situation").val();
            var citys = $.select2.val("#city");

            var obj = {"crowdNames":crowdNames,
                "crowdTypes":crowdTypes,
                "startTime":startTime,
                "endTime":endTime,
                "flag":flag,
                "situation":situation,
                "citys":citys
            };
            return obj;
            //$.util.objToStrutsFormData(obj, "crowdQueryPojo", d);
        } else {
            var crowdNameStr = $("#crowdNameStr").val() == "群体名称"? null : $("#crowdNameStr").val();
            var obj = {"crowdNameStr":crowdNameStr,
                "flag":flag
            };
            return obj;
            //$.util.objToStrutsFormData(obj, "crowdQueryPojo", d);
        }
    }

    function initTable(){
        if(table != null){
            table.destroy();
        }
        var url = context +"/crowdManage/queryCrowdAll";

        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = url;
        tb.columnDefs = [
            {
                "targets": 0,
                "width" : "15px",
                "title": "<input type=\"checkbox\"  class=\"icheckbox\" id=\"selectAllBtn\" />",
                "className":"table-checkbox",
                "data": "crowdId" ,
                "render": function ( data, type, full, meta ) {
                    var a = '<input type="checkbox" name="signTr" class="icheckbox rowCheckBoxClass"  />' ;
                    return a;
                }
            },
            {
                "targets" : 1,
                "width" : "40px",
                "title" : "序号",
                "data" : "crowdId",
                "render" : function(data, type, full, meta) {

                    return meta.row+1;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "群体类型",
                "data" : "crowdType",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "群体名称",
                "data" : "crowdName",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "群体情况",
                "data" : "situation",
                "render" : function(data, type, full, meta) {
                    if(data == null) {
                        return "";
                    }
                    if(data.length > 20){
                        var str = '<div class="fi-ceng-out">' + data.substr(0,20) + '...' +
                            '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
            },
            {
                "targets" : 5,
                "width" : "100px",
                "title" : "省市",
                "data" : "city",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            // {
            //     "targets" : 6,
            //     "width" : "100px",
            //     "title" : "主责单位",
            //     "data" : "unit",
            //     "render" : function(data, type, full, meta) {
            //         return  data;
            //     }
            // },
            {
                "targets" : 6,
                "width" : "150px",
                "title" : "入库时间",
                "data" : "recordTimeStr",
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
        tb.lengthMenu = [ 10 ,20 , 50, 100];
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = true ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            if(!$.util.isEmpty(crowdIds)){
                var arr = crowdIds.split(",");
                var obj = {"ids":arr};
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }else{
                var flag = false;

                if (fullQuery) {
                    var crowdNames = $.select2.val("#crowdNames");
                    var crowdTypes = $.select2.val("#crowdTypes");
                    var startTime = $.laydate.getDate("#dateRangeId_2","start") == null ? null : $.laydate.getDate("#dateRangeId_2","start")+" 00:00:00";
                    var endTime = $.laydate.getDate("#dateRangeId_2","end") == null ? null : $.laydate.getDate("#dateRangeId_2","end")+" 23:59:59";
                    var situation = $("#situation").val();
                    var citys = $.select2.val("#city");

                    var obj = {"crowdNames":crowdNames,
                        "crowdTypes":crowdTypes,
                        "startTime":startTime,
                        "endTime":endTime,
                        "flag":flag,
                        "situation":situation,
                        "citys":citys
                    };
                    $.util.objToStrutsFormData(obj, "crowdQueryPojo", d);
                } else {
                    var crowdNameStr = $("#crowdNameStr").val() == "群体名称"? null : $("#crowdNameStr").val();
                    var obj = {"crowdNameStr":crowdNameStr,
                        "flag":flag
                    };
                    $.util.objToStrutsFormData(obj, "crowdQueryPojo", d);
                }
            }
        };
        tb.paramsResp = function(json) {
            json.data = json.crowd;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
            $("#totalNumber").text(json.totalNum);
        };
        tb.drawCallback= function (settings, data) {
        },
        table = $("#carTable").DataTable(tb);
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.bjqb.crowd, {

    });

})(jQuery);