/**
 * 本模块提供的API包括：
 * 1. Version（无函数）
 * 2. DBinit（无函数）
 */
package main;
import java.text.SimpleDateFormat;
import java.util.Map;

import org.apache.log4j.*;
import org.json.JSONArray;
import org.json.JSONObject;

import base.*;

public class SysConfig {
	XMLDriver xml= new XMLDriver();
	DBDriver dbd = new DBDriver();
	Inform info=new Inform();
//	配置日志属性文件位置
	static String confpath=System.getProperty("user.dir").replace("\\bin", "");
	static String logconf=confpath+"\\conf\\EAS\\log.properties";
	static String sysconf=confpath+"\\conf\\EAS\\Sys_config.xml";
	Logger logger = Logger.getLogger(SysConfig.class.getName());
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	
	/**[Function] 				API解释模块，根据API检查必要的参数和请求数据的完整性，调用对应API实现模块
	 * @param API			API字符串
	 * @param Param		API请求中URL携带的参数表
	 * @param body		API请求携带的body数据，Json格式字符串
	 * @param token		校验字，API请求携带的header参数，用来保证报文的可靠性和安全性
	 * @return [String]		Json格式字符串，返回API执行的结果
	 */
	public String DoAPI(String API,Map<String, String[]> Param,String body){						
		PropertyConfigurator.configure(logconf);		
		String message="";
		logger.info("API: "+API+" "+" [Body]"+body);
		String backvalue="412,http 请求的参数缺失或无效";
		String type=checkpara(Param,"type");
		String key=checkpara(Param,"key");
		try {
			switch(API){
			case "GetMailConf":
				logger.info("获取邮件服务配置...");
				return GetMC();
			case "UpdateMailConf":
				if(!body.equals("")) {
					logger.info("更新邮件服务配置...");
					UpdateMC(body);
					backvalue="200,ok";
				}
				break;
			case "TestMailConf":
				String Reciver=checkpara(Param,"mailto");
				if(!Reciver.equals("")) {
					logger.info("测试邮件服务配置...");
					TestMC(Reciver);
					backvalue="200,ok";
				}
				break;
			case "AddDict":
				if(!key.equals("") && !type.equals("")) {
					logger.info("为字典"+type+"添加新条目'"+key+"'...");
					AddDict(type,key);
					backvalue="200,ok";
				}			
				break;
			case "DelDict":   
				if(!key.equals("") && !type.equals("")) {
					logger.info("删除字典"+type+"条目...");
					DelDict(type,key);
					backvalue="200,ok";
				}			
				break;
			case "ListDict":  
				logger.info("获取字典"+type+"列表...");
				return ListDict(type);	
			default:
				logger.error("无效API: "+API);
				backvalue="400,无效API!";
			}
		}catch (Throwable e) {
			backvalue=e.getMessage();
			int firtag=backvalue.lastIndexOf("[info]");
			if(firtag>-1) backvalue=backvalue.substring(firtag+6);
			else backvalue="500,"+backvalue;
			logger.error(backvalue,e);
		}	
		String code=backvalue.substring(0,backvalue.indexOf(","));
		message=backvalue.substring(backvalue.indexOf(",")+1);
		backvalue="{\"code\":"+code+",\"message\":\""+message+"\"}";
		return backvalue;
	}
	/**
	 * 函数说明：获取邮件服务配置
	 * @return	  JSON格式字符串，如：{"smtpHost":"111.111.111.1","port":"25","account":"abc","passwd":"111","auth":"true","tls":"false","ssl":"false","code":200}
	 * @throws Throwable
	 */
	String GetMC() throws Throwable{	
		PropertyConfigurator.configure(logconf);
		try {
			JSONObject MailConf=new JSONObject();
			MailConf.put("smtpHost", xml.GetNode(sysconf, "Mail_conf/smtpHost"));
			MailConf.put("port", xml.GetNode(sysconf, "Mail_conf/port"));
			MailConf.put("account", xml.GetNode(sysconf, "Mail_conf/account"));
			MailConf.put("auth", xml.GetNode(sysconf, "Mail_conf/auth"));
			MailConf.put("tls", xml.GetNode(sysconf, "Mail_conf/tls"));
			MailConf.put("ssl", xml.GetNode(sysconf, "Mail_conf/ssl"));
			MailConf.put("code",200);
			return MailConf.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：修改邮件服务配置
	 * @param mailconf	新件服务配置
	 * @throws Throwable
	 */
	void UpdateMC(String mailconf) throws Throwable{	
		PropertyConfigurator.configure(logconf);
		try {
			JSONObject mc=new JSONObject(mailconf);
			xml.Update(sysconf, "Mail_conf/smtpHost", mc.getString("smtpHost"));
			xml.Update(sysconf, "Mail_conf/port", mc.getString("port"));
			xml.Update(sysconf, "Mail_conf/account", mc.getString("account"));
			xml.Update(sysconf, "Mail_conf/passwd", mc.getString("passwd"));
			xml.Update(sysconf, "Mail_conf/auth", mc.getString("auth"));
			xml.Update(sysconf, "Mail_conf/tls", mc.getString("tls"));
			xml.Update(sysconf, "Mail_conf/ssl", mc.getString("ssl"));
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：测试邮件服务配置
	 * @param Receiver	用来发送测试邮件的目的地址
	 * @throws Throwable	
	 */
	void TestMC(String Receiver) throws Throwable{	
		PropertyConfigurator.configure(logconf);
		try {
			info.SDemail(Receiver, "eas@cig.com.cn", "这是一封测试邮件", "测试邮件，请勿回复！", "text/html;charset=UTF8", "");
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：添加一个字典条目
	 * @param type		字典类型
	 * @param key	条目信息
	 * @throws Exception 409，该条目已存在
	 */
	void AddDict(String type, String key) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String DBname="dict_"+type;			
			int row=dbd.check(DBname, "dkey", key);
			if(row>0)throw new Exception("[info]409,"+key+"已经存在！");
//			添加记录
			String[] cols= {"dkey"};
			String[] record= {key};
			dbd.AppendSQl(DBname, cols, record, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：删除一个字典条目
	 * @param type		字典类型
	 * @param key		条目信息
	 * @throws Exception 409, 机房被使用，不满足删除条件
	 */
	void DelDict(String type, String key) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String DBname="dict_"+type;		
			String[] keys=key.split(",");
			for(int i=0;i<keys.length;i++) {
				int row=dbd.check(DBname, "dkey", keys[i]);
				if(row>0)dbd.DelSQl(DBname, row, 1, 1);
			}			
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * [function]	获取字典条目列表
	 * @param type		字典类型
	 * @return		JSON格式字符串，如{"dict":["idc","xxx","contact","0.00"],"code":200}
	 * @throws Exception
	 */
	String ListDict(String type) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {
			JSONObject dict=new JSONObject();
			
			if(!type.equals("")) {
				String DBname="dict_"+type;					
				JSONArray diclist= new JSONArray();
				String[][] list=dbd.readDB(DBname, "dkey", "id>0");
				if(!list[0][0].equals("")){
					for(int i=0;i<list.length;i++)diclist.put(i, list[i][0]);
				}
				dict.put(type, diclist);
			}
			else {
				String[] dbn= {"os","part_type","dept_contractor"};
				for(int n=0;n<dbn.length;n++) {
					String DBname="dict_"+dbn[n];					
					String[][] list=dbd.readDB(DBname, "dkey", "id>0");
					JSONArray diclist= new JSONArray();
					if(!list[0][0].equals("")){
						for(int i=0;i<list.length;i++)diclist.put(i, list[i][0]);
					}
					dict.put(dbn[n], diclist);
				}
			}			
			dict.put("code",200);
			return dict.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**[Function] 				获取http请求报文中的参数值
	 * @author para		请求报文中的参数序列
	 * @author key			预期的参数名
	 * @return [String]		返回参数结果，如果请求的参数序列为空，或者没有要查询的参数，返回“”，否则返回查询到的参数值
	 */
	String checkpara(Map<String,String[]> para,String key){
		PropertyConfigurator.configure(logconf);
		String ba="";		
		if(para.size()>0){
			try{
				String[] val=para.get(key);
				if(null!=val)ba=val[0];
			}catch(NullPointerException e){
				logger.error(e.getMessage());
			}
		}	
		return ba;
	}
}