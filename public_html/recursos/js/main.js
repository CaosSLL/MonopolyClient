//var host = "http://192.168.1.107/";
var host = "http://localhost/";
var server = "MonopolyServer/web/app_dev.php/";
var app = "MonopolyClient/public_html/";
var modulo = "";

var usuario = {id: 0, nombre: "", personaje: "", personajeNombre: "", dinero: 1000, carcel: 0};
var sala;

// Chema
// Variables globales... antes estaban en tablero.js
var listaUsuarios = new Array();
var posesionesCasillas = new Array();
var posicionesCasilla = new Array();
var turno = 0;
var idPartida = 0;

var contenido = "";

var reunirse = false;

//var socket = io.connect("http://192.168.1.107:8585");
var socket = io.connect("http://localhost:8585");

$(document).ready(function() {

    contenido = $("#contenido");
    modulo = "inicio";


    cargarModulo(modulo);

    $.ajax({
        url: host + server + "usuario/autenticado",
        method: "post",
        dataType: "json",
        success: function(datos) {

            // Chema
            // Si el usuario esta logado que lleve a la pantalla de partidas directamente
            if (datos.autenticado) {
                $("#usuario").text(datos.nombre);
                usuario.nombre = datos.nombre;
                usuario.id = datos.id;
                idPartida = datos.partida;

                if (datos.estado == "jugando") {
                    console.log("Usuario logeado con partida empezada --> usuario: " + usuario.nombre + " partida: " + idPartida);
                    cargarDatosPartida();

                } else {
                    modulo = "partidas";
                    cargarModulo(modulo);
                }
            }

//            if (usuario.nombre !== "") {
//                $("#usuario").text("Hola amo");
//            } else {
//                $("#usuario").text("Logueate");
//            }
        }
    });


    $(".ir").off().on("click", function(e) {
        e.preventDefault();
        if (modulo != $(this).attr("href")) {
            modulo = $(this).attr("href");
//            if (modulo.match("/")) {
//                modulo = modulo.split("/");
//                if (modulo[1] == "crear") {
//                    unirse = false;
//                } else {
//                    unirse = true;
//                }
//                cargarModulo(modulo[0]);
//            } else {
            if (modulo == "ajustes") {
                if (usuario.nombre !== "") {
                    cargarModulo(modulo);
                } else {
                    alert("Tienes que loguearte");
                }
            } else {
                cargarModulo(modulo);
            }
        }
    });

    $("#logout").off().on("click", function(e) {
        $.ajax({
            url: host + server + "usuario/logout",
            method: "post",
            dataType: "json",
            success: function(datos) {
                if (!datos.autenticado) {
                    $("#usuario").text("Logueatee!!");
                    usuario.id = "";
                    usuario.nombre = "";
                    usuario.personaje = "";
                    modulo = "inicio";
                    cargarModulo(modulo);
                }
            }
        });
    });

    $("#volumen").off().on("click", function(e) {
        var oAudio = document.getElementById('audioBSO');
        var jqAudio = $("#volumen");
        if (oAudio.paused) {
            oAudio.play();
            $("#volumen").removeClass("ui-icon-play");
            $("#volumen").addClass("ui-icon-stop");
            console.log($("#volumen").attr("class"));
        } else {
            oAudio.pause();
            $("#volumen").removeClass("ui-icon-stop");
            $("#volumen").addClass("ui-icon-play");
            console.log($("#volumen").attr("class"));
        }

    });

    $("#bajarVolumen").off().on("click", function(e) {
        var oAudio = document.getElementById('audioBSO');
        if (oAudio.volume !== 0) {
            oAudio.volume -= 0.1;
        }
    });

    $("#subirVolumen").off().on("click", function(e) {
        var oAudio = document.getElementById('audioBSO');
        if (oAudio.volume !== 1) {
            oAudio.volume += 0.1;
        }
    });


});

// Chema
// Funcion para cargar la informacion de la partida actual
function cargarDatosPartida() {
    $.ajax({
        url: host + server + "jugador/recuperarEstado/" + usuario.id + "/" + idPartida,
        method: "post",
        dataType: "json",
        success: function(datos) {
            console.log(datos);

            for (var i = 0; i < datos[1].length; i++) {
                var jug = datos[1][i];
                var usu = jug.idUsuario;
                var objUsuario = {id: usu.id, nombre: usu.nombre, dinero: jug.dinero, carcel: 0, personaje: jug.idPersonaje.id, personajeNombre: jug.idPersonaje.nombre};
                listaUsuarios.push(objUsuario);
                posicionesCasilla.push(datos[1][i].posicion);
            }

//            for(var i = 0; i < datos[2].length; i++) {
//                posicionesCasilla.push(datos[1][i]);
//            }

            var part = datos[0]["idPartida"];
            bote = part.boteComun;
            sala = part.token;

            socket.emit("volver_unirse", {sala: sala});

            reunirse = true;

            modulo = "tablero";
            cargarModulo(modulo);

        }
    });
}

function cargarModulo(modulo) {
    console.log(modulo);
    contenido.slideUp("slow", function() {
        $("#js").remove();
        $("#css").remove();
        contenido.load(host + app + modulo + ".html", function() {
            console.log(modulo);
            $("head").append('<script type="text/javascript" src="recursos/js/' + modulo + '.js" id="js"></script>');
            $("head").append('<link type="text/css" rel="stylesheet" href="recursos/css/' + modulo + '.css" id="css"/>');
        });

    });
    contenido.slideDown("slow");
}

// Chema
// Sirve para re-unirse en la sala
socket.on("volver_unirse", function(datos) {
    datos.turno = turno;
    socket.emit("conf_volver_unirse", datos);
});

socket.on("conf_volver_unirse", function(datos){
    turno = datos.turno;
});

//socket.on("solicitud", function(datos) {
//    $(".mensaje").append("<p>" + datos.usuario.nombre + " ha creado una partida en la sala <span class='sala'>" + datos.sala + "</span>, deseas unirte?<input type='button' class='bSi' value='Si'></p>");
//    $(".bSi").on("click", function() {
//        $(this).parent().remove();
//        unirse = true;
//        modulo = "partidas";
//        cargarModulo(modulo);
//    });
//});
