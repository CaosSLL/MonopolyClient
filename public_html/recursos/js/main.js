var host = "http://localhost/";
var server = "MonopolyServer/web/app_dev.php/";
var app = "MonopolyClient/public_html/";

var contenido ="";

$(document).ready(function(){
    
    contenido = $("#contenido");
    
    cargarInicio();
    
    $.ajax({
        url: host + server + "usuario/autenticado",
        method: "post",
        dataType: "json",
        success: function(datos){
            if(datos.autenticado){
                $("#usuario").text("Hola amo");
            }else{
                $("#usuario").text("Logueate");
            }
        }
    });
    
    
    
});

function cargarInicio(){
    contenido.load(host + app + "inicio.html");
}