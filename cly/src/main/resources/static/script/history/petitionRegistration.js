(function($){
    "use strict";
    var petitionRegisterTable = null;
    var startTime;
    var endTime;
    $(document).ready(function(){
        $(document).on("click" , "#searchBtn", function(e){
            initPetitionRegisterTable();
        });
        $(document).on("click" , "#resetBtn", function(e){
            location.reload();
        });

        $(document).on("click" , "#addBtn", function(e){
            addPetitionRegistrationPage();
        });

        $(document).on("click" , "#editBtn", function(e){
            editPetitionRegistrationClick();
        });
        $(document).on("dblclick","table tbody tr",function(){
            var id = $(this).find("td:first").find("div:first").attr("valid");
            editPetitionRegistrationPage(id);
        });
        $(document).on("click" , "#deleteBtn", function(e){
            deleteBtnClick();
        });
        $(document).on("click" , "#imporBtn", function(e){
            importClick();
        });
        $(document).on("click" , "#exportBtn", function(e){
            exportClick();
        });
        init();

        $(document).on("select2:select","#crowdType",function(){
            selectCrowdType();
        })

        $.ajax({
            url: context + '/personManage/findSecondLevelByDictTypeId',
            data: {dicTypeId: "qtlx"},
            type: "post",
            success: function (successData) {
                var list = successData.simplePojos;
                $.select2.empty("#crowdName");
                $.select2.addByList("#crowdName", list, "code", "name", true, true);
            }
        });
    });

    function selectCrowdType(){
        var code = $.select2.val("#crowdType");
        $.ajax({
            url: context + '/personManage/findDictionaryItemsByParentId',
            data: {parentId: code},
            type: "post",
            success: function (successData) {
                var list = successData.simplePojos;
                $.select2.empty("#crowdName");
                $.select2.addByList("#crowdName", list, "code", "name", true, true);
            }
        });
    }

    /**
     * 导入
     */
    function importClick(){
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/history/batchImportLayer',
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
                url:"/petitionRegistrationExportExcel/downloadPetitionModel?fileName=petitionRegisterModel.xlsx"

            },
            end:function(){

            }
        });
    }





    /**
     * 导出
     */
    function   exportClick(){
        var petitionRegisteParameter = {
            "query" : $("#query").val(),
            "sourceAddress" : $("#sourceAddress").val(),
            "crowdType": $.select2.val("#crowdType"),
            "crowdName": $.select2.val("#crowdName"),
            "nature": $.select2.val("#nature"),
            "position": $.select2.val("#position"),
            "startTime":startTime,
            "endTime":endTime,
            "idList":getPetitionRegistrationList(),
            "particularSituation":$("#particularSituation").val(),
            "minScale":$("#minScale").val(),
            "maxScale":$("#maxScale").val()
        };
        var form = $.util.getHiddenForm(context +'/petitionRegistrationExportExcel/exportPetitionRegiste',petitionRegisteParameter);
        $.util.subForm(form);
    }

    function  deleteBtnClick(){
        if(getPetitionRegistrationList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"至少勾选一项进行删除!",title:"提示"});
            return false;
        }

        $.util.topWindow().$.layerAlert.confirm({
            msg:"确认删除吗？",
            title:"提示",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            yes:function(index, layero){
                deletePetitionRegistration();
            }
        });
    }

    function deletePetitionRegistration(){

        var data = {
            idList : getPetitionRegistrationList()
        }
        var obj = new Object();;
        $.util.objToStrutsFormData(data, "idList", obj);
        $.ajax({
            url:context +'/petitionRegisterManage/deletePetitionRegistration',
            data:obj,
            type:'post',
            success:function(successData){
                $.util.topWindow().$.layerAlert.alert({msg:"删除成功!",title:"提示",end:function(){
                    location.reload();
                }});

            }
        })

    }

    function init(){
        $.ajax({
            url:context + '/petitionRegisterManage/findCrowdDictionary',
            type:"post",
            dataType:"json",
            success:function(dictionaryPojo){
                initDictionary(dictionaryPojo);
                initPetitionRegisterTable();
            }
        })
    }

    function initDictionary(dictionaryPojo){
        $.select2.addByList("#crowdType",dictionaryPojo.crowdType,"id","name",true,true);
        $.select2.addByList("#nature",dictionaryPojo.nature,"id","name",true,true);
        $.select2.addByList("#position",dictionaryPojo.position,"id","name",true,true);
    }

    function editPetitionRegistrationClick(){
        if(getPetitionRegistrationList().length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"您未勾选,请勾选一项进行编辑!",title:"提示"});
            return false;
        }
        if(getPetitionRegistrationList().length > 1){
            $.util.topWindow().$.layerAlert.alert({msg:"您选择的人员大于一项,请勾选一项进行编辑!",title:"提示"});
            return false;
        }
        var id = getPetitionRegistrationList()[0];
        editPetitionRegistrationPage(id);

    }

    function getPetitionRegistrationList(){
        var idList = [];
        $.each($(".checked"), function (e,m) {
            console.log($(m).parent(".divid"));
            var str = $(m).parent(".divid").attr("valid");
            idList.push(str);
        })
        return idList;
    }

    /**
     * 弹出新增页面
     *
     */
    function addPetitionRegistrationPage(crowdId){
        var title = "新增上访信息";

        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/history/addPetitionRegistration',
            pageLoading : true,
            title : title,
            width : "800px",
            height : "420px",
            btn:["保存","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.addPetitionRegistrationLayer ;
                    cm.savePetitionRegistration();
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{

            },
            end:function(){
                initPetitionRegisterTable();
            }
        });
    }

    /**
     * 弹出编辑页面
     *
     * @param id 上访id
     */
    function editPetitionRegistrationPage(id){
        var title = "编辑上访信息";

        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/history/editPetitionRegistration',
            pageLoading : true,
            title : title,
            width : "800px",
            height : "420px",
            btn:["修改","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.editPetitionRegistrationLayer ;
                    cm.editPetitionRegistration();
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
                id : id
            },
            end:function(){
                initPetitionRegisterTable();
            }
        });
    }


    /**
     * 上访 情况table
     */
    function initPetitionRegisterTable(){
        startTime = $.bjqb.getTimeJs.getStartTime();
        endTime = $.bjqb.getTimeJs.getEndTime();
        if(petitionRegisterTable != null) {
            petitionRegisterTable.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/petitionRegisterManage/findPetitionRegister";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "4%",
                "title" : "",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    return "<div class='divid' valid='"+data+"'><input name='check' type='checkbox' class='icheckbox'></div>";
                }
            },{
                "targets" : 1,
                "width" : "4%",
                "title" : "序号",
                "data" : "",
                "render" : function(data, type, full, meta) {
                    return meta.row+1;
                }
            },{
                "targets" : 2,
                "width" : "12%",
                "title" : "上访日期",
                "data" : "petitionDateStr",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" :3,
                "width" : "5%",
                "title" : "星期",
                "data" : "week",
                "render" : function(data, type, full, meta) {
                    return  data;
                }
            },
            {
                "targets" : 4,
                "width" : "9%",
                "title" : "群体类别",
                "data" : "crowdType",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "9%",
                "title" : "群体名称",
                "data" : "crowdName",
                "render" : function(data, type, full, meta) {
                    if(data != null && data != "") {
                        return data;
                    } else {
                        return full.excelCrowdName;
                    }

                }
            },
            // {
            //     "targets" : 6,
            //     "width" : "9%",
            //     "title" : "上访性质",
            //     "data" : "nature",
            //     "render" : function(data, type, full, meta) {
            //         return data;
            //     }
            // },
            {
                "targets" : 6,
                "width" : "9%",
                "title" : "上访部位",
                "data" : "position",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "6%",
                "title" : "人员规模",
                "data" : "scale",
                "render" : function(data, type, full, meta) {
                    if(data == 0){
                        return "";
                    }
                    return data;
                }
            },
            {
                "targets" : 8,
                "width" : "7%",
                "title" : "人员所属地",
                "data" : "sourceAddress",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 9,
                "width" : "20%",
                "title" : "现场详细情况",
                "data" : "particularSituation",
                "render" : function(data, type, full, meta) {
                    if(data.length > 20){
                        var str = '<div class="fi-ceng-out">' + data.substr(0,20) + '...' +
                            '<div class="fi-ceng"><p style="padding: 5px 10px;">' + data + '</p></div></div>';
                        return str;
                    }else{
                        return data;
                    }
                }
             }
            // ,{
            //     "targets" : 10,
            //     "width" : "9%",
            //     "title" : "本市采集",
            //     "data" : "thisCity",
            //     "render" : function(data, type, full, meta) {
            //         return data;
            //     }
            // }

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
        //请求参数
        tb.paramsReq = function(d, pagerReq){
            var obj = {
                "query" : $("#query").val(),
                "sourceAddress" : $("#sourceAddress").val(),
                "crowdType": $.select2.val("#crowdType"),
                "crowdName": $.select2.val("#crowdName"),
                "nature": $.select2.val("#nature"),
                "position": $.select2.val("#position"),
                "startTime":startTime,
                "endTime":endTime,
                "particularSituation":$("#particularSituation").val(),
                "minScale":$("#minScale").val(),
                "maxScale":$("#maxScale").val()
            };
            $.util.objToStrutsFormData(obj, "petitionRegisteParameter", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.pageList;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
        };
        petitionRegisterTable = $("#petitionRegister").DataTable(tb);
    }



})(jQuery);