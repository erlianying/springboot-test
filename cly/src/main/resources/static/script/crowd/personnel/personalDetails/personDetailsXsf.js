(function($){
    "use strict";
    var xsfTable = null;
    var startTime;
    var endTime;
    var phoneList = $.bjqb.personnelDetail.getPhoneNumbers;
    $(document).ready(function(){
        getRecentThreeDayTime()
        init();

        $(document).on("click" , "#xsfSearchBtn", function(e){
            searchClick();
        });

        $(document).on("click" , "#xsfResetBtn", function(e){
            getRecentThreeDayTime();
            $.ajax({
                url:context + '/personManage/findSfbwDictionary',
                type:"post",
                dataType:"json",
                success:function(sfbw){
                    $.select2.empty("#position");
                    $.select2.addByList("#position",sfbw.sfbwType,"id","name",true,true);
                    searchClick();
                }
            })
        });

        $(document).on("click" , "#xsfA", function(e){
            searchClick();
        });

        $(document).on("ifChecked","#xsfZdy",function(){
            getZdyTime();
            $("#dateXsfRangeId").show();
        })

        // $(document).on("ifChecked","#xsfZdy",function(){
        //     $("#dateXsfRangeId").show();
        // })

        $(document).on("ifUnchecked","#xsfZdy",function(){
            $("#dateXsfRangeId").hide();
        })

        $(document).on("ifChecked","#xsfRecentThreeDay",function(){
            getRecentThreeDayTime();
        })

        $(document).on("ifChecked","#xsfRecentWeek",function(){
            geRecentWeekTime();
        })

        $(document).on("ifChecked","#xsfRecentMonth",function(){
            getRecentMonthTime();
        })

        $(document).on("ifChecked","#xsfRecentThreeMonth",function(){
            getRecentThreeMonthTime();
        })

        $(document).on("ifChecked","#xsfRecentHalfYear",function(){
            getRecentHalfYearTime();
        })

    });

    function init(){
        $.ajax({
            url:context + '/personManage/findSfbwDictionary',
            type:"post",
            dataType:"json",
            success:function(sfbw){
                $.select2.addByList("#position",sfbw.sfbwType,"id","name",true,true);
            }
        })
    }

    function getOnJingRecentThreeDayTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*30*3;
    }

    function searchClick(){
        var data = {
            "position" :$.select2.val("#position"),
            "idNumber":idnumber,
            "startTime":startTime,
            "endTime":endTime,
        }
        var obj = new Object();
        $.util.objToStrutsFormData(data, "petitionRegisteParameter", obj);
        $.ajax({
            url: context + '/personMessageManage/findpetitionRegister',
            data:obj,
            type: "post",
            dataType: "json",
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (map) {
                initTable(map.petitionRegister);
            }
        })
    }

    /**
     * 初始化上访table
     */
    function initTable(tableInfoLst){
        if(xsfTable != null) {
            xsfTable.destroy();
        }
        var tb = $.uiSettings.getLocalOTableSettings();
        $.util.log(tb);
        tb.data = tableInfoLst;
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "50px",
                "title": "序号",
                "data": "" ,
                "render": function ( data, type, full, meta ) {
                    return meta.row+1;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "上访时间",
                "data" : "petitionDateStr",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "上访地点",
                "data" : "position",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "上访性质",
                "data" : "nature",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }

        ];
        tb.ordering = false;
        tb.hideHead = false;
        tb.dom = null;
        tb.searching = false;
        tb.lengthChange = false;
        tb.paging = true;
        tb.info = true;
        tb.lengthMenu = [ 5 ];
        xsfTable = $("#xsfTrack").DataTable(tb);
    }

    function getRecentHalfYearTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*30*6;
    }

    function getRecentThreeMonthTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*30*3;
    }
    function getRecentMonthTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*30;
    }

    function geRecentWeekTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*7;
    }
    function getRecentThreeDayTime (){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*3;
    }

    function getZdyTime (){
        var startDate = $.laydate.getDate("#dateXsfRangeId","xsfFixed_start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        var endDate = $.laydate.getDate("#dateXsfRangeId","xsfFixed_end") == null ? null : $.laydate.getDate("#dateRangeId","end");
        if(startDate){
            startTime = new Date(startDate).getTime();
        }else{
            startTime = 0;
        }
        if(endDate){
            endTime = new Date(endDate).getTime();
        }else{
            endTime = new Date().getTime();
        }
    }

})(jQuery);