


$(document).ready(function() {	
	
	
	
})

$.layerAlert = $.layerAlert || {};

(function($){
	
	var layerLoadIndex = null ;	
	
	jQuery.extend($.layerAlert, {
		
		img:function(img, maxSize, marginSet, settings){
			var st = settings ;
			if(!$.util.exist(settings)){
				st = {				 
				  scrollbar: false,
				  shadeClose: true,
				  maxmin :false,
				  //closeBtn: 0,
				  skin: 'layui-layer-nobg', //没有背景色
				  title: false
				} ;
			}
			
			if(!$.util.exist(maxSize)){
				maxSize = Math.ceil($(window.top).height()) ;
			}
			
			st["type"] = 1 ;
			
			var url = "" ;
			if($.util.isString(img)){
				url = img ;
			}else{
				url = $(img).attr("src") ;
			}
			
			if(url.indexOf("base64")==-1){
				url = url + "?" + Math.random() ;
			}else{
				//var re = new RegExp(/radom([^radom]+)\;/i);
			}
			
			
			
			var tp = new Image() ;
			
			tp.onload=function(){
				
				var w = this.width ;
				var h = this.height ;
				
				
				
				var aw = 0 ;
				var ah = 0 ;
		
				if(w>=h && w>maxSize){
					aw = maxSize ;
					ah = (maxSize*h)/w ;
				}else 
					
				if(h>maxSize){
					aw = maxSize ;
					ah = (maxSize*h)/w ;
				}
				
				if(w<maxSize && h<maxSize){
					if(w>h){
						aw = maxSize ;
						ah = (maxSize*h)/w ;
					}else{
						aw = maxSize ;
						ah = (maxSize*h)/w ;
					}
				}
				
				aw = Math.ceil(aw) ;
				ah = Math.ceil(ah) ;
				
				
				
				var dp = document.getElementById("imgId") ;
				if(url.indexOf("base64")==-1){
					dp.src = url +"?" + Math.random()  ;
				}else{
					dp.src = url ;
				}

				//dp.width = aw ;
				//dp.height = ah ;
				
				var _ah = ah ;
				var _aw = aw ;
				
				if(marginSet){
					_ah = ah - marginSet*2 ;
					_aw = aw - marginSet*2 ;
					
					st["marginSet"] = marginSet + "px" ;
				}
				
				$(dp).css("height", _ah+"px") ;
				$(dp).css("width", _aw+"px") ;
				
				st.content = $(dp) ;
				
				st["height"] = ah + "px" ;
				st["width"] = aw + 5 + "px" ;
				
				$.layerAlert.dialog(st) ;
				
			};
			tp.src = url ;			
		},
		
		loading:function(settings){
			var layerLoadingSettings = {
					//选择loading类型
					type:1,
					/**
					 * 类型：String/Array，默认：'auto'
					 * 默认垂直水平居中。但当你只想定义top时，你可以offset: '100px'。当您top、left都要定义时，你可以offset: ['100px', '200px']。除此之外，你还可以定义offset: 'rb'，表示右下角
					 */
					offset:"auto",
					//当你想自动关闭时，可以time: 5000，即代表5秒后自动关闭，注意单位是毫秒（1秒=1000毫秒）
					time:0,
					//除了ie6-9，其它所有浏览器都是支持的。目前shift可支持的动画类型有0-6
					shift : 0,
					//层级
					zIndex:999999999,
					//遮罩：shade:false关闭遮罩，背景的内容可操作；shade: [0.5,'black']遮罩颜色，透明度
					shade: [0.5,'black'],
					//层创建成功后的回掉函数
					//传入参数function(layero, index){}
					//index:层index标识，layero:层对象
					success:null,
					//层销毁后的回调函数，没有传入参数
					end :null ,	
					moveEnd:null
			}
			layerLoadIndex = layer.load(
					
				$.util.elExist("type", settings)?settings.type:layerLoadingSettings.type,
				{					
					zIndex:$.util.elExist("zIndex", settings)?settings.zIndex:layerLoadingSettings.zIndex,
					shade:$.util.elExist("shade", settings)?settings.shade:layerLoadingSettings.shade,
					offset:$.util.elExist("offset", settings)?settings.offset:layerLoadingSettings.offset,
					time:$.util.elExist("time", settings)?settings.time:layerLoadingSettings.time,
					shift:$.util.elExist("shift", settings)?settings.shift:layerLoadingSettings.shift,
					success:$.util.elExist("success", settings)?settings.success:layerLoadingSettings.success,
				    end:$.util.elExist("end", settings)?settings.end:layerLoadingSettings.end,
				    moveEnd:$.util.elExist("moveEnd", settings)?settings.moveEnd:layerLoadingSettings.moveEnd
				}
			); 
		},
		getFrameInitData:function(frameWindow){
			return layer.frameData[frameWindow.name] ;
		},
		getLoadingIndex:function(){
			//拿到当前loading的index标识
			return layerLoadIndex ;
		},	
		close:function(index){
			/**
			 * 按层的index标识关闭层
			 */
			layer.close(index);
		},	
		closeAll:function(type){
			/**
			 * type不传：关闭所有层
			 * 'dialog'//关闭信息框
			 * 'page'//关闭所有页面层
			 * 'iframe' //关闭所有的iframe层
			 * 'loading'//关闭加载层
			 *  'tips' //关闭所有的tips层        
			 */
			if(type==undefined || type==null){
				layer.closeAll();
			}else{
				layer.closeAll(type);
			}
		},
		getChildFrame:function(selector, index){
			/**
			 * selector:拿到frame内的元素的slector
			 * index:frame的index标识
			 */
			layer.getChildFrame(selector, index) ;
		},
		getFrameIndex:function(windowName){
			/**
			 * windowName需要拿到window的frame的index的标识的name
			 * var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
			 */
			layer.getFrameIndex(windowName) ;
		},
		iframeAuto:function(index){
			/**
			 * Index标识代表的frame高度自适应
			 */
			layer.iframeAuto(index) ;
		},
		setTop:function(layero){
			/**
			 * 置顶层
			 * layero：层对象
			 */
			layer.setTop(layero);
		},
		min:function(index){
			/**
			 * 最小化层
			 * index:层标识
			 */
			layer.min(index) ;
		},
		full:function(index){
			/**
			 * 最大化层
			 * index:层标识
			 */
			layer.full(index) ;
		},		
		restore:function(index){
			/**
			 * 还原层
			 * index:层标识
			 */
			layer.restore(index) ;
		},			
		alert:function(settings){
			var alertSettings = {
					//弹出的消息
					msg:'',
					//层标题
					title:"提示",
					//第一个按钮的回调函数，无需进行手工关闭。如果不想关闭，return false即可
					//传入参数function(index, layero){}
					//index:层index标识，layero:层对象
					yes:null,
					//第二个按钮和取消和关闭按钮触发的回调，无需进行手工关闭。如果不想关闭，return false
					//传入参数function(index, layero){}
					//index:层index标识，layero:层对象
					cancel:null,
					//层销毁后的回调函数，没有传入参数
					end :null ,
					//层创建成功后的回掉函数
					//传入参数function(layero, index){}
					//index:层index标识，layero:层对象
					success:null,
					//zIndex
					zIndex :22222222 ,
					//皮肤，默认带边框
					skin: 'layui-layer-rim', 
					//宽高要带单位px，如width:"200px"
					width : 'auto' ,
					height :'auto' ,
					//遮罩：shade:false关闭遮罩，背景的内容可操作；shade: [0.5,'black']遮罩颜色，透明度
					shade: [0.5,'black'],
					//弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
					icon : 0,
					/**
					 * 类型：String/Array，默认：'auto'
					 * 默认垂直水平居中。但当你只想定义top时，你可以offset: '100px'。当您top、left都要定义时，你可以offset: ['100px', '200px']。除此之外，你还可以定义offset: 'rb'，表示右下角
					 */
					offset:"auto",
					//当你想自动关闭时，可以time: 5000，即代表5秒后自动关闭，注意单位是毫秒（1秒=1000毫秒）
					time:0,
					//除了ie6-9，其它所有浏览器都是支持的。目前shift可支持的动画类型有0-6
					shift : 0,
					//layer提供了两种风格的关闭按钮，可通过配置1和2来展示，如果不显示，则closeBtn: false
					closeBtn:1,
					moveEnd:null
				}
			
			if($.util.elExist("msg", settings)&&settings.msg.length<10){
				if(!$.util.elExist("width", settings)){
					settings.width = "300px" ;
				}	
			}
			
			layer.alert(
				$.util.elExist("msg", settings)?settings.msg:alertSettings.msg,
				{
					icon:$.util.elExist("icon", settings)?settings.icon:alertSettings.icon,
					title:$.util.elExist("title", settings)?settings.title:alertSettings.title,		
					skin:$.util.elExist("skin", settings)?settings.skin:alertSettings.skin,
					shade:$.util.elExist("shade", settings)?settings.shade:alertSettings.shade,	
					area:[
					   $.util.elExist("width", settings)?settings.width:alertSettings.width,	
				       $.util.elExist("height", settings)?settings.height:alertSettings.height		   
					],
					zIndex:$.util.elExist("zIndex", settings)?settings.zIndex:alertSettings.zIndex,	
					yes:$.util.elExist("yes", settings)?settings.yes:alertSettings.yes,
					cancel:$.util.elExist("cancel", settings)?settings.cancel:alertSettings.cancel,
					end:$.util.elExist("end", settings)?settings.end:alertSettings.end,	
					success:$.util.elExist("success", settings)?settings.success:alertSettings.success,
				    offset:$.util.elExist("offset", settings)?settings.offset:alertSettings.offset,
					time:$.util.elExist("time", settings)?settings.time:alertSettings.time,	
					shift:$.util.elExist("shift", settings)?settings.shift:alertSettings.shift,
					closeBtn:$.util.elExist("closeBtn", settings)?settings.closeBtn:alertSettings.closeBtn,
					moveEnd:$.util.elExist("moveEnd", settings)?settings.moveEnd:alertSettings.moveEnd		
				}	
			
			) ;
			
		},
		
		confirm:function(settings){
			var confirmSettings = {
					//弹出的消息
					msg:'',
					//层标题
					title:"提示",			
					//第一个按钮的回调函数，无需进行手工关闭。如果不想关闭，return false即可
					//传入参数function(index, layero){}
					//index:层index标识，layero:层对象
					yes:null,
					//第二个按钮和取消和关闭按钮触发的回调，无需进行手工关闭。如果不想关闭，return false
					//传入参数function(index, layero){}
					//index:层index标识，layero:层对象
					cancel:null,
					//层销毁后的回调函数，没有传入参数
					end :null ,
					//层创建成功后的回掉函数
					//传入参数function(layero, index){}
					//index:层index标识，layero:层对象
					success:null,
					//zIndex
					zIndex :22222222 ,
					//皮肤，默认带边框
					skin: 'layui-layer-rim', 
					//宽高要带单位px，如width:"200px"
					width : 'auto' ,
					height :'auto',
					//遮罩：shade:false关闭遮罩，背景的内容可操作；shade: [0.5,'black']遮罩颜色，透明度
					shade: [0.5,'black'],
					//弹出框的图标：0:警告、1：对勾、2：叉、3：问号、4：锁、5：不高兴的脸、6：高兴的脸
					icon : 3,
					//弹出框的按钮，btn: ['btn1','btn2','btn3','btn4'] ,可以放n个
					btn: ['确认','取消'],
					/**
					 * 类型：String/Array，默认：'auto'
					 * 默认垂直水平居中。但当你只想定义top时，你可以offset: '100px'。当您top、left都要定义时，你可以offset: ['100px', '200px']。除此之外，你还可以定义offset: 'rb'，表示右下角
					 */
					offset:"auto",
					//当你想自动关闭时，可以time: 5000，即代表5秒后自动关闭，注意单位是毫秒（1秒=1000毫秒）
					time:0,
					//除了ie6-9，其它所有浏览器都是支持的。目前shift可支持的动画类型有0-6
					shift : 0,	
					//layer提供了两种风格的关闭按钮，可通过配置1和2来展示，如果不显示，则closeBtn: false
					closeBtn:1,
					//
					// 按钮的回调函数:yes默认代表btn数组中第一个名称的按钮并且点击会默认关闭层，
					// cancel默认代表btn数组中第二个名称的按钮和取消按钮并且点击会默认关闭层
					// callBacks = {
					// 	  yes:function(index, layero){
					// 		//index:弹出层的标识；layero
					//		//layero:层的jquery对象
					// 		 	
					//    },
					//    btn1:function(index, layero){
					//    	//index:弹出层的标识；layero
					// 		//layero:层的jquery对象
					// 		//这样实现btn1的回调函数默认不关闭层，需要手动调用close函数关闭
					//    }
					// 
					// }
					//
					callBacks:[],
					moveEnd:null
			}
			if($.util.elExist("msg", settings)&&settings.msg.length<10){
				if(!$.util.elExist("width", settings)){
					settings.width = "300px" ;
				}	
			}
			
			var mySettings = {
				icon:$.util.elExist("icon", settings)?settings.icon:confirmSettings.icon,
				title:$.util.elExist("title", settings)?settings.title:confirmSettings.title,
				skin:$.util.elExist("skin", settings)?settings.skin:confirmSettings.skin,
				shade:$.util.elExist("shade", settings)?settings.shade:confirmSettings.shade,	
				area:[
				      $.util.elExist("width", settings)?settings.width:confirmSettings.width,	
				      $.util.elExist("height", settings)?settings.height:confirmSettings.height		   
				],	
				btn:$.util.elExist("btn", settings)?settings.btn:confirmSettings.btn,
				yes:$.util.elExist("yes", settings)?settings.yes:confirmSettings.yes,	
				cancel:$.util.elExist("cancel", settings)?settings.cancel:confirmSettings.cancel,			
				end:$.util.elExist("end", settings)?settings.end:confirmSettings.end,					
				offset:$.util.elExist("offset", settings)?settings.offset:confirmSettings.offset,
				zIndex:$.util.elExist("zIndex", settings)?settings.zIndex:confirmSettings.zIndex,
				time:$.util.elExist("time", settings)?settings.time:confirmSettings.time,
				closeBtn:$.util.elExist("closeBtn", settings)?settings.closeBtn:confirmSettings.closeBtn,
				shift:$.util.elExist("shift", settings)?settings.shift:confirmSettings.shift,
				success:$.util.elExist("success", settings)?settings.success:confirmSettings.success,
				moveEnd:$.util.elExist("moveEnd", settings)?settings.moveEnd:confirmSettings.moveEnd
			}
			
			if($.util.elExist("callBacks", settings)){
				for(var key in settings.callBacks){
					mySettings[key] = settings.callBacks[key] ;
				}
			}

			layer.confirm(
				$.util.elExist("msg", settings)?settings.msg:confirmSettings.msg,
				mySettings			
			);
		},
		
		tips:function(settings){
			var tipsSettings = {
					//弹出的消息
					msg:'',
					//绑定弹出的标签的选择器
					selector:'',
					//tips的颜色
					color:'#07ADD7',
					//方向：1:上；2：右；3：下；4：左
					position:1,
					//layer提供了两种风格的关闭按钮，可通过配置1和2来展示，如果不显示，则closeBtn: false
					closeBtn:2,
					//当你想自动关闭时，可以time: 5000，即代表5秒后自动关闭，注意单位是毫秒（1秒=1000毫秒）
					time:0,
					//允许多个意味着不会销毁之前的tips层。通过tipsMore: true开启
					tipsMore:false,
					//除了ie6-9，其它所有浏览器都是支持的。目前shift可支持的动画类型有0-6
					shift:0,
					//层销毁后的回调函数，没有传入参数
					end :null ,
					//层创建成功后的回掉函数
					//传入参数function(layero, index){}
					//index:层index标识，layero:层对象
					success:null,	
					cancel:null,
					moveEnd:null
			}

			layer.tips(
				$.util.elExist("msg", settings)?settings.msg:tipsSettings.msg,	
				$.util.elExist("selector", settings)?settings.selector:tipsSettings.selector,		
				{
			       tips: [
			          $.util.elExist("position", settings)?settings.position:tipsSettings.position,	    
			          $.util.elExist("color", settings)?settings.color:tipsSettings.color  	  
			       ],
			       closeBtn:$.util.elExist("closeBtn", settings)?settings.closeBtn:tipsSettings.closeBtn,
			       time:$.util.elExist("time", settings)?settings.time:tipsSettings.time,
			       shift:$.util.elExist("shift", settings)?settings.shift:tipsSettings.shift,
			       tipsMore:$.util.elExist("tipsMore", settings)?settings.tipsMore:tipsSettings.tipsMore,
			       success:$.util.elExist("success", settings)?settings.success:tipsSettings.success,
			       end:$.util.elExist("end", settings)?settings.end:tipsSettings.end,
			       cancel:$.util.elExist("cancel", settings)?settings.cancel:tipsSettings.cancel,
			       moveEnd:$.util.elExist("moveEnd", settings)?settings.moveEnd:tipsSettings.moveEnd
			    }
			);
		},
		
		dialog:function(settings){
			var dialogSettings = {
					//html文本内容或者链接; 当type:1时，可以传入jquery的标签对象捕获元素并弹出
					content:null,			
					//弹出层类型，默认为frame层：0:'dialog', 1:'page', 2:'iframe', 3:'loading', 4:'tips'
					type: 2,	
					//层标题
					title:"信息",		
					//是否可以最大最小化
					maxmin: true,
					move:true,
					//点击层外面的区域是否关闭
					shadeClose: true,
					//遮罩：shade:false关闭遮罩，背景的内容可操作；shade: [0.5,'black']遮罩颜色，透明度
					shade: [0.5,'black'],
					//即鼠标滚动时，层是否固定在可视区域
					fix: false, 
					//弹出层内的内容加载之前是否显示Loading
					pageLoading:false,	
					width:null,
					height:null,
					//第一个按钮的回调函数，无需进行手工关闭。如果不想关闭，return false即可
					//传入参数function(index, layero){}
					//index:层index标识，layero:层对象
					yes:null,
					//第二个按钮和取消和关闭按钮触发的回调，无需进行手工关闭。如果不想关闭，return false
					//传入参数function(index, layero){}
					//index:层index标识，layero:层对象
					cancel:null,
					//层销毁后的回调函数，没有传入参数
					end :null ,
					//层创建成功后的回掉函数
					//传入参数function(layero, index){}
					//index:层index标识，layero:层对象
					success:null,
					//内容离层边框的距离
					marginSet:null,
					//zIndex
					zIndex :22222222 ,
					//自定按钮 btn: ['按钮1','按钮2']
					btn:null,
					offset:"auto",
					//当你想自动关闭时，可以time: 5000，即代表5秒后自动关闭，注意单位是毫秒（1秒=1000毫秒）
					time:0,
					//除了ie6-9，其它所有浏览器都是支持的。目前shift可支持的动画类型有0-6
					shift : 0,	
					//layer提供了两种风格的关闭按钮，可通过配置1和2来展示，如果不显示，则closeBtn: false
					closeBtn:1,
					//皮肤：默认带边框
					skin: 'layui-layer-rim',
					//是否允许滚动条
					scrollbar:true,
					//
					// 按钮的回调函数:yes默认代表btn数组中第一个名称的按钮并且点击会默认关闭层，
					// cancel默认代表btn数组中第二个名称的按钮和取消按钮并且点击会默认关闭层
					// callBacks = {
					// 	  yes:function(index, layero){
					// 		//index:弹出层的标识；layero
					//		//layero:层的jquery对象
					// 		 	
					//    },
					//    btn1:function(index, layero){
					//    	//index:弹出层的标识；layero
					// 		//layero:层的jquery对象
					// 		//这样实现btn1的回调函数默认不关闭层，需要手动调用close函数关闭
					//    }
					// 
					// }
					//
					callBacks:[],
					moveEnd:null,
					//页面初始化传值
					initData:null
			}	
			
			var mySettings = {} ;
			
			var area ;
			
			if(!$.util.exist(settings.width) && !$.util.exist(settings.height)){
				
			}else if($.util.exist(settings.width) && !$.util.exist(settings.height)){
				area = settings.width ;	
			}else{
				area = [
				    $.util.elExist("width", settings)?settings.width:"auto",	
				    $.util.elExist("height", settings)?settings.height:"auto"	    		
				]	
			}
			
			mySettings = {				
					scrollbar:$.util.elExist("scrollbar", settings)?settings.scrollbar:dialogSettings.scrollbar,	
					type:$.util.elExist("type", settings)?settings.type:dialogSettings.type,	
					content:$.util.elExist("content", settings)?settings.content:dialogSettings.content,
					title:$.util.elExist("title", settings)?settings.title:dialogSettings.title,	
					maxmin:$.util.elExist("maxmin", settings)?settings.maxmin:dialogSettings.maxmin,	
					shadeClose:$.util.elExist("shadeClose", settings)?settings.shadeClose:dialogSettings.shadeClose,			
					shade:$.util.elExist("shade", settings)?settings.shade:dialogSettings.shade,		
					fix:$.util.elExist("fix", settings)?settings.fix:dialogSettings.fix,	
					pageLoading:$.util.elExist("pageLoading", settings)?settings.pageLoading:dialogSettings.pageLoading,	
					btn:$.util.elExist("btn", settings)?settings.btn:dialogSettings.btn,
					skin:$.util.elExist("skin", settings)?settings.skin:dialogSettings.skin,
					yes:$.util.elExist("yes", settings)?settings.yes:dialogSettings.yes,	
					cancel:$.util.elExist("cancel", settings)?settings.cancel:dialogSettings.cancel,			
					end:$.util.elExist("end", settings)?settings.end:dialogSettings.end,	
					success:$.util.elExist("success", settings)?settings.success:dialogSettings.success,
					marginSet:$.util.elExist("marginSet", settings)?settings.marginSet:dialogSettings.marginSet,
					offset:$.util.elExist("offset", settings)?settings.offset:dialogSettings.offset,			
					time:$.util.elExist("time", settings)?settings.time:dialogSettings.time,	
					shift:$.util.elExist("shift", settings)?settings.shift:dialogSettings.shift,
					closeBtn:$.util.elExist("closeBtn", settings)?settings.closeBtn:dialogSettings.closeBtn,
					zIndex:$.util.elExist("zIndex", settings)?settings.zIndex:dialogSettings.zIndex,
					moveEnd:$.util.elExist("moveEnd", settings)?settings.moveEnd:dialogSettings.moveEnd,
					move:$.util.elExist("move", settings)?settings.move:dialogSettings.move,
					initData:$.util.elExist("initData", settings)?settings.initData:dialogSettings.initData	
			}
			
			if($.util.exist(area)){
				mySettings.area = area ;
			}
			
			if($.util.elExist("callBacks", settings)){
				for(var key in settings.callBacks){
					mySettings[key] = settings.callBacks[key] ;
				}
			}
			
			if(mySettings.offset == null || mySettings.offset=="auto"){
				delete mySettings.offset ;
			}
			
			if(mySettings.move == null || mySettings.move==true){
				delete mySettings.move ;
			}

			layer.open(
				mySettings		
			); 
		},
		
		frameWindow:function(index){
			return $.util.frameWindow("#layui-layer-iframe" + index) ;
		},
		closeWithLoading:function(index){
			$.layerAlert.closeAll('loading'); 
			layer.close(index) ;
		}
		
		
	});	
	
	
})(jQuery);	


function layerConfirm(settingsObj){
	//settings内容
	var msg = settingsObj.msg ;
	var func = settingsObj.func ;
	var backFunc = settingsObj.backFunc ;
	var frame = settingsObj.frame ;
	var zIndex = settingsObj.zIndex ;
	var data = settingsObj.data ;
	var callBacks = settingsObj.callBacks ;
	var width = settingsObj.width + "px" ;
	var height = settingsObj.height + "px" ;
	var toUrl = settingsObj.toUrl ;
	
	if(width==undefined || width==null){
		width =  'auto' ;
	}
	if(height==undefined || height==null){
		height = 'auto' ;	
	}
	if(msg.length<10){
		   width = 300 + "px" ;
	}
	
	var settings = [];
	settings[0] = msg ;
	
	settings[1] = {
			btn: ['确认','取消'], 
			shade: [0.5,'black'],
			skin: 'layui-layer-rim',
			area: [width, height] 
		} ;
	
	if(zIndex!=undefined && zIndex!=null){
		settings[1].zIndex = zIndex;
	}

	if(settings[1].btn!=undefined && settings[1].btn!=null){
		var defaultSetFunc = "yes" ;
		$(callBacks).each(function(i, val){
			if(val.name=="yes"){
				defaultSetFunc = "yes" ;
			}
			if(val.name=="btn1"){
				defaultSetFunc = "btn1" ;
			}
		});
		
		settings[1][defaultSetFunc] = function(index){
			defaultYesBack(toUrl, frame, func, backFunc, data) ;
			layer.close(index);
		} ;
	}
	
	if(callBacks!=undefined && callBacks!=null){
		$(callBacks).each(function(i, val){	
			settings[1][val.name] = val.func ;
		});
	}
	
	layer.confirm(
		settings[0], 
		settings[1]
	);
	
}

function layerDialog(settingsObj){
	
	var defaultSettings = {
		 type: 2,
		 maxmin: true,
		 title: "信息 窗口",
		 shadeClose: true,
		 shade: [0.5,'black'],
		 skin: 'layui-layer-rim',
		 fix: false, 
		 pageLoading:false,
		 area: ["auto", "auto"],
		 success : function(index){	
				
		 }
	} ;
	
	//settings内容
	var toUrl = settingsObj.toUrl ;
	var frame = settingsObj.frame ;
	var func = settingsObj.func ;
	var backFunc = settingsObj.backFunc ;
	var data = settingsObj.data ;
	var zIndex = settingsObj.zIndex ;
	var type = settingsObj.type ;
	var width = settingsObj.width ;
	var height = settingsObj.height ;	
	var title = settingsObj.title ;
	var content = settingsObj.content ;
	var successFunc = settingsObj.successFunc ;
	var btn = settingsObj.btn ;
	var callBacks = settingsObj.callBacks ;
	var marginSet = settingsObj.marginSet ;
	var pageLoading = settingsObj.pageLoading ;
	
	if(pageLoading!=undefined && pageLoading!=null){
		defaultSettings.pageLoading = pageLoading ;
	}
	
	if(marginSet!=undefined && marginSet!=null){
		defaultSettings.marginSet = marginSet ;
	}	
	defaultSettings.content = content ;
	if(width!=undefined && width!=null){
		if(width=="max"){
			defaultSettings.area[0] = ($(window.top).width() - 50) +'px'  ;
		}else{
			defaultSettings.area[0] = width + "px"  ;
		}	
	}
	if(height!=undefined && height!=null){
		if(height=="max"){
			defaultSettings.area[1] = ($(window.top).height() - 50) +'px' ;	
		}else{
			defaultSettings.area[1] = height + "px" ;	
		}	
	}
	if(type!=undefined && type!=null){
		defaultSettings.type = type ;
	}

	if(title!=undefined && title!=null){
		defaultSettings.title = title ;	
	}
	if(zIndex!=undefined && zIndex!=null){
		defaultSettings.zIndex = zIndex;
	}
	if(successFunc!=undefined && successFunc!=null){
		defaultSettings.success = successFunc;
	}
	if(btn!=undefined && btn!=null){
		defaultSettings.btn = btn;
		var defaultSetFunc = "yes" ;
		$(callBacks).each(function(i, val){
			if(val.name=="yes"){
				defaultSetFunc = "yes" ;
			}
			if(val.name=="btn1"){
				defaultSetFunc = "btn1" ;
			}
		});
		
		defaultSettings[defaultSetFunc] = function(index){
			defaultYesBack(toUrl, frame, func, backFunc, data) ;
			layer.close(index);
		} ;
	}
	if(callBacks!=undefined && callBacks!=null){
		$(callBacks).each(function(i, val){	
			defaultSettings[val.name] = val.func ;
		});
	}

	layer.open(defaultSettings); 
	
	
}


function defaultYesBack(toUrl, frame, func, backFunc, data){
	
	if(toUrl!=null || toUrl!=undefined){
		window.top.location.href = toUrl ;
	}else if(frame==null || frame==undefined){
		if(func=="util"){
			utilConfirmCallBack(backFunc, data) ;
		}if(func=="custom"){
			confirmCallBack(backFunc, data) ;	
		}
	}else if(frame=="top"){
		if(func=="util"){
			window.top.utilConfirmCallBack(backFunc, data) ;	
		}else if(func=="custom"){
			window.top.confirmCallBack(backFunc, data) ;	
		}
	}else if(frame=="parent"){
		if(func=="util"){
			parent.utilConfirmCallBack(backFunc, data) ;		
		}if(func=="custom"){
			parent.confirmCallBack(backFunc, data) ;		
		}
	}else{
		if(func=="util"){
			window.top.frames[floor].utilConfirmCallBack(backFunc, data) ;		   
		}if(func=="custom"){
			window.top.frames[floor].confirmCallBack(backFunc, data) ;		 
		}    
	}
	
}




