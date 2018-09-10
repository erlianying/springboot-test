$.bjqb = $.bjqb || {};
$.bjqb.personnelDetail = $.bjqb.personnelDetail || {};
(function ($) {
    "use strict";

    var table = null;   //上访记录table
    var trainJoinBeijingLocusTable = null; //火车table
    var airplaneJoinBeijingLocusTable = null; //飞机table
    var carJoinBeijingLocusTable = null; //长途汽车table
    var beijingToPermitLocusTable = null; //进京证table
    var phoneNumbers = [];
    var name;
    // personId = "33";    //TODO 删除此数据  在页面获取

    $(document).ready(function () {
        if($.util.isEmpty(personId)){
            $.util.topWindow().$.layerAlert.alert({icon:5, msg:"人员不存在！",yes:function(){
                history.go(-1);
            }}) ;
        }else{
            initDatas();
            initTrainJoinBeijingLocusTable();//火车table
            initAirplaneJoinBeijingLocusTable();//飞机table
            initCarJoinBeijingLocusTable();//长途汽车table
            initBeijingToPermitLocusTable();//进京证table
        }

        $(document).on("click" , "#searchBtn", function(e){
            queryTable();
        });
    });

    function  queryTable() {

        $("#tableTatalNum").text("...");
        var query = "输入姓名或身份证号" == $("#query").val() ? null : $("#query").val();
        if(query) {
            query = trim(query);
        }
        var data = {
            "query":query,
            "start":0,
            "length":1
        };
        var obj = new Object();
        $.util.objToStrutsFormData(data, "hrskpersonPramaterPojo", obj);
        $.ajax({
            url:context +'/personManage/findHrskpersonByParameter',
            data:obj,
            type:'post',
            success:function(successData){
                if(!successData.pageList || successData.pageList.length <= 0){
                    $.util.topWindow().$.layerAlert.alert({icon:5, msg:"人员不存在！"}) ;
                    return false;
                }
                personId = successData.pageList[0].id;
                clearData();
                initDatas();
                initTrainJoinBeijingLocusTable();//火车table
                initAirplaneJoinBeijingLocusTable();//飞机table
                initCarJoinBeijingLocusTable();//长途汽车table
                initBeijingToPermitLocusTable();//进京证table
            }
        })
    }

    function trim(str){
        return str.replace(/^\s+|\s+$/g,'');
    }
    /**
     * 进京轨迹中的  查询  按钮
     */
    $(document).on("click","#inBeijingQuery",function(){
        trainJoinBeijingLocusTable.draw(); //火车table
        airplaneJoinBeijingLocusTable.draw(); //飞机table
        carJoinBeijingLocusTable.draw(); //长途汽车table
        beijingToPermitLocusTable.draw(); //进京证table
    })

    /**
     * 进京轨迹中的  重置  按钮
     */
    $(document).on("click","#inBeijingReset",function(){
        $('#defaultChecked').iCheck('check');
        $.laydate.reset("#dateRangeId");
        $("#customDate").hide();
        trainJoinBeijingLocusTable.draw(); //火车table
        airplaneJoinBeijingLocusTable.draw(); //飞机table
        carJoinBeijingLocusTable.draw(); //长途汽车table
        beijingToPermitLocusTable.draw(); //进京证table
    })

    $(document).on("ifChecked","#custom",function(){
        $("#customDate").show();
    })

    $(document).on("ifUnchecked","#custom",function(){
        $("#customDate").hide();
    })

    function initDatas() {
        $.ajax({
            url: context + '/personMessageManage/queryPersonDetail',
            data: {
                "personId": personId
            },
            type: "post",
            dataType: "json",
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (map) {
                var datas = map.hrskpersonPojo;
                var crowds = datas.hrskpersonCrowdList;
                if (datas.whiteListStatus == "是") {
                    $("#whiteList").show();
                }
                $("#personNmae").text($.util.isEmpty(datas.name) ? "未知" : datas.name);
                $("#personSex").text($.util.isEmpty(datas.sex) ? "未知" : datas.sex);
                $("#idnumber").text($.util.isEmpty(datas.idnumber) ? "未知" : datas.idnumber);
                $("#age").text(datas.age);
                $("#nation").text($.util.isEmpty(datas.nation) ? "未知" : datas.nation);
                $("#city").text($.util.isEmpty(datas.province) ? "未知" : datas.province);
                $("#address").text($.util.isEmpty(datas.permanentAddress) ? "未知" : datas.permanentAddress);
                $("#remarkOne").text($.util.isEmpty(datas.remarkOne) ? "无" : datas.remarkOne);
                $("#remarkTwo").text($.util.isEmpty(datas.remarkTwo) ? "无" : datas.remarkTwo);
                $("#remarkThree").text($.util.isEmpty(datas.remarkThree) ? "无" : datas.remarkThree);
                $("#personDataSource").text($.util.isEmpty(datas.personnelDataSource) ? "未知" : datas.personnelDataSource);
                $("#communicationDataSource").text($.util.isEmpty(datas.communicationDateSource) ? "未知" : datas.communicationDateSource);
                $("#createTime").text($.util.isEmpty(datas.createDate) ? "" : datas.createDate);
                $("#updateTime").text($.util.isEmpty(datas.updateTime) ? "" : datas.updateTime);
                if(!$.util.isEmpty(map.photo)){
                    $("#defaltImg").hide();
                    $("#img").append("<img id='idPhoto' src='data:image:/png;base64,"+map.photo+"' width=\"200\">");
                }else{
                    $("#idPhoto").remove();
                    $("#defaltImg").show();
                }
                if (!$.util.isEmpty(datas.phoneNumbers)) {
                    phoneNumbers = datas.phoneNumbers;
                    $.each(phoneNumbers, function (index, val) {
                        appendNumbers("#phoneNumber", val)
                    })
                }
                if (!$.util.isEmpty(datas.qqnumbers)) {
                    var qqNumber = datas.qqnumbers;
                    $.each(qqNumber, function (index, val) {
                        appendNumbers("#qqNumber", val)
                    })
                }
                if (!$.util.isEmpty(datas.weChatNumbers)) {
                    var weChatNumber = datas.weChatNumbers;
                    $.each(weChatNumber, function (index, val) {
                        appendNumbers("#weChatNumber", val)
                    })
                }
                idnumber = $.util.isEmpty(datas.idnumber) ? null : datas.idnumber;
                name  = $.util.isEmpty(datas.personName) ? null : datas.personName;

                if(!$.util.isEmpty(map.aklx)){
                    var arr = map.aklx.split(",");
                    $.each(arr,function(index,d){
                        $("#criminalRecord").append('<span class="state state-yellow2">'+ d +'</span>');
                    })
                }else{
                    $("#criminalRecord").append('<span class="state state-yellow2">无</span>');
                }

                if(!$.util.isEmpty(map.hrskPersonType)){
                        var arr = map.hrskPersonType.split(";");
                        $.each(arr,function(index,d){
                            $("#hrskPersonType").append("<span class='state state-blue2'>"+d+"</span>");
                        })
                }else{
                        $("#hrskPersonType").append("<span class='state state-blue2'>无</span>");
                }
                appendCrowdInfo(crowds);
                findPetitionRegister(idnumber);
            }
        });
    }

    function clearData(){
        $("#phoneNumber").empty();
        $("#qqNumber").empty();
        $("#weChatNumber").empty();
        $("#crowd").empty();
        $("#hrskPersonType").empty();
        $("#criminalRecord").empty();
    }

    /**
     * 组装qq,微信,电话号码
     * @param id    标签id
     * @param number 值
     */
    function appendNumbers(id, number) {
        $(id).append("<li>" + number + "</li>")
    }

    /**
     * 组装群体数据
     * @param crowds 群体数据
     */
    function appendCrowdInfo(crowds){
        $.each(crowds,function(index,val){

            if(val.whetherBackbone == "重点人员"){
              var html = '<p>' +
                            '<span class="state state-red2" >'+val.crowdType+'</span>' +
                            '<span class="state state-red2" >'+val.crowdName+'</span>';
                if(!$.util.isEmpty(val.personnelSubclassOne)){
                    html += '<span class="state state-red2" >'+val.personnelSubclassOne+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassTwo)){
                    html += '<span class="state state-red2" >'+val.personnelSubclassTwo+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassThree)){
                    html += '<span class="state state-red2" >'+val.personnelSubclassThree+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassFour)){
                    html += '<span class="state state-red2" >'+val.personnelSubclassFour+'</span>' ;
                }
                html += '<span class="state state-circle  state-red1" >骨干</span></p>' ;
                $("#crowd").append(html);
            }else{
                var html = '<p>' +
                            '<span class="state state-green2" >'+val.crowdType+'</span>' +
                            '<span class="state state-green2" >'+val.crowdName+'</span>';
                if(!$.util.isEmpty(val.personnelSubclassOne)){
                    html += '<span class="state state-green2" >'+val.personnelSubclassOne+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassTwo)){
                    html += '<span class="state state-green2" >'+val.personnelSubclassTwo+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassThree)){
                    html += '<span class="state state-green2" >'+val.personnelSubclassThree+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassFour)){
                    html += '<span class="state state-green2" >'+val.personnelSubclassFour+'</span>' ;
                }
                html += '<span class="state state-circle  state-blue1" >一般成员</span></p>' ;
                $("#crowd").append(html);
            }
        })
    }

    function findPetitionRegister(idNumber){
        var data = {
            idNumber: idNumber,
        }
        var obj = new Object();
        $.util.objToStrutsFormData(data, "petitionRegisteParameter", obj);
        $.ajax({
            url: context + '/personMessageManage/findpetitionRegister',
            data:obj,
            type: "post",
            dataType: "json",
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (map) {
                initTable(map.petitionRegister);
            }
        })
    }

    /**
     * 初始化上访table
     */
    function initTable(tableInfoLst){
        if(table != null) {
            table.destroy();
        }
        $("#sfcs").text("曾上访次数"+tableInfoLst.length+"次");
        var tb = $.uiSettings.getLocalOTableSettings();
        $.util.log(tb);
        tb.data = tableInfoLst;
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "50px",
                "title": "序号",
                "data": "" ,
                "render": function ( data, type, full, meta ) {
                    return meta.row+1;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "上访时间",
                "data" : "petitionDateStr",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "上访地点",
                "data" : "position",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "上访性质",
                "data" : "nature",
                "render" : function(data, type, full, meta) {
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
        tb.lengthMenu = [ 5 ];
        table = $("#petitioningInfo").DataTable(tb);
    }

    /**
     * 初始化 火车进京轨迹  table
     */
    function initTrainJoinBeijingLocusTable(){
        if(trainJoinBeijingLocusTable != null) {
            trainJoinBeijingLocusTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personMessageManage/trainJoinBeijingLocus";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "预定车次",
                "data" : "trainNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "起始站",
                "data" : "startStation",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" :2,
                "width" : "",
                "title" : "到达站",
                "data" : "arrivedStation",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "发车时间",
                "data" : "startTimeStr",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "到达时间",
                "data" : "arrivedTimeStr",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "车厢号",
                "data" : "boxNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "座位号",
                "data" : "seatNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }

        ];
        //是否排序
        tb.ordering = false ;
        //是否分页
        tb.paging = true;
        //每页条数
        tb.lengthMenu = [ 5 ];
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var arr = $.icheck.getChecked("inBeijing");
            if($(arr[0]).val()=="自定义"){
                var startTime = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start")+" 00:00:00";
                var endTime = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end")+" 23:59:59";
                var obj = {"id":personId,
                    "type":$(arr[0]).val(),
                    "startTime":startTime,
                    "endTime":endTime
                };
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }else{
                var obj = {"id":personId,"type":$(arr[0]).val()};
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }
        };
        tb.paramsResp = function(json) {
            json.data = json.trainTrackPojo;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
            $("#trainInBeijing").text(json.totalNum);
        };
        trainJoinBeijingLocusTable = $("#trainTable").DataTable(tb);
    }

    /**
     * 初始化 飞机进京轨迹  table
     */
    function initAirplaneJoinBeijingLocusTable(){
        if(airplaneJoinBeijingLocusTable != null) {
            airplaneJoinBeijingLocusTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personMessageManage/airplaneJoinBeijingLocus";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "订票时间",
                "data" : "orderTimeStr",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "航班信息",
                "data" : "flightNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "起始航站",
                "data" : "startTerminal",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "到达航站",
                "data" : "arrivedTerminal",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "起飞时间",
                "data" : "startTimeStr",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "到达时间",
                "data" : "arrivedTimeStr",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "状态",
                "data" : "ticketStatus",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            }

        ];
        //是否排序
        tb.ordering = false ;
        //是否分页
        tb.paging = true;
        //每页条数
        tb.lengthMenu = [ 5 ];
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var arr = $.icheck.getChecked("inBeijing");
            if($(arr[0]).val()=="自定义"){
                var startTime = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start")+" 00:00:00";
                var endTime = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end")+" 23:59:59";
                var obj = {"id":personId,
                    "type":$(arr[0]).val(),
                    "startTime":startTime,
                    "endTime":endTime
                };
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }else{
                var obj = {"id":personId,"type":$(arr[0]).val()};
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }
        };
        tb.paramsResp = function(json) {
            json.data = json.airlineTrackPojo;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
            $("#airplaneInBeijing").text(json.totalNum);
        };
        airplaneJoinBeijingLocusTable = $("#airplaneTable").DataTable(tb);
    }

    /**
     * 初始化 长途客车进京轨迹  table
     */
    function initCarJoinBeijingLocusTable(){
        if(carJoinBeijingLocusTable != null) {
            carJoinBeijingLocusTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personMessageManage/carJoinBeijingLocus";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "",
                "title": "采集时间",
                "data": "collectTimeStr" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "到达站",
                "data" : "arrivedStation",
                "render" : function(data, type, full, meta) {

                    return "<span class=\"fa fa-bus color-blue marr-10\"></span>" + $.util.isEmpty(data) ? "" : data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "采集地检查站名",
                "data" : "collectStation",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            }

        ];
        //是否排序
        tb.ordering = false ;
        //是否分页
        tb.paging = true;
        //每页条数
        tb.lengthMenu = [ 5 ];
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var arr = $.icheck.getChecked("inBeijing");
            if($(arr[0]).val()=="自定义"){
                var startTime = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start")+" 00:00:00";
                var endTime = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end")+" 23:59:59";
                var obj = {"id":personId,
                    "type":$(arr[0]).val(),
                    "startTime":startTime,
                    "endTime":endTime
                };
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }else{
                var obj = {"id":personId,"type":$(arr[0]).val()};
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }
        };
        tb.paramsResp = function(json) {
            json.data = json.bausTrackPojo;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
            $("#carInBeijing").text(json.totalNum);
        };
        carJoinBeijingLocusTable = $("#carTable").DataTable(tb);
    }

    /**
     * 初始化 进京证轨迹  table
     */
    function initBeijingToPermitLocusTable(){
        if(beijingToPermitLocusTable != null) {
            beijingToPermitLocusTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personMessageManage/beijingToPermitLocus";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "",
                "title": "机动车牌号",
                "data": "plateNumber" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "驾驶证号",
                "data" : "drivingNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "申请时间",
                "data" : "transactTimeStr",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            }

        ];
        //是否排序
        tb.ordering = false ;
        //是否分页
        tb.paging = true;
        //每页条数
        tb.lengthMenu = [ 5 ];
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var arr = $.icheck.getChecked("inBeijing");
            if($(arr[0]).val()=="自定义"){
                var startTime = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start")+" 00:00:00";
                var endTime = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end")+" 23:59:59";
                var obj = {"id":personId,
                    "type":$(arr[0]).val(),
                    "startTime":startTime,
                    "endTime":endTime
                };
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }else{
                var obj = {"id":personId,"type":$(arr[0]).val()};
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }
        };
        tb.paramsResp = function(json) {
            json.data = json.bjPassPojo;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
            $("#beijingToPermit").text(json.totalNum);
        };
        beijingToPermitLocusTable = $("#beijingToPermitTable").DataTable(tb);
    }

    /**
     * ***************************************************************************************************************************
     * **********************************************人员相关线索----start**********************************************
     * ***************************************************************************************************************************
     */

    var clueTable = null;

    $(document).on(function(){

    })

    $(document).on("click","#clueQuery",function(){
        clueTable.draw();
    });

    $(document).on("click","#clueReset",function(){
        $('#clueDefaultChecked').iCheck('check');
        $.laydate.reset("#clueDateRangeId");
        $("#clueDate").hide();
        $("#clueContent").val("");
        $.select2.val("#targetSiteOne","");
        $.select2.val("#targetSiteTwo","");
        $.select2.val("#targetSiteThree","");
    });

    $(document).on("ifChecked","#clueCustom",function(){
        $("#clueDate").show();
    })

    $(document).on("ifUnchecked","#clueCustom",function(){
        $("#clueDate").hide();
    })

    $(document).on("select2:select","#targetSiteOne, #targetSiteTwo",function(){
        var tsType = $("#targetSiteOne").select2("val");
        var tsArea = $("#targetSiteTwo").select2("val");
        $.select2.empty("#targetSiteThree");
        if($.util.isBlank(tsType) || $.util.isBlank(tsType)){
            return;
        }
        $.ajax({
            url:context +'/clue/findTargetSiteByTypeAndArea',
            type:'post',
            data:{tsType : tsType,
                tsArea : tsArea},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#targetSiteThree", true);
                $.select2.addByList("#targetSiteThree", successData, "id", "name", true, true);
            }
        });
    });
    $(document).on("select2:unselect","#targetSiteOne, #targetSiteTwo",function(){
        $.select2.empty("#targetSiteThree", true);
    });

    /**
     *线索 tabs 点击事件
     */
    $(document).on("click","#clueTabs",function(){
        if(clueTable == null){
            initItm();
            initClueTable();
        }
    });

    /**
     * 初始化 指向地点 一级和二级
     */
    function initItm(){
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_ZXDDLX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#targetSiteOne", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_ZXDDQY},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#targetSiteTwo", successData, "id", "name", true, true);
            }
        });
    }

    function initClueTable(){

        if(clueTable != null) {
            clueTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/crowdManage/queryClueByPersonIdNumber";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "线索内容",
                "data" : "content",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "来源地",
                "data" : "sourceUnitTwoName",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "主责单位",
                "data" : "mainUnit",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "指向时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {

                    return $.date.timeToStr(data,"yyyy-MM-dd HH:mm:ss");
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSiteBeanList",
                "render" : function(data, type, full, meta) {
                    var info = "";
                    $.each(data,function(index, val){
                        info += val.typeName+","
                    })
                    return $.util.isBlank(info)?"":info.substr(0,info.length-1);
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "行为方式",
                "data" : "wayOfActTwoName",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "办理状态",
                "data" : "statusName",
                "render" : function(data, type, full, meta) {

                    return data;
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
        //自动列宽
        tb.autoWidth = true ;
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var arr = $.icheck.getChecked("clue");
            if($(arr[0]).val()=="自定义"){
                var startTime = $.laydate.getDate("#dateRangeId","start") == null ? null : $.date.strToTime($.laydate.getDate("#dateRangeId","start")+" 00:00:00");
                var endTime = $.laydate.getDate("#dateRangeId","end") == null ? null : $.date.strToTime($.laydate.getDate("#dateRangeId","end")+" 23:59:59");
                var obj = {"idNumber":idnumber,
                    "type":$(arr[0]).val(),
                    "startTimeOneLong":startTime,
                    "startTimeTwoLong":endTime,
                    "targetSiteType": $.select2.val("#targetSiteOne"),
                    "targetSiteArea": $.select2.val("#targetSiteTwo"),
                    "targetSiteSite": $.select2.val("#targetSiteThree"),
                    "content": $("#clueContent").val()
                };
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }else{
                var obj = {"idNumber":idnumber,
                    "type":$(arr[0]).val(),
                    "targetSiteType": $.select2.val("#targetSiteOne"),
                    "targetSiteArea": $.select2.val("#targetSiteTwo"),
                    "targetSiteSite": $.select2.val("#targetSiteThree"),
                    "content": $("#clueContent").val()
                };
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }
        };
        tb.paramsResp = function(json) {
            json.data = json.clue;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
        };
        clueTable = $("#clueTable").DataTable(tb);
    }

    /**
     * ***************************************************************************************************************************
     * **********************************************人员相关线索----end**********************************************
     * ***************************************************************************************************************************
     */

    $(document).on("click" , "#onJingTrack", function(e){
        $.bjqb.personDetialsInJingTrack.searchClick(idnumber);
    });

    $(document).on("click" , "#onJingSearchBtn", function(e){
        $.bjqb.personDetialsInJingTrack.searchClick(idnumber);
    });

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.bjqb.personnelDetail, {
        getPhoneNumbers:phoneNumbers,
        getIdnumber:idnumber,
        getName : name
    });

})(jQuery);