var listaUsuariosAceptados = new Array();
var datosPartida;
var numJugadores = 0;

$(document).ready(function() {

    $.ajax({
        url: host + server + "personaje/",
        method: "post",
        dataType: "json",
        success: function(datos) {
            $.each(datos, function(i, personaje) {
                $("#personajes1").append("<option value=" + personaje.id + ">" + personaje.nombre + "</option>");
                $("#personajes2").append("<option value=" + personaje.id + ">" + personaje.nombre + "</option>");
            });
        }
    });

    cargarPartidas();

//    $(".partidas").on("change", function(e){
//        var token = $(this).val();
//        cargarPersonajes(token);
//    });

    $("#bRefrescar").off().on("click", function(e){
        e.preventDefault();
        cargarPartidas();
    });

    $("#formularioCrearPartida").on("submit", function(e) {
        e.preventDefault();

        var num = Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
        usuario.personaje = $("#personajes1").val();
        usuario.personajeNombre = $("#personajes1 option:selected").text();
        listaUsuariosAceptados.push(usuario);

        numJugadores = parseInt($("#numJugadores").val());
        sala = usuario.nombre + "-" + num;

        $.ajax({
            url: host + server + "partida/crear",
            method: "post",
            dataType: "json",
            data: {token: sala},
            success: function(datos) {
                idPartida = datos.id;
                socket.emit("solicitud", {sala: sala, usuario: usuario, idPartida: idPartida});
                $(".confirmacion").append("Se ha creado una partida en la sala " + sala + " espera a que se unan los jugadores...");
                $("#bCrearPartida").attr("disabled", true);
            },
            error: function(e) {
                console.log("Error en el servidor al crear la partida");
            }
        });

    });

    $("#formularioUnirsePartida").on("submit", function(e) {
        e.preventDefault();
        sala = $(".partidas").val();
        usuario.personaje = $("#personajes2").val();
        usuario.personajeNombre = $("#personajes2 option:selected").text();
        socket.emit("confirmacion_solicitud", {sala: sala, usuario: usuario});
        $(".confirmacion").append("Espera a que se unan suficientes jugadores...");
        $("#bUnirsePartida").attr("disabled",true);
    });

});

//function cargarPersonajes(token){
//    $.ajax({
//        url: host + server + "jugador/personajesDisponibles/"+token,
//        method: "post",
//        dataType: "json",
//        success: function(datos){
//            $.each(datos, function(i, personaje) {
//                $("#personajes2").append("<option value=" + personaje.id + ">" + personaje.nombre + "</option>");
//            });
//        },
//        error: function(e){
//            console.log("Error con el servidor");
//        }
//    });
//}

function cargarPartidas(){
    $.ajax({
        url: host + server + "partida/partidasEnEspera",
        method: "post",
        dataType: "json",
        success: function(datos) {
            $(".partidas").html("");
            $.each(datos, function(i, partida) {
                var fechaFormateada = formatearFecha(partida.fechaInicio.date);
                $(".partidas").append("<option value=" + partida.token + ">" + partida.token + " creado el " + fechaFormateada + "</option>");
            });
//            $("#personajes2").html();
        }
    });
}

function empezarPartida() {
    $.ajax({
        url: host + server + "partida/empezar/" + idPartida,
        method: "post",
        dataType: "json",
        data: {usuarios: listaUsuariosAceptados},
        success: function(datos) {
            if (datos.id) {
//                alert("Ya se han unido " + numJugadores + " jugadores, la partida empezara en breve...");
                $("#informacion").text("Ya se han unido " + numJugadores + " jugadores, la partida empezara en breve...");
                socket.emit("empezar_partida", {sala: sala, usuarios: listaUsuariosAceptados, idPartida: idPartida});
                listaUsuarios = listaUsuariosAceptados;
                turno = listaUsuarios[0];
                turno.pos = 0;
                modulo = "tablero";
                cargarModulo(modulo);
            }
        },
        error: function(e) {
            alert("erroooorrr!");
        }
    });
}

function formatearFecha(fecha) {
    var partesFecha = fecha.split(" ");
    partesFecha = partesFecha[0];
    partesFecha = partesFecha.split("-");
    var fechaFormateada = partesFecha[2] + "/" + partesFecha[1] + "/" + partesFecha[0];
    return fechaFormateada;
}

socket.on("confirmacion_solicitud", function(datos) {
    $(".confirmacion").append("<p>" + datos.usuario.nombre + " ha confirmado su solicitud</p>");
    listaUsuariosAceptados.push(datos.usuario);
    if (listaUsuariosAceptados.length === numJugadores) {
        empezarPartida();
    }
});

socket.on("mensaje_sala", function(datos) {
    $("#tRecibido").append(datos.usuario.nombre + " ha dicho: " + datos.mensaje + "\n");
});

socket.on("empezar_partida", function(datos) {
//    alert("La partida esta lista para empezar!");
    $("#informacion").text("La partida esta lista para empezar!");
    idPartida = datos.idPartida;
    listaUsuarios = datos.usuarios;
    turno = listaUsuarios[0];
    turno.pos = 0;
    modulo = "tablero";
    cargarModulo(modulo);
});