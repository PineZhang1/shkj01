var xmlHttp;
var type;
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
// 加载字典项
function loaddict(){
	var url="SysCfg/ListDict?type="+type;
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				if(type==''){
					if(resp.os.length>0)$("#os option").remove();
					for(var i=0;i<resp.os.length;i++){
						var line="<option>"+resp.os[i]+"</option>";
						$("#os").append(line);
					}
					if(resp.part_type.length>0)$("#part_type option").remove();
					for(var i=0;i<resp.part_type.length;i++){
						var line="<option>"+resp.part_type[i]+"</option>";
						$("#part_type").append(line);
					}
					if(resp.dept_contractor.length>0)$("#dept_contractor option").remove();
					for(var i=0;i<resp.dept_contractor.length;i++){
						var line="<option>"+resp.dept_contractor[i]+"</option>";
						$("#dept_contractor").append(line);
					}
				}
				else{
					$("#"+type+" option").remove();
					var temp=null;
					if(type=='os')temp=resp.os;
					else if(type=='part_type')temp=resp.part_type;
					else if(type=='dept_contractor')temp=resp.dept_contractor;

					for(var i=0;i<temp.length;i++){
						var line="<option>"+temp[i]+"</option>";
						$("#"+type).append(line);
					}
				}
			}
			else alerm(resp.message);
		}
	});
}
// 删除字典项
function DelDict(){
	if(type=="")alerm('请选择要删除的字典项！');
	else{
		var opt_sel=$("#"+type+" option:selected");
		var key="";
		for(var i=0;i<opt_sel.length;i++){
			key=key+opt_sel.eq(i).text()+",";
		}
		if(key!=""){
			key=key.substring(0,key.length-1);
			var url="SysCfg/DelDict?key="+key+"&type="+type;
			TMS_api(url,"GET","",function a(){
				if (xmlHttp.readyState==4 && xmlHttp.status==200){
					var resp = JSON.parse(xmlHttp.responseText);
					if(resp.code==200){	
						alerm('删除成功!');
						loaddict();
					}
					else alerm(resp.message);
				}
			});
		}
		else alerm('请选择要删除的字典项！');
	}
}
// 添加字典项
function confirmTo(){
	var key=$("#dict_key").val();
	if(key==''){
		alerm('新字典项不能为空！');
		$("#dict_key").focus();
	}
	else{
		if(key.indexOf("\\")>-1)alerm("字典项里不能有'\\'符号！");
		else{
			var url="SysCfg/AddDict?key="+key+"&type="+type;
			TMS_api(url,"GET","",function a(){
				if (xmlHttp.readyState==4 && xmlHttp.status==200){
					var resp = JSON.parse(xmlHttp.responseText);
					if(resp.code==200){							
						CloseForm('#form_dict','#overlay');
						alerm('添加成功!');
						loaddict();
					}
					else alerm(resp.message);
				}
			});
		}		
	}
}
// 打开添加字典项弹层
function AddDict(){
	if(type=="")alerm('请选择要添加项目的字典列表！');
	else{
		if(type=='os')$("#form_dict_title").text('添加新操作系统');
		else if(type=='part_type')$("#form_dict_title").text('添加新零配件类型');
		else if(type=='dept_contractor')$("#form_dict_title").text('添加新部门联系人');
		$("#dict_key").val("");
		open_form("#form_dict","#overlay");
	}
}
/* ************************main*************************/
$(document).ready(function(){
	type="";
	if(typeof(sessionStorage.customerId)=='undefined'){;
		sessionStorage.currpage="login.html";
		$("#main", parent.document).attr("src",sessionStorage.currpage);
	}
	loaddict();

	// 选择字典
	$(".dictlist").click(function b(e){
		type=$(e.target).attr("id");
		if(typeof(type)=='undefined')type=$(e.target).parent().attr("id");
	});
	//弹层拖动
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
	$('#form_dict_title').mousedown(function (event) { 
		var isMove = true; 
		var abs_x = event.pageX - $('#form_dict').offset().left; 
		var abs_y = event.pageY - $('#form_dict').offset().top; 
		$(document).mousemove(function (event) { 
			if (isMove) { 
				var obj = $('#form_dict'); 
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