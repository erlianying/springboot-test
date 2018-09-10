(function($){
    "use strict";

    /**
     * 采用数据预处理方式
     */

    var hrskpersonCrowdTypeCount = null;
    $(document).ready(function() {
        initCrowdType()
    });

    function initCrowdType(){
        $.ajax({
            url: context + '/crowdDataPretreatment/findAllCrowdTypePersonNumber',
            type: "post",
            dataType: "json",
            customizedOpt: {
                ajaxLoading: false,//设置是否loading
            },
            success: function (typeData) {
                hrskpersonCrowdTypeCount = typeData.handlePojo;
                $("#typeCount").text(hrskpersonCrowdTypeCount.length);
                $("#nameCount").text(typeData.crowdCount);
                var personNumber = 0;
                $.each(hrskpersonCrowdTypeCount,function(i,typeVal){
                    var typeCode = typeVal.type;
                    // var typeName = typeVal.typeName;
                    var typeName = changeTypeName(typeVal.typeName);
                    var typeCount = typeVal.count;
                    personNumber += typeCount;
                    // var html = '<div class="col-xs-4">' +
                    //     '<div id='+typeCode+' class="chart-box"></div>' +
                    //     '</div>';
                    var html = '<div class="col-xs-4"><div class="row row-mar" id='+typeCode+'></div></div>'
                    $("#crowdPersons").append(html);
                    $.ajax({
                        url: context + '/crowdDataPretreatment/findCrowdPersonByCrowdCode',
                        data: {
                            "crowdTypeCode":typeCode
                        },
                        type: "post",
                        dataType: "json",
                        customizedOpt: {
                            ajaxLoading: true,//设置是否loading
                        },
                        success: function (data) {
                            var arr = [];
                            $.each(data.handlePojo,function(index,val) {
                                if (val.count != 0) {
                                    var arrChild = [val.name, val.count];
                                    arr.push(arrChild);
                                }
                            })
                            $('#'+typeCode).highcharts({
                                chart: {
                                    type: 'pie',
                                    options3d:{
                                        enabled:true,
                                        alpha:45,//
                                        beta:0,
                                        // depth:50,
                                        // viewDistance:25000
                                    }
                                    // width:300
                                },
                                title: {
                                    // text: typeName+'类群体人员分布   总人数：'+typeCount
                                    text: '<a href="javascript:void(0);" class="fc-red typeInfo">'+typeName+'  共'+data.crowdSize+'个群体   总人数：'+typeCount+'</a>'
                                },
                                plotOptions: {
                                    pie: {
                                        dataLabels: {
                                            enabled: true,
                                            format: '<b>{point.name}</b><br/> {y}', //{y}表示实际数据
                                            style: {
                                                color:  'black'
                                            }
                                        },
                                        showInLegend:false,
                                        depth:20
                                        // events: {
                                        //     click: function (e) {
                                        //         alert(e.point.name);
                                        //     }
                                        // }
                                    }
                                },
                                // legend: {//控制图例显示位置
                                //     layout: 'vertical',
                                //     align: 'center',
                                //     // verticalAlign: 'top',
                                //     borderWidth: 0
                                // },
                                series: [{
                                    name: '人员数量',
                                    data: arr,
                                    size: "50%"
                                }]
                            });

                        }
                    });
                })
                $("#personCount").text(personNumber);

            }
        });
    }

    /**
     * 查看群体类型下各群体详情
     */
    $(document).on("click",".typeInfo",function(){
        $.util.topWindow().$.layerAlert.dialog({
            content : context + '/show/page/web/crowd/crowdTypeCrowdsInfo',
            pageLoading : true,
            title : "各群体详情",
            width : "70%",
            height : "65%",
            btn:["关闭"],
            callBacks:{
                btn1:function(index, layero){
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose : false,
            success:function(layero, index){

            },
            initData:{
                type : $(this).parent().parent().parent().parent()[0].id,
                titleContent:$(this).text()
            },
            end:function(){

            }
        });
    });

    /**
     * 根据客户需求需要修改饼图展示的题头--10月10日
     * @param typeName 数据库里的字段
     */
    function changeTypeName(typeName){
        if(typeName=='涉军'){
            return "曾上访涉军人员";
        }
        if(typeName=='涉众型经济案件'){
            return "涉众经济案件群体";
        }
        if(typeName=='政策'){
            return "政策类群体";
        }
        if(typeName=='小区业主'){
            return "小区业主";
        }
        if(typeName=='敏感案事件'){
            return "敏感案事件涉及群体";
        }
        if(typeName=='其他'){
            return "其他群体";
        }
        return typeName;

    }


    /**
     * 采用数据预处理之前的逻辑
     */
    /* var hrskpersonCrowdTypeCount = null;
     var hrskpersonCrowdCount = null;
     $(document).ready(function() {
         initCrowdType();
     });

     /!**
      * 初始化群体类型--人员分布数据
      *!/
     function initCrowdType(){
         $.ajax({
             url: context + '/crowdManage/countHrskpersonByAllCrowdType',
             type: "post",
             dataType: "json",
             customizedOpt: {
                 ajaxLoading: false,//设置是否loading
             },
             success: function (data) {
                 hrskpersonCrowdTypeCount = data.hrskpersonCrowdTypeCount;
                 $("#typeCount").text(hrskpersonCrowdTypeCount.length);
                 $("#nameCount").text(data.count);
                 initCrowdPerson(hrskpersonCrowdTypeCount);
                 $.each(hrskpersonCrowdTypeCount,function(i,val){
                     if(val.codeOfCrowdType == "qtlx0002"){
                         queryCrowdName(val.codeOfCrowdType,val.nameOfCrowdType);
                     }
                 })

             }
         });
     }

     /!**
      * 查询群体类型下所包含的群体--人员分布数据
      * @param crowdTypeCode 人员类型code
      *!/
     function queryCrowdName(codeOfCrowdType,nameOfCrowdType){
         $.ajax({
             url: context + '/crowdManage/countHrskpersonByCrowdType',
             data: {
                 "crowdTypeCode":codeOfCrowdType
             },
             type: "post",
             dataType: "json",
             customizedOpt: {
                 ajaxLoading: true,//设置是否loading
             },
             success: function (data) {
                 hrskpersonCrowdCount = data.hrskpersonCrowdCount;
                 initCrowdTypePerson(hrskpersonCrowdCount,nameOfCrowdType);
             }
         });
     }

     /!**
      * 绘制群体类型--人员分布数据图表
      * @param data
      *!/
     function initCrowdPerson(data){
         var arr = [];
         $.each(data,function(index,val){
             var arrChild = {name:val.nameOfCrowdType,y:val.count,typeCode:val.codeOfCrowdType};
             arr.push(arrChild);
         })
         $('#crowdPerson').highcharts({
             chart: {
                 type: 'pie',
                 events:{
                     click:function(e){

                     }
                 }
             },
             title: {
                 text: '群体人员分布'
             },
             plotOptions: {
                 pie: {
                     dataLabels: {
                         enabled: true,
                         format: '{point.percentage:.1f} %',
                         style: {
                             color:  'black'
                         }
                     },
                     events: {
                         click: function (e) {
                             queryCrowdName(e.point.typeCode,e.point.name);
                         }
                     }
                 }
             },
             series: [{
                 name: '群体人员分布',
                 data: arr
             }]
         });
     }

     function initCrowdTypePerson(data,nameOfCrowdType){

     }


 */



})(jQuery);