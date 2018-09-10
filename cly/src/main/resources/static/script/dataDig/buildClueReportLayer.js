$.buildReportLayer = $.buildReportLayer || {};

(function($){

    "use strict";

    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;

    $(document).ready(function() {

        setDefaultTime();
    });

    /**
     * 设置页面默认时间
     */
    function setDefaultTime() {
        var nowDate = new Date();
        // var startDayDateTime = nowDate.getTime();
        // var startDayDateStr = $.date.dateToStr(new Date(startDayDateTime), "yyyy-MM-dd HH");
        $.laydate.setTime(Number(nowDate), "#dataTime");

        $("#createTimeLong").text($.date.dateToStr(nowDate, "yyyy年MM月dd日 HH:mm"));
    }

    /**
     * 导出word报告
     */
    function saveReport(){

        var date = $.laydate.getTime("#dataTime", "date");
        //验证文档名称
        var demo = $.validform.getValidFormObjById("reportNameValidform") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return;
        }

        var obj = {};
        var param = {
            name : $("#reportName").val() ,
            startTimeLong : date
        };
        $.util.objToStrutsFormData(param, "param", obj);

        $.util.topWindow().$.common.showOrHideLoading(true);
        $.ajax({
            url: context + "/clueReport/saveClueReportWord",
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:false,//设置是否loading
            },
            success:function(successData){
                $.util.topWindow().$.common.showOrHideLoading(false);
                var fileId = successData.attachmentId;
                if(successData.status){
                    var win = $.util.rootWindow();
                    win.$.fileId = fileId;
                    $.util.topWindow().$.layerAlert.alert({icon:6, closeBtn:false, msg:"生成文档成功。", yes:function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({icon:5, closeBtn:false, msg:"生成文档失败。", yes:function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗
                    }});
                }
            },
            error:function(errorData){
                $.util.topWindow().$.common.showOrHideLoading(false);
            }
        });
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.buildReportLayer, {
        saveReport : saveReport
    });
})(jQuery);