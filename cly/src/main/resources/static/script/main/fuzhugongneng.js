
(function($){
    "use strict";

    var flag = false;
    $(document).ready(function(){
        $(document).on("click" , ".updatePassword", function(e){
            addPage();
        });
    })

    /**
     * 弹出新增页面
     *
     */
    function addPage(){

        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/home/resetPasswordLayer',
            pageLoading : true,
            title : "修改密码",
            width : "630px",
            height : "292px",
            btn:["修改","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.resetPasswordLayer ;
                    flag = cm.updatePassword();
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
                username :$("#usernameSpan").text()
            },
            end:function(){
                if(flag){
                    var form =  $.util.getHiddenForm(context + "/show/page/web/index");
                    form.submit();
                }
            }
        });
    }


})(jQuery);