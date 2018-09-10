$.messageLayer = $.messageLayer || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var clueId = frameData.initData.clueId;

    $(document).ready(function(){

        events();
        init(clueId);
    });

    function saveMessage(){

        var len = $.icheck.getChecked("rowSelect").length;

        var receiveUnit = "";
        for(var i = 0;i < len;++i) {
            receiveUnit += $($.icheck.getChecked("rowSelect")[i]).val();
            if(i != len - 1) {
                receiveUnit += ";";
            }
        }

        var content = $("#content").val();

        $.ajax({
            url:context + '/clue/saveMessage',
            type:"post",
            data:{
                clueId:clueId,
                receiveUnit:receiveUnit,
                content:content
            },
            success:function(successData){

                if (successData.flag == "true") {
                    window.top.$.layerAlert.alert({msg:"督办成功！" ,icon:"1",end : function(){
                        window.top.layer.close(pageIndex);
                        return;
                    }});
                } else {
                    window.top.$.layerAlert.alert({
                        msg: "督办失败!" , icon: "2", end: function () {
                        }
                    });
                }
            }
        })
    }

    function events(){
    }

    function init(id){

        $.ajax({
            url: context + '/clueFlow/findMainUnitAndCoopUnitByClueId',
            type: 'post',
            data: {id : id},
            dataType: 'json',
            success: function (successData) {
                $("#mainResponsibility").addClass("col-xs-8");
                $("#mainResponsibility").append('<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" checked="checked" value="' + successData.mainUnit.id + '">' + '<span class="m-ui-color1" unitId="' + successData.mainUnit.id + '">' + successData.mainUnit.name + '</span>');
                for (var i in successData.coopUnit) {
                    var unit = successData.coopUnit[i];
                    var str = '<p class="pull-left" style="margin: 5px 25px 5px 0;" myselect="' + unit.id +
                        '">' + '<input type="checkbox" class="icheckbox rowSelect" name="rowSelect" checked="checked" value="' + unit.id + '">' + '<span class="m-ui-color1">' + unit.name + '</span></p>';
                    $("#cooperation").append(str);
                }
            }
        });

        $("#content").val("请各单位尽快处理");
    }


    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.messageLayer, {
        saveMessage : saveMessage
    });


})(jQuery);