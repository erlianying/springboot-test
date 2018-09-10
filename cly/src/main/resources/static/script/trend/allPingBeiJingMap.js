var searchData = null;

(function($){
    "use strict";

    var frameData = window.top.$.layerAlert.getFrameInitData(window) ;
    var initData = frameData.initData ;
    var pointLayer = null;
    var popup = null;
    var  mapList = initData.allSearchPointList;

    $(document).ready(function() {

        pointLayer = new ol.layer.Vector({
            source: new ol.source.Vector()
        });

        popup = new ol.Overlay({
            element: document.getElementById('popup')
        });

        initMap();
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

                //添加点
                initPointData();

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
                    if( !('changAnData' == featureData.type)){
                        var len = 0;
                        for(var i in featureData){
                            len++;
                        }
                        len--;
                        for(var i = 0; i < len; i++ ){
                            if(i < len -1){
                                idmumberList += featureData[i].idnumber + ",";
                            }else{
                                idmumberList += featureData[i].idnumber;
                            }
                        }
                    }

                    popup.setPosition(coordinate);
                    if('changAnData' == featureData.type){
                        $(element).popover({
                            'placement': 'bottom',
                            'animation': false,
                            'html': true,
                            'content': '<p style="width: 250px; color: #0f0f0f">身份证号：'+featureData.idnumber+'<br>姓名：'+featureData.name+'<br>采集时间： '+ $.date.timeToStr(featureData.acquisitionTime, 'yyyy-MM-dd HH:mm:ss')+'<br>采集地点：'+ featureData.address +'</p>'
                        });
                    }else if(featureData[0].type ==  'hotel'){
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
                    }
                    $(element).popover('show');
                });
            },
        })
    }

    function initPointData(){
        setPoint(mapList);
    }

    var svg1='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 430.114 430.114" style="enable-background:new 0 0 430.114 430.114;" ' +
        'xml:space="preserve"><g transform="matrix(0.0971328 2.37907e-17 -2.37907e-17 0.0971328 194.168 194.168)"><g>'+
        '<path  d="M356.208,107.051c-1.531-5.738-4.64-11.852-6.94-17.205C321.746,23.704,261.611,0,213.055,0   C148.054,0,76.463,43.586,66.905,133.427v18.355c0,0.766,0.264,7.647,0.639,11.089c5.358,42.816,39.143,88.32,64.375,131.136   ' +
        'c27.146,45.873,55.314,90.999,83.221,136.106c17.208-29.436,34.354-59.259,51.17-87.933c4.583-8.415,9.903-16.825,14.491-24.857   c3.058-5.348,8.9-10.696,11.569-15.672c27.145-49.699,70.838-99.782,70.838-149.104v-20.262   ' +
        'C363.209,126.938,356.581,108.204,356.208,107.051z M214.245,199.193c-19.107,0-40.021-9.554-50.344-35.939   c-1.538-4.2-1.414-12.617-1.414-13.388v-11.852c0-33.636,28.56-48.932,53.406-48.932c30.588,0,54.245,24.472,54.245,55.06   ' +
        'C270.138,174.729,244.833,199.193,214.245,199.193z" data-original="#000000" class="active-path" data-old_color="#000000"'+
        ' fill="#316FD3"/>'+
        '</g></g> </svg>';
    var svg2='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 430.114 430.114" style="enable-background:new 0 0 430.114 430.114;" ' +
        'xml:space="preserve"><g transform="matrix(0.0971328 2.37907e-17 -2.37907e-17 0.0971328 194.168 194.168)"><g>'+
        '<path  d="M356.208,107.051c-1.531-5.738-4.64-11.852-6.94-17.205C321.746,23.704,261.611,0,213.055,0   C148.054,0,76.463,43.586,66.905,133.427v18.355c0,0.766,0.264,7.647,0.639,11.089c5.358,42.816,39.143,88.32,64.375,131.136   ' +
        'c27.146,45.873,55.314,90.999,83.221,136.106c17.208-29.436,34.354-59.259,51.17-87.933c4.583-8.415,9.903-16.825,14.491-24.857   c3.058-5.348,8.9-10.696,11.569-15.672c27.145-49.699,70.838-99.782,70.838-149.104v-20.262   ' +
        'C363.209,126.938,356.581,108.204,356.208,107.051z M214.245,199.193c-19.107,0-40.021-9.554-50.344-35.939   c-1.538-4.2-1.414-12.617-1.414-13.388v-11.852c0-33.636,28.56-48.932,53.406-48.932c30.588,0,54.245,24.472,54.245,55.06   ' +
        'C270.138,174.729,244.833,199.193,214.245,199.193z" data-original="#000000" class="active-path" data-old_color="#000000"'+
        ' fill="#D7E82F"/>'+
        '</g></g> </svg>';
    var svg3='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 430.114 430.114" style="enable-background:new 0 0 430.114 430.114;" ' +
        'xml:space="preserve"><g transform="matrix(0.0971328 2.37907e-17 -2.37907e-17 0.0971328 194.168 194.168)"><g>'+
        '<path  d="M356.208,107.051c-1.531-5.738-4.64-11.852-6.94-17.205C321.746,23.704,261.611,0,213.055,0   C148.054,0,76.463,43.586,66.905,133.427v18.355c0,0.766,0.264,7.647,0.639,11.089c5.358,42.816,39.143,88.32,64.375,131.136   ' +
        'c27.146,45.873,55.314,90.999,83.221,136.106c17.208-29.436,34.354-59.259,51.17-87.933c4.583-8.415,9.903-16.825,14.491-24.857   c3.058-5.348,8.9-10.696,11.569-15.672c27.145-49.699,70.838-99.782,70.838-149.104v-20.262   ' +
        'C363.209,126.938,356.581,108.204,356.208,107.051z M214.245,199.193c-19.107,0-40.021-9.554-50.344-35.939   c-1.538-4.2-1.414-12.617-1.414-13.388v-11.852c0-33.636,28.56-48.932,53.406-48.932c30.588,0,54.245,24.472,54.245,55.06   ' +
        'C270.138,174.729,244.833,199.193,214.245,199.193z" data-original="#000000" class="active-path" data-old_color="#000000"'+
        ' fill="#F5BB10"/>'+
        '</g></g> </svg>';
    var svg4='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 430.114 430.114" style="enable-background:new 0 0 430.114 430.114;" ' +
        'xml:space="preserve"><g transform="matrix(0.0971328 2.37907e-17 -2.37907e-17 0.0971328 194.168 194.168)"><g>'+
        '<path  d="M356.208,107.051c-1.531-5.738-4.64-11.852-6.94-17.205C321.746,23.704,261.611,0,213.055,0   C148.054,0,76.463,43.586,66.905,133.427v18.355c0,0.766,0.264,7.647,0.639,11.089c5.358,42.816,39.143,88.32,64.375,131.136   ' +
        'c27.146,45.873,55.314,90.999,83.221,136.106c17.208-29.436,34.354-59.259,51.17-87.933c4.583-8.415,9.903-16.825,14.491-24.857   c3.058-5.348,8.9-10.696,11.569-15.672c27.145-49.699,70.838-99.782,70.838-149.104v-20.262   ' +
        'C363.209,126.938,356.581,108.204,356.208,107.051z M214.245,199.193c-19.107,0-40.021-9.554-50.344-35.939   c-1.538-4.2-1.414-12.617-1.414-13.388v-11.852c0-33.636,28.56-48.932,53.406-48.932c30.588,0,54.245,24.472,54.245,55.06   ' +
        'C270.138,174.729,244.833,199.193,214.245,199.193z" data-original="#000000" class="active-path" data-old_color="#000000"'+
        ' fill="#d44b4b"/>'+
        '</g></g> </svg>';
    var mysvg1 = new Image();
    var mysvg2 = new Image();
    var mysvg3 = new Image();
    var mysvg4 = new Image();
    mysvg1.src = 'data:image/svg+xml,' + escape(svg1);
    mysvg2.src = 'data:image/svg+xml,' + escape(svg2);
    mysvg3.src = 'data:image/svg+xml,' + escape(svg3);
    mysvg4.src = 'data:image/svg+xml,' + escape(svg4);
    /*加载style样式*/
    var style1=new ol.style.Style({
        image: new ol.style.Icon({
            img: mysvg1,
            imgSize: [512, 512]
        })});
    var style2=new ol.style.Style({
        image: new ol.style.Icon({
            img: mysvg2,
            imgSize: [512, 512]
        })});
    var style3=new ol.style.Style({
        image: new ol.style.Icon({
            img: mysvg3,
            imgSize: [512, 512]
        })});

    var style4=new ol.style.Style({
        image: new ol.style.Icon({
            img: mysvg4,
            imgSize: [512, 512]
        })});

    function setPoint(mapList){
        for(var i in  mapList){
            var point = null;
            if('changAnData' == mapList[i].type){
                point =  $.mapUtil.getPoint(mapList[i].longitude,mapList[i].latitude,blueJizStyle);
            }else{
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
            }
            pointLayer.getSource().addFeature(point);
            point.setProperties(mapList[i]);
        }
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