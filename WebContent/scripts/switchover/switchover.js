// JavaScript Document
function setCommentHeight(){
	var right = $("#swichoverRight");
	var num = right.height();
	var intH = 0;
	right.find('.rightset').children().each(function(){
			intH += $(this).height();
	});
	intH = intH+15+20;
	var args = true;
	if($('#swichoverDialogMain').is(':hidden')) args = false;
	if(args == true){
		var defultNumberRight =  18*2+91;
	}else{
		var defultNumberRight =  18*2;
	}
	if(intH > num - defultNumberRight){
		right.find('.rightset').css({height:num - defultNumberRight});
	}else{
		right.find('.rightset').css({height:intH});
	}
}

function replayHtml(){
	var Html = "<div class=\"swichover-an\" id=\"swichoverDialogBox\">";
    Html +="<div class=\"swichover-an-f\">";
    Html += "<div class=\"swichover-an-te\"><textarea name=\"\" cols=\"\" rows=\"\">我说一句</textarea></div>";
    Html += "</div>";
    Html += "<div class=\"swichover-an-b\"><button class=\"Btn01 NewBtnstyle01\">发表</button><span class=\"swichover-an-bf\"><span>0</span>/<span>450</span></span></div>";
    Html += "</div>";
	return Html;
}

function swichoverHover(){
	$('#swichoverList .swichover-hover').each(function(){
		$(this).hover(function(){
			$(this).find('.arrow').show();
		},function(){
			$(this).find('.arrow').hide();
		});

		$(this).click(function(){
			if($('#swichoverRight .swichover-an').length >= 1){
				if($('#swichoverDialogMain').is(':visible')){
					$('#swichoverDialogMain').hide();	
				}
				$('#swichoverDialogBox').remove();
			}
			if($(this).attr('data-tol') == 'true'){
				$(this).parent().append(replayHtml());
			}else{
				$(this).parent().parent().append(replayHtml());
			}
			
			setCommentHeight();
			$(document).bind('mousedown',function(e){
				setMouseClose(e,'swichoverList','swichoverDialogBox');
			});
		});	
	});
}

function setMouseClose(e,id,closeId){
	e = e || window.event;   
	var target = e.target || e.srcElement;
	var _save = target;
	var jug = false;
	while(_save.tagName != 'BODY'){
		if(_save.id == id){
			jug=true;
			break;
		}
		_save = _save.parentNode;	
	};
	if(jug == false){
		$("#"+closeId+"").remove();
		 if(e && e.stopPropagation){
         	 e.stopPropagation();
          }else{
         	 window.event.cancelBubble = true;
          }
		e.preventDefault();
		$(document).unbind('mousedown');
		//回调方法
		$('#swichoverDialogMain').show();
		setCommentHeight();	
		
	}
}