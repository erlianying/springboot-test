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

        var departureRegisterParameter = {
            "startTime":startTime,
            "endTime":endTime,
            "dateList":getDateList(),
        };
        var form = $.util.getHiddenForm(context +'/departureRegisterExportExcel/exportRetirementSoldierAffairDepartment',departureRegisterParameter);
        $.util.subForm(form);
    }

    function init(){
        searchTable();
    }

    function searchTable(){
        startTime = getStartTime();
        endTime = getEndTime();
        var parameter = {
            "startTime":startTime,
            "endTime":endTime,
        };
        var obj = new Object();
        $.util.objToStrutsFormData(parameter, "departureRegisterParameter", obj);
        $.ajax({
            url:context + '/departureRegisterManage/findRetirementSoldierAffairDepartment2',
            type:"post",
            dataType:"json",
            data:obj,
            success:function(page){
                departureRegisterList = page.pageList;
                initPetitionLeaveTable2(page.pageList);
            }
        })


    }
    function deleteBtnClick(){
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
        var title = "退役军人事务部登记";

        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/history/editRetirementSoldierAffairDepartment',
            pageLoading : true,
            title : title,
            width : "840px",
            height : "350px",
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

        var tb = $.uiSettings.getLocalOTableSettings();
        $.util.log(tb);
        tb.data = tableInfoLst;
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "7%",
                "title" : "日期",
                "data" : "date",
                "render" : function(data, type, full, meta) {
                    return  "<a class='petitionId' valDate = '"+data+"' valId='"+full.id+"' href='###'>"+$.date.timeToStr(data,'yyyy-MM-dd')+ "</a>" ;
                }
            },
            {
                "targets" : 1,
                "width" : "7%",
                "title" : "火车进京16时",
                "data" : "trainTo16",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "7%",
                "title" : "火车进京22时",
                "data" : "trainTo22",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "7%",
                "title" : "在京住宿16时",
                "data" : "hotelIn16",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "7%",
                "title" : "在京住宿22时",
                "data" : "hotelIn22",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "7%",
                "title" : "在京手机16时",
                "data" : "phoneIn16",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "7%",
                "title" : "在京手机22时",
                "data" : "phoneIn22",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "7%",
                "title" : "手机新进京16时",
                "data" : "phoneNewTo16",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 8,
                "width" : "7%",
                "title" : "手机新进京22时",
                "data" : "phoneNewTo22",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 9,
                "width" : "7%",
                "title" : "手机在京规模16时",
                "data" : "phoneInScale16",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 10,
                "width" : "7%",
                "title" : "手机在京规模22时",
                "data" : "phoneInScale22",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 11,
                "width" : "7%",
                "title" : "研判规模16时",
                "data" : "analysisScale16",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 12,
                "width" : "7%",
                "title" : "研判规模22时",
                "data" : "analysisScale22",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
            ,
            {
                "targets" : 13,
                "width" : "7%",
                "title" : "明日实际规模",
                "data" : "realAnalysisScale",
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
            initThead();
        }
        tb.drawCallback = function(){

        }
        petitionLeaveTable = $("#petitionLeave").DataTable(tb);
    }

    function initPetitionLeaveTable2(tableInfoLst){

        if(petitionLeaveTable != null) {
            petitionLeaveTable.destroy();
        }

        var tb = $.uiSettings.getLocalOTableSettings();
        $.util.log(tb);
        tb.data = tableInfoLst;
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "7%",
                "title" : "日期",
                "data" : "dateStr",
                "render" : function(data, type, full, meta) {
                    return  data ;
                }
            },
            {
                "targets" : 1,
                "width" : "7%",
                "title" : "火车进京",
                "data" : "trainTo",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "7%",
                "title" : "在京住宿",
                "data" : "hotelIn",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "7%",
                "title" : "在京手机",
                "data" : "phoneIn",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "7%",
                "title" : "手机新进京",
                "data" : "phoneNewTo",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "7%",
                "title" : "手机在京规模",
                "data" : "phoneInScale",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "7%",
                "title" : "研判规模",
                "data" : "analysisScale",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "7%",
                "title" : "明日实际规模",
                "data" : "analysisRealScale",
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

        };
        tb.drawCallback = function(){
            var arr = $($("#petitionLeave").find("tbody")).find("tr");
            $.each(arr, function (i, val) {
                if(i%2 == 1){
                    $($(val).find("td")[7]).remove();
                }else{
                    $($(val).find("td")[7]).attr("rowspan", 2);
                }
            });
        };
        petitionLeaveTable = $("#petitionLeave").DataTable(tb);
    }

    function initThead(){
        $("#petitionLeave thead").empty();
        var str = "<tr><th rowspan=\"2\" colspan=\"1\" >日期</th>" +
            "<th rowspan=\"1\" colspan=\"2\">火车进京</th><th rowspan=\"1\" colspan=\"2\">在京住宿</th>" +
            "<th colspan=\"2\" rowspan=\"1\">在京手机</th><th colspan=\"2\" rowspan=\"1\">手机新进京</th>" +
            "<th colspan=\"2\" rowspan=\"1\">手机在京存量</th><th rowspan=\"1\" colspan=\"2\" >研判规模</th>" +
            "<th colspan=\"1\" rowspan=\"2\">明日实际规模</th></tr>" +

            "<tr role=\"row\">" +
            "<th  tabindex=\"0\" rowspan=\"1\" colspan=\"1\" >16时</th><th rowspan=\"1\" colspan=\"1\">22时</th>" +
            "<th  tabindex=\"0\" rowspan=\"1\" colspan=\"1\" >16时</th><th rowspan=\"1\" colspan=\"1\">22时</th>" +
            "<th  rowspan=\"1\" colspan=\"1\">16时</th><th rowspan=\"1\" colspan=\"1\" >22时</th>" +
            "<th  rowspan=\"1\" colspan=\"1\">16时</th><th rowspan=\"1\" colspan=\"1\" >22时</th>" +
            "<th  rowspan=\"1\" colspan=\"1\">16时</th><th rowspan=\"1\" colspan=\"1\" >22时</th>" +
            "<th  rowspan=\"1\" colspan=\"1\">16时</th><th rowspan=\"1\" colspan=\"1\" >22时</th></tr>";
        $("#petitionLeave thead").html(str);
    }



    function  getEndTime(){
        var endDate = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end");
        if(endDate){
            endDate = $.date.endRange(endDate,"yyyy-MM-dd");
            return new Date(endDate).getTime()-1000*60*60*12;
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
            content : context + '/show/page/web/history/retirementSoldierAffairDepartmentImportLayer',
            pageLoading : true,
            title : '退役军人事务部登记',
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
                url:"/petitionRegistrationExportExcel/downloadPetitionModel?fileName=retirementSoldierAffairDepartmentModel.xlsx"
            },
            end:function(){
                init();
            }
        });
    }


})(jQuery);