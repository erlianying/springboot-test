
(function($){
    "use strict";

    var checkboxUnitId = [];
    var checkboxUnitName = [];

    $(document).ready(function() {
        var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
        var secretId = frameData.initData.secretId;

        $(document).on("ifChecked","#selectAllBtn",function(){
            $.icheck.check(".rowSelect", true);
        });
        /**
         * 全选按钮--取消选中
         */
        $(document).on("ifUnchecked","#selectAllBtn",function(){
            $.icheck.check(".rowSelect", false);
        });

        $.ajax({
            url:context +'/clue/findReceiveSecretUnit',
            type:'post',
            data:{groupType : "lydwfz0001"},
            dataType:'json',
            success:function(successData){
                /* 下拉列表
                $.select2.empty("#unit", true);
                $.select2.addByList("#unit", successData, "id", "name", true, true);
                */
                //多选框
                for (var i in successData) {
                    /*
                    var unit = successData[i];
                    var str = '<p class="pull-left" style="margin: 5px 25px 5px 0;" myselect="' + unit.id +
                        '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" checked="checked" value="' + unit.id + '">' + '<span class="m-ui-color1">' + unit.name + '</span></p>';
                    $(".selectUnitDiv").append(str);
                    */
                    var unit = successData[i];
                    checkboxUnitId.push(unit.id);
                    checkboxUnitName.push(unit.name);
                }
            }
        });

        initData(secretId);
        //events();
    });

    /*  下拉列表
    function initData(secretId) {
        $.ajax({
            url: context + '/clue/findTargetBySecretId',
            type: 'post',
            data: {
                secretId: secretId
            },
            dataType: 'json',
            success: function (successData) {
                if (successData != null && successData.target != null && successData.target.length > 0) {
                    $(".oldUnit").addClass("col-xs-2");
                    //$(".oldUnit").append('<label class="control-label" unitId="' + successData.mainUnit.id + '">' + successData.mainUnit.name + '</label>');
                    for (var i in successData.target) {
                        var unit = successData.target[i];
                        var str = '<p class="pull-left" style="margin: 5px 25px 5px 0;" myselect="' + unit.targetId +
                            '"><span class="m-ui-color1">' + unit.targetType + '</span></p>';
                        $(".selectUnitDiv").append(str);
                    }
                }
            }
        });
    }
    */

    //多选框
    function initData(secretId) {
        $.ajax({
            url: context + '/clue/findTargetBySecretId',
            type: 'post',
            data: {
                secretId: secretId
            },
            dataType: 'json',
            success: function (successData) {
                if (successData != null && successData.target != null && successData.target.length > 0) {

                    for(var i = 0;i < checkboxUnitId.length;++i) {
                        var str = "";

                        var flag = false;
                        for (var j in successData.target) {
                            var unit = successData.target[j];
                            if( unit.targetId == checkboxUnitId[i]) {
                                flag = true;
                                break;
                            }
                        }

                        if(flag) {
                            str = '<p class="pull-left" style="margin: 5px 25px 5px 0;" myselect="' + checkboxUnitId[i] +
                                '">' + '<input type="checkbox" class="icheckbox rowSelected" name="rowSelected" disabled="disabled" checked="checked" value="' + checkboxUnitId[i] + '">' + '<span class="m-ui-color1" style="color:#888888">' + checkboxUnitName[i] + '</span></p>';
                        } else {
                            str = '<p class="pull-left" style="margin: 5px 25px 5px 0;" myselect="' + checkboxUnitId[i] +
                                '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + checkboxUnitId[i] + '">' + '<span class="m-ui-color1">' + checkboxUnitName[i] + '</span></p>';
                        }

                        $(".selectUnitDiv").append(str);
                    }
                }
                else {
                    for (var i in checkboxUnitId) {
                        var str = '<p class="pull-left" style="margin: 5px 25px 5px 0;" myselect="' + checkboxUnitId[i] +
                            '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" value="' + checkboxUnitId[i] + '">' + '<span class="m-ui-color1">' + checkboxUnitName[i] + '</span></p>';
                        $(".selectUnitDiv").append(str);
                    }
                }
            }
        });
    }

    /*下拉框
    function events(){

        $(document).on("click",".add",function(){
            var selectUnit = $.select2.val("#unit");
            if(selectUnit == null || selectUnit == ""){
                window.top.$.layerAlert.alert({msg:"请先选择单位！" ,icon:"1"});
                return;
            }
            var coopLst = $(".selectUnitDiv").find("p");
            var onlyFlag = true;

            $.each(coopLst, function(i, val){
                if(selectUnit == $(val).attr("myselect")){
                    onlyFlag = false;
                }
            });

            if(onlyFlag){
                var str = '<p class="pull-left newSelect" style="margin: 5px 25px 5px 0;" myselect="' + $.select2.val("#unit") + '"><span class="m-ui-color1">' + $.select2.text("#unit") + '</span>'+
                    '<button class="btn btn-default btn-xs remove"><span class="glyphicon glyphicon-remove m-ui-nogap" aria-hidden="true"></span></button></p>';
                $(".selectUnitDiv").append(str);
            }else{
                window.top.$.layerAlert.alert({msg:"单位选择重复！" ,icon:"1"});
            }
        });

        $(document).on("click",".remove",function(){
            $($(this).parents("p")[0]).remove();
        });

    }
    */

    jQuery.extend($.common, {
        getSelected: function(){
            /*下拉框
            var obj = {};

            var lst = [];
            var unitLst = $(".selectUnitDiv").find(".newSelect");
            $.each(unitLst, function(i, val){
                lst.push($(val).attr("myselect"));
            })
            if(lst.length == 0){
                obj.msg = "未添加任何通报单位!";
                obj.flag = false;
                return obj;
            }
            obj.unitLst = lst;
            return obj;
            */

            var obj = {};
            var lst = [];
            var len = $.icheck.getChecked("rowSelect").length;
            for(var i = 0;i < len;++i) {
                lst.push( $($.icheck.getChecked("rowSelect")[i]).val() );
            }

            if(lst.length == 0){
                obj.msg = "未添加任何通报单位!";
                obj.flag = false;
                return obj;
            }
            obj.unitLst = lst;
            return obj;
        }
    });
})(jQuery);