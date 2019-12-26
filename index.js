var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");
app.set("View","./views");

var server = require('http').Server(app);
server.listen(8080);

var io = require('socket.io')(server);
var ListConnect =[];

io.on("connection",function(socket){ // lắng nghe kết nối
    console.log("có kêt nối mới: " + socket.id);
    socket.on("disconnect",function(){
        console.log("khách ngắt kết nối" + socket.id);
    });
    
    socket.on("client-say-hello",function(data){
        console.log(data , socket.id);
        // io.sockets.emit("server-say-hello","Chào mừng bạn"); gửi cho tất cả các client đang truy cập vô.
        socket.emit("server-say-hello","Chào mừng bạn"); //gửi lại cho chính client kết nối.
        // socket.broadcast.emit("server-say-hello","Chào mừng bạn") gửi cho tất cả client trừ client gửi tới
        // io.to("nhập socket id").emit() gửi đên người nào đó có socketid.
    });
    socket.on("name_login",function(data){
        // console.log(socket.adapter.rooms.sockets);// danh sách room
        if (ListConnect.indexOf(data)>=0){
            socket.emit("err_name",data);
        }else{
            socket.id = data;
            socket.join(data);
            ListConnect.push(socket.id);
            socket.emit("login_success");
        }
    });
    socket.on("request_listconnect",function(){
        io.sockets.emit("load_listconnect",ListConnect);
        console.log("Đã vào giao diện chat");
    });
    socket.on("client_chat",function(data,room){
        if(room=="Group"){
            socket.broadcast.emit("forward_client",data);
        }else{
            socket.broadcast.in(room).emit("group_chat",data);
        }
        
    });

    socket.on("connect_room",function(data){
        socket.join(data);
        socket.emit("join_room_success",data);
        console.log(data ,  socket.id);
        // console.log(socket.adapter.rooms);
        
    });
});
app.get("/",function(req,res){
    res.render("trangchu");
});

app.get("/chat/",function(req,res){
    res.render("giaodienchat");
    // res.send(ListConnect);
});
