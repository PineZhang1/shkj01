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
	var url="EAS/ListServ_fix?"+filter+"&page_count="+item_ppnum+"&page_num="+page_num;
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
					
					line=line+'<td>'+serv[i].type+'</td>';
					line=line+'<td>'+serv[i].model+'</td>';
					line=line+'<td>'+serv[i].asset_id+'</td>';
					line=line+'<td>'+serv[i].series_num+'</td>';
					line=line+'<td>'+serv[i].ma+'</td>';
					line=line+'<td>'+serv[i].fixtime+'</td>';
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
// 设备维修结束
function ToConfirm(){
	var url="EAS/EndFixServ?asset_id="+tr_selected.children().eq(2).text();
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				CloseForm('#form_confirm','#overlay');
				alerm("设备已结束维修！");
				tr_selected=null;
				page_num=1;
				load_device_list("");					
			}
			else alerm(resp.message);
		}
	});
}
// 确认是否设备维修结束
function fixed(){
	if(tr_selected==null)alerm("请选择要结束维修的设备。");
	else open_form('#form_confirm','#overlay');
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
});