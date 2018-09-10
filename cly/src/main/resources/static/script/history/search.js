(function ($) {
    "use strict";

    $(document).ready(function () {

    });

    /**
     * 检索页面
     */
    $(document).on("click","#fullSearch",function(){
        if($.util.isBlank($("#fullSearchText").val())){
            return;
        }
        location.href=context + '/show/page/web/history/searchResult?fullText='+$("#fullSearchText").val();
    });

})(jQuery);