package com.cdqidi.bbtimes.user;

import com.jfinal.ext.plugin.tablebind.TableBind;
import com.jfinal.plugin.activerecord.Model;

@TableBind(tableName="be_schoolInfo",pkName="SchoolID")
public class SchoolInfo extends Model<SchoolInfo>{
	private static final long serialVersionUID = 1L;
	public final static SchoolInfo dao = new SchoolInfo();

}