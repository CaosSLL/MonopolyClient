var host = "http://localhost/";
var server = "MonopolyServer/web/app_dev.php/";
var app = "MonopolyClient/public_html/";
var modulo = "";

var contenido = "";

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
        if(modulo != $(this).attr("href")) {
            modulo = $(this).attr("href");
            cargarModulo(modulo);
        }
    }); 

});

function cargarModulo(modulo) {
    contenido.slideUp("slow", function() {
        $("#js").remove();
        $("#css").remove();
        $("head").append('<script type="text/javascript" src="recursos/js/' + modulo + '.js" id="js"></script>');
        $("head").append('<link type="text/css" rel="stylesheet" href="recursos/css/' + modulo + '.css" id="css"/>');
        contenido.load(host + app + modulo + ".html");        
    });
    contenido.slideDown("slow");        
}