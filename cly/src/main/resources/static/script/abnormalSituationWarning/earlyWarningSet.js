(function($) {
    "use strict";

    $(document).ready(function () {
        init();
        $(document).on("click" , "#sheJunSave", function(e){
            editSheJun();
        })

        $(document).on("click" , "#otherSave", function(e){
            editOther();
        })

        $(document).on("click" , "#transmitWarningSave", function(e){
            editTransmitWarningSetting();
        })

        $(document).on("click" , "#traceWarningSave", function(e){
            editTraceWarningSetting();
        })




    })

    function init (){
        $.ajax({
            url: context + '/crowdWarningContent/earlyWarningSetInit',
            type: "post",
            success: function (map) {
                initData(map);
            },
        });
    }

    function  initData(map){
        var allTotalNum = map.sjTotalNumSetting;
        $("#allTotalNumId").val(allTotalNum[0].id);
        $("#allTotalNumHigh").val(allTotalNum[0].numberHigh);
        $("#allTotalNumMiddle").val(allTotalNum[0].numberMiddle);
        $("#allTotalNumLow").val(allTotalNum[0].numberLow);

        var sjFenQuSetting = map.sjFenQuSetting;
        for(var i in sjFenQuSetting){
            if(sjFenQuSetting[i].thresholdType == "01"){
                $("#fenQuTenAboveId").val(sjFenQuSetting[i].id);
                $("#fenQuTenAboveHigh").val(sjFenQuSetting[i].numberHigh);
                $("#fenQuTenAboveMiddle").val(sjFenQuSetting[i].numberMiddle);
                $("#fenQuTenAboveLow").val(sjFenQuSetting[i].numberLow);
            }else if(sjFenQuSetting[i].thresholdType == "02"){
                $("#fenQuTenUnderId").val(sjFenQuSetting[i].id);
                $("#fenQuTenUnderHigh").val(sjFenQuSetting[i].numberHigh);
                $("#fenQuTenUnderMiddle").val(sjFenQuSetting[i].numberMiddle);
                $("#fenQuTenUnderLow").val(sjFenQuSetting[i].numberLow);
            }
        }

        var sjFenShengSetting = map.sjFenShengSetting;
        for(var i in sjFenQuSetting){
            if(sjFenShengSetting[i].thresholdType == "01"){
                $("#fenShengTenAboveId").val(sjFenShengSetting[i].id);
                $("#fenShengTenAboveHigh").val(sjFenShengSetting[i].numberHigh);
                $("#fenShengTenAboveMiddle").val(sjFenShengSetting[i].numberMiddle);
                $("#fenShengTenAboveLow").val(sjFenShengSetting[i].numberLow);
            }else if(sjFenShengSetting[i].thresholdType == "02"){
                $("#fenShengTenUnderId").val(sjFenShengSetting[i].id);
                $("#fenShengTenUnderHigh").val(sjFenShengSetting[i].numberHigh);
                $("#fenShengTenUnderMiddle").val(sjFenShengSetting[i].numberMiddle);
                $("#fenShengTenUnderLow").val(sjFenShengSetting[i].numberLow);
            }
        }

        var otherSetting = map.otherSetting;
        for(var i in otherSetting){
            if(otherSetting[i].thresholdType == "01"){
                $("#otherTypeTenThousandAboveId").val(otherSetting[i].id);
                $("#otherTypeTenThousandAboveHigh").val(otherSetting[i].numberHigh);
                $("#otherTypeTenThousandAboveMiddle").val(otherSetting[i].numberMiddle);
                $("#otherTypeTenThousandAboveLow").val(otherSetting[i].numberLow);
            }else if(otherSetting[i].thresholdType == "02"){

                $("#otherTypeTenThousandUnderId").val(otherSetting[i].id);
                $("#otherTypeTenThousandUnderHigh").val(otherSetting[i].numberHigh);
                $("#otherTypeTenThousandUnderMiddle").val(otherSetting[i].numberMiddle);
                $("#otherTypeTenThousandUnderLow").val(otherSetting[i].numberLow);
            }else if(otherSetting[i].thresholdType == "03"){
                $("#otherTypeThousandUnderId").val(otherSetting[i].id);
                if(otherSetting[i].numberHigh){
                    $("#otherTypeThousandUnderHigh").val(otherSetting[i].numberHigh /100);
                }
                if(otherSetting[i].numberMiddle){
                    $("#otherTypeThousandUnderMiddle").val(otherSetting[i].numberMiddle/100);
                }
                if(otherSetting[i].numberLow){
                    $("#otherTypeThousandUnderLow").val(otherSetting[i].numberLow /100);
                }

            }
        }
        var sjSubClassSetting = map.sjSubClassSetting;
        for(var i in sjSubClassSetting){
            var subClass = $("#subClass");
            var cloneSubClass = subClass.clone(true);
            cloneSubClass.show();
            $("#sjSubClass").append(cloneSubClass);
            $.each(cloneSubClass.find(".valCell"),function(a,m){
                $(m).val(sjSubClassSetting[i][$(m).attr("valName")]);
            })
            $(cloneSubClass).find(".crowdName").text(sjSubClassSetting[i].viewName);
        }

        var arr = [{code:"hour", name:"小时"},{code:"day", name:"天"}]
        var transmitWarning = map.transmitWarning;
        for(var i in transmitWarning){
            var transmit = $("#transmitWarning");
            var cloneTransmit = transmit.clone(true);
            cloneTransmit.show();
            $("#tabs-3").prepend(cloneTransmit);
            $.each(cloneTransmit.find(".valCell"),function(a,m){
                $(m).val(transmitWarning[i][$(m).attr("valName")]);
            })
            $(cloneTransmit).find(".traceName").text(transmitWarning[i].traceName);
            var timeType = "";
            $(cloneTransmit).find(".selectTime").empty();
            $.each(arr, function(j, val){
                if(val.code == transmitWarning[i].timeType) {
                    timeType += '<option value="' + val.code + '" selected="selected">';
                    timeType += val.name;
                    timeType += "</option>";
                }else{
                    timeType += '<option value="' + val.code + '">';
                    timeType += val.name;
                    timeType += "</option>";
                }
            });
            $(cloneTransmit).find(".selectTime").append(timeType);
        }

        var traceWarning = map.traceWarning;
        for(var i in traceWarning){
            var subClass = $("#traceWarning");
            var cloneSubClass = subClass.clone(true);
            cloneSubClass.show();
            $("#tabs-4").prepend(cloneSubClass);
            $.each(cloneSubClass.find(".valCell"),function(a,m){
                $(m).val(traceWarning[i][$(m).attr("valName")]);
            })
            $(cloneSubClass).find(".crowdName").text(traceWarning[i].viewName);
        }
    }

    function getSheJunData(){
        var crowdWarningSettingList = [];
        $.each($("#tabs .crowdWarningSetting"),function(a,o){
            var obj = new Object();
            $.each($(o).find(".valCell"),function(a,m){
                obj[$(m).attr("valName")] = $(m).val();
            })
            crowdWarningSettingList.push(obj);
        })
        return crowdWarningSettingList;
    }

    function getOtherData(){
        var crowdWarningSettingList = [];

        $.each($(".othercCrowdWarningSetting"),function(a,o){
            var obj = new Object();
            $.each($(o).find(".valCell"),function(a,m){
                obj[$(m).attr("valName")] = $(m).val();
            })
            crowdWarningSettingList.push(obj);
        })
        return crowdWarningSettingList;
    }

    function getTransmitWarningData(){
        var transmitWarningList = [];
        $.each($("#tabs-3 .transmitWarning"),function(a,o){
            var obj = new Object();
            $.each($(o).find(".valCell"),function(a,m){
                obj[$(m).attr("valName")] = $(m).val();
            })

            var traceType = $.select2.val($(o).find(".selectTime"));
            if(traceType == "day"){
                obj.threshold = obj.thresholdStr * 60*60*1000*24;
            }else{
                obj.threshold = obj.thresholdStr * 60*60*1000;
            }
            transmitWarningList.push(obj);
            $(o).remove();
        })
        return transmitWarningList;
    }

    function getTraceWarningData(){
        var traceWarningList = [];
        $.each($("#tabs-4 .traceWarningList"),function(a,o){
            var obj = new Object();
            $.each($(o).find(".valCell"),function(a,m){
                obj[$(m).attr("valName")] = $(m).val();
            })
            traceWarningList.push(obj);
            $(o).remove();
        })
        return traceWarningList;
    }

    function editSheJun (){
        var demo = $.validform.getValidFormObjById("validformType") ;
        var tag = $.validform.check(demo) ;
        if(!tag){
            return false;
        }

        $.util.topWindow().$.layerAlert.confirm({
            msg:"确认修改吗？",
            title:"提示",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            yes:function(index, layero){
                var pojo = {
                    crowdwWarningSetingList: getSheJunData(),
                }
                var obj = new Object();
                $.util.objToStrutsFormData(pojo, "parameterPojo", obj);
                $.ajax({
                    url: context + '/crowdWarningContent/editWarningSetting',
                    type: "post",
                    data:obj,
                    success:function(successData){
                        if(successData){
                            $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示",end:function(){
                                init();
                            }});

                        }else{
                            $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                        }
                    },
                    error:function(){
                        $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                    }
                });
            }
        });
    }


    function editOther (){

        var demo = $.validform.getValidFormObjById("validformType") ;
        var tag = $.validform.check(demo) ;
        if(!tag){
            return false;
        }

        $.util.topWindow().$.layerAlert.confirm({
            msg:"确认修改吗？",
            title:"提示",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            yes:function(index, layero){
                var pojo = {
                    crowdwWarningSetingList: getOtherData(),
                }
                var obj = new Object();
                $.util.objToStrutsFormData(pojo, "parameterPojo", obj);
                $.ajax({
                    url: context + '/crowdWarningContent/editWarningSetting',
                    type: "post",
                    data:obj,
                    success:function(successData){
                        if(successData){
                            $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示",end:function(){
                                init();
                            }});

                        }else{
                            $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                        }
                    },
                    error:function(){
                        $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                    }
                });
            }
        });
    }


    function editTransmitWarningSetting (){

        var demo = $.validform.getValidFormObjById("validformType") ;
        var tag = $.validform.check(demo) ;
        if(!tag){
            return false;
        }

        $.util.topWindow().$.layerAlert.confirm({
            msg:"确认修改吗？",
            title:"提示",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            yes:function(index, layero){
                var pojo = {
                    transmitWarningSetingList: getTransmitWarningData(),
                }
                var obj = new Object();
                $.util.objToStrutsFormData(pojo, "parameterPojo", obj);
                $.ajax({
                    url: context + '/crowdWarningContent/editTransmitWarningSetting',
                    type: "post",
                    data:obj,
                    success:function(successData){
                        if(successData){
                            $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示",end:function(){
                                init();
                            }});

                        }else{
                            $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                        }
                    },
                    error:function(){
                        $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                    }
                });
            }
        });
    }

    function  editTraceWarningSetting(){
        var demo = $.validform.getValidFormObjById("validformType") ;
        var tag = $.validform.check(demo) ;
        if(!tag){
            return false;
        }

        $.util.topWindow().$.layerAlert.confirm({
            msg:"确认修改吗？",
            title:"提示",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            yes:function(index, layero){
                var pojo = {
                    traceWarningSetingList: getTraceWarningData(),
                }
                var obj = new Object();
                $.util.objToStrutsFormData(pojo, "parameterPojo", obj);
                $.ajax({
                    url: context + '/crowdWarningContent/editTraceWarningSetting',
                    type: "post",
                    data:obj,
                    success:function(successData){
                        if(successData){
                            $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示",end:function(){
                                init();
                            }});

                        }else{
                            $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                        }
                    },
                    error:function(){
                        $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                    }
                });
            }
        });
    }



})(jQuery);