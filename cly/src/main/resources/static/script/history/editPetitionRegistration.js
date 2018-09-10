$.editPetitionRegistrationLayer = $.editPetitionRegistrationLayer || {};
(function($){
    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var id = initData.id;

    $(document).ready(function(){
        init();

        $(document).on("change" , "#fixed_start", function(e){
            var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
            var date = new Date(startDate);
            var xingqi = date.getDay();
            switch(xingqi){
                case(1):$("#week").select2("val","xx0001")
                    break;
                case(2):$("#week").select2("val","xx0002")
                    break;
                case(3):$("#week").select2("val","xx0003")
                    break;
                case(4):$("#week").select2("val","xx0004")
                    break;
                case(5):$("#week").select2("val","xx0005")
                    break;
                case(6):$("#week").select2("val","xx0006")
                    break;
                case(0):$("#week").select2("val","xx0007")
                    break;
            }
        });
        $(document).on("select2:select","#crowdType",function(){
            selectCrowdType();
        })

        $(document).on("click","#addCrowd",function(){
            alertCrowdEditPage();
        });
    });

    /**
     * 弹出修改页面
     *
     * @param crowdId 群体id
     */
    function alertCrowdEditPage(crowdId){
        var title = "修改群体信息";
        if($.util.isBlank(crowdId)){
            title = "新建群体";
        }

        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/crowd/addCrowdInfoLayer',
            pageLoading : true,
            title : title,
            width : "608px",
            height : "535px",
            btn:["保存","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.addCrowdInfoLayer ;
                    cm.saveCrowd();
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
                crowdId : crowdId
            },
            end:function(){
                var str = $.select2.val("#involveCrowdOne");
                if(!$.util.isBlank(str)){
                    $.ajax({
                        url:context +'/dictionary/findDictionaryItemsByParentId',
                        type:'post',
                        data:{parentId : str},
                        dataType:'json',
                        success:function(successData){
                            $.select2.empty("#involveCrowdTwo", true);
                            $.select2.addByList("#involveCrowdTwo", successData, "id", "name", true, true);
                        }
                    });
                }
            }
        });
    }

    function selectCrowdType(){
        var code = $.select2.val("#crowdType");
        $.ajax({
            url: context + '/personManage/findDictionaryItemsByParentId',
            data: {parentId: code},
            type: "post",
            success: function (successData) {
                var list = successData.simplePojos;
                $.select2.empty("#crowdName", true);
                $.select2.addByList("#crowdName", list, "code", "name", true, true);
            }
        });
    }


    function editPetitionRegistration(){
        var demo = $.validform.getValidFormObjById("validformPersonType") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }

        var petitionRegistration = getPetitionRegistration();
        var obj = new Object();
        $.util.objToStrutsFormData(petitionRegistration, "petitionRegistersPojo", obj);
        window.top.$.common.showOrHideLoading(true);
        $.ajax({
            url:context + '/petitionRegisterManage/updatePetitionRegistration',
            type:"post",
            data:obj,
            success:function(successData){
                window.top.$.common.showOrHideLoading(false);
                if(successData){
                    $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示",end : function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex);
                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"修改失败!",title:"提示"});
                }
            },
            error:function(){
                window.top.$.common.showOrHideLoading(false);
            }
        })

    }

    function getPetitionRegistration(){

        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        var petitionDateLong = null;
        if(startDate){
            petitionDateLong = new Date(startDate).getTime();
        }else{
            petitionDateLong = startDate;
        }
        var position = null;
        if( !$.select2.text("#position") || $.select2.text("#position").length <= 0){
            position =  $(".select2-search__field").val();
        }else{
            position = $.select2.text("#position")[0];
        }

        var petitionRegistration = {
            id:id,
            sourceAddress: $("#sourceAddress").val(),
            crowdType: $.select2.val("#crowdType"),
            crowdId: $.select2.val("#crowdName"),
            nature: $.select2.val("#nature"),
            position: position,
            week: $.select2.val("#week"),
            scale:$("#scale").val(),
            thisCity:$("#thisCity").val(),
            petitionDateLong:petitionDateLong,
            highlightSituation:$("#highlightSituation").val(),
            representativePerson:$("#representativePerson").val(),
            particularSituation:$("#particularSituation").val(),
            backgroundSituation:$("#backgroundSituation").val()
        };
        return petitionRegistration;
    }



    function init(){
        $.ajax({
            url:context + '/petitionRegisterManage/findPetitionRegistrationById',
            data:{id:id},
            type:"post",
            dataType:"json",
            success:function(dictionaryPojo){
                initDictionary(dictionaryPojo);
                initPetitionRegistersData(dictionaryPojo.petitionRegisters);
                $.select2.able("#week",false);
            }
        })
    }

    function initDictionary(dictionaryPojo){
        $.select2.addByList("#crowdType",dictionaryPojo.crowdType,"id","name",true,true);
        $.select2.addByList("#crowdName",dictionaryPojo.crowdName,"id","name",true,true);
        $.select2.addByList("#nature",dictionaryPojo.nature,"id","name",true,true);
        $.select2.addByList("#week",dictionaryPojo.week,"id","name",true,true);
        $.select2.addByList("#position",dictionaryPojo.position,"id","name",true,true);

        window.setTimeout(function(){
            if(dictionaryPojo.petitionRegisters.crowdType){
                $("#crowdType").select2("val",dictionaryPojo.petitionRegisters.crowdType)
            }
            if(dictionaryPojo.petitionRegisters.crowdName){
                $("#crowdName").select2("val",dictionaryPojo.petitionRegisters.crowdName)
            }
            if(dictionaryPojo.petitionRegisters.nature){
                $("#nature").select2("val",dictionaryPojo.petitionRegisters.nature)
            }
            if(dictionaryPojo.petitionRegisters.week){
                $("#week").select2("val",dictionaryPojo.petitionRegisters.week)
            }
            $(".select2-search__field").val(dictionaryPojo.petitionRegisters.position)
        },300);
    }

    function initPetitionRegistersData(pojo){
        $("#sourceAddress").val(pojo.sourceAddress);
        $("#fixed_start").val(pojo.petitionDateStr);
        $("#scale").val(pojo.scale);
        $("#thisCity").val(pojo.thisCity);
        $("#highlightSituation").val(pojo.highlightSituation);
        $("#representativePerson").val(pojo.representativePerson);
        $("#particularSituation").val(pojo.particularSituation);
        $("#backgroundSituation").val(pojo.backgroundSituation);
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.editPetitionRegistrationLayer, {
        editPetitionRegistration : editPetitionRegistration
    });


})(jQuery);