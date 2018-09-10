$.mapUtil = $.mapUtil || {};
(function($){
    "use strict";
    //百度地图服务地址
    // var BDMapServer = mapJ.BAI_DU_MAP_SERVER_URL + 'mapService';

    var PI = 3.14159265358979324 ;
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0 ;
    $(document).ready(function() {

    });

    /**
     * 初始化百度地图底图
     *
     * @param domId 地图容器
     * @param option 配置参数
     * @returns
     */
    function initBDMap(BDMapServer,domId, option){
        //自定义分辨率和瓦片坐标系
        var resolutions = [];
        var maxZoom = 17;
        //计算百度使用的分辨率
        for(var i=0; i<=maxZoom; i++){
            resolutions[i] = Math.pow(2, maxZoom-i);
        }
        var tilegrid  = new ol.tilegrid.TileGrid({
            origin: [0,0], //设置原点坐标
            resolutions: resolutions //设置分辨率
        });

        //创建百度地图的数据源
        var baidu_source = new ol.source.TileImage({
            projection: ol.proj.get("EPSG:900913"),
            tileGrid: tilegrid,
            wrapX: false ,
            tileUrlFunction: function(tileCoord, pixelRatio, proj){
                if(!tileCoord){
                    return "";
                }
                var z = tileCoord[0];
                var x = tileCoord[1];
                var y = tileCoord[2];
                return BDMapServer + "/bdresource?x="+x+"&y="+y+"&z="+z;
            }
        });

        var baidu_layer = new ol.layer.Tile({
            source: baidu_source
        });

        var map = new ol.Map({
            target: domId , // 地图底图dom容器
            logo:false , //是否显示logo
            layers: [baidu_layer] , //底图图层
            view: new ol.View({
//				extent : [8179712, 163840, 15048704, 7077888] ,
                center:  [12955262.0586262602, 4828318.905400329],
                zoom: 11 ,
                maxZoom : maxZoom ,
//				maxResolution : 16384
            })
        });
        map.addControl(new ol.control.MousePosition());
        return map;
    }

    //以下是从BD地图的JS库中找出的经纬度和墨卡托的转換关系代码
    var EARTHRADIUS=6370996.81;
    var MCBAND=[12890594.86,8362377.87,5591021,3481989.83,1678043.12,0];
    var LLBAND=[75,60,45,30,15,0];
    var MC2LL=[
        [1.410526172116255e-8,0.00000898305509648872,-1.9939833816331,200.9824383106796,-187.2403703815547,91.6087516669843,-23.38765649603339,2.57121317296198,-0.03801003308653,17337981.2],
        [-7.435856389565537e-9,0.000008983055097726239,-0.78625201886289,96.32687599759846,-1.85204757529826,-59.36935905485877,47.40033549296737,-16.50741931063887,2.28786674699375,10260144.86],
        [-3.030883460898826e-8,0.00000898305509983578,0.30071316287616,59.74293618442277,7.357984074871,-25.38371002664745,13.45380521110908,-3.29883767235584,0.32710905363475,6856817.37],
        [-1.981981304930552e-8,0.000008983055099779535,0.03278182852591,40.31678527705744,0.65659298677277,-4.44255534477492,0.85341911805263,0.12923347998204,-0.04625736007561,4482777.06],
        [3.09191371068437e-9,0.000008983055096812155,0.00006995724062,23.10934304144901,-0.00023663490511,-0.6321817810242,-0.00663494467273,0.03430082397953,-0.00466043876332,2555164.4],
        [2.890871144776878e-9,0.000008983055095805407,-3.068298e-8,7.47137025468032,-0.00000353937994,-0.02145144861037,-0.00001234426596,0.00010322952773,-0.00000323890364,826088.5]
    ];
    var LL2MC=[
        [-0.0015702102444,111320.7020616939,1704480524535203,-10338987376042340,26112667856603880,-35149669176653700,26595700718403920,-10725012454188240,1800819912950474,82.5],
        [0.0008277824516172526,111320.7020463578,647795574.6671607,-4082003173.641316,10774905663.51142,-15171875531.51559,12053065338.62167,-5124939663.577472,913311935.9512032,67.5],
        [0.00337398766765,111320.7020202162,4481351.045890365,-23393751.19931662,79682215.47186455,-115964993.2797253,97236711.15602145,-43661946.33752821,8477230.501135234,52.5],
        [0.00220636496208,111320.7020209128,51751.86112841131,3796837.749470245,992013.7397791013,-1221952.21711287,1340652.697009075,-620943.6990984312,144416.9293806241,37.5],
        [-0.0003441963504368392,111320.7020576856,278.2353980772752,2485758.690035394,6070.750963243378,54821.18345352118,9540.606633304236,-2710.55326746645,1405.483844121726,22.5],
        [-0.0003218135878613132,111320.7020701615,0.00369383431289,823725.6402795718,0.46104986909093,2351.343141331292,1.58060784298199,8.77738589078284,0.37238884252424,7.45]
    ];

    /**
     * WGS-84(GPS全球定位系统坐标系) 转 GCJ-02(国家测绘局坐标系)
     */
    function gpsToGcj (wgsLon, wgsLat) {
        var d = delta(wgsLat, wgsLon);
        return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
    }

    function transformLat (x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    function transformLon (x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
        return ret;
    }

    function delta (lat, lon) {
        var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
        var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
        var dLat = transformLat(lon - 105.0, lat - 35.0);
        var dLon = transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
        return {'lat': dLat, 'lon': dLon};
    }

    /**
     * GCJ-02(国家测绘局坐标系) 转 BD-09(百度坐标系)
     */
    function gcjToBaiDu (gcjLon, gcjLat) {
        var x = gcjLon, y = gcjLat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
        var bdLon = z * Math.cos(theta) + 0.0065;
        var bdLat = z * Math.sin(theta) + 0.006;
        return {'lat' : bdLat,'lon' : bdLon};
    }

    /**
     * 百度经纬度转墨卡托
     * @param lon 经度
     * @param lat 纬度
     */
    function baiDuToMercator(lon, lat){
        var cC,cE;
        var T = {lon:lon,lat:lat};
        T.lon=getLoop(T.lon,-180,180);
        T.lat=getRange(T.lat,-74,74);
        cC= {lon:T.lon,lat:T.lat};
        for(var cD=0;cD<LLBAND.length;cD++){
            if(cC.lat>=LLBAND[cD]){
                cE=LL2MC[cD];
                break
            }
        }
        if(!cE){
            for(var cD=LLBAND.length-1;cD>=0;cD--){
                if(cC.lat<=-LLBAND[cD]){
                    cE=LL2MC[cD];
                    break
                }
            }
        }
        var cF=convertor(T,cE);
        return {lon:cF.lon,lat:cF.lat};
    }

    function convertor(cD,cE){
        if(!cD||!cE){
            return
        }
        var T=cE[0]+cE[1]*Math.abs(cD.lon);
        var cC=Math.abs(cD.lat)/cE[9];
        var cF=cE[2]+cE[3]*cC+cE[4]*cC*cC+cE[5]*cC*cC*cC+cE[6]*cC*cC*cC*cC+cE[7]*cC*cC*cC*cC*cC+cE[8]*cC*cC*cC*cC*cC*cC;
        T*=(cD.lon<0?-1:1);
        cF*=(cD.lat<0?-1:1);
        return {lon:T,lat:cF}
    }

    function getLoop(cD,cC,T){
        while(cD>T){
            cD-=T-cC
        }
        while(cD<cC){
            cD+=T-cC
        }
        return cD
    }

    function getRange(cD,cC,T){
        if(cC!=null){
            cD=Math.max(cD,cC)
        }
        if(T!=null){
            cD=Math.min(cD,T)
        }
        return cD
    }
    //点图片样式
    var svg1='<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">'+
        '<path fill="#FF7F50" d="M22.906,10.438c0,4.367-6.281,14.312-7.906,17.031c-1.719-2.75-7.906-12.665-7.906-17.031S10.634,2.531,15,2.531S22.906,6.071,22.906,10.438z"/>'+
        '<circle fill="#FFFFFF" cx="15" cy="10.677" r="3.291"/></svg>';

    var mysvg1 = new Image();

    mysvg1.src = 'data:image/svg+xml,' + escape(svg1);
    /*加载style样式*/
    var style1=new ol.style.Style({
        image: new ol.style.Icon({
            img: mysvg1,
            imgSize: [30, 30]//点大小
        })});




    function queryData(pointLayer,pojoList,style){
        pointLayer.getSource().clear();
        for(var i in pojoList){
           var point = getPoint(pojoList.longitude,pojoList.latitude);
            pointLayer.getSource().addFeature(point);
            point.setProperties(pojoList[i]);
        }
    }

    function getPoint(lon,lat,style){
        var lonlat = baiDuToMercator(lon, lat);
        var point = new ol.Feature({
            geometry: new ol.geom.Point([lonlat.lon, lonlat.lat])
        });
        if(style){
            point.setStyle(style);
        }else{
            point.setStyle(style1);
        }
        return point;
    }

    /*弹出框*/
    function popUpWindow(divId){
        var popup = new ol.Overlay({
            element: document.getElementById(divId)
        });
        return popup;
    }

    function getPopUpWindow(popup,map,htmlStr){
        var element = popup.getElement();
        $(element).popover('destroy');
        var coordinate = evt.coordinate;
        var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature){
            return feature;
        });
        if(!feature){
            return false;
        }
        popup.setPosition(coordinate);
        $(element).popover({
            'placement': 'bottom',
            'animation': false,
            'html': true,
            'content': htmlStr
        });
        $(element).popover('show');
    }

    /**
     * 暴露本js方法，让其它js可调用
     */
    jQuery.extend($.mapUtil, {
        /**
         * 新建地图底图
         */
         initBDMap : initBDMap,
         /**
         * WGS-84(GPS全球定位系统坐标系) 转 墨卡托坐标系
         * @param lon 经度
         * @param lat 纬度
         */
        gpsToMercator : function(lon, lat) {
            var gcj = gpsToGcj(lon,lat);
            var baiDu = gcjToBaiDu(gcj.lon,gcj.lat);
            return baiDuToMercator(baiDu.lon,baiDu.lat);
        },
        /**
         * 百度坐标 转 墨卡托坐标系
         */
        baiDuToMercator : baiDuToMercator,

        /**
         * 得到点的集合
         */
        queryData:queryData,

        /**
         * 得到单个点
         */
        getPoint:getPoint,


    });
})(jQuery);