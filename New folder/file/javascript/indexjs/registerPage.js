$(document).ready( () => {
    // $('#register-button').click(()=>{
    //     var data = {
    //         email: $('#register-email').val(),
    //         id: $('#register-id').val(),
    //         pass: $('#register-pass').val(),
    //     }
    //     console.log(data.email.split("@"));
    //     if((data.email.split("@").length==2)&&data.id&&data.pass&&data.email!="@") {
    //         $.ajax({
    //             type: 'post',
    //             url: '/api/register',
    //             data: JSON.stringify(data),
    //             contentType: "application/json",
    //             success: function (data) {
    //                 console.log(data);
    //             }
    //         })
    //     }else console.log(false);
    // })


});
function registerClick() {
    var data = {
        email: $('#register-email').val(),
        username: $('#register-id').val(),
        password: $('#register-pass').val(),
    }
    // console.log(data.email.split("@"));
    if (checkform(data)) {
        $.ajax({
            type: 'post',
            url: '/register',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                window.location.replace("/login");
            }
        })
    } else console.log(false);
}
function checkform(data) {
    if (data.password!=$('#confirm-pass').val()) {
        // console.log(data.pass + $('#confirm-pass').val())
        $('.alert').remove();
        $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
            '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
            '</button> Your confirm password is wrong </div>');
        return 0;
    }
    else if ((data.email.split("@").length != 2) || !data.username || !data.password || data.email == "@") {
        // console.log(2)
        return 0;
    }
    else if ($('#acceptCheck:checked').length==0) {
        // console.log(3)
        $('.alert').remove();
        $('form').prepend('<div class="alert alert-info mt-3 alert-dismissible" style="text-align: center">' +
            '<button class="close" type="button" data-dismiss="alert" aria-hidden="true">×' +
            '</button> Please accept Terms and Conditions </div>');
        return 0;
    }
    else return 1;
}