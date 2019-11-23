$(document).ready( () => {
    $('#login-id').val(localStorage.getItem('userName'));
    $('#login-pass').val(localStorage.getItem('Pass'));
    if (localStorage.getItem('check')=='true')
        $('#rememberCheck').prop('checked', true);
    else $('#rememberCheck').prop('checked', false);

});


function loginClick() {
    var data = {
        username    :   $('#login-id').val(),
        password  :   $('#login-pass').val(),
    }
    console.log(data);
    $.ajax({
        type : 'post',
        url : '/login',
        data : JSON.stringify(data),
        contentType: "application/json",
        success: function(data){
            console.log(data)
            if (data == 0) {
                $('.alert').remove();
                $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
                    '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
                    '</button>Wrong id or password</div>');
            }
            else{
                if($('#rememberCheck').prop("checked")) {
                    localStorage.setItem('userName', $('#login-id').val());
                    localStorage.setItem('check', $('#rememberCheck').prop('checked'));
                    localStorage.setItem('Pass', $('#login-pass').val());
                    window.location.replace("/user");
                }
                else{
                    localStorage.setItem('userName', $('#login-id').val());
                    localStorage.setItem('check', $('#rememberCheck').prop('checked'));
                    localStorage.setItem('Pass', '');
                    window.location.replace("/user");
                }

            }
        }
    })
}
