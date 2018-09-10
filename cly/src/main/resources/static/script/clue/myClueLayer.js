(function($){
    "use strict";

    var data;
    var otherQuery;
    var showIdList;
    var clueTable = null;
    $(document).ready(function() {
        var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
        data = frameData.initData.data;
        otherQuery = frameData.initData.otherQuery;
        showIdList = frameData.initData.showIdList;
        initClueTable();
    });

    $(document).on("dblclick","table.table-select tbody tr",function(){
        var clueId = $($($(this).find("td")[0]).find("span")[0]).attr("clueId");
        if(!$.util.isBlank(clueId)){
            $.util.topWindow().$.common.setIframeLocation(context + '/show/page/web/clue/viewClue?clueId=' + clueId);
            $.util.topWindow().$.layerAlert.closeAll();
        }
    });

    /**
     * 初始化线索表
     */
    function initClueTable(){
        if(clueTable != null){
            clueTable.destroy();
        }
        var url;
        if(showIdList != null){
            url = context + "/clue/showListClue";
        }else if(otherQuery == true){
            url = context + "/clueFlow/findClueListForLittleWindow";
        }else{
            url = context + "/clueFlow/findMyNewClue";
        }

        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = url;
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "",
                "title": "序号",
                "data": "id" ,
                "render": function ( data, type, full, meta ) {
                    var level = "";
                    if(full.level == $.common.dict.QBJB_YJ){
                        level = "level1";
                    }
                    if(full.level == $.common.dict.QBJB_EJ){
                        level = "level2";
                    }
                    if(full.level == $.common.dict.QBJB_SJ){
                        level = "level3";
                    }
                    return '<span class="fa fa-star ' + level + '" clueId="' + data + '"></span>' + (meta.row + 1);
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "录入时间",
                "data" : "writeTimeLong",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data, "yyyy-MM-dd");
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "线索编码",
                "data" : "code",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "来源单位",
                "data" : "sourceUnitTwoName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "线索类别",
                "data" : "typeName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "涉访群体",
                "data" : "involveCrowdTwoName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "内容",
                "data" : "content",
                "render" : function(data, type, full, meta) {
                    if(data.length > 12){
                        var str = '<div class="fi-ceng-out">' + data.substr(0,12) + '...' +
                            '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "指向开始时间",
                "data" : "startTimeLong",
                "render" : function(data, type, full, meta) {
                    return $.date.timeToStr(data, "yyyy-MM-dd");
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSiteBeanList",
                "render" : function(data, type, full, meta) {
                    var str = "";
                    if(data != null){
                        for (var i in data){
                            str += data[i].site + ";";
                        }
                    }
                    if(str != ""){
                        str.substr(0, str.length - 1);
                    }
                    return str;
                }
            },
            {
                "targets" : 9,
                "width" : "",
                "title" : "线索状态",
                "data" : "statusName",
                "render" : function(data, type, full, meta) {
                    if(full.irStatusList != null && full.irStatusList.length > 0){
                        var str = '<div class="fi-ceng-out">' + data +
                            '<div class="fi-ceng fi-ceng-s"><table class="table table-border table-condensed">' +
                            '<thead><tr><th>通报单位</th><th>接收状态</th></tr></thead><tbody>';
                        for(var i in full.irStatusList){
                            var obj = full.irStatusList[i];
                            if(obj.name == "待接收"){
                                str += '<tr>'+
                                    '<td>' + obj.code + '</td>'+
                                    '<td class="fc-red">' + obj.name + '</td>'+
                                    '</tr>';
                            }else{
                                str += '<tr>'+
                                    '<td>' + obj.code + '</td>'+
                                    '<td>' + obj.name + '</td>'+
                                    '</tr>';
                            }
                        }
                        str += '</tbody></table></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
        //每页条数
        tb.lengthMenu = [ 5 ];
        //默认搜索框
        tb.searching = false ;
        //能否改变lengthMenu
        tb.lengthChange = false ;
        //自动TFoot
        tb.autoFooter = false ;
        //自动列宽
        tb.autoWidth = false ;
        //是否显示loading效果
        tb.bProcessing = true;
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var obj = {};
            if(!$.util.isBlank(showIdList)){
                $.util.objToStrutsFormData(showIdList, "idLst", d);
            }else if(otherQuery == true){
                obj.targetSiteSite = data.targetSite;
                obj.startTimeOneLong = data.startTime;
                obj.startTimeTwoLong = data.endTime;
                obj.involveCrowdTwo = data.crowd;
                obj.start = d.start;
                obj.length = d.length;
                $.util.objToStrutsFormData(obj, "cqp", d);
                $.util.objToStrutsFormData("false", "myClue", d);
            }else{
                var obj = {};
                obj.start = d.start;
                obj.length = d.length;
                $.util.objToStrutsFormData(obj, "mcp", d);
            }

        };
        tb.paramsResp = function(json) {

        };
        tb.rowCallback = function(row,data, index) {

        };
        clueTable = $("#clueTable").DataTable(tb);
    }

})(jQuery);