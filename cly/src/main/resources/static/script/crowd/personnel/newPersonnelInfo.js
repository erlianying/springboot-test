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
        $(document).on("click" , "#addHrskpersonBtn", function(e){
            addHrskpersonBtnClick();
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

        $(document).on("blur" , "#IDNumber", function(e){
            checkIdNumber();
        });

    });

    function  checkIdNumber(){
        var idnumber = $("#IDNumber").val();
        if(idnumber && idnumber.length == 18){
            $.ajax({
                url:context +'/personManage/findHrskpersonByIDNumber',
                data:{idNumber:idnumber},
                type:'post',
                success:function(person){
                    if(person){
                        resetIdNumberPage(person);
                    }
                }
            })
        }
    }

    /**
     * 弹出新增页面
     *
     */
    function resetIdNumberPage(person){
        var title = "发现重复重点人员信息";

        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/personnel/newPersonnelInfoRepeatLayer',
            pageLoading : true,
            title : title,
            width : "500px",
            height : "300px",
            btn:["确认","取消"],
            callBacks:{
                btn1:function(index, layero){
                    var cm = $.util.topWindow().frames["layui-layer-iframe"+index].$.newPersonnelInfoRepeatLayer ;
                    var person = cm.deleteOrUpdateFun();
                    if(person.deleteOrUpdate == "delete"){
                        deleteHrskperson(person.id);
                    }else{
                        var form = $.util.getHiddenForm(context + "/show/page/web/personnel/editPersonnelInfo", {id:person.id});
                        form.submit();
                    }
                    $.util.topWindow().$.layerAlert.closeWithLoading(index);
                },
                btn2:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
                person:person
            },
            end:function(){
            }
        });
    }

    function deleteHrskperson(id){
        $.ajax({
            url:context +'/personManage/deleteHrskpersonTrue',
            data:{id:id},
            type:'post',
            success:function(successData){
                $.util.topWindow().$.layerAlert.alert({msg:"删除成功!",title:"提示",end:function(){

                }});

            }
        })

    }


    function addWxNumberBtnClick(){
        $("#weChatNumber").prepend("<li class='weChatNumber'><input type=\"checkbox\" name=\"weChatNumber\" class=\"icheckbox\">&nbsp;&nbsp;<input type=\"text\" class=\"form-control input-sm number valiform-keyup\" dataType=\"*0-70\" style=\"width:150px\"></li>")
    }

    function addQqNumberBtnClick(){
        $("#QQNumber").prepend("<li class='QQNumber'><input type=\"checkbox\" name=\"QQNumber\" class=\"icheckbox\">&nbsp;&nbsp;<input type=\"text\" class=\"form-control input-sm number valiform-keyup\" dataType=\"n0-70\" style=\"width:150px\"></li>")
    }

    function addPhoneNumberBtnClick(){
        $("#phoneNumber").prepend("<li class='phoneNumber'><input type=\"checkbox\" name=\"phoneNumber\" class=\"icheckbox\">&nbsp;&nbsp;<input type=\"text\" class=\"form-control input-sm number valiform-keyup\" dataType=\"n0-11\"style=\"width:150px\"></li>")
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

    function addHrskpersonBtnClick(){

        var demo = $.validform.getValidFormObjById("validformPersonType") ;
        var flag = $.validform.check(demo) ;
        if(!flag){
            return false;
        }
        var hrskperson = getNewHrskpersonInfo();

        var obj = new Object();
        $.util.objToStrutsFormData(hrskperson, "hrskpersonPojo", obj);
        $.ajax({
            url:context +'/personManage/saveHrskperson',
            data:obj,
            type:'post',
            success:function(successData){
                if(successData){
                    $.util.topWindow().$.layerAlert.alert({msg:"添加成功!",title:"提示",end : function(){
                        var form = $.util.getHiddenForm(context + "/show/page/web/personnel/personnelInfoManage");
                        form.submit();
                    }});

                }else{
                    $.util.topWindow().$.layerAlert.alert({msg:"添加失败!",title:"提示"});
                }
            }
        })
    }

    function getHrskpersonCrowdList(){
        var hrskpersonCrowdList = [];
        $.each($("#hrskpersonCrowds .hrskpersonCrowdRow"), function(i,item){
            var id =  $(this).find(".crowdType").attr("id");
            var idSuffix = id.substr(id.length - 1, 1)
            var hrskpersonCrowd = {
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

        var hrskperson;
        hrskperson = {
            name: $("#name").val(),
            IDNumber: $("#IDNumber").val(),
            nation: $.select2.val("#nation"),
            permanentAddress: $("#permanentAddress").val(),
            personnelDataSource: $("#personnelDataSource").val(),
            communicationDateSource: $("#communicationDateSource").val(),
            phoneNumber: getNumber("phoneNumber"),
            weChatNumber: getNumber("weChatNumber"),
            QQNumber: getNumber("QQNumber"),
            remarkOne: $("#remarkOne").val(),
            remarkTwo: $("#remarkTwo").val(),
            remarkThree: $("#remarkThree").val(),
            sex: $.select2.val("#sex"),
            province: $.select2.val("#province"),
            hrskpersonCrowdList: getHrskpersonCrowdList()
        };
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

    function init(){
        $.ajax({
            url:context + '/personManage/findCrowdDictionary',
            type:"post",
            dataType:"json",
            success:function(hrskpersonCrowdDictionaryPojo){
                hrskpersonCrowdDictionary = hrskpersonCrowdDictionaryPojo;
                initDictionary(hrskpersonCrowdDictionaryPojo);
                initCrowdDictionary(hrskpersonCrowdDictionaryPojo);
            }
        })
    }
    //初始化性别、民族和省份。
    function initDictionary(hrskpersonCrowdDictionary){
        $.select2.addByList("#sex",hrskpersonCrowdDictionary.sex,"id","name",true,true);
        $.select2.addByList("#nation",hrskpersonCrowdDictionary.nation,"id","name",true,true);
        $.select2.addByList("#province",hrskpersonCrowdDictionary.province,"id","name",true,true);
    }

    //初始化群体字典项信息.
    function initCrowdDictionary(hrskpersonCrowdDictionary){
        $.select2.addByList("#crowdType0",hrskpersonCrowdDictionary.crowdType,"id","name",true,true);
        $.select2.addByList("#crowdName0",[],"id","name",true,true);
        $.select2.addByList("#whetherBackbone0",hrskpersonCrowdDictionary.whetherBackbone,"id","name",true,true);
        $.select2.addByList("#personnelSubclassOne0",[],"id","name",true,true);
        $.select2.addByList("#personnelSubclassTwo0",[],"id","name",true,true);
        $.select2.addByList("#personnelSubclassThree0",[],"id","name",true,true);
        $.select2.addByList("#personnelSubclassFour0",[],"id","name",true,true);
    }

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
                    $.select2.empty("#crowdName" + idSuffix);
                    $.select2.addByList("#crowdName" + idSuffix, list, "code", "name", true, true);
                    $.select2.empty("#personnelSubclassOne" + idSuffix);
                    $.select2.empty("#personnelSubclassTwo"  + idSuffix);
                    $.select2.empty("#personnelSubclassThree"  + idSuffix);
                    $.select2.empty("#personnelSubclassFour"  + idSuffix);
                }
            });
        }else  if(id.indexOf("Name") >= 0) {
            $.ajax({
                url: context + '/personManage/findDictionaryItemsByParentId',
                data: {parentId: code},
                type: "post",
                success: function (successData) {
                    var list = successData.simplePojos;
                    $.select2.empty("#personnelSubclassOne" + idSuffix);
                    $.select2.addByList("#personnelSubclassOne" + idSuffix, list, "code", "name", true, true);
                    $.select2.empty("#personnelSubclassTwo"  + idSuffix);
                    $.select2.empty("#personnelSubclassThree"  + idSuffix);
                    $.select2.empty("#personnelSubclassFour"  + idSuffix);
                }
            });
        }else if(id.indexOf("One") >= 0){
            $.ajax({
                url:context +'/personManage/findDictionaryItemsByParentId',
                data:{parentId : code},
                type:"post",
                success:function(successData){
                    var list = successData.simplePojos;
                    $.select2.empty("#personnelSubclassTwo"  + idSuffix);
                    $.select2.addByList("#personnelSubclassTwo" + idSuffix ,list,"code","name",true,true);
                    $.select2.empty("#personnelSubclassThree"  + idSuffix);
                    $.select2.empty("#personnelSubclassFour"  + idSuffix);
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
                    $.select2.empty("#personnelSubclassThree"  + idSuffix);
                    $.select2.addByList("#personnelSubclassThree" + idSuffix ,list,"code","name",true,true);
                    $.select2.empty("#personnelSubclassFour"  + idSuffix);
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
                    $.select2.empty("#personnelSubclassFour"  + idSuffix);
                    $.select2.addByList("#personnelSubclassFour" + idSuffix ,list,"code","name",true,true);
                }
            });
        }
    })

})(jQuery);