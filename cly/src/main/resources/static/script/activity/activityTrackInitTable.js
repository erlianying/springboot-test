var trainTable = null;// 铁路订票
var airlineTable = null;// 民航订票
var busTable = null;// 长途客运订票
var bjPassTable = null;// 进京证办理

var hotelTable = null;// 旅馆住宿
var checkTable = null;// 在京核录信息
var checkPointTable = null;// 在京核录信息
var netbarTable = null;// 网吧上网信息

var foodTable = null;// 外卖信息
var changAnTable = null;// 长安数据
var bookcarTable = null;// 约车信息
var houseTable = null;// 短租信息
var bikeTable = null;// 共享单车信息
var shoppingTable = null;// 购物信息
var elenctronicTable = null;// 12数据
var wifiTable = null;// 04数据

var noPetitionTable = null;// 非访情况
var normalPetitionTable = null;// 正常访情况

var gatherTrainTable = null;// 聚团铁路订票
var gatherAirlineTable = null;// 聚团民航订票
var gatherHotelTable = null;// 聚团旅馆住宿
var gatherNetbarTable = null;// 聚团旅馆上网
var gatherCheckPointTable = null;// 聚团进京检查站（核录）


var allNationTrainTable = null;// 全国铁路订票
var allNationAirlineTable = null;// 全国民航订票
var allNationChangAnTable = null;// 全国长安数据

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
        d = $.activityTrackCompareResult.getQueryParam(d);
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
        // {
        //     "targets" : 2,
        //     "width" : "10%",
        //     "title" : "订票时间",
        //     "data" : "orderTime",
        //     "render" : function(data, type, full, meta) {
        //         if($.util.isBlank(data)){
        //             return "";
        //         }else{
        //             return $.date.timeToStr(data, "yyyy年MM月dd日");
        //         }
        //     }
        // },
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
        // {
        //     "targets" : 6,
        //     "width" : "15%",
        //     "title" : "到达时间",
        //     "data" : "arrivedTimeLong",
        //     "render" : function(data, type, full, meta) {
        //         if($.util.isBlank(data)){
        //             return "";
        //         }else{
        //             return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
        //         }
        //     }
        // },
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
        d = $.activityTrackCompareResult.getQueryParam(d);
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
        // {
        //     "targets" : 4,
        //     "width" : "10%",
        //     "title" : "车厢号",
        //     "data" : "boxNumber",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        // {
        //     "targets" : 5,
        //     "width" : "10%",
        //     "title" : "座位号",
        //     "data" : "seatNumber",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
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
        d = $.activityTrackCompareResult.getQueryParam(d);
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
    if(gatherNetbarTable != null) {
        gatherNetbarTable.destroy();
    }
    $("#gatherNetbarTable").empty();
    $("#gatherNetbarInfo").hide();
    var obj = new Object();
    obj = $.activityTrackCompareResult.getQueryParam(obj);
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
    if(gatherHotelTable != null) {
        gatherHotelTable.destroy();
    }
    $("#gatherHotelTable").empty();

    $("#gatherHotelInfo").hide();
    var obj = new Object();
    obj = $.activityTrackCompareResult.getQueryParam(obj);
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
        // {
        //     "targets" : 2,
        //     "width" : "10%",
        //     "title" : "联系电话",
        //     "data" : "phone",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
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
    if(gatherCheckPointTable != null) {
        gatherCheckPointTable.destroy();
    }
    $("#gatherCheckPointTable").empty();
    $("#gatherCheckPointInfo").hide();
    var obj = new Object();
    obj = $.activityTrackCompareResult.getQueryParam(obj);
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
        // {
        //     "targets" : 5,
        //     "width" : "10%",
        //     "title" : "校录时间",
        //     "data" : "",
        //     "render" : function(data, type, full, meta) {
        //         return "";
        //     }
        // },
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
 * 初始化聚团民航订票信息列表
 */
function initGatherAirlineTable(){
    if(gatherAirlineTable != null) {
        gatherAirlineTable.destroy();
    }
    $("#gatherAirlineTable").empty();
    $("#gatherAirlineInfo").hide();
    var obj = new Object();
    obj = $.activityTrackCompareResult.getQueryParam(obj);
    $.ajax({
        url:context + "/activityCompare/findGatherAirlineTrackByPage",
        data:obj,
        type:'post',
        success:function(map){
            getGatherAirlineTable(map.airline);
            $("#gatherAirlineInfo").text("查询结果：共计"+map.gatherCount+"个团"+map.airline.length+"人。");
            $("#gatherAirlineInfo").show();

            gatherCount++;
            gatherInfoCount += map.airline.length;
            getGatherInfoCount();
        }
    })
}
function getGatherAirlineTable(tableInfoLst) {
    var tb = $.uiSettings.getLocalOTableSettings();
    $.util.log(tb);
    tb.data = tableInfoLst;
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
        // {
        //     "targets" : 6,
        //     "width" : "15%",
        //     "title" : "到达时间",
        //     "data" : "arrivedTimeLong",
        //     "render" : function(data, type, full, meta) {
        //         if($.util.isBlank(data)){
        //             return "";
        //         }else{
        //             return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
        //         }
        //     }
        // },
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
    tb.ordering = false;
    tb.paging = true; //分页是否
    tb.hideHead = false; //是否隐藏表头
    tb.searching = false; //是否有查询输入框
    tb.info = true; //是否显示详细信息
    tb.bProcessing = true;//是否显示loading效果
    tb.lengthMenu = [ 5 ]; //每页条数
    tb.lengthChange = false; //是否可以改变每页显示条数

    gatherAirlineTable = $("#gatherAirlineTable").DataTable(tb);
}

/**
 * 初始化聚团铁路订票信息列表
 */
function initGatherTrainTable(){
    if(gatherTrainTable != null) {
        gatherTrainTable.destroy();
    }
    $("#gatherTrainTable").empty();
    $("#gatherTrainInfo").hide();
    var obj = new Object();
    obj = $.activityTrackCompareResult.getQueryParam(obj);
    $.ajax({
        url:context + "/activityCompare/findGatherTrainTrackByPage",
        data:obj,
        type:'post',
        success:function(map){
            getGatherTrainTable(map.trains);
            $("#gatherTrainInfo").text("查询结果：共计"+map.gatherCount+"个团"+map.trains.length+"人。");
            $("#gatherTrainInfo").show();
            gatherCount++;
            gatherInfoCount += map.trains.length;
            getGatherInfoCount();

        }
    })
}
function getGatherTrainTable(tableInfoLst) {
    var tb = $.uiSettings.getLocalOTableSettings();
    $.util.log(tb);
    tb.data = tableInfoLst;
    tb.columnDefs = [
        {
            "targets" : 0,
            "width" : "10%",
            "title" : "订票人姓名",
            "data" : "name",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "20%",
            "title" : "订票人身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "10%",
            "title" : "预定车次",
            "data" : "trainNumber",
            "render" : function(data, type, full, meta) {
                var tr = '<span class="fa fa-train color-blue marr-10"></span>' + data ;
                return tr;
            }
        },
        {
            "targets" : 3,
            "width" : "10%",
            "title" : "起始站",
            "data" : "startStation",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data ;
            }
        },
        {
            "targets" : 4,
            "width" : "10%",
            "title" : "到达站",
            "data" : "arrivedStation",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data ;
            }
        },
        // {
        //     "targets" : 4,
        //     "width" : "10%",
        //     "title" : "车厢号",
        //     "data" : "boxNumber",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        // {
        //     "targets" : 5,
        //     "width" : "10%",
        //     "title" : "座位号",
        //     "data" : "seatNumber",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        {
            "targets" : 5,
            "width" : "20%",
            "title" : "发车时间",
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
            "width" : "20%",
            "title" : "到达时间",
            "data" : "arrivedTimeLong",
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
    gatherTrainTable = $("#gatherTrainTable").DataTable(tb);
}

/**
 * 初始化非访情况
 */
function initNormalPetitionTable(){
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findNormalPetitionByPage";
    tb.columnDefs = [
        {
            "targets" : 0,
            "width" : "20%",
            "title" : "姓名",
            "data" : "name",
            "render" : function(data, type, full, meta) {
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
            "title" : "性别",
            "data" : "sexName",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        // {
        //     "targets" : 3,
        //     "width" : "15%",
        //     "title" : "民族",
        //     "data" : "nationName",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        {
            "targets" : 3,
            "width" : "20%",
            "title" : "户籍地",
            "data" : "unit",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) || data == "NULL"  ? "" : data;
            }
        },
        {
            "targets" : 4,
            "width" : "20%",
            "title" : "上访时间",
            "data" : "petitionTimeLong",
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var normalPetitions = json.normalPetitions;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = normalPetitions;

        if(json.totalNum > 0){
            $("#normalPetitionTable").parent("div").prev("div").find("button").show();
            // $("#shoppingTable").parent("div").parent("div").show();
        }else{
            $("#normalPetitionTable").parent("div").prev("div").find("button").hide();
            // $("#shoppingTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    normalPetitionTable = $("#normalPetitionTable").DataTable(tb);
}

/**
 * 初始化非访情况
 */
function initNoPetitionTable(){
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findNoPetitionByPage";
    tb.columnDefs = [
        {
            "targets" : 0,
            "width" : "20%",
            "title" : "姓名",
            "data" : "name",
            "render" : function(data, type, full, meta) {
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
            "title" : "手机号",
            "data" : "phone",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    var phoneArr = data.split(",");
                    var phoneStr = "";
                    for(var i=0;i<phoneArr.length;i++){
                        phoneStr += phoneArr[i];
                        if(i < phoneArr.length - 1){
                            phoneStr += "、";
                            if(i % 2 != 0){
                                phoneStr += "</br>";
                            }
                        }
                    }
                    return phoneStr;
                }
            }
        },
        // {
        //     "targets" : 3,
        //     "width" : "15%",
        //     "title" : "非访类别",
        //     "data" : "type",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        {
            "targets" : 3,
            "width" : "20%",
            "title" : "上访地点",
            "data" : "petitionAddr",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 4,
            "width" : "20%",
            "title" : "上访时间",
            "data" : "petitionTimeLong",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        // {
        //     "targets" : 6,
        //     "width" : "20%",
        //     "title" : "说明",
        //     "data" : "description",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // }
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var noPetitions = json.noPetitions;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = noPetitions;

        if(json.totalNum > 0){
            $("#noPetitionTable").parent("div").prev("div").find("button").show();
            // $("#shoppingTable").parent("div").parent("div").show();
        }else{
            $("#noPetitionTable").parent("div").prev("div").find("button").hide();
            // $("#shoppingTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    noPetitionTable = $("#noPetitionTable").DataTable(tb);
}

/**
 * 初始化04数据信息
 */
function initWifiTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findWifiFenceByPage";
    tb.columnDefs = [
        {
            "targets" : 0,
            "width" : "35%",
            "title" : "身份证号码",
            "data" : "identity",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "30%",
            "title" : "手机号码",
            "data" : "phone",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "35%",
            "title" : "采集时间",
            "data" : "collectTimeLong",
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var wifiFences = json.wifiFences;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = wifiFences;

        if(json.totalNum > 0){
            $("#wifiTable").parent("div").prev("div").find("button").show();
            // $("#shoppingTable").parent("div").parent("div").show();
        }else{
            $("#wifiTable").parent("div").prev("div").find("button").hide();
            // $("#shoppingTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    wifiTable = $("#wifiTable").DataTable(tb);
}

/**
 * 初始化12总（电子围栏）信息
 */
function initElenctronicTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findElenctronicFenceByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "25%",
            "title": "人员姓名",
            "data": "personName" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "25%",
            "title" : "身份证号码",
            "data" : "identity",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "25%",
            "title" : "手机号码",
            "data" : "phone",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 3,
            "width" : "25%",
            "title" : "采集时间",
            "data" : "collectTimeLong",
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var elenctronicFences = json.elenctronicFences;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = elenctronicFences;

        if(json.totalNum > 0){
            $("#elenctronicTable").parent("div").prev("div").find("button").show();
            // $("#shoppingTable").parent("div").parent("div").show();
        }else{
            $("#elenctronicTable").parent("div").prev("div").find("button").hide();
            // $("#shoppingTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    elenctronicTable = $("#elenctronicTable").DataTable(tb);
}

/**
 * 初始化购物信息
 */
function initShoppingTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findShoppingByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "10%",
            "title": "寄件人姓名",
            "data": "sendPersonName" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "10%",
            "title" : "寄件人手机号码",
            "data" : "sendPersonPhone",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "10%",
            "title" : "寄件时间",
            "data" : "sendTime",
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
            "title" : "寄件地址",
            "data" : "sendPersonAddress",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 4,
            "width" : "10%",
            "title" : "收件人姓名",
            "data" : "name",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 5,
            "width" : "10%",
            "title" : "收件人电话",
            "data" : "phone",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 6,
            "width" : "20%",
            "title" : "收件人地址",
            "data" : "receiveAddress",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 7,
            "width" : "10%",
            "title" : "数据来源",
            "data" : "",
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var shoppings = json.shoppings;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = shoppings;

        if(json.totalNum > 0){
            $("#shoppingTable").parent("div").prev("div").find("button").show();
            // $("#shoppingTable").parent("div").parent("div").show();
        }else{
            $("#shoppingTable").parent("div").prev("div").find("button").hide();
            // $("#shoppingTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    shoppingTable = $("#shoppingTable").DataTable(tb);
}

/**
 * 初始化共享单车信息
 */
function initBikeTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findBikeByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "20%",
            "title": "骑行人姓名",
            "data": "name" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "20%",
            "title" : "身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "20%",
            "title" : "手机号码",
            "data" : "phone",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 3,
            "width" : "20%",
            "title" : "开始时间",
            "data" : "startTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        // {
        //     "targets" : 4,
        //     "width" : "20%",
        //     "title" : "出发地经纬度",
        //     "data" : "startAddress",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        {
            "targets" : 4,
            "width" : "20%",
            "title" : "所属区县",
            "data" : "endAddress",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        // {
        //     "targets" : 4,
        //     "width" : "20%",
        //     "title" : "数据来源",
        //     "data" : "source",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        // {
        //     "targets" : 7,
        //     "width" : "10%",
        //     "title" : "用户ID",
        //     "data" : "sourceUserId",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // }
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var bikes = json.bikes;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = bikes;

        if(json.totalNum > 0){
            $("#bikeTable").parent("div").prev("div").find("button").show();
            // $("#bikeTable").parent("div").parent("div").show();
        }else{
            $("#bikeTable").parent("div").prev("div").find("button").hide();
            // $("#bikeTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    bikeTable = $("#bikeTable").DataTable(tb);
}

/**
 * 初始化短租信息
 */
function initHouseTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findHouseByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "20%",
            "title": "租房人姓名",
            "data": "name" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "20%",
            "title" : "身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "20%",
            "title" : "联系电话",
            "data" : "phone",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 3,
            "width" : "20%",
            "title" : "起租时间",
            "data" : "startTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        // {
        //     "targets" : 4,
        //     "width" : "10%",
        //     "title" : "退租时间",
        //     "data" : "endTime",
        //     "render" : function(data, type, full, meta) {
        //         if($.util.isBlank(data)){
        //             return "";
        //         }else{
        //             return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
        //         }
        //     }
        // },
        {
            "targets" : 4,
            "width" : "20%",
            "title" : "租住地址",
            "data" : "address",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        // {
        //     "targets" : 4,
        //     "width" : "20%",
        //     "title" : "数据来源",
        //     "data" : "source",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        // {
        //     "targets" : 7,
        //     "width" : "10%",
        //     "title" : "用户ID",
        //     "data" : "sourceUserId",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // }
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var houses = json.houses;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = houses;

        if(json.totalNum > 0){
            $("#houseTable").parent("div").prev("div").find("button").show();
            // $("#houseTable").parent("div").parent("div").show();
        }else{
            $("#houseTable").parent("div").prev("div").find("button").hide();
            // $("#houseTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    houseTable = $("#houseTable").DataTable(tb);
}

/**
 * 查询长安数据
 */
function initChangAnTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findChangAnByPage";
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var changAns = json.changAns;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = changAns;

        if(json.totalNum > 0){
            $("#changAnTable").parent("div").prev("div").find("button").show();
        }else{
            $("#changAnTable").parent("div").prev("div").find("button").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    changAnTable = $("#changAnTable").DataTable(tb);
}

/**
 * 查询约车信息
 */
function initBookcarTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findBookcarByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "20%",
            "title": "约车人姓名",
            "data": "name" ,
            "render": function ( data, type, full, meta ) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "20%",
            "title" : "身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "20%",
            "title" : "联系电话",
            "data" : "phone",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 3,
            "width" : "20%",
            "title" : "发车时间",
            "data" : "startTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        // {
        //     "targets" : 4,
        //     "width" : "10%",
        //     "title" : "下车时间",
        //     "data" : "endTime",
        //     "render" : function(data, type, full, meta) {
        //         if($.util.isBlank(data)){
        //             return "";
        //         }else{
        //             return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
        //         }
        //     }
        // },
        // {
        //     "targets" : 5,
        //     "width" : "15%",
        //     "title" : "出发地",
        //     "data" : "startAddress",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        {
            "targets" : 4,
            "width" : "20%",
            "title" : "目的地",
            "data" : "endAddress",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        // {
        //     "targets" : 4,
        //     "width" : "20%",
        //     "title" : "数据来源",
        //     "data" : "source",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        // {
        //     "targets" : 8,
        //     "width" : "10%",
        //     "title" : "用户ID",
        //     "data" : "sourceUserId",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // }
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var bookcars = json.bookcars;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = bookcars;

        if(json.totalNum > 0){
            $("#bookcarTable").parent("div").prev("div").find("button").show();
            // $("#bookcarTable").parent("div").parent("div").show();
        }else{
            $("#bookcarTable").parent("div").prev("div").find("button").hide();
            // $("#bookcarTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    bookcarTable = $("#bookcarTable").DataTable(tb);
}

/**
 * 初始化外卖信息
 */
function initFoodTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findFoodByPage";
    tb.columnDefs = [
        {
            "targets": 0,
            "width": "10%",
            "title": "收件人姓名",
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
            "title" : "联系电话",
            "data" : "phone",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 3,
            "width" : "15%",
            "title" : "订单时间",
            "data" : "orderTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                }
            }
        },
        {
            "targets" : 4,
            "width" : "35%",
            "title" : "收件地址",
            "data" : "address",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 5,
            "width" : "10%",
            "title" : "数据来源",
            "data" : "source",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        // {
        //     "targets" : 6,
        //     "width" : "10%",
        //     "title" : "用户ID",
        //     "data" : "sourceUserId",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // }
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var foods = json.foods;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = foods;

        if(json.totalNum > 0){
            $("#foodTable").parent("div").prev("div").find("button").show();
            // $("#foodTable").parent("div").parent("div").show();
        }else{
            $("#foodTable").parent("div").prev("div").find("button").hide();
            // $("#foodTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    foodTable = $("#foodTable").DataTable(tb);
}

/**
 * 初始化网吧上网信息列表
 */
function initNetbarTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findNetbarByPage";
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
        d = $.activityTrackCompareResult.getQueryParam(d);
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
    tb.ajax.url = context + "/activityCompare/findCheckByPage";
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
        // {
        //     "targets" : 5,
        //     "width" : "10%",
        //     "title" : "校录时间",
        //     "data" : "",
        //     "render" : function(data, type, full, meta) {
        //         return "";
        //     }
        // },
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
        d = $.activityTrackCompareResult.getQueryParam(d);
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
    tb.ajax.url = context + "/activityCompare/findCheckPinitByPage";
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
        // {
        //     "targets" : 5,
        //     "width" : "10%",
        //     "title" : "校录时间",
        //     "data" : "",
        //     "render" : function(data, type, full, meta) {
        //         return "";
        //     }
        // },
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
        d = $.activityTrackCompareResult.getQueryParam(d);
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
    tb.ajax.url = context + "/activityCompare/findHotelTrackByPage";
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
        // {
        //     "targets" : 2,
        //     "width" : "10%",
        //     "title" : "联系电话",
        //     "data" : "phone",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
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
        d = $.activityTrackCompareResult.getQueryParam(d);
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

/**
 * 初始化进京证办理信息列表
 */
function initBjPassTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findBjPassByPage";
    tb.columnDefs = [
        {
            "targets" : 0,
            "width" : "25%",
            "title" : "办理人姓名",
            "data" : "name",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "25%",
            "title" : "身份证号/驾驶证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "25%",
            "title" : "车牌号",
            "data" : "plateNumber",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        // {
        //     "targets" : 3,
        //     "width" : "20%",
        //     "title" : "发动机号",
        //     "data" : "engineNumber",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        {
            "targets" : 3,
            "width" : "25%",
            "title" : "申请时间",
            "data" : "transactTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日");
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var bjPassList = json.bjPassList;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = bjPassList;

        if(json.totalNum > 0){
            $("#bjPassTable").parent("div").prev("div").find("button").show();
            // $("#bjPassTable").parent("div").parent("div").show();
        }else{
            $("#bjPassTable").parent("div").prev("div").find("button").hide();
            // $("#bjPassTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    bjPassTable = $("#bjPassTable").DataTable(tb);
}

/**
 * 初始化长途客运订票信息列表
 */
function initBusTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findBusTrackByPage";
    tb.columnDefs = [
        {
            "targets" : 0,
            "width" : "10%",
            "title" : "订票人姓名",
            "data" : "reserveName",
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
            "title" : "到达站",
            "data" : "arrivedStation",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 3,
            "width" : "15%",
            "title" : "采集时间",
            "data" : "collectTime",
            "render" : function(data, type, full, meta) {
                if($.util.isBlank(data)){
                    return "";
                }else{
                    return $.date.timeToStr(data, "yyyy年MM月dd日");
                }
            }
        },
        {
            "targets" : 4,
            "width" : "45%",
            "title" : "采集地检查站名",
            "data" : "collectStation",
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var busList = json.busList;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = busList;

        if(json.totalNum > 0){
            $("#busTable").parent("div").prev("div").find("button").show();
            // $("#busTable").parent("div").parent("div").show();
        }else{
            $("#busTable").parent("div").prev("div").find("button").hide();
            // $("#busTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    busTable = $("#busTable").DataTable(tb);
}

/**
 * 初始化民航订票信息列表
 */
function initAirlineTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findAirlineTrackByPage";
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
        // {
        //     "targets" : 2,
        //     "width" : "10%",
        //     "title" : "订票时间",
        //     "data" : "orderTime",
        //     "render" : function(data, type, full, meta) {
        //         if($.util.isBlank(data)){
        //             return "";
        //         }else{
        //             return $.date.timeToStr(data, "yyyy年MM月dd日");
        //         }
        //     }
        // },
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
        // {
        //     "targets" : 6,
        //     "width" : "15%",
        //     "title" : "到达时间",
        //     "data" : "arrivedTimeLong",
        //     "render" : function(data, type, full, meta) {
        //         if($.util.isBlank(data)){
        //             return "";
        //         }else{
        //             return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
        //         }
        //     }
        // },
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var airlines = json.airlines;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = airlines;

        if(json.totalNum > 0){
            $("#airlineTable").parent("div").prev("div").find("button").show();
            // $("#airlineTable").parent("div").parent("div").show();
        }else{
            $("#airlineTable").parent("div").prev("div").find("button").hide();
            // $("#airlineTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    airlineTable = $("#airlineTable").DataTable(tb);
}

/**
 * 初始化铁路订票信息列表
 */
function initTrainTable() {
    var tb = $.uiSettings.getOTableSettings();
    tb.ajax.url = context + "/activityCompare/findTrainTrackByPage";
    tb.columnDefs = [
        {
            "targets" : 0,
            "width" : "10%",
            "title" : "订票人姓名",
            "data" : "name",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 1,
            "width" : "20%",
            "title" : "订票人身份证号",
            "data" : "idcard",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data;
            }
        },
        {
            "targets" : 2,
            "width" : "10%",
            "title" : "预定车次",
            "data" : "trainNumber",
            "render" : function(data, type, full, meta) {
                var tr = '<span class="fa fa-train color-blue marr-10"></span>' + data ;
                return tr;
            }
        },
        {
            "targets" : 3,
            "width" : "10%",
            "title" : "起始站",
            "data" : "startStation",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data ;
            }
        },
        {
            "targets" : 4,
            "width" : "10%",
            "title" : "到达站",
            "data" : "arrivedStation",
            "render" : function(data, type, full, meta) {
                return $.util.isBlank(data) ? "" : data ;
            }
        },
        // {
        //     "targets" : 4,
        //     "width" : "10%",
        //     "title" : "车厢号",
        //     "data" : "boxNumber",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        // {
        //     "targets" : 5,
        //     "width" : "10%",
        //     "title" : "座位号",
        //     "data" : "seatNumber",
        //     "render" : function(data, type, full, meta) {
        //         return $.util.isBlank(data) ? "" : data;
        //     }
        // },
        {
            "targets" : 5,
            "width" : "20%",
            "title" : "发车时间",
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
            "width" : "20%",
            "title" : "到达时间",
            "data" : "arrivedTimeLong",
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
        d = $.activityTrackCompareResult.getQueryParam(d);
    };
    tb.paramsResp = function(json) {
        var trains = json.trains;
        json.recordsTotal = json.totalNum;
        json.recordsFiltered = json.totalNum;
        json.data = trains;

        if(json.totalNum > 0){
            $("#trainTable").parent("div").prev("div").find("button").show();
            // $("#trainTable").parent("div").parent("div").show();
        }else{
            $("#trainTable").parent("div").prev("div").find("button").hide();
            // $("#trainTable").parent("div").parent("div").hide();
        }
    };
    tb.rowCallback = function(row,data, index) {

    };
    trainTable = $("#trainTable").DataTable(tb);
}

function getGatherInfoCount(){
    if(gatherCount == 5){
        $("#gatherInfoCount").text(gatherInfoCount);
        if(countSum != 0){
            $("#countSum").text(countSum + gatherInfoCount);
        }
    }

}
