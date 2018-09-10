var checkPointTable = null;// 在京核录信息

var hotelTable = null;// 旅馆住宿
var checkTable = null;// 在京核录信息
var netbarTable = null;// 网吧上网信息

var gatherAirlineTable = null;// 聚团民航订票
var gatherHotelTable = null;// 聚团旅馆住宿
var gatherNetbarTable = null;// 聚团旅馆上网
var gatherCheckPointTable = null;// 聚团进京检查站（核录）

var allNationChangAnTable = null;// 全国长安数据

var gatherCountNum = 0;
var gatherCount = 0;//当前第几个聚团查询出来
var gatherInfoCount = 0;//聚团的数量

var countSum = 0;



/**
 * 查询全国长安数据
 */
function initAllNationChangAnTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findAllNationChangAnByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "20%",
            "title": "姓名",
            "data": "personName" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "20%",
            "title" : "身份证号",
            "data" : "identity",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "20%",
            "title" : "采集时间",
            "data" : "acquisitionTimeLong",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        {
            "targets" : 3,
            "width" : "20%",
            "title" : "采集地点",
            "data" : "acquisitionAddress",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 4,
            "width" : "20%",
            "title" : "电话归属地",
            "data" : "mobilePhoneHome",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        }
    ];
    //是否排序
    tb.ordering = false ;
    //每页条数
    tb.lengthMenu = [ 5 ];
    //默认搜索框
    tb.searching = false ;
    //能否改变lengthMenu
    tb.lengthChange = false ;
    //自动TFoot
    tb.autoFooter = false ;
    //自动列宽
    tb.autoWidth = false ;
    //是否显示loading效果
    tb.bProcessing = true;
    //请求参数
    tb.paramsReq = function(d, pagerReq){
        d = $.substationaActivityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var changAns = json.changAns;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = changAns;

        if(json.totalNum > 0){
            $("#allNationChangAnTable").parent("div").prev("div").find("button").show();
        }else{
            $("#allNationChangAnTable").parent("div").prev("div").find("button").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    allNationChangAnTable = $("#allNationChangAnTable").DataTable(tb);
}

/**
 * 初始化全国民航订票信息列表
 */
function initAllNationAirlineTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findAllNationAirlineTrackByPage";
    tb.columnDefs = [
        {
            "targets" : 0,
            "width" : "15%",
            "title" : "订票人姓名",
            "data" : "name",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "15%",
            "title" : "订票人身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "15%",
            "title" : "航班信息",
            "data" : "planeNumber",
            "render" : function(data, type, full, meta) {
                var tr = '<span class="fa fa-plane color-blue marr-10"></span>' + data ;
                return tr;
            }
        },
        {
            "targets" : 3,
            "width" : "15%",
            "title" : "起始航站",
            "data" : "startTerminal",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data ;
            }
        },
        {
            "targets" : 4,
            "width" : "15%",
            "title" : "到达航站",
            "data" : "arrivedTerminal",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data ;
            }
        },
        {
            "targets" : 5,
            "width" : "15%",
            "title" : "起飞时间",
            "data" : "startTimeLong",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        {
            "targets" : 6,
            "width" : "10%",
            "title" : "状态",
            "data" : "ticketStatus",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        }
    ];
    //是否排序
    tb.ordering = false ;
    //每页条数
    tb.lengthMenu = [ 5 ];
    //默认搜索框
    tb.searching = false ;
    //能否改变lengthMenu
    tb.lengthChange = false ;
    //自动TFoot
    tb.autoFooter = false ;
    //自动列宽
    tb.autoWidth = false ;
    //是否显示loading效果
    tb.bProcessing = true;
    //请求参数
    tb.paramsReq = function(d, pagerReq){
        d = $.substationaActivityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var airlineTracks = json.airlineTracks;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = airlineTracks;

        if(json.totalNum > 0){
            $("#allNationAirlineTable").parent("div").prev("div").find("button").show();
        }else{
            $("#allNationAirlineTable").parent("div").prev("div").find("button").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    allNationAirlineTable = $("#allNationAirlineTable").DataTable(tb);
}

/**
 * 初始化全国铁路订票信息列表
 */
function initAllNationTrainTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findAllNationTrainTrackByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "10%",
            "title": "订票人姓名",
            "data": "name",
            "render": function (data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets": 1,
            "width": "20%",
            "title": "订票人身份证号",
            "data": "idcard",
            "render": function (data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets": 2,
            "width": "10%",
            "title": "预定车次",
            "data": "trainNumber",
            "render": function (data, type, full, meta) {
                var tr = '<span class="fa fa-train color-blue marr-10"></span>' + data;
                return tr;
            }
        },
        {
            "targets": 3,
            "width": "10%",
            "title": "起始站",
            "data": "startStation",
            "render": function (data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets": 4,
            "width": "10%",
            "title": "到达站",
            "data": "arrivedStation",
            "render": function (data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets": 5,
            "width": "20%",
            "title": "发车时间",
            "data": "startTimeLong",
            "render": function (data, type, full, meta) {
                if ($.util.isBlank(data)) {
                    return "";
                } else {
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        {
            "targets": 6,
            "width": "20%",
            "title": "到达时间",
            "data": "arrivedTimeLong",
            "render": function (data, type, full, meta) {
                if ($.util.isBlank(data)) {
                    return "";
                } else {
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        }
    ];
    //是否排序
    tb.ordering = false;
    //每页条数
    tb.lengthMenu = [5];
    //默认搜索框
    tb.searching = false;
    //能否改变lengthMenu
    tb.lengthChange = false;
    //自动TFoot
    tb.autoFooter = false;
    //自动列宽
    tb.autoWidth = false;
    //是否显示loading效果
    tb.bProcessing = true;
    //请求参数
    tb.paramsReq = function (d, pagerReq) {
        d = $.substationaActivityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function (json) {
        var trainTracks = json.trainTracks;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = trainTracks;

        if (json.totalNum > 0) {
            $("#allNationTrainTable").parent("div").prev("div").find("button").show();
        } else {
            $("#allNationTrainTable").parent("div").prev("div").find("button").hide();
        }
    };
    tb.rowCallback = function (row, data, index) {
    };
    allNationTrainTable = $("#allNationTrainTable").DataTable(tb);
}

/**
 * 初始化聚团网吧上网信息列表
 */

function initGatherNetbarTable(){
    gatherCountNum ++;
    if(gatherNetbarTable != null) {
        gatherNetbarTable.destroy();
    }
    $("#gatherNetbarTable").empty();
    $("#gatherNetbarInfo").hide();
    var obj = new Object();
    obj = $.substationaActivityTrackCompareResult.getQueryParam(obj);
    $.ajax({
        url:context + "/activityCompare/findGatherNetbarByPage",
        data:obj,
        type:'post',
        success:function(map){
            var tableInfoLst = map.netbars;
            getGatherNetbarTable(tableInfoLst);
            $("#gatherNetbarInfo").text("查询结果：共计"+map.gatherCount+"个团"+tableInfoLst.length+"人。");
            $("#gatherNetbarInfo").show();
            gatherCount++;
            gatherInfoCount += tableInfoLst.length;
            getGatherInfoCount();
        }
    })
}
function getGatherNetbarTable(tableInfoLst) {

    var tb = $.uiSettings.getLocalOTableSettings();
    $.util.log(tb);
    tb.data = tableInfoLst;
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "10%",
            "title": "姓名",
            "data": "name" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "10%",
            "title" : "身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "20%",
            "title" : "网吧名称",
            "data" : "netbarName",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 3,
            "width" : "30%",
            "title" : "网吧地址",
            "data" : "netbarAddress",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 4,
            "width" : "20%",
            "title" : "所属分局",
            "data" : "subBureau",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 5,
            "width" : "10%",
            "title" : "上机时间",
            "data" : "startTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        }
    ];
    tb.ordering = false;
    tb.paging = true; //分页是否
    tb.hideHead = false; //是否隐藏表头
    tb.searching = false; //是否有查询输入框
    tb.info = true; //是否显示详细信息
    tb.bProcessing = true;//是否显示loading效果
    tb.lengthMenu = [ 5 ]; //每页条数
    tb.lengthChange = false; //是否可以改变每页显示条数
    gatherNetbarTable = $("#gatherNetbarTable").DataTable(tb);
}

/**
 * 初始化聚团旅馆住宿信息列表
 */

function initGatherHotelTable(){
    gatherCountNum ++;
    if(gatherHotelTable != null) {
        gatherHotelTable.destroy();
    }
    $("#gatherHotelTable").empty();

    $("#gatherHotelInfo").hide();
    var obj = new Object();
    obj = $.substationaActivityTrackCompareResult.getQueryParam(obj);
    $.ajax({
        url:context + "/activityCompare/findGatherHotelTrackByPage",
        data:obj,
        type:'post',
        success:function(map){
            var tableInfoLst = map.hotels;
            getGatherHotelTable(tableInfoLst);
            $("#gatherHotelInfo").text("查询结果：共计"+map.gatherCount+"个团"+tableInfoLst.length+"人。");
            $("#gatherHotelInfo").show();

            gatherCount++;
            gatherInfoCount += tableInfoLst.length;
            getGatherInfoCount();
        }
    })
}

function getGatherHotelTable(tableInfoLst) {
    var tb = $.uiSettings.getLocalOTableSettings();
    $.util.log(tb);
    tb.data = tableInfoLst;
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "10%",
            "title": "入住人姓名",
            "data": "name" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "10%",
            "title" : "身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "15%",
            "title" : "旅店名称",
            "data" : "hotelName",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 3,
            "width" : "15%",
            "title" : "旅店地址",
            "data" : "hotelAddress",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 4,
            "width" : "10%",
            "title" : "所辖分局",
            "data" : "subBureau",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 5,
            "width" : "10%",
            "title" : "所辖派出所",
            "data" : "policeStation",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 6,
            "width" : "10%",
            "title" : "入住房间号",
            "data" : "roomNumber",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 7,
            "width" : "10%",
            "title" : "入住时间",
            "data" : "checkinTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        {
            "targets" : 8,
            "width" : "10%",
            "title" : "离开时间",
            "data" : "leaveTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        }
    ];
    tb.ordering = false;
    tb.paging = true; //分页是否
    tb.hideHead = false; //是否隐藏表头
    tb.searching = false; //是否有查询输入框
    tb.info = true; //是否显示详细信息
    tb.bProcessing = true;//是否显示loading效果
    tb.lengthMenu = [ 5 ]; //每页条数
    tb.lengthChange = false; //是否可以改变每页显示条数

    gatherHotelTable = $("#gatherHotelTable").DataTable(tb);
}

/**
 * 初始化聚团旅进京检查站核录信息列表
 */

function initGatherCheckPointTable(){
    gatherCountNum ++;
    if(gatherCheckPointTable != null) {
        gatherCheckPointTable.destroy();
    }
    $("#gatherCheckPointTable").empty();
    $("#gatherCheckPointInfo").hide();
    var obj = new Object();
    obj = $.substationaActivityTrackCompareResult.getQueryParam(obj);
    $.ajax({
        url:context + "/activityCompare/findGatherCheckPointTrackByPage",
        data:obj,
        type:'post',
        success:function(map){
            getGatherCheckPointTable(map.checkPoint);
            $("#gatherCheckPointInfo").text("查询结果：共计"+map.gatherCount+"个团"+map.checkPoint.length+"人。");
            $("#gatherCheckPointInfo").show();

            gatherCount++;
            gatherInfoCount += map.checkPoint.length;
            getGatherInfoCount();
        }
    })


}

function getGatherCheckPointTable(tableInfoLst) {

    var tb = $.uiSettings.getLocalOTableSettings();
    $.util.log(tb);
    tb.data = tableInfoLst;
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "10%",
            "title": "姓名",
            "data": "name" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "15%",
            "title" : "身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "15%",
            "title" : "核录时间",
            "data" : "checkTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        {
            "targets" : 3,
            "width" : "15%",
            "title" : "核录区域",
            "data" : "inspectArea",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 4,
            "width" : "15%",
            "title" : "核录地址",
            "data" : "address",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 5,
            "width" : "15%",
            "title" : "核录分局",
            "data" : "subBureau",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 6,
            "width" : "15%",
            "title" : "核录派出所",
            "data" : "policeStation",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        }
    ];
    tb.ordering = false;
    tb.paging = true; //分页是否
    tb.hideHead = false; //是否隐藏表头
    tb.searching = false; //是否有查询输入框
    tb.info = true; //是否显示详细信息
    tb.bProcessing = true;//是否显示loading效果
    tb.lengthMenu = [ 5 ]; //每页条数
    tb.lengthChange = false; //是否可以改变每页显示条数

    gatherCheckPointTable = $("#gatherCheckPointTable").DataTable(tb);
}

/**
 * 初始化网吧上网信息列表
 */
function initNetbarTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findSubstationNetbarByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "10%",
            "title": "姓名",
            "data": "name" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "10%",
            "title" : "身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "20%",
            "title" : "网吧名称",
            "data" : "netbarName",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 3,
            "width" : "30%",
            "title" : "网吧地址",
            "data" : "netbarAddress",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 4,
            "width" : "20%",
            "title" : "所属分局",
            "data" : "subBureau",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 5,
            "width" : "10%",
            "title" : "上机时间",
            "data" : "startTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        }
    ];
    //是否排序
    tb.ordering = false ;
    //每页条数
    tb.lengthMenu = [ 5 ];
    //默认搜索框
    tb.searching = false ;
    //能否改变lengthMenu
    tb.lengthChange = false ;
    //自动TFoot
    tb.autoFooter = false ;
    //自动列宽
    tb.autoWidth = false ;
    //是否显示loading效果
    tb.bProcessing = true;
    //请求参数
    tb.paramsReq = function(d, pagerReq){
        d = $.substationaActivityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var netbars = json.netbars;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = netbars;

        if(json.totalNum > 0){
            $("#netbarTable").parent("div").prev("div").find("button").show();
            // $("#netbarTable").parent("div").parent("div").show();
        }else{
            $("#netbarTable").parent("div").prev("div").find("button").hide();
            // $("#netbarTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    netbarTable = $("#netbarTable").DataTable(tb);
}

/**
 * 初始化在京核录信息列表
 */
function initCheckTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findSubstationCheckByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "10%",
            "title": "姓名",
            "data": "name" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "15%",
            "title" : "身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "15%",
            "title" : "核录时间",
            "data" : "checkTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        {
            "targets" : 3,
            "width" : "15%",
            "title" : "核录区域",
            "data" : "inspectArea",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 4,
            "width" : "15%",
            "title" : "核录地址",
            "data" : "address",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 5,
            "width" : "15%",
            "title" : "核录分局",
            "data" : "subBureau",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 6,
            "width" : "15%",
            "title" : "核录派出所",
            "data" : "policeStation",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        }
    ];
    //是否排序
    tb.ordering = false ;
    //每页条数
    tb.lengthMenu = [ 5 ];
    //默认搜索框
    tb.searching = false ;
    //能否改变lengthMenu
    tb.lengthChange = false ;
    //自动TFoot
    tb.autoFooter = false ;
    //自动列宽
    tb.autoWidth = false ;
    //是否显示loading效果
    tb.bProcessing = true;
    //请求参数
    tb.paramsReq = function(d, pagerReq){
        d = $.substationaActivityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var checks = json.checks;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = checks;

        if(json.totalNum > 0){
            $("#checkTable").parent("div").prev("div").find("button").show();
            // $("#checkTable").parent("div").parent("div").show();
        }else{
            $("#checkTable").parent("div").prev("div").find("button").hide();
            // $("#checkTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    checkTable = $("#checkTable").DataTable(tb);
}

/**
 * 初始化在京核录信息列表
 */
function initCheckPointTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findSubstationCheckPinitByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "10%",
            "title": "姓名",
            "data": "name" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "15%",
            "title" : "身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "15%",
            "title" : "核录时间",
            "data" : "checkTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        {
            "targets" : 3,
            "width" : "15%",
            "title" : "核录区域",
            "data" : "inspectArea",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 4,
            "width" : "15%",
            "title" : "核录地址",
            "data" : "address",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 5,
            "width" : "15%",
            "title" : "核录分局",
            "data" : "subBureau",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 6,
            "width" : "15%",
            "title" : "核录派出所",
            "data" : "policeStation",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        }
    ];
    //是否排序
    tb.ordering = false ;
    //每页条数
    tb.lengthMenu = [ 5 ];
    //默认搜索框
    tb.searching = false ;
    //能否改变lengthMenu
    tb.lengthChange = false ;
    //自动TFoot
    tb.autoFooter = false ;
    //自动列宽
    tb.autoWidth = false ;
    //是否显示loading效果
    tb.bProcessing = true;
    //请求参数
    tb.paramsReq = function(d, pagerReq){
        d = $.substationaActivityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var checkPoints = json.checkPoints;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = checkPoints;

        if(json.totalNum > 0){
            $("#checkPointTable").parent("div").prev("div").find("button").show();
            // $("#checkPointTable").parent("div").parent("div").show();
        }else{
            $("#checkPointTable").parent("div").prev("div").find("button").hide();
            // $("#checkPointTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    checkPointTable = $("#checkPointTable").DataTable(tb);
}

/**
 * 初始化旅馆住宿信息列表
 */
function initHotelTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findSubstationHotelTrackByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "10%",
            "title": "入住人姓名",
            "data": "name" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "10%",
            "title" : "身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "15%",
            "title" : "旅店名称",
            "data" : "hotelName",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 3,
            "width" : "15%",
            "title" : "旅店地址",
            "data" : "hotelAddress",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 4,
            "width" : "10%",
            "title" : "所辖分局",
            "data" : "subBureau",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 5,
            "width" : "10%",
            "title" : "所辖派出所",
            "data" : "policeStation",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 6,
            "width" : "10%",
            "title" : "入住房间号",
            "data" : "roomNumber",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 7,
            "width" : "10%",
            "title" : "入住时间",
            "data" : "checkinTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        {
            "targets" : 8,
            "width" : "10%",
            "title" : "离开时间",
            "data" : "leaveTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        }
    ];
    //是否排序
    tb.ordering = false ;
    //每页条数
    tb.lengthMenu = [ 5 ];
    //默认搜索框
    tb.searching = false ;
    //能否改变lengthMenu
    tb.lengthChange = false ;
    //自动TFoot
    tb.autoFooter = false ;
    //自动列宽
    tb.autoWidth = false ;
    //是否显示loading效果
    tb.bProcessing = true;
    //请求参数
    tb.paramsReq = function(d, pagerReq){
        d = $.substationaActivityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var hotels = json.hotels;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = hotels;

        if(json.totalNum > 0){
            $("#hotelTable").parent("div").prev("div").find("button").show();
            // $("#hotelTable").parent("div").parent("div").show();
        }else{
            $("#hotelTable").parent("div").prev("div").find("button").hide();
            // $("#hotelTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    hotelTable = $("#hotelTable").DataTable(tb);
}


function getGatherInfoCount(){
    if(gatherCount == gatherCountNum){
        $("#gatherInfoCount").text(gatherInfoCount);
        if(countSum != 0){
            $("#countSum").text(countSum + gatherInfoCount);
        }
    }

}
