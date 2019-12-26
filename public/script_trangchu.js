$(document).ready(function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        var socket = io("http://192.168.1.213:8080/");
    } else {
        var socket = io("http://localhost:8080/");
    }
    $("#name_login").keyup(function(e){
        if(e.keyCode ==13){
            $("#submit").click();
        }
    });
    $("#submit").click(function () {
        var name = $("#name_login").val();
        socket.emit("name_login", name);
        // var data = ["1213];
    });
    socket.on("login_success", function () {
        // alert("Bạn đang click");
        window.location.href="./chat/";       
    });
    socket.on("err_name",function(data){
        alert(" Tên người "+data+" dùng đã");
    });
});