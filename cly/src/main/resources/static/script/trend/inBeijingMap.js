var searchData = null;

(function($){
    "use strict";

    var pointLayer = null;
    var map = null;
    var popup = null;
    var serchNum = 0;

    var checkNum;
    var count;
    var successSerchNum;
    var personSet = [];

    var hotelNumStr = "";
    var netBarNumStr = "";
    var checkNumStr = "";
    var changAnDataNumStr ="";

    var hotelPersonNumStr = "";
    var netBarPersonNumStr = "";
    var checkPersonNumStr = "";


    var allSearchPointList = [];

    $(document).ready(function() {

        $(document).on("click" , "#search", function(e){
           queryData();
        })

        $(document).on("click" , ".detialPerson", function(e){
            var name = $(this).attr("valName");
            var address = $(this).attr("valAddress");
            var type = $(this).attr("valType");
            detialPersonClick(name,address,type);
        })

        init();

        pointLayer = new ol.layer.Vector({
            source: new ol.source.Vector()
        });


        /*弹出框*/
        // Popup showing the position the user clicked
        popup = new ol.Overlay({
            element: document.getElementById('popup')
        });

        initMap();

        $(document).on("click" , "#reset", function(e){
            location.reload()
        });

        $(document).on("click" , "#allPing", function(e){
            allPingClick();
        });

        $(document).on("select2:select","#crowdType",function(){
            selectCrowdType();
        })

        $(document).on("ifChecked",".dataType",function(){
            if($(this).attr("id") == "changAnData"){
                $("#hotel").iCheck("uncheck");
                $("#netBar").iCheck("uncheck")
                $("#check").iCheck("uncheck")
            }else{
                $("#changAnData").iCheck("uncheck");
            }
        })
    });

    function initMap(){
        $.ajax({
            url: context + '/inBeijingMap/initMapUrl',
            type: "post",
            dataType: "json",
            success: function (map) {
                var BDMapServer = "http://" +  map.url + '/mapService';
                map = $.mapUtil.initBDMap(BDMapServer,"mapContainer");
                map.addLayer(pointLayer);
                /*地图中添加弹出框*/
                map.addOverlay(popup);

                /*地图click*/
                map.on('click', function(evt) {
                    var element = popup.getElement();
                    $(element).popover('destroy');
                    var coordinate = evt.coordinate;
                    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature){
                        return feature;
                    });
                    if(!feature){
                        return false;
                    }
                    /*展示需做修改*/
                    var featureData=feature.getProperties();

                    var idmumberList = '';
                    var len = 0;
                    for (var i in featureData) {
                        len++;
                    }
                    len--;
                    for (var i = 0; i < len; i++) {
                        if (i < len - 1) {
                            idmumberList += featureData[i].idnumber + ",";
                        } else {
                            idmumberList += featureData[i].idnumber;
                        }
                    }

                    popup.setPosition(coordinate);

                    if(featureData[0].type ==  'hotel'){
                        $(element).popover({
                            'placement': 'bottom',
                            'animation': false,
                            'html': true,
                            'content': '<p style="width: 250px; color: #0f0f0f">旅店名称：'+featureData[0].name+'<br>旅店地址：'+featureData[0].address+'<br>人数：<button class="detialPerson" onclick="detialPersonClick(\''+idmumberList+'\')">'+len +'</button>人</p>'
                        });
                    }else if(featureData[0].type ==  'netBar'){
                        $(element).popover({
                            'placement': 'bottom',
                            'animation': false,
                            'html': true,
                            'content': '<p style="width: 250px; color: #0f0f0f">网吧名称：'+featureData[0].name+'<br>网吧地址：'+featureData[0].address+'<br>人数：<button class="detialPerson" onclick="detialPersonClick(\''+idmumberList+'\')">'+ len +'</button>人</p>'
                        });
                    }else if(featureData[0].type ==  'check'){
                        $(element).popover({
                            'placement': 'bottom',
                            'animation': false,
                            'html': true,
                            'content': '<p style="width: 250px; color: #0f0f0f">核录地点：'+featureData[0].name+'<br>核录地址：'+featureData[0].address+'<br>人数：<button class="detialPerson" onclick="detialPersonClick(\''+idmumberList+'\')">'+ len +'</button>人</p>'
                        });
                    }else if(featureData[0].type ==  'changAnData'){
                        $(element).popover({
                            'placement': 'bottom',
                            'animation': false,
                            'html': true,
                            'content': '<p style="width: 250px; color: #0f0f0f">地址：'+featureData[0].address+'<br>人数：<button class="detialPerson" onclick="detialPersonClick(\''+idmumberList+'\')">'+len +'</button>人</p>'
                        });
                    }

                        $(element).popover('show');
                });

            },

        })
    }


    function init() {
        $.ajax({
            url: context + '/inBeijingMap/findDictionary',
            type: "post",
            dataType: "json",
            success: function (map) {
                $.select2.addByList("#crowdType", map.crowdType, "code", "name", true, true);
            }
        })

        var nowDate = new Date();
        var startDateLong = nowDate.getTime() - 1000*60*60*24;
        var startDateStr = $.date.timeToStr(startDateLong, "yyyy-MM-dd");
        var endDateStr = $.date.dateToStr(nowDate, "yyyy-MM-dd HH:mm");
        $.laydate.setRange(startDateStr + " 22:00", endDateStr, "#dateRangeId");
    }


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


    function searchTrack() {
        $.ajax({
            url: context + '/inBeijingMap/findTrack',
            type: "post",
            dataType: "json",
            success: function (map) {
                $.select2.addByList("#crowdType", map.crowdType, "code", "name", true, true);
            }
        })
    }



    function queryData(){
        if(!$.select2.val("#crowdType")){
            $.util.topWindow().$.layerAlert.alert({msg:"请选择群体!",title:"提示"});
            return false;
        }

        beforeSerch();

        var hotel = $($("input[name='hotel']:checked")[0]).val();
        var netBar = $($("input[name='netBar']:checked")[0]).val();
        var check = $($("input[name='check']:checked")[0]).val();
        var changAnData = $($("input[name='changAnData']:checked")[0]).val();

        var range = $("input[name='personNum']:checked").val();
        var start = null;
        var end = null;
        if(range == ""){
            start = null;
        }else if(range.indexOf(",") != -1){
            var rangeArr = range.split(",");
            start = parseInt(rangeArr[0]);
            end = parseInt(rangeArr[1]);
        }else{
            start = parseInt(range);
        }
        searchData = {
            crowdType: $.select2.val("#crowdType"),
            crowdName: $.select2.val("#crowdName"),
            person:$("input[name='person']:checked").val(),
            hotel:hotel,
            netBar:netBar,
            check:check,
            changAnData:changAnData,
            startTime:getstartTime(),
            endTime:getEndTime(),
            start: start,
            end:end,
            serchNum :serchNum
        }
        var obj = new Object();
        $.util.objToStrutsFormData(searchData, "parameterPojo", obj);
        pointLayer.getSource().clear();
        window.top.$.common.showOrHideLoading(true);
        var element = popup.getElement();
        $(element).popover('destroy');
        if(hotel){
            checkNum++
            $.ajax({
                url: context + '/inBeijingMap/findHotelTrack',
                data: obj,
                type: "post",
                success: function (map) {
                    if(map.serchNum == serchNum){

                        window.top.$.common.showOrHideLoading(false);
                        var mapList = map.inBeiJingMap;
                        setPoint(mapList);
                        // $("#hotelNum").text(mapList.length);
                        // $("#hotelPersonNum").text(map.personList.length);
                        count += map.personList.length;
                        successSerchNum ++;
                        hotelNumStr = "旅店"+mapList.length+"条";
                        hotelPersonNumStr = "旅店"+map.personList.length+"人"
                        afterSerch();
                    }
                    //pointLayer.setZIndex(3);
                },
                error:function(){
                    window.top.$.common.showOrHideLoading(false);
                }
            });
        }



        if(netBar){
            checkNum++
            $.ajax({
                url: context + '/inBeijingMap/findNetBarTrack',
                data: obj,
                type: "post",
                success: function (map) {
                    if(map.serchNum == serchNum) {
                        window.top.$.common.showOrHideLoading(false);
                        var mapList = map.inBeiJingMap;
                        setPoint(mapList);
                        // $("#netBarNum").text(mapList.length);
                        // $("#netBarPersonNum").text(map.personList.length);
                        count += map.personList.length;
                        successSerchNum ++;
                        netBarNumStr = "网吧"+mapList.length+"条";
                        netBarPersonNumStr = "网吧"+map.personList.length+"人"
                        afterSerch();

                    }
                    //pointLayer.setZIndex(3);
                },
                error:function(){
                    window.top.$.common.showOrHideLoading(false);
                }
            });
        }
        if(check){
            checkNum++
            $.ajax({
                url: context + '/inBeijingMap/findCheckTrack',
                data: obj,
                type: "post",
                success: function (map) {
                    if(map.serchNum == serchNum) {
                        window.top.$.common.showOrHideLoading(false);
                        var mapList = map.inBeiJingMap;
                        setPoint(mapList);
                        // $("#checkNum").text(mapList.length);
                        // $("#checkPersonNum").text(map.personList.length);
                        count += map.personList.length;
                        successSerchNum ++;
                        checkNumStr = "核录"+mapList.length+"条";
                        checkPersonNumStr = "核录"+map.personList.length+"人";
                        afterSerch();
                    }
                    //pointLayer.setZIndex(3);
                },
                error:function(){

                }
            });
        }

        if(changAnData){
            $.ajax({
                url: context + '/inBeijingMap/findChangAnDataTrack',
                data: obj,
                type: "post",
                success: function (map) {
                    if(map.serchNum == serchNum) {
                        window.top.$.common.showOrHideLoading(false);
                        var mapList = map.inBeiJingMap;
                        setChangAnDataPoint(mapList);
                        changAnDataNumStr = "长安数据共计："+map.personList.length+"人。";
                        $("#personnNum").text(changAnDataNumStr);
                        $("#result").show();
                    }
                    //pointLayer.setZIndex(3);
                },
                error:function(){

                }
            });
        }
        if(checkNum == 0){
            window.top.$.common.showOrHideLoading(false);
        }
    }

    function setPoint(mapList){
        for(var i in  mapList){
            allSearchPointList.push(mapList[i]);
            for(var k in mapList[i]){
                var len = personSet.length;
                var flag = true;
                for(var j = 0; j < len; j++){
                    if(personSet[j] == mapList[i][k].idnumber){
                        flag = false;
                    }
                }
                if(flag){
                    personSet.push(mapList[i][k].idnumber);

                }
            }

            var point = null;
            if(mapList[i][0].type ==  'hotel'){
                if( parseInt(mapList[i].length) < 3){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,blueHotelStyle);
                }else if( parseInt(mapList[i].length) < 5){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,orangeHotelStyle);
                }else if( parseInt(mapList[i].length) >=5){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,redHotelStyle);
                }
            }else if(mapList[i][0].type ==  'netBar'){
                if( parseInt(mapList[i].length) < 3){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,bluePcStyle);
                }else if( parseInt(mapList[i].length) < 5){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,orangePcStyle);
                }else if( parseInt(mapList[i].length) >=5){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,redPcStyle);
                }
            }else if(mapList[i][0].type ==  'check'){
                if( parseInt(mapList[i].length) < 3){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,bluePoliceStyle);
                }else if( parseInt(mapList[i].length) < 5){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,orangePoliceStyle);
                }else if( parseInt(mapList[i].length) >=5){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,redPoliceStyle);
                }
            }

            pointLayer.getSource().addFeature(point);
            point.setProperties(mapList[i]);
        }
    }

    function setChangAnDataPoint(mapList){
        allSearchPointList = mapList;
        for(var i in  mapList){
            if(mapList[i][0].longitude != 'NULL' && mapList[i][0].latitude != 'NULL'){
                var point = null;
                if( parseInt(mapList[i].length) < 3){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,blueJizStyle);
                }else if( parseInt(mapList[i].length) < 5){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,orangeJizStyle);
                }else if( parseInt(mapList[i].length) >=5){
                    point =  $.mapUtil.getPoint(mapList[i][0].longitude,mapList[i][0].latitude,redJizStyle);
                }
                pointLayer.getSource().addFeature(point);
                point.setProperties(mapList[i]);
            }
        }
    }

   function  getstartTime(){
        var startDate = $.laydate.getDate("#dateRangeId","start") == null ? null : $.laydate.getDate("#dateRangeId","start");
        if(startDate){
            return new Date(startDate).getTime();
        }else{
            return null;
        }
    }
    function  getEndTime(){
        var endDate = $.laydate.getDate("#dateRangeId","end") == null ? null : $.laydate.getDate("#dateRangeId","end");
        if(endDate){
            endDate = $.date.endRange(endDate,"yyyy-MM-dd");
            return new Date(endDate).getTime();
        }else{
            return  new Date().getTime();
        }
    }

    function detialPersonClick(name,address,type){
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/trend/detialPerson',
            pageLoading: true,
            title: "人员详情",
            width: "800px",
            height: "620px",
            btn: ["关闭"],
            callBacks: {
                btn1: function (index, layero) {
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose: false,
            success: function (layero, index) {

            },
            initData: {
                name :name,
                address: address,
                type : type,
                searchData : searchData
            },
            end: function () {
                initTable();
            }
        });
    }

    function beforeSerch(){
        // $("#checkNum").text("..");
        // $("#checkPersonNum").text("..");
        // $("#netBarNum").text("..");
        // $("#netBarPersonNum").text("..");
        // $("#hotelNum").text("..");
        // $("#hotelPersonNum").text("..");
        $("#num").text("");
        $("#personnNum").text("");
        $("#tatalPersonNum").text("..");

        $("#totalNum").hide();



         hotelNumStr = "";
         netBarNumStr = "";
         checkNumStr = "";

         hotelPersonNumStr = "";
         netBarPersonNumStr = "";
         checkPersonNumStr = "";

        checkNum = 0;
        successSerchNum = 0;
        count = 0;
        serchNum ++;
        personSet = [];
        allSearchPointList = [];
    }


    function afterSerch(){
        if(successSerchNum == checkNum){
            $("#tatalPersonNum").text(personSet.length);
            var numStr = "";
            numStr += hotelNumStr;
            if(numStr != "" && netBarNumStr != "" ){
                numStr += "，";
                numStr += netBarNumStr;
            }else{
                numStr += netBarNumStr;
            }

            if(numStr != "" && checkNumStr != ""){
                numStr += "，";
                numStr += checkNumStr;
            }else{
                numStr += checkNumStr;
            }
            numStr += "。";
            $("#num").text(numStr);

            var personNumStr = "其中";

            personNumStr += hotelPersonNumStr;
            if(personNumStr != "其中" && netBarPersonNumStr != ""){
                personNumStr += "，";
                personNumStr += netBarPersonNumStr;
            }else{
                personNumStr += netBarPersonNumStr;
            }

            if(personNumStr != "其中" && checkPersonNumStr != ""){
                personNumStr += "，";
                personNumStr += checkPersonNumStr;
            }else{
                personNumStr += checkPersonNumStr;
            }
            personNumStr += "。";

            $("#personnNum").text(personNumStr);
            $("#result").show();
            $("#totalNum").show();

        }
    }

    function allPingClick(){
        $.util.topWindow().$.layerAlert.dialog({
            content: context + '/show/page/web/trend/allPingBeiJingMap',
            pageLoading: true,
            title: "地图全屏显示",
            width: "100%",
            height: "100%",
            btn: ["关闭"],
            callBacks: {
                btn1: function (index, layero) {
                    $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
                }
            },
            shadeClose: false,
            success: function (layero, index) {

            },
            initData: {
                allSearchPointList :allSearchPointList
            },
            end: function () {

            }
        });
    }



    var blueHotelImage = new Image();
    blueHotelImage.src = '../../../../images/map/icon-blue-hotel.png';
    var blueHotelStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: blueHotelImage,
            imgSize: [40, 40]//点大小
        })});

    var orangeHotelImage = new Image();
    orangeHotelImage.src = '../../../../images/map/icon-orange-hotel.png';
    var orangeHotelStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: orangeHotelImage,
            imgSize: [40, 40]//点大小
        })});

    var orangeHotelImage = new Image();
    orangeHotelImage.src = '../../../../images/map/icon-orange-hotel.png';
    var orangeHotelStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: orangeHotelImage,
            imgSize: [40, 40]//点大小
        })});

    var redHotelImage = new Image();
    redHotelImage.src = '../../../../images/map/icon-red-hotel1.png';
    var redHotelStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: redHotelImage,
            imgSize: [40, 40]//点大小
        })});


    var bluePoliceImage = new Image();
    bluePoliceImage.src = '../../../../images/map/icon-blue-police.png';
    var bluePoliceStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: bluePoliceImage,
            imgSize: [40, 40]//点大小
        })});


    var orangePoliceImage = new Image();
    orangePoliceImage.src = '../../../../images/map/icon-orange-police.png';
    var orangePoliceStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: orangePoliceImage,
            imgSize: [40, 40]//点大小
        })});

    var redPoliceImage = new Image();
    redPoliceImage.src = '../../../../images/map/icon-red-police.png';
    var redPoliceStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: redPoliceImage,
            imgSize: [40, 40]//点大小
        })});

    var bluePcImage = new Image();
    bluePcImage.src = '../../../../images/map/icon-blue-pc.png';
    var bluePcStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: bluePcImage,
            imgSize: [40, 40]//点大小
        })});


    var orangePcImage = new Image();
    orangePcImage.src = '../../../../images/map/icon-orange-pc.png';
    var orangePcStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: orangePcImage,
            imgSize: [40, 40]//点大小
        })});

    var redPcImage = new Image();
    redPcImage.src = '../../../../images/map/icon-red-pc.png';
    var redPcStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: redPcImage,
            imgSize: [40, 40]//点大小
        })});


    var blueJizImage = new Image();
    blueJizImage.src = '../../../../images/map/icon-blue-jiz.png';
    var blueJizStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: blueJizImage,
            imgSize: [40, 40]//点大小
        })});

    var orangeJizImage = new Image();
    orangeJizImage.src = '../../../../images/map/icon-orange-jiz.png';
    var orangeJizStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: orangeJizImage,
            imgSize: [40, 40]//点大小
        })});

    var redJizImage = new Image();
    redJizImage.src = '../../../../images/map/icon-red-jiz.png';
    var redJizStyle = new ol.style.Style({
        image: new ol.style.Icon({
            img: redJizImage,
            imgSize: [40, 40]//点大小
        })});




})(jQuery);


function detialPersonClick(idmumberList){
    $.util.topWindow().$.layerAlert.dialog({
        content: context + '/show/page/web/trend/detialPerson',
        pageLoading: true,
        title: "人员详情",
        width: "800px",
        height: "620px",
        btn: ["关闭"],
        callBacks: {
            btn1: function (index, layero) {
                $.util.topWindow().$.layerAlert.closeWithLoading(index); //关闭弹窗
            }
        },
        shadeClose: false,
        success: function (layero, index) {

        },
        initData: {
            idmumberList :idmumberList
        },
        end: function () {

        }
    });
}