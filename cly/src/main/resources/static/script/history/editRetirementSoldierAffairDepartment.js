$.editPetitionLeaveLayer = $.editPetitionLeaveLayer || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var editTime = initData.editTime ;

    $(document).ready(function(){
        if(editTime != null){
            $.laydate.setTime(Number(editTime), "#dataTime");
            init(editTime);
        }
        $(document).on("change" , "#fixed_date", function(e){
            var startDate = $.laydate.getDate("#dataTime", "date");
            if(startDate == null){
                $("input").val("");
                return;
            }
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

        var rsad = {
            trainTo16:$.util.isBlank($("#trainTo16").val())?0:$("#trainTo16").val(),
            hotelIn16:$.util.isBlank($("#hotelIn16").val())?0:$("#hotelIn16").val(),
            phoneIn16:$.util.isBlank($("#phoneIn16").val())?0:$("#phoneIn16").val(),
            phoneNewTo16:$.util.isBlank($("#phoneNewTo16").val())?0:$("#phoneNewTo16").val(),
            phoneInScale16:$.util.isBlank($("#phoneInScale16").val())?0:$("#phoneInScale16").val(),
            analysisScale16:$.util.isBlank($("#analysisScale16").val())?0:$("#analysisScale16").val(),
            trainTo22:$.util.isBlank($("#trainTo22").val())?0:$("#trainTo22").val(),
            hotelIn22:$.util.isBlank($("#hotelIn22").val())?0:$("#hotelIn22").val(),
            phoneIn22:$.util.isBlank($("#phoneIn22").val())?0:$("#phoneIn22").val(),
            phoneNewTo22:$.util.isBlank($("#phoneNewTo22").val())?0:$("#phoneNewTo22").val(),
            phoneInScale22:$.util.isBlank($("#phoneInScale22").val())?0:$("#phoneInScale22").val(),
            analysisScale22:$.util.isBlank($("#analysisScale22").val())?0:$("#analysisScale22").val(),
            realAnalysisScale:$.util.isBlank($("#realAnalysisScale").val())?0:$("#realAnalysisScale").val(),
            dateLong:$.laydate.getTime("#dataTime", "date")
        };

        var obj = new Object();
        $.util.objToStrutsFormData(rsad, "retirementSoldierAffairDepartmentPojo", obj);
        window.top.$.common.showOrHideLoading(true);
        $.ajax({
            url:context + '/departureRegisterManage/editRetirementSoldierAffairDepartment',
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

    function init(time){
        if(time != null) {
            var timeStr = $.date.dateToStr(new Date(time + 1000*3600*24), "dd日");
            $("#sjgm").text(timeStr + "实际规模");
        } else {
            $("#sjgm").text("明日实际规模");
        }

        $.ajax({
            url:context + '/departureRegisterManage/findRetirementSoldierAffairDepartmentOneDay',
            data:{time:time},
            type:"post",
            dataType:"json",
            success:function(data){

                $("#trainTo16").val(data.trainTo16);
                $("#hotelIn16").val(data.hotelIn16);
                $("#phoneIn16").val(data.phoneIn16);
                $("#phoneNewTo16").val(data.phoneNewTo16);
                $("#phoneInScale16").val(data.phoneInScale16);
                $("#analysisScale16").val(data.analysisScale16);
                $("#trainTo22").val(data.trainTo22);
                $("#hotelIn22").val(data.hotelIn22);
                $("#phoneIn22").val(data.phoneIn22);
                $("#phoneNewTo22").val(data.phoneNewTo22);
                $("#phoneInScale22").val(data.phoneInScale22);
                $("#analysisScale22").val(data.analysisScale22);
                $("#realAnalysisScale").val(data.realAnalysisScale);
            }
        })
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.editPetitionLeaveLayer, {
        edit : edit
    });


})(jQuery);