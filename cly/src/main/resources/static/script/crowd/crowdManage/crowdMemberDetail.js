$.crowdMemberDetail = $.crowdMemberDetail || {};

(function($){
    "use strict";
    var personClueTable = null;
    $(document).ready(function() {

        /**
         * 查询
         */
        $(document).on("click","#personClueQuery",function () {
            initClueTable();
        });

        $(document).on("click","#crowdPersons",function(){
            if(personClueTable == null){
                initItm();
            }
        });

        /**
         * 重置
         */
        $(document).on("click","#personClueReset",function () {

        });

    });

    $(document).on("select2:select","#personSiteOne, #persontSiteTwo",function(){
        var tsType = $("#personSiteOne").select2("val");
        var tsArea = $("#personSiteTwo").select2("val");
        $.select2.empty("#personSiteThree");
        if($.util.isBlank(tsType) || $.util.isBlank(tsType)){
            return;
        }
        $.ajax({
            url:context +'/clue/findTargetSiteByTypeAndArea',
            type:'post',
            data:{tsType : tsType,
                tsArea : tsArea},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#personSiteThree", true);
                $.select2.addByList("#personSiteThree", successData, "id", "name", true, true);
            }
        });
    });
    $(document).on("select2:unselect","#personSiteOne, #personSiteTwo",function(){
        $.select2.empty("#personSiteThree", true);
    });

    $(document).on("ifChecked","#customClue",function(){
        $("#clueCustomDate").show();
    });

    $(document).on("ifUnchecked","#customClue",function(){
        $("#clueCustomDate").hide();
    });

    function  createPersonClue(idNumber){
        $.ajax({
            url:context +'/crowdManage/findCluePageByIdcard',
            data:{idNumber : idNumber},
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(map){
                initPersonClueTable(map.clue);
            }
        });
    }

    /**
     * 初始化 指向地点 一级和二级
     */
    function initItm(){
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_ZXDDLX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#personSiteOne", successData, "id", "name", true, true);
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_ZXDDQY},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#personSiteTwo", successData, "id", "name", true, true);
            }
        });
    }


    function initClueTable(){
        if(personClueTable != null) {
            personClueTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/crowdManage/findPersonCluePageByClue";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "线索内容",
                "data" : "content",
                "render" : function(data, type, full, meta) {

                    return '<div title = "'+data+'"><a class="jumpToxs" id="'+full.id+'">'+data.substr(0,20)+'...</a></div>';
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "来源地",
                "data" : "sourceUnitTwoName",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "主责单位",
                "data" : "mainUnit",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "指向时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {

                    return $.date.timeToStr(data,"yyyy-MM-dd HH:mm:ss");
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSiteBeanList",
                "render" : function(data, type, full, meta) {
                    var info = "";
                    $.each(data,function(index, val){
                        info += val.typeName+","
                    })
                    return $.util.isBlank(info)?"":info.substr(0,info.length-1);
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "行为方式",
                "data" : "wayOfActTwoName",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "办理状态",
                "data" : "statusName",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            }


        ];
        //是否排序
        tb.ordering = false ;
        //是否分页
        tb.paging = true;
        //每页条数
        tb.lengthMenu = [ 10 ];
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = true ;
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var arr = $.icheck.getChecked("person");
            if($(arr[0]).val()=="自定义"){
                var startTime = $.laydate.getDate("#personDateRangeId","start") == null ? null : $.date.strToTime($.laydate.getDate("#dateRangeId","start")+" 00:00:00");
                var endTime = $.laydate.getDate("#personDateRangeId","end") == null ? null : $.date.strToTime($.laydate.getDate("#dateRangeId","end")+" 23:59:59");
                var obj = {
                    "id":crowdNameCode,
                    "type":$(arr[0]).val(),
                    "startTimeOneLong":startTime,
                    "startTimeTwoLong":endTime,
                    "targetSiteType": $.select2.val("#personSiteOne"),
                    "targetSiteArea": $.select2.val("#personSiteTwo"),
                    "targetSiteSite": $.select2.val("#personSiteThree"),
                    "content": $("#clueContent").val()
                };
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }else{
                var obj = {
                    "id":crowdNameCode,
                    "type":$(arr[0]).val(),
                    "targetSiteType": $.select2.val("#personSiteOne"),
                    "targetSiteArea": $.select2.val("#personSiteTwo"),
                    "targetSiteSite": $.select2.val("#personSiteThree"),
                    "content": $("#clueContent").val()
                };
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }
        };
        tb.paramsResp = function(json) {
            json.data = json.clue;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
        };
        personClueTable = $("#personClueTable").DataTable(tb);
    }

    /**
     * 获取查询条件
     *
     * @param d table开始和结束
     */
    function getQueryParam(d){
        var name  = $("#personName").val();
        if(name && name != "") {
            name = trim(name);
        }

        var idcard  = $("#idcard").val();
        if(idcard && idcard != "") {
            idcard = trim(idcard);
        }
        if(!$.util.isEmpty(crowdId)){
            d["crowdId"] = crowdId;
            d["flag"] = false;
        }else{
            d["crowdId"] = typeCode;
            d["flag"] = true;
        }
        d["name"] = name;
        d["idcard"] = idcard;
        d["province"] = $.select2.val("#province");
        if($(".advanced-query").is(":hidden")){
            d["phone"] = null;
            d["address"] = null;
            d["whetherBackbone"] = false;
        }else{
            d["phone"] = $("#phone").val();
            d["address"] = $("#address").val();
            d["whetherBackbone"] = $("#whetherBackbone").prop("checked");
        }
        return d;
    }

    function trim(str){
        return str.replace(/^\s+|\s+$/g,'');
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.crowdMemberDetail, {

    });
})(jQuery);