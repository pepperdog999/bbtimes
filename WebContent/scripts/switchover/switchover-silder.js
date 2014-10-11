// JavaScript Document							
$.extend($.fn, {
	froSilder: function() {
		froSilder.init.apply(this, arguments);
	}
});

var froSilder = $.extend({}, {

	init: function(options, node){
		var silderInt = $.extend(true,{
			defultNum:0,
			defultChildWidth: 50,
			defultChildSpace: 5,
			isAnimate: true,
			wiseSize : '0deg'//旋转定义值
		},options||{});

		if(!node) node = this;
		
		if(silderInt.defultNum == "undefined"){
			silderInt.defultNum = 0;
		}
		
		var childObject = {
			 silderImg : $('#silderImg'),
			 clockwise : $('#clockwise'),
			 anticlockwise : $('#anticlockwise'),
			 silder : $('#silder'),
			 prev : $(node).find('.silder-prev'),
			 next : $(node).find('.silder-next'),
			 content : $(node).find('.silder-content'),
			 move : $(node).find('.silder-move')
		}
		
		//设置小图    左右上一页 下一页 点击事件
		froSilder.Intstate(silderInt, node, childObject);
		
		//设置小图列表点击事件
		froSilder.childClick(silderInt, node, childObject);
		
		//点击下一张图片切换
		froSilder.NextPictrueChange(silderInt, node, childObject);
		
		//点击上一张图片切换
		froSilder.PrevPictrueChange(silderInt, node, childObject);
		
		//点击图片旋转
		froSilder.wiseEvent(silderInt, node, childObject);
		
		return this;
	},
	
	wiseBackEvent : function(n){
		switch(n){
			case 0 || 1:
				n = true;
				break;
			case 90 || 2:
				n = false;
				break;
			case 180 || 3:
				n = true;
				break;
			case 270 || 4:
				n = false;
				break;
			default:
				n = true;
				break;
		}
		manageImg.load(n);
	},
	
	restoreWiseEvent:function(silderInt, node, childObject){
		if($.browser.msie){
			silderInt.wiseSize = 0;
		}else{
			silderInt.wiseSize = '0deg';
		}
		childObject.silderImg.find('img').css({
			"-o-transform": "rotate(0deg)", 
			"-webkit-transform": "rotate(0deg)",
			"-moz-transform": "rotate(0deg)",
			"filter": "progid:DXImageTransform.Microsoft.BasicImage(rotation=0)"
		});
	},
	
	wiseEvent : function(silderInt, node, childObject) { //旋转事件
		if($.browser.msie){
			silderInt.wiseSize = 0;
		}else{
			silderInt.wiseSize = '0deg';
		}
		
		childObject.clockwise.bind('click', function(){
			if($.browser.msie){
				silderInt.wiseSize = Number(silderInt.wiseSize)+1;
				if(Number(silderInt.wiseSize) == 3){
					silderInt.wiseSize = 0;
				}
			}else{
				silderInt.wiseSize = parseInt(silderInt.wiseSize)*1+90+'deg';
				if(parseInt(silderInt.wiseSize) == '360'){
					silderInt.wiseSize = '0deg';
				}
			}
			
			childObject.silderImg.find('img').css({"-o-transform": "rotate("+silderInt.wiseSize+")", 
				"-webkit-transform": "rotate("+silderInt.wiseSize+")",
				"-moz-transform": "rotate("+silderInt.wiseSize+")",
				"filter": "progid:DXImageTransform.Microsoft.BasicImage(rotation="+silderInt.wiseSize+")"
			});	
			froSilder.wiseBackEvent(parseInt(silderInt.wiseSize));
		});
		childObject.anticlockwise.bind('click', function(){
			if($.browser.msie){
				silderInt.wiseSize = Number(silderInt.wiseSize)-1;
				if(Number(silderInt.wiseSize) == -1){
					silderInt.wiseSize = 3;
				}
			}else{
				silderInt.wiseSize = parseInt(silderInt.wiseSize)*1-90+'deg';
				if(parseInt(silderInt.wiseSize) == '-360'){
					silderInt.wiseSize = '0deg';
				}
			}
			childObject.silderImg.find('img').css({
				"-o-transform": "rotate("+silderInt.wiseSize+")", 
				"-webkit-transform": "rotate("+silderInt.wiseSize+")",
				"-moz-transform": "rotate("+silderInt.wiseSize+")",
				"filter": "progid:DXImageTransform.Microsoft.BasicImage(rotation="+silderInt.wiseSize+")"
			});
			froSilder.wiseBackEvent(Math.abs(parseInt(silderInt.wiseSize)));
		});
	},
	
	NextPictrueChange : function(silderInt, node, childObject){//点击下一张图片切换
		$('#swichover-next').bind('click',function(){
			if(silderInt.isAnimate){
				var obj = childObject.move.children();
				var l = obj.length;
				var i = childObject.silder.find('.swichover-si-simCkeck').index();
				if(i < l-1){
					//赋予新大图地址；
					 obj.eq(i).removeClass('swichover-si-simCkeck');
					 obj.eq(i+1).addClass('swichover-si-simCkeck');
					 
					 froSilder.weakSkip(silderInt, node, childObject);
					 //重置大图显示地址  评论列表新刷
					 var ID = obj.eq(i+1).attr('id');
					 ImgAndCommentCallback(ID);
					 
					 //初始化图片旋转角度
					 froSilder.restoreWiseEvent(silderInt, node, childObject);
				}
			}
		});
	},
	
	PrevPictrueChange :function(silderInt, node, childObject){//点击上一张图片切换
		$('#swichover-prev').bind('click',function(){
			if(silderInt.isAnimate){
				var obj = childObject.move.children();
				var l = obj.length;
				var i = childObject.silder.find('.swichover-si-simCkeck').index();
				if(i > 0 ){
					//赋予新大图地址；
					 obj.eq(i).removeClass('swichover-si-simCkeck');
					 obj.eq(i-1).addClass('swichover-si-simCkeck');
					 
					 froSilder.weakSkip(silderInt, node, childObject);
					 //重置大图显示地址  评论列表刷新
					 var ID = obj.eq(i-1).attr('id');
					 ImgAndCommentCallback(ID);
					 
					 //初始化图片旋转角度
					 froSilder.restoreWiseEvent(silderInt, node, childObject);
				}
			}
				
		});
	},
	
	childClick : function(silderInt, node, childObject){
		if(childObject.move.children().length > 1){
			childObject.move.children().each(function(){
				$(this).click(function(){
					if(!$(this).hasClass('swichover-si-simCkeck')){
						var ID = $(this).attr('id');
						//重置大图显示地址  评论列表刷新
						ImgAndCommentCallback(ID);
						//初始化图片旋转角度
						froSilder.restoreWiseEvent(silderInt, node, childObject);
					}
				});	
			});
		}	
	},
	
	weakSkip : function(silderInt, node, childObject){
			silderInt.isAnimate = false;
			
			var index = childObject.move.find('.swichover-si-simCkeck').index();
			var thisLeft = childObject.move.position().left;
			
			var w = 0;
			childObject.move.children().each(function(i){
				if($(this).hasClass('swichover-si-simCkeck')){
					return false;
				}
				w += (silderInt.defultChildWidth + silderInt.defultChildSpace);
			});
			
			//计算可以最大容纳多少个
			var contentW = childObject.content.width();
			var n = Math.floor(contentW/(silderInt.defultChildWidth + silderInt.defultChildSpace));
			childObject.content.css({width:(silderInt.defultChildWidth + silderInt.defultChildSpace)*n});
			
			var half = Math.floor(n*0.5);
			var dis = (silderInt.defultChildWidth + silderInt.defultChildSpace)*half;
			
			if( w > dis && thisLeft <= 0){
				childObject.move.stop(true, true).animate({left:-(w - dis)},300,function(){
						silderInt.isAnimate = true;
						childObject.prev.show();
						childObject.next.show();
						if(Math.abs(childObject.move.position().left) + childObject.content.width() >= childObject.move.width()){	
							childObject.next.hide();
						}
						if(childObject.move.position().left >= 0){
							childObject.prev.hide();
						}
				});
			}else{
				childObject.move.stop(true, true).animate({left:0},300,function(){
						silderInt.isAnimate = true;
						childObject.prev.show();
						childObject.next.show();
						if(Math.abs(childObject.move.position().left) + childObject.content.width() >= childObject.move.width()){	
							childObject.next.hide();
						}
						if(childObject.move.position().left >= 0){
							childObject.prev.hide();
						}
				});
			}					
	},
	
	Intstate:function(silderInt, node, childObject){
		childObject.prev.hide();
		childObject.next.hide();
		
		var contentW = childObject.content.width();
		
		//初始化宽度
		var l = childObject.move.children().length;
		childObject.move.css({width:(silderInt.defultChildWidth + silderInt.defultChildSpace)*l});
		
		//计算可以最大容纳多少个
		var n = Math.floor(contentW/(silderInt.defultChildWidth + silderInt.defultChildSpace));
		childObject.content.css({width:(silderInt.defultChildWidth + silderInt.defultChildSpace)*n});
				
		if(childObject.move.width() > childObject.content.width()){
			childObject.next.show();
		}
		//侦听左右事件
		if(childObject.move.children().length > n){
			froSilder.moveEvent(silderInt, node, childObject, n);
		}	
	},
	
	moveEvent:function(silderInt, node, childObject, n){

		childObject.next.bind('click',function(){
				if(silderInt.isAnimate){
					silderInt.isAnimate = false;
					
					var half = Math.floor(n*0.5);
					var thisLeft = childObject.move.position().left;
					
					if(thisLeft <= 0 ){
						childObject.move.stop().animate({left:thisLeft - (silderInt.defultChildWidth + silderInt.defultChildSpace)*half},300,function(){
								silderInt.isAnimate = true;
								childObject.prev.show();
								if(Math.abs(childObject.move.position().left) + childObject.content.width() >= childObject.move.width()){	
									childObject.next.hide();
								}
								
						});
					}
				}
		});
		
		childObject.prev.bind('click',function(){
			if(silderInt.isAnimate){
					silderInt.isAnimate = false;
					var half = Math.floor(n*0.5);
					var thisLeft = childObject.move.position().left;
					var distace = (silderInt.defultChildWidth + silderInt.defultChildSpace)*half;
					var toDistace =0;
					if(Math.abs(thisLeft) < distace){
						toDistace = 0;
					}else{
						toDistace = thisLeft + distace;
					}
					if(thisLeft < 0){
						childObject.move.stop().animate({left:toDistace},300,function(){
							silderInt.isAnimate = true;
							childObject.next.show();
							if(childObject.move.position().left >= 0){
								childObject.prev.hide();
							}	
						});
					}
			}
		});

	}
			
})
