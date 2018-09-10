(function($){
    "use strict";

    var table = null;
    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var initData = frameData.initData ;
    var type = initData.type;
    var titleContent = initData.titleContent;

    $(document).ready(function() {
        init();
    });
    function init(){
        var data = {type: type}
        var obj = new Object();
        $.util.objToStrutsFormData(data, "queryUtilPojo", obj);
        $.ajax({
            url:context + '/crowdManage/findCrowdByCrowdTypeCode',
            type:"post",
            dataType:"json",
            data:obj,
            success:function(map){
                var  tableList = map.crowd;
                initTable(tableList);

            }
        })
    }

    function initTable(tableList){
        if(table != null){
            table.destroy();
        }
        var tb = $.uiSettings.getLocalOTableSettings();
        $.util.log(tb);
        tb.data = tableList;
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "群体名称",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return  '<h2 class="m-ui-infott xiaoshou aa ">' + data + '</h2>';
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "人员数量",
                "data" : "count",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "常住人口",
                "data" : "permanentPopulation",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "暂住人口",
                "data" : "temporaryPopulation",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "有手机号码数量",
                "data" : "personPhoneCount",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "重点上访人员",
                "data" : "keyPersonPetitioningNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "国家信访局上访人员",
                "data" : "petitionLetterNumber",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "入库时间",
                "data" : "recordTimeStr",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            }

        ];
        tb.ordering = false;
        tb.paging = true; //分页是否
        tb.hideHead = false; //是否隐藏表头
        tb.searching = false; //是否有查询输入框
        tb.info = true; //是否显示详细信息
        tb.bProcessing = true;//是否显示loading效果
        tb.lengthMenu = [ 10 ]; //每页条数
        tb.lengthChange = true; //是否可以改变每页显示条数
        tb.initComplete = function(){ //表格加载完成后执行的函数
            var count  = 0;
            var personNum = 0;//人口数量
            var permanentPopulation = 0;//常住人口
            var temporaryPopulation = 0;//暂住人口
            var personPhoneCount = 0;//有手机号的人员
            var keyPersonPetitioningNumber = 0;//重点上访人员
            var petitionLetterNumber = 0;//国家信访局上访人员
            $.each(tableList,function(i,obj){
                count++;
                personNum += obj.count;
                permanentPopulation += obj.permanentPopulation;
                temporaryPopulation += obj.temporaryPopulation;
                personPhoneCount += obj.personPhoneCount;
                keyPersonPetitioningNumber += obj.keyPersonPetitioningNumber;
                petitionLetterNumber += obj.petitionLetterNumber;
            })

            $("#carTable thead").empty();
            var str = "<tr><th>群体名称</th><th>人员数量</th><th>常住人口</th><th>暂住人口</th>" +
                "<th>有手机号码数量</th><th>重点上访人员</th><th>国家信访局上访人员</th><th>入库时间</th></tr>" +
                "< ><td ><span style='color:#f45b5b;'>总计</span></td><td> <span style='color:#f45b5b;'>"+personNum+"</span></td><td> <span style='color:#f45b5b;'>"+permanentPopulation+"</span></td><td><span style='color:#f45b5b;'>"+temporaryPopulation+"</span></td>" +
                "<td><span style='color:#f45b5b;'>"+personPhoneCount+"</span></td><td><span style='color:#f45b5b;'>"+keyPersonPetitioningNumber+"</span></td><td><span style='color:#f45b5b;'>"+petitionLetterNumber+"</span></td><td></td></tr>"
            $("#carTable thead").html(str);

        }
        table = $("#carTable").DataTable(tb);
    }

})(jQuery);