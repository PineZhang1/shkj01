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
// 加载机房列表
function Load_idc(){
	var url="EAS/ListIDC?filter=&page_count=&page_num=";					
	TMS_api(url,"GET","",function(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){
				$("#idc option").remove();
				for(var i=0;i<resp.IDC.length;i++){
					var line="<option>"+resp.IDC[i].idc+"</option>";
					$("#idc").append(line);
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
	var url="EAS/ListIP?"+filter+"&type=public"+"&page_count="+item_ppnum+"&page_num="+page_num;
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
					line=line+'<td>'+IP[i].status+'</td>';					
					line=line+'<td>'+IP[i].operator+'</td>';
					line=line+'<td>'+IP[i].leaseterm +'</td>';
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
// 执行删除IP
function confirmTo(){
	var url="EAS/DelIP?type=Public&ip="+tr_selected.children().eq(3).text()+"&idc="+tr_selected.children().eq(0).text();
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){					
				CloseForm('#form_confirm','#overlay');
				alerm("删除成功！");
				tr_selected=null;
				page_num=1;
				Load_IP_list("");					
			}
			else alerm(resp.message);
		}
	});
}
// 确认是否删除IP
function delIP(){
	if(tr_selected==null)alerm("请先选择要删除的IP");
	else {
		var status=tr_selected.children().eq(4).text();
		if(status=='使用中')alerm("该IP正在使用中，不能删除！");
		else open_form("#form_confirm","#overlay");
	}
}
// 添加新IP
function AddIP(){
	if($("#network").val()==""){
		alerm("网络不能为空！");
		$("#network").focus();
	}
	else if($("#mask").val()==""){
		alerm("网络掩码不能为空！");
		$("#mask").focus();
	}
	else if($("#gateway").val()==""){
		alerm("网关地址不能为空！");
		$("#gateway").focus();
	}
	else if($("#leaseterm").val()==""){
		alerm("租赁到期日不能为空！");
		$("#leaseterm").focus();
	}
	else{
		var IP={};	
		IP.network=$("#network").val()+"/"+$("#mask").val();
		IP.gateway=$("#gateway").val();
		IP.leaseterm=$("#leaseterm").val();	
		IP.operator=$("#operator").val();
		var body = JSON.stringify(IP);
		var ip=$("#ip").val();
		var idc=$("#idc").val();
		var url="EAS/AddIP?type=public&idc="+idc+"&ip="+ip;					
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){					
					CloseForm("#form_ip","#overlay");
					alerm("操作成功");		
					page_num=1;			
					Load_IP_list("");
				}
				else alerm(resp.message)
			}
		});
	}
}
// 打开编辑IP信息弹层
function editIP(){
	if(tr_selected==null)alerm("请先选择要编辑的IP");
	else {
		$("#idc1").text(tr_selected.children().eq(0).text());
		$("#ip1").text(tr_selected.children().eq(3).text());
		$("#operator1").text(tr_selected.children().eq(5).text());
		$("#leaseterm1").val(tr_selected.children().eq(6).text());
		$("#note1").val(tr_selected.children().eq(9).text());
		open_form("#form_ip_edit","#overlay");
	}
}
// 保存编辑后的IP信息
function UpdateIP(){
	if($("#leaseterm1").val()==""){
		alerm("租赁到期日不能为空！");
		$("#leaseterm1").focus();
	}
	else{
		var IP={};	
		IP.leaseterm=$("#leaseterm1").val();
		IP.note=$("#note1").val();
		var body = JSON.stringify(IP);
		
		var url="EAS/UpdateIP?type=public&idc="+$("#idc1").text()+"&ip="+$("#ip1").text();					
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){					
					CloseForm("#form_ip_edit","#overlay");	
					alerm("操作成功");	
					page_num=1;					
					Load_IP_list("");
				}
				else alerm(resp.message)
			}
		});
	}
}
// 查找IP
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