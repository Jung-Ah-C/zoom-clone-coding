import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();


app.set("view engine", "pug"); // Pug로 view engine 설정
app.set("views", __dirname + "/views"); // Express에 template이 어딨는지 지정
app.use("/public", express.static(__dirname + "/public")); // public url을 생성해서 유저에게 파일을 공유
app.get("/", (_, res) => res.render("home")); // home.pug를 render 해주는 route handler를 만들어줌
app.get("*/", (_, res) => res.redirect("/")); // redirect url 설정

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// 같은 포트에 서버와 웹소켓을 같이 실행시키기 위한 설정
// http 서버에 접근해서 그 서버위에 webSocket 서버를 만들 수 있게 함
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", socket => {
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName); // socket.io에 있는 room 기능
        done();
        socket.to(roomName).emit("welcome");
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye");
        });
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg);
        done();
    });
});


/* 
const wss = new WebSocket.Server({ server }); // websocket 서버 생성
const sockets = [];

wss.on("connection", (socket) => { // 여기서 socket은 연결된 브라우저를 뜻함
    sockets.push(socket);
    socket["nickname"] = "Anon"
    console.log("Connected to Browser ✅");
    // 새로운 브라우저가 접속하게 되면 socket.on 코드가 실행됨
    socket.on("close", () => console.log("Disconnected from the Browser ❌")) // frontend에서의 close 이벤트를 listen 하는 것 = 브라우저 탭을 닫으면 (브라우저 연결이 끊기면) 실행
    socket.on("message", (msg) => { // 브라우저가 서버에 메세지를 보냈을 때를 위한 listener
        const message = JSON.parse(msg.toString());
        switch(message.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
}); */

httpServer.listen(3000, handleListen);