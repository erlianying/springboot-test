(function($){
    "use strict";

    var clueTable = null;
    var selectedLst = [];

    $(document).ready(function() {

        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_LYDWFZ},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#officeInsideOutsideQuery", true);
                $.select2.addByList("#officeInsideOutsideQuery", successData, "id", "name", true, true);
                /*
                var tempSourceUnitTypeLst = successData;
                $.ajax({
                    url:context +'/clue/findSourceUnitForMe',
                    type:'post',
                    data:{},
                    dataType:'json',
                    success:function(unitData){
                        for(var i in tempSourceUnitTypeLst){
                            if(unitData.unitType == tempSourceUnitTypeLst[i].id){
                                //$.select2.val("#officeInsideOutsideQuery", unitData.unitType);
                                $.ajax({
                                    url:context +'/clue/findSourceUnit',
                                    type:'post',
                                    //data:{groupType : $.select2.val("#officeInsideOutsideQuery")},
                                    data:{groupType : unitData.unitType},
                                    dataType:'json',
                                    success:function(successData){
                                        $.select2.empty("#unitQuery", true);
                                        $.select2.addByList("#unitQuery", successData, "id", "name", true, true);
                                        //$.select2.val("#unitQuery", unitData.unitId);
                                    }
                                });
                                break;
                            }
                        }
                    }
                });
*/
            }
        });

        $.ajax({
            url:context +'/clue/findReceiveSecretUnit',
            type:'post',
            data:{groupType : "lydwfz0001"},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#unitQueryReceive", true);
                $.select2.addByList("#unitQueryReceive", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/clue/findSecretUnit',
            type:'post',
            dataType:'json',
            success:function(successData){
                $.select2.empty("#createUnitQuery", true);
                $.select2.addByList("#createUnitQuery", successData, "id", "name", true, true);
            }
        });

        $.ajax({
            url:context +'/clue/findFileType',
            type:'post',
            data:{},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#typeQuery", true);
                $.select2.addByList("#typeQuery", successData, "id", "name", true, true);
            }
        });

        events();
        initClueTable();
    });

    function events(){

        //$(document).on("select2:select","#officeInsideOutsideQuery",function(){
        $("select#officeInsideOutsideQuery").change(function(){
            $.ajax({
                url:context +'/clue/findReceiveSecretUnit',
                type:'post',
                data:{groupType : $.select2.val("#officeInsideOutsideQuery")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#unitQuery", true);
                    $.select2.addByList("#unitQuery", successData, "id", "name", true, true);
                }
            });
        });

        $(document).on("click" , "#hanLpBtn", function(e){
            $.ajax({
                url:context +'/clue/hanLpTest',
                data:{},
                dataType:'json',
                type:'post',
                success:function(successData){
                }
            })
        });

        $(document).on("click" , "#addBtn", function(e){
            addSecret();
        });

        $(document).on("click" , "#deleteBtn", function(e){
            deleteBtnClick();
        });

        $(document).on("click" , "#editBtn", function(e){
            editSecretOnClick();
        });

        $(document).on("click" , "#informBtn", function(e){
            informOnClick();
        });

        $(document).on("click",".query",function(){
            initClueTable();
        });

        $(document).on("click",".downloadBtn",function(){
            var fileId = $(this).attr("id");
            var form = $.util.getHiddenForm(context+'/clue/downloadFile', {"metaId": fileId});
            $.util.subForm(form);
        });

        $(document).on("click",".btnView",function(){
            $.ajax({
                url:context + '/clue/updateCheckFlag',
                type:'post',
                data:{
                    targetId:$(this).attr("targetId"),
                    secretId:$(this).attr("secretId")
                },
                dataType:'json',
                success:function(successData){

                    if(successData) {
                        initClueTable();
                    }
                }
            })
        });

        $(document).on("click","#exportExcel",function(){
            exportExcel();
        });

        $(document).on("ifChecked",".rowSelect",function() {
            if(selectedLst.indexOf($(this).val()) == -1){
                selectedLst.push($(this).val());
            }
        });
        $(document).on("ifUnchecked",".rowSelect",function() {
            var tempIndex = selectedLst.indexOf($(this).val());
            if(tempIndex != -1){
                selectedLst.splice(tempIndex, 1);
            }
        });

        $(document).on("click",".clearSelect",function() {
            selectedLst = [];
            $.icheck.check(".rowSelect",false,true);
        });

        $(document).on("click",".selectAll",function(){
            //请求参数
            var d = {};
            var obj = {};
            obj.startTimeLong = $.laydate.getTime("#startTime", "start");
            obj.endTimeLong = $.laydate.getTime("#startTime", "end");
            obj.insideOutside = $("#officeInsideOutsideQuery option:selected").text();
            obj.unit = $("#unitQuery option:selected").text();
            obj.originalNumber = "原编号"==$("#numberQuery").val()?"":$("#numberQuery").val();
            obj.title = "关键字"==$("#contentQuery").val()?"":$("#contentQuery").val();
            obj.type = "wjlx0001";
            obj.startTimeReceiveLong = $.laydate.getTime("#receiveTime", "start");
            obj.endTimeReceiveLong = $.laydate.getTime("#receiveTime", "end");
            obj.unitReceive = $("#unitQueryReceive").val();
            obj.receivePerson = "接收人"==$("#receivePersonQuery").val()?"":$("#receivePersonQuery").val();
            obj.createPerson = $("#createPersonQuery").val();
            obj.createUnitId = $("#createUnitQuery").val();
            d.length = 9999;
            $.util.objToStrutsFormData(obj, "srp", d);

            $.ajax({
                url:context + "/clue/findSecrets",
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
                }
            });
        });

        $(document).on("click",".downloadZip",function(){
            if(selectedLst.length == 0){
                window.top.$.layerAlert.alert({msg:"请选择密件！" ,icon:"1",end : function(){
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
            $.util.objToStrutsFormData(str, "secretId", d);
            var form = $.util.getHiddenForm(context+'/clue/downloadSecretZip', d);
            $.util.subForm(form);
        });

        $.ajax({
            url:context +'/clue/findSourceUnit',
            type:'post',
            data:{groupType : $.select2.val("#officeInsideOutsideQuery")},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#unitQuery", true);
                $.select2.addByList("#unitQuery", successData, "id", "name", true, true);
            }
        });
    }

    /**
     * 结果导出事件
     */
    function exportExcel(){
        $.layerAlert.alert({title:"提示",msg:"文件下载中,请等待..",icon : 1,time:1000});
        if(selectedLst.length == 0){
            var d = {};
            var obj = {};

            obj.startTimeLong = $.laydate.getTime("#startTime", "start");
            obj.endTimeLong = $.laydate.getTime("#startTime", "end");
            obj.insideOutside = $("#officeInsideOutsideQuery option:selected").text();
            obj.unit = $("#unitQuery option:selected").text();
            obj.originalNumber = "原编号"==$("#numberQuery").val()?"":$("#numberQuery").val();
            obj.title = "关键字"==$("#contentQuery").val()?"":$("#contentQuery").val();
            obj.type = "wjlx0001";
            obj.startTimeReceiveLong = $.laydate.getTime("#receiveTime", "start");
            obj.endTimeReceiveLong = $.laydate.getTime("#receiveTime", "end");
            obj.unitReceive = $("#unitQueryReceive").val();
            obj.receivePerson = "接收人"==$("#receivePersonQuery").val()?"":$("#receivePersonQuery").val();
            obj.createPerson = $("#createPersonQuery").val();
            obj.createUnitId = $("#createUnitQuery").val();
            $.util.objToStrutsFormData(obj, "srp", d);

            var form = $.util.getHiddenForm(context+'/clue/exportSecret', d);
            $.util.subForm(form);
        }else{
            var str = "";
            for(var i in selectedLst){
                str += selectedLst[i] + ",";
            }
            str = str.substr(0,str.length-1);
            var d = {};
            $.util.objToStrutsFormData(str, "secretId", d);
            var form = $.util.getHiddenForm(context+'/clue/exportSecretForIdLst', d);
            $.util.subForm(form);
        }
    }

    /**
     * 下载密件
     */
    function downLoadSecret(fileName){
        /*
        var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
        var initData = frameData.initData;
        var url=initData.url;
        window.open(context+url) ;
        */

        var url = '/clue/downloadSecret?fileName=';

        window.open(context+url+fileName) ;

    }

    /**
     * 弹出新增页面
     *
     */
    function addSecret(){
        var title = "文件登记";

        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/clue/addSecret',
            pageLoading : true,
            title : title,
            width : "850px",
            height : "540px",
            btn:["保存","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.addSecretLayer ;  //获取弹窗界面的操作对象
                    cm.saveSecret();
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
                initClueTable();
            }
        });
    }

    /**
     * 删除
     */
    function  deleteBtnClick(){
        if(getIdList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"至少勾选一项进行删除!",title:"提示"});
            return false;
        }

        $.util.topWindow().$.layerAlert.confirm({
            msg:"确认删除吗？",
            title:"提示",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            yes:function(index, layero){
                deleteSecrets();
            }
        });
    }

    function deleteSecrets(){

        var idList = getIdList();

        var obj = new Object();
        $.util.objToStrutsFormData(idList, "idList", obj);
        $.ajax({
            url:context +'/clue/deleteSecrets',
            data:obj,
            type:'post',
            success:function(successData){
                $.util.topWindow().$.layerAlert.alert({msg:"删除成功!",title:"提示",end:function(){
                    location.reload();
                }});

            }
        })

    }

    /**
     * 得到当前idList
     *
     */
    function getIdList(){
        var idList = [];
        $.each($(".checked"), function (e,m) {
            console.log($(m).parent(".divid"));
            var str = $(m).parent(".divid").attr("valid");
            idList.push(str);
        })
        return idList;
    }

    /**
     * 修改
     *
     */
    function editSecretOnClick(){
        if(getIdList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"您未勾选,请勾选一项进行编辑!",title:"提示"});
            return false;
        }
        if(getIdList().length > 1){
            $.util.topWindow().$.layerAlert.alert({msg:"您选择了超过一项,请勾选一项进行编辑!",title:"提示"});
            return false;
        }
        var id = getIdList()[0];

        $.ajax({
            url:context + '/clue/canEdit',
            type:'post',
            data:{secretIds:id},
            dataType:"json",
            success:function(successData){

                if(successData){
                    editSecretOnPage(id);
                }
                else{
                    $.util.topWindow().$.layerAlert.alert({msg:"非本单位登记文件不能修改!",title:"提示"});
                }
            }
        });
    }
    /**
     * 弹出编辑页面
     *
     */
    function editSecretOnPage(id){
        var title = "编辑文件信息";

        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/clue/editSecret',
            pageLoading : true,
            title : title,
            width : "700px",
            height : "540px",
            btn:["修改","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.editSecretLayer ;
                    cm.editSecret();
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
                id : id
            },
            end:function(){
                initClueTable();
            }
        });
    }

    /**
     * 通报
     *
     */
    function informOnClick(){
        if(getIdList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"您未勾选,请勾选一项进行通报!",title:"提示"});
            return false;
        }
        //单个通报
        if(getIdList().length > 1){
            $.util.topWindow().$.layerAlert.alert({msg:"您选择的密件大于一项,请勾选一项进行通报!",title:"提示"});
            return false;
        }
        var id = getIdList()[0];

        $.ajax({
            url:context + '/clue/canInform',
            type:'post',
            data:{secretIds:id},
            dataType:"json",
            success:function(successData){

                if(successData.code == null || successData.code == "") {

                }
                else if(successData.code == "hs") {
                    $.util.topWindow().$.layerAlert.alert({msg:"会商无需通报!",title:"提示"});
                }
                else if(successData.code == "true"){
                    informOnPage(id);
                }
                else if(successData.code == "false"){
                    $.util.topWindow().$.layerAlert.alert({msg:"非本单位登记密件不能通报!",title:"提示"});
                }
            }
        });

        //批量通报
        /*
        var idArr = getIdList();
        var id = "";
        for (var i = 0;i < idArr.length;++i) {
            id += idArr[i];
            if(i != idArr.length - 1) {
                id += ",";
            }
        }

        $.ajax({
            url:context + '/clue/canEdit',
            type:'post',
            data:{secretIds:id},
            dataType:"json",
            success:function(successData){

                if(successData){
                    informOnPage(id);
                }
                else{
                    $.util.topWindow().$.layerAlert.alert({msg:"非本单位登记密件不能通报!",title:"提示"});
                }
            }
        });
        */
    }
    /**
     * 弹出通报页面
     *
     */
    function informOnPage(id){
        var secretId = id;

        window.top.$.layerAlert.dialog({
            content : context +  '/show/page/web/clue/chooseSecretInformUnitLayer',
            pageLoading : true,
            title:"通报",
            width : "320px",
            height : "400px",
            shadeClose : false,
            initData:{
                secretId : secretId
            },
            success:function(layero, index){

            },
            end:function(){
                //$(".save").removeAttr("disabled");
                $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
            },
            btn:["通报", "关闭"],
            callBacks:{
                btn1:function(index, layero){

                    var dataMap = {};
                    var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                    var obj = cm.getSelected();
                    if(obj.flag == false){
                        window.top.$.layerAlert.alert({msg:obj.msg ,icon:"1",end : function(){
                            return;
                        }});
                        return;
                    }
                    var unitLst = "";
                    for(var i = 0; i < obj.unitLst.length; i++){
                        unitLst += obj.unitLst[i];
                        if(i != obj.unitLst.length - 1){
                            unitLst += ";"
                        }
                    }
                    $.util.objToStrutsFormData(secretId, "secretId", dataMap);
                    $.util.objToStrutsFormData(unitLst, "unitLst", dataMap);

                    $.ajax({
                        url: context + '/clue/saveSecretInform',
                        type: 'post',
                        data: dataMap,
                        dataType: 'json',
                        success: function (successData) {

                            if (successData.flag == "true") {
                                window.top.$.layerAlert.alert({msg:"通报成功！" ,icon:"1",end : function(){
                                    window.top.layer.close(index);
                                    location.reload();
                                    return;
                                }});
                            } else {
                                window.top.$.layerAlert.alert({
                                    msg: "通报失败!" , icon: "2", end: function () {
                                    }
                                });
                            }
                        }
                    });

                    $.util.topWindow().$.layerAlert.closeWithLoading(index);
                },
                btn2:function(index, layero){

                    $.util.topWindow().$.layerAlert.closeWithLoading(index);
                }
            }
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
        var functionName = "/clue/findSecrets";
        if($("#useLastPage").val() == "true"){
            tb.displayStart = $("#pageStart").val();
            $("#useLastPage").val(false);
        }
        tb.ajax.url = context + functionName;
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    return "<div class='divid' valid='"+data+"'><input name='check' type='checkbox' class='icheckbox rowSelect' name='rowSelect' value=" + data + "></div>";
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "通报时间",
                "data" : "createTime",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd HH:mm:ss");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "通报单位",
                "data" : "createUnitStr",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return data;
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "通报人",
                "data" : "createPerson",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return data;
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "来源具体单位",
                "data" : "unit",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        if(data.length > 7){
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
                "targets" : 5,
                "width" : "",
                "title" : "原编号",
                "data" : "originalNumber",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return data;
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "标题",
                "data" : "title",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        if(data.length > 12){
                            var str = '<div class="fi-ceng-out">' + data.substr(0,12) + '...' +
                                '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                            return str;
                        }else{
                            return data;
                        }
                    }
                    else{
                        return "";
                    }
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "批示",
                "data" : "secretInstructionPojoList",
                "render" : function(data, type, full, meta) {
                    if(data != null && data.length > 0){
                        var str;
                        str = '<div class="fi-ceng-out"><span class="ztName">' + "查看" +
                            '</span><div class="fi-ceng" style="left:-300px;"><table class="table table-border table-condensed">' +
                            '<thead><tr><th>批示时间</th><th>批示内容</th></tr></thead><tbody>';

                        for(var i in data){
                            var obj = data[i];
                            var date = new Date(obj.updateTime);
                            str += '<tr>'+
                                '<td>' + $.date.dateToStr(date, "yyyy年MM月dd日 HH:mm") + '</td>'+
                                '<td>' + obj.content + '</td>'+
                                '</tr>';
                        }
                        str += '</tbody></table></div></div>';
                        return str;
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "附件",
                "data" : {
                    fileName:"fileName",
                    fileId:"fileId"
                },
                "render" : function(data, type, full, meta) {

                    if(full.targetId != null && full.targetId != "") {  //本单位是接收单位

                        if(full.isReceive != null && full.isReceive == "true") { //已接收
                            var str = "";
                            var fileName = "";
                            var fileId = "";
                            for(var i in data.fileId) {
                                fileName = data.fileName[i];
                                fileId = data.fileId[i];
                                if(fileId!=null && fileId != "") {
                                    str += '<a class="downloadBtn" href="#" id=' + fileId + '>' + fileName + '</a><br/>';
                                }
                            }
                            return str;
                        } else {    //未接收
                            var str = "<span class='fc-red'>下载附件前请先接收!</span><br/>";
                            var fileName = "";
                            var fileId = "";
                            for(var i in data.fileId) {
                                fileName = data.fileName[i];
                                fileId = data.fileId[i];
                                if(fileId!=null && fileId != "") {
                                    str += fileName + '<br/>';
                                }
                            }
                            return str;
                        }
                    }else {
                        var str = "";
                        var fileName = "";
                        var fileId = "";
                        for(var i in data.fileId) {
                            fileName = data.fileName[i];
                            fileId = data.fileId[i];
                            if(fileId!=null && fileId != "") {
                                str += '<a class="downloadBtn" href="#" id=' + fileId + '>' + fileName + '</a><br/>';
                            }
                        }
                        return str;
                    }
                }
            },
            //先去掉类型
            // {
            //     "targets" : 8,
            //     "width" : "",
            //     "title" : "类型",
            //     "data" : "type",
            //     "render" : function(data, type, full, meta) {
            //         if(data != null){
            //             return data;
            //         }else{
            //             return "";
            //         }
            //     }
            // },
            {
                "targets" : 9,
                "width" : "",
                "title" : "密件状态",
                "data" : "secretInformRecordList",
                "render" : function(data, type, full, meta) {
                    if(full.type == "密件") {
                        if(data != null && data.length > 0) {
                            var wholeStatus = true;  //整体状态
                            for(var i in data){
                                var obj = data[i];
                                if(obj.checkFlag == "sf0002"){
                                    wholeStatus = false;
                                    break;
                                }
                            }

                            var str;

                            if(wholeStatus) {
                                str = '<div class="fi-ceng-out"><span class="ztName">' + "已接收" +
                                    '</span><div class="fi-ceng" style="left:-300px;"><table class="table table-border table-condensed">' +
                                    '<thead><tr><th>通报单位</th><th>接收状态</th><th>接收时间</th><th>接收人</th></tr></thead><tbody>';
                            } else {
                                str = '<div class="fi-ceng-out"><span class="ztName">' + "新增" +
                                    '</span><div class="fi-ceng" style="left:-300px;"><table class="table table-border table-condensed">' +
                                    '<thead><tr><th>通报单位</th><th>接收状态</th><th>接收时间</th><th>接收人</th></tr></thead><tbody>';
                            }

                            for(var i in data){
                                var obj = data[i];
                                if(obj.checkFlag == "sf0002"){
                                    str += '<tr>'+
                                        '<td>' + obj.targetType + '</td>'+
                                        '<td class="fc-red">' + "待接收" + '</td>'+
                                        '<td>' + "" + '</td>'+
                                        '<td>' + "" + '</td>'+
                                        '</tr>';
                                }else{
                                    str += '<tr>'+
                                        '<td>' + obj.targetType + '</td>'+
                                        '<td>' + "已接收" + '</td>'+
                                        '<td>' + (obj.updateTime==null?"":obj.updateTime.substr(0,19)) + '</td>'+
                                        '<td>' + (obj.receivePerson==null?"":obj.receivePerson) + '</td>'+
                                        '</tr>';
                                }
                            }
                            str += '</tbody></table></div></div>';
                            return str;
                        }else {
                            return "无通报";
                        }
                    }
                    return "";
                }
            },
            {
                "targets" : 10,
                "width" : "",
                "title" : "本单位接收",
                "data" : {
                    targetId:"targetId",
                    isReceive:"isReceive",
                    id:"id"
                },
                "render" : function(data, type, full, meta) {
                    if(data.targetId != null && data.targetId != "") {  //本单位是接收单位

                        if(data.isReceive != null && data.isReceive == "true") { //已接收
                           return "已接收";
                        } else {    //未接收
                            var str = '<a href="###" class="btn btn-default btn-xs btnView fc-red" targetId=' + data.targetId
                                + " secretId=" + data.id + ">接收</a>";
                            return str;
                        }
                    }else {
                        return "";
                    }
                }
            },
            {
                "targets" : 11,
                "width" : "",
                "title" : "本单位接收时间",
                "data" : {
                    targetId:"targetId",
                    isReceive:"isReceive",
                    id:"id"
                },
                "render" : function(data, type, full, meta) {
                    if(data.targetId != null && data.targetId != "") {  //本单位是接收单位
                        if(data.isReceive != null && data.isReceive == "true") { //已接收
                            for(var i in full.secretInformRecordList){
                                var obj = full.secretInformRecordList[i];
                                if(obj.targetId == data.targetId) {
                                    return (obj.updateTime==null?"":obj.updateTime.substr(0,19));
                                }
                            }
                        }
                    }
                    return "";
                }
            },
            {
                "targets" : 12,
                "width" : "",
                "title" : "本单位接收人",
                "data" : {
                    targetId:"targetId",
                    isReceive:"isReceive",
                    id:"id"
                },
                "render" : function(data, type, full, meta) {
                    if(data.targetId != null && data.targetId != "") {  //本单位是接收单位
                        if(data.isReceive != null && data.isReceive == "true") { //已接收
                            for(var i in full.secretInformRecordList){
                                var obj = full.secretInformRecordList[i];
                                if(obj.targetId == data.targetId) {
                                    return (obj.receivePerson==null?"":obj.receivePerson);
                                }
                            }
                        }
                    }
                    return "";
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
            var obj = new Object();

            //obj.dataTime = "来文时间"==$("#startTimeInput").val()?"":$("#startTimeInput").val();
            //obj.startTime = "来文时间范围"==$("#startTimeInput").val()?"":$("#startTimeInput").val();
            //obj.endTime = "来文时间范围"==$("#endTimeInput").val()?"":$("#endTimeInput").val();
            obj.startTimeLong = $.laydate.getTime("#startTime", "start");
            obj.endTimeLong = $.laydate.getTime("#startTime", "end");
            //obj.insideOutside = "局内局外"==$("#officeInsideOutsideQuery").val()?"":$("#officeInsideOutsideQuery").val();
            //obj.unit = "单位"==$("#unitQuery").val()?"":$("#unitQuery").val();
            obj.insideOutside = $("#officeInsideOutsideQuery option:selected").text();
            obj.unit = $("#unitQuery option:selected").text();
            obj.originalNumber = "原编号"==$("#numberQuery").val()?"":$("#numberQuery").val();
            obj.title = "关键字"==$("#contentQuery").val()?"":$("#contentQuery").val();
            //先去掉类型
            //obj.type = "类型"==$("#typeQuery").val()?"":$("#typeQuery").val();
            obj.type = "wjlx0001";
            //obj.startTimeReceive = "接收时间范围"==$("#startTimeInputReceive").val()?"":$("#startTimeInputReceive").val();
            //obj.endTimeReceive = "接收时间范围"==$("#endTimeInputReceive").val()?"":$("#endTimeInputReceive").val();
            obj.startTimeReceiveLong = $.laydate.getTime("#receiveTime", "start");
            obj.endTimeReceiveLong = $.laydate.getTime("#receiveTime", "end");
            obj.unitReceive = $("#unitQueryReceive").val();
            obj.receivePerson = "接收人"==$("#receivePersonQuery").val()?"":$("#receivePersonQuery").val();
            obj.createPerson = $("#createPersonQuery").val();
            obj.createUnitId = $("#createUnitQuery").val();
            //$("#pageStart").val(d.start);
            $.util.objToStrutsFormData(obj, "srp", d);
            //$.util.objToStrutsFormData("false", "myClue", d);

        };
        tb.paramsResp = function(json) {

        };
        tb.rowCallback = function(row,data, index) {

        };
        clueTable = $("#clueTable").DataTable(tb);
    }

})(jQuery);