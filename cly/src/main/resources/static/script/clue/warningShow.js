(function($){
    "use strict";

    var table1 = null;
    var table2 = null;
    var table3 = null;
    var table4 = null;
    var table5 = null;
    var table6 = null;
    var table7 = null;

    //综合查询字典项初始化状态

    $(document).ready(function() {
        initData();
        $(document).on("click","#changeValue",function(){
            window.top.$.layerAlert.dialog({
                content : context +  '/show/page/web/clue/changeWarningSettings',
                pageLoading : true,
                title:"配置",
                width : "600px",
                height : "800px",
                shadeClose : false,
                initData:function(){
                    return $.util.exist(initData)?initData:{} ;
                },
                success:function(layero, index){

                },
                end:function(){
                },
                btn:["确定", "取消"],
                callBacks:{
                    btn1:function(index, layero){
                        var cm = window.top.frames["layui-layer-iframe"+index].$.common;
                        var obj = cm.getValue();
                        $.ajax({
                            url:context +'/clue/changeWarningSettings',
                            type:'post',
                            data:obj,
                            dataType:'json',
                            success:function(successData){
                                initData();
                                window.top.layer.close(index);
                            }
                        });
                    },
                    btn2:function(index, layero){
                        window.top.layer.close(index);
                    }
                }
            });
        })
    });
    function initData(){
        $.ajax({
            url:context +'/clue/clueWarning',
            type:'post',
            dataType:'json',
            success:function(successData){
                initTable1(successData.data1);
                initTable2(successData.data2);
                initTable3(successData.data3);
                initTable4(successData.data4);
                initTable5(successData.data5);
                initTable6(successData.data6);
                initTable7(successData.data7);
            }
        });
    }
    function initTable1(data){
        if(table1 != null){
            table1.destroy();
        }
        var tb = getTableSettings();
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "指向时间",
                "data" : "targetTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSite",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "条数统计",
                "data" : "clueCount",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.data = data;
        table1 = $("#table1").DataTable(tb);
    }

    function initTable2(data){
        if(table2 != null){
            table2.destroy();
        }
        var tb = getTableSettings();
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "线索内容",
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
                "targets" : 1,
                "width" : "",
                "title" : "涉及群体",
                "data" : "involveCrowd",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "指向时间",
                "data" : "targetTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSite",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "受众人员",
                "data" : "peopleQuantity",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.data = data;
        table2 = $("#table2").DataTable(tb);
    }

    function initTable3(data){
        if(table3 != null){
            table3.destroy();
        }
        var tb = getTableSettings();
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "涉及群体",
                "data" : "involveCrowd",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "指向时间",
                "data" : "targetTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSite",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "响应人数",
                "data" : "peopleQuantity",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.data = data;
        table3 = $("#table3").DataTable(tb);
    }

    function initTable4(data){
        if(table4 != null){
            table4.destroy();
        }
        var tb = getTableSettings();
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSite",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            // {
            //     "targets" : 1,
            //     "width" : "",
            //     "title" : "涉及群体",
            //     "data" : "involveCrowd",
            //     "render" : function(data, type, full, meta) {
            //         return data;
            //     }
            // },
            {
                "targets" : 1,
                "width" : "",
                "title" : "指向时间",
                "data" : "targetTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "条数统计",
                "data" : "clueCount",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
            // {
            //     "targets" : 3,
            //     "width" : "",
            //     "title" : "响应人数",
            //     "data" : "peopleQuantity",
            //     "render" : function(data, type, full, meta) {
            //         return data;
            //     }
            // }
        ];
        tb.data = data;
        table4 = $("#table4").DataTable(tb);
    }

    function initTable5(data){
        if(table5 != null){
            table5.destroy();
        }
        var tb = getTableSettings();
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "线索等级",
                "data" : "level",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "线索内容",
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
                "targets" : 2,
                "width" : "",
                "title" : "涉及群体",
                "data" : "involveCrowd",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "指向时间",
                "data" : "targetTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSite",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.data = data;
        table5 = $("#table5").DataTable(tb);
    }

    function initTable6(data){
        if(table6 != null){
            table6.destroy();
        }
        var tb = getTableSettings();
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "行为方式",
                "data" : "wayOfAct",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "线索内容",
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
                "targets" : 2,
                "width" : "",
                "title" : "涉及群体",
                "data" : "involveCrowd",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "指向时间",
                "data" : "targetTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSite",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.data = data;
        table6 = $("#table6").DataTable(tb);
    }

    function initTable7(data){
        if(table7 != null){
            table7.destroy();
        }
        var tb = getTableSettings();
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "敏感日",
                "data" : "targetTimeLong",
                "render" : function(data, type, full, meta) {
                    if(data != null){
                        return $.date.timeToStr(data, "yyyy-MM-dd");
                    }else{
                        return "";
                    }
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "敏感群体",
                "data" : "involveCrowd",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "线索内容",
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
                "targets" : 3,
                "width" : "",
                "title" : "指向地点",
                "data" : "targetSite",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.data = data;
        table7 = $("#table7").DataTable(tb);
    }

    function getTableSettings(){
        var tb = $.uiSettings.getLocalOTableSettings();
        //是否排序
        tb.ordering = false ;
        //每页条数
        tb.lengthMenu = [ 10 ] ;
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
        return tb;
    }
})(jQuery);