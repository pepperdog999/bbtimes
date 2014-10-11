package com.cdqidi.bbtimes.gallary;

import com.jfinal.ext.plugin.tablebind.TableBind;
import com.jfinal.plugin.activerecord.Model;

@TableBind(tableName="ns_infostream_content",pkName="infoStreamID")
public class Content extends Model<Content>{
	private static final long serialVersionUID = 1L;
	public final static Content dao = new Content();

}

