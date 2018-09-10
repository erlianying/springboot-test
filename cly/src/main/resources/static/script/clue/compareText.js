
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var id = frameData.initData.id;
    $(document).ready(function() {

        $.ajax({
            url:context +'/clue/findContextByPictureId',
            type:'post',
            data:{pictureId : id},
            dataType:'json',
            success:function(successData){
                $("#content").val(successData.content);
                var arr = successData.fileName.split(".");
                var type = arr[arr.length - 1];
                if(type == "pdf"){
                    $("#pdfDiv").show();
                    PDFObject.embed(context + "/clue/downloadFile?metaId=" + id, "#pdfDiv");
                }else{
                    $("#imgDiv").show();
                    $($("#imgDiv").find("img")[0]).attr("src", context + "/clue/downloadFile?metaId=" + id);
                }
            },
            error:function(errorData){
                console.log(errorData);
            }
        });
       // PDFObject.embed("#pdfDiv",[{width:800, height:1000}]);


    });

    jQuery.extend($.common, {
        getSelected: function(){
            return $("#content").val();
        }
    });
})(jQuery);