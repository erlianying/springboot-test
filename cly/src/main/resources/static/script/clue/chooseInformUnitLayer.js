
(function($){
    "use strict";
    var localSez = false;
    var qtlx = "";
    var oldLst = [];
    var oldMain = "";
    var oldCheck = "";
    var oldAble = "";
    var xslb = "";

    $(document).ready(function() {
        var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
        var id = frameData.initData.id;
        localSez = frameData.initData.sez;
        qtlx = frameData.initData.qtlx;
        xslb = frameData.initData.xslb;
        oldLst = [];
        oldMain = "";
        initData(id);
        events();
    });

    function initData(id) {
        $.ajax({
            url: context + '/clueFlow/findAllMainUnitAndCoopUnitOrderById',
            type: 'post',
            data: {clueId : id},
            dataType: 'json',
            success: function (successData) {
                $.select2.empty("#mainResponsibility", true);
                $.select2.addByList("#mainResponsibility", successData.mainUnit, "id", "name", true, true);

                for (var i in successData.coopUnit) {
                    var unit = successData.coopUnit[i];
                    var str = '<p class="pull-left col-xs-5" style="margin: 5px 25px 5px 0;" myselect="' + unit.id +
                        '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + unit.id + '">' + '<span class="m-ui-color1">' + unit.name + '</span></p>';
                    $(".selectUnitDiv").append(str);
                }
            }
        });

        window.setTimeout(function(){

            if( !$.util.isBlank(xslb) && xslb != "" && xslb != "xslb0004" )
            {
                // var str = '<p class="pull-left col-xs-5" style="margin: 5px 25px 5px 0;" myselect="' + "015001" +
                //     '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + "015001" + '">' + '<span class="m-ui-color1">' + "网安总队一支队" + '</span></p>';
                // $(".selectUnitDiv").append(str);
                // var str = '<p class="pull-left col-xs-5" style="margin: 5px 25px 5px 0;" myselect="' + "015003" +
                //     '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + "015003" + '">' + '<span class="m-ui-color1">' + "网安总队三支队" + '</span></p>';
                // $(".selectUnitDiv").append(str);
                // var str = '<p class="pull-left col-xs-5" style="margin: 5px 25px 5px 0;" myselect="' + "015004" +
                //     '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + "015004" + '">' + '<span class="m-ui-color1">' + "网安总队四支队" + '</span></p>';
                // $(".selectUnitDiv").append(str);

                if("xslb0001" == xslb){     //涉访默认通报维稳办
                    $.icheck.check("input[value=018]", true);
                    $.icheck.able("input[value=018]", false);
                    $("input[value=018]").parent().parent().find("span").attr("class","m-ui-color2");
                }

                $.icheck.check("input[value=003]", true);
                $.icheck.able("input[value=003]", false);
                $("input[value=003]").parent().parent().find("span").attr("class","m-ui-color2");

                $.icheck.check("input[value=011]", true);
                $.icheck.able("input[value=011]", false);
                $("input[value=011]").parent().parent().find("span").attr("class","m-ui-color2");

                $.icheck.check("input[value=016]", true);
                $.icheck.check("input[value=017]", true);

                if("qtlx0001" == qtlx){
                    $.icheck.check("input[value=001]", true);
                    $.icheck.able("input[value=001]", false);
                    $("input[value=001]").parent().parent().find("span").attr("class","m-ui-color2");
                }

                if("qtlx0004" == qtlx) {
                    $.icheck.check("input[value=005]", true);
                    $.icheck.able("input[value=005]", false);
                    $("input[value=005]").parent().parent().find("span").attr("class","m-ui-color2");
                }

                $.icheck.check("input[value=015001]", true);
                $.icheck.able("input[value=015001]", false);
                $("input[value=015001]").parent().find("span").attr("class","m-ui-color2");

                $.icheck.check("input[value=015003]", true);
                $.icheck.able("input[value=015003]", false);
                $("input[value=015003]").parent().find("span").attr("class","m-ui-color2");

                $.icheck.check("input[value=015004]", true);
                $.icheck.able("input[value=015004]", false);
                $("input[value=015004]").parent().find("span").attr("class","m-ui-color2");
            }

            if (!$.util.isBlank(id)) {
                $.ajax({
                    url: context + '/clueFlow/findMainUnitAndCoopUnitByClueId',
                    type: 'post',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    success: function (successData) {
                        if (successData != null && successData.mainUnit != null) {
                            $(".oldUnit").addClass("col-xs-4");
                            $(".oldUnit").append('<label class="control-label" unitId="' + successData.mainUnit.id + '">' + successData.mainUnit.name + '</label>');

                            oldMain = successData.mainUnit.id;
                            oldLst = successData.coopUnit;

                            if(successData.xslb != "xslb0004") {
                                // var str = '<p class="pull-left col-xs-5" style="margin: 5px 25px 5px 0;" myselect="' + "015001" +
                                //     '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + "015001" + '">' + '<span class="m-ui-color1">' + "网安总队一支队" + '</span></p>';
                                // $(".selectUnitDiv").append(str);
                                // var str = '<p class="pull-left col-xs-5" style="margin: 5px 25px 5px 0;" myselect="' + "015003" +
                                //     '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + "015003" + '">' + '<span class="m-ui-color1">' + "网安总队三支队" + '</span></p>';
                                // $(".selectUnitDiv").append(str);
                                // var str = '<p class="pull-left col-xs-5" style="margin: 5px 25px 5px 0;" myselect="' + "015004" +
                                //     '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + "015004" + '">' + '<span class="m-ui-color1">' + "网安总队四支队" + '</span></p>';
                                // $(".selectUnitDiv").append(str);

                                if("xslb0001" == successData.xslb){     //涉访默认通报维稳办
                                    $.icheck.check("input[value=018]", true);
                                    $.icheck.able("input[value=018]", false);
                                    $("input[value=018]").parent().parent().find("span").attr("class","m-ui-color2");
                                }

                                $.icheck.check("input[value=003]", true);
                                $.icheck.able("input[value=003]", false);
                                $("input[value=003]").parent().parent().find("span").attr("class","m-ui-color2");

                                $.icheck.check("input[value=011]", true);
                                $.icheck.able("input[value=011]", false);
                                $("input[value=011]").parent().parent().find("span").attr("class","m-ui-color2");

                                $.icheck.check("input[value=016]", true);
                                $.icheck.check("input[value=017]", true);

                                if("qtlx0001" == qtlx){
                                    $.icheck.check("input[value=001]", true);
                                    $.icheck.able("input[value=001]", false);
                                    $("input[value=001]").parent("p").find("span").attr("class","m-ui-color2");
                                }

                                if("qtlx0004" == qtlx) {
                                    $.icheck.check("input[value=005]", true);
                                    $.icheck.able("input[value=005]", false);
                                    $("input[value=005]").parent().parent().find("span").attr("class","m-ui-color2");
                                }

                                $.icheck.check("input[value=015001]", true);
                                $.icheck.able("input[value=015001]", false);
                                $("input[value=015001]").parent().find("span").attr("class","m-ui-color2");

                                $.icheck.check("input[value=015003]", true);
                                $.icheck.able("input[value=015003]", false);
                                $("input[value=015003]").parent().find("span").attr("class","m-ui-color2");

                                $.icheck.check("input[value=015004]", true);
                                $.icheck.able("input[value=015004]", false);
                                $("input[value=015004]").parent().find("span").attr("class","m-ui-color2");


                                if("qtlx0001" == successData.qtlx){
                                    $.icheck.check("input[value=001]", true);
                                    $.icheck.able("input[value=001]", false);
                                    $("input[value=001]").parent().parent().find("span").attr("class","m-ui-color2");
                                }

                                if("qtlx0004" == successData.qtlx) {
                                    $.icheck.check("input[value=005]", true);
                                    $.icheck.able("input[value=005]", false);
                                    $("input[value=005]").parent().parent().find("span").attr("class","m-ui-color2");
                                }
                            } else {
                                // var str = '<p class="pull-left col-xs-5" style="margin: 5px 25px 5px 0;" myselect="' + "015001" +
                                //     '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + "015001" + '">' + '<span class="m-ui-color1">' + "网安总队一支队" + '</span></p>';
                                // $(".selectUnitDiv").append(str);
                                // var str = '<p class="pull-left col-xs-5" style="margin: 5px 25px 5px 0;" myselect="' + "015003" +
                                //     '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + "015003" + '">' + '<span class="m-ui-color1">' + "网安总队三支队" + '</span></p>';
                                // $(".selectUnitDiv").append(str);
                                // var str = '<p class="pull-left col-xs-5" style="margin: 5px 25px 5px 0;" myselect="' + "015004" +
                                //     '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + "015004" + '">' + '<span class="m-ui-color1">' + "网安总队四支队" + '</span></p>';
                                // $(".selectUnitDiv").append(str);
                            }

                            $.icheck.check("input[value=" + successData.mainUnit.id + "]", false);
                            $.icheck.able("input[value=" + successData.mainUnit.id + "]", false);
                            $("input[value=" + successData.mainUnit.id + "]").parent().parent().find("span").attr("class","m-ui-color2");

                            for (var i in successData.coopUnit) {
                                var unit = successData.coopUnit[i];
                                $.icheck.check("input[value=" + unit.id + "]", true);
                                $.icheck.able("input[value=" + unit.id + "]", false);
                                $("input[value=" + unit.id + "]").parent().parent().find("span").attr("class","m-ui-color2");
                            }

                        }
                    }
                });
            }

        },150);
    }

    function enableCheckbox(unit) { //去掉unit的不可操作状态
        //$.icheck.able("input[value=" + unit + "]", true);

        if(oldCheck == "true") {
            $.icheck.check("input[value=" + unit + "]", true);
        } else if(oldCheck == "false") {
            $.icheck.check("input[value=" + unit + "]", false);
        }

        if(oldAble == "true") {
            $.icheck.able("input[value=" + unit + "]", true);
            $("input[value=" + unit + "]").parent().parent().find("span").attr("class","m-ui-color1");
        } else if(oldAble == "false") {
            $.icheck.able("input[value=" + unit + "]", false);
            $("input[value=" + unit + "]").parent().parent().find("span").attr("class","m-ui-color2");
        }
    }

    function events(){
        $(document).on("select2:select","#mainResponsibility",function(){
            enableCheckbox(oldMain);    //去掉oldMain的不可操作状态
            oldMain = $.select2.val("#mainResponsibility");

            var coopLst = $(".rowSelect");
            $.each(coopLst, function(i, val){
                if($.select2.val("#mainResponsibility") == $(val).val()){
                    if($("input[value=" + $.select2.val("#mainResponsibility") + "]").parent().hasClass("disabled")) {
                        oldAble = "false";
                    } else {
                        oldAble = "true";
                    }
                    if($("input[value=" + $.select2.val("#mainResponsibility") + "]").parent().hasClass("checked")) {
                        oldCheck = "true";
                    } else {
                        oldCheck = "false";
                    }

                    $.icheck.check("input[value=" + $.select2.val("#mainResponsibility") + "]", false);
                    $.icheck.able("input[value=" + $.select2.val("#mainResponsibility") + "]", false);
                    $("input[value=" + $.select2.val("#mainResponsibility") + "]").parent().parent().find("span").attr("class","m-ui-color2");
                }
            })

            if($.select2.val("#mainResponsibility") == $($(".oldUnit").find("label")[0]).attr("unitId")){
                $.select2.val("#mainResponsibility", "");
            }
        });
        $(document).on("select2:unselect","#mainResponsibility",function(){
            enableCheckbox(oldMain);    //去掉oldMain的不可操作状态
            oldMain = $($(".oldUnit").find("label")[0]).attr("unitId");

            var coopLst = $(".rowSelect");
            $.each(coopLst, function(i, val){
                if($($(".oldUnit").find("label")[0]).attr("unitId") == $(val).val()){
                    if($("input[value=" + $($(".oldUnit").find("label")[0]).attr("unitId") + "]").parent().hasClass("disabled")) {
                        oldAble = "false";
                    } else {
                        oldAble = "true";
                    }
                    if($("input[value=" + $($(".oldUnit").find("label")[0]).attr("unitId") + "]").parent().hasClass("checked")) {
                        oldCheck = "true";
                    } else {
                        oldCheck = "false";
                    }

                    $.icheck.check("input[value=" + $($(".oldUnit").find("label")[0]).attr("unitId") + "]", false);
                    $.icheck.able("input[value=" + $($(".oldUnit").find("label")[0]).attr("unitId") + "]", false);
                    $("input[value=" + $($(".oldUnit").find("label")[0]).attr("unitId") + "]").parent().parent().find("span").attr("class","m-ui-color2");
                }
            })

        });
    }

    jQuery.extend($.common, {
        getSelected: function(){
            var obj = {};
            if($.util.isBlank($.select2.val("#mainResponsibility")) && $.util.isBlank($(".oldUnit").text())){
                obj.msg = "请选择主责单位!";
                obj.flag = false;
                return obj;
            }

            var lst = [];
            var len = $.icheck.getChecked("rowSelect").length;
            for(var i = 0;i < len;++i) {
                var newUnit = $($.icheck.getChecked("rowSelect")[i]).val();
                if(newUnit == $.select2.val("#mainResponsibility") || newUnit == $($(".oldUnit").find("label")[0]).attr("unitId")) {
                    continue;
                }
                var isNew = true;
                for(var j in oldLst) {
                    if(newUnit == oldLst[j].id) {
                        isNew = false;
                        break;
                    }
                }
                if(isNew) {
                    lst.push( newUnit );
                }
            }

            if($.util.isBlank($.select2.val("#mainResponsibility")) && lst.length == 0){
                obj.msg = "未添加任何通报单位!";
                obj.flag = false;
                return obj;
            }
            obj.mainObj = $.select2.val("#mainResponsibility");
            obj.coopLst = lst;
            return obj;
        }
    });
})(jQuery);