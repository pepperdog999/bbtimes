package com.cdqidi.bbtimes.user;

import com.jfinal.ext.plugin.tablebind.TableBind;
import com.jfinal.plugin.activerecord.Model;

@TableBind(tableName="be_profiles",pkName="ProfileID")
public class Profile extends Model<Profile>{
	private static final long serialVersionUID = 1L;
	public final static Profile dao = new Profile();

}
