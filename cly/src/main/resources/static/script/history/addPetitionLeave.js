$.addPetitionLeaveLayer = $.addPetitionLeaveLayer || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index

    $(document).ready(function(){

        init();

        $(document).on("click" , "#addBtn", function(e){
            addBtnClick();
        });
        $(document).on("click" , "#cancel", function(e){
            cancelBtnClick();
        });

        $(document).on("change" , "#fixed_start", function(e){
            var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
            var date = new Date(startDate);
            var xingqi = date.getDay();
            switch(xingqi){
                case(1):$("#week").select2("val","xx0001")
                    break;
                case(2):$("#week").select2("val","xx0002")
                    break;
                case(3):$("#week").select2("val","xx0003")
                    break;
                case(4):$("#week").select2("val","xx0004")
                    break;
                case(5):$("#week").select2("val","xx0005")
                    break;
                case(6):$("#week").select2("val","xx0006")
                    break;
                case(0):$("#week").select2("val","xx0007")
                    break;
            }
        });

    });

    function checkDepartureRegister(){
        var demo = $.validform.getValidFormObjById("validformPersonType") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }
        var departureRegister = getPojo();
        var obj = new Object();
        $.util.objToStrutsFormData(departureRegister, "departureRegisterPojo", obj);
        window.top.$.common.showOrHideLoading(true);
        $.ajax({
            url:context + '/departureRegisterManage/checkDepartureRegister',
            type:"post",
            data:obj,
            success:function(id){
                window.top.$.common.showOrHideLoading(false);
                if(id){
                    $.util.topWindow().$.layerAlert.confirm({
                        msg:"存在上访带离记录,确定要覆盖吗？",
                        title:"提示",	  //弹出框标题
                        width:'300px',
                        hight:'200px',
                        shade: [0.5,'black'],  //遮罩
                        icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
                        yes:function(index, layero){
                            save(id);
                        }
                    });
                }else{
                    save();
                }
            },
            error:function(){
                window.top.$.common.showOrHideLoading(false);
            }
        })

    }

    function save(id){

        var demo = $.validform.getValidFormObjById("validformPersonType") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }
        var departureRegister = getPojo();
        if(id){
            departureRegister.id = id;
        }
        var obj = new Object();
        $.util.objToStrutsFormData(departureRegister, "departureRegisterPojo", obj);
        window.top.$.common.showOrHideLoading(true);
        $.ajax({
            url:context + '/departureRegisterManage/saveDepartureRegister',
            type:"post",
            data:obj,
            success:function(successData){
                window.top.$.common.showOrHideLoading(false);
                if(successData){
                    $.util.topWindow().$.layerAlert.alert({msg:"添加成功!",title:"提示",end : function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"添加失败!",title:"提示"});
                }
            },
            error:function(){
                window.top.$.common.showOrHideLoading(false);
            }
        })

    }

    function getPojo(){

        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        var petitionDateLong = null;
        if(startDate){
            petitionDateLong = new Date(startDate).getTime();
        }else{
            petitionDateLong = startDate;
        }

        var departureRegister = {
            allPeopleBatch: $("#allPeopleBatch").val(),
            allPeopleGroupNumber: $("#allPeopleGroupNumber").val(),
            allPeopleNumber: $("#allPeopleNumber").val(),
            emphasisArea: $.select2.val("#emphasisArea"),
            extremeBatch: $("#extremeBatch").val(),
            extremePeopleNumber: $("#extremePeopleNumber").val(),
            petitionDateLong : petitionDateLong,
            thisCityPeopleBatch: $("#thisCityPeopleBatch").val(),
            thisCityPeopleGroupNumber: $("#thisCityPeopleGroupNumber").val(),
            thisCityPeopleNumber: $("#thisCityPeopleNumber").val(),
            week: $.select2.val("#week"),
        };
        return departureRegister;
    }



    function init(){
        $.ajax({
            url:context + '/departureRegisterManage/findDictionary',
            type:"post",
            dataType:"json",
            success:function(dictionaryPojo){
                initDictionary(dictionaryPojo);
                $.select2.able("#week",false);
            }
        })
    }

    function initDictionary(dictionaryPojo){
        var emphasisArea = [];
        for(var i in dictionaryPojo.emphasisArea){
            if(dictionaryPojo.emphasisArea[i].name !=  "四个重点区域"){
                emphasisArea.push(dictionaryPojo.emphasisArea[i]);
            }
        }
        $.select2.addByList("#emphasisArea",emphasisArea,"id","name",true,true);
        $.select2.addByList("#week",dictionaryPojo.week,"id","name",true,true);
    }



    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.addPetitionLeaveLayer, {
        save : checkDepartureRegister
    });


})(jQuery);