package com.cdqidi.bbtimes.gallary;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;

import com.cdqidi.bbtimes.gallary.Attachment;
import com.cdqidi.bbtimes.sns.SNSController;
import com.cdqidi.bbtimes.sys.BaseController;
import com.cdqidi.bbtimes.user.ClassInfo;
import com.cdqidi.bbtimes.user.Profile;
import com.cdqidi.bbtimes.user.UserController;
import com.cdqidi.bbtimes.util.DateUtils;
import com.cdqidi.bbtimes.util.PropertiesFactoryHelper;
import com.jfinal.aop.Before;
import com.jfinal.ext.plugin.sqlinxml.SqlKit;
import com.jfinal.ext.route.ControllerBind;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;

@ControllerBind(controllerKey = "/photo")
public class GallaryController extends BaseController {
	
	
	@Override
	public void index() {
		
		Object[] cookieArray = getCookieContext();
		if (cookieArray == null) {
			render("/login.html");
		}else{
			//获取用户班级信息,组合班级相册入口
			setAttr("classInfo",new ClassInfo().find(SqlKit.sql("user.getUserClass"),cookieArray[0]));
			setAttr("defaultGroupID",UserController.getDefaultGroupID(cookieArray[0].toString()));
			setAttr("resourceUrl", PropertiesFactoryHelper.getInstance()
					.getConfig("resource.url"));
			setAttr("headerFix", PropertiesFactoryHelper.getInstance()
					.getConfig("resource.header"));
			render("/photo/index.html");
		}
	}
	
	
	public void imageInfo(){
		
		Content content = new Content().findById(getPara("infoStreamID"));
		Attachment attachment = new Attachment().findFirst("Select * from ns_infostream_attachment where infoStreamID=?", content.getInt("infoStreamID"));
		List<Comment> comments = new Comment().find("Select * from ms_info_comment where C_DATA_ID=?", content.getInt("infoStreamID"));
		//content.set("comments", comments);  //这种写法要报错，找到原因
		setAttr("content",content);
		setAttr("attachment",attachment);
		setAttr("comments",comments);
		
		setAttr("headerFix",PropertiesFactoryHelper.getInstance()
				.getConfig("resource.header"));
		setAttr("resourceUrl", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.url"));
		
		render("/photo/imageDetail.html");
	}
	
	public void showTimesGallary(){
		
		Object[] cookieArray = getCookieContext();
		if (cookieArray == null) {
			render("/login.html");
		}else{
			
			String year =getPara("year") !=null ? getPara("year") : DateUtils.getYear();
			List<Record> month_list = Db.find(SqlKit.sql("gallary.getTimesMonth"),cookieArray[0],year);
			for (Record record : month_list) {

				List<Record> images = Db.query(SqlKit.sql("gallary.getTimesPics"),cookieArray[0],year+"-"+record.getStr("date_month"));

				record.set("images", images);

			}
			
			setAttr("timesYears",Db.find(SqlKit.sql("gallary.getTimesYears"),cookieArray[0]));
			setAttr("MonthPic",month_list);
			
			Profile profile = new Profile().findFirst("Select * from be_profiles where userID=?",cookieArray[0]);
			setAttr("profile",profile);
			
			setAttr("headerFix",PropertiesFactoryHelper.getInstance()
					.getConfig("resource.header"));
			setAttr("resourceUrl", PropertiesFactoryHelper.getInstance()
					.getConfig("resource.url"));
			render("/photo/times.html");
		}
	}
	
	@Before(Tx.class)
	public void delByMasterID()
	{
		//需考虑删除的数据是否是自己原发，否则只删除index表；同时还需写入ms_delids表
		String masterID=getPara("masterID");
		boolean r= false;
		List<Content> content_list = new Content().find("select * from ns_infostream_content where ifNULL(BatchID,infoStreamID)=?",masterID);
		for (Content content : content_list) {
			Db.update("delete from ns_infostream_attachment where infoStreamID=?",content.getInt("infoStreamID"));
			Db.update("delete from ns_infostream_index where infoStreamID=?",content.getInt("infoStreamID"));
			Db.update("delete from ms_info_comment where C_DATA_ID=?",content.getInt("infoStreamID"));
			r=content.delete();
		}
		renderJson("result",r);
	}
	
	public void replyByMasterID()
	{
		String masterID = getPara("masterID");
		String msg = null;
		
		Map<String,Object> data = new HashMap<String,Object>();
		try{
			List<Content> content_list=new Content().find("select * from ns_infostream_content where ifNULL(BatchID,infoStreamID)=?",masterID);
			boolean r =new Comment().set("C_DATA_ID", content_list.get(0).getInt("infoStreamID"))
					.set("C_USER_ID", getPara("userID")).set("C_USER_NAME", URLDecoder.decode(getPara("displayName"), "UTF-8"))
					.set("C_OBJ_USER_ID",content_list.get(0).getStr("UserID")).set("C_TITLE", "").set("C_CONTENT", URLDecoder.decode(getPara("replyContent"), "UTF-8"))
					.set("C_FILE_NAME", "").set("C_FILE_TYPE", 0).set("C_NUM", 1).set("C_TYPE", 1)
					.set("C_NUM_RE", 0).set("C_CREATE_TIME", DateUtils.nowDateTime()).set("C_UPDATE_TIME", DateUtils.nowDateTime())
					.set("C_STATE", 0).set("C_CODE", "WEB").set("C_GRADE", 0).save();
			if (r)
				msg = "评论成功！";
			else
				msg = "评论失败！";		
			data.put("time", DateUtils.nowDateTime());
			data.put("result",r);
			data.put("msg", msg);
		}catch(UnsupportedEncodingException ex){
			data.put("result",false);
			data.put("msg", ex.getMessage());
		}
		renderJson(data);
	}
	
	public void showSwitch(){
		
		String sqlBatchImage="";
		
		if(getPara("masterID")!=null) //从相册列表中进入
		{	
			sqlBatchImage = "SELECT c.infoStreamID ,ct.Title,replace(ct.AttachmentContent,'detailImage','timeNoteImage') sImageURL,ct.AttachmentContent dImageURL \n"
				+"FROM ns_infostream_content c \n"
				+"left join ns_infostream_attachment ct on ct.infoStreamID=c.infoStreamID \n"
				+"WHERE ifNULL(c.BatchID,c.infoStreamID)=? and ct.AttachmentType=0";
								
			setAttr("batchImg", Db.query(sqlBatchImage,getPara("masterID")));
		}else{  //从时光表中进入
			sqlBatchImage = "SELECT c.infoStreamID ,ct.Title,replace(ct.AttachmentContent,'detailImage','timeNoteImage') sImageURL,ct.AttachmentContent dImageURL \n"
				+"FROM ns_infostream_content c \n"
				+"left join ns_infostream_attachment ct on ct.infoStreamID=c.infoStreamID \n"
				+"left join ns_infostream_content c1 on c1.userID=c.userID and substr(c1.DateCreated,1,7)=substr(c.DateCreated,1,7) \n"
				+"WHERE c1.infoStreamID=? and ct.AttachmentType=0 \n"
				+"order by c.DateCreated Desc \n"
				+"Limit 0,50";
			
			setAttr("batchImg", Db.query(sqlBatchImage,getPara("infoStreamID")));
		}
		setAttr("resourceUrl", PropertiesFactoryHelper.getInstance()
				.getConfig("resource.url"));
		
		render("/photo/switchover.html");
		
	}
	
	public void uploadPage() {
		
		Object[] cookieArray = getCookieContext();
		setAttr("userGroups", Db.find(SqlKit.sql("user.getUserGroups"), cookieArray[0]));
		
		render("/utlity/upload.html");
	}

	public void getOwnerGallary() {

		Object[] cookieArray = getCookieContext();
		if (cookieArray == null) {
			render("/login.html");
		} else {
			String sqlSelect = "select distinct ifNULL(BatchID,c.infoStreamID) masterID,c.SourceInfoStreamID,c.infoStreamContent,c.DateCreated,c.UserID,c.UserName \n";
			String sqlFrom = "from ns_infostream_content c \n"
					+ "left join ns_infostream_index i on c.infoStreamID = i.infoStreamID where i.UserID =? \n"
					+ "order by c.infoStreamID Desc";

			Page<Record> Records_Gallary = Db.paginate(
					getParaToInt("pageNumber", 1), getParaToInt("pageSize", 5),
					sqlSelect, sqlFrom, cookieArray[0]);

			List<Record> Gallary_list = Records_Gallary.getList();
			String sqlImages = "SELECT ct.attachmentID imageID,c.infoStreamID,ct.Title, \n"
					+"replace(ct.AttachmentContent,'detailImage','timeNoteImage') ImageURL \n"
					+"FROM ns_infostream_attachment ct \n"
					+"left join ns_infostream_content c on c.infoStreamID=ct.infoStreamID \n"
					+"WHERE ifNULL(BatchID,c.infoStreamID)=? and ct.AttachmentType=0 \n"
					+"Limit 0,9";
			String sqlComment ="SELECT cm.ID commentID,c.infoStreamID,cm.c_user_id,cm.c_user_name,cm.c_content,cm.c_create_time \n"
					+"FROM ms_info_comment cm \n"
					+"left join ns_infostream_content c on c.infoStreamID=cm.c_data_id \n"
					+"WHERE ifNULL(BatchID,c.infoStreamID)=? \n"
					+"limit 0,3";
			
			
			//List<Attachment> img = new Attachment().get(sqlImages);//考虑这种获得对象的方法。
			
			for (Record record : Gallary_list) {

				List<Object> images = Db.query(sqlImages,
						record.getStr("masterID"));
				List<Object> comments = Db.query(sqlComment,
						record.getStr("masterID"));

				record.set("images", images);
				record.set("comments", comments);

			}

			setAttr("gallary", Records_Gallary);
			
			setAttr("gallaryType","Owner");
			setAttr("headerFix",PropertiesFactoryHelper.getInstance()
					.getConfig("resource.header"));
			setAttr("resourceUrl", PropertiesFactoryHelper.getInstance()
					.getConfig("resource.url"));
			
			//renderJson();
			render("/photo/gallary.html");
		}

	}
	
	public void getClassGallary() {
		
		Object[] cookieArray = getCookieContext();
		if (cookieArray == null) {
			render("/login.html");
		} else {
			String sqlSelect = "select distinct ifNULL(BatchID,c.infoStreamID) masterID,c.infoStreamContent,c.DateCreated,c.UserID,c.UserName \n";
			String sqlFrom = "from ns_infostream_content c \n"
					+ "where c.publicLevel=1 and c.SourceInfoStreamID=0 and c.GroupID =? \n"
					+ "order by c.infoStreamID Desc";

			Page<Record> Records_Gallary = Db.paginate(
					getParaToInt("pageNumber", 1), getParaToInt("pageSize", 5),
					sqlSelect, sqlFrom, getPara("classID"));

			List<Record> Gallary_list = Records_Gallary.getList();
			String sqlImages = "SELECT ct.attachmentID imageID,c.infoStreamID,ct.Title, \n"
					+"replace(ct.AttachmentContent,'detailImage','timeNoteImage') ImageURL \n"
					+"FROM ns_infostream_attachment ct \n"
					+"left join ns_infostream_content c on c.infoStreamID=ct.infoStreamID \n"
					+"WHERE ifNULL(BatchID,c.infoStreamID)=? and ct.AttachmentType=0 \n"
					+"Limit 0,9";
			String sqlComment ="SELECT cm.ID,c.infoStreamID,cm.c_user_id,cm.c_user_name,cm.c_content,cm.c_create_time \n"
					+"FROM ms_info_comment cm \n"
					+"left join ns_infostream_content c on c.infoStreamID=cm.c_data_id \n"
					+"WHERE ifNULL(BatchID,c.infoStreamID)=? \n"
					+"limit 0,3";
			
			for (Record record : Gallary_list) {

				List<Object> images = Db.query(sqlImages,
						record.getStr("masterID"));
				List<Object> comments = Db.query(sqlComment,
						record.getStr("masterID"));

				record.set("images", images);
				record.set("comments", comments);

			}

			setAttr("gallary", Records_Gallary);
			
			setAttr("gallaryType","Class");
			setAttr("headerFix",PropertiesFactoryHelper.getInstance()
					.getConfig("resource.header"));
			setAttr("resourceUrl", PropertiesFactoryHelper.getInstance()
					.getConfig("resource.url"));

			render("/photo/gallary.html");
		}

	}
	
	public void getSchoolGallary() {
		
		Object[] cookieArray = getCookieContext();
		if (cookieArray == null) {
			render("/login.html");
		} else {
			String sqlSelect = "select distinct ifNULL(BatchID,c.infoStreamID) masterID,c.infoStreamContent,c.DateCreated,c.UserID,c.UserName \n";
			String sqlFrom = "from ns_infostream_content c \n"
					+ "where c.publicLevel=1 and c.SourceInfoStreamID=0 and c.SchoolID =? \n"
					+ "order by c.infoStreamID Desc";

			Page<Record> Records_Gallary = Db.paginate(
					getParaToInt("pageNumber", 1), getParaToInt("pageSize", 5),
					sqlSelect, sqlFrom, cookieArray[3]);

			List<Record> Gallary_list = Records_Gallary.getList();
			String sqlImages = "SELECT ct.attachmentID imageID,c.infoStreamID,ct.Title, \n"
					+"replace(ct.AttachmentContent,'detailImage','timeNoteImage') ImageURL \n"
					+"FROM ns_infostream_attachment ct \n"
					+"left join ns_infostream_content c on c.infoStreamID=ct.infoStreamID \n"
					+"WHERE ifNULL(BatchID,c.infoStreamID)=? and ct.AttachmentType=0 \n"
					+"Limit 0,9";
			String sqlComment ="SELECT cm.ID,c.infoStreamID,cm.c_user_id,cm.c_user_name,cm.c_content,cm.c_create_time \n"
					+"FROM ms_info_comment cm \n"
					+"left join ns_infostream_content c on c.infoStreamID=cm.c_data_id \n"
					+"WHERE ifNULL(BatchID,c.infoStreamID)=? \n"
					+"limit 0,3";
			
			for (Record record : Gallary_list) {

				List<Object> images = Db.query(sqlImages,
						record.getStr("masterID"));
				List<Object> comments = Db.query(sqlComment,
						record.getStr("masterID"));
				
				setAttr("gallaryType","School");
				record.set("images", images);
				record.set("comments", comments);

			}

			setAttr("gallary", Records_Gallary);
			
			setAttr("headerFix",PropertiesFactoryHelper.getInstance()
					.getConfig("resource.header"));
			setAttr("resourceUrl", PropertiesFactoryHelper.getInstance()
					.getConfig("resource.url"));

			render("/photo/gallary.html");
		}

	}

}
