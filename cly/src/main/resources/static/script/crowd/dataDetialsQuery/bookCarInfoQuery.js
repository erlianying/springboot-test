(function($){
    "use strict";
    var bookcarTable = null;
    var idNumber;
    //约车数据
    $(document).ready(function(){
        $(document).on("click" , "#queryBtn", function(e){
            startTime = $.bjqb.getTimeJs.getStartTime();
            endTime = $.bjqb.getTimeJs.getEndTime();
            queryClick();
        });
        $(document).on("click" , "#resetBtn", function(e){
            $.laydate.reset("#dateRangeId")
            $("#name").val("");
            $("#phone").val("");
        });
        init();
    });

    function init(){
        initbookcarInfoLstTable();
    }

    function queryClick(){
        bookcarInfoLstTable();
    }

    //约车数据
    function bookcarInfoLstTable(){
        if(bookcarTable != null) {
            bookcarTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findBookcar',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "11%",
                    "title" : "约车人姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 1,
                    "width" : "11%",
                    "title" : "身份证号",
                    "data" : "idcard",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 2,
                    "width" : "11%",
                    "title" : "联系电话",
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 3,
                    "width" : "11%",
                    "title" : "发车时间",
                    "data" : "startTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 4,
                    "width" : "11%",
                    "title" : '下车时间',
                    "data" : "endTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 5,
                    "width" : "11%",
                    "title" : "出发地",
                    "data" : "startAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :6,
                    "width" : "11%",
                    "title" : "目的地",
                    "data" : "endAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :7,
                    "width" : "11%",
                    "title" : "数据来源",
                    "data" : "source",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :8,
                    "width" : "11%",
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
        //是否显示loading效果
        tb.bProcessing = true;
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 3 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "tag": 1,
                "name":$("#name").val(),
                "phone":$("#phone").val(),
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
        bookcarTable = $("#bookcar").DataTable(tb);
    }

    function  initBookcarInfoLstTable(){
        if(bookcarTable != null) {
            bookcarTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findBookcarByIds',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "11%",
                    "title" : "约车人姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 1,
                    "width" : "11%",
                    "title" : "身份证号",
                    "data" : "idcard",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 2,
                    "width" : "11%",
                    "title" : "联系电话",
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 3,
                    "width" : "11%",
                    "title" : "发车时间",
                    "data" : "startTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 4,
                    "width" : "11%",
                    "title" : '下车时间',
                    "data" : "endTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 5,
                    "width" : "11%",
                    "title" : "出发地",
                    "data" : "startAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :6,
                    "width" : "11%",
                    "title" : "目的地",
                    "data" : "endAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :7,
                    "width" : "11%",
                    "title" : "数据来源",
                    "data" : "source",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" :8,
                    "width" : "11%",
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
        tb.dom = null;
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        //是否显示loading效果
        tb.bProcessing = true;
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 3 ]; //每页条数
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
        bookcarTable = $("#bookcar").DataTable(tb);
    }




})(jQuery);