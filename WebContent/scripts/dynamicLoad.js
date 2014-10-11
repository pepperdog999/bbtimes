// JavaScript Document
function loadjscssfile(filename, filetype, func, args){
	if (arguments.length < 3) return;
	var l = filename.toString().split("/");
	var fileName = l[l.length-1];
	var f = fileName.split(".");
	var file = f[0].toString();
	
	if(myStack.JugRepeat(file) != false){
		
		if (filetype == "js"){								 	//判定文件类型 
			var  fileref = document.createElement('script')		//创建标签 
			fileref.setAttribute("type","text/javascript")		//定义属性type的值为text/javascript 
			fileref.setAttribute("src", filename)				//文件的地址 
		} 
		else if (filetype == "css"){							//判定文件类型 
			var  fileref = document.createElement("link"); 
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename); 
		} 	
		
		myStack.Push(file);
		document.getElementsByTagName("head")[0].appendChild(fileref);
		
		fileref.onload = fileref.onreadystatechange = function(){  
			if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){ 
				if(args == "undefined"){ 
					func();
				}else{
					func.call(args);
				}
			}
			if(document.all){
				oEventUtil.AddEventHandler(this,'readystatechange',func);
				oEventUtil.RemoveEventHandler(this,'readystatechange');
			}
			fileref.onload = fileref.onreadystatechange = null;  
		}
	}else{
		if(args == "undefined"){ 
			func();
		}else{
			func.call(args);
		}
	}
}
var oEventUtil = new Object();
oEventUtil.AddEventHandler = function(oTarget,EventType,callBack)
{
	//IE和FF的兼容性处理
	//如果是FF
	if(oTarget.addEventListener){
		oTarget.addEventListener(EventType,callBack,false);
	} 
	//如果是IE
	else if(oTarget.attachEvent){
		oTarget.attachEvent('on'+EventType,callBack);
	} else{
		oTarget['on'+EventType] = callBack;
	}
};
oEventUtil.RemoveEventHandler = function(oTarget,EventType){
	if(arguments = 'undefined'||[]){
		if(oTarget.addEventListener){
			oTarget.removeEventListener(EventType,false);
		} 
		//如果是IE
		else if(oTarget.attachEvent){
			oTarget.detachEvent(EventType);
		} else{
			oTarget['on' + EventType] = null;
		}
	}
}
//创建栈  来存储新加载的js 判断 删除 添加js
var Stack = function(){}
            
Stack.prototype={
	Init:function(){
		this.STACKMAX = 100;
		this.stack = new Array(this.STACKMACK);
		this.top = -1;
		return this.stack;
	},
	AltTop:function(){
		return this.top;
	},
	Empty:function(){
		if(this.top==-1){
			return true;
		}
		else{
			return false;
		}
	},
	Push:function(elem){
		if(this.top == this.STACKMAX-1){
			return "栈满";
		}
		else{
			this.top++;
			this.stack[this.top] = elem;
		}
	},
	Pop:function(){
		if(this.top==-1){
			return "空栈,无法删除栈顶元素！";
		}
		else{
			var x = this.stack[this.top];
			this.top--;
			return x;
		}
	},
	Top:function(){
		if(this.top!=-1){
			return this.stack[this.top];
		}
		else{
			return "空栈，顶元素无返回值！";
		}
	},
	Clear:function(){
		this.top=-1;
	},
	Length:function(){
		return this.top+1;
	},
	JugRepeat:function(elem){
		/*if(elem.getAttribute('src')){
		}*/
		/*console.log(elem);
		console.log(elem.getAttribute('src'));*/
		
		if(this.top > -1){
			for(var i = 0; i<= this.STACKMAX-1; i++){
				if(elem == this.stack[i]){
					return false;
					break;
				}
			}
		}
		return true;
	}
}
//新建栈
var myStack = new Stack();
myStack.Init();
