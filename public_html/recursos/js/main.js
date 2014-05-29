var host = "http://localhost/";
var server = "MonopolyServer/web/app_dev.php/";
var app = "MonopolyClient/public_html/";
var modulo = "";

var contenido = "";

$(document).ready(function() {

    contenido = $("#contenido"); 
    modulo = "inicio";


    cargarModulo();

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

    function cargarModulo() {
        contenido.hide("bind");
        contenido.load(host + app + modulo + ".html", function() {
            cargarEventos();
            $(".ir").off().on("click", function(e) {
                e.preventDefault();
                modulo = $(this).attr("href");
                cargarModulo();
            });
            contenido.show("bind");
        });
    }

});
