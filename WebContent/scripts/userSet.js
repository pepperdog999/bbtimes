// JavaScript Document
$(function(){
	$('#editHeader').click(function(){
		implement();
	});	
});

function implement(){
	try{
		$(window).upImg({Url:'../utlity/upUserImg.html'});
	}catch(err){
	}
}

function IERemoveEvent(){
	oEventUtil.RemoveEventHandler(this,'readystatechange');
}