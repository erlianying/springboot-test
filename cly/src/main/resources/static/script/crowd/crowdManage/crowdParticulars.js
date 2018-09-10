
$.bjqb = $.bjqb || {} ;
$.bjqb.crowdParticulars = $.bjqb.crowdParticulars || {} ;
var crowdNameCode = "";
(function($){
    "use strict";

    $(document).ready(function() {
        if($.util.isEmpty(crowdId)){
            $.util.topWindow().$.layerAlert.alert({icon:5, msg:"群组不存在！",yes:function(){
                history.go(-1);
            }}) ;
        }else{
            queryCrowdInfo();
            initPosition(); //初始化上访部位
        }
    });

    /**
     * 初始化上访部位
     */
    function initPosition(){
        $.ajax({
            url: context + '/crowdManage/findPetitioningLocation',
            type: "post",
            dataType: "json",
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (data) {
                $.select2.empty("#petitioningLocation");
                $.select2.addByList("#petitioningLocation", data.petitioningLocation,"id", "name");
                $.select2.val("#petitioningLocation","");
            }
        });
    }

    /**
     * 查询群体详情
     */
    function queryCrowdInfo(){
        $.ajax({
            url: context +"/crowdManage/queryCrowdDataParticularsPojo",
            type: "POST",
            data: {
                "crowdId":crowdId
            },
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success: function (data) {
                crowdNameCode = data.crowd.nameCode;
                initCrowdBasicInfo(data.crowd);
                queryRegisterRepository(crowdNameCode);
                countClueByCrowd(crowdNameCode);
                initPersonAgeChartInfo();
                initPersonLocalChartInfo();
                initPersonTypeChartInfo();
                initPeopleSexTableInfo();

                initPersonInvolveOtherCrowdTableInfo(crowdNameCode);
                initFootholdTableInfo(crowdNameCode);
                if(crowdNameCode=='qtlx00010001'||crowdNameCode=='qtlx00010002'||crowdNameCode=='qtlx00010003'){
                    initQQFlockTableInfoForType('qtlx0001');
                    initEmphasisPetitionPositionTableInfoForType('qtlx0001');
                    initWeChatFlockTableInfoForType('qtlx0001');
                }else {
                    initQQFlockTableInfo(crowdNameCode);
                    initEmphasisPetitionPositionTableInfo(crowdNameCode);
                    initWeChatFlockTableInfo(crowdNameCode);
                }
            }
        });
    }

    /**
     * 初始化基本信息
     * @param data 基本信息
     */
    function initCrowdBasicInfo(data){
        crowdNameCode = data.nameCode;
        $(".crowdName").text(data.name);
        $("#crowdType").text(data.type);
        $("#city").text($.util.isEmpty(data.city) ? "未知" : data.city);
        $("#unit").text($.util.isEmpty(data.unit) ? "未知" : data.unit);
        $("#personNumber").text(data.personCount+ "人");
        $("#memberSun").text(data.personCount);
        $("#time").text($.date.timeToStr(data.updateTime,"yyyy年MM月dd日"));
        $("#crowdType-two").text(data.type);
        $("#situation").text($.util.isEmpty(data.situation) ? "无" : data.situation);

        $("#hrskperson").text(data.hrskpersonCount+"人");
        $("#backboneCount").text(data.hrskpersonCount);
        $("#hrskperson").attr("title",$.util.isEmpty(data.hrskpersons) ? "" : data.hrskpersons);
        // $("#hrskperson").text(data.hrskpersonCount + "人（"+data.hrskpersons+")");

        $("#crowdPermanentPopulationCount").text(data.permanentPopulation); //群体内常住人口
        $("#crowdTransientPopulationCount").text(data.temporaryPopulation);//暂住人口
        $("#crowdInBeijingCount").text(data.inBeijingPopulation);//今日在京人口（不含常暂）

    }

    /**
     * 历史相关线索
     * @param crowdNameCode 线索名称code
     */
    function countClueByCrowd(crowdNameCode){
        $.ajax({
            url: context + "/crowdManage/countClueByCrowd",
            type: "POST",
            data: {
                "crowdNameCode": crowdNameCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.crowdDataParticularsPojo;
                $("#crowdHistoryClue").text($.util.isEmpty(data.crowdHistoryClue) ? "0" : data.crowdHistoryClue);//历史相关线索
                $("#crowdRecentClue").text($.util.isEmpty(data.crowdRecentClue) ? "0" : data.crowdRecentClue);//近3个月相关线索
            }
        });
    }

    /**
     * 查询历史上访记录
     * @param crowdNameCode
     */
    function queryRegisterRepository(crowdNameCode){
        $.ajax({
            url: context + "/crowdManage/queryRegisterRepository",
            type: "POST",
            global: false,
            data: {
                "crowdNameCode": crowdNameCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.crowdDataParticularsPojo;
                $("#crowdHistoryPetitionCount").text($.util.isEmpty(data.crowdHistoryPetitionCount) ? "0" : data.crowdHistoryPetitionCount);//历史上访次数
                $("#crowdRecentPetitionCount").text($.util.isEmpty(data.crowdRecentPetitionCount) ? "0" : data.crowdRecentPetitionCount);//近3个月上访次数
            }
        });
    }

    /**
     * 初始化人员年龄图标信息
     * @param data 人员年龄图表数据源
     */
    function initPersonAgeChartInfo(){
        $.ajax({
            url: context + "/crowdDataPretreatment/findPersonAgeDistribution",
            type: "POST",
            global: true,
            data: {
                "crowdCode": crowdNameCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.handlePojo;
                var arr = [];
                $.each(data,function(index,val){
                    if(val.count != 0){
                        var arrChild = [val.ageGroupName,val.count];
                        arr.push(arrChild);
                    }
                })
                $('#personAge').highcharts({
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: null
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: <br>{point.percentage:.1f} %',
                                style: {
                                    color:  'black'
                                }
                            },
                        }
                    },
                    legend: {//控制图例显示位置
                        layout: 'vertical',
                        align: 'left',
                        verticalAlign: 'top',
                        borderWidth: 0
                    },
                    series: [{
                        name: '人数',
                        data: arr
                    }]
                });
            }
        });

    }

    /**
     * 初始化人员地域图表信息
     * @param data 人员地域图表数据源
     */
    function initPersonLocalChartInfo(){
        $.ajax({
            url: context + "/crowdDataPretreatment/handleProvinceNumberOfPeople",
            type: "POST",
            data: {
                "crowdCode": crowdNameCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                // var data = success.handlePojo;
                // var keyArr = [];
                // var valueArr = [];
                // $.each(data,function(index,val){
                //     keyArr.push(val.citiName);
                //     valueArr.push(val.count);
                // })
                //
                // $('#personLocal').highcharts({
                //     chart: {
                //         type: 'bar'
                //     },
                //     title: {
                //         text: null
                //     },
                //     xAxis: {
                //         categories: keyArr,
                //         title: {
                //             enabled: false
                //         }
                //     },
                //     yAxis: {
                //         title: {
                //             text: null
                //         }
                //     },
                //     tooltip: {
                //         // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
                //     },
                //     series: [{
                //         name: "人数",
                //         color: '#ffb980',
                //         data: valueArr
                //     }]
                // });

                var data = success.handlePojo;
                var arr = [];
                $.each(data,function(index,val){
                    if(val.count != 0){
                        var arrChild = [val.citiName,val.count];
                        arr.push(arrChild);
                    }
                })
                $('#personLocal').highcharts({
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: null
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: <br>{point.percentage:.1f} %',
                                style: {
                                    color:  'black'
                                }
                            },
                        }
                    },
                    legend: {//控制图例显示位置
                        layout: 'vertical',
                        align: 'left',
                        verticalAlign: 'top',
                        borderWidth: 0
                    },
                    series: [{
                        name: '人数',
                        data: arr
                    }]
                });
            }
        });
    }

    /**
     * 初始化人员类型图表信息
     * @param data 人员类型图表数据源
     */
    function initPersonTypeChartInfo(){
        $.ajax({
            url: context + "/crowdDataPretreatment/findPersonTypeDistribution",
            type: "POST",
            data: {
                "crowdCode": crowdNameCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.handlePojo
                var keyArr = [];
                var valueArr = [];
                $.each(data,function(index,val){
                    keyArr.push(val.personTypeName);
                    valueArr.push(val.count);
                })
                $('#personType').highcharts({
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                        categories: keyArr,
                        title: {
                            enabled: false
                        }
                    },
                    yAxis: {
                        title: {
                            text: null
                        }
                    },
                    tooltip: {
                        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
                    },
                    series: [{
                        name: "人数",
                        color: '#ffb980',
                        data: valueArr
                    }]
                });
            }
        });

    }

    /**
     * 初始化人员性别表格信息
     * @param data 人员性别数据源
     */
    function initPeopleSexTableInfo(){
        $.ajax({
            url: context + "/crowdManage/countPersonSexDistribution",
            type: "POST",
            data: {
                "crowdId": crowdId
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.crowdDataParticularsPojo.personSex;
                if(data.length!=0){
                    $.each(data,function(index,val){
                        var html =  "<tr>" +
                            "<td class=\"td-left\" width=\"50%\">"+val.name+"：</td>" +
                            "<td id=\"nan\">"+val.count+"人</td>" +
                            "</tr>";
                        $("#personSex").append(html);
                    })
                }else{
                    var html = "<tbody>" +
                        "<tr>" +
                        "<td class=\"td-left\" width=\"50%\">男性：</td>" +
                        "<td id=\"nan\">0人</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td class=\"td-left\" width=\"50%\">女性：</td>" +
                        "<td id=\"nv\">0人</td>" +
                        "</tr>" +
                        "</tbody>";
                    $("#personSex").append(html);
                }
            }
        });


    }

    /**
     * 初始化人员涉及其他群体情况表格信息
     * @param data 人员涉及其他群体情况数据源
     */
    function initPersonInvolveOtherCrowdTableInfo(crowdNameCode){
        $.ajax({
            url: context + "/crowdManage/countHrskpersonRelateToOhterCrowd",
            type: "POST",
            data: {
                "crowdNameCode": crowdNameCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.crowdDataParticularsPojo.personInvolveOtherCrowd;
                // var html = '<tr>\n' +
                //                 '<td class="td-left" width="20%">社会群体访：</td>\n' +
                //                 '<td class="td-left" >15人</td>\n' +
                //                 '<td>善心会：5人</td>\n' +
                //                 '<td>XXX：10人</td>\n' +
                //             '</tr>';
                initTableForpersonInvolveOtherCrowd(data);
                //导出所用的表格
                if(data == null || data.length == 0){
                    $("#personInvolveOtherCrowdExcel").append("<tr><td align='center'>无</td></tr>");
                }else {
                    $.each(data, function (index, val) {
                        var html = '<tr>\n' +
                            '<td class="td-left" width="20%">' + val.otherCrowdName + '：</td>\n' +
                            '<td class="td-left" >' + val.count + '人</td>\n' +
                            '</tr>';
                        $("#personInvolveOtherCrowdExcel").append(html);
                    })
                }
            }
        });
    }
    function initTableForpersonInvolveOtherCrowd(dataSet){
        var st1 = $.uiSettings.getLocalOTableSettings();
        st1.data = dataSet;
        st1.columnDefs = [ {
            "targets" : 0,
            "width" : "",
            "title" : "涉及其它群体名称",
            "data" : "otherCrowdName",
            "render" : function(data, type, full, meta) {
                return data;
            }
        }, {
            "targets" : 1,
            "width" : "",
            "title" : "人数",
            "data" : "count",
            "render" : function(data, type, full, meta) {
                return data;
            }
        }

        ];

        st1.ordering = false ;
        st1.paging = true;
        st1.hideHead = false;
        st1.dom = null;
        st1.searching = true;
        st1.lengthChange = false;
        st1.lengthMenu = [5];
        $("#personInvolveOtherCrowd").DataTable(st1);
    }

    /**
     * 初始化重点上访部位表格信息
     * @param data 重点上访部位数据源
     */
    function initEmphasisPetitionPositionTableInfo(crowdNameCode){
        $.ajax({
            url: context + "/crowdManage/findPetitionRegistersByCrowdId",
            type: "POST",
            data: {
                "crowdNameCode": crowdNameCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.crowdDataParticularsPojo.ppc;
                if(data == null || data.length == 0){
                    $("#emphasisPetitionPosition").append("<tr><td align='center'>无</td></tr>");
                }else {
                    var html = "";
                    $.each(data, function (index, val) {
                        if(index<5) {
                            html += "<tr>\n" +
                                "<td class=\"td-left\">" + val.petitionPlaceName + "</td>" +
                                "<td>" + val.count + "</td>" +
                                "</tr>\n";
                        }
                    });
                    $("#emphasisPetitionPosition").append(html);
                }
            }
        });

    }

    /**
     * 初始化通常落脚点表格信息
     * @param data 通常落脚点数据源
     */
    function initFootholdTableInfo(crowdNameCode){
        $.ajax({
            url: context + "/crowdManage/countHrskpersonStayPlace",
            type: "POST",
            data: {
                "crowdNameCode": crowdNameCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.crowdDataParticularsPojo.foothold;
                initTableForFootholdTableInfo(data);
                //导出exce使用的表格
                if(data == null || data.length == 0){
                    $("#footholdExcel").append("<tr><td align='center'>无</td></tr>");
                }else {
                    $.each(data, function (index, val) {
                        var html = '<tr>\n' +
                            '<td class="td-left">' + val.stayPlaceName + '：</td>\n' +
                            '<td>' + val.count + '</td>\n' +
                            "<td>" + ($.util.isEmpty(val.unitName)? "":val.unitName) + "</td>" +
                            '</tr>';
                        $("#footholdExcel").append(html);
                    })
                }
            }
        });
    }

    function initTableForFootholdTableInfo(dataSet){
        var st1 = $.uiSettings.getLocalOTableSettings();
        st1.data = dataSet;
        st1.columnDefs = [ {
            "targets" : 0,
            "width" : "",
            "title" : "落脚点名称",
            "data" : "stayPlaceName",
            "render" : function(data, type, full, meta) {
                return data;
            }
        }, {
            "targets" : 1,
            "width" : "",
            "title" : "次数",
            "data" : "count",
            "render" : function(data, type, full, meta) {
                return data;
            }
        }, {
            "targets" : 2,
            "width" : "",
            "title" : "所属分局",
            "data" : "unitName",
            "render" : function(data, type, full, meta) {
                return data;
            }
        }

        ];

        st1.paging = true;
        st1.hideHead = false;
        //是否排序
        st1.ordering = false ;
        st1.searching = true;
        st1.lengthChange = false;
        st1.lengthMenu = [5];
        st1.dom = null;
        $("#foothold").DataTable(st1);
    }

    /**
     * 初始化QQ群信息表格信息
     * @param data QQ群信息数据源
     */
    function initQQFlockTableInfo(crowdNameCode){
        $.ajax({
            url: context + "/crowdManage/countHrskpersonWeQQGroup",
            type: "POST",
            data: {
                "crowdNameCode": crowdNameCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.crowdDataParticularsPojo.qqFlock;
                if(data == null || data.length == 0){
                    $("#qqFlock").append("<tr><td align='center'>无</td></tr>");
                }else {
                    $.each(data, function (index, val) {
                        var html = '<tr>\n' +
                            '<td class="td-left">' + val.qqGroupName + '：</td>\n' +
                            '<td>' + val.count + '人</td>\n' +
                            '</tr>';
                        $("#qqFlock").append(html);
                    })
                }
            }
        });

    }

    /**
     * 初始化微信群信息表格信息
     * @param data 微信群信息数据源
     */
    function initWeChatFlockTableInfo(crowdNameCode){
        $.ajax({
            url: context + "/crowdManage/countHrskpersonWechatGroup",
            type: "POST",
            data: {
                "crowdNameCode": crowdNameCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.crowdDataParticularsPojo.weChatFlock;
                if(data == null || data.length == 0){
                    $("#weChatFlock").append("<tr><td align='center'>无</td></tr>");
                }else{
                    $.each(data,function(index,val){
                        var html = '<tr>\n' +
                            '<td class="td-left">'+val.wechatGroupName+'：</td>\n' +
                            '<td>'+val.count+'人</td>\n' +
                            '</tr>';
                        $("#weChatFlock").append(html);
                    })
                }
            }
        });


    }
// ----------------------------------针对群体类型qtlx00010001 qtlx00010002 qtlx00010003 调用的方法 start------------------------------------------------------------------------------------//


    /**
     * 初始化重点上访部位表格信息
     */
    function initEmphasisPetitionPositionTableInfoForType(typeCode){
        $.ajax({
            url: context + "/crowdManage/findPetitionRegistersByCrowdIdByCrowdType",
            type: "POST",
            data: {
                "crowdTypeCode": typeCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.crowdDataParticularsPojo.ppc;
                if(data == null || data.length == 0){
                    $("#emphasisPetitionPosition").append("<tr><td align='center'>无</td></tr>");
                }else {
                    var html = "";
                    $.each(data, function (index, val) {
                        if(index<5){
                            html += "<tr>\n" +
                                "<td class=\"td-left\">" + val.petitionPlaceName + "</td>" +
                                "<td>" + val.count + "</td>" +
                                "</tr>\n";
                        }

                    });
                    $("#emphasisPetitionPosition").append(html);
                }
            }
        });

    }

    /**
     * 初始化QQ群信息表格信息
     * @param data QQ群信息数据源
     */
    function initQQFlockTableInfoForType(typeCode){
        $.ajax({
            url: context + "/crowdManage/countHrskpersonWeQQGroupByCrowdType",
            type: "POST",
            data: {
                "crowdTypeCode": typeCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.crowdDataParticularsPojo.qqFlock;
                if(data == null || data.length == 0){
                    $("#qqFlock").append("<tr><td align='center'>无</td></tr>");
                }else {
                    $.each(data, function (index, val) {
                        var html = '<tr>\n' +
                            '<td class="td-left">' + val.qqGroupName + '：</td>\n' +
                            '<td>' + val.count + '人</td>\n' +
                            '</tr>';
                        $("#qqFlock").append(html);
                    })
                }
            }
        });

    }

    /**
     * 初始化微信群信息表格信息
     * @param data 微信群信息数据源
     */
    function initWeChatFlockTableInfoForType(typeCode){
        $.ajax({
            url: context + "/crowdManage/countHrskpersonWechatGroupByCrowdType",
            type: "POST",
            data: {
                "crowdTypeCode": typeCode
            },
            customizedOpt: {
                ajaxLoading: true,//设置是否loading
            },
            success: function (success) {
                var data = success.crowdDataParticularsPojo.weChatFlock;
                if(data == null || data.length == 0){
                    $("#weChatFlock").append("<tr><td align='center'>无</td></tr>");
                }else{
                    $.each(data,function(index,val){
                        var html = '<tr>\n' +
                            '<td class="td-left">'+val.wechatGroupName+'：</td>\n' +
                            '<td>'+val.count+'人</td>\n' +
                            '</tr>';
                        $("#weChatFlock").append(html);
                    })
                }
            }
        });


    }

// ----------------------------------针对群体类型qtlx00010001 qtlx00010002 qtlx00010003 调用的方法 end------------------------------------------------------------------------------------//



    /**
     * ----------------------------------------------------------------------------------------------------------------------
     *  -----------------------------------------------相关线索-----start-----------------------------------------------
     * ----------------------------------------------------------------------------------------------------------------------
     */
    var clueTable = null;

    $(document).ready(function(){

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

    $(document).on("ifChecked","#customClue",function(){
        $("#clueCustomDate").show();
    });

    $(document).on("ifUnchecked","#customClue",function(){
        $("#clueCustomDate").hide();
    });

    /**
     * 线索查询
     */
    $(document).on("click","#clueQuery",function(){
        clueTable.draw();
    })
    /**
     * 线索查询
     */
    $(document).on("click",".jumpToxs",function(){
        window.open(context + '/show/page/web/clue/viewClueWindow?clueId=' + $(this).attr("id"));
    })

    /**
     * 线索重置
     */
    $(document).on("click","#clueReset",function(){
        $('#defaultCheckedClue').iCheck('check');
        $.laydate.reset("#dateRangeId");
        $("#clueCustomDate").hide();
        $("#clueContent").val("");
        $.select2.val("#targetSiteOne","");
        $.select2.val("#targetSiteTwo","");
        $.select2.val("#targetSiteThree","");
        clueTable.draw();
    })

    /**
     *线索 tabs 点击事件
     */
    $(document).on("click","#clueTabs",function(){
        if(clueTable == null){
            initItm();
            initClueTable();
        }
    });

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
                $.select2.addByList("#targetSiteOne", successData, "id", "name", true, true);
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
    }

    function initClueTable(){
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/crowdManage/findCluePageByClue";
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
            var arr = $.icheck.getChecked("clue");
            if($(arr[0]).val()=="自定义"){
                var startTime = $.laydate.getDate("#dateRangeId","start") == null ? null : $.date.strToTime($.laydate.getDate("#dateRangeId","start")+" 00:00:00");
                var endTime = $.laydate.getDate("#dateRangeId","end") == null ? null : $.date.strToTime($.laydate.getDate("#dateRangeId","end")+" 23:59:59");
                var obj = {"id":crowdNameCode,
                    "type":$(arr[0]).val(),
                    "startTimeOneLong":startTime,
                    "startTimeTwoLong":endTime,
                    "targetSiteType": $.select2.val("#targetSiteOne"),
                    "targetSiteArea": $.select2.val("#targetSiteTwo"),
                    "targetSiteSite": $.select2.val("#targetSiteThree"),
                    "content": $("#clueContent").val()
                };
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }else{
                var obj = {"id":crowdNameCode,
                    "type":$(arr[0]).val(),
                    "targetSiteType": $.select2.val("#targetSiteOne"),
                    "targetSiteArea": $.select2.val("#targetSiteTwo"),
                    "targetSiteSite": $.select2.val("#targetSiteThree"),
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
        clueTable = $("#clueTable").DataTable(tb);
    }

    /**
     * ----------------------------------------------------------------------------------------------------------------------
     *  -----------------------------------------------相关线索-----end-----------------------------------------------
     * ----------------------------------------------------------------------------------------------------------------------
     */

    /**
     * ----------------------------------------------------------------------------------------------------------------------
     *  -----------------------------------------------相关现实访----start-----------------------------------------------
     * ----------------------------------------------------------------------------------------------------------------------
     */

    var petitioningTable = null;

    $(document).ready(function(){

    });

    $(document).on("ifChecked","#customPetitioning",function(){
        $("#petitioningDateRangeId").show();
    });

    $(document).on("ifUnchecked","#customPetitioning",function(){
        $("#petitioningDateRangeId").hide();
    });

    /**
     * 现实访查询
     */
    $(document).on("click","#petitioningQuery",function(){
        petitioningTable.draw();
    });

    /**
     * 现实访重置
     */
    $(document).on("click","#petitioningReset",function(){
        $('#defaultCheckedPetitioning').iCheck('check');
        $.laydate.reset("#petitioningDateRangeId");
        $("#petitioningDateRangeId").hide();
        $.select2.val("#petitioningLocation","");
        petitioningTable.draw();
    });

    /**
     * 现实访 tabs 点击事件
     */
    $(document).on("click","#petitioningTabs",function(){
        if(petitioningTable == null){
            initPetitioningTable();
        }
    });

    function initPetitioningTable(){
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/crowdManage/findPetitioningsRegister";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "",
                "title": "来源地",
                "data": "sourceAddress" ,
                "render": function ( data, type, full, meta ) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "上访日期",
                "data" : "petitionDateLong",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data,"yyyy-MM-dd HH:mm:ss");
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "上访部位",
                "data" : "position",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "人员规模",
                "data" : "scale",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "现场情况",
                "data" : "particularSituation",
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
            var arr = $.icheck.getChecked("petitioning");
            if($(arr[0]).val()=="自定义"){
                var startTime = $.laydate.getDate("#petitioningDateRangeId","start") == null ? null : $.laydate.getDate("#petitioningDateRangeId","start")+" 00:00:00";
                var endTime = $.laydate.getDate("#petitioningDateRangeId","end") == null ? null : $.laydate.getDate("#petitioningDateRangeId","end")+" 23:59:59";
                var obj = {"id":crowdId,
                    "type":$(arr[0]).val(),
                    "startTime":startTime,
                    "endTime":endTime,
                    "position": $.select2.val("#petitioningLocation")
                };
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }else{
                var obj = {"id":crowdId,"type":$(arr[0]).val(),"position":$.select2.val("#petitioningLocation")};
                $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
            }
        };
        tb.paramsResp = function(json) {
            json.data = json.petitionRegistersPojo;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
        };
        petitioningTable = $("#petitioningTable").DataTable(tb);
    }

    /**
     * ----------------------------------------------------------------------------------------------------------------------
     *  -----------------------------------------------相关现实访-----end-----------------------------------------------
     * ----------------------------------------------------------------------------------------------------------------------
     */

    //点击群体轨迹信息加载群体轨迹信息
    $(document).on("click" , "#crowdTrackInfo", function(e){
        $.bjqb.crowdDetilsTrackInfo.queryCrowdTrackInfo(crowdNameCode);
    });
    $(document).on("click" , "#queryBtn", function(e){
        $.bjqb.crowdDetilsTrackInfo.queryCrowdTrackInfo(crowdNameCode);
    });






    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.bjqb.crowdParticulars, {
        getNameCode : crowdNameCode,
    });
})(jQuery);

/**
 * 导出Excel  纯js导出
 * @type {{}}
 */
$.bjqb.crowdParticulars.excel = $.bjqb.crowdParticulars.excel || {} ;
(function($){
    "use strict";
    var idTmr;
    var sheetName = "";
    $(document).on("click","#personExcel",function(){
        sheetName = "人员涉及其他群体情况";
        method1("personInvolveOtherCrowdExcel");
    });

    $(document).on("click","#footExcel",function(){
        sheetName = "通常落脚点";
        method1("footholdExcel");
    });

    //获取浏览器类型
    function  getExplorer() {
        var explorer = window.navigator.userAgent ;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
            return 'ie';
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
            return 'Firefox';
        }
        //Chrome
        else if(explorer.indexOf("Chrome") >= 0){
            return 'Chrome';
        }
        //Opera
        else if(explorer.indexOf("Opera") >= 0){
            return 'Opera';
        }
        //Safari
        else if(explorer.indexOf("Safari") >= 0){
            return 'Safari';
        }
    }
    function method1(tableid) {//整个表格拷贝到EXCEL中
        if($("#"+tableid).children().length == 0 || $("#"+tableid).children()[0].innerText == '无'){
            window.top.$.layerAlert.alert({icon:5, closeBtn:false, msg:"没有数据可以导出！"});
            return;
        }
        if(getExplorer() === 'ie'){
            // var curTbl = document.getElementById(tableid);
            // var oXL = new ActiveXObject("Excel.Application");
            //
            // //创建AX对象excel
            // var oWB = oXL.Workbooks.Add();
            // //获取workbook对象
            // var xlsheet = oWB.Worksheets(1);
            // //激活当前sheet
            // var sel = document.body.createTextRange();
            // sel.moveToElementText(curTbl);
            // //把表格中的内容移到TextRange中
            // sel.select;
            // //全选TextRange中内容
            // sel.execCommand("Copy");
            // //复制TextRange中内容
            // xlsheet.Paste();
            // //粘贴到活动的EXCEL中
            // oXL.Visible = true;
            // //设置excel可见属性
            //
            // try {
            //     var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
            // } catch (e) {
            //     print("Nested catch caught " + e);
            // } finally {
            //     oWB.SaveAs(fname);
            //
            //     oWB.Close(savechanges = false);
            //     //xls.visible = false;
            //     oXL.Quit();
            //     oXL = null;
            //     //结束excel进程，退出完成
            //     //window.setInterval("Cleanup();",1);
            //     idTmr = window.setInterval("Cleanup();", 1);
            //
            // }

            window.top.$.layerAlert.alert({icon:5, closeBtn:false, msg:"暂不支持IE浏览器，请使用谷歌浏览器！"});
        }
        else{
            tableToExcel(tableid);
        }
    }
    //IE导出方法
    function Cleanup() {
        window.clearInterval(idTmr);
        CollectGarbage();
    }
    //非IE浏览器 导出方法
    var tableToExcel = (function() {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) ;},
            format = function(s, c) {
                return s.replace(/{(\w+)}/g,
                    function(m, p) {
                    return c[p];
                }) ;
        }
        return function(table, name) {
            if (!table.nodeType) {
                table = document.getElementById(table);
            }
            var ctx = {worksheet: name || sheetName, table: table.innerHTML}
            window.location.href = uri + base64(format(template, ctx));
        };
    })();
})(jQuery);

/**
 * 未接数据预处理 逻辑
 */

// $.bjqb = $.bjqb || {} ;
// $.bjqb.crowdParticulars = $.bjqb.crowdParticulars || {} ;
// (function($){
//     "use strict";
//     var crowdNameCode = "";
//
//     $(document).ready(function() {
//         if($.util.isEmpty(crowdId)){
//             $.util.topWindow().$.layerAlert.alert({icon:5, msg:"群组不存在！",yes:function(){
//                 history.go(-1);
//             }}) ;
//         }else{
//             queryCrowdInfo();
//             initPosition(); //初始化上访部位
//         }
//     });
//
//     /**
//      * 初始化上访部位
//      */
//     function initPosition(){
//         $.ajax({
//             url: context + '/crowdManage/findPetitioningLocation',
//             type: "post",
//             dataType: "json",
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (data) {
//                 $.select2.empty("#petitioningLocation");
//                 $.select2.addByList("#petitioningLocation", data.petitioningLocation,"id", "name");
//                 $.select2.val("#petitioningLocation","");
//             }
//         });
//     }
//
//     /**
//      * 查询群体详情
//      */
//     function queryCrowdInfo(){
//         $.ajax({
//             url: context +"/crowdManage/queryCrowdDataParticularsPojo",
//             type: "POST",
//             data: {
//                 "crowdId":crowdId
//             },
//             customizedOpt:{
//                 ajaxLoading:true,//设置是否loading
//             },
//             success: function (data) {
//                 crowdNameCode = data.crowd.nameCode;
//                 initCrowdBasicInfo(data.crowd);
//                 initHrskpersonCount();
//                 queryRegisterRepository();
//                 countClueByCrowd(crowdNameCode);
//                 initOtherTableInfo(crowdNameCode);
//                 initPersonAgeChartInfo();
//                 initPersonLocalChartInfo();
//                 initPersonTypeChartInfo();
//                 initPeopleSexTableInfo();
//                 initEmphasisPetitionPositionTableInfo(crowdNameCode);
//                 initPersonInvolveOtherCrowdTableInfo(crowdNameCode);
//                 initFootholdTableInfo(crowdNameCode);
//                 initQQFlockTableInfo(crowdNameCode);
//                 initWeChatFlockTableInfo(crowdNameCode);
//             }
//         });
//     }
//
//     /**
//      * 初始化基本信息
//      * @param data 基本信息
//      */
//     function initCrowdBasicInfo(data){
//         crowdNameCode = data.nameCode;
//         $(".crowdName").text(data.name);
//         $("#crowdType").text(data.type);
//         $("#city").text($.util.isEmpty(data.city) ? "未知" : data.city);
//         $("#unit").text(data.unit);
//         $("#personNumber").text(data.personCount+ "人");
//         $("#memberSun").text(data.personCount);
//         $("#time").text($.date.timeToStr(data.updateTime,"yyyy年MM月dd日"));
//         $("#crowdType-two").text(data.type);
//     }
//
//     /**
//      * 重点人
//      *
//      */
//     function initHrskpersonCount(){
//         $.ajax({
//             url: context + "/crowdManage/queryHrskpersonCount",
//             type: "POST",
//             data: {
//                 "crowdId": crowdId
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.persons;
//                 if(!$.util.isEmpty(data)){
//                     var arr = data.split(",");
//                     $("#hrskperson").text(arr.length+ "人");
//                     // $("#hrskperson").text(arr.length + "人（"+data+")");
//                     $("#backboneCount").text(arr.length);
//                 }else{
//                     $("#hrskperson").text("0人");
//                     $("#backboneCount").text(0);
//                 }
//             }
//         });
//
//
//     }
//
//     /**
//      * 常驻、暂住、在京人口
//      *
//      */
//     function initOtherTableInfo(crowdNameCode){
//         $.ajax({
//             url: context + "/crowdManage/countPersons",
//             type: "POST",
//             data: {
//                 "crowdNameCode": crowdNameCode
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.crowdDataParticularsPojo;
//                 $("#crowdPermanentPopulationCount").text($.util.isEmpty(data.crowdPermanentPopulationCount) ? "0" : data.crowdPermanentPopulationCount); //群体内常住人口
//                 $("#crowdTransientPopulationCount").text($.util.isEmpty(data.crowdTransientPopulationCount) ? "0" : data.crowdTransientPopulationCount);//暂住人口
//                 $("#crowdInBeijingCount").text($.util.isEmpty(data.crowdInBeijingCount) ? "0" : data.crowdInBeijingCount);//今日在京人口（不含常暂）
//             }
//         });
//
//
//     }
//
//     /**
//      * 历史相关线索
//      * @param crowdNameCode 线索名称code
//      */
//     function countClueByCrowd(crowdNameCode){
//         $.ajax({
//             url: context + "/crowdManage/countClueByCrowd",
//             type: "POST",
//             data: {
//                 "crowdNameCode": crowdNameCode
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.crowdDataParticularsPojo;
//                 $("#crowdHistoryClue").text($.util.isEmpty(data.crowdHistoryClue) ? "0" : data.crowdHistoryClue);//历史相关线索
//                 $("#crowdRecentClue").text($.util.isEmpty(data.crowdRecentClue) ? "0" : data.crowdRecentClue);//近3个月相关线索
//             }
//         });
//     }
//
//     /**
//      * 查询历史上访记录
//      * @param crowdNameCode
//      */
//     function queryRegisterRepository(){
//         $.ajax({
//             url: context + "/crowdManage/queryRegisterRepository",
//             type: "POST",
//             global: false,
//             data: {
//                 "crowdId": crowdId
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.crowdDataParticularsPojo;
//                 $("#crowdHistoryPetitionCount").text($.util.isEmpty(data.crowdHistoryPetitionCount) ? "0" : data.crowdHistoryPetitionCount);//历史上访次数
//                 $("#crowdRecentPetitionCount").text($.util.isEmpty(data.crowdRecentPetitionCount) ? "0" : data.crowdRecentPetitionCount);//近3个月上访次数
//             }
//         });
//     }
//
//     /**
//      * 初始化人员年龄图标信息
//      * @param data 人员年龄图表数据源
//      */
//     function initPersonAgeChartInfo(){
//         $.ajax({
//             url: context + "/crowdManage/countPersonAgeDistribution",
//             type: "POST",
//             global: true,
//             data: {
//                 "crowdId": crowdId
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.crowdDataParticularsPojo.personAge;
//                 var arr = [];
//                 $.each(data,function(index,val){
//                     if(val.count != 0){
//                         var arrChild = [val.name,val.count];
//                         arr.push(arrChild);
//                     }
//                 })
//                 $('#personAge').highcharts({
//                     chart: {
//                         type: 'pie'
//                     },
//                     title: {
//                         text: null
//                     },
//                     plotOptions: {
//                         pie: {
//                             dataLabels: {
//                                 enabled: true,
//                                 format: '<b>{point.name}</b>: <br>{point.percentage:.1f} %',
//                                 style: {
//                                     color:  'black'
//                                 }
//                             },
//                         }
//                     },
//                     legend: {//控制图例显示位置
//                         layout: 'vertical',
//                         align: 'left',
//                         verticalAlign: 'top',
//                         borderWidth: 0
//                     },
//                     series: [{
//                         name: '人数',
//                         data: arr
//                     }]
//                 });
//             }
//         });
//
//     }
//
//     /**
//      * 初始化人员地域图表信息
//      * @param data 人员地域图表数据源
//      */
//     function initPersonLocalChartInfo(){
//         $.ajax({
//             url: context + "/crowdManage/countProvinceNumberOfPeople",
//             type: "POST",
//             data: {
//                 "crowdId": crowdId
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.crowdDataParticularsPojo.personCity;
//                 var keyArr = [];
//                 var valueArr = [];
//                 $.each(data,function(index,val){
//                     keyArr.push(val.name);
//                     valueArr.push(val.count);
//                 })
//
//                 $('#personLocal').highcharts({
//                     chart: {
//                         type: 'bar'
//                     },
//                     title: {
//                         text: null
//                     },
//                     xAxis: {
//                         categories: keyArr,
//                         title: {
//                             enabled: false
//                         }
//                     },
//                     yAxis: {
//                         title: {
//                             text: null
//                         }
//                     },
//                     tooltip: {
//                         // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
//                     },
//                     series: [{
//                         name: "人数",
//                         color: '#ffb980',
//                         data: valueArr
//                     }]
//                 });
//             }
//         });
//
//     }
//
//     /**
//      * 初始化人员类型图表信息
//      * @param data 人员类型图表数据源
//      */
//     function initPersonTypeChartInfo(){
//         $.ajax({
//             url: context + "/crowdManage/countPersonTypeDistribution",
//             type: "POST",
//             data: {
//                 "crowdId": crowdId
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                var data = success.crowdDataParticularsPojo.personType
//                 var keyArr = [];
//                 var valueArr = [];
//                 $.each(data,function(index,val){
//                     keyArr.push(val.name);
//                     valueArr.push(val.count);
//                 })
//                 $('#personType').highcharts({
//                     chart: {
//                         type: 'bar'
//                     },
//                     title: {
//                         text: null
//                     },
//                     xAxis: {
//                         categories: keyArr,
//                         title: {
//                             enabled: false
//                         }
//                     },
//                     yAxis: {
//                         title: {
//                             text: null
//                         }
//                     },
//                     tooltip: {
//                         // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
//                     },
//                     series: [{
//                         name: "人数",
//                         color: '#ffb980',
//                         data: valueArr
//                     }]
//                 });
//             }
//         });
//
//     }
//
//     /**
//      * 初始化人员性别表格信息
//      * @param data 人员性别数据源
//      */
//     function initPeopleSexTableInfo(){
//         $.ajax({
//             url: context + "/crowdManage/countPersonSexDistribution",
//             type: "POST",
//             data: {
//                 "crowdId": crowdId
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.crowdDataParticularsPojo.personSex;
//                 if(data.length!=0){
//                     $.each(data,function(index,val){
//                         var html =  "<tr>" +
//                             "<td class=\"td-left\" width=\"50%\">"+val.name+"：</td>" +
//                             "<td id=\"nan\">"+val.count+"人</td>" +
//                             "</tr>";
//                         $("#personSex").append(html);
//                     })
//                 }else{
//                     var html = "<tbody>" +
//                         "<tr>" +
//                         "<td class=\"td-left\" width=\"50%\">男性：</td>" +
//                         "<td id=\"nan\">0人</td>" +
//                         "</tr>" +
//                         "<tr>" +
//                         "<td class=\"td-left\" width=\"50%\">女性：</td>" +
//                         "<td id=\"nv\">0人</td>" +
//                         "</tr>" +
//                         "</tbody>";
//                     $("#personSex").append(html);
//                 }
//             }
//         });
//
//
//     }
//
//     /**
//      * 初始化人员涉及其他群体情况表格信息
//      * @param data 人员涉及其他群体情况数据源
//      */
//     function initPersonInvolveOtherCrowdTableInfo(crowdNameCode){
//         $.ajax({
//             url: context + "/crowdManage/countHrskpersonRelateToOhterCrowd",
//             type: "POST",
//             data: {
//                 "crowdNameCode": crowdNameCode
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.crowdDataParticularsPojo.personInvolveOtherCrowd;
//                 // var html = '<tr>\n' +
//                 //                 '<td class="td-left" width="20%">社会群体访：</td>\n' +
//                 //                 '<td class="td-left" >15人</td>\n' +
//                 //                 '<td>善心会：5人</td>\n' +
//                 //                 '<td>XXX：10人</td>\n' +
//                 //             '</tr>';
//                 if(data == null || data.length == 0){
//                     $("#personInvolveOtherCrowd").append("<tr><td align='center'>无</td></tr>");
//                 }else {
//                     $.each(data, function (index, val) {
//                         var html = '<tr>\n' +
//                             '<td class="td-left" width="20%">' + val.otherCrowdName + '：</td>\n' +
//                             '<td class="td-left" >' + val.count + '人</td>\n' +
//                             '</tr>';
//                         $("#personInvolveOtherCrowd").append(html);
//                     })
//                 }
//             }
//         });
//
//
//
//     }
//
//     /**
//      * 初始化重点上访部位表格信息
//      * @param data 重点上访部位数据源
//      */
//     function initEmphasisPetitionPositionTableInfo(crowdNameCode){
//         $.ajax({
//             url: context + "/crowdManage/findPetitionRegistersByCrowdId",
//             type: "POST",
//             data: {
//                 "crowdId": crowdNameCode
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.crowdDataParticularsPojo.ppc;
//                 if(data == null || data.length == 0){
//                     $("#emphasisPetitionPosition").append("<tr><td align='center'>无</td></tr>");
//                 }else {
//                     var html = "";
//                     $.each(data, function (index, val) {
//                         html += "<tr>\n" +
//                             "<td class=\"td-left\">" + val.petitionPlaceName + "</td>\n" +
//                             "<td>" + val.count + "</td>\n" +
//                             "</tr>\n";
//                     });
//                     $("#emphasisPetitionPosition").append(html);
//                 }
//             }
//         });
//
//     }
//
//     /**
//      * 初始化通常落脚点表格信息
//      * @param data 通常落脚点数据源
//      */
//     function initFootholdTableInfo(crowdNameCode){
//         $.ajax({
//             url: context + "/crowdManage/countHrskpersonStayPlace",
//             type: "POST",
//             data: {
//                 "crowdNameCode": crowdNameCode
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.crowdDataParticularsPojo.foothold;
//                 if(data == null || data.length == 0){
//                     $("#foothold").append("<tr><td align='center'>无</td></tr>");
//                 }else {
//                     $.each(data, function (index, val) {
//                         var html = '<tr>\n' +
//                             '<td class="td-left">' + val.stayPlaceName + '：</td>\n' +
//                             '<td>' + val.count + '</td>\n' +
//                             '</tr>';
//                         $("#foothold").append(html);
//                     })
//                 }
//             }
//         });
//     }
//
//     /**
//      * 初始化QQ群信息表格信息
//      * @param data QQ群信息数据源
//      */
//     function initQQFlockTableInfo(crowdNameCode){
//         $.ajax({
//             url: context + "/crowdManage/countHrskpersonWeQQGroup",
//             type: "POST",
//             data: {
//                 "crowdNameCode": crowdNameCode
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.crowdDataParticularsPojo.qqFlock;
//                 if(data == null || data.length == 0){
//                     $("#qqFlock").append("<tr><td align='center'>无</td></tr>");
//                 }else {
//                     $.each(data, function (index, val) {
//                         var html = '<tr>\n' +
//                             '<td class="td-left">' + val.qqGroupName + '：</td>\n' +
//                             '<td>' + val.count + '人</td>\n' +
//                             '</tr>';
//                         $("#qqFlock").append(html);
//                     })
//                 }
//             }
//         });
//
//     }
//
//     /**
//      * 初始化微信群信息表格信息
//      * @param data 微信群信息数据源
//      */
//     function initWeChatFlockTableInfo(crowdNameCode){
//         $.ajax({
//             url: context + "/crowdManage/countHrskpersonWechatGroup",
//             type: "POST",
//             data: {
//                 "crowdNameCode": crowdNameCode
//             },
//             customizedOpt: {
//                 ajaxLoading: true,//设置是否loading
//             },
//             success: function (success) {
//                 var data = success.crowdDataParticularsPojo.weChatFlock;
//                 if(data == null || data.length == 0){
//                     $("#weChatFlock").append("<tr><td align='center'>无</td></tr>");
//                 }else{
//                     $.each(data,function(index,val){
//                         var html = '<tr>\n' +
//                             '<td class="td-left">'+val.wechatGroupName+'：</td>\n' +
//                             '<td>'+val.count+'人</td>\n' +
//                             '</tr>';
//                         $("#weChatFlock").append(html);
//                     })
//                 }
//             }
//         });
//
//
//     }
//
//     /**
//      * ----------------------------------------------------------------------------------------------------------------------
//      *  -----------------------------------------------相关线索-----start-----------------------------------------------
//      * ----------------------------------------------------------------------------------------------------------------------
//      */
//     var clueTable = null;
//
//     $(document).ready(function(){
//
//     });
//
//     $(document).on("select2:select","#targetSiteOne, #targetSiteTwo",function(){
//         var tsType = $("#targetSiteOne").select2("val");
//         var tsArea = $("#targetSiteTwo").select2("val");
//         $.select2.empty("#targetSiteThree");
//         if($.util.isBlank(tsType) || $.util.isBlank(tsType)){
//             return;
//         }
//         $.ajax({
//             url:context +'/clue/findTargetSiteByTypeAndArea',
//             type:'post',
//             data:{tsType : tsType,
//                 tsArea : tsArea},
//             dataType:'json',
//             success:function(successData){
//                 $.select2.empty("#targetSiteThree", true);
//                 $.select2.addByList("#targetSiteThree", successData, "id", "name", true, true);
//             }
//         });
//     });
//     $(document).on("select2:unselect","#targetSiteOne, #targetSiteTwo",function(){
//         $.select2.empty("#targetSiteThree", true);
//     });
//
//     $(document).on("ifChecked","#customClue",function(){
//         $("#clueCustomDate").show();
//     });
//
//     $(document).on("ifUnchecked","#customClue",function(){
//         $("#clueCustomDate").hide();
//     });
//
//     /**
//      * 线索查询
//      */
//     $(document).on("click","#clueQuery",function(){
//         clueTable.draw();
//     })
//
//     /**
//      * 线索重置
//      */
//     $(document).on("click","#clueReset",function(){
//         $('#defaultCheckedClue').iCheck('check');
//         $.laydate.reset("#dateRangeId");
//         $("#clueCustomDate").hide();
//         $("#clueContent").val("");
//         $.select2.val("#targetSiteOne","");
//         $.select2.val("#targetSiteTwo","");
//         $.select2.val("#targetSiteThree","");
//         clueTable.draw();
//     })
//
//     /**
//      *线索 tabs 点击事件
//      */
//     $(document).on("click","#clueTabs",function(){
//         if(clueTable == null){
//             initItm();
//             initClueTable();
//         }
//     });
//
//     /**
//      * 初始化 指向地点 一级和二级
//      */
//     function initItm(){
//         $.ajax({
//             url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
//             type:'post',
//             data:{dicTypeId : $.common.dict.TYPE_ZXDDLX},
//             dataType:'json',
//             success:function(successData){
//                 $.select2.addByList("#targetSiteOne", successData, "id", "name", true, true);
//             }
//         });
//         $.ajax({
//             url:context +'/dictionary/findFirstLevelDictionaryItemsByDicType',
//             type:'post',
//             data:{dicTypeId : $.common.dict.TYPE_ZXDDQY},
//             dataType:'json',
//             success:function(successData){
//                 $.select2.addByList("#targetSiteTwo", successData, "id", "name", true, true);
//             }
//         });
//     }
//
//     function initClueTable(){
//         var tb = $.uiSettings.getOTableSettings();
//         tb.ajax.url = context +"/crowdManage/findCluePageByClue";
//         tb.columnDefs = [
//             {
//                 "targets" : 0,
//                 "width" : "",
//                 "title" : "线索内容",
//                 "data" : "content",
//                 "render" : function(data, type, full, meta) {
//
//                     return data;
//                 }
//             },
//             {
//                 "targets" : 1,
//                 "width" : "",
//                 "title" : "来源地",
//                 "data" : "sourceUnitTwoName",
//                 "render" : function(data, type, full, meta) {
//
//                     return data;
//                 }
//             },
//             {
//                 "targets" : 2,
//                 "width" : "",
//                 "title" : "主责单位",
//                 "data" : "mainUnit",
//                 "render" : function(data, type, full, meta) {
//                     return data;
//                 }
//             },
//             {
//                 "targets" : 3,
//                 "width" : "",
//                 "title" : "指向时间",
//                 "data" : "startTimeLong",
//                 "render" : function(data, type, full, meta) {
//
//                     return $.date.timeToStr(data,"yyyy-MM-dd HH:mm:ss");
//                 }
//             },
//             {
//                 "targets" : 4,
//                 "width" : "",
//                 "title" : "指向地点",
//                 "data" : "content",
//                 "render" : function(data, type, full, meta) {
//                     var info = "";
//                     $.each(data,function(index, val){
//                         info += val.typeName+","
//                     })
//                     return $.util.isBlank(info)?"":info.substr(0,info.length-1);
//                 }
//             },
//             {
//                 "targets" : 5,
//                 "width" : "",
//                 "title" : "行为方式",
//                 "data" : "wayOfActTwoName",
//                 "render" : function(data, type, full, meta) {
//
//                     return data;
//                 }
//             },
//             {
//                 "targets" : 6,
//                 "width" : "",
//                 "title" : "办理状态",
//                 "data" : "statusName",
//                 "render" : function(data, type, full, meta) {
//
//                     return data;
//                 }
//             }
//
//
//         ];
//         //是否排序
//         tb.ordering = false ;
//         //是否分页
//         tb.paging = true;
//         //每页条数
//         tb.lengthMenu = [ 10 ];
//         //默认搜索框
//         tb.searching = false ;
//         //能否改变lengthMenu
//         tb.lengthChange = false ;
//         //自动TFoot
//         tb.autoFooter = false ;
//         //自动列宽
//         tb.autoWidth = true ;
//         //是否显示loading效果
//         tb.bProcessing = true;
//         //请求参数
//         tb.paramsReq = function(d, pagerReq){
//             var arr = $.icheck.getChecked("clue");
//             if($(arr[0]).val()=="自定义"){
//                 var startTime = $.laydate.getDate("#dateRangeId","start") == null ? null : $.date.strToTime($.laydate.getDate("#dateRangeId","start")+" 00:00:00");
//                 var endTime = $.laydate.getDate("#dateRangeId","end") == null ? null : $.date.strToTime($.laydate.getDate("#dateRangeId","end")+" 23:59:59");
//                 var obj = {"id":crowdNameCode,
//                     "type":$(arr[0]).val(),
//                     "startTimeOneLong":startTime,
//                     "startTimeTwoLong":endTime,
//                     "targetSiteType": $.select2.val("#targetSiteOne"),
//                     "targetSiteArea": $.select2.val("#targetSiteTwo"),
//                     "targetSiteSite": $.select2.val("#targetSiteThree"),
//                     "content": $("#clueContent").val()
//                 };
//                 $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
//             }else{
//                 var obj = {"id":crowdNameCode,
//                     "type":$(arr[0]).val(),
//                     "targetSiteType": $.select2.val("#targetSiteOne"),
//                     "targetSiteArea": $.select2.val("#targetSiteTwo"),
//                     "targetSiteSite": $.select2.val("#targetSiteThree"),
//                     "content": $("#clueContent").val()
//                 };
//                 $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
//             }
//         };
//         tb.paramsResp = function(json) {
//             json.data = json.clue;
//             json.recordsFiltered = json.totalNum;
//             json.recordsTotal = json.totalNum;
//         };
//         clueTable = $("#clueTable").DataTable(tb);
//     }
//
//     /**
//      * ----------------------------------------------------------------------------------------------------------------------
//      *  -----------------------------------------------相关线索-----end-----------------------------------------------
//      * ----------------------------------------------------------------------------------------------------------------------
//      */
//
//     /**
//      * ----------------------------------------------------------------------------------------------------------------------
//      *  -----------------------------------------------相关现实访----start-----------------------------------------------
//      * ----------------------------------------------------------------------------------------------------------------------
//      */
//
//     var petitioningTable = null;
//
//     $(document).ready(function(){
//
//     });
//
//     $(document).on("ifChecked","#customPetitioning",function(){
//         $("#petitioningDateRangeId").show();
//     });
//
//     $(document).on("ifUnchecked","#customPetitioning",function(){
//         $("#petitioningDateRangeId").hide();
//     });
//
//     /**
//      * 现实访查询
//      */
//     $(document).on("click","#petitioningQuery",function(){
//         petitioningTable.draw();
//     });
//
//     /**
//      * 现实访重置
//      */
//     $(document).on("click","#petitioningReset",function(){
//         $('#defaultCheckedPetitioning').iCheck('check');
//         $.laydate.reset("#petitioningDateRangeId");
//         $("#petitioningDateRangeId").hide();
//         $.select2.val("#petitioningLocation","");
//         petitioningTable.draw();
//     });
//
//     /**
//      * 现实访 tabs 点击事件
//      */
//     $(document).on("click","#petitioningTabs",function(){
//         if(petitioningTable == null){
//             initPetitioningTable();
//         }
//     });
//
//     function initPetitioningTable(){
//         var tb = $.uiSettings.getOTableSettings();
//         tb.ajax.url = context +"/crowdManage/findPetitioningsRegister";
//         tb.columnDefs = [
//             {
//                 "targets": 0,
//                 "width": "",
//                 "title": "来源地",
//                 "data": "sourceAddress" ,
//                 "render": function ( data, type, full, meta ) {
//                     return data;
//                 }
//             },
//             {
//                 "targets" : 1,
//                 "width" : "",
//                 "title" : "上访日期",
//                 "data" : "petitionDateLong",
//                 "render" : function(data, type, full, meta) {
//                     return $.date.timeToStr(data,"yyyy-MM-dd HH:mm:ss");
//                 }
//             },
//             {
//                 "targets" : 2,
//                 "width" : "",
//                 "title" : "上访部位",
//                 "data" : "position",
//                 "render" : function(data, type, full, meta) {
//
//                     return data;
//                 }
//             },
//             {
//                 "targets" : 3,
//                 "width" : "",
//                 "title" : "人员规模",
//                 "data" : "scale",
//                 "render" : function(data, type, full, meta) {
//
//                     return data;
//                 }
//             },
//             {
//                 "targets" : 4,
//                 "width" : "",
//                 "title" : "现场情况",
//                 "data" : "particularSituation",
//                 "render" : function(data, type, full, meta) {
//
//                     return data;
//                 }
//             }
//
//
//         ];
//         //是否排序
//         tb.ordering = false ;
//         //是否分页
//         tb.paging = true;
//         //每页条数
//         tb.lengthMenu = [ 10 ];
//         //默认搜索框
//         tb.searching = false ;
//         //能否改变lengthMenu
//         tb.lengthChange = false ;
//         //自动TFoot
//         tb.autoFooter = false ;
//         //自动列宽
//         tb.autoWidth = true ;
//         //是否显示loading效果
//         tb.bProcessing = true;
//         //请求参数
//         tb.paramsReq = function(d, pagerReq){
//             var arr = $.icheck.getChecked("petitioning");
//             if($(arr[0]).val()=="自定义"){
//                 var startTime = $.laydate.getDate("#petitioningDateRangeId","start") == null ? null : $.laydate.getDate("#petitioningDateRangeId","start")+" 00:00:00";
//                 var endTime = $.laydate.getDate("#petitioningDateRangeId","end") == null ? null : $.laydate.getDate("#petitioningDateRangeId","end")+" 23:59:59";
//                 var obj = {"id":crowdId,
//                     "type":$(arr[0]).val(),
//                     "startTime":startTime,
//                     "endTime":endTime,
//                     "position": $.select2.val("#petitioningLocation")
//                 };
//                 $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
//             }else{
//                 var obj = {"id":crowdId,"type":$(arr[0]).val(),"position":$.select2.val("#petitioningLocation")};
//                 $.util.objToStrutsFormData(obj, "queryUtilPojo", d);
//             }
//         };
//         tb.paramsResp = function(json) {
//             json.data = json.petitionRegistersPojo;
//             json.recordsFiltered = json.totalNum;
//             json.recordsTotal = json.totalNum;
//         };
//         petitioningTable = $("#petitioningTable").DataTable(tb);
//     }
//
//     /**
//      * ----------------------------------------------------------------------------------------------------------------------
//      *  -----------------------------------------------相关现实访-----end-----------------------------------------------
//      * ----------------------------------------------------------------------------------------------------------------------
//      */
//
//     //点击群体轨迹信息加载群体轨迹信息
//     $(document).on("click" , "#crowdTrackInfo", function(e){
//         $.bjqb.crowdDetilsTrackInfo.queryCrowdTrackInfo(crowdNameCode);
//     });
//     $(document).on("click" , "#queryBtn", function(e){
//         $.bjqb.crowdDetilsTrackInfo.queryCrowdTrackInfo(crowdNameCode);
//     });
//
//
//     /**
//      * 暴露本js方法，让其它js可调用
//      */
//     jQuery.extend($.bjqb.crowdParticulars, {
//         getNameCode : crowdNameCode,
//     });
// })(jQuery);