var xmlHttp;
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

// 获取邮件服务器配置
function loadconf(){
	var url="SysCfg/GetMailConf";
	TMS_api(url,"GET","",function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200){	
				$("#smtpHost").val(resp.smtpHost);
				$("#port").val(resp.port);
				$("#account").val(resp.account);
				$("#passwd").val("");

				if(resp.auth=='true')$("#auth").attr("checked",true);
				else $("#auth").attr("checked",false);
				if(resp.tls=='true')$("#tls").attr("checked",true);
				else $("#tls").attr("checked",false);
				if(resp.ssl=='true')$("#ssl").attr("checked",true);
				else $("#ssl").attr("checked",false);						
			}
			else alerm(resp.message);
		}
	});
}

// 保存配置
function SaveConf(){
	var mailconf={
		smtpHost:$("#smtpHost").val(),
		port:$("#port").val(),
		account:$("#account").val(),
		passwd:$("#passwd").val(),
		auth:"false",
		tls:"false",
		ssl:"false"
	};
	
	if($("#auth").attr("checked")=='checked')mailconf.auth='checked';
	if($("#tls").attr("checked")=='checked')mailconf.tls='checked';
	if($("#ssl").attr("checked")=='checked')mailconf.ssl='checked';

	var url="SysCfg/UpdateMailConf";
	var body=JSON.stringify(mailconf);
	TMS_api(url,"POST",body,function a(){
		if (xmlHttp.readyState==4 && xmlHttp.status==200){
			var resp = JSON.parse(xmlHttp.responseText);
			if(resp.code==200)alerm("配置已保存！");
			else alerm(resp.message);
		}
	});				
}
// 发送电子邮件测试
function SendTestMail(){
	var sendto=$("#sendto").val();
	if(sendto==""){
		alerm("测试邮件地址不能为空");
		$("#sendto").focus();
	}
	else{
		var url="SysCfg/TestMailConf?mailto="+sendto;
		TMS_api(url,"GET","",function a(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				var resp = JSON.parse(xmlHttp.responseText);
				if(resp.code==200){
					alerm("测试邮件已成功发出，请注意查收！");
					CloseForm('#form_confirm','#overlay');
				}
				else alerm(resp.message);
			}
		});
	}
}
// 打开测试弹层
function testconf(){
	open_form("#form_confirm","#overlay");
}

//***********************  主函数  *****************************************//
$(document).ready(function(){ 
	usr_selected="";
	if(typeof(sessionStorage.customerId)=='undefined'){
		sessionStorage.currpage="login.html";
		$("#main", parent.document).attr("src",sessionStorage.currpage);
	}
	// 获取邮件配置信息
	loadconf();	
	// 弹层移动
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
});