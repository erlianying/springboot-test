
$.iWebOffice2000 = $.iWebOffice2000 || {};
(function($){
	"use strict";
	
	var iweboffice = {} ;
	
	
	$(document).ready(function(){
		
		var basicSettings = {
		    containerId:null,
		    maxFileSize:50 * 1024,
			activeXObject:{
				"width":"100%",
				"height":"100%",
				"class":null,
				"classid":"clsid:"+iWebOffice2000_clsid,
				"codebase":iWebOffice2000_codebase
			},
			statusBar:{
				"class":null
			}, 
			callBacks:{
				openTemplateServerDocCallBack:function(webOffice, result){
					
				},
				openServerDocCallBack:function(webOffice, result){
					
				}
			}
		}
		
		
		var Constant = {
			//编辑状态：第一位可以为0,1,2,3其中：0不可编辑；1可以编辑,无痕迹；2可以编辑,有痕迹,不能修订；3可以编辑,有痕迹,能修订。
			EditType:{
				"ReadOnly":"0",
				"EditWithoutTrace":"1",
				"EditWithTraceWithoutRevise":"2",
				"EditWithTraceAndRevise":"3"
			},
			ShowMenu:{
				"show":"1",
				"hide":"0"
			},
			blankDocName:{
				"word":"blank.docx",
				"word03":"blank.doc",
				"excel":"blank.xlsx",
				"excel03":"blank.xls",
				"ppt":"blank.pptx",
				"ppt03":"blank.ppt",
				"visio":"blank.vsdx",
				"visio03":"blank.vsd"
			}
		}
		
		
		
		
		jQuery.extend($.iWebOffice2000, {

			Constant:Constant,
			
			getIweboffices:function(){
				return iweboffice ;
			},
			getIweboffice:function(containerId){
				return iweboffice[containerId] ;
			},
			init:function(settings){
				
				var browser = $.util.browserVersion() ;
				
				if(browser.indexOf("IE")==-1){
					$.util.log("请使用IE内核的浏览器！");  
//					alert("请使用IE浏览器！") ;
	/*			    window.top.$.layerAlert.alert({
				    	msg:"请使用IE浏览器！"
				    })*/
					return false ;
				}
				
				try {  
				    var ax = new ActiveXObject(iWebOffice2000_progID);  
				    $.util.log("activeX控件已安装");  
				} catch(e) {  
					$.util.log("activeX控件未安装");  
		/* 		    window.top.$.layerAlert.alert({
				    	msg:"点击确认下载activeX控件，安装完毕请重新打开页面",
				    	yes:function(arg0, arg1){
				    		window.open(context+"/common/library/iweboffice2000/InstallClient.zip") ;
				    	}
				    }) */
				}  
				
				var _settings = copySeting(settings) ;
				var container = $("#"+_settings.containerId) ;
				
				var obj ;
				var obj_dom = $(".webOffice-obj", container) ;
			
				if(obj_dom.length==0){
					var objDiv = $(".webOffice-objDiv", container) ;
					if(objDiv.length==0){
						objDiv = $("<div />", {
							"class":"webOffice-objDiv"
						}).appendTo(container) ;
					}
					
/*					var obj_dom = $("<object />", {
						"width":_settings.activeXObject.width,
						"height":_settings.activeXObject.height,
						"class":"webOffice-obj " + $.util.exist(_settings.activeXObject["class"])?_settings.activeXObject["class"]:"",
						"classid":_settings.activeXObject["classid"],
						"codebase":_settings.activeXObject["codebase"]
					}).appendTo(objDiv) ;*/
					
					var obj_dom = $("<object />", {
						"width":_settings.activeXObject.width,
						"height":_settings.activeXObject.height,
						"class":"webOffice-obj " + ($.util.exist(_settings.activeXObject["class"])?_settings.activeXObject["class"]:""),
						"classid":_settings.activeXObject["classid"],
						"codebase":_settings.activeXObject["codebase"]
					}) ;
					
					objDiv[0].innerHTML = obj_dom[0] ;
				}
				
				obj = obj_dom[0] ;
				
				var statusBar = $(".webOffice-statusBar", container) ;
				if(statusBar.length==0){
					statusBar = $("<div />", {
						"class":"webOffice-statusBar " + ($.util.exist(_settings.statusBar["class"])?_settings.statusBar["class"]:""),
					}).appendTo(container) ;
				}
				
				obj.settings = _settings ;
				iweboffice[_settings.containerId] = obj ;
				
				$(window).off("unload") ;
				$(window).on("unload", function(){
					for(var key in $.iweboffice.getIweboffices()){
						
						var wo = iweboffice[key] ;
						var wc = wo.WebClose() ;
						
						$.util.log("unload-iWebOffice:" + wc) ;
						try{
						    if (!wc){
						      $("."+wo.settings.statusBar["class"], $("#"+wo.settings.containerId)).html(wo.Status) ;
						    }
						    else{
						    	$("."+wo.settings.statusBar["class"], $("#"+wo.settings.containerId)).html("关闭文档...") ;
						    }
						}
						catch(e){
							alert(e.description);
						}
					}
				});
				
				
				obj.WebUrl=context + iWebOffice2000_apiRequest;      //后台处理页路径，用来执行后台数据处理业务。本属性支持相对路径
				//obj.RecordID="1234";                //文档记录号
				obj.Template="";                    //模板记录号
				//obj.FileName="1234.doc";            //文档名称
				//obj.FileType=".doc";                //文档类型  .doc  .xls
				//obj.UserName="文档编辑人";          //当前操作员
				obj.EditType="1";                   //编辑状态：第一位可以为0,1,2,3其中：0不可编辑；1可以编辑,无痕迹；2可以编辑,有痕迹,不能修订；3可以编辑,有痕迹,能修订。

				obj.MaxFileSize = obj.settings.maxFileSize;         //最大的文档大小控制，默认是8M，现在设置成4M。
				obj.ShowMenu="1";                   //是否显示菜单：1显示；0不显示

				//obj.CreateFile();                   //创建空白文档
				
				
			},
			setTemplate : function(containerId, template){
				var obj = $.iWebOffice2000.getIweboffice(containerId) ;
				obj.Template = template; 
			},
			setShowMenu : function(containerId, showMenu){
				var obj = $.iWebOffice2000.getIweboffice(containerId) ;
				if($.util.isNum(showMenu)){
					obj.ShowMenu = showMenu ;
					return ;
				}
				
				obj.ShowMenu = Constant["ShowMenu"][showMenu] ;
			},
			setEditType : function(containerId, editType){
				var obj = $.iWebOffice2000.getIweboffice(containerId) ;
				if($.util.isNum(editType)){
					obj.EditType = editType ;
					return ;
				}
				
				obj.EditType = Constant["EditType"][editType] ;
			},
			getStatus:function(containerId){
				var obj = $.iWebOffice2000.getIweboffice(containerId) ;
				return obj.Status ;
			},
			openTemplateServerDoc:function(containerId, templateDocName, editUserName){

				$.ajax({
					url : context + iWebOffice2000_createTemplateFileRequest,
					data:{"templateDocName":($.util.exist(templateDocName)?templateDocName:$.iWebOffice2000.Constant.blankDocName["word03"])},
					type : "POST",
					dataType : "json",
					success : function(data) {
						var fileName = data.fileName ;
						var nameWithOutType = fileName.substring(0, fileName.lastIndexOf(".")) ;
						var docType = fileName.substring(fileName.lastIndexOf("."), fileName.length) ;
						
						var obj = $.iWebOffice2000.getIweboffice(containerId) ;
						obj.RecordID = nameWithOutType ;
						obj.FileName = fileName ;
						obj.FileType = docType ;     
						
						if(!$.util.isBlank(editUserName)){
							obj.UserName = editUserName;  
						}
						
						var rs = obj.WebOpen() ;
						var statusBar = $(".webOffice-statusBar", $("#"+obj.settings.containerId)) ;
						if(rs){
							statusBar.html("创建成功！") ;
						}else{
							statusBar.html("创建失败！") ;
						}
						
						obj.settings.callBacks.openTemplateServerDocCallBack(obj, rs) ;
					}
				});
			},
			openServerDoc:function(containerId, fileName, editType, showMenu, editUserName){
				var obj = $.iWebOffice2000.getIweboffice(containerId) ;
				
				var nameWithOutType = fileName.substring(0, fileName.lastIndexOf(".")) ;
				var docType = fileName.substring(fileName.lastIndexOf("."), fileName.length) ;
				
				var obj = $.iWebOffice2000.getIweboffice(containerId) ;
				obj.RecordID = nameWithOutType ;
				obj.FileName = fileName ;
				obj.FileType = docType ;     
				
				if(!$.util.exist(editType)){
					obj.EditType = "1" ;
				}else if($.util.isNum(editType)){
					obj.EditType = editType ;
				}else{
					obj.EditType = Constant["EditType"][editType] ;
				}
				
				if(!$.util.exist(editType)){
					obj.ShowMenu = "1" ;
				}else if($.util.isNum(showMenu)){
					obj.ShowMenu = showMenu ;
				}else{
					obj.ShowMenu = Constant["ShowMenu"][showMenu] ;
				}
				
				if(!$.util.isBlank(editUserName)){
					obj.UserName = editUserName;  
				}
				
				var rs = obj.WebOpen() ;
				var statusBar = $(".webOffice-statusBar", $("#"+obj.settings.containerId)) ;
				
				if(rs){
					statusBar.html("创建成功！") ;
				}else{
					statusBar.html("创建失败！") ;
				}
				
				obj.settings.callBacks.openServerDocCallBack(obj, rs) ;
				
				return rs ;
			},
			saveServerDoc:function(containerId){
				var obj = $.iWebOffice2000.getIweboffice(containerId) ;
				var rs = obj.WebSave() ;
				var statusBar = $(".webOffice-statusBar", $("#"+obj.settings.containerId)) ;
				if(rs){
					statusBar.html("保存成功！") ;
				}else{
					statusBar.html("保存失败！") ;
				}
				return rs ;
			},
			//作用：获取文档页数（VBA扩展应用）
			webDocumentPageCount:function(containerId){
				
				var obj = $.iWebOffice2000.getIweboffice(containerId) ;
				var intPageTotal ;
				
				$.each($.iWebOffice2000.Constant.blankDocName, function(key, val){
					if(obj.FileType.indexOf(val)>-1){
						intPageTotal = obj.WebObject.Application.ActiveDocument.BuiltInDocumentProperties(14);
						return false ;
					}
				});
					  
				if(WebOffice.FileType==".wps"){
					intPageTotal = WebOffice.WebObject.PagesCount();
				}
				
				return intPageTotal ;
			},
			//作用：接受文档中全部痕迹（VBA扩展应用）
			webAcceptAllRevisions:function(containerId){
				var obj = $.iWebOffice2000.getIweboffice(containerId) ;
				var statusBar = $(".webOffice-statusBar", $("#"+obj.settings.containerId)) ;
				
				obj.WebObject.Application.ActiveDocument.AcceptAllRevisions();
				var mCount = obj.WebObject.Application.ActiveDocument.Revisions.Count;
				if(mCount>0){
					statusBar.html("接受痕迹失败！");
				    return false;
				}else{
					statusBar.html("文档中的痕迹已经全部接受！");
				    return true;
				}
			},
			getServerDocName:function(containerId){
				var obj = $.iWebOffice2000.getIweboffice(containerId) ;
				return obj.FileName ;
			}

		});	
		
		function copySeting(opt){
			var tpsettings = $.util.cloneObj(basicSettings) ;
			$.util.mergeObject(tpsettings, opt) ;
			return tpsettings ;
		}
	});
	
})(jQuery);	