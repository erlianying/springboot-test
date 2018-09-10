
(function($){
    "use strict";

    var table = null;
    $(document).ready(function (){
        initTable();
        events();
    });

    function events() {
        /**
         * 查询按钮
         */
        $(document).on("click",".query",function(){
            initTable();
        });
         //下载文件
        $(document).on("click",".downloadClass",function(){
            var id=$(this).attr("id");
            window.open(context+"/crowd/downloadAttachment?metaId="+id) ;
        })
        //重置
        $(document).on("click",".reset",function(){
            $.laydate.reset("#startTime");
            table.draw();
        })
    }

    function initTable(){
        if(table != null){
            table.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/trackDataImportController/findTrackDataPageByCondition";
        tb.columnDefs = [
            // {
            //     "targets": 0,
            //     "width": "50px",
            //     "title": "选择",
            //     "className":"table-checkbox",
            //     "data": "id" ,
            //     "render": function ( data, type, full, meta ) {
            //         var a = '<input type="checkbox" name="signTr" class="icheckbox"  />' ;
            //         return a;
            //     }
            // },
            {
                "targets" : 0,
                "width" : "",
                "title" : "编号",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return meta.row + 1;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "导入时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {
                   return $.date.timeToStr(data, "yyyy年MM月dd日 HH:mm:ss");
                }
            },
            // {
            //     "targets" : 2,
            //     "width" : "",
            //     "title" : "导入数据类型",
            //     "data" : "dataType",
            //     "render" : function(data, type, full, meta) {
            //
            //         return data;
            //
            //     }
            // },
            {
                "targets" : 2,
                "width" : "",
                "title" : "导入源文件",
                "data" : "sourceFileName",
                "render" : function(data, type, full, meta) {

                    return  '<a id="'+full.sourceFileId+'" class="downloadClass">' + data + '</a>';
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "日志文件",
                "data" : "errFileName",
                "render" : function(data, type, full, meta) {
                    return  '<a id="'+full.errFileId+'" class="downloadClass">' + data + '</a>';
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
         var obj={};
         obj.startTimeFromLong = $.laydate.getTime("#startTime", "start");
         obj.startTimeToLong = $.date.endRangeByTime($.laydate.getTime("#startTime", "end"),"yyyy-MM-dd HH:mm");
         obj.start = d.start;
         obj.length = d.length;
         obj.dicTypeId="rygl";//人员导入
         $.util.objToStrutsFormData(obj, "importExcelLogListPojo", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.excelLogListPojo;
            json.recordsFiltered = json.totalNumber;
            json.recordsTotal = json.totalNumber;
        };
        table = $("#example1").DataTable(tb);
    }

})(jQuery);