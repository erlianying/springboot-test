$.msghint = $.msghint || {};
(function($){
	
	var basicSettings = {
		dialogHiddenContainer:{
			"class":"msghint-dialog-hidden",
			type:"<div />",
			msglistContainer:{
				"class":"msghint-dialog-hidden-msg",
				type:"<div />"
			}
		},		
		id:null,
		callBacks:{
			formatMsgCallBack:function(msgs, id, obj, settings){
				
			}
		},
		msgs:{
			order:"desc"
		},
		dialog:{
			border:"6px",
			width:"300px",
			height:"200px",
			shift:0,
			marginSet:"5px",
			title:"提示",
			autoClose:false
		}
	}
	
	var Constant = {
			
	}
	
	var msghint = {
			
	}
	
	$.extend($.msghint,{
		Constant:Constant,
		init:function(settings){
			var _settings = copySeting(settings) ;
			var dialogHiddenContainer = $(_settings.dialogHiddenContainer.selector) ;
			if(dialogHiddenContainer.length==0){
				dialogHiddenContainer = $(_settings.dialogHiddenContainer.type, {
					"class":_settings.dialogHiddenContainer["class"]
				}).appendTo($("body")) ;
			}
			
			var obj = {} ;
			obj.settings = _settings ;
			obj.msg = {} ;
			msghint[_settings.id] = obj ;
			
			var msglistContainer = $("#msghint-dialog-hidden-msg-" + obj.settings.id, dialogHiddenContainer) ;
			if(msglistContainer.length==0){
				msglistContainer = $(obj.settings.dialogHiddenContainer.msglistContainer.type, {
					"id":"msghint-dialog-hidden-msg-" + obj.settings.id,
					"class":obj.settings.dialogHiddenContainer.msglistContainer["class"],
					"style":"display:none;"
				}).appendTo(dialogHiddenContainer) ;
			}
		},
		getMsgHint:function(id){
			return msghint[id] ;
		},
		getMsgHints:function(){
			return msghint ;
		},
		addMsg:function(id, msg){
			var obj = $.msghint.getMsgHint(id) ;
			var uuid = Math.uuidFast() ;
			obj["msg"][uuid] = {
				id:uuid,
				timestamp:new Date().getTime(),
				msg:msg
			} ;
			return uuid ;
		},
		getMsgs:function(id){
			return $.msghint.getMsgHint(id).msg ;
		},
		getMsgByMsgId:function(id, msgId){
			var obj = $.msghint.getMsgHint(id) ;
			return obj["msg"][msgId] ;
		},
		removeMsg:function(id, msgId){
			var obj = $.msghint.getMsgHint(id) ;
			delete obj["msg"][msgId] ;
		},
		show:function(id, successCallBack, endCallBack){
			var obj = $.msghint.getMsgHint(id) ;
			
			obj.timestamp = new Date().getTime() ;
			
			var msgs = [] ;
			$.each(obj.msg, function(i, val){
				msgs.push(val) ;
			});
			
			msgs.sort(function(a,b){
				if(obj.settings.msgs.order=="desc"){
					return b.timestamp - a.timestamp;
				}
				return a.timestamp - b.timestamp;
	        });
			
			var msgJqObj = obj.settings.callBacks.formatMsgCallBack(msgs, obj.settings.id, obj, obj.settings) ;
			
			if(msgJqObj==false){
				return ;
			}
			
			var dialogHiddenContainer = $("." + obj.settings.dialogHiddenContainer["class"]) ;

			var msgContainer = $("#msghint-dialog-hidden-msg-" + obj.settings.id, dialogHiddenContainer) ;
			msgContainer.html("") ;
			msgContainer.append(msgJqObj) ;
			
			var offset = [];
			
			var win_height = $(window).height();
			var win_width = $(window).width();
			var height = obj.settings.dialog.height.substring(0, obj.settings.dialog.height.indexOf("px")) ;
			var width = obj.settings.dialog.width.substring(0, obj.settings.dialog.width.indexOf("px")) ;
			var border = obj.settings.dialog.border.substring(0, obj.settings.dialog.border.indexOf("px"));
			
			var height_offset = $.msghint.getCurrentHeight() ;
			var width_offset = width ;

			if(height_offset==0){
				height_offset = win_height - height - border * 3;
				width_offset = win_width - width_offset - border * 3;
			}else{
				var dialogNum = $($(".msghint-dialogs"), $(".msghint-dialog-hidden")).length ;
				height_offset = win_height - height_offset - height - border * ( dialogNum + 3);
				width_offset = win_width - width_offset - border * 3;
			}
			
			offset.push(height_offset) ;
			offset.push(width_offset) ;

			$.layerAlert.dialog({
				content:msgContainer,
				type:1,
				shadeClose:false,
				shade:false,
				width:obj.settings.dialog.width,
				height:obj.settings.dialog.height,
				shift:obj.settings.dialog.shift,
				marginSet:obj.settings.dialog.marginSet,
				title:obj.settings.dialog.title,
				offset:offset,
				maxmin:false,
				move:false,
				fix:true,
				success:function(layero, index){
					layero.addClass("msghint-dialogs") ;
					layero.attr("msghint-dialogs-id", obj.settings.id) ;
					
					if(!$.util.exist(successCallBack) && obj.settings.dialog.autoClose!=false){
						setTimeout(function(){
							$.layerAlert.close(index) ;
							$.msghint.orderDialogs() ;
						}, obj.settings.dialog.autoClose) ;
					}else{
						if($.util.exist(successCallBack)){
							successCallBack(obj.settings.id, obj, layero, index) ;
						}
					}
				},
				end:function(){
					msgContainer.html("") ;
					$.msghint.orderDialogs() ;
					
					if(endCallBack){
						endCallBack(obj.settings.id, obj);
					}
				}
			}) ;
		},
		getCurrentHeight:function(){
			var dialogs = $($(".msghint-dialogs"), $(".msghint-dialog-hidden")) ;
			
			var height = 0 ;
			$.each(dialogs, function(i, val){
				var id = $(val).attr("msghint-dialogs-id") ;
				var obj = $.msghint.getMsgHint(id) ;			
				height += $(val).outerHeight(true) ;
			});
			
			return height ;
		},
		close:function(id, isReOrderDialog){
			
			var obj = $.msghint.getMsgHint(id) ;
			
			var dialogHiddenContainer = $("." + obj.settings.dialogHiddenContainer["class"]) ;
			var msgContainer = $("#msghint-dialog-hidden-msg-" + obj.settings.id, dialogHiddenContainer) ;
			
			var layerContainer = msgContainer.parents(".msghint-dialogs") ;
			
			var layerIndex = $(layerContainer).attr("times") ;
			
			$.layerAlert.close(layerIndex) ;
			
			if((!$.util.exist(isReOrderDialog)) || isReOrderDialog==true){
				$.msghint.orderDialogs();
			}
		},
		clearMsg:function(id){
			var obj = $.msghint.getMsgHint(id) ;
			obj.msg = {} ;
		},
		orderDialogs:function(){
			var dialogs = $($(".msghint-dialogs"), $(".msghint-dialog-hidden")) ;
			
			var win_height = $(window).height();
			var win_width = $(window).width();
			
			var objs = [] ;
			$.each(dialogs, function(i, val){
				var id = $(val).attr("msghint-dialogs-id") ;
				var obj = $.msghint.getMsgHint(id) ;	
				objs.push(obj) ;
			});
			
			objs.sort(function(a,b){
	            return a.timestamp - b.timestamp;
	        });
			
			$.each(objs, function(i, val){

				var dialogHiddenContainer = $("." + val.settings.dialogHiddenContainer["class"]) ;
				var msgContainer = $("#msghint-dialog-hidden-msg-" + val.settings.id, dialogHiddenContainer) ;
				
				var div = msgContainer.parents(".msghint-dialogs") ;
				
				var border = val.settings.dialog.border.substring(0, val.settings.dialog.border.indexOf("px"));
				
				var height = val.settings.dialog.height.substring(0, val.settings.dialog.height.indexOf("px"));
				var width = val.settings.dialog.width.substring(0, val.settings.dialog.width.indexOf("px"));
				
				height_fix = border * (3*i+3) ;
				
				var height_offset = win_height - height * i - height - height_fix ;
				var width_offset = win_width - width - border * 3;

				$(div).css("left", width_offset + "px") ;
				$(div).css("top", height_offset + "px") ;
			});
		}
	});

	function copySeting(opt){
		var tpsettings = $.util.cloneObj(basicSettings) ;
		$.util.mergeObject(tpsettings, opt) ;
		return tpsettings ;
	}

})(jQuery);