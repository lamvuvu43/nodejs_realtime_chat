$(document).ready(function () {
    // $(".form-login").hide();
    // $(".container").show(2000);
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        var socket = io("http://192.168.1.213:8080/");
    } else {
        var socket = io("http://localhost:8080/");
    }

    socket.emit("request_listconnect");
    socket.on("load_listconnect", function (data) {
        $(".inbox_chat").empty();
        data.forEach(function (item, index) {
            $(".inbox_chat").append("<div class='chat_list'>" +
                "<div class='chat_people'><div class='chat_img'>" +
                "<img src='https://ptetutorials.com/images/user-profile.png' alt='sunil'> </div>" +
                "<div class='chat_ib'>" +
                "<h5>" + item + "</h5>" +
                "<p>Test, which is a new approach to have all solutions astrology under one roof</p>" +
                "</div>" + "</div>" + "</div>");
            // console.log(item);
        });
    });

    $(".write_msg").keyup(function (e) {
        if (e.keyCode == 13) {
            $(".msg_send_btn").click();
        }
    });
    

    $(".msg_send_btn").click(function () {
        var text = $(".write_msg").val();
        // console.log(text);
        if (text!=0){
            var check_room = $("#group_chat").find("h1").html();
            console.log(text);
            $(".write_msg").val("");
            $(".incoming_msg").append("<div class='outgoing_msg'>" +
                "<div class='sent_msg'>" +
                "<p>" + text + "</p>" +
                // <span class='time_date'> 11:01 AM | June 9</span>
                "</div>" +
                "</div>");
            socket.emit("client_chat",text,check_room);
            $('.msg_history').animate({
                scrollTop: $('.msg_history').prop("scrollHeight")
            }, 1000);
        }else{
            alert("Lỗi !!! Không có nội dung để gửi");
        }
        
    });



    socket.on("forward_client", function (data) {
        $(".incoming_msg").append("<div class='incoming_msg_img'> <img src='https://ptetutorials.com/images/user-profile.png'alt='sunil'>" +
            " </div>" +
            "<div class='received_msg'>" +
            "<div class='received_withd_msg'>" +
            "<p>" + data + "</p>" +
            "</div>" +
            "</div>");
        $('.msg_history').animate({
            scrollTop: $('.msg_history').prop("scrollHeight")
        }, 1000);
    });

    socket.on("group_chat", function (data) {
        $(".incoming_msg").append("<div class='incoming_msg_img'> <img src='https://ptetutorials.com/images/user-profile.png'alt='sunil'>" +
            " </div>" +
            "<div class='received_msg'>" +
            "<div class='received_withd_msg'>" +
            "<p>" + data + "</p>" +
            "</div>" +
            "</div>");
        $('.msg_history').animate({
            scrollTop: $('.msg_history').prop("scrollHeight")
        }, 1000);
    });
    $(document).on("click", ".chat_list", function () { // được dùng khi các thẻ được sinh ra sao khi load trang
        var data = $(this).find("h5").html();
        socket.emit("connect_room", data);
        $(".msg_history").html("<div  class='incoming_msg'></div>");
        console.log(data);
    });

    socket.on("join_room_success", function (data) {
        $("#group_chat").html("Bạn đang chat trong nhóm <h1>" + data + "</h1>");
    });

});