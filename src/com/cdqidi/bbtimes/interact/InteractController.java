package com.cdqidi.bbtimes.interact;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.cdqidi.bbtimes.user.ClassInfo;
import com.cdqidi.bbtimes.util.DateUtils;
import com.cdqidi.bbtimes.interact.MessageInfo;
import com.cdqidi.bbtimes.interact.MessageIndex;
import com.cdqidi.bbtimes.sys.BaseController;
import com.cdqidi.bbtimes.util.PropertiesFactoryHelper;
import com.jfinal.ext.plugin.sqlinxml.SqlKit;
import com.jfinal.ext.route.ControllerBind;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;


@ControllerBind(controllerKey = "/interact")
public class InteractController  extends BaseController{
	@Override
	public void index() {
		
		Object[] cookieArray = getCookieContext();
		if (cookieArray == null) {
			render("/login.html");
		}else{
			render("/interact/index.html");
		}
	}
	
	public void messageList() {
		Object[] cookieArray = getCookieContext();
		String selectedUsers=getPara("SelectedUsers");
		setAttr("resourceUrl", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.url"));
		setAttr("headerFix", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.header"));
		setAttr("userID",cookieArray[0]);
		setAttr("selectedUsers",selectedUsers);
		String userList="";
		if(selectedUsers!= null){
	    	for (String user: selectedUsers.split(",")){
	    		userList +="'"+user+"',";
	    	}
	    	userList= userList.substring(0,userList.length()-1);
		}else{
			userList="''";
		}
		String sql="select distinct AuthorID,AuthorName from \n"
				+"(select p.userID AuthorID,p.DisplayName AuthorName,now() lastDate \n"
				+"from be_profiles p where p.userID in ("+userList+") \n"
				+"union \n"
				+"select mi.AuthorID,mi.AuthorName,max(m.iDateCreated) lastDate \n"
				+"from ms_imessage_index mi \n"
				+"left join ms_imessage_info m on m.iMessageID=mi.iMessageID \n"
				+"where mi.ReciveUserID='"+cookieArray[0]+"' and mi.AuthorID <> '"+PropertiesFactoryHelper.getInstance().getConfig("multiUser.ID")+"' and m.iDataType=3 \n"
				+"group by mi.AuthorID) d order by d.lastDate DESC";
		//setAttr("interactUserList",Db.find(SqlKit.sql("interact.getInteractUserList"),cookieArray[0],cookieArray[0],userList));
		// 'in' 的特殊性导致不能使用SqlKit传参。
		setAttr("interactUserList",Db.find(sql));
		render("/interact/messageList.html");
	}
	
	public void addressBook() {
		Object[] cookieArray = getCookieContext();
		setAttr("resourceUrl", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.url"));
		setAttr("headerFix", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.header"));
		setAttr("classHeaderFix", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.classHeader"));
		setAttr("classInfo",new ClassInfo().find(SqlKit.sql("user.getUserClass"),cookieArray[0]));
		render("/interact/addressBook.html");
	}
	
	public void getLastDialogueDateByUserID() {
		Object[] cookieArray = getCookieContext();
		Map<Object, Object> data = new HashMap<Object, Object>();
		List<Record> r = Db.find(SqlKit.sql("interact.getLastDialogueDateByUserID"),cookieArray[0],getPara("RUserID"),getPara("RUserID"),cookieArray[0]);
		if(r.get(0).getStr("lastDate") != null){
			data.put("success", true);
			data.put("lastDate", r.get(0).getStr("lastDate"));
		}else
			data.put("success", false);
		renderJson(data);
	}
	
	public void getNextDialogueDateByUserID() {
		Object[] cookieArray = getCookieContext();
		Map<Object, Object> data = new HashMap<Object, Object>();
		List<Record> r = Db.find(SqlKit.sql("interact.getNextDialogueDateByUserID"),cookieArray[0],getPara("RUserID"),getPara("RUserID"),cookieArray[0],getPara("NextDate"));
		if(r.get(0).getStr("nextDate") != null){
			data.put("success", true);
			data.put("nextDate", r.get(0).getStr("nextDate"));
		}else
			data.put("success", false);
		renderJson(data);
	}
	
	public void addDialogue() throws UnsupportedEncodingException {
		Object[] cookieArray = getCookieContext();
		Map<Object, Object> data = new HashMap<Object, Object>();
		String content = getPara("Content");
        String rUserID = getPara("RUserID");
        String rUserName = getPara("RUserName");
        
        boolean result = false;
        
        MessageInfo info = new MessageInfo();
        if(info.set("iDataId", 0).set("iDataType",3).set("iContent",content).set("iAuthorID",cookieArray[0]).set("iDateCreated",DateUtils.nowDateTime()).set("iSource","WEB").save())
        {	
        	result=new MessageIndex().set("iMessageID",info.getInt("iMessageID")).set("AuthorID",cookieArray[0])
        			.set("AuthorName", URLDecoder.decode(cookieArray[5].toString(),"UTF-8")).set("ReciveUserID", rUserID)
        			.set("ReciveName", rUserName).set("ReciveState", 0).set("SendState", 0).save();
        	
        	result=new MessageIndex().set("iMessageID",info.getInt("iMessageID")).set("AuthorID",rUserID).set("AuthorName", rUserName)
                	.set("ReciveUserID", cookieArray[0]).set("ReciveName", URLDecoder.decode(cookieArray[5].toString(),"UTF-8")).set("ReciveState", 0).set("SendDate", info.get("iDateCreated")).set("SendState", 1).save();
        	
        }
        //对多人节点增加特殊处理
        if (rUserID.equals(PropertiesFactoryHelper.getInstance().getConfig("multiUser.ID"))){
        	String userList="";
        	for (String user: getPara("SelectedUsers").split(",")){
        		userList +="'"+user+"',";
        	}
        	String sqlStr = "insert into ms_imessage_index(iMessageID,AuthorID,AuthorName,ReciveUserID,ReciveName,ReciveState,SendState) \n"
        					+ "select "+info.getInt("iMessageID")+",'"+cookieArray[0]+"','"+URLDecoder.decode(cookieArray[5].toString(),"UTF-8")+"',p.userID,p.DisplayName,0,0 \n"
        					+ "from be_profiles p where p.userID in ("+userList.substring(0,userList.length()-1)+")";
        	Db.update(sqlStr);
        	// 使用 Db.save()来处理
        }
		data.put("success", result);
		renderJson(data);
	}
	
	public void getDialogueByUserID() {
		Object[] cookieArray = getCookieContext();
		Map<Object, Object> data = new HashMap<Object, Object>();
		data.put("dialogueList", Db.find(SqlKit.sql("interact.getDialogueByUserID"),getPara("yearMonth"),cookieArray[0],getPara("RUserID"),getPara("RUserID"),cookieArray[0]));
		renderJson(data);
	}
	
	public void getSendUserList(){
		Object[] cookieArray = getCookieContext();
		Map<Object, Object> data = new HashMap<Object, Object>();
		data.put("sendUserList", Db.find(SqlKit.sql("interact.getSendUserList"),getPara("DataID"),cookieArray[0],PropertiesFactoryHelper.getInstance().getConfig("multiUser.ID")));
		renderJson(data);
	}
}
