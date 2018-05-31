var xmlHttp;
var vm_selected;
var host_selected;
// 与后台传递API
function TMS_api(url,med,dats,cfunc){	
	var hostpath=getHostUrl('hostpath_api');	
	try{
		url=hostpath+url;
		xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange=cfunc;		
		xmlHttp.open(med,url,true);
		if(med=="GET")xmlHttp.send();
		else xmlHttp.send(dats);	
	}catch(e){
		alerm(e);
	}	
}
// 加载虚拟机列表
function load_VMs(host){
	//清除当前列表
	$("#tb_vmlist tr").remove();
	vm_selected=null;
	var url="EAS/GetVMServer?asset_id="+host;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				$("#asset_id").text(resp.asset_id);
				$("#ipaddr").text(resp.ipaddr);
				$("#vm_num").text(resp.vm_num);
				$("#locate").text(resp.locate);
				$("#cpu").text(resp.cpu);
				$("#cpu_used").text(resp.cpu_used);
				$("#cpu_usable").text(resp.cpu_usable);
				$("#cpu_rate_usage").text(resp.cpu_rate_usage);
				$("#mem").text(resp.mem);
				$("#mem_used").text(resp.mem_used);
				$("#mem_usable").text(resp.mem_usable);
				$("#mem_rate_usage").text(resp.mem_rate_usage);
				$("#disk").text(resp.disk);
				$("#disk_used").text(resp.disk_used);
				$("#disk_usable").text(resp.disk_usable);
				$("#disk_rate_usage").text(resp.disk_rate_usage);

				// 初始化主机资源图配置
				var seriers=[
					{
						name:'磁盘',
						radius:['10%','35%'],
						data:[
							{
								value:resp.disk_used,
								name:'已使用',
								itemStyle: {normal: {color: '#3F84AB'}}
							},
							{
								value:resp.disk_usable,
								name:'可用',
								itemStyle: {normal: {color: '#D6E6F0'}}
							}
						]
					},
					{
						name:'内存',
						radius:['55%','80%'],
						data:[
							{
								value:resp.mem_used,
								name:'已使用',
								itemStyle: {normal: {color: '#F2B721'}}
							},
							{
								value:resp.mem_usable,
								name:'可用',
								itemStyle: {normal: {color: '#FCEDCA'}}
							}
						]
					}
				];
				var legend={};
				ToPiechart('Chart_usage','',seriers,legend);
				for(var i=0;i<resp.vmlist.length;i++){			
					var tr0='<tr id="'+resp.vmlist[i].name+'">';				
					var td1='<td>'+resp.vmlist[i].id+'</td>';
					var td2='<td style="text-align: left;padding-left: 5px;">'+resp.vmlist[i].name+'</td>';
					var td3='<td>'+resp.vmlist[i].os+'</td>';
					var td4='<td>'+resp.vmlist[i].cpu+'</td>';
					var td5='<td>'+resp.vmlist[i].mem+'</td>';
					var td6='<td>'+resp.vmlist[i].disk+'</td>';
					var td7='<td>'+resp.vmlist[i].ip +'</td>';
					var td8='<td style="text-align: left;padding-left: 5px;">'+resp.vmlist[i].des+'</td>';
					var td9='<td>'+resp.vmlist[i].user+'</td>';			
					var tr1="</tr>";
					var record=tr0+td1+td2+td3+td4+td5+td6+td7+td8+td9+tr1;
					$("#tb_vmlist").append(record);					
				}
				if(resp.vmlist.length>11){
					var tree_height=190+resp.vmlist.length*25;
					$("#treebox").css("height",""+tree_height+"px");	
				}
			}
			else alerm(resp.message);
		}		
	});
}
// 加载主机列表，刷新主机资源状态图
function load_Servers() {
	var url="EAS/ListVMServ";
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				$("#treelist li").remove();
				$("#vm_host option").remove();
				var tao1='';
				var tag=0;
				var mid='';
				var host_1st="";   //标注第一台物理服务器
				for(var i=0;i<resp.hosts.length;i++){
					tao1=tao1+'<li><span class="folder">'+resp.hosts[i].idc+'</span>';
					var hosts=resp.hosts[i].host;
					var tao2='';
					for(var j=0;j<hosts.length;j++){
						if(j==0 && host_1st=="")host_1st=hosts[j].asset_id;
						tao2=tao2+'<li><span class="file" id="'+hosts[j].asset_id+'">'+hosts[j].ipaddr+'</span></li>';
						$("#vm_host").append('<option data-value="'+hosts[j].asset_id+'">'+hosts[j].ipaddr+'</option>');
					}
					if(tao2!="")tao2='<ul>'+tao2+'</ul>';
					tao1=tao1+tao2+'</li>';
				}
				$("#treelist").append(tao1);
				$("#treelist").treeview();	
				if(host_1st!=""){
					$("#"+host_1st).css("background-color","#E2F6CB");
					host_selected=host_1st;
					load_VMs(host_1st);	
				}
				else{
					$("#asset_id").text("");
					$("#ipaddr").text("");
					$("#vm_num").text("");
					$("#locate").text("");
					$("#cpu").text("");
					$("#cpu_used").text("");
					$("#cpu_usable").text("");
					$("#cpu_rate_usage").text("");
					$("#mem").text("");
					$("#mem_used").text("");
					$("#mem_usable").text("");
					$("#mem_rate_usage").text("");
					$("#disk").text("");
					$("#disk_used").text("");
					$("#disk_usable").text("");
					$("#disk_rate_usage").text("");
				}						
			}
			else alerm(resp.message);
		}
	});	
}
// 添加新服务器
function addServ(){
	var url="EAS/ListIDC?filter=&page_count=&page_num=";					
	TMS_api(url,"GET","",function(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){
				$("#popform_IDC option").remove();
				for(var i=0;i<resp.IDC.length;i++){
					var line="<option>"+resp.IDC[i].idc+"</option>";
					$("#popform_IDC").append(line);
				}

				url="EAS/ListServ_VM?idc="+resp.IDC[0].idc;
				TMS_api(url,"GET","",function a(){
					if (xmlHttp.readyState==4 && xmlHttp.status==200){
						var resp = JSON.parse(xmlHttp.responseText);
						if(resp.code==200){	
							$("#popform_host option").remove();
							for(var i=0;i<resp.Serv.length;i++){
								var line="<option data-value='"+resp.Serv[i].asset_id+"'>"+resp.Serv[i].ip1+"</option>";
								$("#popform_host").append(line);
							}
							$("#popform_IDC").attr("disabled",false);
							$("#popform_host").attr("disabled",false);
							$("#save_butt_serv").attr('data-value','AddVMServ');
							open_form('#Servinfo','#overlay');
						}
						else alerm(resp.message)
					}
				});				
			}	
			else alerm(resp.message)
		}
	});	
}
// 打开编辑服务器弹层
function editServ(){
	if($("#asset_id").text()=="")alerm("请先选择要操作的服务器。");
	else {
		var url="EAS/ListIDC?filter=&page_count=&page_num=";					
		TMS_api(url,"GET","",function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){
					$("#popform_IDC option").remove();
					for(var i=0;i<resp.IDC.length;i++){
						var line="<option>"+resp.IDC[i].idc+"</option>";
						$("#popform_IDC").append(line);
					}
					var IDC=$("#"+$("#asset_id").text()).parent().parent().prev().text();

					url="EAS/ListServ_VM?idc="+IDC;
					TMS_api(url,"GET","",function a(){
						if (xmlHttp.readyState==4 && xmlHttp.status==200){
							var resp = JSON.parse(xmlHttp.responseText);
							if(resp.code==200){	
								$("#popform_host option").remove();
								for(var i=0;i<resp.Serv.length;i++){
									var line="<option data-value='"+resp.Serv[i].asset_id+"'>"+resp.Serv[i].ip1+"</option>";
									$("#popform_host").append(line);
								}

								$("#popform_IDC").val(IDC);
								$("#popform_host").val($("#ipaddr").text());
								$("#popform_CPU").val($("#cpu").text());
								$("#popform_Mem").val($("#mem").text());
								$("#popform_Disk").val($("#disk").text());
								$("#popform_IDC").attr("disabled",true);
								$("#popform_host").attr("disabled",true);
								$("#save_butt_serv").attr('data-value','UpdateVMServ');
								open_form('#Servinfo','#overlay');
							}
							else alerm(resp.message)
						}
					});				
				}	
				else alerm(resp.message)
			}
		});
		
	}	
}
// 执行删除服务器或虚拟机
function confirmTo(){
	var opt=$("#butt_confirm").attr("data-value");
	if(opt=='DelVMServ'){
		var asset_id=$("#asset_id").text();
		var url="EAS/DelVMServ?asset_id="+asset_id+"&user="+sessionStorage.usrfullname;
		TMS_api(url,"GET","",function a(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){	
					alerm("服务器已移除！");
					CloseForm('#form_confirm','#overlay');
					load_Servers();					
				}
				else alerm(resp.message);
			}
		});
	}
	else{
		var vm_hostname=vm_selected.children().eq(1).text();
		var url="EAS/DelVM?name="+vm_hostname+"&user="+sessionStorage.usrfullname;
		TMS_api(url,"GET","",function a(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){	
					alerm("虚拟机已删除！");
					vm_selected=null;
					CloseForm('#form_confirm','#overlay');
					load_VMs($("#asset_id").text());					
				}
				else alerm(resp.message);
			}
		});
	}
}
// 删除服务器
function delServ(){
	var asset_id=$("#asset_id").text();
	if(asset_id=="")alerm("请先选择要操作的服务器。");
	else {
		$("#butt_confirm").attr("data-value","DelVMServ");
		$("#alertmess").text("请确认是否要删除服务器"+$("#ipaddr").text());
		open_form("#form_confirm","#overlay");
	}
}
// 删除虚拟机
function delVM(){
	if(vm_selected==null)alerm("请先选择要操作的虚拟机。");
	else {
		var vm_hostname=vm_selected.children().eq(1).text();
		$("#butt_confirm").attr("data-value","DelVM");
		$("#alertmess").text("请确认是否要删除虚拟机"+vm_hostname);
		open_form("#form_confirm","#overlay");
	}
}
// 保存服务器
function Serv_save(){
	var host={};	
	host.idc=$("#popform_IDC").val();	
	host.ipaddr=$("#popform_host").val();	
	host.cpu=$("#popform_CPU").val();
	host.mem=$("#popform_Mem").val();
	host.disk=$("#popform_Disk").val();	
	if(host.idc==""){
		alerm("机房不能为空！");
		$("#popform_IDC").focus();
	}
	else if(host.ipaddr==""){
		alerm("服务器不能为空！");
		$("#popform_host").focus();
	}
	else if(host.cpu==""){
		alerm("cpu数不能为空！");
		$("#popform_CPU").focus();
	}
	else if(host.mem==""){
		alerm("内存不能为空！");
		$("#popform_Mem").focus();
	}
	else if(host.disk==""){
		alerm("磁盘不能为空！");
		$("#popform_Disk").focus();
	}
	else{		
		host.asset_id=$("#popform_host option:selected").attr("data-value");
		var body = JSON.stringify(host);
		var opt=$("#save_butt_serv").attr('data-value');
		var url="EAS/"+opt+"?user="+sessionStorage.usrfullname;	
		if(opt=='AddVMServ'){
			TMS_api(url,"POST",body,function(){
				if (xmlHttp.readyState==4 && xmlHttp.status==200){
					var resp = JSON.parse(xmlHttp.responseText);
					if(resp.code==200){
						alerm("操作成功");	
						CloseForm("#Servinfo","#overlay");				
						load_Servers();
					}
					else alerm(resp.message)
				}
			});
		}
		else if(opt=='UpdateVMServ'){
			url=url+"&asset_id="+host.asset_id;
			var newcpu=parseInt(host.cpu);
			var newmem=parseInt(host.mem);
			var newdisk=parseInt(host.disk);
			if(newcpu<parseInt($("#cpu_used").text())){
				alerm("cpu数不能小于当前已用cpu！");
				$("#popform_CPU").focus();
			}
			else if(newmem<parseInt($("#mem_used").text())){
				alerm("内存数不能小于当前已用内存！");
				$("#popform_Mem").focus();
			}
			else if(newdisk<parseInt($("#disk_used").text())){
				alerm("磁盘数不能小于当前已用磁盘！");
				$("#popform_Disk").focus();
			}
			else{
				TMS_api(url,"POST",body,function(){
					if (xmlHttp.readyState==4 && xmlHttp.status==200){
						var resp = JSON.parse(xmlHttp.responseText);
						if(resp.code==200){
							alerm("操作成功");	
							CloseForm("#Servinfo","#overlay");				
							load_Servers();
						}
						else alerm(resp.message)
					}
				});
			}
		}	
	}
}
// 添加新虚拟机
function addVM(){
	if($("#vm_host").val()=='')alerm("当前集群没有用来增加虚拟机的服务器，请先添加物理服务器信息！");
	else{
		var url="SysCfg/ListDict?type=";
		TMS_api(url,"GET","",function a(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){	
					if(resp.os.length>0)$("#vm_os option").remove();
					for(var i=0;i<resp.os.length;i++){
						var line="<option>"+resp.os[i]+"</option>";
						$("#vm_os").append(line);
					}
					if(resp.dept_contractor.length>0)$("#vm_user option").remove();
					for(var i=0;i<resp.dept_contractor.length;i++){
						var line="<option>"+resp.dept_contractor[i]+"</option>";
						$("#vm_user").append(line);
					}
					$("#vm_host").attr("disabled","disabled");
					$("#save_butt").attr('data-value','AddVM');
					if($("#ipaddr").text()!="")$("#vm_host").val($("#ipaddr").text());
					open_form('#VMinfo','#overlay');
				}
				else alerm(resp.message);
			}
		});								
	}	
}
// 打开编辑虚拟机弹层
function editVM(){
	if(vm_selected==null)alerm("请先选择要操作的虚拟机。");
	else {
		var vm_name=vm_selected.children().eq(1).text();
		var vm_os=vm_selected.children().eq(2).text();
		var vm_cpu=vm_selected.children().eq(3).text();
		var vm_mem=vm_selected.children().eq(4).text();
		var vm_disk=vm_selected.children().eq(5).text();
		var vm_ip=vm_selected.children().eq(6).text();
		var vm_des=vm_selected.children().eq(7).text();
		var vm_user=vm_selected.children().eq(8).text();

		$("#vm_name").val(vm_name);		
		$("#vm_ip").val(vm_ip);
		$("#vm_cpu").val(vm_cpu);
		$("#vm_mem").val(vm_mem);
		$("#vm_disk").val(vm_disk);
		$("#vm_des").val(vm_des);
		$("#vm_host").val($("#ipaddr").text());

		var url="SysCfg/ListDict?type=";
		TMS_api(url,"GET","",function a(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){	
					if(resp.os.length>0)$("#vm_os option").remove();
					for(var i=0;i<resp.os.length;i++){
						var line="<option>"+resp.os[i]+"</option>";
						$("#vm_os").append(line);
					}
					if(resp.dept_contractor.length>0)$("#vm_user option").remove();
					for(var i=0;i<resp.dept_contractor.length;i++){
						var line="<option>"+resp.dept_contractor[i]+"</option>";
						$("#vm_user").append(line);
					}
					$("#vm_user").val(vm_user);
					$("#vm_os").val(vm_os);
					$("#vm_host").attr("disabled",false);
					$("#save_butt").attr('data-value','UpdateVM');
					open_form('#VMinfo','#overlay');
				}
				else alerm(resp.message);
			}
		});							
	}	
}
// 保存虚拟机
function VM_save(){
	var vm={};	
	vm.name=$("#vm_name").val();	
	vm.ip=$("#vm_ip").val();
	vm.cpu=$("#vm_cpu").val();
	vm.mem=$("#vm_mem").val();
	vm.disk=$("#vm_disk").val();
	vm.user=$("#vm_user").val();	
	if(vm.name==""){
		alerm("虚拟机名不能为空！");
		$("#vm_name").focus();
	}
	else if(vm.ip==""){
		alerm("IP地址不能为空！");
		$("#vm_ip").focus();
	}
	else if(vm.cpu==""){
		alerm("cpu数不能为空！");
		$("#vm_cpu").focus();
	}
	else if(vm.mem==""){
		alerm("内存不能为空！");
		$("#vm_mem").focus();
	}
	else if(vm.disk==""){
		alerm("磁盘不能为空！");
		$("#vm_disk").focus();
	}
	else if(vm.user==""){
		alerm("使用人不能为空！");
		$("#vm_user").focus();
	}
	else{
		vm.asset_id=$("#vm_host option:selected").attr("data-value");
		vm.os=$("#vm_os").val();
		vm.des=$("#vm_des").val();
		var body = JSON.stringify(vm);
		var opt=$("#save_butt").attr('data-value');
		if(opt=="AddVM"){
			var cpu_usable=parseInt($("#cpu_usable").text());
			var mem_usable=parseInt($("#mem_usable").text());
			var disk_usable=parseInt($("#disk_usable").text());
			if(parseInt(vm.cpu)>cpu_usable){
				alerm("剩余可用的CPU不足！");
				$("#vm_cpu").focus();
			}
			else if(parseInt(vm.mem)>mem_usable){
				alerm("剩余可用的内存不足！");
				$("#vm_mem").focus();
			}
			else if(parseInt(vm.disk)>disk_usable){
				alerm("剩余可用的磁盘不足！");
				$("#vm_disk").focus();
			}
			else{
				var url="EAS/AddVM?user="+sessionStorage.usrfullname+"&asset_id="+vm.asset_id;	
				TMS_api(url,"POST",body,function(){
					if (xmlHttp.readyState==4 && xmlHttp.status==200){
						var resp = JSON.parse(xmlHttp.responseText);
						if(resp.code==200){
							CloseForm("#VMinfo","#overlay");
							alerm("操作成功");											
							load_VMs($("#asset_id").text());
						}
						else alerm(resp.message)
					}
				});
			}
		}
		else if(opt=="UpdateVM"){
			var vm_name=vm_selected.children().eq(1).text()
			var url="EAS/UpdateVM?name="+vm_name+"&user="+sessionStorage.usrfullname;	
			TMS_api(url,"POST",body,function(){
				if (xmlHttp.readyState==4 && xmlHttp.status==200){
					var resp = JSON.parse(xmlHttp.responseText);
					if(resp.code==200){
						CloseForm("#VMinfo","#overlay");
						alerm("操作成功");											
						load_VMs($("#asset_id").text());
					}
					else alerm(resp.message)
				}
			});
		}
	}
}
// 快速查找虚机
function findVM(){
	var value=$("#filt_value").val();
	var key=$("#filt_key option:selected").attr("value");
	var url="EAS/FindVM?key="+key+"&value="+value;
	TMS_api(url,"GET","",function(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){
				$("#tbody_findvmlist tr").remove();
				for(var i=0;i<resp.vms.length;i++){
					var asset_id=resp.vms[i].asset_id;
					var idc=$("#"+asset_id).parent().parent().prev().text();
					var hostip=$("#"+asset_id).text();
					var td0="<tr><td>"+idc+"</td>";
					var td1="<td>"+hostip+"</td>";
					var td2="<td>"+resp.vms[i].name+"</td>";
					var td3="<td>"+resp.vms[i].ip+"</td>";
					var td4="<td>"+resp.vms[i].os+"</td>";
					var td5="<td>"+resp.vms[i].cpu+"</td>";
					var td6="<td>"+resp.vms[i].mem+"</td>";
					var td7="<td>"+resp.vms[i].disk+"</td>";
					var td8="<td>"+resp.vms[i].user+"</td></tr>";
					$("#tbody_findvmlist").append(td0+td1+td2+td3+td4+td5+td6+td7+td8);
				}
				$("#findvm_nuum").text("共检索到"+resp.vms.length+"个结果。");
				open_form("#form_findvm","#overlay");
			}
			else alerm(resp.message)
		}
	});		

}
/*******************主函数****************/
$(document).ready(function(){ 
	vm_selected=null;
	host_selected="";
	if(typeof(sessionStorage.customerId)=='undefined'){;
		sessionStorage.currpage="login.html";
		$("#main", parent.document).attr("src",sessionStorage.currpage);
	}
	//初始化页面
	load_Servers();

	//树型视图下选择服务器
	$("#treelist").click(function (e){
		if($(e.target).attr('class')=="file"){
			var new_hostname=$(e.target).attr("id");
			if(host_selected!=new_hostname){
				$("#"+host_selected).css("background-color","#FFFFFF");
				$(e.target).css("background-color","#E2F6CB");
				host_selected=new_hostname;
			}
			load_VMs(host_selected);	
		}
	});
		
	// 选择虚拟机
	$("#tb_vmlist").click(function (e){
		var tr=$(e.target).parent();
		if(vm_selected!=null)vm_selected.css("background-color",old_bgcolor);
		vm_selected=tr;
		old_bgcolor=tr.css("background-color");
		vm_selected.css("background-color","#E3F1F7");	
	});

	// 添加主机时切换机房导致从新获取服务器列表
	$("#popform_IDC").change(function (e){
		var IDC=$("#popform_IDC").val();
		url="EAS/ListServ_VM?idc="+IDC;
		TMS_api(url,"GET","",function a(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){	
					$("#popform_host option").remove();
					for(var i=0;i<resp.Serv.length;i++){
						var line="<option data-value='"+resp.Serv[i].asset_id+"'>"+resp.Serv[i].ip1+"</option>";
						$("#popform_host").append(line);
					}
				}
				else alerm(resp.message)
			}
		});				
	});

	//弹层拖动
	$('#VMinfo_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#VMinfo').offset().left; 
		var abs_y = event.pageY - $('#VMinfo').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#VMinfo'); 
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
	$('#form_findvm_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_findvm').offset().left; 
		var abs_y = event.pageY - $('#form_findvm').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_findvm'); 
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