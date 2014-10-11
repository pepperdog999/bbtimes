// JavaScript Document								
$.extend($.fn, {
	optioncontrol: function() {
		optioncontrol.init.apply(this, arguments);
	}
});

var optioncontrol = $.extend({}, {

	init: function(options, node){
		var optionInt = $.extend(true,{
			FrameWidth:95,
			jugupico:false,
			insetHtml:function(){},
			direction:'left',
			defMarginTop:0
		},options||{});

		if(!node) node = this;
		var $body = $('body');
		
		//if(node.length > 0){return true;}
		$(node).each(function(){
			
			$(this).click(function(e){

					if($('#optionDiv').length < 1){
						$body.append(optioncontrol.getHtml(optionInt, node));
					}
					var optionFrame = $('#optionDiv');
					
					optionFrame.css({width:optionInt.FrameWidth});
					optionFrame.find('.optionDiv-b').html('');
					optionFrame.find('.optionDiv-b').append(optionInt.insetHtml.call($(this)));
					var thisLeft = $(this).offset().left;
					var thisTop = $(this).offset().top;
					var thisWidth = $(this).outerWidth();
					var thisHeight = $(this).outerHeight();
					
					var objectWidth = optionFrame.width();
					optionFrame.css({
						left:thisLeft-objectWidth+thisWidth,
						top:thisTop+thisHeight
					});
					
					if(optionInt.direction == 'right'){
						optionFrame.css({
							left:thisLeft
						});
					}
					if(optionInt.jugupico == true){
						optionFrame.css({
							left:thisLeft-objectWidth*0.5+thisWidth*0.5
						});
					}
					
					/*close*/
					$(document).bind('mousedown',function(e){
						setMouse(e,'optionDiv',true);	
					});
					//阻止冒泡
					stopBubble(e);
					return false;
			});
		});
		return this;
	},
	getHtml:function(optionInt, node){
		var Html = "<div id=\"optionDiv\">";
		if(optionInt.jugupico == true){
			Html += "<h5><i class='icons'></i></h5>";
		}
		Html += "<div class='optionDiv-b'>";
		Html +="</div>";
		Html +="</div>";
		return Html;
	}
	
})
function setMouse(e, id, remove){
	e = e || window.event;   
	var target = e.target || e.srcElement;
	var _save = target;
	var jug = false;
	var _o = document.getElementById(id);
	while(_save.tagName != 'BODY'){
		if(_save.id == id){
			jug=true;
			break;
		}
		_save = _save.parentNode;	
	};
	if(jug == false){
		if(document.getElementById(id)){
			if(remove == true){
				document.body.removeChild(document.getElementById(id));
			}else{
				document.getElementById(id).style.display = 'none';
			}
		}
		 if(e && e.stopPropagation){
         	 e.stopPropagation();//停止非IE冒泡和捕获事件
			 e.preventDefault();//取消IE默认事件
          }else{
         	 window.event.cancelBubble = true;//停止IE冒泡事件
			 swindow.event.returnValue = true;//取消非IE默认事件
          }
		
		$(document).unbind('mousedown');
	}
}
//阻止冒泡
function stopBubble(e) {  
    var e = e ? e : window.event;  
    if (window.event) { // IE  
        e.cancelBubble = true;   
    }else{ // no ies     
        e.stopPropagation();   
    }   
}