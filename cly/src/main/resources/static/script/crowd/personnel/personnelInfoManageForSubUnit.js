(function ($) {
    "use strict";

    var row = 1;
    var table = null;
    var hrskpersonCrowdDictionary = null;
    var uploadfileId = "oldValue";
    var tableTotalNum = undefined;

    var startTime;
    var endTime;
    var flag = true;
    var count = 0;

    $(document).ready(function () {
        init();
        queryTable();
        $(document).on("click", "#searchBtn", function (e) {
            getTime();
            queryTable();
        });
        $(document).on("click", "#resetBtn", function (e) {
            location.reload();
        });
    });

    function getTime() {
        var startDate = $.laydate.getDate("#dateRangeId", "start") == null ? null : $.laydate.getDate("#dateRangeId", "start");
        var endDate = $.laydate.getDate("#dateRangeId", "end") == null ? null : $.laydate.getDate("#dateRangeId", "end");
        if (startDate) {
            startTime = new Date(startDate).getTime();
        } else {
            startTime = startDate;
        }
        if (endDate) {
            endTime = new Date(endDate).getTime();
        } else {
            endTime = endDate;
        }
    }

    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    function queryTable() {
        count++;
        var otherCrowd = $(".checked .icheckbox[name='otherCrowd']").val();

        tableTotalNum = undefined;
        $("#tableTatalNum").text("...");
        var query = "可输入姓名、身份证号或手机号" == $("#query").val() ? null : $("#query").val();
        if (query) {
            query = trim(query);
        }
        var data = {
            "query": query,
            "startTime": startTime,
            "endTime": endTime,
            "crowdTypes": $.select2.val("#crowdType"),
            "crowdNames": $.select2.val("#crowdName"),
            "personnelSubclassOne": $.select2.val("#personnelSubclassOne"),
            "personnelSubclassTwo": $.select2.val("#personnelSubclassTwo"),
            "personnelSubclassThree": $.select2.val("#personnelSubclassThree"),
            "personnelSubclassFour": $.select2.val("#personnelSubclassFour"),
            "populationStatus": $(".checked .icheckradio[name='populationStatus']").val(),
            "zazdsfr": $(".checked .icheckradio[name='zazdsfr']").val(),
            "gjxfjsfr": $(".checked .icheckradio[name='gjxfjsfr']").val(),
            "ywPhoneNumber": $(".checked .icheckradio[name='ywPhoneNumber']").val(),
            "otherCrowd": otherCrowd,
            "count": count
        };
        creatTable(data);
        var obj = new Object();
        $.util.objToStrutsFormData(data, "hrskpersonPramaterPojo", obj);
        //不能查了会卡
        // $.ajax({
        //     url: context + '/personManage/findTableTotalNum',
        //     data: obj,
        //     type: 'post',
        //     success: function (successData) {
        //         tableTotalNum = successData.totelNum;
        //         if (successData.count == 1) {
        //             $("#totalNum").text(tableTotalNum);
        //             $("#allNumber").show();
        //         }
        //         if (count == successData.count) {
        //             creatTable(data);
        //             $("#tableTatalNum").text(tableTotalNum);
        //         }
        //     }
        // })

    }

    /**
     * 导出人员档案
     * @constructor
     */
    function ExprotToWordBtn() {

        if (getHrskpersonIdList().length <= 0) {
            $.util.topWindow().$.layerAlert.alert({msg: "您未勾选,请勾选一项进行导出!", title: "提示"});
            return false;
        }
        if (getHrskpersonIdList().length > 1) {
            $.util.topWindow().$.layerAlert.alert({msg: "您选择的人员大于一项,请勾选一项进行导出!", title: "提示"});
            return false;
        }
        var id = getHrskpersonIdList()[0];
        var form = $.util.getHiddenForm(context + '/crowd/exportPersonMessageToWord', {
            id: id,
            startTime: startTime,
            endTime: endTime
        });
        $.util.subForm(form);
    }

    function addPersonalBtnClick() {
        var form = $.util.getHiddenForm(context + "/show/page/web/personnel/newPersonnelInfo");
        form.submit();
    }

    function editPersonalBtnClick() {
        if (getHrskpersonIdList().length <= 0) {
            $.util.topWindow().$.layerAlert.alert({msg: "您未勾选,请勾选一项进行编辑!", title: "提示"});
            return false;
        }
        if (getHrskpersonIdList().length > 1) {
            $.util.topWindow().$.layerAlert.alert({msg: "您选择的人员大于一项,请勾选一项进行编辑!", title: "提示"});
            return false;
        }
        var id = getHrskpersonIdList()[0];
        var form = $.util.getHiddenForm(context + "/show/page/web/personnel/editPersonnelInfo", {id: id});
        form.submit();
    }

    /**
     * 加入白名单
     */
    $(document).on("click", "#joinWhiteList", function () {
        var arr = $.icheck.getChecked("check");
        if (arr.length > 0) {
            var crowdIds = [];
            $.each(arr, function (i, val) {
                var tr = $(val).parents("tr");
                var row = table.row(tr);
                var data = row.data();
                crowdIds.push(data.id);
            });
            $.util.topWindow().$.layerAlert.confirm({
                msg: "确定要将人员加入白名单中吗？",
                title: "加入白名单",	  //弹出框标题
                width: '300px',
                hight: '200px',
                shade: [0.5, 'black'],  //遮罩
                icon: 3,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
                shift: 1,  //弹出时的动画效果  有0-6种
                yes: function (index, layero) {
                    //点击确定按钮后执行
                    var cpp = {
                        "ids": crowdIds
                    };
                    var obj = {};
                    $.util.objToStrutsFormData(cpp, "cpp", obj);
                    $.ajax({
                        url: context + '/personMessageManage/joinWhiteList',
                        data: obj,
                        type: "post",
                        dataType: "json",
                        customizedOpt: {
                            ajaxLoading: true,//设置是否loading
                        },
                        success: function (successData) {
                            if (successData.status) {
                                $.util.topWindow().$.layerAlert.alert({icon: 6, msg: "加入成功。"});
                                table.draw();
                            } else {
                                $.util.topWindow().$.layerAlert.alert({icon: 5, msg: "加入失败。"});
                            }
                        },
                        initData: {
                            // host$ : $,
                        },
                    });
                }
            });
        } else {
            $.layerAlert.alert({msg: "请选择人员进行操作！"});
            return false;
        }
    })

    function deleteBtnClick() {
        if (getHrskpersonIdList().length <= 0) {
            $.util.topWindow().$.layerAlert.alert({msg: "至少勾选一项进行删除!", title: "提示"});
            return false;
        }

        $.util.topWindow().$.layerAlert.confirm({
            msg: "删除后不可恢复,确认删除吗？",
            title: "提示",	  //弹出框标题
            width: '300px',
            hight: '200px',
            shade: [0.5, 'black'],  //遮罩
            icon: 0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            yes: function (index, layero) {
                deleteHrskperson();
            }
        });
    }

    function getHrskpersonIdList() {
        var idList = [];
        $.each($("#tableId .checked"), function (e, m) {
            var str = $(m).parent(".divid").attr("valid");
            idList.push(str);
        })
        return idList;
    }

    function deleteHrskperson() {

        var data = {
            idList: getHrskpersonIdList()
        }
        var obj = new Object();
        ;
        $.util.objToStrutsFormData(data, "idList", obj);
        $.ajax({
            url: context + '/personManage/deleteHrskperson',
            data: obj,
            type: 'post',
            success: function (successData) {
                $.util.topWindow().$.layerAlert.alert({
                    msg: "删除成功!", title: "提示", end: function () {
                        location.reload();
                    }
                });

            }
        })

    }

    function searchHrskpersonBtnClick() {

        $.ajax({
            url: context + '/personManage/findHrskpersonByParameter',
            data: {query: $("#query").val()},
            type: 'post',
            success: function (successData) {
                console.log(successData);
            }
        })
    }

    //组装查询条件
    function getNewHrskpersonInfo() {

        var hrskpersonParmeter;
        hrskpersonParmeter = {
            query: $("#query").val()
        };
        return hrskpersonParmeter;
    }

    function init() {
        getTime();
        $.ajax({
            url: context + '/personManage/findCrowdDictionary',
            type: "post",
            dataType: "json",
            success: function (hrskpersonCrowdDictionaryPojo) {
                hrskpersonCrowdDictionary = hrskpersonCrowdDictionaryPojo;
                // initDictionary();
                initCrowdDictionary(hrskpersonCrowdDictionaryPojo);

            }
        })

    }

    //初始化常暂口、治安上访重点人、国家信访局上访人和有无手机号。
    // function initDictionary(hrskpersonCrowdDictionary){
    //     var arr= [{"id":1, "name":"是"}, {"id":0, "name":"否"}]
    //
    //     $.select2.addByList("#populationStatus",arr,"id","name",true,true);
    //     $.select2.addByList("#zazdsfr",arr,"id","name",true,true);
    //     $.select2.addByList("#gjxfjsfr",arr,"id","name",true,true);
    //     $.select2.addByList("#ywPhoneNumber",arr,"id","name",true,true);
    // }


    //初始化群体字典项信息.
    function initCrowdDictionary(hrskpersonCrowdDictionary) {
        $.select2.addByList("#crowdType", hrskpersonCrowdDictionary.crowdType, "id", "name", true, true);
        $.select2.addByList("#crowdName", [], "id", "name", true, true);
        $.select2.addByList("#personnelSubclassOne", [], "id", "name", true, true);
        $.select2.addByList("#personnelSubclassTwo", [], "id", "name", true, true);
        $.select2.addByList("#personnelSubclassThree", [], "id", "name", true, true);
        $.select2.addByList("#personnelSubclassFour", [], "id", "name", true, true);
    }

    $(document).on("select2:select", ".personCrowd", function () {
        var id = $(this).attr("id");

        var arr = {"idList": $.select2.val("#" + id)};
        var obj = new Object();
        $.util.objToStrutsFormData(arr, "idList", obj);
        if (id.indexOf("Type") >= 0) {
            if (arr.idList != null) {
                $.ajax({
                    url: context + "/personManage/findAllDictionaryItemsByParentIdList",
                    type: "POST",
                    global: false,
                    data: obj,
                    success: function (data) {
                        $.select2.empty("#crowdName");
                        $.select2.addByList("#crowdName", data.simplePojos, "code", "name", true, true);
                        $.select2.empty("#personnelSubclassOne");
                        $.select2.empty("#personnelSubclassTwo");
                        $.select2.empty("#personnelSubclassThree");
                        $.select2.empty("#personnelSubclassFour");
                    }
                });
            } else {
                $.select2.empty("#crowdName");
                $.select2.empty("#personnelSubclassOne");
                $.select2.empty("#personnelSubclassTwo");
                $.select2.empty("#personnelSubclassThree");
                $.select2.empty("#personnelSubclassFour");
            }
        }
        else if (id.indexOf("Name") >= 0) {
            if (arr.idList != null) {
                $.ajax({
                    url: context + '/personManage/findAllDictionaryItemsByParentIdList',
                    data: obj,
                    type: "post",
                    success: function (data) {
                        $.select2.empty("#personnelSubclassOne");
                        $.select2.addByList("#personnelSubclassOne", data.simplePojos, "code", "name", true, true);
                        $.select2.empty("#personnelSubclassTwo");
                        $.select2.empty("#personnelSubclassThree");
                        $.select2.empty("#personnelSubclassFour");
                    }
                });
            } else {
                $.select2.empty("#personnelSubclassOne");
                $.select2.empty("#personnelSubclassTwo");
                $.select2.empty("#personnelSubclassThree");
                $.select2.empty("#personnelSubclassFour");
            }
        } else if (id.indexOf("One") >= 0) {
            if (arr.idList != null) {
                $.ajax({
                    url: context + '/personManage/findAllDictionaryItemsByParentIdList',
                    data: obj,
                    type: "post",
                    success: function (data) {
                        $.select2.empty("#personnelSubclassTwo");
                        $.select2.addByList("#personnelSubclassTwo", data.simplePojos, "code", "name", true, true);
                        $.select2.empty("#personnelSubclassThree");
                        $.select2.empty("#personnelSubclassFour");
                    }
                });
            } else {
                $.select2.empty("#personnelSubclassTwo");
                $.select2.empty("#personnelSubclassThree");
                $.select2.empty("#personnelSubclassFour");
            }
        } else if (id.indexOf("Two") >= 0) {
            if (arr.idList != null) {
                $.ajax({
                    url: context + '/personManage/findAllDictionaryItemsByParentIdList',
                    data: obj,
                    type: "post",
                    dataType: "json",
                    success: function (data) {
                        $.select2.empty("#personnelSubclassThree");
                        $.select2.addByList("#personnelSubclassThree", data.simplePojos, "code", "name", true, true);
                        $.select2.empty("#personnelSubclassFour");
                    }
                });
            } else {
                $.select2.empty("#personnelSubclassThree");
                $.select2.empty("#personnelSubclassFour");
            }

        } else if (id.indexOf("Three") >= 0) {
            if (arr.idList != null) {
                $.ajax({
                    url: context + '/personManage/findAllDictionaryItemsByParentIdList',
                    data: obj,
                    type: "post",
                    dataType: "json",
                    success: function (data) {
                        $.select2.empty("#personnelSubclassFour");
                        $.select2.addByList("#personnelSubclassFour", data.simplePojos, "code", "name", true, true);
                    }
                });
            } else {
                $.select2.empty("#personnelSubclassFour");
            }
        }

    })


    function creatTable(data) {

        if (table != null) {
            table.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context + '/personManage/findHrskpersonByParameter',
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
                        return data;
                    }
                },
                {
                    "targets": 2,
                    "width": "14%",
                    "title": '身份证号',
                    "data": "idNumber",
                    "render": function (data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets": 3,
                    "width": "8%",
                    "title": "省份",
                    "data": "province",
                    "render": function (data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets": 4,
                    "title": "所属群体",
                    "data": "crowdName",
                    "render": function (data, type, full, meta) {
                        var str = "";
                        for (var i in data) {
                            str += data[i] + "；";
                        }
                        if (str.length > 0) {
                            str = str.substr(0, str.length - 1);
                        }
                        return str;
                    }
                },
                {
                    "targets": 5,
                    "title": "人员细类",
                    "data": "personnelSubclass",
                    "render": function (data, type, full, meta) {
                        var str = "";
                        for (var i in data) {
                            str += data[i] + ",";
                        }
                        if (str.length > 0) {
                            str = str.substr(0, str.length - 1);
                        }
                        return str;
                    }
                },
                {
                    "targets": 6,
                    "title": "手机号码",
                    "data": "phoneNumber",
                    "render": function (data, type, full, meta) {
                        return data;
                    }
                },
                {
                    "targets": 7,
                    "title": "重点人员",
                    "data": "zdry",
                    "render": function (data, type, full, meta) {
                        var str = "";
                        for (var i in data) {
                            str += data[i] + ",";
                        }
                        if (str.length > 0) {
                            str = str.substr(0, str.length - 1);
                        }
                        return str;
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

            $.util.objToStrutsFormData(data, "hrskpersonPramaterPojo", d);
        };
        tb.paramsResp = function (json) {
            if (tableTotalNum) {
                json.recordsFiltered = tableTotalNum;
            }
            json.data = json.pageList;

        };
        tb.initComplete = function () { //表格加载完成后执行的函数
            $("#tableId_info").hide();
        }
        table = $("#tableId").DataTable(tb);//在哪个table标签中展示这个表格
    }

    /**
     * 人员信息导入
     */
    function personBatchImportExcel() {
        checkImportStatus();
    }

    /**
     * 打开加载页面
     */
    function openOnload() {
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/personnel/bulkImportDialog1',
            pageLoading: true,
            title: '人员信息导入',
            width: "508px",
            height: "400px",
            btn: ["加载导入文件信息", "取消"],
            callBacks: {
                btn1: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.personBulkImportDialog1;  //获取弹窗界面的操作对象
                    cm.submitMethod();//弹窗界面的方法
                },
                // btn2:function(index, layero){
                //     window.open(context+"/petitionRegistrationExportExcel/downloadPetitionModel?fileName=hrskpersonImportModel.xlsx") ;
                //     // $.util.topWindow().$.layerAlert.closeWithLoading(index);
                //     // var errFileId='28bf824a-eb9c-48f1-8380-fcadcbf3271c';
                //     // window.open(context+"/crowd/downloadAttachment/"+errFileId) ;
                // },
                btn2: function (index, layero) {
                    var cm = $.util.topWindow().frames["layui-layer-iframe" + index].$.personBulkImportDialog1;  //获取弹窗界面的操作对象
                    var id = cm.findObj();//获取值
                    if (id) {
                        removeAttachment(id);//如果有上传id的话
                    }
                    $.util.topWindow().$.layerAlert.closeWithLoading(index);
                    //关闭弹窗
                },

            },
            success: function (layero, index) {

            },
            initData: {
                // parent$ : $,//判断是哪个页面的导入
            },
            end: function () {

            }
        });
    }

    /**
     * 检查是否有没有上传完的东西
     */
    function checkImportStatus() {
        $.ajax({
            url: context + '/crowd/checkImportStatus',
            // data:data,
            type: "post",
            dataType: "json",
            success: function (res) {
                var bn = res.status;
                if (bn == false) {
                    var result = res.data;
                    //导入等待界面
                    $.util.topWindow().$.layerAlert.dialog({
                        content: context + "/show/page/web/personnel/bulkImportDialog4",
                        pageLoading: true,
                        title: '确定导入数据',
                        width: "400px",
                        height: "400px",
                        btn: ["返回"],
                        callBacks: {
                            btn1: function (index, layero) {
                                $.util.topWindow().$.layerAlert.closeAll();
                            },
                        },
                        success: function (layero, index) {

                        },
                        initData: {
                            data: result,
                        },
                        end: function () {

                        }
                    });
                } else {
                    openOnload();
                }

            }
        })

    }


    /**
     * 人员批量导出
     */
    function personBatchExport() {
        var otherCrowd = $(".checked .icheckbox[name='otherCrowd']").val();

        $("#tableTatalNum").text("");
        var query = "可输入姓名、身份证号或手机号" == $("#query").val() ? null : $("#query").val();
        if (query) {
            query = trim(query);
        }
        var hrskpersonPramaterPojo = {
            "query": query,
            "startTime": startTime,
            "endTime": endTime,
            "crowdTypes": $.select2.val("#crowdType"),
            "crowdNames": $.select2.val("#crowdName"),
            "personnelSubclassOne": $.select2.val("#personnelSubclassOne"),
            "personnelSubclassTwo": $.select2.val("#personnelSubclassTwo"),
            "personnelSubclassThree": $.select2.val("#personnelSubclassThree"),
            "personnelSubclassFour": $.select2.val("#personnelSubclassFour"),
            "populationStatus": $(".checked .icheckradio[name='populationStatus']").val(),
            "zazdsfr": $(".checked .icheckradio[name='zazdsfr']").val(),
            "gjxfjsfr": $(".checked .icheckradio[name='gjxfjsfr']").val(),
            "ywPhoneNumber": $(".checked .icheckradio[name='ywPhoneNumber']").val(),
            "otherCrowd": otherCrowd,
        };

        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/personnel/personExport',
            pageLoading: true,
            title: "人员excel表下载",
            width: "500px",
            height: "500px",
            btn: ["关闭"],
            callBacks: {
                btn1: function (index, layero) {
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose: false,
            success: function (layero, index) {

            },
            initData: {
                hrskpersonPramaterPojo: hrskpersonPramaterPojo
            },
            end: function () {
            }
        });
    }


    /**
     * 删除已经上传的附件
     */
    function removeAttachment(id) {
        $.ajax({//處理數據
            url: context + '/crowd/deleteAttachment',
            data: {"uploadfileId": id},
            type: "post",
            dataType: "json",
            success: function () {

            }
        })
    }

    /**
     * 跳转到人员导入日志界面
     */
    function selectImportLog() {
        window.location = context + '/show/page/web/crowd/HrskpersonTrackDataImport';
    }

    function returnUponloadFileId(data) {
        uploadfileId = data;
    }

})(jQuery);