$.alarmRule = $.alarmRule || {} ;
(function($){

    "use strict";
     var table = null;

    $(document).ready(function() {
        initPageDict();
        initDataTable();

    });

    /**
     * 查询数据
     */
    $(document).on("click","#query",function(){
        table.draw();
    });
    /**
     * 重置查询条件
     */
    $(document).on("click","#reset",function(){
         $.select2.val("#crowds","");
         $("#ruleName").val("");
          table.draw();
    });
    /**
     * 新建规则
     */

    $(document).on("click","#createAlarmRule",function(){
        var ruleId = "";
        createAlarmRulePage(ruleId);
    });
    /**
     * 删除规则
     */
    $(document).on("click","#deleteAlarmRule",function(){
        var arr = $.icheck.getChecked("signTr") ;
        if(arr.length > 0) {
            var ruleIds = [];
            $.each(arr, function (i,val) {
                var tr = $(val).parents("tr");
                var row = table.row(tr);
                var data = row.data();
                ruleIds.push(data.id);
            });
            deleteRuleByIds(ruleIds);
        }else {
            $.layerAlert.alert({msg:"请选择一个具体规则！"}) ;
            return false ;
        }
    });
    /**
     * 更新规则
     */
    $(document).on("click","#updateAlarmRule",function(){
        var arr = $.icheck.getChecked("signTr") ;
        var ruleId = "";
        if(arr.length == 1) {
            var tr = $(arr[0]).parents("tr");
            var row = table.row(tr);
            var data = row.data();
            ruleId = data.id;
        }else  {
            $.layerAlert.alert({msg:"请选择一个具体规则！"}) ;
            return false ;
        }
        createAlarmRulePage(ruleId);
    });
    /**
     * 启用规则
     */
    $(document).on("click","#startAlarmRule",function(){
        var arr = $.icheck.getChecked("signTr") ;
        var ruleIds = [];
        if(arr.length > 0) {
            $.each(arr, function (i,val) {
                var tr = $(val).parents("tr");
                var row = table.row(tr);
                var data = row.data();
                ruleIds.push(data.id);
            });
        }else {
            $.layerAlert.alert({msg:"请选择一个具体规则！"}) ;
            return false ;
        }
        var cpp = {
            "ids" : ruleIds
        };
        var obj = {};
        $.util.objToStrutsFormData(cpp, "arp", obj);
        $.ajax({
            url:context +'/alarmController/startAlarmRuleStatus',
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                if(successData.status){
                    $.util.topWindow().$.layerAlert.alert({icon:6, msg:"启用成功。"}) ;
                    table.draw();
                }else{
                    $.util.topWindow().$.layerAlert.alert({icon:5, msg:"启用失败。"}) ;
                }
            }
        });
    });
    /**
     * 停用规则
     */
    $(document).on("click","#stopAlarmRule",function(){
        var arr = $.icheck.getChecked("signTr") ;
        var ruleIds = [];
        if(arr.length > 0) {
            $.each(arr, function (i,val) {
                var tr = $(val).parents("tr");
                var row = table.row(tr);
                var data = row.data();
                ruleIds.push(data.id);
            });
        }else {
            $.layerAlert.alert({msg:"请选择一个具体规则！"}) ;
            return false ;
        }
        var cpp = {
            "ids" : ruleIds
        };
        var obj = {};
        $.util.objToStrutsFormData(cpp, "arp", obj);
        $.ajax({
            url:context +'/alarmController/stopAlarmRuleStatus',
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                if(successData.status){
                    $.util.topWindow().$.layerAlert.alert({icon:6, msg:"停用成功。"}) ;
                    table.draw(true);
                }else{
                    $.util.topWindow().$.layerAlert.alert({icon:5, msg:"停用失败。"}) ;
                }
            }
        });
    });

    /**
     * 初始化页面字典项
     */
    function initPageDict() {
        $.ajax({
            url:context +'/alarmController/initPageDictionary',
            data:{},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                $.select2.addByList("#crowds", successData.crowds,"id","name",true,true);
            }
        });
    }

    function initDataTable(){
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/alarmController/queryAlarmRule";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "50px",
                "title": "选择",
                "className":"table-checkbox",
                "data": "id" ,
                "render": function ( data, type, full, meta ) {
                    var a = '<input type="checkbox" name="signTr" class="icheckbox"  />' ;
                    return a;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "序号",
                "data" : "id",
                "render" : function(data, type, full, meta) {

                    return meta.row+1;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "规则名称",
                "data" : "name",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "适用群体",
                "data" : "crowdName",
                "render" : function(data, type, full, meta) {
                    return  data;
                    // return  "<a cclass='xiaoshou aa' href='javascript:void(0);'>"+data+"</a>";
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "规则内容",
                "data" : "ruleExpressions",
                "render" : function(data, type, full, meta) {
                     var rule = JSON.parse(data);
                     var content =  "";
                     if(rule.ruleType == "百分比规则" && rule.timeType == "按时"){
                         content = "群体每"+rule.precentAndHour_hours+"小时轨迹数量超过"
                             +rule.precentAndHour_meanHour +"小时均值"
                             +rule.precentAndHour_persent+"%";

                     }else if(rule.ruleType == "百分比规则" && rule.timeType == "按日"){
                         content = "群体每"+ rule.precentAndDay_dayNum
                             +"天轨迹数量超过"+rule.precentAndDay_dayMeanValue+"日均值"
                             +rule.precentAndDay_percentCount+"%";

                     }else if(rule.ruleType == "值规则" && rule.timeType == "按日"){
                         content = "群体每"+rule.valueAndDay_dayNum
                             +"天轨迹数量超过"+rule.valueAndDay_personNum +"人";
                     }else if(rule.ruleType == "值规则" && rule.timeType == "按时"){
                         content = "群体每"+rule.valueAndHour_hours
                             +"小时轨迹数量超过"+rule.valueAndHour_personNum+"人";
                     }
                      return content;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "状态",
                "data" : "status",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            }

        ];
        //是否排序
        tb.ordering = false ;
        //是否分页
        tb.paging = false;

        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        tb.dom="";
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var crowdCode = $.select2.val("#crowds");
            var ruleName = $("#ruleName").val();
            var obj = {
                crowdCode : crowdCode,
                name : ruleName
            };
            $.util.objToStrutsFormData(obj, "arp", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.rules;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
        };
        table = $("#ruleTable").DataTable(tb);
    }

    /**
     * 新建规则
     * @param ruleId
     */
    function createAlarmRulePage (ruleId){
            var title = "修改预警规则";
            if($.util.isBlank(ruleId)){
                title = "新建预警规则";
            }

            $.util.topWindow().$.layerAlert.dialog({
                content : context + '/show/page/web/trend/newWarningRuleLayer',
                pageLoading : true,
                title : title,
                width : "800px",
                height : "680px",
                btn:["保存","取消"],
                callBacks:{
                    btn1:function(index, layero){
                        var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.addAlarmRule ;
                        cm.saveRule();
                        table.draw(true);
                    },
                    btn2:function(index, layero){
                        $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                    }
                },
                shadeClose : false,
                success:function(layero, index){

                },
                initData:{
                    ruleId : ruleId
                },
                end:function(){

                }
            });

    }
    /**
     * 根据id删除预警规则
     *
     * @param ids id数组
     */
    function deleteRuleByIds(ids){
        if(!$.util.exist(ids) || ids.length < 1){
            return ;
        }
        $.util.topWindow().$.layerAlert.confirm({
            msg:"删除后不可恢复，确定要删除吗？",
            title:"删除",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            shift:1,  //弹出时的动画效果  有0-6种
            yes:function(index, layero){
                //点击确定按钮后执行
                var cpp = {
                    "ids" : ids
                };
                var obj = {};
                $.util.objToStrutsFormData(cpp, "arp", obj);
                $.ajax({
                    url:context + '/alarmController/deleteAlarmRules',
                    data:obj,
                    type:"post",
                    dataType:"json",
                    customizedOpt:{
                        ajaxLoading:true,//设置是否loading
                    },
                    success:function(successData){
                        if(successData.status){
                            $.util.topWindow().$.layerAlert.alert({icon:6, msg:"删除成功。"}) ;
                            table.draw();
                        }else{
                            $.util.topWindow().$.layerAlert.alert({icon:5, msg:"删除失败。"}) ;
                        }
                    }
                });
            }
        });
    }


    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.ruleDetail, {
        getruleId : function(){
            return ruleId;
        }
    });
})(jQuery);
