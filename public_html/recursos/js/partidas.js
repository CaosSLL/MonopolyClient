var listaUsuariosAceptados = new Array();
var datosPartida;
var numJugadores = 0;

$(document).ready(function() {

//    if (unirse) {
//        $(".crearPartida").hide();
//        $(".unirsePartida").show();
//    } else {
//        $(".unirsePartida").hide();
//        $(".crearPartida").show();
//    }
    
//    $("#tUsuario").on("keydown", function(e) {
//        if (e.keyCode == 13) {
//            var texto = $("#tUsuario").val().split("-");
//            usuario.id = texto[0];
//            usuario.nombre = texto[1];
//            $("#divUsuario").text(usuario.nombre);
//        }
//    });

    $("#tEnviar").on("keydown", function(e) {
        if (e.keyCode == 13) {
            $("#tRecibido").append($(this).val() + "\n");
            socket.emit("mensaje_sala", {sala: sala, usuario: usuario, mensaje: $(this).val()});
            $("#tEnviar").val("");
        }
    });

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

    $.ajax({
        url: host + server + "partida/partidasEnEspera",
        method: "post",
        dataType: "json",
        success: function(datos) {
            $.each(datos, function(i, partida) {
                $(".partidas").append("<option value=" + partida.token + ">" + partida.token + " creado el " + partida.fechaInicio.date + "</option>");
            });
        }
    });

    $("#formularioCrearPartida").on("submit", function(e) {
        e.preventDefault();

        var num = Math.floor(Math.random() * (100000 - 1 + 1)) + 1
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
                socket.emit("solicitud", {sala: sala, usuario: usuario});
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
//        sala = parseInt($(this).siblings(".sala").text());
        sala = $(".partidas").val();
        usuario.personaje = $("#personajes2").val();
        usuario.personajeNombre = $("#personajes2 option:selected").text()
        socket.emit("confirmacion_solicitud", {sala: sala, usuario: usuario});
        $(".confirmacion").append("Espera a que se unan suficientes jugadores...");
        $("#bUnirsePartida").attr("disabled",true);
    });

});

function empezarPartida() {
    $.ajax({
        url: host + server + "partida/empezar/" + idPartida,
        method: "post",
        dataType: "json",
        data: {usuarios: listaUsuariosAceptados},
        success: function(datos) {
            if (datos.id) {
//                alert("Se ha creado con exito!");
                alert("Ya se han unido " + numJugadores + " jugadores, la partida empezara en breve...");
                socket.emit("empezar_partida", {sala: sala, usuarios: listaUsuariosAceptados});
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
    alert("La partida esta lista para empezar!");
    listaUsuarios = datos.usuarios;
    turno = listaUsuarios[0];
    turno.pos = 0;
    modulo = "tablero";
    cargarModulo(modulo);
});
