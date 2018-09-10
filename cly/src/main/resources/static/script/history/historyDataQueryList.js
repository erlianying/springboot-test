(function($){
    "use strict";

    var historyDataTable = null;

    $(document).ready(function() {
        events();
        initData();
    });

    function showHistoryData(dataId){
        window.top.$.layerAlert.dialog({
            content : context + '/show/page/web/history/hisotryData',
            pageLoading : true,
            title:"查看",
            width : "800px",
            height : "700px",
            shadeClose : false,
            initData:function(){
                return $.util.exist(dataId)?dataId:{} ;
            },
            success:function(layero, index){

            },
            end:function(){
            },
            btn:["关闭"],
            callBacks:{
                btn1:function(index, layero){
                    window.top.layer.close(index);
                }
            }
        });
    }

    function updateHistoryData(dataId){
        window.top.$.layerAlert.dialog({
            content : context + '/show/page/web/history/editHisotryData',
            pageLoading : true,
            title:"编辑",
            width : "800px",
            height : "700px",
            shadeClose : false,
            initData:function(){
                return $.util.exist(dataId)?dataId:{} ;
            },
            success:function(layero, index){

            },
            end:function(){
            },
            btn:["保存", "关闭"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                    var historyData = $.util.cloneObj(cm.getData());
                    if(historyData == false){
                        return;
                    }
                    var dataMap = {};
                    $.util.objToStrutsFormData(historyData, "historyData", dataMap);
                    var url = '/historyData/createHistoryData';
                    if(!$.util.isBlank(dataId)){
                        url = '/historyData/updateHistoryData';
                    }
                    $.ajax({
                        url:context + url,
                        type:'post',
                        data:dataMap,
                        dataType:'json',
                        success:function(successData){
                            if(successData){
                                window.top.$.layerAlert.alert({msg:"保存成功！",icon:"1",end : function(){
                                    historyDataTable.draw();
                                    window.top.layer.close(index);
                                }});
                            }
                        }
                    });
                },
                btn2:function(index, layero){
                    window.top.layer.close(index);
                }
            }
        });
    }
    function events(){
        $(document).on("click",".btnQuery",function() {
            historyDataTable.draw();
        });
        $(document).on("click",".btnCreate",function() {
            updateHistoryData();
        });
        $(document).on("click",".btnUpdate",function() {
            updateHistoryData($(this).attr("dataId"));
        });
        $(document).on("click",".btnDelete",function() {
            var dataId = $(this).attr("dataId");
            window.top.$.layerAlert.confirm({
                msg:"删除后不可恢复，确认删除？",
                title:"提示",
                yes:function(index, layero){
                    $.ajax({
                        url:context +'/historyData/deleteHistoryData',
                        type:'post',
                        data:{id : dataId},
                        dataType:'json',
                        success:function(successData){
                            initTable();
                        }
                    });
                }
            });
        });
        $(document).on("click",".btnView",function() {
            showHistoryData($(this).attr("dataId"));
        });
        $(document).on("dblclick","table tbody tr",function(){
            var dataId = $($($(this).find("td")[0]).find("span")[0]).text();
            if(!$.util.isBlank(dataId)){
                showHistoryData(dataId);
            }
        });
    }

    function initData(){
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_LSZL},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#type", successData, "id", "name", true, true);
                initTable();
            }
        });
    }

    /**
     * 初始化表
     */
    function initTable(){
        if(historyDataTable != null){
            historyDataTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context + "/historyData/findHistoryDataPager";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "",
                "title": "序号",
                "data": "id" ,
                "render": function ( data, type, full, meta ) {
                    return '<span style="display: none">' + data + '</span>' + (meta.row + 1);
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "标题",
                "data" : "title",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "类型",
                "data" : "typeName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "录入时间",
                "data" : "createTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd <br/>HH:mm");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "关键字",
                "data" : "keyword",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "创建人",
                "data" : "",
                "render" : function(data, type, full, meta) {
                    return full.createUnitName + "<br/>" + full.createPersonName;
                }
            },
            {
                "targets" : 6,
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
                "targets" : 7,
                "width" : "",
                "title" : "操作",
                "data" : "",
                "render" : function(data, type, full, meta) {
                    if(full.createPerson == personCode){
                        var str = '<p class="text-center">'+
                            '<a href="###" class="btn btn-default btn-xs btnUpdate" dataId="' + full.id + '">修改</a>'+
                            '<a href="###" class="btn btn-default btn-xs btnDelete" dataId="' + full.id + '">删除</a>'+
                            '</p>';
                    }else{
                        var str = '<p class="text-center">'+
                            '<a href="###" class="btn btn-default btn-xs btnView" dataId="' + full.id + '">查看</a>'+
                            '</p>';
                    }
                    return str;
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
        //每页条数
        tb.lengthMenu = [ 10 ] ;
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
            var obj = {};
            obj.title = $("#title").val();
            obj.keyword = $("#keyword").val();
            obj.createTimeStartLong = $.laydate.getTime("#createTime", "start");
            obj.createTimeEndLong = $.date.endRangeByTime($.laydate.getTime("#createTime", "end"),"yyyy-MM-dd HH:mm");
            obj.type = $.select2.val("#type");
            obj.start = d.start;
            obj.length = d.length;
            $.util.objToStrutsFormData(obj, "historyDataQuery", d);
        };
        tb.paramsResp = function(json) {
        };
        tb.drawCallback = function(row,data, index) {
        };
        historyDataTable = $("#historyDataTable").DataTable(tb);
    }

})(jQuery);