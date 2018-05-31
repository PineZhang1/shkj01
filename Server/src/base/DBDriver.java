/** 类说明：本模块用于实现mySQL数据库的操作，使用jdbc驱动，不返回SQL错误，返回自定义错误代码
 *  作   者：Leo
 *  时   间：2016/9/30
 *  版   本：V1.0
 *  方   法：本模块支持的方法包括：
 *  	1. 创建数据表						void 			CreatTable(String Tname,String[][]phase)
 *  	2. 删除数据表						void 			DelTable(String Tname)
 *  	3. 读数据表							String[][] 	readDB(String DBname,String Colname,String filter)
 *  	4. 删除一条记录					void 			DelSQl(String DBname,int row,int count,int num)
 *  	5. 追加一条记录					void 			AppendSQl(String DBname,String[] colname,String[] record,int count,int num)
 *  	6. 修改一条记录					int 			UpdateSQl(String DBname,int row,String Colname,String newValue)
 *  	7. 获取数据表记录总数			int 			check(String DBname)
 *  	8. 查询表中符合条件的记录数 int 			checknum(String DBname,String Colname,String filter)
 *  	9. 查询数据库，返回值			int 			check(String DBname,String Colname,String key)
 *  	10. 查询数据库，返回序列		int 			check(String DBname,String[] Colname,String[] key)
 *  	11.模糊查询数据库，返回ID	int 			scheck(String DBname,String Colname,String key)
 *  	12.链接数据库						Connection connectSQL(String dbname)
 *  	13.记录重排序						void 			Resort(String DBname,int tag)
 *  	14.按要求初始化数据库			Boolean 	DBinit(int tag)待修改
 */
package base;
import java.sql.*;

import org.apache.log4j.*;

public class DBDriver {
	//类属性：版本。。。
	static String Version="V1.0";
	//	配置日志属性文件位置
	static String rootpath=System.getProperty("user.dir").replace("\\bin", "");
	static String logconf=rootpath+"\\conf\\EAS\\log.properties";
	static String sysconf=rootpath+"\\conf\\EAS\\Sys_config.xml";
	Logger logger = Logger.getLogger(DBDriver.class.getName());	
	
	/**[Function] 				创建一个新表
	 * [SQL命令]				CREATE TABLE 表名 (字段1 类型(长度),字段2 类型(长度),字段3 类型(长度),字段4 类型(长度));
	 * @param Tname		待创建的表名
	 * @param Pkey			新表中的主key字段
	 * @param phase		新表的字段，格式如{{"id", "int(6)"},{"tsid", "VARCHAR(6)"},{"name", "VARCHAR(50)"}};
	 * @throws  				500 - 数据库故障
	 * @throws				409 - 数据表名称重复
	 * @throws				412 - 数据表名称含有无效字符
	 */
	public void CreatTable(String Tname,String[][]phase) throws Throwable{
		String[] invchar={"-","?","=","'",",","\""};//非法字符检查
		int iclen=invchar.length;
		for(int i=0;i<iclen;i++){
			if(Tname.indexOf(invchar[i])>-1){
				String error="[info]412,表名中包含无效字符["+invchar[i]+"].";
				throw new SQLException(error);
			}
		}
		try {
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");
			Statement statement = conn.createStatement();
			String Sqlcom="CREATE TABLE "+Tname+"(";
			int num=phase.length;
			for(int i=0;i<num;i++ ){
				Sqlcom=Sqlcom+phase[i][0]+ " " +phase[i][1];
				if(i==0)Sqlcom=Sqlcom+" NOT NULL auto_increment PRIMARY KEY";
				if(i<num-1)Sqlcom=Sqlcom+",";
			}
			Sqlcom=Sqlcom+");";	
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd:"+Sqlcom);
			statement.executeUpdate(Sqlcom);
			statement.close();
			conn.close();
			conn=null;						
		}catch (SQLException e) {			
			String code="500,";
			String mess=e.toString();
			if(mess.indexOf("already exists")>-1)code="409,";
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString(), e);
			throw new SQLException("[info]"+code+e.toString());
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
	}
	
	/**[Function] 				删除指定的表
	 * [SQL命令]				DROP TABLE 表名;
	 * @param Tname		待删除的表名
	 * @throws  				500 - 数据库故障
	 */
	public void DelTable(String Tname) throws Throwable{
		try {
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");	
			Statement statement = conn.createStatement();
			String Sqlcom="drop table "+Tname;
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd:"+Sqlcom);
			statement.execute(Sqlcom);
			statement.close();
			conn.close();
			conn=null;			
		}catch (SQLException e) {
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString(), e);
			throw e;
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
	}
	
	/**[Function] 				读取指定的表中符合条件的记录，返回记录中的列可以指定
	 * [SQL命令]				SELECT [Colname] FROM [DBname] WHERE 搜索条件  
	 * @param DBname	待读取的表名
	 * @param Colname	列名，如果为*表示所有列
	 * @param filter			过滤器
	 * @return [String[][]] 返回所有满足条件的记录，按字符串数组返回，如果没有要读取的记录则返回""
	 * @throws  				500 - 数据库故障
	 */
	public String[][] readDB(String DBname,String Colname,String filter) throws Throwable{
		String[][] readline = {{""}};
		String Sqlcom="";
		try {			
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");	
			PreparedStatement pstta=null;
			Sqlcom="SELECT "+Colname + " FROM "+DBname+" WHERE "+filter+";";
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd: "+Sqlcom);	
			pstta=conn.prepareStatement(Sqlcom);										
			ResultSet rs = pstta.executeQuery();	
			int col_count=0;
			if(Colname.equals("*")){
				ResultSetMetaData rsm=rs.getMetaData();
				col_count=rsm.getColumnCount();
			}
			else {
				String[] columns=Colname.split(",");
				col_count=columns.length;
			}
			rs.last();
			int record_count=rs.getRow();
			rs.first();	
			if(record_count>0){
				readline = new String [record_count][col_count];
				for(int i=0;i<record_count;i++){
					for(int k=0;k<col_count;k++)readline[i][k]=rs.getString(k+1);
					rs.next();
				}
			}
			pstta.close();
			conn.close();
			conn=null;	
		}catch (SQLException e) {
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString(), e);
			throw new SQLException("[info]500,"+e.toString());
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
		return readline;
	}
	/**[Function] 				读取指定表的列名
	 * [SQL命令]				SELECT [Colname] FROM [DBname]
	 * @param DBname	要读取的表名
	 * @return  				返回列名字符串，用","分隔
	 * @throws  				500 - 数据库故障
	 */
	public String GetDBColname(String DBname) throws Throwable{
		String Sqlcom="";
		try {			
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");	
			PreparedStatement pstta=null;
			Sqlcom="SELECT * FROM "+DBname+";";
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd: "+Sqlcom);	
			pstta=conn.prepareStatement(Sqlcom);										
			ResultSet rs = pstta.executeQuery();	
			ResultSetMetaData rsm=rs.getMetaData();
			int col_count=rsm.getColumnCount();		
			String a="";
			for(int k=0;k<col_count;k++)a=a+rsm.getColumnName(k+1)+",";
			a=a.substring(0, a.length()-1);			
			pstta.close();
			conn.close();
			conn=null;	
			return a;
		}catch (SQLException e) {
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString(), e);
			throw new SQLException("[info]500,"+e.toString());
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
	}
	/**[Function] 				删除指定的表中指定的记录或者清除表中所有记录（参数row=0）
	 * [SQL命令]				DELETE FROM 表名称 WHERE 列名称 = 值;		删除一行
	 * [SQL命令]				TRUNCATE TABLE 表名称；			删除整个表的数据
	 * @param DBname	待读取的表名
	 * @param row			行号
	 * @param count		如果需要连续写入的情况，本参数指定需要写入的总记录数，参数值为1时表示单次写入，本参数是为了减少多次连接数据库，提高效率
	 * @param num			如果需要连续写入的情况，本参数指定当前写入记录的序号，单次写入时，这里必须为1，目的同上
	 * @throws  				404 - 没有找到要删除的记录
	 * @throws  				500 - 数据库故障
	 */
	public void DelSQl(String DBname,int row,int count,int num) throws Throwable{
		String Sqlcom="";
		try {
			PreparedStatement pst=null;
			PreparedStatement pstt=null;
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");	
			if(row>0){				
				Sqlcom="delete from "+DBname+" where id=?;";
				pstt = conn.prepareStatement(Sqlcom);
				pstt.setInt(1,row);
				PropertyConfigurator.configure(logconf);
				logger.info("SQL cmd: delete from "+DBname+" where id="+row);
				int a=pstt.executeUpdate();
				if(a==0)throw new SQLException("[info]404,没有找到要删除的记录！");
				else	if(num==count){
//					判断删除记录后表是否已空，如果为空则清表，否则重新排序
					pstt.close();
					conn.close();
					conn=null;
					int nu=check(DBname);
					if(nu==0)DelSQl(DBname, 0, 1, 1);
					else if(nu>0)Resort(DBname, row);							
				}
			}
			else{
				Sqlcom="TRUNCATE TABLE "+  DBname;
				PropertyConfigurator.configure(logconf);
				logger.info("SQL cmd: "+Sqlcom);
				pst = conn.prepareStatement(Sqlcom);
				pst.executeUpdate();
				pst.close();
				conn.close();
				conn=null;
			}	
		}catch (SQLException e) {
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString(), e);
			throw new SQLException("[info]500,"+e.toString());
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
	}
	/**[Function] 				删除指定的表中指定的记录，没有重排序要求
	 * [SQL命令]				DELETE FROM 表名称 WHERE 列名称 = 值;		删除一行
	 * @param DBname	数据表名
	 * @param filt			过滤器
	 * @throws  				404 - 没有找到要删除的记录
	 * @throws  				500 - 数据库故障
	 */
	public void DelSQl_q(String DBname,String filt) throws Throwable{
		PropertyConfigurator.configure(logconf);
		String Sqlcom="";
		try {
			PreparedStatement pst=null;
			PreparedStatement pstt=null;
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");	
			if(!filt.equals("")){				
				Sqlcom="delete from "+DBname+" where "+filt+";";
				pstt = conn.prepareStatement(Sqlcom);				
				logger.info(Sqlcom);
				int a=pstt.executeUpdate();
				if(a==0)throw new SQLException("[info]404,没有找到要删除的记录！");
			}
			else{
				Sqlcom="TRUNCATE TABLE "+  DBname;
				PropertyConfigurator.configure(logconf);
				logger.info("SQL cmd: "+Sqlcom);
				pst = conn.prepareStatement(Sqlcom);
				pst.executeUpdate();
				pst.close();
				conn.close();
				conn=null;
			}	
		}catch (SQLException e) {
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString(), e);
			throw new SQLException("[info]500,"+e.toString());
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
	}
	/**[Function] 				在指定的表中追加一条记录，可以指定列
	 * [SQL命令]				INSERT INTO 表名称 VALUES (值1, 值2,....) 或 INSERT INTO 表名称 (列1, 列2,...) VALUES (值1, 值2,....); 
	 * @param DBname	待读取的表名
	 * @param cloname	列名，必须指定，不能为空
	 * @param record		记录内容
	 * @param count		如果需要连续写入的情况，本参数指定需要写入的总记录数，参数值为1时表示单次写入，本参数是为了减少多次连接数据库，提高效率
	 * @param num			如果需要连续写入的情况，本参数指定当前写入记录的序号，单次写入时，这里必须为1，目的同上
	 * @throws  				500 - 数据库故障
	 */
	@SuppressWarnings("unused")
	public void AppendSQl(String DBname,String[] colname,String[] record,int count,int num) throws Throwable{
		try {
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");	
			PreparedStatement pstt=null;
			String line=") values(";
			String coln=" (";
			String Sqlcom;
			String logc="";			
			for(String a:colname)coln=coln+a+",";
			coln=coln.substring(0,coln.length()-1);								
			for(String a:record)line=line+"?,";
			line=line.substring(0,line.length()-1);
			line=line+");";
			Sqlcom="insert into  "+DBname+coln+line;	
			pstt = conn.prepareStatement(Sqlcom);			
			logc="insert into "+DBname+coln+line;	
			for(int i=0;i<record.length;i++ )	{
				pstt.setString(i+1,record[i]);
				logc=logc.replaceFirst("\\?", record[i]);
			}	
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd: "+logc);
			pstt.executeUpdate();
			if(num==count){					
//				查询最新插入的记录ID号,如果与之前的记录有空行，变更行号为最前列
				int id=0;
				Sqlcom="select id from "+DBname+" order by id desc limit 0,1;";
				logc=Sqlcom;
				PropertyConfigurator.configure(logconf);
				logger.info("SQL cmd: "+logc);
				ResultSet rs=conn.prepareStatement(Sqlcom).executeQuery();
				if(rs.next())id=rs.getInt(1);
				pstt.close();
				conn.close();
				conn=null;
				num=check(DBname);		
				if(id>num & num>0){
					num=num-count;
					for(int j=1;j<=count;j++){
						UpdateSQl(DBname,id-count+j,"id",(""+(num+j)));
					}					
				}					
			}	
		}catch (SQLException e) {			
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString(), e);
			throw new SQLException("[info]500,"+e.toString());
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
	}
	
	/**[Function] 				在指定的表中更新一个值，必须指定列
	 * [SQL命令]				UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 旧值；
	 * @param DBname	待读取的表名
	 * @param row			要更新的记录行号
	 * @param Colname	列名，必须指定，不能为空
	 * @param newValue	要更新的新值
	 * @return	[int]			更新的记录数，没有找到要更新的记录或者没有更新成功则返回0
	 * @throws  				500 - 数据库故障
	 */
	public int UpdateSQl(String DBname,int row,String Colname,String newValue) throws Throwable{
		int rs=0;
		try {
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");	
			String Sqlcom="UPDATE "+DBname + " SET "+Colname+"='"+ newValue + "' WHERE id=" + row+";";
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd: "+Sqlcom);
			PreparedStatement pst = conn.prepareStatement(Sqlcom);
			rs=pst.executeUpdate();	//返回0表示没有记录被更新
			pst.close();
			conn.close();
			conn=null;	
		}catch (SQLException e) {
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString(), e);
			throw new SQLException("[info]500,"+e.toString());
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
		return rs;
	}
		
	/**[Function] 				查表，返回该表的总记录数
	 * [SQL命令]				SELECT COUNT(*) FROM 表名；
	 * @param DBname	待查的表名
	 * @return [int] 			返回记录总数
	 * @throws  				500 - 数据库故障
	 * @throws				404 - 未找到要查询的数据表
	 */
	public int check(String DBname) throws Throwable{
		int num=0;
		try {
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");	
			String Sqlcom="SELECT COUNT(*) FROM "+DBname+";";
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd: "+Sqlcom);
			PreparedStatement pst = conn.prepareStatement(Sqlcom);
			ResultSet rs=pst.executeQuery();
			if(rs.next())num=rs.getInt(1);
			pst.close();
			conn.close();
			conn=null;
		}catch (SQLException e) {
			PropertyConfigurator.configure(logconf);
			String mess=e.toString();
			logger.error("SQL err: "+mess);
			String code="500,";			
			if(mess.indexOf("doesn't exist")>-1)code="404,";
			throw new SQLException("[info]"+code+mess);
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
		return num;
	}
	
	/**[Function] 				查表，返回符合条件的记录数
	 * [SQL命令]				SELECT COUNT(*) FROM 表名 WHERE 条件；
	 * @param DBname	待查的表名
	 * @param Colname	列名，为空表示在所有列查
	 * @param filter			查询条件
	 * @return [int] 			返回记录总数
	 * @throws  				500 - 数据库故障
	 * @throws				404 - 未找到要查询的数据表
	 */
	public int checknum(String DBname,String Colname,String filter) throws Throwable{
		int num=0;
		try {
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");				
			String Sqlcom="SELECT "+Colname+" FROM "+DBname+" WHERE " + filter+";";			
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd: "+Sqlcom);
			PreparedStatement pst = conn.prepareStatement(Sqlcom);
			ResultSet rs=pst.executeQuery();
			rs.last();
			num=rs.getRow();
			pst.close();
			conn.close();
			conn=null;
		}catch (SQLException e) {			
			PropertyConfigurator.configure(logconf);
			String mess=e.toString();
			logger.error("SQL err: "+mess);
			String code="500,";			
			if(mess.indexOf("doesn't exist")>-1)code="404,";
			throw new SQLException("[info]"+code+mess);
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
		return num;
	}
	
	/**[Function] 				按单项条件查表，返回第一个符合key的记录id
	 * [SQL命令]				SELECT 列名 FROM 表名 WHERE 列名称=搜索条件;
	 * @param DBname	待查的表名
	 * @param Colname	列名，为空表示读取所有记录数
	 * @param key			查表的关键字
	 * @return [int] 			正常返回记录的行号，如果没有找到key则返回0，
	 * @throws  				500 - 数据库故障
	 * @throws				404 - 未找到要查询的数据表
	 */
	public int check(String DBname,String Colname,String key) throws Throwable{
		int id=0;
		try {
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");	
			
			String Sqlcom="SELECT id FROM "+DBname+" WHERE " +Colname +"='"+ key+"';";			
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd: "+Sqlcom);
			PreparedStatement pst = conn.prepareStatement(Sqlcom);
			ResultSet rs=pst.executeQuery();
			if(rs.next())id=rs.getInt(1);
			pst.close();
			conn.close();
			conn=null;
		}catch (SQLException e) {			
			PropertyConfigurator.configure(logconf);
			String mess=e.toString();
			logger.error("SQL err: "+mess);
			String code="500,";			
			if(mess.indexOf("doesn't exist")>-1)code="404,";
			throw new SQLException("[info]"+code+mess);
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
		return id;
	}
	
	/**[Function] 				按多项条件查表，返回符合条件的第一个记录ID
	 * [SQL命令]				SELECT 列名 FROM 表名 WHERE 列名称=搜索条件1 AND 列名称=搜索条件2。。。。；
	 * @param DBname	待查的表名
	 * @param Colname	列名
	 * @param key			查表的关键字
	 * @return [int] 			正常返回记录的行号，如果没有找到则返回0
	 * @throws  				500 - 数据库故障
	 * @throws				404 - 未找到要查询的数据表
	 * @throws  				412 - 参数不正确
	 */
	public int check(String DBname,String[] Colname,String[] key) throws Throwable{
		int id=0;
		int numclo=Colname.length;
		int numkey=key.length;
		if(numclo==0 | numkey==0 | numkey!=numclo)throw new SQLException("[info]412,表名、列名或内容参数错误！");
		try {
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");
			String Sqlcom="SELECT id FROM "+DBname+" WHERE ";	
			for(int i=0;i<numclo;i++)Sqlcom=Sqlcom+Colname[i] +"='"+ key[i]+"' AND ";
			Sqlcom=Sqlcom.substring(0,Sqlcom.lastIndexOf(" AND"))+";";
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd: "+Sqlcom);
			PreparedStatement pst = conn.prepareStatement(Sqlcom);
			ResultSet rs=pst.executeQuery();
			if(rs.next())id=rs.getInt(1);
			pst.close();
			conn.close();
			conn=null;	
		}catch (SQLException e) {			
			PropertyConfigurator.configure(logconf);
			String mess=e.toString();
			logger.error("SQL err: "+mess);
			String code="500,";			
			if(mess.indexOf("doesn't exist")>-1)code="404,";
			throw new SQLException("[info]"+code+mess);
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
		return id;
	}
	
	/**[Function] 				按单项条件进行模糊查表，返回第一个符合key的记录id
	 * [SQL命令]				SELECT 列名 FROM 表名 WHERE 列名称 LIKE 搜索条件;
	 * @param DBname	待查的表名
	 * @param Colname	列名，为空表示读取所有记录数
	 * @param key			查表的关键字
	 * @return [int] 			正常返回记录的行号，如果没有找到key则返回0，
	 * @throws  				500 - 数据库故障
	 * @throws				404 - 未找到要查询的数据表
	 */
	public int scheck(String DBname,String Colname,String key) throws Throwable{
		int id=0;
		try {
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");	
			
			String Sqlcom="SELECT id FROM "+DBname+" WHERE " +Colname +" LIKE '"+ key+"';";			
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd: "+Sqlcom);
			PreparedStatement pst = conn.prepareStatement(Sqlcom);
			ResultSet rs=pst.executeQuery();
			if(rs.next())id=rs.getInt(1);
			pst.close();
			conn.close();
			conn=null;
		}catch (SQLException e) {			
			PropertyConfigurator.configure(logconf);
			String mess=e.toString();
			logger.error("SQL err: "+mess);
			String code="500,";			
			if(mess.indexOf("doesn't exist")>-1)code="404,";
			throw new SQLException("[info]"+code+mess);
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}
		return id;
	}
	
	/**[Function]					连接数据库
	 * @param dbname		要打开的表名
	 * @return						返回一个数据库连接对象
	 * @throws Throwable 	404 - 数据库配置文件不存在或者找不到项目
	 * @throws Throwable 	412 - 数据库配置文件读取参数错误
	 * @throws Throwable 	500 - 数据库配置文件或者数据库故障
	 */
	Connection connectSQL(String dbname) throws Throwable{
		Connection conn=null;
		try {			
			XMLDriver xd=new XMLDriver();
			String driver = "com.mysql.jdbc.Driver";
//			读取系统配置文件中获取MySQL DB的配置信息
			String ip = xd.GetNode(sysconf, "DB_conf/HostName");
			String port=xd.GetNode(sysconf,"DB_conf/Port");
			if(!dbname.equals(""))dbname=xd.GetNode(sysconf,"DB_conf/DBname");
			String user=xd.GetNode(sysconf,"DB_conf/Usrname");
			String password=xd.GetNode(sysconf,"DB_conf/Passwd");
			String url = "jdbc:mysql://"+ip+":"+port+"/"+dbname+"?characterEncoding=utf8";
			Class.forName(driver);
			conn = DriverManager.getConnection(url, user, password);
			if(conn.isClosed()){
		        conn = DriverManager.getConnection(url, user, password);
			}
		} catch(Exception e) {
        	PropertyConfigurator.configure(logconf);
        	logger.error("SQL err: "+e.toString(), e);
        	throw new SQLException("[info]500,"+e.toString());
        } catch(Throwable e) {
        	PropertyConfigurator.configure(logconf);
        	logger.error("XML err: "+e.toString(), e);
        	throw e;
        }
		return conn;
	}
	
	/**[Function]				数据表重新排序
	 * @param DBname	需要重新排序的数据表名
	 * @param tag			缺失的记录号，从该行之后每行id-1
	 * @throws  				500 - 数据库故障
	 * @throws 				409 - 预期缺失的行号存在
	 */
	public void Resort(String DBname,int tag) throws Throwable{
		String Sqlcom="";
		String logc="";
		int id=0;
		try{
//			1. 检查要排序的行号是否存在，存在表示行号错误
			int num=check(DBname,"id",(""+tag));	
			if(num>0)throw new SQLException("[info]409,记录"+tag+"存在！");
//			2. 连接数据库
			Connection conn=connectSQL("db");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");	
			
			Sqlcom="select id from "+DBname+" order by id desc limit 0,1;";
			logc=Sqlcom;
			PropertyConfigurator.configure(logconf);
			logger.info("SQL cmd: "+logc);
			ResultSet rs=conn.prepareStatement(Sqlcom).executeQuery();
			if(rs.next())id=rs.getInt(1);
			rs.close();
			conn.close();
			conn=null;
			
//			3. 如果上级方法删除的是最后一行，id一定小于tag，此时不做任何处理，不会有id=tag的情况
//			如果删除的是中间行，id一定大于tag，后面的（id-tag行需要变更id）
			int x=1;
			int ba;
			for(int i=1;i<=(id-tag);i++){
				ba=UpdateSQl(DBname,tag+i,"id",""+(tag+i-x));
				if(ba==0)x=x+1;
			}
		}catch (SQLException e) {				
				PropertyConfigurator.configure(logconf);
				logger.error("SQL err: "+e.toString());
				throw new SQLException("[info]500,"+e.toString());
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}		
	}
	
	/**[Function]				初始化TMS数据库，清除数据库里的数据，恢复系统管理员账号和密码				
	 * @throws  				500 - 数据库故障
	 */
	public void DBinit() throws Throwable{
		String[][] table={{"sys_usrdb",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"
								+ "usrname varchar(90),"
								+ "passwd varchar(120),"
								+ "fullname varchar(120),"
								+ "dept varchar(150),"
								+ "role varchar(30),"
								+ "email varchar(90),"
								+ "mobile varchar(45),"
								+ "type varchar(30)"
								},
								{"sys_idc",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"
								+"idc varchar(100) NOT NULL DEFAULT '',"
								+"contact varchar(40) NOT NULL DEFAULT '',"
								+"mobile varchar(60) NOT NULL DEFAULT '',"
								+"email varchar(120) NOT NULL DEFAULT '',"
								+"address varchar(200) NOT NULL DEFAULT '',"
								+"note varchar(200) NOT NULL DEFAULT ''"
								},
								{"sys_supplier",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"
								+"supplier varchar(100) NOT NULL DEFAULT '',"
								+"type varchar(40) NOT NULL DEFAULT '',"
								+"contact varchar(40) NOT NULL DEFAULT '',"
								+"mobile varchar(60) NOT NULL DEFAULT '',"
								+"email varchar(120) NOT NULL DEFAULT '',"
								+"address varchar(200) NOT NULL DEFAULT '',"
								+"note varchar(200) NOT NULL DEFAULT ''"
								},
								{"sys_parts",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"
								+"asset_id varchar(50) NOT NULL DEFAULT '',"
								+"type varchar(40) NOT NULL DEFAULT '',"
								+"model varchar(40) NOT NULL DEFAULT '',"
								+"series_num varchar(60) NOT NULL DEFAULT '',"
								+"capacity varchar(200) NOT NULL DEFAULT '',"
								+"status varchar(20) NOT NULL DEFAULT '',"
								+"serv varchar(50) NOT NULL DEFAULT '',"
								+"protect_time datetime NOT NULL DEFAULT '0001-01-01',"
								+"price varchar(20) NOT NULL DEFAULT '',"
								+"note varchar(200) NOT NULL DEFAULT ''"
								},
								{"sys_services",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"
								+"service_id varchar(20) NOT NULL DEFAULT '',"
								+"service varchar(100) NOT NULL DEFAULT '',"
								+"manufacturer varchar(100) NOT NULL DEFAULT '',"
								+"price varchar(10) NOT NULL DEFAULT '',"
								+"buy_time datetime NOT NULL DEFAULT '0001-01-01',"							
								+"protect_time datetime NOT NULL DEFAULT '0001-01-01',"
								+"status varchar(20) NOT NULL DEFAULT '',"
								+"user varchar(20) NOT NULL DEFAULT '',"
								+"purpose varchar(200) NOT NULL DEFAULT '',"
								+"note varchar(200) NOT NULL DEFAULT ''"
								},
								{"sys_device",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"
								+"asset_id varchar(50) NOT NULL DEFAULT '',"
								+"type varchar(40) NOT NULL DEFAULT '',"
								+"model varchar(40) NOT NULL DEFAULT '',"
								+"series_num varchar(60) NOT NULL DEFAULT '',"
								+"capacity varchar(200) NOT NULL DEFAULT '',"
								+"status varchar(20) NOT NULL DEFAULT '',"
								+"protect_time datetime NOT NULL DEFAULT '0001-01-01',"								
								+"price varchar(20) NOT NULL DEFAULT '',"
								+"note varchar(200) NOT NULL DEFAULT ''"
								},
								{"sys_ip_public",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"
								+"ip varchar(20) NOT NULL DEFAULT '',"
								+"network varchar(25) NOT NULL DEFAULT '',"
								+"gateway varchar(20) NOT NULL DEFAULT '',"
								+"idc varchar(80) NOT NULL DEFAULT '',"
								+"operator varchar(40) NOT NULL DEFAULT '',"							
								+"leaseterm datetime NOT NULL DEFAULT '0001-01-01',"
								+"status varchar(20) NOT NULL DEFAULT '',"
								+"user varchar(20) NOT NULL DEFAULT '',"
								+"asset_id varchar(50) NOT NULL DEFAULT '',"
								+"note varchar(200) NOT NULL DEFAULT ''"
								},
								{"sys_ip_private",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"
								+"ip varchar(20) NOT NULL DEFAULT '',"
								+"network varchar(25) NOT NULL DEFAULT '',"
								+"gateway varchar(20) NOT NULL DEFAULT '',"
								+"idc varchar(80) NOT NULL DEFAULT '',"
								+"NatIP varchar(25) NOT NULL DEFAULT '',"							
								+"status varchar(20) NOT NULL DEFAULT '',"
								+"user varchar(20) NOT NULL DEFAULT '',"
								+"asset_id varchar(50) NOT NULL DEFAULT '',"
								+"note varchar(200) NOT NULL DEFAULT ''"
								},
								{"sys_nets",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"
								+"idc varchar(80) NOT NULL DEFAULT '',"
								+"network varchar(25) NOT NULL DEFAULT '',"
								+"gateway varchar(20) NOT NULL DEFAULT ''"
								},
								{"sys_device_ol",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"
								+"idc varchar(80) NOT NULL DEFAULT '',"
								+"cabinet varchar(40) NOT NULL DEFAULT '',"
								+"layer varchar(4) NOT NULL DEFAULT '',"								
								+"asset_id varchar(50) NOT NULL DEFAULT '',"
								+"type varchar(40) NOT NULL DEFAULT '',"							
								+"model varchar(40) NOT NULL DEFAULT '',"	
								+"ip1 varchar(20) NOT NULL DEFAULT '',"	
								+"ip2 varchar(20) NOT NULL DEFAULT '',"
								+"ip3 varchar(20) NOT NULL DEFAULT '',"
								+"ip4 varchar(20) NOT NULL DEFAULT '',"
								+"ip5 varchar(20) NOT NULL DEFAULT '',"
								+"ip6 varchar(20) NOT NULL DEFAULT '',"
								+"capacity varchar(200) NOT NULL DEFAULT '',"
								+"os varchar(100) NOT NULL DEFAULT '',"
								+"status varchar(20) NOT NULL DEFAULT '',"
								+"user varchar(20) NOT NULL DEFAULT '',"
								+"note varchar(200) NOT NULL DEFAULT ''"
								},
								{"sys_device_fix",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"							
								+"asset_id varchar(50) NOT NULL DEFAULT '',"
								+"type varchar(40) NOT NULL DEFAULT '',"							
								+"model varchar(40) NOT NULL DEFAULT '',"	
								+"series_num varchar(60) NOT NULL DEFAULT '',"
								+"fixtime datetime NOT NULL DEFAULT '0001-01-01',"
								+"ma varchar(100) NOT NULL DEFAULT ''"
								+"note varchar(200) NOT NULL DEFAULT ''"
								},
								{"sys_vmm_phy_server",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"		
								 +"idc varchar(80) NOT NULL DEFAULT '',"
								+"asset_id varchar(50) NOT NULL DEFAULT '',"
								+"ipaddr varchar(20) NOT NULL DEFAULT '',"	
								+"locate varchar(100) NOT NULL DEFAULT '',"	
								+"vm_num int(10) NOT NULL DEFAULT 0,"	
								+"cpu int(10) NOT NULL DEFAULT 0,"							
								+"mem int(10) NOT NULL DEFAULT 0,"	
								+"disk int(10) NOT NULL DEFAULT 0,"
								+"cpu_used int(10) NOT NULL DEFAULT 0,"							
								+"cpu_rate_usage varchar(10) NOT NULL DEFAULT 0,"	
								+"mem_used int(10) NOT NULL DEFAULT 0,"
								+"mem_rate_usage varchar(10) NOT NULL DEFAULT 0,"							
								+"disk_used int(10) NOT NULL DEFAULT 0,"	
								+"disk_rate_usage varchar(10) NOT NULL DEFAULT 0,"
								+"cpu_usable int(10) NOT NULL DEFAULT 0,"							
								+"disk_usable int(10) NOT NULL DEFAULT 0,"	
								+"mem_usable int(10) NOT NULL DEFAULT 0"
								},
								{"sys_vm",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"							
								+"asset_id varchar(50) NOT NULL DEFAULT '',"												
								+"name varchar(40) NOT NULL DEFAULT '',"	
								+"os varchar(100) NOT NULL DEFAULT ''"	
								+"cpu int(10) NOT NULL DEFAULT 0,"							
								+"mem int(10) NOT NULL DEFAULT 0,"	
								+"disk int(10) NOT NULL DEFAULT 0,"
								+"ip varchar(20) NOT NULL DEFAULT '',"	
								+"user varchar(20) NOT NULL DEFAULT '',"
								+"type varchar(40) NOT NULL DEFAULT '',"	
								+"des varchar(200) NOT NULL DEFAULT ''"
								},
								{"sys_logs",
								 "id int(3) NOT NULL auto_increment PRIMARY KEY,"							
								+"type varchar(40) NOT NULL DEFAULT '',"							
								+"logdate datetime NOT NULL DEFAULT '0001-01-01',"
								+"operator varchar(40) NOT NULL DEFAULT ''"
								+"log varchar(1000) NOT NULL DEFAULT ''"
								},
								{"sys_usr_purview",
								"id int(3) NOT NULL auto_increment PRIMARY KEY,"
								+ "usrname varchar(100) NOT NULL DEFAULT '',"
								+ "pur_amoeba_account varchar(80) NOT NULL DEFAULT 'y',"
								+ "pur_AnalysisReport varchar(80) NOT NULL DEFAULT 'y',"
								+ "pur_IED_media varchar(80) NOT NULL DEFAULT 'x',"
								+ "pur_IED_agency_friend varchar(80) NOT NULL DEFAULT 'x',"
								+ "pur_IED_brand_customer varchar(80) NOT NULL DEFAULT 'x',"
								+ "pur_IED_agency varchar(80) NOT NULL DEFAULT 'x',"
								+ "pur_IED_agency_info varchar(80) NOT NULL DEFAULT 'x',"
								+ "pur_IED_agency_SEM varchar(80) NOT NULL DEFAULT 'x',"
								+ "pur_IED_daily_cost varchar(80) NOT NULL DEFAULT 'x',"
								+ "pur_DeptMange varchar(80) NOT NULL DEFAULT 'x',"
								+ "pur_ProjMange varchar(80) NOT NULL DEFAULT 'x',"
								+ "pur_MediaMange varchar(80) NOT NULL DEFAULT 'x',"
								+ "pur_UsrMange varchar(80) NOT NULL DEFAULT 'x',"
								+ "pur_Purview varchar(80) NOT NULL DEFAULT 'x'"
								},
							};	
		try {	
			Connection conn=connectSQL("");
			if(conn.isClosed())throw new SQLException("[info]500,数据库连接错误！");		
			PropertyConfigurator.configure(logconf);
			logger.info("初始化asws系统数据库... ");
			String Sqlcom="use aswssys;";
			conn.prepareStatement(Sqlcom).executeUpdate();	
			Sqlcom="SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='aswssys'";
			ResultSet rs=conn.prepareStatement(Sqlcom).executeQuery();
			rs.last();
			int tablenum=table.length;
			int record_count=rs.getRow();
			rs.first();	
			if(record_count>0){
				String tablename;
				int tag=0;
				for(int i=0;i<record_count;i++){
					tablename=rs.getString(1);
					for(int j=0;i<tablenum;j++) {
						if(tablename.equals(table[j][0])) {
							tag=1;
							break;
						}
					}
					if(tag==0){
						Sqlcom="drop table "+tablename;
						conn.prepareStatement(Sqlcom).executeUpdate();
					}
					tag=0;
					rs.next();
				}
			}
			logger.info("构建ASWS数据表... ");
			for(int i=0;i<tablenum;i++){
				Sqlcom="CREATE TABLE IF NOT EXISTS "+table[i][0]+"("+table[i][1]+");";
				logger.info("SQL cmd: "+Sqlcom);
				conn.prepareStatement(Sqlcom).executeUpdate();
			}		
			
			logger.info("从数据表中清除数据...");
			for(int i=0;i<tablenum;i++){
				Sqlcom="TRUNCATE TABLE "+table[i][0]+";";
				conn.prepareStatement(Sqlcom).executeUpdate();
			}			
			logger.info("创建系统管理员账号...");
			String passwd=encrypt("admin123");
			Sqlcom="insert into usrdb(usrname,passwd,fullname,role,email) values ('admin','"+passwd+"','系统管理员','admin','lihao@yiche.com'); ";
			logger.info("SQL cmd: "+Sqlcom);
			conn.prepareStatement(Sqlcom).executeUpdate();
			conn.close();
			conn=null;	
		}catch (SQLException e) {			
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString(), e);
			throw new SQLException("[info]500,"+e.toString());
		}catch (Throwable e) {				
			PropertyConfigurator.configure(logconf);
			logger.error("SQL err: "+e.toString());
			throw e;
		}		
	}
	
	String encrypt(String data){
		String ency="";
		char[] tcr;
		String pi="31415926535897932384626";
		char[] key=pi.toCharArray();
		int i=0;
		tcr=data.toCharArray();
		for(char a : tcr){
			tcr[i]=(char) (a+key[i]);			
			i=i+1;
		}
		ency=String.valueOf(tcr);
		return ency;
	}
}
