$.audioPlayer = $.audioPlayer || {};
;(function($){
	"use strict";
	var windowObj = {};
	var basicSettings = {
		id : "soundControl",
		src : context + "/common/library/audioPlayer/resource/short.mp3",
		loop : "false",
		autoplay : "false"
	}
	function copySetting(opt){
		var tpsettings = $.util.cloneObj(basicSettings);
		$.util.mergeObject(tpsettings, opt);
		return tpsettings;
	}
	
	jQuery.extend($.audioPlayer, { 
		init:function(settings){
			var _settings = null;
			if(settings != null){
				_settings = copySetting(settings);				
			}else{
				_settings = $.util.cloneObj(basicSettings);
			}
			if(windowObj[_settings.id] == null){
				windowObj[_settings.id] = _settings;
			}else{
				return;
			}
			var str = "<audio id='"+_settings.id+"' src='"+_settings.src+"' hidden='true'";
			if(_settings.loop == "true"){
				str += "loop='true'";
			}
			if(_settings.autoplay == "true"){
				str += "autoplay='true'";
			}
			str += "controls='controls'></audio>";
			$("body").append(str);
		},
		getSetting:function(settings){
			return $.util.cloneObj(basicSettings);
		},
		changeMusic:function(playerName,src){
			$("#"+playerName).attr("src",src);
		},
		loop:function(playerName,str){
			$("#"+playerName).attr("loop",str);
		},
		autoplay:function(playerName,str){
			$("#"+playerName).attr("autoplay",str);
		},
		play:function(playerName){
			if(playerName == null){
				playerName = basicSettings.id;
			}
			$("#"+playerName)[0].play();
		},
		pause:function(playerName){
			if(playerName == null){
				playerName = basicSettings.id;
			}
			$("#"+playerName)[0].pause();
		},
		stop:function(playerName){
			if(playerName == null){
				playerName = basicSettings.id;
			}
			$("#"+playerName)[0].pause();
			$("#"+playerName)[0].load();
			$("#"+playerName)[0].pause();
		}
	});	
})(jQuery);	