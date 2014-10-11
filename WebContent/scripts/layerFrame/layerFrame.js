// JavaScript Document	
/*
自动创建错误提示层
先自动创建框架  定位  通过iframe调用错误提示页面
*/							
// 创建一个闭包  
(function($) {  
  // 插件的定义  
  $.fn.thumbTip = function(options) {  
		//debug(this);  
		// build main options before element iteration  
		var opts = $.extend({}, $.fn.thumbTip.thumbTipInt, options);  
		// iterate and reformat each matched element  
		var node;
		if(!node)node = this;
		
		$body = $('body');
		$body.css({overflow:'hidden'});
		if($.browser.msie) {
			$('html').css({overflow:'hidden'});
		}
		
		shadow = new Object();
		RecordTop = 0;
		w = $('body').width();
		h = $('body').height();

		$.fn.thumbTip.appendThumbShadow(opts, node);
		$.fn.thumbTip.createThumb(opts, node);
	
  };  
  // 私有函数：debugging  
  function debug($obj) {  
		if(window.console && window.console.log){
			window.console.log('hilight selection count: ' + $obj.size());  
		}
  };  
  // 定义暴露format函数 
  $.fn.thumbTip.createThumb = function(thumbTipInt, node) { 
  		
		var thumb = $.fn.thumbTip.createHtml(thumbTipInt, node);
  		$body.append(thumb); 
		
		var objW = $(thumb).width();
		var objH = $(thumb).height();
		
		var windowH = $(window).height();
		var scrollTop = $(window).scrollTop();
		
		//window.console.log('thumb count: ' + $(thumb).size());  
		$(thumb).css({top:(windowH-objH)*0.5+scrollTop,left:(w-objW)*0.5});
		
		$(window).resize(function(){
			$(thumb).css({top:($(window).height()-objH)*0.5+scrollTop,left:($body.width()-objW)*0.5});
			shadow.css({width:$body.width(),height:$body.height()});
		});
		
		RecordTop = $(thumb).position().top;
		$(thumb).find('.thumbTip_close').click(function(){
			if(shadow.length > 0){
				shadow.remove();
				$(thumb).animate({opacity:0},'fast',function(){$(this).remove();});
				//clear body's overflow
				$body.css({overflow:'auto'});
				if($.browser.msie) {
					$('html').css({overflow:'auto'});
				}
			}
		});
		
		//设置时间  自动关闭提示层
		if(thumbTipInt.autoClose == true){
			var i = thumbTipInt.defultDelayTime;
			Auto = window.setInterval(function(){
				i = i - 1;
				$(thumb).find('.thumbTip_autoClose').html("<font>"+i+"</font>秒后自动关闭");
				if(i == 0){
					window.clearInterval(Auto);
					if(shadow.length > 0){
						shadow.remove();
						$(thumb).animate({opacity:0},'fast',function(){$(this).remove();});
					}
				}
			},1000);
		}
  };
  $.fn.thumbTip.createHtml = function(thumbTipInt, node) {  
    	var Html = "<div class=\"thumbTip_bar\">";
    	Html +="<h5><span>"+thumbTipInt.defultTitle+"</span><font><a href='javascript:void(0)' class='thumbTip_close'></a></font></h5>";
        Html +="<div class=\"turngroupCon\"><iframe width='"+thumbTipInt.iframeWidth+"' height='"+thumbTipInt.iframeHeight+"' marginwidth='0' marginheight='0' hspace='0' vspace='0' frameborder='0' scrolling='auto' allowtransparency='true'  style='background-color:#fff;' src='"+encodeURI(thumbTipInt.iframeSRC)+"'></iframe></div>";
		if(thumbTipInt.autoClose == true){
			Html +="<div class=\"thumbTip_autoClose\"><font>"+thumbTipInt.defultDelayTime+"</font>秒后自动关闭</div>";
		};
		Html +="<div class=\"turngroupBtn\"><a class=\"sure\">确认</a><a class=\"cancel thumbTip_close\">取消</a></div>";
    	Html +="</div>";
		
		var b = document.createElement('div');
		$(b).attr('id','thumbTip');
		$(b).html(Html);
		return b;
  };
  $.fn.thumbTip.appendThumbShadow = function(thumbTipInt, node) {  
    	var s = $.fn.thumbTip.createThumbShadow(thumbTipInt, node);
		$body.append(s);
		shadow = $(s);	
		$(s).click(function(){//$.fn.thumbTip.closeThumb();
		});
  };  
  $.fn.thumbTip.createThumbShadow = function(thumbTipInt, node) {  
    	var Shadow = document.createElement('div');
		$(Shadow).attr('id','thumbShadow');
		$(Shadow).css({
			position:'absolute',
			left:'0',
			top:'0',
			width:w,
			height:h,
			opacity:'.03',
			'filter':'alpha(Opacity=3)',
			'background-color':'#000',
			'z-index':'8888'	
		});
		return Shadow;
  };  
  // 插件的defaults  
  $.fn.thumbTip.thumbTipInt = {  
    	autoClose:false,
		defultTitle:'undefined',
		defultDelayTime:5,
		iframeWidth:500,
		iframeHeight:120,
		iframeSRC:'allocation.html'  
  };  
// 闭包结束  
})(jQuery);