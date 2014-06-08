var host = "http://localhost/";
var server = "MonopolyServer/web/app_dev.php/";
var app = "MonopolyClient/public_html/";
var modulo = "";

var usuario = {id: 0, nombre: "", personaje: "", personajeNombre: "", dinero: 1000, carcel: 0};
var sala;
var listaUsuarios = new Array();
var turno = null;
var idPartida = 0;

var contenido = "";

var socket = io.connect("http://localhost:8585");

$(document).ready(function() {

    contenido = $("#contenido");
    modulo = "inicio";


    cargarModulo(modulo);

//    $.ajax({
//        url: host + server + "usuario/autenticado",
//        method: "post",
//        dataType: "json",
//        success: function(datos) {
    if (usuario.nombre !== "") {
        $("#usuario").text("Hola amo");
    } else {
        $("#usuario").text("Logueate");
    }
//        }
//    });


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

//socket.on("solicitud", function(datos) {
//    $(".mensaje").append("<p>" + datos.usuario.nombre + " ha creado una partida en la sala <span class='sala'>" + datos.sala + "</span>, deseas unirte?<input type='button' class='bSi' value='Si'></p>");
//    $(".bSi").on("click", function() {
//        $(this).parent().remove();
//        unirse = true;
//        modulo = "partidas";
//        cargarModulo(modulo);
//    });
//});
