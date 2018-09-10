(function($){
    "use strict";
    var undefinedStartTimeInitStatus = false;
    var involveCrowdInitStatus = false;
    var sourceUnitInitStatus = false;
    var targetSiteInitStatus = false;
    var wayOfActInitStatus = false;
    var statusInitStatus = false;
    var clueTypeInitStatus = false;
    var sourceInitStatus = false;
    var levelInitStatus = false;
    var sensitiveInfoInitStatus = false;
    var happenedAndSeverityBehaviourInitStatus = false;

    $(document).ready(function() {
        events();
        initData();
        queryPartOne();
    });

    function events(){
        $(document).on("click",".historyQuery",function(){
            queryPartTwo();
        });
        $(document).on("click",".fixed_nine",function() {
            if($.util.isBlank($(this).val())){
                $("#laydate-hour").find("input").val("09");
            }
        });
        $(document).on("focus",".fixed_nine",function() {
            var obj = this;
            setTimeout(function(){
                if($.util.isBlank($(obj).val())){
                    $("#laydate-hour").find("input").val("09");
                }
            },200)
        });
        $(document).on("select2:select","#sourceUnitOne",function(){
            $.ajax({
                url:context +'/clue/findSourceUnit',
                type:'post',
                data:{groupType : $.select2.val("#sourceUnitOne")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#sourceUnitTwo", true);
                    $.select2.addByList("#sourceUnitTwo", successData, "id", "name", true, true);
                }
            });
        });
        $(document).on("select2:unselect","#sourceUnitOne",function(){
            $.select2.empty("#sourceUnitTwo", true);
        });
        $(document).on("select2:select","#targetSiteOne, #targetSiteTwo",function(){
            var tsType = $("#targetSiteOne").select2("val");
            var tsArea = $("#targetSiteTwo").select2("val");
            $.select2.empty("#targetSiteThree");
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
                    $.select2.empty("#targetSiteThree", true);
                    $.select2.addByList("#targetSiteThree", successData, "id", "name", true, true);
                }
            });
        });
        $(document).on("select2:unselect","#targetSiteOne, #targetSiteTwo",function(){
            $.select2.empty("#targetSiteThree", true);
        });
        $(document).on("select2:select","#involveCrowdOne",function(){
            $.ajax({
                url:context +'/dictionary/findDictionaryItemsByParentId',
                type:'post',
                data:{parentId : $.select2.val("#involveCrowdOne")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#involveCrowdTwo", true);
                    $.select2.addByList("#involveCrowdTwo", successData, "id", "name", true, true);
                }
            });
        });
        $(document).on("select2:unselect","#involveCrowdOne",function(){
            $.select2.empty("#involveCrowdTwo", true);
        });
        $(document).on("select2:select","#wayOfActOne",function(){
            $.ajax({
                url:context +'/dictionary/findDictionaryItemsByParentId',
                type:'post',
                data:{parentId : $.select2.val("#wayOfActOne")},
                dataType:'json',
                success:function(successData){
                    $.select2.empty("#wayOfActTwo", true);
                    $.select2.addByList("#wayOfActTwo", successData, "id", "name", true, true);
                }
            });
        });
        $(document).on("select2:unselect","#wayOfActOne",function(){
            $.select2.empty("#wayOfActTwo", true);
        });
    }

    function initData(){
        //控件数据初始化
        //获取上次查询条件
        var undefinedStartTimeInput = $("#undefinedStartTimeInput").val();
        undefinedStartTimeInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_SF},
            dataType:'json',
            success:function(successData){
                for(var i in successData){
                    if(successData[i].id == $.common.dict.SF_S){
                        successData[i].name = "确定";
                    }
                    if(successData[i].id == $.common.dict.SF_F){
                        successData[i].name = "不确定";
                    }
                }
                $.select2.addByList("#undefinedStartTime", successData, "id", "name", true, true);
                if(!$.util.isBlank(undefinedStartTimeInput)){
                    $.select2.val("#undefinedStartTime", undefinedStartTimeInput);
                    $("#undefinedStartTimeInput").val(undefinedStartTimeInput);
                }
                undefinedStartTimeInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                verifyDictInitStatusAndSearch();
            }
        });
        //获取上次查询条件
        var clueTypeInput = $("#clueTypeInput").val();
        clueTypeInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_XSLB},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#clueType", successData, "id", "name", true, true);
                if(!$.util.isBlank(clueTypeInput)){
                    $.select2.val("#clueType", clueTypeInput);
                    $("#clueTypeInput").val(clueTypeInput);
                }
                clueTypeInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                verifyDictInitStatusAndSearch();
            }
        });
        //获取上次查询条件
        var sourceInput = $("#sourceInput").val();
        sourceInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_HQFS},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#source", successData, "id", "name", true, true);
                if(!$.util.isBlank(sourceInput)){
                    $.select2.val("#source", sourceInput);
                    $("#sourceInput").val(sourceInput);
                }
                sourceInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                verifyDictInitStatusAndSearch();
            }
        });
        //获取上次查询条件
        var levelInput = $("#levelInput").val();
        levelInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_QBJB},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#level", successData, "id", "name", true, true);
                if(!$.util.isBlank(levelInput)){
                    $.select2.val("#level", levelInput);
                    $("#levelInput").val(levelInput);
                }
                levelInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                verifyDictInitStatusAndSearch();
            }
        });
        //获取上次查询条件
        var sensitiveInfoInput = $("#sensitiveInfoInput").val();
        sensitiveInfoInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_MGZX},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#sensitiveInfo", successData, "id", "name", true, true);
                if(!$.util.isBlank(sensitiveInfoInput)){
                    $.select2.val("#sensitiveInfo", sensitiveInfoInput);
                    $("#sensitiveInfoInput").val(sensitiveInfoInput);
                }
                sensitiveInfoInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                verifyDictInitStatusAndSearch();
            }
        });
        //获取上次查询条件
        var sourceUnitOneInput = $("#sourceUnitOneInput").val();
        var sourceUnitTwoInput = $("#sourceUnitTwoInput").val();
        sourceUnitInitStatus = false;
        $.ajax({
            url:context +'/clue/findSourceUnitDictByOneLevelAndTwoLeveCode',
            type:'post',
            data:{oneCode : $.common.dict.TYPE_LYDWFZ, twoCode : sourceUnitOneInput},
            dataType:'json',
            success:function(successData){
                $.select2.empty("#sourceUnitOne", true);
                $.select2.addByList("#sourceUnitOne", successData.oneDis, "id", "name", true, true);
                //应对返回页面的情况设置默认值
                if(!$.util.isBlank(sourceUnitOneInput)){
                    $.select2.val("#sourceUnitOne", sourceUnitOneInput);
                    $.select2.addByList("#sourceUnitTwo", successData.twoDis, "id", "name", true, true);
                    $("#sourceUnitOneInput").val(sourceUnitOneInput);
                    if(!$.util.isBlank(sourceUnitTwoInput)){
                        $.select2.val("#sourceUnitTwo", sourceUnitTwoInput);
                        $("#sourceUnitTwoInput").val(sourceUnitTwoInput);
                    }
                }
                sourceUnitInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                verifyDictInitStatusAndSearch();
            }
        });
        //获取上次查询条件
        var targetSiteOneInput = $("#targetSiteOneInput").val();
        var targetSiteThreeInput = $("#targetSiteThreeInput").val();
        targetSiteInitStatus = false;
        $.ajax({
            url:context +'/clue/findTargetSiteDictByOneLevelAndTwoLeveCode',
            type:'post',
            data:{oneCode : $.common.dict.TYPE_ZXDDLX, twoCode : targetSiteOneInput},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#targetSiteOne", successData.oneDis, "id", "name", true, true);
                //应对返回页面的情况设置默认值
                if(!$.util.isBlank(targetSiteOneInput)){
                    $.select2.val("#targetSiteOne", targetSiteOneInput);
                    $.select2.addByList("#targetSiteThree", successData.twoDis, "id", "name", true, true);
                    $("#targetSiteOneInput").val(targetSiteOneInput);
                    if(!$.util.isBlank(targetSiteThreeInput)){
                        var id = "";
                        if($.util.exist(successData.twoDis)){
                            $.each(successData.twoDis,function(i,val){
                                if(val.name == targetSiteThreeInput){
                                    id = val.id;
                                    return false;
                                }
                            });
                        }
                        $.select2.val("#targetSiteThree", [id]);
                        $("#targetSiteThreeInput").val(targetSiteThreeInput);
                    }
                }
                targetSiteInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                verifyDictInitStatusAndSearch();
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_ZXDDQY},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#targetSiteTwo", successData, "id", "name", true, true);
            }
        });
        //获取上次查询条件
        var statusInput = $("#statusInput").val();
        statusInitStatus = false;
        var arrStatus = [];
        var statusOption = {
            id : "xszt0000",
            name : "未办结"
        }
        arrStatus.push(statusOption);
        statusOption = {
            id : "xszt0003",
            name : "已办结"
        }
        arrStatus.push(statusOption);
        $.select2.addByList("#status", arrStatus, "id", "name", true, true);
        if(!$.util.isBlank(statusInput)){
            $.select2.val("#status", statusInput);
            $("#statusInput").val(statusInput);
        }
        statusInitStatus = true;
        //如果是综合查询，验证条件是否都初始化完成
        verifyDictInitStatusAndSearch();
        //获取上次查询条件
        var involveCrowdOneInput = $("#involveCrowdOneInput").val();
        var involveCrowdTwoInput = $("#involveCrowdTwoInput").val();
        involveCrowdInitStatus = false;
        $.ajax({
            url:context +'/clue/findDictByOneLevelAndTwoLeveCode',
            type:'post',
            data:{oneCode : $.common.dict.TYPE_QTLX, twoCode : involveCrowdOneInput},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#involveCrowdOne", successData.oneDis, "id", "name", true, true);
                //应对返回页面的情况设置默认值
                if(!$.util.isBlank(involveCrowdOneInput)){
                    $.select2.val("#involveCrowdOne", involveCrowdOneInput);
                    $.select2.addByList("#involveCrowdTwo", successData.twoDis, "id", "name", true, true);
                    $("#involveCrowdOneInput").val(involveCrowdOneInput);
                    if(!$.util.isBlank(involveCrowdTwoInput)){
                        $.select2.val("#involveCrowdTwo", involveCrowdTwoInput);
                        $("#involveCrowdTwoInput").val(involveCrowdTwoInput);
                    }
                }
                involveCrowdInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                verifyDictInitStatusAndSearch();
            }
        });
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_SFZJ},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#inBeijing", successData, "id", "name", true, true);
            }
        });
        //获取上次查询条件
        var wayOfActOneInput = $("#wayOfActOneInput").val();
        var wayOfActTwoInput = $("#wayOfActTwoInput").val();
        wayOfActInitStatus = false;
        $.ajax({
            url:context +'/clue/findDictByOneLevelAndTwoLeveCode',
            type:'post',
            data:{oneCode : $.common.dict.TYPE_XWFS, twoCode : wayOfActOneInput},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#wayOfActOne", successData.oneDis, "id", "name", true, true);
                //应对返回页面的情况设置默认值
                if(!$.util.isBlank(wayOfActOneInput)){
                    $.select2.val("#wayOfActOne", wayOfActOneInput);
                    $.select2.addByList("#wayOfActTwo", successData.twoDis, "id", "name", true, true);
                    $("#wayOfActOneInput").val(wayOfActOneInput);
                    if(!$.util.isBlank(wayOfActTwoInput)){
                        $.select2.val("#wayOfActTwo", wayOfActTwoInput);
                        $("#wayOfActTwoInput").val(wayOfActTwoInput);
                    }
                }
                wayOfActInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                verifyDictInitStatusAndSearch();
            }
        });
        //获取上次查询条件
        var happenedInput = $("#happenedInput").val();
        var severityBehaviourInput = $("#severityBehaviourInput").val();
        happenedAndSeverityBehaviourInitStatus = false;
        $.ajax({
            url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
            type:'post',
            data:{dicTypeId : $.common.dict.TYPE_SF},
            dataType:'json',
            success:function(successData){
                $.select2.addByList("#happened", successData, "id", "name", true, true);
                if(!$.util.isBlank(happenedInput)){
                    $.select2.val("#happened", happenedInput);
                    $("#happenedInput").val(happenedInput);
                }
                $.select2.addByList("#severityBehaviour", successData, "id", "name", true, true);
                if(!$.util.isBlank(severityBehaviourInput)){
                    $.select2.val("#severityBehaviour", severityBehaviourInput);
                    $("#severityBehaviourInput").val(severityBehaviourInput);
                }
                happenedAndSeverityBehaviourInitStatus = true;
                //如果是综合查询，验证条件是否都初始化完成
                verifyDictInitStatusAndSearch();
            }
        });
    }

    function queryPartOne(){
        $.ajax({
            url:context +'/clue/queryClueToday',
            type:'post',
            data:{},
            dataType:'json',
            success:function(successData){
                $("#total").text(successData.total + "条");
                if(successData.levelOneCount != "0"){
                    $("#levelOne").removeClass("color-green");
                    $("#levelOne").addClass("fc-red");
                    $("#levelOne").text(successData.levelOneCount + "条");
                }
                for(var i in successData.crowdCount){
                    var str = '<div class="col-xs-2">'
                                +'<div class="item">'
                                    +'<span class="num"><span class="fa fa-tag"></span>' + successData.crowdCount[i].code + '条</span>'
                                        +'<h3>' + successData.crowdCount[i].name + '</h3>'
                                    +'</div>'
                                +'</div>';
                    $("#crowdLst").append(str);
                }
                for(var i in successData.sourceCount){
                    var str = '<div class="col-xs-4">'
                                +'<div class="item">'
                                    +'<span class="num">' + successData.sourceCount[i].code + '条</span>'
                                    +'<h3><span>' + successData.sourceCount[i].name + '</span></h3>'
                                +'</div>'
                            +'</div>'
                    $("#sourceLst").append(str);
                }
                for(var i in successData.checkCount){
                    var str = '<div class="col-xs-4">'
                        +'<div class="item">'
                        +'<span class="num">' + successData.checkCount[i].code + '条</span>'
                        +'<h3><span>' + successData.checkCount[i].name + '</span></h3>'
                        +'</div>'
                        +'</div>'
                    $("#checkLst").append(str);
                }
                var str = [];
                var data = [];
                for(var i in successData.targetCount){
                    str.push(successData.targetCount[i].name);
                    data.push({y:Number(successData.targetCount[i].code)});
                }
                todayPointPlace(str,data);
            }
        });
    }

    function todayPointPlace(str, data){
        $('#todayPointPlace').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: str,
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    enabled: false
                }
            },
            legend: {
                enabled:false
            },
            tooltip: {
                pointFormat: '{point.y:,.0f} 条'
            },
            plotOptions: {
                series: {
                    cursor: 'pointer'
                }
            },
            series: [{
                name: "线索",
                color:'#ffb980',
                data: data
            }]
        });
    }
    function targetHighchart(str, data){
        $('#targetHighchart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: str,
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    enabled: false
                }
            },
            legend: {
                enabled:false
            },
            tooltip: {
                pointFormat: '{point.y:,.0f} 条'
            },
            plotOptions: {
                series: {
                    cursor: 'pointer'
                }
            },
            series: [{
                name: "线索",
                color:'#ffb980',
                data: data
            }]
        });
    }

    function startHighchart(str, data){
        $('#startHighchart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: str,
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    enabled: false
                }
            },
            legend: {
                enabled:false
            },
            tooltip: {
                pointFormat: '{point.y:,.0f} 条'
            },
            plotOptions: {
                series: {
                    cursor: 'pointer'
                }
            },
            series: [{
                name: "线索",
                color:'#29ced0',
                data: data
            }]
        });
    }


    function writeHighchart(str, data){
        $('#writeHighchart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: str,
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    enabled: false
                }
            },
            legend: {
                enabled:false
            },
            tooltip: {
                pointFormat: '{point.y:,.0f} 条'
            },
            plotOptions: {
                series: {
                    cursor: 'pointer'
                }
            },
            series: [{
                name: "线索",
                color:'#ffb980',
                data: data
            }]
        });
    }

    function endHighchart(str, data){
        $('#endHighchart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: str,
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    enabled: false
                }
            },
            legend: {
                enabled:false
            },
            tooltip: {
                pointFormat: '{point.y:,.0f} 条'
            },
            plotOptions: {
                series: {
                    cursor: 'pointer'
                }
            },
            series: [{
                name: "线索",
                color:'#29ced0',
                data: data
            }]
        });
    }

    function checkHighchart(str, data){
        $('#checkHighchart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: str,
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    enabled: false
                }
            },
            legend: {
                enabled:false
            },
            tooltip: {
                pointFormat: '{point.y:,.0f} 条'
            },
            plotOptions: {
                series: {
                    cursor: 'pointer'
                }
            },
            series: [{
                name: "核查",
                color:'#29ced0',
                data: data
            }]
        });
    }

    function queryPartTwo(){
        var obj = {};
        obj.content = $("#clueContent").val();
        obj.doneTimeOneLong = $.laydate.getTime("#doneTime", "start");
        obj.doneTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#doneTime", "end"),"yyyy-MM-dd HH:mm");
        obj.undefinedStartTime = $.select2.val("#undefinedStartTime");
        obj.type = $.select2.val("#clueType");
        obj.source = $.select2.val("#source");
        obj.level = $.select2.val("#level");
        obj.sensitiveInfo = $.select2.val("#sensitiveInfo");
        obj.sourceUnitOne = $.select2.val("#sourceUnitOne");
        obj.sourceUnitTwo = $.select2.val("#sourceUnitTwo");
        obj.status = $.select2.val("#status");
        obj.inBeijing = $.select2.val("#inBeijing");
        obj.targetSiteType = $.select2.val("#targetSiteOne");
        obj.targetSiteArea = $.select2.val("#targetSiteTwo");
        if($.select2.text("#targetSiteThree") != null){
            obj.targetSiteSite = $.select2.text("#targetSiteThree")[0];
        }else{
            obj.targetSiteSite = "";
        }
        obj.startTimeOneLong = $.laydate.getTime("#startTime", "start");
        obj.startTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#startTime", "end"),"yyyy-MM-dd");
        obj.writeTimeOneLong = $.laydate.getTime("#writeTime", "start");
        obj.writeTimeTwoLong = $.date.endRangeByTime($.laydate.getTime("#writeTime", "end"),"yyyy-MM-dd HH:mm");
        obj.involveCrowdOne = $.select2.val("#involveCrowdOne");
        obj.involveCrowdTwo = $.select2.val("#involveCrowdTwo");
        obj.wayOfActOne = $.select2.val("#wayOfActOne");
        obj.wayOfActTwo = $.select2.val("#wayOfActTwo");
        var dataMap = {};
        $.util.objToStrutsFormData(obj, "cqp", dataMap);
        $.ajax({
            url:context +'/clue/findCluePageForStatistics',
            type:'post',
            data:dataMap,
            dataType:'json',
            success:function(successData){
                var str = [];
                var data = [];
                for(var i in successData.targetCount){
                    str.push(successData.targetCount[i].name);
                    data.push({y:Number(successData.targetCount[i].code)});
                }
                targetHighchart(str,data);

                str = [];
                data = [];
                for(var i in successData.startCount){
                    str.push(successData.startCount[i].name);
                    data.push({y:Number(successData.startCount[i].code)});
                }
                startHighchart(str,data);

                str = [];
                data = [];
                for(var i in successData.endCount){
                    str.push(successData.endCount[i].name);
                    data.push({y:Number(successData.endCount[i].code)});
                }
                endHighchart(str,data);

                str = [];
                data = [];
                for(var i in successData.writeCount){
                    str.push(successData.writeCount[i].name);
                    data.push({y:Number(successData.writeCount[i].code)});
                }
                writeHighchart(str,data);

                str = [];
                data = [];
                for(var i in successData.checkCount){
                    str.push(successData.checkCount[i].name);
                    data.push({y:Number(successData.checkCount[i].code)});
                }
                checkHighchart(str,data);
            }
        });
    }

    /**
     * 验证字典项是否都初始化完成，然后执行查询
     */
    function verifyDictInitStatusAndSearch(){
        if(undefinedStartTimeInitStatus &&
            sourceUnitInitStatus &&
            targetSiteInitStatus &&
            involveCrowdInitStatus &&
            wayOfActInitStatus &&
            statusInitStatus &&
            clueTypeInitStatus &&
            sourceInitStatus &&
            levelInitStatus &&
            sensitiveInfoInitStatus &&
            happenedAndSeverityBehaviourInitStatus){
            //queryPartTwo();
        }
    }
})(jQuery);