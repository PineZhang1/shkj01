var xmlHttp;
var tr_selected;
var page_num;
var page_sum;
// 与后台传递API
function TMS_api(url,med,dats,cfunc){	
	var hostpath=getHostUrl('hostpath_api');	
	try{
		url=encodeURI(hostpath+url);
		xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange=cfunc;		
		xmlHttp.open(med,url,true);
		if(med=="GET")xmlHttp.send();
		else xmlHttp.send(dats);	
	}catch(e){
		alerm(e);
	}	
}
// 加载主机列表，刷新主机资源状态图
function load_device_list(filter) {
	var item_ppnum=17;
	tr_selected=null;
	if(filter=="")filter="filter=";
	var url="EAS/ListServ?"+filter+"&page_count="+item_ppnum+"&page_num="+page_num;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				var bgcolor="a";
				$("#tbody_server_list tr").remove();
				var serv=resp.Serv;
				for(var i=0;i<serv.length;i++){
					if(bgcolor=="")bgcolor='background-color:#F0ECF3;';
					else bgcolor="";
					var line='<tr style="'+bgcolor+'">';
					line=line+'<td>'+serv[i].asset_id+'</td>';
					line=line+'<td>'+serv[i].type+'</td>';
					line=line+'<td>'+serv[i].model+'</td>';
					line=line+'<td>'+serv[i].series_num+'</td>';
					line=line+'<td>'+serv[i].capacity+'</td>';
					line=line+'<td>'+serv[i].status+'</td>';
					var pt=serv[i].protect_time;
					if(pt=="0001-01-01")pt=""
					line=line+'<td>'+pt+'</td>';
					line=line+'<td data-value="'+serv[i].price+'">￥'+rmb(serv[i].price)+'</td>';
					line=line+'<td>'+serv[i].note+'</td>';
					line=line+'</tr>';
					$("#tbody_server_list").append(line);	
				}
				// 变更页码
				var item_sum=parseInt(resp.total_num);
				page_sum=Math.ceil(item_sum/item_ppnum);
				$("#page_num").text(page_sum);
				if(serv.length==0)page_num=0;
				$("#curr_page").text(page_num);

				$("#sum_server").text(resp.serv_num);
				$("#sum_switch").text(resp.sw_num);
				$("#sum_fireware").text(resp.fw_num);
				$("#sum_otherdevice").text(resp.other_num);
				if(page_num<2){
					$("#Fir_page").attr("disabled",true);
					$("#Pre_page").attr("disabled",true);
				}
				else{
					$("#Fir_page").attr("disabled",false);
					$("#Pre_page").attr("disabled",false);
				}
				if(page_num==page_sum){
					$("#Next_page").attr("disabled",true);
					$("#Las_page").attr("disabled",true);
				}
				else{
					$("#Next_page").attr("disabled",false);
					$("#Las_page").attr("disabled",false);
				}		
			}
			else alerm(resp.message);
		}
	});	
}
// 查找测试集
function filt(){
	var fts="";
	var filter=$("#filt_value").val();
	var phase=$("#filt_key option:selected").attr("value");
	if(filter!="")fts="filter="+phase+" like '*"+filter+"*'";
	load_device_list(fts);
}
function tofilt(){
	page_num=1;
	filt();
}
// 翻页
function Topage(num){
	if(page_num!=num){
		if(num==0)page_num=page_sum;
		else page_num=num;
		filt();
	}
}
function Nextpage(tag){
	if(tag=="+" && page_num!=page_sum) page_num++;
	else if(tag=="-" && page_num!=1) page_num--;		
	filt();	
}
// 添加新设备
function AddDevice(){
	$("#save_butt_serv").attr('data-value','AddServ');
	$("#asset_id").attr("disabled",false);
	$("#type").attr("disabled",false);
	open_form('#form_Servinfo','#overlay');
}
// 打开编辑设备弹层
function editinfo(){
	if(tr_selected==null)alerm("请先选择要操作的设备。");
	else {
		var status=tr_selected.children().eq(5).text();
		if(status=='使用中')alerm("使用中的设备不能直接变更信息！");
		else if(status=='维修中')alerm("维修中的设备不能变更信息！");
		else {
			$("#asset_id").val(tr_selected.children().eq(0).text());
			$("#type").val(tr_selected.children().eq(1).text());
			$("#model").val(tr_selected.children().eq(2).text());
			$("#series_num").val(tr_selected.children().eq(3).text());
			$("#capacity").val(tr_selected.children().eq(4).text());
			$("#protect_time").val(tr_selected.children().eq(6).text());
			$("#price").val(tr_selected.children().eq(7).text());
			$("#price").attr("data-value",tr_selected.children().eq(7).attr("data-value"));
			$("#note").val(tr_selected.children().eq(8).text());

			$("#asset_id").attr("disabled",true);
			$("#type").attr("disabled",true);
			$("#save_butt_serv").attr('data-value','UpdateServ');
			open_form('#form_Servinfo','#overlay');
		}		
	}	
}
// 执行删除设备操作
function ToConfirm(){
	var url="EAS/DelServ?asset_id="+tr_selected.children().eq(0).text();
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){					
				tr_selected=null;
				CloseForm('#form_confirm','#overlay');
				alerm("设备已删除！");
				page_num=1;
				filt();					
			}
			else alerm(resp.message);
		}
	});
}
// 删除设备前确认
function DelDevice(){
	if(tr_selected==null)alerm("请先选择要删除的设备。");
	else {
		var status=tr_selected.children().eq(5).text();
		if(status=='使用中')alerm("使用中的设备不能直接删除，请先下架！");
		else if(status=='维修中')alerm("维修中的设备不能直接删除，请先从维修列表执行'维修结束'操作！");
		else open_form('#form_confirm','#overlay');
	}
}
// 保存设备信息
function device_save(){
	var host={};	
	asset_id=$("#asset_id").val();		
	host.model=$("#model").val();
	host.series_num=$("#series_num").val();
	host.capacity=$("#capacity").val();
	host.price=$("#price").attr("data-value");
	host.protect_time=$("#protect_time").val();	
	if(host.protect_time=="")host.protect_time="0001-01-01";
	if(asset_id==""){
		alerm("资产编号不能为空！");
		$("#asset_id").focus();
	}
	else if(host.model==""){
		alerm("型号不能为空！");
		$("#model").focus();
	}
	else if(host.series_num==""){
		alerm("设备序列号不能为空！");
		$("#series_num").focus();
	}
	else if(host.capacity==""){
		alerm("配置不能为空！");
		$("#capacity").focus();
	}
	else if(host.price==""){
		alerm("价格不能为空！");
		$("#price").focus();
	}
	else{
		host.note=$("#note").val();
		host.type=$("#type").val();	
		var body = JSON.stringify(host);
		var url="EAS/"+$("#save_butt_serv").attr('data-value')+"?asset_id="+asset_id;						
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){
					CloseForm("#form_Servinfo","#overlay");	
					alerm("操作成功");	
					page_num=1;								
					filt();
				}
				else alerm(resp.message)
			}
		});
	}
}
// 打开设备上架弹层
function online(){
	if(tr_selected==null)alerm("请先选择要上架的设备。");
	else {
		var status=tr_selected.children().eq(5).text();
		if(status=='使用中')alerm("该设备已经上架了！");
		else if(status=='维修中')alerm("该设备正在维修，请等待维修结束！");
		else{
			$("#ol_asset_id").text(tr_selected.children().eq(0).text());
			$("#ol_type").text(tr_selected.children().eq(1).text());
			// 获取机房列表
			var url="EAS/ListIDC?filter=&page_count=&page_num=";					
			TMS_api(url,"GET","",function(){
				if (xmlHttp.readyState==4 && xmlHttp.status==200){
					var resp = JSON.parse(xmlHttp.responseText);
					if(resp.code==200){
						$("#IDClist option").remove();
						for(var i=0;i<resp.IDC.length;i++){
							var line="<option>"+resp.IDC[i].idc+"</option>";
							$("#IDClist").append(line);
						}

						url="SysCfg/ListDict?type=";
						TMS_api(url,"GET","",function a(){
							if (xmlHttp.readyState==4 && xmlHttp.status==200){
								var resp = JSON.parse(xmlHttp.responseText);
								if(resp.code==200){	
									if(resp.os.length>0)$("#os option").remove();
									for(var i=0;i<resp.os.length;i++){
										var line="<option>"+resp.os[i]+"</option>";
										$("#os").append(line);
									}

									if(resp.dept_contractor.length>0)$("#user option").remove();
									for(var i=0;i<resp.dept_contractor.length;i++){
										var line="<option>"+resp.dept_contractor[i]+"</option>";
										$("#user").append(line);
									}
									$("#os").val(tr_selected.children().eq(8).text());
									$("#user").val(tr_selected.children().eq(10).text());
									open_form('#form_online','#overlay');
								}
								else alerm(resp.message);
							}
						});													
					}
					else alerm(resp.message)
				}
			});		
		}		
	}
}
// 设备上架
function device_online(){
	var dat={};	
	dat.cabinet=$("#cabinet").val();
	dat.layer=$("#layer").val();
	dat.os=$("#os").val();	
	dat.user=$("#user").val();
	dat.ip1=$("#ipaddr1").val();
	if(dat.cabinet==""){
		alerm("机柜信息不能为空！");
		$("#cabinet").focus();
	}	
	else if(dat.layer==""){
		alerm("层号信息不能为空！");
		$("#layer").focus();
	}
	else if(dat.os==""){
		alerm("操作系统信息不能为空！");
		$("#os").focus();
	}
	else if(dat.user==""){
		alerm("使用人信息不能为空！");
		$("#user").focus();
	}
	else if(dat.ip1==""){
		alerm("IP信息不能为空！");
		$("#ipaddr1").focus();
	}
	else{
		dat.idc=$("#IDClist").val();
		dat.note=$("#ol_note").val();
		// dat.ip2=$("#ipaddr2").val();
		// dat.ip3=$("#ipaddr3").val();
		// dat.ip4=$("#ipaddr4").val();
		// dat.ip5=$("#ipaddr5").val();
		// dat.ip6=$("#ipaddr6").val();

		var body = JSON.stringify(dat);
		var url="EAS/OnLine_Serv?asset_id="+$("#ol_asset_id").text()+"&user="+sessionStorage.usrfullname;				
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){					
					CloseForm('#form_online','#overlay');
					alerm("设备已上架");
					page_num=1;
					filt();
				}
				else alerm(resp.message)
			}
		});	
	}	
}
// 打开维修设备弹层
function maintenance(){
	if(tr_selected==null)alerm("请先选择要维修的设备。");
	else {
		var status=tr_selected.children().eq(5).text();
		if(status=='维修中')alerm("该设备已经在维修了！");
		else if(status=='使用中')alerm("该设备正在使用，请先下架！");
		else{
			$("#maint_asset_id").text(tr_selected.children().eq(0).text());
			$("#maint_type").text(tr_selected.children().eq(1).text());
			// 获取机房列表
			var url="EAS/ListSupplier?filter=&supplier_type=维修服务商&page_count=&page_num=";					
			TMS_api(url,"GET","",function(){
				if (xmlHttp.readyState==4 && xmlHttp.status==200){
					var resp = JSON.parse(xmlHttp.responseText);
					if(resp.code==200){
						$("#MAlist option").remove();
						for(var i=0;i<resp.supplier.length;i++){
							var line="<option>"+resp.supplier[i].supplier+"</option>";
							$("#MAlist").append(line);
						}
						open_form('#form_maintenance','#overlay');
					}
					else alerm(resp.message)
				}
			});			
		}
	}
}
// 维修设备
function device_fix(){
	var dat={};	
	dat.fixtime=$("#maint_time").val();
	dat.note=$("#maint_note").val();
	if(dat.fixtime==""){
		alerm("送修时间不能为空！");
		$("#maint_time").focus();
	}	
	else if(dat.note==""){
		alerm("送修说明不能为空！");
		$("#maint_note").focus();
	}
	else{
		dat.ma=$("#MAlist").val();
		var body = JSON.stringify(dat);
		var url="EAS/FixServ?asset_id="+$("#maint_asset_id").text()+"&user="+sessionStorage.usrfullname;					
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){				
					CloseForm('#form_maintenance','#overlay');
					alerm("设备已送修");
					page_num=1;
					filt();
				}
				else alerm(resp.message)
			}
		});	
	}
}
/*******************主函数****************/
$(document).ready(function(){ 
	tr_selected=null;
	page_sum=0;
	page_num=1;
	var old_bgcolor="";
	if(typeof(sessionStorage.customerId)=='undefined'){;
		sessionStorage.currpage="login.html";
		$("#main", parent.document).attr("src",sessionStorage.currpage);
	}
	//初始化页面
	load_device_list("");

	//选择或取消设备
	$("#tbody_server_list").click(function b(e){
		var tr=$(e.target).parent();
		if(tr_selected!=null)tr_selected.css("background-color",old_bgcolor);
		tr_selected=tr;
		old_bgcolor=tr.css("background-color");
		tr_selected.css("background-color","#E3F1F7");	
	});
	// 费用格式转换
	$("#price").change(function b(e){
		var pri=$("#price").val();
		pri=pri.replace("￥","");
		if(!checkfee(pri)){
			alerm("只支持包含最多两位小数的数字！");
		}
		else{
			$("#price").attr("data-value",pri);
			$("#price").val("￥"+rmb(pri));
		}
	});
	//弹层拖动
	$('#form_Servinfo_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_Servinfo').offset().left; 
		var abs_y = event.pageY - $('#form_Servinfo').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_Servinfo'); 
				var rel_left=event.pageX - abs_x;
				if(rel_left<0)rel_left=0;
				if(rel_left>1080)rel_left=1080;
				var rel_top=event.pageY - abs_y;
				if(rel_top<0)rel_top=0;
				if(rel_top>740)rel_top=740;
				obj.css({'left':rel_left, 'top':rel_top}); 
			} 
		}).mouseup( function () { 
			isMove = false; 
		}); 
	});
	$('#form_maintenance_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_maintenance').offset().left; 
		var abs_y = event.pageY - $('#form_maintenance').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_maintenance'); 
				var rel_left=event.pageX - abs_x;
				if(rel_left<0)rel_left=0;
				if(rel_left>1080)rel_left=1080;
				var rel_top=event.pageY - abs_y;
				if(rel_top<0)rel_top=0;
				if(rel_top>740)rel_top=740;
				obj.css({'left':rel_left, 'top':rel_top}); 
			} 
		}).mouseup( function () { 
			isMove = false; 
		}); 
	});
	$('#form_online_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_online').offset().left; 
		var abs_y = event.pageY - $('#form_online').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_online'); 
				var rel_left=event.pageX - abs_x;
				if(rel_left<0)rel_left=0;
				if(rel_left>1080)rel_left=1080;
				var rel_top=event.pageY - abs_y;
				if(rel_top<0)rel_top=0;
				if(rel_top>740)rel_top=740;
				obj.css({'left':rel_left, 'top':rel_top}); 
			} 
		}).mouseup( function () { 
			isMove = false; 
		}); 
	});
	$('#form_confirm_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_confirm').offset().left; 
		var abs_y = event.pageY - $('#form_confirm').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_confirm'); 
				var rel_left=event.pageX - abs_x;
				if(rel_left<0)rel_left=0;
				if(rel_left>1080)rel_left=1080;
				var rel_top=event.pageY - abs_y;
				if(rel_top<0)rel_top=0;
				if(rel_top>740)rel_top=740;
				obj.css({'left':rel_left, 'top':rel_top}); 
			} 
		}).mouseup( function () { 
			isMove = false; 
		}); 
	});
	$('#form_alerm_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_alerm').offset().left; 
		var abs_y = event.pageY - $('#form_alerm').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_alerm'); 
				var rel_left=event.pageX - abs_x;
				if(rel_left<0)rel_left=0;
				if(rel_left>1080)rel_left=1080;
				var rel_top=event.pageY - abs_y;
				if(rel_top<0)rel_top=0;
				if(rel_top>740)rel_top=740;
				obj.css({'left':rel_left, 'top':rel_top}); 
			} 
		}).mouseup( function () { 
			isMove = false; 
		}); 
	});
});