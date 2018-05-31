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
// 加载设备列表
function load_device_list(filter) {
	var item_ppnum=17;
	tr_selected=null
	if(filter=="")filter="filter=";
	var url="EAS/ListServ_ol?"+filter+"&page_count="+item_ppnum+"&page_num="+page_num;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				var bgcolor="a";
				$("#tbody_server_list tr").remove();
				for(var i=0;i<resp.Serv.length;i++){
					if(bgcolor=="")bgcolor='background-color:#F0ECF3;';
					else bgcolor="";
					var line='<tr style="'+bgcolor+'">';
					line=line+'<td>'+resp.Serv[i].idc+'</td>';
					line=line+'<td>'+resp.Serv[i].cabinet+'</td>';
					line=line+'<td>'+resp.Serv[i].layer+'</td>';
					line=line+'<td>'+resp.Serv[i].asset_id+'</td>';
					line=line+'<td>'+resp.Serv[i].type+'</td>';
					line=line+'<td>'+resp.Serv[i].model+'</td>';
					line=line+'<td>'+resp.Serv[i].ip1+'</td>';
					line=line+'<td>'+resp.Serv[i].capacity+'</td>';
					line=line+'<td>'+resp.Serv[i].os+'</td>';
					line=line+'<td>'+resp.Serv[i].status+'</td>';					
					line=line+'<td>'+resp.Serv[i].user+'</td>';
					line=line+'<td>'+resp.Serv[i].note+'</td>';
					line=line+'</tr>';
					
					$("#tbody_server_list").append(line);
				}				
				// 变更页码
				var item_sum=parseInt(resp.total_num);
				page_sum=Math.ceil(item_sum/item_ppnum);
				$("#page_num").text(page_sum);
				if(resp.Serv.length==0)page_num=0;
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
// 保存服务器
function Serv_save(){
	var asset_id=$("#asset_id").text();
	var serv={};
	serv.idc=$("#idc").val();
	serv.cabinet=$("#cabinet").val();
	serv.layer=$("#layer").val();	
	serv.ip1=$("#ipaddr1").val();	
	serv.os=$("#os").val();
	serv.user=$("#user").val();

	if(serv.cabinet==""){
		alerm("机柜信息不能为空！");
		$("#cabinet").focus();
	}
	else if(serv.layer==""){
		alerm("层号不能为空！");
		$("#layer").focus();
	}
	else if(serv.ip1==""){
		alerm("IP地址不能为空！");
		$("#ipaddr1").focus();
	}
	else if(serv.user==""){
		alerm("使用人不能为空！");
		$("#user").focus();
	}
	else{	
		serv.note=$("#note").val();	
		var body = JSON.stringify(serv);
		var url="EAS/UpdateServ_ol?asset_id="+asset_id+"&user="+sessionStorage.usrfullname;					
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){
					alerm("操作成功");	
					CloseForm("#Servinfo","#overlay");	
					page_num=1;			
					load_device_list("");
				}
				else alerm(resp.message)
			}
		});
	}
}
// 执行下架操作
function confirmTo(){
	var url="EAS/DownlineServ?asset_id="+tr_selected.children().eq(3).text()+"&user="+sessionStorage.usrfullname;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){
				alerm("设备已下架，可以到库房维护此设备！");
				page_num=1;
				load_device_list("");
			}
			else alerm(resp.message);
			CloseForm('#form_confirm','#overlay');
		}
	});		
}
// 下架设备
function downline(){
	if(tr_selected==null)alerm("请先选择要下架的设备。");
	else {
		$("#alertmess").html("请确认是否将设备下架？");
		open_form("#form_confirm","#overlay");
	}
}
// 维护设备
function maintenance(){
	if(tr_selected==null)alerm("请先选择要维护的设备。");
	else {
		
	}
}
// 打开编辑设备弹层
function editinfo(){
	if(tr_selected==null)alerm("请先选择要操作的设备。");
	else {
		// 获取机房列表
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
					$("#type").text(tr_selected.children().eq(4).text());
					$("#asset_id").text(tr_selected.children().eq(3).text());
					$("#idc").val(tr_selected.children().eq(0).text());
					$("#cabinet").val(tr_selected.children().eq(1).text());
					$("#layer").val(tr_selected.children().eq(2).text());
					$("#ipaddr1").val(tr_selected.children().eq(6).text());
					$("#note").val(tr_selected.children().eq(11).text());

					var url="SysCfg/ListDict?type=";
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
								open_form('#Servinfo','#overlay');
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
// 查找设备
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
	
	//弹层拖动
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
	$('#Servinfo_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#Servinfo').offset().left; 
		var abs_y = event.pageY - $('#Servinfo').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#Servinfo'); 
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