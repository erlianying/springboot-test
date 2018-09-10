
(function($){
    "use strict";

    $(document).ready(function(){
        findPersonByUserName();
        checkNewClue();
        checkNewMessage();
        setInterval(checkNewClue, 10000);
        setInterval(checkNewMessage, 10000);
    })  // 铃铛

    function findPersonByUserName(){
        $.ajax({
            url:context +'/clue/findPersonName',
            type:'post',
            data:{},
            dataType:'json',
            success:function(successData){
                $("#usernameSpan").text(successData.name);
            }
        });
    }

    function checkNewClue() {
        $.ajax({
            url:context +'/clueFlow/findMyNewClueCount',
            type:'post',
            data:{},
            dataType:'json',
            success:function(successData){
                if(successData == 0){
                    $(".ldsl").empty();
                    $(document).off("click", ".duang");
                }else{
                    $(".ldsl").html('<span class="number">' + successData + '</span>');
                    $(document).off("click", ".duang");
                    $(document).on("click", ".duang", function(){
                        $.util.topWindow().$.layerAlert.dialog({
                            content : context + "/show/page/web/clue/myClueLayer",
                            pageLoading : true,
                            title : '待办线索',
                            width : "1300px",
                            height : "600px",
                            maxmin : 0,
                            btn:["关闭"],
                            callBacks:{
                                btn1:function(index, layero){
                                    $.util.topWindow().$.layerAlert.closeAll();
                                },
                            },
                            success:function(layero, index){

                            },
                            initData:{
                                p$ : $
                            },
                            end:function(){

                            }
                        });
                    })
                }
            }
        });
    }

    function checkNewMessage() {
        $.ajax({
            url:context +'/clueFlow/findMyNewMessageCount',
            type:'post',
            data:{},
            dataType:'json',
            success:function(successData){
                if(successData == 0){
                    $(".fa-exclamation-circle").empty();
                    $(document).off("click", ".newMessage");
                }else{
                    $(".fa-exclamation-circle").html('<span class="number">' + successData + '</span>');
                    $(document).off("click", ".newMessage");
                    $(document).on("click", ".newMessage", function(){
                        $.util.topWindow().$.layerAlert.dialog({
                            content : context + "/show/page/web/clue/myMessageLayer",
                            pageLoading : true,
                            title : '消息提醒',
                            width : "700px",
                            height : "430px",
                            maxmin : 0,
                            btn:["关闭"],
                            callBacks:{
                                btn1:function(index, layero){
                                    $.util.topWindow().$.layerAlert.closeAll();
                                },
                            },
                            success:function(layero, index){

                            },
                            initData:{

                            },
                            end:function(){

                            }
                        });
                    })
                }
            }
        });
    }

    /**
     * 控制loading显示或者隐藏
     *
     * @param param true：显示，false：隐藏
     */
    function showOrHideLoading(param) {
        if(param){
            $("#loadingDiv").show();
        }else{
            $("#loadingDiv").hide();
        }
    }

    jQuery.extend($.common, {
        setIframeLocation: function(url){
            $($("#mainContent").find("iframe")[0]).attr("src", url);
        },
        checkNewClue: checkNewClue ,
        checkNewMessage: checkNewMessage ,
        showOrHideLoading : showOrHideLoading
    });

})(jQuery);