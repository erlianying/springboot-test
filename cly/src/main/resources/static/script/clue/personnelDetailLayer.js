(function($){
    "use strict";
    var clueId = "";
    var crowdId = "";
    $(document).ready(function() {
        var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
        var id = frameData.initData.id;
        events();
        $.ajax({
            url:context +'/clue/queryRelevantPersonById',
            type:'post',
            data:{id : id},
            dataType:'json',
            success:function(bean){
                $("#name").text(bean.name);
                $("#levelName").text(bean.levelName);
                if(bean.underControl == $.common.dict.SF_S){
                    $("#underControl").text("稳控");
                }else{
                    $("#underControl").text("未稳控");
                }
                if(parseInt(bean.identityNumber.substr(16,1),10)%2 == 0){
                    $("#sex").text("女");
                }else{
                    $("#sex").text("男");
                }
                var yearNow = (new Date()).getFullYear();
                var year = parseInt(bean.identityNumber.substr(6,4),10);
                var age = yearNow - year;
                var monthNow = (new Date()).getMonth()+1;
                var month = parseInt(bean.identityNumber.substr(10,2),10);
                if(monthNow > month){
                    $("#age").text(age);
                }else if(monthNow == month) {
                    var dateNow = (new Date()).getDate();
                    var date = parseInt(bean.identityNumber.substr(12,2),10);
                    if(dateNow >= date){
                        $("#age").text(age);
                    }else{
                        $("#age").text(age - 1);
                    }
                }else{
                    $("#age").text(age - 1);
                }
                $("#identityNumber").text(bean.identityNumber);
                $("#cellphoneNumber").text(bean.cellphoneNumber);
                $("#placeOfDomicile").text(bean.placeOfDomicile == null?"":bean.placeOfDomicile);
                $("#residentialPass").text(bean.residentialPass == null?"":bean.residentialPass);
                $("#hrskPersonType").text(bean.hrskPersonType == null?"":bean.hrskPersonType);
                $("#criminalRecord").text(bean.criminalRecord == null?"":bean.criminalRecord);
                $("#lastRecord").text(bean.lastRecord);
                if(bean.internetIdentityList != null && bean.internetIdentityList.length>0){
                    for(var i = 0; i< bean.internetIdentityList.length; i++){
                        var obj = bean.internetIdentityList[i];
                        var picClass = "";
                        if(obj.networkIDType == $.common.dict.WLIDRLX_WX){
                            picClass = "fa-wechat color-green";
                        }else if(obj.networkIDType == $.common.dict.WLIDRLX_QQ){
                            picClass = "fa-qq color-blue";
                        }else if(obj.networkIDType == $.common.dict.WLIDRLX_QT){
                            picClass = "fa-commenting-o";
                        }else{
                            continue;
                        }
                        var str = '<div class="row row-mar3">'+
                            '<div class="col-xs-1 text-center">'+
                            '<span class="fa ' + picClass + '"></span>'+
                            '</div>'+
                            '<div class="col-xs-2"><p class="control-p">' + obj.networkIDTypeName + '：</p></div>'+
                            '<div class="col-xs-3">' + obj.networkID + '</div>'+
                            '<div class="col-xs-2"><p class="control-p">名称：</p></div>'+
                            '<div class="col-xs-3">' + obj.networkName + '</div>'+
                            '</div>';
                        $(".internetIdentityList").append(str);
                    }
                }
                if(!$.util.isBlank(bean.clueIdLst)){
                    clueId = bean.clueIdLst;
                    var arr = bean.clueIdLst.split(",");
                    $("#clueIdLst").text(arr.length + "条");
                }else{
                    $("#clueIdLst").text("无");
                }
                $("#crowdIdLst").text(bean.crowdIdLst);
            }
        });
    });
    function events(){
        $(document).on("click","#clueIdLst",function(){
            $.util.topWindow().$.layerAlert.dialog({
                content : context + "/show/page/web/clue/myClueLayer",
                pageLoading : true,
                title : '线索列表',
                width : "1300px",
                height : "600px",
                btn:["返回"],
                callBacks:{
                    btn1:function(index, layero){
                        $.util.topWindow().$.layerAlert.closeAll();
                    },
                },
                success:function(layero, index){

                },
                initData:{
                    p$ : $,
                    showIdList:clueId
                },
                end:function(){

                }
            });
        });
        // 不可点击了
        // $(document).on("click","#crowdIdLst",function(){
        //     var form = window.top.$.util.getHiddenForm(context + "/show/page/web/crowd/crowdManage", {crowdIds:crowdId});
        //     form.submit();
        // });
    }

    jQuery.extend($.common, {

    });
})(jQuery);