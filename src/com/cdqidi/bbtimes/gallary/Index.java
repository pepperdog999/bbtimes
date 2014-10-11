package com.cdqidi.bbtimes.gallary;

import com.jfinal.ext.plugin.tablebind.TableBind;
import com.jfinal.plugin.activerecord.Model;

@TableBind(tableName="ns_infostream_index",pkName="IndexID")
public class Index extends Model<Index>{
	private static final long serialVersionUID = 1L;
	public final static Index dao = new Index();

}
