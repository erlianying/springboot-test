
(function($){
    "use strict";

    var table = null;
    var  obj={};
    var downLoadFileId='';
    $(document).ready(function (){
        initPlupload();
        initTable();
        events();
        resetStatue();
        setDate();
        initPageDict();
        initTrackTypeValue();
    });

    function events() {
        /**
         * 开始回溯
         */
        $(document).on("click","#importBtn",function(){
            stateTraceBegin();
            // startSTateTrace("b1c68166-c76d-4a73-a1cd-3200e1e3c076");

        });
        /**
         * 查询按钮
         */
        $(document).on("click",".query",function(){
            initTable();
        });
        //下载源文件及附件
        $(document).on("click",".downloadClass",function(){
            var id=$(this).attr("id");
            window.open(context+"/crowd/downloadAttachment?metaId="+id) ;
        })
        //下载情况回溯的导入模板
        $(document).on("click","#downloadModelBtn",function(){
            window.open(context+"/petitionRegistrationExportExcel/downloadPetitionModel?fileName=stateTraceModel.xlsx") ;
        })
        //重置
        $(document).on("click",".reset",function(){
            $.laydate.reset("#startTime");
            table.draw();
        })
        //下载
        $(document).on("click","#downLoadBtn",function(){
           if(downLoadFileId!=''){
               window.open(context+"/crowd/downloadAttachment?metaId="+downLoadFileId) ;
           }else{
               $.layerAlert.alert({title:"提示",msg:'无可下载的内容！！',icon : 5});
           }
        })
        /**
         * 群体类型选择事件
         */
        $(document).on("select2:select","#type",function () {
            var typeId = $.select2.val("#type");
            $.select2.empty("#name");
            findCrowdNameByTypeId(typeId);
        });
    }

    /**
     * 初始化轨迹类型多选框值
     */
    function initTrackTypeValue() {
        $("#traceType_train").attr("value", $.common.cbtt.TRAIN.traceName);
        $("#traceType_airline").attr("value", $.common.cbtt.PLANE.traceName);
        $("#traceType_bus").attr("value", $.common.cbtt.COACH.traceName);
        $("#traceType_bjPass").attr("value", $.common.cbtt.ENTER_BEIJING_PERMISSION.traceName);

        $("#traceType_hotel").attr("value", $.common.sbtt.HOTEL.traceName);
        $("#traceType_check").attr("value", $.common.sbtt.INSPECTION.traceName);
        $("#traceType_netbar").attr("value", $.common.sbtt.NET_BAR.traceName);

        $("#traceType_noPetition").attr("value",'非访情况');
        $("#traceType_normalPetition").attr("value", '正常访情况');
    }

    function stateTraceBegin() {
        var startTime=$.laydate.getTime("#findTraceTime", "start");
        var endTime=$.laydate.getTime("#findTraceTime", "end");
        if($.util.isBlank(startTime)){
            $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择开始时间。",time:3000}) ;
            return ;
        }
        if($.util.isBlank(endTime)){
            $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择结束时间。",time:3000}) ;
            return ;
        }
        $.plupload.start("container") ;
    }

    /**
     * 初始化页面默认字典项
     *
     * @returns
     */
    function initPageDict(){
        $.ajax({
            url:context +'/crowdBasicDataManage/initCrowdType',
            data:{},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                //设置群体类型
                var types = successData.types;
                $.select2.addByList("#type", types,"id","name",true,true);
            }
        });
    }



    /**
     * 根据群体类型查询群体名称
     *
     * @param typeId 类型id
     * @returns
     */
    function findCrowdNameByTypeId(typeId){
        $.ajax({
            url:context +'/crowdManage/findCrowdNameByTypeId',
            data:{typeId : typeId},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                var names = successData.names;
                $.select2.addByList("#name", names,"id","name",true,false);
            }
        });
    }

    /**
     * 设置默认开始结束时间
     */
    function setDate() {
        var startDateLong = new Date().getTime() - 1000*60*60*24*30;
        var startDateStr = $.date.timeToStr(startDateLong, "yyyy-MM-dd HH:mm");
        var endDateStr = $.date.dateToStr(new Date(), "yyyy-MM-dd HH:mm");
        $.laydate.setRange(startDateStr, endDateStr, "#findTraceTime");
    }

    /**
     * 初始化上传控件
     */
    function initPlupload(){
        var setting = $.plupload.getBasicSettings() ;//文件上传
        setting.container =  "container"; //容器id
        setting.url = context + "/crowd/stateTraceIDcodeImport";
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
        setting.chunk_size = '50mb' ;
        setting.filters.max_file_size = '50mb';
        setting.filters.mime_types = [{title: "excel类型", extensions: "xls,xlsx"}];
        setting.filters.prevent_duplicates = true ;
        setting.multi_selection = false;
        setting.multi_file_num = 1;//设置上传的文件数
        setting.bind
        setting.multi_file_num_callback = function(max_file_size, totalSize){
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
                        $('#findIDCount').text(obj.sourceCount);
                        $('#firstBtn').addClass("active");
                        $('#firstDiv').show();

                        startSTateTrace(obj.sourceFileId);//弹窗---导入成功后
                    }

                }
            },
            multi_file_num_callback:function(max_file_size, totalSize){
                $.layerAlert.alert({title:"提示",msg:"每次只能上传一个附件",icon : 5});
            },
            filesAdded:function (up, files){
                resetStatue();
            }
        }
        $.plupload.init(setting) ;
    }
   function resetStatue(){
       downLoadFileId="";
       $('.active').removeClass("active");
       $('#firstDiv').hide();
       $('#secondDiv').hide();
       $('#findPersonCountDiv').hide();

   }

    /**
     * 开始回溯事件
     * @param data
     */
    function startSTateTrace(data) {
        setTimeout(function () {
            $('#secondDiv').show();
            $('#secondBtn').addClass("active");
        }, 2000);
        var crowdType = $.select2.val("#type");
        var crowdName = $.select2.val("#name");
        var startTime=$.laydate.getTime("#findTraceTime", "start");
        var endTime=$.laydate.getTime("#findTraceTime", "end");
        var arr = $.icheck.getChecked("traceType");
        var traceArr='';
        for(var i=0;i<arr.length;i++){
            traceArr+=$(arr[i]).val()+",";
        }
        if(traceArr!=""){
            traceArr=traceArr.substring(0,traceArr.length-1);
        }
        $.ajax({//开始回溯
            url:context + '/crowd/stateTraceBegin',
            data:{startTime : startTime, endTime : endTime,rightFileId:data,crowdType:crowdType,crowdName:crowdName,traceArr:traceArr},
            type:"post",
            dataType:"json",
            success:function(res){
                var result=res.result;
                if(result=='false'){
                    $.layerAlert.alert({title:"提示",msg:res.msg,icon : 5});
                }else{
                    //回溯成功后返回溯后的附件id；
                    downLoadFileId=res.errFilId;
                    $('#findPersonCount').text(res.rightFileCount);
                    $('#findPersonCountDiv').show();
                    table.draw();
                }
            }
        })

    }


    function initTable(){
        if(table != null){
            table.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/trackDataImportController/findTrackDataPageByCondition";
        tb.columnDefs = [

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
                "title" : "操作开始时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {
                    return data==null?"":$.date.timeToStr(data, "yyyy年MM月dd日 HH:mm:ss");
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "操作结束时间",
                "data" : "endTimeLong",
                "render" : function(data, type, full, meta) {
                    return data==null?"":$.date.timeToStr(data, "yyyy年MM月dd日 HH:mm:ss");
                }
            },

            {
                "targets" : 3,
                "width" : "",
                "title" : "回溯线索文件",
                "data" : "sourceFileName",
                "render" : function(data, type, full, meta) {
                    return  '<a id="'+full.sourceFileId+'" class="downloadClass">' + data + '</a>';
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "回溯结果文件",
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
            obj.dicTypeId="qkhs";//情况回溯
            $.util.objToStrutsFormData(obj, "importExcelLogListPojo", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.excelLogListPojo;
            json.recordsFiltered = json.totalNumber;
            json.recordsTotal = json.totalNumber;
        };
        table = $("#stateTraceTable").DataTable(tb);
    }

})(jQuery);