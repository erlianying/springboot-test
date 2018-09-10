$.relationDetails = $.relationDetails || {};

(function($){

    "use strict";

    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;

    var trainTraceTable = null;
    var planeTraceTable = null;
    var hotelTraceTable = null;
    var netBarTraceTable = null;
    var clueTable = null;
    var crowdTable = null;

    $(document).ready(function() {
        console.log(initData.relationData);
        
        var dataArrObj = initData.relationData.dataArr;
        //初始化火车轨迹列表
        var trainTraceIdArr = [];
        var trainObjArr = dataArrObj[$.common.relationshipAnalysis.TRAIN_TRACK];
        if($.util.exist(trainObjArr)){
            $.each(trainObjArr, function (i, val) {
                trainTraceIdArr.push(val.traceDataId);
            });
            findTrainTrace(trainTraceIdArr);
        }else{
            initTrainTraceTable([]);
        }
        //初始化飞机轨迹列表
        var planeTraceIdArr = [];
        var planeObjArr = dataArrObj[$.common.relationshipAnalysis.PLANE_TRACK];
        if($.util.exist(planeObjArr)){
            $.each(planeObjArr, function (i, val) {
                planeTraceIdArr.push(val.traceDataId);
            });
            findPlaneTrace(planeTraceIdArr);
        }else{
            initPlaneTraceTable([]);
        }
        //初始化网吧上网轨迹列表
        var netBarTraceIdArr = [];
        var netBarObjArr = dataArrObj[$.common.relationshipAnalysis.NET_BAR_TRACK];
        if($.util.exist(netBarObjArr)){
            $.each(netBarObjArr, function (i, val) {
                netBarTraceIdArr.push(val.traceDataId);
            });
            findNetBarTrace(netBarTraceIdArr);
        }else{
            initNetBarTraceTable([]);
        }
        //初始化旅馆住宿轨迹列表
        var hotelTraceIdArr = [];
        var hotelObjArr = dataArrObj[$.common.relationshipAnalysis.HOTEL_TRACK];
        if($.util.exist(hotelObjArr)){
            $.each(hotelObjArr, function (i, val) {
                hotelTraceIdArr.push(val.traceDataId);
            });
            findHotelTrace(hotelTraceIdArr);
        }else{
            initHotelTraceTable([]);
        }
        //初始化线索列表
        var clueCodeArr = [];
        var clueObjArr = dataArrObj[$.common.relationshipAnalysis.CLUE_TRACK];
        if($.util.exist(clueObjArr)){
            $.each(clueObjArr, function (i, val) {
                clueCodeArr.push(val.code);
            });
            findClue(clueCodeArr);
        }else{
            initClueTable([]);
        }
        //初始化群体列表
        var crowdNameCodeArr = [];
        var crowdObjArr = dataArrObj[$.common.relationshipAnalysis.JOIN_CROWD];
        if($.util.exist(crowdObjArr)){
            $.each(crowdObjArr, function (i, val) {
                crowdNameCodeArr.push(val.codeOfCrowdName);
            });
            findCrowd(crowdNameCodeArr);
        }else{
            initCrowdTable([]);
        }

    });


    /**
     * 查询群体
     */
    function findCrowd(crowdNameCodeArr){
        var obj = {};
        var param = {
            crowdNameCodes : crowdNameCodeArr
        };
        $.util.objToStrutsFormData(param, "param", obj);
        $.ajax({
            url:context +'/dataAnalyse/findCrowdByNameCodes',
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:false,//设置是否loading
            },
            success:function(successData){
                var crowdList = successData.crowdList;
                // crowdList.sort(function(a,b){return a.startTimeLong-b.startTimeLong});
                initCrowdTable(crowdList);
            }
        });
    }

    /**
     * 查询线索
     */
    function findClue(clueCodeArr){
        var obj = {};
        var param = {
            ids : clueCodeArr
        };
        $.util.objToStrutsFormData(param, "param", obj);
        $.ajax({
            url:context +'/dataAnalyse/findClueByCodes',
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:false,//设置是否loading
            },
            success:function(successData){
                var clueList = successData.clueList;
                // clueList.sort(function(a,b){return a.startTimeLong-b.startTimeLong});
                initClueTable(clueList);
            }
        });
    }

    /**
     * 查询网吧上网轨迹
     */
    function findNetBarTrace(traceIdArr){
        var obj = {};
        var param = {
            ids : traceIdArr
        };
        $.util.objToStrutsFormData(param, "param", obj);
        $.ajax({
            url:context +'/dataAnalyse/findNetBarTracesByIds',
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:false,//设置是否loading
            },
            success:function(successData){
                var netBarList = successData.netBarList;
                netBarList.sort(function(a,b){return a.startTimeLong-b.startTimeLong});
                initNetBarTraceTable(netBarList);
            }
        });
    }

    /**
     * 查询旅馆住宿轨迹
     */
    function findHotelTrace(traceIdArr){
        var obj = {};
        var param = {
            ids : traceIdArr
        };
        $.util.objToStrutsFormData(param, "param", obj);
        $.ajax({
            url:context +'/dataAnalyse/findHotelTracesByIds',
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:false,//设置是否loading
            },
            success:function(successData){
                var hotelList = successData.hotelList;
                hotelList.sort(function(a,b){return a.startTimeLong-b.startTimeLong});
                initHotelTraceTable(hotelList);
            }
        });
    }

    /**
     * 查询飞机轨迹
     */
    function findPlaneTrace(traceIdArr){
        var obj = {};
        var param = {
            ids : traceIdArr
        };
        $.util.objToStrutsFormData(param, "param", obj);
        $.ajax({
            url:context +'/dataAnalyse/findPlaneTracesByIds',
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:false,//设置是否loading
            },
            success:function(successData){
                var planeList = successData.planeList;
                planeList.sort(function(a,b){return a.startTimeLong-b.startTimeLong});
                initPlaneTraceTable(planeList);
            }
        });
    }

    /**
     * 查询铁路轨迹
     */
    function findTrainTrace(traceIdArr){
        var obj = {};
        var param = {
            ids : traceIdArr
        };
        $.util.objToStrutsFormData(param, "param", obj);
        $.ajax({
            url:context +'/dataAnalyse/findTrainTracesByIds',
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:false,//设置是否loading
            },
            success:function(successData){
                var trainList = successData.trainList;
                trainList.sort(function(a,b){return a.startTimeLong-b.startTimeLong});
                initTrainTraceTable(trainList);
            }
        });
    }

    /**
     * 初始化群体表格
     */
    function initCrowdTable(dataArray){
        if($.util.exist(crowdTable)){
            crowdTable.destroy();
            $("#crowdTable").empty();
        }
        var st1 = $.uiSettings.getLocalOTableSettings();
        st1.data = dataArray;
        st1.columnDefs = [
            // {
            //     "targets": 0,
            //     "width" : "100px",
            //     "title": "<input type=\"checkbox\"  class=\"icheckbox\" id=\"selectAllBtn\" />&nbsp;&nbsp;全选/取消",
            //     "className":"table-checkbox",
            //     "data": "crowdId" ,
            //     "render": function ( data, type, full, meta ) {
            //         var a = '<input type="checkbox" name="signTr" class="icheckbox rowCheckBoxClass"  />' ;
            //         return a;
            //     }
            // },
            {
                "targets" : 0,
                "width" : "",
                "title" : "序号",
                "data" : "crowdId",
                "render" : function(data, type, full, meta) {

                    return meta.row + 1;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "群体类型",
                "data" : "crowdType",
                "render" : function(data, type, full, meta) {
                    return  '<h2 class="m-ui-infott xiaoshou type ">' + data + '</h2>';
                    // return  data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "群体名称",
                "data" : "crowdName",
                "render" : function(data, type, full, meta) {
                    return  '<h2 class="m-ui-infott xiaoshou aa ">' + data + '</h2>';
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "人员数量",
                "data" : "personCount",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "常住人口",
                "data" : "permanentPopulationCount",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "暂住人口",
                "data" : "transientPopulationCount",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "有手机号码数量",
                "data" : "phoneCount",
                "render" : function(data, type, full, meta) {

                    return $.util.isEmpty(data) ? 0 : data;
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "重点上访人员",
                "data" : "keyPersonPetitioningNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "国家信访局上访人员",
                "data" : "petitionLetterNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            }
        ];
        st1.ordering = false;
        st1.paging = true; // 是否分页
        st1.info = true; // 是否显示表格左下角分页信息
        st1.autoFoot = false;
        st1.dom = null;
        st1.searching = false;
        st1.lengthChange = false;
        st1.lengthMenu = [ 5 ];
        st1.rowCallback = function(row,data, index) {

        };
        crowdTable = $("#crowdTable").DataTable(st1);
    }

    /**
     * 初始化线索表格
     */
    function initClueTable(dataArray){
        if($.util.exist(clueTable)){
            clueTable.destroy();
            $("#clueTable").empty();
        }
        var st1 = $.uiSettings.getLocalOTableSettings();
        st1.data = dataArray;
        st1.columnDefs = [
            {
                "targets": 0,
                "width": "",
                "title": "序号",
                "data": "id" ,
                "render": function ( data, type, full, meta ) {
                    var level = "";
                    if(full.level == $.common.dict.QBJB_YJ){
                        level = "level1";
                    }
                    if(full.level == $.common.dict.QBJB_EJ){
                        level = "level2";
                    }
                    if(full.level == $.common.dict.QBJB_SJ){
                        level = "level3";
                    }
                    return '<span class="fa fa-star ' + level + '" clueId="' + data + '"></span>' + (meta.row + 1);
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "录入时间",
                "data" : "writeTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd <br/>HH:mm:ss");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "来源单位",
                "data" : "sourceUnitTwoName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "涉访群体",
                "data" : "involveCrowdTwoName",
                "render" : function(data, type, full, meta) {
                    if(data.length > 6){
                        var str = '<div class="fi-ceng-out">' + data.substr(0,6) + '...' +
                            '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "内容",
                "data" : "content",
                "render" : function(data, type, full, meta) {
                    if(data.length > 12){
                        var str = '<div class="fi-ceng-out">' + data.substr(0,12) + '...' +
                            '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "指向开始时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSiteBeanList",
                "render" : function(data, type, full, meta) {
                    var str = "";
                    if(data != null){
                        for (var i in data){
                            str += data[i].site + ";";
                        }
                    }
                    if(str != ""){
                        str = str.substr(0, str.length - 1);
                    }
                    if(str.length > 5){
                        var htmlStr = '<div class="fi-ceng-out">' + str.substr(0,5) + '...' +
                            '<div class="fi-ceng"><p style="padding: 5px 10px;">' + str + '</p></div></div>';
                        return htmlStr;
                    }else{
                        return str;
                    }
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "工作进展",
                "data" : "remark",
                "render" : function(data, type, full, meta) {
                    if(data.length > 12){
                        var str = '<div class="fi-ceng-out">' + data.substr(0,12) + '...' +
                            '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "线索状态",
                "data" : "statusName",
                "render" : function(data, type, full, meta) {
                    if(full.irStatusList != null && full.irStatusList.length > 0){
                        var str = '<div class="fi-ceng-out"><span class="ztName">' + data +
                            '</span><div class="fi-ceng fi-ceng-s"><table class="table table-border table-condensed">' +
                            '<thead><tr><th>通报单位</th><th>接收状态</th></tr></thead><tbody>';
                        for(var i in full.irStatusList){
                            var obj = full.irStatusList[i];
                            if(obj.name == "待接收"){
                                str += '<tr>'+
                                    '<td>' + obj.code + '</td>'+
                                    '<td class="fc-red">' + obj.name + '</td>'+
                                    '</tr>';
                            }else{
                                str += '<tr>'+
                                    '<td>' + obj.code + '</td>'+
                                    '<td>' + obj.name + '</td>'+
                                    '</tr>';
                            }
                        }
                        str += '</tbody></table></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
            },
            // {
            //     "targets" : 9,
            //     "width" : "",
            //     "title" : "操作",
            //     "data" : "",
            //     "render" : function(data, type, full, meta) {
            //         var str = '<p class="text-center">'+
            //             '<a href="###" class="btn btn-default btn-xs btnView" clueId="' + full.id + '">查看</a>'+
            //             '</p>';
            //         return str;
            //     }
            // }
        ];
        st1.ordering = false;
        st1.paging = true; // 是否分页
        st1.info = true; // 是否显示表格左下角分页信息
        st1.autoFoot = false;
        st1.dom = null;
        st1.searching = false;
        st1.lengthChange = false;
        st1.lengthMenu = [ 5 ];
        st1.rowCallback = function(row,data, index) {

        };
        clueTable = $("#clueTable").DataTable(st1);
    }

    /**
     * 初始化网吧上网轨迹表格
     */
    function initNetBarTraceTable(dataArray){
        if($.util.exist(netBarTraceTable)){
            netBarTraceTable.destroy();
            $("#netBarTraceTable").empty();
        }
        var st1 = $.uiSettings.getLocalOTableSettings();
        st1.data = dataArray;
        st1.columnDefs = [
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
        st1.ordering = false;
        st1.paging = true; // 是否分页
        st1.info = true; // 是否显示表格左下角分页信息
        st1.autoFoot = false;
        st1.dom = null;
        st1.searching = false;
        st1.lengthChange = false;
        st1.lengthMenu = [ 5 ];
        st1.rowCallback = function(row,data, index) {

        };
        netBarTraceTable = $("#netBarTraceTable").DataTable(st1);
    }

    /**
     * 初始化旅馆住宿轨迹表格
     */
    function initHotelTraceTable(dataArray){
        if($.util.exist(hotelTraceTable)){
            hotelTraceTable.destroy();
            $("#hotelTraceTable").empty();
        }
        var st1 = $.uiSettings.getLocalOTableSettings();
        st1.data = dataArray;
        st1.columnDefs = [
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
        st1.ordering = false;
        st1.paging = true; // 是否分页
        st1.info = true; // 是否显示表格左下角分页信息
        st1.autoFoot = false;
        st1.dom = null;
        st1.searching = false;
        st1.lengthChange = false;
        st1.lengthMenu = [ 5 ];
        st1.rowCallback = function(row,data, index) {

        };
        hotelTraceTable = $("#hotelTraceTable").DataTable(st1);
    }

    /**
     * 初始化飞机轨迹表格
     */
    function initPlaneTraceTable(dataArray){
        if($.util.exist(planeTraceTable)){
            planeTraceTable.destroy();
            $("#planeTraceTable").empty();
        }
        var st1 = $.uiSettings.getLocalOTableSettings();
        st1.data = dataArray;
        st1.columnDefs = [
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
        st1.ordering = false;
        st1.paging = true; // 是否分页
        st1.info = true; // 是否显示表格左下角分页信息
        st1.autoFoot = false;
        st1.dom = null;
        st1.searching = false;
        st1.lengthChange = false;
        st1.lengthMenu = [ 5 ];
        st1.rowCallback = function(row,data, index) {

        };
        planeTraceTable = $("#planeTraceTable").DataTable(st1);
    }

    /**
     * 初始化火车轨迹表格
     */
    function initTrainTraceTable(dataArray){
        if($.util.exist(trainTraceTable)){
            trainTraceTable.destroy();
            $("#trainTraceTable").empty();
        }
        var st1 = $.uiSettings.getLocalOTableSettings();
        st1.data = dataArray;
        st1.columnDefs = [
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
        st1.ordering = false;
        st1.paging = true; // 是否分页
        st1.info = true; // 是否显示表格左下角分页信息
        st1.autoFoot = false;
        st1.dom = null;
        st1.searching = false;
        st1.lengthChange = false;
        st1.lengthMenu = [ 5 ];
        st1.rowCallback = function(row,data, index) {

        };
        trainTraceTable = $("#trainTraceTable").DataTable(st1);
    }


    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.relationDetails, {

    });
})(jQuery);