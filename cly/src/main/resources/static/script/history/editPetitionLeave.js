$.editPetitionLeaveLayer = $.editPetitionLeaveLayer || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var editTime = initData.editTime ;
    var dataMap = null;
    $(document).ready(function(){
        if(editTime != null){
            $.laydate.setTime(Number(editTime), "#dataTime");
            setWeek(new Date(Number(editTime)));
            init(editTime);
        }
        $(document).on("change" , "#fixed_date", function(e){
            var startDate = $.laydate.getDate("#dataTime", "date");
            if(startDate == null){
                $("input").val("");
                dataMap = null;
                return;
            }
            setWeek(new Date(startDate));
            init($.laydate.getTime("#dataTime", "date"));
        });

    });

    function setWeek(date){
        var xingqi = date.getDay();
        switch(xingqi){
            case(1):$("#week").val("xx0001");
                $("#showWeek").text("星期一");
                break;
            case(2):$("#week").val("xx0002");
                $("#showWeek").text("星期二");
                break;
            case(3):$("#week").val("xx0003");
                $("#showWeek").text("星期三");
                break;
            case(4):$("#week").val("xx0004");
                $("#showWeek").text("星期四");
                break;
            case(5):$("#week").val("xx0005");
                $("#showWeek").text("星期五");
                break;
            case(6):$("#week").val("xx0006");
                $("#showWeek").text("星期六");
                break;
            case(0):$("#week").val("xx0007");
                $("#showWeek").text("星期日");
                break;
        }
    }

    function edit(){

        var demo = $.validform.getValidFormObjById("validformPersonType") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }
        if($.util.isBlank($("#fixed_date").val())) {
            return false;
        }
        for(var key in dataMap){
            dataMap[key].petitionDateLong  = $.laydate.getTime("#dataTime", "date");
            dataMap[key].petitionDate  = null;
            if(key == "qt"){
                dataMap[key].quarrelPeopleBatch = $("#quarrelPeopleBatch").val();
                dataMap[key].quarrelPeopleNumber = $("#quarrelPeopleNumber").val();
                dataMap[key].receptionPeopleNumber = $("#receptionPeopleNumber").val();
                dataMap[key].jjzPeopleNumber = $("#jjzPeopleNumber").val();
            }else{
                dataMap[key].week = $("#week").val();
                if(key != $.common.dict.TYPE_ZDQY_SGZDQU) {
                    dataMap[key] = getDepartureRegister(key, dataMap[key]);
                }
            }
        }
        var obj = new Object();
        $.util.objToStrutsFormData(dataMap, "departureRegisterDataMap", obj);
        window.top.$.common.showOrHideLoading(true);
        $.ajax({
            url:context + '/departureRegisterManage/editDepartureRegister',
            type:"post",
            data:obj,
            success:function(successData){
                window.top.$.common.showOrHideLoading(false);
                if(successData){
                    $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示",end : function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                }
            },
            error:function(){
                window.top.$.common.showOrHideLoading(false);
            }
        })

    }

    function getDepartureRegister(className, departureRegister){
        departureRegister.allPeopleBatch = $("." + className + " .allPeopleBatch").val();
        departureRegister.allPeopleGroupNumber = $("." + className + " .allPeopleGroupNumber").val();
        departureRegister.allPeopleNumber = $("." + className + " .allPeopleNumber").val();
        departureRegister.thisCityPeopleBatch = $("." + className + " .thisCityPeopleBatch").val();
        departureRegister.thisCityPeopleGroupNumber = $("." + className + " .thisCityPeopleGroupNumber").val();
        departureRegister.thisCityPeopleNumber = $("." + className + " .thisCityPeopleNumber").val();
        departureRegister.extremeBatch = $("." + className + " .extremeBatch").val();
        departureRegister.extremePeopleNumber = $("." + className + " .extremePeopleNumber").val();
        return departureRegister;
    }

    function init(time){
        $.ajax({
            url:context + '/departureRegisterManage/findDepartureRegisterByDate',
            data:{time:time},
            type:"post",
            dataType:"json",
            success:function(map){
                dataMap = map;
                for(var key in map){
                    if(key == "qt"){
                        $("#quarrelPeopleBatch").val(map[key].quarrelPeopleBatch);
                        $("#quarrelPeopleNumber").val(map[key].quarrelPeopleNumber);
                        $("#receptionPeopleNumber").val(map[key].receptionPeopleNumber);
                        $("#jjzPeopleNumber").val(map[key].jjzPeopleNumber);
                    }else if(key != $.common.dict.TYPE_ZDQY_SGZDQU){
                        initDepartureRegisterData(key, map[key]);
                    }
                }
            }
        })
    }

    function initDepartureRegisterData(className, pojo){
        $("." + className + " .allPeopleBatch").val(pojo.allPeopleBatch);
        $("." + className + " .allPeopleGroupNumber").val(pojo.allPeopleGroupNumber);
        $("." + className + " .allPeopleNumber").val(pojo.allPeopleNumber);
        $("." + className + " .extremeBatch").val(pojo.extremeBatch);
        $("." + className + " .extremePeopleNumber").val(pojo.extremePeopleNumber);
        $("." + className + " .thisCityPeopleBatch").val(pojo.thisCityPeopleBatch);
        $("." + className + " .thisCityPeopleGroupNumber").val(pojo.thisCityPeopleGroupNumber);
        $("." + className + " .thisCityPeopleNumber").val(pojo.thisCityPeopleNumber);
    }
    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.editPetitionLeaveLayer, {
        edit : edit
    });


})(jQuery);