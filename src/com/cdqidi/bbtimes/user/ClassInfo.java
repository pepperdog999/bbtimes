package com.cdqidi.bbtimes.user;

import com.jfinal.ext.plugin.tablebind.TableBind;
import com.jfinal.plugin.activerecord.Model;

@TableBind(tableName="ms_group",pkName="ID")
public class ClassInfo extends Model<ClassInfo>{
	private static final long serialVersionUID = 1L;
	public final static ClassInfo dao = new ClassInfo();

}