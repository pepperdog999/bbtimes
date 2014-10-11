// JavaScript Document
$(function(){
		
	radioChoiceToShow();
	
	AllCheck();//反选
	
});

//选择"公开"  还是"指定群组"
function radioChoiceToShow() {
	var radio = $('#upload-choice'),sim = $('#upload-simpleList'), del = $('#upload-delList'),list = $('#uploadGroupList');
	
	radio.find('input:radio').each(function(){
		$(this).click(function(){
				if($(this).attr('data-publicity') == 'true'){
					sim.hide();
					del.hide();
				}else{
					sim.hide();
					del.show();
					//调用  左边群组列表  参数返回加载后返回方法
					list.children().memberListElement({callBack:setMemberListElement}); 
				}
		});	
	});
}


//判断是否点击的 是确定   还是取消 按钮
function closeUploadList(obj, callBack) {
	var sim = $('#upload-simpleList');
	var del = $('#upload-delList');
	
	if(del.is(':visible')) del.hide();
	sim.show();
	
	if($(obj).attr('data-submit') != 'true') return; //判断是否为确定按钮  执行下面代码
	if(typeof(callBack) == 'function') callBack();
}


//点击确定按钮后执行方法
function submitGroupLsit(){
	var list = $('#uploadGroupList'),simList = $('#upload-simpleList .upload-simpleList'),hiddenMemberData = $('#hiddenMemberData');
	
	simList.html('');
	//返回给后台人员ID 数据
	var dataArray = new Array();
	list.children().each(function(){
		var name = $(this).find('em').html();
		var num = $(this).find('b').html();
		var id = $(this).attr('id');
		if(num != 0){
			simList.append("<a data-id=\""+id+"\">（"+name+"["+num+"]）</a>");
		}
		var val = $(this).attr('data-array');
		if(val == '') return;
		dataArray = dataArray.concat(stringToObject(val));
	});
	dataArray = unique(dataArray);
	hiddenMemberData.val(dataArray); //返回给隐藏域 数据
	
	uploadSimpeListFunction();       //返回方法
}


//给添加在列表添加事件
function uploadSimpeListFunction() {
	var sim = $('#upload-simpleList'),del = $('#upload-delList'),list = $('#uploadGroupList'),
	simList = $('#upload-simpleList .upload-simpleList');
	
	if(simList.children().length < 1) return;
	simList.children().each(function(){
		$(this).click(function(){
			sim.hide();	
			del.show();	
			var thisID = $(this).attr('data-id');
			var o;
			list.children().each(function(){
				if(thisID == $(this).attr('id')) {
					o = $(this);
					return false;
				}
			});
			//调用  左边群组列表  参数返回加载后返回方法
			list.children().memberListElement({fixObject:o,callBack:setMemberListElement}); 
		});	
	});
}


//去除数组重复元素 空元素
function unique(data){  
    var n = {},r=[]; //n为hash表，r为临时数组
	for(var i = 0; i < data.length; i++) //遍历当前数组
	{
		if (!n[data[i]] && data[i] !="") //如果hash表中没有当前项
		{
			n[data[i]] = true; //存入hash表
			r.push(data[i]); //把当前数组的当前项push到临时数组里面
		}
	}
	return r;
}


 //设置列表选择  反选样式
function setMemberListElement() {
	//初始化全选按钮  为'未选中'
	$('#selectAll').attr('checked',false);
	var listBox = $('#memberList');
	var groupID = listBox.attr('data-groupid');
	var obj =  document.getElementById(groupID);
	if(typeof($(obj).attr('data-Array')) == 'undefined') $(obj).attr('data-Array','');
	
	listBox.children().each(function(){
		$(this).hover(function(){
			if($(this).find('.groupSetList-style-ico').is(':hidden')){
				$(this).find('.groupSetList-style-ico').show();
			}else{
				if($(this).attr('data-check') == 'false'){
					$(this).find('.groupSetList-style-ico').hide();
				}else{
					$(this).find('.groupSetList-style-ico').show();
				}
			}
		});	
		
		$(this).click(function(){
			var thisString = $(obj).attr('data-array');
			var thisArray = new Array();
			if(thisString != null && thisString !=""){
				thisArray = stringToObject(thisString);
			}
			
			var id = $(this).attr('id');
			if($(this).attr('data-check') == 'false'){
				$(this).addClass('groupSetList-style-on').removeClass('groupSetList-style');
				$(this).find('.groupSetList-style-ico').show();
				$(this).attr('data-check','true');
								
				var repeat = false;
				for(var i=0,len=thisArray.length; i<len; i++) {
					if(thisArray[i] == id){
						repeat = true;
						break;
					}
				}
				if(!repeat) thisArray.push(id);
			}else if($(this).attr('data-check') == 'true'){
				$(this).removeClass('groupSetList-style-on').addClass('groupSetList-style');
				$(this).find('.groupSetList-style-ico').show();
				$(this).attr('data-check','false');
				
				var n;
				for(var i=0,len=thisArray.length; i<len; i++) {
					if(thisArray[i] == id){
						n = i;
						break;
					}
				}
				thisArray.splice(n,1);
			}
			$(obj).find('i').html("已选(<b>"+(thisArray.length)+"</b>)");
			$(obj).attr('data-array',objectToString(thisArray));
		});	
	});
}

function  AllCheck(){
	var listBox = $('#memberList');
	var selectAll = $('#selectAll');
	selectAll.bind('click',function(){
		
		if(listBox.find('.groupSetList-style-on').length > 0){
		}
		
		if($(this).attr('checked') == "checked"){
			listBox.children().removeClass('groupSetList-style').addClass('groupSetList-style-on').attr('data-check','true');
			listBox.find('.groupSetList-style-ico').show();
			
			var o = listBox.attr('data-groupID');
			var obj = document.getElementById(o);
			$(obj).find('i').html("已选(<b>"+listBox.children().length+"</b>)");
			var myArray = new Array();
			$.each(listBox.children(),function(i){
				myArray[i] = $(this).attr('id');	
			});
			var textID = myArray.join('|');
			$(obj).attr('data-Array',textID);
		}else{
			listBox.children().removeClass('groupSetList-style-on').addClass('groupSetList-style').attr('data-check','false');
			listBox.find('.groupSetList-style-ico').hide();
			
			var o = listBox.attr('data-groupID');
			var obj = document.getElementById(o);
			$(obj).find('i').html("已选(<b>"+0+"</b>)");
			$(obj).attr('data-Array','');
		}
		
	});
	
}


//点击加载列表   初始化  加载列表
$.extend($.fn, {
	memberListElement: function() {
		memberListElement.init.apply(this, arguments);
	}
});

var memberListElement = $.extend({}, {
	init: function(options, node){
		var optionInt = $.extend(true,{
			fixObject:'undefined',
			callBack:function(){}
		},options||{});

		if(!node) node = this;
		var $body = $('body');
		
		//初始化加载数据
		var intObject;
		if(optionInt.fixObject == 'undefined'){
			intObject = $(node).eq(0);	
		}else{
			intObject = optionInt.fixObject;	
		}
		memberListElement.analysisGroupList(optionInt, intObject);
		//注册点击事情
		$(node).each(function(){
			$(this).click(function(e){	
				var $this = $(this);
				memberListElement.analysisGroupList(optionInt, $this);				
			});
		});
		return this;
	},
	
	analysisGroupList : function(optionInt, obj){
		
		var memberList = $('#memberList');
		//群组样式变换
		memberListElement.elementClickEvent($(obj));
		
		memberList.html("<p style='text-align:center;margin-top:50px;'>数据加载中...</p>");
		var ID = $(obj).attr('id');
		$.ajax({
				type:"GET",
				async: true,
				dataType:"json", 
				url:"../user/getGroupUsers",
				data:{groupID:ID},
				success:function(data){
					var dataArray = data.data;
					var headerFix = data.headerFix;
					var resourceUrl = data.resourceUrl;
					var text = memberListElement.iterationHtml(dataArray, headerFix, resourceUrl, $(obj));
					
					memberList.html(text);
					memberList.attr('data-groupid',ID);
					
					//加载数据后 返回方法
					optionInt.callBack.call(ID);
				}
		});
	},
	
	iterationHtml:function(data, headerFix, resourceUrl, obj){
		var text = '';
		
		var t = memberListElement.elementAttrData($(obj));
		if(!t) var isOn = false;
		
		$.each(data, function(index , value){
			var id = data[index].userID;
			var imgURL = resourceUrl+data[index].userID+headerFix;
			var name = data[index].DisplayName;
			var identity = data[index].userType;
			
			if(t){
				$.each(t, function(index , value){
					if(id == value){
						isOn = true;
						return false;
					}
				});
			}
			text += memberListElement.assembleHtml(id, imgURL, name, identity, isOn);
			isOn = false;
		});
		return text;
	},
	
	assembleHtml:function(id, imgURL, name, identity, isOn){
		var Html = '';
		if(isOn){
			Html +="<div class=\"groupSetList-style-on upload-groupSetList\" id=\""+id+"\" data-check=\"true\">";
		}else{
			Html +="<div class=\"groupSetList-style upload-groupSetList\" id=\""+id+"\" data-check=\"false\">";
		}
		Html +="<div class=\"groupSetList-style-k\">";
		Html +="<div class=\"groupSetList-styleImg\"><img src=\""+imgURL+"\" onerror=\"javascript:this.src=\'../images/default_man.jpg\'\"/></div>";
		Html +="<div class=\"groupSetList-styleFont\">";
		Html +="<h5>"+name+"</h5>";
		Html +="<p><span class=\"_operation\"><font>"+identity+"</font></span></p>";
		Html +="</div>";
		Html +="</div>";
		if(isOn){
			Html +="<a href=\"javascript:void(0)\" class=\"icons groupSetList-style-ico\" style=\"display:inline-block\"></a>";
		}else{
			Html +="<a href=\"javascript:void(0)\" class=\"icons groupSetList-style-ico\"></a>";
		}
		Html +="</div>";
		return Html;
	},
	
	elementClickEvent:function(obj){
		$(obj).siblings().removeClass('checked');	
		$(obj).addClass('checked');			
	},
	
	elementAttrData :function(obj){
		if(typeof($(obj).attr('data-Array')) == 'undefined')
			$(obj).attr('data-Array','');
		if($(obj).attr('data-Array') != ''){
			var data = $(obj).attr('data-Array');
			var intData = data.split('|');
			if(intData instanceof Array){
				return intData;
			}
		}else{
			return false;
		}
	}
	
})

function stringToObject(stringObject){
	if(Object.prototype.toString(stringObject) != "[object Object]"){
		return true;
	}
	var thisArray = stringObject.split('|');
	if(thisArray instanceof Array){
		return thisArray;
	}else{
		return false;
	}
}

function objectToString(arrayObject){
	if(!(arrayObject instanceof Array)){
		return true;
	};
	var str = arrayObject.join('|');
	return str;
}


