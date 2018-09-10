(function($) {
    "use strict";
    var table = null;
    var othereTable = null;
    var userDefinedTable = null;
    var hotelTable
    $(document).ready(function () {
        init();

        initTable();

        $(document).on("select2:select","#otherCrowdType",function(){
            selectCrowdType();
        })

        $(document).on("click" , "#search", function(e){
            initTable();
        })

        $(document).on("click" , "#sheJunSearch", function(e){
            searchSheJunTable();
        })

        $(document).on("click" , "#otherSerch", function(e){
            searchOtherTable();
        })

        $(document).on("click" , "#crowdSetting", function(e){
            setCrowdInfo();
        })

        $(document).on("click" , "#sheJunExport", function(e){
            exportSheJunClick();
        })

        $(document).on("click" , "#otherExport", function(e){
            exportOtherClick();
        })

        $(document).on("click" , "#userDefinedExport", function(e){
            exportUserDefined();
        })

        $(document).on("click" , "#hotelExport", function(e){
            exporthotelExport();
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

    /**
     * 导出其他
     */
    function   exportOtherClick(){
        var traceTypeList = [];
        $.each($("input[name='trace']:checked"),function(i,val){
            traceTypeList.push($(val).val())
        })
        var searchData = {
            startTime:getstartTime(),
            endTime:getEndTime(),
            traceTypeList: traceTypeList,
            crowdType:$.select2.val("#otherCrowdType"),
            crowdName:$.select2.val("#otherCrowdName"),
            historyFactNumberFloat:$("#otherHistoryFactNumberFloat").val(),
            yesterdayFactNumberFloat:$("#otherYesterdayfactnumberfloat").val(),
        }

        var form = $.util.getHiddenForm(context +'/crowdWarningContentExport/exportOtherCrowdWarningContent',searchData);
        $.util.subForm(form);
    }

    /**
     * 导出自定义
     */
    function exportUserDefined(){
        var traceTypeList = [];
        $.each($("input[name='trace']:checked"),function(i,val){
            traceTypeList.push($(val).val())
        })
        var searchData = {
            startTime:getstartTime(),
            endTime:getEndTime(),
            traceTypeList: traceTypeList,
        }

        var form = $.util.getHiddenForm(context +'/crowdWarningContentExport/exportUserDefinedCrowdWarningContent',searchData);
        $.util.subForm(form);
    }

    /**
     * 导出旅店預警
     */
    function exporthotelExport(){
        var traceTypeList = [];
        $.each($("input[name='trace']:checked"),function(i,val){
            traceTypeList.push($(val).val())
        })
        var searchData = {
            startTime:getstartTime(),
            endTime:getEndTime(),
        }

        var form = $.util.getHiddenForm(context +'/crowdWarningContentExport/exporthotelWarningExport',searchData);
        $.util.subForm(form);
    }



    function searchSheJunTable(){
        var traceTypeList = [];
        $.each($("input[name='trace']:checked"),function(i,val){
            traceTypeList.push($(val).val())
        })

        var searchData = {
            warningType:$.select2.val("#warningType"),
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
            url: context + '/crowdWarningContent/findSheJunCrowdWarningContentByParameter',
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

    function searchOtherTable(){
        var traceTypeList = [];
        $.each($("input[name='trace']:checked"),function(i,val){
            traceTypeList.push($(val).val())
        })
        var searchData = {
            startTime:getstartTime(),
            endTime:getEndTime(),
            traceTypeList: traceTypeList,
            crowdType:$.select2.val("#otherCrowdType"),
            crowdName:$.select2.val("#otherCrowdName"),
            historyFactNumberFloat:$("#otherHistoryFactNumberFloat").val(),
            yesterdayFactNumberFloat:$("#otherYesterdayfactnumberfloat").val(),
        }
        var obj = new Object();
        $.util.objToStrutsFormData(searchData, "parameterPojo", obj);
        window.top.$.common.showOrHideLoading(true);

        $.ajax({
            url: context + '/crowdWarningContent/findOtherCrowdWarningContentByParameter',
            data: obj,
            type: "post",
            success: function (map) {
                var otherList = map.otherList;
                var sheJunList = map.sheJunList;
                otherTable(otherList);
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

                var warningTypeArr = [{code:"总量异常预警", name:"总量异常预警"},{code:"分区异常预警", name:"分区异常预警"},{code:"分省异常预警", name:"分省异常预警"}]


                $.select2.addByList("#otherCrowdType", map.crowdType, "code", "name", true, true);
                $.select2.addByList("#sheJunCrowdName", map.sheJunCrowdName, "code", "name", true, true);
                $.select2.addByList("#sheJunCrowdType", arr, "code", "name", true, true);
                $.select2.addByList("#warningType", warningTypeArr, "code", "name", true, true);
                window.setTimeout(function(){
                    $("#sheJunCrowdType").select2("val","涉军")
                },100);
            },
        });
    }

    function selectCrowdType(){
        var code = $.select2.val("#otherCrowdType");
        $.ajax({
            url: context + '/personManage/findDictionaryItemsByParentId',
            data: {parentId: code},
            type: "post",
            success: function (successData) {
                var list = successData.simplePojos;
                $.select2.empty("#otherCrowdName");
                $.select2.addByList("#otherCrowdName", list, "code", "name", true, true);
            }
        });
    }

    function initTable() {

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
            url: context + '/crowdWarningContent/findAllCrowdWarningContentByParameter',
            data: obj,
            type: "post",
            success: function (map) {
                var otherList = map.otherList;
                var sheJunList = map.sheJunList;
                otherTable(otherList);
                sheJunTable(sheJunList);
                loadUserDefinedTable(map.userDefinedList);
                initHotelTable(map.hotelWarningList);
                window.top.$.common.showOrHideLoading(false);
            },
        });
    }

    /**
     * 其他群体table
     */
    function otherTable(tableInfoLst) {
        if (othereTable != null) {
            othereTable.destroy();
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

            /*$.each($("tr"), function (e,m) {
                 var span = $(m).find("span")[0];
                 if($(span).attr("vallevel") == 2){
                     $(this).attr("style","background:red")
                 }else if($(span).attr("vallevel") == 1){
                     $(this).attr("style","background:yellow")
                 }else if($(span).attr("vallevel") == 0){
                     $(this).attr("style","background:blue")
                 }
             })*/

        }
        othereTable = $("#othereTable").DataTable(tb);
    }

  /**
     * 其他群体table
     */
    function initHotelTable(tableInfoLst) {
        if (hotelTable != null) {
            hotelTable.destroy();
        }
        var tb = $.uiSettings.getLocalOTableSettings();
        $.util.log(tb);
        tb.data = tableInfoLst;
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "20%",
                "title": "时间",
                "data": "datetime",
                "render": function (data, type, full, meta) {

                    return $.date.timeToStr(data, 'yyyy-MM-dd HH:mm:ss');
                }
            }, {
                "targets": 1,
                "width": "20%",
                "title": "群体",
                "data": "viewName",
                "render": function (data, type, full, meta) {
                    return data;
                }
            }, {
                "targets": 2,
                "width": "20%",
                "title": "旅店名称",
                "data": "hotelName",
                "render": function (data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets": 3,
                "width": "20%",
                "title": "旅店地址",
                "data": "hotelAddress",
                "render": function (data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets": 4,
                "width": "20%",
                "title": "聚团人数",
                "data": "personNum",
                "render": function (data, type, full, meta) {
                    return data;
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

            /*$.each($("tr"), function (e,m) {
                 var span = $(m).find("span")[0];
                 if($(span).attr("vallevel") == 2){
                     $(this).attr("style","background:red")
                 }else if($(span).attr("vallevel") == 1){
                     $(this).attr("style","background:yellow")
                 }else if($(span).attr("vallevel") == 0){
                     $(this).attr("style","background:blue")
                 }
             })*/

        }
      hotelTable = $("#hotelTable").DataTable(tb);
    }


    /**
     * 自定义群体table
     */
    function loadUserDefinedTable(tableInfoLst) {
        if (userDefinedTable != null) {
            userDefinedTable.destroy();
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

            /*$.each($("tr"), function (e,m) {
                 var span = $(m).find("span")[0];
                 if($(span).attr("vallevel") == 2){
                     $(this).attr("style","background:red")
                 }else if($(span).attr("vallevel") == 1){
                     $(this).attr("style","background:yellow")
                 }else if($(span).attr("vallevel") == 0){
                     $(this).attr("style","background:blue")
                 }
             })*/

        }
        userDefinedTable = $("#userDefinedTable").DataTable(tb);
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

            /*$.each($("tr"), function (e,m) {
                 var span = $(m).find("span")[0];
                 if($(span).attr("vallevel") == 2){
                     $(this).attr("style","background:red")
                 }else if($(span).attr("vallevel") == 1){
                     $(this).attr("style","background:yellow")
                 }else if($(span).attr("vallevel") == 0){
                     $(this).attr("style","background:blue")
                 }
             })*/

        }
        table = $("#table").DataTable(tb);
    }


    function setCrowdInfo(){

        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/abnormalSituationWarning/crowdSetting',
            pageLoading: true,
            title: "配置关注群体",
            width: "810px",
            height: "540px",
            btn: ["修改", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.crowdSetting;
                    cm.edit();
                },
                btn2: function (index, layero) {
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose: false,
            success: function (layero, index) {

            },
            initData: {
            },
            end: function () {
                initTable();
            }
        });
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