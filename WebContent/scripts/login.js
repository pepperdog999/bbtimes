// JavaScript Document

$(function(){
	
	rememberFun();
	
	setLoginInput();
});

function setLoginInput(){
	$('#LoginBox .login_inp').each(function(){
		var $this = $(this);
		var input = $this.find('input');
		var span = $this.find('span');
		var val = input.val().replace(/(^\s*)|(\s*$)/g,'');		
		if(val != '')
		span.hide();
		input.bind('focus', function(){
			span.hide();
		}).bind('blur', function(){
			if($(this).val() == null || $(this).val() == ''){
				span.show();
			}
		});
	});
}

function rememberFun(){
	$('#LoginBox .login_remember').bind('click',function(){
		if($(this).attr('data-check') == 'true'){
			$(this).find('i').addClass('unChecked');
			$(this).attr('data-check','false');
			return false;
		}else{
			$(this).find('i').removeClass('unChecked');
			$(this).attr('data-check','true');
			return true;
		}
	});
}