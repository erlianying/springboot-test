(function($){
    "use strict";
    var trainLocusTable = null;
    var idNumber;
    //火车
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
        initTrainTrackTable();
    }

    function queryClick(){
        trainTrackTable();
    }

    function trainTrackTable(){
        if(trainLocusTable != null) {
            trainLocusTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personDetialsManage/findTrainTrack";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "14%",
                "title" : "订票人姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 1,
                "width" : "14%",
                "title" : "订票人身份证号",
                "data" : "idcard",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 2,
                "width" : "16%",
                "title" : "预定车次/起始到达站",
                "data" : "trainNumber",
                "render" : function(data, type, full, meta) {
                    var info = "<span class='fa fa-train color-blue marr-10'></span>"+data+"<br>";
                    if(!$.util.isEmpty(full.startStation)){
                        info += full.startStation;
                    }
                    info += "--";
                    if(!$.util.isEmpty(full.arrivedStation)){
                        info += full.arrivedStation;
                    }
                    return info;
                }
            },
            {
                "targets" : 3,
                "width" : "14%",
                "title" : "车厢号",
                "data" : "boxNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "14%",
                "title" : "座位号",
                "data" : "seatNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "14%",
                "title" : "发车时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data){
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                    return "";
                }
            },
            {
                "targets" : 6,
                "width" : "14%",
                "title" : "到达时间",
                "data" : "arrivedTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data){
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                    return "";
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
        trainLocusTable = $("#trainTable").DataTable(tb);
    }

    function initTrainTrackTable(){
        if(trainLocusTable != null) {
            trainLocusTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personDetialsManage/findTrainTrackByIds";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "14%",
                "title" : "订票人姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 1,
                "width" : "14%",
                "title" : "订票人身份证号",
                "data" : "idcard",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 2,
                "width" : "16%",
                "title" : "预定车次/起始到达站",
                "data" : "trainNumber",
                "render" : function(data, type, full, meta) {
                    var info = "<span class='fa fa-train color-blue marr-10'></span>"+data+"<br>";
                    if(!$.util.isEmpty(full.startStation)){
                        info += full.startStation;
                    }
                    info += "--";
                    if(!$.util.isEmpty(full.arrivedStation)){
                        info += full.arrivedStation;
                    }
                    return info;
                }
            },
            {
                "targets" : 3,
                "width" : "14%",
                "title" : "车厢号",
                "data" : "boxNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "14%",
                "title" : "座位号",
                "data" : "seatNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "14%",
                "title" : "发车时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data){
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                    return "";
                }
            },
            {
                "targets" : 6,
                "width" : "14%",
                "title" : "到达时间",
                "data" : "arrivedTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data){
                        return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                    }
                    return "";
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
        trainLocusTable = $("#trainTable").DataTable(tb);
    }

})(jQuery);