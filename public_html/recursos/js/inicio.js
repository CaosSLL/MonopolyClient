
function cargarEventos() {
    
//    imagenFondo
//    $(".boton").off().on("click", function(e) {
//        alert("holaaaaaa"); 
//    });

    alert("Hola");
    $(".imagen1").click(function(){
        //$(this).css("display: block");
        alert("agrandar");
    });
}

function imagenFondo(){
    var ancho = $(window).width();
    var alto = $(window).height();
    $("#container").css("background-size: "+ancho+" " + alto +";");
}