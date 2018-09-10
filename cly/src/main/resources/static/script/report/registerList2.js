(function($){
    "use strict";

    var reportTable = null;
    var selectedLst = [];
    $(document).ready(function() {
        events();
        initData();
        if(currentUnit == $.common.org.EZD) {
            $("#delete").show();
        }else{
            $("#delete").remove();
        }
        if(currentUnit == $.common.org.BGS) {
            $("#batchSign").show();
        }else{
            $("#batchSign").remove();
        }
    });

    function events(){

        $(document).on("click",".clearSelect",function() {
            selectedLst = [];
            $(".selectCount").text(selectedLst.length);
            $.icheck.check(".rowSelect",false,true);
        });
        $(document).on("ifChecked",".rowSelect",function() {
            if(selectedLst.indexOf($(this).val()) == -1){
                selectedLst.push($(this).val());
            }
            $(".selectCount").text(selectedLst.length);
        });
        $(document).on("ifUnchecked",".rowSelect",function() {
            var tempIndex = selectedLst.indexOf($(this).val());
            if(tempIndex != -1){
                selectedLst.splice(tempIndex, 1);
            }
            $(".selectCount").text(selectedLst.length);
        });

        $(document).on("click",".selectAll",function(){
            //请求参数
            var d = {};
            var obj = {};
            obj.key = "输入标题关键字查询"==$("#key").val()?"":$("#key").val();
            obj.code = "XXXX-XXXX"==$("#code").val()?"":$("#code").val();
            obj.sendStatus = $.select2.val("#sendStatus");
            obj.createTimeStartLong = $.laydate.getTime("#createTime", "start");
            obj.createTimeEndLong = $.date.endRangeByTime($.laydate.getTime("#createTime", "end"),"yyyy-MM-dd HH:mm");
            obj.securityClassification = $.select2.val("#securityClassification");
            obj.level = $.select2.val("#level");
            obj.sourceUnit = $("#sourceUnit").val();
            obj.sendTimeStartLong = $.laydate.getTime("#sendTime", "start");
            obj.sendTimeEndLong = $.date.endRangeByTime($.laydate.getTime("#approveTime", "end"),"yyyy-MM-dd HH:mm");
            obj.approveTimeStartLong = $.laydate.getTime("#sendTime", "start");
            obj.approveTimeEndLong = $.date.endRangeByTime($.laydate.getTime("#approveTime", "end"),"yyyy-MM-dd HH:mm");
            $.util.objToStrutsFormData(obj, "orqp", d);

            $.ajax({
                url:context + "/organizeReport/findOrganizeReportAll",
                type:'post',
                data:d,
                dataType:'json',
                success:function(successData){
                    selectedLst = [];
                    var data = successData.data;
                    for(var i in data) {
                        selectedLst.push(data[i].id);
                        $.icheck.check("input[value=" + data[i].id + "]",true,true);
                    }
                    $(".selectCount").text(selectedLst.length);
                }
            });
        });

        $(document).on("click",".showPic",function(){
            window.open(context+"/show/page/web/report/img?imgId="+ $(this).attr("picId"));
        });


        $(document).on("click","#batchSign",function(){
            if(selectedLst.length == 0){
                window.top.$.layerAlert.alert({msg:"请选择发文登记表！" ,icon:"1",end : function(){
                    return;
                }});
                return;
            }
            var str = "";
            for(var i in selectedLst){
                str += selectedLst[i] + ",";
            }
            str = str.substr(0,str.length-1);
            var dataTran = {
                p$ : $
            }
            window.top.$.layerAlert.dialog({
                content : context +  '/show/page/web/report/signLayer',
                pageLoading : true,
                title:"签收",
                width : "400px",
                height : "250px",
                shadeClose : false,
                initData:function(){
                    return $.util.exist(dataTran)?dataTran:{} ;
                },
                success:function(layero, index){

                },
                end:function(){
                },
                btn:["确定", "取消"],
                callBacks:{
                    btn1:function(index, layero){
                        var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                        var obj = cm.submitMethod(index);
                        if(!obj){
                            return;
                        }
                        window.top.layer.close(index);
                        var ownObj = $.util.cloneObj(obj);
                        ownObj.id = str;
                        var d = {};
                        $.util.objToStrutsFormData(ownObj, "orp", d);
                        $.ajax({
                            url:context +'/organizeReport/batchSign',
                            type:'post',
                            data:d,
                            dataType:'json',
                            success:function(successData){
                                reportTable.draw();
                            }
                        });
                    },
                    btn2:function(index, layero){
                        window.top.layer.close(index);
                    }
                }
            });
        });

        $(document).on("click",".downloadZip",function(){
            if(selectedLst.length == 0){
                window.top.$.layerAlert.alert({msg:"请选择发文登记表！" ,icon:"1",end : function(){
                    return;
                }});
                return;
            }
            var str = "";
            for(var i in selectedLst){
                str += selectedLst[i] + ",";
            }
            str = str.substr(0,str.length-1);
            var dataTran = {
                p$ : $,
                length : selectedLst.length,
                reportId : str
            }
            window.top.$.layerAlert.dialog({
                content : context +  '/show/page/web/report/downloadLayer',
                pageLoading : true,
                title:"下载",
                width : "300px",
                height : "200px",
                shadeClose : false,
                initData:function(){
                    return $.util.exist(dataTran)?dataTran:{} ;
                },
                success:function(layero, index){

                },
                end:function(){
                },
                btn:["确定", "取消"],
                callBacks:{
                    btn1:function(index, layero){
                        var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                        cm.submitMethod(index);
                    },
                    btn2:function(index, layero){
                        window.top.layer.close(index);
                    }
                }
            });
        });

        $(document).on("click",".uploadPic",function(){
            var dataTran = {
                reportId : $(this).attr("bbid"),
                p$ : $
            }
            window.top.$.layerAlert.dialog({
                content : context +  '/show/page/web/report/uploadLayer',
                pageLoading : true,
                title:"上传",
                width : "500px",
                height : "400px",
                shadeClose : false,
                initData:function(){
                    return $.util.exist(dataTran)?dataTran:{} ;
                },
                success:function(layero, index){

                },
                end:function(){
                },
                btn:["保存", "关闭"],
                callBacks:{
                    btn1:function(index, layero){
                        var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                        cm.submitMethod(index);
                    },
                    btn2:function(index, layero){
                        window.top.layer.close(index);
                    }
                }
            });
        });
        $(document).on("click",".reportModify2",function(){
            $("#useLastPage").val("true");
            window.location = context + "/show/page/web/report/reportModify2?reportId=" + $(this).attr("bbid");
        });
        $(document).on("click",".reportVerify2",function(){
            $("#useLastPage").val("true");
            window.location = context + "/show/page/web/report/reportVerify2?reportId=" + $(this).attr("bbid");
        });
        $(document).on("click",".reportSendConfirm",function(){
            $("#useLastPage").val("true");
            window.location = context + "/show/page/web/report/reportSendConfirm?reportId=" + $(this).attr("bbid");
        });
        $(document).on("click",".reportOfficeModify",function(){
            var title = "修改";
            $.util.topWindow().$.layerAlert.dialog({
                content : context + "/show/page/web/report/reportOfficeModifyInstruction?reportId=" + $(this).attr("bbid"),
                pageLoading : true,
                title : title,
                width : "400px",
                height : "200px",

                shadeClose : false,
                success:function(layero, index){

                },
                initData:{
                    id : $(this).attr("bbid")
                },
                end:function(){
                },
                btn:["修改", "关闭"],
                callBacks:{
                    btn1:function(index, layero){
                        var cm =  $.util.topWindow().frames["layui-layer-iframe"+index].$.reportOfficeModifyInstructionLayer ;
                        cm.modify();
                        window.setTimeout(initData(),100);
                    },
                    btn2:function(index, layero){
                        window.top.layer.close(index);
                    }
                }
            });
        });
        $(document).on("click",".showReport",function(){
            $("#useLastPage").val("true");
            window.location = context + "/show/page/web/report/report?listToReport=true&reportId=" + $(this).attr("bbid");
        });
        $(document).on("click","#query",function(){
            $(".clearSelect").click();
            reportTable.draw();
        });
        $(document).on("click","#exportExcel",function(){
            exportExcel();
        });
        $(document).on("dblclick","#reportTable tbody tr",function(){
            $("#useLastPage").val("true");
            var btn = $(this).find("button");
            if(!$.util.isBlank($(btn).attr("bbid"))){
                window.location = context + "/show/page/web/report/report?listToReport=true&reportId=" + $(btn).attr("bbid");
            }
        });
        $(document).on("click","#delete",function(){
            if(selectedLst.length == 0){
                window.top.$.layerAlert.alert({msg:"请选择发文登记表！" ,icon:"1",end : function(){
                    return;
                }});
                return;
            }
            var str = "";
            for(var i in selectedLst){
                str += selectedLst[i] + ",";
            }
            str = str.substr(0,str.length-1);

            $.util.topWindow().$.layerAlert.confirm({
                msg:"确认删除？（只删除其中被退回的）",
                title:"删除",	  //弹出框标题
                width:'300px',
                hight:'200px',
                shade: [0.5,'black'],  //遮罩
                icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
                shift:1,  //弹出时的动画效果  有0-6种
                yes:function(index, layero){
                    $.ajax({
                        url:context +'/organizeReport/delete',
                        type:'post',
                        data:{
                            id:str
                        },
                        dataType:'json',
                        success:function(successData){
                            $.util.topWindow().$.layerAlert.alert({msg:"删除成功！"});
                        }
                    });
                }
            });

        });
    }

    function downloadZip(arr){
        if(selectedLst.length == 0){
            window.top.$.layerAlert.alert({msg:"请选择发文登记表！" ,icon:"1",end : function(){
                return;
            }});
            return;
        }
        var str = "";
        for(var i in selectedLst){
            str += selectedLst[i] + ",";
        }
        str = str.substr(0,str.length-1);
        var d = {};
        $.util.objToStrutsFormData(str, "reportId", d);
        $.util.objToStrutsFormData(arr, "type", d);
        var form = $.util.getHiddenForm(context+'/organizeReport/downloadZip', d);
        $.util.subForm(form);
    }

    function initData(){
        $.when(
            $.ajax({
                url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
                type:'post',
                data:{dicTypeId : $.common.dict.TYPE_BBZT},
                dataType:'json',
                success:function(successData){
                    $.select2.addByList("#sendStatus", successData, "id", "name", true, true);
                    $.select2.val("#sendStatus",$("#sendStatusInput").val());
                }
            }),
            $.ajax({
                url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
                type:'post',
                data:{dicTypeId : $.common.dict.TYPE_MJ},
                dataType:'json',
                success:function(successData){
                    $.select2.addByList("#securityClassification", successData, "id", "name", true, true);
                    $.select2.val("#securityClassification",$("#securityClassificationInput").val());
                }
            }),
            $.ajax({
                url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
                type:'post',
                data:{dicTypeId : $.common.dict.TYPE_QBJB},
                dataType:'json',
                success:function(successData){
                    $.select2.addByList("#level", successData, "id", "name", true, true);
                    $.select2.val("#level",$("#levelInput").val());

                    var sourceUnit = [
                        {"id":"015001","name":"网安总队一支队"},
                        {"id":"015002","name":"网安总队二支队"},
                        {"id":"015003","name":"网安总队三支队"},
                        {"id":"015004","name":"网安总队四支队"},
                        {"id":"015005","name":"网安总队五支队"},
                        {"id":"015006","name":"网安总队六支队"},
                        {"id":"015007","name":"网安总队七支队"},
                        {"id":"015008","name":"网安总队八支队"}
                    ];
                    $.select2.addByList("#sourceUnit", sourceUnit, "id", "name", true, true);
                    $.select2.val("#sourceUnit",$("#sourceUnitInput").val());
                }
            })
        ).done(function(){
            initReportTable();
        });
    }

    /**
     * 初始化线索表
     */
    function initReportTable(){
        if(reportTable != null){
            reportTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        if($("#useLastPage").val() == "true"){
            tb.displayStart = $("#pageStart").val();
            $("#useLastPage").val(false);
        }
        tb.ajax.url = context + "/organizeReport/findOrganizeReportPage";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "2%",
                "title": "",
                "data": "id" ,
                "render": function ( data, type, full, meta ) {
                    var str = '<span reportId="' + data + '" style="display:none"></span>';
                    str += '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + data + '">';
                    return str;
                }
            },
            {
                "targets": 1,
                "width": "3%",
                "title": "编号",
                "data": "code" ,
                "render": function ( data, type, full, meta ) {
                    return '<span reportId="' + full.id + '">' + data + '</span>';
                }
            },
            {
                "targets" : 2,
                "width" : "4%",
                "title" : "密级",
                "data" : "securityClassificationName",
                "render" : function(data, type, full, meta) {
                    return data;

                }
            },
            {
                "targets" : 3,
                "width" : "8%",
                "title" : "创建时间",
                "data" : "createTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd <br/>HH:mm");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 4,
                "width" : "7%",
                "title" : "产情部门",
                "data" : "sourceUnitStr",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "10%",
                "title" : "发文标题",
                "data" : "title",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "4%",
                "title" : "预警等级",
                "data" : "levelName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            // {
            //     "targets" : 7,
            //     "width" : "5%",
            //     "title" : "审批人",
            //     "data" : "approvePerson",
            //     "render" : function(data, type, full, meta) {
            //         return data;
            //     }
            // },
            // {
            //     "targets" : 8,
            //     "width" : "5%",
            //     "title" : "核稿人",
            //     "data" : "inspectPerson",
            //     "render" : function(data, type, full, meta) {
            //         return data;
            //     }
            // },
            {
                "targets" : 7,
                "width" : "6%",
                "title" : "编校人",
                "data" : "editPerson",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 8,
                "width" : "8%",
                "title" : "联系电话",
                "data" : "phone",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 9,
                "width" : "8%",
                "title" : "审批时间",
                "data" : "ezdApproveTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd <br/>HH:mm");
                    }else{
                        return "";
                    }
                }
            },

            {
                "targets" : 10,
                "width" : "6%",
                "title" : "二支队<br>整编人",
                "data" : "ezdEditPerson",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 11,
                "width" : "6%",
                "title" : "二支队<br>审核领导",
                "data" : "ezdApprovePerson",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 12,
                "width" : "8%",
                "title" : "发文时间",
                "data" : "sendTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd <br/>HH:mm");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 13,
                "width" : "6%",
                "title" : "办公室<br>接收人",
                "data" : "receivePerson",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 14,
                "width" : "6%",
                "title" : "领导批示<br>内容",
                "data" : "instruction",
                "render" : function(data, type, full, meta) {
                    if( full.sendStatusName.indexOf("已退回") != -1) {
                        if(data == null) {
                            data = "";
                        }
                        return (data + full.remark);
                    } else {
                        return data;
                    }
                }
            },
            {
                "targets" : 15,
                "width" : "",
                "title" : "审批单",
                "data" : "picId",
                "render" : function(data, type, full, meta) {
                    if(!$.util.isBlank(data)){
                        return '<a class="showPic" picId="' + data + '">' + full.picName + '</a>';
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 16,
                "width" : "6%",
                "title" : "发送状态",
                "data" : "sendStatusName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 17,
                "width" : "",
                "title" : "操作",
                "data" : "optionType",
                "render" : function(data, type, full, meta) {
                    var str = "";
                    if(data.indexOf("上传审批单") != -1){
                        str += '<button class="btn btn-default btn-sm uploadPic" bbid="' + full.id + '">' + '审批单</button>';
                    }
                    if(data.indexOf("二支队审批") != -1){
                        str += '<button class="btn btn-default btn-sm reportVerify2" bbid="' + full.id + '">' + '审核</button>';
                    }
                    if(data.indexOf("二支队修改") != -1){
                        str += '<button class="btn btn-default btn-sm reportModify2" bbid="' + full.id + '">' + '修改</button>';
                    }
                    if(data.indexOf("办公室发送") != -1){
                        str += '<button class="btn btn-default btn-sm reportSendConfirm" bbid="' + full.id + '">' + '发送</button>';
                    }
                    if(data.indexOf("办公室修改") != -1){
                        str += '<button class="btn btn-default btn-sm reportOfficeModify" bbid="' + full.id + '">' + '修改</button>';
                    }
                    if(str == ""){
                        return '<button class="btn btn-default btn-sm showReport" bbid="' + full.id + '">' + '查看</button>';
                    }else{
                        return str;
                    }
                }
            }
        ];

        //是否排序
        tb.ordering = false ;
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
            var obj = {};
            obj.key = "输入标题关键字查询"==$("#key").val()?"":$("#key").val();
            obj.code = "XXXX-XXXX"==$("#code").val()?"":$("#code").val();
            obj.sendStatus = $.select2.val("#sendStatus");
            $("#sendStatusInput").val($("#sendStatus").val());
            obj.createTimeStartLong = $.laydate.getTime("#createTime", "start");
            obj.createTimeEndLong = $.date.endRangeByTime($.laydate.getTime("#createTime", "end"),"yyyy-MM-dd HH:mm");
            obj.securityClassification = $.select2.val("#securityClassification");
            $("#securityClassificationInput").val($("#securityClassification").val());
            obj.level = $.select2.val("#level");
            $("#levelInput").val($("#level").val());
            obj.sourceUnit = $("#sourceUnit").val();
            $("#sourceUnitInput").val($("#sourceUnit").val());
            obj.sendTimeStartLong = $.laydate.getTime("#sendTime", "start");
            obj.sendTimeEndLong = $.date.endRangeByTime($.laydate.getTime("#approveTime", "end"),"yyyy-MM-dd HH:mm");
            obj.approveTimeStartLong = $.laydate.getTime("#sendTime", "start");
            obj.approveTimeEndLong = $.date.endRangeByTime($.laydate.getTime("#approveTime", "end"),"yyyy-MM-dd HH:mm");
            obj.editPerson = $("#editPerson").val();
            obj.ezdEditPerson = $("#ezdEditPerson").val();
            obj.ezdApprovePerson = $("#ezdApprovePerson").val();
            obj.receivePerson = $("#receivePerson").val();
            obj.start = d.start;
            obj.length = d.length;
            $.util.objToStrutsFormData(obj, "orqp", d);
            $("#pageStart").val(d.start);
        };
        tb.paramsResp = function(json) {

        };
        tb.drawCallback = function(row,data, index) {
            for(var i in selectedLst){
                $.icheck.check("input[value='" + selectedLst[i] + "']",true,true);
            }
        };
        reportTable = $("#reportTable").DataTable(tb);
    }

    /**
     * 结果导出事件
     */
    function exportExcel(){
        $.layerAlert.alert({title:"提示",msg:"文件下载中,请等待..",icon : 1,time:1000});
        if(selectedLst.length == 0){
            var d = {};
            var obj = {};
            obj.key = "输入标题关键字查询" == $("#key").val() ? "" : $("#key").val();
            obj.code = "XXXX-XXXX"==$("#code").val()?"":$("#code").val();
            obj.sendStatus = $.select2.val("#sendStatus");
            obj.createTimeStartLong = $.laydate.getTime("#createTime", "start");
            obj.createTimeEndLong = $.date.endRangeByTime($.laydate.getTime("#createTime", "end"), "yyyy-MM-dd HH:mm");
            obj.securityClassification = $.select2.val("#securityClassification");
            obj.level = $.select2.val("#level");
            obj.sourceUnit = $("#sourceUnit").val();
            obj.sendTimeStartLong = $.laydate.getTime("#sendTime", "start");
            obj.sendTimeEndLong = $.date.endRangeByTime($.laydate.getTime("#sendTime", "end"), "yyyy-MM-dd HH:mm");
            $.util.objToStrutsFormData(obj, "orqp", d);
            var form = $.util.getHiddenForm(context+'/organizeReport/exportOrganizeReport', d);
            $.util.subForm(form);
        }else{
            var str = "";
            for(var i in selectedLst){
                str += selectedLst[i] + ",";
            }
            str = str.substr(0,str.length-1);
            var d = {};
            $.util.objToStrutsFormData(str, "reportId", d);
            var form = $.util.getHiddenForm(context+'/organizeReport/exportOrganizeReportForIdLst', d);
            $.util.subForm(form);
        }
    }

    jQuery.extend($.common, {
        drawTable:function(pageIndex){
            reportTable.draw();
            window.top.layer.close(pageIndex);
        },
        downloadFile:function(reportId, downloadType, pageIndex){
            var form = $.util.getHiddenForm(context+'/organizeReport/downloadFile', {"reportId": reportId,"downloadType": downloadType});
            $.util.subForm(form);
            window.top.layer.close(pageIndex);
        },
        downloadZip:function(arr, pageIndex){
            if(arr == false){
                window.top.$.layerAlert.alert({msg:"请选择下载内容！" ,icon:"1",end : function(){
                    return;
                }});
                return;
            }
            downloadZip(arr);
            window.top.layer.close(pageIndex);
        }
    });
})(jQuery);