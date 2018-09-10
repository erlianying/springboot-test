var initFlag = false;

(function($){
    "use strict";

    var fileId = null;
    var spdId = null;

    $(document).ready(function() {
        initPlupload();
        initFJPlupload();
        events();
        initData();

        setTimeout(wordInit, 5000);
        setTimeout(wordInit, 10000);
        setTimeout(wordInit, 15000);
    });

    function events(){
        $(document).on("click","#fullScreen",function(){
            webOffice7_1_Object_fullScreen();
        });
        $(document).on("click","#createClue",function(){
            window.location = context + "/show/page/web/clue/enterClue.html";
        });
        $(document).on("click","#back,#close",function(){
            window.location = context + "/show/page/web/report/registerList2.html";
        });
        $(window).on("unload", window_onunload);
        $(document).on("click","#save",function(){
            $("#save").attr("disabled", "disabled");
            var demo = $.validform.getValidFormObjById("validform") ;
            var flag = $.validform.check(demo) ;
            if(!flag){
                $("#save").removeAttr("disabled");
                setTimeout(function(){
                    $.validform.closeAllTips("validform");
                },3000);
                return ;
            }
            if($.plupload.getUploader("container").files.length == 0){
                $("#save").removeAttr("disabled");
                alert("请上传审批单");
                return;
            }
            $.ajax({
                url:context +'/organizeReport/checkName',
                type:'post',
                data:{
                    title : $("#title").val()
                },
                dataType:'json',
                success:function(successData){
                    if(successData.flag == "true"){
                        alert("标题和已有编报重复,请检查是否已提交！");
                        $("#save").removeAttr("disabled");
                    }else{
                        webOffice1_Object_SaveToServer();
                    }
                }
            });
        });
    }

    function initData(){
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
        $.select2.val("#sourceUnit",createUnit);
        $("#editPerson").val(personName);
        $("#phone").val(phone);
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : "mj"},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#securityClassification", successData, "id", "name", true, true);
            }
        });

        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : "qbjb"},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#level", successData, "id", "name", true, true);
            }
        });
    }

    /**
     * 初始化上传控件
     */
    function initPlupload(){
        var setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "container"; //容器id
        setting.url = context + "/clue/scanImport";
        setting.controlBtn = {
            container:{
                className:"upload-btn"
            },
            selectBtn:{
                className:"btn btn-primary",
                html:'<span class="glyphicon glyphicon-edit" aria-hidden="true" style="margin-right:10px;"></span>选择'
            },
            uploadBtn:{
                init:false
                // selector:'importBtn',
            }
        } ;
        setting.finishlistDom = {
            className:"upload-text",
            downloadBtn:{
                init:false
            },
            deleteBtn:{
                init:false
            }
        };
        setting.filelistDom = {
            className:"upload-text"
        };
        setting.totalInfoDom = {
            className:"upload-text"
        };
        setting.customParams = {
            testCustom1:"123",
            testCustom:function(up, file){
                return Math.random() ;
            }
        } ;
        setting.chunk_size = '0' ;
        setting.filters.max_file_size = '50mb';
        setting.filters.mime_types = [{title: "图片类型", extensions: "jpg,JPG,png,PNG,bmp,BMP,tif,TIF,pdf,PDF"}];
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = false;
        setting.multi_file_num = 1;//设置上传的文件数
        setting.multi_file_num_callback = function(max_file_size, totalSize){
            // alert(1);
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){
                var arr=[];
                for (var key in finishedFiles) {
                    arr.push(key);
                }
                spdId = arr[0];
                $.plupload.start("containerFJ");
            },
            multi_file_num_callback:function(max_file_size, totalSize){
                alert("只能上传一个附件");
            },
        }
        $.plupload.init(setting) ;
    }

    /**
     * 初始化上传控件
     */
    function initFJPlupload(){
        var setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "containerFJ"; //容器id
        setting.url = context + "/clue/scanImport";
        setting.controlBtn = {
            container:{
                className:"upload-btn"
            },
            selectBtn:{
                className:"btn btn-primary",
                html:'<span class="glyphicon glyphicon-edit" aria-hidden="true" style="margin-right:10px;"></span>选择'
            },
            uploadBtn:{
                init:false
                // selector:'importBtn',
            }
        } ;
        setting.finishlistDom = {
            className:"upload-text",
            downloadBtn:{
                init:false
            },
            deleteBtn:{
                init:false
            }
        };
        setting.filelistDom = {
            className:"upload-text"
        };
        setting.totalInfoDom = {
            className:"upload-text"
        };
        setting.customParams = {
            testCustom1:"123",
            testCustom:function(up, file){
                return Math.random() ;
            }
        } ;
        setting.chunk_size = '0' ;
        setting.filters.max_file_size = '50mb';
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = true;
        setting.multi_file_num = 10;//设置上传的文件数
        setting.multi_file_num_callback = function(max_file_size, totalSize){
            // alert(1);
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){
                var arr="";
                for (var key in finishedFiles) {
                    arr += key + ",";
                }
                if(arr != ""){
                    arr = arr.substr(0, arr.length-1);
                }
                saveData(arr);
            },
        }
        $.plupload.init(setting) ;
    }

    function saveData(arr){
        var dataMap = {};
        var orp = {};
        orp.securityClassification = $.select2.val("#securityClassification");
        orp.level = $.select2.val("#level");
        orp.code = "";
        orp.updateTimeLong = (new Date()).getTime();
        orp.sourceUnit = $("#sourceUnit").val();
        orp.title = $("#title").val();
        orp.createUnit = createUnit;
        orp.sendStatus = $.common.dict.BBZT_XZ;
        orp.approvePerson = $("#approvePerson").val();
        orp.inspectPerson = $("#inspectPerson").val();
        orp.editPerson = $("#editPerson").val();
        orp.phone = $("#phone").val();
        orp.fileId = fileId;
        orp.picId = spdId;
        orp.fjIdLst = arr;
        $.util.objToStrutsFormData(orp, "orp", dataMap);
        $.ajax({
            url:context +'/organizeReport/save',
            type:'post',
            data:dataMap,
            dataType:'json',
            success:function(successData){
                alert("保存成功!(如需生成线索,请复制编报内容后点击“新建线索”按钮)");
                $("#save").hide();
                $("#close").show();
                $("#createClue").show();
            }
        });
    }

    function webOffice1_Object_SaveToServer(){
        var isSaved=document.all.webOffice7_1_Object.IsSaved();
        if(isSaved==0){
            document.all.webOffice7_1_Object.Save();
        }
        upload();
    }

    function upload(){
        document.all.webOffice7_1_Object.HttpInit();

        document.all.webOffice7_1_Object.HttpAddPostString("fileName",$.base64.encode("北京公安情报信息.doc"));

        document.all.webOffice7_1_Object.HttpAddPostCurrFile("file",$.base64.encode("北京公安情报信息.doc"));

        var url = baseUrl + "/uploadWord";

        var returnVal = document.all.webOffice7_1_Object.HttpPost(url);

        var returnJson = JSON.parse(returnVal) ;
        fileId = returnJson.uploadFileId ;

        if(returnJson.returnCode == "SUCCESS"){
            $.plupload.start("container");
        } else  {
            alert("文件上传失败,请联系管理员");
            $("#save").removeAttr("disabled");
        }
    }
    function webOffice7_1_Object_init(){
        //只读
        //参数1为开关，1为锁0为解锁；参数2为锁定模式，全锁定为2；参数三为锁密码（实际上调用的office的保护模式）
        //document.all.webOffice1_Object.ProtectDoc(1, 2, "12345");
        var serverSideBlankDocx = baseUrl + "/downloadWord/cca1cc93-1c39-4df4-b833-a29201497a9d" ;
        try{
            document.all.webOffice7_1_Object.ShowToolBar = false;
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
            webOffice7_1_Object_init();
        }
    });
})(jQuery);

function wordInit(){
    if(initFlag){
        return;
    }
    $.common.wordInit();
}