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
// 加载服务列表
function Load_Service_list(filter) {
	var item_ppnum=17;
	if(filter=="")filter="filter=";
	var url="EAS/ListService?"+filter+"&page_count="+item_ppnum+"&page_num="+page_num;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				var bgcolor="a";
				$("#tbody_Service_list tr").remove();
				tr_selected=null;
				var service=resp.service;
				for(var i=0;i<service.length;i++){
					if(bgcolor=="")bgcolor='background-color:#F0ECF3;';
					else bgcolor="";
					if(service[i].status=='停用')bgcolor=bgcolor+"color:#6E6E6E;";
					else if(service[i].status=='待续费')bgcolor=bgcolor+"color:#F61335;";
					var line='<tr style="'+bgcolor+'">';
					line=line+'<td>'+service[i].service_id+'</td>';
					line=line+'<td>'+service[i].service+'</td>';
					line=line+'<td>'+service[i].manufacturer+'</td>';
					line=line+'<td data-value="'+service[i].price+'">￥'+rmb(service[i].price)+'</td>';
					line=line+'<td>'+service[i].buy_time+'</td>';					
					line=line+'<td>'+service[i].protect_time+'</td>';
					line=line+'<td>'+service[i].status+'</td>';
					line=line+'<td>'+service[i].user+'</td>';
					line=line+'<td>'+service[i].purpose+'</td>';
					line=line+'<td>'+service[i].note+'</td>';
					line=line+'</tr>';					
					$("#tbody_Service_list").append(line);
				}	
				// 变更页码
				var item_sum=parseInt(resp.total_num);
				page_sum=Math.ceil(item_sum/item_ppnum);
				$("#page_num").text(page_sum);
				if(service.length==0)page_num=0;
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
			}
			else alerm(resp.message);
		}
	});	
}
// 添加新服务
function AddService(){
	$("#service_id").text("");
	var url="SysCfg/ListDict?type=dept_contractor";
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				if(resp.dept_contractor.length>0)$("#user option").remove();
				for(var i=0;i<resp.dept_contractor.length;i++){
					var line="<option>"+resp.dept_contractor[i]+"</option>";
					$("#user").append(line);
				}
				$("#butt_save").attr('data-value','AddService');
				open_form('#form_Service','#overlay');
			}
			else alerm(resp.message);
		}
	});
}
// 打开编辑弹层
function EditService(){
	if(tr_selected==null)alerm("请先选择要编辑的服务。");
	else {
		$("#service_id").text(tr_selected.children().eq(0).text());
		$("#service").val(tr_selected.children().eq(1).text());
		$("#manufacturer").val(tr_selected.children().eq(2).text());
		$("#price").val(tr_selected.children().eq(3).text());
		$("#price").attr("data-value",tr_selected.children().eq(3).attr("data-value"));
		$("#buy_time").val(tr_selected.children().eq(4).text());
		$("#protect_time").val(tr_selected.children().eq(5).text());
		$("#status").val(tr_selected.children().eq(6).text());		
		$("#purpose").val(tr_selected.children().eq(8).text());
		$("#note").val(tr_selected.children().eq(9).text());
		var url="SysCfg/ListDict?type=dept_contractor";
		TMS_api(url,"GET","",function a(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){	
					if(resp.dept_contractor.length>0)$("#user option").remove();
					for(var i=0;i<resp.dept_contractor.length;i++){
						var line="<option>"+resp.dept_contractor[i]+"</option>";
						$("#user").append(line);
					}
					$("#user").val(tr_selected.children().eq(7).text());
					$("#butt_save").attr('data-value','UpdateService');
					open_form('#form_Service','#overlay');
				}
				else alerm(resp.message);
			}
		});		
	}	
}
// 执行删除服务
function confirmTo(){
	var url="EAS/DelService?service_id="+tr_selected.children().eq(0).text()+"&user="+sessionStorage.usrfullname;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				alerm("删除成功！");
				tr_selected=null;
				CloseForm('#form_confirm','#overlay');
				page_num=1;
				Load_Service_list("");					
			}
			else alerm(resp.message);
		}
	});
}
// 确认是否删除服务
function DelService(){
	if(tr_selected==null)alerm("请先选择要删除的服务。");
	else open_form("#form_confirm","#overlay");
}
// 保存服务信息
function Service_save(){
	var service={};	
	service_id=$("#service_id").text();	

	service.service=$("#service").val();	
	service.manufacturer=$("#manufacturer").val();	
	service.price=$("#price").attr("data-value");	
	service.buy_time=$("#buy_time").val();	
	service.protect_time=$("#protect_time").val();			
	service.user=$("#user").val();	
	service.purpose=$("#purpose").val();	
	var opt=$("#butt_save").attr('data-value');
	if(opt=='UpdateService' && service_id==""){
		alerm("服务编号不能为空！");
		$("#service_id").focus();
	}	
	else if(service.service==""){
		alerm("服务不能为空！");
		$("#service").focus();
	}
	else if(service.manufacturer==""){
		alerm("服务厂商不能为空！");
		$("#manufacturer").focus();
	}
	else if(service.price==""){
		alerm("服务价格不能为空！");
		$("#price").focus();
	}
	else if(service.buy_time==""){
		alerm("服务采购时间不能为空！");
		$("#buy_time").focus();
	}
	else if(service.protect_time==""){
		alerm("服务过保时间不能为空！");
		$("#protect_time").focus();
	}
	else if(service.user==""){
		alerm("服务使用人不能为空！");
		$("#user").focus();
	}
	else if(service.purpose==""){
		alerm("服务用途不能为空！");
		$("#purpose").focus();
	}
	else{
		service.status=$("#status").val();
		service.note=$("#note").val();
		var body = JSON.stringify(service);
		
		var url="EAS/"+opt;
		if(opt=='UpdateService')url=url+"?service_id="+service_id+"&user="+sessionStorage.usrfullname;
		else if(opt=='AddService')url=url+"?service="+service.service+"&manufacturer="+service.manufacturer+"&user="+sessionStorage.usrfullname;						
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){
					alerm("操作成功");	
					CloseForm("#form_Service","#overlay");		
					page_num=1;		
					Load_Service_list("");
				}
				else alerm(resp.message)
			}
		});
	}
}
// 查找测试集
function filt(){
	var fts="";
	var filter=$("#filt_value").val();
	var phase=$("#filt_key option:selected").attr("value");
	if(filter!="")fts="filter="+phase+" like '*"+filter+"*'";
	Load_Service_list(fts);
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
	Load_Service_list("");
	//选择或取消服务商
	$("#tbody_Service_list").click(function b(e){
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
	$('#form_Service_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_Service').offset().left; 
		var abs_y = event.pageY - $('#form_Service').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_Service'); 
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