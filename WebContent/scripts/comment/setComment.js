//-------------初始化方法-------------
/*列表回复*/
$(function(){
	//replayListAddEvent();	
});


//-------------方法区-------------

var clearOver = true;
var original = new Object();

function replayListAddEvent(){
	$('#gallaryContainer input:text').each(function(){
		
		$(this).focus(function(){
			var pare = $(this).parent().parent();
			var textarea = pare.find('textarea');
	
			if(!clearOver){
				clearOver = true;
				original.val('');
				setTextareaBlur(original);
				$(document).unbind('mousedown');
			}
			original = textarea;
			setReplayText($(this));
		});
	});
}

function setReplayText(obj){
	var pare = $(obj).parent().parent();
	var simple = pare.find('.list-yi-simple');
	var complex = pare.find('.list-yi-complex');
	var textarea = pare.find('textarea');
	
	simple.hide();
	complex.show();
	textarea.focus();
	
	setTextareaFont(textarea);
	
	$(document).bind('mousedown',function(event){
		var val = textarea.val();
		var handlerNull = true;
		if(val != ''){
			clearOver = false;
			handlerNull = false;
		}
		elementMouseDown("list-yi-complex", event, handlerNull, function(){
			setTextareaBlur(textarea);
		});
	});
}

function setTextareaBlur(obj){
	var pare = $(obj).parent().parent().parent();
	var simple = pare.find('.list-yi-simple');
	var complex = pare.find('.list-yi-complex');
	
	simple.show();
	complex.hide();
}


function elementMouseDown(className, e, handlerNull, callBack){
	e = e || window.event;   
	var target = e.target || e.srcElement;
	var jug = false;
	while(target.tagName != 'BODY'){
		if(target.getAttribute("class") == className){
			jug=true;
			break;
		}
		target = target.parentNode;	
	};
	if(jug == false && handlerNull == true){
		if(typeof(callBack) =="function")callBack();
		$(document).unbind('mousedown');
	}
}


function createRepalyList(headerImgSrc, userName, content, date){
	var html = "";
	html += "<div class=\"list-replayList\">";
	html += "<a class=\"list-RL-img\"><img src=\""+headerImgSrc+"\"/ onerror=\"javascript:this.src='../images/default_man.jpg'\"></a>";
	html += "<div class=\"list-RL-c\">";
	html += "<div class=\"list-RL-bar\"><span class=\"list-RL-name\"><a href=\"\">"+userName+":</a></span>"+content+"</div>";
	html += "<div class=\"list-RL-time\">"+date+"</div>";
	html += "</div>";
	html += "</div>";
	return html;
}


function returnDateInterval(n, intdate){
	if(typeof(n) != 'number') return;
	//var result = GetDateDiff("2014-01-01 13:00:00", "2014-01-01 21:48:40", "hour");
	intdate = intdate.replace(/\-/g, "/");
	var date = new Date(intdate);
	var hour = date.getHours();
	var minute = date.getMinutes();                                                
	
	var month = date.getMonth();
	var day = date.getDate();

	var text = "";
	switch(n)
	{
		case 0:
			text = "今天-"+hour+":"+minute;
			break;
		case 1:
			text = "昨天-"+hour+":"+minute;
			break;
		case 2:
			text = "前天-"+hour+":"+minute;
			break;
		default:
			text = (month+1)+"月"+day+"号 "+hour+":"+minute;
			break;
	}
	return text;
}
/*$(function(){
	GetDateDiff("2014-12-02 13:10:20","2014-12-02 13:10:20",'day');	
});*/
function GetDateDiff(startTime, endTime, diffType) {
	
	var myDate = new Date();
	console.log(myDate);
	
	startTime = startTime.replace(/\-/g, "/");
	endTime = endTime.replace(/\-/g, "/");
	
	diffType = diffType.toLowerCase();
	var sTime = new Date(startTime);      	//开始时间
	var eTime = new Date(endTime);  		//结束时间
	//作为除数的数字
	var divNum = 1;
	switch (diffType) {
		case "second":
			divNum = 1000;
			break;
		case "minute":
			divNum = 1000 * 60;
			break;
		case "hour":
			divNum = 1000 * 3600;
			break;
		case "day":
			divNum = 1000 * 3600 * 24;
			break;
		default:
			break;
	}
	return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
} 

function setTextareaFont(textareaobj){
	textareaobj.bind('keyup',function(){
		var defultLen = 450;
		$(this).attr('maxlength', defultLen);
		var pare = $(this).parent().parent();
		var b = pare.find('b');	
		var len = $(this).val().length;
		if(len >= defultLen){
			$(this).val($(this).val().slice(0, defultLen-1));
		}
		setTimeout(function(){b.html(len);},100);
	});
}