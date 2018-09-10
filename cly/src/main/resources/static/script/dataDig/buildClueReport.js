$.buildReport = $.buildReport || {};

(function($){

    "use strict";

    var clueReportTable = null;// 群体报告表

    $(document).ready(function() {

        /**
         * 重置
         */
        $(document).on("click","#reset",function(){
            $.laydate.reset("#dateRangeSearch");
            clueReportTable.draw(true);
        });

        /**
         * 查询
         */
        $(document).on("click","#search",function () {
            clueReportTable.draw(true);
        });

        /**
         * 新增
         */
        $(document).on("click","#addReport",function(){
            alertCreateReportPage();
        });

        /**
         * 导出
         */
        $(document).on("click","#report",function(){
            var form = $.util.getHiddenForm(context+'/testReport/testReportWord', {});
            $.util.subForm(form);
        });

        /**
         * 下载附件
         */
        $(document).on("click",".download",function(){
            var fileId = $(this).attr("fileId");
            var form = $.util.getHiddenForm(context+'/dataDigReport/downloadAttachment', {fileId : fileId});
            $.util.subForm(form);
        });

        /**
         * 删除
         */
        $(document).on("click",".deleteReport",function(){
            var dataId = $(this).attr("dataId");
            var wordFileId = $(this).attr("wordFileId");
            $.util.topWindow().$.layerAlert.confirm({
                msg:"删除后不可恢复，确定要删除吗？",
                title:"删除",	  //弹出框标题
                width:'300px',
                hight:'200px',
                shade: [0.5,'black'],  //遮罩
                icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
                shift:1,  //弹出时的动画效果  有0-6种
                yes:function(index, layero){
                    //点击确定按钮后执行
                    deleteReportById(dataId, wordFileId);
                }
            });
        });

        initClueReportTable();
    });

    /**
     * 弹出生成报告页面
     */
    function alertCreateReportPage() {
        var win = $.util.rootWindow();
        win.$.fileId = null;
        $.util.topWindow().$.layerAlert.dialog({
            content : context +  '/show/page/web/dataDig/buildClueReportLayer',
            pageLoading : true,
            title:"新增线索报告",
            width : "758px",
            height : "300px",
            btn:["生成","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.buildReportLayer ;
                    cm.saveReport();
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
            },
            end:function(){
                clueReportTable.draw(true);
                downloadReportWord();
            }
        });
    }

    /**
     * 删除报告
     *
     * @param dataId 报告id
     * @param wordFileId 报告Word附件id
     */
    function deleteReportById(dataId, wordFileId){
        $.ajax({
            url:context +'/clueReport/deleteClueReportById',
            data:{dataId : dataId, wordFileId : wordFileId},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                clueReportTable.draw(true);
                if(successData.status){
                    $.util.topWindow().$.layerAlert.alert({icon:6, msg:"删除成功。"}) ;
                }else{
                    $.util.topWindow().$.layerAlert.alert({icon:5, msg:"删除失败。"}) ;
                }
            }
        });
    }

    /**
     * 初始化群体报告表
     */
    function initClueReportTable() {
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context + "/clueReport/findClueReportByPage";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "",
                "title": "序号",
                "data": "id" ,
                "render": function ( data, type, full, meta ) {
                    return meta.row + 1;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "报告生成时间",
                "data" : "createTimeTime",
                "render" : function(data, type, full, meta) {
                    if($.util.isBlank(data)){
                        return "";
                    }else{
                        return $.date.timeToStr(data, "yyyy年MM月dd日 HH:mm");
                    }
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "报告名称",
                "data" : "reportName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "操作",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    var td = '<p class="text-center">';
                    if(!$.util.isBlank(full.wordFileId)){
                        td += '<button dataId="' + full.id + '" fileId="' + full.wordFileId + '" class="btn btn-default btn-xs download">报告下载</button>';
                    }
                    td += '<button dataId="' + full.id + '" wordFileId="' + full.wordFileId + '" class="btn btn-default btn-xs deleteReport">删除</button>';
                    td += '</p>';
                    return td;
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
        //每页条数
        tb.lengthMenu = [ 10 ];
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
            d = getSearchParamObj(d);
        };
        tb.paramsResp = function(json) {
            var crps = json.crps;
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = crps;

            if(crps != null && crps.length > 0) {
            }
        };
        tb.rowCallback = function(row,data, index) {

        };
        clueReportTable = $("#clueReportTable").DataTable(tb);
    }

    /**
     * 获取查询条件参数
     */
    function getSearchParamObj(d) {
        var endTimeLong = $.laydate.getTime("#dateRangeSearch", "end");
        var obj = {
            startTimeLong : $.laydate.getTime("#dateRangeSearch", "start") ,
            endTimeLong : $.date.endRangeByTime(endTimeLong, "yyyy-MM-dd") ,
            start : d.start ,
            length : d.length
        }
        $.util.objToStrutsFormData(obj, "param", d);
        return d;
    }

    /**
     * 下载生成的报告
     *
     * @param fileId 附件id
     */
    function downloadReportWord() {
        var win = $.util.rootWindow();
        var fileId = win.$.fileId;
        if(!$.util.isBlank(fileId)){
            var form = $.util.getHiddenForm(context+'/dataDigReport/downloadAttachment', {fileId : fileId});
            $.util.subForm(form);
        }
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.buildReport, {

    });
})(jQuery);