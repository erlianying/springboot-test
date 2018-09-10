$.comet = $.comet || {};
;(function($) {
	"use strict";
	
	var comets = {
			
	};

	var USERID_SUFFIX = "-USERID_SUFFIX-" ;
	
	var basicConfigureOpt = {
		configure:{
            url:null,
            logLevel:'debug'
		}
	}

	var listeners = {} ;
	var subscribes = {} ;

    /**
	 * 连接多个cometd
     * var cometd1 = $.cometd; // The default cometd object
     * var cometd2 = new $.CometD(); // A second cometd object
	 * Configure and handshake
     * cometd1.init('http://host1:8080/cometd');
     * cometd2.init('http://host2:9090/cometd');
	 * Configure extensions for the second object
     * cometd2.registerExtension('ack', new org.cometd.AckExtension());
     * cometd2.registerExtension('timestamp', new org.cometd.TimeStampExtension());
     * cometd2.registerExtension('timesync', new org.cometd.TimeSyncExtension());
     * cometd2.registerExtension('reload', new org.cometd.ReloadExtension());
     */


    function init(id){
    	if($.util.isBlank(id)){
    		throw "id 不能为空" ;
    		return ;
		}

        if( comets[id]!=null){
            throw "id 已存在！" ;
            return ;
        }

    	var comet = {
    		id:id,
    		cometd:new $.CometD(),
			listeners:{},
            subscribes:{}
		} ;

        comets[id] = comet ;

        comet.configure = function(configureOpt){
            var tpsettings = $.util.cloneObj(basicConfigureOpt) ;
            $.util.mergeObject(tpsettings, configureOpt) ;

            var cometd = this.cometd ;
            cometd.configure(tpsettings.configure);
		}

		comet.handshake = function(handshakeSettings){
            /**
             *
             * 	handshakeSettings = {
			 *		additional:{
			 *			credentials: {
			 *				clientid:"" //必须
			 *			}
			 *
			 *		},
			 *		handshakeSuccess:function(handshakeReply){
			 *
			 *		},
			 *		handshakeError:function(handshakeReply){
			 *
			 *		}
			 *	}
             *
             *
             */

            var hs = $.util.cloneObj(handshakeSettings) ;

            if(hs.useClientIdSuffix==true){
                //if(handshakeSettings.useClientIdSuffix==null || handshakeSettings.useClientIdSuffix==true){
                if(hs.additional!=null && hs.additional.credentials!=null && hs.additional.credentials.clientid!=null){
                    var now = new Date() ;
                    hs.additional.credentials.clientid+=USERID_SUFFIX+now.getTime();
                    hs.additional.credentials.clientidWithSuffix = hs.additional.credentials.clientid;
                }
            }

            var cometd = this.cometd;

            var handshake = cometd.handshake(hs.additional, function(handshakeReply){
                if(handshakeReply.successful){
                    $.util.log("连接服务器成功:");
                    $.util.log(handshakeReply) ;
                    handshakeSettings.handshakeSuccess(handshakeReply) ;
                }else{
                    $.util.log("连接服务器失败:");
                    $.util.log(handshakeReply) ;
                    handshakeSettings.handshakeError(handshakeReply) ;
                }
            });

            return handshake ;
        }

        comet.addListener = function(settings){
            /**
             * settings = {
			 * 	 url:url
			 *   msgCallBack:function(message){
			 *
			 *   }
			 * }
             *
             * 由于addListener添加的是service频道的话，是持久化的不需要要写在handshake的回调里
             * add一次就行了
             */
			/*            if(!$.util.isBlank(settings.id) && listeners[settings.id]!=null){
			 var oldListener = listeners[settings.id] ;
			 $.comet.removeListener(oldListener);
			 }*/

			var cometd = this.cometd ;

            var listener = cometd.addListener(settings.url, function(message){
                settings.msgCallBack(message) ;
            });

/*            if(!$.util.isBlank(settings.id)){
                this.listeners[settings.id] = listener ;
            }*/

            return listener ;
        }

        comet.removeListener = function(listener){
            var cometd = this.cometd ;
            cometd.removeListener(listener);
        }

        comet.subscribe = function(settings){
            /**
             * settings = {
			 * 	 url:url
			 * 	 additional:{
			 *
			 * 	 },
			 *   msgCallBack:function(message){
			 *
			 *   },
			 *   repyCallBack:function(subscribeReply){
			 *
			 *   }
			 * }
             * subscribe订阅的频道不是持久化的所以要写在handshake回调里，每次握手成狗以后都要订阅一下
             */

			/*            if(!$.util.isBlank(settings.id) && subscribes[settings.id]!=null){
			 var oldSubscribe = subscribes[settings.id] ;
			 $.comet.unsubscribe(oldSubscribe);
			 }*/

            var cometd = this.cometd ;

            var subscribe = cometd.subscribe(settings.url, function(message) {
                settings.msgCallBack(message) ;
            }, settings.additional, function(subscribeReply){
                settings.repyCallBack(subscribeReply) ;
            });

/*            if(!$.util.isBlank(settings.id)){
                this.subscribes[settings.id] = subscribe ;
            }*/

            return subscribe ;
        }

        comet.unsubscribe = function(subscribe){
            var cometd = this.cometd ;
            cometd.unsubscribe(subscribe);
        };

        return comet ;
    }


	
	jQuery.extend($.comet, {
		init:init,
		getBasicSettings:function(){
			return $.util.cloneObj(basicSettings) ;
		}
		
	});	

})(jQuery);
