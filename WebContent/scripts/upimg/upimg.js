// JavaScript Document								
$.extend($.fn, {
	upImg: function() {
		upImg.init.apply(this, arguments);
	}
});

var upImg = $.extend({}, {
	
	init: function(options, node){
		var thumbInt = $.extend(true,{
			thumbWidth:600,
			Url:'upImg.html'
		},options||{});

		if(!node) node = this;
		$body = $('body');
		
		if(document.getElementById('thumbShadow')){
			shadow.remove();
			thumb.remove();
		}
		
		RecordTop = 0;
		
		$body.css({overflow:'hidden'});
		if($.browser.msie) { 
			$('html').css({overflow:'hidden'});
		}
		w = $body.width();
		h = $body.height();
		
		if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) { 
			windowH = window.screen.availHeight;
			scrollTop = document.body.scrollTop;
		}else{
			windowH = $(window).height();
			scrollTop = $(window).scrollTop();
		}
		
		
		upImg.appendThumbShadow(thumbInt, node);
		
		upImg.createThumb(thumbInt, node);
		/*$(document).scroll(function(){
			upImg.scrollFunc();
		});*/
		return this;
	},
	scrollFunc :function(){
		var scrollTop = $(window).scrollTop();
		thumb.stop(true,true).animate({top:RecordTop+scrollTop},'fast');
	},
	createThumb:function(thumbInt, node){
		var Html = "<div id=\"UpImgdate\">";
    	Html +="</div>";
		
		$body.append($(Html));	
		thumb = $('#UpImgdate');
		
		thumb.load(encodeURI(thumbInt.Url),function(){
			
				objW = thumb.width();
				objH = thumb.height();
				
				
				thumb.css({top:(windowH-objH)*0.5+scrollTop,left:(w-objW)*0.5});
				
				$(window).resize(function(){
					thumb.css({top:($(window).height()-objH)*0.5+scrollTop,left:($body.width()-objW)*0.5});
					shadow.css({width:$body.width(),height:$body.height()});
				});
				RecordTop = thumb.position().top;
				thumb.find('.Close').click(function(){
					if(document.getElementById('thumbShadow')){
						$body.css({overflow:'auto'});
						if($.browser.msie) { 
							$('html').css({overflow:'auto'});
						}
						shadow.remove();
						thumb.animate({opacity:0},'fast',function(){
							 $(this).remove();
						});
					}
				});
		
		});
		
	},
	appendThumbShadow:function(thumbInt, node){
		var s = upImg.createThumbShadow(thumbInt, node);
		$body.append(s);	
		$(s).click(function(){
			//thumbTip.closeThumb();	
		});
	},
	createThumbShadow:function(thumbInt, node){
		var Shadow = document.createElement('div');
		$(Shadow).attr('id','thumbShadow');
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
		shadow = $(Shadow);
		return $(Shadow);
	},
	closeThumb:function(){
		if(document.getElementById('thumbShadow')){
			shadow.remove();
			thumb.animate({opacity:0},'fast',function(){
				 $(this).remove();
			});
		}
	},
	autoClose:function(thumbTipInt, node){
		
	}
		
})
