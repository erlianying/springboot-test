(function($) {
    "use strict";

    var row = 1;
    var hrskpersonCrowdDictionary = null;
    $(document).ready(function() {
        init();
        $(document).on("click" , "#deleteHrskpersonCrowdRow", function(e){
            deleteHrskpersonCrowdRow();
        });

        $(document).on("click" , "#addHrskpersonCrowdRow", function(e){
            addHrskpersonCrowdRow();
        });

        $(document).on("click" , "#editHrskpersonBtn", function(e){
            editHrskpersonBtnClick();
        });
        $(document).on("click" , "#cancel", function(e){
            cancelBtnClick();
        });

        $(document).on("click" , "#addWxNumber", function(e){
            addWxNumberBtnClick();
        });
        $(document).on("click" , "#deleteWxNumber", function(e){
            deleteWxNumberBtnClick();
        });

        $(document).on("click" , "#addQqNumber", function(e){
            addQqNumberBtnClick();
        });
        $(document).on("click" , "#deleteQqNumber", function(e){
            deleteQqNumberBtnClick();
        });

        $(document).on("click" , "#addPhoneNumber", function(e){
            addPhoneNumberBtnClick();
        });
        $(document).on("click" , "#deletePhoneNumber", function(e){
            deletePhoneNumberBtnClick();
        });
    });

    function addWxNumberBtnClick(){
        $("#weChatNumber").prepend("<li class='weChatNumber'><input type=\"checkbox\" name=\"weChatNumber\" class=\"icheckbox\">&nbsp;&nbsp;<input type=\"text\" class=\"form-control input-sm number\" style=\"width:150px\"></li>")
    }

    function addQqNumberBtnClick(){
        $("#QQNumber").prepend("<li class='QQNumber'><input type=\"checkbox\" name=\"QQNumber\" class=\"icheckbox\">&nbsp;&nbsp;<input type=\"text\" class=\"form-control input-sm number\" style=\"width:150px\"></li>")
    }

    function addPhoneNumberBtnClick(){
        $("#phoneNumber").prepend("<li class='phoneNumber'><input type=\"checkbox\" name=\"phoneNumber\" class=\"icheckbox\">&nbsp;&nbsp;<input type=\"text\" class=\"form-control input-sm number\" style=\"width:150px\"></li>")
    }

    function deleteQqNumberBtnClick(){
        $.each($(".checked"), function (e,m) {
            $(m).parent(".QQNumber").remove();
        })
    }

    function deleteWxNumberBtnClick(){
        $.each($(".checked"), function (e,m) {
            $(m).parent(".weChatNumber").remove();
        })
    }

    function deletePhoneNumberBtnClick(){
        $.each($(".checked"), function (e,m) {
            $(m).parent(".phoneNumber").remove();
        })
    }


    function cancelBtnClick(){
        var form = $.util.getHiddenForm(context + "/show/page/web/personnel/personnelInfoManage");
        form.submit();
    }

    function init(){
        $.ajax({
            url:context + '/personManage/findHrskpersonById',
            data:{id:id},
            type:"post",
            dataType:"json",
            success:function(map){
                initData(map.personPojo);
                hrskpersonCrowdDictionary = map;
                initDictionary(hrskpersonCrowdDictionary);
                initHrskpersonCrowd(map.personPojo.hrskpersonCrowdList,hrskpersonCrowdDictionary);
            }
        })
    }

    //初始化性别、民族和省份。
    function initDictionary(hrskpersonCrowdDictionary){
        $.select2.addByList("#sex",hrskpersonCrowdDictionary.sex,"id","name",true,true);
        $.select2.addByList("#nation",hrskpersonCrowdDictionary.nation,"id","name",true,true);
        $.select2.addByList("#province",hrskpersonCrowdDictionary.province,"id","name",true,true);
        window.setTimeout(function(){
            if(hrskpersonCrowdDictionary.personPojo.province){
                $("#province").select2("val",hrskpersonCrowdDictionary.personPojo.province)
            }
            if(hrskpersonCrowdDictionary.personPojo.sex){
                $("#sex").select2("val",hrskpersonCrowdDictionary.personPojo.sex)
            }
            if(hrskpersonCrowdDictionary.personPojo.nation){
                $("#nation").select2("val",hrskpersonCrowdDictionary.personPojo.nation)
            }
        },1000);

    }

    //初始化人员群体中间表
    function initHrskpersonCrowd(personCrowds,hrskpersonCrowdDictionary){
        for(var i in personCrowds){
            var index = row +"";
            var key = "id";
            var value = "name";
            var personCrowd = personCrowds[i];
            var objTableTemplate = $("#hrskpersonCrowdRow");
            var objTable = objTableTemplate.clone(true);
            $(objTable).removeAttr("id");
            objTable.show();
            $("#hrskpersonCrowds").prepend(objTable);
            $(objTable).attr("valId",personCrowd.id);
            // objTable.insertBefore($("#model"));
            objTable.find(".crowdType").attr("id","crowdType"+index);
            objTable.find(".crowdName").attr("id","crowdName"+index);
            objTable.find(".whetherBackbone").attr("id","whetherBackbone"+index);
            objTable.find(".personnelSubclassOne").attr("id","personnelSubclassOne"+index);
            objTable.find(".personnelSubclassTwo").attr("id","personnelSubclassTwo"+index);
            objTable.find(".personnelSubclassThree").attr("id","personnelSubclassThree"+index);
            objTable.find(".personnelSubclassFour").attr("id","personnelSubclassFour"+index);
            objTable.find(".check").html("<input name=\"check\" type=\"checkbox\" class=\"icheckbox\">")
           // $.select2.addByList("#crowdType" + index,hrskpersonCrowdDictionary.crowdType,"id","name",true,true);
            var crowdType = "" ;
            $.each(hrskpersonCrowdDictionary.crowdType, function(i, val){
                if(personCrowd.crowdType && val[key] == personCrowd.crowdType){
                    crowdType += '<option value="'+val[key]+'" selected="selected">' ;
                    crowdType += val[value] ;
                    crowdType += "</option>" ;
                }else{
                    crowdType += '<option value="'+val[key]+'">' ;
                    crowdType += val[value] ;
                    crowdType += "</option>" ;
                }
            });
            $("#crowdType" + index).append(crowdType) ;
            if(personCrowd.crowdType){

               // $("#crowdType" + index +" option").select2("val",personCrowd.crowdType)
                $.ajax({
                    url: context + '/personManage/findDictionaryItemsByParentId',
                    data: {parentId: personCrowd.crowdType},
                    type: "post",
                    async:false,
                    success: function (successData) {
                        var crowdNameList = successData.simplePojos;
                        $("#crowdName" + index).empty();
                       $.select2.addByList("#crowdName" + index,crowdNameList,"id","name",true,true);
                        var crowdName = "" ;
                        $.each(crowdNameList, function(i, val){
                            if(personCrowd.crowdName && val[key] == personCrowd.crowdName) {
                                crowdName += '<option value="' + val[key] + '" selected="selected">';
                                crowdName += val[value];
                                crowdName += "</option>";
                            }else{
                                crowdName += '<option value="' + val[key] + '">';
                                crowdName += val[value];
                                crowdName += "</option>";
                            }
                        });
                        $("#crowdName" + index).append(crowdName) ;
                        if(personCrowd.crowdName){
                           // $("#crowdName" + index).select2("val",personCrowd.crowdName)
                            $.ajax({
                                url: context + '/personManage/findDictionaryItemsByParentId',
                                data: {parentId: personCrowd.crowdName},
                                type: "post",
                                async:false,
                                success: function (successData) {
                                    var personnelSubclassOneList = successData.simplePojos;
                                    $("#personnelSubclassOne" + index).empty();
                                   // $.select2.addByList("#personnelSubclassOne" + index, personnelSubclassOneList, "code", "name", true, true);
                                    var personnelSubclassOne = "";
                                    $.each(personnelSubclassOneList, function(i, val){
                                        if(personCrowd.personnelSubclassOne && personCrowd.personnelSubclassOne == val[key]){
                                            personnelSubclassOne += '<option value="'+val[key]+'"  selected="selected">' ;
                                            personnelSubclassOne += val[value] ;
                                            personnelSubclassOne += "</option>" ;
                                        }else{
                                            personnelSubclassOne += '<option value="'+val[key]+'">' ;
                                            personnelSubclassOne += val[value] ;
                                            personnelSubclassOne += "</option>" ;
                                        }
                                    });
                                    $("#personnelSubclassOne" + index).append(personnelSubclassOne) ;
                                    if(personCrowd.personnelSubclassOne){
                                        //window.setTimeout(function(){
                                       // $("#personnelSubclassOne" + index).select2("val",personCrowd.personnelSubclassOne)
                                       // },1000);
                                        $.ajax({
                                            url:context +'/personManage/findDictionaryItemsByParentId',
                                            data:{parentId : personCrowd.personnelSubclassOne},
                                            type:"post",
                                            async:false,
                                            success:function(successData){
                                                var personnelSubclassTwoList = successData.simplePojos;
                                                $("#personnelSubclassTwo" + index).empty();

                                               // $.select2.addByList("#personnelSubclassTwo" + index ,personnelSubclassTwoList,"code","name",true,true);
                                                var personnelSubclassTwo = "";
                                                $.each(personnelSubclassTwoList, function(i, val){
                                                    if(personCrowd.personnelSubclassTwo && val[key] == personCrowd.personnelSubclassTwo){
                                                        personnelSubclassTwo += '<option value="'+val[key]+'"  selected="selected">' ;
                                                        personnelSubclassTwo += val[value] ;
                                                        personnelSubclassTwo += "</option>" ;
                                                    }else {
                                                        personnelSubclassTwo += '<option value="' + val[key] + '">';
                                                        personnelSubclassTwo += val[value];
                                                        personnelSubclassTwo += "</option>";
                                                    }
                                                });
                                                $("#personnelSubclassTwo" + index).append(personnelSubclassTwo) ;
                                                if(personCrowd.personnelSubclassTwo){
                                                   // $("#personnelSubclassTwo" + index).select2("val",personCrowd.personnelSubclassTwo)
                                                    $.ajax({
                                                        url:context +'/personManage/findDictionaryItemsByParentId',
                                                        data:{parentId : personCrowd.personnelSubclassTwo},
                                                        type:"post",
                                                        dataType:"json",
                                                        async:false,
                                                        success:function(successData){
                                                            var personnelSubclassThreeList = successData.simplePojos;
                                                            $("#personnelSubclassThree" + index).empty();
                                                           // $.select2.addByList("#personnelSubclassThree" + index ,personnelSubclassThreeList,"code","name",true,true);
                                                            var personnelSubclassThree = "";
                                                            $.each(personnelSubclassThreeList, function(i, val){
                                                                if(personCrowd.personnelSubclassThree && personCrowd.personnelSubclassThree == val[key]){
                                                                    personnelSubclassThree += '<option value="' + val[key] + '" selected="selected">';
                                                                    personnelSubclassThree += val[value];
                                                                    personnelSubclassThree += "</option>";
                                                                }else {
                                                                    personnelSubclassThree += '<option value="' + val[key] + '">';
                                                                    personnelSubclassThree += val[value];
                                                                    personnelSubclassThree += "</option>";
                                                                }
                                                            });
                                                            $("#personnelSubclassThree" + index).append(personnelSubclassThree) ;
                                                            if(personCrowd.personnelSubclassThree){
                                                              //  $("#personnelSubclassThree" + index).select2("val",personCrowd.personnelSubclassThree)
                                                                $.ajax({
                                                                    url:context +'/personManage/findDictionaryItemsByParentId',
                                                                    data:{parentId : personCrowd.personnelSubclassThree},
                                                                    type:"post",
                                                                    dataType:"json",
                                                                    async:false,
                                                                    success:function(successData){
                                                                        var personnelSubclassFourList = successData.simplePojos;
                                                                        $("#personnelSubclassFour" + index).empty();
                                                                      //  $.select2.addByList("#personnelSubclassFour" + index ,personnelSubclassFourList,"code","name",true,true);
                                                                        var personnelSubclassFour = "";
                                                                        $.each(personnelSubclassFourList, function(i, val){
                                                                            if(personCrowd.personnelSubclassFour && val[key] == personCrowd.personnelSubclassFour){
                                                                                //$("#personnelSubclassFour" + index).select2("val",personCrowd.personnelSubclassFour)
                                                                                personnelSubclassFour += '<option value="'+val[key]+'" selected="selected">' ;
                                                                                personnelSubclassFour += val[value] ;
                                                                                personnelSubclassFour += "</option>" ;
                                                                            }else {
                                                                                personnelSubclassFour += '<option value="' + val[key] + '">';
                                                                                personnelSubclassFour += val[value];
                                                                                personnelSubclassFour += "</option>";
                                                                            }
                                                                        });
                                                                        $("#personnelSubclassFour" + index).append(personnelSubclassFour) ;

                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
           // $.select2.addByList("#whetherBackbone" + index,hrskpersonCrowdDictionary.whetherBackbone,"id","name",true,true);
            var whetherBackbone = "";
            $.each(hrskpersonCrowdDictionary.whetherBackbone, function(i, val){
                if(personCrowd.whetherBackbone && val[key] == personCrowd.whetherBackbone){
                    whetherBackbone += '<option value="'+val[key]+'" selected="selected">' ;
                    whetherBackbone += val[value] ;
                    whetherBackbone += "</option>" ;
                }else{
                    whetherBackbone += '<option value="'+val[key]+'">' ;
                    whetherBackbone += val[value] ;
                    whetherBackbone += "</option>" ;
                }

            });
            $("#whetherBackbone" + index).append(whetherBackbone) ;
            row++;
        }
    }


    //初始化群体字典项信息.

    function initData(person){
        $("#name").val(person.name);
        $("#IDNumber").text(person.idnumber);
        $("#permanentAddress").val(person.permanentAddress);
        $("#personnelDataSource").val(person.personnelDataSource);
        $("#communicationDateSource").val(person.communicationDateSource);
        $("#remarkOne").val(person.remarkOne);
        $("#remarkTwo").val(person.remarkTwo);
        $("#remarkThree").val(person.remarkThree);
        $("#createDate").text(person.createDate);
        $("#updateTime").text(person.updateTime);

        initNuber(person.qqnumbers,"QQNumber");
        initNuber(person.phoneNumbers,"phoneNumber");
        initNuber(person.weChatNumbers,"weChatNumber");
    }

    function initNuber(number,numberId){
      for(var index in number){
          $("#" + numberId).prepend("<li class='weChatNumber'><input type=\"checkbox\" name=\"weChatNumber\" class=\"icheckbox\">&nbsp;&nbsp;<input type=\"text\" class=\"form-control input-sm number\" style=\"width:150px\" value='"+number[index]+"'></li>")
      }
    }



    function deleteHrskpersonCrowdRow(){
        $.each($(".checked"), function (e,m) {
            $(m).parent().parent("tr").remove();
        })
    }

    function addHrskpersonCrowdRow(){
        var objTableTemplate = $("#hrskpersonCrowdRow");
        var objTable = objTableTemplate.clone(true);
        $(objTable).removeAttr("id");
        objTable.show();
        $("#hrskpersonCrowds").prepend(objTable);
        // objTable.insertBefore($("#model"));
        objTable.find(".crowdType").attr("id","crowdType"+row);
        objTable.find(".crowdName").attr("id","crowdName"+row);
        objTable.find(".whetherBackbone").attr("id","whetherBackbone"+row);
        objTable.find(".personnelSubclassOne").attr("id","personnelSubclassOne"+row);
        objTable.find(".personnelSubclassTwo").attr("id","personnelSubclassTwo"+row);
        objTable.find(".personnelSubclassThree").attr("id","personnelSubclassThree"+row);
        objTable.find(".personnelSubclassFour").attr("id","personnelSubclassFour"+row);
        objTable.find(".check").html("<input name=\"check\" type=\"checkbox\" class=\"icheckbox\">")

        $.select2.addByList("#crowdType" + row,hrskpersonCrowdDictionary.crowdType,"id","name",true,true);
        $.select2.addByList("#crowdName" + row,[],"id","name",true,true);
        $.select2.addByList("#whetherBackbone" + row,hrskpersonCrowdDictionary.whetherBackbone,"id","name",true,true);
        $.select2.addByList("#personnelSubclassOne" + row,[],"id","name",true,true);
        $.select2.addByList("#personnelSubclassTwo" + row,[],"id","name",true,true);
        $.select2.addByList("#personnelSubclassThree" + row,[],"id","name",true,true);
        $.select2.addByList("#personnelSubclassFour" + row,[],"id","name",true,true);
        row++;

    }

    function editHrskpersonBtnClick(){
        var demo = $.validform.getValidFormObjById("validformPersonType") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }
        var hrskperson = getNewHrskpersonInfo();
        var obj = new Object();
        $.util.objToStrutsFormData(hrskperson, "hrskpersonPojo", obj);

        window.top.$.common.showOrHideLoading(true);
        $.ajax({
            url:context +'/personManage/editHrskperson',
            data:obj,
            type:'post',
            success:function(successData){
                window.top.$.common.showOrHideLoading(false);
                $.util.topWindow().$.layerAlert.alert({msg:"修改成功!",title:"提示"});
                var form = $.util.getHiddenForm(context + "/show/page/web/personnel/personnelInfoManage");
                form.submit();
            },
            error:function(){
                window.top.$.common.showOrHideLoading(false);
            }
        })
    }

    function getHrskpersonCrowdList(){
        var hrskpersonCrowdList = [];
        $.each($("#hrskpersonCrowds .hrskpersonCrowdRow"), function(i,item){
            var crowdId = "";
            if("" != $(this).attr("valid") && !$(this).attr("valid")){
                crowdId = $(this).attr("valid");
            }
            var id =  $(this).find(".crowdType").attr("id");
            var idSuffix = id.substr(id.length - 1, 1)
            var hrskpersonCrowd = {
                id : crowdId,
                crowdName :  $.select2.val("#crowdName"  + idSuffix),
                crowdType :  $.select2.val("#crowdType"  + idSuffix),
                whetherBackbone : $.select2.val("#whetherBackbone"  + idSuffix),
                personnelSubclassOne :  $.select2.val("#personnelSubclassOne"  + idSuffix),
                personnelSubclassTwo : $.select2.val("#personnelSubclassTwo"  + idSuffix),
                personnelSubclassThree : $.select2.val("#personnelSubclassThree"  + idSuffix),
                personnelSubclassFour : $.select2.val("#personnelSubclassFour"  + idSuffix),
            }
            hrskpersonCrowdList.push(hrskpersonCrowd);
        });
        return hrskpersonCrowdList;
    }

    //组装新增hrskpersonbean
    function getNewHrskpersonInfo(){

        var hrskperson = {
            id : id,
            name : $("#name").val(),
            nation:  $.select2.val("#nation"),
            permanentAddress : $("#permanentAddress").val(),
            personnelDataSource : $("#personnelDataSource").val(),
            communicationDateSource : $("#communicationDateSource").val(),
            phoneNumber : getNumber("phoneNumber"),
            weChatNumber : getNumber("weChatNumber"),
            QQNumber :  getNumber("QQNumber"),
            remarkOne : $("#remarkOne").val(),
            remarkTwo : $("#remarkTwo").val(),
            remarkThree : $("#remarkThree").val(),
            sex : $.select2.val("#sex"),
            province : $.select2.val("#province"),
            hrskpersonCrowdList :getHrskpersonCrowdList()
        }
        return hrskperson;
    }
    //得到手机、qq和微信的信息
    function getNumber(number){
        var num = "";
        $.each($("#" + number +" li .number"), function(i,item){
            num += $(item).val() + ",";
        });
        num = num.substr(0,num.length - 1);
        return num;
    }

    //级联加载群体类别和人员细类
    $(document).on("select2:select",".personCrowd",function(){
        var id = $(this).attr("id");
        var idSuffix = id.substr(id.length - 1, 1)
        var code = $.select2.val("#" + id);
        if(id.indexOf("Type") >= 0) {
            $.ajax({
                url: context + '/personManage/findDictionaryItemsByParentId',
                data: {parentId: code},
                type: "post",
                success: function (successData) {
                    var list = successData.simplePojos;
                    $("#crowdName" + idSuffix).empty();
                    $.select2.addByList("#crowdName" + idSuffix, list, "id", "name", true, true);
                }
            });
        }else  if(id.indexOf("Name") >= 0) {
            $.ajax({
                url: context + '/personManage/findDictionaryItemsByParentId',
                data: {parentId: code},
                type: "post",
                success: function (successData) {
                    var list = successData.simplePojos;
                    $("#personnelSubclassOne" + idSuffix).empty();
                    $.select2.addByList("#personnelSubclassOne" + idSuffix, list, "id", "name", true, true);
                }
            });
        }else if(id.indexOf("One") >= 0){
            $.ajax({
                url:context +'/personManage/findDictionaryItemsByParentId',
                data:{parentId : code},
                type:"post",
                success:function(successData){
                    var list = successData.simplePojos;
                    $("#personnelSubclassTwo" + idSuffix).empty();
                    $.select2.addByList("#personnelSubclassTwo" + idSuffix ,list,"id","name",true,true);
                }
            });
        }else if(id.indexOf("Two") >= 0){
            $.ajax({
                url:context +'/personManage/findDictionaryItemsByParentId',
                data:{parentId : code},
                type:"post",
                dataType:"json",
                success:function(successData){
                    var list = successData.simplePojos;
                    $("#personnelSubclassThree" + idSuffix).empty();
                    $.select2.addByList("#personnelSubclassThree" + idSuffix ,list,"id","name",true,true);
                }
            });

        }else if(id.indexOf("Three") >= 0){
            $.ajax({
                url:context +'/personManage/findDictionaryItemsByParentId',
                data:{parentId : code},
                type:"post",
                dataType:"json",
                success:function(successData){
                    var list = successData.simplePojos;
                    $("#personnelSubclassFour" + idSuffix).empty();
                    $.select2.addByList("#personnelSubclassFour" + idSuffix ,list,"id","name",true,true);
                }
            });
        }
    })

    /**
     * 初始化上访table
     */
    function petitionRegisterTable(){
        if(table != null) {
            table.destroy();
        }
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context +"/personMessageManage/findpetitionRegister";
        tb.columnDefs = [
            {
                "targets": 0,
                "width": "50px",
                "title": "序号",
                "data": "" ,
                "render": function ( data, type, full, meta ) {
                    return meta.row+1;
                }
            },
            {
                "targets" : 1,
                "width" : "",
                "title" : "上访时间",
                "data" : "petitionDateStr",
                "render" : function(data, type, full, meta) {

                    return data;
                }
            },
            {
                "targets" : 2,
                "width" : "",
                "title" : "上访地点",
                "data" : "position",
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
            var objs = {"idNumber":$("#IDNumber").text()};
            $.util.objToStrutsFormData(objs, "queryPetitionRegister", d);
        };
        tb.paramsResp = function(json) {
            json.data = json.petitionRegister;
            json.recordsFiltered = json.totalNum;
            json.recordsTotal = json.totalNum;
            $("#petitioningNum").text(json.totalNum);
        };
        $("#petitioningInfo").DataTable(tb);
    }

})(jQuery);