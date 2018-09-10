(function($){
    "use strict";
    var gaElenctronicFenceTable = null;
    var idNumber;
    //电子围栏
    $(document).ready(function(){
        $(document).on("click" , "#queryBtn", function(e){
            startTime = $.bjqb.getTimeJs.getStartTime();
            endTime = $.bjqb.getTimeJs.getEndTime();
            queryClick();
        });
        $(document).on("click" , "#resetBtn", function(e){
            $.laydate.reset("#dateRangeId")
            $("#phone").val("");
        });
         init();
    });

    function init(){
        initGaElenctronicFenceInfoLstTable();
    }

    function queryClick(){
        gaElenctronicFenceInfoLstTable();
    }

    //电子围栏
    function gaElenctronicFenceInfoLstTable(){
        if(gaElenctronicFenceTable != null) {
            gaElenctronicFenceTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findGaElenctronicFence',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "25%",
                    "title" : "手机号码",
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data ;
                    }
                },{
                    "targets" : 1,
                    "width" : "25%",
                    "title" : "捕获时间",
                    "data" : "collectTime",
                    "render" : function(data, type, full, meta) {
                        return data +'<input type="hidden" name="id" value="'+full.id+'">';
                    }
                },
                {
                    "targets" : 2,
                    "width" : "25%",
                    "title" : '捕获地点',
                    "data" : "address",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 3,
                    "width" : "25%",
                    "title" : "经纬度",
                    "data" : "jwd",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                }
            ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        //是否显示loading效果
        tb.bProcessing = true;
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 3 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "tag": 1,
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
        gaElenctronicFenceTable = $("#gaElenctronicFence").DataTable(tb);
    }


    //电子围栏
    function initGaElenctronicFenceInfoLstTable(){
        if(gaElenctronicFenceTable != null) {
            gaElenctronicFenceTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findGaElenctronicFenceByIds',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "25%",
                    "title" : "手机号码",
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data ;
                    }
                },{
                    "targets" : 1,
                    "width" : "25%",
                    "title" : "捕获时间",
                    "data" : "collectTime",
                    "render" : function(data, type, full, meta) {
                        return data +'<input type="hidden" name="id" value="'+full.id+'">';
                    }
                },
                {
                    "targets" : 2,
                    "width" : "25%",
                    "title" : '捕获地点',
                    "data" : "address",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 3,
                    "width" : "25%",
                    "title" : "经纬度",
                    "data" : "jwd",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                }
            ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        //是否显示loading效果
        tb.bProcessing = true;
        tb.lengthChange = false; //是否可以改变每页显示条数
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
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        gaElenctronicFenceTable = $("#gaElenctronicFence").DataTable(tb);
    }

})(jQuery);