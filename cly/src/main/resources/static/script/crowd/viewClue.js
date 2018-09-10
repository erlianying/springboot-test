
(function($){
    "use strict";
    var personTable = null; //关联人员
    var regTranContent = "";
    var crowdType;
    var crowdName;

    $(document).ready(function() {
        $.ajax({
            url:context +'/clueFlow/editCheckFlag',
            type:'post',
            data:{clueId : clueId},
            dataType:'json',
            success:function(successData){
            }
        })
        regTranContent = new RegExp(tranContent,"gim");
        initData();
        events();
    });

    function events(){

        $(document).on("click","#backUrl",function(){
            window.top.history.back();
        });

        $(document).on("click" , "#addBtn", function(e){
            addBtnClick();
        });

    }

    /**
     * 得到当前idList
     *
     */
    function getIdList(){
        var idList = [];
        $.each($(".checked"), function (e,m) {
            console.log($(m).parent(".divid"));
            var str = $(m).parent(".divid").attr("valid");
            idList.push(str);
        })
        return idList;
    }
    /**
     * 得到当前人
     *
     */
    function getPersons(){
        var persons = [];
        $.each($(".checked"), function (e,m) {
            console.log($(m).parent(".divid"));
            //var row = $(m).parent(".divid").parent().parent().prevAll().length + 1;
            var tds = $(m).parent(".divid").parent().parent('tr').child('td');

            var name = tds.eq(1).find('a').text();  //姓名
            var identityNumber = tds.eq(2).text();    //身份证号
            var placeOfDomicile = tds.eq(3).text(); //人员属地
            var locationName = tds.eq(4).text(); //当前位置
            var levelName = tds.eq(5).text(); //人员等级
            var underControlName = tds.eq(6).text(); //是否稳控
            var cellphoneNumber = tds.eq(7).text(); //手机号
            var networkIDTypeName = tds.eq(8).text(); //网络ID类型
            var networkID = tds.eq(9).text(); //网络ID
            var networkName = tds.eq(10).text(); //网络名称

            var person = {
                name:name,
                identityNumber:identityNumber,
                placeOfDomicile:placeOfDomicile,
                locationName:locationName,
                levelName:levelName,
                underControlName:underControlName,
                cellphoneNumber:cellphoneNumber,
                networkIDTypeName:networkIDTypeName,
                networkID:networkID,
                networkName:networkName,
                crowdType:crowdType,
                crowdName:crowdName
            }
            persons.push(person);
        })
        return persons;
    }

    /**
     * 插入人和群体
     */
    function  addBtnClick(){
        var persons = getPersons();
        if(persons.length <= 0){
            $.util.topWindow().$.layerAlert.alert({msg:"至少勾选一人进行插入!",title:"提示"});
            return false;
        }

        $.ajax({
            url:context + '/crowd/savePersons',
            type:"post",
            data:persons,
            success:function(successData){
                $.util.topWindow().$.layerAlert.alert({msg:"添加失败!",title:"提示"});

                if(successData != null){
                    $.util.topWindow().$.layerAlert.alert({msg:"添加失败!",title:"提示"});
                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"添加失败!",title:"提示"});
                }
            }
        });

    }

    function initData(){

        $.ajax({
            url:context +'/crowd/findCluePersonsByClueId',
            type:'post',
            data:{clueId : clueId},
            dataType:'json',
            success:function(clueData){
                window.top.$.common.checkNewClue();

                var clue = clueData.clue;
                var str = clue.content;
                str = str.replace(regTranContent, "<span style='color:#ff674e'>" + tranContent + "</span>");
                $("#content").html(str);

                $("#involveCrowd").text(clue.crowdTypeShow + " " + clue.crowdNameShow);
                initPersonTable(clue.cluePersonList);

                crowdType = clue.crowdType;
                crowdName = clue.crowdName;
            }
        });
    }

    function createKeyValueDiv(key, value){
        return '<div class="col-xs-3"><p class="control-p">' + key + '：</p></div><div class="col-xs-3">' + value + '</div>'
    }

    function initPersonTable(data){
        if(personTable != null){
            personTable.destroy();
        }
        var personTableSettings = $.uiSettings.getLocalOTableSettings();
        personTableSettings.data = data;
        personTableSettings.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "",
                "data" : "id",
                "render" : function(data, type, full, meta) {
                    return "<div class='divid' valid='"+data+"'><input name='check' type='checkbox' class='icheckbox'></div>";
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "姓名",
                "data" : "name",
                "render" : function(data, type, full, meta) {
                    return '<a href="##" id="' + full.id + '" class="showPerson">' + data + '</a>';
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "身份证号",
                "data" : "identityNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 3,
                "width" : "",
                "title" : "人员属地",
                "data" : "placeOfDomicile",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 4,
                "width" : "",
                "title" : "当前位置",
                "data" : "location",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 5,
                "width" : "",
                "title" : "人员等级",
                "data" : "level",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 6,
                "width" : "",
                "title" : "是否稳控",
                "data" : "underControl",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 7,
                "width" : "",
                "title" : "手机号",
                "data" : "cellphoneNumber",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 8,
                "width" : "",
                "title" : "网络ID类型",
                "data" : "networkIdType",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 9,
                "width" : "",
                "title" : "网络ID",
                "data" : "networkId",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            },
            {
                "targets" : 10,
                "width" : "",
                "title" : "网络名称",
                "data" : "networkName",
                "render" : function(data, type, full, meta) {
                    return data;
                }
            }
        ];
        //是否排序
        personTableSettings.ordering = false ;
        //是否分页
        personTableSettings.paging = false ;
        //默认搜索框
        personTableSettings.searching = false ;
        //能否改变lengthMenu
        personTableSettings.lengthChange = false ;
        //自动TFoot
        personTableSettings.autoFooter = false ;
        //自动列宽
        personTableSettings.autoWidth = false ;
        //请求参数
        personTable = $("#personTable").DataTable(personTableSettings);
    }

    jQuery.extend($.common, {

    });
})(jQuery);