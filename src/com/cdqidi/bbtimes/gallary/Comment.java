package com.cdqidi.bbtimes.gallary;

import com.jfinal.ext.plugin.tablebind.TableBind;
import com.jfinal.plugin.activerecord.Model;

@TableBind(tableName="ms_info_comment",pkName="ID")
public class Comment extends Model<Comment>{
	private static final long serialVersionUID = 1L;
	public final static Comment dao = new Comment();

}
