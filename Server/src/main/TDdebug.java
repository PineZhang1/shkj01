package main;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.*;

import org.json.JSONArray;
import org.json.JSONObject;

import base.*;

@SuppressWarnings("unused")
public class TDdebug {
	static XMLDriver xml=new XMLDriver();
	static Inform inf=new Inform();
	static DBDriver dbd=new DBDriver();
	static String confpath=System.getProperty("user.dir").replace("\\bin", "");
	static String logconf=confpath+"\\conf\\APA\\log.properties";
	static String sysconf=confpath+"\\conf\\APA\\Sys_config.xml";
	
	public static void main(String[] args) {
		SimpleDateFormat sdf = new SimpleDateFormat("yy-MM-dd");		
		try {
			dbd.DelSQl_q("dict_part_type", "id=5 or id=6");
//			System.out.println(a);
		} catch (Throwable e) {
			e.printStackTrace();
		}
		

	}

}
