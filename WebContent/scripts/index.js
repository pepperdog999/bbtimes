// JavaScript Document	
//-------------初始化方法-------------
$(function(){
	$('._del').thumb({intNumber:1});//-------------主页大图点击展示方法 查看详细图片-------------
	
	//$("._option").optioncontrol({jugupico:true, insetHtml:setHtml});//-------------主页列表提示操作-------------
	//$("._addGroup").optioncontrol({jugupico:false, insetHtml:groupHtml});//-------------主页添加好友   分组-------------
	//$("._attention").optioncontrol({jugupico:true, insetHtml:attentionHtml,FrameWidth:230});//-------------主页最近更新 查看详细-------------
	
	GatherStyle();//-------------好友  分组 样式切换-------------
	
	//ClassChoiceStyle();//-------------班级相册  选择班级 样式切换-------------
	
	transMesCall();//-------------转发消息 弹出层-------------
	
});

//-------------方法区-------------
function transMesCall(){
	//-------------弹出层提示框-------------
	$('.swichover-replay-kj-zf').each(function(){
		$(this).click(function(){
				try{
					$(this).thumbTip({autoClose:false, defultTitle:'转发内容',iframeSRC:'transpondMes.html',iframeWidth:500,iframeHeight:200});
				}catch(err){
				}
		});	
	});
	
}

//分组 选择样式切换
function GatherStyle(){
	var child = $('#GroupsGather li');
	var moveOvj = $('#GroupsGather .groupup');
	
	child.each(function(){
		$(this).click(function(){
			$(this).siblings().removeClass('group-check');	
			$(this).addClass('group-check');	
			
			var l = $(this).position().left;
			var w = $(this).width();
			var objw = moveOvj.width();
			moveOvj.animate({left:l+w*0.5+objw*0.5},'slow');
			loadGallary($(this).attr("id"));			
		});	
	});
}

//班级相册  选择班级样式切换
function ClassChoiceStyle(){
	var child = $('#groupChild-menu a');	
	child.each(function(index){
		/*if(index == 0){
			if($(this).attr('data-id') != null){
				var thisID = $(this).attr('data-id');
			}
			loadData("getClassGallary",{classID:thisID},lazyLoad);
			pageSize=5;
		}*/
		if($(this).attr('data-id') != null && $(this).attr('class')=='checked'){
			var thisID = $(this).attr('data-id');
			loadData("getClassGallary",{classID:thisID},lazyLoad);
			pageSize=5;
		}
		
		$(this).click(function(){
			$(this).siblings().removeClass('checked');	
			$(this).addClass('checked');
			if($(this).attr('data-id') != null){
				var thisID = $(this).attr('data-id');
			}
			loadData("getClassGallary",{classID:thisID},lazyLoad);
			pageSize=5;
		});	
	});
}











