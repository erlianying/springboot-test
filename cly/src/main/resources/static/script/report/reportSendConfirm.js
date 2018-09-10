var initFlag = false;
(function($){
    "use strict";

    var orp = {};

    var fileCode = null;

    $(document).ready(function() {
        var str;
        str = '<p class="pull-left col-xs-12" style="margin: 5px 25px 5px 0;" myselect="' + "015001" +
            '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" checked="checked" value="' + "015001" + '">' + '<span class="m-ui-color1">' + "网安总队一支队" + '</span></p>';
        $(".selectUnitDiv").append(str);
        str = '<p class="pull-left col-xs-12" style="margin: 5px 25px 5px 0;" myselect="' + "015003" +
            '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" checked="checked" value="' + "015003" + '">' + '<span class="m-ui-color1">' + "网安总队三支队" + '</span></p>';
        $(".selectUnitDiv").append(str);
        str = '<p class="pull-left col-xs-12" style="margin: 5px 25px 5px 0;" myselect="' + "015004" +
            '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" checked="checked" value="' + "015004" + '">' + '<span class="m-ui-color1">' + "网安总队四支队" + '</span></p>';
        $(".selectUnitDiv").append(str);
        str = '<p class="pull-left col-xs-12" style="margin: 5px 25px 5px 0;" myselect="' + "015005" +
            '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" checked="checked" value="' + "015005" + '">' + '<span class="m-ui-color1">' + "网安总队五支队" + '</span></p>';
        $(".selectUnitDiv").append(str);
        str = '<p class="pull-left col-xs-12" style="margin: 5px 25px 5px 0;" myselect="' + "015006" +
            '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" checked="checked" value="' + "015006" + '">' + '<span class="m-ui-color1">' + "网安总队六支队" + '</span></p>';
        $(".selectUnitDiv").append(str);
        str = '<p class="pull-left col-xs-12" style="margin: 5px 25px 5px 0;" myselect="' + "015007" +
            '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" checked="checked" value="' + "015007" + '">' + '<span class="m-ui-color1">' + "网安总队七支队" + '</span></p>';
        $(".selectUnitDiv").append(str);
        str = '<p class="pull-left col-xs-12" style="margin: 5px 25px 5px 0;" myselect="' + "015008" +
            '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" checked="checked" value="' + "015008" + '">' + '<span class="m-ui-color1">' + "网安总队八支队" + '</span></p>';
        $(".selectUnitDiv").append(str);
        events();
        setTimeout(wordInit, 5000);
        setTimeout(wordInit, 10000);
        setTimeout(wordInit, 15000);
    });

    function events(){
        $(document).on("click","#fullScreen",function(){
            webOffice7_1_Object_fullScreen();
        });
        $(document).on("click","#back",function(){
            window.top.history.back();
        });
        $(window).on("unload", window_onunload);
        $(document).on("click","#save",function(){
            $("#save").attr("disabled", "disabled");
            var dataMap = {};
            var demo = $.validform.getValidFormObjById("validform") ;
            var flag = $.validform.check(demo) ;
            if(!flag){
                $("#save").removeAttr("disabled");
                setTimeout(function(){
                    $.validform.closeAllTips("validform");
                },3000);
                return ;
            }
            webOffice1_Object_SaveToServer();
        });
    }

    function saveData(fileId){
        var dataMap = {};
        orp.sendStatus = "bbzt0003";
        orp.fileId = fileId;
        orp.receivePerson = $("#receivePerson").val();
        orp.updateTimeLong = (new Date()).getTime();
        orp.instruction = $("#instruction").val();
        orp.picId = "";
        var targetIds = "";
        var len = $.icheck.getChecked("rowSelect").length;
        for(var i = 0;i < len;++i) {
            targetIds += $($.icheck.getChecked("rowSelect")[i]).val() + ",";
        }
        targetIds = targetIds.substr(0, targetIds.length - 1);
        orp.targetIds = targetIds;

        $.util.objToStrutsFormData(orp, "orp", dataMap);
        $.ajax({
            url:context +'/organizeReport/send',
            type:'post',
            data:dataMap,
            dataType:'json',
            success:function(successData){
                window.location = context + "/show/page/web/report/report?reportId=" + reportId;
            }
        });
    }

    function webOffice1_Object_SaveToServer(){
        var isSaved=document.all.webOffice7_1_Object.IsSaved();
        if(isSaved==0){
            document.all.webOffice7_1_Object.Save();
        }
        document.all.webOffice7_1_Object.HttpInit();
        document.all.webOffice7_1_Object.HttpAddPostString("fileName",$.base64.encode("北京公安情报信息第" + fileCode + "期.doc"));
        document.all.webOffice7_1_Object.HttpAddPostCurrFile("file","");
        var url = baseUrl + "/uploadWord";
        var returnVal = document.all.webOffice7_1_Object.HttpPost(url);
        var returnJson = JSON.parse(returnVal) ;
        var fileId = returnJson.uploadFileId ;
        if(returnJson.returnCode == "SUCCESS"){
            saveData(fileId);
        } else  {
            alert("文件上传失败,请联系管理员");
            $("#save").removeAttr("disabled");
        }
    }

    function showOrganizeReport(){
        $.ajax({
            url:context +'/organizeReport/findOne',
            type:'post',
            data:{
                id:reportId
            },
            dataType:'json',
            success:function(successData){
                orp = successData.returnData;
                fileCode = orp.code;
                webOffice7_1_Object_init(orp.fileId);
            }
        });
    }

    function webOffice7_1_Object_init(fileId){
        try{
            document.all.webOffice7_1_Object.ShowToolBar = false;
            var serverSideBlankDocx = baseUrl + "/downloadWord/" + fileId;
            document.all.webOffice7_1_Object.LoadOriginalFile(serverSideBlankDocx, "doc");
            initFlag = true;
        }catch(e){
            $.util.log("异常\r\nError:"+e+"\r\nError Code:"+e.number+"\r\nError Des:"+e.description);
        }
    }

    function window_onunload() {
        try{
            document.all.webOffice7_1_Object.Close();
        }catch(e){
            //	alert("异常\r\nError:"+e+"\r\nError Code:"+e.number+"\r\nError Des:"+e.description);
        }
    }

    function webOffice7_1_Object_fullScreen(){
        try{
            document.all.webOffice7_1_Object.FullScreen = true;
        }catch(e){
            alert("异常\r\nError:"+e+"\r\nError Code:"+e.number+"\r\nError Des:"+e.description);
        }
    }

    jQuery.extend($.common, {
        wordInit: function(){
            showOrganizeReport();
        }
    });
})(jQuery);

function wordInit(){
    if(initFlag){
        return;
    }
    $.common.wordInit();
}


