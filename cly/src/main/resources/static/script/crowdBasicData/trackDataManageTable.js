
(function($){
    "use strict";

    var table = null;
    $(document).ready(function (){
        initPageDatas();//初始化字典项
        initTable();
        events();
        var a= $.common.cbtt;
    });

    function events() {
        /**
         * 导入轨迹数据按钮
         */
        $(document).on("click","#importBtn",function(){
            importBtn();
        });
        /**
         * 查询按钮
         */
        $(document).on("click",".query",function(){
            initTable();
        });
        /**
         * ftp 自动抓起导入按钮
         */
        $(document).on("click","#ftpImportBtn",function(){
            ftpImport();
        });
        /**
         * 导入列车时刻表数据按钮
         */
        $(document).on("click","#importTrainTimeBtn",function(){
            batchImportTrainTime();
        });
         //下载文件
        $(document).on("click",".downloadClass",function(){
            var id=$(this).attr("id");
            window.open(context+"/crowd/downloadAttachment?metaId="+id) ;
        })
        //重置
        $(document).on("click",".reset",function(){
            $.laydate.reset("#startTime");
            $.select2.val("#dataType","全部");
            table.draw();
        })
    }

    /**
     * 导入列车时刻表
     */
    function batchImportTrainTime() {
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/crowdBasicData/batchImportLayerForTrainTime',
            pageLoading : true,
            title : '列车时刻表批量导入',
            width : "508px",
            height : "400px",
            btn:["导入","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.batchImportLayerForTrainTime;  //获取弹窗界面的操作对象
                    cm.submitMethod();//弹窗界面的方法

                },
                btn2:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.batchImportLayerForTrainTime;  //获取弹窗界面的操作对象
                    var id= cm.findObj();//获取值
                    if(id){
                        removeAttachment(id);//如果有上传id的话
                    }
                    $.util.topWindow().$.layerAlert.closeWithLoading(index);
                }

            },
            success:function(layero, index){

            },
            initData:{
                downloadURL : "/petitionRegistrationExportExcel/downloadPetitionModel?fileName=trainTimeImportModel.xlsx",
                updateURL : "/trainTimeImportController/batchImportTrainTime"
            },
            end:function(){

            }
        });
    }
    

    /**
     * 通过ftp自动抓取
     */
    function ftpImport(){
        $.util.topWindow().$.layerAlert.confirm({
            msg:"点击确定后会自动从ftp 上抓取并导入,导入前请确认路径下的数据,确定导入吗？",
            title:"ftp自动导入",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            shift:1,  //弹出时的动画效果  有0-6种
            yes:function(index, layero){
                $.util.topWindow().$.common.showOrHideLoading(true);
                //点击确定按钮后执行
                $.ajax({
                    url:context + '/elecronicFenceImportController/chickeAndImportTrainByBtn',
                    // data:obj,
                    type:"post",
                    dataType:"json",
                    customizedOpt:{
                        ajaxLoading:false,//设置是否loading
                    },
                    success:function(successData) {
                        $.util.topWindow().$.common.showOrHideLoading(false);
                        if (successData.res) {
                            $.util.topWindow().$.layerAlert.alert({
                                icon: 6, msg: successData.msg, yes: function () {
                                }
                            });
                        } else {
                            $.util.topWindow().$.layerAlert.alert({icon: 5, msg: "导入失败。"});
                            // }
                        }
                        table.draw();
                    },
                    error:function (errData) {
                        $.util.topWindow().$.common.showOrHideLoading(false);
                        $.util.topWindow().$.layerAlert.alert({icon: 5, msg: "导入失败。"});
                    }
               });
            }
        });

    }

    /**
     * 导入数据
     */
    function importBtn() {
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/crowdBasicData/trackDataImportDialog1',
            pageLoading : true,
            title : '轨迹数据导入',
            width : "508px",
            height : "400px",
            btn:["导入","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.trackDataImportDialog;  //获取弹窗界面的操作对象
                    cm.submitMethod();//弹窗界面的方法
                },
                btn2:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.trackDataImportDialog;  //获取弹窗界面的操作对象
                    var id= cm.findObj();//获取值
                    if(id){
                        removeAttachment(id);//如果有上传id的话
                    }
                    $.util.topWindow().$.layerAlert.closeWithLoading(index);
                    //关闭弹窗
                },

            },
            success:function(layero, index){

            },
            initData:{
                eleurl:"/petitionRegistrationExportExcel/downloadPetitionModel?fileName=elenctronicFenceModel.xlsx",
                trainurl:"/petitionRegistrationExportExcel/downloadPetitionModel?fileName=trainModel.xlsx",
                caurl:"/petitionRegistrationExportExcel/downloadPetitionModel?fileName=changAnDataModel.xlsx",
                caNoIdCordurl:"/petitionRegistrationExportExcel/downloadPetitionModel?fileName=changAnDataNoIdCordModel.xlsx"
            },
            end:function(){

            }
        });

    }

    /**
     * 删除已经上传的附件
     */
    function removeAttachment(id){
        $.ajax({//處理數據
            url:context + '/crowd/deleteAttachment',
            data:{"uploadfileId":id},
            type:"post",
            dataType:"json",
            success:function(){

            }
        })
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
        arr.push(new Data("全部","全部"));
        arr.push(new Data($.common.dict.ELENCTRONIC_FENCE.traceName,$.common.dict.ELENCTRONIC_FENCE.traceName));//电子围栏
        arr.push(new Data($.common.cbtt.TRAIN.traceName,$.common.cbtt.TRAIN.traceName));//进京铁路
        arr.push(new Data($.common.dict.DATA_CA.traceName,$.common.dict.DATA_CA.traceName));//长安数据含身份证
        arr.push(new Data($.common.dict.DATA_CA_NO_IDCORD.traceName,$.common.dict.DATA_CA_NO_IDCORD.traceName));//长安数据不含身份证
        // arr.push(new Data($.common.dict.TAKE_OUT_FOOD.sign,$.common.dict.TAKE_OUT_FOOD.traceName));
        // arr.push(new Data($.common.dict.ONLINE_TAXI.sign,$.common.dict.ONLINE_TAXI.traceName));
        // arr.push(new Data($.common.dict.ONLINE_RENTING.sign,$.common.dict.ONLINE_RENTING.traceName));
        // arr.push(new Data($.common.dict.BKIE_SHARE.sign,$.common.dict.BKIE_SHARE.traceName));
        // arr.push(new Data($.common.dict.EXPRESS_DELIVERY.sign,$.common.dict.EXPRESS_DELIVERY.traceName));
        $.select2.addByList("#dataType", arr,"id", "name",false,true);
    }

    function initTable(){
        if(table != null){
            table.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/trackDataImportController/findTrackDataPageByCondition";
        tb.columnDefs = [
            // {
            //     "targets": 0,
            //     "width": "50px",
            //     "title": "选择",
            //     "className":"table-checkbox",
            //     "data": "id" ,
            //     "render": function ( data, type, full, meta ) {
            //         var a = '<input type="checkbox" name="signTr" class="icheckbox"  />' ;
            //         return a;
            //     }
            // },
            {
                "targets" : 0,
                "width" : "",
                "title" : "编号",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return meta.row + 1;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "导入时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {
                   return $.date.timeToStr(data, "yyyy年MM月dd日 HH:mm:ss");
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "导入数据类型",
                "data" : "dataType",
                "render" : function(data, type, full, meta) {

                    return data;

                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "导入源文件",
                "data" : "sourceFileName",
                "render" : function(data, type, full, meta) {

                    return  '<a id="'+full.sourceFileId+'" class="downloadClass">' + data + '</a>';
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "日志文件",
                "data" : "errFileName",
                "render" : function(data, type, full, meta) {
                    return  '<a id="'+full.errFileId+'" class="downloadClass">' + data + '</a>';
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
        //是否分页
        tb.paging = true;
        //每页条数
        tb.lengthMenu = [ 10 ];
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
         var obj={};
         obj.startTimeFromLong = $.laydate.getTime("#startTime", "start");
         obj.startTimeToLong = $.date.endRangeByTime($.laydate.getTime("#startTime", "end"),"yyyy-MM-dd HH:mm");
         obj.start = d.start;
         obj.length = d.length;
         obj.dicTypeId="rygj";//人员轨迹
         if($.select2.val("#dataType")=="全部"){
             obj.dataType="";
         }else{
             obj.dataType=$.select2.val("#dataType");
         }
         $.util.objToStrutsFormData(obj, "importExcelLogListPojo", d);

        };
        tb.paramsResp = function(json) {
            json.data = json.excelLogListPojo;
            json.recordsFiltered = json.totalNumber;
            json.recordsTotal = json.totalNumber;
        };
        table = $("#example1").DataTable(tb);
    }

})(jQuery);