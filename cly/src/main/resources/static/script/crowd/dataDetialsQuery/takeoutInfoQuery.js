(function($){
    "use strict";
    var foodTable = null;
    var idNumber;
    //外卖数据
    $(document).ready(function(){
        $(document).on("click" , "#queryBtn", function(e){
            startTime = $.bjqb.getTimeJs.getStartTime();
            endTime = $.bjqb.getTimeJs.getEndTime();
            queryClick();
        });
        $(document).on("click" , "#resetBtn", function(e){
            $.laydate.reset("#dateRangeId")
            $("#name").val(null);
            $("#phone").val(null);
        });
        init();
    });

    function init(){
        initFoodInfoLstTable();
    }

    function queryClick(){
        foodInfoLstTable();
    }
    //外卖数据
    function foodInfoLstTable(){
        if(foodTable != null) {
            foodTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findFood',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "12%",
                    "title" : "收件人姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return  data;
                    }
                },{
                    "targets" : 1,
                    "width" : "12%",
                    "title" : '身份证号',
                    "data" : "address",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 3,
                    "width" : "12%",
                    "title" : '联系电话',
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 4,
                    "width" : "12%",
                    "title" : "订单时间",
                    "data" : "orderTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 5,
                    "width" : "16%",
                    "title" : '收件人地址',
                    "data" : "address",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :6,
                    "width" : "12%",
                    "title" : "数据来源",
                    "data" : "source",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :7,
                    "width" : "12%",
                    "title" : "用户ID",
                    "data" : "sourceUserId",
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
                "tag" : 1,
                "name":$("#name").val(),
                "phone":$("#phone").val(),
                "startTime":startTime,
                "endTime":endTime,
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
        foodTable = $("#food").DataTable(tb);
    }

    //外卖数据
    function initFoodInfoLstTable(){
        if(foodTable != null) {
            foodTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findFoodByIds',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "12%",
                    "title" : "收件人姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return  data;
                    }
                },{
                    "targets" : 1,
                    "width" : "12%",
                    "title" : '身份证号',
                    "data" : "address",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 3,
                    "width" : "12%",
                    "title" : '联系电话',
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 4,
                    "width" : "12%",
                    "title" : "订单时间",
                    "data" : "orderTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 5,
                    "width" : "16%",
                    "title" : '收件人地址',
                    "data" : "address",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :6,
                    "width" : "12%",
                    "title" : "数据来源",
                    "data" : "source",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :7,
                    "width" : "12%",
                    "title" : "用户ID",
                    "data" : "sourceUserId",
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
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        foodTable = $("#food").DataTable(tb);
    }


})(jQuery);