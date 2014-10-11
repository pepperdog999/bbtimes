package com.cdqidi.bbtimes.user;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;

import com.cdqidi.bbtimes.util.StringTool;
import com.cdqidi.bbtimes.util.TestImg;
import com.cdqidi.bbtimes.user.UserController;
import com.cdqidi.bbtimes.user.Profile;
import com.cdqidi.bbtimes.gallary.Attachment;
import com.cdqidi.bbtimes.sys.BaseController;
import com.cdqidi.bbtimes.util.PropertiesFactoryHelper;
import com.jfinal.ext.plugin.sqlinxml.SqlKit;
import com.jfinal.ext.route.ControllerBind;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.upload.UploadFile;

@ControllerBind(controllerKey = "/user")
public class UserController extends BaseController {
		
	@Override
	public void index() {
		Object[] cookieArray = getCookieContext();
		
		User user = new User().findById(cookieArray[0]);
		Profile profile = new Profile().findFirst("Select * from be_profiles where userID=?",user.getStr("UserID"));
		
		setAttr("user",user);
		setAttr("profile",profile);
		setAttr("headerFix",PropertiesFactoryHelper.getInstance()
				.getConfig("resource.header"));
		setAttr("resourceUrl", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.url"));
		
		render("../user/userSet.html");
	}

	public void update() {
		
		boolean succes = getModel(Profile.class, "bProfile").update();
		if (succes) {
			renderJson("msg","个人信息更新成功!");
		} else
			renderJson("msg","个人信息更新失败!");
	
	}
	
	public void setDefaultGroup() {
		Map<Object, Object> data = new HashMap<Object, Object>();
		boolean success = new User().findById(getPara("UserID")).set("defaultGroupID", getPara("gid")).update();
		data.put("success", success);
		if(success)
			data.put("msg", "默认组更新成功！");
		else
			data.put("msg", "默认组更新失败！");
		renderJson(data);
	}
	
	public static String getDefaultGroupID(String userID) {
		User user = User.dao.findById(userID);
		if(!StringTool.notBlank(user.getStr("defaultGroupID")) && !StringTool.notNull(user.getStr("defaultGroupID")))
			return Db.findFirst(SqlKit.sql("user.getUserClass"),userID).getStr("ID");
		return user.getStr("defaultGroupID");

	}
	
	public void getUserSchoolInfo(){
		renderJson(Db.find(SqlKit.sql("user.getUserSchool"),getPara("UserID")));
	}
	
	public void getUserGroups() {
		renderJson(Db.find(SqlKit.sql("user.getUserGroups"),getPara("UserID")));
	}
	
	public void getGroupUsers() {
		Object[] cookieArray = getCookieContext();
		String groupID =getPara("groupID");
		Map<Object, Object> data = new HashMap<Object, Object>();
		data.put("headerFix",PropertiesFactoryHelper.getInstance()
				.getConfig("resource.header"));
		data.put("resourceUrl", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.url"));
		data.put("data", Db.find(SqlKit.sql("user.getGroupUsers"), groupID,cookieArray[0]));
		renderJson(data);
	}
	
	public static String getDisplayNamebyUserID(String userID){
		return Db.findFirst(SqlKit.sql("user.getUserInfo"),userID).getStr("DisplayName");
	}
	
	
	public void getUserInfo(){
		Map<Object, Object> data = new HashMap<Object, Object>();

		data.put("resourceUrl", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.url"));
		data.put("headerFix", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.header"));
		data.put("userInfo",Db.find(SqlKit.sql("user.getUserInfo"),getPara("userID")));
		renderJson(data);
	}
	
	
	public void checkOldPwd(){
		Map<Object, Object> data = new HashMap<Object, Object>();
		Record user=Db.findFirst("select u.UserID from be_users u where u.UserID=? and u.Password=?",getPara("userID"),getPara("oldPwd"));
		if(user != null){
			data.put("result", true);
			data.put("msg", "原始密码输入正确！");
		}else{
			data.put("result", false);
			data.put("msg", "原始密码输入错误！");
		}
		renderJson(data);
			
	}
	
	public void changePwd(){
		User user = new User().findById(getPara("userID"));
		if(user.set("OrgPassword", getPara("oldPwd")).set("Password",getPara("newPwd")).update()){
			renderJson("result",true);
		}else{
			renderJson("result",false);
		}
			
	}
	
}
	