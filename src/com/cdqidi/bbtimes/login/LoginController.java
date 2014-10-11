package com.cdqidi.bbtimes.login;

import java.util.HashMap;
import java.util.Map;
import java.io.UnsupportedEncodingException;
import java.net.*;

import com.cdqidi.bbtimes.sys.BaseController;
import com.cdqidi.bbtimes.user.ClassInfo;
import com.cdqidi.bbtimes.user.UserController;
import com.cdqidi.bbtimes.util.PropertiesFactoryHelper;
import com.cdqidi.bbtimes.util.StringTool;
import com.jfinal.ext.plugin.sqlinxml.SqlKit;
import com.jfinal.ext.route.ControllerBind;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * @类名字：LoginController
 * @类描述：
 * @author:Carl.Wu
 * @版本信息：
 * @日期：2013-11-14
 * @Copyright 足下 Corporation 2013 
 * @版权所有
 *
 */
@ControllerBind(controllerKey = "/")
// @Before({ Restful.class, SessionInViewInterceptor.class })
public class LoginController extends BaseController {

	public void index() {
		render("login.html");
	}

	public void banner() {
		Object[] cookieArray = getCookieContext();		
		setAttr("userInfo",Db.find(SqlKit.sql("user.getUserInfo"),cookieArray[0]));
		setAttr("resourceUrl", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.url"));
		setAttr("headerFix", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.header"));
		setAttr("type", getPara("Type"));
		render("banner.html");
	}
	
	public void footer() {
		render("footer.html");
	}
	
	/**
	 * @方法名:login
	 * @方法描述：用户登录
	 * @author: Carl.Wu
	 * @return: void
	 * @version: 2013-11-14 下午2:47:38
	 * @throws UnsupportedEncodingException 
	 */
	public void login() throws UnsupportedEncodingException {
		String userName = getPara("username");
		String userPass = getPara("password");

		if (userName != null && userPass != null && !userName.isEmpty()
				&& !userPass.isEmpty()) {
			Record user = Db.findFirst(SqlKit.sql("user.login"), new Object[] {
					userName, userPass });
			if (user != null) {
				//setAttr("user_info", user);
				String cookiev = new StringBuilder(user.getStr("UserID")).append("&")
						.append(userName).append("&")
						.append(userPass).append("&")
						.append(user.getStr("SchoolID")).append("&")
						.append(user.getInt("RoleType")).append("&")
						.append(URLEncoder.encode(user.getStr("DisplayName"),"UTF-8")).toString();
				this.setCookie("bb_usercookie", cookiev, 86400000);
				redirect("/photo/index");
				return;
			} else {
				setAttr("msg", "用户登录信息错误！");
			}
		}else{
			setAttr("msg", "用户登录信息为空！");
		}
		render("login.html");
	}
	
	public void logout() {
		this.removeCookie("bb_usercookie");
		render("login.html");
	}

	private Map<String, Object> toMap(Record record) {
		return record.getColumns();
	}

}
