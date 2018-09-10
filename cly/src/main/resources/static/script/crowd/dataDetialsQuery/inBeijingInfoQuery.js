(function($){
    "use strict";
    var checkTable = null;
    var idNumber;
    //在京核录信息
    $(document).ready(function(){
        $(document).on("click" , "#queryBtn", function(e){
            startTime = $.bjqb.getTimeJs.getStartTime();
            endTime = $.bjqb.getTimeJs.getEndTime();
            queryClick();
        });
        $(document).on("click" , "#resetBtn", function(e){
            $.laydate.reset("#dateRangeId")
            $("#name").val(null);
            $("#idNumber").val(null);
        });
        init();
    });

    function init(){
        initCreateCheckTable();
    }

    function queryClick(){
        createCheckTable();
    }

    //在京核录
    function createCheckTable(){
        if(checkTable != null) {
            checkTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findCheck',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "12%",
                    "title" : "姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data ;
                    }
                },
                {
                    "targets" : 1,
                    "width" : "12%",
                    "title" : '身份证号',
                    "data" : "idcard",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 2,
                    "width" : "12%",
                    "title" : '核录时间',
                    "data" : "checkTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd');
                    }
                },{
                    "targets" : 3,
                    "width" : "12%",
                    "title" : '核录区域',
                    "data" : "inspectArea",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 4,
                    "width" : '16%',
                    "title" : '核录地址',
                    "data" : "address",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 5,
                    "width" : '12%',
                    "title" : '核录结论',
                    "data" : "condition",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 6,
                    "width" : '12%',
                    "title" : '核录分局',
                    "data" : "subBureau",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 7,
                    "width" : '12%',
                    "title" : '核录派出所',
                    "data" : "policeStation",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                }
            ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        //是否显示loading效果
        tb.bProcessing = true;
        tb.lengthMenu = [ 10 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "name" : $("#name").val(),
                "idNumber":$("#idNumber").val(),
                "startTime":startTime,
                "endTime":endTime,
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        checkTable =  $("#check").DataTable(tb);

    }

    //在京核录
    function initCreateCheckTable(){
        if(checkTable != null) {
            checkTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findCheckByIds',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "12%",
                    "title" : "姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data ;
                    }
                },
                {
                    "targets" : 1,
                    "width" : "12%",
                    "title" : '身份证号',
                    "data" : "idcard",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 2,
                    "width" : "12%",
                    "title" : '核录时间',
                    "data" : "checkTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd');
                    }
                },{
                    "targets" : 3,
                    "width" : "12%",
                    "title" : '核录区域',
                    "data" : "inspectArea",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 4,
                    "width" : '16%',
                    "title" : '核录地址',
                    "data" : "address",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 5,
                    "width" : '12%',
                    "title" : '核录结论',
                    "data" : "condition",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 6,
                    "width" : '12%',
                    "title" : '核录分局',
                    "data" : "subBureau",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 7,
                    "width" : '12%',
                    "title" : '核录派出所',
                    "data" : "policeStation",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                }
            ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        //是否显示loading效果
        tb.bProcessing = true;
        tb.lengthMenu = [ 10 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "crowdNameCode":crowdNameCode,
                "startTime":startTime,
                "endTime": endTime
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        checkTable =  $("#check").DataTable(tb);

    }

})(jQuery);