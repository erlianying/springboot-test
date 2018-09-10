(function($){
    "use strict";
    var personTable = null;
    $(document).ready(function() {
        event();
        initTable();
    });
    function initTable(){
        if(personTable != null){
            personTable.destroy();
        }
        var url = context + "/clueFlow/findPersonInfoForAnalyse";
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
                "title" : "手机号",
                "data" : "cellphoneNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "微信号",
                "data" : "weChatNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "QQ号",
                "data" : "qqNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "人员属地",
                "data" : "placeOfDomicile",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 6,
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
                "targets" : 7,
                "width" : "",
                "title" : "来源",
                "data" : "source",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "操作",
                "data" : "source",
                "render" : function(data, type, full, meta) {
                    if( data == null || data == ""  ) {
                        return "";
                    }
                    if( data == "线索核查") {
                        if( full.sourceId == null || full.sourceId == "") {
                            return "";
                        }
                        return '<button class="btn btn-default btn-sm btnViewClue" clueId="' + full.sourceId + '">' + '线索查看</button>';
                    }
                    if( data == "人员导入") {
                        return '<button class="btn btn-default btn-sm btnViewCluePersonInfo" cluePersonInfoId="' + full.id + '">' + '详情查看</button>';
                    }
                    if( data == "群体监控" ) {
                        return "";
                    }
                    return "";
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
            $.util.objToStrutsFormData($("#identityNumber").val(), "identityNumber", d);
            $.util.objToStrutsFormData($("#cellphoneNumber").val(), "phoneNumber", d);
            var source = $("#source").val();
            var sources = "";
            if(source != null && source != "") {
                for(var i in source) {
                    if(sources != "") {
                        sources += ",";
                    }
                    sources += source[i];
                }
            } else {
                sources = "relevantPerson,hrskperson,cluePersonInfo";
            }
            $.util.objToStrutsFormData(sources, "sources", d);
        };
        tb.paramsResp = function(json) {
        };
        tb.rowCallback = function(row,data, index) {

        };
        personTable = $("#personTable").DataTable(tb);
    }
    function event(){
        $(document).on("click","#query",function(){
            if( ($("#identityNumber").val() == null || $("#identityNumber").val() == "") && ($("#cellphoneNumber").val() == null || $("#cellphoneNumber").val() == "") ) {
                $.util.topWindow().$.layerAlert.alert({msg:"请输入身份证号或手机号!",title:"提示"});
                return;
            } else {
                initTable();
            }
        });

        $(document).on("click",".btnViewClue",function() {
            // window.location = context + '/show/page/web/clue/viewClue?clueId=' + $(this).attr("clueId");
            $.util.topWindow().$.layerAlert.dialog({
                content : context + '/show/page/web/clue/viewClueLayer?clueId=' + $(this).attr("clueId"),
                pageLoading : true,
                title : "关联线索查看",
                width : "1310px",
                height : "800px",
                shadeClose : false
            });
        });

        $(document).on("click",".btnViewCluePersonInfo",function() {
            $.util.topWindow().$.layerAlert.dialog({
                content : context + '/show/page/web/clue/cluePersonInfoLayer',
                pageLoading : true,
                title : "详情查看",
                width : "900px",
                height : "700px",
                shadeClose : false,
                initData:{
                    id : $(this).attr("cluePersonInfoId")
                }
            });
        });
    }
})(jQuery);