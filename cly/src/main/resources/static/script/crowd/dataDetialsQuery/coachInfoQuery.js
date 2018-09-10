(function($){
    "use strict";
    var carLocusTable = null;

    var idNumber;
    //长途客车进京轨迹
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
        initBusTrackTable();
    }

    function queryClick(){
        busTrackTable();
    }

    /**
     * 初始化 长途客车进京轨迹  table
     */
    function busTrackTable(){
        if(carLocusTable != null) {
            carLocusTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personDetialsManage/findBusTrack";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "20%",
                "title": "订票人姓名",
                "data": "reserveName" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },{
                "targets": 1,
                "width": "20%",
                "title": "订票人身份证号",
                "data": "idcard" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },{
                "targets" : 2,
                "width" : "20%",
                "title" : "到达站",
                "data" : "arrivedStation",
                "render" : function(data, type, full, meta) {

                    return "<span class=\"fa fa-bus color-blue marr-10\"></span>" + $.util.isEmpty(data) ? "" : data;
                }
            },{
                "targets": 3,
                "width": "20%",
                "title": "采集时间",
                "data": "collectTime" ,
                "render": function ( data, type, full, meta ) {
                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 4,
                "width" : "20%",
                "title" : "采集地检查站名",
                "data" : "collectStation",
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
        carLocusTable = $("#busTable").DataTable(tb);
    }

    /**
     * 初始化 长途客车进京轨迹  table
     */
    function initBusTrackTable(){
        if(carLocusTable != null) {
            carLocusTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personDetialsManage/findBusTrackByIds";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "20%",
                "title": "订票人姓名",
                "data": "reserveName" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },{
                "targets": 1,
                "width": "20%",
                "title": "订票人身份证号",
                "data": "idcard" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },{
                "targets" : 2,
                "width" : "20%",
                "title" : "到达站",
                "data" : "arrivedStation",
                "render" : function(data, type, full, meta) {

                    return "<span class=\"fa fa-bus color-blue marr-10\"></span>" + $.util.isEmpty(data) ? "" : data;
                }
            },{
                "targets": 3,
                "width": "20%",
                "title": "采集时间",
                "data": "collectTime" ,
                "render": function ( data, type, full, meta ) {
                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 4,
                "width" : "20%",
                "title" : "采集地检查站名",
                "data" : "collectStation",
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
        //是否显示loading效果
        tb.bProcessing = true;
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
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
        carLocusTable = $("#busTable").DataTable(tb);
    }


})(jQuery);