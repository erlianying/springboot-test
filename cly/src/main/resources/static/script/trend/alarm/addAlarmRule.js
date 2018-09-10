$.addAlarmRule = $.addAlarmRule || {};
(function($){

    "use strict";
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var ruleId = initData.ruleId;

    $(document).ready(function() {

        initPageData();
        displayRule();
        /**
         * 群体类型选择事件
         */
        $(document).on("select2:select","#qtlx",function () {
            var typeId = $.select2.val("#qtlx");
            findCrowdByParentId(typeId);
        });
        /**
         * 全选轨迹类型
         */
        $(document).on("click","#qtlx",function () {
            var typeId = $.select2.val("#qtlx");
            findCrowdByParentId(typeId);
        });

        /**
         * 轨迹类型进京全选按钮
         */
        $(document).on("ifChecked","#traceDetailAll",function () {
            $.icheck.selectCheck("enterBeijingTraceTypeDetail") ;
        });
        /**
         * 轨迹类型进京取消全选按钮
         */
        $(document).on("ifUnchecked","#traceDetailAll",function () {
            $.icheck.unSelectCheck("enterBeijingTraceTypeDetail");
        });
        /**
         * 轨迹类型在京全选按钮
         */
        $(document).on("ifChecked","#inBeiJingtraceDetailAll",function () {
            $.icheck.selectCheck("inBeiJingTraceTypeDetail") ;
        });
        /**
         * 轨迹类型在京取消全选按钮
         */
        $(document).on("ifUnchecked","#inBeiJingtraceDetailAll",function () {
            $.icheck.unSelectCheck("inBeiJingTraceTypeDetail");
        });
        /**
         * 进京单选按钮触发
         */
        $(document).on("ifClicked","#enterBeiJingRadio",function(){
             $("#inBeiJing").hide();
             $("#enterBeiJing").show();
        });
        /**
         * 在京单选按钮触发
         */
        $(document).on("ifClicked","#inBeiJingRadio",function(){
            $("#enterBeiJing").hide();
            $("#inBeiJing").show();
        });

        /**
         * 百分比单选按钮触发
         */
        $(document).on("ifChecked","#ruleTypeBFB,#ruleTypeZGZ,#timeTypeDay,#timeTypeHour",function(){
            displayRule();
        });
        initDicCode();

        if(!$.util.isBlank(ruleId)){
            findAlarmRuleById(ruleId);
        }
    });
    function findAlarmRuleById(ruleId) {
        var data = {
            "ruleId" : $.util.isBlank(ruleId)?"":ruleId
        };
        $.ajax({
            url:context +'/alarmController/findAlarmRuleById',
            data:data,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                var alarmRule = successData.alarmRulePojo;
                setAlarmRulePage(alarmRule);
            }
        });
    }
    function setAlarmRulePage(alarmRule){
         $("#ruleName").val(alarmRule.name);
         $.select2.addByList("#qt",alarmRule.alarmCrowdPojoList,"id","name",true,false);
         $.select2.val("#qtlx",alarmRule.crowdTypeCodes);
         $.select2.val("#qt",alarmRule.crowdCodes);
         var jsonObject = JSON.parse(alarmRule.ruleExpressions);
         if(jsonObject.traceType == "在京"){
             $("#inBeiJingRadio").iCheck('check');
            var inBeij = jsonObject.inBeiJingTraceTypeDetail;
             $('input[name="inBeiJingTraceTypeDetail"]').each(function(i,val){
                     var cur = $(this).val();
                     var  index  = cur.indexOf(inBeij);
                     if( inBeij.indexOf(cur) >= 0){
                         $(this).iCheck('check');
                     }
             });
             $("#inBeiJing").show();
             $("#enterBeiJing").hide();
         }else{
             $("#enterBeiJingRadio").iCheck('check');
             var enterBj = jsonObject.enterBeijingTraceTypeDetail;
             $("input[name='enterBeijingTraceTypeDetail']").each(function(i,val){
                 var cur = $(this).val();
                 if(enterBj.indexOf(cur) >= 0){
                     $(this).iCheck('check');
                 }
             });
             $("#enterBeiJing").show();
             $("#inBeiJing").hide();
         }
        $("input[name='ruleType']").each(function(i,val){
            var cur = $(this).val();
            if(cur.indexOf(jsonObject.ruleType) >= 0){
                $(this).iCheck('check');
            }
        });
        $("input[name='timeType']").each(function(i,val){
            var cur = $(this).val();
            if(cur.indexOf(jsonObject.timeType) >= 0){
                $(this).iCheck('check');
            }
        });
        var zgz = $("#ruleTypeZGZ").is(':checked');
        var bfb = $("#ruleTypeBFB").is(':checked');
        var day = $("#timeTypeDay").is(':checked');
        var hour = $("#timeTypeHour").is(':checked');
        if( zgz && day){
               $("#valueAndDay_dayNum").val(jsonObject.valueAndDay_dayNum);
               $("#valueAndDay_personNum").val(jsonObject.valueAndDay_personNum);

        }else if(zgz && hour){
             $("#valueAndHour_hours").val(jsonObject.valueAndHour_hours);
             $("#valueAndHour_personNum").val(jsonObject.valueAndHour_personNum);
        }else if(bfb && day){
            $("#precentAndDay_dayNum").val(jsonObject.precentAndDay_dayNum);
            $("#precentAndDay_dayMeanValue").val(jsonObject.precentAndDay_dayMeanValue);
            $("#precentAndDay_percentCount").val(jsonObject.precentAndDay_percentCount );
        }else if(bfb && hour){
            $("#precentAndHour_hours").val(jsonObject.precentAndHour_hours);
            $("#precentAndHour_meanHour").val(jsonObject.precentAndHour_meanHour );
            $("#precentAndHour_persent").val(jsonObject.precentAndHour_persent);
        }
        $.select2.val("#ruleColors",alarmRule.ruleColor);
        $("#ruleInfo").val(alarmRule.intro);
    }
    /**
     * 初始化单选框状态
     */
    function initPageData(){
        $('#enterBeiJingRadio').iCheck('check');
        $('#ruleTypeBFB').iCheck('check');
        $('#timeTypeDay').iCheck('check');
    }

    /**
     * 保存规则
     */
    function saveRule() {
        if(!verification()){
            return ;
        }
        var ruleObj = getRuleObj();
        var url = context + "/alarmController";
        var msg = "";
        if($.util.isBlank(ruleId)){
            url += "/saveAlarmRule";
            msg = "保存";
        }else{
            url += "/updateAlarmRule";
            msg = "修改";
        }
        var obj = new Object();
        $.util.objToStrutsFormData(ruleObj, "arp", obj);
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
                    $.util.topWindow().$.layerAlert.alert({icon:6, closeBtn:false, msg:msg + "成功。", yes:function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗

                    }});
                }else{
                    $.util.topWindow().$.layerAlert.alert({icon:6, closeBtn:false, msg:msg + "失败。", yes:function(){
                        $.util.topWindow().$.layerAlert.closeWithLoading(pageIndex); //关闭弹窗
                    }});
                }
            }
        });

    }
    /**
     * 表单验证
     */
    function verification(ruleName) {
        if($.util.isBlank($.select2.val("#qt"))){
            $.layerAlert.tips({
                msg:'请选择群体适用群体。',
                selector:"#type",  //需要弹出层的元素选择器
                color:'#F66646',
                position:1,
                closeBtn:2,
                time:2000,
                shift:1
            });
            return false;
        }
        if($.util.isBlank($.icheck.val("inBeiJingTraceTypeDetail"))
            && $.util.isBlank($.icheck.val("enterBeijingTraceTypeDetail"))){
            $.layerAlert.tips({
                msg:'请选择轨迹类型。',
                selector:"#name",  //需要弹出层的元素选择器
                color:'#f66646',
                position:1,
                closeBtn:2,
                time:2000,
                shift:1
            });
            return false;
        }
        var demo = $.validform.getValidFormObjById("validformSituation") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }
        $.ajax({
            url:context +'/alarmController/verificaRuleName',
            data:{"name":ruleName},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                if(! successData.result){
                    $.layerAlert.tips({
                        msg:'名称重复',
                        selector:"#name",  //需要弹出层的元素选择器
                        color:'#f66646',
                        position:1,
                        closeBtn:2,
                        time:2000,
                        shift:1
                    });
                }

            }
        });

        return true;
    }
    /**
     * 群体类型选中事件
     */
    $("#qtlx").on("select2:close", function(e) {
        var arr = {"crowdTypes":$.select2.val("#qtlx")};
        if(arr.crowdTypes != null){
            var obj = new Object();
            $.util.objToStrutsFormData(arr, "crowdQueryPojo", obj);
            $.ajax({
                url: context +"/crowdManage/queryCrowdNames",
                type: "POST",
                global: false,
                data: obj,
                success: function (data) {
                    $.select2.empty("#qt");
                    $.select2.addByList("#qt", data.crowdNames,"id", "name");
                }
            });
        }else{
            $.select2.empty("#qt");
        }
    });
    /**
     * 根据选中类型不同，显示不同的规则
     */
    function displayRule(){
      var zgz = $("#ruleTypeZGZ").is(':checked');
      var bfb = $("#ruleTypeBFB").is(':checked');
      var day = $("#timeTypeDay").is(':checked');
      var hour = $("#timeTypeHour").is(':checked');
      $(".ruleDetail").hide();
      if( zgz && day){
          $("#valueAndDay").show();

      }else if(zgz && hour){
          $("#valueAndHour").show();
      }else if(bfb && day){
          $("#precentAndDay").show();
      }else if(bfb && hour){
          $("#precentAndHour").show();
      }
    }

    function initDicCode(){
        $.ajax({
            url:context +'/alarmController/initAddAlarmRulePageDic',
            data:{},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                $.select2.addByList("#qtlx", successData.crowds,"id","name",true,false);
                $.select2.addByList("#ruleColors", successData.ruleColors,"id","name",true,false);

            }
        });
    }
    //根据一级群体字典项code查找二级群体
  function findCrowdByParentId(crowdId){
      $.ajax({
          url:context +'/alarmController/findCrowdByParentId',
          data:{ "crowdId" : crowdId},
          type:"post",
          dataType:"json",
          customizedOpt:{
              ajaxLoading:true,//设置是否loading
          },
          success:function(successData){
              $.select2.addByList("#qt", successData.crowds,"id","name",true,false);
          }
      });
  }

    /**
     * 获取页面表单数据组成预警规则
     *
     * @returns {Object} 群体对象
     */
    function getRuleObj(){
        var zgz = $("#ruleTypeZGZ").is(':checked');
        var bfb = $("#ruleTypeBFB").is(':checked');
        var day = $("#timeTypeDay").is(':checked');
        var hour = $("#timeTypeHour").is(':checked');
        var obj = new Object();
        var jsonObject = new Object();
        obj.id = ruleId;
        obj.name= $("#ruleName").val();
        obj.crowdCodes = $.select2.val("#qt");
        jsonObject.traceType = $.icheck.val("traceType") ;
        if(jsonObject.traceType == "在京"){
            jsonObject.inBeiJingTraceTypeDetail =  $.icheck.val("inBeiJingTraceTypeDetail") ;
        }else{
            jsonObject.enterBeijingTraceTypeDetail =  $.icheck.val("enterBeijingTraceTypeDetail") ;
        }
        jsonObject.ruleType = $.icheck.val("ruleType") ;
        jsonObject.timeType = $.icheck.val("timeType") ;
        if( zgz && day){
            jsonObject.valueAndDay_dayNum = $("#valueAndDay_dayNum").val();
            jsonObject.valueAndDay_personNum = $("#valueAndDay_personNum").val();

        }else if(zgz && hour){
            jsonObject.valueAndHour_hours = $("#valueAndHour_hours").val();
            jsonObject.valueAndHour_personNum = $("#valueAndHour_personNum").val();
        }else if(bfb && day){
            jsonObject.precentAndDay_dayNum = $("#precentAndDay_dayNum").val();
            jsonObject.precentAndDay_dayMeanValue = $("#precentAndDay_dayMeanValue").val();
            jsonObject.precentAndDay_percentCount = $("#precentAndDay_percentCount").val();
        }else if(bfb && hour){
            jsonObject.precentAndHour_hours = $("#precentAndHour_hours").val();
            jsonObject.precentAndHour_meanHour = $("#precentAndHour_meanHour").val();
            jsonObject.precentAndHour_persent = $("#precentAndHour_persent").val();
        }

        obj.ruleColor = $.select2.val("#ruleColors");
        obj.intro =  $("#ruleInfo").val();
        obj.ruleExpressions =  JSON.stringify(jsonObject);
        return obj;
    }
    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.addAlarmRule, {
        saveRule:saveRule
    });
})(jQuery);
