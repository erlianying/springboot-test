(function($){
    "use strict";
    var bikeTable = null;
    var idNumber;
    //共享单车
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
        initBikeInfoLstTable();
    }

    function queryClick(){
        bikeInfoLstTable();
    }

    //共享单车数据
    function bikeInfoLstTable(){
        if(bikeTable != null) {
            bikeTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findBike',
            tb.columnDefs = [
                {
                    "targets" :0,
                    "width" : "12%",
                    "title" : "骑行人姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" :1,
                    "width" : "12%",
                    "title" : "身份证号",
                    "data" : "idcard",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" :2,
                    "width" : "12%",
                    "title" : "手机号码",
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 3,
                    "width" : "12%",
                    "title" : "开始时间",
                    "data" : "startTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 4,
                    "width" : "14%",
                    "title" : "出发地经纬度",
                    "data" : "startAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :5,
                    "width" : "14%",
                    "title" : "目的地经纬度",
                    "data" : "endAddress",
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
        bikeTable = $("#bike").DataTable(tb);
    }

    //共享单车数据
    function initBikeInfoLstTable(){
        if(bikeTable != null) {
            bikeTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findBikeByIds',
            tb.columnDefs = [
                {
                    "targets" :0,
                    "width" : "12%",
                    "title" : "骑行人姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" :1,
                    "width" : "12%",
                    "title" : "身份证号",
                    "data" : "idcard",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" :2,
                    "width" : "12%",
                    "title" : "手机号码",
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 3,
                    "width" : "12%",
                    "title" : "开始时间",
                    "data" : "startTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 4,
                    "width" : "14%",
                    "title" : "出发地经纬度",
                    "data" : "startAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :5,
                    "width" : "14%",
                    "title" : "目的地经纬度",
                    "data" : "endAddress",
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
        bikeTable = $("#bike").DataTable(tb);
    }


})(jQuery);