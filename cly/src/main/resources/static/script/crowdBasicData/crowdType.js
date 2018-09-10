$.crowdType = $.crowdType || {};

(function($){

    "use strict";

    var crowdTypeTable = null;
    var defaultCelerityName = $("#celerityName").val();
    var crowdName = "";

    $(document).ready(function() {
        /**
         * 快速查询
         */
        $(document).on("click","#celeritySearch",function () {
            crowdName = $("#celerityName").val();
            crowdTypeTable.draw(true);
        });
        /**
         * 查询
         */
        $(document).on("click","#search",function () {
            crowdName = $("#name").val();
            crowdTypeTable.draw(true);
        });
        /**
         * 重置
         */
        $(document).on("click","#reset",function () {
            $("#type").val("");
            $("#name").val("");
            crowdName = $("#name").val();
            crowdTypeTable.draw(true);
        });
        /**
         * 新建群体类型
         */
        $(document).on("click","#add",function(){
            alertCrowdTypeCreatePage();
        });
        /**
         * 修改群体类型
         */
        $(document).on("click","#updateType",function(){
            var arr = $.icheck.getChecked("crowdType");
            if(arr.length != 1){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"修改群体类型请单选。"}) ;
                return ;
            }
            var typeId = $(arr[0]).attr("typeId");
            alertCrowdTypeUpdatePage(typeId, "群体类型", "type");
        });
        /**
         * 修改群体名称
         */
        $(document).on("click","#updateName",function(){
            var arr = $.icheck.getChecked("crowdType");
            if(arr.length != 1){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"修改群体名称请单选。"}) ;
                return ;
            }
            var nameId = $(arr[0]).attr("nameId");
            if($.util.isBlank(nameId) || "null" == nameId){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"此群体类型没有对应群体名称，不可修改群体名称。"}) ;
                return ;
            }
            alertCrowdTypeUpdatePage(nameId, "群体名称", "name");
        });
        /**
         * 删除群体类型
         */
        $(document).on("click","#delete",function(){
            var ids = getSelectedIds();
            if(ids.length < 1){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类型。"}) ;
                return ;
            }
            deleteCrowdTypeByIds(ids);
        });
        /**
         * 启用
         */
        $(document).on("click","#enabled",function(){
            var ids = getSelectedIds();
            if(ids.length < 1){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类型。"}) ;
                return ;
            }
            updateCrowdTypeStatusByIds(ids, $.common.dict.ZT_QY, "启用");
        });
        /**
         * 停用
         */
        $(document).on("click","#disable",function(){
            var ids = getSelectedIds();
            if(ids.length < 1){
                $.util.topWindow().$.layerAlert.alert({icon:0, msg:"请选择群体类型。"}) ;
                return ;
            }
            updateCrowdTypeStatusByIds(ids, $.common.dict.ZT_TY, "停用");
        });

        initCrowdTypeTable();
    });

    /**
     * 获取列表中选中的id数组
     */
    function getSelectedIds() {
        var ids = [];
        var arr = $.icheck.getChecked("crowdType");
        if(arr.length < 1){
            return ids;
        }
        $.each(arr,function (i,val) {
            var id = $(val).attr("nameId");
            if($.util.isBlank(id) || "null" == id){
                id = $(val).attr("typeId");
            }
            if($.util.isBlank(id) || "null" == id){
                return true;
            }
            ids.push(id);
        });
        return ids;
    }

    /**
     * 初始化群体类型字典项表
     */
    function initCrowdTypeTable(){
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context + "/crowdBasicDataManage/findAllCrowdTypeDictionaryByPage";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "10%",
                "title": "选择",
                "className":"table-checkbox",
                "data": "id" ,
                "render": function ( data, type, full, meta ) {
                    var a = '<input type="checkbox" name="crowdType" class="icheckbox" value="'+data+'" typeId="' + full.typeId + '" nameId="' + full.nameId + '" status="' + full.status + '" />' ;
                    return a;
                }
            },
            {
                "targets" : 1,
                "width" : "10%",
                "title" : "序号",
                "data" : "num",
                "render" : function(data, type, full, meta) {
                    return meta.row +1;
                }
            },
            {
                "targets" : 2,
                "width" : "35%",
                "title" : "群体类型",
                "data" : "type",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "35%",
                "title" : "群体名称",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "10%",
                "title" : "状态",
                "data" : "statusName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        //是否排序
        tb.ordering = false ;
        //每页条数
        tb.lengthMenu = [ 10 ];
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
            d["type"] = $("#type").val();
            if(defaultCelerityName == crowdName){
                d["name"] = "";
            }else{
                d["name"] = crowdName;
            }
        };
        tb.paramsResp = function(json) {
            var crowdTypes = json.crowdTypes;
            json.recordsTotal = json.totalNum;
            json.recordsFiltered = json.totalNum;
            json.data = crowdTypes;
        };
        tb.rowCallback = function(row,data, index) {

        };
        crowdTypeTable = $("#crowdTypeTable").DataTable(tb);
    }

    /**
     * 更新群体类型状态
     *
     * @param ids 群体id
     * @param status 状态值
     */
    function updateCrowdTypeStatusByIds(ids, status, msg) {
        var cpp = {
            "ids" : ids ,
            "status" : status
        };
        var obj = {};
        $.util.objToStrutsFormData(cpp, "cpp", obj);
        $.ajax({
            url:context + '/crowdBasicDataManage/updateCrowdDictionaryStatus',
            data:obj,
            type:"post",
            dataType:"json",
            customizedOpt:{
                ajaxLoading:true,//设置是否loading
            },
            success:function(successData){
                if(successData.status){
                    $.util.topWindow().$.layerAlert.alert({icon:6, msg: msg + "成功"}) ;
                }else{
                    $.util.topWindow().$.layerAlert.alert({icon:5, msg: msg + "失败。"}) ;
                }
                crowdTypeTable.draw(true);
            }
        });
    }

    /**
     * 根据id删除群体类型
     *
     * @param ids id数组
     */
    function deleteCrowdTypeByIds(ids){
        if(!$.util.exist(ids) || ids.length < 1){
            return ;
        }
        $.util.topWindow().$.layerAlert.confirm({
            msg:"删除后不可恢复，确定要删除吗？",
            title:"删除",	  //弹出框标题
            width:'300px',
            hight:'200px',
            shade: [0.5,'black'],  //遮罩
            icon:0,  //弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
            shift:1,  //弹出时的动画效果  有0-6种
            yes:function(index, layero){
                //点击确定按钮后执行
                var cpp = {
                    "ids" : ids
                };
                var obj = {};
                $.util.objToStrutsFormData(cpp, "cpp", obj);
                $.ajax({
                    url:context + '/crowdBasicDataManage/deleteCrowdDictionaryByIds',
                    data:obj,
                    type:"post",
                    dataType:"json",
                    customizedOpt:{
                        ajaxLoading:true,//设置是否loading
                    },
                    success:function(successData){
                        if(successData.status){
                            var msg = "删除成功。";
                            if(successData.msg.length > 0){
                                if(ids.length > 1){
                                    msg = successData.msg + "已使用，不可删除；其他删除成功。"
                                }else{
                                    msg = successData.msg + "已使用，不可删除。"
                                }
                            }
                            $.util.topWindow().$.layerAlert.alert({icon:6, msg:msg}) ;
                        }else{
                            $.util.topWindow().$.layerAlert.alert({icon:5, msg:"删除失败。"}) ;
                        }
                        crowdTypeTable.draw(true);
                    }
                });
            }
        });
    }

    /**
     * 弹出群体类型新增页面
     */
    function alertCrowdTypeCreatePage(){
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/crowdBasicData/newCrowdType',
            pageLoading : true,
            title : "新建群体类型",
            width : "508px",
            height : "380px",
            btn:["保存","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.newCrowdType ;
                    cm.saveCrowdType();
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
                crowdTypeTable.draw(true);
            }
        });
    }

    /**
     * 弹出修改页面
     *
     * @param id 字典项id
     * @param title 弹出页面title
     * @param type 修改类型 取值 type：修改群体类型，namne:修改群体名称
     */
    function alertCrowdTypeUpdatePage(id, title, type) {
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/crowdBasicData/updateCrowdType',
            pageLoading : true,
            title : "修改" + title,
            width : "508px",
            height : "300px",
            btn:["保存","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.updateCrowdType ;
                    cm.saveCrowdType();
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
                id : id ,
                title : title ,
                type : type
            },
            end:function(){
                crowdTypeTable.draw(true);
            }
        });
    }


    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.crowdType, {

    });
})(jQuery);