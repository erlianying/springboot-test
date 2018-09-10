(function($){
    "use strict";
    var petitionLeaveTable = null;
    var startTime;
    var endTime;
    var lastYear;
    var departureRegisterList;
    $(document).ready(function(){
        $(document).on("click" , "#searchBtn", function(e){
            searchTable();
        });
        $(document).on("click" , "#resetBtn", function(e){
            location.reload();
        });

        $(document).on("click" , "#editBtn", function(e){
            editPage();
        });

        $(document).on("click" , "#imporBtn", function(e){
            importClick();
        });

        $(document).on("click" , "#exportBtn", function(e){
            exportClick();
        });

        $(document).on("click" , ".petitionId", function(e){
            editPage($(this).attr("valDate"));
        });

        init();
    });

    /**
     * 导出
     */
    function exportClick(){
        startTime = getStartTime();
        endTime = getEndTime();
        var emphasisArea = null;
        if($.select2.val("#emphasisArea")){
            emphasisArea = $.select2.val("#emphasisArea");
        }else{
            emphasisArea = 'zdqy0005';
        }
        var departureRegisterParameter = {
            "emphasisArea": emphasisArea,
            "startTime":startTime,
            "endTime":endTime,
            "dateList":getDateList(),
        };
        var form = $.util.getHiddenForm(context +'/departureRegisterExportExcel/exportDepartureRegister',departureRegisterParameter);
        $.util.subForm(form);
    }

    function init(){
        $.ajax({
            url:context + '/departureRegisterManage/findDictionary',
            type:"post",
            dataType:"json",
            success:function(dictionaryPojo){
                var emphasisArea = [];
                for(var i in dictionaryPojo.emphasisArea){
                    if(dictionaryPojo.emphasisArea[i].name !=  "四个重点区域"){
                        emphasisArea.push(dictionaryPojo.emphasisArea[i]);
                    }
                }
                for(var i in dictionaryPojo.emphasisArea){
                    if(dictionaryPojo.emphasisArea[i].name ==  "四个重点区域"){
                        emphasisArea.push(dictionaryPojo.emphasisArea[i]);
                    }
                }
                $.select2.addByList("#emphasisArea",emphasisArea,"id","name",true,true);
                searchTable();
            }
        })
    }

    function searchTable(){
        startTime = getStartTime();
        endTime = getEndTime();
        var emphasisArea = null;
        if($.select2.val("#emphasisArea")){
            emphasisArea = $.select2.val("#emphasisArea");
        }else{
            emphasisArea = 'zdqy0005';
        }
        var parameter = {
            "emphasisArea": emphasisArea,
            "startTime":startTime,
            "endTime":endTime,
        };
        var obj = new Object();
        $.util.objToStrutsFormData(parameter, "departureRegisterParameter", obj);
        $.ajax({
            url:context + '/departureRegisterManage/findPetitionRegister',
            type:"post",
            dataType:"json",
            data:obj,
            success:function(page){
                departureRegisterList = page.pageList;
                initPetitionLeaveTable(page.pageList);
            }
        })


    }
    function deleteBtnClick(){
        if(!$.select2.val("#emphasisArea")){
            $.util.topWindow().$.layerAlert.alert({msg:"只有在选择一个重点区域后才能进行删除!",title:"提示"});
            return false;
        }
        if(getIdList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"您未勾选,至少勾选一项进行删除!",title:"提示"});
            return false;
        }
        var data = getIdList()[0];

        $.util.topWindow().$.layerAlert.confirm({
            msg:"确认删除吗？",
            title:"提示",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            yes:function(index, layero){
                deletePetitionLeave();
            }
        });
    }

    function deletePetitionLeave(){
        var ids = [];
       var arr = getIdList();
       for(var i in arr){
            if(arr[i] && arr[i].id  && arr[i].id != "null"){
                ids.push(arr[i].id);
            }
       }
        if(ids.length <= 0 ){
            $.util.topWindow().$.layerAlert.alert({msg:"您选的行没有上访带离情况,不需要进行删除!",title:"提示"});
            return false;
        }
        var data = {
            idList : ids
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "idList", obj);
        $.ajax({
            url:context +'/departureRegisterManage/deleteDepartureRegister',
            data:obj,
            type:'post',
            success:function(successData){
                $.util.topWindow().$.layerAlert.alert({msg:"删除成功!",title:"提示",end:function(){
                    location.reload();
                }});

            }
        })

    }

    function getIdList(){
        var idList = [];
        $.each($(".checked"), function (e,m) {
            console.log($(m).parent(".divid"));
            var str = {
                "id" :  $(m).parent(".divid").attr("valid"),
                "date" :  $(m).parent(".divid").attr("valDate"),
            }
            idList.push(str);
        })
        return idList;
    }


    function getDateList(){
        var dateList = [];
        $.each($(".checked"), function (e,m) {
            console.log($(m).parent(".divid"));
            var str = $(m).parent(".divid").attr("valDate");
            dateList.push(str);
        })
        return dateList;
    }

    // /**
    //  * 弹出新增页面
    //  *
    //  */
    // function addPage(){
    //     var title = "新增上访带离信息";
    //
    //     $.util.topWindow().$.layerAlert.dialog({
    //         content : context + '/show/page/web/history/addPetitionLeave',
    //         pageLoading : true,
    //         title : title,
    //         width : "800px",
    //         height : "620px",
    //         btn:["保存","取消"],
    //         callBacks:{
    //             btn1:function(index, layero){
    //                 var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.addPetitionLeaveLayer ;
    //                 cm.save();
    //             },
    //             btn2:function(index, layero){
    //                 $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
    //             }
    //         },
    //         shadeClose : false,
    //         success:function(layero, index){
    //
    //         },
    //         initData:{
    //
    //         },
    //         end:function(){
    //             searchTable();
    //         }
    //     });
    // }

    /**
     * 弹出编辑页面
     *
     * @param id 上访id
     */
    function editPage(editTime){
        var title = "编辑上访带离信息";

        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/history/editPetitionLeave',
            pageLoading : true,
            title : title,
            width : "1000px",
            height : "620px",
            btn:["修改","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.editPetitionLeaveLayer ;
                    cm.edit();
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
                editTime : editTime
            },
            end:function(){
                searchTable();
            }
        });
    }

    //
    // /**
    //  * 弹出详情页面
    //  *
    //  * @param id 上访id
    //  */
    // function detailPage(data){
    //     var title = "查看上访带离详细信息";
    //
    //     $.util.topWindow().$.layerAlert.dialog({
    //         content : context + '/show/page/web/history/petitionLeaveDetail',
    //         pageLoading : true,
    //         title : title,
    //         width : "800px",
    //         height : "620px",
    //         btn:["关闭"],
    //         callBacks:{
    //             btn1:function(index, layero){
    //                 $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
    //             }
    //         },
    //         shadeClose : false,
    //         success:function(layero, index){
    //
    //         },
    //         initData:{
    //             data : data
    //         },
    //         end:function(){
    //         }
    //     });
    // }


    function initPetitionLeaveTable(tableInfoLst){

        if(petitionLeaveTable != null) {
            petitionLeaveTable.destroy();
        }
        if(!$.select2.val("#emphasisArea")){
            var petitionNum = "四个重点区域<br/>带离上访人员"
        }else{
            var petitionNum = $.select2.text("#emphasisArea") +"<br/>带离上访人员"
        }

        var tb = $.uiSettings.getLocalOTableSettings();
        $.util.log(tb);
        tb.data = tableInfoLst;
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "7%",
                "title" : "上访日期",
                "data" : "petitionDateLong",
                "render" : function(data, type, full, meta) {
                    return  "<a class='petitionId' valDate = '"+data+"' valId='"+full.id+"' valWeek='"+full.weekStr+"' href='###'>"+$.date.timeToStr(data,'yyyy-MM-dd')+ "</a>" ;
                }
            },{
                "targets" : 1,
                "width" : "10%",
                "title" : "星期",
                "data" : "weekStr",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :2,
                "width" : "7%",
                "title" : petitionNum,
                "data" : "petitionNum",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 3,
                "width" : "7%",
                "title" : "集访批次",
                "data" : "allPeopleBatch",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "7%",
                "title" : "全部人员集访人次",
                "data" : "allPeopleGroupNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "7%",
                "title" : "全部人员个人访人次",
                "data" : "allPeopleNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "7%",
                "title" : "本市人员集访批次",
                "data" : "thisCityPeopleBatch",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "7%",
                "title" : "本市人员集访人次",
                "data" : "thisCityPeopleGroupNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 8,
                "width" : "7%",
                "title" : "本市人员个人访人次",
                "data" : "thisCityPeopleNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 9,
                "width" : "7%",
                "title" : "上访总数",
                "data" : "allRegisterNum",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 10,
                "width" : "7%",
                "title" : "极端访批次",
                "data" : "extremeBatch",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 11,
                "width" : "7%",
                "title" : "极端访人次",
                "data" : "extremePeopleNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 12,
                "width" : "7%",
                "title" : lastYear + "年总数",
                "data" : "lastYearNum",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 13,
                "width" : "7%",
                "title" : "寻衅滋事批次",
                "data" : "quarrelPeopleBatch",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 14,
                "width" : "7%",
                "title" : "寻衅滋事人次",
                "data" : "quarrelPeopleNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
            ,
            {
                "targets" : 15,
                "width" : "7%",
                "title" : "三板接待人数",
                "data" : "receptionPeopleNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
            ,
            {
                "targets" : 16,
                "width" : "7%",
                "title" : "久敬庄接济服务中心接收上访人人次",
                "data" : "jjzPeopleNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
            ,
            {
                "targets" : 17,
                "width" : "7%",
                "title" : "久敬庄去年接济服务中心接收上访人人次",
                "data" : "jjzPeopleNumberOfLastYear",
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
        tb.lengthMenu = [ 50,10 ]; //每页条数
        tb.lengthChange = true; //是否可以改变每页显示条数
        tb.initComplete = function(){ //表格加载完成后执行的函数
            initThead(petitionNum);
        }
        petitionLeaveTable = $("#petitionLeave").DataTable(tb);
    }

    function initThead(petitionNum){
        $("#petitionLeave thead").empty();
        var str = "<tr><th rowspan=\"2\" colspan=\"1\" >上访日期</th>" +
            "<th rowspan=\"2\" colspan=\"1\">星期</th><th rowspan=\"2\" colspan=\"1\">" + petitionNum + "</th>" +
            "<th colspan=\"3\" rowspan=\"1\">全部人员</th><th colspan=\"4\" rowspan=\"1\">本市人员</th>" +
            "<th  colspan=\"2\" rowspan=\"1\">极端访</th><th rowspan=\"2\" colspan=\"1\" >"+lastYear+"年总数</th>" +
            "<th colspan=\"2\" rowspan=\"1\">寻衅滋事</th><th colspan=\"1\" rowspan=\"2\">三办接待<br/>上访人次</th>" +
            "<th colspan=\"2\" rowspan=\"1\">久敬庄接收<br/>上访人次</th></tr>" +
            "<tr role=\"row\"><th tabindex=\"0\" rowspan=\"1\" colspan=\"1\" >集访批次</th>" +
            "<th  tabindex=\"0\" rowspan=\"1\" colspan=\"1\" >集访人次</th><th rowspan=\"1\" colspan=\"1\">个人访</th>" +
            "<th tabindex=\"0\" rowspan=\"1\" colspan=\"1\" >集访批次</th><th rowspan=\"1\" colspan=\"1\" >集访人次</th>" +
            "<th rowspan=\"1\" colspan=\"1\" >个人访</th><th rowspan=\"1\" colspan=\"1\">上访总数</th>" +
            "<th  rowspan=\"1\" colspan=\"1\">批次</th><th rowspan=\"1\" colspan=\"1\" >人次</th>" +
            "<th  rowspan=\"1\" colspan=\"1\">起</th><th rowspan=\"1\" colspan=\"1\" >次</th>" +
            "<th  rowspan=\"1\" colspan=\"1\">当日</th><th rowspan=\"1\" colspan=\"1\" >去年当日</th></tr>"
        $("#petitionLeave thead").html(str);
    }


    function  getEndTime(){
        var endDate = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end");
        if(endDate){
            endDate = $.date.endRange(endDate,"yyyy-MM-dd");
            return new Date(endDate).getTime()+1000*60*60*12;
        }else{
            var date = new Date();
            date = new Date(date.getTime() + 1000*60*60*24);
            date.setHours(0,0,0,0);
            return  date.getTime();
        }
    }

    function  getStartTime(){
        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        if(startDate){
            lastYear = startDate.substring(0,4) - 1;
            var date = new Date(startDate);
            return date.getTime() - 1000*60*60*8;
        }else{
            var date = new Date();
            startDate = $.date.timeToStr(date.getTime(),'yyyy-MM-dd');
            lastYear = startDate.substring(0,4) - 1;
            date.setDate(1);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        }
    }

    /**
     * 导入
     */
    function importClick(){
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/history/departureRegisterImportLayer',
            pageLoading : true,
            title : '上访情况导入',
            width : "508px",
            height : "400px",
            btn:["导入","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.historyBachImportExcel;  //获取弹窗界面的操作对象
                    cm.submitMethod();//弹窗界面的方法
                },
                btn2:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.historyBachImportExcel;  //获取弹窗界面的操作对象
                    var id= cm.findObj();//获取值
                    if(id){
                        removeAttachment(id);//如果有上传id的话
                    }
                    $.util.topWindow().$.layerAlert.closeWithLoading(index);
                    //关闭弹窗
                },

            },
            success:function(layero, index){

            },
            initData:{
                url:"/petitionRegistrationExportExcel/downloadPetitionModel?fileName=departureRegisterModel.xlsx"
            },
            end:function(){

            }
        });
    }


})(jQuery);