(function($){
    "use strict";
    var beijingToPermitLocusTable = null;

    var idNumber;
    //在京核录信息
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
        initBeijingToPermitTrackTable();
    }

    function queryClick(){
        beijingToPermitTrackTable();
    }

    /**
     * 初始化 进京证轨迹  table
     */
    function beijingToPermitTrackTable(){
        if(beijingToPermitLocusTable != null) {
            beijingToPermitLocusTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personDetialsManage/findBjPass";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "",
                "title": "办理人姓名",
                "data": "name" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },{
                "targets": 1,
                "width": "",
                "title": "身份证/驾驶证号",
                "data": "idcard" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },{
                "targets": 2,
                "width": "",
                "title": "车牌号",
                "data": "plateNumber" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "发动机号",
                "data" : "engineNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "申请时间",
                "data" : "transactTime",
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
            json.data = json.pageList;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
        };
        beijingToPermitLocusTable = $("#beijingToPermitTable").DataTable(tb);
    }

    /**
     * 初始化 进京证轨迹  table
     */
    function initBeijingToPermitTrackTable(){
        if(beijingToPermitLocusTable != null) {
            beijingToPermitLocusTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personDetialsManage/findBjPassByIds";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "",
                "title": "办理人姓名",
                "data": "name" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },{
                "targets": 1,
                "width": "",
                "title": "身份证/驾驶证号",
                "data": "idcard" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },{
                "targets": 2,
                "width": "",
                "title": "车牌号",
                "data": "plateNumber" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "发动机号",
                "data" : "engineNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "申请时间",
                "data" : "transactTime",
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
        //自动TFoot
        tb.autoFooter = false ;
        //是否显示loading效果
        tb.bProcessing = true;
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
            json.data = json.pageList;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
        };
        beijingToPermitLocusTable = $("#beijingToPermitTable").DataTable(tb);
    }


})(jQuery);