var initFlag = false;
(function($){
    "use strict";

    var report = null;
    var deletefjLst = [];
    $(document).ready(function() {
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
            $(".save").attr("disabled", "disabled");
            var dataMap = {};
            var demo = $.validform.getValidFormObjById("validform") ;
            var flag = $.validform.check(demo) ;
            if(!flag){
                $(".save").removeAttr("disabled");
                setTimeout(function(){
                    $.validform.closeAllTips("validform");
                },3000);
                return ;
            }
            webOffice1_Object_SaveToServer();
        });

        $(document).on("click","#showPic",function(){
            window.open(context+"/show/page/web/report/img?imgId="+ report.picId);
        });

        $(document).on("click","#downloadPic",function(){
            window.open(context+"/downloadWord/"+ report.picId);
        });

        $(document).on("click",".deleteFj",function(){
            deletefjLst.push($(this).attr("fileId"));
            $(this).parent("p").remove();
        });
    }

    function saveData(fileId){
        var dataMap = {};
        var orp = report;
        orp.securityClassification = $.select2.val("#securityClassification");
        orp.level = $.select2.val("#level");
        orp.updateTimeLong = (new Date()).getTime();
        orp.sourceUnit = $("#sourceUnit").val();
        orp.title = $("#title").val();
        orp.code = $("#code").val();
        orp.fileId = fileId;
        orp.approvePerson = $("#approvePerson").val();
        orp.inspectPerson = $("#inspectPerson").val();
        orp.editPerson = $("#editPerson").val();
        orp.phone = $("#phone").val();
        orp.ezdEditPerson = $("#ezdEditPerson").val();
        orp.ezdApprovePerson = $("#ezdApprovePerson").val();
        orp.instruction = $("#instruction").val();
        orp.picId = "";
        orp.remark = $("#remark").val();
        var deleteFj = "";
        for(var i=0; i<deletefjLst.length; i++){
            deleteFj += deletefjLst[i] + ",";
        }
        if(deleteFj != ""){
            deleteFj = deleteFj.substr(0, deleteFj.length-1);
        }
        orp.deleteFj = deleteFj;
        $.util.objToStrutsFormData(orp, "orp", dataMap);
        $.ajax({
            url:context +'/organizeReport/ezdModify',
            type:'post',
            data:dataMap,
            dataType:'json',
            success:function(successData){
                window.location = context + "/show/page/web/report/report?reportId=" + report.id;
            }
        });
    }

    function webOffice1_Object_SaveToServer(){
        var isSaved=document.all.webOffice7_1_Object.IsSaved();
        if(isSaved==0){
            document.all.webOffice7_1_Object.Save();
        }
        document.all.webOffice7_1_Object.HttpInit();
        if($.util.isBlank($("#code").val())){
            document.all.webOffice7_1_Object.HttpAddPostString("fileName",$.base64.encode("北京公安情报信息.doc"));
        }else{
            document.all.webOffice7_1_Object.HttpAddPostString("fileName",$.base64.encode("北京公安情报信息第" + $("#code").val() + "期.doc"));
        }
        document.all.webOffice7_1_Object.HttpAddPostCurrFile("file","");
        var url = baseUrl + "/uploadWord";
        var returnVal = document.all.webOffice7_1_Object.HttpPost(url);
        var returnJson = JSON.parse(returnVal) ;
        var fileId = returnJson.uploadFileId ;
        if(returnJson.returnCode == "SUCCESS"){
            saveData(fileId);
        } else  {
            alert("文件上传失败,请联系管理员");
            $(".save").removeAttr("disabled");
        }
    }

    function showOrganizeReport(){
        $.when(
            $.ajax({
                url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
                type:'post',
                data:{dicTypeId : "mj"},
                dataType:'json',
                success:function(successData){
                    $.select2.addByList("#securityClassification", successData, "id", "name", true, true);
                }
            }),
            $.ajax({
                url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
                type:'post',
                data:{dicTypeId : "qbjb"},
                dataType:'json',
                success:function(successData){
                    $.select2.addByList("#level", successData, "id", "name", true, true);
                }
            })
        ).done(function(){
            $.ajax({
                url:context +'/organizeReport/findOne',
                type:'post',
                data:{
                    id:reportId
                },
                dataType:'json',
                success:function(successData){
                    report = successData.returnData;
                    $.select2.val("#securityClassification", report.securityClassification);
                    $.select2.val("#level", report.level);
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
                    $.select2.val("#sourceUnit", report.sourceUnit);
                    $("#code").val(report.code);
                    $("#title").val(report.title);
                    $("#approvePerson").val(report.approvePerson);
                    $("#inspectPerson").val(report.inspectPerson);
                    $("#editPerson").val(report.editPerson);
                    $("#phone").val(report.phone);
                    $("#ezdEditPerson").val(report.ezdEditPerson);
                    $("#ezdApprovePerson").val(report.ezdApprovePerson);
                    $("#instruction").val(report.instruction);
                    $("#remark").val(report.remark);
                    webOffice7_1_Object_init(report.fileId);
                    var str = "";
                    for(var i in report.fjLst){
                        str += "<p><a href='###' class='downloadFj' fileId='" + i + "' >" + report.fjLst[i] + "</a>&nbsp;&nbsp;&nbsp;" +
                            "<a href='###' class='deleteFj' fileId='" + i + "' >删除</a></p>";
                    }
                    $("#fjLst").append(str);
                }
            })
        })

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
