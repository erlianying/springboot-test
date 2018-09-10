
$.diyTable = $.diyTable || {};
(function($){
	"use strict";
	
	var tables = {} ;
	
	var settings = {
			settingType:"basic", //如果有多个setting模块通过这个参数判断copy哪个
			isTable:true,
			containerId:null,
			body:{
				selector:null
			},
			row:{
				type:"<tr />"
			},
			cell:{
				type:"<td />"
			},
			ajax:{
				type:"post",
				url:null,
				global:false,
		    	data:function(d, table){
		    		
		    		var dataTableReq = {
		    			start:d.start,
		    			length:d.length   				
		    		}
		    		
		    		var pagerReq = {
		    			dataTableReq:dataTableReq
		    		}
		    		var flag = table.settings.paramsReq(d, pagerReq) ;
//		    		if(flag===false){
//		    			d.datatableNotDraw = true ;
//		    			var odt = $(oSettings.nTable).DataTable();
//		    			odt.page( -1) ;
//		    		}
		    		
		    		$.util.objToStrutsFormData(pagerReq, "pagerReq", d) ;
		    		
		    	},
		    	dataSrc:function(json, table){
		    		 		
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
		    		
		    		table.settings.paramsResp(json) ;
		    		return json.data ;
		    	},
		    	myError:function(xhr, error, thrown){
		    		$.util.ajaxError(xhr, error, thrown) ;
		    	}
			},		
		    columnDefs:[
				//{ 
				//      "targets": 0,
				//      "width": "",
				//      "title": "报警时间",
				//      "data": "BJSJ" ,
				//      "render": function ( data, type, full, meta ) {		        	
				//    	      return data;
				//      }
				//}
			],
		    paramsReq:function(d){
			    
		    },
		    paramsResp:function(json){
		    	
		    },
			paging:true,
			hideHead:false,
			autoFooter:false,
			serverSide:true,
			length:10,
			page:{	
				container:null,
				skip: false, //是否开启跳页，即一个输入框手动输入跳转到哪一页
				skin: null, //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
				first: null, //将首页显示为数字1,。若不显示，设置false即可
			    last: null, //将尾页显示为总页数。若不显示，设置false即可
			    prev: null, //prev: '<' 若不显示，设置false即可
			    next: null, //next: '>' 若不显示，设置false即可
				groups: null //连续显示分页数
			},
			
			pageType:"page",//page, load
			load:{
				append:"prev", //prev, next
				button:{
					selector:null,
					text:"点击加载",
					className:null,
					domType:"<button />"
				},
				type:"btn", // btn OR scroll
				scroll:{
					parentSelector:window,
					initDomHeight:$(window).height(), //也可以是个function(table)
					scrollEvent:"scroll",
					scrollFistLoadedCallBack:function(table){
						
					}
				},
				loadInfo:{
					selector:null,
					className:null,
					loadingInfo:"正在加载...",
					loadingFadeTime:300,
					loadedInfo:function(data, table){
						return "正在加载..." ;
					},
					completeInfo:function(data, table){
						return "没有更多数据" ;
					}
				}
			},		
			rowCallback:function( row, data, index, table ){
				
			}
			
	}
	

	$(document).ready(function(){
		

		
	});

	jQuery.extend($.diyTable, {
		init:function(opt){
			var table = {} ;
			table.listData = [] ;
			table.currPage = 1 ;
			table.settings = copySeting(opt) ;
			table.initFinish = false ;
			table.load = {
					pageNo:null,
					totalNum:null
			}
			
			var containerId = table.settings.containerId ;
			tables[containerId] = table ;
						
			createHead(table) ;
			
			if(table.settings.pageType=="page"){
				if($(table.settings.page.container).length==0){
					$('<div class="diyTable-page" />').appendTo($("#" + table.settings.containerId)) ;
					table.settings.page.container = $(".diyTable-page", $("#" + table.settings.containerId)) ;
				}
			}

			if(table.settings.pageType=="load"){		
				
				var btn = $(table.settings.load.button.selector) ;
				if(table.settings.load.type=="btn"){
					if(btn.length==0){
						var btnDiv = $('<div class="diyTable-loadBtnDiv" />').appendTo($("#" + table.settings.containerId)) ;
						btn = $(table.settings.load.button.domType, {
								text:table.settings.load.button.text,
								"class":"diyTable-loadBtn"
					    }).appendTo(btnDiv) ;
						table.settings.load.button.selector = btn ;
					}
					if(!$.util.isBlank(table.settings.load.button.className)){
						$(btn).addClass(table.settings.load.button.className) ;
					}
				}
				
				
				var loadInfoDiv = $(table.settings.load.loadInfo.selector) ;
				if(loadInfoDiv.length==0){
					loadInfoDiv = $('<div class="diyTable-loadInfo" />').appendTo($("#" + table.settings.containerId)) ;
					table.settings.load.loadInfo.selector = loadInfoDiv ;
				}
				if(!$.util.isBlank(table.settings.load.loadInfo.className)){
					loadInfoDiv.addClass(table.settings.load.loadInfo.className) ;
				}
			}
			
			table.toPage = function(pageNo){
				var _table = this ;
				var _settings = _table.settings ;
				var length = _settings.length ;
				
				var start = 0 ;
				if(pageNo>1){
					start = (pageNo - 1) * length ;
				}
				
				if(_table.settings.pageType=="load"){
					
					if(_table.settings.load.type=="scroll"){
						var spar = _table.settings.load.scroll.parentSelector ;		
						$(spar).off(_table.settings.load.scroll.scrollEvent) ;
					}
					
					if(_table.load.pageNo==null){
						_table.load.pageNo = 1 ;
					}else{
						_table.load.pageNo++ ;
					}
					
					pageNo = _table.load.pageNo ;
					if(pageNo>1){
						start = (pageNo - 1) * length ;
					}
					
					var ldbt = $(_table.settings.load.button.selector) ;
					if(ldbt.length>0){
						ldbt.attr("disabled","disabled");
					}
					
					$(_table.settings.load.loadInfo.selector).html(table.settings.load.loadInfo.loadingInfo) ;
					$(_table.settings.load.loadInfo.selector).show() ;
				}
				
				
				var body = $(_settings.body.selector, $("#" + _settings.containerId)) ;
				
				var ajaxData = {
					start:start,
					length:length
				} ;
				_settings.ajax.data(ajaxData, _table) ;
				
				$.ajax({
					url: _settings.ajax.url,
					data:ajaxData,
					type:_settings.ajax.type,	
					global:_settings.ajax.global,	
					dataType:"json",
					success:function(data){

						var listData = _settings.ajax.dataSrc(data, _table) ;
						
						var recordsTotal = data.recordsTotal ;						
												
						if(_table.settings.pageType=="load"){
							$.merge(_table.listData, listData) ;
							
							if(_table.load.totalNum==null){
								_table.load.totalNum = data.recordsTotal ;
							}
							
							if(_table.load.totalNum>data.recordsTotal){
								_table.load.totalNum = data.recordsTotal ;
							}
							recordsTotal = _table.load.totalNum ;
						}
						if(_table.settings.pageType=="page"){
							_table.listData = listData ;
						}						
						
						draw(_table, listData) ;
		
						if(_table.settings.pageType=="load"){ 
							if(start >= recordsTotal){
								var completeInfo = table.settings.load.loadInfo.completeInfo(data, _table) ;
								$(_table.settings.load.loadInfo.selector).html(completeInfo) ;
							}
							
							setTimeout(function(){
								$(_table.settings.load.loadInfo.selector).hide() ;
								
								if(_table.settings.load.type=="btn"){
									var ldbt = $(table.settings.load.button.selector) ;
									if(ldbt.length>0){
										ldbt.removeAttr("disabled");
									}
								}else if(_table.settings.load.type=="scroll"){
									var spar = _table.settings.load.scroll.parentSelector ;
									var _initDomHeight = _table.settings.load.scroll.initDomHeight ;
									
									if($.util.isFunction(_initDomHeight)){
										_initDomHeight = _initDomHeight(_table) ;
									}
						
									if($("#"+_table.settings.containerId).height()<_initDomHeight && (start < recordsTotal)){
										_table.toPage() ;
										return false; 
									}else{
										_table.settings.load.scroll.scrollFistLoadedCallBack(_table) ;
									}

									$(spar).on(_table.settings.load.scroll.scrollEvent, function(){										
										_table.toPage() ;
									}) ;
									
									_table.initFinish = true ;
									
								}
							},_table.settings.load.loadInfo.loadingFadeTime);
						}
						
						if(_table.settings.pageType=="page"){
							
							var pages = Math.ceil(recordsTotal/length) ;
							
							if(pageNo > pages){
								pageNo = pages ;
								_table.toPage(pages);
								return false ;
							}
							
							_table.currPage = pageNo ;
							
							var laypageSetting = {
									cont:_settings.page.container, //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>	
									pages: pages, //通过后台拿到的总页数
									//curr: Math.floor(start/length) + 1 || 1, //当前页, 起始为1
									curr:pageNo,
									groups:_settings.page.groups?_settings.page.groups:5, //连续分页数。
									skip: _settings.page.skip, //是否开启跳页，即一个输入框手动输入跳转到哪一页		
									jump: function(obj, first){ //触发分页后的回调
						                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
						                    //var thisStart = (obj.curr - 1) * length;
						                    _table.toPage(obj.curr);
						                }
						            }
								} ;
								
								if(_settings.page.skin!=null&&_settings.page.skin!=undefined){
									laypageSetting["skin"] = _settings.page.skin ;//加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
								}
								if(_settings.page.first!=null&&_settings.page.first!=undefined){
									laypageSetting["first"] = _settings.page.first ;
								}
								if(_settings.page.last!=null&&_settings.page.last!=undefined){
									laypageSetting["last"] = _settings.page.last ;
								}
								if(_settings.page.prev!=null&&_settings.page.prev!=undefined){
									laypageSetting["prev"] = _settings.page.prev ;
								}
								if(_settings.page.next!=null&&_settings.page.next!=undefined){
									laypageSetting["next"] = _settings.page.next ;
								}
								
								laypage(laypageSetting);			
								
								_table.initFinish = true ;
								
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						table.initFinish = true ;
						if(_table.settings.pageType=="load"){
							if(_table.settings.load.type=="btn"){
								var ldbt = $(table.settings.load.button.selector) ;
								if(ldbt.length>0){
									ldbt.removeAttr("disabled");
								}
							}else if(_table.settings.load.type=="scroll"){
								var spar = _table.settings.load.scroll.parentSelector ;
								$(spar).on(_table.settings.load.scroll.scrollEvent, function(){
									_table.toPage() ;
								}) ;
							}
						}
						
					}
				});
			}
			
			table.toPage(1) ;
			
			if(table.settings.pageType=="load"){
				if(table.settings.load.type=="btn"){
					$(table.settings.load.button.selector).on("touchstart click", function(){
						table.toPage() ;
					});
				}				
			}
			
			return table ;
		},
		getBasicSettings:function(){
			return $.util.cloneObj(settings);
		},
		getTableById:function(containerId){
			return tables[containerId] ;
		},
		getFullByRowIndex:function(containerId, rowIndex){
			var table = $.diyTable.getTableById(containerId) ;
			var listData = table.listData ;
			return listData[$.util.parseInt(rowIndex)] ;
		},
		destroy:function(containerId){
			var table = $.diyTable.getTableById(containerId) ;
			if($.util.exist(table)){
				table.listData = [] ;
				table.load.pageNo = null;
				table.load.totalNum = null;
				table.currPage = 1 ;
				$("#"+containerId).html("") ;
				
				var spar = table.settings.load.scroll.parentSelector ;		
				$(spar).off(table.settings.load.scroll.scrollEvent) ;
				if(table.settings.pageType=="load"){
					if(table.settings.load.type=="btn"){
						$(table.settings.load.button.selector).off("touchstart click"); 
					}
				}
				
				delete tables[containerId] ;
			}
		},
		clear:function(containerId){
			var table = $.diyTable.getTableById(containerId) ;
			if($.util.exist(table)){
				table.listData = [] ;
				table.load.pageNo = null;
				table.load.totalNum = null;
				table.currPage = 1 ;
				$(table.settings.body.selector).html("") ;
				
				var spar = table.settings.load.scroll.parentSelector ;		
				$(spar).off(table.settings.load.scroll.scrollEvent) ;
			}
		},
		draw:function(containerId, isStayInCurrPage){
			var table = $.diyTable.getTableById(containerId) ;
			if(table.initFinish){
				table.initFinish = false ;
				var page = 1 ;

				if(isStayInCurrPage){
					page = table.currPage ;
				}
				if(table.settings.pageType == "load"){
					$.diyTable.clear(containerId) ;
				}
				table.toPage(page) ;
			}
		}
	});
	
	
	function copySeting(opt){
		var tpsettings = $.util.cloneObj(settings) ;
		$.extend(true, tpsettings, opt) ;
		return tpsettings ;
	}
	
	function createHead(table){
		var settings = table.settings ;
		var head ;
		if(settings.hideHead){
			if(settings.isTable){
				head = $('<thead style="display:none" />').appendTo($("#" + table.settings.containerId));
			}else{
				head = $('<div class="diyTable-head" style="display:none" />').appendTo($("#" + table.settings.containerId));
			}
		}else{
			if(settings.isTable){
				head = $('<thead />').appendTo($("#" + table.settings.containerId));
			}else{
				head = $('<div class="diyTable-head" />').appendTo($("#" + table.settings.containerId));
			}
		}
		
		var headTr ;
		if(settings.isTable){
			headTr = $("<tr />").appendTo(head) ;
			
			var columnDefs = settings.columnDefs ;

			$.each(settings.columnDefs, function(i, val){							
				var th = $("<th />", {
					text:val.title
				}).appendTo(headTr) ;			
				if(!$.util.isBlank(val.width)){
					$(th).css("width", val.width) ;
				}
			});

		}else{
			headTr = $('<div class="diyTable-headTr" />').appendTo(head) ;
			
			var columnDefs = settings.columnDefs ;

			$.each(settings.columnDefs, function(i, val){			
				var th = $("<div />", {
					text:val.title,
					"class":"diyTable-headTr-th"
				}).appendTo(headTr) ;		
				if(!$.util.isBlank(val.width)){
					$(th).css("width", val.width) ;
				}					
			});
		}
		

	}
	
	function draw(table, newData){
		var settings = table.settings ;	
		var listData = table.listData ;
		var lastIndex = 0 ;
		
		if(table.settings.pageType=="load" && table.load.pageNo>1){
			lastIndex = table.listData.length - newData.length ;
			
		}

		var container = $("#" + table.settings.containerId) ;
		
		var body = $(settings.body.selector) ;
		
		if(table.settings.pageType=="page"){
			$(body).html("") ;
		}
		
		if(body.length==0){
			if(settings.isTable){
				body = $("<tbody />").appendTo(container) ;
			}else{
				body = $('<div />').appendTo(container) ;
			}
			settings.body.selector = body ;
		}
		
		$(body).addClass("diyTable-tbody") ;
		
		var append = "next" ;
		
		if(table.settings.pageType=="load"){
			var append = table.settings.load.append ;
		}

		$.each(newData, function(i, val){	
			
			var tr = $(settings.row.type, {
				"role":"row",
				"rowIndex":i + lastIndex
			}) ;
			
			if(append=="prev"){
				tr.prependTo(body) ;	
			}else{
				tr.appendTo(body) ;	
			}
			
			$.each(settings.columnDefs, function(j, val1){		
				var cellData = val[val1.data] ;
				var cellShow = val1.render(cellData, null, val, {
					row:i + lastIndex,
				    col:j,
				    table:table
				}) ;	

				var td = $(settings.cell.type, {
					"class":val1.className
				}).appendTo(tr) ;
				
				$(td).html(cellShow) ;	
				
				if(!settings.isTable && !$.util.isBlank(val1.width)){
					$(td).css("width", val1.width) ;
				}	
			});
			
			settings.rowCallback(tr, val, i + lastIndex, table) ;
		});
		

	}
	
})(jQuery);	





