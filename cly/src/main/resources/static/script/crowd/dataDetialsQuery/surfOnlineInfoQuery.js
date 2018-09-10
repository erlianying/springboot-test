(function($){
    "use strict";
    var netbarTable = null;
    var idNumber;

    //上网信息
    $(document).ready(function(){
        $(document).on("click" , "#queryBtn", function(e){
            startTime = $.bjqb.getTimeJs.getStartTime();
            endTime = $.bjqb.getTimeJs.getEndTime();
            queryClick();
        });
        $(document).on("click", "#resetBtn", function (e) {
            $.laydate.reset("#dateRangeId")
            $("#name").val(null);
            $("#idNumber").val(null);
        });
        init();
    });

    function init(){
        initNetbarInfoLstTable();
    }

    function queryClick(){
        netbarInfoLstTable();
    }

    //上网信息
    function netbarInfoLstTable(){
        if(netbarTable != null) {
            netbarTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findNetbar',
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
                },
                {
                    "targets" : 2,
                    "width" : "12%",
                    "title" : "网吧名称",
                    "data" : "netbarName",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 3,
                    "width" : "16%",
                    "title" : "网吧地址",
                    "data" : "netbarAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 4,
                    "width" : "12%",
                    "title" : "所属分局",
                    "data" : "subBureau",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 5,
                    "width" : "12%",
                    "title" : "座位号",
                    "data" : "seatNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 6,
                    "width" : "12%",
                    "title" : "上机时间",
                    "data" : "startTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd');
                    }
                },{
                    "targets" : 7,
                    "width" : "12%",
                    "title" : "下机时间",
                    "data" : "endTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd');
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
        netbarTable = $("#netbar").DataTable(tb);
    }

    //上网信息
    function initNetbarInfoLstTable(){
        if(netbarTable != null) {
            netbarTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findNetbarByIds',
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
                },
                {
                    "targets" : 2,
                    "width" : "12%",
                    "title" : "网吧名称",
                    "data" : "netbarName",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 3,
                    "width" : "16%",
                    "title" : "网吧地址",
                    "data" : "netbarAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 4,
                    "width" : "12%",
                    "title" : "所属分局",
                    "data" : "subBureau",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 5,
                    "width" : "12%",
                    "title" : "座位号",
                    "data" : "seatNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 6,
                    "width" : "12%",
                    "title" : "上机时间",
                    "data" : "startTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },{
                    "targets" : 7,
                    "width" : "12%",
                    "title" : "下机时间",
                    "data" : "endTime",
                    "render" : function(data, type, full, meta) {
                        if(data){
                            return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                        }
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
        netbarTable = $("#netbar").DataTable(tb);
    }

})(jQuery);