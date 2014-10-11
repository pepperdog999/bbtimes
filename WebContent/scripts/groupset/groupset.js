// JavaScript Document
$(function(){
	getgroup();//人员列表 操作是否删除 是否转组 点击样式替换
	
	
	$("._operation").optioncontrol({jugupico:false, direction:'right', insetHtml:setGroupOptionHtml(), FrameWidth:260});//-------------人员设置 点击提示删除 等等操作-------------
	
});

//-------------方法区-------------
function setGroupOptionHtml(){
	var Html = "<div class=\"adjustgroup\">";
    Html += "<h2 class=\"adjustgroup-t\">调动人员调组</h2>";
    Html += "<div class=\"adjustgroup-c\">";
    Html += "<label><i class=\"radio-ico radio-ico-check\"></i>闺蜜</label>";
	Html += "<label><i class=\"radio-ico\"></i>自定义</label>";
	Html += "<label><i class=\"radio-ico\"></i>闺蜜</label>";
    Html += "</div>";
	Html += "</div>";
	return Html;
}

function moveGroupfun(){
	var obj = $('#MoveGroupBtn');
	if(obj.hasClass('BtnDeblockingStyle')){
		obj.optioncontrol({jugupico:false, direction:'right', insetHtml:setGroupOptionHtml(), FrameWidth:260});//-------------人员设置
	}else{
		obj.unbind('click');
	}

}

function getgroup(e){
	var objlist = $('#groupList');
	//$('#groupList').children();
	if(objlist.children().length > 0 && objlist.attr('data-fixed') == 'false'){
		objlist.children().each(function(){
			$(this).click(function(e){
				if($(this).attr('data-check') == 'false'){
					$(this).removeClass('groupSetList-style');
					$(this).addClass('groupSetList-style-on');
					$(this).find(".groupSetList-style-ico").show();
					$(this).attr('data-check','true');
				}else{
					$(this).removeClass('groupSetList-style-on');
					$(this).addClass('groupSetList-style');
					$(this).attr('data-check','false');
				}
				setOperationShow();//显示 或者 屏蔽 删除转移操作
				setoperationcheckbox();//过滤全选
			});
			
			$(this).hover(function(){
				$(this).find(".groupSetList-style-ico").show();	
				},function(){
					if($(this).attr('data-check') == 'false'){
						$(this).find(".groupSetList-style-ico").hide();
					}
			});
				
				
		});
		
		
	}else{
		objlist.find('._operation').hide();
	}
	
}


function setOperationShow(){
	var objlist = $('#groupList');
	var btn = $('#operationBtn');
	if(objlist.children().length > 0 && objlist.find('.groupSetList-style-on').length > 0){
		btn.find('a').addClass('BtnDeblockingStyle');
	}else{
		btn.find('a').removeClass('BtnDeblockingStyle');
	}
	
	moveGroupfun();// 人员转组 按钮 点击事件
}
$(function(){
	setGroupMenuStyle();//群组菜单 滑过显示 对群组的'删除' '重命名'操作
});
function setGroupMenuStyle(){
	var groupMenu = $('#groupMenu');
	groupMenu.children().each(function(){
		$(this).hover(function(){
			if($(this).find('span').length > 0){
				$(this).find('span').show();
			}
		},function(){
				$(this).find('span').hide();
		});	
	});
}
function checkAll(obj){
	var objlist = $('#groupList');
	if(obj.checked == false){
		objlist.children().each(function(){
			$(this).removeClass('groupSetList-style-on');
			$(this).addClass('groupSetList-style');
			$(this).find(".groupSetList-style-ico").hide();
			$(this).attr('data-check','false');
		});
		obj.checked = '';
	}else{
		objlist.children().each(function(){
			$(this).removeClass('groupSetList-style');
			$(this).addClass('groupSetList-style-on');
			$(this).find(".groupSetList-style-ico").show();
			$(this).attr('data-check','true');
		});
		obj.checked = 'checked';
	}
	setOperationShow();
}
function setoperationcheckbox(){
	var checkbox = $('#operationcheckbox');
	if($(checkbox).attr('checked') == 'checked'){
		$(checkbox).attr('checked',false);
	}
}

function reName(obj){
	//var groupMenu = $('#groupMenu');
	var box = $(obj).parent().parent();
	var val = box.find('code').html();
	var w = box.find('code').width();
	var inp = creatText(val,w,box.find('code'));
	box.find('code').html(inp);
	box.find('input').focus();
}
function creatText(val,wid,box){
	var text = document.createElement('input');
	text.setAttribute('type','text');
	text.setAttribute('class','inputStyle');
	text.setAttribute('value',val);
	text.style.width = wid +'px';
	
	text.onblur = function(){
		Textblur(this,box);
	}
	return text;
}
function Textblur(obj,box){
	var v = obj.value.replace(/(^\s*)|(\s*$)/g, ""); 
	box.html(v.toUpperCase());
}
function reMove(obj){
	$(obj).parent().parent().remove();
}
