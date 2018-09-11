(function ($) {
    "use strict";
    var table = null;


    $(document).ready(function () {
        creatTable();
        $(document).on("click", "#searchBtn", function (e) {
            creatTable();
        });

        $(document).on("click", ".personId", function (e) {

        });
    });



    function creatTable() {

        if (table != null) {
            table.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context + '/hello/findAllPerson',
            tb.columnDefs = [
                {
                    "targets": 0,
                    "width": "60px",
                    "title": "",
                    "data": "id",//置顶信息
                    "render": function (data, type, full, meta) {
                        return "<div class='divid' valid='" + data + "'><input name=\"check\" type=\"checkbox\" class=\"icheckbox\"></div>"
                    }
                }, {
                    "targets": 1,
                    "width": "8%",
                    "title": "人员姓名",
                    "data": "name",
                    "render": function (data, type, full, meta) {
                        return "<a class='personId' valId='" + full.id + "' href='###'>" + data + "</a>";
                    }
                },
                {
                    "targets": 2,
                    "width": "14%",
                    "title": '学号',
                    "data": "xhNum",
                    "render": function (data, type, full, meta) {
                        return data;
                    }
                }
            ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.info = true; //是否显示详细信息
        tb.bProcessing = true;//是否显示loading效果
        tb.lengthMenu = [10, 20, 50, 100]; //每页条数
        tb.lengthChange = true; //是否可以改变每页显示条数
        tb.paramsReq = function (d, pagerReq) { //传入后台的请求参数

        };
        tb.paramsResp = function (json) {
            json.data = json.data;
            json.recordsFiltered = json.data.length;
            json.recordsTotal = json.data.length;
        };
        tb.initComplete = function () { //表格加载完成后执行的函数
            $("#tableId_info").hide();
        }
        table = $("#tableId").DataTable(tb);//在哪个table标签中展示这个表格
    }


})(jQuery);