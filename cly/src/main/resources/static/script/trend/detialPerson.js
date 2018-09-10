
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var pageIndex = frameData.index ;//当前弹窗index
    var initData = frameData.initData ;
    var idmumberList = initData.idmumberList;
    var table = null;


    $(document).ready(function(){
        init();
    })

    function init(){

        window.top.$.common.showOrHideLoading(true);
        $.ajax({
            url: context + '/inBeijingMap/findTrackPersonDetial',
            data: {idmumberList:idmumberList},
            type: "post",
            success: function (map) {
                window.top.$.common.showOrHideLoading(false);
                var mapList = map.inBeiJingMap;
                initTable(mapList);
            },
            error:function(){
                window.top.$.common.showOrHideLoading(false);
            }
        });
    }

    /**
     * 人员table
     */
    function initTable(tableInfoLst){
        if(table != null) {
            table.destroy();
        }
        var tb = $.uiSettings.getLocalOTableSettings();
        $.util.log(tb);
        tb.data = tableInfoLst;
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "16%",
                "title" : "姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },{
                "targets" : 1,
                "width" : "20%",
                "title" : "身份证号",
                "data" : "idNumber",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },{
                "targets" : 2,
                "width" : "16%",
                "title" : "手机号",
                "data" : "phoneNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :3,
                "width" : "16%",
                "title" : "户籍地址",
                "data" : "address",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 4,
                "width" : "16%",
                "title" : "重点人类别",
                "data" : "importantPerson",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "16%",
                "title" : "前科类别",
                "data" : "qklb",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        tb.ordering = false;
        tb.hideHead = false;
        tb.dom = null;
        tb.searching = false;
        tb.lengthChange = false;
        tb.paging = true;
        tb.info = true;
        tb.lengthMenu = [ 10 ];
        tb.initComplete = function(){ //表格加载完成后执行的函数
        }
        table = $("#table").DataTable(tb);
    }
