(function($) {
    "use strict";
    var inBeijingtable = null;
    var onBeijingTable = null;
    var selRatio=70.0;
    $(document).ready(function () {
        $.when(
            setDate(),
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
                    $.select2.addByList("#type", types,"id","name",false,true);
                    findNameByType();
                }
            })

        ).done(function(){
            initTable();
        })
        // initPageDict();
        // setDate();
        // initTable();
        $(document).on("click" , "#search", function(e){
            $.select2.val("#type");
            if( $.select2.val("#type")==null){
                $.layerAlert.alert({title:"提示",msg:"请选择群体",icon : 5});
                return;
            }
            inBeijingtable.draw();
            onBeijingTable.draw();
        })
        /**
         * 群体类型选择事件
         */
        $(document).on("select2:select","#type",function () {
            findNameByType();
        });



    })

    /**
     * 设置默认开始结束时间
     */
    function setDate() {
        var startDateLong = new Date().getTime() - 1000*60*60*24*29;
        var startDateStr = $.date.timeToStr(startDateLong, "yyyy-MM-dd");
        var endDateStr = $.date.dateToStr(new Date(), "yyyy-MM-dd");
        $.laydate.setRange(startDateStr, endDateStr, "#statisticsTime");
    }

    // /**
    //  * 初始化页面默认字典项
    //  *
    //  * @returns
    //  */
    // function initPageDict(){
    //     $.ajax({
    //         url:context +'/crowdBasicDataManage/initCrowdType',
    //         data:{},
    //         type:"post",
    //         dataType:"json",
    //         customizedOpt:{
    //             ajaxLoading:true,//设置是否loading
    //         },
    //         success:function(successData){
    //             //设置群体类型
    //             var types = successData.types;
    //             $.select2.addByList("#type", types,"id","name",false,true);
    //             findNameByType();
    //         }
    //     });
    // }

     function findNameByType(){
         var typeId = $.select2.val("#type");
         $.select2.empty("#name");
         findCrowdNameByTypeId(typeId);
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


    function  initTable() {
        initInBerjingTable();
        initOnBeijingTable();

    }

    function initInBerjingTable(){
        if(inBeijingtable != null){
            inBeijingtable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personnelStatisticeController/findInBeijingByCondition";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "姓名",
                "data" : "personName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "身份证号",
                "data" : "identity",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },

            {
                "targets" : 2,
                "width" : "",
                "title" : "省份",
                "data" : "provinces",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "所属群体",
                "data" : "crowdType",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "群体细类",
                "data" : "crowdName",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "轨迹",
                "data" : "trace",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "进京天数",
                "data" : "dayCount",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "进京比率",
                "data" : "ratio",
                "render" : function(data, type, full, meta) {
                    return  data;
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
            obj.startTimeLong = $.laydate.getTime("#statisticsTime", "start");
            obj.endTimeLong =$.laydate.getTime("#statisticsTime", "end")+3600*1000*24;
            obj.start = d.start;
            obj.length = d.length;
            obj.crowdType=$.select2.val("#type");
            obj.crowdName=$.select2.val("#name");
            obj.selDayCount= ($.laydate.getTime("#statisticsTime", "end")-$.laydate.getTime("#statisticsTime", "start"))/(3600*1000*24)+1;
            obj.selRatio=selRatio;
            $.util.objToStrutsFormData(obj, "personnelStatisticsPojo", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.statisticsInLst;
            json.recordsFiltered = json.totalNumber;
            json.recordsTotal = json.totalNumber;
        };
        inBeijingtable = $("#inBeijingtable").DataTable(tb);
    }

    //在京数据
    function initOnBeijingTable(){
        if(onBeijingTable != null){
            onBeijingTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personnelStatisticeController/findOnBeijingByCondition";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "姓名",
                "data" : "personName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "身份证号",
                "data" : "identity",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },

            {
                "targets" : 2,
                "width" : "",
                "title" : "省份",
                "data" : "provinces",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "所属群体",
                "data" : "crowdType",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "群体细类",
                "data" : "crowdName",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "轨迹",
                "data" : "trace",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "在京天数",
                "data" : "dayCount",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "在京比率",
                "data" : "ratio",
                "render" : function(data, type, full, meta) {
                    return  data;
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
            obj.startTimeLong = $.laydate.getTime("#statisticsTime", "start");
            obj.endTimeLong =$.laydate.getTime("#statisticsTime", "end")+3600*1000*24;
            obj.start = d.start;
            obj.length = d.length;
            obj.crowdType=$.select2.val("#type");
            obj.crowdName=$.select2.val("#name");
            obj.selDayCount=  ($.laydate.getTime("#statisticsTime", "end")-$.laydate.getTime("#statisticsTime", "start"))/(3600*1000*24)+1;
            obj.selRatio=selRatio;
            $.util.objToStrutsFormData(obj, "personnelStatisticsPojo", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.statisticsOnLst;
            json.recordsFiltered = json.totalNumber;
            json.recordsTotal = json.totalNumber;
        };
        onBeijingTable = $("#onBeijingTable").DataTable(tb);
    }



    function  getstartTime(){
        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        if(startDate){
            return new Date(startDate).getTime();
        }else{
            return null;
        }
    }
    function  getEndTime(){
        var endDate = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end");
        if(endDate){
            endDate = $.date.endRange(endDate,"yyyy-MM-dd");
            return new Date(endDate).getTime();
        }else{
            return  null;
        }
    }
})(jQuery);