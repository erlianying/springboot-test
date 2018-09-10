$.bjqb = $.bjqb || {} ;
$.bjqb.personDetialsInJingTrack = $.bjqb.personDetialsInJingTrack || {} ;
(function($){
    "use strict";
    var hotelTrackTable = null;
    var checkTable = null;
    var netbarTable = null;
    var waWifiFenceTable = null;
    var gaElenctronicFenceTable = null;
    var foodTable = null;
    var bookcarTable = null;
    var houseTable = null;
    var bikeTable = null;
    var shoppingTable = null;
   // var idNumber = "130425199001263419";
    var startTime;
    var endTime;
   // var phoneList = ["15232886372","1352648456"];
    var phoneList = $.bjqb.personnelDetail.getPhoneNumbers;
    $(document).ready(function(){

        // $(document).on("click" , "#onJingSearchBtn", function(e){
        //     searchClick();
        // });

        // $(document).on("click" , "#onJingTrack", function(e){
        //     searchClick();
        // });

        $(document).on("ifChecked","#czJRecentZdy",function(){
            $("#zJCustomDate").show();
        })

        $(document).on("ifUnchecked","#czJRecentZdy",function(){
            $("#zJCustomDate").hide();
        })

    });


    function searchClick(idNumber){
        gitTime();
        hotelInfoLstTable(idNumber);
        createCheckTable(idNumber);
        netbarInfoLstTable(idNumber);
        waWifiFenceInfoLstTable(idNumber);
        gaElenctronicFenceInfoLstTable(idNumber);
        foodInfoLstTable(idNumber);
        bookcarInfoLstTable(idNumber);
        houseInfoLstTable(idNumber);
        bikeInfoLstTable(idNumber);
        shoppingInfoLstTable(idNumber);
    }

    //旅馆住宿信息
    function hotelInfoLstTable(idNumber){
        if(hotelTrackTable != null) {
            hotelTrackTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findHotelTrack',
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "14%",
                "title" : '旅店名称',
                "data" : "hotelName",
                "render" : function(data, type, full, meta) {
                    return data ;
                }
            },
            {
                "targets" : 1,
                "width" : '16%',
                "title" : '旅店地址',
                "data" : "hotelAddress",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" :2,
                "width" : '14%',
                "title" : '所辖分局',
                "data" : "policeUnit",
                "render" : function(data, type, full, meta) {
                    return "";
                }
            },{
                "targets" : 3,
                "width" : '14%',
                "title" : '所辖派出所',
                "data" : "policeStation",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 4,
                "width" : '14%',
                "title" : '入住房间号',
                "data" : "roomNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : '14%',
                "title" : '入住时间',
                "data" : "checkinTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 6,
                "width" : '14%',
                "title" : '离开时间',
                "data" : "leaveTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            }
        ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 3 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "idNumber":idNumber,
                "startTime":startTime,
                "endTime":endTime,
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
            $("#hotelNum").text(json.totalNum);
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        hotelTrackTable = $("#hotelTrack").DataTable(tb);

    }

    //在京核录
    function createCheckTable(idNumber){
        if(checkTable != null) {
            checkTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findCheck',
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "16%",
                "title" : '核录时间',
                "data" : "checkTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd');
                }
            },{
                "targets" : 1,
                "width" : "16%",
                "title" : '核录区域',
                "data" : "inspectArea",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 2,
                "width" : '20%',
                "title" : '核录地址',
                "data" : "address",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 3,
                "width" : '16%',
                "title" : '核录结论',
                "data" : "condition",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 4,
                "width" : '16%',
                "title" : '核录分局',
                "data" : "subBureau",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 5,
                "width" : '16%',
                "title" : '核录派出所',
                "data" : "policeStation",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 3 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "idNumber":idNumber,
                "startTime":startTime,
                "endTime":endTime,
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
            $("#checkNum").text(json.totalNum);
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        checkTable =  $("#check").DataTable(tb);

    }

    //网吧上网
    function netbarInfoLstTable(idNumber){
        if(netbarTable != null) {
            netbarTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findNetbar',
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "16%",
                "title" : "网吧名称",
                "data" : "netbarName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "20%",
                "title" : "网吧地址",
                "data" : "netbarAddress",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "16%",
                "title" : "所属分局",
                "data" : "subBureau",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 3,
                "width" : "16%",
                "title" : "座位号",
                "data" : "seatNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "16%",
                "title" : "上机时间",
                "data" : "startTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd');
                }
            },{
                "targets" : 5,
                "width" : "16%",
                "title" : "下机时间",
                "data" : "endTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd');
                }
            }
        ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 3 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "idNumber":idNumber,
                "startTime":startTime,
                "endTime":endTime,
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
            $("#netbarNum").text(json.totalNum);
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        netbarTable = $("#netbar").DataTable(tb);
    }

    //WIFi围栏
    function waWifiFenceInfoLstTable(idNumber){
        if(waWifiFenceTable != null) {
            waWifiFenceTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findWaWifiFence',
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "33%",
                "title" : "捕获时间",
                "data" : "collectTime",
                "render" : function(data, type, full, meta) {
                    return data +'<input type="hidden" name="id" value="'+full.id+'">';
                }
            },
            {
                "targets" : 1,
                "width" : "33%",
                "title" : '捕获地点',
                "data" : "address",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "33%",
                "title" : "经纬度",
                "data" : "jwd",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 3 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "idNumber":idNumber,
                "startTime":startTime,
                "endTime":endTime,
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
            $("#wifiInfoNum").text(json.totalNum);
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        waWifiFenceTable = $("#wifiInfo").DataTable(tb);
    }

    //电子围栏
    function gaElenctronicFenceInfoLstTable(idNumber){
        if(gaElenctronicFenceTable != null) {
            gaElenctronicFenceTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findGaElenctronicFence',
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "33%",
                "title" : "捕获时间",
                "data" : "collectTime",
                "render" : function(data, type, full, meta) {
                    return data +'<input type="hidden" name="id" value="'+full.id+'">';
                }
            },
            {
                "targets" : 1,
                "width" : "33%",
                "title" : '捕获地点',
                "data" : "address",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "33%",
                "title" : "经纬度",
                "data" : "jwd",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 3 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "idNumber":idNumber,
                "startTime":startTime,
                "endTime":endTime,
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
            $("#gaElenctronicFenceNum").text(json.totalNum);
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        gaElenctronicFenceTable = $("#gaElenctronicFence").DataTable(tb);
    }

    //外卖数据
    function foodInfoLstTable(idNumber){
        if(foodTable != null) {
            foodTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findFood',
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "20%",
                "title" : '联系电话',
                "data" : "phone",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 1,
                "width" : "20%",
                "title" : "订单时间",
                "data" : "orderTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 2,
                "width" : "20%",
                "title" : '收件人地址',
                "data" : "address",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :3,
                "width" : "20%",
                "title" : "数据来源",
                "data" : "source",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :4,
                "width" : "20%",
                "title" : "用户ID",
                "data" : "sourceUserId",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 3 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "idNumber":idNumber,
                "startTime":startTime,
                "endTime":endTime,
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
            $("#foodNum").text(json.totalNum);
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        foodTable = $("#food").DataTable(tb);
    }

    //约车数据
    function bookcarInfoLstTable(idNumber){
        if(bookcarTable != null) {
            bookcarTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findBookcar',
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "14%",
                "title" : "联系电话",
                "data" : "phone",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "14%",
                "title" : "发车时间",
                "data" : "startTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 2,
                "width" : "14%",
                "title" : '下车时间',
                "data" : "endTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 3,
                "width" : "15%",
                "title" : "出发地",
                "data" : "startAddress",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :4,
                "width" : "15%",
                "title" : "目的地",
                "data" : "endAddress",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :5,
                "width" : "14%",
                "title" : "数据来源",
                "data" : "source",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :6,
                "width" : "14%",
                "title" : "用户ID",
                "data" : "sourceUserId",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 3 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "idNumber":idNumber,
                "startTime":startTime,
                "endTime":endTime
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
            $("#bookcarNum").text(json.totalNum);
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        bookcarTable = $("#bookcar").DataTable(tb);
    }

    //短租数据
    function houseInfoLstTable(idNumber){
        if(houseTable != null) {
            houseTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findHouse',
        tb.columnDefs = [
            {
                "targets" :0,
                "width" : "16%",
                "title" : "手机号码",
                "data" : "phone",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 1,
                "width" : "16%",
                "title" : "开始租赁时间",
                "data" : "startTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 2,
                "width" : "16%",
                "title" : '结束租赁时间',
                "data" : "endTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 3,
                "width" : "20%",
                "title" : "租赁地址",
                "data" : "address",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :4,
                "width" : "16%",
                "title" : "数据来源",
                "data" : "source",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :5,
                "width" : "16%",
                "title" : "用户ID",
                "data" : "sourceUserId",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 3 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "idNumber":idNumber,
                "startTime":startTime,
                "endTime":endTime,
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
            $("#houseNum").text(json.totalNum);
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        houseTable = $("#house").DataTable(tb);
    }

    //共享单车数据
    function bikeInfoLstTable(idNumber){
        if(bikeTable != null) {
            bikeTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findBike',
        tb.columnDefs = [
            {
                "targets" :0,
                "width" : "16%",
                "title" : "手机号码",
                "data" : "phone",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 1,
                "width" : "16%",
                "title" : "开始时间",
                "data" : "startTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 2,
                "width" : "18%",
                "title" : "出发地经纬度",
                "data" : "startAddress",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :3,
                "width" : "18%",
                "title" : "目的地经纬度",
                "data" : "endAddress",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :4,
                "width" : "16%",
                "title" : "数据来源",
                "data" : "source",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :5,
                "width" : "16%",
                "title" : "用户ID",
                "data" : "sourceUserId",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [ 10 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "idNumber":idNumber,
                "startTime":startTime,
                "endTime":endTime,
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            console.log(json);
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
            $("#bikeNum").text(json.totalNum);
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        bikeTable = $("#bike").DataTable(tb);
    }

    //网上购物
    function shoppingInfoLstTable(idNumber){
        if(shoppingTable != null) {
            shoppingTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personDetialsManage/findShopping',
        tb.columnDefs = [
            {
                "targets" :0,
                "width" : "12%",
                "title" : "寄件人姓名",
                "data" : "sendPersonName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" :1,
                "width" : "12%",
                "title" : "寄件人电话",
                "data" : "sendPersonPhone",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 2,
                "width" : "12%",
                "title" : "寄件时间",
                "data" : "sendTime",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                }
            },
            {
                "targets" : 3,
                "width" : "12%",
                "title" : "寄件地址",
                "data" : "sendPersonAddress",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 4,
                "width" : "12%",
                "title" : "收件人姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :5,
                "width" : "12%",
                "title" : "收件人电话",
                "data" : "phone",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :6,
                "width" : "16%",
                "title" : "收件人地址",
                "data" : "receiveAddress",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :7,
                "width" : "12%",
                "title" : "数据来源",
                "data" : "",
                "render" : function(data, type, full, meta) {
                    return "";
                }
            }
        ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.lengthMenu = [3]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "idNumber":idNumber,
                "startTime":startTime,
                "endTime":endTime,
            };
            $.util.objToStrutsFormData(obj, "trackParameter", d);
        };
        tb.paramsResp = function(json) {
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
            $("#shoppingNum").text(json.totalNum);
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        shoppingTable = $("#shopping").DataTable(tb);
    }

    function getHalfYearTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*30*6;
    }

    function getThreeMonthTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*30*3;
    }

    function getWeekTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*7;
    }

    function getMonthTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*30;
    }

    function getThreeDayTime (){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*3;
    }

    function getAllDayTime (){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*30*24;  //24个月
    }

    function getOneDayTime (){
        var date = new Date();
        endTime = new Date().getTime();
        date.setHours(0,0,0,0);
        startTime = date.getTime();
    }
    function getZdyTime(){
        var startDate = $.laydate.getDate("#crowdTrackDateRangeId","start") == null ? null : $.laydate.getDate("#crowdTrackDateRangeId","start");
        if(startDate){
            startTime =  new Date(startDate).getTime();
        }else{
            startTime =  0;
        }

        var endDate = $.laydate.getDate("#crowdTrackDateRangeId","end") == null ? null : $.laydate.getDate("#crowdTrackDateRangeId","end");
        if(endDate){
            endDate = $.date.endRange(endDate,"yyyy-MM-dd");
            endTime =  new Date(endDate).getTime();
        }else{
            endTime =  new Date().getTime();
        }
    }

//     id="zJRecentThreeDay" checked="checked"> 近三天
//         <input type="radio" class="icheckradio" name="timeGroup" id="zJRecentWeek"> 近1周 &nbsp;
// <input type="radio" class="icheckradio" name="timeGroup" id="zJRecentMonth"> 近1月 &nbsp;
// <input type="radio" class="icheckradio" name="timeGroup" id="zJRecentThreeMonth"> 近3月 &nbsp;
// <input type="radio" class="icheckradio" name="timeGroup" id="zJRecentHalfYear"> 近半年 &nbsp
    function gitTime(){
        var id = $("#perdonIJTrackTime .checked .icheckradio").attr("id");
        if(id == "crowdTrackToday"){
            getOneDayTime();
        }else if(id == "zJRecentThreeDay"){
            getThreeDayTime();
        }else if(id == "zJRecentWeek"){
            getWeekTime();
        }else if(id == "zJRecentMonth"){
            getMonthTime();
        }else if(id == "zJRecentThreeMonth"){
            getThreeMonthTime();
        }else if(id == "zJRecentHalfYear"){
            getHalfYearTime();
        }else if(id == "czJRecentZdy"){
            getZdyTime();
        }else if(id == "zJRecentAllDay"){
            getAllDayTime();
        }
    }

    $("input").on("ifChecked",function(){
        var id = $(this).attr("id");
        if(id == "czJRecentZdy"){
            $("#zJCustomDate").show();
        }else{
            $("#zJCustomDate").hide();
            $.laydate.reset("#crowdTrackDateRangeId");
        }
    })



    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.bjqb.personDetialsInJingTrack, {
        searchClick : searchClick,
    });
})(jQuery);