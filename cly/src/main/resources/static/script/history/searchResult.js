(function ($) {
    "use strict";

    var fullTable = null;
    $(document).ready(function () {
        $("#fullValue").val(fullText);
        initTable();
    });

    /**
     * 搜索
     */
    $(document).on("click","#search",function(){
        if($("#fullValue").val() == "请输入任何您想查询的内容，无论是线索、人员、群体……"){
            return;
        }
        fullTable.draw();
    })

    /**
     * 人员详情
     */
    $(document).on("click",".personInfo",function(){
        location.href=context + "/show/page/web/personnel/personnelDetail?personId="+this.id;
    });

    /**
     * 群体详情
     */
    $(document).on("click",".crowdInfo",function(){
        location.href=context + "/show/page/web/crowd/viewCrowdDetail?crowdId="+this.id;
    });

    /**
     * 线索详情
     */
    $(document).on("click",".clueInfo",function(){
        location.href=context + "/show/page/web/clue/viewClue?clueId="+this.id;
    });

    /**
     * 上访登记详情
     */
    $(document).on("click",".petitionInfo",function(){
        //TODO 等待详情页面做好不全地址
        // location.href=context + "/show/page/web/"+this.id;
    });


    function initTable(){
        var tb = $.uiSettings.getOTableSettings();
        tb.ajax.url = context + "/fullSearch/fullSearch";
        tb.columnDefs = [
            {
                "targets" : 0,
                "width" : "",
                "title" : "",
                "data" : "type",
                "render": function ( data, type, full, meta ) {
                    if(data == 'clue'){   //线索
                        return initClueInfo(full.cluePojo);
                    }else if(data == 'crowd'){   //群体
                        return initCrowdInfo(full.crowd);
                    }else if(data == 'hrskperson'){   //人员
                        return  initPersonInfo(full.hrskpersonPojo);
                    }else if(data == 'petition-register'){   //上访记录
                        return initPetitionInfo(full.petition);
                    }else{   //未匹配
                        return '';
                    }
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
            d.fullSearchStr=$("#fullValue").val() ;
        };
        tb.paramsResp = function(json) {
            $("#fullTable thead").remove();
            json.data = json.fullSearchResultPojo;
            json.recordsFiltered = json.totalNumber;
            json.recordsTotal = json.totalNumber;
        };
        fullTable = $("#fullTable").DataTable(tb);
    }



    /**
     * 初始化人员信息
     */
    function initPersonInfo(hrskpersonPojo) {
        var html = '<tr>' +
            '<td>' +
            '<div class="search-result-box">' +
            '<h2>' +
            '<a href="###" class="personInfo" id="'+hrskpersonPojo.personId+'">' + valuesReplace($.util.isBlank(hrskpersonPojo.personName)? "" : hrskpersonPojo.personName) + '人员档案</a>' +
            '</h2>' +
            '<div class="row mart-10 d-block">';
        if ($.util.isBlank(hrskpersonPojo.photoBase)) {
            html += '<div class="col-xs-3 d-left">' +
                '<img src="../../../../images/img/man-none.png">' +
                '</div>';
        } else {
            html += '<div class="col-xs-3 d-left">' +
                '<img src="data:image:/png;base64,' + hrskpersonPojo.photoBase + '">' +
                '</div>';
        }
        html += '<div class="col-xs-9 d-right">' +
            '<div class="content">' +
            '<div class="row row-mar">' +
            '<h2 class="m-inline mar-right font20 m-bold" style="margin-right:30px;">' + valuesReplace($.util.isBlank(hrskpersonPojo.personName)? "" : hrskpersonPojo.personName) + '</h2>' +
            '<span class="mar-right">' + valuesReplace($.util.isBlank(hrskpersonPojo.sex)? "" : hrskpersonPojo.sex) + '</span>' +
            '</div>' +
            '<div class="alert alert-default man-info">' +
            '<div class="row">' +
            '<div class="col-xs-4"><p class="col-xs-4 color-gray text-right">身份证号：</p><p class="col-xs-8">' + valuesReplace($.util.isBlank(hrskpersonPojo.idcard)? "未知" : hrskpersonPojo.idcard) + '</p></div>' +
            '<div class="col-xs-4"><p class="col-xs-4 color-gray text-right">年龄：</p><p class="col-xs-7">' +  valuesReplace($.util.isBlank(hrskpersonPojo.age)? "未知" : hrskpersonPojo.age) + '</p></div>' +
            '<div class="col-xs-4"><p class="col-xs-4 color-gray text-right">民族：</p><p class="col-xs-7">' +  valuesReplace($.util.isBlank(hrskpersonPojo.nation)? "未知" : hrskpersonPojo.nation) + '</p></div>' +
            '<div class="col-xs-4"><p class="col-xs-4 color-gray text-right">省份：</p><p class="col-xs-7">' + valuesReplace($.util.isBlank(hrskpersonPojo.provinceName)? "未知" : hrskpersonPojo.provinceName) + '</p></div>' +
            '<div class="col-xs-8"><p class="col-xs-2 color-gray text-right">户籍地址：</p><p class="col-xs-10">' + valuesReplace($.util.isBlank(hrskpersonPojo.permanentAddress)? "未知" : hrskpersonPojo.permanentAddress) + '</p></div>' +
            '</div>' +
            '</div>' +
            '<div class="col-info" style="margin-top:10px;">' +
            '<div class="row">' +
            '<span class="col-xs-2 lable-m">所属群体：</span>' +
            '<div class="col-xs-8">';
        html += appendCrowdInfo(hrskpersonPojo.cqrp);
        html += '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'+
            '<p class="source-row">' +
            '<span class="source">来源：人员档案</span>' +
            '<span class="time">档案入库时间：' + ($.util.isBlank(hrskpersonPojo.createTimeLong)? "" : $.date.timeToStr(hrskpersonPojo.createTimeLong, "yyyy年MM月dd日")) + '</span>' +
            '</p>' +
            '</div>' +
            '</td>' +
            '</tr>';
        return html;
    }

    /**
     * 群体信息
     */
    function initCrowdInfo(crowd) {
        var id = crowd.id;
        var crowdNmae = crowd.crowdName;
        var crowdType = crowd.crowdType;
        var situation = crowd.situation;
        var time = crowd.createTimeLong;
       var crowdHtml = '<tr><td>' +
           '            <div class="search-result-box">' +
           '            <h2><a href="###" class="crowdInfo" id="'+id+'">'+valuesReplace($.util.isBlank(crowdNmae) ? "" : crowdNmae)+'群体档案</a></h2>' +
           '            <p class="intro">'+valuesReplace($.util.isBlank(situation) ? "" : situation)+'</p>' +
           '            <p class="source-row"><span class="source">来源：群体档案</span>' +
           '            <span class="time">档案入库时间：'+($.util.isBlank(time) ? "" : $.date.timeToStr(time, "yyyy年MM月dd日"))+'</span></p>' +
           '            </div>' +
           ' </td></tr>';
       return crowdHtml;
    }

    /**
     * 线索信息
     */
    function initClueInfo(cluePojo) {
        var content = cluePojo.content; //线索内容
        var id = cluePojo.id; //线索id
        var code = cluePojo.code; //线索code
        var writeTime = cluePojo.writeTime; //创建时间
        var startTime = cluePojo.startTime; //线索指向开始时间
        var involveCrowdName = "";
        if(cluePojo.involveCrowdName != null){
            involveCrowdName = cluePojo.involveCrowdName[0]; //关联群体名称
        }
        var clueHtml = '<tr><td>' +
            '            <div class="search-result-box">' +
            '            <h2><a href="###" class="clueInfo" id="'+id+'">'+$.date.timeToStr(writeTime, "yyyy年MM月dd日")+valuesReplace(involveCrowdName)+'群体线索</a></h2>' +
            '            <p class="intro">'+valuesReplace($.util.isBlank(content)? "" : content)+'</p>' +
            '            <p class="source-row"><span class="source">来源：线索库</span><span class="time">线索录入时间: '+($.util.isBlank(writeTime) ? "" : $.date.timeToStr(writeTime, "yyyy年MM月dd日"))+'</span></p></div>' +
            '</td></tr>';
        return clueHtml;
    }

    /**
     * 上访信息
     */
    function initPetitionInfo(petition) {
        var id = petition.id;
        var particularSituation = petition.particularSituation;
        var petitionDateLong = petition.petitionDateLong;
        var crowdName = petition.crowdName;
        var petitionHtml = '<tr><td>' +
            '            <div class="search-result-box">' +
            '            <h2><a href="###" class="petitionInfo" id="'+id+'">'+$.date.timeToStr(petitionDateLong, "yyyy年MM月dd日")+valuesReplace($.util.isBlank(crowdName)? "" : crowdName)+'群体上访记录</a></h2>' +
            '            <p class="intro">'+valuesReplace($.util.isBlank(particularSituation)? "" : particularSituation)+'</p>' +
            '            <p class="source-row"><span class="source">来源：现实访库</span><span class="time">档案入库时间：'+($.util.isBlank(petitionDateLong) ? "" : $.date.timeToStr(petitionDateLong, "yyyy年MM月dd日"))+'</span></p>' +
            '            </div> ' +
            '</td></tr>';
        return petitionHtml;
    }

    /**
     * 把全文搜索的内容高亮显示
     * @param values
     * @returns {void|string|XML|*}
     */
    function valuesReplace(values){
        return values.replace(eval("/"+$("#fullValue").val()+"/g"),"<span style=\'color:red;\'>"+$("#fullValue").val()+"</span>")
    }

    /**
     * 组装群体数据
     * @param crowds 群体数据
     */
    function appendCrowdInfo(crowds){
        var html = '';
        $.each(crowds,function(index,val){
            if(val.whetherBackbone == "重点人员"){
                html += '<p>' +
                    '<span class="state state-red2" >'+valuesReplace($.util.isBlank(val.crowdType)? "" : val.crowdType)+'</span>' +
                    '<span class="state state-red2" >'+valuesReplace($.util.isBlank(val.crowdName)? "" : val.crowdName)+'</span>';
                if(!$.util.isEmpty(val.personnelSubclassOne)){
                    html += '<span class="state state-red2" >'+valuesReplace(val.personnelSubclassOne)+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassTwo)){
                    html += '<span class="state state-red2" >'+valuesReplace(val.personnelSubclassTwo)+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassThree)){
                    html += '<span class="state state-red2" >'+valuesReplace(val.personnelSubclassThree)+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassFour)){
                    html += '<span class="state state-red2" >'+valuesReplace(val.personnelSubclassFour)+'</span>' ;
                }
                html += '<span class="state state-circle  state-red1" >'+valuesReplace("骨干")+'</span></p>' ;
            }else{
                html += '<p>' +
                    '<span class="state state-green2" >'+valuesReplace(val.crowdType)+'</span>' +
                    '<span class="state state-green2" >'+valuesReplace(val.crowdName)+'</span>';
                if(!$.util.isEmpty(val.personnelSubclassOne)){
                    html += '<span class="state state-green2" >'+valuesReplace(val.personnelSubclassOne)+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassTwo)){
                    html += '<span class="state state-green2" >'+valuesReplace(val.personnelSubclassTwo)+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassThree)){
                    html += '<span class="state state-green2" >'+valuesReplace(val.personnelSubclassThree)+'</span>' ;
                }
                if(!$.util.isEmpty(val.personnelSubclassFour)){
                    html += '<span class="state state-green2" >'+valuesReplace(val.personnelSubclassFour)+'</span>' ;
                }
                html += '<span class="state state-circle  state-blue1" >'+valuesReplace("一般人员")+'</span></p>' ;
            }
        })
        return html;
    }



})(jQuery);