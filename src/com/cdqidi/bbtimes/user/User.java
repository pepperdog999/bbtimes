package com.cdqidi.bbtimes.user;

import com.jfinal.ext.plugin.tablebind.TableBind;
import com.jfinal.plugin.activerecord.Model;

@TableBind(tableName="be_users",pkName="UserID")
public class User extends Model<User>{
	private static final long serialVersionUID = 1L;
	public final static User dao = new User();

}