(function($){
    "use strict";

    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var noAttentionsCrowdZtree = null;

    // var isNotKeyAttentions;
    // var isKeyAttentions;
    $(document).ready(function() {
        initAttentionsAndNoAttentionsCrowd();
    });

    // $(document).on("input","#noData",function(){
    //     if($.util.isBlank($("#noData").val())){
    //         $("#no").empty();
    //         $.each(isNotKeyAttentions,function(i,v){
    //             $("#no").append('<p class="col-xs-3"><input type="checkbox" class="icheckbox" name="add" value='+v.code+'> '+v.name+'</p>');
    //         })
    //     }else{
    //         $("#no").empty();
    //         $.each(isNotKeyAttentions,function(i,val){
    //             if(val.name.toUpperCase().indexOf($("#noData").val().toUpperCase()) != -1){
    //                 $("#no").append('<p class="col-xs-3"><input type="checkbox" class="icheckbox" name="add" value='+val.code+'> '+val.name+'</p>');
    //             }
    //         })
    //     }
    // })
    //
    // $(document).on("input","#yesData",function(){
    //     if($.util.isBlank($("#yesData").val())){
    //         $("#yes").empty();
    //         $.each(isKeyAttentions,function(i,v){
    //             $("#yes").append('<p><input type="checkbox" class="icheckbox" name="cancel" value='+v.code+'> '+v.name+'</p>');
    //         })
    //     }else{
    //         $("#yes").empty();
    //         $.each(isKeyAttentions,function(i,val){
    //             if(val.name.toUpperCase().indexOf($("#yesData").val().toUpperCase()) != -1){
    //                 $("#yes").append('<p><input type="checkbox" class="icheckbox" name="cancel" value='+val.code+'> '+val.name+'</p>');
    //             }
    //         })
    //     }
    // })

    /**
     * 添加到重点关注群体
     */
    $(document).on("click","#addKeyAttention",function(){
        var arr = getCheckedValue() ;
        if(arr.length > 0) {
            var crowdIds = [];
            $.each(arr, function (i,val) {
                crowdIds.push(val);
            });
            var data = {"ids":crowdIds,"status":$.common.dict.SF_S};
            var obj = new Object();
            $.util.objToStrutsFormData(data, "cpp", obj);
            submitData(obj,context + "/crowdManage/addOrCancelKeyAttention");
        }else {
            $.util.topWindow().$.layerAlert.alert({msg:"请选择群体！"}) ;
            return false ;
        }
    })

    /**
     * 取消重点关注群体
     */
    $(document).on("click","#cancelKeyAttention",function(){
        var arr = $.icheck.getChecked("cancel") ;
        if(arr.length > 0) {
            var crowdIds = [];
            $.each(arr, function (i,val) {
                crowdIds.push(val.value);
            });
            var data = {"ids":crowdIds,"status":$.common.dict.SF_F};
            var obj = new Object();
            $.util.objToStrutsFormData(data, "cpp", obj);
            submitData(obj,context + "/crowdManage/deleteKeyAttention");
        }else {
            $.util.topWindow().$.layerAlert.alert({msg:"请选择群体！"}) ;
            return false ;
        }
    })

    function submitData(obj,url){
        $.ajax({
            url:url,
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                if(successData.status){
                    initAttentionsAndNoAttentionsCrowd(true);
                }else{
                    $.util.topWindow().$.layerAlert.alert({icon:6, closeBtn:false, msg:"操作失败。", yes:function(){
                        // $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗
                    }});
                }
            }
        });
    }

    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        check: {
            enable: true,
            chkStyle: "checkbox",
            radioType: "all",
            chkboxType: {"Y":"", "N":""}
        },
        callback: {

        }
    };

    /**
     * 初始化已关注和未关注群体列表
     *
     * @param flag 是否提示操作成功
     */
    function initAttentionsAndNoAttentionsCrowd(flag){
        $.util.topWindow().$.common.showOrHideLoading(true);
        $("#noAttentionsCrowdZtree").html("");
        $("#attentionsCrowdUl").html("");
        $.when(
            $.ajax({
                url:context + "/crowdManage/findNoAttentionsCrowdZtree",
                type:"post",
                dataType:"json",
                customizedOpt:{
                    ajaxLoading:false,//设置是否loading
                },
                success:function(successData){
                    noAttentionsCrowdZtree = $.fn.zTree.init($("#noAttentionsCrowdZtree"), setting, successData.ztbs);
                }
            }),
            $.ajax({
                url:context + "/crowdManage/findAttentionsCrowdZtree",
                type:"post",
                dataType:"json",
                customizedOpt:{
                    ajaxLoading:false,//设置是否loading
                },
                success:function(successData){
                    var kacps = successData.kacps;
                    $.each(kacps, function(i,val){
                        var li = '<li style="margin-bottom: 5px;"><p><input type="checkbox" class="icheckbox" name="cancel" value="' + val.code + '"><span style="margin-left: 5px;">' + val.name + '</span></p></li>';
                        $("#attentionsCrowdUl").append(li);
                    });
                }
            })
        ).done(function(){
            $.util.topWindow().$.common.showOrHideLoading(false);
            if(flag){
                $.util.topWindow().$.layerAlert.alert({icon:6, closeBtn:false, msg:"操作成功。", yes:function(){
                    // $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗
                }});
            }
        });
    }

    /**
     * 获取树选择的值
     *
     * @param bindedDomIdOrZtreeId
     * @returns
     */
    function getCheckedValue(){
        var nodes = noAttentionsCrowdZtree.getCheckedNodes() ;
        var codes = [] ;
        $(nodes).each(function(i ,val){
            codes.push(val.id);
        });
        return codes ;
    }

})(jQuery);