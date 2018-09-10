
$.echart = $.echart || {};

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    }
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    
    "use strict";
    
    (function($) {
    	"use strict";
    	
    	var extraSettings = {
    	    initType:null, //loadJsByOrder, dojo, requireJs
    		load_maps:[],
    		load_extensions:[],
    		callBacks:{
    			initSuccessCallBack:function(myChart){
    				
    			}
    		}
    	}
    	
    	var Constant = {
    		CHART_TYPES : {
    		    scatter: {
    		    	name:'散点图',
    		    	key:"scatter"
    		    },
    		    line: {
    		    	name:'折线图',
    		    	key:"line"
    		    },
    		    bar: {
    		    	name:'柱状图',
    		    	key:"bar"
    		    },
    		    map: {
    		    	name:'地图',
    		    	key:"map"
    		    },
    		    pie: {
    		    	name:'饼图',
    		    	key:"pie"
    		    },
    		    radar: {
    		    	name:'雷达图',
    		    	key:"radar"
    		    },
    		    candlestick: {
    		    	name:'k线图',
    		    	key:"candlestick"
    		    },
    		    boxplot: {
    		    	name:'箱线图',
    		    	key:"boxplot"
    		    },
    		    heatmap: {
    		    	name:'热力图',
    		    	key:"heatmap"
    		    },
    		    graph: {
    		    	name:'关系图',
    		    	key:"graph"
    		    },
    		    treemap: {
    		    	name:'矩形树图',
    		    	key:"treemap"
    		    },
    		    parallel: {
    		    	name:'平行坐标',
    		    	key:"parallel"
    		    },
    		    sankey: {
    		    	name:'桑基图',
    		    	key:"sankey"
    		    },
    		    funnel: {
    		    	name:'漏斗图',
    		    	key:"funnel"
    		    },
    		    gauge: {
    		    	name:'仪表盘',
    		    	key:"gauge"
    		    }
    		},
    		SKIN:{
    			vintage:{
    				name:"复古",
    				key:"vintage"
    			},
    			dark:{
    				dark:"黑色",
    				key:"dark"
    			},
    			macarons:{
    				dark:"马卡龙",
    				key:"macarons"
    			},
    			infographic:{
    				dark:"图形化",
    				key:"infographic"
    			},
    			shine:{
    				dark:"闪耀",
    				key:"shine"
    			},
    			roma:{
    				dark:"罗马",
    				key:"roma"
    			}
    		},
    		MAP:{
    			CHINA:{
    				"KEY":"china",
    				"KEY-CONTOUR":"china-contour",
    				"PROVINCE":{
    					"ANHUI":"china/province/anhui",
    					"AOMEN":"china/province/aomen",
    					"BEIJING":"china/province/beijing",
    					"CHONGQING":"china/province/chongqing",
    					"FUJIAN":"china/province/fujian",
    					"GANSU":"china/province/gansu",
    					"GUANGDONG":"china/province/guangdong",
    					"GUANGXI":"china/province/guangxi",
    					"GUIZHOU":"china/province/guizhou",
    					"HAINAN":"china/province/hainan",
    					"HEBEI":"china/province/hebei",
    					"HEILONGJIANG":"china/province/heilongjiang",
    					"HENAN":"china/province/henan",
    					"HUBEI":"china/province/hubei",
    					"HUNAN":"china/province/hunan",
    					"JIANGSU":"china/province/jiangsu",
    					"JIANGXI":"china/province/jiangxi",
    					"JILIN":"china/province/jilin",
    					"LIAONING":"china/province/liaoning",
    					"NEIMENGGU":"china/province/neimenggu",
    					"NINGXIA":"china/province/ningxia",
    					"QINGHAI":"china/province/qinghai",
    					"SHANDONG":"china/province/shandong",
    					"SHANGHAI":"china/province/shanghai",
    					"SHANXI":"china/province/shanxi",
    					"SHANXI1":"china/province/shanxi1",
    					"SICHUAN":"china/province/sichuan",
    					"TIANJIN":"china/province/tianjin",
    					"XIANGGANG":"china/province/xianggang",
    					"XINJIANG":"china/province/xinjiang",
    					"XIZANG":"china/province/xizang",
    					"YUNNAN":"china/province/yunnan",
    					"ZHEJIANG":"china/province/zhejiang"
    				}
    			},
    			WORLD:{
    				"KEY":"world"
    			}
    		}
    	}
    	
    	var echart = {
    			
    	}
    	
    	$(document).ready(function(){
    		
    		
    	});
    	
    	
    	jQuery.extend($.echart, { 
    		Constant:Constant,
    		init:function(containerId, theme, settings, extra){
    			
    			var extra_option = copySeting(extra, extraSettings) ;
    			
    			var skinVal = theme ;
    			if($.util.isBlank(theme)){
    				skinVal = "macarons" ;
    			}
    			var skin_url = "/js/theme/" ; 
    /*			if($.util.isString(skinVal)){
    				
    			}else{
    				skin_url = skin_url + Constant["SKIN"][skinVal]["key"] + ".js" ;
    				skinVal = Constant["SKIN"][skinVal]["key"] ;
    			}*/
    			skin_url = skin_url + skinVal + ".js" ;
    			
    			
    /*			if(!$.util.exist(extra_option.initType) || extra_option.initType=="loadJsByOrder"){
    				
    			}*/
    			
    			if(extra_option.initType=="dojo" || extra_option.initType == "requireJs"){
    				initEcharts(containerId, skinVal, settings, extra_option) ;
    				return ;
    			}
    			
    			var load_urls = [] ;
    			load_urls.push(skin_url) ;
    			
    			if($.util.exist(extra_option)){
    				$.each(extra_option.load_maps, function(i, val){
    					load_urls.push(map_url(val)) ;
    				});
    				$.each(extra_option.load_extensions, function(i, val){
    					load_urls.push(load_extensions_url(val)) ;
    				});
    			}

    			$.util.loadJsByOrder(load_urls, function(){
    				
    				initEcharts(containerId, skinVal, settings, extra_option) ;
    				
    			}, context + "/common/library/echarts/");

    		},
    		
    		getEchart:function(id){
    			return echart[id] ;
    		},
    		getEcharts:function(){
    			return echart ;
    		},
    		dispose:function(containerId){
    			var obj = $.echart.getEchart(containerId) ;
    			obj.dispose() ;
    			delete echart[containerId];
    		},
    		disposeAll:function(){
    			$.each(echart, function(key, val){
    				$.echart.dispose(key) ;
    			});
    		},
    		getOption:function(containerId){
    			var obj = $.echart.getEchart(containerId) ;
    			return obj.getOption() ;
    		},
    		setOption:function(containerId, option, notMerge, notRefreshImmediately){
    			var obj = $.echart.getEchart(containerId) ;
    			if($.util.exist(notMerge) && $.util.exist(notRefreshImmediately)){
    				obj.setOption(option, notMerge, notRefreshImmediately);
    				return ;
    			}
    			if($.util.exist(notMerge) && !$.util.exist(notRefreshImmediately)){
    				obj.setOption(option, notMerge);
    				return ;
    			}
    			if(!$.util.exist(notMerge) && !$.util.exist(notRefreshImmediately)){
    				obj.setOption(option);
    			}
    		},
    		getDataURL:function(containerId, option){
    			var obj = $.echart.getEchart(containerId) ;
    			if($.util.exist(option)){
    				return obj.getDataURL(option) ;
    			} 
    			return obj.getDataURL() ;
    		},
    		getBase64Str:function(containerId, option){
    			var obj = $.echart.getEchart(containerId) ;
    			var dataUrl = "" ;
    			if($.util.exist(option)){
    				dataUrl = obj.getDataURL(option) ;
    			} 
    			dataUrl = obj.getDataURL() ;
    			return dataUrl.substring(dataUrl.indexOf(",")+1) ;
    		},
    		refreshSeries:function(containerId, series){
    			var obj = $.echart.getEchart(containerId) ;
    			var opt = obj.getOption() ;
    			opt.series = series ;
    			obj.setOption(opt, true);
    		}
    	});
    	
    	function initEcharts(containerId, skinVal, settings, extra_option){
    		
    		var div = $("#" + containerId) ;
    		
    		var obj = echarts.init(div[0], skinVal);
    		echart[containerId] = obj ;
    		obj.setOption(settings) ;
    		
    		obj.extra_option = extra_option ;
    		
    		obj.extra_option.callBacks.initSuccessCallBack(obj);
    	}
    	
    	function load_extensions_url(extension_url){
    		
    		if(extension_url == "bmap"){
    			return "/js/extension/bmap/bmap.js";
    		}
    		
    		return "/js/extension/" + extension_url + ".js";
    	}
    	
    	function map_url(map){
    		if(map=="china"){
    			return "/js/map/js/china/china.js" ;
    		}
    		
    		if(map=="china-contour"){
    			return "/js/map/js/china/china-contour.js" ;
    		}
    		
    		if(map=="world"){
    			return "/js/map/js/world/world.js" ;
    		}
    		
    		if($.util.startsWith(map, "china/province")){
    			return "/js/map/js/" + map + ".js" ;
    		}
    	}

    	function copySeting(opt, fromObj){
    		
    		var tpsettings ;
    		if($.util.exist(fromObj)){
    			tpsettings = $.util.cloneObj(fromObj) ;
    		}else{
    			tpsettings = $.util.cloneObj(basicSettings) ;
    		}

    		$.util.mergeObject(tpsettings, opt) ;
    		return tpsettings ;
    	}
    	
    })(jQuery);
    
}));