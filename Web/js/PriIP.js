var xmlHttp;
var tr_selected;
var page_num;
var page_sum;
// 与后台传递API
function TMS_api(url,med,dats,cfunc){	
	var hostpath=getHostUrl();	
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
// 加载网络列表
function Load_netlist(){
	var idc=$("#idc").val();
	var url="EAS/ListNet?idc="+idc;					
	TMS_api(url,"GET","",function(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){
				$("#network option").remove();
				for(var i=0;i<resp.nets.length;i++){
					var line="<option data-value='"+resp.nets[i].gateway+"'>"+resp.nets[i].network+"</option>";
					$("#network").append(line);
				}
			}
			else alerm(resp.message)
		}
	});		
}
// 加载机房列表
function Load_idc(){
	var url="EAS/ListIDC?filter=&page_count=&page_num=";					
	TMS_api(url,"GET","",function(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){
				$("#idc option").remove();
				$("#idc2 option").remove();
				for(var i=0;i<resp.IDC.length;i++){
					var line="<option>"+resp.IDC[i].idc+"</option>";
					$("#idc").append(line);
					$("#idc2").append(line);
				}
			}
			else alerm(resp.message)
		}
	});		
}
// 加载IP列表
function Load_IP_list(filter) {
	var item_ppnum=17;
	if(filter=="")filter="filter=";
	var url="EAS/ListIP?"+filter+"&type=private"+"&page_count="+item_ppnum+"&page_num="+page_num;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				var bgcolor="a";
				$("#tbody_IP_list tr").remove();
				tr_selected=null;
				var IP=resp.IPs;
				for(var i=0;i<IP.length;i++){
					if(bgcolor=="")bgcolor='background-color:#F0ECF3;';
					else bgcolor="";
					if(IP[i].status=='使用中')bgcolor=bgcolor+"color:#6E6E6E;";
					else bgcolor="";
					var line='<tr style="'+bgcolor+'">';
					line=line+'<td>'+IP[i].idc+'</td>';
					line=line+'<td>'+IP[i].network+'</td>';
					line=line+'<td>'+IP[i].gateway+'</td>';
					line=line+'<td>'+IP[i].ip+'</td>';
					line=line+'<td>'+IP[i].NatIP+'</td>';
					line=line+'<td>'+IP[i].status+'</td>';										
					line=line+'<td>'+IP[i].asset_id+'</td>';
					line=line+'<td>'+IP[i].user+'</td>';
					line=line+'<td>'+IP[i].note+'</td>';
					line=line+'</tr>';					
					$("#tbody_IP_list").append(line);
				}	
				// 变更页码
				var item_sum=parseInt(resp.total_num);
				page_sum=Math.ceil(item_sum/item_ppnum);
				$("#page_num").text(page_sum);
				if(IP.length==0)page_num=0;
				$("#curr_page").text(page_num);
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

				// 加载机房列表
				Load_idc();				
			}
			else alerm(resp.message);
		}
	});	
}
// 过滤器
function filt(){
	var fts="";
	var filter=$("#filt_value").val();
	var phase=$("#filt_key option:selected").attr("value");
	if(filter!="")fts="filter="+phase+" like '*"+filter+"*'";
	Load_IP_list(fts);
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
// 执行删除IP或网络
function confirmTo(){
	CloseForm('#form_confirm','#overlay');
	open_form('#wait','#overlay');
	var opt=$("#butt_confirm").attr("data-value");
	var url="EAS/DelIP?type=private&ip="+tr_selected.children().eq(3).text()+"&idc="+tr_selected.children().eq(0).text();
	if(opt=='DelNet')url="EAS/DelNet?net="+tr_selected.children().eq(1).text()+"&idc="+tr_selected.children().eq(0).text();
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){					
				tr_selected=null;				
				CloseForm('#wait','#overlay');
				alerm("删除成功！");
				filt();					
			}
			else {
				CloseForm('#wait','#overlay');
				alerm(resp.message);
			}
		}
	});
}
// 确认是否删除IP
function delIP(){
	if(tr_selected==null)alerm("请先选择要删除的IP");
	else {
		var status=tr_selected.children().eq(5).text();
		if(status=='使用中')alerm("该IP正在使用中，不能删除！");
		else{
			$("#butt_confirm").attr("data-value","DelIP");
			$("#confirm_mess").text("确定要删除该IP地址吗？");
			open_form("#form_confirm","#overlay");
		}		
	}
}
// 确认是否删除网络
function delNet(){
	if(tr_selected==null)alerm("请先选择要删除的网络中的任一IP");
	else {
		var status=tr_selected.children().eq(5).text();
		if(status=='使用中')alerm("该网络正在使用中，不能删除！");
		else{
			$("#butt_confirm").attr("data-value","DelNet");
			$("#confirm_mess").text("确定要删除该网段吗？");
			open_form("#form_confirm","#overlay");
		}
	}
}
// 打开添加新IP弹层
function AppendIP(){
	open_form("#form_ip","#overlay");
	Load_netlist();
}
// 添加新IP
function AddIP(){
	var ip=$("#ip").val();
	var idc=$("#idc").val();
	if(ip==""){
		alerm("IP不能为空！");
		$("#ip").focus();
	}
	else{ 
		var IP={};	
		IP.network=$("#network").val();
		IP.gateway=$("#network option:selected").attr("data-value");
		var body = JSON.stringify(IP);		
		var url="EAS/AddIP?type=private&idc="+idc+"&ip="+ip;					
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){					
					CloseForm("#form_ip","#overlay");	
					alerm("操作成功");	
					page_num=1;		
					$("#filt_value").val("");	
					Load_IP_list("");
				}
				else alerm(resp.message)
			}
		});
	}
}
// 添加新网络
function AddNet(){
	var idc=$("#idc2").val();
	var network=$("#network2").val();
	var mask=$("#mask").val();
	if(net==""){
		alerm("网络不能为空！");
		$("#network2").focus();
	}
	else if(mask==""){
		alerm("子网掩码不能为空！");
		$("#mask").focus();
	}
	else if(isNaN(mask)){
		alerm("子网掩码必须为小于32的整数！");
		$("#mask").focus();
	}
	else if(parseInt(mask)<22){
		alerm("不支持子网掩码小于22的网络！");
		$("#mask").focus();
	}
	else if(parseInt(mask)>32){
		alerm("子网掩码必须为小于32的整数！");
		$("#mask").focus();
	}
	else if($("#gateway").val()==""){
		alerm("网关地址不能为空！");
		$("#gateway").focus();
	}
	else{ 
		CloseForm("#form_net","#overlay");	
		open_form('#wait','#overlay');
		var net={};	
		net.gateway=$("#gateway").val();
		var body = JSON.stringify(net);		
		var url="EAS/AddNet?idc="+idc+"&net="+network+"/"+mask;					
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){					
					CloseForm("#wait","#overlay");	
					alerm("操作成功");	
					page_num=1;			
					$("#filt_value").val("");
					Load_IP_list("");
				}
				else {				
					CloseForm('#wait','#overlay');
					alerm(resp.message);
				}
			}
		});
	}
}
// 打开编辑IP信息弹层
function editIP(){
	if(tr_selected==null)alerm("请先选择要编辑的IP");
	else {
		var asset_id=tr_selected.children().eq(6).text();
		if(asset_id!='')$("#status1").attr("disabled",true);
		else $("#status1").attr("disabled",false);

		$("#idc1").text(tr_selected.children().eq(0).text());
		$("#ip1").text(tr_selected.children().eq(3).text());
		$("#status1").val(tr_selected.children().eq(5).text());
		$("#natip1").val(tr_selected.children().eq(4).text());
		$("#note1").val(tr_selected.children().eq(8).text());
		var url="SysCfg/ListDict?type=dept_contractor";
		TMS_api(url,"GET","",function a(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){	
					if(resp.dept_contractor.length>0)$("#user1 option").remove();
					for(var i=0;i<resp.dept_contractor.length;i++){
						var line="<option>"+resp.dept_contractor[i]+"</option>";
						$("#user1").append(line);
					}
					$("#user1").val(tr_selected.children().eq(7).text());
					open_form("#form_ip_edit","#overlay");
				}
				else alerm(resp.message);
			}
		});		
	}
}
// 保存编辑后的IP信息
function UpdateIP(){
	var IP={};	
	IP.status=$("#status1").val();
	IP.NatIP=$("#natip1").val();
	IP.user=$("#user1").val();
	IP.note=$("#note1").val();
	var body = JSON.stringify(IP);
	
	var url="EAS/UpdateIP?type=private&idc="+$("#idc1").text()+"&ip="+$("#ip1").text();					
	TMS_api(url,"POST",body,function(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){				
				CloseForm("#form_ip_edit","#overlay");
				alerm("操作成功");	
				page_num=1;
				filt();
			}
			else alerm(resp.message)
		}
	});
}
/*******************主函数****************/
$(document).ready(function(){ 
	page_sum=0;
	page_num=1;
	vm_selected=null;
	if(typeof(sessionStorage.customerId)=='undefined'){;
		sessionStorage.currpage="login.html";
		$("#main", parent.document).attr("src",sessionStorage.currpage);
	}
	//初始化页面
	Load_IP_list("");

	//选择或取消IP
	$("#tbody_IP_list").click(function b(e){
		var tr=$(e.target).parent();
		if(tr_selected!=null)tr_selected.css("background-color",old_bgcolor);
		tr_selected=tr;
		old_bgcolor=tr.css("background-color");
		tr_selected.css("background-color","#E3F1F7");	
	});
	// 新增IP弹层——机房切换时更新网络列表
	$("#idc").change(function b(e){
		Load_netlist();
	});
	//弹层拖动
	$('#form_ip_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_ip').offset().left; 
		var abs_y = event.pageY - $('#form_ip').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_ip'); 
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
	$('#form_ip_edit_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_ip_edit').offset().left; 
		var abs_y = event.pageY - $('#form_ip_edit').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_ip_edit'); 
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
	$('#form_net_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_net').offset().left; 
		var abs_y = event.pageY - $('#form_net').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_net'); 
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
});