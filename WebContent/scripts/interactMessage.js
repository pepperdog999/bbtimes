// JavaScript Document
$(function(){
	
	setMenuStyle("interMes-menu", "checked");
	
});


function setIsSingleSend(obj){
	var list = $("#interMes-userList");
	if(obj.attr("data-single") == "false"){
		list.attr("data-single","false");
		list.find("font").show();
		list.children().removeClass("checkLi");
	}else{
		list.attr("data-single","true");
		list.find("font").hide();
	}
}


function urlLinkInfor(){
	$('#inforBox').load("../interact/messageList");
}

function urlLinkAddress(){
	$('#inforBox').load("../interact/addressBook");
}

function setMenuStyle(id, className){
	var obj = document.getElementById(id);
	$.each($(obj).children(),function(){
		$(this).bind("click",function(){
			$(this).siblings().removeClass(className);	
			$(this).addClass(className);
			
			var urlFun = $(this).attr("data-urlFun");
			if(urlFun == undefined)return;
			eval('('+urlFun+')')();
			//setIsSingleSend($(this));
		});	
	});
}


function setChangeStyle(id, className){
	var obj = document.getElementById(id);
	
	$.each($(obj).children(), function(){
		$(this).bind("click",function(){
			if($(obj).attr("data-single") == "true"){
				$(this).siblings().removeClass(className);	
				$(this).addClass(className);
			}else{
				var i = $(this).find("i");
				if(i.hasClass("checked")){
					i.removeClass("checked");
				}else{
					i.addClass("checked");
				}
				
				var selectObj = $("#interMes-userList");
				if(selectObj.find(".checked").length == 0 ){
					$(".ressMesTip").show();
					$(".ressMes").hide();
					$(".ressMes-more").hide();
				}else if(selectObj.find(".checked").length == 1 ){
					var selectedLi =selectObj.find(".checked").parent().parent();
					changeUser($(selectedLi).attr("data-id"),$(selectedLi).find("p").html());
					$(".ressMesTip").hide();
					$(".ressMes").show();
					$(".ressMes-more").hide();
				}else if(selectObj.find(".checked").length > 1 ){
					$(".ressMesTip").hide();
					$(".ressMes").hide();
					$(".ressMes-more").show();
				}
			}
			
		});	
	});
}


function setClassContent(){
	var classObj = $("#interMes-userClassList");
	var moveObj = $("#userClass-move");
	$.each(classObj.children(), function(){
		$(this).bind("click",function(){
			getClassUser($(this).attr("data-id"),$(this).attr("data-name"));
			$(this).siblings().removeClass("checkLi");	
			$(this).addClass("checkLi");
			moveObj.animate({left:'-225px'},300);
		});	
	});
}

function turnToClass(){
	var obj = $("#turnBackClass");
	var moveObj = $("#userClass-move");
	obj.bind("click",function(){
		moveObj.animate({left:'0px'},300);
	});
}


function setAllSelect(){
	var obj = $("#allSelect");
	var selectObj = $("#interMes-userList i");
	obj.bind("click",function(){
		if($(this).attr("data-all") == "false"){
			$(this).find("i").addClass("checked");
			selectObj.addClass("checked");
			$(this).attr("data-all","true");
			$(".ressMesTip").hide();
			$(".ressMes").hide();
			$(".ressMes-more").show();
		}else{
			$(this).find("i").removeClass("checked");
			selectObj.removeClass("checked");
			$(this).attr("data-all","false");
			$(".ressMesTip").show();
			$(".ressMes").hide();
			$(".ressMes-more").hide();
		}
	});
}