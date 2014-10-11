// JavaScript Document
$(function(){
	
	$("._operation").optioncontrol({jugupico:false, direction:'right', insetHtml:groupHtml(),FrameWidth:240});//-------------人员设置 点击提示删除 等等操作-------------
	
});
function groupHtml(){
	var Html = "<div class=\"adjustgroup\">";
    Html += "<h2 class=\"adjustgroup-t\">添加人员</h2>";
    Html += "<div class=\"adjustgroup-c\">";
    Html += "<label><i class=\"radio-ico radio-ico-check\"></i>闺蜜</label>";
	Html += "<label><i class=\"radio-ico\"></i>自定义</label>";
	Html += "<label><i class=\"radio-ico\"></i>闺蜜</label>";
    Html += "</div>";
	Html += "</div>";
	return Html;
	/*var Html = "<ul>";
	Html +="<li><a hidefocus=\"true\">班级同学</a></li>  ";
	Html +="<li><a hidefocus=\"true\">老师</a></li>";
	Html +="<li><a hidefocus=\"true\">好友</a></li>";
	Html +="<li><a hidefocus=\"true\">闺蜜</a></li>";
	Html +="</ul>";
	return Html;*/
}