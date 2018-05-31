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
// 加载零配件列表
function Load_Part_list(filter) {
	var item_ppnum=17;
	if(filter=="")filter="filter=";
	var url="EAS/ListPart?"+filter+"&page_count="+item_ppnum+"&page_num="+page_num;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				var bgcolor="a";
				$("#tbody_part_list tr").remove();
				tr_selected=null;
				var part=resp.parts;
				for(var i=0;i<part.length;i++){
					if(bgcolor=="")bgcolor='background-color:#F0ECF3;';
					else bgcolor="";
					var line='<tr style="'+bgcolor+'" id="'+part[i].asset_id+'">';
					line=line+'<td>'+part[i].type+'</td>';
					line=line+'<td>'+part[i].model+'</td>';
					line=line+'<td>'+part[i].asset_id+'</td>';
					line=line+'<td>'+part[i].series_num+'</td>';
					line=line+'<td>'+part[i].capacity+'</td>';
					line=line+'<td>'+part[i].status+'</td>';
					line=line+'<td>'+part[i].serv+'</td>';
					var pt=part[i].protect_time;
					if(pt=='0001-01-01')pt="";
					line=line+'<td>'+pt+'</td>';
					line=line+'<td data-value="'+part[i].price+'">￥'+rmb(part[i].price)+'</td>';
					line=line+'<td>'+part[i].note+'</td>';
					line=line+'</tr>';					
					$("#tbody_part_list").append(line);
				}	
				// 变更页码
				var item_sum=parseInt(resp.total_num);
				$("#List_sum").text(resp.total_num);
				page_sum=Math.ceil(item_sum/item_ppnum);
				$("#page_num").text(page_sum);
				if(part.length==0)page_num=0;
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
// 查找测试集
function filt(){
	var fts="";
	var filter=$("#filt_value").val();
	var phase=$("#filt_key option:selected").attr("value");
	if(filter!="")fts="filter="+phase+" like '*"+filter+"*'";
	Load_Part_list(fts);
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
// 添加新配件
function AddPart(){
	$("#butt_save").attr("data-value","AddPart");
	$("#asset_id").attr("disabled",false);
	$("#tr_status").hide();
	$("#tr_device_asset_id").hide();
	var old_type=$("#type").val();
	var url="SysCfg/ListDict?type=part_type";
		TMS_api(url,"GET","",function a(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){	
					$("#type option").remove();
					for(var i=0;i<resp.part_type.length;i++){
						var line="<option>"+resp.part_type[i]+"</option>";
						$("#type").append(line);
					}
					open_form('#form_part','#overlay');		
					if(old_type!="" && old_type!=null)	$("#type").val(old_type);					
				}
				else alerm(resp.message);
			}
		});	
}
// 打开编辑弹层
function EditPart(){
	if(tr_selected==null)alerm("请先选择要编辑的零配件。");
	else {
		$("#model").val(tr_selected.children().eq(1).text());
		$("#asset_id").val(tr_selected.children().eq(2).text());
		$("#series_num").val(tr_selected.children().eq(3).text());
		$("#capacity").val(tr_selected.children().eq(4).text());
		$("#status").val(tr_selected.children().eq(5).text());
		$("#protect_time").val(tr_selected.children().eq(7).text());
		$("#price").val(tr_selected.children().eq(8).text());
		$("#price").attr("data-value",tr_selected.children().eq(8).attr("data-value"));
		$("#note").val(tr_selected.children().eq(9).text());
		$("#device_asset_id").val(tr_selected.children().eq(6).text());
		$("#butt_save").attr('data-value','UpdatePart');
		$("#asset_id").attr("disabled",true);
		$("#tr_status").show();
		$("#tr_device_asset_id").show();
		var url="SysCfg/ListDict?type=part_type";
		TMS_api(url,"GET","",function a(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){	
					$("#type option").remove();
					for(var i=0;i<resp.part_type.length;i++){
						var line="<option>"+resp.part_type[i]+"</option>";
						$("#type").append(line);
					}
					open_form('#form_part','#overlay');		
					$("#type").val(tr_selected.children().eq(0).text());						
				}
				else alerm(resp.message);
			}
		});	
		
	}	
}
// 执行删除配件
function confirmTo(){
	var url="EAS/DelPart?asset_id="+tr_selected.children().eq(2).text();
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){					
				tr_selected=null;
				CloseForm('#form_confirm','#overlay');
				alerm("删除成功！");
				page_num=1;
				filt();					
			}
			else alerm(resp.message);
		}
	});
}
// 确认是否删除配件
function DelPart(){
	if(tr_selected==null)alerm("请先选择要删除的零配件。");
	else {
		$("#alertmess").text("请确认是否删除该零配件？");
		open_form("#form_confirm","#overlay");
	}
}
// 保存配件信息
function Part_save(){
	var part={};	
	part.type=$("#type").val();	
	part.model=$("#model").val();	
	asset_id=$("#asset_id").val();
	part.series_num=$("#series_num").val();	
	part.price=$("#price").attr("data-value");
	if(asset_id==""){
		alerm("资产编号不能为空！");
		$("#asset_id").focus();
	}	
	if(part.price==""){
		alerm("价格不能为空！");
		$("#price").focus();
	}	
	else{
		part.capacity=$("#capacity").val();	
		part.status=$("#status").val();
		part.protect_time=$("#protect_time").val();
		if(part.protect_time=='')part.protect_time='0001-01-01';		
		part.note=$("#note").val();
		part.serv=$("#device_asset_id").val();
		var body = JSON.stringify(part);
		var opt=$("#butt_save").attr('data-value');
		var url="EAS/"+opt+"?asset_id="+asset_id+"&user="+sessionStorage.usrfullname;						
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){
					alerm("操作成功");	
					CloseForm("#form_part","#overlay");	
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
	Load_Part_list("");
	//选择或取消服务商
	$("#tbody_part_list").click(function b(e){
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
	$('#form_part_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_part').offset().left; 
		var abs_y = event.pageY - $('#form_part').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_part'); 
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
	
	$('#form_alert_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_alert').offset().left; 
		var abs_y = event.pageY - $('#form_alert').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_alert'); 
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