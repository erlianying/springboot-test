$.resetPasswordLayer = $.resetPasswordLayer || {};
(function($){
    "use strict";

    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var username = initData.username;

    var tag = false;
    $(document).ready(function(){
        $(document).on("blur" , "#affirmPassword", function(e){
            var demo = $.validform.getValidFormObjById("validformPersonType") ;
            var flag = $.validform.check(demo) ;
            if(!flag){
                return false;
            }
            var affirmPassword = $("#affirmPassword").val();
            var newPassword = $("#newPassword").val();
            if(affirmPassword == newPassword){
                tag = true;
            }else{
                tag = false;
                $.util.topWindow().$.layerAlert.alert({msg:"两次密码输入不一致!",title:"提示",});
            }
        });

        $(document).on("focus" , ".password", function(e){
            $(this).attr("type","password");
        });


        init()
    })

    function init(){
        $("#username").text(username);
    }

    function updatePassword(){
        var bool = false;
        var demo = $.validform.getValidFormObjById("validformPersonType") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }

        if(!tag){
            $.util.topWindow().$.layerAlert.alert({msg:"两次密码输入不一致!",title:"提示",});
            return false;
        }
        $.ajax({
            url: context + '/personManage/updatePassword',
            data: {
                oldPassword : $("#oldPassword").val(),
                newPassword :  $("#newPassword").val(),
            },
            type: "post",
            dataType: "json",
            async:false,
            success: function (successDate) {
                bool = successDate;
                if(successDate){
                    $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示",end : function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"原密码错误!",title:"提示"});
                }
            }
        })
        return bool;
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.resetPasswordLayer, {
        updatePassword : updatePassword
    });

})(jQuery);