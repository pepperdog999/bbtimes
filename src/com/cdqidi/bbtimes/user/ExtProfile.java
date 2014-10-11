package com.cdqidi.bbtimes.user;

import com.jfinal.ext.plugin.tablebind.TableBind;
import com.jfinal.plugin.activerecord.Model;

@TableBind(tableName="be_extProfiles",pkName="extProfileID")
public class ExtProfile extends Model<ExtProfile>{
	private static final long serialVersionUID = 1L;
	public final static ExtProfile dao = new ExtProfile();

}
