package com.cdqidi.bbtimes.sns;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;

import com.cdqidi.bbtimes.sys.BaseController;
import com.cdqidi.bbtimes.util.PropertiesFactoryHelper;
import com.jfinal.ext.plugin.sqlinxml.SqlKit;
import com.jfinal.ext.route.ControllerBind;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

@ControllerBind(controllerKey = "/sns")
public class SNSController extends BaseController {
	
	
	@Override
	public void index() {
		
	}
	
	public void getHotImgs(){
		
		Object[] cookieArray = getCookieContext();
		String sql ="select c.infoStreamID,c.UserID,ct.Title,replace(ct.AttachmentContent,'detailImage','timeNoteImage') ImageURL \n"
					+"from ns_infostream_attachment ct \n"
					+"left join ns_infostream_content c on c.infoStreamID=ct.infoStreamID \n"
					+"where ct.AttachmentType=0 and c.publicLevel=1 and c.SourceInfoStreamID=0 and c.schoolID=? \n"
					+"ORDER BY RAND() Limit 9";

		Map<Object, Object> data = new HashMap<Object, Object>();

		data.put("resourceUrl", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.url"));
		data.put("data",Db.find(sql,cookieArray[3]));
		renderJson(data);
	}
	
	public void getrollImgs(){
		String sql ="select c.infoStreamID,c.UserID,ct.Title,replace(ct.AttachmentContent,'detailImage','timeNoteImage') ImageURL \n"
					+"from ns_infostream_attachment ct \n"
					+"left join ns_infostream_content c on c.infoStreamID=ct.infoStreamID \n"
					+"where ct.AttachmentType=0 and c.publicLevel=1 and c.SourceInfoStreamID=0 \n"
					+"ORDER BY RAND() Limit 40";

		Map<Object, Object> data = new HashMap<Object, Object>();

		data.put("resourceUrl", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.url"));
		data.put("data",Db.find(sql));
		renderJson(data);
	}
	
	public void getTopUser(){
		String sql ="select * from \n"
					+"(select u.userID,u.userName,u.DisplayName,u.schoolID,u.schoolName,cc.picCount \n"
					+"from view_userinfo u \n"
					+"left join (select UserID, count(infoStreamID) picCount from ns_infostream_content group by UserID) cc on cc.UserID=u.userID \n"
					+"ORDER BY cc.picCount Desc limit 100) t \n"
					+"Order by RAND() limit 5";

		Map<Object, Object> data = new HashMap<Object, Object>();

		data.put("resourceUrl", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.url"));
		data.put("headerFix", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.header"));
		data.put("data",Db.find(sql));
		renderJson(data);
	}
	
			
}
	