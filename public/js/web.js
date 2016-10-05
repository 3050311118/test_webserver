$(function(){
        //切换步骤（目前只用来演示）
    $('.processorBox li').click(function(){
        var i = $(this).index();
        $('.processorBox li').removeClass('current').eq(i).addClass('current');
        $('.step').fadeOut(300).eq(i).fadeIn(500);
    });

    $("#myform").validate({
        focusInvalid: false, 
        onkeyup: false,   
        submitHandler: function(form){   //表单提交句柄,为一回调函数，带一个参数：form   
             // alert("提交表单");   
            // form.submit();   //提交表单  
            $.ajax({
                cache: true,
                type: "POST",
                url:'/registersubmit',
                data:$("#myform").serialize(),// 你的formid
                async: false,
                error: function(request) {
                    // $("#ack").html("Connection error");
                },
                success: function(data) {
                    // $("#ack").html("Connection ok");
                     $('#mymail').html($('#email').val());
                     $('.processorBox li').removeClass('current').eq(1).addClass('current');
                     $('.step').fadeOut(300).eq(1).fadeIn(500);
                }
            });
        },   
        
        rules:{
            myname:{
                required:true,
                rangelength:[3,10],
                remote: {
					url: "/checkname",
					type: "POST",
					cache: false,
					data: {
						email:function(){
							return $("#myname").val();
						}
					}
				}
            },
            email:{
                required:true,
                email:true,
                remote: {
					url: "/checkemail",
					type: "POST",
					cache: false,
					data: {
						email:function(){
							return $("#email").val();
						}
					}
				}
            },
            password:{
                required:true,
                rangelength:[6,10]
            },
            confirm_password:{
                equalTo:"#password"
            }                    
        },
        messages:{
            myname:{
                required:"必填",
                rangelength: $.format("3-10个字符"),
                remote : "<b><font color='red'>该用户名已被占用</font></b>" 
            },
            email:{
                required:"必填",
                email:"E-Mail格式不正确",
                remote : "<b><font color='red'>该邮箱已被注册</font></b>" 
            },
            password:{
                required: "不能为空",
                rangelength: $.format("密码最小长度:{0}, 最大长度:{1}。")
            },
            confirm_password:{
                equalTo:"两次密码输入不一致"
            }                                    
        }   
    });    
})