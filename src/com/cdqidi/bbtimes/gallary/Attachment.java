package com.cdqidi.bbtimes.gallary;

import com.jfinal.ext.plugin.tablebind.TableBind;
import com.jfinal.plugin.activerecord.Model;

@TableBind(tableName="ns_infostream_attachment",pkName="AttachmentID")
public class Attachment extends Model<Attachment>{
	private static final long serialVersionUID = 1L;
	public final static Attachment dao = new Attachment();

}
