$(function(){$("a").focus(function(){this.blur();});});//去除链接虚线

//在线咨询
function scrollImg2(){
    var posX,posY;
    if (window.innerHeight) {
        posX = window.pageXOffset;
        posY = window.pageYOffset;
    }
    else if (document.documentElement && document.documentElement.scrollTop) {
        posX = document.documentElement.scrollLeft;
        posY = document.documentElement.scrollTop;
    }
    else if (document.body) {
        posX = document.body.scrollLeft;
        posY = document.body.scrollTop;
    }
    var ad=document.getElementById("rightad");
    ad.style.top=(posY+0)+"px";
    ad.style.left=(posX+0)+"px";
    setTimeout("scrollImg2()",10);
}//在线咨询 end

//留言
function scrollImg(){
    var posX,posY;
    if (window.innerHeight) {
        posX = window.pageXOffset;
        posY = window.pageYOffset;
    }
    else if (document.documentElement && document.documentElement.scrollTop) {
        posX = document.documentElement.scrollLeft;
        posY = document.documentElement.scrollTop;
    }
    else if (document.body) {
        posX = document.body.scrollLeft;
        posY = document.body.scrollTop;
    }
    var ad=document.getElementById("leftad");
    ad.style.top=(posY+0)+"px";
    ad.style.left=(posX+0)+"px";
    setTimeout("scrollImg()",10);
}//留言 end


//close qq
$(document).ready(function(){

$(".close").click(function(){
$("#rightad").fadeToggle(1000);
$(".qqonline").fadeToggle(1000);
});
$(".qqonline .btn").click(function(){
$("#rightad").fadeToggle(1000);
$(".qqonline").fadeToggle(1000);
});

});//end


$(function(){
$('.menu li a').click(function(){
if($(this).attr('class')=='hover'){
$('.menu .sub').hide('');
$(".menu .hover").attr('class','');
}else{
$('.menu .sub').hide('');
$(".menu .hover").attr("class","");
$(this).attr('class','hover');
$('.menu #'+$(this).attr('id')+"_dl").show('');
}
});
});

//start
$(function(){
		
//输出方本
$(".addtab").click(function(){
	$(".tabtable").append('<tr class="tr"><td align="center" bgcolor="#FFFFFF"><input type="text" name="textfield" class="input4"/></td><td align="center" bgcolor="#FFFFFF"><input type="text" name="textfield2" class="input4"/></td><td align="center" bgcolor="#FFFFFF"><input type="text" name="textfield3" class="input4"/></td><td align="center" bgcolor="#FFFFFF"><a href="javascript:;" class="close"><u>移除</u></a></td></tr>');	
});
$(".close").live('click',function(){$(this).closest(".tr").hide()});		  
//
		  
});//end

//close qq
$(document).ready(function(){

$(".message .title").click(function(){
$(".mast").fadeToggle(10);
});

});//end

