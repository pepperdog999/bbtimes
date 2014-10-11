package com.cdqidi.bbtimes.img.upload;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.channels.FileChannel;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.xml.ws.Response;

import org.omg.CORBA.portable.ResponseHandler;

import com.cdqidi.bbtimes.util.ImageCutterUtil;
import com.cdqidi.bbtimes.gallary.Attachment;
import com.cdqidi.bbtimes.gallary.Content;
import com.cdqidi.bbtimes.gallary.Index;
import com.cdqidi.bbtimes.sys.BaseController;
import com.cdqidi.bbtimes.user.UserController;
import com.cdqidi.bbtimes.util.DateUtils;
import com.cdqidi.bbtimes.util.ImageHepler;
import com.cdqidi.bbtimes.util.PropertiesFactoryHelper;
import com.cdqidi.bbtimes.util.ImageUtil;
import com.google.common.net.HttpHeaders;
import com.jfinal.aop.Before;
import com.jfinal.ext.route.ControllerBind;
import com.jfinal.kit.StringKit;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.jfinal.render.JsonRender;
import com.jfinal.render.Render;
import com.jfinal.upload.UploadFile;

@ControllerBind(controllerKey = "/img")
public class ImgUploadController extends BaseController {

	private static String ROOTPATH =new File(UserController.class.getClassLoader().getResource("").getPath()).getParentFile().getParent();
	
	@Override
	public void index() {

	}
	
	public void updateAvatar(){	
		Map<String, Object> map = new HashMap<String, Object>();
		File f = new File(ROOTPATH+"/imgTemp");
		if (!f.exists()) {
			f.mkdirs();
		}
		UploadFile uploadFile = getFile("fulFile", f.getAbsolutePath());
		String x2 = uploadFile.getFileName();
		Map<String, Long> map2 = ImageUtil.getImgInfo(uploadFile.getFile()
				.getAbsolutePath());
		
		map.put("success", true);
		map.put("desc", "上传成功！");
		map.put("url", "imgTemp/" + x2);
		map.put("imginfo", map2);
		render(new JsonRender(map).forIE());
		//renderJson(map);
	}
	
	public void cutImg() {
		boolean result = false;
		Object[] cookieArray = getCookieContext();
		// 选择框相关参数
		Long selectorX = getParaToLong("selectorX");
		Long selectorY = getParaToLong("selectorY");
		Long selectorW = getParaToLong("selectorW");
		Long selectorH = getParaToLong("selectorH");
		// 预览图片大小
	//	Long viewPortW = getParaToLong("viewPortW");
	//	Long viewPortH = getParaToLong("viewPortH");

		String simageH = getPara("imageH");
		String simageW = getPara("imageW");
		String simageY = getPara("imageY");
		String simageX = getPara("imageX");
	    

		// 旋转角度
		//Long imageRotate = getParaToLong("imageRotate");
		// 资源路径
		String imageSource = getPara("imageSource");

		String userID = cookieArray[0].toString();
		String root = ROOTPATH;
		String srcRoot = root + imageSource.substring(2);
		System.err.println(root);
		PropertiesFactoryHelper propFactory = PropertiesFactoryHelper
				.getInstance();

		try {
			String distSRC = propFactory.getConfig("resource.dir")+userID+propFactory.getConfig("resource.header");
			File fx = new File(distSRC);
			if (!fx.exists()) {
				fx.mkdirs();
			}
			String newpath = ImageCutterUtil.zoom(srcRoot, null, formartString(simageW).intValue(), formartString(simageH).intValue());
			ImageCutterUtil.cutImage(newpath, distSRC,
					(selectorX.intValue()-formartString(simageX).intValue()), (selectorY.intValue()-formartString(simageY).intValue()),
					selectorW.intValue(), selectorH.intValue());
			result = true;
			File fsrc = new File(srcRoot);
			if (fsrc.exists()) {
				fsrc.delete();
			}
			File nsrc = new File(newpath);
			if (nsrc.exists()) {
				nsrc.delete();
			}
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		renderJson("result", result);
	}
	
	private BigDecimal formartString(String s) throws Exception{
		if (StringKit.isBlank(s)) {
			throw new Exception("未发现有需要转换的字符参数");
		}
		BigDecimal bigDecimal=new BigDecimal(s);
		return bigDecimal;		
	}
	
/**
 * 图片上传
 */
	public void imgUpload() {
		File f1 = new File(ROOTPATH+"/imgTemp");
		File f2 = new File(ROOTPATH+"/imgTemp/small"); //创建小图存放区
		if (!f1.exists() || !f2.exists()) {
			f1.mkdirs();
			f2.mkdirs();
		}
		UploadFile uploadFile1 = getFile("firstFile", f1.getAbsolutePath());
		UploadFile uploadFile2 = getFile("extraFile", f1.getAbsolutePath());
		Map<String, Object> message = new HashMap<String, Object>();
		File nFile = null;
		if (uploadFile1 != null){
			nFile = copyFile(uploadFile1.getFile(), new File(ROOTPATH + "/imgTemp/"),System.currentTimeMillis()+"");
			message.put("orgName", uploadFile1.getFileName());
		}
		else if (uploadFile2 != null){
			nFile = copyFile(uploadFile2.getFile(), new File(ROOTPATH + "/imgTemp/"),System.currentTimeMillis()+"");
			message.put("orgName", uploadFile2.getFileName());
		}
		if (nFile==null) {
			message.put("success", false);
		}else{
			try {
				ImageHepler.cut(nFile
							.getAbsolutePath(), ROOTPATH + "/imgTemp/small/"
							+ nFile.getName(), 200);
			} catch (IOException e) {
				e.printStackTrace();
			}
			message.put("success", true);
			message.put("picName", nFile.getName());
		}
		render(new JsonRender(message).forIE());
		//renderJson(message);
	}

	
	   /** 
     * 复制文件(以超快的速度复制文件) 
     *  
     * @param srcFile 
     *            源文件File 
     * @param destDir 
     *            目标目录File 
     * @param newFileName 
     *            新文件名 
     * @return 实际复制的字节数，如果文件、目录不存在、文件为null或者发生IO异常，返回-1 
     */  
    public static File copyFile(File srcFile, File destDir, String newFileName) {  
        if (!srcFile.exists()) {  
            System.out.println("源文件不存在");
            return null; 
        } else if (!destDir.exists()) {  
            System.out.println("目标目录不存在");
            return null; 
        } else if (newFileName == null) {  
        	newFileName = srcFile.getName().substring(0,srcFile.getName().lastIndexOf("."));  
        } 
        try {  
            	File newfile=new File(destDir,newFileName+srcFile.getName().substring(srcFile.getName().lastIndexOf(".")));
                FileChannel fcin = new FileInputStream(srcFile).getChannel();  
                FileChannel fcout = new FileOutputStream(newfile).getChannel();  
                fcin.transferTo(0, fcin.size(), fcout);  
                fcin.close();  
                fcout.close(); 
                srcFile.delete();
                return newfile;
        } catch (FileNotFoundException e) {  
                e.printStackTrace();
                return null;
        } catch (IOException e) {  
                e.printStackTrace();
                return null;
        }     
    } 
	

	/**
	 * 确认图片上传	
	 */
    @Before(Tx.class)
	public void confirmSubmit() {
		Map<String, Object> msgmap=new HashMap<String, Object>();
		Object[] cookieArray = getCookieContext();
		String paramPics = getPara("picContext");
		String paramNames = getPara("nameContext");
		String selectedUsers=getPara("selectedUsers");
		int publicLevel =1;
		if(selectedUsers.length()==0)
		{
			publicLevel=1;
			selectedUsers += cookieArray[0];
			
		}else
		{
			publicLevel=0;
			selectedUsers += ","+cookieArray[0];
		}
		String[] selectedUserArray = selectedUsers.split(",");
		String[] picArray = paramPics.split(",");
		String[] nameArray = paramNames.split(",");
		String batchID = UUID.randomUUID().toString();
		String config_dir = PropertiesFactoryHelper.getInstance().getConfig("resource.dir");
		File f1 = new File(config_dir+cookieArray[0]+"/detailImage"+"/"+DateUtils.getLongDate());
		File f2 = new File(config_dir+cookieArray[0]+"/timenoteImage"+"/"+DateUtils.getLongDate()); //创建小图存放区
		if (!f1.exists() || !f2.exists()) {
			f1.mkdirs();
			f2.mkdirs();
		}
		String DateTime=DateUtils.nowDateTime();
		for (int i=0;i<picArray.length;i++) {
	        copyFile(new File(ROOTPATH + "/imgTemp/"+picArray[i]), f1, null);
	        copyFile(new File(ROOTPATH +"/imgTemp/small/"+picArray[i]), f2, null);
	        //写入相关的表，用Transaction提交。
	        Content content = new Content();
	        boolean r=content.set("SourceInfoStreamID", 0).set("BatchID", batchID).set("infoStreamContent", "分享图片~").set("DateCreated", DateTime)
	        		.set("DateModified", "").set("StartTime", DateTime.substring(0,10)).set("UPDATE_NUM", 0).set("colorType", 0).set("alarmClockTime", DateTime.substring(11,19))
	        		.set("readTimes", 0).set("noticeState", 0).set("UserID", cookieArray[0]).set("UserName", UserController.getDisplayNamebyUserID(cookieArray[0].toString()))
	        		.set("STORECOUNT", 0).set("totalGrade", 0).set("gradeTotalPersons", 0).set("publicLevel_piazza", 1).set("tags", "").set("isAllowComment", 1)
	        		.set("displayText", 1).set("orderValue", 1).set("IP", "127.0.0.1").set("intCount", 0).set("ncsCount", 0).set("infoType", 0)
	        		.set("SOURCE", "web").set("groupId", UserController.getDefaultGroupID(cookieArray[0].toString())).set("schoolID", cookieArray[3]).set("publicLevel", publicLevel).set("Type", 2).save();
	        if (r){
	        	String picName = nameArray[i]!=null ? nameArray[i] : picArray[i];	
	        	new Attachment().set("infoStreamID", content.getInt("infoStreamID")).set("Title", picName)
	        		.set("Description", "from web").set("AttachmentContent", cookieArray[0]+"/detailImage"+"/"+DateUtils.getLongDate()+"/"+picArray[i])
	        		.set("AttachmentType", 0).set("DateCreated", DateTime).set("Type", 2).save();
	        	for (String sendUser :selectedUserArray) {
	        		new Index().set("infoStreamID", content.getInt("infoStreamID")).set("UserID", sendUser).set("UserName", UserController.getDisplayNamebyUserID(sendUser))
	        			.set("AuthorID", sendUser).set("ReadMark", 0).set("DateLine", DateTime).save();
	        	}
	        }
		}
		msgmap.put("success", true);
		msgmap.put("msg", "你上传的"+picArray.length+"张图片已发布成功！");
		//render(new JsonRender(msgmap).forIE());
		renderJson(msgmap);
		
	}
}
