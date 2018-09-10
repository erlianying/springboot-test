(function($){
    "use strict";

    $(document).ready(function() {
            $("#imgId").attr("src", context+"/downloadWord/"+ imgId);

        $.ajax({
            url:context +'/organizeReport/findspd',
            type:'post',
            data:{pictureId : imgId},
            dataType:'json',
            success:function(successData){
                var arr = successData.fileName.split(".");
                var type = arr[arr.length - 1];
                if(type == "pdf"){
                    $("#pdfDiv").show();
                    PDFObject.embed(context + "/clue/downloadFile?metaId=" + imgId, "#pdfDiv");
                }else{
                    $("#imgDiv").show();
                    $($("#imgDiv").find("img")[0]).attr("src", context + "/clue/downloadFile?metaId=" + imgId);
                }
            },
            error:function(errorData){
                console.log(errorData);
            }
        });
    });

})(jQuery);

