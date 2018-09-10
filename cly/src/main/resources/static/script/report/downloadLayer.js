(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var p$ = frameData.initData.p$;
    var reportId = frameData.initData.reportId;
    var pictureId;
    var pageIndex = null;

    var length = frameData.initData.length ;

    $(document).ready(function() {

        $.ajax({
            url:context +'/clue/getLoggedUnit',
            type:'post',
            dataType:'json',
            success:function(successData){
                if(successData){
                    if(successData.organizationId == "015009") {
                        $.icheck.check("#spd",false);
                    }
                }
            }
        });

        if(length == 1) {
            $.ajax({
                url:context +'/organizeReport/findfj',
                type:'post',
                dataType:'json',
                data : {
                    reportId : reportId
                },
                success:function(successData){
                    if(successData){
                        if(successData.flag == "false") {
                            $.icheck.check("#fj",false);
                            $.icheck.able("#fj",false);
                        }
                    }
                }
            });
        }
    });


    /**
     * 提交
     */
    jQuery.extend($.common,{
        submitMethod:function(index){
            var arr = $.icheck.getChecked("downloadType");
            if(length == 1 && arr.length == 1) {
                p$.common.downloadFile(reportId, $(arr[0]).val(), index);
                return ;
            }

            var str = "";
            for(var i=0; i<arr.length; i++){
                str += $(arr[i]).val() + ",";
            }
            if(str != ""){
                str = str.substr(0, str.length-1);
                p$.common.downloadZip(str, index);
            }else{
                p$.common.downloadZip(false);
            }
        }
    })

})(jQuery);