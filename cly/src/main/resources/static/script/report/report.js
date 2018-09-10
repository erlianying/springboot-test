var initFlag = false;
(function($){
    "use strict";
    var reportFileId = null;
    var reportOldFileId = null;
    $(document).ready(function() {
        setTimeout(wordInit, 5000);
        setTimeout(wordInit, 10000);
        setTimeout(wordInit, 15000);
        $(window).on("unload", window_onunload);
        $(document).on("click","#print",function(){
            webOffice7_1_Object_print();
        });
        $(document).on("click","#downloadFile",function(){
            downloadFile();
        });
        $(document).on("click","#downloadPdf",function(){
            downloadPdf();
        });
        $(document).on("click","#downloadOldFile",function(){
            downloadOldFile();
        });
        $(document).on("click","#fullScreen",function(){
            webOffice7_1_Object_fullScreen();
        });
        $(document).on("click","#back",function(){
            if(listToReport == "true"){
                window.top.history.back();
            }else{
                window.top.history.go(-2);
            }
        });
    });

    function downloadFile(){
        if(reportFileId != null){
            var form = $.util.getHiddenForm(context+'/organizeReport/downloadWord', {"metaId": reportFileId});
            $.util.subForm(form);
        }
    }

    function downloadPdf(){
        if(reportFileId != null){
            var form = $.util.getHiddenForm(context+'/organizeReport/downloadPdf', {"metaId": reportFileId});
            $.util.subForm(form);
        }
    }

    function downloadOldFile(){
        if(reportOldFileId != null){
            var form = $.util.getHiddenForm(context+'/organizeReport/downloadWord', {"metaId": reportOldFileId});
            $.util.subForm(form);
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
                var report = successData.returnData;
                reportFileId = report.fileId;
                if(currentUnit==$.common.org.EZD && !$.util.isBlank(report.oldFileId)){
                    $("#downloadOldFile").show();
                }
                reportOldFileId = report.oldFileId;
                webOffice7_1_Object_init(reportFileId);
            }
        });
    }

    function webOffice7_1_Object_init(fileId){
        try{
            var serverSideBlankDocx = baseUrl + "/downloadWord/" + fileId;
            document.all.webOffice7_1_Object.ShowToolBar = false;
            document.all.webOffice7_1_Object.LoadOriginalFile(serverSideBlankDocx, "doc");
            document.all.webOffice7_1_Object.ProtectDoc(1, 2, "12345");
            initFlag = true;
        }catch(e){
            $.util.log("异常\r\nError:"+e+"\r\nError Code:"+e.number+"\r\nError Des:"+e.description);
        }
    }

    function webOffice7_1_Object_print(){
        try{
            document.all.webOffice7_1_Object.PrintDoc(1);
        }catch(e){
            alert("异常\r\nError:"+e+"\r\nError Code:"+e.number+"\r\nError Des:"+e.description);
        }
    }

    function webOffice7_1_Object_fullScreen(){
        try{
            document.all.webOffice7_1_Object.FullScreen = true;
        }catch(e){
            alert("异常\r\nError:"+e+"\r\nError Code:"+e.number+"\r\nError Des:"+e.description);
        }
    }

    function window_onunload() {
        try{
            document.all.webOffice7_1_Object.Close();
        }catch(e){
            //	alert("异常\r\nError:"+e+"\r\nError Code:"+e.number+"\r\nError Des:"+e.description);
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
