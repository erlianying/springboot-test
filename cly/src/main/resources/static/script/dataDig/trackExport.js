(function($) {
    "use strict";

    var row = 1;
    var table = null;
    var tableDataArray = [];
    var tableStartTime = null;
    var tableEndTime = null;

    var startTime;
    var endTime;

    $(document).ready(function() {
        // init();
        //查询
        $(document).on("click" , "#searchBtn", function(e){
            var demo = $.validform.getValidFormObjById("validformType") ;
            var tag = $.validform.check(demo) ;
            if(!tag){
                return false;
            }
            getTime();
            if(startTime == tableStartTime && endTime == tableEndTime){
                var name1 = "开始时间以来均值";
                if($.util.exist(startTime)){
                    name1 = $.date.timeToStr(startTime, "MM月dd日")+" 以来均值";
                }
                var name2 = "结束时间";
                if($.util.exist(startTime)){
                    name2 = $.date.timeToStr(endTime, "MM月dd日");
                }
                initTable(compareRatio(tableDataArray, parseInt($.select2.val("#ratioType"))), name1, name2);
            }else{
                findTrack();
            }
        });
        //重置
        $(document).on("click" , "#resetBtn", function(e){
            location.reload();
        });
        //导出
        $(document).on("click" , "#exportBtn", function(e){
            exportExcel();
        });

        initTable([], "开始时间以来均值", "结束时间");
    });

    /**
     * 涉稳人员统计分析导出
     */
    function exportExcel(){
        getTime();
        if(startTime==null){
            $.layerAlert.alert({msg:"请选择开始时间！"}) ;
            return false ;
        }
        if(startTime>endTime){
            $.layerAlert.alert({msg:"开始时间不可大于结束时间！"}) ;
            return false ;
        }
        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        if(startDate){
            startTime = new Date(startDate).getTime();
        }else{
            startTime = new Date().getTime();
        }
        $.layerAlert.alert({title:"提示",msg:"文件下载中,请等待..",icon : 1,time:1000});
        var form = $.util.getHiddenForm(context+'/trackExportExcel/personStatisticAnalysisExport',{endTime : endTime,startTime : startTime});
        $.util.subForm(form);
    }



    function getTime(){
        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        var endDate = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end");
        if(startDate){
            startTime = new Date(startDate).getTime();
        }else{
            startTime = startDate;
        }
        if(endDate){
            endTime = new Date(endDate).getTime();
        }else{
            endTime = new Date().getTime();
        }
    }

    function initTable(dataArray, name1, name2) {
        if($.util.exist(table)){
            table.destroy();
            $("#carTable").empty();
        }
        var tb = $.uiSettings.getLocalOTableSettings();
        tb.data = dataArray;
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "5%",
                "title": "序号",
                "render": function ( data, type, full, meta ) {
                    return  meta.row + 1;
                }
            },
            {
                "targets" : 1,
                "title" : "轨迹类型",
                "width" : "10%",
                "data" : "trackType",//置顶信息
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "title" : "群体名称",
                "width" : "25%",
                "data" : "crowdName",//置顶信息
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 3,
                "title" : name1,
                "width" : "20%",
                "data" : "average",
                "render" : function(data, type, full, meta) {
                    return  data ;
                }
            },
            {
                "targets" : 4,
                "title" : name2,
                "width" : "20%",
                "data" : "nowNum",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "title" : "与均值比较",
                "width" : "20%",
                "data" : "ratio",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.ordering = false;
        tb.paging = false; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.dom = null;
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.bProcessing = false;//是否显示loading效果
        table = $("#carTable").DataTable(tb);//在哪个table标签中展示这个表格
    }

    function findTrack() {
        getTime();
        if(startTime==null){
            $.layerAlert.alert({msg:"请选择开始时间！"}) ;
            return false ;
        }
        if(startTime>endTime){
            $.layerAlert.alert({msg:"开始时间不可大于结束时间！"}) ;
            return false ;
        }
        var name1=$.date.timeToStr(startTime, "MM月dd日")+" 以来均值";
        var name2=$.date.timeToStr(endTime, "MM月dd日");
        var param = {};
        var obj = {
            "startTime" : startTime,
            "endTime" : endTime,
        };
        tableStartTime = startTime;
        tableEndTime = endTime;
        $.util.objToStrutsFormData(obj, "trackExportParameter", param);

        $.util.topWindow().$.common.showOrHideLoading(true);//启用
        $.ajax({
            url:context + '/trackExportManage/findPersonStatisticAnalysis',
            data:param,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:false,//设置是否loading
            },
            success:function(successData){
                tableDataArray = successData.pageList;
                initTable(compareRatio(tableDataArray, parseInt($.select2.val("#ratioType"))), name1, name2);
                $.util.topWindow().$.common.showOrHideLoading(false);//停用
            },
            error:function () {
                initTable([], name1, name2);
                $.util.topWindow().$.common.showOrHideLoading(false);//停用
            }
        });
    }

    /**
     * 过滤与均值比较字段
     *
     * @param dataArray 数据数组
     * @param flag 过滤条件
     */
    function compareRatio(dataArray, flag){
        var arr = [];
        if(!$.util.exist(dataArray) || dataArray.length < 1){
            return arr;
        }
        $.each(dataArray,function (i,val) {
            var ratio = val.ratio;
            if(ratio.indexOf("%") == -1){
                arr.push(val);
            }else{
                var ratioNumber = ratio.substring(0,ratio.indexOf("%"));
                if(ratioNumber >= flag){
                    arr.push(val);
                }
            }
        });
        return arr;
    }

    // function creatTable(){
    //     getTime();
    //     if(startTime==null){
    //         $.layerAlert.alert({msg:"请选择开始时间！"}) ;
    //         return false ;
    //     }
    //     if(startTime>endTime){
    //         $.layerAlert.alert({msg:"开始时间不可大于结束时间！"}) ;
    //         return false ;
    //     }
    //     var name1=$.date.timeToStr(startTime, "MM月dd日")+" 以来均值";
    //     var name2=$.date.timeToStr(endTime, "MM月dd日");
    //     if(table != null) {
    //         table.destroy();
    //         $.util.topWindow().$.common.showOrHideLoading(true);//启用
    //     }
    //     var tb = $.uiSettings.getOTableSettings();
    //     tb.ajax.url = context +'/trackExportManage/findPersonStatisticAnalysis',
    //         tb.columnDefs = [
    //             {
    //                 "targets": 0,
    //                 "width": "5%",
    //                 "title": "序号",
    //                 "render": function ( data, type, full, meta ) {
    //                     return  meta.row + 1;
    //                 }
    //             },
    //             {
    //                 "targets" : 1,
    //                 "title" : "轨迹类型",
    //                 "width" : "10%",
    //                 "data" : "trackType",//置顶信息
    //                 "render" : function(data, type, full, meta) {
    //                     return data;
    //                 }
    //             },
    //             {
    //                 "targets" : 2,
    //                 "title" : "群体名称",
    //                 "width" : "25%",
    //                 "data" : "crowdName",//置顶信息
    //                 "render" : function(data, type, full, meta) {
    //                     return data;
    //                 }
    //             },{
    //                 "targets" : 3,
    //                 "title" : name1,
    //                 "width" : "20%",
    //                 "data" : "average",
    //                 "render" : function(data, type, full, meta) {
    //                     return  data ;
    //                 }
    //             },
    //             {
    //                 "targets" : 4,
    //                 "title" : name2,
    //                 "width" : "20%",
    //                 "data" : "nowNum",
    //                 "render" : function(data, type, full, meta) {
    //                     return data;
    //                 }
    //             },
    //             {
    //                 "targets" : 5,
    //                 "title" : "与均值比较",
    //                 "width" : "20%",
    //                 "data" : "ratio",
    //                 "render" : function(data, type, full, meta) {
    //                     return data;
    //                 }
    //             }
    //         ];
    //     tb.ordering = false;
    //     tb.paging = false; //分页是否
    //     tb.hideHead = false; //是否隐藏表头
    //     tb.dom = null;
    //     tb.searching = false; //是否有查询输入框
    //     tb.lengthChange = false; //是否可以改变每页显示条数
    //     tb.info = true; //是否显示详细信息
    //     tb.bProcessing = true;//是否显示loading效果
    //     // tb.lengthMenu = [ 10 ]; //每页条数
    //     tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
    //         var obj = {
    //             "startTime" : startTime,
    //             "endTime" : endTime,
    //         };
    //         $.util.objToStrutsFormData(obj, "trackExportParameter", d);
    //     };
    //     tb.paramsResp = function(json) {
    //         json.recordsTotal = json.totalNum;
    //         json.recordsFiltered = json.totalNum;
    //         json.data = json.pageList;
    //     };
    //     tb.initComplete = function(){ //表格加载完成后执行的函数
    //         $.util.topWindow().$.common.showOrHideLoading(false);//停用
    //     }
    //     table = $("#carTable").DataTable(tb);//在哪个table标签中展示这个表格
    // }



})(jQuery);