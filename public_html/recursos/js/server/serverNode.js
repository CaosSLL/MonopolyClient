var http = require("http").createServer(handler).listen(8585);
var io = require('socket.io').listen(http);
var fs = require("fs");
var url = require("url");

function handler(req, res) {
    res.writeHead(200);
    res.end();
}

var usuarios = {};
var sala = {};

io.sockets.on('connection', function(socket) {

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
    
    socket.on("cambiar_turno", function(datos) {
        socket.broadcast.to(datos.sala).emit("cambiar_turno", datos);
    });
    
    socket.on("cambio_bote", function(datos) {
        socket.broadcast.to(datos.sala).emit("cambio_bote", datos);
    });
    
    socket.on("infoPartida", function(datos) {
        socket.broadcast.to(datos.sala).emit("infoPartida", datos);
    });
    
    socket.on("cambioDinero", function(datos) {
        socket.broadcast.to(datos.sala).emit("cambioDinero", datos);
    });
    
    socket.on("casillasCompradas", function(datos) {
        socket.broadcast.to(datos.sala).emit("casillasCompradas", datos);
    });
    
    
    // Chema
    socket.on("volver_unirse", function(datos){
        socket.room = datos.sala;
        socket.join(datos.sala);
        socket.broadcast.to(datos.sala).emit("volver_unirse", datos);
    });
   
    socket.on("conf_volver_unirse", function(datos){
        socket.room = datos.sala;
        socket.join(datos.sala);
        socket.broadcast.to(datos.sala).emit("conf_volver_unirse", datos);
    });
    
});
