
(function($){
	$(document).ready(function() {	
		accordionInit()
	});
	
	function accordionInit(){
		
		$("#accordion").children("h3").each(function(){
			var n = $(this).next();
			var flag = false ;
			if(n.length==0 || (n.length>0 && n[0].tagName.toLowerCase()!="div")){
				$("<div />").insertAfter(this) ;
			}
		});

		$( "#accordion" ).accordion({ 
			active: parseInt(clickOrder),
			heightStyle: "content"
		});	
		
		$("#accordion").show() ;
		
		$(document).on('click',"#accordion div ul li a", function () {
			
			$("#accordion div ul li a").each(function(i, val){
				$(val).removeClass("clickActive") ;
			})
			
			$(this).addClass("clickActive") ;
			
			var clickA = this ;
			var ul = $(clickA).parents("ul") ;
			var liArr = $(ul).children() ;
			$(liArr).each(function(i, val){
				if($(val).find("a")[0] === clickA){
					clickListOrder = i.toString() ;
				}
			});
			
			var myHref = $(this).attr("myHref") ;
			if(myHref!=null && myHref.length>0){
				var mylocation = $.util.fmtUrl(myHref, null) ;
				location.href = mylocation ;
			}
			
			
//			var myH3 = $(this).parent().parent().parent().prev()[0] ;
//			var allH3 = $("#accordion").find("h3") ;
	//
//			var clickOrder = 0 ;
//			var clickListOrder = 0 ;
//			$(allH3).each(function(i, val){
//			
//				if(myH3==val){
//					clickOrder = i ;
//				}
//			});
			
		});
		
		$("body").on('click',"#accordion h3", function () {
			var thisH3 = this ;
			var h = $("#accordion").find("h3") ;
			$(h).each(function(i, val){	
				if(val==thisH3){
					clickOrder = i.toString() ;
				}
			});
			
			var h3Href = $(this).attr("myHref") ;
			if(!$.util.isBlank(h3Href)){
				var mylocation = $.util.fmtUrl(h3Href, null) ;
				location.href = mylocation ;	
			}else{
				var h3A = $(thisH3).find("a") ;
				if(h3A.length>0){
					var myHref = $(h3A).attr("myHref") ;
					if(myHref!=null && myHref.length>0){
						var mylocation = $.util.fmtUrl(myHref, null) ;
						location.href = mylocation ;
					}
				}
			}
		});
		
		var h = $("#accordion").find("h3") ;
		$(h).each(function(i, val){
			if(clickOrder == i.toString()){
				var div = $(val).next() ;
				var lis = $(div).find("ul li") ;
				$(lis).each(function(i, val){
					if(i == parseInt(clickListOrder)){
						$(val).find("a").addClass("clickActive") ;
					}
				});
			}			
		});
	}
	
})(jQuery);	




