var usuario = "";
var sala = "";

$(document).ready(function() {

    $("#tUsuario").on("keydown", function(e){
        if(e.keyCode == 13){
            usuario = $("#tUsuario").val();
            $("#divUsuario").text(usuario);
        }
    });
    
    $("#tEnviar").on("keydown", function(e){
        if(e.keyCode == 13){
            $("#tRecibido").append($(this).val()+"\n");
            socket.emit("mensaje_sala", { sala: sala, usuario: usuario, mensaje: $(this).val() });
            $("#tEnviar").val("");
        }
    });

    $.ajax({
        url: host + server + "personaje/",
        method: "post",
        dataType: "json",
        success: function(datos) {
            $.each(datos, function(i, personaje) {
                $("#personaje").append("<option value=" + personaje.id + ">" + personaje.nombre + "</option>");
            });
        }
    });

    $.ajax({
        url: host + server + "usuario/conectados",
        method: "post",
        dataType: "json",
        success: function(datos) {
            $.each(datos, function(i, usuario) {
                if (usuario.id !== 3) {
                    $("#usuarios").append("<option value=" + usuario.id + ">" + usuario.nombre + "</option>");
                }
            });
        }
    });

    $("#formularioCrearPartida").on("submit", function(e) {
        e.preventDefault();

        var num = Math.floor(Math.random() * (100000 - 1 + 1)) + 1
        var personaje = $("#personaje").val();
        var listaUsuarios = $("#usuarios").val();
        var idUsuario = 3;
//        listaUsuarios.push({usuario: idUsuario, personaje: personaje });
        var datosPartida = {token: num, fecha: new Date(), usuarios: listaUsuarios};
        console.log(datosPartida);

        sala = num;
        socket.emit("solicitud", { sala: num, usuario: usuario });

//        $.ajax({
//            url: host + server + "partida/crearPartida",
//            method: "post",
//            dataType: "json",
//            data: datosPartida,
//            success: function(datos) {
//                if (datos.exito) {
//                    alert("Se ha creado con exito!");
//                }
//            },
//            error: function(e) {
//                alert("erroooorrr!");
//            }
//        });

    });

});

socket.on("solicitud", function(datos){
//    sala = datos.sala;
    $(".mensaje").append("<p>"+datos.usuario+" ha creado una partida en la sala <span class='sala'>"+datos.sala+"</span>, deseas unirte?<input type='button' class='bSi' value='Si'></p>");
    $(".bSi").on("click", function(){
        sala = parseInt($(this).siblings(".sala").text());
        socket.emit("confirmacion_solicitud", { sala: sala, usuario: usuario });
        $(this).parent().remove();
    });
});

socket.on("confirmacion_solicitud", function(datos){
    $(".mensaje").append("<p>"+datos.usuario+" ha confirmado su solicitud</p>");
});

socket.on("mensaje_sala", function(datos){
    $("#tRecibido").append(datos.usuario+" ha dicho: "+datos.mensaje+"\n");
});