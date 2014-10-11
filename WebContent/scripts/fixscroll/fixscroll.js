// JavaScript Document
//固定搜索过滤条
$.extend($.fn, {
	fixScroll: function() {
		fixScroll.init.apply(this, arguments);
	}
});

var fixScroll = $.extend({}, {

	init: function(options, node){
		var fixInt = $.extend(true,{
			defultTop:0
		},options||{});
		if(!node) node = this;
		
		ps0 = $(node).offset().top, psL = $(node).offset().left;
	    IntWidth = $(node).width();
		BodyWidth = $('body').width();
		scrollData = 0;
		
		NodeParent = $(node).parent();
		
		$(window).scroll(function(){
			var scrollData = $(document).scrollTop();
			fixScroll.setFixed(fixInt, node, scrollData);
		});
		
		$(window).resize(function(){
			//BodyWidth = $('body').width();
			var NewpsL = NodeParent.offset().left;
			psL = NewpsL;
			if( $(window).scrollTop() >= ps0){
				if($.browser.msie && ($.browser.version == "6.0") && !$.support.style){
					$(node).css({'left':NewpsL});
				}else{
					$(node).css({'left':NewpsL});
				}
			}
		});
		return ;
	},
	setFixed:function(fixInt, node, top){
		if(top >= ps0){
		    if($.browser.msie && ($.browser.version == "6.0") && !$.support.style){
			    $(node).css({'position':'absolute','top':top, 'left':(BodyWidth-IntWidth)*.5-5, 'z-index':222});
			}else{
			    $(node).css({'position':'fixed','top':fixInt.defultTop,'left':psL,'z-index':222,'width':IntWidth,'border-bottom':'0px'});
			}
		}else{
		    $(node).css({'position':'relative','left':'0','top':0,'width':IntWidth});
		}
	}
		
})
