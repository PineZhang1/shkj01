var xmlHttp;
function TMS_api(url,med,dats,cfunc){
	var hostpath=getHostUrl();		
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
$(document).ready(function(){ 
	if(typeof(sessionStorage.customerId)=='undefined'){
		var url="login.html";
		window.open(encodeURI(url),'_self');
	}
	$("#menu").css('height',($(document).height()-46));
	$("#user").text(sessionStorage.usrfullname);
	//避免页面刷新调回主页面，默认登录进入工作空间页面，对应按钮置亮
	var homepage="IDC.html";
	if(typeof(sessionStorage.currpage)=='undefined'){
		sessionStorage.currpage=homepage;
		sessionStorage.module="IDC";
	}
	$("#main").attr("src",sessionStorage.currpage);	
	$(".submenu").hide();
	$("#"+sessionStorage.module).parent().show();

	$("#"+sessionStorage.module).css({"background-color": "#013349"});

	// 获取权限列表，对按钮进行访问许可判断
	// var url="User/LoadPurview?user="+sessionStorage.customerId;
	// TMS_api(url,"GET","",function a(){
	// 	if (xmlHttp.readyState==4 && xmlHttp.status==200){
	// 		var resp = JSON.parse(xmlHttp.responseText);
	// 		if(resp.code==200){
	// 			var purview=resp.purview;
	// 			for(var i=0;i<purview.length;i++){
	// 				var pv_list=purview[i].list;
	// 				for(var j=0;j<pv_list.length;j++){
	// 					var objid="#"+pv_list[j].key.replace("pur_","");
	// 					var value="enable";
	// 					var bgcolor="#FFFFFF";
	// 					if(pv_list[j].value=="x"){
	// 						value="disable";
	// 						bgcolor="#6F9B81";
	// 					}
	// 					$(objid).attr("data-value",value);
	// 					$(objid).css("color",bgcolor);	
	// 				}
	// 			}
	// 		}
	// 		else alert(resp.message);
	// 	}
	// });

	//点击退出按钮
	$("#butt_exit").click(function b(){	
		sessionStorage.currpage="login.html";
		window.open(sessionStorage.currpage,'_self');
	});
	// 点击按钮展开或收缩子菜单
	$(".butt_menu").click(function b(e){
		var submenu_id=$(e.target).attr("id")+"_submenu";
		$(".submenu").slideUp();
		$("#"+submenu_id).slideDown();
	});
	
	//点击标题返回主页
	$("#Title").click(function b(){
		sessionStorage.currpage=homepage;
		$("#main").attr("src",sessionStorage.currpage);

	});
	//鼠标滑过菜单按钮的变色效果
	$(".butt_menu").mouseenter(function(e) { 
		if($(e.target).attr("id")!=sessionStorage.module)$(e.target).css("background-color", "#013349");	
	});
	$(".butt_menu").mouseleave(function (e) { 
		if($(e.target).attr("id")!=sessionStorage.module)$(e.target).css("background-color", "rgba(188,195,241,0.3)");
	});

	//鼠标滑过子菜单按钮的变色效果
	$(".butt_submenu").mouseenter(function(e) { 
		if($(e.target).attr("data-value")=="enable"){
			if($(e.target).attr("id")!=sessionStorage.module)$(e.target).css("background-color","#013349");	
		}
	});
	$(".butt_submenu").mouseleave(function (e) { 
		if($(e.target).attr("data-value")=="enable"){
			if($(e.target).attr("id")!=sessionStorage.module)$(e.target).css("background-color","rgba(188,195,241,0)");
		}
	});
	
	//选择模块跳转
	$(".butt_submenu").click(function b(e){
		if($(e.target).attr("data-value")=="enable"){
			var ids=$(e.target).attr("id");
			sessionStorage.currpage=ids+".html";
			$(".butt_submenu").css("background-color","rgba(188,195,241,0)");
			$(e.target).css("background-color", "#013349");
			sessionStorage.module=ids;
			$("#main").attr("src",sessionStorage.currpage);
		}
	});
});