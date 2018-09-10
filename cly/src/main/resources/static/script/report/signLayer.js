var initFlag = false;
(function($){
    "use strict";

    function saveData(){
        $("#save").attr("disabled", "disabled");
        var demo = $.validform.getValidFormObjById("validform") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            $("#save").removeAttr("disabled");
            setTimeout(function(){
                $.validform.closeAllTips("validform");
            },3000);
            return false;
        }
        var orp = {};
        orp.sendStatus = "bbzt0003";
        orp.receivePerson = $("#receivePerson").val();
        orp.updateTimeLong = (new Date()).getTime();
        orp.instruction = $("#instruction").val();
        return orp;
    }

    jQuery.extend($.common, {
        submitMethod: function(){
            return saveData();
        }
    });
})(jQuery);