
$.bjqb = $.bjqb || {} ;
$.bjqb.crowd = $.bjqb.crowd || {} ;
(function($){
    "use strict";
    var table = null;

    $(document).ready(function() {
        // if($.util.isBlank(crowdIds)){
        //     crowdIds = '3,4,5,8,17,19,58,60,62,66';
        // }
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

        initQueryCondition();
    });

    /**
     * 新建群体
     */
    $(document).on("click","#createCrowd",function(){
        resetCrowdIds();
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
     * 群体数据概况
     */
    $(document).on("click","#crowdDataSurvey",function(){
        location.href= context +"/show/page/web/crowd/crowdDataState.html";
    });

    /**
     * 导出群体档案
     */
    $(document).on("click","#exportCrowdArchives",function(){

    });

    /**
     * 根据条件导出Excel文件
     */
    $(document).on("click","#exportCrowdToExcel",function(){
        exportExcel();
    });
    /**
     *导出选中的群体
     */
    $(document).on("click","#exportCrowdToExcelByChickBoxBtn",function(){
        exportCrowdToExcelByChickBoxBtn();
    });

    /**
     * 查询
     */
    $(document).on("click","#query",function(){
        resetCrowdIds();
        initTable();
    });

    /**
     * 重置
     */
    $(document).on("click","#reset",function(){
        resetCrowdIds();
        $.laydate.reset("#dateRangeId_2");
        $.select2.val("#crowdNames","");
        $.select2.val("#crowdTypes","");
        $.select2.val("#kosekiS","");
        $("#infos").val("");
        $("#personScaleStart").val("");
        $("#personScaleEnd").val("");
        initTable();
    });

    /**
     * 重置 其他页面 跳转过来后 的群体ids
     *
     */
    function resetCrowdIds(){
        crowdIds = null;
    }

    /**
     * 导出excel
     */
    function exportExcel(){
        if(!$.util.isEmpty(crowdIds)){
            var arr = crowdIds.split(",");
            var queryUtilPojo = {"ids":arr};
            $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            var form = $.util.getHiddenForm(context+'/crowd/exportCrowdExcelByIds',queryUtilPojo);
        }else{

            var crowdQueryPojo=findInputValue();
            var form = $.util.getHiddenForm(context+'/crowd/exportCrowdExcel',crowdQueryPojo);
        }
        $.util.subForm(form);
    }

    /**
     * 导出选中的excel--勾选的内容
     */
    function exportCrowdToExcelByChickBoxBtn(){
        var arr = $.icheck.getChecked("signTr") ;
        var ids = [];
        var personCounts=[];//人员数量
        var permanentPopulationCounts=[];//常驻人口
        var transientPopulationCounts=[]; //暂住人口数
        var phoneCounts=[]; //有手机的人数
        var crowdTypes=[];//群体类型
        var crowdNames=[];//群体名称
        var recordTimeStrs=[];//群体名称
        if(arr.length > 0) {
            $.each(arr, function (i,val) {
                var tr = $(val).parents("tr");
                var row = table.row(tr);
                var data = row.data();
                ids.push(data.crowdId);
                personCounts.push(data.personCount);
                permanentPopulationCounts.push(data.permanentPopulationCount);
                transientPopulationCounts.push(data.transientPopulationCount);
                phoneCounts.push(data.phoneCount);
                crowdTypes.push(data.crowdType);
                crowdNames.push(data.crowdName);
                recordTimeStrs.push(data.recordTimeStr);
            });
        }else {
            $.layerAlert.alert({msg:"请选择一个群体！"}) ;
            return false ;
        }
        var crowdExportByCheckBoxPojo = {
            "ids" : ids,
            "personCounts" : personCounts,
            "permanentPopulationCounts" : permanentPopulationCounts,
            "transientPopulationCounts" : transientPopulationCounts,
            "phoneCounts" : phoneCounts,
            "crowdTypes" : crowdTypes,
            "crowdNames" : crowdNames,
            "recordTimeStrs" : recordTimeStrs,

        };
        var form = $.util.getHiddenForm(context+'/crowd/exportCrowdExcelByCheckBox',crowdExportByCheckBoxPojo);
        $.util.subForm(form);
    }

    function findInputValue(){
        var crowdNames = $.select2.val("#crowdNames");
        var crowdTypes = $.select2.val("#crowdTypes");
        var kosekis = $.select2.val("#kosekiS");
        var infos = $("#infos").val();
        if(infos == '输入人员姓名或身份证号码或手机号码，可输入多个，逗号隔开'){
            infos = "";
        }
        var arr = infos.split(",");
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        var phoneNumberReg = /^1[34578]\d{9}$/;
        var idNumberReg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
        var idNumber = "";
        var personName = "";
        var phoneNumber = "";
        var personScaleStart = $("#personScaleStart").val();
        var personScaleEnd = $("#personScaleEnd").val();
        var startTime = $.laydate.getDate("#dateRangeId_2","start") == null ? null : $.laydate.getDate("#dateRangeId_2","start")+" 00:00:00";
        var endTime = $.laydate.getDate("#dateRangeId_2","end") == null ? null : $.laydate.getDate("#dateRangeId_2","end")+" 23:59:59";
        var flag = false;
        $.each(arr,function(index,val){
            if(reg.test(val)){
                personName = val;
            }else if(phoneNumberReg.test(val)){
                phoneNumber = val;
            }else if(idNumberReg.test(val)){
                idNumber = val;
            }
            return
        })
        if(!$.util.isEmpty(infos)){
            flag = true;
        }
        var obj = {"crowdNames":crowdNames,
            "crowdTypes":crowdTypes,
            "kosekiS":kosekis,
            "idNumber":idNumber,
            "personName":personName,
            "phoneNumber":phoneNumber,
            "personScaleEnd":personScaleEnd,
            "personScaleStart":personScaleStart,
            "startTime":startTime,
            "endTime":endTime,
            "flag":flag
        };
        return obj;
    }


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
            msg:"删除后，只删除群体本身信息以及群体和人的关联关系，不能删除人员的信息，确定要删除吗？",
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
                    url:context + '/crowdManage/deleteCrowdByIds',
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
                // $.select2.val("#crowdTypes","qtlx0002");
                // crowdTypesClose();
                $.select2.empty("#kosekiS");
                $.select2.addByList("#kosekiS", data.citys,"id", "name", true, true);
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


    function initTable(){
        if(table != null){
            table.destroy();
        }
        if(!$.util.isEmpty(crowdIds)){
            var url = context +"/crowdManage/queryCrowdByIds";
        }else{
            var url = context +"/crowdManage/queryCrowd";
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = url;
        tb.columnDefs = [
            {
                "targets": 0,
                "width" : "100px",
                // "title": "<button id=\"selectAllBtn\" class=\"btn btn-primary btn-sm\" >全选/取消</button>",
                "title": "<input type=\"checkbox\"  class=\"icheckbox\" id=\"selectAllBtn\" />&nbsp;&nbsp;全选/取消",
                "className":"table-checkbox",
                "data": "crowdId" ,
                "render": function ( data, type, full, meta ) {
                    var a = '<input type="checkbox" name="signTr" class="icheckbox rowCheckBoxClass"  />' ;
                    return a;
                }
            },
            {
                "targets" : 1,
                "width" : "",
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
                    return  '<h2 class="m-ui-infott xiaoshou type ">' + data + '</h2>';
                    // return  data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "群体名称",
                "data" : "crowdName",
                "render" : function(data, type, full, meta) {
                    return  '<h2 class="m-ui-infott xiaoshou aa ">' + data + '</h2>';
                    // return  "<a cclass='xiaoshou aa' href='javascript:void(0);'>"+data+"</a>";
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "人员数量",
                "data" : "personCount",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "常住人口",
                "data" : "permanentPopulationCount",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "暂住人口",
                "data" : "transientPopulationCount",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "有手机号码数量",
                "data" : "phoneCount",
                "render" : function(data, type, full, meta) {

                    return $.util.isEmpty(data) ? 0 : data;
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "重点上访人员",
                "data" : "keyPersonPetitioningNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 9,
                "width" : "",
                "title" : "国家信访局上访人员",
                "data" : "petitionLetterNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 10,
                "width" : "",
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
                var crowdNames = $.select2.val("#crowdNames");
                var crowdTypes = $.select2.val("#crowdTypes");
                var kosekis = $.select2.val("#kosekiS");
                var infos = $("#infos").val();
                if(infos == '输入人员姓名或身份证号码或手机号码，可输入多个，逗号隔开'){
                    infos = "";
                }
                var arr = infos.split(",");
                var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
                var phoneNumberReg = /^1[34578]\d{9}$/;
                var idNumberReg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
                var idNumber = "";
                var personName = "";
                var phoneNumber = "";
                var personScaleStart = $("#personScaleStart").val();
                var personScaleEnd = $("#personScaleEnd").val();
                var startTime = $.laydate.getDate("#dateRangeId_2","start") == null ? null : $.laydate.getDate("#dateRangeId_2","start")+" 00:00:00";
                var endTime = $.laydate.getDate("#dateRangeId_2","end") == null ? null : $.laydate.getDate("#dateRangeId_2","end")+" 23:59:59";
                var flag = false;
                $.each(arr,function(index,val){
                    if(reg.test(val)){
                        personName = val;
                    }else if(phoneNumberReg.test(val)){
                        phoneNumber = val;
                    }else if(idNumberReg.test(val)){
                        idNumber = val;
                    }
                    return
                })
                if(!$.util.isEmpty(infos)){
                    flag = true;
                }
                var obj = {"crowdNames":crowdNames,
                    "crowdTypes":crowdTypes,
                    "kosekiS":kosekis,
                    "idNumber":idNumber,
                    "personName":personName,
                    "phoneNumber":phoneNumber,
                    "personScaleEnd":personScaleEnd,
                    "personScaleStart":personScaleStart,
                    "startTime":startTime,
                    "endTime":endTime,
                    "flag":flag
                };
                $.util.objToStrutsFormData(obj, "crowdQueryPojo", d);
            }
        };
        tb.paramsResp = function(json) {
            json.data = json.crowd;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
            $("#totalNumber").text(json.totalNum);
            // $('.icheckbox_square-green').removeClass("checked");
        };
        tb.drawCallback= function (settings, data) {
            $.icheck.check("#selectAllBtn", false);
        },
        table = $("#carTable").DataTable(tb);
    }

    /**
     * 群组名称点击事件
     */
    $(document).on("click",".aa",function(){
        var tr = $(this).parents("tr");
        var row = table.row(tr);
        $("#crowdId").val(row.data().crowdId);
        $("#queryCrowdInfo").attr("action",context + "/show/page/web/crowd/viewCrowdDetail");
        $("#queryCrowdInfo").submit();
        // location.href = context + "/show/page/web/crowd/viewCrowdDetail";
    });

    /**
     * 群组类型名称点击事件
     */
    $(document).on("click",".type",function(){
        var tr = $(this).parents("tr");
        var row = table.row(tr);
        $("#crowdTypeCode").val(row.data().type);
        $("#queryCrowdInfo").attr("action",context + "/show/page/web/crowd/crowdTypeDetail");
        $("#queryCrowdInfo").submit();
    });

    //变成小手事件
    $(document).on('mouseover', '.xiaoshou', function() {
        $(".xiaoshou").css("cursor","pointer");
    });


    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.bjqb.crowd, {

    });

})(jQuery);