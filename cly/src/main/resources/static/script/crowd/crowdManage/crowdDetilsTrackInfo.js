$.bjqb = $.bjqb || {} ;
$.bjqb.crowdDetilsTrackInfo = $.bjqb.crowdDetilsTrackInfo || {} ;
(function($){
    "use strict";
    var crowdNameCode;

    var startTime;
    var endTime;

    var trainTrackIds;//火车轨迹id集合字符串 以,号分割
    var airlineTrackIds;//飞机进京轨迹id集合字符串  以,分割
    var busTrackIds;//长途汽车
    var bjPassIds;//进京证
    var hotelTrackIds;//旅馆
    var netbarIds;//网吧
    var checkIds;//核录
    var foodIds;//外卖
    var bookcarIds;//约车
    var houseIds;//短租
    var bikeIds;//共享单车
    var shoppingIds;//购物

    var flag = false;

    //在京核录信息
    $(document).ready(function(){
        // $(document).on("click" , "#queryBtn", function(e){
        //
        //     queryCrowdTrackInfo();
        // });
        // $(document).on("click" , "#resetBtn", function(e){
        //     $.laydate.reset("#crowdTrackDateRangeId")
        // });

        //点击火车
        $(document).on("click" , "#trainTrack", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/railwayInfoQuery", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        });

        //点击飞机
        $(document).on("click" , "#airlineTrack", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/aviationInfoQuery", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        });

        //点击长途汽车
        $(document).on("click" , "#busTrack", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/coachInfoQuery", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        });

        //点击进京证
        $(document).on("click" , "#bjPass", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/beijingPassTransactTime", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        });

        //点击宾馆
        $(document).on("click" , "#hotelTrack", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/hotelInfoQuery", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        })

        //点击网吧
        $(document).on("click" , "#netbar", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/surfOnlineInfoQuery", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        })

        //点击核录
        $(document).on("click" , "#check", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/inBeijingInfoQuery", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        })

        //点击外卖
        $(document).on("click" , "#food", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/takeoutInfoQuery", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        })

        //点击约车
        $(document).on("click" , "#bookcar", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/bookCarInfoQuery", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        })

        //点击短租
        $(document).on("click" , "#house", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/shortRendQuery", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        })

        //点击共享单车
        $(document).on("click" , "#bike", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/shareBikeQuery", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        })

        //点击物流寄递
        $(document).on("click" , "#shopping", function(e){
            var form = $.util.getHiddenForm(context + "/show/page/web/crowd/shoppingQuery", {"crowdNameCode":crowdNameCode,"startTime":startTime,"endTime": endTime});
            form.submit();
        })
        //init();
    });

    function queryCrowdTrackInfo(crowdName){
        crowdNameCode = crowdName;
        gitTime();
        if(crowdName == "qtlx00010001"){
            commingToBeijingInfo(crowdName);
            stayInBeijingInfo(crowdName);
            trainInfo(crowdName);
            airlineTrackInfo(crowdName);
            busTrackInfo(crowdName);
            bjPassInfo(crowdName);
            hotelTrackInfo(crowdName);
            netbarInfo(crowdName);
            checkInfo(crowdName);
            foodInfo(crowdName);
            bookcarInfo(crowdName);
            houseInfo(crowdName);
            bikeInfo(crowdName);
            shoppingInfo(crowdName);
            wifiInfo(crowdName);
        }else{
            commingToBeijingInfo(crowdName);
            stayInBeijingInfo(crowdName);
            trainInfo(crowdName);
            airlineTrackInfo(crowdName);
            busTrackInfo(crowdName);
            bjPassInfo(crowdName);
            hotelTrackInfo(crowdName);
            netbarInfo(crowdName);
            checkInfo(crowdName);
        }

    }

    //进京人数
    function commingToBeijingInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findCommingToBeijingCount',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#commingToBeijingCount").text(successData + "人");
            }
        })
    }

    //在京人数
    function stayInBeijingInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findStayInBeijingCount',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#stayInBeijingCount").text(successData + "人");
            }
        })
    }

    //火车
    function trainInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findTrainTrack',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#trainTrack").text(successData + "人");
            }
        })
    }
    //飞机
    function airlineTrackInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findAirlineTrack',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#airlineTrack").text(successData + "人");
            }
        })
    }
    //长途汽车
    function busTrackInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findBusTrack',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#busTrack").text(successData + "人");
            }
        })
    }

    //进京证
    function bjPassInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findBjPass',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#bjPass").text(successData + "人");
            }
        })
    }

    //旅馆
    function hotelTrackInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findHotelTrack',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#hotelTrack").text(successData + "人");
            }
        })
    }

    //网吧
    function netbarInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findNetbar',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#netbar").text(successData + "人");
            }
        })
    }

    //核录
    function checkInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findCheck',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#check").text(successData + "人");
            }
        })
    }

    //外卖
    function foodInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findFood',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#food").text(successData + "人");
            }
        })
    }

    //约车
    function bookcarInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findBookcar',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#bookcar").text(successData + "人");
            }
        })
    }

    //短租
    function houseInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findHouse',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#house").text(successData + "人");
            }
        })
    }

    //共享单车
    function bikeInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findBike',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#bike").text(successData + "人");
            }
        })
    }

    //物流寄递
    function shoppingInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findShopping',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#shopping").text(successData + "人");
            }
        })
    }

    //物流寄递
    function wifiInfo(crowdName){
        var data = {
            "crowdName" : crowdName,
            "endTime" : endTime,
            "startTime" : startTime
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "crowdTrackPojo", obj);
        $.ajax({
            url:context +'/CrowdDetilsManage/findWifi',
            data:obj,
            type:'post',
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success:function(successData){
                $("#wifi").text(successData + "人");
            }
        })
    }



    function getHalfYearTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*30*6;
    }

    function getThreeMonthTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*30*3;
    }

    function getWeekTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*7;
    }

    function getMonthTime(){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*30;
    }

    function getThreeDayTime (){
        endTime = new Date().getTime();
        startTime = endTime-1000*60*60*24*3;
    }

    function getOneDayTime (){
        var date = new Date();
        endTime = new Date().getTime();
        date.setHours(0,0,0,0);
        startTime = date.getTime();
    }
    function getZdyTime(){
        var startDate = $.laydate.getDate("#crowdTrackDateRangeId","start") == null ? null : $.laydate.getDate("#crowdTrackDateRangeId","start");
        if(startDate){
            startTime =  new Date(startDate).getTime();
        }else{
            startTime =  0;
        }

        var endDate = $.laydate.getDate("#crowdTrackDateRangeId","end") == null ? null : $.laydate.getDate("#crowdTrackDateRangeId","end");
        if(endDate){
            endDate = $.date.endRange(endDate,"yyyy-MM-dd");
            endTime =  new Date(endDate).getTime();
        }else{
            endTime =  new Date().getTime();
        }
    }
    function gitTime(){
        var id = $("#crowdTrackTime .checked .icheckradio").attr("id");
        if(id == "crowdTrackToday"){
            getOneDayTime();
        }else if(id == "crowdTrackThreeDay"){
            getThreeDayTime();
        }else if(id == "crowdTrackOneWeek"){
            getWeekTime();
        }else if(id == "crowdTrackOneMonth"){
            getMonthTime();
        }else if(id == "crowdTrackThreeMonth"){
            getThreeMonthTime();
        }else if(id == "crowdTrackHarfYear"){
            getHalfYearTime();
        }else if(id == "czJRecentZdy"){
            getZdyTime();
        }
    }

    $("input").on("ifChecked",function(){
        var id = $(this).attr("id");
        if(id == "czJRecentZdy"){
            $("#crowdTrackZdyTime").show();
        }else{
            $("#crowdTrackZdyTime").hide();
            $.laydate.reset("#crowdTrackDateRangeId");
        }
    })

    /*  //进一天
      $(document).on("click" , "#crowdTrackToday", function(e){
          getOneDayTime();
          $("#crowdTrackZdyTime").hide();
          $.laydate.reset("#crowdTrackDateRangeId");
          flag = false;
      });
      //近三天
      $(document).on("click" , "#crowdTrackThreeDay", function(e){
          getThreeMonthTime();
          $("#crowdTrackZdyTime").hide();
          $.laydate.reset("#crowdTrackDateRangeId");
          flag = false;
      });
      //近一周
      $(document).on("click" , "#crowdTrackOneWeek", function(e){
          getWeekTime();
          $("#crowdTrackZdyTime").hide();
          $.laydate.reset("#crowdTrackDateRangeId");
          flag = false;
      });
      //近一月
      $(document).on("click" , "#crowdTrackOneMonth", function(e){
          getMonthTime();
          $("#crowdTrackZdyTime").hide();
          $.laydate.reset("#crowdTrackDateRangeId");
          flag = false;
      });
      //近三月
      $(document).on("click" , "#crowdTrackThreeMonth", function(e){
          getThreeMonthTime();
          $("#crowdTrackZdyTime").hide();
          $.laydate.reset("#crowdTrackDateRangeId");
          flag = false;
      });
      //近半年
      $(document).on("click" , "#crowdTrackHarfYear", function(e){
          getHalfYearTime();
          $("#crowdTrackZdyTime").hide();
          $.laydate.reset("#crowdTrackDateRangeId");
          flag = false;
      });

      //自定义
      $(document).on("click" , "#crowdTrackZdy", function(e){
          getHalfYearTime();
          $("#crowdTrackZdyTime").show();
          flag = true;
      });*/
    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.bjqb.crowdDetilsTrackInfo, {
        queryCrowdTrackInfo : queryCrowdTrackInfo,
    });

})(jQuery);