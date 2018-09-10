
$.zTreeMenu = $.zTreeMenu || {};
(function($){
	
	"use strict";
	
	var trees = {} ;
	
	var asyncSetting = {
			async: {
				enable: true,
				global:false,
				url:null,
				autoParam:["id=ztreeNodeId", "pId=ztreeParentNodeId", "ztreeDiyMap=diyMap"],
				otherParam:null,
				dataFilter: filter
			},				
			check: {
				enable: true,
				chkStyle: "checkbox",
				radioType: "all",
				chkboxType: {"Y":"", "N":""}
			},
			view: {
				fontCss: getFontCss,
				selectedMulti:false,
				dblClickExpand: false
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: "0"
				}
			},
			callback : {
				onCheck:onCheck
			}
	};
	
	var localSetting = {
		check: {
			enable: true,
			chkStyle: "checkbox",
			radioType: "all",
			chkboxType: {"Y":"", "N":""}
		},
		view: {
			fontCss: getFontCss,
			selectedMulti:false,
			dblClickExpand: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onCheck: onCheck
		}			
	}
	
	
    var defaultCustomSetting = {
		ul:{
			"class":null
		},
		key:{
			"class":null
		},
		async:{
			enable:false,
			requestData:null
		},			
	    inputDom:{
	    	selector:null,
	    	setNameAuto:true  
	    },
	  	check:{
	  		//type:"onlySelectChildren"
	  		type:null
	  	},
	  	callBacks:{
	  		formatNodeData:function(nodeData){
	  			
	  		},
	  		customizedOnCheck:function(e, treeId, treeNode){
	  			
	  		}
	  	}
	}
	
	$(document).ready(function() {	
		
		$(document).on('keyup change', '.ztree-MenuContent-key', function () {
			var key = $(this) ;
			var ztreeId = key.parents(".ztree-MenuContent").attr("ztreeId") ;
			searchNode(key, ztreeId) ;
		});	
    });
	
	function highlightNodes(treeId) {
		var treeObj = $.zTreeMenu.getTree(treeId) ;
		var zTree = treeObj.tree;
		var nodeList = zTree.nodeSearchList ;
		for( var i=0, l=nodeList.length; i<l; i++) {
			nodeList[i].highlight = true;
			zTree.updateNode(nodeList[i]);
		}
	}
	
	function searchNode(key, treeId){

		var treeObj = $.zTreeMenu.getTree(treeId) ;

		var zTree = treeObj.tree;
		var value = $.trim($(key).val());

		var keyType = "name";
		
		if (zTree.lastSearchValue === value) return;
		zTree.lastSearchValue = value ;
		
		var nodes = zTree.transformToArray(zTree.getNodes());
		$.each(nodes, function(i, val){
			val.highlight = false;
			zTree.updateNode(val);
		});
		if (value === "") {
			return;
		}
		
		zTree.nodeSearchList = zTree.getNodesByParamFuzzy(keyType, value);
		
		highlightNodes(treeId);
	}
	
	function getFontCss(treeId, treeNode){
		return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
	}
	
	function init(domId, url, customSetting, zTreeSetting){
		
		if(!customSetting){
			customSetting = {} ;
		} 
		
		customSetting = copySeting(customSetting, defaultCustomSetting) ;
		
		if($.util.exist(trees[domId])){
			return trees["ztree-MenuContent-" + domId] ;
		}
		
		var body = $("body") ;
		
		var menuContent = $(".ztree-menu") ;
		
		if(menuContent.length==0){
			menuContent = $("<div />", {
				"class":"ztree-menu"
			}).appendTo(body) ;
		}
		
		var menu = $("#ztree-MenuContent-" + domId, menuContent) ;
		if(menu.length==0){
			menu = $("<div />", {
				"id":"ztree-MenuContent-" + domId,
				"class":"ztree-MenuContent",
				"ztreeId":"ztree-MenuContent-ul-" + domId
			}).appendTo(menuContent) ;
		}
		
		var key = $(".ztree-MenuContent-key", menu) ;

		if(key.length==0){
			key = $("<input />", {
				"type":"text",
				"id":"ztree-MenuContent-key-" + domId,
				"class":"ztree-MenuContent-key form-control input-sm"
			}).appendTo(menu) ;
		}
		
		if(customSetting["key"]["class"]){
			key.addClass(customSetting["key"]["class"]) ;
		}
		
		var ztreeul = $(".ztree-MenuContent-ul", menu) ;
		if(ztreeul.length==0){
			ztreeul = $("<ul />", {
				"id":"ztree-MenuContent-ul-" + domId,
				"class":"ztree ztree-MenuContent-ul"
			}).appendTo(menu) ;
		}
		
		if(customSetting["ul"]["class"]){
			ztreeul.addClass(customSetting["ul"]["class"]) ;
		}
		
		var obj = {} ;
		trees["ztree-MenuContent-ul-" + domId] = obj ;
		
		if(customSetting && customSetting.async.enable){
			var setting = copySeting({}, asyncSetting) ;
			if(zTreeSetting){
				setting = copySeting(zTreeSetting, asyncSetting) ;
			}
			setting.async.url = url;
			setting.async.otherParam = customSetting.async.requestData;
			obj.tree = $.fn.zTree.init($("#ztree-MenuContent-ul-" + domId), setting);
		}else{
			var setting = copySeting({}, localSetting) ;
			if(zTreeSetting){
				setting = copySeting(zTreeSetting, localSetting) ;
			}
			
			$.each(customSetting.zNodes, function(i, val){
				customSetting.callBacks.formatNodeData(val) ;
			});
			
			obj.tree = $.fn.zTree.init($("#ztree-MenuContent-ul-" + domId), setting, customSetting.zNodes);
		}
		
		obj.tree.lastSearchValue = "" ;
		obj.tree.nodeSearchList = [] ;
		obj.tree.customSetting = customSetting ;
		obj.treeul = ztreeul;
		obj.key = key;
		obj.bindDom = $("#" + domId) ;
		obj.menu = menu ;
		obj.inputDom = $($("#" + domId));
		if(customSetting.inputDom.selector){
			obj.inputDom = $(customSetting.inputDom.selector) ;
		}

		obj.showMenu = function(){

			var _tree = this.tree ;
			if(!$.util.exist(_tree)){
				return ;
			}
			
			var _treeul = this.treeul ;
			var _key = this.key ;
			var _bindDom = this.bindDom ;
			var _menu = this.menu ;
			
			var ofst = _bindDom.offset();
	
			_menu.css({left:ofst.left + "px", top:ofst.top + _bindDom.outerHeight() + "px"}).slideDown("fast");
			
			$("body").on("mousedown", onBodyDown);
		}
	}
	
	function filter(treeId, parentNode, childNodes) {
		var treeObj = $.zTreeMenu.getTree(treeId) ;
		var tree = treeObj.tree ;
		var customSetting = tree.customSetting ;
		
		var nodeData = childNodes.ztreeList ;
		
		$.each(nodeData, function(i, val){
			customSetting.callBacks.formatNodeData(val) ;
		});
		
		return nodeData;
	}
	
	function beforeAsync(treeId, treeNode) {
		
	}
	function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
		
	}
	
	function onAsyncSuccess(event, treeId, treeNode, msg) {
	
	}
	
	function onCheck(e, treeId, treeNode) {

		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		
		var customSetting = treeObj.customSetting ;
		
		if(customSetting && customSetting.check && customSetting.check.type=="onlySelectChildren"){
			var tmp = treeNode ;
			while(tmp && tmp.getParentNode()){
				var pn = tmp.getParentNode() ;
				treeObj.checkNode(pn, false, true);
				tmp = pn ;
			}
			
			var tmpArr = treeObj.getNodesByParam("pId", treeNode.id, treeNode);
			
			
			while(tmpArr.length>0){
				
				var tmp = tmpArr ;
				tmpArr = [] ;
				$(tmp).each(function(i, val){
					treeObj.checkNode(val, false, true);
					
					var cdNodes = treeObj.getNodesByParam("pId", val.id, val) ;
					if(cdNodes && cdNodes.length>0){
						$.merge( tmpArr, cdNodes ) ;
					}
					
				});
				
			}
		}
		
		if(customSetting.inputDom.setNameAuto){
			var tobj = $.zTreeMenu.getTree(treeId);
			var data = $.zTreeMenu.getCheckedValue(treeId);
			$(tobj.inputDom).val(data.showNames) ;
		}
		
		customSetting.callBacks.customizedOnCheck(e, treeId, treeNode) ;
	}
	
	function getCheckedNodes(bindedDomIdOrZtreeId){
		var treeObj = $.zTreeMenu.getTree(bindedDomIdOrZtreeId) ;
		if(!$.util.exist(treeObj)){
			return [] ;
		}
		var tree = treeObj.tree;
		return tree.getCheckedNodes(true);
	}
	
	function getCheckedValue(bindedDomIdOrZtreeId){

		var nodes = $.zTreeMenu.getCheckedNodes(bindedDomIdOrZtreeId) ;

		var data = {} ;
		var showNames = "" ;
		var ids = [] ;
		$(nodes).each(function(i ,val){
			if(i==0){
				showNames += val.name ;
			}else{
				showNames += "，" + val.name ;
			}
			var v = {
				id:val.id,
			    name:val.name,
			    diyMap:val.diyMap
			} ;
			ids.push(val.id) ;
			data[val.id] = v;
		});
		if(showNames.length==0){
			showNames = null ;
		}
		
		return {"showNames":showNames, "ids":ids, "data":data} ;
	}
	
	function onBodyDown(event) {
		var className = event.target.className ;
		if(!$.util.isString(className)){
			hideMenu();
		}else if (!(className.indexOf("ztree-menu-btn")>=0 || 
				className.indexOf("ztree-menu-input")>=0 || 
				className.indexOf("ztree-MenuContent")>=0 || 
				$(event.target).parents(".ztree-MenuContent").length>0)) {
			hideMenu();
		}
	}
	
	function destroy(bindedDomIdOrZtreeId){
		var treeObj = $.zTreeMenu.getTree(bindedDomIdOrZtreeId) ;
		
		if(!treeObj){
			return ;
		}
		
		var tree = treeObj.tree;
		var id = tree.setting.treeId;
		$.fn.zTree.destroy(id);
		
		treeObj.menu.remove() ;
		
		delete trees[id] ;
	}
	
	function hideMenu() {
		$(".ztree-MenuContent").fadeOut("fast");
		$("body").off("mousedown", onBodyDown);
	}
	
	jQuery.extend($.zTreeMenu, { 
		destroy:destroy,
		init:init,
		getTree:function(bindedDomIdOrZtreeId){
			if(bindedDomIdOrZtreeId.indexOf("ztree-MenuContent-ul-")!=-1){
				return trees[bindedDomIdOrZtreeId];
			}
			return trees["ztree-MenuContent-ul-" + bindedDomIdOrZtreeId];
		},
		getTrees:function(){
			return trees;
		},
		getCheckedNodes:getCheckedNodes,
		getCheckedValue:getCheckedValue
	});
	
	function copySeting(opt, basicSettings){
		var tpsettings = $.util.cloneObj(basicSettings) ;
		$.util.mergeObject(tpsettings, opt) ;
		return tpsettings ;
	}
	
})(jQuery);	