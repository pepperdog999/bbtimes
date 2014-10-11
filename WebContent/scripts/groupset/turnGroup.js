// JavaScript Document								
$.extend($.fn, {
	thumbTip: function() {
		thumbTip.init.apply(this, arguments);
	}
});

var thumbTip = $.extend({}, {

	init: function(options, node){
		var thumbTipInt = $.extend(true,{
			autoClose:false,
			defultTitle:'undefined',
			defultDelayTime:5,
			iframeWidth:600,
			iframeHeight:280
		},options||{});

		if(!node) node = this;
		
		RecordTop = 0;
		
		thumbTip.appendThumbShadow(thumbTipInt, node);
		thumbTip.createThumb(thumbTipInt, node);
		$(document).scroll(function(){
			thumbTip.scrollFunc();
		});
		return this;
	},
	scrollFunc :function(){
		var scrollTop = $(window).scrollTop(); 
		$('#thumbTip').stop(true,true).animate({top:RecordTop+scrollTop},'fast');
	},
	createThumb:function(thumbTipInt, node){
		var Html = "<div id=\"thumbTip\">";
		Html += "<div class=\"thumbTip_bar\">";
    	Html +="<h5><span>"+thumbTipInt.defultTitle+"</span></h5>";
        Html +="<div class=\"turngroupCon\"><iframe width='"+thumbTipInt.iframeWidth+"' height='"+thumbTipInt.iframeHeight+"' marginwidth='0' marginheight='0' hspace='0' vspace='0' frameborder='0' scrolling='auto' allowtransparency='true'  style='background-color:transparent;' src='allocation.html'></iframe></div>";
		Html +="<div class=\"turngroupBtn\"><a class=\"sure\">确认</a><a class=\"cancel thumbTip_close\">取消</a></div>";
		if(thumbTipInt.autoClose == true){
			Html +="<div class=\"thumbTip_autoClose\"><font>"+thumbTipInt.defultDelayTime+"</font>秒后自动关闭</div>";
		};
    	Html +="</div></div>";
		
		$('body').append(Html);	
		
		var w = $('body').width();
		var h = $('body').height();
		var thumbTip = $('#thumbTip');
		
		objW = thumbTip.width();
		objH = thumbTip.height();
		windowH = $(window).height();
		scrollTop = $(window).scrollTop();
		
		thumbTip.css({top:(windowH-objH)*0.5+scrollTop,left:(w-objW)*0.5});
		$(window).resize(function(){
			thumbTip.css({top:($(window).height()-objH)*0.5+scrollTop,left:($('body').width()-objW)*0.5});
			$('#thumbShadow').css({width:$('body').width(),height:$('body').height()});
		});
		RecordTop = thumbTip.position().top;
		thumbTip.find('.thumbTip_close').click(function(){
			if(document.getElementById('thumbShadow')){
				$('#thumbShadow').remove();
				$('#thumbTip').animate({opacity:0},'fast',function(){
					 $(this).remove();
				});
			}
		});
		//自动设置
		if(thumbTipInt.autoClose == true){
			var i = thumbTipInt.defultDelayTime;
			Auto = window.setInterval(function(){
				i = i - 1;
				$('#thumbTip .thumbTip_autoClose').html("<font>"+i+"</font>秒后自动关闭");
				if(i == 0){
					window.clearInterval(Auto);
					if(document.getElementById('thumbShadow')){
						$('#thumbShadow').remove();
						$('#thumbTip').animate({opacity:0},'fast',function(){
							 $(this).remove();
						});
					}
				}
			},1000);
		}
	},
	appendThumbShadow:function(thumbTipInt, node){
		var s = thumbTip.createThumbShadow(thumbTipInt, node);
		$('body').append(s);	
		$(s).click(function(){
			//thumbTip.closeThumb();	
		});
	},
	createThumbShadow:function(thumbTipInt, node){
		var Shadow = document.createElement('div');
		$(Shadow).attr('id','thumbShadow');
		var w = $('body').width();
		var h = $('body').height();
		$(Shadow).css({
			position:'absolute',
			left:'0',
			top:'0',
			width:w,
			height:h,
			opacity:'.05',
			'filter':'alpha(Opacity=5)',
			'background-color':'#000',
			'z-index':'8888'	
		});
		return $(Shadow);
	},
	closeThumb:function(){
		if(document.getElementById('thumbShadow')){
			$('#thumbShadow').remove();
			$('#thumbTip').animate({opacity:0},'fast',function(){
				 $(this).remove();
			});
		}
	},
	autoClose:function(thumbTipInt, node){
		
	}
		
})
