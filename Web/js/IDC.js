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
function Load_IDC_list(filter) {
	var item_ppnum=17;
	if(filter=="")filter="filter=";
	var url="EAS/ListIDC?"+filter+"&page_count="+item_ppnum+"&page_num="+page_num;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				$("#tbody_idc_list tr").remove();
				var idcs=resp.IDC;
				var bgcolor="a";
				for(var i=0;i<idcs.length;i++){
					if(bgcolor=="")bgcolor='background-color:#F0ECF3;';
					else bgcolor="";
					var line='<tr style="'+bgcolor+'">';
					line=line+'<td>'+(item_ppnum*(page_num-1)+i+1)+'</td>';
					line=line+'<td>'+idcs[i].idc+'</td>';
					line=line+'<td>'+idcs[i].contact+'</td>';
					line=line+'<td>'+idcs[i].mobile+'</td>';
					line=line+'<td>'+idcs[i].email+'</td>';
					line=line+'<td>'+idcs[i].address+'</td>';
					line=line+'<td>'+idcs[i].note+'</td>';
					line=line+'</tr>';
					
					$("#tbody_idc_list").append(line);
				}
				// 变更页码
				var item_sum=parseInt(resp.total_num);
				page_sum=Math.ceil(item_sum/item_ppnum);
				$("#page_num").text(page_sum);
				if(idcs.length==0)page_num=0;
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
// 添加新机房
function AddIDC(){
	$("#butt_save").attr("data-value","AddIDC");
	open_form('#form_IDC','#overlay');
}
// 打开编辑机房信息弹层
function EditIDC(){
	if(tr_selected==null)alerm("请先选择要编辑的机房。");
	else {
		$("#idc").val(tr_selected.children().eq(1).text());
		$("#contact").val(tr_selected.children().eq(2).text());
		$("#mobile").val(tr_selected.children().eq(3).text());
		$("#email").val(tr_selected.children().eq(4).text());
		$("#address").val(tr_selected.children().eq(5).text());
		$("#note").val(tr_selected.children().eq(6).text());
		$("#butt_save").attr('data-value','UpdateIDC');
		open_form('#form_IDC','#overlay');
	}	
}
// 执行删除机房操作
function confirmTo(){
	var idc=tr_selected.children().eq(1).text();
	var url="EAS/DelIDC?idc="+idc;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){
				CloseForm('#form_confirm','#overlay');	
				alerm("项目已删除！");
				tr_selected=null;
				page_num=1;	
				Load_IDC_list("");					
			}
			else alerm(resp.message);
		}
	});
}
// 确认是否删除机房
function DelIDC(){
	if(tr_selected==null)alerm("请先选择要删除的机房。");
	else open_form("#form_confirm","#overlay");
}
// 保存机房信息
function IDC_save(){
	var idc={};	
	idc.idc=$("#idc").val();	
	idc.contact=$("#contact").val();	
	idc.mobile=$("#mobile").val();
	idc.email=$("#email").val();
	idc.address=$("#address").val();	
	idc.note=$("#note").val();	
	if(idc.idc==""){
		alerm("机房名不能为空！");
		$("#idc").focus();
	}
	else if(idc.contact==""){
		alerm("机房联系人不能为空！");
		$("#contact").focus();
	}
	else if(idc.mobile==""){
		alerm("机房联系人电话不能为空！");
		$("#mobile").focus();
	}
	else if(idc.address==""){
		alerm("机房地址信息不能为空！");
		$("#address").focus();
	}
	else{		
		var body = JSON.stringify(idc);
		var opt=$("#butt_save").attr('data-value');
		var url="EAS/"+opt+"?idc=";
		if(opt=='UpdateIDC')url=url+tr_selected.children().eq(1).text();
		else if(opt=='AddIDC')url=url+idc.idc;				
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){
					alerm("操作成功");	
					CloseForm("#form_IDC","#overlay");	
					page_num=1;			
					Load_IDC_list("");	
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
	Load_IDC_list(fts);
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
	Load_IDC_list("");

	// 点击选择机房条目
	$("#tbody_idc_list").click(function b(e){
		var tr=$(e.target).parent();
		if(tr_selected!=null)tr_selected.css("background-color",old_bgcolor);
		tr_selected=tr;
		old_bgcolor=tr.css("background-color");
		tr_selected.css("background-color","#E3F1F7");	
	});
	//弹层拖动
	$('#form_IDC_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_IDC').offset().left; 
		var abs_y = event.pageY - $('#form_IDC').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_IDC'); 
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