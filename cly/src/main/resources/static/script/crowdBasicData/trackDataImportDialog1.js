$.trackDataImportDialog = $.trackDataImportDialog || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData;
    var eleurl=initData.eleurl;//电子围栏
    var trainurl=initData.trainurl;//铁路订票
    var caurl=initData.caurl;//长安数据
    var caNoIdCordurl=initData.caNoIdCordurl;//长安数据--无身份证号的
    var url=eleurl;//默认电子围栏
    var  obj={};
    var dataType=$.common.dict.ELENCTRONIC_FENCE.traceName;//默认为第一个电子围栏的名称


    $(document).ready(function() {
        $('#nowTimeBtn').text($.date.timeToStr(new Date().getTime(), "yyyy年MM月dd日 HH:mm"));
        initPlupload();//初始化控件
        initPlupload2();
        initPlupload3();
        initPlupload4();

        initPageDatas();//初始化下拉框
        $(document).on("click","#downloadTrackBtn",function(){
            downLoadModel();
        })

    });

    /**
     * 下载线索导入模板
     */
    function downLoadModel(){
        window.open(context+url) ;
    }
    /**
     *select标签选中时间
     */
      $(document).on("select2:select","#dataType",function(){
         dataType=$.select2.val("#dataType");
         $('.upload-control').hide();
          if(dataType==$.common.dict.ELENCTRONIC_FENCE.traceName){
              $('#container').show();
              url=eleurl;
          }else if(dataType==$.common.cbtt.TRAIN.traceName){
              $('#container2').show();
              url=trainurl;
          }else if(dataType==$.common.dict.DATA_CA.traceName){
              $('#container3').show();
              url=caurl;
          }else{
              $('#container4').show();
              url=caNoIdCordurl;
          }
          // if(dataType==$.common.dict.ELENCTRONIC_FENCE.sign){
          //     $('#container').show();
          // }else if(dataType==$.common.dict.WIFI_FENCE.sign){
          //     $('#container2').show();
          // }else if(dataType==$.common.dict.TAKE_OUT_FOOD.sign){
          //     $('#container3').show();
          // }else if(dataType==$.common.dict.ONLINE_TAXI.sign){
          //     $('#container4').show();
          // }else if(dataType==$.common.dict.ONLINE_RENTING.sign){
          //     $('#container5').show();
          // }else if(dataType==$.common.dict.BKIE_SHARE.sign){
          //     $('#container6').show();
          // }else if(dataType==$.common.dict.EXPRESS_DELIVERY.sign){
          //     $('#container7').show();
          // }
    });



    /**
     * 初始化上传控件--电子围栏
     */
    function initPlupload(){
      var  setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "container"; //容器id
        setting.url = context+'/elecronicFenceImportController/chickeAndImportElecronicFence';
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
        setting.filters.mime_types = [{title: "excel类型", extensions: "xls,xlsx"}];
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = false;
        setting.multi_file_num = 1;//设置上传的文件数
        setting.multi_file_num_callback = function(max_file_size, totalSize){//文件超出规格后的回调
            // alert(1);
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){
                for (var key in finishedFiles) {
                    obj = finishedFiles[key].id;
                    if(obj.msg!="true"){
                        $.layerAlert.alert({title:"提示",msg:obj.msg,icon : 5});
                        // $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }else{
                        openFinishWindow();
                    }

                }
            },
            multi_file_num_callback:function(max_file_size, totalSize){
                $.layerAlert.alert({title:"提示",msg:"每次只能上传一个附件",icon : 5});
            },
            filesAdded:function (up, files){

            }

        }
        $.plupload.init(setting) ;
    }

    /**
     * 初始化上传控件--铁路
     */
    function initPlupload2(){
       var setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "container2"; //容器id
        setting.url = context+'/elecronicFenceImportController/chickeAndImportTrain';
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
        setting.filters.mime_types = [{title: "excel类型", extensions: "xls,xlsx"}];
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = false;
        setting.multi_file_num = 1;//设置上传的文件数
        setting.multi_file_num_callback = function(max_file_size, totalSize){//文件超出规格后的回调
            // alert(1);
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){
                for (var key in finishedFiles) {
                    obj = finishedFiles[key].id;
                    if(obj.msg!="true"){
                        $.layerAlert.alert({title:"提示",msg:obj.msg,icon : 5});
                        // $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }else{
                        openFinishWindow();
                    }

                }
            },
            multi_file_num_callback:function(max_file_size, totalSize){
                $.layerAlert.alert({title:"提示",msg:"每次只能上传一个附件",icon : 5});
            },
            filesAdded:function (up, files){

            }

        }
        $.plupload.init(setting) ;
    }

    /**
     * 初始化上传控件--长安数据
     */
    function initPlupload3(){
        var setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "container3"; //容器id
        setting.url = context+'/elecronicFenceImportController/chickeAndImportCA';
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
        setting.filters.mime_types = [{title: "excel类型", extensions: "xls,xlsx"}];
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = false;
        setting.multi_file_num = 1;//设置上传的文件数
        setting.multi_file_num_callback = function(max_file_size, totalSize){//文件超出规格后的回调
            // alert(1);
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){
                for (var key in finishedFiles) {
                    obj = finishedFiles[key].id;
                    if(obj.msg!="true"){
                        $.layerAlert.alert({title:"提示",msg:obj.msg,icon : 5});
                        // $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }else{
                        openFinishWindow();
                    }

                }
            },
            multi_file_num_callback:function(max_file_size, totalSize){
                $.layerAlert.alert({title:"提示",msg:"每次只能上传一个附件",icon : 5});
            },
            filesAdded:function (up, files){

            }

        }
        $.plupload.init(setting) ;
    }
    /**
     * 初始化上传控件--长安数据无身份证号
     */
    function initPlupload4(){
        var setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "container4"; //容器id
        setting.url = context+'/elecronicFenceImportController/chickeAndImportCANoIdCord';
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
        setting.filters.mime_types = [{title: "excel类型", extensions: "xls,xlsx"}];
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = false;
        setting.multi_file_num = 1;//设置上传的文件数
        setting.multi_file_num_callback = function(max_file_size, totalSize){//文件超出规格后的回调
            // alert(1);
        };
        setting.callBacks = {
            uploadAllFinish:function(up, finishedFiles){
                for (var key in finishedFiles) {
                    obj = finishedFiles[key].id;
                    if(obj.msg!="true"){
                        $.layerAlert.alert({title:"提示",msg:obj.msg,icon : 5});
                        // $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }else{
                        openFinishWindow();
                    }

                }
            },
            multi_file_num_callback:function(max_file_size, totalSize){
                $.layerAlert.alert({title:"提示",msg:"每次只能上传一个附件",icon : 5});
            },
            filesAdded:function (up, files){

            }

        }
        $.plupload.init(setting) ;
    }




    /**
     * 打开完成界面
     */
    function openFinishWindow(){
        $.util.topWindow().$.layerAlert.dialog({//完成界面
            content : context + "/show/page/web/history/historyBulkImportDialog5",
            pageLoading : true,
            title : '导入完成',
            width : "400px",
            height : "300px",
            btn:["查看错误日志","确定"],
            callBacks:{
                btn1:function(index, layero){
                    if(obj.sourceFileId){
                        $.ajax({ //不断请求后台获取数据
                            url:context + '/crowd/findsuccessAndErrorCount',
                            data:{sourceFileId:obj.sourceFileId},
                            type:"post",
                            dataType:"json",
                            success:function(data){
                                var errFileId=data.errFileId;
                                // window.open(context+"/crowd/downloadAttachment/"+errFileId) ;
                                window.open(context+"/crowd/downloadAttachment?metaId="+errFileId) ;
                            }
                        })

                    }
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeAll();
                },


            },
            success:function(layero, index){

            },
            initData:{
                sourceFileId:obj.sourceFileId,
            },
            end:function(){

            }
        });
    }


    /**
     * 初始化页面字典项
     */
    function initPageDatas(){
        var arr=[];
        function Data(id,name){
            this.id=id;
            this.name=name;
        }
        var a=$.common.dict.ELENCTRONIC_FENCE.traceName;
        arr.push(new Data($.common.dict.ELENCTRONIC_FENCE.traceName,$.common.dict.ELENCTRONIC_FENCE.traceName));//电子围栏
        arr.push(new Data($.common.cbtt.TRAIN.traceName,$.common.cbtt.TRAIN.traceName));//进京铁路
        arr.push(new Data($.common.dict.DATA_CA.traceName,$.common.dict.DATA_CA.traceName));//长安数据
        arr.push(new Data($.common.dict.DATA_CA_NO_IDCORD.traceName,$.common.dict.DATA_CA_NO_IDCORD.traceName));//长安数据
        // arr.push(new Data($.common.dict.WIFI_FENCE.sign,$.common.dict.WIFI_FENCE.traceName));
        // arr.push(new Data($.common.dict.TAKE_OUT_FOOD.sign,$.common.dict.TAKE_OUT_FOOD.traceName));
        // arr.push(new Data($.common.dict.ONLINE_TAXI.sign,$.common.dict.ONLINE_TAXI.traceName));
        // arr.push(new Data($.common.dict.ONLINE_RENTING.sign,$.common.dict.ONLINE_RENTING.traceName));
        // arr.push(new Data($.common.dict.BKIE_SHARE.sign,$.common.dict.BKIE_SHARE.traceName));
        // arr.push(new Data($.common.dict.EXPRESS_DELIVERY.sign,$.common.dict.EXPRESS_DELIVERY.traceName));
        $.select2.addByList("#dataType", arr,"id", "name",false,true);
    }


    function findObj(){
        return obj.sourceFileId;
    }

    /**
     * 提交
     */
    function submitMethod(){
        if(obj.sourceFileId==null){
            if(dataType==$.common.dict.ELENCTRONIC_FENCE.traceName){
                $.plupload.start("container") ;
            }else if(dataType==$.common.cbtt.TRAIN.traceName){
                $.plupload.start("container2") ;
            }else if (dataType==$.common.dict.DATA_CA.traceName){
                $.plupload.start("container3") ;
            }else{
                $.plupload.start("container4") ;
            }
        }else{
            // openWindow(type,obj);//弹窗
        }
    }


    /**
     * 继承
     */
    jQuery.extend($.trackDataImportDialog,{
        submitMethod:submitMethod,
        findObj:findObj
    })


})(jQuery);