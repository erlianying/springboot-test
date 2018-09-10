(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData;
    var personTable = null;
    var personData = null;
    $(document).ready(function() {
        initTable();
        event();
    });
    function initTable(){
        if(personTable != null){
            personTable.destroy();
        }
        var url = context + "/clueFlow/findPersonInfoForCheck";
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = url;
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "身份证号",
                "data" : "identityNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "人员属地",
                "data" : "placeOfDomicile",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "手机号",
                "data" : "cellphoneNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "更新时间",
                "data" : "updateTime",
                "render" : function(data, type, full, meta) {
                    if($.util.isBlank(data)){
                        return "";
                    }else{
                        return $.date.timeToStr(data, "yyyy-MM-dd HH:mm");
                    }
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "网络ID类型",
                "data" : "networkIDTypeName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "网络ID",
                "data" : "networkID",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "网络名称",
                "data" : "networkName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "备注",
                "data" : "otherRemark",
                "render" : function(data, type, full, meta) {
                    if(data != null) {
                        if(data.length > 12){
                            var str = '<div class="fi-ceng-out">' + data.substr(0,12) + '...' +
                                '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                            return str;
                        }else{
                            return data;
                        }
                    } else {
                        return "";
                    }
                }
            },
            {
                "targets" : 9,
                "width" : "",
                "title" : "操作",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    return "<a href='###' class='btn btn-default btn-xs addPerson' id='" + data + "'>添加</a>";
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
        //是否分页
        tb.paging = false;
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
            $.util.objToStrutsFormData(initData.str, "queryData", d);
            $.util.objToStrutsFormData(initData.type, "queryType", d);
            $.util.objToStrutsFormData(initData.clueId, "clueId", d);
        };
        tb.paramsResp = function(json) {
            personData = json.data;
        };
        tb.rowCallback = function(row,data, index) {

        };
        personTable = $("#personTable").DataTable(tb);
    }
    function event(){
        $(document).on("click",".addPerson",function(){
            if(personData != null){
                for(var i in personData){
                    if(personData[i].id == $(this).attr("id")){
                        initData.parentCommon.addPerson(personData[i], pageIndex);
                        return;
                    }
                }
            }

        })
    }
})(jQuery);