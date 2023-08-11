$(document).ready(function() {
    $('#registration-form').submit(function(e) {
        e.preventDefault();

        var formData = $(this).serialize()+"&role=students";
        console.log(formData);
        // 检查密码和确认密码是否匹配
        var password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: localStorage.getItem('base_url')+'api/login', // 后台处理程序的 URL
            data: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function(response) {
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN':response.token // 获取 Token 并添加到 Header
                    }
                });
                localStorage.setItem('token', response.token);
                window.location.href='teacher_list.html'
                },
            error: function(error) {
                $('#result').text('出现错误：' + error.responseText).css('color', 'red').show();
            }
        });
    });
});
$("#teacher-button").click(function(){
    window.location.href = "../teacher/login.html";
});
