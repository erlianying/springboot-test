(function($){
    "use strict";
    var shoppingTable = null;
    var idNumber;
    //网上购物
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
        initShoppingInfoLstTable();
    }

    function queryClick(){
        shoppingInfoLstTable();
    }

    //网上购物
    function shoppingInfoLstTable(){
        if(shoppingTable != null) {
            shoppingTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findShopping',
            tb.columnDefs = [
                {
                    "targets" :0,
                    "width" : "12%",
                    "title" : "寄件人姓名",
                    "data" : "sendPersonName",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" :1,
                    "width" : "12%",
                    "title" : "寄件人电话",
                    "data" : "sendPersonPhone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 2,
                    "width" : "12%",
                    "title" : "寄件时间",
                    "data" : "sendTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 3,
                    "width" : "12%",
                    "title" : "寄件地址",
                    "data" : "sendPersonAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 4,
                    "width" : "12%",
                    "title" : "收件人姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :5,
                    "width" : "12%",
                    "title" : "收件人电话",
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :6,
                    "width" : "16%",
                    "title" : "收件人地址",
                    "data" : "receiveAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :7,
                    "width" : "12%",
                    "title" : "数据来源",
                    "data" : "",
                    "render" : function(data, type, full, meta) {
                        return "";
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
        tb.lengthMenu = [3]; //每页条数
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
        shoppingTable = $("#shopping").DataTable(tb);
    }

    //网上购物
    function initShoppingInfoLstTable(){
        if(shoppingTable != null) {
            shoppingTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findShoppingByIds',
            tb.columnDefs = [
                {
                    "targets" :0,
                    "width" : "20%",
                    "title" : "寄件人姓名",
                    "data" : "sendPersonName",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" :1,
                    "width" : "20%",
                    "title" : "寄件人电话",
                    "data" : "sendPersonPhone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 2,
                    "width" : "20%",
                    "title" : "寄件时间",
                    "data" : "sendTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 3,
                    "width" : "20%",
                    "title" : "寄件地址",
                    "data" : "sendPersonAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 4,
                    "width" : "20%",
                    "title" : "收件人姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :5,
                    "width" : "20%",
                    "title" : "收件人电话",
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :6,
                    "width" : "20%",
                    "title" : "收件人地址",
                    "data" : "receiveAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :7,
                    "width" : "20%",
                    "title" : "数据来源",
                    "data" : "",
                    "render" : function(data, type, full, meta) {
                        return "";
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
        tb.lengthMenu = [3]; //每页条数
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
        shoppingTable = $("#shopping").DataTable(tb);
    }

})(jQuery);