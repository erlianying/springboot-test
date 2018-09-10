(function($){
    "use strict";

    $(document).ready(function() {
        event();
        initData();

    });

    function addQTSetting(qt, name, times){
        var selectLst = $(".selectQTDiv").find("p");
        var onlyFlag = true;
        $.each(selectLst, function(i, val){
            if(qt == $(val).attr("myselect")){
                onlyFlag = false;
            }
        });
        if(onlyFlag){
            var str1 = '<p class="newSelect" style="margin: 5px 25px 5px 0;" myselect="' + qt + '"><span class="m-ui-color1">' + name + '</span>'+
                '<button class="btn btn-default btn-xs removeTr"><span class="glyphicon glyphicon-remove m-ui-nogap" aria-hidden="true"></span></button></p>';
            var str2 = '<textarea class="selectQT newSelect" myselect="' + qt + '">' + times + '</textarea>';
            var str = '<tr><td>' + str1 + '</td><td>' + str2 + '</td></tr>';
            $(".selectQTDiv").append(str);
        }else{
            window.top.$.layerAlert.alert({msg:"群体重复！" ,icon:"1"});
        }
    }

    function addWay(selectWay, selectWayName){
        var selectLst = $(".selectWayDiv").find("p");
        var onlyFlag = true;
        $.each(selectLst, function(i, val){
            if(selectWay == $(val).attr("myselect")){
                onlyFlag = false;
            }
        });
        if(onlyFlag){
            var str = '<p class="pull-left newSelect" style="margin: 5px 25px 5px 0;" myselect="' + selectWay + '"><span class="m-ui-color1">' + selectWayName + '</span>'+
                '<button class="btn btn-default btn-xs remove"><span class="glyphicon glyphicon-remove m-ui-nogap" aria-hidden="true"></span></button></p>';
            $(".selectWayDiv").append(str);
        }else{
            window.top.$.layerAlert.alert({msg:"行为重复！" ,icon:"1"});
        }
    }

    function addTargetSite(selectTarget){
        var selectLst = $(".selectTargetDiv").find("p");
        var onlyFlag = true;
        $.each(selectLst, function(i, val){
            if(selectTarget == $(val).attr("myselect")){
                onlyFlag = false;
            }
        });
        if(onlyFlag){
            var str = '<p class="pull-left newSelect" style="margin: 5px 25px 5px 0;" myselect="' + selectTarget + '"><span class="m-ui-color1">' + selectTarget + '</span>'+
                '<button class="btn btn-default btn-xs remove"><span class="glyphicon glyphicon-remove m-ui-nogap" aria-hidden="true"></span></button></p>';
            $(".selectTargetDiv").append(str);
        }else{
            window.top.$.layerAlert.alert({msg:"地点重复！" ,icon:"1"});
        }
    }

    function event(){

        $(document).on("click",".addQT",function(){
            var selectQT = $.select2.val("#involveCrowdTwo");
            var selectQTName = $.select2.text("#involveCrowdTwo");
            if(selectQT == null){
                window.top.$.layerAlert.alert({msg:"请先选择群体！" ,icon:"1"});
                return;
            }
            var time = $.date.dateToStr(new Date(), "yyyyMMdd");
            addQTSetting(selectQT, selectQTName, time);
        });
        $(document).on("click",".addWay",function(){
            var selectWay = $.select2.val("#wayOfActTwo");
            var selectWayName = $.select2.text("#wayOfActTwo");
            if(selectWay == null){
                selectWay = $.select2.val("#wayOfActOne");
                selectWayName = $.select2.text("#wayOfActOne");
                if(selectWay == null){
                    window.top.$.layerAlert.alert({msg:"请先选择行为方式！" ,icon:"1"});
                    return;
                }
            }
            addWay(selectWay, selectWayName);
        });
        $(document).on("click",".addTarget",function(){
            var selectTarget = $.select2.text("#targetSite");
            if(selectTarget == null){
                window.top.$.layerAlert.alert({msg:"请先选择地点！" ,icon:"1"});
                return;
            }
            addTargetSite(selectTarget);
        });
        $(document).on("click",".remove",function(){
            $($(this).parents("p")[0]).remove();
        });
        $(document).on("click",".removeTr",function(){
            $($(this).parents("tr")[0]).remove();
        });
        $(document).on("select2:select","#wayOfActOne",function(){
            $.ajax({
                url:context +'/dictionary/findDictionaryItemsByParentId',
                type:'post',
                data:{parentId : $.select2.val("#wayOfActOne")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#wayOfActTwo", true);
                    $.select2.addByList("#wayOfActTwo", successData, "id", "name", true, true);
                }
            });
        });
        $(document).on("select2:select","#involveCrowdOne",function(){
            $.ajax({
                url:context +'/dictionary/findDictionaryItemsByParentId',
                type:'post',
                data:{parentId : $.select2.val("#involveCrowdOne")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#involveCrowdTwo", true);
                    $.select2.addByList("#involveCrowdTwo", successData, "id", "name", true, true);
                }
            });
        });
    }

    function initData(){
        $.ajax({
            url:context +'/clue/findAllTargetSite',
            type:'post',
            data:{},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#targetSite", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_XWFS},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#wayOfActOne", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_QTLX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#involveCrowdOne", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/clue/showWarningSettings',
            type:'post',
            dataType:'json',
            success:function(successData){
                var data = successData.data;
                for(var i in data){
                    if(data[i].query == '1'){
                        if(data[i].num == '1'){
                            $("#input11").val(data[i].content);
                        }
                        if(data[i].num == '2'){
                            $("#input12").val(data[i].content);
                        }
                    }
                    if(data[i].query == '2'){
                        $("#input2").val(data[i].content);
                    }
                    if(data[i].query == '3'){
                        $("#input3").val(data[i].content);
                    }
                    if(data[i].query == '4'){
                        if(data[i].num == '1'){
                            $("#input41").val(data[i].content);
                        }
                        if(data[i].num == '2'){
                            var arr = data[i].content.split(",");
                            for(var n in arr){
                                addTargetSite(arr[n]);
                            }
                        }
                        if(data[i].num == '3'){
                            $("#input43").val(data[i].content);
                        }
                    }
                    if(data[i].query == '6'){
                        if(data[i].num == '1'){
                            $("#input61").val(data[i].content);
                        }
                        if(data[i].num == '2'){
                            var arr = data[i].content.split(",");
                            var arrName = data[i].contentName.split(",");
                            for(var n in arr){
                                addWay(arr[n], arrName[n]);
                            }
                        }
                    }
                    if(data[i].query == '7'){
                        var arr = data[i].content.split(";");
                        var arrName = data[i].contentName.split(";");
                        for(var n in arr){
                            var qt = arr[n].split(":");
                            addQTSetting(qt[0], arrName[n], qt[1]);
                        }
                    }
                }
            }
        });
    }

    jQuery.extend($.common, {
        getValue: function(){
            var obj = [];
            obj[0] = {};
            obj[0].query = '1';
            obj[0].num = '1';
            obj[0].content = $("#input11").val();
            obj[1] = {};
            obj[1].query = '1';
            obj[1].num = '2';
            obj[1].content = $("#input12").val();
            obj[2] = {};
            obj[2].query = '2';
            obj[2].num = '1';
            obj[2].content = $("#input2").val();
            obj[3] = {};
            obj[3].query = '3';
            obj[3].num = '1';
            obj[3].content = $("#input3").val();
            obj[4] = {};
            obj[4].query = '4';
            obj[4].num = '1';
            obj[4].content = $("#input41").val();
            obj[5] = {};
            obj[5].query = '4';
            obj[5].num = '2';
            var selectLst = $(".selectTargetDiv").find("p");
            var str = "";
            $.each(selectLst, function(i, val){
                str += $(val).attr("myselect") + ",";
            });
            str = str.substr(0, str.length - 1);
            obj[5].content = str;
            obj[6] = {};
            obj[6].query = '4';
            obj[6].num = '3';
            obj[6].content = $("#input43").val();
            obj[7] = {};
            obj[7].query = '6';
            obj[7].num = '1';
            obj[7].content = $("#input61").val();
            obj[8] = {};
            obj[8].query = '6';
            obj[8].num = '2';
            selectLst = $(".selectWayDiv").find("p");
            str = "";
            $.each(selectLst, function(i, val){
                str += $(val).attr("myselect") + ",";
            });
            str = str.substr(0, str.length - 1);
            obj[8].content = str;
            obj[9]= {};
            obj[9].query = '7';
            obj[9].num = '1';
            selectLst = $(".selectQTDiv").find(".selectQT");
            str = "";
            $.each(selectLst, function(i, val){
                str += $(val).attr("myselect") + ":" + $(val).val() + ";";
            });
            str = str.substr(0, str.length - 1);
            obj[9].content = str;
            var warningSetting = {};
            warningSetting.obj = obj;
            var d = {};
            $.util.objToStrutsFormData(warningSetting, "warningSetting", d);
            return d;
        }
    });
})(jQuery);