(function($) {
    "use strict";
    var table = null;
    var othereTable = null;
    var userDefinedTable = null;
    $(document).ready(function () {
        init();
        searchSheJunTable();
        $(document).on("click" , "#search", function(e){
            searchSheJunTable();
        })
        $(document).on("click" , "#sheJunExport", function(e){
            exportSheJunClick();
        })
    })

    /**
     * 导出涉军
     */
    function   exportSheJunClick(){
        var traceTypeList = [];
        $.each($("input[name='trace']:checked"),function(i,val){
            traceTypeList.push($(val).val())
        })
        var searchData = {
            startTime:getstartTime(),
            endTime:getEndTime(),
            traceTypeList: traceTypeList,
            crowdName:$.select2.val("#sheJunCrowdName"),
            historyFactNumberFloat:$("#sheJunHistoryFactNumberFloat").val(),
            yesterdayFactNumberFloat:$("#sheJunYesterdayFactNumberFloat").val(),
        }
        var form = $.util.getHiddenForm(context +'/crowdWarningContentExport/exportSheJunCrowdWarningContent',searchData);
        $.util.subForm(form);
    }

    function searchSheJunTable(){
        var traceTypeList = [];
        $.each($("input[name='trace']:checked"),function(i,val){
            traceTypeList.push($(val).val())
        })
        var searchData = {
            warningType:"分区异常预警",
            startTime:getstartTime(),
            endTime:getEndTime(),
            traceTypeList: traceTypeList,
            crowdName:$.select2.val("#sheJunCrowdName"),
            historyFactNumberFloat:$("#sheJunHistoryFactNumberFloat").val(),
            yesterdayFactNumberFloat:$("#sheJunYesterdayFactNumberFloat").val(),
        }
        var obj = new Object();
        $.util.objToStrutsFormData(searchData, "parameterPojo", obj);
        window.top.$.common.showOrHideLoading(true);

        $.ajax({
            url: context + '/crowdWarningContent/findsubStationSheJunCrowdWarningContentByParameter',
            data: obj,
            type: "post",
            success: function (map) {
                var otherList = map.otherList;
                var sheJunList = map.sheJunList;
                sheJunTable(sheJunList)
                window.top.$.common.showOrHideLoading(false);
            },
        });
    }

    function init (){
        $.ajax({
            url: context + '/crowdWarningContent/findDictionary',
            type: "post",
            success: function (map) {
                var arr = [{
                    code:"涉军",
                    name:"涉军"
                }]
                $.select2.addByList("#sheJunCrowdName", map.sheJunCrowdName, "code", "name", true, true);
                $.select2.addByList("#sheJunCrowdType", arr, "code", "name", true, true);
                window.setTimeout(function(){
                    $("#sheJunCrowdType").select2("val","涉军")
                },100);
            },
        });
    }

    /**
     * 涉军table
     */
    function sheJunTable(tableInfoLst) {
        if (table != null) {
            table.destroy();
        }
        var tb = $.uiSettings.getLocalOTableSettings();
        $.util.log(tb);
        tb.data = tableInfoLst;
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "11%",
                "title": "预警对比时间",
                "data": "calculateDate",
                "render": function (data, type, full, meta) {

                    return $.date.timeToStr(data, 'yyyy-MM-dd HH:mm:ss');
                }
            }, {
                "targets": 1,
                "width": "11%",
                "title": "群体",
                "data": "viewName",
                "render": function (data, type, full, meta) {
                    return data;
                }
            }, {
                "targets": 2,
                "width": "11%",
                "title": "数据类型",
                "data": "traceType",
                "render": function (data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets": 3,
                "width": "11%",
                "title": "预警类型",
                "data": "warning",
                "render": function (data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets": 4,
                "width": "11%",
                "title": "30日均值",
                "data": "historyNumber",
                "render": function (data, type, full, meta) {
                    var str = "";
                    if(full.level == 0){
                        str += "<span style='color:#f45b5b;'>" + data +  "</span>"
                    }else if(full.level == 1){
                        str += "<span style='color:#F4EA7F;'>" + data + "</span>"
                    }else {
                        str += data ;
                    }
                    return str;
                }
            },
            {
                "targets": 5,
                "width": "11%",
                "title": "昨日值",
                "data": "yesterdayNumber",
                "render": function (data, type, full, meta) {
                    var str = "";
                    if(data){
                        if(full.yesterdayLevel == 0){
                            str += "<span style='color:#f45b5b;'>" + data + "</span>"
                        }else if(full.yesterdayLevel == 1){
                            str += "<span style='color:#F4EA7F;'>" + data + "</span>"
                        }else {
                            str += data;
                        }
                    }
                    return str;
                }
            },
            {
                "targets": 6,
                "width": "11%",
                "title": "今日情况",
                "data": "dayNumber",
                "render": function (data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets": 7,
                "width": "11%",
                "title": "30日比率",
                "data": "factNumber",
                "render": function (data, type, full, meta) {
                    var str = "";
                    if(full.level == 0){
                        str += "<span style='color:#f45b5b;'>" + data +  "</span>"
                    }else if(full.level == 1){
                        str += "<span style='color:#F4EA7F;'>" + data + "</span>"
                    }else {
                        str += data ;
                    }
                    return str;
                }
            },
            {
                "targets": 8,
                "width": "11%",
                "title": "昨日比率",
                "data": "yesterdayFactNumber",
                "render": function (data, type, full, meta) {

                    var str = "";
                    if(full.yesterdayLevel == 0){
                        str += "<span style='color:#f45b5b;'>" + data + "</span>"
                    }else if(full.yesterdayLevel == 1){
                        str += "<span style='color:#F4EA7F;'>" + data + "</span>"
                    }else {
                        str += data;
                    }
                    return str;
                }
            }
        ];
        tb.ordering = false;
        tb.hideHead = false;
        tb.dom = null;
        tb.searching = false;
        tb.lengthChange = false;
        tb.paging = true;
        tb.info = true;
        tb.lengthMenu = [20];
        tb.initComplete = function () { //表格加载完成后执行的函数
        }
        table = $("#table").DataTable(tb);
    }

    function  getstartTime(){
        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        if(startDate){
            return new Date(startDate).getTime();
        }else{
            return null;
        }
    }
    function  getEndTime(){
        var endDate = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end");
        if(endDate){
            endDate = $.date.endRange(endDate,"yyyy-MM-dd");
            return new Date(endDate).getTime();
        }else{
            return  null;
        }
    }
})(jQuery);