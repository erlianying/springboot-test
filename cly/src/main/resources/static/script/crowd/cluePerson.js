(function($){
    "use strict";

    var clueTable = null;

    $(document).ready(function() {

        events();
        initClueTable();
    });

    function events(){

        $(document).on("click",".btnView",function() {
            $("#useLastPage").val("true");
            window.location = context + '/show/page/web/crowd/viewClueLayer?clueId=' + $(this).attr("ClueId");
        });
    }

    /**
     * 查询
     */
    function initClueTable(){
        if(clueTable != null){
            clueTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        var functionName = "/crowd/findCluePersons";
        tb.ajax.url = context + functionName;
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "写入时间",
                "data" : "writeTimeString",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return data;
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "线索内容",
                "data" : "content",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        if(data.length > 6){
                            var str = '<div class="fi-ceng-out">' + data.substr(0,6) + '...' +
                                '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                            return str;
                        }else{
                            return data;
                        }
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "操作",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    var str = '<a href="###" class="btn btn-default btn-xs btnView" clueId=' + data + ">查看</a>";
                    return str;
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
        //是否分页
        tb.paging = true;
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
            /*
            var obj = new Object();

            obj.dataTime = "来文时间"==$("#startTimeInput").val()?"":$("#startTimeInput").val();
            //obj.insideOutside = "局内局外"==$("#officeInsideOutsideQuery").val()?"":$("#officeInsideOutsideQuery").val();
            //obj.unit = "单位"==$("#unitQuery").val()?"":$("#unitQuery").val();
            obj.insideOutside = $("#officeInsideOutsideQuery option:selected").text();
            obj.unit = $("#unitQuery option:selected").text();
            obj.originalNumber = "原编号"==$("#numberQuery").val()?"":$("#numberQuery").val();
            obj.title = "关键字"==$("#contentQuery").val()?"":$("#contentQuery").val();
            //$("#pageStart").val(d.start);
            $.util.objToStrutsFormData(obj, "srp", d);
            //$.util.objToStrutsFormData("false", "myClue", d);
            */

        };
        tb.paramsResp = function(json) {
            json.data = json.clueList;
            json.recordsFiltered = json.clueList.length;
            json.recordsTotal = json.clueList.length;
        };
        tb.rowCallback = function(row,data, index) {

        };
        clueTable = $("#clueTable").DataTable(tb);
    }

})(jQuery);