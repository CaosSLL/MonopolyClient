var clikado = false;
var posicionesCasilla = new Array();
var turno = 0;
var tieneTurno = false;

$(document).ready(function() {

    iniciarTablero();
    iniciarDado();
    iniciarFichas();
    cargarDatosJugadores();

});

socket.on("mensaje", function(datos) {
    console.log("Alguien ha hecho click en la ficha");
    $(".dado").text(datos.avance);
    moverFicha(datos.avance);
    cambiarTurno();
});

function iniciarDado() {
    var dado = $(".dado");
    dado.text("Tira!");
    dado.on("click", tirar);
}

function cargarDatosJugadores() {

    // Cargar fichas
    for (var i = 0; i < listaUsuarios.length; i++) {
        console.log(listaUsuarios[i]);
        $("#tablero").append("<div class='ficha' id='" + listaUsuarios[i].personajeNombre + "'><img src='recursos/images/fichas/" + listaUsuarios[i].personajeNombre + ".png'></div>");
        posicionesCasilla.push(0);
    }

    if (usuario.id == listaUsuarios[turno].id) {
        tieneTurno = true;
        $(".dado").css({backgroundColor: "#f2ea9d"});
        $(".dado").bind("click", tirar);
    } else {
        tieneTurno = false;
        $(".dado").css({backgroundColor: "gray"});
        $(".dado").unbind("click");
    }

}


function tirar() {
    var num = Math.floor(Math.random() * (6 - 1 + 1)) + 1
    $(".dado").text(num);
    moverFicha(num);
    socket.emit("mensaje", {avance: num, turno: turno});
    cambiarTurno();
}

function cambiarTurno() {
    if (turno >= listaUsuarios.length - 1) {
        turno = 0;
    } else {
        turno += 1;
    }

    if (usuario.id == listaUsuarios[turno].id) {
        tieneTurno = true;
        $(".dado").css({backgroundColor: "#f2ea9d"});
        $(".dado").bind("click", tirar);
    } else {
        tieneTurno = false;
        $(".dado").css({backgroundColor: "gray"});
        $(".dado").unbind("click");
    }

    console.log("turno: " + turno + " tiene turno? " + tieneTurno);
}

function iniciarFichas() {
    var ficha = $(".ficha");
    var casilla = $("#casilla0").position();
    ficha.css({
        top: (casilla.top + 10),
        left: (casilla.left + 10),
    });
}

function moverFicha(avance) {

    var personaje = listaUsuarios[turno].personajeNombre;
    var ficha = $("#" + personaje);
    var casillaActual = posicionesCasilla[turno];
    for (var i = (casillaActual + 1); i <= (casillaActual + avance); i++) {
        i > (40 - 1) ? c = i - 40 : c = i;
        var posicion = $("#casilla" + c).position();
        ficha.animate({
            top: posicion.top + 10,
            left: posicion.left + 10
        }, 200);
    }
    posicionesCasilla[turno] += avance;

}

function iniciarTablero() {
    var tablero = $("#tablero"); //Obtener el tablero como objeto JQuery

    var tabla;
    tabla = "<table> <tr> ";
    for (var i = 20; i <= 30; i++) {
        if (i == 22) {
            tabla += " <td class='casilla' id='casilla" + i + "'> <img src='recursos/images/casillas/es/prueba.jpg'> </td>";
        } else {
            tabla += " <td class='casilla' id='casilla" + i + "'> <img src='recursos/images/casillas/es/casilla" + i + ".jpg'> </td>";
        }
    }
    tabla += " </tr>";


    var j = 31;
    for (var i = 19; i >= 11; i--) {
        tabla += "<tr>";
        if (i == 17) {

            tabla += " <td class='casilla lateral' id='casilla" + i + "'> <img class='izquierda' src='recursos/images/casillas/es/eventoi.jpg'> </td>";
        } else {
            tabla += " <td class='casilla lateral' id='casilla" + i + "'> <img class='izquierda' src='recursos/images/casillas/es/casilla" + i + ".jpg'> </td>";
        }

        if (i == 19) {
            tabla += " <td id='casilla_central' colspan='9' rowspan='9' > <img class='central' src='recursos/images/casillas/es/central.jpg'> </td>";
        }

        if (j == 33) {
            tabla += " <td class='casilla lateral' id='casilla" + j + "'> <img class='derecha' src='recursos/images/casillas/es/eventod.jpg'> </td>";
        } else if (j == 36) {
            tabla += " <td class='casilla lateral' id='casilla" + j + "'> <img class='derecha' src='recursos/images/casillas/es/pruebad.jpg'> </td>";
        } else {
            tabla += " <td class='casilla lateral' id='casilla" + j + "'> <img class='derecha' src='recursos/images/casillas/es/casilla" + j + ".jpg'> </td>";
        }
        j++;
        tabla += "</tr>";
    }

    tabla += " <tr>";

    for (var i = 10; i >= 0; i--) {
        if (i == 2) {
            tabla += " <td class='casilla' id='casilla" + i + "'> <img src='recursos/images/casillas/es/evento.jpg'> </td>";
        } else if (i == 7) {
            tabla += " <td class='casilla' id='casilla" + i + "'> <img src='recursos/images/casillas/es/prueba.jpg'> </td>";
        } else {
            tabla += " <td class='casilla' id='casilla" + i + "'> <img src='recursos/images/casillas/es/casilla" + i + ".jpg'> </td>";
        }
    }

    tabla += "</tr> </table>";

    tablero.html(tabla);

}

function zoom() {

    //    $(".casilla").mouseenter(function() {
    $(".casilla").off().on("click", function() {
        //Cogemos el tamanio de la imagen inicial
        var alto = $(this).children().css("height");
        var ancho = $(this).children().css("width");
        //Sacamos top y left
        var topi = $(this).children().position().top;
        var lefti = $(this).children().position().left;

        //Se calcula para que quede centrada
        var ancho2 = ancho.substring(0, 2);
        var alto2 = alto.substring(0, 2);
        var tope = parseInt(topi) - parseInt(ancho2) / 3;
        var lefte = parseInt(lefti) - parseInt(alto2) / 3;

        //Creamos la etiqueta imagen
        var imagen = "<img id='imagenGrande2' src='" + $(this).children().attr("src") + "' style='height: " + alto + "; width: " + ancho + " '> </img>";

        //Aniadimos la imagen al div común
        $("#imagenGrande").html(imagen).show();

        //Colocamos la imagen en su sitio
        $("#imagenGrande").css({
            top: tope,
            left: lefte
        });

        //Agrandamos la imagen para que sea visible
        $("#imagenGrande2").animate({
            width: "+=50",
            height: "+=50",
            top: "-=5",
            left: "-=5"
        });
        $("#imagenGrande2").off().on("click", function() {
            $("#imagenGrande2").animate({
                width: "-=50",
                height: "-=50",
                top: "+=5",
                left: "+=5"
            });
            //Aniadimos la imagen al div común
            $("#imagenGrande").hide();
        });


    });
}