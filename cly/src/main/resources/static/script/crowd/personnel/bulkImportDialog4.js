$.personnelBulkImportDialog4 = $.personnelBulkImportDialog4 || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData
    var data=initData.data;//
    var right=data.rightCount;
    var sourceFileId=data.sourceFileId;
    var  redayCount=0;

    $(document).ready(function() {
        initDate();
        $(document).on("click" , "#escBtn", function(e){
            $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
        });
    });

    var i = setInterval(function() {
        $.ajax({ //不断请求后台获取数据
            url:context + '/crowd/findCrowdPersonFinishCount',
            data:{sourceFileId:sourceFileId},
            type:"post",
            dataType:"json",
            success:function(data){
                redayCount=data.count;
                // $('#selCountBtn').append(parseInt(redayCount)-parseInt(oldcount));
                // oldcount=redayCount;
            }
        })
        initDate()
    }, 1000);


    /**
     * 初始化下载页面的id
     */
    function initDate(){
        if(redayCount==null||redayCount=='null'||redayCount>right){
            $('#redayCountBtn').text(0);
        }else{
            $('#redayCountBtn').text(redayCount);
        }
        $('#selCountBtn').text("/"+right+"条");
        if(redayCount==right){
            window.clearInterval(i);//清除定时
            $.util.topWindow().$.layerAlert.dialog({//完成界面
                content : context + "/show/page/web/personnel/bulkImportDialog5",
                pageLoading : true,
                title : '导入完成',
                width : "400px",
                height : "300px",
                btn:["查看日志","确定"],
                callBacks:{
                    btn1:function(index, layero){
                        if(sourceFileId){
                            $.ajax({ //不断请求后台获取数据
                                url:context + '/crowd/findsuccessAndErrorCount',
                                data:{sourceFileId:sourceFileId},
                                type:"post",
                                dataType:"json",
                                success:function(data){
                                    var errFileId=data.errFileId;
                                    // window.open(context+"/crowd/downloadAttachment/"+errFileId) ;
                                    window.open(context+"/crowd/downloadAttachment?metaId="+errFileId) ;
                                }
                            })

                        }
                    },
                    btn2:function(index, layero){
                        $.util.topWindow().$.layerAlert.closeAll();
                    }


                },
                success:function(layero, index){

                },
                initData:{
                    sourceFileId:sourceFileId,
                },
                end:function(){

                }
            });
            // $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
        }
    }

})(jQuery);