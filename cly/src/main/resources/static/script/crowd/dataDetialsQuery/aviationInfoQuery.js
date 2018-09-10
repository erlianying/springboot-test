(function($){
    "use strict";
    var airplaneLocusTable = null;
    var ids = [];
    var idNumber;
    //飞机进京
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
        initAirplanetrackTable();
    }

    function queryClick(){
        airplanetrackTable();
    }

    /**
     * 初始化 飞机进京轨迹  table
     */
    function airplanetrackTable(){
        if(airplaneLocusTable != null) {
            airplaneLocusTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personDetialsManage/findAirlineTrack";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "12%",
                "title" : "订票人姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },{
                "targets" : 1,
                "width" : "12%",
                "title" : "订票身份证号",
                "data" : "idcard",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },{
                "targets" : 2,
                "width" : "12%",
                "title" : "订票时间",
                "data" : "orderTime",
                "render" : function(data, type, full, meta) {
                    if(data){
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                    return "";
                }
            },
            {
                "targets" :3,
                "width" : "16%",
                "title" : "航班信息/起始到达航站",
                "data" : "flightNumber",
                "render" : function(data, type, full, meta) {
                    var info = "<span class=\"fa fa-plane color-blue marr-10\"></span>";
                    if(!$.util.isEmpty(full.planeNumber)){
                        info +=  full.planeNumber + "<br>";
                    }
                    if(!$.util.isEmpty(full.startTerminal)){
                        info += full.startTerminal;
                    }
                    info += "--";
                    if(!$.util.isEmpty(full.arrivedTerminal)){
                        info += full.arrivedTerminal;
                    }
                    info += "<br>"
                    if(!$.util.isEmpty(full.startTimeStr)){
                        info += full.startTimeStr;
                    }
                    return info;
                }
            },
            {
                "targets" : 4,
                "width" : "12%",
                "title" : "起飞时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data){
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                    return "";
                }
            },
            {
                "targets" : 5,
                "width" : "12%",
                "title" : "到达时间",
                "data" : "arrivedTimeLong",
                "render" : function(data, type, full, meta) {

                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 6,
                "width" : "12%",
                "title" : "座位号",
                "data" : "seatNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "12%",
                "title" : "状态",
                "data" : "ticketStatus",
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
        tb.lengthMenu = [ 10 ];
        //默认搜索框
        tb.searching = false ;
        //是否显示loading效果
        tb.bProcessing = true;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var obj = {
                "name" : $("#name").val(),
                "idNumber":$("#idNumber").val(),
                "startTime":startTime,
                "endTime":endTime,
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.pageList;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;

        };
        airplaneLocusTable = $("#airplaneTable").DataTable(tb);
    }

    /**
     * 初始化 飞机进京轨迹  table
     */
    function initAirplanetrackTable(){
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personDetialsManage/findAirlineTrackByIds";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "12%",
                "title" : "订票人姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },{
                "targets" : 1,
                "width" : "12%",
                "title" : "订票身份证号",
                "data" : "idcard",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },{
                "targets" : 2,
                "width" : "12%",
                "title" : "订票时间",
                "data" : "orderTime",
                "render" : function(data, type, full, meta) {
                    if(data){
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                    return "";
                }
            },
            {
                "targets" :3,
                "width" : "16%",
                "title" : "航班信息/起始到达航站",
                "data" : "flightNumber",
                "render" : function(data, type, full, meta) {
                    var info = "<span class=\"fa fa-plane color-blue marr-10\"></span>";
                    if(!$.util.isEmpty(full.planeNumber)){
                        info +=  full.planeNumber + "<br>";
                    }
                    if(!$.util.isEmpty(full.startTerminal)){
                        info += full.startTerminal;
                    }
                    info += "--";
                    if(!$.util.isEmpty(full.arrivedTerminal)){
                        info += full.arrivedTerminal;
                    }
                    info += "<br>"
                    if(!$.util.isEmpty(full.startTimeStr)){
                        info += full.startTimeStr;
                    }
                    return info;
                }
            },
            {
                "targets" : 4,
                "width" : "12%",
                "title" : "起飞时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data){
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                    return "";
                }
            },
            {
                "targets" : 5,
                "width" : "12%",
                "title" : "到达时间",
                "data" : "arrivedTimeLong",
                "render" : function(data, type, full, meta) {

                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 6,
                "width" : "12%",
                "title" : "座位号",
                "data" : "seatNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "12%",
                "title" : "状态",
                "data" : "ticketStatus",
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
        tb.lengthMenu = [ 10 ];
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //是否显示loading效果
        tb.bProcessing = true;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var obj =  {
                "crowdNameCode":crowdNameCode,
                "startTime":startTime,
                "endTime": endTime
            }
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.pageList;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
        };
        airplaneLocusTable = $("#airplaneTable").DataTable(tb);
    }


})(jQuery);