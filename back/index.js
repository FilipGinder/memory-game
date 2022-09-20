var express = require('express');
var app = express();
const http = require("http");
const { Server } = require("socket.io");
var cors = require("cors"); 
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  //ovim gadjamo nas frontend...u ovom slucaju react
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

//   socket.on("send_message", (data) => {
//     socket.broadcast.emit("receive_message", data);
//   })
});

server.listen(3001, () => {
  console.log("SERVER RADI");
});