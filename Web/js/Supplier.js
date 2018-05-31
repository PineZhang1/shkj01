var xmlHttp;
var tr_selected;
var type;
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
// 加载供应商列表
function Load_Supplier_list(filter) {
	var item_ppnum=17;
	tr_selected=null;
	if(filter=="")filter="filter=";
	var url="EAS/ListSupplier?"+filter+"&supplier_type="+type+"&page_count="+item_ppnum+"&page_num="+page_num;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				var bgcolor="a";
				$("#tbody_supplier_list tr").remove();
				var supplier=resp.supplier;
				for(var i=0;i<supplier.length;i++){
					if(bgcolor=="")bgcolor='background-color:#F0ECF3;';
					else bgcolor="";
					var line='<tr style="'+bgcolor+'">';
					line=line+'<td>'+(item_ppnum*(page_num-1)+i+1)+'</td>';
					line=line+'<td>'+supplier[i].supplier+'</td>';
					line=line+'<td>'+supplier[i].contact+'</td>';
					line=line+'<td>'+supplier[i].mobile+'</td>';
					line=line+'<td>'+supplier[i].email+'</td>';
					line=line+'<td>'+supplier[i].address+'</td>';
					line=line+'<td>'+supplier[i].note+'</td>';
					line=line+'</tr>';
					$("#tbody_supplier_list").append(line);	
				}
				// 变更页码
				var item_sum=parseInt(resp.total_num);
				page_sum=Math.ceil(item_sum/item_ppnum);
				$("#page_num").text(page_sum);
				if(supplier.length==0)page_num=0;
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
// 添加新供应商
function AddAgent(){
	$("#butt_save").attr("data-value","AddSupplier");
	open_form('#form_Supplier','#overlay');
}
// 打开编辑弹层
function EditAgent(){
	if(tr_selected==null)alerm("请先选择要操作的项目。");
	else {
		$("#supplier").val(tr_selected.children().eq(1).text());
		$("#contact").val(tr_selected.children().eq(2).text());
		$("#mobile").val(tr_selected.children().eq(3).text());
		$("#email").val(tr_selected.children().eq(4).text());
		$("#address").val(tr_selected.children().eq(5).text());
		$("#note").val(tr_selected.children().eq(6).text());

		$("#butt_save").attr('data-value','UpdateSupplier');
		open_form('#form_Supplier','#overlay');
	}	
}
// 确认删除供应商
function confirmTo(){
	var url="EAS/DelSupplier?supplier="+tr_selected.children().eq(1).text()+"&supplier_type="+type;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				CloseForm('#form_confirm','#overlay');
				alerm(type+"已删除！");
				tr_selected=null;				
				page_num=1;
				Load_Supplier_list("");					
			}
			else alerm(resp.message);
		}
	});
}
// 删除供应商
function DelAgent(){
	if(tr_selected==null)alerm("请先选择要操作的项目。");
	else {
		$("#alertmess").text("请确认是否删除该"+type+"？");
		open_form("#form_confirm","#overlay");
	}
}
// 保存供应商信息
function Supplier_save(){
	var sp={};	
	sp.supplier=$("#supplier").val();	
	sp.contact=$("#contact").val();	
	sp.mobile=$("#mobile").val();	
	if(sp.name==""){
		alerm(type+"名不能为空！");
		$("#supplier").focus();
	}
	else if(sp.contact==""){
		alerm("联系人不能为空！");
		$("#contact").focus();
	}
	else if(sp.mobile==""){
		alerm("联系电话不能为空！");
		$("#mobile").focus();
	}
	else{
		sp.email=$("#email").val();
		sp.address=$("#address").val();	
		sp.note=$("#note").val();
		
		var body = JSON.stringify(sp);
		var opt=$("#butt_save").attr('data-value');
		var url="EAS/"+opt+"?supplier_type="+type;
		if(opt=='UpdateSupplier')url=url+"&supplier="+tr_selected.children().eq(1).text();	
		else if(opt=='AddSupplier')url=url+"&supplier="+sp.supplier;					
		TMS_api(url,"POST",body,function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){
					CloseForm("#form_Supplier","#overlay");	
					alerm("操作成功");						
					page_num=1;			
					Load_Supplier_list("");	
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
	Load_Supplier_list(fts);
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
	type=$("#tab_supplier_list thead").children().eq(0).children().eq(1).text();
	Load_Supplier_list("");

	//选择或取消服务商
	$("#tbody_supplier_list").click(function b(e){
		var tr=$(e.target).parent();
		if(tr_selected!=null)tr_selected.css("background-color",old_bgcolor);
		tr_selected=tr;
		old_bgcolor=tr.css("background-color");
		tr_selected.css("background-color","#E3F1F7");	
	});
	//弹层拖动
	$('#form_Supplier_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_Supplier').offset().left; 
		var abs_y = event.pageY - $('#form_Supplier').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_Supplier'); 
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