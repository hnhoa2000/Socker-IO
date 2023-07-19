const socket = io('https://socker-io.onrender.com');

socket.on('server-send-register-fail', () => {
    alert('username da ton tai!!!');
})

socket.on('server-send-register-success', (data) => {
    $('#currentUser').html(data);
    $('#chatForm').show();
    $('#loginForm').hide();
})

socket.on('server-send-list-user', (data) => {
    $('#boxContent').html('');
    data.forEach(element => {
        $('#boxContent').append(`<div class="user">${element}</div>`)
    });
})

socket.on('server-send-message', (data) => {
    $('#listMessages').append(`<div class="msg">${data.username}: ${data.message}</div>`);
})

socket.on('someone-is-typing', (data) => {
    $('#thongbao').html(`<img width="20px" src="typing.gif"> ${data}`);
})

socket.on('someone-stop-typing', () => {
    $('#thongbao').html("");
})

$(document).ready(() => {
    $('#chatForm').hide();
    $('#loginForm').show();

    $('#txtMessage').focusin(() => {
        socket.emit('is-typing');
    })

    $('#txtMessage').focusout(() => {
        socket.emit('stop-typing');
    })

    $('#btnRegister').click(function () {
        socket.emit('client-send-username', $('#txtUsername').val());
    })

    $('#btnLogout').click(() => {
        socket.emit('logout');
        $('#chatForm').hide();
        $('#loginForm').show();
    })

    $('#btnSendMessage').click(() => {
        socket.emit('client-send-message', $('#txtMessage').val())
    })
})