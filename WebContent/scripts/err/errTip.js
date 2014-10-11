// JavaScript Document								
$.extend($.fn, {
	errTip: function() {
		errTip.init.apply(this, arguments);
	}
});

var errTip = $.extend({}, {

	init: function(options, node){
		var thumbInt = $.extend(true,{
			thumbWidth:450,
			thumbHeight:180,
			thumbTitle:'错误提示',
			thumbContent:'错误内容',
			thumbCallBack:function(){}
		},options||{});

		if(!node) node = this;
		if(thumbInt.thumbTitle == "undefined" || thumbInt.thumbTitle == "thumbContent") return;
			
		thumbInt.$body = $('body');
		thumbInt.$window = $(window);
		
		errTip.setbodySrcoll(thumbInt, true);
		
		thumbInt.bodyw = thumbInt.$body.width();
		thumbInt.bodyh = thumbInt.$body.height();
		thumbInt.RecordTop = thumbInt.$window.scrollTop();
		thumbInt.windowh = thumbInt.$window.height();
		
		thumbInt.isSize = false;
		
		//方法调用 		
		errTip.appendThumb(thumbInt, node);
		
		return this;
	},
	
	setbodySrcoll : function(thumbInt, shut) {
		if(shut){
			thumbInt.$body.css({overflow:'hidden'});
			if($.browser.msie) { 
				$('html').css({overflow:'hidden'});
			}
		}else{
			thumbInt.$body.css({overflow:'auto'});
			if($.browser.msie) { 
				$('html').css({overflow:'auto'});
			}
		}
	},
	
	getHtml :function(title, content, width, height){
		var html = '';
		html += "<div class=\"err_box\">";
		html += "<h5><font>"+title+"</font><span><a title=\"关闭\" class=\"errClose\"></a></span></h5>";
		html += "<div class=\"err_p\" style=\"width:"+width+"px;height:"+height+"px;\">"+content+"</div>";
		html += "<div class=\"err_b\"><button class=\"BtnDisable BtnDeblockingStyle errClose\" data-submit=\"true\">确定</button><button class=\"BtnDisable errClose\">取消</button></div>";
		html += "</div>";
		return html;
	},
	
	scrollFunc :function(){
		var scrollTop = $(window).scrollTop();
		thumb.stop(true,true).animate({top:RecordTop+scrollTop},'fast');
	},
	
	createThumb:function(thumbInt, node){		
		var errBox = document.createElement('div');
		$(errBox).attr('id','errDiv');
		$(errBox).css({width:thumbInt.thumbWidth});
		var conW = thumbInt.thumbWidth-40;
		var conH = thumbInt.thumbHeight-32-39-20;
		//插入内容
		$(errBox).html(errTip.getHtml(thumbInt.thumbTitle, thumbInt.thumbContent, conW, conH));
		return $(errBox);
	},
	
	appendThumb:function(thumbInt, node){
		var obj = errTip.createThumb(thumbInt, node);
		thumbInt.$body.append(obj);//BODY插入内容
		
		var s = errTip.createThumbShadow(thumbInt, node);
		thumbInt.$body.append(s);//BODY shadow	
		
		errTip.setcss(thumbInt, obj, s);
		
		obj.find('.errClose').bind('click',function(){
			errTip.setbodySrcoll(thumbInt, false);
			obj.animate({opacity:0},'fast',function(){$(this).remove();});
			s.remove();	
			if($(this).attr('data-submit') == 'true'){
				thumbInt.thumbCallBack();
				return true;
			}else{
				return false;
			}
		});
		
		thumbInt.$window.resize(function(){
			thumbInt.isSize = true;
			errTip.setcss(thumbInt, obj, s);	
		});
	},
	
	setcss:function(thumbInt, obj, shadow){
		if(thumbInt.isSize) {
			thumbInt.bodyw = thumbInt.$body.width();
			thumbInt.bodyh = thumbInt.$body.height();
			thumbInt.RecordTop = thumbInt.$window.scrollTop();
			thumbInt.windowh = thumbInt.$window.height();
			thumbInt.isSize = false;
		}
		var objWidth = obj.width(),objHeight = obj.height();
		var halfW = (thumbInt.bodyw - objWidth)*0.5;
		var halfH = (thumbInt.windowh - objHeight)*0.5;
		
		obj.css({left:halfW, top:halfH+thumbInt.RecordTop-5});		
		shadow.css({width:thumbInt.bodyw, height:thumbInt.bodyh});
	},
	
	createThumbShadow:function(thumbInt, node){
		var Shadow = document.createElement('div');
		$(Shadow).attr('id','errShadow');
		$(Shadow).css({
			position:'absolute',
			left:'0',
			top:'0',
			width:thumbInt.bodyw,
			height:thumbInt.bodyh,
			opacity:'0',
			'filter':'alpha(Opacity=0)',
			'background-color':'#fff',
			'z-index':'8888'	
		});
		return $(Shadow);
	}
		
})
