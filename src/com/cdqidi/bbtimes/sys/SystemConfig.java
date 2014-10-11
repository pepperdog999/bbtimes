package com.cdqidi.bbtimes.sys;

import com.cdqidi.bbtimes.login.LoginInterceptor;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.jfinal.ext.interceptor.SessionInViewInterceptor;
import com.jfinal.ext.plugin.sqlinxml.SqlInXmlPlugin;
import com.jfinal.ext.plugin.tablebind.AutoTableBindPlugin;
import com.jfinal.ext.plugin.tablebind.SimpleNameStyles;
import com.jfinal.ext.route.AutoBindRoutes;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.c3p0.C3p0Plugin;
import com.jfinal.plugin.ehcache.EhCachePlugin;

/**
 * API引导式配置
 */
public class SystemConfig extends JFinalConfig {

	/**
	 * 配置常量
	 */
	public void configConstant(Constants me) {
		// 加载少量必要配置，随后可用getProperty(...)获取值
		loadPropertyFile("db_config.txt");
		me.setDevMode(getPropertyToBoolean("devMode", false));
	}

	/**
	 * 配置路由
	 */
	public void configRoute(Routes me) {
		me.add(new AutoBindRoutes());
	}

	/**
	 * 配置插件
	 */
	public void configPlugin(Plugins me) {
		// 配置C3p0数据库连接池插件
		C3p0Plugin c3p0Plugin = new C3p0Plugin(getProperty("jdbcUrl"),
				getProperty("user"), getProperty("password").trim());
		me.add(c3p0Plugin);

		// 配置ActiveRecord插件
		/*
		 * ActiveRecordPlugin arp = new ActiveRecordPlugin(c3p0Plugin);
		 * me.add(arp);
		 */

		AutoTableBindPlugin autoTableBindPlugin = new AutoTableBindPlugin(
				c3p0Plugin, SimpleNameStyles.LOWER);
		autoTableBindPlugin.setShowSql(true);// 显示sql查询语句
		me.add(autoTableBindPlugin);
		// 配置EHcache缓存插件

		EhCachePlugin cachePlugin = new EhCachePlugin(
				SystemConfig.class.getResource("ehcache.xml"));
		me.add(cachePlugin);
		// 注册sql配置文件
		SqlInXmlPlugin sqlInXmlPlugin = new SqlInXmlPlugin();
		me.add(sqlInXmlPlugin);

	}

	/**
	 * 配置全局拦截器
	 */
	public void configInterceptor(Interceptors me) {
		me.add(new SessionInViewInterceptor());
		me.add(new LoginInterceptor());
	}

	/**
	 * 配置处理器
	 */
	public void configHandler(Handlers me) {

	}

}
