(function($){
    "use strict";

    var data;
    var messageTable = null;
    $(document).ready(function() {
        var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
        data = frameData.initData.data;
        initMessageTable();
    });

    $(document).on("dblclick","table.table-select tbody tr",function(){
        var clueId = $($($(this).find("td")[0]).find("span")[0]).attr("clueId");
        var messageId = $($($(this).find("td")[0]).find("span")[0]).attr("messageId");
        if(!$.util.isBlank(clueId)){
            $.ajax({
                url: context + '/clueFlow/updateStatusById',
                type: 'post',
                data: {messageId: messageId},
                dataType: 'json',
                success: function (a) {
                    $.util.topWindow().$.common.setIframeLocation(context + '/show/page/web/clue/viewClue?clueId=' + clueId);
                    $.util.topWindow().$.layerAlert.closeAll();
                }
            });
        }
    });

    /**
     * 初始化消息表
     */
    function initMessageTable(){
        if(messageTable != null){
            messageTable.destroy();
        }
        var url = context + "/clueFlow/findMyNewMessage";

        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = url;
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "135px",
                "title" : "督办时间",
                "data" : "createTimeLong",
                "render" : function(data, type, full, meta) {
                    var time = $.date.timeToStr(data, "yyyy-MM-dd HH:mm");
                    var str = '<span messageId=' + full.id + ' clueId=' + full.targetId + '>' + time + '</span>';
                    return str;
                }
            },
            {
                "targets" : 1,
                "width" : "110px",
                "title" : "督办单位",
                "data" : "sendUnitStr",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "内容",
                "data" : "content",
                "render" : function(data, type, full, meta) {
                    if(data.length > 12){
                        var str = '<div class="fi-ceng-out">' + data.substr(0,12) + '...' +
                            '<div class="fi-ceng"><p style="padding: 5px 10px;" clueId='+ full.targetId +'>' + data + '</p></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
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

            var obj = {};
            obj.start = d.start;
            obj.length = d.length;
            $.util.objToStrutsFormData(obj, "mcp", d);
        };
        tb.paramsResp = function(json) {

        };
        tb.rowCallback = function(row,data, index) {

        };
        messageTable = $("#messageTable").DataTable(tb);
    }

})(jQuery);