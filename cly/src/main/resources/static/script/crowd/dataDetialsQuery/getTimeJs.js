$.bjqb = $.bjqb || {};
$.bjqb.getTimeJs = $.bjqb.getTimeJs || {};
(function($){
    "use strict";
    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.bjqb.getTimeJs, {
        getStartTime:function  getstartTime(){
            var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
            if(startDate){
                return new Date(startDate).getTime();
            }else{
                return 0;
            }
        },
        getEndTime:function  getEndTime(){
            var endDate = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end");
            if(endDate){
                endDate = $.date.endRange(endDate,"yyyy-MM-dd");
                return new Date(endDate).getTime();
            }else{
                return  new Date().getTime();
            }
        },
    });
})(jQuery);