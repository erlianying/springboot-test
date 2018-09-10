(function($){
    "use strict";
    $(document).ready(function() {
        var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    });

    jQuery.extend($.common, {
        getSelected: function(){
            var obj = {
                startTime: $.laydate.getTime("#startTime", "date")
            };
            return obj;
        }
    });
})(jQuery);