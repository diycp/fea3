
$(document).ready(function(){
	//清空配置项
	//$('#main').ruler();
	$("#key").val("");
	$("#width").val("800");
	$("#height").val("480");
	$("#types").val("01");
	$("#build_title").val("");
	$("#x").val("0");
	$("#y").val("0");
	$("#yname").val("");
	$("#xname").val("");
	$("#refresh").val("");
	$("#zindex").val("5");
	$('#legend').attr('data-id','false');
	$('#border').attr('data-id','false');
	//2017.7.25 ycj 修改构建页面标尺
		function bc_csh() {
			var w=$(window).width();
			var h=$(window).height();
			if(w>4096){
				$('#maint').css('width', w);
			}
			if(h>2160){
				$('#maint').css('height', h);
			}
		}
		bc_csh();

	$("#czIcon a").eq(3).hover(function(){
		$(this).find('img').attr('src','img/icon/draw-hover.png');
	},function(){
		$(this).find('img').attr('src','img/icon/draw.png');
	});
	$("#czIcon a").eq(2).hover(function(){
		$(this).find('img').attr('src','img/icon/save-hover.png');
	},function(){
		$(this).find('img').attr('src','img/icon/save.png');
	});
	$("#czIcon a").eq(1).hover(function(){
		$(this).find('img').attr('src','img/icon/yulan-hover.png');
	},function(){
		$(this).find('img').attr('src','img/icon/yulan.png');
	});
	$("#czIcon a").eq(0).hover(function(){
		$(this).find('img').attr('src','img/icon/back-hover.png');
	},function(){
		$(this).find('img').attr('src','img/icon/back.png');
	});

	$('.box_false').hide();
	$('.box').css('height','300px');
	$('#maint').css('top','285px');
	$('#zxxScaleBox').css('top','308px');
	$('.box_bottom').click(function() {
		if($('.box_bottom').hasClass('one_click_box')){
			$('.box_bottom').removeClass('one_click_box');
			$('.box').animate({'height':'300px'}, 1000);
			$('.box_false').slideUp(1000);
			$('#maint').animate({'top':'285px'}, 1000)
			$('#zxxScaleBox').animate({'top':'308px'}, 1000)
		}else{
			$('.box_bottom').addClass('one_click_box')
			$('.box').animate({'height':'400px'}, 1000);
			$('.box_false').slideDown(1000);
			$('#maint').animate({'top':'385px'}, 1000);
			$('#zxxScaleBox').animate({'top':'408px'}, 1000);
		}
	});

	var theRequest ={},theEND,str;
	var dataarr= [];
	//var dataNum=dataarr[0].dnum;
	var dataNum=[];
	var dataTitle;
	var o={};
	var divFrame,allKey=[],allDiv,df;
	function GetRequest() {
		var url = location.search; //获取url中"?"符后的字串
		a=decodeURI(url);
		if (a.indexOf("?") != -1) {
		    str = a.substr(1);
		    strs = str.split("&");
		    for(var i = 0; i < strs.length; i ++) {
		        theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
		    }
		}
// console.log(theRequest);
		key=theRequest.key;
		dtitle=theRequest.d2title;
		//dmh=theRequest.mh;
		editor=theRequest.editor;
		return theRequest;
	}
	GetRequest();

	delete theRequest["d2title"];
	delete theRequest["key"];
	delete theRequest["editor"];
	dfEnd=theRequest;
	dataTitle=dtitle;
	$("#build_top").text(dtitle);
	var oo=[],hy=[],h_y,myChart,cs;
	$.ajaxSetup({
		async : false
	});
	$.ajax({
        type: "get",
        timeout : 1000*600,
        dataType:"jsonp",
        url: "/db/jsonp/ssdb0/"+key,
        success: function(response) {
        	//console.info(response);
        	var oo=[];
        	var result="";
        	$('#maint').ruler();
			if(response.length>0){
				dataNum=response[0].dnum;
				dcs=response[0].dcs;
				for(var i=0;i<dataNum.length;i++){
					var dfa=dataNum[i].df;
					for(var j in theRequest){
						var value=theRequest[j];
					 	d=dfa.replace(j,value);
					 	dfa=d;
					}
					var keyObj={
						name:dfa+'+'+dataNum[i].types,
						value:dataNum[i].time
					};
					allKey.push(keyObj);
					h_y=parseInt(dataNum[i].height)+parseInt(dataNum[i].y);
					hy.push(h_y);
					getOption(dataNum[i]);
					if(titles.indexOf(j) !=-1){
						var titles_s=titles.replace(j,value);
						titles=titles_s;
					}
					var xx=parseInt(dataNum[i].x)+18;
					var yy=parseInt(dataNum[i].y)+18;
					oo.push("key="+dfa,"width="+width,"height="+height,"types="+type,"title="+titles,"refresh="+refresh,"xname="+xname,"yname="+yname,"border="+border,"zindex="+zindex,"legend="+legend);
					cs=oo.join("&")
					var div=$('<div id="main'+i+'" class="'+border+'" data-id="'+time+'" data-src="'+cs+'" name="mypanel" style="width:'+width+'px;height:'+height+'px;position:absolute;top:'+yy+'px;left:'+xx+'px;outline: 1px solid #000;outline-offset:-1px;z-index:'+zindex+';"></div>');
					$("#maint").append(div);
					myChart=echarts.init(document.getElementById('main'+i),'shine');
					$.getScript('../plot/'+type+'.js',function(data, textStatus, jqxhr){
						try{
							eval("draw"+type+"(myChart,dfa,height,titles,xname,yname,width,div,border,zindex,legend);");
							// console.log(refresh);
							if(refresh!=undefined && refresh != "" &&refresh!="0"){
								var refreshs = parseInt(dataNum[i].refresh)*1000;
								setInterval(function(type,myChart,dfa,height,titles,xname,yname,width,div,border,zindex,legend){
									eval("draw"+type+"(myChart,dfa,height,titles,xname,yname,width,div,border,zindex,legend);");
									if(div.find($(".icon")).length == 0){
										var result=	'<div class="icon" style="width:'+width+'px;background-color:rgba(37,40,42,0.2);position:absolute;top:0;left:0;z-index:0;">'+
					  						'<img class="delete" src="img/icon/close_X_01.png" alt="删除" style="cursor:pointer;float:right;">'+
					  						'<img class="drag" src="img/icon/tuodong_icon.png" alt="拖拽" style="cursor:pointer;float:right;">'+
					  					'</div>';
										$(div).append(result);
									}
								},refreshs,type,myChart,dfa,height,titles,xname,yname,width,div,border,zindex,legend);
							}
						}catch(err){
							console.error(err);
						}
						var result=	'<div class="icon" style="width:'+dataNum[i].width+'px;background-color:rgba(37,40,42,0.2);position:absolute;top:0;left:0;z-index:0;">'+
	  						'<img class="delete" src="img/icon/close_X_01.png" alt="删除" style="cursor:pointer;float:right;">'+
	  						'<img class="drag" src="img/icon/tuodong_icon.png" alt="拖拽" style="cursor:pointer;float:right;">'+
	  					'</div>';
						$(div).append(result);
					});
				}
				var last=dataNum[dataNum.length-1];
				if(last.border == undefined){
	 				last.border='';
	 				last.zindex='0';
	 				last.legend='true';
	 			}
				$("#key").val(last.df);
				$("#width").val(last.width);
				$("#height").val(last.height);
				$("#types").val(last.types);
				$("#title").val(last.titles);
				$("#x").val(last.x);
				$("#y").val(last.y);
				$("#xname").val(last.xname);
				$("#yname").val(last.yname);
				$("#border").attr('data-id',last.border);
				$("#zindex").val(last.zindex);
				$("#legend").attr('data-id',last.legend);
			}
			border_legend();
			//拖动的对象和配置对应
			$('#maint').ruler();
			tuozhuai();
		 }
	});

function getOption(list){
	var oo=[];
	//console.info(list);
	type=list.types;
	ckey=list.df;
	width=list.width;
	height=list.height;
	titles=list.titles;
	x=list.x;
	y=list.y;
	xname=list.xname;
	yname=list.yname;
	time=list.time;
	refresh=list.refresh;
	if(list.border){
		border=list.border;
	}else{
		border='';
	}
	if(list.zindex){
		zindex=list.zindex;
	}else{
		zindex='0';
	}
	if(list.legend){
		legend=list.legend;
	}else{
		legend='true';
	}
}
function peizhi(){

	df=$("#key").val();
	for(var j in dfEnd){
		var value=dfEnd[j];
	 	d=df.replace(j,value);
	 	df=d;
	}
	if($("#border").attr('data-id') == '无'){
		var borders='';
	}else{
		var borders=$("#border").attr('data-id');
	}
	oNum={
		"df":df,
		"width":$("#width").val(),
		"height":$("#height").val(),
		"types":$("#types").val(),
		"titles":"",
		"x":$("#x").val(),
		"y":$("#y").val(),
		"xname":$("#xname").val(),
		"yname":$("#yname").val(),
		"time":"",
		"refresh":$("#refresh").val(),
		"border":borders,
		"zindex":$("#zindex").val(),
		"legend":$("#legend").attr('data-id')
	};
	//theEND=JSON.stringify(theRequest);
	//theEND=theEND.join("&");
	//console.info(str);
}
function tuozhuai(){
	$('div[name="mypanel"]').each(function(i,dom){
		var csObj={};
	  	$(dom).draggable({
		  drag: function(event,ui) {
		  //console.info(dataNum);
		  	$(this).find('.icon').css("background-color","#3ecfff");
			$("div[name='mypanel']").not(this).find('.icon').css("background-color","#cfdce4");
		  	var t=$(this).attr("data-id");//获取时间
			 for (var i = 0; i < dataNum.length; i++) {
			 	//console.info(dataNum);
			 	if(t==dataNum[i].time){
					if(dataNum[i].border == undefined){
		 				dataNum[i].border='';
		 				dataNum[i].zindex='0';
		 				dataNum[i].legend='true';
		 			}
				 	$("#key").val(dataNum[i].df);
				 	$("#width").val(dataNum[i].width);
					$("#height").val(dataNum[i].height);
					$("#types").val(dataNum[i].types);
					$("#title").val(dataNum[i].titles);
					// $("#x").val(dataNum[i].x);
					// $("#y").val(dataNum[i].y);
					$("#xname").val(dataNum[i].xname);
					$("#yname").val(dataNum[i].yname);
					$("#refresh").val(dataNum[i].refresh);
					$("#border").attr('data-id',dataNum[i].border);
					$("#zindex").val(dataNum[i].zindex);
					$("#legend").attr('data-id',dataNum[i].legend);
			 	}
			 }
			 $("#x").val(parseInt((ui.position).left-18));
			 $("#y").val(parseInt((ui.position).top-18));
			 border_legend();
		  },
		  stop:function(event,ui){
		  	//$("div[name='mypanel']").not(this).css("background-color","#ccc");
		  	var t=$(this).attr("data-id");
		  	peizhi();
		  	oNum.time=t;
		  	oNum.df=$("#key").val();
		  	oNum.titles=$("#title").val();
		  	//console.info(o);
		  	//console.info(dataarr);
		  	for (var i = 0; i < dataNum.length; i++) {
				if (t==dataNum[i].time) {
					//alert();
					dataNum.splice($.inArray(dataNum[i],dataNum),1);
					dataNum.push(oNum);
				}
			}
			border_legend();
		  		//console.info(dataarr);
		  }
	  });
  });
}
var y1;
//---------------所有门户选择菜单按钮-------------------------
//选择图类型
$(".navul").html('');
$(".content").html('');
$('#close_tb_select,#tb_select').click(function() {
	$("#smallChart").slideUp();
});
$("#chartButton").click(function(){
  $(".content").html('');
	$(".navul").html('');
	// $("#smallChart").modal("toggle");
	$("#smallChart").slideDown();
	for(var i=0;i<menu_data.length;i++){
		$(".navul").append('<li><a href="#" target="_self">'+menu_data[i].name+'</a></li>');
      //判断选择框内时候没有数字
      if($('#types').val() == null){
      	// alert(0)
        $(".navul li:first").addClass('navbg');
        var n=0;
  			$(".navul li").removeClass('navbg')

  			$(".navul li:first").addClass('navbg').siblings("li").removeClass("navbg");
  			var div4='<div class="ajq">',div3='';
        for(var j=0;j<menu_data[n].title.length;j++){
          var div2='<a href="#" role="'+n+'" data-id="'+menu_data[n].title[j].type+'"><p>'+menu_data[n].title[j].name+'</p><img src="'+menu_data[n].title[j].img+'"></a>'
          div3+=div2
        }
        var div1='<div class="'+menu_data[n].class+'" id="">';
        var p1='<p class="title">'+menu_data[n].name+'</p>';
        var content=div1+p1+div4+div3+'</div>'+'</div>'
				$(".content").html('')
				$(".content").append(content);
  			$('.content a').click(function(){
  				var a_id=$(this).attr('data-id');
          var a_role=$(this).attr('role');
  				//console.info(a_id);
  				$('#types').val(a_id);
          $('#types').attr('role',a_role);
  				// $("#smallChart").modal("toggle");
$("#smallChart").slideUp();
  			});
      }else{
        if($('#types').attr('role') == null){
        	// alert(1)
          $(".navul li:first").addClass('navbg');
          var n=0;
    			$(".navul li").removeClass('navbg')
    			$(".navul li:first").addClass('navbg').siblings("li").removeClass("navbg");
    			var div4='<div class="ajq">',div3='';
          for(var j=0;j<menu_data[n].title.length;j++){
            var div2='<a href="#" role="'+n+'" data-id="'+menu_data[n].title[j].type+'"><p>'+menu_data[n].title[j].name+'</p><img src="'+menu_data[n].title[j].img+'"></a>'
            div3+=div2;
          }
          var div1='<div class="'+menu_data[n].class+'" id="">';
          var p1='<p class="title">'+menu_data[n].name+'</p>';
          var content=div1+p1+div4+div3+'</div>'+'</div>'
					$(".content").html('')
          $(".content").append(content);
					// console.log(content);
					// // $(".content").not('div[class="'+menu_data[n].class+'"].second').html('')
					// console.log(content);
    			$('.content a').click(function(){
    				var a_id=$(this).attr('data-id');
            var a_role=$(this).attr('role');
    				//console.info(a_id);
    				$('#types').val(a_id);
            $('#types').attr('role',a_role);
    				// $("#smallChart").modal("toggle");
$("#smallChart").slideUp();
    			});
        }else{
        	// alert(2)
        	//$(".content").html('');
          var n=$('#types').attr('role');
          $(".navul li").removeClass('navbg')
          $(".navul li").eq(n).addClass('navbg')
    			$(".navul li").eq(n).addClass('navbg').siblings("li").removeClass("navbg");
    			var div4='<div class="ajq">',div3='';
          for(var j=0;j<menu_data[n].title.length;j++){
            var div2='<a href="#" role="'+n+'" data-id="'+menu_data[n].title[j].type+'"><p>'+menu_data[n].title[j].name+'</p><img src="'+menu_data[n].title[j].img+'"></a>'
            div3+=div2
          }
          var div1='<div class="'+menu_data[n].class+'" id="">';
          var p1='<p class="title">'+menu_data[n].name+'</p>';
          var content=div1+p1+div4+div3+'</div>'+'</div>'
					$(".content").html('')
          $(".content").append(content);
    			$('.content a').click(function(){
    				var a_id=$(this).attr('data-id');
            var a_role=$(this).attr('role');
    				//console.info(a_id);
    				$('#types').val(a_id);
            $('#types').attr('role',a_role);
    				// $("#smallChart").modal("toggle");
$("#smallChart").slideUp();
    			});
        }
      }

		// $(".navul li:first").addClass('navbg');
		$(".navul li").click(function() {
			$(".content div").show();
			$(".content").html('');
			var n=$(".navul li").index(this)
			$(".navul li").removeClass('navbg')
			$(this).addClass('navbg').siblings("li").removeClass("navbg");
			var div4='<div class="ajq">',div3='';
      for(var j=0;j<menu_data[n].title.length;j++){
        var div2='<a href="#" role="'+n+'"  data-id="'+menu_data[n].title[j].type+'"><p>'+menu_data[n].title[j].name+'</p><img src="'+menu_data[n].title[j].img+'"></a>'
        div3+=div2
      }
      var div1='<div class="'+menu_data[n].class+'" id="">';
      var p1='<p class="title">'+menu_data[n].name+'</p>';
      var content=div1+p1+div4+div3+'</div>'+'</div>'
      $(".content").append(content);
			$('.content a').click(function(){
				var a_id=$(this).attr('data-id');
        var a_role=$(this).attr('role');
        //console.info(a_id);
        $('#types').val(a_id);
        $('#types').attr('role',a_role);
				// $("#smallChart").modal("toggle");
$("#smallChart").slideUp();
			});
		});
	}
	//鼠标移开时触发
	$('body').on('mouseleave', '.content a', function(event) {
		$('.tb_xz_tc').remove();
	})
	//鼠标移入图表选择之后触发
	$('body').on('mouseenter', '.content a', function(event) {
		// event.preventDefault();
		/* Act on the event */
		if($('.tb_xz_tc')){
			$('.tb_xz_tc').remove();
		}
		var a_id=$(this).attr('data-id');
		var a_role=$(this).attr('role');

		var H=$(window).height();
		var W=$(window).width();


				if($('#key').val() != ''){
						var key=$('#key').val();
						for(var j in dfEnd){
							var value=dfEnd[j];
						 	d=key.replace(j,value);
						 	key=d;
						}
						// $.ajaxSetup({
						// 	async : false
						// });
						$.ajax({
								type: "get",
								cache : false,
								dataType:"jsonp",
								url: "/db/jsonp/ssdb0/"+key,
								success: function(response) {
									// console.info(response);
									if(response){
										var oEvent=event;
										var oDiv=document.createElement('div');
										if((H-oEvent.clientY)<350){
											oDiv.style.top=oEvent.clientY-350+'px';  // 指定创建的DIV在文档中距离顶部的位置
										}else{
											oDiv.style.top=oEvent.clientY+'px';  // 指定创建的DIV在文档中距离顶部的位置
										}
										if((W-oEvent.clientX)<350){
											oDiv.style.left=oEvent.clientX-350+'px';  // 指定创建的DIV在文档中距离左侧的位置
										}else{
											oDiv.style.left=oEvent.clientX+'px';  // 指定创建的DIV在文档中距离左侧的位置
										}
								        // oDiv.style.border='1px solid #FF0000'; // 设置边框
								        oDiv.style.position='fixed'; // 为新创建的DIV指定绝对定位
								        oDiv.style.width='350px'; // 指定宽度
								        oDiv.style.height='350px'; // 指定高度
								        oDiv.style.zIndex =1050; //
								        oDiv.style.backgroundColor ='#fff'; //
												oDiv.classList.add("tb_xz_tc");
								        document.body.appendChild(oDiv);
												$('.tb_xz_tc').css('overflow', 'hidden').css('box-shadow', '0px 1px 1px 2px #ccc').css('padding', '15px');
										var width=$('.tb_xz_tc').width();
										var height=$('.tb_xz_tc').height();
										var titles='预览';
										var x='',y='';
										//获取创建的时间，作为唯一标识
										var time=new Date();
										time=time.getTime();
										//获取配置项内容
										var oo=[];
										var border='';
										var zindex='1050';
										var legend='true';
										oo.push("key="+key,"width="+width,"height="+height,"types="+a_id);
										var cs=oo.join("&");
									  	//创建dom
								  	var div1=$('<div id="'+time+'" class="'+border+'" name="mypanel" data-id="'+time+'" data-src="'+cs+'" name="mypanel" style="width:'+width+'px;height:'+height+'px;margin:auto;overflow:hidden;z-index:'+zindex+';"></div>');
										$(".tb_xz_tc").append(div1);
										myChart=echarts.init(document.getElementById(time),'shine');
										$.getScript('../plot/'+a_id+'.js',function(data, textStatus, jqxhr){
											try{
												eval("draw"+a_id+"(myChart,key,height,titles,x,y,width,div1,border,zindex,legend);");
											}catch(err){
												console.error(err);
											}
										});
									}
							 },
							 error:function(error){
									 console.log(error);
							 }
						});
					}
	});
});


$("#huitu").on('click',function(){
	var time=new Date();
	//console.info(time);
	time=time.getTime();
	peizhi();
	allKey.push({name:oNum.df+'+'+oNum.types,value:time});
	// if ($("#title").val()=="") {//2017.7.19 ycj 去除
	// 	var items=$("#types").find("option:selected").text();
	// 	var tit=oNum.df+items;
	// 	$("#title").val(tit);
	// }

	oNum.time=time;
	oNum.titles=$("#title").val();
	oNum.df=$("#key").val();
	oNum.refresh=$("#refresh").val();
	//console.info(oNum);
    if(oNum.x == ''){
        oNum.x=0;
    }
    if(oNum.y == ''){
        oNum.y=0;
    }
	y1=parseInt(oNum.y)+18;
	xx=parseInt(oNum.x)+18;
	dataNum.push(oNum);
	// console.info(dataNum);
	var oo=[];
	for(var j in dfEnd){
		if(oNum.titles.indexOf(j)){
			var value=dfEnd[j];
		var titles_s=oNum.titles.replace(j,value);
	}else{
		var titles_s=oNum.titles;
	}
	}
	oo.push("key="+df,"width="+oNum.width,"height="+oNum.height,"types="+oNum.types,"title="+titles_s,"refresh="+oNum.refresh,"xname="+oNum.xname,"yname="+oNum.yname,"border="+oNum.border,"zindex="+oNum.zindex,"legend="+oNum.legend);
	var cs=oo.join("&")
	//console.info();
  	var div1=$('<div id="'+time+'" class="'+oNum.border+'" name="mypanel" data-id="'+time+'" data-src="'+cs+'" name="mypanel" style="width:'+oNum.width+'px;height:'+oNum.height+'px;position:absolute;top:'+y1+'px;left:'+xx+'px;outline: 1px solid #000;outline-offset:-1px;z-index:'+oNum.zindex+';"></div>');
	$("#maint").append(div1);
	myChart=echarts.init(document.getElementById(time),'shine');
	$.getScript('../plot/'+oNum.types+'.js',function(data, textStatus, jqxhr){
		try{
			eval("draw"+oNum.types+"(myChart,df,oNum.height,titles_s,oNum.xname,oNum.yname,oNum.width,div1,oNum.border,oNum.zindex,oNum.legend);");
			if(oNum.refresh!=undefined && oNum.refresh != "" && oNum.refresh!="0"){
				var refreshs = parseInt(oNum.refresh)*1000;
				setInterval(function(types,myChart,df,height,titles,xname,yname,width,div,border,zindex,legend){
					eval("draw"+types+"(myChart,df,height,titles,xname,yname,width,div,border,zindex,legend);");
					if(div.find($(".icon")).length == 0){
						var result=	'<div class="icon" style="width:'+width+'px;background-color:rgba(37,40,42,0.2);position:absolute;top:0;left:0;z-index:0;">'+
										'<img class="delete" src="img/icon/close_X_01.png" alt="删除" style="cursor:pointer;float:right;">'+
										'<img class="drag" src="img/icon/tuodong_icon.png" alt="拖拽" style="cursor:pointer;float:right;">'+
									'</div>';
						$(div).append(result);
					}
				},refreshs,oNum.types,myChart,df,oNum.height,titles_s,oNum.xname,oNum.yname,oNum.width,div1,oNum.border,oNum.zindex,oNum.legend)
			}else{}
		}catch(err){
			console.error(err);
		}
		var result=	'<div class="icon" style="width:'+oNum.width+'px;background-color:rgba(37,40,42,0.2);position:absolute;top:0;left:0;z-index:0;">'+
						'<img class="delete" src="img/icon/close_X_01.png" alt="删除" style="cursor:pointer;float:right;">'+
						'<img class="drag" src="img/icon/tuodong_icon.png" alt="拖拽" style="cursor:pointer;float:right;">'+
					'</div>';
		$(div1).append(result);
		tuozhuai();
	});
	 //console.info(dataarr);

});
$("#save").on('click',function(){
	//console.info(dataarr);
	if(dataNum.length ===0){
		alert("数据为空");
		return false;
	}
	//if(dataNum.length !=0){
		var oo={
			dnum:dataNum,
			dtitle:dataTitle,
			dcs:dfEnd,
			//dmh:dmh,
			editor:editor
		};
		dataarr=[];
		dataarr.push(oo);
		//console.info(dataarr);
	  	var string=JSON.stringify(dataarr);

	  	$.ajax({
		 	type: "post",
         	async: true,
         	dataType:"json",
         	url: "/db/put/ssdb0/"+key,
         	data: {value:string},
         	success: function(response) {
         		alert("保存成功");
         	}
    	});
    	alert("保存成功");
	//}
});
$("body").on("click",'div[name="mypanel"] .delete',function(){
	$(this).parent().parent().remove();
	var t=$(this).parent().parent().attr("data-id");
	for (var i = 0; i < dataNum.length; i++) {
		if (t==dataNum[i].time) {
			//alert();
			dataNum.splice($.inArray(dataNum[i],dataNum),1);
		}
	}
	for (var i = 0; i < allKey.length; i++) {
		if (t==allKey[i].value) {
			//alert();
			allKey.splice($.inArray(allKey[i],allKey),1);
		}
	}
});
$("#runButton").click(function(e){
	$("#runList").empty();
	for (var i = 0; i < allKey.length; i++) {
		var li='<li data-id="'+allKey[i].value+'"><a href="#">'+allKey[i].name+'</a></li>';
		$("#runList").append(li);
	}
});
$("body").on('click','#runList li',function(){
	var a=$(this).find('a').text();
	$("#feaName").val(a);
	var uniqe=$(this).attr('data-id');
	var csObj={};
	allDiv=$('div[name="mypanel"]');
	for (var i = 0; i < allDiv.length; i++) {
		if(uniqe==$(allDiv[i]).attr('data-id')){
			$(allDiv).removeClass('maxZ');
			$(allDiv[i]).addClass('maxZ');
			$(allDiv).find('.icon').css("background-color","#cfdce4");
			$(allDiv[i]).find('.icon').css("background-color","#3ecfff");
		}
	}
	for (var i = 0; i < dataNum.length; i++) {
	 	if(uniqe==dataNum[i].time){
			if(dataNum[i].border == undefined){
 				dataNum[i].border='';
 				dataNum[i].zindex='0';
 				dataNum[i].legend='true';
 			}
		 	$("#key").val(dataNum[i].df);
		 	$("#width").val(dataNum[i].width);
			$("#height").val(dataNum[i].height);
			$("#types").val(dataNum[i].types);
			$("#title").val(dataNum[i].titles);
			$("#x").val(dataNum[i].x);
			$("#y").val(dataNum[i].y);
			$("#xname").val(dataNum[i].xname);
			$("#yname").val(dataNum[i].yname);
			$("#refresh").val(dataNum[i].refresh);
			$("#border").attr('data-id',dataNum[i].border);
			$("#zindex").val(dataNum[i].zindex);
			$("#legend").attr('data-id',dataNum[i].legend);
	 	}
	 }
});
$("body").on("click","div[name='mypanel']",function(e){
	$('div[name="mypanel"]').removeClass('zdex');
	$(this).addClass('zdex');
	$(this).find('.icon').css("background-color","#3ecfff");
	$("div[name='mypanel']").not(this).find('.icon').css("background-color","#cfdce4");
	var t=$(this).attr("data-id");//获取时间
	$('div[name="mypanel"]').removeClass('maxZ');
	$(this).addClass('maxZ');
	 for (var i = 0; i < dataNum.length; i++) {
	 	//console.info(dataNum);
	 	if(t==dataNum[i].time){
			if(dataNum[i].border == undefined){
 				dataNum[i].border='';
 				dataNum[i].zindex='0';
 				dataNum[i].legend='true';
 			}
		 	$("#key").val(dataNum[i].df);
		 	$("#width").val(dataNum[i].width);
			$("#height").val(dataNum[i].height);
			$("#types").val(dataNum[i].types);
			$("#title").val(dataNum[i].titles);
			$("#x").val(dataNum[i].x);
			$("#y").val(dataNum[i].y);
			$("#xname").val(dataNum[i].xname);
			$("#yname").val(dataNum[i].yname);
			$("#refresh").val(dataNum[i].refresh);
			$("#border").attr('data-id',dataNum[i].border);
			$("#zindex").val(dataNum[i].zindex);
			$("#legend").attr('data-id',dataNum[i].legend);
	 	}
	 }
});


$("body").on("click","#yulan",function(){
	window.open('../dbd/dbd2_yl.fh5?'+str+'&mh=dmh');
});
$("#back").on('click',function(){
	//alert();
	window.location.href='dbd2_mgr.fh5';
});
Array.prototype.del=function(n) {
	if(n<0){
       return this;
	}else{
		return this.slice(0,n).concat(this.slice(n+1,this.length));
	}
	}

	$('body').on('click', '#t_border_ul li', function() {
		var a_text=$(this).children('a').text();
		$('#border').val(a_text);
		var a_data=$(this).attr('data-id');
		$('#border').attr('data-id',a_data);
	});
	$('body').on('click', '#t_zindex_ul li', function() {
		var a_text=$(this).children('a').text();
		$('#zindex').val(a_text);
	});
	$('body').on('click', '#t_legend_ul li', function() {
		var a_text=$(this).children('a').text();
		$('#legend').val(a_text);
		var a_data=$(this).attr('data-id');
		$('#legend').attr('data-id',a_data);
	});
	function border_legend(){
		var a=$('#border').attr('data-id');
		var b=$('#legend').attr('data-id');

		if(a == '' ||a == '无'){
			var q=$('#t_border_ul li').eq(0).children('a').text();
			$('#border').val(q);
		}else{
			var c=a.split("_");
			var q=$('#t_border_ul li').eq(c[1]).children('a').text();
			$('#border').val(q);
		}
		if(b == 'left'){
			$('#legend').val('左（竖排）')
		}
		if(b == 'right'){
			$('#legend').val('右（竖排）')
		}
		if(b == 'top'){
			$('#legend').val('上（横排）')
		}
		if(b == 'bottom'){
			$('#legend').val('下（横排）')
		}
		if(b == 'false'){
			$('#legend').val('不显示')
		}
	}
	border_legend();
	$('body').on('mouseenter', '#t_border_ul li', function() {
		var n=$(this).attr('data-id');
		if(n == '无'){
			$('.border_xz_tc').remove();
		}else{
			var H=$(window).height();
			var W=$(window).width();
			var oEvent=event;
			var oDiv=document.createElement('div');
			if((H-oEvent.clientY)<350){
				oDiv.style.top=oEvent.clientY-350+'px';  // 指定创建的DIV在文档中距离顶部的位置
			}else{
				oDiv.style.top=oEvent.clientY+'px';  // 指定创建的DIV在文档中距离顶部的位置
			}
			if((W-oEvent.clientX)<350){
				oDiv.style.left=oEvent.clientX-350+'px';  // 指定创建的DIV在文档中距离左侧的位置
			}else{
				oDiv.style.left=oEvent.clientX+'px';  // 指定创建的DIV在文档中距离左侧的位置
			}
					// oDiv.style.border='1px solid #FF0000'; // 设置边框
					oDiv.style.position='fixed'; // 为新创建的DIV指定绝对定位
					oDiv.style.width='350px'; // 指定宽度
					oDiv.style.height='350px'; // 指定高度
					oDiv.style.zIndex =1050; //
					oDiv.style.backgroundColor ='#fff'; //
					oDiv.classList.add("border_xz_tc");
					document.body.appendChild(oDiv);
					$('.border_xz_tc').css('overflow', 'hidden').css('box-shadow', '0px 1px 1px 2px #ccc').css('padding', '15px');
					$('.border_xz_tc').append('<div class="'+n+'" style="width：100%;height:100%;"></div>')
		}
	});
	$('body').on('mouseleave', '#t_border_ul li', function() {
		$('.border_xz_tc').remove();
	});
	$(function(){//构建页面的尺子的标注线
		$.pageRuler({
			v: [1042,1298,1384,1458,1938,3858,4111],
			h:[786,738,918,1098,2178]
		});
	});
});
