(function($) {
    "use strict";

    var row = 1;
    var table = null;
    var travelTogether = null;
    var hotel = null;
    var extendHotel = null;

    var startTime;
    var endTime;
    var flag = true;

    $(document).ready(function() {
        init();
        $(document).on("click" , "#searchBtn", function(e){
            getTime();
            searchBtnClick();
        });
        $(document).on("click" , "#resetBtn", function(e){
            location.reload();
        });

        $(document).on("click" , "#exportBtn", function(e){

        });
        $(document).on("click" , "#thanExportBtn", function(e){
            thanExport();
        });
    });

    /**
     * 比对导出--临时使用
     */
    function thanExport(){
        var re=/^[1-9][0-9]{0,2}$/;
        var inputVal=$('#dataCount').val();
        if(inputVal==''){//默认一天
            inputVal=1;
        }
        if(!re.test(inputVal)){
            $.layerAlert.alert({msg:"比对导出间隔时间请填写正确数字（长度不超过3位）！"}) ;
            return false ;
        }
        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        if(startDate){
            startTime = new Date(startDate).getTime();
        }else{
            startTime = new Date().getTime();
        }
        var form = $.util.getHiddenForm(context+'/trackExportExcel/thanTrackExport',{inputVal : inputVal,startTime : startTime});
        $.util.subForm(form);

    }

    function searchBtnClick(){

        var trackName = $.select2.val("#crowdName")
        if(!trackName){
            $.layerAlert.alert({msg:"请选择群体！"}) ;
            return false ;
        }

        var arr = $.select2.val("#trackType");
        if(!arr || arr.length <= 0){
            $.layerAlert.alert({msg:"请选择轨迹类型！"}) ;
            return false ;
        }else {
            if($.inArray("gjlx0001",arr) != -1){
                creatCommonTable();
            }
            if($.inArray("gjlx0002",arr) != -1){
                creatTravelTogetherTable();
            }
            if($.inArray("gjlx0003",arr) != -1){
                creatHotelTable();
            }
            if($.inArray("gjlx0004",arr) != -1){
                creatExtendHotelTable();
            }

        }



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
            endTime = endDate;
        }
    }



    function init(){
        $.ajax({
            url:context + '/trackExportManage/findDictionary',
            type:"post",
            dataType:"json",
            success:function(dictionaryEtem){
                initDictionary(dictionaryEtem);
            }
        })

    }

    //初始化查询字典项(群体类型,轨迹类型)。
    function initDictionary(dictionaryEtem){
        $.select2.addByList("#crowdType",dictionaryEtem.crowdType,"id","name",true,true);
        $.select2.addByList("#trackType",dictionaryEtem.trackType,"id","name",true,true);
    }

    //选择群体类型时,级联操作群体名称查询字典项
    $(document).on("select2:select","#crowdType",function(){
        var code = $.select2.val("#crowdType");
            $.ajax({
                url:context +'/personManage/findDictionaryItemsByParentId',
                data:{parentId : code},
                type: "POST",
                global: false,
                success: function (data) {
                    $.select2.empty("#crowdName");
                    $.select2.addByList("#crowdName", data.simplePojos, "code", "name", true, true);
                }
            });
    })

    function creatCommonTable(){
        if(table != null) {
            table.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/trackExportManage/findTrackByTrackExportParameter',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "90px",
                    "title" : "群体类型",
                    "data" : "crowdType",//置顶信息
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 1,
                    "width" : "8%",
                    "title" : "群体名称",
                    "data" : "crowdName",
                    "render" : function(data, type, full, meta) {
                        return  data ;
                    }
                },
                {
                    "targets" : 2,
                    "width" : "25%",
                    "title" : '人员姓名',
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 3,
                    "title" : "身份证号",
                    "data" : "idNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 4,
                    "title" : "检测类型",
                    "data" : "trackType",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 5,
                    "title" : "轨迹信息",
                    "data" : "trackInfo",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 6,
                    "title" : "检测时间",
                    "data" : "startTime",
                    "render" : function(data, type, full, meta) {
                        if(data){
                            return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                        }
                        return "";
                    }
                }
            ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.dom = null;
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.bProcessing = true;//是否显示loading效果
        tb.lengthMenu = [ 10 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "startTime" : startTime,
                "endTime" : endTime,
                "crowdType" : $.select2.val("#crowdType"),
                "crowdName" : $.select2.val("#crowdName"),
            };
            $.util.objToStrutsFormData(obj, "trackExportParameter", d);
        };
        tb.paramsResp = function(json) {
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
            $("#personNumber").text(json.totalNum);
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数
        }
        table = $("#tableId").DataTable(tb);//在哪个table标签中展示这个表格
    }


    function creatTravelTogetherTable(){
        if(travelTogether != null) {
            travelTogether.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/trackExportManage/findTravelTogetherTrackByTrackExportParameter',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "90px",
                    "title" : "序号",
                    "data" : "",//置顶信息
                    "render" : function(data, type, full, meta) {
                        return meta.row +1;
                    }
                },{
                    "targets" : 1,
                    "width" : "90px",
                    "title" : "群体类型",
                    "data" : "crowdType",//置顶信息
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 2,
                    "width" : "8%",
                    "title" : "群体名称",
                    "data" : "crowdName",
                    "render" : function(data, type, full, meta) {
                        return  data ;
                    }
                },
                {
                    "targets" : 3,
                    "width" : "25%",
                    "title" : '人员姓名',
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 4,
                    "title" : "身份证号",
                    "data" : "idNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 5,
                    "title" : "检测类型",
                    "data" : "trackType",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 6,
                    "title" : "轨迹信息",
                    "data" : "trackInfo",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 7,
                    "title" : "检测时间",
                    "data" : "startTime",
                    "render" : function(data, type, full, meta) {
                        if(data){
                            return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                        }
                        return "";
                    }
                }
            ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.dom = null;
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.bProcessing = true;//是否显示loading效果
        tb.lengthMenu = [ 10 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "startTime" : startTime,
                "endTime" : endTime,
                "crowdType" : $.select2.val("#crowdType"),
                "crowdName" : $.select2.val("#crowdName"),
            };
            $.util.objToStrutsFormData(obj, "trackExportParameter", d);
        };
        tb.paramsResp = function(json) {
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数

        }
        travelTogether = $("#travelTogetherId").DataTable(tb);//在哪个table标签中展示这个表格
    }


    function creatHotelTable(){
        if(hotel != null) {
            hotel.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/trackExportManage/findHotelTogetherTrackByTrackExportParameter',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "90px",
                    "title" : "序号",
                    "data" : "",//置顶信息
                    "render" : function(data, type, full, meta) {
                        return meta.row +1;
                    }
                },{
                    "targets" : 1,
                    "width" : "90px",
                    "title" : "群体类型",
                    "data" : "crowdType",//置顶信息
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },{
                    "targets" : 2,
                    "width" : "8%",
                    "title" : "群体名称",
                    "data" : "crowdName",
                    "render" : function(data, type, full, meta) {
                        return  data ;
                    }
                },
                {
                    "targets" : 3,
                    "width" : "25%",
                    "title" : '人员姓名',
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 4,
                    "title" : "身份证号",
                    "data" : "idNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 5,
                    "title" : "旅店名称",
                    "data" : "hotelName",
                    "render" : function(data, type, full, meta) {
                        var str = "";
                        for(var i in data){
                            str += data[i]+",";
                        }
                        if(str.length > 0){
                            str = str.substr(0,str.length - 1);
                        }
                        return str;
                    }
                },
                {
                    "targets" : 6,
                    "title" : "旅店地址",
                    "data" : "address",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 7,
                    "title" : "入住时间",
                    "data" : "startTime",
                    "render" : function(data, type, full, meta) {
                        if(data){
                            return $.date.timeToStr(data,'yyyy-MM-dd hh:mm:ss');
                        }
                        return "";
                    }
                },
                {
                    "targets" : 7,
                    "title" : "入住房间",
                    "data" : "roomNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                }
            ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.dom = null;
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.bProcessing = true;//是否显示loading效果
        tb.lengthMenu = [ 10 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "startTime" : startTime,
                "endTime" : endTime,
                "crowdType" : $.select2.val("#crowdType"),
                "crowdName" : $.select2.val("#crowdName"),
            };
            $.util.objToStrutsFormData(obj, "trackExportParameter", d);
        };
        tb.paramsResp = function(json) {
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数
        }
        hotel = $("#hotelId").DataTable(tb);//在哪个table标签中展示这个表格
    }



    function creatExtendHotelTable(){
        if(extendHotel != null) {
            extendHotel.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +'/personManage/findHrskpersonByParameter',
            tb.columnDefs = [
                {
                    "targets" : 0,
                    "width" : "90px",
                    "title" : "序号",
                    "data" : "",//置顶信息
                    "render" : function(data, type, full, meta) {
                        return ""
                    }
                },{
                    "targets" : 1,
                    "width" : "90px",
                    "title" : "群体类型",
                    "data" : "",//置顶信息
                    "render" : function(data, type, full, meta) {
                        return ""
                    }
                },{
                    "targets" : 2,
                    "width" : "8%",
                    "title" : "群体名称",
                    "data" : "name",
                    "render" : function(data, type, full, meta) {
                        return  "<a class='personId' valId='"+full.id+"' href='###'>"+data+ "</a>" ;
                    }
                },
                {
                    "targets" : 3,
                    "width" : "25%",
                    "title" : '人员姓名',
                    "data" : "idNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 4,
                    "title" : "身份证号",
                    "data" : "province",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 5,
                    "title" : "省份",
                    "data" : "crowdName",
                    "render" : function(data, type, full, meta) {
                        var str = "";
                        for(var i in data){
                            str += data[i]+",";
                        }
                        if(str.length > 0){
                            str = str.substr(0,str.length - 1);
                        }
                        return str;
                    }
                },
                {
                    "targets" : 6,
                    "title" : "旅店名称",
                    "data" : "personnelSubclass",
                    "render" : function(data, type, full, meta) {
                        var str = "";
                        for(var i in data){
                            str += data[i]+",";
                        }
                        if(str.length > 0){
                            str = str.substr(0,str.length - 1);
                        }
                        return str;
                    }
                },
                {
                    "targets" : 7,
                    "title" : "旅店地址",
                    "data" : "phoneNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 8,
                    "title" : "入住时间",
                    "data" : "phoneNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets" : 9,
                    "title" : "入住房间",
                    "data" : "phoneNumber",
                    "render" : function(data, type, full, meta) {
                        return data;
                    }
                }
            ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.dom = null;
        tb.searching = false; //是否有查询输入框
        tb.lengthChange = false; //是否可以改变每页显示条数
        tb.info = true; //是否显示详细信息
        tb.bProcessing = true;//是否显示loading效果
        tb.lengthMenu = [ 10 ]; //每页条数
        tb.paramsReq = function(d, pagerReq){ //传入后台的请求参数
            var obj = {
                "startTime" : startTime,
                "endTime" : endTime,
                "crowdType" : $.select2.val("#crowdType"),
                "crowdName" : $.select2.val("#crowdName"),
            };
            $.util.objToStrutsFormData(obj, "trackExportParameter", d);
        };
        tb.paramsResp = function(json) {
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = json.pageList;
        };
        tb.initComplete = function(){ //表格加载完成后执行的函数
            var api = this.api();
            var rows = api.rows({page:'current'}).nodes();
            var tempData = null;
            var tr = null;
            var num = 1;

            api.column(0, {page: 'current'}).data().each(function (thisData, i) {
                tr = $(rows[i]);
                if (tempData != $("td:eq(8)", tr).text()) {
                    $(".rowspanFlag").attr("rowspan", num);
                    $(".rowspanFlag").attr("class","");
                    num = 1;
                    $("td:eq(6)", tr).addClass("rowspanFlag");
                    $("td:eq(7)", tr).addClass("rowspanFlag");
                    $("td:eq(8)", tr).addClass("rowspanFlag");
                    $("td:eq(0)", tr).addClass("rowspanFlag");
                    tempData = $("td:eq(8)", tr).text();
                } else {
                    $("td:eq(8)", tr).remove();
                    $("td:eq(7)", tr).remove();
                    $("td:eq(6)", tr).remove();
                    $("td:eq(0)", tr).remove();
                    num++;
                }
                if (i == rows.length - 1) {
                    $(".rowspanFlag").attr("rowspan", num);
                    $(".rowspanFlag").attr("class","");
                }
            })
        }
        extendHotel = $("#extendHotelId").DataTable(tb);//在哪个table标签中展示这个表格
    }

})(jQuery);