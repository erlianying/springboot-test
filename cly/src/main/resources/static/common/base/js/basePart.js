
$(document).ready(function() {	
	
	
/*	JSONP发送方法	
 	$.ajax({
         url:'https://localhost:8443/QyMail/sendMail.action',
         data:{"name":$.util.encode(name), "email":$.util.encode(email), "text":$.util.encode(text)},
         dataType:"jsonp",
         jsonp:"jsonpCallback",
         success:function(data){

         }
    });
*/
	

});

/*******************************ajax 设置开始******************************/
(function($){
	
	"use strict";
	
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};
	$(document).ajaxSend(function(e,xhr,opt){

		var url = $.util.fmtUrl(opt.url) ;
		opt.url = url ;
		
		if($.globalSettings.ajaxLoading){
			if(!$.util.exist(opt.customizedOpt)){
				
			}else if(opt.customizedOpt.ajaxLoading==false){
				
			}else{
				if($.globalSettings.layerAjaxLoadingFrameParam == "top"){
					window.top.$.layerAlert.loading({
						zIndex : 999999999
					}) ;
				}else{
					window.top.frames[$.globalSettings.layerAjaxLoadingFrameParam].$.layerAlert.loading({
						zIndex : 999999999
					}) ;
				}				
			}
		}		
		
		if(opt.customizedOpt && opt.customizedOpt.btn){
			if(opt.customizedOpt.btn.isControlAll){
				var s$ = $ ;
				if($.util.exist(opt.customizedOpt.btn.controlWindow)){
					s$ = opt.customizedOpt.btn.controlWindow.$;
				}
				
				s$(".disableControl").attr("disabled", true) ;
			}else if(opt.customizedOpt.btn.btns){
				var bt = opt.customizedOpt.btn.btns ;
				if( $.util.isArray(bt)){
					$.each(bt, function(i, val){
						if($(val).hasClass("disableControl")){
							$(val).attr("disabled", true) ;
						}	
					});
				}else{
					if($(bt).hasClass("disableControl")){
						$(bt).attr("disabled", true) ;
					}	
				}
			}
		}
	}).ajaxStart(function(e) {
		
	}).ajaxSuccess(function(e,xhr,opt) {
		if($.globalSettings.ajaxLoading){
			if(!$.util.exist(opt.customizedOpt)){
				
			}else if(opt.customizedOpt==false){
				
			}else{
				if($.globalSettings.layerAjaxLoadingFrameParam == "top"){
					window.top.$.layerAlert.closeAll('loading'); 
				}else{
					window.top.frames[$.globalSettings.layerAjaxLoadingFrameParam].$.layerAlert.closeAll('loading'); 
				}				
			}
		}			
	}).ajaxError(function(event,xhr,opt,exc) {
		
		if($(xhr.responseText).find(".stacktrace").length>0){
			$.util.log($(xhr.responseText).find(".stacktrace").html()) ;
		}
		if($.globalSettings.ajaxLoading){
			if(!$.util.exist(opt.customizedOpt)){
				
			}else if(opt.customizedOpt==false){
				
			}else{
				if($.globalSettings.layerAjaxLoadingFrameParam == "top"){
					window.top.$.layerAlert.closeAll('loading'); 
				}else{
					window.top.frames[$.globalSettings.layerAjaxLoadingFrameParam].$.layerAlert.closeAll('loading'); 
				}				
			}
		}
	}).ajaxStop(function(e) {
		if($.globalSettings.ajaxLoading){
			if($.globalSettings.layerAjaxLoadingFrameParam == "top"){
				window.top.$.layerAlert.closeAll('loading'); 
			}else{
				window.top.frames[$.globalSettings.layerAjaxLoadingFrameParam].$.layerAlert.closeAll('loading'); 
			}	
		}
	}).ajaxComplete(function(e,xhr,opt){	
		if(opt.customizedOpt && opt.customizedOpt.btn){
			if(opt.customizedOpt.btn.isControlAll){
				var s$ = $ ;
				if($.util.exist(opt.customizedOpt.btn.controlWindow)){
					s$ = opt.customizedOpt.btn.controlWindow.$;
				}
				
				s$(".disableControl").removeAttr("disabled") ;
			}else if(opt.customizedOpt.btn.btns){
				var bt = opt.customizedOpt.btn.btns ;
				if( $.util.isArray(bt)){
					$.each(bt, function(i, val){
						if($(val).hasClass("disableControl")){
							$(val).removeAttr("disabled"); 
						}	
					});
				}else{
					if($(bt).hasClass("disableControl")){
						$(bt).removeAttr("disabled"); 
					}	
				}
			}
		}

		if($.globalSettings.ajaxLoading){
			if(!$.util.exist(opt.customizedOpt)){
				
			}else if(opt.customizedOpt==false){
				
			}else{
				if($.globalSettings.layerAjaxLoadingFrameParam == "top"){
					window.top.$.layerAlert.closeAll('loading'); 
				}else{
					window.top.frames[$.globalSettings.layerAjaxLoadingFrameParam].$.layerAlert.closeAll('loading'); 
				}				
			}
		}
	});
})(jQuery);	



(function($){
	"use strict";
	
})(jQuery);	
/*******************************ajax 设置结束******************************/

/********************************隐匿函数test开始************************************/
	
;(function($){
	"use strict";
	var settings = {
		testSetting1:1,
		testSetting2:2
	} ;
	
	jQuery.extend({ 
		myTest : function(){
			var obj = new Object() ;
			obj.testName = "myName" ;
			obj.mySetings = settings ;
			obj.testObj = function(){
				$.util.log("result:testValue1==" + this.mySetings.testSetting1 + " and testValue2=="+this.mySetings.testSetting2) ;
			} ;
			obj.updateSettings = function(testSetting1, testSetting2){
				this.mySetings.testSetting1 = testSetting1 ;
				this.mySetings.testSetting2 = testSetting2 ;
			} ;
			return obj ;
		}
	});	
	
})(jQuery);	

/********************************隐匿函数test结束************************************/

/********************************自己在各自的js内定义的方法************************************/
$.common = $.common || {};
/********************************自己在各自的js内定义的方法************************************/

/********************************开发人员提交的方法************************************/
$.custom = $.custom || {};
(function($){
	"use strict";
	jQuery.extend($.custom, { 
		mapToList:function(map) {
			if(!$.util.exist(map)){
				return null;
			}
			var lst = [];
			for (var i in map) {
				var obj = new Object();
				obj.key = i;
				obj.value = map[i];
				lst.push(obj);
			}
			return lst;
		}
	});

})(jQuery);	
/********************************开发人员提交的方法************************************/

/********************************自己在各自的js内定义的方法************************************/

/********************************全局变量开始************************************/
$.globalSettings = $.globalSettings || {};
(function($){
	"use strict";
	jQuery.extend($.globalSettings, {
		isReSize:true,
		firstLoad:true,
		ajaxLoading:true,
		dataTableAjaxLoading:false,
		layerAjaxLoadingFrameParam:"top",
		inputDefaultLength:255
	});	
	
})(jQuery);	

/********************************全局变量结束************************************/

/*****************************通用扩展方法开始*********************************************/
//定义util类
$.util = $.util || {};
(function($){
	"use strict";
	
	var rhorizontal = /left|center|right/ ;
	var rvertical = /top|center|bottom/ ;
	var roffset = /[\+\-]\d+(\.[\d]+)?%?/ ;
	var rposition = /^\w+/ ;
	var rpercent = /%$/ ;
	var supportsOffsetFractions ;
	
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
	body = document.getElementsByTagName( "body" )[ 0 ],
	div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );
	
	div.style.cssText = "position: absolute; left: 10.7432222px;";
	
	offsetLeft = $( div ).offset().left;
	supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;
	
	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
	
	var loaded_url = [] ;
	
	if (!String.prototype.endsWith) {
		  String.prototype.endsWith = function(searchString, position) {
		      var subjectString = this.toString();
		      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
		        position = subjectString.length;
		      }
		      position -= searchString.length;
		      var lastIndex = subjectString.indexOf(searchString, position);
		      return lastIndex !== -1 && lastIndex === position;
		  };
	}
	
	
	//console.log
	jQuery.extend($.util, { 
		
		topWindow:function(){
			var child = window ;
			try{
				var parent = window.parent ;
				while(parent!=child){
					if(parent.isTopWindow){
						break ;
					}
					parent = parent.parent ;
					child = parent ;
				}
				return parent ;
			}catch(e){
				/**
				 * 往上层遍历window对象时如果上层不在一个域，会报错，
				 * 捕获错误并将当时的当前window返回
				 */
				return child ;
			}

		},		
		browserVersion:function(){
			
			var userAgent = navigator.userAgent; 
			var isOpera = userAgent.indexOf("Opera") > -1;
			if (isOpera) {
		         return "Opera"
		     }; //判断是否Opera浏览器
		     
		     if (userAgent.indexOf("Firefox") > -1) {
		         return "FF";
		     } //判断是否Firefox浏览器
		     
		     if (userAgent.indexOf("Chrome") > -1){
		    	   return "Chrome";
		     }
		     
		     if (userAgent.indexOf("Safari") > -1) {
		         return "Safari";
		     } //判断是否Safari浏览器
		     
		     if($.util.isIE()){
		    	 if(userAgent.indexOf("rv:11.0") > 0){
		    		 return "IE11" ;
		    	 }
		    	 
		    	 var IE5 = false ;
		    	 var IE55 = false ;
		    	 var IE6 = false ;
		    	 var IE7 = false ;
		         var IE8 = false;
		         var IE9 = false;
		         var IE10 = false;
		         
		         var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		         reIE.test(userAgent);
		         var fIEVersion = parseFloat(RegExp["$1"]);
		         IE55 = fIEVersion == 5.5;
		         IE6 = fIEVersion == 6.0;
		         IE7 = fIEVersion == 7.0;
		         IE8 = fIEVersion == 8.0;
		         IE9 = fIEVersion == 9.0;
		         IE10 = fIEVersion == 10.0;
		    	 
		         if (IE55) {
		             return "IE55";
		         }
		         if (IE6) {
		             return "IE6";
		         }
		         if (IE7) {
		             return "IE7";
		         }
		         if (IE8) {
		             return "IE8";
		         }
		         if (IE9) {
		             return "IE9";
		         }
		         if (IE10) {
		             return "IE10";
		         }
		     }
		     
		     return "other" ;
		},
		isIE:function() { //ie?
		      if (!!window.ActiveXObject || "ActiveXObject" in window)
		        return true;
		      else
		        return false;
		},
		exist:function(val){
			/**
			 * 判断对象是否存在
			 */
			if(val!=undefined && val!=null){
				return true ;
			}else{
				return false ;
			}
		},
		surportWebsocket:function(){
            if (typeof WebSocket != 'undefined') {
                $.util.log("typeof WebSocket != undefined") ;
            }else{
                $.util.log("typeof WebSocket == undefined") ;
			}

            if (!!window.WebSocket && window.WebSocket.prototype.send){
                $.util.log("!!window.WebSocket && window.WebSocket.prototype.send") ;
			}else{
                $.util.log("(!!window.WebSocket && window.WebSocket.prototype.send) not stand") ;
			}

		},
		initWidget:function(){
//			$.icheck.initIcheck() ;
//			$.select2.initSelect2() ;
//			$.util.initInputLength();
//			$.laydate.initDateRange() ;
//			$.laydate.initLaydate() ;
//			$.util.initTabs() ;
//			$.validform.initValidform() ;
		},
		frameWindow:function(selector){
			return window.top.$(selector)[0].contentWindow ;
		},
		ableA:function(dom, ableOrDis, fakeSetting){
			
			var st = {
				"class":null,
				"style":null
			}
	
			if(fakeSetting){
				$.util.mergeObject(st, fakeSetting) ;
			}

			var a = $(dom) ;
			var a_id = a.attr("id") ;
			var a_class = a.attr("class") ;
			var a_style = a.attr("style") ; 
			if(!$.util.exist(a_style)){
				a_style = "" ;
			}
			a_style = $.trim(a.attr("style")) ; 
			if(a_style.length>0 && (!a_style.endsWith(";"))){
				a_style += ";";
			}
			
			if(!ableOrDis){
				
				if(a.is(':hidden')){
					return ;
				}
				
				var c_bt = $("<button />", {
					"text":a.text(),
					"disabled":"disabled",
					"class":"disabled-fake-a"
				}) ;
/*				if($.util.exist(a_id)){
					c_bt.attr("id", a_id) ;
				}*/
				if($.util.exist(a_class)){
					c_bt.addClass(a_class) ;
				}
	
				if(st["class"]){
					c_bt.addClass(st["class"]) ;
				}
				if(st["style"]){
					a_style += st["style"] ;
				}
				if($.util.exist(a_style)){
					c_bt.attr("style", a_style) ;
				}
				
				a.hide() ;
				a.after(c_bt) ;
				return ;
			}
			
			a.show() ;
			
			$.each(a, function(i, val){
				var _a = $(val) ;
				var next = _a.next() ;
				if(_a.hasClass("disabled-fake-a")){
					_a.remove() ;
					return true ;
				}
				if(next.hasClass("disabled-fake-a")){
					next.remove() ;
				}
			});
		},
		rootWindow:function(){
			return window.top ;
		},
		isPInt:function(str){
			var re = /^[0-9]*$/;
			return re.test(str) ;
		},
		isNum:function(str){
			return !isNaN(str) ;
		},
		mergeObject:function(mother, add){
			$.extend(true, mother, add) ;
		},
		isFunction:function(obj){
			return $.isFunction(obj) ;
		},
		parseJsonByEval:function(str){
			return eval('(' + str + ')');    
		},
		parseJsonByFunc:function(str){
			var json = (new Function("return " + str))();  
		    return json;  
		},
		parseJsonByJSON:function(str){
			//严格遵守json规范，属性名需要用括号括起来
			return JSON.parse(str);  
		},
		isBlank:function(val){
			/**
			 * 判断某字符串是否为空或未定义或长度为0或由空白符(whitespace) 构成
			 */
			if(val!=undefined && val!=null&&!($.trim(val)==="")){
				return false ;
			}else{
				return true ;
			}
		},
		isEmpty:function(val){
			/**
			 * 为空的标准是 val==null 或val==undefined 或 str.length()==0
			 */
			if(val!=undefined && val!=null&&val.length>0){
				return false ;
			}else{
				return true ;
			}
		},
		startsWith:function(str, startVal){
			if(str.indexOf(startVal)==0){
				return true ;
			}
			return false ;
		},
		endsWith:function(str, endVal){
			if(str.substring(str.length-endVal.length)==endVal){
				return true ;
			}
			return false ;
		},
		loadJsByOrder:function(urls, callBack, baseUrl, cacheNotReload){
			
			if($.util.isEmpty(urls)){
				return ;
			}
			
			if(!$.util.isBlank(baseUrl)){
				var a = "a" ;
				if(!$.util.endsWith(baseUrl, "/")){
					baseUrl + "/" ;
				}
			}

			if($.util.isBlank(cacheNotReload) || cacheNotReload==true){
				
				for(var i=0; i<urls.length; i++){
					if(!$.util.isBlank(baseUrl) && $.util.startsWith(urls[i], "/")){
						urls[i] = baseUrl + urls[i].substring(1) ;
					}
					
					if($.inArray(urls[i], loaded_url)>-1){
						urls.splice(i,1);
						i--;
					}
					
				};
				

			}
			
			if(urls.length==0){
				callBack() ;
			}
			
			var ajax_0 ;

			$.each(urls, function(i, val){
				
				if(i==0){
					ajax_0 = $.ajax({
						url: urls[i],
						dataType: "script",
						cache: true, 
						global:false,
						success: function(data, textStatus){
							$.util.log("load_url:" + urls[i]) ;
							loaded_url.push(urls[i]) ;
						},
						error:function(xhr, error, thrown){
							$.util.log("fail_load_url:" + urls[i]) ;
							$.util.log(error) ;
							$.util.log(thrown) ;
						}
					});
					
					if(urls.length == 1){
						ajax_0.done(function(data){
							callBack() ;
					   	}).fail(function(){
					   		
							    
						});
					}
					
					return true ;
				}
				
				var ajax_each = ajax_0.then(function(){
				   var ajax = $.ajax({
						url: urls[i],
						dataType: "script",
						cache: true, 
						global:false,
						success: function(data, textStatus){
							$.util.log("load_url:" + urls[i]) ;
							loaded_url.push(urls[i]) ;
						},
						error:function(xhr, error, thrown){
							$.util.log("fail_load_url:" + urls[i]) ;
							$.util.log(error) ;
							$.util.log(thrown) ;
						}
				   });
			       return ajax ;
				}) ;
				
				if((i+1) == urls.length){
					ajax_each.done(function(data){
						callBack() ;
				   	}).fail(function(){

						    
					});
					
					return ;
				}
				
				ajax_0 = ajax_each ;
				
			});
			

		},
		map_js:function(array, each_callback){
			// Production steps of ECMA-262, Edition
			// 5, 15.4.4.19
			// Reference: http://es5.github.io/#x15.4.4.19
			if (!Array.prototype.map) {

				Array.prototype.map = function(callback,
						thisArg) {

					var T, A, k;

					if (this == null) {
						throw new TypeError(
								' this is null or not defined');
					}

					// 1. Let O be the result of calling
					// ToObject passing the |this|
					// value as the argument.
					var O = Object(this);

					// 2. Let lenValue be the result of calling
					// the Get internal
					// method of O with the argument "length".
					// 3. Let len be ToUint32(lenValue).
					var len = O.length >>> 0;

					// 4. If IsCallable(callback) is false,
					// throw a TypeError exception.
					// See: http://es5.github.com/#x9.11
					if (typeof callback !== 'function') {
						throw new TypeError(callback
								+ ' is not a function');
					}

					// 5. If thisArg was supplied, let T be
					// thisArg; else let T be undefined.
					if (arguments.length > 1) {
						T = thisArg;
					}

					// 6. Let A be a new array created as if by
					// the expression new Array(len)
					// where Array is the standard built-in
					// constructor with that name and
					// len is the value of len.
					A = new Array(len);

					// 7. Let k be 0
					k = 0;

					// 8. Repeat, while k < len
					while (k < len) {

						var kValue, mappedValue;

						// a. Let Pk be ToString(k).
						// This is implicit for LHS operands of
						// the in operator
						// b. Let kPresent be the result of
						// calling the HasProperty internal
						// method of O with argument Pk.
						// This step can be combined with c
						// c. If kPresent is true, then
						if (k in O) {

							// i. Let kValue be the result of
							// calling the Get internal
							// method of O with argument Pk.
							kValue = O[k];

							// ii. Let mappedValue be the result
							// of calling the Call internal
							// method of callback with T as the
							// this value and argument
							// list containing kValue, k, and O.
							mappedValue = callback.call(T,
									kValue, k, O);

							// iii. Call the DefineOwnProperty
							// internal method of A with
							// arguments
							// Pk, Property Descriptor
							// { Value: mappedValue,
							// Writable: true,
							// Enumerable: true,
							// Configurable: true },
							// and false.

							// In browsers that support
							// Object.defineProperty, use the
							// following:
							// Object.defineProperty(A, k, {
							// value: mappedValue,
							// writable: true,
							// enumerable: true,
							// configurable: true
							// });

							// For best browser support, use the
							// following:
							A[k] = mappedValue;
						}
						// d. Increase k by 1.
						k++;
					}

					// 9. return A
					return A;
				};
			}

			return array.map(each_callback) ;
		},
		filter_js:function(array, each_callback){
			if (!Array.prototype.filter) {
				Array.prototype.filter = function(fun) {
					'use strict';

					if (this === void 0 || this === null) {
						throw new TypeError();
					}

					var t = Object(this);
					var len = t.length >>> 0;
					if (typeof fun !== 'function') {
						throw new TypeError();
					}

					var res = [];
					var thisArg = arguments.length >= 2 ? arguments[1]
							: void 0;
					for (var i = 0; i < len; i++) {
						if (i in t) {
							var val = t[i];

							// NOTE: Technically this should
							// Object.defineProperty at
							// the next index, as push can be
							// affected by
							// properties on Object.prototype
							// and Array.prototype.
							// But that method's new, and
							// collisions should be
							// rare, so use the more-compatible
							// alternative.
							if (fun.call(thisArg, val, i, t)) {
								res.push(val);
							}
						}
					}

					return res;
				};
			}
			
			return array.filter(each_callback);
		},
		reduce_js:function(array, each_callback, initialValue){
			if (!Array.prototype.reduce) {
				Array.prototype.reduce = function(fun) {
					var len = this.length;
					if (typeof fun != "function")
						throw new TypeError();

					// no value to return if no initial value
					// and an empty array
					if (len == 0 && arguments.length == 1)
						throw new TypeError();

					var i = 0;
					if (arguments.length >= 2) {
						var rv = arguments[1];
					} else {
						do {
							if (i in this) {
								rv = this[i++];
								break;
							}

							// if array contains no values, no
							// initial value to return
							if (++i >= len)
								throw new TypeError();
						} while (true);
					}

					for (; i < len; i++) {
						if (i in this)
							rv = fun.call(null, rv, this[i], i,
									this);
					}

					return rv;
				};
			}
			
			if($.util.exist(initialValue)){
				return array.reduce(each_callback, initialValue) ;	   
			}
			
			return array.reduce(each_callback) ;	   

		},
		formatObjDateValByEach:function(obj, keyObj){
			if($.util.exist(obj)){
				for(var key in obj){
					var oval = obj[key] ; 
					if($.util.exist(keyObj[key])){
						if(!$.util.isBlank(oval)){
							var format = keyObj[key] ;
							var sourceFmt = format.sourceFmt ;
							if($.util.isBlank(sourceFmt)){
								sourceFmt = "yyyy-MM-dd HH:mm:ss" ;
							}
							var targetFmt = format.targetFmt ;
							if($.util.isBlank(targetFmt)){
								targetFmt = "yyyy-MM-dd HH:mm:ss" ;
							}
							obj[key] = $.date.strFmt(obj[key], sourceFmt, targetFmt) ;
						}					
					}
				}
			}
		},
		formatObjDateVal:function(obj, keys, targetFmt, sourceFmt){
			if($.util.isBlank(sourceFmt)){
				sourceFmt = "yyyy-MM-dd HH:mm:ss" ;
			}
			if($.util.isBlank(targetFmt)){
				targetFmt = "yyyy-MM-dd HH:mm:ss" ;
			}
			
			if($.util.exist(obj)){
				for(var key in obj){
					$.each(function(i, val){
						if(key==val){
							if(!$.util.isBlank(obj[key])){
								obj[key] = $.date.strFmt(obj[key], sourceFmt, targetFmt) ;
							}
						}
					});
				}
			}
		},
		formatFileSize : function(size) {

			if ( !$.util.exist(size) || /\D/.test(size)) {
				return o.translate('N/A');
			}

			function round(num, precision) {
				return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
			}

			var boundary = Math.pow(1024, 4);

			// TB
			if (size > boundary) {
				return round(size / boundary, 1) + " " + o.translate('tb');
			}

			// GB
			if (size > (boundary/=1024)) {
				return round(size / boundary, 1) + " " + o.translate('gb');
			}

			// MB
			if (size > (boundary/=1024)) {
				return round(size / boundary, 1) + " " + o.translate('mb');
			}

			// KB
			if (size > 1024) {
				return Math.round(size / 1024) + " " + o.translate('kb');
			}

			return size + " " + o.translate('b');
		},
		ajaxError:function(xhr, textStatus, errorThrown){
			if($(xhr.responseText).find(".stacktrace").length>0){
				$.util.log($(xhr.responseText).find(".stacktrace").html()) ;
			}
		},
		parseInt:function(str, radix){
			if(radix!=null&&radix!=undefined){
				return parseInt(str, 10) ;
			}else{
				return parseInt(str, radix) ;
			}
		},
		isArray:function(obj){
			if($.util.exist(obj)){
				if(typeof obj=="object" && obj.constructor==Array){	
					return true ;
				}else{
					return false ;
				}
			}else{
				return false ;
			}
		},
		isString:function(obj){
			if($.util.exist(obj)){
				if(typeof obj=="string"){
					return true ;
				}else if(typeof obj=="object" && obj.constructor==String){	
					return true ;
				}else{
					return false ;
				}
			}else{
				return false ;
			}
		},
		getType:function(obj){
			if(obj==undefined){
				return undefined ;
			}else if(obj==null){
				return null ;
			}else{
				if(typeof obj=="object"){	
					return obj.constructor ;
				}
			}
		},
		orienInside:function(){
			
		},
		parseUrlQueryStr:function(url){
			var search = url.replace(/^\s+/,'').replace(/\s+$/,'').match(/([^?#]*)(#.*)?$/);//提取location.search中'?'后面的部分 
			if(!search){ 
				return {}; 
			} 
			var searchStr = search[1]; 
			var searchHash = searchStr.split('&'); 

			var ret = {}; 
			for(var i = 0, len = searchHash.length; i < len; i++){ //这里可以调用each方法 
				var pair = searchHash[i]; 
				if((pair = pair.split('='))[0]){ 
					var key = decodeURIComponent(pair.shift()); 
					var value = pair.length > 1 ? pair.join('=') : pair[0]; 
		
					if(value != undefined){ 
						value = decodeURIComponent(value); 
					} 
					if(key in ret){ 
					if(ret[key].constructor != Array){ 
						ret[key] = [ret[key]]; 
					} 
						ret[key].push(value); 
					}else{ 
						ret[key] = value; 
					} 
				} 
			} 
			return ret; 
		},
		jqUiPosition:function(targetSelector, wgSelector, my, at, mouseEvent){
	
				var options = {"my":my, "at":at, within:undefined, collision:"flipfit flip"} ;
				var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
					target = $( targetSelector ),
					within = $.position.getWithinInfo( options.within ),
					scrollInfo = $.position.getScrollInfo( within ),
					collision = ( options.collision || "flip" ).split( " " ),
					offsets = {};
				if($.util.exist(mouseEvent)){
					target = $( mouseEvent ) ;
				}

				dimensions = $.util.getDimensions( target );
				if ( target[0].preventDefault ) {
					// force left top to allow flipping
					options.at = "left top";
				}
				targetWidth = dimensions.width;
				targetHeight = dimensions.height;
				targetOffset = dimensions.offset;
				// clone to reuse original targetOffset later
				basePosition = $.extend( {}, targetOffset );

				// force my and at to have valid horizontal and vertical positions
				// if a value is missing or invalid, it will be converted to center
				$.each( [ "my", "at" ], function() {
					var pos = ( options[ this ] || "" ).split( " " ),
						horizontalOffset,
						verticalOffset;

					if ( pos.length === 1) {
						pos = rhorizontal.test( pos[ 0 ] ) ?
							pos.concat( [ "center" ] ) :
							rvertical.test( pos[ 0 ] ) ?
								[ "center" ].concat( pos ) :
								[ "center", "center" ];
					}
					pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
					pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";
					
					// calculate offsets
					horizontalOffset = roffset.exec( pos[ 0 ] );
					verticalOffset = roffset.exec( pos[ 1 ] );
					offsets[ this ] = [
						horizontalOffset ? horizontalOffset[ 0 ] : 0,
						verticalOffset ? verticalOffset[ 0 ] : 0
					];

					// reduce to just the positions without the offsets
					options[ this ] = [
						rposition.exec( pos[ 0 ] )[ 0 ],
						rposition.exec( pos[ 1 ] )[ 0 ]
					];				

				});				
				
				// normalize collision option
				if ( collision.length === 1 ) {
					collision[ 1 ] = collision[ 0 ];
				}

				if ( options.at[ 0 ] === "right" ) {
					basePosition.left += targetWidth;
				} else if ( options.at[ 0 ] === "center" ) {
					basePosition.left += targetWidth / 2;
				}
				
				if ( options.at[ 1 ] === "bottom" ) {
					basePosition.top += targetHeight;
				} else if ( options.at[ 1 ] === "center" ) {
					basePosition.top += targetHeight / 2;
				}


				
				atOffset = $.util.getOffsets( offsets.at, targetWidth, targetHeight );
				basePosition.left += atOffset[ 0 ];
				basePosition.top += atOffset[ 1 ];
				

				var collisionPosition,
				elem = $( wgSelector ),
				elemWidth = elem.outerWidth(),
				elemHeight = elem.outerHeight(),
				marginLeft = $.util.parseCss( elem[0], "marginLeft" ),
				marginTop = $.util.parseCss( elem[0], "marginTop" ),
				collisionWidth = elemWidth + marginLeft + $.util.parseCss( elem[0], "marginRight" ) + scrollInfo.width,
				collisionHeight = elemHeight + marginTop + $.util.parseCss( elem[0], "marginBottom" ) + scrollInfo.height,
				position = $.extend( {}, basePosition ),
				myOffset = $.util.getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

				if ( options.my[ 0 ] === "right" ) {
					position.left -= elemWidth;
				} else if ( options.my[ 0 ] === "center" ) {
					position.left -= elemWidth / 2;
				}
	
				if ( options.my[ 1 ] === "bottom" ) {
					position.top -= elemHeight;
				} else if ( options.my[ 1 ] === "center" ) {
					position.top -= elemHeight / 2;
				}
	
				position.left += myOffset[ 0 ];
				position.top += myOffset[ 1 ];
	
				// if the browser doesn't support fractions, then round for consistent results
				if ( !supportsOffsetFractions ) {
					position.left = Math.round( position.left );
					position.top = Math.round( position.top );
				}
	
				collisionPosition = {
					marginLeft: marginLeft,
					marginTop: marginTop
				};
	
				$.each( [ "left", "top" ], function( i, dir ) {
					if ( $.ui.position[ collision[ i ] ] ) {
						$.ui.position[ collision[ i ] ][ dir ]( position, {
							targetWidth: targetWidth,
							targetHeight: targetHeight,
							elemWidth: elemWidth,
							elemHeight: elemHeight,
							collisionPosition: collisionPosition,
							collisionWidth: collisionWidth,
							collisionHeight: collisionHeight,
							offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
							my: options.my,
							at: options.at,
							within: within,
							elem: elem
						});
					}
				});
	
				elem.offset(position);
				
				return position ;
	
		},
		objToStrutsList:function(obj, objKey, formData){
			if($.util.exist(obj)){				
				if(typeof obj=="object" && obj.constructor==Array){	
					$.each(obj, function(i, val){
						var arrObjKey = objKey + "["+i+"]" ;
						var cst = val.constructor ;
						if(typeof val=="object" && (cst===Array || cst===Object )){			
							$.util.objToStrutsFormData(val, arrObjKey, formData) ;
						}else{
							formData[arrObjKey] = val ;
						}				
					})	
				}else if(typeof obj=="object" && obj.constructor===Object){		
					for(var key in obj){
						var val = obj[key] ;
						var objectKey = objKey  + "['" + key + "']" ;
						$.util.objToStrutsFormData(val, objectKey, formData) ;
					}					
				}else{	
					formData[objKey] = obj ;
				}
			}
			return formData ;	
		},
		hasJQueryEvent:function(selector, eventName){
			var $events = $._data($(selector)[0], "events");
			if( $events && $events[eventName] ){
				return true;
			}else{
				return false ;
			}
		},
		objToStrutsMap:function(obj, objKey, formData){
			/**	   
				//	var dataMap = new Object() ;
					后台用Map接收的格式
				//	dataMap["testMap['test1']"] = 1 ;
				//	dataMap["testMap['test2']"] = 2 ;
				    后台用list接收的格式
				//	var dataMap = new Object() ;
				//	dataMap["testList[0]"] = "1" ;
				//	dataMap["testList[1]"] = "2" ;
				//后台用object接收
					dataMap.test.a = 1 ;
					dataMap.test.b = 2 ;
			 */
			if($.util.exist(obj)){				
				if(typeof obj=="object" && obj.constructor==Array){	
					$.each(obj, function(i, val){
						var arrObjKey = objKey + "["+i+"]" ;
						var cst = val.constructor ;
						if(typeof val=="object" && (cst===Array || cst===Object )){			
							$.util.objToStrutsFormData(val, arrObjKey, formData) ;
						}else{
							formData[arrObjKey] = val ;
						}				
					})	
				}else if(typeof obj=="object" && obj.constructor===Object){		
					for(var key in obj){
						var val = obj[key] ;
						var objectKey = objKey  + "['" + key + "']" ;
						$.util.objToStrutsFormData(val, objectKey, formData) ;
					}					
				}else{	
					formData[objKey] = obj ;
				}
			}
			return formData ;	
		},
		objToStrutsFormData:function(obj, objKey, formData){
			/**
			 * 将js Object或数组按照struts可用的格式添加到request form表单中
			 * obj：要添加的对象或数组。
			 * objKey：对象或数组的key名称
			 * formData：request 表单对象
			 */
			if(obj!=undefined && obj!=null){
				if(typeof obj=="object" && obj.constructor==Array){	
					$.each(obj, function(i, val){
						var arrObjKey = objKey + "["+i+"]" ;
						var cst = val.constructor ;
						if(typeof val=="object" && (cst===Array || cst===Object )){			
							$.util.objToStrutsFormData(val, arrObjKey, formData) ;
						}else{
							formData[arrObjKey] = val ;
						}				
					})				
					
				}else if(typeof obj=="object" && obj.constructor===Object){			
					for(var key in obj){
						var val = obj[key] ;
						var objectKey = objKey  + "." + key ;
						$.util.objToStrutsFormData(val, objectKey, formData) ;
					}			
				}else{	
					formData[objKey] = obj ;
				}
			}
			return formData ;
		},
		
		encryptMd5:function(text){
			return $.md5(text) ;
		},
		
		elExist:function(val, obj){
			/**
			 * 判断对象的元素是否存在
			 */
			if(obj==undefined || obj==null){
				return false ;
			}else{
				if(obj[val]==undefined || obj[val]==null){
					return false; 
				}else{
					return true ;
				}
			}
		},	
		getArrObjValueByKey:function(arr, key){
			var str = null ;
			$.each(arr, function(i, val){
				if(val[key]!=null&&val[key]!=undefined){
					str = val[key] ;
					return false ;
				}
			});
			return str ;
		},
		cloneObj:function(obj){
			return $.extend( true,  {}, obj, {}) ;
		},
		fmtUrl:function(url){
			if(url.indexOf("clickOrder")==-1){
				var tp = "?" ;
				if(url.indexOf("?")>0&&url.substring(url.indexOf("?")+1).length>0){
					tp = "&&" ;
				}
				
				url += tp + "clickOrder="+clickOrder+"&&clickListOrder="+clickListOrder ;
			}
			
			return url ;
		},
		encode:function(text){
			return encodeURI(text) ;
		},
		decode:function(text){
			return decodeURI(text) ;
		},
		deleteObjEls:function(els, obj){
			/**
			 * 批量删除Object的属性
			 * els如果是String单独删除一个属性，如果是数组就批量删除
			 */
			if(typeof els=="String" && els.constructor==String){
				delete obj[els] ;
			}else if(typeof els=="object" && els.constructor==Array){
				$.each(els, function(i, val){
					delete obj[val] ;
				}) ;
			}
		},			

		log:function(obj){
			/**
			 * 替代console.log方法，防止浏览没有console导致报错
			 * obj：打印的对象
			 */
			if ( window.console && console.log ) {
				console.log( obj );
			}
		},
		openWindow:function(url, title, width, height, top, left){
			/**
			 * 打开新的window对象
			 */
			var w = $(window.top).width() ;
			var h = $(window.top).height() ;	
			
			if(width==undefined){
				width = w ;
			}
			if(height==undefined){
				height = h ;
			}	
			if(top==undefined){
				top = 0 ;
			}	
			if(left==undefined){
				left = 0 ;
			}	

			var settings = "height="+height+",width=" + width + ",top="+top+",left="+left+",toolbar=no,menubar=no,resizable=yes,location=no,status=no" ; 
			window.top.open(url, title, settings) ;			
		},
		getHiddenForm:function(action, inputs){
			/**
			 * 得到隐藏的form表单，每次getform表单都会被清空
			 * action：form表单提交的url
			 * inputs:form表单内的input标签，数组类型，结构为：
			 * 
			 * 	{
			 *     key1:"test1",
			 *     key2:"test2"
			 *  }
			 */
			action = $.util.fmtUrl(action) ;
			var form = $("#myHiddenForm") ;
			if(form.length==0){
				form = $("<form />", {
					"action":action,
					"method":"post"
				}).appendTo($("body"));
			}
			$(form).html("") ;		
			$(form).attr("action", action) ;
			$(form).attr("method", "post") ;
			var inputsStr = "" ;

			for(var key in inputs){
				var input = $("<input />", {
					"type":"hidden",
					"name":key
				}).appendTo(form);
				if($.util.exist(inputs[key])){
					$(input).attr("value", inputs[key]) ;
				}
			}
			return form ;				
		},
		subForm:function(form, delay, isLoading){
			/**
			 * 提交表单
			 * form：提交的form表单的dom对象
			 * delay：延迟提交时间
			 * isLoading：是否显示loading
			 */
			
			var action = $(form).attr("action") ;
			action = $.util.fmtUrl(action) ;
			$(form).attr("action", action) ;
			
			if(isLoading){
				layerLoading() ;
			}
			if(delay){
				setTimeout(function(){
				   $(form).submit() ;
				}, delay) ;
			}else{
				$(form).submit() ;
			}			
		},
		getDimensions:function( elem ) {
			var raw = elem[0];
			if ( raw.nodeType === 9 ) {
				return {
					width: elem.width(),
					height: elem.height(),
					offset: { top: 0, left: 0 }
				};
			}
			if ( $.isWindow( raw ) ) {
				return {
					width: elem.width(),
					height: elem.height(),
					offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
				};
			}
			if ( raw.preventDefault ) {
				return {
					width: 0,
					height: 0,
					offset: { top: raw.pageY, left: raw.pageX }
				};
			}
			return {
				width: elem.outerWidth(),
				height: elem.outerHeight(),
				offset: elem.offset()
			};
		},
		getOffsets:function( offsets, width, height ) {
			return [
				parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
				parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
			];
		},
		parseCss:function( element, property ) {
			return parseInt( $.css( element, property ), 10 ) || 0;
		},
	 //js object 转换为json字符串
		   toJSONString: function(object) { 
			     var type = typeof object; 
			     if (object != null && 'object' == type) { 
			       if (object != null && Array == object.constructor) type = 'array'; 
			       else if (object != null && RegExp == object.constructor) type = 'regexp'; 
			       else type = 'object'; 
			     } 
			     switch (type) { 
			     case 'undefined': 
			     case 'unknown': 
			       return; 
			       break; 
			     case 'function': 
			    	 return; 
				     break; 
			     case 'boolean': 
			     case 'regexp': 
			       return object.toString(); 
			       break; 
			     case 'number': 
			       return isFinite(object) ? object.toString() : 'null'; 
			       break; 
			     case 'string': 
			       return '"' + object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function() { 
			         var a = arguments[0]; 
			         return (a == '\n') ? '\\n': (a == '\r') ? '\\r': (a == '\t') ? '\\t': "" 
			       }) + '"'; 
			       break; 
			     case 'object': 
			       if (object === null) return 'null'; 
			       var results = []; 
			       //在此删除不需要的属性
			       
			       for (var property in object) { 
			         var value = $.util.toJSONString(object[property]); 
			         if (value !== undefined) results.push($.util.toJSONString(property) + ':' + value); 
			       } 
			       return '{' + results.join(',') + '}'; 
			       break; 
			     case 'array': 
			       var results = []; 
			       for (var i = 0; i < object.length; i++) { 
			         var value = $.util.toJSONString(object[i]); 
			         if (value !== undefined) results.push(value); 
			       } 
			       return '[' + results.join(',') + ']'; 
			       break; 
			     } 
			   } ,
		   
		   initInputLength:function(){
				var setting = $.globalSettings.inputDefaultLength ;
				$("input[type=text].default").each(function(i, val){
					var st = $(val).attr("maxlength") ;
					if(!(st!=null&&st!=undefined&&st.length>0)){
						$(val).attr("maxlength", setting) ;
					}			
				});
			},
			initTabs:function(){
				$(".uiTabs").each(function(i, val){
					if(!$(val).hasClass("ui-widget")){
						$(val).tabs() ;
						$(val).show() ;
					}
				});
			}
//			initDisableControl:function(){
//				$(".disableControl").each(function(i, val){
//					var id = $(val).attr("id") ;
//					var isControl =  $(val).attr("isDisableControl") ;
//					if(isControl==="yes"){
//						return true ;
//					}
//					$(val).attr("isDisableControl", "yes") ;
//					$(document).on('click', '#'+id, function () {	
//						$(this).attr("disabled",true); 
//					});
//				});			
//			},
//			initBtUrl:function(){
//				$(".btUrl").each(function(i, val){
//					var id = $(val).attr("id") ;
//					var isBtUrl =  $(val).attr("isBtUrl") ;
//					if(isBtUrl==="yes"){
//						return true ;
//					}
//					$(val).attr("isBtUrl", "yes") ;
//					$(document).on('click', '#'+id, function () {	
//						var href = $(this).attr("myHref") ;
//						href = $.util.fmtUrl(href) ;
//						location.href = href ;
//					});	
//					
//				});	
//			}
	});	
	
	$.fn.extend();		
})(jQuery);	
/*****************************通用扩展方法结束*********************************************/

/********************************调整界面宽高开始**********************************/

(function($){
	var settings = {
		funcs : {
			windowReSizeFunc:function(val){
				if($.globalSettings.isReSize){
					$.util.log(val) ;
				}
			}
		}
	}
	jQuery.extend($.util, { 
		windowReSize:function(){
			$.each(settings.funcs, function(key, val){
				val(123) ;
//				var evalStr = val.funcName + "(" + val.funcVals + ")" ;
//				eval(evalStr);
			});
		},
		setRizeFunc:function(funcName, func){
			settings.funcs[funcName] = func ;
		},
		deleteRizeFunc:function(funcName){
			delete settings.funcs[funcName] ;
			$.util.log(settings.funcs) ;
		}
	});	
	
})(jQuery);	

/********************************调整界面宽高结束**********************************/
/********************************icheck**********************************/
$.icheck = $.icheck || {};
(function($){
	"use strict";
	jQuery.extend($.icheck, {
		
		initIcheck:function(){
			$('input.icheckbox').each(function(i, val){
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					var name = next[0].tagName.toLowerCase() ;
					if(name=="ins"){
						return true ;
					}
				}
				
				var st = {
					checkboxClass: 'icheckbox_square-green',
					radioClass: 'iradio_square-green',
					increaseArea: '20%' // optional					
				}
				
				var style = $(this).attr("icheckStyle") ;
				if(!$.util.isBlank(style)){
					st.checkboxClass = "icheckbox_" + style ;
					st.radioClass = "iradio_" + style ;
				}
				
				$(val).iCheck(st);
				
				var datatype = $(val).attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					var valName = $(val).attr("name") ;
					$("input[name="+valName+"]").on('ifChecked ifUnchecked', function (e, param) {	

						if($.util.exist(param)&&param.trigerNotVali===true){
							
						}else{
							var validForm = $(this).parents(".validform") ;
							var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
							$("input[name="+valName+"]").each(function(key, valel){
								var valeldty = $(valel).attr("datatype") ; 
								if(!$.util.isBlank(valeldty)){
									$.validform.checkEl(demo, valel) ;
								}
							});	
						}
						
					}) ;	
				}
				
			}) ;
			
			$('input.icheckradio').each(function(i, val){
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					var name = next[0].tagName.toLowerCase() ;
					if(name=="ins"){
						return true ;
					}
				}
				
				var st = {
					checkboxClass: 'icheckbox_square-green',
					radioClass: 'iradio_square-green',
					increaseArea: '20%' // optional					
				}
				
				var style = $(this).attr("icheckStyle") ;
				if(!$.util.isBlank(style)){
					st.checkboxClass = "icheckbox_" + style ;
					st.radioClass = "iradio_" + style ;
				}
				
				$(val).iCheck(st);
				
				var datatype = $(val).attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					var valName = $(val).attr("name") ;
					$("input[name="+valName+"]").on('ifChecked ifUnchecked', function (e, param) {
						if($.util.exist(param)&&param.trigerNotVali===true){
							
						}else{
							var validForm = $(this).parents(".validform") ;
							var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
							$("input[name="+valName+"]").each(function(key, valel){
								var valeldty = $(valel).attr("datatype") ; 
								if(!$.util.isBlank(valeldty)){
									$.validform.checkEl(demo, valel) ;
								}
							});
						}
						
					}) ;	
				}
				
			}) ;
		},
		
		selectCheck:function(checkName, setNotVali){
			$("input[name="+checkName+"]").each(function(i, val){
				$.icheck.check(val, true, setNotVali) ;
			});
		},
		
		unSelectCheck:function(checkName, setNotVali){
			$("input[name="+checkName+"]").each(function(i, val){
				$.icheck.check(val, false, setNotVali) ;
			});
		},
		
		reverseCheck:function(checkName, setNotVali){		
			$("input[name="+checkName+"]").each(function(i, val){
				if($(val).parent().hasClass("checked")){
					$.icheck.check(val, false, setNotVali) ;
				}else{
					$.icheck.check(val, true, setNotVali) ;
				}
			});
		},
		destroy:function(selector, removeDom){
			var objs = $(selector) ;
			$.each(objs, function(i, val){
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					var name = next[0].tagName.toLowerCase() ;
					if(name=="ins"){
						$(val).iCheck('destroy');
					}
				}
				if(removeDom){
					$(selector).remove() ;
				}
			});
		},
		check:function(selector, flag, setNotVali){
			var name = $(selector).attr("name") ;
			var trigerNotVali = false ;
//			$("input[name="+name+"]").each(function(i, val){
//				var dataType = $(val).attr("datatype") ;
//				if(!$.util.isBlank(dataType)){
//					var mysetNotVali = $(val).attr("setNotVali") ;
//					if($.util.isBlank(setNotVali)){
//						if(!$.util.isBlank(mysetNotVali)){
//							setNotVali = mysetNotVali ;
//						}
//					}
//										
//					if((!$.util.isBlank(setNotVali)) && setNotVali.toString()==="true"){
//						//$(val).attr("setNotVali", setNotVali.toString()) ;
//						trigerNotVali = true ;
//					}
//				}
//			});
			
			if(setNotVali){
				trigerNotVali = setNotVali ;
			}
			
			var ck = "check" ;
			if(flag===false){
				ck = "uncheck" ;
			}

			$(selector).iCheck(ck, undefined, trigerNotVali);
		},
		able:function(selector, flag){
			var ck = "enable" ;
			if(flag===false){
				ck = "disable" ;
			}
			$(selector).iCheck(ck);
		},
		isChecked:function(selector){
			if($(selector).parent().hasClass("checked")){
				return true ;
			}
			return false ;
		},
		getChecked:function(checkName){
			var arr = new Array() ;
			var ips = $("input[name="+checkName+"]") ;
			if(ips.length==0){
				return arr ;
			}
			ips.each(function(i, val){
				if($(val).parent().hasClass("checked")){
					arr.push(val) ;
				}				
			});
			return arr ;
		},
		val:function(checkName){
			var arr = $.icheck.getChecked(checkName) ;
			var rarr = [] ;
			$.each(arr, function(i, val){
				var elv = $(val).val() ;
				if(!$.util.isBlank(elv)){
					rarr.push(elv) ;
				}
			});
			
			if(rarr.length==0){
				return "" ;
			}else if(rarr.length==1){
				return rarr[0] ;
			}else{
				return rarr ;
			}
		}
		
	});

})(jQuery);	
/********************************icheck**********************************/
/********************************select2**********************************/
$.select2 = $.select2 || {};
(function($){
	"use strict";
	jQuery.extend($.select2, { 
		empty:function(selector, setNotVali){
			
//			var mysetNotVali = $(selector).attr("setNotVali") ;
//			if($.util.isBlank(setNotVali)){
//				if(!$.util.isBlank(mysetNotVali)){
//					setNotVali = mysetNotVali ;
//				}
//			}
			
			var trigerNotVali = false ;
			if((!$.util.isBlank(setNotVali)) && setNotVali.toString()==="true"){
				//$(selector).attr("setNotVali", setNotVali.toString()) ;
				trigerNotVali = true ;
			}
			
			$(selector).find("option").remove() ;
			$(selector).trigger("change", [{setNotVali:trigerNotVali}]);

            $.select2.removeTitle(selector) ;
		},
		destroy:function(selector, removeSelect){
			var objs = $(selector) ;
			$.each(objs, function(i, val){
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					if($(next[0]).hasClass("select2")){
						$(val).select2("destroy");
					}
					if(removeSelect){
						$(val).remove() ;
					}
				}
			});
		},
        removeTitle:function(selector){
            var next = $(selector).next() ;
            if(next.hasClass("select2-container")){
                $(next).find(".select2-selection__rendered").removeAttr("title") ;
            }
        },
		add:function(selector, obj, isUnSelect, setNotVali){
			var str = "" ;
			for(var key in obj){
				str += '<option value="'+key+'">' ;
				str += obj[key] ;
				str += "</option>" ;
			}
			$(selector).append(str) ;
			
//			var mysetNotVali = $(selector).attr("setNotVali") ;
//			if($.util.isBlank(setNotVali)){
//				if(!$.util.isBlank(mysetNotVali)){
//					setNotVali = mysetNotVali ;
//				}
//			}
			
			var trigerNotVali = false ;
			if((!$.util.isBlank(setNotVali)) && setNotVali.toString()==="true"){
				//$(selector).attr("setNotVali", setNotVali.toString()) ;
				trigerNotVali = true ;
                $.select2.removeTitle(selector) ;
			}
			
			$(selector).trigger("change", [{setNotVali:trigerNotVali}]);
			
			if(isUnSelect){
				$(selector).val(null).trigger("change", [{setNotVali:trigerNotVali}]);
			}
		},
		val:function(selector, val, setNotVali){
			if($.util.exist(val)){
//				var mysetNotVali = $(selector).attr("setNotVali") ;
//				if($.util.isBlank(setNotVali)){
//					if(!$.util.isBlank(mysetNotVali)){
//						setNotVali = mysetNotVali ;
//					}
//				}
				var trigerNotVali = false ;
				if((!$.util.isBlank(setNotVali)) && setNotVali.toString()==="true"){
					//$(selector).attr("setNotVali", setNotVali.toString()) ;
					trigerNotVali = true ;
				}
				$(selector).val(val).trigger("change", [{setNotVali:trigerNotVali}]);
			}else{
				return $(selector).val() ;
			}	
		},
		text:function(selector){
			var sp = $.select2.val(selector) ;
			if(sp instanceof Array){
				var rtArr = [] ;
				$.each(sp, function(i, val){
					var valText = $($(selector).find('[value='+val+']')).text() ;
					rtArr.push(valText) ;
				});
				return rtArr ;
			}else if(!$.util.isBlank(sp)){
				return $($(selector).find('[value="'+sp+'"]')).text() ;
			}
		},
		able:function(selector, flag){
			$(selector).prop("disabled", !flag);
		},
		clear:function(selector, setNotVali){
//			var mysetNotVali = $(selector).attr("setNotVali") ;
//			if($.util.isBlank(setNotVali)){
//				if(!$.util.isBlank(mysetNotVali)){
//					setNotVali = mysetNotVali ;
//				}
//			}
			
			var trigerNotVali = false ;
			if((!$.util.isBlank(setNotVali)) && setNotVali.toString()==="true"){
				//$(selector).attr("setNotVali", setNotVali.toString()) ;
				trigerNotVali = true ;
			}

            $.select2.removeTitle(selector) ;
			$(selector).val(null).trigger("change", [{setNotVali:trigerNotVali}]);
		},
		addByObjects:function(selector, list, isUnSelect, setNotVali){
			var str = "" ;
			$.each(list, function(i, val){
				for(var key in val){
					str += '<option value="'+key+'">' ;
					str += val[key] ;
					str += "</option>" ;
				}
			});
			$(selector).append(str) ;
//			var mysetNotVali = $(selector).attr("setNotVali") ;
//			if($.util.isBlank(setNotVali)){
//				if(!$.util.isBlank(mysetNotVali)){
//					setNotVali = mysetNotVali ;
//				}
//			}
			
			var trigerNotVali = false ;
			if((!$.util.isBlank(setNotVali)) && setNotVali.toString()==="true"){
				//$(selector).attr("setNotVali", setNotVali.toString()) ;
				trigerNotVali = true ;
			}
			$(selector).trigger("change", [{setNotVali:trigerNotVali}]);
			
			if(isUnSelect){
				$(selector).val(null).trigger("change", [{setNotVali:trigerNotVali}]);
                $.select2.removeTitle(selector) ;
			}
		},	
		addByStrList:function(selector, list, isUnSelect, setNotVali){
			if($.util.exist(list)){
				var str = "" ;
				$.each(list, function(i, val){
					str += '<option value="'+val+'">' ;
					str += val ;
					str += "</option>" ;
				});
				
				$(selector).append(str) ;
//				var mysetNotVali = $(selector).attr("setNotVali") ;
//				if($.util.isBlank(setNotVali)){
//					if(!$.util.isBlank(mysetNotVali)){
//						setNotVali = mysetNotVali ;
//					}
//				}
				
				var trigerNotVali = false ;
				if((!$.util.isBlank(setNotVali)) && setNotVali.toString()==="true"){
					//$(selector).attr("setNotVali", setNotVali.toString()) ;
					trigerNotVali = true ;
				}
				$(selector).trigger("change", [{setNotVali:trigerNotVali}]);
				if(isUnSelect){
					$(selector).val(null).trigger("change", [{setNotVali:trigerNotVali}]);
                    $.select2.removeTitle(selector) ;
				}
			}
		},
		//isUnSelect: 默认不选中第一项  setNotVali: 添加选项时不触发验证，常用于不设置默认项又要验证必选时使用
		addByList:function(selector, list, key, value, isUnSelect, setNotVali){
			if($.util.exist(list)){
				var str = "" ;
				$.each(list, function(i, val){
					str += '<option value="'+val[key]+'">' ;
					str += val[value] ;
					str += "</option>" ;
				});
				$(selector).append(str) ;
//				var mysetNotVali = $(selector).attr("setNotVali") ;
//				if($.util.isBlank(setNotVali)){
//					if(!$.util.isBlank(mysetNotVali)){
//						setNotVali = mysetNotVali ;
//					}
//				}
				
				var trigerNotVali = false ;
				if((!$.util.isBlank(setNotVali)) && setNotVali.toString()==="true"){
					//$(selector).attr("setNotVali", setNotVali.toString()) ;
					trigerNotVali = true ;
				}
				$(selector).trigger("change", [{setNotVali:trigerNotVali}]);
				
				if(isUnSelect){
					$(selector).val(null).trigger("change", [{setNotVali:trigerNotVali}]);
                    $.select2.removeTitle(selector) ;
				}

			}
		},			
		removeByValues:function(selector, valArr, setNotVali){
			var sl = $(selector).select2("val") ;
			$.each(valArr, function(i, val){
				var op = $(selector).find("option[value="+val+"]") ;
				if(!$.util.isEmpty(op)){
					$(selector).find("option[value="+val+"]").remove() ;
				}
			});
//			var mysetNotVali = $(selector).attr("setNotVali") ;
//			if($.util.isBlank(setNotVali)){
//				if(!$.util.isBlank(mysetNotVali)){
//					setNotVali = mysetNotVali ;
//				}
//			}
			var trigerNotVali = false ;
			if((!$.util.isBlank(setNotVali)) && setNotVali.toString()==="true"){
				$(selector).attr("setNotVali", setNotVali.toString()) ;
			}
			$(selector).trigger("change", [{setNotVali:trigerNotVali}]);
		},
		selectByOrder:function(selector, order, setNotVali){
			var opts = $(selector).find("option");
			var flag =  true ;
			
			var arr = [] ;
			if(!$.util.isArray(order)){
				if(!$.util.isBlank(order)){
					if(order>opts.length){
						order = opts.length ;
						flag = false ;
					}
					arr.push(order)
				}
			}else{
				$.each(order, function(i, val){
					if(val>opts.length){
						flag = false ;
					}
					arr.push(val) ;
				});
			}
	
			var values = [] ;
			$.each(opts, function(i, val){
				$.each(arr, function(key, val1){
					if((val1-1)==i){
						var v = $(val).val() ;
						if(!$.util.isBlank(v)){
							values.push(v) ;
						}else{
							values.push($(val).text()) ;
						}
						
					}
				});
			});

			$.select2.val(selector, values, setNotVali) ;
			
			return flag ;
			
		},
		selectByText:function(selector, texts, setNotVali){
			var opts = $(selector).find("option");
			var flag = true ;
	
			var values = [] ;
			$.each(opts, function(i, val){
				var t = $(val).text() ;
				var tv = $(val).attr("value") ;
				if($.util.isBlank(tv)){
					tv = t ;
				}
				
				if(!$.util.isArray(texts)){
					if(t==texts){
						values.push(tv) ;				
					}
				}else{
					$.each(texts, function(key, val1){	
						if(val1==tv){
							values.push(tv) ;	
						}
					});
				}
				
			});
			
			if(values.length==0){
				flag = false ;
			}else{
				if($.util.isArray(texts)){
					if(values.length!=texts.length){					
						flag = false ;
					}
				}
			}
			$.select2.val(selector, values, setNotVali) ;
			return flag ;
		},
		initSelect2:function(){
			$(".select2").each(function(i, val){
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					if($(next[0]).hasClass("select2")){
						return true ;
					}
				}
				
				var setting = {
					width:"100%",
					placeholder:"请选择"	
				}
				
				var id = $(val).attr("id") ;
				
				var myHolder = $("#" + id).attr("myPlaceHolder") ;

				if(!$.util.isBlank(myHolder)){
					setting.placeholder = myHolder ;
				}							
				
				if($("#" + id).hasClass("allowClear")){
					setting.allowClear = true
				}
				
				$("#" + id).select2(setting) ;
				
				if($("#" + id).hasClass("select-disable")){
					$.select2.able("#" + id, false) ;
				}
				
				$("#" + id).on("select2:select", function (e) {
					if(e.params.data.id=="select2-none"){
						$.select2.clear(this) ;
					}
				});
				
				var thisVal  = $("#" + id) ;
				var datatype = thisVal.attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					$(thisVal).on('select2:select select2:unselect', function (e) {		
						var validForm = $(this).parents(".validform") ;
						var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
						$.validform.checkEl(demo, this) ;

					}) ;	
				}

			});
			
			$(".select2-tag").each(function(i, val){
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					if($(next[0]).hasClass("select2")){
						return true ;
					}
				}
				
				var id = $(val).attr("id") ;				
				
				var setting = {
					width:"100%",
					placeholder:"请选择",
					tags:true			
				}
				
				var myHolder = $("#" + id).attr("myPlaceHolder") ;
				if(!$.util.isBlank(myHolder)){
					setting.placeholder = myHolder ;
				}
				
				if($("#" + id).hasClass("allowClear")){
					setting.allowClear = true
				}
				
				var maximumInputLength = $("#" + id).attr("maxWritten") ;
				if(!$.util.isBlank(maximumInputLength)){
					setting.maximumInputLength = $.util.parseInt(maximumInputLength) ;
				}else{
					setting.maximumInputLength = $.util.parseInt($.globalSettings.inputDefaultLength) ;
				}							
				
				$("#" + id).select2(setting) ;
				
				if($("#" + id).hasClass("select-disable")){
					$.select2.able("#" + id, false) ;
				}
				
				$("#" + id).on("select2:select", function (e) {
					if(e.params.data.id=="select2-none"){
						$.select2.clear(this) ;
					}
				});
				
				var thisVal  = $("#" + id) ;
				var datatype = thisVal.attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					$(thisVal).on('select2:select select2:unselect', function () {	
						var validForm = $(this).parents(".validform") ;
						var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
						$.validform.checkEl(demo, this) ;
						$(thisVal).removeAttr("setNotVali") ;
					}) ;	
				}

			});			
			
			$(".select2-noSearch").each(function(i, val){
				
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					if($(next[0]).hasClass("select2")){
						return true ;
					}
				}
				var id = $(val).attr("id") ;
				
				var setting = {
					minimumResultsForSearch: Infinity,
					width:"100%",
					placeholder:"请选择"		
				}
				
				var myHolder = $("#" + id).attr("myPlaceHolder") ;
				if(!$.util.isBlank(myHolder)){
					setting.placeholder = myHolder ;
				}
				
				if($("#" + id).hasClass("allowClear")){
					setting.allowClear = true
				}
				
				
				$("#" + id).select2(setting) ;
				
				if($("#" + id).hasClass("select-disable")){
					$.select2.able("#" + id, false) ;
				}
				
				$("#" + id).on("select2:select", function (e) {
					if(e.params.data.id=="select2-none"){
						$.select2.clear(this) ;
					}
				});
				
				var thisVal  = $("#" + id) ;
				var datatype = thisVal.attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					$(thisVal).on('select2:select select2:unselect', function () {	
						var validForm = $(this).parents(".validform") ;
						var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
						$.validform.checkEl(demo, this) ;
						$(thisVal).removeAttr("setNotVali") ;
						

					}) ;	
				}

			});
			
			$(".select2-multiple").each(function(i, val){
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					if($(next[0]).hasClass("select2")){
						return true ;
					}
				}
				var id = $(val).attr("id") ;
				
				var setting = {
					width:"100%",
					placeholder:"请选择"		
				}
				var maximumSelectionLength = $("#" + id).attr("maxSelected") ;
				if(!$.util.isBlank(maximumSelectionLength)){
					setting.maximumSelectionLength = $.util.parseInt(maximumSelectionLength) ;
				}
				$("#" + id).select2(setting) ;
				
				if($("#" + id).hasClass("select-disable")){
					$.select2.able("#" + id, false) ;
				}
				
				$("#" + id).on("select2:select", function (e) {
					if(e.params.data.id=="select2-none"){
						$.select2.clear(this) ;
					}
				});
				
				var thisVal  = $("#" + id) ;
				var datatype = thisVal.attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					$(thisVal).on('select2:select select2:unselect', function () {	
						var validForm = $(this).parents(".validform") ;
						var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
						$.validform.checkEl(demo, this) ;
						$(thisVal).removeAttr("setNotVali") ;					

					}) ;	
				}

			});
			
			$(".select2-multiple-tag").each(function(i, val){
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					if($(next[0]).hasClass("select2")){
						return true ;
					}
				}
				var id = $(val).attr("id") ;
				
				var setting = {
					width:"100%",
					placeholder:"请选择"	,
					tags:true
				}
				var maximumSelectionLength = $("#" + id).attr("maxSelected") ;
				if(!$.util.isBlank(maximumSelectionLength)){
					setting.maximumSelectionLength = $.util.parseInt(maximumSelectionLength) ;
				}
				var maximumInputLength = $("#" + id).attr("maxWritten") ;
				if(!$.util.isBlank(maximumInputLength)){
					setting.maximumInputLength = $.util.parseInt(maximumInputLength) ;
				}else{
					setting.maximumInputLength = $.util.parseInt($.globalSettings.inputDefaultLength) ;
				}
				$("#" + id).select2(setting) ;
				
				if($("#" + id).hasClass("select-disable")){
					$.select2.able("#" + id, false) ;
				}
				
				$("#" + id).on("select2:select", function (e) {
					if(e.params.data.id=="select2-none"){
						$.select2.clear(this) ;
					}
				});
				
				var thisVal  = $("#" + id) ;
				var datatype = thisVal.attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					$(thisVal).on('select2:select select2:unselect', function () {	
						var validForm = $(this).parents(".validform") ;
						var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
						$.validform.checkEl(demo, this) ;
						$(thisVal).removeAttr("setNotVali") ;					

					}) ;	
				}

			});			
			
			
		}
		
	});	
	
})(jQuery);	
/********************************select2**********************************/

/**控件通用设置**/
$.uiSettings = $.uiSettings || {};
(function($){
	
	/********************************datatable Settings开始**********************************/
	var oldOTableSettings = {
			language: {
		        processing:     "<img src='" + ContextPath + "/common/library/dataTables/images/xubox_loading2.gif' />",
		        search:         "全局搜索：",	        
		        lengthMenu:    "每页显示&nbsp;_MENU_&nbsp;条",
		        info: "当前第 _START_ - _END_ 条　共计 _TOTAL_&nbsp;条",
		        infoEmpty:      "没有记录",
		        infoFiltered:   "(从 _MAX_ 条记录中过滤)",
		        infoPostFix:    "",
		        loadingRecords: "正在加载...",
		        zeroRecords:    "没有找到符合条件的数据",
		        emptyTable:     "无数据",
		        paginate: {
		            first:      "首页",
		            previous:   "前一页",
		            next:       "后一页",
		            last:       "尾页"
		        },
		        aria: {
		            sortAscending:  ": 升序排列",
		            sortDescending: ": 降序排列"
		        }
		    },
		    dom: '<"dtTop"lp<"clear">>rt<"dtBottom"lp<"clear">>',
		    autoWidth: true,
		    lengthChange: true,
		    ordering: true, 
		    paging: true,
		    processing: false,
		    searching: true,
		    stateSave: false,
		    pagingType: "full_numbers",
		    serverSide: true,	    
		    lengthMenu: [ 10, 25, 50, 75, 100 ],
//		    ajaxSource: ContextPath + "/fxyp/findDetail.action",
		    columnDefs:[
//		        { 
//			          "targets": 0,
//			          "width": "",
//			          "title": "报警时间",
//			          "data": "BJSJ" ,
//			          "render": function ( data, type, full, meta ) {		        	
//			        	      return data;
//			          }
//		        }
		    ],
		    serverParams: function ( aoData ) { 	    

//		    	aoData.push( { "name": "page_jqlxComment", "value": page_jqlxComment } );
//		    	aoData.push( { "name": "startTime", "value": startTime } );
//		    	aoData.push( { "name": "endTime", "value": endTime } );
//		    	aoData.push( { "name": "page_unitName", "value": page_unitName } );
//		    	aoData.push( { "name": "isAllLxChildren", "value": isAllLxChildren } );
//		    	aoData.push( { "name": "isAllDwChildren", "value": isAllDwChildren } );
		    },
	  	   	fnServerData: function ( sSource, aoData, fnCallback, oSettings ) {

	  	   		 aoData.push( { "name": "dtIDisplayStart", "value": $.uiSettings.getAoDataValByName(aoData, "iDisplayStart") } );
	 	  	   	 aoData.push( { "name": "dtIDisplayLength", "value": $.uiSettings.getAoDataValByName(aoData, "iDisplayLength") } );
//	 	  	   	 aoData.push( { "name": "dtSEcho", "value": $.uiSettings.getAoDataValByName(aoData, "sEcho") } );
//	 	  	     aoData.push( { "name": "dtIColumns", "value": $.uiSettings.getAoDataValByName(aoData, "iColumns") } );
//	 	  	 	 aoData.push( { "name": "dtSColumns", "value": $.uiSettings.getAoDataValByName(aoData, "sColumns") } );
//	 	  	 	 aoData.push( { "name": "dtMDataProp_0", "value": $.uiSettings.getAoDataValByName(aoData, "mDataProp_0") } );
//	 	  	 	 aoData.push( { "name": "dtSSearch_0", "value": $.uiSettings.getAoDataValByName(aoData, "sSearch_0") } );
//	 	  	 	 aoData.push( { "name": "dtBRegex_0", "value": $.uiSettings.getAoDataValByName(aoData, "bRegex_0") } );
//	 	  	 	 aoData.push( { "name": "dtBSearchable_0", "value": $.uiSettings.getAoDataValByName(aoData, "bSearchable_0") } );
//	 	  	 	 aoData.push( { "name": "dtBSortable_0", "value": $.uiSettings.getAoDataValByName(aoData, "bSortable_0") } );
//	 	  	 	 aoData.push( { "name": "dtSSearch", "value": $.uiSettings.getAoDataValByName(aoData, "sSearch") } );
//	 	  	 	 aoData.push( { "name": "dtBRegex", "value": $.uiSettings.getAoDataValByName(aoData, "bRegex") } ); 
//	 	  	 	 aoData.push( { "name": "dtBRegex", "value": $.uiSettings.getAoDataValByName(aoData, "iSortCol_0") } );  
//	 	  	 	 aoData.push( { "name": "dtSSortDir_0", "value": $.uiSettings.getAoDataValByName(aoData, "sSortDir_0") } );  
//	 	  	 	 aoData.push( { "name": "dtISortingCols", "value": $.uiSettings.getAoDataValByName(aoData, "iSortingCols") } ); 	
	  	   		
		         oSettings.jqXHR = $.ajax({
		           "dataType": 'json',
		           "type": "POST",
		           "url": sSource,
		           "data": aoData,
		           "success": function(data){
	
		        	   fnCallback(data) ;
		        	},
		           "error":function(data){
		           }
		         } );
	  	    },
		    createdRow: function( row, data, dataIndex ) {
		    	
		    },
		    drawCallback: function( settings, buttonSelector ) {	
		
		    },
		    footerCallback: function( tfoot, data, start, end, display ) {
		    },
		    formatNumber: function ( toFormat ) {
		    },
		    infoCallback: function( settings, start, end, max, total, pre ) {
		    },
		    initComplete: function(settings, json) {
		    },
		    preDrawCallback: function( settings ) {
		    },
		    rowCallback: function( row, data, index ) {
		    },
		    stateLoadCallback: function (settings) {
		    },
		    stateLoaded: function (settings, data) {
		    },
		    stateLoadParams: function (settings, data) {
		    },
		    stateSaveCallback: function (settings, data) {
		    },
		    stateSaveParams: function (settings, data) {
		    }
			
	} ;	
	
	var oTableSettings = {
			language: {
		        processing:     "<img src='" + ContextPath + "/common/library/dataTables/images/xubox_loading2.gif' />",
		        search:         "全局搜索：",	        
		        lengthMenu:    "每页显示&nbsp;_MENU_&nbsp;条",
		        info: "当前第 _START_ - _END_ 条　共计 _TOTAL_&nbsp;条",
		        infoEmpty:      "没有记录",
		        infoFiltered:   "(从 _MAX_ 条记录中过滤)",
		        infoPostFix:    "",
		        loadingRecords: "正在加载...",
		        zeroRecords:    "没有找到符合条件的数据",
		        emptyTable:     "无数据",
		        paginate: {
		            first:      "首页",
		            previous:   "前一页",
		            next:       "后一页",
		            last:       "尾页"
		        },
		        aria: {
		            sortAscending:  ": 升序排列",
		            sortDescending: ": 降序排列"
		        }
		    },
		    dom: '<"dtTop"<"clear">>rt<"dtBottom"ipl<"clear">>',
		    autoWidth: true,
		    lengthChange: true,
		    ordering: true,
		    orderMulti:true,
		    paging: true,
		    useAutoReq:false,
		    processing: false,
		    searching: true,
		    hideHead:false ,
		    stateSave: false,
		    autoFooter:false,
		    pagingType: "full_numbers",
		    serverSide: true,	    
		    orderFixed:null,
        	//pageLength:10,
		    lengthMenu: [ 10, 25, 50, 75, 100 ],
		    ajax:{
		    //	url:context + "/user/queryUsersByPage.action",
		    	type:"post",
		    	global:false,
		    	data:function(d, oSettings){
		    		//$.globalSettings.dataTableAjaxLoading = $.util.globalSettings.ajaxLoading ;
		    		//$.globalSettings.ajaxLoading = false ;
		    		
		    		var dataTableReq = {
		    				draw:d.draw,
		    				start:d.start,
		    				length:d.length,
		    				search:d.search,
		    				order:d.order,
		    				columns:d.columns	    				
		    		}
		    		
		    		
		    		
		    		var pagerReq = {
		    			startDate:null,
		    			endDate:null,
		    			search:null,
		    			pageNo:null,
		    			pageSize:null,
		    			dateKey:null
		    		}
		    		
		    		if(oSettings.useAutoReq){
		    			pagerReq["dataTableReq"] = dataTableReq;
		    		}
		    		
		    		var tab = $(oSettings.nTable).DataTable();
		    		
		    		var flag = oSettings.paramsReq(d, tab, oSettings, pagerReq) ;
		    		if(flag===false){
		    			d.datatableNotDraw = true ;
		    			tab.page( -1) ;
		    		}
		    		
		    		$.util.objToStrutsFormData(pagerReq, "pagerReq", d) ;
		    		
		    	},
		    	dataSrc:function(json, oSettings){
		    		 	
		    		var tab = $(oSettings.nTable).DataTable();
		    		
		    		//$.globalSettings.ajaxLoading = $.globalSettings.dataTableAjaxLoading ;
		    		
		    		var bodySiap = json.bodySiap ;
		    		if($.util.exist(bodySiap)){
			    		var bodyObj = bodySiap.bodyObj ;
			    		var dataTableResp = bodyObj.dataTableResp ;
			    		var pageList = bodyObj.pageList ;

			    		json.draw = dataTableResp.draw ;
			    		json.recordsTotal = dataTableResp.recordsTotal ;
			    		json.recordsFiltered = dataTableResp.recordsFiltered ;
			    		json.error = dataTableResp.error ;
			    		
			    		json.data = pageList ;
		    		}
		    		
		    		oSettings.paramsResp(json, tab, oSettings) ;
		    		return json.data ;
		    	},
		    	myError:function(xhr, error, thrown){
		    		$.util.ajaxError(xhr, error, thrown) ;
		    	}
		    	
		    } ,
		    columnDefs:[
//		        { 
//			          "targets": 0,
//			          "width": "",
//			          "title": "报警时间",
//			          "data": "BJSJ" ,
//			          "render": function ( data, type, full, meta ) {		        	
//			        	      return data;
//			          }
//		        }
		    ],
		    detailFmt : function(d){
		    	
			},
		    paramsReq:function(d, tab, oSettings, pagerReq){
		    
		    },
		    paramsResp:function(json, tab, oSettings){
		    	
		    },
		    createdRow: function( row, data, dataIndex ) {
		    	
		    },
		    myDrawCallback:function(settings){
		
		    },
		    drawCallback: function( settings ) {
		    	$.dataTable.initWidget() ;
		    	settings.myDrawCallback(settings) ;
		    },
		    headerCallback: function( thead, data, start, end, display ) {
		  
		    },
		    footerCallback: function( tfoot, data, start, end, display ) {
		    },
		    formatNumber: function ( toFormat ) {
		    },
		    infoCallback: function( settings, start, end, max, total, pre ) {
		    	if(total==0){
		    		start = 0 ;
		    	}
		    	return "当前第 "+start+" - "+end+" 条　共计 "+total+"&nbsp;条" ;
		    },
		    initComplete: function(settings, json) {
		    },
		    preDrawCallback: function( settings ) {
		    },
		    rowCallback: function( row, data, index ) {
		    },
		    stateLoadCallback: function (settings) {
		    },
		    stateLoaded: function (settings, data) {
		    },
		    stateLoadParams: function (settings, data) {
		    },
		    stateSaveCallback: function (settings, data) {
		    },
		    stateSaveParams: function (settings, data) {
		    }
			
	} ;
	/********************************datatable Settings结束**********************************/
	
	/********************************highchart设置开始**********************************/
	var hightChartBarSettings = {
	    	colors: ['#9d72e7','#529aff','#ff426a'], //线条颜色
	        chart: {
	            type: 'column',
	            backgroundColor: 'rgba(0,0,0,0)'
	        },
	        title: {
	            text: ''
	        },
	        subtitle: {
	            text: ''
	        },
			credits : {
				enabled : false
			},  	
	        xAxis: {
	            lineColor :  '#485d7c',	//基线颜色
			    labels : {
			    	rotation: -50,
					style: {
						color: '#fff',//颜色
						fontSize:'14px'  //字体
				}
					},
				categories : []
	        },
	        yAxis: {
	            min: 0,
	            lineColor :  '#485d7c',	//基线颜色
			    labels : {
						style: {
						color: '#8194af',//颜色
						fontSize:'14px'  //字体
				}
					},
	            title: {
	                text: ''
	            }
	        },
	        legend: {
//	            layout: 'vertical',
//	            align: 'right',
//	            verticalAlign: 'middle',
	            borderWidth: 1,
	            backgroundColor: '#FCFFC5',
	            borderColor: '#C98657'
	        },
	        tooltip: {
	            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}：</td>' +
	                '<td style="padding:0"><b>{point.y}</b></td></tr>',
	            footerFormat: '</table>',
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            },
	            series:{
	            	events:{
	            		
	            	}
	            }
	        },
			series : [
			          
			]
	    } ;	

	
	var hightChartPieSettings = {
			colors: ['#fe0000','#ff0078','#fe00d2', '#9c01ff', '#b56dff', '#0c00ff', '#00a2ff', '#5ec4ff', '#7cfbbb', '#09c701', '#77f036', '#cbff7a', '#e7b200', '#fffa74'], //线条颜色
	        chart: {
	        	backgroundColor: 'rgba(0,0,0,0)',
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false
	        },
			credits : {
				enabled : false
			},          
	        title: {
	            text: ''
	        },
	        tooltip: {
	    	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    color: '#fff',
	                    connectorColor: '#fff',
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
	                }
	            },
	            series:{
	            	events:{
	            		
	            	}
	            }
	        },
	        series: []
	    };	
	
	var pluploadSettings = {
			
	} ;
	
	/********************************highchart设置结束**********************************/
	jQuery.extend($.uiSettings, { 
		getOTableSettings : function(){
			return $.util.cloneObj(oTableSettings) ;
		},
		getLocalOTableSettings : function(){
			var tp = $.util.cloneObj(oTableSettings) ;
			delete tp.ajax;
			tp.serverSide = false ;
			return tp ;
		},	
		getLocalAjaxOTableSettings : function(){
			var tp = $.util.cloneObj(oTableSettings) ;
			tp.serverSide = false ;
			return tp ;
		},	
		getHightChartBarSettings : function(){
			return $.util.cloneObj(hightChartBarSettings) ;
		},	
		getHightChartPieSettings : function(){
			return $.util.cloneObj(hightChartPieSettings) ;
		},
		getAoDataValByName:function(arr, name){
			var str = null ;
			$.each(arr, function(i, val){
				if(val.name === name){
					str = val.value ;
				} 
			});
			return str ;
		}
	});	
	

	
})(jQuery);	

$.dataTable = $.dataTable || {};

(function($){
	"use strict";
	var addDtTableTrIdCount = 0 ;
	jQuery.extend($.dataTable, { 
		makeFooter:function(thead){
			var str = "<tfoot>" ;
			$(thead).each(function(i, val){
				str += "<tr>" ;				
				$($(val).children("th")).each(function(k, val1){
					str += "<th>" ;	
					str += $(val1).html().toString() ;	
					str += "</th>" ;	
				}) ;
				str += "</tr>" ;
			}) ;
			
			str += "</tfoot>" ;
			
			return str ;
		},
		rowSelect:function(tableId, selectId, unSelectId, arr){
			
			if(!$.util.isBlank(selectId)){
				$(document).on('click', '#'+selectId, function () {										
					$('#'+tableId+' tbody').find("tr").each(function(i, val){
						if(!$(val).hasClass("detailTr")){
							if((!$(val).hasClass("selected"))){
								$(val).toggleClass('selected');
							}
						}
					});
				});
			}
			
			if(!$.util.isBlank(unSelectId)){
				$(document).on('click', '#'+unSelectId, function () {	
					$('#'+tableId+' tbody').find("tr").each(function(i, val){
						if(!$(val).hasClass("detailTr")){
							if($(val).hasClass("selected")){
								$(val).removeClass('selected');
							}else{
								$(val).toggleClass('selected');
							}
						}

					});
				});
			}
				
		    $('#'+tableId+' tbody').on( 'click', 'tr td', function () {
		    	var tr = $(this).parents("tr") ;
		    	var tds = tr.children("td") ;
		    	var pos = $.inArray(this, tds) ;
		    	if(pos>-1){
		    		if($.inArray(pos, arr)>-1){
				    	if(!tr.hasClass("detailTr")){
				    		tr.toggleClass('selected');
				    	}
		    		}
		    	}
		    } );
			

		},
		detailControl:function(datatableId, detailControlTdClass, settings){
			var tableObj = $("#"+datatableId).DataTable();
		    $('#'+datatableId+' tbody').on('click', 'td.'+detailControlTdClass, function () {
		        var tr = $(this).closest('tr');

		        var row = tableObj.row( tr );
		 
		        if ( row.child.isShown() ) {
		            // This row is already open - close it
		            row.child.hide();
		            tr.removeClass('shown');
		        } else {
		            // Open this row
		        	if(!$.util.isEmpty(tableObj.settings()[0].detailFmt)){
		        		if($.util.exist(row.data())){
			        		row.child(tableObj.settings()[0].detailFmt((row.data()))).show();
				            tr.addClass('shown');			        			
		        		}
		        	}	            
		        }
		    });
		},
		
		footerSearch:function(tableId, settings){
			var tableObj = $("#"+tableId).DataTable();
			var defs = settings.columnDefs ;
		    $('#'+tableId+' tfoot th').each( function (i, val) {
		    	if(i<defs.length){
		    		var def = defs[i] ;
		    		var defName = def.name ;
		    		var searchable = def.searchable ;
		    		if(searchable!=false&&defName!="date"){
				        var title = $('#'+tableId+' thead th').eq( $(this).index() ).text();
				        var width = $(this).width() ;
				        var padding = $(this).css("padding-left") ;
				        padding = padding.substr(0, padding.indexOf("p")) ;
				        var wt = width-$.util.parseInt(padding) ;
				        if(!$.util.isBlank(title)){
				        	$(this).html( '<input type="text" style="width:'+wt+'px" placeholder="搜索：'+title+'" />' );
				        }
		    		}
		    	}
		    } );
		    
		    tableObj.columns().every( function () {
		        var that = this;
		        $( $(this.footer()).find("input") ).on( 'keyup change', function () {
		            that.search( this.value ).draw();
		        } );
		    } );
		},
		
		getSearchKeyColIndex:function(tableId, searchKey){
			var tableObj = $("#"+tableId).DataTable();
			var colIndexMap = tableObj.settings()[0].colIndexMap ;
			if($.util.isBlank(colIndexMap[searchKey])){
				return null ;
			}else{
				return colIndexMap[searchKey] ;
			}
		},
		
		addRow:function(selector, position, settings, arr, isValidForm){
			if($(selector).find("tbody .addDtTableTr").length==0){
				//addDtTableTrIdCount = 0 ;
			}
			var table = $(selector).DataTable();
			
			var columnDefs = settings.columnDefs ;
			var a = '<tr class="">' ;
			if(isValidForm){
				a = '<tr id="addDtTableTrId-'+addDtTableTrIdCount+'" class="validform addDtTableTr">' ;			
			}
			$.each(arr, function(i, val){
				if(i<=columnDefs.length){
					var cf = columnDefs[i] ;
					var className = cf.className ;
					a += '<td class="' + className + '">' ;
					a += val ;
					a += '</td>' ;
				}	
			}) ;
			a +="</tr>" ;
			if(position==="before"){
				var adds = $(selector).find("tbody .addDtTableTr") ;
				if(adds.length==0){
					$(selector).find("tbody").prepend(a) ;
				}else{
					$(adds[adds.length-1]).after(a) ;
				}
			}else{
				$(selector).find("tbody").append(a) ;
			}
			if(isValidForm){
				$.validform.initValidform("addDtTableTrId-"+addDtTableTrIdCount) ;
				addDtTableTrIdCount++ ;
			}
		},
		editRow:function(tr, arr, isValidForm){
			var tds = $(tr).children("td") ;
			$.each(tds, function(i, val){
				if(i<=arr.length){
					var text = arr[i] ;
					if(!$.util.isBlank(text)){
						$(val).html(text) ;
					}
				}
			}) ;
			
			if(isValidForm){
				if(!$(tr).hasClass("validform")){
					var setId = "addDtTableTrId-"+addDtTableTrIdCount ;
					if(!$.util.exist($.validform.getValidFormObjById(setId))){
						$(tr).attr("id", setId) ;
						$(tr).addClass("validform") ;
						$.validform.initValidform(setId) ;
						addDtTableTrIdCount++ ;
					}
				}
			}

		},
		editRowInput:function(tr, settings, editTdStr){
			var selector = $(tr).parents("table").attr("id") ;
			var table = $("#"+selector).DataTable();
			
			var columnDefs = settings.columnDefs ;
			var tds = $(tr).children("td") ;
			$.each(tds, function(i, val){
				if(i<=columnDefs.length){
					var cdf = columnDefs[i] ;
					var className = cdf.className ;
					if($.util.isBlank(className)){
						className = "" ;
					}
					var dt = cdf.data ;

					if(!$.util.isBlank(dt)){
						if(!(className.indexOf("details-control")>-1 || className.indexOf("table-checkbox")>-1 || className.indexOf("table-notAdd")>-1 || className.indexOf("table-edit")>-1)){						
							var div = $(val).find(".td-text") ;
							if(div.length==0){
								var text = $(val).text() ;
								$(val).html('<input type="text" class="tb-' +dt+ '" value="'+text+'" />') ;
							}else{
								var text = $(div).text() ;
								$(div).html('<input type="text" class="tb-' +dt+ '" value="'+text+'" />') ;
							}

							
						}						
					}
					
					if(className==="table-edit"){
						var div = $(val).find(".td-text") ;
						if(div.length==0){
							$(this).html(editTdStr) ;
						}else{
							$(div).html(editTdStr) ;
						}
						
					}
				}
			});
			
			$.dataTable.initWidget() ;
		},
		initWidget:function(){
//			$.icheck.initIcheck() ;
//			$.select2.initSelect2() ;
//			$.util.initInputLength();
//			$.laydate.initDateRange() ;
//			$.laydate.initLaydate() ;
//			$.validform.initValidform() ;
		}
	
	});	
	
})(jQuery);	

$.laydate = $.laydate || {};
(function($){
	"use strict";	
	
	var dateObj = {} ;
	
	jQuery.extend($.laydate, { 

		getDateObj:function(id){
			return dateObj[id] ;
		},
		setDateObj:function(id, obj){
			dateObj[id] = obj ;
		},
		reset:function(divSelector){
			var div = $(divSelector) ;
			var divId = div.attr("id") ;
			var start = div.find(".laydate-start") ;
			var end = div.find(".laydate-end") ;
			var date = div.find(".laydate-value") ; 
			
			if(!$.util.isEmpty(start)){
				var stKey = "inputStart" + divId ;
				dateObj[stKey].min = null ;
				dateObj[stKey].max = null ;
				start.val("") ;
			}
			
			if(!$.util.isEmpty(end)){
				var edKey = "inputEnd" + divId ;
				dateObj[edKey].min = null ;
				dateObj[edKey].max = null ;
				end.val("") ;
			}
			
			if(!$.util.isEmpty(date)){
				var dtKey = "dateInput" + divId ;
				date.val("") ;
			}
		},

		setRange:function(startVal, endVal, divSelector, fmtInfoVal, which){
			
			var div = $(divSelector) ;
			
			var divId = div.attr("id") ;
			var stStr = startVal ;
			var edStr = endVal ;	
			var fmtSelect = div.find(".dateFmt") ;	
			var selectTagName = fmtSelect[0].tagName ;
			
			var fmt = "" ;
			var fif = "" ;
			if(!$.util.isBlank(fmtInfoVal)){
				fif = fmtInfoVal ;
				fmt = fmtInfoVal.substring(fmtInfoVal.indexOf("@")+1) ;
			}else{
				if(selectTagName=="INPUT"){
					fif = fmtSelect.val() ;
					fmt = fif.substring(fif.indexOf("@")+1) ;
				}else{
					fif = $.select2.val(fmtSelect) ;
					fmt = fif.substring(fif.indexOf("@")+1) ;
				}
			}		
			
			if($.util.isBlank(which) || which=="both"){
				if($.date.compareStr(stStr, edStr, fmt)>0){
					edStr = stStr ;
				}
			}
			
			fmt = fmtToDateFmt(fmt) ;
			
			var start = div.find(".laydate-start") ;
			var stKey = "inputStart" + divId ;
			var end = div.find(".laydate-end") ;
			var edKey = "inputEnd" + divId ;
				
			
			dateObj[stKey].format = fmt;
			dateObj[edKey].format = fmt;
			
			if(!$.util.isBlank(stStr)){
				dateObj[edKey].min = stStr ;
				dateObj[edKey].start = stStr ;
				
			}
			if(!$.util.isBlank(edStr)){
				dateObj[stKey].max = edStr ;	
				
			}
			
			if($.util.isBlank(which) || which=="both"){
				start.val(stStr) ;
				end.val(edStr) ;
			}else if(which=="start"){
				start.val(stStr) ;
			}else if(which=="end"){
				start.val(edStr) ;
			}
			
			
			if(selectTagName=="INPUT"){
				fmtSelect.val(fif) ;
			}else if(selectTagName=="SELECT"){
				var next = $(fmtSelect).next() ;
				if($.util.exist(next[0])&&$(next[0]).hasClass("select2")){
					$.select2.val(fmtSelect, fif) ;
				}
			}
			
			
		},
		
		setTimeRange:function(startTime, endTime, divSelector, fmtInfoVal, which){
			
			var startDate = new Date(startTime) ;
			var endDate = new Date(endTime) ;
			
			var div = $(divSelector) ;
			
			var fmtSelect = div.find(".dateFmt") ;	
			var selectTagName = fmtSelect[0].tagName ;
			
			var fmt = "" ;
			var fif = "" ;
			if(!$.util.isBlank(fmtInfoVal)){
				fif = fmtInfoVal ;
				fmt = fmtInfoVal.substring(fmtInfoVal.indexOf("@")+1) ;
			}else{
				if(selectTagName=="INPUT"){
					fif = fmtSelect.val() ;
					fmt = fif.substring(fif.indexOf("@")+1) ;
				}else{
					fif = $.select2.val(fmtSelect) ;
					fmt = fif.substring(fif.indexOf("@")+1) ;
				}
				
			}
			
			var startVal = $.date.dateToStr(startDate, fmt) ;
			var endVal = $.date.dateToStr(endDate, fmt) ;
			
			$.laydate.setRange(startVal, endVal, divSelector, fmtInfoVal, which);
		},
		
		setTime:function(time, divSelector, fmtInfoVal){
			var d = new Date(time) ;
			
			var div = $(divSelector) ;
			
			var fmtSelect = div.find(".dateFmt") ;	
			var selectTagName = fmtSelect[0].tagName ;
			
			var fmt = "" ;
			var fif = "" ;
			if(!$.util.isBlank(fmtInfoVal)){
				fif = fmtInfoVal ;
				fmt = fmtInfoVal.substring(fmtInfoVal.indexOf("@")+1) ;
			}else{
				if(selectTagName=="INPUT"){
					fif = fmtSelect.val() ;
					fmt = fif.substring(fif.indexOf("@")+1) ;
				}else{
					fif = $.select2.val(fmtSelect) ;
					fmt = fif.substring(fif.indexOf("@")+1) ;
				}
				
			}
			
			var dateStr = $.date.dateToStr(d, fmt) ;
			
			fmt = fmtToDateFmt(fmt) ;						
			
			$.laydate.setDate(dateStr, divSelector, fmtInfoVal);
		},		
		
		setDate:function(dateVal, divSelector, fmtInfoVal){
			var div = $(divSelector) ;
			var divId = div.attr("id") ;
			var dtStr = dateVal ;
			var dtInput = div.find(".laydate-value") ;
			var fmtSelect = div.find(".dateFmt") ;	
			var selectTagName = fmtSelect[0].tagName ;
			
			var fmt = "" ;
			var fif = "" ;
			if(!$.util.isBlank(fmtInfoVal)){
				fif = fmtInfoVal ;
				fmt = fmtInfoVal.substring(fmtInfoVal.indexOf("@")+1) ;
			}else{
				if(selectTagName=="INPUT"){
					fif = fmtSelect.val() ;
					fmt = fif.substring(fif.indexOf("@")+1) ;
				}else{
					fif = $.select2.val(fmtSelect) ;
					fmt = fif.substring(fif.indexOf("@")+1) ;
				}
				
			}

			fmt = fmtToDateFmt(fmt) ;
			
			var dtKey = "dateInput" + divId ;
			
			dateObj[dtKey].format = fmt;
			
			if(selectTagName=="INPUT"){
				fmtSelect.val(fif) ;
			}else{
				$.select2.val(fmtSelect, fif) ;
			}
			
			dtInput.val(dateVal) ;
			
		},
		
		getDate:function(divSelector, filter){
			var div = $(divSelector) ;
			var start = div.find(".laydate-start") ;
			var end = div.find(".laydate-end") ;
			var date = div.find(".laydate-value") ; 
			
			if(filter==="start"){
				return $.util.isBlank($(start).val())?null:$(start).val() ;
			}
			if(filter==="end"){
				return $.util.isBlank($(end).val())?null:$(end).val() ;
			}	
			if(filter==="date"){
				return $.util.isBlank($(date).val())?null:$(date).val() ;
			}	
		},
		
		getDateByCal:function(divSelector, filter){
			
			var fmt = $.laydate.getFmt(divSelector) ;
			
			if(!$.util.exist(fmt)){
				fmt = "yyyy-MM-dd HH:mm:ss" ;
			}
			
			var dateStr = $.laydate.getDate(divSelector, filter) ;
			
			return $.util.isBlank(dateStr)?null:$.date.strToDate(dateStr, fmt) ;
		},
		
		getTime:function(divSelector, filter){
			var d = $.laydate.getDateByCal(divSelector, filter);
			return $.util.exist(d)?d.getTime():null;
		},
		
		getFmt:function(divSelector){
			var fmtInfo = $(divSelector).find(".dateFmt") ;
			var fmtInfoVal = $(fmtInfo).val() ;	
			
			var fmt = fmtInfoVal.substring(fmtInfoVal.indexOf("@")+1) ;

			return fmt ;
		},		
		
		getFmtByStr:function(obj){
			if($.util.isString(obj)){
				return obj.substring(obj.indexOf("@")+1) ;
			}else{
				var fmtInfo = $(obj).find(".dateFmt") ;
				var fmtInfoVal = fmtInfo.val() ;
				
				var fmt = fmtInfoVal.substring(fmtInfoVal.indexOf("@")+1) ;

				return fmt ;
			}

		},
		
		getInfo:function(divSelector){
			var fmtInfo = $(divSelector).find(".dateFmt") ;
			var fmtInfoVal = fmtInfo.val() ;
			
			var fmt = fmtInfoVal.substr(0, fmtInfoVal.indexOf("@")) ;

			return fmt ;
		},
		
		getInfoByStr:function(obj){
			if($.util.isString(obj)){
				return obj.substr(0, obj.indexOf("@")) ;
			}else{
				var fmtInfo = $(obj).find(".dateFmt") ;
				var fmtInfoVal = fmtInfo.val() ;
				
				var fmt = fmtInfoVal.substr(0, fmtInfoVal.indexOf("@")) ;

				return fmt ;
			}
		},
		
		getFmtInfo:function(selector){
			return $(selector).find(".dateFmt").val() ;
		},
		
		initDateRange:function(){
			$(".dateRange").each(function(i, val){		
				
				var div = $(this) ;
				var divId = div.attr("id") ;
				
				var fmt = $.laydate.getFmt(div) ;
				fmt =  fmtToDateFmt(fmt) ;
				
				var start = div.find(".laydate-start") ;
				var end = div.find(".laydate-end") ;
				
				var startKey = "inputStart" + divId ;
				var endKey = "inputEnd" + divId ;
				
				if($.util.exist($.laydate.getDateObj(startKey))){
					return true ;
				}
				
				$.laydate.setDateObj(startKey, {
					elem:start[0],
					format: fmt, //日期格式
			        istime: true, //是否开启时间选择
			        isclear: true, //是否显示清空
			        istoday: true, //是否显示今天
			        issure: true, //是否显示确认
			        festival: true, //是否显示节日
			        fixed: true, //是否固定在可视区域
			        zIndex: 99999999, //css z-index
			        choose: function(dates){ //选择好日期的回调
			        	var endObj = $.laydate.getDateObj(endKey) ;
			        	endObj.min = dates ; 
			        	endObj.start = dates ; 
			        }					
				}) ; 
				
				$.laydate.setDateObj(endKey, {
					elem:end[0],
					format: fmt, //日期格式
			        istime: true, //是否开启时间选择
			        isclear: true, //是否显示清空
			        istoday: true, //是否显示今天
			        issure: true, //是否显示确认
			        festival: true, //是否显示节日
			        fixed: true, //是否固定在可视区域
			        zIndex: 99999999, //css z-index
			        choose: function(dates){ //选择好日期的回调
			        	var endObj = $.laydate.getDateObj(startKey) ;
			        	endObj.max = dates ; 
			        }						
				}) ; 
				

				
				$(start).on('click', function () {		
					
					var div = $(this).parents(".dateRange") ;
					if(!$(div).hasClass("date-disabled")){
						var div = $(this).parents(".dateRange") ;
						var fmt = $.laydate.getFmt(div) ;
						fmt =  fmtToDateFmt(fmt) ;
						var dateObj = $.laydate.getDateObj(startKey) ;
						dateObj.format = fmt ;
	
						laydate(dateObj);
					}			

				});
				
				var startSpan = div.find(".laydate-start-span") ;
				
				$(startSpan).on('click', function () {		
					
					$(this).parents(".dateRange").find(".laydate-start").trigger("click") ;			

				});	
				
				
				$(end).on('click', function () {	
					var div = $(this).parents(".dateRange") ;
					if(!$(div).hasClass("date-disabled")){
						var div = $(this).parents(".dateRange") ;
						var fmt = $.laydate.getFmt(div) ;
						fmt =  fmtToDateFmt(fmt) ;
						var dateObj = $.laydate.getDateObj(endKey) ;
						dateObj.format = fmt ;
						
						laydate(dateObj);
					}

				});
				
				var endSpan = div.find(".laydate-end-span") ;
				$(endSpan).on('click', function () {	
					
					$(this).parents(".dateRange").find(".laydate-end").trigger("click") ;			

				});
				
			});
			
			
			$(document).on('change', ".laydate-range", function () {		
				var div = $(this).parents(".dateRange") ;
				div.find(".laydate-start").val("") ;
				div.find(".laydate-end").val("") ;
			});
		
		},
		initLaydate:function(){
			$(".laydate").each(function(i, val){
				var div = $(this) ;
				var divId = div.attr("id") ;
				
				var fmt = $.laydate.getFmt(div) ;
				fmt =  fmtToDateFmt(fmt) ;
				
				var ldv = div.find(".laydate-value") ;
				
				var ldvKey = "dateInput" + divId ;
				
				if($.util.exist($.laydate.getDateObj(ldvKey))){
					return true ;
				}
				
				$.laydate.setDateObj(ldvKey, {
					elem:ldv[0],
					format: fmt, //日期格式
			        istime: true, //是否开启时间选择
			        isclear: true, //是否显示清空
			        istoday: true, //是否显示今天
			        issure: true, //是否显示确认
			        festival: true, //是否显示节日
			        fixed: true, //是否固定在可视区域
			        zIndex: 99999999, //css z-index
			        choose: function(dates){ //选择好日期的回调
			        	
			        }				
					
					
				}) ;
				
				$(ldv).on('click', function () {	
					
					var div = $(this).parents(".laydate") ;
					if(!$(div).hasClass("date-disabled")){
						var div = $(this).parents(".laydate") ;
						var fmt = $.laydate.getFmt(div) ;
						fmt =  fmtToDateFmt(fmt) ;
						var dateObj = $.laydate.getDateObj(ldvKey) ;
						dateObj.format = fmt ;
						
						laydate(dateObj);
					}
					

				});
				
			});
			
			
			$(document).on('change', ".laydate-fmt", function () {		
				$(this).parents(".dateRange").find(".laydate-value").trigger("click") ;	
			});
		
		},
		
		fmtToDateFmt:function(fmt){
			fmt=fmt.replace("yyyy", "YYYY");     
			fmt=fmt.replace("dd", "DD");   
			fmt=fmt.replace("HH", "hh");   
			return fmt ;
		}
	
	
	});	
	
	function fmtToDateFmt(fmt){
		fmt=fmt.replace("yyyy", "YYYY");     
		fmt=fmt.replace("dd", "DD");   
		fmt=fmt.replace("HH", "hh");   
		return fmt ;
	}
	
})(jQuery);	

//定义date类
$.date = $.date || {};
(function($){
	"use strict";
	
	jQuery.extend($.date, { 
		dateToStr : function(date, fmt){
			var o = {           
				    "M+" : date.getMonth()+1, //月份           
				    "d+" : date.getDate(), //日           
				    "h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时           
				    "H+" : date.getHours(), //小时           
				    "m+" : date.getMinutes(), //分           
				    "s+" : date.getSeconds(), //秒           
				    "q+" : Math.floor((date.getMonth()+3)/3), //季度           
				    "S" : date.getMilliseconds() //毫秒           
				};           
			    var week = {           
			    "0" : "/u65e5",           
			    "1" : "/u4e00",           
			    "2" : "/u4e8c",           
			    "3" : "/u4e09",           
			    "4" : "/u56db",           
			    "5" : "/u4e94",           
			    "6" : "/u516d"          
			    };           
			    if(/(y+)/.test(fmt)){           
			        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));           
			    }           
			    if(/(E+)/.test(fmt)){           
			        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);           
			    }           
			    for(var k in o){           
			        if(new RegExp("("+ k +")").test(fmt)){           
			            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
			        }           
			    }        

			    return fmt;   
		},
		
		timeToDate:function(time){
			return new Date(time) ;
		},
		
		strToTime:function(str, fmt){
			if($.util.isBlank(fmt)){
				fmt = "yyyy-MM-dd HH:mm:ss" ;
			}
			
			var date = $.date.strToDate(str, fmt) ;
			
			return date.getTime() ;
		},
		
		timeToStr:function(time, fmt){
			if(!$.util.exist(fmt)){
				fmt = "yyyy-MM-dd HH:mm:ss" ;
			}
			
			return $.date.dateToStr($.date.timeToDate(time), fmt) ;
		},		
		
		strToDate : function(str, fmt){
			
			var o = {    
					"Y+" : "Y+", //年份
					"y+" : "y+", //年份
				    "M+" : "M+", //月份           
				    "d+" : "d+", //日           
				    "h+" : "h+", //小时           
				    "H+" : "H+", //小时           
				    "m+" : "m+", //分           
				    "s+" : "s+", //秒           
				    "q+" : "q+", //季度           
				    "S" : "S" //毫秒           
			};  
			
			var year = "" ;
			var month = "" ;
			var day = "" ;
			var hour = "" ;
			var minute = "" ;
			var second = "" ;
			
			
		    
		    for(var k in o){     
		    	var reg = new RegExp("("+ k +")") ;
		        if(reg.test(fmt)){    
		        	var re = RegExp.$1 ;
		        	var start = fmt.indexOf(re) ;
		        	var length = re.length ;
		        	var result = str.substr(start, length) ;	        
		        	if(k=="y+" || k=="Y+"){
				    	year = result ;
		        	}
		        	
		        	if(k=="M+"){
		        		month = result ;
		        	}
		        	
		        	if(k=="d+"){
		        		day = result ;
		        	}
		        	
		        	if(k=="h+" || k=="H+"){
		        		hour = result ;	
		        	}
		        	
		        	if(k=="m+"){
		        		minute = result ;	
		        	}
		        	
		        	if(k=="s+"){
		        		second = result ;	
		        	}
		        	
		        }           
		    }   
		    
		    if(month.length==0){
		    	month = "01" ;
		    }else if(month.length==1){
		    	month = "0" + month ;
		    }
		    
		    if(day.length==0){
		    	day = "01" ;
		    }else if(day.length==1){
		    	day = "0" + day ;
		    }
		    
		    if(hour.length==0){
		    	hour = "00" ;
		    }else if(hour.length==1){
		    	hour = "0" + hour ;
		    }
		    
		    if(minute.length==0){
		    	minute = "00" ;
		    }else if(minute.length==1){
		    	minute = "0" + minute ;
		    }
		    
		    if(second.length==0){
		    	second = "00" ;
		    }else if(second.length==1){
		    	second = "0" + second ;
		    }
		    return new Date(year+"/"+month+"/"+day+" "+hour+":"+minute+":"+second) ;
 
		},
		
		strFmt:function(str, fmtFrom, fmtTo){
			
			if($.util.isBlank(fmtTo)){
				fmtTo = "yyyy-MM-dd HH:mm:ss" ;
			}
			
			if($.util.isBlank(str)){
				return "" ;
			}
			var date = $.date.strToDate(str, fmtFrom) ;			
			return $.date.dateToStr(date, fmtTo) ;
		},
		
		endRange:function(str, fmt){
			if($.util.isBlank(fmt)){
				fmt = "yyyy-MM-dd HH:mm:ss" ;
			}
			if($.util.isBlank(str)){
				return "" ;
			}
			
			var range = getfmtType(fmt) ;
			var date = $.date.strToDate(str, fmt) ;
		    
			if(range==="s"){
				
		    }else if(range==="m"){
		    	date.setMinutes(date.getMinutes()+1) ;
		    }else if(range==="H"){
		    	date.setHours(date.getHours() + 1) ; 
		    }else if(range==="d"){
		    	date.setDate(date.getDate() + 1) ; 
		    }else if(range==="M"){
		    	date.setMonth(date.getMonth() + 1) ; 
		    }else if(range==="y"){
		    	date.setFullYear(date.getFullYear() + 1) ; 
		    }
			
			return $.date.dateToStr(date, "yyyy-MM-dd HH:mm:ss") ;
		},
		
		endRangeByTime:function(time, fmt){
			if($.util.isBlank(fmt)){
				fmt = "yyyy-MM-dd HH:mm:ss" ;
			}
			if($.util.isBlank(time)){
				return null ;
			}
			
			var range = getfmtType(fmt) ;
			var date = new Date(time) ;
		    
			if(range==="s"){
				
		    }else if(range==="m"){
		    	date.setMinutes(date.getMinutes()+1) ;
		    }else if(range==="H"){
		    	date.setHours(date.getHours() + 1) ; 
		    }else if(range==="d"){
		    	date.setDate(date.getDate() + 1) ; 
		    }else if(range==="M"){
		    	date.setMonth(date.getMonth() + 1) ; 
		    }else if(range==="y"){
		    	date.setFullYear(date.getFullYear() + 1) ; 
		    }
			
			return date.getTime() ;
		},
		
		compareStr:function(str1, str2, fmt){
			var d1 = $.date.strToDate(str1, fmt) ;
			var d2 = $.date.strToDate(str2, fmt) ;

			var t1 = d1.getTime() ;
			var t2 = d2.getTime() ;
			if(t1>t2){
				return 2 ;
			}else if(t1==t2){
				return 1 ;
			}else{
				return -1 ;
			}
		},
		compareDate:function(date1, date2, fmt){
			var t1 = date1.getTime() ;
			var t2 = date2.getTime() ;
			if(t1>t2){
				return 2 ;
			}else if(t1==t2){
				return 1 ;
			}else{
				return -1 ;
			}
		}
		
	});	

	
	function getfmtType(fmt){
		var o = {    
				"Y+" : "Y+", //年份
				"y+" : "y+", //年份
			    "M+" : "M+", //月份           
			    "d+" : "d+", //日           
			    "h+" : "h+", //小时           
			    "H+" : "H+", //小时           
			    "m+" : "m+", //分           
			    "s+" : "s+", //秒           
			    "q+" : "q+", //季度           
			    "S" : "S" //毫秒           
		}; 
		
		var year = false ;
		var month = false ;
		var day = false ;
		var hour = false ;
		var minute = false ;
		var second = false ;
		
	    for(var k in o){     
	    	var reg = new RegExp("("+ k +")") ;
	        if(reg.test(fmt)){    
	        
	        	if(k=="y+" || k=="Y+"){
			    	year = true ;
	        	}
	        	
	        	if(k=="M+"){
	        		month = true ;
	        	}
	        	
	        	if(k=="d+"){
	        		day = true ;
	        	}
	        	
	        	if(k=="h+" || k=="H+"){
	        		hour = true ;	
	        	}
	        	
	        	if(k=="m+"){
	        		minute = true ;	
	        	}
	        	
	        	if(k=="s+"){
	        		second = true ;	
	        	}
	        	
	        }           
	    }
	    
	    if(second){
	    	return "s" ;
	    }else if(minute){
	    	return "m" ;
	    }else if(hour){
	    	return "H" ;
	    }else if(day){
	    	return "d" ;
	    }else if(month){
	    	return "M" ;
	    }else if(year){
	    	return "y" ;
	    }
	}
	
	
})(jQuery);	

$.slider = $.slider || {};
(function($){
	"use strict";
	
	jQuery.extend($.slider, { 
		 clickTab:function(id, clickId){
			var myContainer = $("#"+id) ;

			var toNum = parseInt(clickId.split("_")[1]) ;
			var fromNum = parseInt(myContainer.find(".tabCurr").attr("id").split("_")[1]) ;
			
			if(toNum!=fromNum){
				
				var width = parseInt(myContainer.width()) ;
				
				var benshenTabs = myContainer.find("#tabs") ;
				var copyTabs = benshenTabs.clone() ;
				copyTabs.attr("id", "cloneTabs") ;
				copyTabs.html("") ;
				var benshenTabsArr = [] ;
				var copyTabsArr = [] ;
				
				$(benshenTabs.children()).each(function(i, val){
					benshenTabsArr.push(val) ;
					
					var cl = $(val).clone() ;
					cl.css("display", "block") ;
					copyTabsArr.push(cl) ;
				});
				
				var copyTabCurr = copyTabsArr[fromNum-1] ;
				var copyTabTo = copyTabsArr[toNum-1] ;
				
				var moveWidth = 0 ;
				if(fromNum<toNum){
					if(fromNum==1 && toNum==benshenTabsArr.length){
						copyTabs.append(copyTabTo) ;
						copyTabs.append(copyTabCurr) ;
						copyTabs.css("left", -width);
						moveWidth = 0 ;
					}else{
						copyTabs.append(copyTabCurr) ;
						copyTabs.append(copyTabTo) ;
						moveWidth = -width ;
					}
				}else{
					if(fromNum==benshenTabsArr.length && toNum==1){
						copyTabs.append(copyTabCurr) ;
						copyTabs.append(copyTabTo) ;
						moveWidth = -width ;
					}else{
						copyTabs.append(copyTabTo) ;
						copyTabs.append(copyTabCurr) ;
						copyTabs.css("left", -width);
						moveWidth = 0 ;
					}
				}

				benshenTabs.css("display", "none") ;
				myContainer.append(copyTabs) ;
				copyTabs.animate({left:moveWidth},800,function(){});
				$(".tabClick").attr("disabled","disabled");
				setTimeout(function(){
					copyTabs.remove() ;
					$(benshenTabsArr).each(function(i, val){
						var id = $(val).attr("id");
						if(id==("tab_"+toNum)){
							$(val).css("display", "block") ;
							$(val).addClass("tabCurr") ;
						}else{
							$(val).css("display", "none") ;
							$(val).removeClass("tabCurr") ;
						}
					});
					benshenTabs.css("display", "block") ;
					$(".tabClick").removeAttr("disabled");
				}, 800) ;
			}
		}

		
	});
	
	
})(jQuery);	
//定义date类
$.validform = $.validform || {};
(function($){
	"use strict";
	
	var vfObj = {} ;
	var tips = {} ;
	
	jQuery.extend($.validform, { 
		
		getTipsByFormId:function(formId){
			return tips[formId] ;
		},
		createTipsByFormId:function(formId){
			if(!$.util.exist(tips[formId])){
				tips[formId] = [] ;
			}
			return tips[formId] ;
		},
		setTipsIndex:function(formId, index){
			tips[formId][index] = index ;
		},
		deleteTipsIndex:function(formId, index){
			if($.util.exist(tips[formId][index])){
				delete tips[formId][index] ;
			}
		},
		setValidFormObj:function(formId, formObj){
			vfObj[formId] = formObj ;
		},
		initValidform:function(selector){
			$(selector).each(function(i, val){
				var id = $(val).attr("id") ;
				if(!$.util.exist($.validform.getValidFormObjById(id))){
					var tipsIds = $.validform.getTipsByFormId(id) ;
					if(!$.util.exist(tipsIds)){
						tipsIds = $.validform.createTipsByFormId(id) ;
					}
					//var btnSubmit = $($(val).find(".validform-sub")) ;
					//var btnReset = $($(val).find(".validform-reset")) ;
					var vfCell = $(val).Validform({
						isAllowedSubmit:false,
						//btnSubmit:btnSubmit, 
						//btnReset:btnReset,
						tiptype:function(msg,o,cssctl){			
							var demoId = $(o.curform).attr("id") ;
							var demo = $.validform.getValidFormObjById(demoId) ;
							var obj = $(o.obj) ;
							var tipIndex = $(obj).data("tipIndex") ;
							var oldMsg = "" ;
							if(!$.util.isBlank(tipIndex)){
								oldMsg = $(obj).data("oldMsg") ; 
								if(((!$.util.isBlank(oldMsg))&&oldMsg!=msg)){
									layer.close(tipIndex) ;
								}else if(o.type==2){
									layer.close(tipIndex) ;
								}
									
							}
							
							if(o.type==3 || o.type==1){
								var vfposition = obj.attr("vf-position") ;
								if(!$.util.isBlank(vfposition)){
									vfposition = $.util.parseInt(vfposition) ;
								}else{
									vfposition = 2 ;
								}
														
								if($.util.isBlank(oldMsg) || ((!$.util.isBlank(oldMsg))&&oldMsg!=msg)){
									var selector = obj ;
									var msgElId = $(obj).attr("msgElId") ;
									if(!$.util.isBlank(msgElId)){
										selector = $(obj).parents(".validform").find("#" + msgElId)[0] ;
									}
//									var setNotVali = $(obj).attr("setNotVali") ;
//									if((!$.util.isBlank(setNotVali)) && setNotVali.toString()==="true"){									
//										$(obj).removeAttr("setNotVali") ;
//										demo.resetForm() ;
//									}else{	
//									}
									$.layerAlert.tips({
										msg:msg,
										selector:selector,
										position:vfposition,
										tipsMore:true,
										color:"#F66646",
										success:function(layero, index){
											$(obj).data("tipIndex", index) ;
											$(obj).data("oldMsg", msg) ;
											$.validform.setTipsIndex(id, index) ;
										},
										end:function(index, layero){	
											demo.resetForm() ;
											var delIndex = $(obj).data("tipIndex") ;
											$(obj).data("tipIndex", null) ;
											$(obj).data("oldMsg", null) ;
											$.validform.deleteTipsIndex(id, delIndex) ;
											
										}
									}) ;
									
									//$(obj).removeAttr("setNotVali") ;
								}


							}
							demo.resetForm() ;
							//$(obj).removeAttr("setNotVali") ;
						    //msg：提示信息;
						    //o:{obj:*,type:*,curform:*},
						    //obj指向的是当前验证的表单元素（或表单对象，验证全部验证通过，提交表单时o.obj为该表单对象），
						    //type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态, 
						    //curform为当前form对象;
						    //cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）;
						},
						showAllError:true,
						datatype:{
							"identity"	:    /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
							"zh1-6":			/^[\u4E00-\u9FA5\uf900-\ufa2d]{1,6}$/,
							"letter1-6":			/^[A-Za-z]{1,6}$/,
							"enName":			/^([a-zA-Z]+\s?)+$/,
							"null":				/^.{0}$/,
							"str0-6":			/^.{0,6}$/,
							"decimalOrNum":	    /^\d+(\.\d+)?$/,
							"includeNum":		/[\d]/g,
							"includeLetter":	/[A-Za-z]/g,
							"includeCapital":	/[A-Z]/g,
							"includeSmall":		/[a-z]/g,
							"includeUnderline":	/[_]/g,
							"includeLine":		/[-]/g,
							"includeZh":		/[\u4E00-\u9FA5\uf900-\ufa2d]/g,
							"includeSpec":		/^[\u4E00-\u9FA5\uf900-\ufa2dA-Za-z\d]/,
							"doubleByte"	:	/^[^\x00-\xff]/,
							"halfByte" :		/^[\x00-\xff]*$/,
							"notSpace" : 		/^[^\s]*$/ ,
							"phoneWith86" : 	/^((\+86)|(86))?\d{11}$/ ,
							"tel"   : 			/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
							"code0-6" : 			/^[a-z_A-Z-0-9\@]{0,6}$/,    //包括字母 数字 下划线 横线 @符号
							"info0-6" :		   /^[a-z_A-Z-0-9\u4E00-\u9FA5\uf900-\ufa2d\(\)\（\）]{0,6}$/,  //包含中文，字母，数字，全或半角括号，横线 下划线
						},
						ajaxPost:true
					});		
					
					vfCell.tipmsg.w["info0-6"] = "只能包含0到20位中文，字母，数字，全或半角括号，横线 下划线！" ;
					vfCell.tipmsg.w["identity"] = "身份证号不合法！" ;
					vfCell.tipmsg.w["enName0-6"] = "请输入0到6位英文名！" ;
					vfCell.tipmsg.w["*"] = "不能为空！" ;
					vfCell.tipmsg.w["*6-16"] = "请填写6到16位任意字符！" ;
					vfCell.tipmsg.w["n"] = "请填写数字！" ;
					vfCell.tipmsg.w["n6-16"] = "请填写6到16位数字！" ;
					vfCell.tipmsg.w["s"] = "不能输入特殊字符！" ;
					vfCell.tipmsg.w["s6-18"] = "请填写6到18位字符！" ;
					vfCell.tipmsg.w["p"] = "请填写邮政编码！" ;
					vfCell.tipmsg.w["m"] = "请填写手机号码！" ;
					vfCell.tipmsg.w["e"] = "邮箱地址格式不对！" ;
					vfCell.tipmsg.w["url"] = "请填写网址！" ;
					vfCell.tipmsg.w["zh1-6"] = "请填写6到16位任意中文！" ;
					vfCell.tipmsg.w["letter1-6"] = "请填写0到6位字母！" ;
					vfCell.tipmsg.w["str0-6"] = "长度在0到6之间！" ;
					vfCell.tipmsg.w["decimalOrNum"] = "数字或小数！" ;
					vfCell.tipmsg.w["includeNum"] = "未包含数字！" ;
					vfCell.tipmsg.w["includeLetter"] = "未包含字母！" ;
					vfCell.tipmsg.w["includeCapital"] = "未包含大写字母！" ;
					vfCell.tipmsg.w["includeSmall"] = "未包含小写字母！" ;
					vfCell.tipmsg.w["includeUnderline"] = "未包含下划线！" ;
					vfCell.tipmsg.w["includeLine"] = "未包含横线！" ;
					vfCell.tipmsg.w["includeZh"] = "未包含中文！" ;
					vfCell.tipmsg.w["notSpace"] = "不能包含空白字符！" ;
					vfCell.tipmsg.w["halfByte"] = "请输入半角字符！" ;
					vfCell.tipmsg.w["doubleByte"] = "请输入全角字符！" ;
					vfCell.tipmsg.w["includeSpec"] = "请输入中文或字母！" ;
					vfCell.tipmsg.w["phoneWith86"] = "请输入手机号！" ;
					vfCell.tipmsg.w["tel"] = "请输入座机号！" ;
					vfCell.tipmsg.w["code0-6"] = "只能包括0到6位数字、字幕、下划线、@符或横线！" ;
					$.validform.setValidFormObj(id ,vfCell) ;
					
					$($(val).find(".valiform-keyup")).on('keyup change', function (e, param) {	
						if($.util.exist(param)&&param.setNotVali===true){
							
						}else{
							var vfId = $(this).parents(".validform").attr("id") ;
							var demo = $.validform.getValidFormObjById(vfId) ;
							$.validform.checkEl(demo, this) ;
						}

					});
				}
				
			});
		},
		check:function(formObj, flag){
			//formObj.resetForm() ;
			var flag = formObj.check(false) ;
			//formObj.resetForm() ;
			return flag ;
		},
		checkEl:function(formObj, selector, flag){
			if(!$.util.exist(flag)){
				flag = false ;
			}
			var rtFlag = true ;
			rtFlag = formObj.check(flag, selector) ;
			return rtFlag ;
		},
		getValidFormObjById:function(formId){
			return vfObj[formId] ;
		},
		getAllValidFormObj:function(){
			return vfObj ;
		},
		deleteValidFormObjById:function(formId){
			delete vfObj[formId] ;
		},
		getValidFormTipsIndexs:function(){
			return tips ;
		},
		closeAllTips:function(validformId){
			var arr = tips[validformId] ;
			$.each(arr, function(i, val){
				layer.close($.util.parseInt(val)) ;
			});
//			var demo = $.validform.getValidFormObjById(validformId) ;
//			demo.resetForm() ;
		},
		getValiFormInstruction:function(){
			$.layerAlert.dialog({
				content:context+"/template/validformInfo.jsp",
				width:"40%",
				height:"70%",
				shade:false
			}) ;
		},
		getValiFormWeb:function(){
			$.layerAlert.dialog({
				content:"http://validform.rjboy.cn/document.html",
				width:"40%",
				height:"70%",
				shade:false
			}) ;
		},
		setFormVals:function(formSelector, obj){
			var form = $(formSelector) ;
			for(var key in obj){
				var val = obj[key] ;
				var input = $(form.find('[name='+key+']')) ;
				var id = input.attr("id") ;
				if(input.length>0){
					if(!$.util.isBlank(obj[key])){
						var tagName = input[0].tagName.toLowerCase() ;
						var name = $(input).attr("name") ;
						var type = $(input).attr("type") ;
						if(tagName=="select"){
							var next = $(input).next() ;
							if($.util.exist(next[0])&&$(next[0]).hasClass("select2")){
								$.select2.val("#"+id, obj[key], true) ;		
							}else{
								input.val(obj[key]) ;
							}
						}else if(type=="radio" || type=="checkbox"){
							$.each(input, function(j, val1){
								var next = $(val1).next() ;
								var val1va = $(val1).val() ;
								if($.util.exist(next[0])&&next[0].tagName.toLowerCase()=="ins"){
									if(obj[key]==val1va){
										$.icheck.check(val1, true, true) ;
									}else{
										$.icheck.check(val1, false, true) ;
									}
								}
							});
						}else if($(input).hasClass("laydate-start")||$(input).hasClass("laydate-end")||$(input).hasClass("laydate-value")){
							if($(input).hasClass("laydate-value")){
								var pdv = $(input).parents(".laydate") ;
								var pid = $(pdv).attr("id") ;
								var fmt = $.laydate.getFmt("#"+pid) ;
								var str = $.date.strFmt(obj[key], "yyyy-MM-dd HH:mm:ss", fmt) ;
								$.laydate.setDate(str, "#"+pid) ;
						
							}else if($(input).hasClass("laydate-start")){
								var pdv = $(input).parents(".dateRange") ;
								var pid = $(pdv).attr("id") ;
								var fmt = $.laydate.getFmt("#"+pid) ;
								var str = $.date.strFmt(obj[key], "yyyy-MM-dd HH:mm:ss", fmt) ;
								$.laydate.setRange(str, null, "#"+pid, null, "start") ;
							}else if($(input).hasClass("laydate-end")){
								var pdv = $(input).parents(".dateRange") ;
								var pid = $(pdv).attr("id") ;
								var fmt = $.laydate.getFmt("#"+pid) ;
								var str = $.date.strFmt(obj[key], "yyyy-MM-dd HH:mm:ss", fmt) ;
								$.laydate.setRange(str, null, "#"+pid, null, "end") ;
							}
						}else{
							input.val(obj[key]) ;
						}
					}
				}
			}
		},
		setFormTexts:function(formSelector, obj){
			var form = $(formSelector) ;
			for(var key in obj){
				var val = obj[key] ;
				var input = $(form.find('[name='+key+']')) ;
				var id = input.attr("id") ;
				if(input.length>0){
					if(!$.util.isBlank(obj[key])){
						var tagName = input[0].tagName.toLowerCase() ;
						var name = $(input).attr("name") ;
						var type = $(input).attr("type") ;
						input.text(obj[key]) ;
					}
				}
			}
		},
		getFormVals:function(formSelector){
			var obj = {} ;
			$(formSelector).find(".form-val").each(function(i, val){
				var tagName = $(val)[0].tagName.toLowerCase() ;
				var name = $(val).attr("name") ;
				var type = $(val).attr("type") ;
				if(tagName=="select"){
					var id = $(val).attr("id") ;
					var next = $(val).next() ;
					var elValue = "" ;
					if($.util.exist(next[0])&&$(next[0]).hasClass("select2")){
						elValue = $.select2.val("#"+id) ;	
					}else{
						elValue = $(val).val().trim() ;
					}
					obj[name] = elValue ;
				}else if(type=="radio" || type=="checkbox"){
					var elValue = "" ;
					var next = $(val).next() ;
					if($.util.exist(next[0])&&next[0].tagName.toLowerCase()=="ins"){
						elValue = $.icheck.val(name) ;
					}else{
						elValue = $(val).val().trim() ;
					}
					obj[name] = elValue ;
				}else if($(val).hasClass("laydate-start")||$(val).hasClass("laydate-end")||$(val).hasClass("laydate-value")){
					var dtval = "" ;
					if($(val).hasClass("laydate-value")){
						var pdv = $(val).parents(".laydate") ;
						var pid = $(pdv).attr("id") ;
						dtval = $.laydate.getDate("#"+pid, "date") ;
						var fmt = $.laydate.getFmt("#"+pid) ;
						dtval = $.date.strFmt(dtval, fmt, "yyyy-MM-dd HH:mm:ss") ;
					}else if($(val).hasClass("laydate-start")){
						var pdv = $(val).parents(".dateRange") ;
						var pid = $(pdv).attr("id") ;
						var dtval = $.laydate.getDate("#"+pid, "start") ;
						var fmt = $.laydate.getFmt("#"+pid) ;
						dtval = $.date.strFmt(dtval, fmt, "yyyy-MM-dd HH:mm:ss") ;
					}else if($(val).hasClass("laydate-end")){
						var pdv = $(val).parents(".dateRange") ;
						var pid = $(pdv).attr("id") ;
						var dtval = $.laydate.getDate("#"+pid, "end") ;
						var fmt = $.laydate.getFmt("#"+pid) ;
						dtval = $.date.strFmt(dtval, fmt, "yyyy-MM-dd HH:mm:ss") ;
					}else{
						elValue = $(val).val().trim() ;
					}
					obj[name] = dtval ;
				}else{
					obj[name] = $(val).val().trim() ;
				}
			});
			return obj ;
		},
		getValiFormWebAndIntro:function(){
			layer.closeAll();
			$.layerAlert.dialog({
				content:context+"/template/validformInfo.jsp",
				width:"40%",
				height:"70%",
				offset: ["10%","1%"],
				shade:false,
				success:function(layero, index){
					var title = layero.find(".layui-layer-title") ;
					$(title[0]).on('mousedown', function () {
						layer.setTop(layero) ;
					}) ;
				},
				moveEnd:function(index, layero){
					layer.setTop(layero) ;
				}
			}) ;
			
			$.layerAlert.dialog({
				content:"http://validform.rjboy.cn/document.html",
				width:"40%",
				height:"70%",
				offset: ["10%","50%"],
				shade:false,
				success:function(layero, index){
					var title = layero.find(".layui-layer-title") ;
					$(title[0]).on('mousedown', function () {
						layer.setTop(layero) ;
					}) ;
				},
				moveEnd:function(index, layero){
					layer.setTop(layero) ;
				}
			}) ;
		}
	});

})(jQuery);	

$.tooltips = $.tooltips || {};
(function($){
	"use strict";
	
	var selectableTips = {} ;
	var selectableTipsTimeOutObj = {} ;
	
	jQuery.extend($.tooltips, { 
		
		setSelectableTipsById:function(id, tipObj){
			selectableTips[id] = tipObj ;
		},
		getSelectableTipsById:function(id){
			return selectableTips[id];
		},
		deleteSelectableTipsById:function(id){
			delete selectableTips[id] ;
		},
		destroySelectableTipsById:function(id){
			$("#"+id).tooltip() ;
			$("#"+id).tooltip("destroy") ;
			delete selectableTips[id] ;
		},
		initTooltips:function(selector){
			
		    $( selector ).tooltip({
		    	track: true,
			    content: function() {			    
			    	
			    	var id = $(this).attr("id") ;
			    	if(!$.util.isBlank(id)&&id.indexOf("ztree")>-1){
			    		return false ;
			    	}
			    	
			    	var name = $(this)[0].tagName.toLowerCase() ;
			    	var select2 = $(this).parents(".select2") ;
			    	if(name==="option"){
			    		return false ;
			    	}
			    	if($(select2).hasClass("select2")){
			    		return false ;
			    	}
			    	
			    	var title = $(this).attr("title") ;
			    	if(!$.util.isBlank(title)){
			    		return title ;
			    	}else{
			    		return false ;
			    	}
			    },
		        position: {
			          my: "center bottom-20",
			          at: "center top",
		     		  using: function( position, feedback ) {
		
				        	var e = feedback.target ;
				        	var tar = e.target ;
				        	if(!$.util.exist(tar)){
				        		tar = feedback.target ;
				        	}
				        	
				        	var tooltipPos = "bottom" ;
				        	var tooltipPos1 = $(tar).attr("tooltipPos") ;
				        	if(!$.util.isBlank(tooltipPos1)){
				        		tooltipPos = tooltipPos1 ;
				        	}
				        	
				        	var tmy = "center bottom-20" ;
				        	var tat = "center top" ;
				        	var tooltipMy = $(tar).attr("my") ;
				        	var tooltipAt = $(tar).attr("at") ;
				        	var mouseTrack = $(tar).attr("mouseTrack") ;
				        	
				        	var mouseEvent = undefined ;
				        	if((!$.util.isBlank(e.type))&&(!$.util.isBlank(mouseTrack))&&mouseTrack==="true"){
				        		mouseEvent = e ;
				        	}
				        	if(!$.util.isBlank(tooltipMy)){
				        		tmy = tooltipMy ;
				        	}
				        	if(!$.util.isBlank(tooltipAt)){
				        		tat = tooltipAt ;
				        	}

				        	var test = $.util.jqUiPosition(tar, this, tmy, tat, mouseEvent) ;
				        	position = test ;
				        	
				            $( this ).css( position );
				            $( this ).css("word-break", "break-all") ;
				            		           
				            var apDivClass = "arrow-bottom" ;
				            if(!$.util.isBlank(tooltipPos)){
				            	apDivClass = "arrow-"+tooltipPos ;
				            }
				            var appendDiv =  $( '<div><div class="'+apDivClass+'"></div></div>') ;
				            appendDiv.addClass( "arrow" )
				              .addClass( feedback.vertical )
				              .addClass( feedback.horizontal ) ;

				            appendDiv.appendTo( this );


		     		  }
		        }
		    });
						
		},
		
		initSelectableToolTips:function(){
			$(document).on('click', '.tooltip-selectable-Click', function () {
				var id = $(this).attr("id") ;
				var tipObj = $.tooltips.getSelectableTipsById(id) ;
	
				if($.util.exist(tipObj)){
					$.tooltips.destroySelectableTipsById(id) ;
				}
            	if($.util.exist(selectableTipsTimeOutObj[id])){
            		clearTimeout(selectableTipsTimeOutObj[id]) ;
            	}
				tipObj = $( this ).tooltip({
			    	items:"[selectableTitle]",
			    	autoShow:false,
			    	track: true,
				    content: function() {			    
				    	var name = $(this)[0].tagName.toLowerCase() ;
				    	var select2 = $(this).parents(".select2") ;
				    	if(name==="option"){
				    		return false ;
				    	}
				    	if($(select2).hasClass("select2")){
				    		return false ;
				    	}
				    	
				    	var title = $(this).attr("selectableTitle") ;
				    	if(!$.util.isBlank(title)){
				    		return title ;
				    	}else{
				    		return false ;
				    	}
				    },
			        position: {
				          my: "center bottom-20",
				          at: "center top",
			     		  using: function( position, feedback ) {
			
					        	var e = feedback.target ;
					        	var tar = e.target ;
					        	if(!$.util.exist(tar)){
					        		tar = feedback.target ;
					        	}
					        	
					        	var tooltipPos = "bottom" ;
					        	var tooltipPos1 = $(tar).attr("tooltipPos") ;
					        	if(!$.util.isBlank(tooltipPos1)){
					        		tooltipPos = tooltipPos1 ;
					        	}
					        	
					        	var tmy = "center bottom-20" ;
					        	var tat = "center top" ;
					        	var tooltipMy = $(tar).attr("my") ;
					        	var tooltipAt = $(tar).attr("at") ;
					        	var mouseTrack = $(tar).attr("mouseTrack") ;
					        	
					        	var mouseEvent = undefined ;
					        	if((!$.util.isBlank(e.type))&&(!$.util.isBlank(mouseTrack))&&mouseTrack==="true"){
					        		mouseEvent = e ;
					        	}
					        	if(!$.util.isBlank(tooltipMy)){
					        		tmy = tooltipMy ;
					        	}
					        	if(!$.util.isBlank(tooltipAt)){
					        		tat = tooltipAt ;
					        	}

					        	var test = $.util.jqUiPosition(tar, this, tmy, tat, mouseEvent) ;
					        	position = test ;
					        	
					            $( this ).css( position );
					            $( this ).css("word-break", "break-all") ;
					            		           
					            var apDivClass = "arrow-bottom" ;
					            if(!$.util.isBlank(tooltipPos)){
					            	apDivClass = "arrow-"+tooltipPos ;
					            }
					            var appendDiv =  $( '<div><div class="'+apDivClass+'"></div></div>') ;
					            appendDiv.addClass( "arrow" )
					              .addClass( feedback.vertical )
					              .addClass( feedback.horizontal ) ;

					            appendDiv.appendTo( this );
					            
					            var closeTime = $(tar).attr("closeTime") ;
					            var tarId = $(tar).attr("id") ;
					            if(!$.util.isBlank(closeTime)){
					            	closeTime = $.util.parseInt(closeTime) ;
					            }else{
					            	closeTime = 2000 ;
					            }
					            
					            $($(this).find(".ui-tooltip-content")).on("mouseenter", function(e){
					            	var thisCloseTimeOut = selectableTipsTimeOutObj[tarId] ;
					            	if($.util.exist(thisCloseTimeOut)){
					            		clearTimeout(thisCloseTimeOut) ;
					            	}
					            	
					            });
					       
					            $($(this).find(".ui-tooltip-content")).on("mouseleave", function(e){
					            	var myThat = tar ;
					            	if($.util.exist(selectableTipsTimeOutObj[tarId])){
					            		clearTimeout(selectableTipsTimeOutObj[tarId]) ;
					            	}
					            	var closeTimeOut = setTimeout(function(){
							            var thisTipObj = $.tooltips.getSelectableTipsById(tarId) ;
					        			if($.util.exist(thisTipObj)){
					        				$.tooltips.destroySelectableTipsById(tarId) ;
					        			}
					        			
					        		}, closeTime) ;
					            	selectableTipsTimeOutObj[tarId] = closeTimeOut ;
					            });
					            
				            	if($.util.exist(selectableTipsTimeOutObj[tarId])){
				            		clearTimeout(selectableTipsTimeOutObj[tarId]) ;
				            	}

			     		  }
			        }
			    });
			    $.tooltips.setSelectableTipsById(id, tipObj) ;
			    $(this).tooltip( "open", undefined, true) ;
			});
			
			$(document).on('mouseleave', '.tooltip-selectable-Click', function () {
	            var closeTime = $(this).attr("closeTime") ;
	            var tarId = $(this).attr("id") ;
	            if(!$.util.isBlank(closeTime)){
	            	closeTime = $.util.parseInt(closeTime) ;
	            }else{
	            	closeTime = 2000 ;
	            }
	      
            	if($.util.exist(selectableTipsTimeOutObj[tarId])){
            		clearTimeout(selectableTipsTimeOutObj[tarId]) ;
            	}
        		var closeTimeOut = setTimeout(function(){
		            var thisTipObj = $.tooltips.getSelectableTipsById(tarId) ;
        			if($.util.exist(thisTipObj)){
        				$.tooltips.destroySelectableTipsById(tarId) ;
        			}
        			
        		}, closeTime) ;
        		selectableTipsTimeOutObj[tarId] = closeTimeOut ;
				
			});
			
			$(document).on('mouseleave', '.tooltip-selectable-mouseover', function () {
	            var closeTime = $(this).attr("closeTime") ;
	            var tarId = $(this).attr("id") ;
	            if(!$.util.isBlank(closeTime)){
	            	closeTime = $.util.parseInt(closeTime) ;
	            }else{
	            	closeTime = 2000 ;
	            }
	      
            	if($.util.exist(selectableTipsTimeOutObj[tarId])){
            		clearTimeout(selectableTipsTimeOutObj[tarId]) ;
            	}
        		var closeTimeOut = setTimeout(function(){
		            var thisTipObj = $.tooltips.getSelectableTipsById(tarId) ;
        			if($.util.exist(thisTipObj)){
        				$.tooltips.destroySelectableTipsById(tarId) ;
        			}
        			
        		}, closeTime) ;
        		selectableTipsTimeOutObj[tarId] = closeTimeOut ;
				
			});

			
			$(document).on('mouseenter', '.tooltip-selectable-mouseover', function () {
				var id = $(this).attr("id") ;
				var tipObj = $.tooltips.getSelectableTipsById(id) ;
	
				if($.util.exist(tipObj)){
					$.tooltips.destroySelectableTipsById(id) ;
				}
            	if($.util.exist(selectableTipsTimeOutObj[id])){
            		clearTimeout(selectableTipsTimeOutObj[id]) ;
            	}
				tipObj = $( this ).tooltip({
			    	items:"[selectableTitle]",
			    	autoShow:false,
			    	track: true,
				    content: function() {			    
				    	var name = $(this)[0].tagName.toLowerCase() ;
				    	var select2 = $(this).parents(".select2") ;
				    	if(name==="option"){
				    		return false ;
				    	}
				    	if($(select2).hasClass("select2")){
				    		return false ;
				    	}
				    	
				    	var title = $(this).attr("selectableTitle") ;
				    	if(!$.util.isBlank(title)){
				    		return title ;
				    	}else{
				    		return false ;
				    	}
				    },
			        position: {
				          my: "center bottom-20",
				          at: "center top",
			     		  using: function( position, feedback ) {
			
					        	var e = feedback.target ;
					        	var tar = e.target ;
					        	if(!$.util.exist(tar)){
					        		tar = feedback.target ;
					        	}
					        	
					        	var tooltipPos = "bottom" ;
					        	var tooltipPos1 = $(tar).attr("tooltipPos") ;
					        	if(!$.util.isBlank(tooltipPos1)){
					        		tooltipPos = tooltipPos1 ;
					        	}
					        	
					        	var tmy = "center bottom-20" ;
					        	var tat = "center top" ;
					        	var tooltipMy = $(tar).attr("my") ;
					        	var tooltipAt = $(tar).attr("at") ;
					        	var mouseTrack = $(tar).attr("mouseTrack") ;
					        	
					        	var mouseEvent = undefined ;
					        	if((!$.util.isBlank(e.type))&&(!$.util.isBlank(mouseTrack))&&mouseTrack==="true"){
					        		mouseEvent = e ;
					        	}
					        	if(!$.util.isBlank(tooltipMy)){
					        		tmy = tooltipMy ;
					        	}
					        	if(!$.util.isBlank(tooltipAt)){
					        		tat = tooltipAt ;
					        	}

					        	var test = $.util.jqUiPosition(tar, this, tmy, tat, mouseEvent) ;
					        	position = test ;
					        	
					            $( this ).css( position );
					            $( this ).css("word-break", "break-all") ;
					            		           
					            var apDivClass = "arrow-bottom" ;
					            if(!$.util.isBlank(tooltipPos)){
					            	apDivClass = "arrow-"+tooltipPos ;
					            }
					            var appendDiv =  $( '<div><div class="'+apDivClass+'"></div></div>') ;
					            appendDiv.addClass( "arrow" )
					              .addClass( feedback.vertical )
					              .addClass( feedback.horizontal ) ;

					            appendDiv.appendTo( this );
					            
					            var closeTime = $(tar).attr("closeTime") ;
					            var tarId = $(tar).attr("id") ;
					            if(!$.util.isBlank(closeTime)){
					            	closeTime = $.util.parseInt(closeTime) ;
					            }else{
					            	closeTime = 2000 ;
					            }
					            
					            $($(this).find(".ui-tooltip-content")).on("mouseenter", function(e){
					            	var thisCloseTimeOut = selectableTipsTimeOutObj[tarId] ;
					            	if($.util.exist(thisCloseTimeOut)){
					            		clearTimeout(thisCloseTimeOut) ;
					            	}
					            	
					            });
					       
					            $($(this).find(".ui-tooltip-content")).on("mouseleave", function(e){
					            	var myThat = tar ;
					            	if($.util.exist(selectableTipsTimeOutObj[tarId])){
					            		clearTimeout(selectableTipsTimeOutObj[tarId]) ;
					            	}
					        		var closeTimeOut = setTimeout(function(){
							            var thisTipObj = $.tooltips.getSelectableTipsById(tarId) ;
					        			if($.util.exist(thisTipObj)){
					        				$.tooltips.destroySelectableTipsById(tarId) ;
					        			}
					        			
					        		}, closeTime) ;
					        		selectableTipsTimeOutObj[tarId] = closeTimeOut ;
					        		
					            });
					            
			     		  }
			        }
			    });
			    $.tooltips.setSelectableTipsById(id, tipObj) ;
			    $(this).tooltip( "open", undefined, true) ;
			});
		}
		
		
	}) ;


})(jQuery);	

$.ztree = $.ztree || {};
(function($){
	"use strict";
	var ztreeObj = {} ;
	jQuery.extend($.ztree, { 
		setZTreeObjById:function(id, ztObj){
			ztreeObj[id] = ztObj ;
		},
		getZTreeObjById:function(id){
			return ztreeObj[id] ;
		}
	}) ;
})(jQuery);	

$.jcade = $.jcade || {};
(function($){
	"use strict";
	
	jQuery.extend($.jcade, { 
		initWidget:function(){
			$(document).create( "input.icheckbox", function( e ) {
				var el = e.target ;
				var val = $(el) ;
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					var name = next[0].tagName.toLowerCase() ;
					if(name=="ins"){
						return false ;
					}
				}
				
				var st = {
						checkboxClass: 'icheckbox_square-green',
						radioClass: 'iradio_square-green',
						increaseArea: '20%' // optional					
				} ;
				
				var style = $(val).attr("icheckStyle") ;
				if(!$.util.isBlank(style)){
					st.checkboxClass = "icheckbox_" + style ;
					st.radioClass = "iradio_" + style ;
				}
				
				$(val).iCheck(st);
				
				var datatype = $(val).attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					var valName = $(val).attr("name") ;
					$("input[name="+valName+"]").on('ifChecked ifUnchecked', function (e, param) {	

						if($.util.exist(param)&&param.trigerNotVali===true){
							
						}else{
							var validForm = $(this).parents(".validform") ;
							var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
							$("input[name="+valName+"]").each(function(key, valel){
								var valeldty = $(valel).attr("datatype") ; 
								if(!$.util.isBlank(valeldty)){
									$.validform.checkEl(demo, valel) ;
								}
							});	
						}
						
					}) ;	
				}
			});
			
			$(document).create( "input.icheckradio", function( e ) {	
				var el = e.target ;
				var val = $(el) ;
				
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					var name = next[0].tagName.toLowerCase() ;
					if(name=="ins"){
						return false ;
					}
				}
				
				var st = {
						checkboxClass: 'icheckbox_square-green',
						radioClass: 'iradio_square-green',
						increaseArea: '20%' // optional					
				} ;
				
				var style = $(val).attr("icheckStyle") ;
				if(!$.util.isBlank(style)){
					st.checkboxClass = "icheckbox_" + style ;
					st.radioClass = "iradio_" + style ;
				}
				
				$(val).iCheck(st);
				
				var datatype = $(val).attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					var valName = $(val).attr("name") ;
					$("input[name="+valName+"]").on('ifChecked ifUnchecked', function (e, param) {
						if($.util.exist(param)&&param.trigerNotVali===true){
							
						}else{
							var validForm = $(this).parents(".validform") ;
							var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
							$("input[name="+valName+"]").each(function(key, valel){
								var valeldty = $(valel).attr("datatype") ; 
								if(!$.util.isBlank(valeldty)){
									$.validform.checkEl(demo, valel) ;
								}
							});
						}
						
					}) ;	
				}
				
			});
			
			$(document).create( ".select2", function( e ) {	
				var el = e.target ;
				var val = $(el) ;
				
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					if($(next[0]).hasClass("select2")){
						return false ;
					}
				}
				
				var dwt = val.attr("customWidth") ;
				if($.util.isBlank(dwt)){
					dwt = "100%" ;
				}

				var setting = {
						width:dwt,
						placeholder:"请选择"	
				} ;
				var id = $(val).attr("id") ;
				var myHolder = $("#" + id).attr("myPlaceHolder") ;
				if(!$.util.isBlank(myHolder)){
					setting.placeholder = myHolder ;
				}	
				if($("#" + id).hasClass("allowClear")){
					setting.allowClear = true
				}
				$("#" + id).select2(setting) ;
				if($("#" + id).hasClass("select-disable")){
					$.select2.able("#" + id, false) ;
				}
				
				$("#" + id).on("select2:select", function (e) {
					if(e.params.data.id=="select2-none"){
						$.select2.clear(this) ;
					}
				});
				
				var thisVal  = $("#" + id) ;
				
				var datatype = thisVal.attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					$(thisVal).on('select2:select select2:unselect', function (e) {		
						var validForm = $(this).parents(".validform") ;
						var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
						$.validform.checkEl(demo, this) ;

					}) ;	
				}
				
			});
			
			$(document).create( ".select2-tag", function( e ) {	
				var el = e.target ;
				var val = $(el) ;
				
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					if($(next[0]).hasClass("select2")){
						return true ;
					}
				}
				
				var id = $(val).attr("id") ;				
				
				var dwt = val.attr("customWidth") ;
				if($.util.isBlank(dwt)){
					dwt = "100%" ;
				}
				
				var setting = {
					width:dwt,
					placeholder:"请选择",
					tags:true			
				}
				
				var myHolder = $("#" + id).attr("myPlaceHolder") ;
				if(!$.util.isBlank(myHolder)){
					setting.placeholder = myHolder ;
				}
				
				if($("#" + id).hasClass("allowClear")){
					setting.allowClear = true
				}
				
				var maximumInputLength = $("#" + id).attr("maxWritten") ;
				if(!$.util.isBlank(maximumInputLength)){
					setting.maximumInputLength = $.util.parseInt(maximumInputLength) ;
				}else{
					setting.maximumInputLength = $.util.parseInt($.globalSettings.inputDefaultLength) ;
				}							
				
				$("#" + id).select2(setting) ;
				
				if($("#" + id).hasClass("select-disable")){
					$.select2.able("#" + id, false) ;
				}
				
				$("#" + id).on("select2:select", function (e) {
					if(e.params.data.id=="select2-none"){
						$.select2.clear(this) ;
					}
				});
				
				var thisVal  = $("#" + id) ;
				var datatype = thisVal.attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					$(thisVal).on('select2:select select2:unselect', function () {	
						var validForm = $(this).parents(".validform") ;
						var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
						$.validform.checkEl(demo, this) ;
						$(thisVal).removeAttr("setNotVali") ;
					}) ;	
				}
				
			});
			
			$(document).create( ".select2-noSearch", function( e ) {	
				var el = e.target ;
				var val = $(el) ;
				
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					if($(next[0]).hasClass("select2")){
						return true ;
					}
				}
				var id = $(val).attr("id") ;
				
				var dwt = val.attr("customWidth") ;
				if($.util.isBlank(dwt)){
					dwt = "100%" ;
				}
				
				var setting = {
					minimumResultsForSearch: Infinity,
					width:dwt,
					placeholder:"请选择"		
				}
				
				var myHolder = $("#" + id).attr("myPlaceHolder") ;
				if(!$.util.isBlank(myHolder)){
					setting.placeholder = myHolder ;
				}
				
				if($("#" + id).hasClass("allowClear")){
					setting.allowClear = true
				}
				
				
				$("#" + id).select2(setting) ;
				
				if($("#" + id).hasClass("select-disable")){
					$.select2.able("#" + id, false) ;
				}
				
				$("#" + id).on("select2:select", function (e) {
					if(e.params.data.id=="select2-none"){
						$.select2.clear(this) ;
					}
				});
				
				var thisVal  = $("#" + id) ;
				var datatype = thisVal.attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					$(thisVal).on('select2:select select2:unselect', function () {	
						var validForm = $(this).parents(".validform") ;
						var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
						$.validform.checkEl(demo, this) ;
						$(thisVal).removeAttr("setNotVali") ;
						

					}) ;	
				}
				
				
			});
			
			$(document).create( ".select2-multiple", function( e ) {					
				var el = e.target ;
				var val = $(el) ;	
				
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					if($(next[0]).hasClass("select2")){
						return true ;
					}
				}
				var id = $(val).attr("id") ;
				
				var dwt = val.attr("customWidth") ;
				if($.util.isBlank(dwt)){
					dwt = "100%" ;
				}
				
				var setting = {
					width:dwt,
					placeholder:"请选择"		
				}
				var maximumSelectionLength = $("#" + id).attr("maxSelected") ;
				if(!$.util.isBlank(maximumSelectionLength)){
					setting.maximumSelectionLength = $.util.parseInt(maximumSelectionLength) ;
				}
				$("#" + id).select2(setting) ;
				
				if($("#" + id).hasClass("select-disable")){
					$.select2.able("#" + id, false) ;
				}
				
				$("#" + id).on("select2:select", function (e) {
					if(e.params.data.id=="select2-none"){
						$.select2.clear(this) ;
					}
				});
				
				var thisVal  = $("#" + id) ;
				var datatype = thisVal.attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					$(thisVal).on('select2:select select2:unselect', function () {	
						var validForm = $(this).parents(".validform") ;
						var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
						$.validform.checkEl(demo, this) ;
						$(thisVal).removeAttr("setNotVali") ;					

					}) ;	
				}
				
			}) ;	
			
			$(document).create( ".select2-multiple-tag", function( e ) {	
				var el = e.target ;
				var val = $(el) ;	
				
				var next = $(val).next() ;
				if($.util.exist(next[0])){
					if($(next[0]).hasClass("select2")){
						return true ;
					}
				}
				var id = $(val).attr("id") ;
				
				var dwt = val.attr("customWidth") ;
				if($.util.isBlank(dwt)){
					dwt = "100%" ;
				}
				
				var setting = {
					width:dwt,
					placeholder:"请选择"	,
					tags:true
				}
				var maximumSelectionLength = $("#" + id).attr("maxSelected") ;
				if(!$.util.isBlank(maximumSelectionLength)){
					setting.maximumSelectionLength = $.util.parseInt(maximumSelectionLength) ;
				}
				var maximumInputLength = $("#" + id).attr("maxWritten") ;
				if(!$.util.isBlank(maximumInputLength)){
					setting.maximumInputLength = $.util.parseInt(maximumInputLength) ;
				}else{
					setting.maximumInputLength = $.util.parseInt($.globalSettings.inputDefaultLength) ;
				}
				$("#" + id).select2(setting) ;
				
				if($("#" + id).hasClass("select-disable")){
					$.select2.able("#" + id, false) ;
				}
				
				$("#" + id).on("select2:select", function (e) {
					if(e.params.data.id=="select2-none"){
						$.select2.clear(this) ;
					}
				});
				
				var thisVal  = $("#" + id) ;
				var datatype = thisVal.attr("datatype") ;
				if(!$.util.isBlank(datatype)){
					$(thisVal).on('select2:select select2:unselect', function () {	
						var validForm = $(this).parents(".validform") ;
						var demo = $.validform.getValidFormObjById($(validForm).attr("id")) ;
						$.validform.checkEl(demo, this) ;
						$(thisVal).removeAttr("setNotVali") ;					

					}) ;	
				}

			}) ;
			
			$(document).create( "input[type=text].default", function( e ) {
				var el = e.target ;
				var val = $(el) ;	
				
				var setting = $.globalSettings.inputDefaultLength ;
				var st = $(val).attr("maxlength") ;
				if(!(st!=null&&st!=undefined&&st.length>0)){
					$(val).attr("maxlength", setting) ;
				}	
				
			}) ;
			
			$(document).create( ".dateRange", function( e ) {
				var el = e.target ;
				var div = $(el) ;
				
				var divId = div.attr("id") ;
				
				var fmt = $.laydate.getFmt(div) ;
				fmt =  $.laydate.fmtToDateFmt(fmt) ;
				
				var start = div.find(".laydate-start") ;
				var end = div.find(".laydate-end") ;
				
				var startKey = "inputStart" + divId ;
				var endKey = "inputEnd" + divId ;
				
				if($.util.exist($.laydate.getDateObj(startKey))){
					return true ;
				}
				
				$.laydate.setDateObj(startKey, {
					elem:start[0],
					format: fmt, //日期格式
			        istime: true, //是否开启时间选择
			        isclear: true, //是否显示清空
			        istoday: true, //是否显示今天
			        issure: true, //是否显示确认
			        festival: true, //是否显示节日
			        fixed: true, //是否固定在可视区域
			        zIndex: 99999999, //css z-index
			        choose: function(dates){ //选择好日期的回调
			        	var endObj = $.laydate.getDateObj(endKey) ;
			        	endObj.min = dates ; 
			        	endObj.start = dates ; 
			        	$(start).trigger("change") ;
			        	
			        },
			        clear:function(){
			        	var endObj = $.laydate.getDateObj(endKey) ;
			        	endObj.min = null ; 
			        }
				}) ; 
				
				$.laydate.setDateObj(endKey, {
					elem:end[0],
					format: fmt, //日期格式
			        istime: true, //是否开启时间选择
			        isclear: true, //是否显示清空
			        istoday: true, //是否显示今天
			        issure: true, //是否显示确认
			        festival: true, //是否显示节日
			        fixed: true, //是否固定在可视区域
			        zIndex: 99999999, //css z-index
			        choose: function(dates){ //选择好日期的回调
			        	var endObj = $.laydate.getDateObj(startKey) ;
			        	endObj.max = dates ; 
			        	$(end).trigger("change") ;
			       
			        },
			        clear:function(){
			        	var endObj = $.laydate.getDateObj(startKey) ;
			        	endObj.max = null ; 
			        }
				}) ; 
				

				
				$(start).on('click', function () {		
					
					var div = $(this).parents(".dateRange") ;
					if(!$(div).hasClass("date-disabled")){
						var div = $(this).parents(".dateRange") ;
						var fmt = $.laydate.getFmt(div) ;
						fmt =  $.laydate.fmtToDateFmt(fmt) ;
						var dateObj = $.laydate.getDateObj(startKey) ;
						dateObj.format = fmt ;
	
						laydate(dateObj);
					}			

				});
				
				var startSpan = div.find(".laydate-start-span") ;
				
				$(startSpan).on('click', function () {		
					
					$(this).parents(".dateRange").find(".laydate-start").trigger("click") ;			

				});	
				
				
				$(end).on('click', function () {	
					var div = $(this).parents(".dateRange") ;
					if(!$(div).hasClass("date-disabled")){
						var div = $(this).parents(".dateRange") ;
						var fmt = $.laydate.getFmt(div) ;
						fmt =  $.laydate.fmtToDateFmt(fmt) ;
						var dateObj = $.laydate.getDateObj(endKey) ;
						dateObj.format = fmt ;
						
						laydate(dateObj);
					}

				});
				
				var endSpan = div.find(".laydate-end-span") ;
				$(endSpan).on('click', function () {	
					
					$(this).parents(".dateRange").find(".laydate-end").trigger("click") ;			

				});
				
			
			}) ;
			
			$(document).create( ".laydate", function( e ) {
				var el = e.target ;
				var div = $(el) ;	
				
				var divId = div.attr("id") ;
				
				var fmt = $.laydate.getFmt(div) ;
				fmt =  $.laydate.fmtToDateFmt(fmt) ;
				
				var ldv = div.find(".laydate-value") ;
				
				var ldvKey = "dateInput" + divId ;
				
				if($.util.exist($.laydate.getDateObj(ldvKey))){
					return true ;
				}
				
				$.laydate.setDateObj(ldvKey, {
					elem:ldv[0],
					format: fmt, //日期格式
			        istime: true, //是否开启时间选择
			        isclear: true, //是否显示清空
			        istoday: true, //是否显示今天
			        issure: true, //是否显示确认
			        festival: true, //是否显示节日
			        fixed: true, //是否固定在可视区域
			        zIndex: 99999999, //css z-index
			        choose: function(dates){ //选择好日期的回调
			        	$(ldv).trigger("change") ;
			        }				
					
					
				}) ;
				
				$(ldv).on('click', function () {	
					
					var div = $(this).parents(".laydate") ;
					if(!$(div).hasClass("date-disabled")){
						var div = $(this).parents(".laydate") ;
						var fmt = $.laydate.getFmt(div) ;
						fmt =  $.laydate.fmtToDateFmt(fmt) ;
						var dateObj = $.laydate.getDateObj(ldvKey) ;
						dateObj.format = fmt ;
						
						laydate(dateObj);
					}
					

				});
				
				var dateSpan = div.find(".laydate-value-span") ;
				
				$(dateSpan).on('click', function () {		
					
					$(this).parents(".laydate").find(".laydate-value").trigger("click") ;			

				});	
			
			}) ;
			
			$(document).create( ".uiTabs", function( e ) {
				var el = e.target ;
				var val = $(el) ;	
				
				if(!$(val).hasClass("ui-widget")){
					$(val).tabs() ;
					$(val).show() ;
				}
			
			}) ;
			
			$(document).create( ".validform", function( e ) {
				var el = e.target ;
				var val = $(el) ;					
				var id = $(val).attr("id") ;
				$.validform.initValidform("#" + id) ;
			}) ;
			
//			$( ".validform" ).destroy([], function( event ) { 
//				   
//			}, null, ".validform");
				
		}
	});
})(jQuery);	

