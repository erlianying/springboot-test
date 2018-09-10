(function($) {
    "use strict";
    var table = null;
    $(document).ready(function () {
        searchTable();
        $(document).on("click" , "#search", function(e){
            searchTable();
        })

    })

    function searchTable(){
        var traceTypeList = [];
        $.each($("input[name='trace']:checked"),function(i,val){
            traceTypeList.push($(val).val())
        })
        var searchData = {
            startTime:getstartTime(),
            endTime:getEndTime(),
            traceTypeList: traceTypeList,
        }
        var obj = new Object();
        $.util.objToStrutsFormData(searchData, "parameterPojo", obj);
        window.top.$.common.showOrHideLoading(true);

        $.ajax({
            url: context + '/transMitWarning/findTransMitWarningByParameter',
            data: obj,
            type: "post",
            success: function (map) {
                window.top.$.common.showOrHideLoading(false);
                initTable(map.transmitWarning);
            },
        });
    }

    /**
     * table
     */
    function initTable(tableInfoLst) {
        if (table != null) {
            table.destroy();
        }
        var tb = $.uiSettings.getLocalOTableSettings();
        $.util.log(tb);
        tb.data = tableInfoLst;
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "20%",
                "title": "轨迹类型",
                "data": "traceTypeName",
                "render": function (data, type, full, meta) {
                    var str = "";
                    if(full.level == 0){
                        str += "<span style='color:#f45b5b;'>" + data +  "</span>"
                    }else {
                        str += data ;
                    }
                    return str;
                }
            }, {
                "targets": 1,
                "width": "20%",
                "title": "预警对比时间",
                "data": "compareDate",
                "render": function (data, type, full, meta) {

                    var str = "";
                    if(full.level == 0){
                        str += "<span style='color:#f45b5b;'>" + $.date.timeToStr(data, 'yyyy-MM-dd HH:mm:ss') +  "</span>"
                    }else {
                        str += $.date.timeToStr(data, 'yyyy-MM-dd HH:mm:ss') ;
                    }
                    return str;
                }
            }, {
                "targets": 2,
                "width": "20%",
                "title": "上次入库时间",
                "data": "lastInsertDate",
                "render": function (data, type, full, meta) {
                    var str = "";
                    if(full.level == 0){
                        str += "<span style='color:#f45b5b;'>" + $.date.timeToStr(data, 'yyyy-MM-dd HH:mm:ss') +  "</span>"
                    }else {
                        str += $.date.timeToStr(data, 'yyyy-MM-dd HH:mm:ss') ;
                    }
                    return str;
                }
            },
            {
                "targets": 3,
                "width": "20%",
                "title": "时长",
                "data": "timeLong",
                "render": function (data, type, full, meta) {
                    var str = "";
                    if(full.level == 0){
                        str += "<span style='color:#f45b5b;'>" + data +  "</span>"
                    }else {
                        str += data ;
                    }
                    return str;
                }
            },
            {
                "targets": 4,
                "width": "20%",
                "title": "阀值",
                "data": "thresholdStr",
                "render": function (data, type, full, meta) {
                    var str = "";
                    if(full.level == 0){
                        str += "<span style='color:#f45b5b;'>" + data +  "</span>"
                    }else {
                        str += data ;
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
        tb.lengthMenu = [10];
        tb.initComplete = function () { //表格加载完成后执行的函数
        }
        table = $("#table").DataTable(tb);
    }

    function  getstartTime(){
        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        if(startDate){
            return new Date(startDate).getTime();
        }else{
            return (new Date().getTime() - 1000*60*60*48);
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