// JavaScript Document
//-------------初始化方法-------------
$(function(){
	$("._option").optioncontrol({jugupico:true, insetHtml:setPhotoHtml()});//-------------主页添加好友   分组-------------
	
	ListHoverOption();
	
	setTimeDate();
	$(window).scroll(function(){
		setTimeScroll();
	});
});
jQuery(function() {
    //lazy load
    jQuery("img.lazy").lazyload({ 
        effect : "fadeIn"
    });
    //nav highlight
    /*var str = jQuery('body').attr('id');
    var name = '#' + str.replace(/-163-comjQuery/i, "");
    jQuery(name).addClass('js-crt');*/
});
//-------------方法区-------------
function setPhotoHtml(){
	var Html = "<ul>";
	Html +="<li><a hidefocus=\"true\">删除照片</a></li> ";
	Html +="</ul>";
	return Html;
}
//图片列表  滑过显示操作
function ListHoverOption(){
	$('#DelList .pictureList ').each(function(){
		$(this).hover(function(){
			$(this).find('.pictureList-back').show();
		},function(){
			$(this).find('.pictureList-back').hide();
		});
	});
}
//点击月份  滚动
function setTimeDate(){
	$('#timelineList a').each(function(){
		$(this).click(function(){
			var rol = $(this).attr('data-rol');
			var obj = document.getElementById(rol);
			if($(obj).length > 0){
				$('#timelineList .timeline-il').removeClass('timeline-il-check');
				$(this).parent().parent().addClass('timeline-il-check');
				$('body, html').stop(true,true).animate({scrollTop: $(obj).offset().top}, 1000);
			}
			return false;
		});
	});
}
//滚动知道月份
function setTimeScroll(){
	var DelList = $('#DelList');
	var timelineList = $('#timelineList');
	if(DelList.children().length == timelineList.children().length){
		var thisScroll = $(window).scrollTop();
		var i = 0;
		DelList.children().each(function(index){
				if(thisScroll < $(this).offset().top){
					i = index;
					return false;
				}
		});
		timelineList.children().removeClass('timeline-il-check');
		timelineList.children().eq(i).addClass('timeline-il-check');
	}else{
		alert('数据不一致');
	}
}

















