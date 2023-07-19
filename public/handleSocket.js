const socket = io('http://localhost:3000');

 
$(document).ready(() => {
    $('#loginForm').show();
    $('#chatForm').hide();
})