package main;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.apache.log4j.*;

import base.*;

public class EAS {
	DBDriver dbd = new DBDriver();
//	配置日志属性文件位置
	static String confpath=System.getProperty("user.dir").replace("\\bin", "");
	static String logconf=confpath+"\\conf\\EAS\\log.properties";
	static String sysconf=confpath+"\\conf\\EAS\\Sys_config.xml";
	Logger logger = Logger.getLogger(EAS.class.getName());
	
	SimpleDateFormat sdf_full = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	SimpleDateFormat sdf_ymd=new SimpleDateFormat("yyyy-MM-dd");
	
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
		String page_count=checkpara(Param,"page_count");
		String page_num=checkpara(Param,"page_num");
		String filter=checkpara(Param,"filter");
		String idc=checkpara(Param,"idc");
		String asset_id=checkpara(Param,"asset_id");
		String supplier=checkpara(Param,"supplier");
		String supplier_type=checkpara(Param,"supplier_type");
		String service_id=checkpara(Param,"service_id");
		String user=checkpara(Param,"user");
		String ip=checkpara(Param,"ip");
		String net=checkpara(Param,"net");
		String type=checkpara(Param,"type");
		String vm_name=checkpara(Param,"name");
		try {
			switch(API){
			case "AddIDC":
				if(!body.equals("") && !idc.equals("")) {
					logger.info("添加新机房'"+idc+"'...");
					AddIDC(idc,body);
					backvalue="200,ok";
				}			
				break;
			case "UpdateIDC":  
				if(!body.equals("") && !idc.equals("")) {
					logger.info("更新'"+idc+"'信息...");
					UpdateIDC(idc,body);
					backvalue="200,ok";
				}			
				break;
			case "DelIDC":   
				if(!idc.equals("")) {
					logger.info("删除'"+idc+"'...");
					DelIDC(idc);
					backvalue="200,ok";
				}			
				break;
			case "ListIDC":   			
				logger.info("获取机房列表...");
				return ListIDC(filter,page_count,page_num);	
			case "AddServ":
				if(!body.equals("") && !asset_id.equals("")) {
					logger.info("添加新设备("+asset_id+")...");
					AddServ(asset_id,body);
					backvalue="200,ok";
				}			
				break;
			case "UpdateServ":  
				if(!body.equals("") && !asset_id.equals("")) {
					logger.info("更新设备("+asset_id+")信息...");
					UpdateServ(asset_id,body);
					backvalue="200,ok";
				}			
				break;
			case "DelServ":   
				if(!asset_id.equals("")) {
					logger.info("删除设备("+asset_id+")...");
					DelServ(asset_id);
					backvalue="200,ok";
				}			
				break;
			case "ListServ":   			
				logger.info("获取设备列表...");
				return ListServ(filter,page_count,page_num);	
			case "OnLine_Serv":  
				if(!body.equals("") && !asset_id.equals("") && !user.equals("")) {
					logger.info("设备("+asset_id+")上线...");
					OnlineServ(asset_id,user,body);
					backvalue="200,ok";
				}			
				break;
			case "ListServ_ol":   			
				logger.info("获取线上设备列表...");
				return ListServ_ol(filter,page_count,page_num);	
			case "ListServ_VM":   		
				if(!idc.equals("")){
					logger.info("获取线上服务器列表...");
					return ListServ_VM(idc);	
				}
				break;
			case "UpdateServ_ol":  
				if(!body.equals("") && !asset_id.equals("") && !user.equals("")) {
					logger.info("更新设备("+asset_id+")信息...");
					UpdateServ_ol(asset_id,user,body);
					backvalue="200,ok";
				}			
				break;
			case "DownlineServ":  
				if(!asset_id.equals("") && !user.equals("")) {
					logger.info("设备("+asset_id+")下架...");
					DownlineServ(asset_id,user);
					backvalue="200,ok";
				}			
				break;
			case "FixServ":  
				if(!body.equals("") && !asset_id.equals("")) {
					logger.info("维修设备("+asset_id+")...");
					FixServ(asset_id,body);
					backvalue="200,ok";
				}			
				break;
			case "ListServ_fix":   			
				logger.info("获取维修设备列表...");
				return ListServ_fix(filter,page_count,page_num);	
			case "EndFixServ":  
				if(!asset_id.equals("")) {
					logger.info("设备("+asset_id+")结束维修...");
					EndFixServ(asset_id);
					backvalue="200,ok";
				}			
				break;
			case "AddPart":
				if(!body.equals("") && !asset_id.equals("")) {
					logger.info("添加新零配件("+asset_id+")...");
					AddPart(asset_id,body);
					backvalue="200,ok";
				}			
				break;
			case "UpdatePart":  
				if(!body.equals("") && !asset_id.equals("") && !user.equals("")) {
					logger.info("更新零配件("+asset_id+")信息...");
					UpdatePart(asset_id,user,body);
					backvalue="200,ok";
				}			
				break;
			case "DelPart":   
				if(!asset_id.equals("")) {
					logger.info("删除零配件("+asset_id+")...");
					DelPart(asset_id);
					backvalue="200,ok";
				}			
				break;
			case "ListPart":   			
				logger.info("获取零配件列表...");
				return ListPart(filter,page_count,page_num);	
			case "AddService":
				String manufacturer=checkpara(Param,"manufacturer");
				String service=checkpara(Param,"service");
				if(!body.equals("") && !manufacturer.equals("") && !service.equals("") && !user.equals("")) {
					logger.info("添加新服务("+asset_id+")...");
					AddService(manufacturer,service,user,body);
					backvalue="200,ok";
				}			
				break;
			case "UpdateService":  
				if(!body.equals("") && !service_id.equals("") && !user.equals("")) {
					logger.info("更新服务("+service_id+")信息...");
					UpdateService(user,service_id,body);
					backvalue="200,ok";
				}			
				break;
			case "DelService":   
				if(!service_id.equals("") && !user.equals("")) {
					logger.info("删除服务("+service_id+")...");
					DelService(service_id,user);
					backvalue="200,ok";
				}			
				break;
			case "ListService":   			
				logger.info("获取服务列表...");
				return ListService(filter,page_count,page_num);	
			case "AddIP":
				if(!body.equals("") && !ip.equals("") && !type.equals("") && !idc.equals("")) {
					logger.info("添加新IP地址"+ip+"...");
					AddIP(idc,ip,type,body);
					backvalue="200,ok";
				}			
				break;
			case "UpdateIP":  
				if(!body.equals("") && !ip.equals("") && !type.equals("") && !idc.equals("")) {
					logger.info("更新IP地址"+ip+"的信息...");
					UpdateIP(idc,ip,type,body);
					backvalue="200,ok";
				}			
				break;
			case "DelIP":   
				if(!ip.equals("") && !type.equals("") && !idc.equals("")) {
					logger.info("删除IP地址"+ip+"...");
					DelIP(idc,ip,type);
					backvalue="200,ok";
				}			
				break;
			case "ListIP":   		
				if(!type.equals("")) {
					logger.info("获取IP地址列表...");
					return ListIP(filter,type,page_count,page_num);	
				}			
				break;
			case "AddSupplier":
				if(!body.equals("") && !supplier_type.equals("") && !supplier.equals("")) {
					logger.info("添加新"+supplier_type+": "+supplier+"...");
					AddSupplier(supplier_type,supplier,body);
					backvalue="200,ok";
				}			
				break;
			case "AddNet":
				if(!body.equals("") && !net.equals("") && !idc.equals("")) {
					logger.info("添加新网络"+net+"...");
					AddNet(idc,net,body);
					backvalue="200,ok";
				}			
				break;
			case "DelNet":   
				if(!net.equals("") && !idc.equals("")) {
					logger.info("删除"+idc+"的网络"+net+"...");
					DelNet(idc,net);
					backvalue="200,ok";
				}			
				break;
			case "ListNet":   	
				logger.info("获取私有网络列表...");
				return ListNet(idc);	
			case "UpdateSupplier":  
				if(!body.equals("") && !supplier_type.equals("") && !supplier.equals("")) {
					logger.info("更新"+supplier_type+"'"+supplier+"'的信息...");
					UpdateSupplier(supplier_type,supplier,body);
					backvalue="200,ok";
				}			
				break;
			case "DelSupplier":   
				if(!supplier_type.equals("") && !supplier.equals("")) {
					logger.info("删除"+supplier_type+supplier+"...");
					DelSupplier(supplier_type,supplier);
					backvalue="200,ok";
				}			
				break;
			case "ListSupplier":   			
				logger.info("获取服务商列表...");
				return ListSupplier(supplier_type,filter,page_count,page_num);	
			case "AddVMServ":	
				if(!body.equals("") && !user.equals("")) {
					logger.info("为企业云添加新服务器...");
					AddVMServ(body,user);	
					backvalue="200,ok";
				}				
				break;
			case "ListVMServ":   	
				logger.info("列出所有企业云服务器...");
				return ListVMServ();	
			case "GetVMServer":
				if(!asset_id.equals("")) {
					logger.info("获取企业云服务器"+asset_id+"的信息及下属虚拟机列表...");
					return GetVMServer(asset_id);	
				}
				break;
			case "DelVMServ":   		
				if(!asset_id.equals("") && !user.equals("")) {
					logger.info("删除企业云服务器"+asset_id);
					DelVMServ(asset_id,user);
					backvalue="200,ok";
				}
				break;
			case "UpdateVMServ":	
				if(!body.equals("") && !asset_id.equals("") && !user.equals("")) {
					logger.info("修改企业云服务器信息...");
					UpdateVMServ(asset_id,body,user);	
					backvalue="200,ok";
				}				
				break;
			case "AddVM":	
				if(!body.equals("")  && !asset_id.equals("") && !user.equals("")) {
					logger.info("添加新虚拟机...");
					AddVM(asset_id,user,body);	
					backvalue="200,ok";
				}				
				break;
			case "DelVM":   		
				if(!vm_name.equals("") && !user.equals("")) {
					logger.info("删除虚拟机"+vm_name);
					DelVM(vm_name,user);
					backvalue="200,ok";
				}
				break;
			case "UpdateVM":	
				if(!body.equals("") && !vm_name.equals("") && !user.equals("")) {
					logger.info("修改虚拟机信息...");
					UpdateVM(vm_name,user,body);	
					backvalue="200,ok";
				}				
				break;
			case "FindVM":
				String key=checkpara(Param,"key");
				String value=checkpara(Param,"value");
				logger.info("查询"+key+"="+value+"的虚拟机...");
				return ListVM(key,value);	
			case "ListLogs":   	
				String logtype=checkpara(Param,"type");
				if(!logtype.equals("")) {
					logger.info("获取机房操作日志...");
					return ListLogs(filter,logtype);	
				}
				break;
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
	 * 函数说明：添加一个机房
	 * @param IDC		新机房名称
	 * @param body	机房信息
	 * @throws Exception 409，该机房已存在
	 */
	void AddIDC(String IDC, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			int row=dbd.check("sys_idc", "idc", IDC);
			if(row>0)throw new Exception("[info]409,"+IDC+"已经存在！");
//			添加记录
			String[] cols= {"idc","contact","mobile","email","address","note"};
			String[] record=new String[cols.length];
			record[0]=IDC;
			JSONObject idc_dat=new JSONObject(body);
			for(int i=1;i<cols.length;i++)record[i]=idc_dat.getString(cols[i]);
			dbd.AppendSQl("sys_idc", cols, record, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：修改机房信息
	 * @param IDC		机房名
	 * @param body	新的机房信息数据
	 * @throws Exception 404，该机房不存在
	 * @throws Exception 409，该机房不存在
	 */
	void UpdateIDC(String IDC, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			int row=dbd.check("sys_idc", "idc", IDC);
			if(row==0)throw new Exception("[info]404, 机房'"+IDC+"'不存在！");
			JSONObject idc_dat=new JSONObject(body);
			String idc_name=idc_dat.getString("idc");
			if(!idc_name.equals(IDC)) {
				int row1=dbd.check("sys_idc", "idc", idc_name);
				if(row1>0)throw new Exception("[info]409, 机房名'"+idc_name+"'已被使用！");
			}
			String[] cols= {"idc","contact","mobile","email","address","note"};
			for(int i=0;i<cols.length;i++) {
				dbd.UpdateSQl("sys_idc", row, cols[i], idc_dat.getString(cols[i]));
			}
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：删除一个机房
	 * @param IDC	机房名
	 * @throws Exception 409, 机房被使用，不满足删除条件
	 */
	void DelIDC(String IDC) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			int row=dbd.check("sys_idc", "idc", IDC);
			if(row>0) {
				int rowa=dbd.check("sys_device_ol", "idc", IDC);
				if(rowa>0)throw new Exception("[info]409, "+IDC+"已使用，不能删除！");
				dbd.DelSQl("sys_idc", row, 1, 1);
			}
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * [function]	获取机房列表
	 * @param filter		过滤条件
	 * @param page_count	每页要显示的条目数
	 * @param page_num	指定要显示的页码
	 * @return		JSON格式字符串，如{"IDC":[{"idc":"xxx","contact":"xx","mobile":"1111","email":"xxx@111.com","address":"xxx",
	 * "note":"0.00"},...],"total_num":"40","code":200}
	 * @throws Exception
	 */
	String ListIDC(String filter, String page_count,String page_num) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {	
			if(filter.equals(""))filter="id>0";	
			else if(filter.indexOf("=")==-1)filter=filter.replace("*", "%");
			filter=filter+" order by idc";	
			String filter1=filter;
			if(!page_count.equals("")&&!page_num.equals("")) {
				int pg_count=Integer.parseInt(page_count);
				int pg_num=Integer.parseInt(page_num);
				int past_itemnum=pg_count*(pg_num-1);
				filter=filter+" limit "+past_itemnum+","+pg_count;
			}
			
			JSONObject IDC=new JSONObject();
			JSONArray idclist= new JSONArray();
			String colname="idc,contact,mobile,email,address,note";
			String[][] idc_list=dbd.readDB("sys_idc", colname, filter);
			int num=dbd.checknum("sys_idc", "id", filter1);
			if(!idc_list[0][0].equals("")){
				String[] col=colname.split(",");
				for(int i=0;i<idc_list.length;i++) {
					JSONObject fee=new JSONObject();	
					for(int j=0;j<col.length;j++)fee.put(col[j], idc_list[i][j]);
					idclist.put(i, fee);
				}
			}					
			IDC.put("total_num", num);
			IDC.put("IDC", idclist);
			IDC.put("code",200);
			return IDC.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**
	 * 函数说明：添加一个设备(库房)
	 * @param asset_id		资产编号
	 * @param body			资产信息
	 * @throws Exception 409，该资产已存在
	 */
	void AddServ(String asset_id, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			int row=dbd.check("sys_device", "asset_id", asset_id);
			if(row>0)throw new Exception("[info]409, 资产["+asset_id+"]已经存在！");
//			添加记录
			String[] cols= {"asset_id","status","type","model","series_num","capacity","note","protect_time","price"};
			String[] record=new String[cols.length];
			record[0]=asset_id;
			record[1]="闲置";
			JSONObject dat=new JSONObject(body);
			for(int i=2;i<cols.length;i++)record[i]=dat.getString(cols[i]);
			dbd.AppendSQl("sys_device", cols, record, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：修改设备(库房)信息
	 * @param asset_id		资产编号
	 * @param body			资产信息
	 * @throws Exception 404，该资产不存在
	 */
	void UpdateServ(String asset_id, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			int row=dbd.check("sys_device", "asset_id", asset_id);
			if(row==0)throw new Exception("[info]404, 资产["+asset_id+"]不存在！");
			JSONObject dat=new JSONObject(body);
			String[] cols= {"type","model","series_num","capacity","note","protect_time","price"};
			for(int i=0;i<cols.length;i++) {
				String va=dat.getString(cols[i]);
				if(cols[i].equals("protect_time") && va.equals(""))va="0001-01-01";
				dbd.UpdateSQl("sys_device", row, cols[i], va);
			}
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：删除一个设备(库房)
	 * @param asset_id	设备资产编号
	 * @throws Exception
	 */
	void DelServ(String asset_id) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {		
			int row=dbd.check("sys_device", "asset_id", asset_id);
			if(row>0)dbd.DelSQl("sys_device", row, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：上架一个设备(库房)
	 * @param asset_id	设备资产编号
	 * @param user			操作用户
	 * @param body		资产上架信息
	 * @throws Exception 404, IP资源不存在
	 * @throws Exception 409, IP、机柜、层资源被占用
	 */
	void OnlineServ(String asset_id, String user,String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {		
			String[][] serv=dbd.readDB("sys_device", "id,type,model,capacity", "asset_id='"+asset_id+"'");
			if(serv[0][0].equals("")) throw new Exception("[info]404, 资产["+asset_id+"]不存在！");
//			获取设备上线信息
			String[] colname= {"asset_id","type","model","capacity","status","idc","cabinet","layer","os","ip1","user","note"};
			String[] record=new String[colname.length];
			record[0]=asset_id;
			record[1]=serv[0][1];
			record[2]=serv[0][2];
			record[3]=serv[0][3];
			record[4]="正常";
			JSONObject dat=new JSONObject(body);
			for(int i=5;i<colname.length;i++)record[i]=dat.getString(colname[i]);
//			确认资源有效性（机房、机柜、层号和IP）
			String[] Col_idc= {"idc","cabinet","layer"};
			String[] key= {record[5],record[6],record[7]};
			int row=dbd.check("sys_device_ol", Col_idc, key);
			if(row>0) throw new Exception("[info]409, 机房："+record[5]+"，机柜："+record[6]+"的第"+record[7]+"层已被使用！");
			
			String filt="idc='"+record[5]+"' and ip='"+record[9]+"'";
			String[][] ip_sta=dbd.readDB("sys_ip_public", "status", filt);
			if(ip_sta[0][0].equals("")) {
				ip_sta=dbd.readDB("sys_ip_private", "status", filt);
				if(ip_sta[0][0].equals(""))throw new Exception("[info]404, 机房"+record[5]+"不存在IP"+record[9]);
			}
			if(ip_sta[0][0].equals("使用中")) throw new Exception("[info]409, IP"+record[9]+"已被使用！");

//			向线上设备表添加记录
			dbd.AppendSQl("sys_device_ol", colname, record, 1, 1);
//			修改设备库表状态
			row=Integer.parseInt(serv[0][0]);
			dbd.UpdateSQl("sys_device", row, "status", "使用中");
			
//			占用IP资源
			String DBname="sys_ip_public";
			String[][] ips=dbd.readDB(DBname, "id,note", "ip='"+record[9]+"'");
			if(ips[0][0].equals("")) {
				DBname="sys_ip_private";
				ips=dbd.readDB(DBname, "id,note", "ip='"+record[9]+"'");
			}
			if(!ips[0][0].equals("")){
				row=Integer.parseInt(ips[0][0]);
				dbd.UpdateSQl(DBname, row, "status", "使用中");
				dbd.UpdateSQl(DBname, row, "asset_id", asset_id);
				dbd.UpdateSQl(DBname, row, "user", record[10]);
				if(ips[0][1].equals(""))dbd.UpdateSQl(DBname, row, "note", "[sysinfo]"+sdf_ymd.format(new Date())+ ", 分配给"+record[1]+asset_id);
			}
			
//			追加操作日志
			String[] col_log= {"type","logdate","operator","obj","log"};
			String[] rec_log= {"物理设备",sdf_full.format(new Date()),user,asset_id,record[1]+asset_id+"上架"};
			dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：修改设备(线上)信息
	 * @param asset_id		资产编号
	 * @param user				操作用户
	 * @param body			资产信息
	 * @throws Exception 404, IP不存在
	 * @throws Exception 409, IP、机柜、层资源被占用
	 */
	void UpdateServ_ol(String asset_id, String user, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String[][] serv=dbd.readDB("sys_device_ol","id,type,ip1,idc,cabinet,layer,os,user,note" ,"asset_id='"+asset_id+"'");
			if(serv[0][0].equals(""))throw new Exception("[info]404, 资产["+asset_id+"]不在线上！");

			JSONObject dat=new JSONObject(body);
			String[] cols= {"ip1","idc","cabinet","layer","os","user","note"};
			String newIP=dat.getString("ip1");
			String idc=dat.getString("idc");
			if(!serv[0][2].equals(newIP)) {
//				判断新IP是否有效
				String filt="idc='"+idc+"' and ip='"+newIP+"'";
				String[][] ip_sta=dbd.readDB("sys_ip_public", "status", filt);
				if(ip_sta[0][0].equals("")) {
					ip_sta=dbd.readDB("sys_ip_private", "status", filt);
					if(ip_sta[0][0].equals(""))throw new Exception("[info]404, 机房"+idc+"不存在IP"+newIP);
				}
				if(ip_sta[0][0].equals("使用中")) throw new Exception("[info]409, IP"+newIP+"已被使用！");
			}
//			修改设备信息		
			int row=Integer.parseInt(serv[0][0]);
			for(int i=0;i<cols.length;i++) {
				String va=dat.getString(cols[i]);
				dbd.UpdateSQl("sys_device_ol", row, cols[i], va);
			}
//			变更虚拟服务器的位置信息
			int row_vm=dbd.check("sys_vmm_phy_server", "asset_id", asset_id);
			if(row_vm>0) {
				String loct=dat.getString("cabinet")+"号机柜，第"+dat.getString("layer")+"层";	
				dbd.UpdateSQl("sys_vmm_phy_server", row_vm, "locate", loct);
				dbd.UpdateSQl("sys_vmm_phy_server", row_vm, "idc", idc);
			}
			if(!serv[0][2].equals(newIP)) {
	//			释放原有IP资源
				String DBname="sys_ip_public";
				String[][] ips=dbd.readDB(DBname, "id,note", "ip='"+serv[0][2]+"'");
				if(ips[0][0].equals("")) {
					DBname="sys_ip_private";
					ips=dbd.readDB(DBname, "id,note", "ip='"+serv[0][2]+"'");
				}
				if(!ips[0][0].equals("")) {
					row=Integer.parseInt(ips[0][0]);
					dbd.UpdateSQl(DBname, row, "status", "可用");
					dbd.UpdateSQl(DBname, row, "asset_id", "");
					dbd.UpdateSQl(DBname, row, "user", "");
					if(ips[0][1].indexOf("[sysinfo]")>-1)dbd.UpdateSQl(DBname, row, "note", "");
				}				
	//			占用新的IP资源
				DBname="sys_ip_public";
				ips=dbd.readDB(DBname, "id,note", "ip='"+newIP+"'");
				if(ips[0][0].equals("")) {
					DBname="sys_ip_private";
					ips=dbd.readDB(DBname, "id,note", "ip='"+newIP+"'");
				}
				if(!ips[0][0].equals("")){
					row=Integer.parseInt(ips[0][0]);
					dbd.UpdateSQl(DBname, row, "status", "使用中");
					dbd.UpdateSQl(DBname, row, "asset_id", asset_id);
					dbd.UpdateSQl(DBname, row, "user", user);
					if(ips[0][1].equals(""))dbd.UpdateSQl(DBname, row, "note", "[sysinfo]"+sdf_ymd.format(new Date())+ ", 分配给"+serv[0][1]+asset_id);
//					变更虚拟服务器地址
					if(row_vm>0)dbd.UpdateSQl("sys_vmm_phy_server", row_vm, "ipaddr", newIP);
				}
			}
//			追加操作日志
			String[] col_log= {"type","logdate","operator","obj","log"};
			String context=serv[0][1]+asset_id+"信息变更，";
			String[] col_text= {"ip1","机房","机柜","层号","操作系统","使用人","说明"};
			for(int i=0;i<cols.length;i++) {
				String va=dat.getString(cols[i]);
				if(!serv[0][i+2].equals(va)) {
					context=context+col_text[i]+"从'"+serv[0][i+2]+"'变更为'"+va+"',";
				}
			}
			context=context.substring(0, context.length()-1);
			String[] rec_log= {"物理设备",sdf_full.format(new Date()),user,asset_id,context};
			dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：设备下架
	 * @param asset_id	设备资产编号
	 * @param user			操作用户
	 * @throws Exception 404, 资产不存在
	 * @throws Exception 409, 服务器上有虚拟机
	 */
	void DownlineServ(String asset_id, String user) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {		
			String[][] serv=dbd.readDB("sys_device_ol", "id,ip1,type","asset_id='"+asset_id+"'");
			if(!serv[0][0].equals("")) {
//				判断该设备上是否有虚拟机
				String[][] vm=dbd.readDB("sys_vmm_phy_server", "vm_num", "asset_id='"+asset_id+"'");
				if(!vm[0][0].equals("") && !vm[0][0].equals("0"))  throw new Exception("[info]409, 服务器("+asset_id+")上还有虚拟机，请先清除相关的虚拟机以释放IP资源！");
				int row=Integer.parseInt(serv[0][0]);
				dbd.DelSQl("sys_device_ol", row, 1, 1);
//				释放IP资源
				String DBname="sys_ip_public";
				String[][] ips=dbd.readDB(DBname, "id,note", "ip='"+serv[0][1]+"'");
				if(ips[0][0].equals("")) {
					DBname="sys_ip_private";
					ips=dbd.readDB(DBname, "id,note", "ip='"+serv[0][1]+"'");
				}
				if(!ips[0][0].equals("")) {
					row=Integer.parseInt(ips[0][0]);
					dbd.UpdateSQl(DBname, row, "status", "可用");					
					dbd.UpdateSQl(DBname, row, "asset_id", "");
					dbd.UpdateSQl(DBname, row, "user", "");
					if(ips[0][1].indexOf("[sysinfo]")>-1)dbd.UpdateSQl(DBname, row, "note", "");
				}
				
//				追加操作日志
				String[] col_log= {"type","logdate","operator","obj","log"};
				String[] rec_log= {"物理设备",sdf_full.format(new Date()),user,asset_id,serv[0][2]+asset_id+"下架"};
				dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
			}			
			int row=dbd.check("sys_device", "asset_id", asset_id);
			if(row==0) throw new Exception("[info]404, 资产["+asset_id+"]不存在！");
			dbd.UpdateSQl("sys_device", row, "status", "闲置");
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：维修一个设备(库房)
	 * @param asset_id	设备资产编号
	 * @param body		资产维修信息
	 * @throws Exception 404, 资产不存在
	 */
	void FixServ(String asset_id, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {		
			String[][] serv=dbd.readDB("sys_device", "id,type,model,series_num", "asset_id='"+asset_id+"'");
			if(serv[0][0].equals("")) throw new Exception("[info]404, 资产["+asset_id+"]不存在！");
//			向设备维修追踪表添加记录
			String[] colname= {"asset_id","type","model","series_num","fixtime","ma","note"};
			String[] record=new String[colname.length];
			record[0]=asset_id;
			record[1]=serv[0][1];
			record[2]=serv[0][2];
			record[3]=serv[0][3];
			JSONObject dat=new JSONObject(body);
			for(int i=4;i<colname.length;i++)record[i]=dat.getString(colname[i]);
			dbd.AppendSQl("sys_device_fix", colname, record, 1, 1);
//			修改设备库表状态
			int row=Integer.parseInt(serv[0][0]);
			dbd.UpdateSQl("sys_device", row, "status", "维修中");
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：结束维修设备
	 * @param asset_id	设备资产编号
	 * @throws Exception 404, 资产不存在
	 */
	void EndFixServ(String asset_id) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {		
			int row=dbd.check("sys_device_fix", "asset_id", asset_id);
			if(row>0)dbd.DelSQl("sys_device_fix", row, 1, 1);
			
			row=dbd.check("sys_device", "asset_id", asset_id);
			if(row==0) throw new Exception("[info]404, 资产["+asset_id+"]不存在！");
			dbd.UpdateSQl("sys_device", row, "status", "闲置");
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * [function]	获取设备(库房)列表
	 * @param filter		过滤条件
	 * @param page_count	每页要显示的条目数
	 * @param page_num	指定要显示的页码
	 * @return		JSON格式字符串，如{"Serv":[{"asset_id":"xxx","contact":"xx","mobile":"1111","email":"xxx@111.com","address":"xxx",
	 * "note":"0.00"},...],"total_num":"40","serv_num":"10","sw_num":"20","fw_num":"5","other_num":"5","code":200}
	 * @throws Exception
	 */
	String ListServ(String filter, String page_count,String page_num) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {	
			if(filter.equals(""))filter="id>0";	
			else if(filter.indexOf("=")==-1)filter=filter.replace("*", "%");
			filter=filter+" order by type,protect_time desc,model";	
			String filter1=filter;
			if(!page_count.equals("")&&!page_num.equals("")) {
				int pg_count=Integer.parseInt(page_count);
				int pg_num=Integer.parseInt(page_num);
				int past_itemnum=pg_count*(pg_num-1);
				filter=filter+" limit "+past_itemnum+","+pg_count;
			}		
			JSONObject serv=new JSONObject();
			JSONArray servlist= new JSONArray();
			String colname="asset_id,type,model,series_num,capacity,status,note,protect_time,price";
			String[][] serv_list=dbd.readDB("sys_device", colname, filter);
			int num=dbd.checknum("sys_device", "id", filter1);
			if(!serv_list[0][0].equals("")){
				String[] col=colname.split(",");
				for(int i=0;i<serv_list.length;i++) {
					JSONObject fee=new JSONObject();	
					serv_list[i][7]=sdf_ymd.format(sdf_full.parse(serv_list[i][7]));
					for(int j=0;j<col.length;j++)fee.put(col[j], serv_list[i][j]);
					servlist.put(i, fee);
				}
			}	
			serv.put("total_num", num);
			
			String ft="status<>'使用中'";
			int sum=dbd.checknum("sys_device", "id", ft);
			int num1=dbd.checknum("sys_device", "id", ft+" and type='服务器'");
			serv.put("serv_num", num1);
			int num2=dbd.checknum("sys_device", "id", ft+" and type='交换机'");
			serv.put("sw_num", num2);
			int num3=dbd.checknum("sys_device", "id", ft+" and type='防火墙'");
			serv.put("fw_num", num3);
			int num4=sum-num1-num2-num3;
			serv.put("other_num", num4);
			serv.put("Serv", servlist);
			serv.put("code",200);
			return serv.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**
	 * [function]	获取维修设备列表
	 * @param filter		过滤条件
	 * @param page_count	每页要显示的条目数
	 * @param page_num	指定要显示的页码
	 * @return		JSON格式字符串，如{"Serv":[{"asset_id":"xxx","type":"xx","model":"1111","series_num":"xxx@111.com","fixtime":"xxx","ma":"xxx",
	 * "note":"0.00"},...],"total_num":"40","code":200}
	 * @throws Exception
	 */
	String ListServ_fix(String filter, String page_count,String page_num) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {	
			if(filter.equals(""))filter="id>0";	
			else if(filter.indexOf("=")==-1)filter=filter.replace("*", "%");
			filter=filter+" order by fixtime";	
			String filter1=filter;
			if(!page_count.equals("")&&!page_num.equals("")) {
				int pg_count=Integer.parseInt(page_count);
				int pg_num=Integer.parseInt(page_num);
				int past_itemnum=pg_count*(pg_num-1);
				filter=filter+" limit "+past_itemnum+","+pg_count;
			}		
			JSONObject serv=new JSONObject();
			JSONArray servlist= new JSONArray();
			String colname="asset_id,type,model,series_num,fixtime,ma,note";
			String[][] serv_list=dbd.readDB("sys_device_fix", colname, filter);
			int num=dbd.checknum("sys_device_fix", "id", filter1);
			if(!serv_list[0][0].equals("")){
				String[] col=colname.split(",");
				for(int i=0;i<serv_list.length;i++) {
					JSONObject fee=new JSONObject();	
					serv_list[i][4]=sdf_ymd.format(sdf_full.parse(serv_list[i][4]));
					for(int j=0;j<col.length;j++)fee.put(col[j], serv_list[i][j]);
					servlist.put(i, fee);
				}
			}	
			serv.put("total_num", num);
			serv.put("Serv", servlist);
			serv.put("code",200);
			return serv.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**
	 * [function]	获取上架设备列表
	 * @param filter		过滤条件
	 * @param page_count	每页要显示的条目数
	 * @param page_num	指定要显示的页码
	 * @return		JSON格式字符串，如{"Serv":[{"asset_id":"xxx","type":"xx","model":"1111","series_num":"xxx@111.com","fixtime":"xxx","ma":"xxx",
	 * "note":"0.00"},...],"total_num":"40","code":200}
	 * @throws Exception
	 */
	String ListServ_ol(String filter, String page_count,String page_num) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {	
			if(filter.equals(""))filter="id>0";	
			else if(filter.indexOf("=")==-1)filter=filter.replace("*", "%");
			filter=filter+" order by idc,cabinet,layer";	
			String filter1=filter;
			if(!page_count.equals("")&&!page_num.equals("")) {
				int pg_count=Integer.parseInt(page_count);
				int pg_num=Integer.parseInt(page_num);
				int past_itemnum=pg_count*(pg_num-1);
				filter=filter+" limit "+past_itemnum+","+pg_count;
			}		
			JSONObject serv=new JSONObject();
			JSONArray servlist= new JSONArray();
			String colname="asset_id,type,model,capacity,status,idc,cabinet,layer,os,ip1,user,note";
			String[][] serv_list=dbd.readDB("sys_device_ol", colname, filter);
			int num=dbd.checknum("sys_device_ol", "id", filter1);
			if(!serv_list[0][0].equals("")){
				String[] col=colname.split(",");
				for(int i=0;i<serv_list.length;i++) {
					JSONObject fee=new JSONObject();	
					for(int j=0;j<col.length;j++)fee.put(col[j], serv_list[i][j]);
					servlist.put(i, fee);
				}
			}	
			serv.put("total_num", num);
			num=dbd.check("sys_device_ol");
			int num1=dbd.check("sys_device_ol", "type","服务器");
			serv.put("serv_num", num1);
			int num2=dbd.check("sys_device_ol", "type", "交换机");
			serv.put("sw_num", num2);
			int num3=dbd.check("sys_device_ol", "type", "防火墙");
			serv.put("fw_num", num3);
			int num4=num-num1-num2-num3;
			serv.put("other_num", num4);
			serv.put("Serv", servlist);
			serv.put("code",200);
			return serv.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**
	 * [function]	获取上架服务器列表，用于为云集群添加主机
	 * @param idc	机房
	 * @return		JSON格式字符串，如{"Serv":[{"asset_id":"xxx","ip1":"xx"},...],"total_num":"40","code":200}
	 * @throws Exception
	 */
	String ListServ_VM(String idc) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {		
			JSONObject serv=new JSONObject();
			JSONArray servlist= new JSONArray();
			String colname="asset_id,ip1";
			String[][] serv_list=dbd.readDB("sys_device_ol", colname, "idc='"+idc+"' and type='服务器' and status='正常'");
			if(!serv_list[0][0].equals("")){
				String[] col=colname.split(",");
				for(int i=0;i<serv_list.length;i++) {
					JSONObject fee=new JSONObject();	
					for(int j=0;j<col.length;j++)fee.put(col[j], serv_list[i][j]);
					servlist.put(i, fee);
				}
			}	
			serv.put("Serv", servlist);
			serv.put("code",200);
			return serv.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**
	 * 函数说明：添加一个零配件
	 * @param asset_id	资产编号
	 * @param body		零配件信息
	 * @throws Exception 409，该资产已存在
	 */
	void AddPart(String asset_id, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			int row=dbd.check("sys_parts", "asset_id", asset_id);
			if(row>0)throw new Exception("[info]409,零配件("+asset_id+")已经存在！");
//			添加记录
			String[] cols= {"asset_id","status","serv","type","model","series_num","capacity","protect_time","price","note"};
			String[] record=new String[cols.length];
			record[0]=asset_id;
			record[1]="闲置";
			record[2]="";
			JSONObject dat=new JSONObject(body);
			for(int i=3;i<cols.length;i++)record[i]=dat.getString(cols[i]);
			dbd.AppendSQl("sys_parts", cols, record, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：修改零配件信息
	 * @param asset_id	资产编号
	 * @param user			 操作人
	 * @param body		新的零配件信息
	 * @throws Exception 404，该零配件不存在或关联设备不存在
	 */
	void UpdatePart(String asset_id, String user, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String[][] parts=dbd.readDB("sys_parts", "id,serv", "asset_id='"+asset_id+"'");
			if(parts[0][0].equals(""))throw new Exception("[info]404, 零配件("+asset_id+")不存在！");
			JSONObject dat=new JSONObject(body);
			String serv=dat.getString("serv");
			if(!parts[0][1].equals(serv) && !serv.equals("")){
				int rr=dbd.check("sys_device", "asset_id", serv);
				if(rr==0)throw new Exception("[info]404, 关联设备("+serv+")不存在！");
			}
			int row=Integer.parseInt(parts[0][0]);
			String[] cols= {"type","model","series_num","capacity","status","protect_time","price","serv","note"};
			for(int i=0;i<cols.length;i++) {
				dbd.UpdateSQl("sys_parts", row, cols[i], dat.getString(cols[i]));
			}
			if(!parts[0][1].equals(serv)){
//				追加操作日志
				String[] col_log= {"type","logdate","operator","obj","log"};
				String logtext=dat.getString("type")+asset_id+"关联到新设备"+serv;
				String[] rec_log= {"零配件",sdf_full.format(new Date()),user, asset_id, logtext};
				dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
			}
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：删除一个零配件
	 * @param asset_id	资产编号
	 * @throws Exception
	 */
	void DelPart(String asset_id) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			int row=dbd.check("sys_parts", "asset_id", asset_id);
			if(row>0)dbd.DelSQl("sys_parts", row, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * [function]	获取零配件列表
	 * @param filter		过滤条件
	 * @param page_count	每页要显示的条目数
	 * @param page_num	指定要显示的页码
	 * @return		JSON格式字符串，如{"IDC":[{"idc":"xxx","contact":"xx","mobile":"1111","email":"xxx@111.com","address":"xxx",
	 * "note":"0.00"},...],"total_num":"40","code":200}
	 * @throws Exception
	 */
	String ListPart(String filter, String page_count,String page_num) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {	
			if(filter.equals(""))filter="id>0";	
			else if(filter.indexOf("=")==-1)filter=filter.replace("*", "%");
			filter=filter+" order by type,model,asset_id";	
			String filter1=filter;
			if(!page_count.equals("")&&!page_num.equals("")) {
				int pg_count=Integer.parseInt(page_count);
				int pg_num=Integer.parseInt(page_num);
				int past_itemnum=pg_count*(pg_num-1);
				filter=filter+" limit "+past_itemnum+","+pg_count;
			}
			
			JSONObject part=new JSONObject();
			JSONArray partlist= new JSONArray();
			String colname="asset_id,type,model,series_num,capacity,status,serv,protect_time,price,note";
			String[][] part_list=dbd.readDB("sys_parts", colname, filter);
			int num=dbd.checknum("sys_parts", "id", filter1);
			if(!part_list[0][0].equals("")){
				String[] col=colname.split(",");
				for(int i=0;i<part_list.length;i++) {
					JSONObject fee=new JSONObject();	
					part_list[i][7]=sdf_ymd.format(sdf_full.parse(part_list[i][7]));
					for(int j=0;j<col.length;j++)fee.put(col[j], part_list[i][j]);
					partlist.put(i, fee);
				}
			}					
			part.put("total_num", num);
			part.put("parts", partlist);
			part.put("code",200);
			return part.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**
	 * 函数说明：添加一个服务
	 * @param manufacturer	服务提供厂商
	 * @param service				服务
	 * @param user					操作人
	 * @param body				服务信息
	 * @throws Exception 409，该服务已存在
	 */
	void AddService(String manufacturer,String service, String user, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String[] Colname= {"service","manufacturer"};
			String[] key= {service,manufacturer};
			int row=dbd.check("sys_services", Colname, key);
			if(row>0)throw new Exception("[info]409, "+manufacturer+"的服务"+service+"已经存在！");
//			添加记录
			String[] cols= {"service_id","service","manufacturer","price","buy_time","protect_time","status","user","purpose","note"};
			String[] record=new String[cols.length];
			record[0]="fw_"+System.currentTimeMillis();
			record[1]=service;
			record[2]=manufacturer;
			JSONObject dat=new JSONObject(body);
			for(int i=3;i<cols.length;i++)record[i]=dat.getString(cols[i]);
			dbd.AppendSQl("sys_services", cols, record, 1, 1);
			
//			追加操作日志
			String[] col_log= {"type","logdate","operator","obj","log"};
			String logtext="添加新服务："+manufacturer+service+"";
			if(!record[7].equals(""))logtext=logtext+"，分配给"+record[7]+"使用";
			String[] rec_log= {"服务",sdf_full.format(new Date()),user, record[0], logtext};
			dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：修改服务信息
	 * @param user			操作用户
	 * @param service_id	服务编号
	 * @param body		新的服务信息
	 * @throws Exception 404，该服务不存在
	 */
	void UpdateService(String user, String service_id, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			int row=dbd.check("sys_services", "service_id", service_id);
			if(row==0)throw new Exception("[info]404, 服务("+service_id+")不存在！");
			JSONObject dat=new JSONObject(body);
			
			String Colname="service,manufacturer,price,buy_time,protect_time,status,user,purpose,note";
			String[][] Service_info=dbd.readDB("sys_services", Colname, "id="+row);
			String[] cols= Colname.split(",");
			
			String[] col_log= {"type","logdate","operator","obj","log"};
			String context="服务(编号："+service_id+")信息变更，";
			String[] col_text= {"服务","厂商","价格","购买时间","过保时间","状态","使用人","用途","说明"};
			
			for(int i=0;i<cols.length;i++) {
				String va=dat.getString(cols[i]);				
				dbd.UpdateSQl("sys_services", row, cols[i], va);
				if(i==3 || i==4)Service_info[0][i]=sdf_ymd.format(sdf_full.parse(Service_info[0][i]));
				if(!Service_info[0][i].equals(va)) {
					context=context+col_text[i]+"从'"+Service_info[0][i]+"'变更为'"+va+"',";
				}
			}

			context=context.substring(0, context.length()-1);
			String[] rec_log= {"服务",sdf_full.format(new Date()),user,service_id,context};
			dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1); 
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：删除一个服务
	 * @param service_id	服务编号
	 * @param user			操作人
	 * @throws Exception
	 */
	void DelService(String service_id, String user) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			int row=dbd.check("sys_services", "service_id", service_id);
			if(row>0)dbd.DelSQl("sys_services", row, 1, 1);
//			追加操作日志
			String[] col_log= {"type","logdate","operator","obj","log"};
			String logtext="删除服务："+service_id;
			String[] rec_log= {"服务",sdf_full.format(new Date()),user, service_id, logtext};
			dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * [function]	获取服务列表
	 * @param filter		过滤条件
	 * @param page_count	每页要显示的条目数
	 * @param page_num	指定要显示的页码
	 * @return		JSON格式字符串，如{"service":[{"service_id":"xxx","service":"xx","manufacturer":"1111","email":"xxx@111.com","address":"xxx",
	 * "note":"0.00"},...],"total_num":"40","code":200}
	 * @throws Exception
	 */
	String ListService(String filter, String page_count,String page_num) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {	
			if(filter.equals(""))filter="id>0";	
			else if(filter.indexOf("=")==-1)filter=filter.replace("*", "%");
			filter=filter+" order by protect_time,buy_time";	
			String filter1=filter;
			if(!page_count.equals("")&&!page_num.equals("")) {
				int pg_count=Integer.parseInt(page_count);
				int pg_num=Integer.parseInt(page_num);
				int past_itemnum=pg_count*(pg_num-1);
				filter=filter+" limit "+past_itemnum+","+pg_count;
			}
			
			JSONObject service=new JSONObject();
			JSONArray servicelist= new JSONArray();
			String colname="service_id,service,manufacturer,price,buy_time,protect_time,status,user,purpose,note";
			String[][] service_list=dbd.readDB("sys_services", colname, filter);
			int num=dbd.checknum("sys_services", "id", filter1);
			if(!service_list[0][0].equals("")){
				String[] col=colname.split(",");
				for(int i=0;i<service_list.length;i++) {
					JSONObject fee=new JSONObject();	
					service_list[i][4]=sdf_ymd.format(sdf_full.parse(service_list[i][4]));
					service_list[i][5]=sdf_ymd.format(sdf_full.parse(service_list[i][5]));
					for(int j=0;j<col.length;j++)fee.put(col[j], service_list[i][j]);
					servicelist.put(i, fee);
				}
			}					
			service.put("total_num", num);
			service.put("service", servicelist);
			service.put("code",200);
			return service.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**
	 * 函数说明：添加一个IP地址
	 * @param idc		机房
	 * @param ip			IP地址
	 * @param type		IP类型，分公网还是私有
	 * @param body	IP信息
	 * @throws Exception 409，该IP已存在
	 */
	void AddIP(String idc, String ip, String type, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String DBname="sys_ip_"+type;
			String[] Colname= {"idc","ip"};
			String[] key= {idc,ip};
			int row=dbd.check(DBname, Colname, key);
			if(row>0)throw new Exception("[info]409, "+idc+"中的IP地址"+ip+"已经存在！");
//			添加记录
			JSONObject dat=new JSONObject(body);
			if(type.equals("public")) {
				String[] cols= {"ip","idc","status","asset_id","user","note","operator","network","gateway","leaseterm"};
				String[] record=new String[cols.length];
				record[0]=ip;
				record[1]=idc;
				record[2]="可用";
				record[3]="";
				record[4]="";
				record[5]="";				
				for(int i=6;i<cols.length;i++)record[i]=dat.getString(cols[i]);
				dbd.AppendSQl(DBname, cols, record, 1, 1);
			}
			else {
				String[] cols= {"ip","idc","status","asset_id","user","note","NatIP","network","gateway",};
				String[] record= {ip, idc, "可用","","","","",dat.getString("network"),dat.getString("gateway")};
				dbd.AppendSQl(DBname, cols, record, 1, 1);
			}			
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：修改IP信息
	 * @param idc		机房
	 * @param ip			IP地址
	 * @param type		IP类型，分公网还是私有
	 * @param body	IP信息
	 * @throws Exception 404，该零配件不存在
	 */
	void UpdateIP(String idc, String ip, String type, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String DBname="sys_ip_"+type;
			String[] Colname= {"idc","ip"};
			String[] key= {idc,ip};
			int row=dbd.check(DBname, Colname, key);
			if(row==0)throw new Exception("[info]409, "+idc+"中的IP地址"+ip+"不存在！");
			JSONObject dat=new JSONObject(body);
			if(type.equals("public")) {
				dbd.UpdateSQl(DBname, row, "leaseterm", dat.getString("leaseterm"));
				dbd.UpdateSQl(DBname, row, "note", dat.getString("note"));
			}
			else {		
				String status=dat.getString("status");
				String NatIP= dat.getString("NatIP");
				String note=dat.getString("note");
				String user=dat.getString("user");
				if(status.equals("可用")) {
					NatIP="";
					note="";
					user="";
				}
				dbd.UpdateSQl(DBname, row, "status", status);
				dbd.UpdateSQl(DBname, row, "NatIP",NatIP);
				dbd.UpdateSQl(DBname, row, "note", note);
				dbd.UpdateSQl(DBname, row, "user", user);				
			}
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：删除一个IP
	 * @param idc		机房
	 * @param ip			IP地址
	 * @param type		IP类型，分公网还是私有
	 * @throws Exception
	 */
	void DelIP(String idc, String ip, String type) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String DBname="sys_ip_"+type;
			String[][] ips=dbd.readDB(DBname, "id,status", "idc='"+idc+"' and ip='"+ip+"'");
			if(!ips[0][0].equals("")) {
				if(ips[0][1].equals("使用中"))throw new Exception("[info]409, "+idc+"中的IP地址"+ip+"正在使用，不能被删除！");
				dbd.DelSQl_q(DBname, "id="+ips[0][0]);
			}
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * [function]	获取IP地址列表
	 * @param filter		过滤条件
	 * @param type		IP类型，分公网还是私有
	 * @param page_count	每页要显示的条目数
	 * @param page_num	指定要显示的页码
	 * @return		JSON格式字符串，如{"IPs":[{"idc":"xxx","ip":"xx","status":"1111","asset_id":"xxx@111.com","user":"xxx","note":"0.00",...},...],"total_num":"40","code":200}
	 * @throws Exception
	 */
	String ListIP(String filter, String type, String page_count,String page_num) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {	
			String DBname="sys_ip_"+type;
			if(filter.equals(""))filter="id>0";	
			else if(filter.indexOf("=")==-1)filter=filter.replace("*", "%");			
			filter=filter+" order by status desc,idc,network,inet_aton(ip)";	
			String filter1=filter;
			if(!page_count.equals("")&&!page_num.equals("")) {
				int pg_count=Integer.parseInt(page_count);
				int pg_num=Integer.parseInt(page_num);
				int past_itemnum=pg_count*(pg_num-1);
				filter=filter+" limit "+past_itemnum+","+pg_count;
			}
			
			JSONObject ip=new JSONObject();
			JSONArray iplist= new JSONArray();
			String colname="ip,idc,status,asset_id,user,note,operator,network,gateway,leaseterm";
			if(type.equals("private")) colname="ip,idc,status,asset_id,user,note,NatIP,network,gateway";
			String[][] ip_list=dbd.readDB(DBname, colname, filter);
			int num=dbd.checknum(DBname, "id", filter1);
			if(!ip_list[0][0].equals("")){
				String[] col=colname.split(",");
				for(int i=0;i<ip_list.length;i++) {
					JSONObject fee=new JSONObject();	
					if(type.equals("public")) ip_list[i][9]=sdf_ymd.format(sdf_full.parse(ip_list[i][9]));
					for(int j=0;j<col.length;j++)fee.put(col[j], ip_list[i][j]);
					iplist.put(i, fee);
				}
			}					
			ip.put("total_num", num);
			ip.put("IPs", iplist);
			ip.put("code",200);
			return ip.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**
	 * 函数说明：添加一个网络地址
	 * @param idc		机房
	 * @param net		网络与子网掩码
	 * @param body	网络信息
	 * @throws Exception 409，该网络已存在
	 */
	void AddNet(String idc, String net, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String[] Colname= {"idc","network"};
			String[] key= {idc,""};
			String DBname="sys_ip_private";
			
//			添加记录
			JSONObject dat=new JSONObject(body);
			String gateway=dat.getString("gateway");
			String[] cols= {"ip","idc","status","asset_id","user","note","NatIP","network","gateway"};
			String[] record= {"", idc, "可用","","","","","",gateway};
			String[] net_mask=net.split("/");
			int mask_len=Integer.parseInt(net_mask[1]);
			String[] nets=net_mask[0].split("\\.");
			if(mask_len<22)throw new Exception("[info]410, 不支持创建子网掩码小于22的网络！");
			if(mask_len<24) {
				mask_len=mask_len-16;
				int mask=256-(int)Math.pow(2,(8-mask_len));
				int net_3rd=Integer.parseInt(nets[2])&mask;
				record[7]=nets[0]+"."+nets[1]+"."+net_3rd+".0/"+net_mask[1];
				key[1]=record[7];
				int row=dbd.check(DBname, Colname, key);
				if(row>0)throw new Exception("[info]409, "+idc+"中的网络"+key[1]+"已经存在！");
				int net_3rd_end=net_3rd+(int)Math.pow(2,(8-mask_len))-1;
				String ip_1=nets[0]+"."+nets[1]+"."+net_3rd+".1";
//				判断网络是否重叠
				String[] col_ip= {"idc","ip"};
				String[] rec_ip= {idc,ip_1};
				int row2=dbd.check(DBname, col_ip, rec_ip);
				if(row2>0)throw new Exception("[info]409, "+idc+"中的网络"+key[1]+"已经存在或与已存在网络范围重叠！");
				
				for(int i=net_3rd;i<net_3rd_end;i++) {
					if(i>net_3rd) {
						record[0]=nets[0]+"."+nets[1]+"."+i+".0";
						dbd.AppendSQl(DBname, cols, record, 1, 1);
					}				
					for(int j=1;j<255;j++) {
						record[0]=nets[0]+"."+nets[1]+"."+i+"."+j;
						dbd.AppendSQl(DBname, cols, record, 1, 1);
					}					
				}		
			}	
			else {
				mask_len=mask_len-24;
				int mask=256-(int)Math.pow(2,(8-mask_len));
				int net_3rd=Integer.parseInt(nets[3])&mask;
				record[7]=nets[0]+"."+nets[1]+"."+nets[2]+"."+net_3rd+"/"+net_mask[1];
				key[1]=record[7];
				int row=dbd.check(DBname, Colname, key);
				if(row>0)throw new Exception("[info]409, "+idc+"中的网络"+key[1]+"已经存在！");
				int net_3rd_end=net_3rd+(int)Math.pow(2,(8-mask_len))-2;
//				判断网络是否重叠
				String ip_1=nets[0]+"."+nets[1]+"."+nets[2]+"."+(net_3rd_end+1);
				String[] col_ip= {"idc","ip"};
				String[] rec_ip= {idc,ip_1};
				int row2=dbd.check(DBname, col_ip, rec_ip);
				if(row2>0)throw new Exception("[info]409, "+idc+"中的网络"+key[1]+"已经存在或与已存在网络范围重叠！");
				
				for(int i=net_3rd;i<net_3rd_end;i++) {
					record[0]=nets[0]+"."+nets[1]+"."+nets[2]+"."+(i+1);
					dbd.AppendSQl(DBname, cols, record, 1, 1);
				}		
			}
//			追加网络
			int row=dbd.check("sys_nets", Colname, key);
			if(row==0) {
				String[] net_col= {"idc","network","gateway"};
				String[] net_rec= {idc,record[7],gateway};
				dbd.AppendSQl("sys_nets", net_col, net_rec, 1, 1);
			}
			
//			变更网关地址状态
			String[] ip_col= {"idc","ip"};
			String[] ip_rec= {idc,gateway};
			row=dbd.check(DBname, ip_col, ip_rec);
			if(row>0) {
				dbd.UpdateSQl(DBname, row, "status", "使用中");
				dbd.UpdateSQl(DBname, row, "note", "[sysinfo]用于网关地址");
			}
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：删除一个网段
	 * @param idc		机房
	 * @param net		网络
	 * @throws Exception 409, 网络正在使用
	 */
	void DelNet(String idc, String net) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String DBname="sys_ip_private";			
			String filt="idc='"+idc+"' and network='"+net+"'";
			String[][] ips=dbd.readDB(DBname, "id", filt+" and status='使用中' and note<>'[sysinfo]用于网关地址'");
			if(!ips[0][0].equals(""))throw new Exception("[info]409, "+idc+"中的网段"+net+"正在使用，不能被删除！");
			dbd.DelSQl_q(DBname,filt);
			String[] Colname= {"idc","network"};
			String[] key= {idc,net};
			int row=dbd.check("sys_nets", Colname, key);
			if(row>0)dbd.DelSQl("sys_nets", row, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * [function]	获取指定机房的网络列表，机房为空表示获取全部列表
	 * @param idc		机房
	 * @return		JSON格式字符串，如{"nets":[{"idc":"xx","network":"xxx","gateway":"xx"},...],"code":200}
	 * @throws Exception
	 */
	String ListNet(String idc) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {
			String filter="id>0";
			if(!idc.equals(""))filter="idc='"+idc+"'";
			filter=filter+" order by network";
			JSONObject net=new JSONObject();
			JSONArray netlist= new JSONArray();
			String colname="idc,network,gateway";
			String[][] net_list=dbd.readDB("sys_nets", colname, filter);
			if(!net_list[0][0].equals("")){
				String[] col=colname.split(",");
				for(int i=0;i<net_list.length;i++) {
					JSONObject fee=new JSONObject();	
					for(int j=0;j<col.length;j++)fee.put(col[j], net_list[i][j]);
					netlist.put(i, fee);
				}
			}					
			net.put("nets", netlist);
			net.put("code",200);
			return net.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**
	 * 函数说明：添加一个新服务商（供应商和维修服务商）
	 * @param type			新服务商类型
	 * @param supplier	服务商名
	 * @param body		服务商信息
	 * @throws Exception 409，该服务商已存在
	 */
	void AddSupplier(String type, String supplier, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String[] Colname= {"type","supplier"};
			String[] key= {type,supplier};
			int row=dbd.check("sys_supplier", Colname, key);
			if(row>0)throw new Exception("[info]409,"+type+supplier+"已经存在！");
//			添加记录
			String[] cols= {"supplier","type","contact","mobile","email","address","note"};
			String[] record= {supplier, type, "", "", "", "", ""};
			JSONObject dat=new JSONObject(body);
			for(int i=2;i<cols.length;i++)record[i]=dat.getString(cols[i]);
			dbd.AppendSQl("sys_supplier", cols, record, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：修改服务商信息
	 * @param type			新服务商类型
	 * @param supplier	服务商原名
	 * @param body		服务商信息
	 * @throws Exception 404，该服务商不存在
	 */
	void UpdateSupplier(String type, String supplier, String body) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
//			判断服务商是否存在
			String[] Colname= {"type","supplier"};
			String[] key= {type,supplier};			
			int row=dbd.check("sys_supplier", Colname, key);
			if(row==0)throw new Exception("[info]404, "+type+"'"+supplier+"'不存在！");
//			如果新旧名称不同，则判断服务商新名称是否有效
			JSONObject dat=new JSONObject(body);
			key[1]=dat.getString("supplier");
			if(!key[1].equals(supplier)) {
				int row_1=dbd.check("sys_supplier", Colname, key);
				if(row_1>0)throw new Exception("[info]409, "+type+"名称'"+key[1]+"'已被使用！");
			}		
			String[] cols= {"supplier","contact","mobile","email","address","note"};
			for(int i=0;i<cols.length;i++) {
				dbd.UpdateSQl("sys_supplier", row, cols[i], dat.getString(cols[i]));
			}
//			如果名称变更，则需替换维修记录中的服务商名称
			if(!key[1].equals(supplier) && type.equals("维修服务商")) {
				String[][] rows=dbd.readDB("sys_device_fix", "id", "ma='"+supplier+"'");
				if(!rows[0][0].equals("")) {
					for(int i=0;i<rows.length;i++) {
						row=Integer.parseInt(rows[i][0]);
						dbd.UpdateSQl("sys_device_fix", row, "ma", key[1]);
					}
				}
			}
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * 函数说明：删除一个机房
	 * @param type			新服务商类型
	 * @param supplier	服务商名
	 * @throws Exception
	 */
	void DelSupplier(String type, String supplier) throws Exception{	
		PropertyConfigurator.configure(logconf);
		try {
			String[] Colname= {"type","supplier"};
			String[] key= {type,supplier};			
			int row=dbd.check("sys_supplier", Colname, key);
			if(row>0)dbd.DelSQl("sys_supplier", row, 1, 1);
		}catch(Throwable e) {
			logger.error(e.getMessage(),e);
			throw new Exception(e);
		}
	}
	/**
	 * [function]	获取机房列表
	 * @param filter		过滤条件
	 * @param type		新服务商类型
	 * @param page_count	每页要显示的条目数
	 * @param page_num	指定要显示的页码
	 * @return		JSON格式字符串，如{"IDC":[{"idc":"xxx","contact":"xx","mobile":"1111","email":"xxx@111.com","address":"xxx",
	 * "note":"0.00"},...],"total_num":"40","code":200}
	 * @throws Exception
	 */
	String ListSupplier(String type, String filter, String page_count,String page_num) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {	
			if(filter.equals("")) {
				if(type.equals(""))filter="id>0";	
				else filter="type='"+type+"'";
			}
			else {
				if(filter.indexOf("=")==-1)filter=filter.replace("*", "%");
				filter=filter+" and type='"+type+"'";
			}
			filter=filter+" order by supplier";	
			String filter1=filter;
			if(!page_count.equals("")&&!page_num.equals("")) {
				int pg_count=Integer.parseInt(page_count);
				int pg_num=Integer.parseInt(page_num);
				int past_itemnum=pg_count*(pg_num-1);
				filter=filter+" limit "+past_itemnum+","+pg_count;
			}
			
			JSONObject sp=new JSONObject();
			JSONArray splist= new JSONArray();
			String colname="supplier,type,contact,mobile,email,address,note";
			String[][] sp_list=dbd.readDB("sys_supplier", colname, filter);
			int num=dbd.checknum("sys_supplier", "id", filter1);
			if(!sp_list[0][0].equals("")){
				String[] col=colname.split(",");
				for(int i=0;i<sp_list.length;i++) {
					JSONObject fee=new JSONObject();	
					for(int j=0;j<col.length;j++)fee.put(col[j], sp_list[i][j]);
					splist.put(i, fee);
				}
			}					
			sp.put("total_num", num);
			sp.put("supplier", splist);
			sp.put("code",200);
			return sp.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**
	 * [function]	获取机房操作日志列表
	 * @param filter		过滤条件
	 * @param type		日志类型，物理设备、虚拟机、软件服务或零配件
	 * @return		JSON格式字符串，如{"logs":[{"logdate":"xxx","operator":"xx","log":"1111"},...],"code":200}
	 * @throws Exception
	 */
	String ListLogs(String filter, String type) throws Exception {
		PropertyConfigurator.configure(logconf);		
		try {	
			if(filter.equals(""))filter="type='"+type+"'";	
			else if(filter.indexOf("=")==-1) {
				filter=filter.replace("*", "%");
				filter=filter+" and type='"+type+"'";	
			}		
			filter=filter+" order by logdate desc";	
			
			JSONObject log=new JSONObject();
			JSONArray logs= new JSONArray();
			String colname="logdate,operator,obj,log";
			String[][] log_list=dbd.readDB("sys_logs", colname, filter);

			if(!log_list[0][0].equals("")){
				String[] col=colname.split(",");
				for(int i=0;i<log_list.length;i++) {
					JSONObject fee=new JSONObject();	
					log_list[i][0]=sdf_full.format(sdf_full.parse(log_list[i][0]));
					for(int j=0;j<col.length;j++)fee.put(col[j], log_list[i][j]);
					logs.put(i, fee);
				}
			}					
			log.put("logs", logs);
			log.put("code",200);
			return log.toString();
		}catch(Throwable e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e.getMessage());
		}		
	}
	/**
	 * 函数说明：为企业云添加物理服务器
	 * @param body		服务器信息
	 * @param user			操作用户
	 * @throws Exception 404，IP所在网络不存在
	 * @throws Exception 409，服务器已经在云集群中
	 */
	void AddVMServ(String body, String user)throws Exception{
		PropertyConfigurator.configure(logconf);		
		try {	
			JSONObject dat=new JSONObject(body);
			String[] colname= {"idc","asset_id","ipaddr","cpu","mem","disk","locate","vm_num","cpu_used","cpu_rate_usage","mem_used","mem_rate_usage","disk_used",
					"disk_rate_usage","cpu_usable","disk_usable","mem_usable"};
			String[] record=new String[colname.length];			
			for(int i=0;i<6;i++)record[i]=dat.getString(colname[i]);
//			判断是否已存在
			String[] Colname= {"idc","asset_id"};
			String[] key= {record[0],record[1]};
			int row=dbd.check("sys_vmm_phy_server", Colname, key);
			if(row>0)throw new Exception("[info]409, "+record[0]+"的服务器("+record[1]+")已经在云集群中了！");			
//			添加服务器
			String[][] serv=dbd.readDB("sys_device_ol", "cabinet,layer", "asset_id='"+record[1]+"'");
			record[6]=serv[0][0]+"号机柜，第"+serv[0][1]+"层";			
			for(int i=7;i<14;i++)record[i]="0";
			for(int i=14;i<17;i++)record[i]="100";
			dbd.AppendSQl("sys_vmm_phy_server", colname, record, 1, 1);
//			从新计算主机的资源
			server_res_math(record[1]);
//			追加操作日志
			String[] col_log= {"type","logdate","operator","obj","log"};
			String[] rec_log= {"虚拟机",sdf_full.format(new Date()),user, record[1], record[0]+"服务器("+record[1]+")加入云集群。"};
			dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
		}catch (Throwable e) {
			String mess=e.getMessage();
			logger.error(mess,e);
			if(mess.indexOf("[info]")>-1)throw new Exception(e);
			else 	throw new Exception("500,"+mess);
		}	
	}
	/**
	 * 函数说明：获取云集群物理服务器列表，携带服务器资源使用状态
	 * @return		JSON格式字符串，例如：
	 * {"hosts":[{"idc":"xxxx","host":[{"asset_id":"xxx","disk_used":"30","disk_usable":"70","mem_used":"20",	"mem_usable":"30"},{},...]},{},...]}
	 * @throws Exception
	 */
	String ListVMServ() throws Exception{
		PropertyConfigurator.configure(logconf);		
		try {	
			JSONObject bku=new JSONObject();
			JSONArray hosts=new JSONArray();
//			获取机房列表
			String[][] idcs=dbd.readDB("sys_idc", "idc", "id>0");
			if(!idcs[0][0].equals("")) {
				for(int i=0;i<idcs.length;i++) {
					JSONObject item=new JSONObject();
					JSONArray items=new JSONArray();
					item.put("idc", idcs[i][0]);
					String[][] servs=dbd.readDB("sys_vmm_phy_server", "asset_id,ipaddr,disk_used,disk_usable,mem_used,mem_usable", "idc='"+idcs[i][0]+"' order by ipaddr");
					if(!servs[0][0].equals("")) {
						for(int j=0;j<servs.length;j++) {
							JSONObject host=new JSONObject();
							host.put("asset_id", servs[j][0]);
							host.put("ipaddr", servs[j][1]);
							host.put("disk_used", servs[j][2]);
							host.put("disk_usable", servs[j][3]);
							host.put("mem_used", servs[j][4]);
							host.put("mem_usable", servs[j][5]);
							items.put(j, host);
						}
					}
					item.put("host", items);
					hosts.put(i, item);
				}
			}
			bku.put("hosts", hosts);
			bku.put("code", 200);
			return bku.toString();
		}catch (Throwable e) {
			String mess=e.getMessage();
			logger.error(mess,e);
			if(mess.indexOf("[info]")>-1)throw new Exception(e);
			else 	throw new Exception("500,"+mess);
		}	
	}
	/**
	 * 函数说明：获取云集群中的物理服务器详细信息及其下属虚机列表
	 * @param asset_id		要获取的服务器资产编号
	 * @return		JSON格式字符串，例如：{"vmlist":[{"id":"1","name":"xx","os":"xx","cpu":"4","mem":"20",...},...],"asset_id":"xxx",..}
	 * @throws Exception404, 服务器不在集群中
	 */
	String GetVMServer(String asset_id)throws Exception{
		PropertyConfigurator.configure(logconf);		
		try {
//			获取服务器信息
			String Colname="asset_id,ipaddr,locate,vm_num,cpu,mem,disk,cpu_used,cpu_rate_usage,mem_used,mem_rate_usage,disk_used,"
					+ "disk_rate_usage,cpu_usable,disk_usable,mem_usable";
			String[][] serv=dbd.readDB("sys_vmm_phy_server", Colname, "asset_id='"+asset_id+"'");
			if(serv[0][0].equals(""))throw new Exception("[info]404,服务器("+asset_id+")不在云集群中，请确认。");
			
			String[] keys=Colname.split(",");
			JSONObject bku=new JSONObject();
			for(int i=0;i<keys.length;i++)bku.put(keys[i], serv[0][i]);
			
//			获取虚拟机列表
			Colname="id,name,os,cpu,mem,disk,ip,des,user,type";
			String[] keys_vm= Colname.split(",");
			JSONArray vmlist=new JSONArray();
			String[][] vms=dbd.readDB("sys_vm", Colname, "asset_id='"+asset_id+"'");
			if(!vms[0][0].equals("")) {
				for(int i=0;i<vms.length;i++) {
					JSONObject vm=new JSONObject();
					for(int j=0;j<keys_vm.length;j++)vm.put(keys_vm[j], vms[i][j]);
					vmlist.put(i, vm);
				}
			}
			bku.put("vmlist", vmlist);
			bku.put("code", 200);
			return bku.toString();
		}catch (Throwable e) {
			String mess=e.getMessage();
			logger.error(mess,e);
			if(mess.indexOf("[info]")>-1)throw new Exception(e);
			else 	throw new Exception("500,"+mess);
		}	
	}
	/**
	 * 函数说明：从云集群中移除物理服务器，为避免删除服务器导致的虚拟机丢失，暂不进行对应虚拟机的删除
	 * @param asset_id	要删除的服务器资产编号
	 */
	void DelVMServ(String asset_id, String user)throws Exception{
		PropertyConfigurator.configure(logconf);		
		try {	
//			判断是否存在
			int row=dbd.check("sys_vmm_phy_server", "asset_id", asset_id);
			if(row>0) 	dbd.DelSQl("sys_vmm_phy_server", row, 1, 1);
//			追加操作日志
			String[] col_log= {"type","logdate","operator","obj","log"};
			String[] rec_log= {"虚拟机",sdf_full.format(new Date()),user, asset_id,"服务器("+asset_id+")移出云集群。"};
			dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
		}catch (Throwable e) {
			String mess=e.getMessage();
			logger.error(mess,e);
			if(mess.indexOf("[info]")>-1)throw new Exception(e);
			else 	throw new Exception("500,"+mess);
		}	
	}
	/**
	 * 函数说明：更新服务器信息
	 * @param asset_id	要修改的服务器名称
	 * @param body		新的服务器信息数据
	 */
	void UpdateVMServ(String asset_id,String body, String user)throws Exception{
		PropertyConfigurator.configure(logconf);		
		try {	
			String[][] serv=dbd.readDB("sys_vmm_phy_server", "id,cpu,mem,disk", "asset_id='"+asset_id+"'");
			if(serv[0][0].equals(""))throw new Exception("[info]404,服务器("+asset_id+")不在云集群中，请确认。");
			JSONObject dat=new JSONObject(body);		
			String[] cols= {"cpu","mem","disk"};
			int row=Integer.parseInt(serv[0][0]);
			String loginfo="";
			for(int i=0;i<cols.length;i++) {
				String va=dat.getString(cols[i]);
				if(!serv[0][i+1].equals(va)) {
					dbd.UpdateSQl("sys_vmm_phy_server", row, cols[i], va);
					loginfo=loginfo+cols[i]+"从"+serv[0][i+1]+"变更为"+va+";";
				}			
			}
			if(!loginfo.equals("")) {
//				追加操作日志
				String[] col_log= {"type","logdate","operator","obj","log"};
				String[] rec_log= {"虚拟机",sdf_full.format(new Date()),user, asset_id,"服务器("+asset_id+")变更配置："+loginfo};
				dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
			}
//			从新计算服务器资源状态
			server_res_math(asset_id);
		}catch (Throwable e) {
			String mess=e.getMessage();
			logger.error(mess,e);
			if(mess.indexOf("[info]")>-1)throw new Exception(e);
			else 	throw new Exception("500,"+mess);
		}	
	}
	/**
	 * 函数说明：添加一台新虚拟机
	 * @param asset_id	虚拟机所在物理机资产编号
	 * @param user			操作用户
	 * @param vmdat		新的虚拟机数据
	 * @throws Exception 404，服务器不存在或者IP地址无效
	 * @throws Exception 409，虚拟机名重复或者IP地址已被使用
	 */
	void AddVM(String asset_id, String user, String vmdat)throws Exception{
		PropertyConfigurator.configure(logconf);		
		try {	
			JSONObject vm=new JSONObject(vmdat);
//			判断主机是否存在
			int row=dbd.check("sys_vmm_phy_server", "asset_id", asset_id);
			if(row==0)throw new Exception("[info]404,服务器("+asset_id+")不在集群中。");		
//			判断虚拟机是否重名
			row=dbd.check("sys_vm", "name", vm.getString("name"));
			if(row>0)throw new Exception("[info]409,已经存在名为"+vm.getString("name")+"的虚拟机。");		
			
//			判断IP是否有效
			String ip=vm.getString("ip");
			String[][] ip_state=dbd.readDB("sys_ip_private", "status,id", "ip='"+ip+"'");
			if(ip_state[0][0].equals(""))throw new Exception("[info]404,ip地址"+ip+"无效，请确认修改。");
			if(ip_state[0][0].equals("使用中"))throw new Exception("[info]409,ip "+ip+"已被使用，请查看IP池从新选择。");
			
//			创建虚拟机记录
			String[] colname= {"asset_id","type","name","os","cpu","mem","disk","ip","des","user"};
			String[] record=new String[colname.length];
			record[0]=asset_id;
			record[1]="";
			for(int i=2;i<colname.length;i++)record[i]=vm.getString(colname[i]);
			dbd.AppendSQl("sys_vm", colname, record, 1, 1);
			
//			变更IP状态
			row=Integer.parseInt(ip_state[0][1]);
			dbd.UpdateSQl("sys_ip_private", row, "status", "使用中");
			dbd.UpdateSQl("sys_ip_private", row, "asset_id", asset_id);
			dbd.UpdateSQl("sys_ip_private", row, "note","[sysinfo]用于虚拟机"+record[2]);
			
//			追加操作日志
			String[] col_log= {"type","logdate","operator","obj","log"};
			String[] rec_log= {"虚拟机",sdf_full.format(new Date()),user, record[2],"添加新虚拟机"+record[2]};
			dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
			
//			从新计算主机的资源
			server_res_math(asset_id);
		}catch (Throwable e) {
			String mess=e.getMessage();
			logger.error(mess,e);
			if(mess.indexOf("[info]")>-1)throw new Exception(e);
			else 	throw new Exception("500,"+mess);
		}	
	}
	/**
	 * 函数说明：删除指定的虚拟机并释放资源
	 * @param vm_name	要删除的虚拟机名
	 * @param user			操作用户
	 * @throws Exception
	 */
	void DelVM(String vm_name, String user)throws Exception{
		PropertyConfigurator.configure(logconf);		
		try {	
//			判断是否存在
			String[][] vm=dbd.readDB("sys_vm", "id,asset_id,ip","name='"+vm_name+"'");
			if(!vm[0][0].equals("")) {
				int row=Integer.parseInt(vm[0][0]);
				dbd.DelSQl("sys_vm", row, 1, 1);				
//				释放IP地址
				row=dbd.check("sys_ip_private", "ip", vm[0][2]);
				if(row>0) {
					dbd.UpdateSQl("sys_ip_private", row, "status", "可用");
					dbd.UpdateSQl("sys_ip_private", row, "asset_id", "");
					dbd.UpdateSQl("sys_ip_private", row, "note", "");
				}
//				追加操作日志
				String[] col_log= {"type","logdate","operator","obj","log"};
				String[] rec_log= {"虚拟机",sdf_full.format(new Date()),user, vm_name,"删除虚拟机"+vm_name};
				dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
//				从新计算主机的资源
				server_res_math(vm[0][1]);
			}
		}catch (Throwable e) {
			String mess=e.getMessage();
			logger.error(mess,e);
			if(mess.indexOf("[info]")>-1)throw new Exception(e);
			else 	throw new Exception("500,"+mess);
		}	
	}
	/**
	 * 函数说明：更新虚拟机信息
	 * @param oldname	虚拟机原有的名称，用来定位记录位置
	 * @param user			操作用户
	 * @param vmdat		新的虚拟机信息数据
	 * @throws Exception 404, 虚拟机不存在
	 * @throws Exception 409, 新的虚拟机名称已存在
	 * @throws Exception 410, 宿主机资源不足
	 */
	void UpdateVM(String oldname, String user, String vmdat)throws Exception{
		PropertyConfigurator.configure(logconf);		
		try {	
//			获取原有数据
			String[][] vm_src=dbd.readDB("sys_vm", "id,asset_id,name,os,cpu,mem,disk,ip,des,user", "name='"+oldname+"'");
			if(vm_src[0][0].equals(""))throw new Exception("[info]404,虚拟机"+oldname+"不存在。");	
			
			JSONObject vm=new JSONObject(vmdat);
//			如果新旧名称不同，判断新名称是否存在
			String vm_name=vm.getString("name");
			if(!vm_name.equals(oldname)) {
				int row=dbd.check("sys_vm", "name", vm_name);
				if(row>0)throw new Exception("[info]409,虚拟机"+vm_name+"已存在。");	
			}	
			
//			判断新IP是否有效
			String new_ip=vm.getString("ip");
			if(!new_ip.equals(vm_src[0][7])) {
				String[][] ip_sta=dbd.readDB("sys_ip_private", "status,id", "ip='"+new_ip+"'");
				if(ip_sta[0][0].equals(""))throw new Exception("[info]404,新的IP地址"+new_ip+"无效。");
				if(ip_sta[0][0].equals("使用中"))throw new Exception("[info]409,新的IP地址"+new_ip+"已被使用。");
//				占用新IP
				int row=Integer.parseInt(ip_sta[0][1]);
				dbd.UpdateSQl("sys_ip_private", row, "status", "使用中");
				dbd.UpdateSQl("sys_ip_private", row, "asset_id", vm.getString("asset_id"));
				dbd.UpdateSQl("sys_ip_private", row, "note", "[sysinfo]用于虚拟机"+vm_name);
//				释放旧IP
				row=dbd.check("sys_ip_private", "ip", vm_src[0][7]);
				dbd.UpdateSQl("sys_ip_private", row, "status", "可用");
				dbd.UpdateSQl("sys_ip_private", row, "asset_id", "");
				dbd.UpdateSQl("sys_ip_private", row, "note", "");
			}
//			判断主机资源是否够用
			String new_serv=vm.getString("asset_id");
			String[][] rsc=dbd.readDB("sys_vmm_phy_server", "cpu_usable,disk_usable,mem_usable", "asset_id='"+new_serv+"'");
			int cpu_usable=Integer.parseInt(rsc[0][0]);
			int disk_usable=Integer.parseInt(rsc[0][1]);
			int mem_usable=Integer.parseInt(rsc[0][2]);
			int cpu=Integer.parseInt(vm.getString("cpu"));
			int mem=Integer.parseInt(vm.getString("mem"));
			int disk=Integer.parseInt(vm.getString("disk"));
//			如果虚拟机的宿主机改变，则判断新宿主机资源是否够用
			if(!vm_src[0][1].equals(new_serv)) {				
				if(cpu>cpu_usable)throw new Exception("[info]410, 物理服务器CPU资源不够，请确认。");
				if(mem>mem_usable)throw new Exception("[info]410, 物理服务器内存资源不够，请确认。");
				if(disk>disk_usable)throw new Exception("[info]410, 物理服务器磁盘资源不够，请确认。");
			}
			else {
				int old_cpu=Integer.parseInt(vm_src[0][4]);
				int old_mem=Integer.parseInt(vm_src[0][5]);
				int old_disk=Integer.parseInt(vm_src[0][6]);
				if((cpu-old_cpu)>cpu_usable) throw new Exception("[info]410, 物理服务器CPU资源不够，请确认。");
				if((mem-old_mem)>mem_usable)throw new Exception("[info]410, 物理服务器内存资源不够，请确认。");
				if((disk-old_disk)>disk_usable)throw new Exception("[info]410, 物理服务器磁盘资源不够，请确认。");
			}
//			更新虚拟机信息
			String loginfo="";
			String[] colname= {"asset_id","name","os","cpu","mem","disk","ip","des","user"};
			String[] logtext= {"物理主机","虚拟机名","操作系统","cpu","内存","磁盘","ip","用途","使用人"};
			int row=Integer.parseInt(vm_src[0][0]);
			for(int i=0;i<colname.length;i++) {
				String va=vm.getString(colname[i]);
				if(!vm_src[0][i+1].equals(va)) {
					dbd.UpdateSQl("sys_vm", row, colname[i], va);
					loginfo=loginfo+logtext[i]+"从"+vm_src[0][i+1]+"变更为"+va+";";
				}				
			}
			if(!loginfo.equals("")) {
//				追加操作日志
				String[] col_log= {"type","logdate","operator","obj","log"};
				String[] rec_log= {"虚拟机",sdf_full.format(new Date()),user, vm_name,"虚拟机"+vm_name+"信息变更："+loginfo};
				dbd.AppendSQl("sys_logs", col_log, rec_log, 1, 1);
			}
//			从新计算服务器资源状态
			server_res_math(vm_src[0][1]);
			if(!vm_src[0][1].equals(new_serv))server_res_math(new_serv);
		}catch (Throwable e) {
			String mess=e.getMessage();
			logger.error(mess,e);
			if(mess.indexOf("[info]")>-1)throw new Exception(e);
			else 	throw new Exception("500,"+mess);
		}	
	}
	/**
	 * 函数说明：查找符合条件的虚拟机
	 * @param key	要查找的列名
	 * @param value	要查找的条件
	 * @return		JSON格式字符串，例如{"vms":[{"name":"","ip":"","os":"","cpu":"","mem":"","disk":"","des":"","user":"","type":""},{},...],"code":200}
	 * @throws Exception
	 */
	String ListVM(String key, String value)throws Exception{
		PropertyConfigurator.configure(logconf);		
		try {	
			String colname="asset_id,name,ip,os,cpu,mem,disk,des,user,type";
			String filter="id>0";
			if(!key.equals("") && !value.equals(""))filter=key+" like '%"+value+"%'";
			String[][] vms=dbd.readDB("sys_vm", colname, filter);
			JSONObject bku=new JSONObject();
			JSONArray vmlist=new JSONArray();
			if(!vms[0][0].equals("")) {
				String[] cols=colname.split(",");
				for(int i=0;i<vms.length;i++) {
					JSONObject vm=new JSONObject();
					for(int j=0;j<cols.length;j++)vm.put(cols[j], vms[i][j]);
					vmlist.put(i, vm);
				}
			}
			bku.put("code", 200);
			bku.put("vms", vmlist);
			return bku.toString();
		}catch (Throwable e) {
			String mess=e.getMessage();
			logger.error(mess,e);
			if(mess.indexOf("[info]")>-1)throw new Exception(e);
			else 	throw new Exception("500,"+mess);
		}	
	}
	/**
	 * 函数说明：计算服务器资源状态
	 * @param asset_id		要计算的服务器资产编号
	 * @throws Exception 404, 服务器不在集群中
	 */
	void server_res_math(String asset_id)throws Exception{
		PropertyConfigurator.configure(logconf);		
		try {	
			String[][] serv=dbd.readDB("sys_vmm_phy_server", "id,cpu,mem,disk", "asset_id='"+asset_id+"'");
			if(serv[0][0].equals(""))throw new Exception("[info]404,服务器"+asset_id+"不在集群中。");

			int vm_num=0;
			int cpu=Integer.parseInt(serv[0][1]);
			int mem=Integer.parseInt(serv[0][2]);
			int disk=Integer.parseInt(serv[0][3]);
			int cpu_used=0;
			int cpu_usable=cpu;
			float cpu_rate_usage=0;
			int mem_used=0;
			int mem_usable=mem;
			float mem_rate_usage=0;
			int disk_used=0;
			int disk_usable=disk;
			float disk_rate_usage=0;

//			获取主机下的所有虚拟机资源占用情况
			String[][] vms=dbd.readDB("sys_vm", "cpu,mem,disk", "asset_id='"+asset_id+"'");
			if(!vms[0][0].equals("")) {
				vm_num=vms.length;
				for(int i=0;i<vm_num;i++) {
					cpu_used=cpu_used+Integer.parseInt(vms[i][0]);
					mem_used=mem_used+Integer.parseInt(vms[i][1]);
					disk_used=disk_used+Integer.parseInt(vms[i][2]);
				}
				cpu_usable=cpu-cpu_used;
				cpu_rate_usage=(float)(cpu_used*10000/cpu)/100;
				mem_usable=mem-mem_used;
				mem_rate_usage=(float)(mem_used*10000/mem)/100;
				disk_usable=disk-disk_used;
				disk_rate_usage=(float)(disk_used*10000/disk)/100;
			}
			int row=Integer.parseInt(serv[0][0]);
			dbd.UpdateSQl("sys_vmm_phy_server", row, "vm_num", ""+vm_num);
			dbd.UpdateSQl("sys_vmm_phy_server", row, "cpu_used", ""+cpu_used);
			dbd.UpdateSQl("sys_vmm_phy_server", row, "cpu_usable", ""+cpu_usable);
			dbd.UpdateSQl("sys_vmm_phy_server", row, "cpu_rate_usage", ""+cpu_rate_usage);
			dbd.UpdateSQl("sys_vmm_phy_server", row, "mem_used", ""+mem_used);
			dbd.UpdateSQl("sys_vmm_phy_server", row, "mem_usable", ""+mem_usable);
			dbd.UpdateSQl("sys_vmm_phy_server", row, "mem_rate_usage", ""+mem_rate_usage);
			dbd.UpdateSQl("sys_vmm_phy_server", row, "disk_used", ""+disk_used);
			dbd.UpdateSQl("sys_vmm_phy_server", row, "disk_usable", ""+disk_usable);
			dbd.UpdateSQl("sys_vmm_phy_server", row, "disk_rate_usage", ""+disk_rate_usage);
		}catch (Throwable e) {
			String mess=e.getMessage();
			logger.error(mess,e);
			if(mess.indexOf("[info]")>-1)throw new Exception(e);
			else 	throw new Exception("500,"+mess);
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