$(document).ready(function() {
    var inputCount = 0;

    // 添加动态输入框
    $('#add-input').click(function(e) {
        e.preventDefault();
        var inputHtml = `
            <div class="school-container">
                <input type="text" name="school_input[${inputCount}]" required>
                <button class="remove-input">-</button>
            </div>
        `;
        $('#input-container').append(inputHtml);
        inputCount++;
    });

    // 删除动态输入框
    $('#input-container').on('click', '.remove-input', function() {
        $(this).parent().remove();
    });
    $('#registration-form').submit(function(e) {
        e.preventDefault();

        var formData = $(this).serialize();
        console.log(formData);
        // 检查密码和确认密码是否匹配
        var password = $('#password').val();
        var confirmPassword = $('#confirm-password').val();
        if (password !== confirmPassword) {
            $('#result').text('密码和确认密码不匹配').css('color', 'red').show();
            return;
        }

        $.ajax({
            type: 'POST',
            url: localStorage.getItem('base_url')+'api/teachers/register', // 后台处理程序的 URL
            data: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function(response) {
                $('#result').text("注册成功,请等待管理员审核").css('color', 'green').show();
                // var responseObject = JSON.parse(response.responseText)
                console.log(response.token)
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN':response.token // 获取 Token 并添加到 Header
                    }
                });
                localStorage.setItem('token', response.token);
                },
            error: function(error) {
                $('#result').text('出现错误：' + error.responseText).css('color', 'red').show();
            }
        });
    });
    $("#login-button").click(function(){
        window.location.href = "login.html";
    } );

});
