$.toBeijingPersonListLayer = $.toBeijingPersonListLayer || {};
(function ($) {

    "use strict";

    var frameData = window.top.$.layerAlert.getFrameInitData(window);
    var pageIndex = frameData.index;//当前弹窗index
    var initData = frameData.initData;

    var personTable = null;// 人员列表

    $(document).ready(function () {
        /**
         * 人员查看详情
         */
        $(document).on("click",".lookDetails",function () {
            var idnumber = $(this).attr("idnumber");
            findPersonIdByIdnumber(idnumber);
        });

        refreshPersonTable();
    });

    /**
     * 根据身份证查询id
     *
     * @param idnumber 身份证号
     */
    function findPersonIdByIdnumber(idnumber) {
        $.ajax({
            url:context +'/personManage/findHrskpersonByIDNumber',
            data:{idNumber : idnumber},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                var personId = successData;
                if($.util.isBlank(personId)){
                    $.util.topWindow().$.layerAlert.alert({icon:0, msg:"没有人员相关信息。"}) ;
                }else{
                    var form = $.util.getHiddenForm(context + "/show/page/web/personnel/personnelDetail", {personId : personId});
                    form.submit();
                }
            }
        });
    }

    /**
     * 属性人员列表
     */
    function refreshPersonTable() {
        if ($.util.exist(personTable)) {
            personTable.destroy();
            $("#personTable").empty();
        }
        var st1 = $.uiSettings.getLocalOTableSettings();
        st1.data = initData.hrskpersonArray;
        st1.columnDefs = [
            {
                "targets": 0,
                "width": "",
                "title": "姓名",
                "data": "name",
                "render": function (data, type, full, meta) {
                    var tr = '<a class="lookDetails" href="javascript:void(0);" idnumber="' + full.idnumber + '">' + data + '</a>';
                    return tr;
                }
            },
            {
                "targets": 1,
                "width": "",
                "title": "身份证号",
                "data": "idnumber",
                "render": function (data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets": 2,
                "width": "",
                "title": "进京方式",
                "data": "traceType",
                "render": function (data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets": 3,
                "width": "",
                "title": "进京时间",
                "data": "commingBeijingTimeLong",
                "render": function (data, type, full, meta) {
                    if($.util.isBlank(data)){
                        return "";
                    }else{
                        return $.date.timeToStr(data, "yyyy年MM月dd日<br/>HH:mm");
                    }
                }
            }
        ];
        st1.ordering = false;
        st1.paging = true; // 是否分页
        st1.info = true; // 是否显示表格左下角分页信息
        st1.autoFoot = false;
        st1.dom = null;
        st1.searching = false;
        st1.lengthChange = false;
        st1.lengthMenu = [5];
        st1.rowCallback = function (row, data, index) {

        };
        personTable = $("#personTable").DataTable(st1);
    }


    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.toBeijingPersonListLayer, {});
})(jQuery);