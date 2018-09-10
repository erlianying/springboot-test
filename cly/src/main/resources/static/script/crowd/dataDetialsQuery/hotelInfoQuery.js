(function($){
    "use strict";
    var hotelTrackTable = null;
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
        initHotelInfoLstTable();
    }

    function queryClick(){
        hotelInfoLstTable();
    }

    //旅馆住宿信息
    function hotelInfoLstTable(){
        if(hotelTrackTable != null) {
            hotelTrackTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findHotelTrack',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "10%",
                    "title" : "姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 1,
                    "width" : "10%",
                    "title" : '身份证号',
                    "data" : "idcard",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 2,
                    "width" : "10%",
                    "title" : '联系电话',
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 3,
                    "width" : "10%",
                    "title" : '旅店名称',
                    "data" : "hotelName",
                    "render" : function(data, type, full, meta) {
                        return data ;
                    }
                },
                {
                    "targets" : 4,
                    "width" : '10%',
                    "title" : '旅店地址',
                    "data" : "hotelAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 5,
                    "width" : '10%',
                    "title" : '所辖分局',
                    "data" : "policeUnit",
                    "render" : function(data, type, full, meta) {
                        return "";
                    }
                },{
                    "targets" : 6,
                    "width" : '10%',
                    "title" : '所辖派出所',
                    "data" : "policeStation",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 7,
                    "width" : '10%',
                    "title" : '入住房间号',
                    "data" : "roomNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 8,
                    "width" : '10%',
                    "title" : '入住时间',
                    "data" : "checkinTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 9,
                    "width" : '10%',
                    "title" : '离开时间',
                    "data" : "leaveTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
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
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        hotelTrackTable = $("#hotelTrack").DataTable(tb);
    }

    //旅馆住宿信息
    function initHotelInfoLstTable(){
        if(hotelTrackTable != null) {
            hotelTrackTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findHotelTrackByIds',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "10%",
                    "title" : "姓名",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 1,
                    "width" : "10%",
                    "title" : '身份证号',
                    "data" : "idcard",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 2,
                    "width" : "10%",
                    "title" : '联系电话',
                    "data" : "phone",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 3,
                    "width" : "10%",
                    "title" : '旅店名称',
                    "data" : "hotelName",
                    "render" : function(data, type, full, meta) {
                        return data ;
                    }
                },
                {
                    "targets" : 4,
                    "width" : '10%',
                    "title" : '旅店地址',
                    "data" : "hotelAddress",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 5,
                    "width" : '10%',
                    "title" : '所辖分局',
                    "data" : "policeUnit",
                    "render" : function(data, type, full, meta) {
                        return "";
                    }
                },{
                    "targets" : 6,
                    "width" : '10%',
                    "title" : '所辖派出所',
                    "data" : "policeStation",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 7,
                    "width" : '10%',
                    "title" : '入住房间号',
                    "data" : "roomNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 8,
                    "width" : '10%',
                    "title" : '入住时间',
                    "data" : "checkinTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                },
                {
                    "targets" : 9,
                    "width" : '10%',
                    "title" : '离开时间',
                    "data" : "leaveTime",
                    "render" : function(data, type, full, meta) {
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
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
        hotelTrackTable = $("#hotelTrack").DataTable(tb);
    }

})(jQuery);