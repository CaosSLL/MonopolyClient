inicio.js


function cargarEventos() {

//    imagenFondo
//    $(".boton").off().on("click", function(e) {
//        alert("holaaaaaa"); 
//    });

//    alert("Hola");
    $(".imagen1").hover(function() {
        $("#imagen2").show();
        $("#imagen2").css({
            top: $(".imagen1").position().top,
            left: $(".imagen1").position().left,
            zIndex: "1000"});
        $("#imagen2").animate({
            width: "+=10",
            height: "+=10"
        });
    }, function() {
        $("#imagen2").animate({
            width: "-=10",
            height: "-=10"
        });
        $("#imagen2").hide();
    });
//        alert("agrandar");

}

function imagenFondo() {
    var ancho = $(window).width();
    var alto = $(window).height();
    $("#container").css("background-size: " + ancho + " " + alto + ";");
}
