var host = "http://localhost/";
var server = "MonopolyServer/web/app_dev.php/";
var app = "MonopolyClient/public_html/";
var modulo = "";

var usuario = {id: 0, nombre: "", personaje: ""};
var sala;
var unirse = false;

var USUARIO;
var PASSWORD;

var contenido = "";

var socket = io.connect("http://localhost:8080");

$(document).ready(function() {

    contenido = $("#contenido");
    modulo = "inicio";


    cargarModulo(modulo);

    $.ajax({
        url: host + server + "usuario/autenticado",
        method: "post",
        dataType: "json",
        success: function(datos) {
            if (datos.autenticado) {
                $("#usuario").text("Hola amo");
            } else {
                $("#usuario").text("Logueate");
            }
        }
    });

    $(".ir").off().on("click", function(e) {
        e.preventDefault();
        if (modulo != $(this).attr("href")) {
            modulo = $(this).attr("href");
            if (modulo.match("/")) {
                modulo = modulo.split("/");
                if (modulo[1] == "crear") {
                    unirse = false;
                } else {
                    unirse = true;
                }
                cargarModulo(modulo[0]);
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
            success : function(datos){
                if(!datos.autenticado){
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
