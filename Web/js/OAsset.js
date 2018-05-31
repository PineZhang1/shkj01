var xmlHttp;
var tr_selected;
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
// 加载零配件列表
function Load_Part_list() {
	var url="VMM/ListServ";
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				
				for(var i=0;i<resp.domain.length;i++){
					tao1=tao1+'<li><span class="folder">'+resp.domain[i].name+'</span>';
					var hosts=resp.domain[i].hosts;
					var tao2='';
					for(var j=0;j<hosts.length;j++){
						if(j==0 && host_selected=="")host_selected=hosts[j].hostname;
						tao2=tao2+'<li><span class="file" id="'+hosts[j].hostname+'">'+hosts[j].hostname+'</span></li>';
						seriers[0].data[0].value=hosts[j].disk_used;
						seriers[0].data[1].value=hosts[j].disk_usable;
						seriers[1].data[0].value=hosts[j].mem_used;
						seriers[1].data[1].value=hosts[j].mem_usable;
						$("#title_chart_vm"+(j+1)).text(hosts[j].hostname);
						ToPiechart('Chart_usage_vm'+(j+1),'',seriers,legend);

						$("#vm_host").append('<option>'+hosts[j].hostname+'</option>');
					}
					if(tao2!="")tao2='<ul>'+tao2+'</ul>';
					tao1=tao1+tao2+'</li>';
				}						
			}
			else alerm(resp.message);
		}
	});	
}
// 添加新配件
function AddPart(){
	open_form('#partinfo','#overlay');
}
// 打开编辑弹层
function EditPart(){
	if(tr_selected=="")alerm("请先选择要操作的项目。");
	else {
		$("#popform_hostname").val($("#hostname").text());
		$("#popform_model").val($("#model").text());
		$("#popform_ipaddr").val($("#ipaddr").text());
		$("#popform_locate").val($("#locate").text());
		$("#popform_sn").val($("#sn").text());
		$("#popform_asset_sn").val($("#asset_sn").text());
		$("#popform_cpu").val($("#cpu").text());
		$("#popform_mem").val($("#mem").text());
		$("#popform_disk").val($("#disk").text());

		$("#save_butt_serv").attr('data-value','UpdateServ');
		open_form('#partinfo','#overlay');
	}	
}
// 删除配件
function DelPart(){
	if(tr_selected=="")alerm("请先选择要操作的项目。");
	else {
		if(confirm("请确认是否要删除该项目"+tr_selected)){
			var url="VMM/DelServ?hostname="+tr_selected;
			TMS_api(url,"GET","",function a(){
				if (xmlHttp.readyState==4 && xmlHttp.status==200){
					var resp = JSON.parse(xmlHttp.responseText);
					if(resp.code==200){	
						alerm("项目已删除！");
						tr_selected="";
						Load_Part_list();					
					}
					else alerm(resp.message);
				}
			});
		}
	}
}
// 保存配件信息
function Part_save(){
	var part={};	
	part.hostname=$("#popform_hostname").val();	
	part.ipaddr=$("#popform_ipaddr").val();	
	part.cpu=$("#popform_cpu").val();
	part.mem=$("#popform_mem").val();
	part.disk=$("#popform_disk").val();	
	if(host.hostname==""){
		alerm("服务器名不能为空！");
		$("#popform_hostname").focus();
	}
	else if(host.ipaddr==""){
		alerm("IP地址不能为空！");
		$("#popform_ipaddr").focus();
	}
	else if(host.cpu==""){
		alerm("cpu数不能为空！");
		$("#popform_cpu").focus();
	}
	else if(host.mem==""){
		alerm("内存不能为空！");
		$("#popform_mem").focus();
	}
	else if(host.disk==""){
		alerm("磁盘不能为空！");
		$("#popform_disk").focus();
	}
	else{
		host.model=$("#popform_model").val();
		host.locate=$("#popform_locate").val();
		host.sn=$("#popform_sn").val();
		host.asset_sn=$("#popform_asset_sn").val();
		
		var body = JSON.stringify(host);
		var url="VMM/"+$("#save_butt_serv").attr('data-value')+"?hostname="+host_selected;						
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
/*******************主函数****************/
$(document).ready(function(){ 
	tr_selected=null;
	// if(typeof(sessionStorage.customerId)=='undefined'){;
	// 	sessionStorage.currpage="login.html";
	// 	$("#main", parent.document).attr("src",sessionStorage.currpage);
	// }
	//初始化页面
	Load_Part_list();

	//弹层拖动
	$('#partinfo_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#partinfo').offset().left; 
		var abs_y = event.pageY - $('#partinfo').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#partinfo'); 
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