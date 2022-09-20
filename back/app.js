var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require("cors");    //moje

const memorija = require('./mr/routes/mr.routes'); //moje

var bodyParser = require('body-parser'); //moje

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());   //moje
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json()); //moje
app.use(/*'/back/mr'*/'/', memorija); //moje

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});









//NOVO WEB SOCKET
//const http = require("http");
//const { Server } = require("socket.io");

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",  //ovim gadjamo nas frontend...u ovom slucaju react
//     methods: ["GET", "POST"],
//   },
// });

const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
});





io.on("connection", (socket) => {

  console.log(`User Connected: ${socket.id}`);


  
  socket.on("join_room", (data) => {
    socket.join(data);
    //socket.emit('igrac_jedan_socket_id', socket.id);
    // console.log(`User Connected: ${socket.id}`);
  })

  /*POZIVI IZ MODALA modal_online*/
  socket.on("send_message", (data) => {
    //socket.broadcast.emit("receive_message", data); //ovako je bez sobe
    //socket.in(data.kanal).emit("receive_message", data); //slanje svima u sobi NE ukljucujuci onoga ko salje poruku
    io.in(data.kanal).emit('receive_message', data);  //slanje svima u sobi ukljucujuci i onoga ko salje poruku
  })
  socket.on("potrazivanje_id_drugog_igraca", (data) => {
    io.in(data.prist_mecu).emit('primanje_id_drugog_igraca', data);  //slanje svima u sobi ukljucujuci i onoga ko salje poruku
  })
  socket.on("slanje_drugom_igracu_br_slicica", (data) => {
    io.in(data.prist_mecu).emit('emitovanje_br_slicica_odabir_prvog_igraca', data);  //slanje svima u sobi ukljucujuci i onoga ko salje poruku
  })
  /*POZIVI IZ MODALA modal_online*/







  socket.on("zahtev_za_porkretanje_sata", (data) => {
    io.to(data.kanal).emit('online_pokretanje_sata', data);  //slanje svima u sobi ukljucujuci i onoga ko salje poruku
    //socket.broadcast.emit("online_pokretanje_sata", data);
  })



  socket.on("igrac_jedan_aktivan", (data) => {
    io.to(data.kanal).emit('igrac_jedan_aktivan_obelezi', data);  //slanje svima u sobi ukljucujuci i onoga ko salje poruku
    //socket.broadcast.emit("online_pokretanje_sata", data);
  })
  socket.on("igrac_dva_aktivan", (data) => {
    io.to(data.kanal).emit('igrac_dva_aktivan_obelezi', data);  //slanje svima u sobi ukljucujuci i onoga ko salje poruku
    //socket.broadcast.emit("online_pokretanje_sata", data);
  })

  socket.on("igrac_jedan_dodaj_poen", (data) => {
    io.to(data.kanal).emit('igrac_jedan_dodaj_poen_prikazi', data);  //slanje svima u sobi ukljucujuci i onoga ko salje poruku
    //socket.broadcast.emit("online_pokretanje_sata", data);
  })
  socket.on("igrac_dva_dodaj_poen", (data) => {
    io.to(data.kanal).emit('igrac_dva_dodaj_poen_prikazi', data);  //slanje svima u sobi ukljucujuci i onoga ko salje poruku
    //socket.broadcast.emit("online_pokretanje_sata", data);
  })
  socket.on("trenutni_potez", (data) => {
    io.to(data.kanal).emit('vracanje_trenutni_potez', data);  //slanje svima u sobi ukljucujuci i onoga ko salje poruku
    //socket.broadcast.emit("online_pokretanje_sata", data);
  })





});
//console.log(io.sockets.emit('broadcast',{ "receive_message": data}));
server.listen(3001, () => {
  console.log("SERVER RADI");
});
//NOVO WEB SOCKET



module.exports = app;














/*
PRAVILA EMITOVANJA

// sending to sender-client only
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
socket.broadcast.to(socketid).emit('message', 'for your eyes only');

// sending to individual socketid (private message)
socket.to(<socketid>).emit('hey', 'I just met you');

// list socketid
for (var socketid in io.sockets.sockets) {}
 OR
Object.keys(io.sockets.sockets).forEach((socketid) => {});
*/
