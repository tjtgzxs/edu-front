$(document).ready(function() {
    $('#registration-form').submit(function(e) {
        e.preventDefault();

        var formData = $(this).serialize()+"&role=teachers";
        console.log(formData);
        // 检查密码和确认密码是否匹配
        var password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: localStorage.getItem('base_url')+'/api/login', // 后台处理程序的 URL
            data: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function(response) {

                $('#result').text("登录成功").css('color', 'green').show();

                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN':response.token // 获取 Token 并添加到 Header
                    }
                });
                localStorage.setItem('token', response.token);
                window.location.href = "auth.html";
                },
            error: function(error) {
                console.log(error);
                if (error.status===402){
                    $('#result').text("请等待管理员核实您的账号").css('color', 'yellow').show();
                }else {
                    $('#result').text('出现错误：' + error.responseText).css('color', 'red').show();
                }

            }
        });
    });
});
$("#register-button").click(function(){
    window.location.href = "register.html";
});
$("#student-button").click(function(){
    window.location.href = "../student/login.html";
});
