var http = require("http").createServer(handler).listen(8585);
var io = require('socket.io').listen(http);
var fs = require("fs");
var url = require("url");

function handler(req, res) {
//    if (url.parse(req.url).pathname === "/chat") {
//        fs.readFile(__dirname + '/index.html', function(err, data) {
//            if (err) {
//                res.writeHead(500);
//                return res.end('Error loading index.html');
//            }
//
//            res.writeHead(200);
//            res.end(data);
//        });
//    } else {
//        res.writeHead(404);
//        res.write("404 No encontrado");
//        res.end();
//    }
    res.writeHead(200);
    res.end();
}

var usuarios = {};
var sala = {};

io.sockets.on('connection', function(socket) {
 
//    socket.username = "1";
//    socket.join(socket.username);
//    socket.username = "2";
//    socket.join(socket.username);
//    socket.username = "3";
//    socket.join(socket.username);
    
    
    socket.on("nueva_sala", function(datos){
        socket.room = datos;
        socket.join(datos);
    });
    
    socket.on("nuevo_usuario", function(datos){
        usuarios[datos.id] = socket;
    });
    
    socket.on("mensaje_sala", function(datos){
        socket.broadcast.to(datos.sala).emit("mensaje_sala", datos);
    });
    
    socket.on("empezar_partida", function(datos){
        socket.broadcast.to(datos.sala).emit("empezar_partida", datos);
    });
    
    socket.on("solicitud", function(datos){
        socket.room = datos.sala;
        socket.join(datos.sala);
        console.log("solicitud: "+datos);
        
        socket.broadcast.emit("solicitud", datos);
    });
    
    socket.on("confirmacion_solicitud", function(datos){
        socket.room = datos.sala;
        socket.join(datos.sala);
        socket.broadcast.emit("confirmacion_solicitud", datos);
    });
    
    socket.on("mensaje_usuario", function(datos){
        sala[datos.usuario].emit("mensaje_usuario",datos);
    });
    
    socket.on("mensaje", function(datos) {
        socket.broadcast.emit("mensaje", datos);
    });
    
    socket.on("movimiento_partida", function(datos) {
        socket.broadcast.to(datos.sala).emit("movimiento_partida", datos);
    });
    
    socket.on("cambio_bote", function(datos) {
        socket.broadcast.to(datos.sala).emit("cambio_bote", datos);
    });
    
    socket.on("informacion", function(datos) {
        socket.broadcast.to(datos.sala).emit("informacion", datos);
    });
    
});

//io.sockets.in("sala1").emit("mensaje_sala", "Bienvenido a la sala 1!");
//io.sockets.in("sala2").emit("mensaje_sala", "Bienvenido a la sala 2!");
