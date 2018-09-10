
$.plupload = $.plupload || {};
(function($){
	"use strict";
	
	var uploaders = {} ;
	
	var basicSettings = {
			
	   callBacks:{
		   uploadAllFinish:function(up, finishedFiles, savedErrorFiles, uploadErrorFiles){
			   
		   },
		   multi_file_num_callback:function(max_file_size, totalSize){
			   
		   },
		   filesAdded:function(up, files){
			   
		   }
	   },
			
	   settingType:"basic", //如果有多个setting模块通过这个参数判断copy哪个	
	   init:{
		   BeforeUpload:function(up, file){
			   /**
			    * Hash of key/value pairs to send with every file upload.
			    */
			   $.each(up.settings.customParams, function(key, val){
				   if($.isFunction(val)){
					   up.settings.multipart_params[key] = val(up, file) ;
				   }else{
					   up.settings.multipart_params[key] = val ;
				   }
			   });
			   
			   up.settings.multipart_params["fileName"] = file.name ;
			   up.settings.multipart_params["fileSize"] = file.size ;
			   

		   },
		   Init:function(up){
			   //var containerDomId = $(up.getOption().container).attr("id") ;
			   var containerDomId = up.getOption().container ;
			   uploaders[containerDomId] = up ;
			   
				if (up.runtime === 'html4') {				
					$.plupload.destroy(containerDomId) ;
					$("#"+up.getOption().containerDomId).html("缺失flash,无法使用");
				}
		   },
	       FilesAdded: function(up, files) {

	    	   if(up.settings.multi_file_num>0 && up.files.length>up.settings.multi_file_num){
	    		   up.settings.callBacks.multi_file_num_callback(up.settings.multi_file_num, up.files.length) ;
	    		   
	    		   $.each(files, function(i, val){
	    			   $.plupload.removeFile(up.settings.container, val.id) ;
	    		   });
	    		   
	    		   return ;
	    	   }
	    	   
	    	   
	    	   var fileList = $(up.settings.filelistDom.selector) ;
	            plupload.each(files, function(file) {
	            	var div = '' ;
	            	div += '<div id="'+file.id+'" class="item uploadFile">' ;
	            	 div += '<a href="javascript:void(0)" class="name">' ;
	            	 	div += file.name ;
	            	 div += '</a>' ;
	            	 div += '<span class="size">(' ;
	            	 	div += $.plupload.formatFileSize(file.size) ;
	            	 div += ')</span>' ;
	            	 div += '<span class="schedule">' ;
	            	 
	            	 div += '</span>' ;
	            	 div += '<span class="downloadSpan">' ;
	            	 
	            	 div += '</span>' ;
	            	 div += '<a href="javascript:void(0)" class="uploadDelete rowA">删除</a>' ;
	            	 div += '<span class="err"></span>' ;
	            	div += '</div>' ;
	                fileList.append(div) ;
	            });
	            
	            $(up.settings.totalInfoDom.selector).html('共选择了'+ up.files.length + '个文件；完成了' + $(up.settings.finishlistDom.selector).children().length+"个文件") ;
	            
	            up.settings.callBacks.filesAdded(up, files) ;
	       },
	 
	       UploadProgress: function(up, file) {
	    	   $("#" + file.id).find(".uploadDelete").hide() ;
	    	   if (file.percent != 100) {	    		   
	    		   $("#" + file.id).find(".schedule").html("<em>" + file.percent + "</em>%") ;
	    	   }else{
	    		   $("#" + file.id).find(".schedule").html("<em>正在保存...</em>") ;
	    	   }
	       },
	       FileUploaded:function(up, file, response){

				try {

		    	   var resp = JSON.parse(response.response) ;
		    	   if(resp.returnCode=="0" || resp.returnCode.toLowerCase()=="success"){
		    		   var fdiv = $("#" + file.id) ;
		    		   
		    		   var copy = $.util.cloneObj($("#" + file.id)) ;
		    		   $(copy).addClass("finishedFile") ;
		    		   $(copy).removeClass("uploadFile") ;
		    		   
		    		   $.plupload.removeFile(up.settings.container, file.id) ;
		    		   fdiv.remove() ;
		    		   $(copy).attr("finishedFileId", resp.uploadFileId) ;
		    		   $(copy).find(".uploadDelete").removeClass("uploadDelete").addClass("finishDelete") ;
		    		   
		    		   if(!up.settings.finishlistDom.deleteBtn.init){
		    			   $(copy).find(".finishDelete").hide();
		    		   }else{
		    			   $(copy).find(".finishDelete").show();
		    		   }
		    		   
		    		   $(copy).find(".schedule").html("<em>上传完成</em>") ;
		    		   $(copy).find(".downloadSpan").html('<a href="javascript:void(0)" class="finishDownload rowA">下载</a>') ;
		    		   
		    		   if(!up.settings.finishlistDom.downloadBtn.init){
		    			   $(copy).find(".finishDownload").hide();
		    		   }else{
		    			   $(copy).find(".finishDownload").show();
		    		   }
		    		   
		    		   $(up.settings.finishlistDom.selector).append(copy) ;
		    		   
		    		   $(up.settings.totalInfoDom.selector).html('共选择了'+ up.files.length + '个文件；完成了' + $(up.settings.finishlistDom.selector).children().length+"个文件") ;
		    		   
		    		   var finishedFiles = up.finishedFiles ;
		    		   finishedFiles[resp.uploadFileId] = {
		    		      id:resp.uploadFileId,
		    		      name:file.name
		    		   }
		    		   
		    	   }else{
		    		   $("#" + file.id).addClass("savedError") ;
		    		   $(".schedule", $("#" + file.id)).html("<em>0</em>%") ;
		    		   $(".err", $("#" + file.id)).html("错误："+resp.returnMsg) ;
		    		   $("#" + file.id).find(".uploadDelete").show() ;
		    		   
		    		   var savedErrorFiles = up.savedErrorFiles ;
		    		   savedErrorFiles[file.id] = {
		    		      id:file.id,
		    		      name:file.name
		    		   }
		    	   }


				} catch (e) {
		    		   $("#" + file.id).addClass("savedError") ;
		    		   $(".schedule", $("#" + file.id)).html("<em>0</em>%") ;
		    		   $(".err", $("#" + file.id)).html("错误：服务器保存错误") ;
		    		   $("#" + file.id).find(".uploadDelete").show() ;
		    		   
		    		   var savedErrorFiles = up.savedErrorFiles ;
		    		   savedErrorFiles[file.id] = {
		    		      id:file.id,
		    		      name:file.name
		    		   }			 
				}
	       },
	       
	       FilesRemoved:function(up, files){
	    	   $.each(files, function(i, val){
	    		   $("#" + val.id).remove() ;
	    	   });
	    	   $(up.settings.totalInfoDom.selector).html('共选择了'+ up.files.length + '个文件；完成了' + $(up.settings.finishlistDom.selector).children().length+"个文件") ;
	       },
	       
	       UploadComplete:function(up, files){
	    	   
	    	  var finishedFiles = $.util.cloneObj(up.finishedFiles) ;
	    	  var savedErrorFiles = $.util.cloneObj(up.savedErrorFiles) ;
	    	  var uploadErrorFiles = $.util.cloneObj(up.uploadErrorFiles) ;
	 
	    	   up.settings.callBacks.uploadAllFinish(up, finishedFiles, savedErrorFiles, uploadErrorFiles) ;
	    	   
	    	   up.finishedFiles = {} ;
	    	   up.savedErrorFiles = {} ;
	    	   up.uploadErrorFiles = {} ;
	       },
	 
	       Error: function(up, err) {
	    	   
	    	   var file = err.file ;
	    	   
    		   var uploadErrorFiles = up.uploadErrorFiles ;
    		   uploadErrorFiles[file.id] = {
    		      id:file.id,
    		      name:file.name
    		   }
	    	   
	    	   
	    	   $("#" + file.id).addClass("uploadError") ;
	    	   $("#" + file.id).find(".uploadDelete").show() ;
	    	   var msg = err.message;
	    	   if(err.code=="-600"){
		    	   msg = "不能超过" + up.settings.filters.max_file_size ;
		    	   if($.util.exist(up.settings.alertWindow.$.layerAlert)){
		    		   up.settings.alertWindow.$.layerAlert.alert({
				    	  msg:msg
				       });
		    	   }else if($.util.exist(up.settings.alertWindow.layer)){
		    		   up.settings.alertWindow.layer.open({
						    title: [
						        '提示',
						        'background-color:#ff5151; color:#fff;'
						    ],
						    content: msg
					   });
		    	   }
		    	   
	    	   }
	    	   $(".schedule", $("#" + file.id)).html("<em>0</em>%") ;
	    	   $(".err", $("#" + file.id)).html("错误："+msg) ;
	    	   $("#" + file.id).find(".uploadDelete").show() ;
	    	   $.util.log(err) ;       
	       }
	   },
	   
	   file_data_name : "file", 
	   
	   alertWindow:window,
	   controlBtn:{
		   container:{
			   selector:null,
			   domType:"<div />",
			   className:null  
		   },
		   selectBtn:{
			   selector:null,
			   text:"选择",
			   html:"选择",
			   domType:"<button />",
			   className:null
		   },
		   uploadBtn:{
			   init:true,
			   selector:null,
			   text:"上传",
			   domType:"<button />",
			   className:null,
			   click:function(up){
				   
			   }
		   } 
	   },
	   filelistDom:{
		   selector:null,
		   domType:"<div />",
		   className:null
	   },
	   finishlistDom:{
		   selector:null,
		   domType:"<div />",
		   className:null,
		   deleteBtn:{
			   init:true
		   },
		   downloadBtn:{
			   init:true
		   }
	   },
	   totalInfoDom:{
		   selector:null,
		   domType:"<div />",
		   className:null
	   },
	   customParams:{},
	   multipart_params:{},
	   
	   // 当发生plupload.HTTP_ERROR错误时的重试次数，为0时表示不重试
	   max_retries : 1,
	   /**
	    * Comma separated list of runtimes, that Plupload will try in turn, moving to the next if previous fails.
	    * html4时，无法获取文件大小
	    */
	   runtimes : 'html5,gears,browserplus,flash,html4',
	   /**
	    * 触发文件选择对话框的按钮
	    * 传入jquery selector
	    */
	   browse_button:null,
	   // id of the DOM element to use as a container for uploader structures. Defaults to document.body.
	   container : null,
	   /**
	    * Chunk size in bytes to slice the file into. Shorcuts with b, kb, mb, gb, tb suffixes also supported. e.g. 204800 or "204800b" or "200kb". By default - disabled.
	    * 上传分块每块的大小，这个值小于服务器最大上传限制的值即可。
	    * 对于flash失效，不能分割上传
	    */
	   chunk_size : '1mb',
	   // 当值为true时会为每个上传的文件生成一个唯一的文件名，并作为额外的参数post到服务器端，参数明为name,值为生成的文件名。
	   unique_names : true,
	   
	   url:null,
	   /**
	    * Enable ability to select multiple files at once in file dialog.
	    */
	   multi_selection : true,
	   /**
	    * 默认队列最大文件数，0为不限制
	    */
	   multi_file_num : 0,
	   /**
	    * Enable resizng of images on client-side. Applies to image/jpeg and image/png only. e.g. {width : 200, height : 200, quality : 90, crop: true}
	    */
	   // resize : {width : 320, height : 240, quality : 90,crop : true},
	   flash_swf_url : context + '/common/library/plupload/js/Moxie.swf',
	   silverlight_xap_url : context + '/common/library/plupload/js/Moxie.xap',
	   // 可以使用该参数来限制上传文件的类型，大小等，该参数以对象的形式传入
	   filters:{
			// Specify what files to browse for
			// mime_types: [
			//     {title : "Image files", extensions : "jpg,gif,png"},
			//     {title : "Zip files", extensions : "zip"}
			// ],
			// 用来限定上传文件的大小，如果文件体积超过了该值，则不能被选取
			max_file_size : '10mb'
		    // 不允许选取重复文件
		    // prevent_duplicates : true
	  }

	}
	
	
	jQuery.extend($.plupload, {
		init:function(settings){
			init(settings) ;
		},
		getBasicSettings:function(){
			return $.util.cloneObj(basicSettings) ;
		},
		formatFileSize:function(fileSize){
			return plupload.formatSize(fileSize);
		},
		destroy:function(containerDomId){
			var up = uploaders[containerDomId] ;
			if($.util.exist(up)){
				up.destroy() ;
				delete uploaders[containerDomId] ;
			}
		}, 
		getUploader:function(containerDomId){
			return uploaders[containerDomId] ;
		},
		refresh:function(containerDomId){
			var up = uploaders[containerDomId] ;
			if($.util.exist(up)){
				up.refresh();
			}
		},
		disableBrowse:function(containerDomId, disable){
			var up = uploaders[containerDomId] ;
			if($.util.exist(up)){
				up.disableBrowse(disable) ;
			}
		},
		start:function(containerDomId){
			var up = uploaders[containerDomId] ;
			if($.util.exist(up)){
				up.start() ;
			}
		},
		removeFile:function(containerDomId, fileId){
			
			var up = uploaders[containerDomId] ;
			if($.util.exist(up)){
				var file = up.getFile(fileId) ;
				up.removeFile(file) ;
			}
		}
	});	
	
	function init(opt){
		
		var settings = copySeting(opt) ;
		createDom(settings) ;

		var uploader = new plupload.Uploader(settings) ;
		uploader.init() ;
		
		uploader.finishedFiles = {} ;
		uploader.savedErrorFiles = {} ;
		uploader.uploadErrorFiles = {} ;
	}
	
	function copySeting(opt){
		var tpsettings = $.util.cloneObj(basicSettings) ;
		$.util.mergeObject(tpsettings, opt) ;
		return tpsettings ;
	}
	
	function createDom(settings){
		var ctn = $("#" + settings.container) ;

		//button所在div
		var controlBtnCtn = $(settings.controlBtn.container.selector) ;
		if(controlBtnCtn.length==0){
			controlBtnCtn = $(settings.controlBtn.container.domType,{
				"class":"container-upload-btn"
			}).prependTo(ctn) ;			
			settings.controlBtn.container.selector = controlBtnCtn ;
		}
		$(controlBtnCtn).addClass(settings.controlBtn.container.className) ;
		//选择按钮
		var selectBtn = $(settings.controlBtn.selectBtn.selector) ;
		if(selectBtn.length==0){
			selectBtn = $(settings.controlBtn.selectBtn.domType, {
				text:settings.controlBtn.selectBtn.text,
				"class":"container-upload-btn-select"
			}).appendTo(controlBtnCtn) ;
			settings.controlBtn.selectBtn.selector = selectBtn ;
		}
		$(selectBtn).addClass(settings.controlBtn.selectBtn.className) ;	
		if(!$.util.isBlank(settings.controlBtn.selectBtn.html)){
			$(selectBtn).html(settings.controlBtn.selectBtn.html) ;
		}
		settings.browse_button = selectBtn[0] ;
		
		if(settings.controlBtn.uploadBtn.init){
			//上传按钮
			var uploadBtn = $(settings.controlBtn.uploadBtn.selector) ;
			if(uploadBtn.length==0){
				uploadBtn = $(settings.controlBtn.uploadBtn.domType, {
					text:settings.controlBtn.uploadBtn.text,
					"class":"container-upload-btn-upload"
				}).appendTo(controlBtnCtn) ;
				settings.controlBtn.uploadBtn.selector = uploadBtn ;
			}
			$(uploadBtn).addClass(settings.controlBtn.uploadBtn.className) ;	
			if(!$.util.isBlank(settings.controlBtn.uploadBtn.html)){
				$(uploadBtn).html(settings.controlBtn.uploadBtn.html) ;
			}
			$(uploadBtn).on("click", function(){
				var _up = $.plupload.getUploader(settings.container) ;
				var _settings = _up.settings ;
				var flag = _settings.controlBtn.uploadBtn.click(_up) ;
				if(flag==false){
					
				}else{
					$.plupload.start(_settings.container) ;
				}
				
			});	
		}
	

		//完成的div
		var finishlistDom = $(settings.finishlistDom.selector) ;
		if(finishlistDom.length==0){
			finishlistDom = $(settings.finishlistDom.domType, {
				"class":"container-finishlistDom"
			}).appendTo(ctn) ;
			settings.finishlistDom.selector = finishlistDom ;
		}
		$(finishlistDom).addClass(settings.finishlistDom.className) ;	
		
		//正在上传的div
		var filelistDom = $(settings.filelistDom.selector) ;
		if(filelistDom.length==0){
			filelistDom = $(settings.filelistDom.domType, {
				"class":"container-filelistDom"
			}).appendTo(ctn) ;
			settings.filelistDom.selector = filelistDom ;
		}
		$(filelistDom).addClass(settings.filelistDom.className) ;	
		
		//上传信息
		var totalInfoDom = $(settings.totalInfoDom.selector) ;
		if(totalInfoDom.length==0){
			totalInfoDom = $(settings.totalInfoDom.domType, {
				"class":"container-totalInfoDom"
			}).appendTo(ctn) ;
			settings.totalInfoDom.selector = totalInfoDom ;
		}
		$(totalInfoDom).addClass(settings.totalInfoDom.className) ;	
		
		$(document).on("click", "#" + settings.container + " .uploadDelete", function(){
			var id = $(this).parents(".uploadFile").attr("id") ;
			$.plupload.removeFile(settings.container, id) ;
		});
	}
	
	$(document).ready(function(){
		
		
		
		
	});
})(jQuery);	





