    var site_url = window.location.href.toLowerCase();
	//alert($("#nav li").eq(0).html());
	switch (true) {
		case site_url.indexOf("news") > 0 :
			$("#nav li").attr("class","");
			$("#nav li").eq(1).attr("class","nav_lishw");
			$(".nav_lishw .aon a").attr("class","sele");
			break;
		case site_url.indexOf("product") > 0 :
			$("#nav li").attr("class","");
			$("#nav li").eq(2).attr("class","nav_lishw");
			$(".nav_lishw .aon a").attr("class","sele");
			break;
		case site_url.indexOf("guide") > 0 :
			$("#nav li").attr("class","");
			$("#nav li").eq(3).attr("class","nav_lishw");
			$(".nav_lishw .aon a").attr("class","sele");
			break;
		case site_url.indexOf("download") > 0 || site_url.indexOf("download") > 0 || site_url.indexOf("faq") > 0:
			$("#nav li").attr("class","");
			$("#nav li").eq(6).attr("class","nav_lishw");
			$(".nav_lishw .aon a").attr("class","sele");
			break;
		case site_url.indexOf("about") > 0 || site_url.indexOf("culture") > 0 || site_url.indexOf("hornor") > 0:
			$("#nav li").attr("class","");
			$("#nav li").eq(7).attr("class","nav_lishw");
			$(".nav_lishw .aon a").attr("class","sele");
			break;
		case site_url.indexOf("equipment") > 0 || site_url.indexOf("download") > 0 || site_url.indexOf("faq") > 0:
			$("#nav li").attr("class","");
			$("#nav li").eq(8).attr("class","nav_lishw");
			$(".nav_lishw .aon a").attr("class","sele");
			break;

		default :
			$("#nav li").attr("class","");
			$("#nav li").eq(0).attr("class","nav_lishw");
			$(".nav_lishw .aon a").attr("class","sele");
			$(".nav_lishw .subnav").show();
	} 



	$("#nav li").hover(
		function(){
			$("#nav .subnav").hide(); 
			$("#nav li .aon .sele").attr("class","shutAhover");
			$(this).attr("id","nav_hover")
			$("#nav_hover .aon a").attr("class","sele");
			$("#nav_hover").find(".subnav").slideDown("fast"); 
		},
		function(){
			
			if($(this).attr("class") != "nav_lishw"){
				$("#nav_hover .aon .sele").attr("class","");
				$("#nav_hover .subnav").slideUp("fast");
			}
			$(this).attr("id","")
			$("#nav li .aon .shutAhover").attr("class","sele");
			$(".nav_lishw").find("dl").slideUp("fast");
			$(".nav_lishw .aon a").attr("class","sele");
		}
	);