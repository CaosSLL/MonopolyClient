var clikado = false;
var posicionesCasilla = new Array();
var turno = 0;
var tieneTurno = false;
var bote = 0;

$(document).ready(function() {

    iniciarTablero();
//    iniciarDado();
    iniciarFichas();
    cargarDatosJugadores();
    $("#botonComprar").off().on("click", function(e) {
        comprar(posicionesCasilla[turno]+1);
    });
    
    $("#paneles").accordion();

    $("#botonTurno").off().on("click", function(){
        
        cambiarTurno();
        socket.emit("cambiar_turno", { sala: sala });
    });

});

socket.on("cambiar_turno", function(datos){
    cambiarTurno();
});

socket.on("movimiento_partida", function(datos) {
    trace("Evento mover ficha -->");
    $(".dado").text(datos.avance);
    moverFicha(datos.avance);
//    cambiarTurno();
//    turno = datos.turno;
});

socket.on("cambio_bote", function(datos) {
    trace("Evento cambiar bote-->");
    $("#bote").text(datos.bote);
    bote = datos.bote;
});

socket.on("infoPartida", function(datos) {
//    trace("Evento cambiar bote-->");
    $("#infoPartida").text(datos.texto);
});

function emitirInformacion(texto) {
    $("#infoPartida").text(texto);
    socket.emit("infoPartida", {sala: sala, texto: texto});
}

function iniciarDado() {
    trace("Iniciar dado -->");
    var dado = $(".dado");
    dado.text("Tira!");
}

function iniciarFichas() {
    trace("Iniciar Fichas -->");
    var ficha = $(".ficha");
    var casilla = $("#casilla0").position();
    ficha.css({
        top: (casilla.top + 10),
        left: (casilla.left + 10),
    });
}

function cargarDatosJugadores() {
    trace("Cargar datos jugadores -->");
    var panel = $(".panel");
    var cabecera = $(".cabecera");
    var jugadorCab, jugadorPan;
    // Cargar fichas y paneles información jugadores
    for (var i = 0; i < listaUsuarios.length; i++) {
        console.log(listaUsuarios[i]);
        $("#tablero").append("<div class='ficha' id='" + listaUsuarios[i].personajeNombre + "'><img src='recursos/images/fichas/" + listaUsuarios[i].personajeNombre + ".png'></div>");
        posicionesCasilla.push(0);

        if (i === 0) {
            jugadorCab = cabecera;
            jugadorPan = panel;
            
        } else {
            jugadorCab = cabecera.clone();
            jugadorPan = panel.clone();
            $("#paneles").append(jugadorCab);
            $("#paneles").append(jugadorPan);
            jugadorCab.attr("id", "cabUsu" + i);
            jugadorPan.attr("id", "panelUsu"+i);
        }
        
        jugadorCab.find(".nombre").text(listaUsuarios[i].nombre);
        jugadorCab.find(".personaje").text(listaUsuarios[i].personajeNombre);
        jugadorCab.find(".dinero").text(listaUsuarios[i].dinero);
        jugadorPan.find(".tarjetas").text("Pruebas");
        
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
    trace("Tirar dados -->");
    var num = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
    $(".dado").text(num);
    moverFicha(num);
    socket.emit("movimiento_partida", {sala: sala, avance: num, turno: turno});
    $("#botonComprar").removeAttr("disabled");
    $("#botonComprar").removeClass("disabled");
    $(".dado").css({backgroundColor: "gray"});
        $(".dado").unbind("click");
//    cambiarTurno();
}

function cambiarTurno() {
    trace("Cambiar turno -->");
    if (turno >= listaUsuarios.length - 1) {
        turno = 0;
    } else {
        turno += 1;
    }

    if (usuario.id == listaUsuarios[turno].id) {
        if (usuario.carcel === 0) {
            tieneTurno = true;
            $(".dado").css({backgroundColor: "#f2ea9d"});
            $(".dado").bind("click", tirar);
        } else {
            usuario.carcel -= 1;
        }
    } else {
        tieneTurno = false;
        $(".dado").css({backgroundColor: "gray"});
        $(".dado").unbind("click");
    }

    $("#infoPartida").text("El turno es de: " + listaUsuarios[turno].nombre);
}

function moverFicha(avance, noCobrar) {
    trace("Mover ficha -->");
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
    trace("Iniciar tablero -->");

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

    zoom();
}

function zoom() {
    trace("zoom -->");

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

function trace(mensaje) {
    try {
        console.log(mensaje);
    } catch (e) {

    }
}

function tienePosesiones() {
    $.ajax({
        url: host + server + "posesioncasilla/comprobar/" + usuario.id + "/" + idPartida,
        method: "post",
        dataType: "json",
        success: function(datos) {
            if (!isNaN(datos.idJugador)) {
                $("#botonHipotecar").removeAttr("disabled");
                $("#botonHipotecar").removeClass("disabled");
            }
        },
        error: function(e) {
            console.log("error");
        }
    });
}

function comprobarTipoCasilla(idCasilla) {
    $.ajax({
        url: host + server + "casilla/" + idCasilla + "/show",
        method: "post",
        dataType: "json",
        success: function(datos) {
            switch (datos.tipo) {
                case "especial":
                    casillasEspecial(datos);
                    break;
                case "tierra", "tarjetas", "bastones", "caballos":
                    comprobarPosesionCasilla(idCasilla);
                    break;
                case "impuestos":
                    casillasImpuestos(datos);
                    break;
                default :
                    alert("No hay tipo de casilla O.O");
                    break;
            }
        },
        error: function(e) {
            console.log("error");
        }
    });
}

function casillasEspecial(datos) {
    switch (datos.numero) {
        case 20:
            usuario.dinero += parseInt(bote);
            bote = 0;
            $("#bote").text(bote);
            socket.emit("cambio_bote", {sala: sala, bote: bote});
            break;
        case 30:
            usuario.carcel = 3;
            moverFicha(20);
            break;
    }
}

function casillasImpuesto(datos) {
    usuario.dinero -= paseInt(datos.precio);
    bote += paseInt(datos.precio);
    $("#bote").text(bote);
    socket.emit("cambio_bote", {sala: sala, bote: bote});
}

function comprobarPosesionCasilla(idCasilla) {
    $.ajax({
        url: host + server + "posesioncasilla/comprobarPosesion/" + idCasilla + "/" + idPartida,
        method: "post",
        dataType: "json",
        success: function(datos) {
            if (isNaN(datos.idJugador.id)) {
                if (usuario.dinero >= datos.idCasilla.precio) {
                    $("#botonComprar").removeAttr("disabled");
                    $("#botonComprar").removeClass("disabled");
                }
            } else if (datos.idJugador.id !== usuario.id) {
                alert("te toca pagar");
            } else {
                alert("es tuya");
            }
        },
        error: function(e) {
            console.log("error");
        }
    });
}

function comprar(idCasilla) {
    //Obtener casilla
    $.ajax({
        url: host + server + "casilla/" + idCasilla + "/show",
        method: "post",
        dataType: "json",
        success: function(datosCasilla) {
            //Modificamos bd, añadimos registro de PosesionCasilla y Jugador
            $.ajax({
                url: host + server + "posesioncasilla/comprar/" + idCasilla + "/" + usuario.id + "/" + idPartida + "/" + usuario.dinero,
                method: "post",
                dataType: "json",
                success: function(datosCrear) {
                    if (datosCrear.idPosesionCasilla !== 0) {
                        //Restamos al jugador
                        usuario.dinero -= datosCasilla.precio;
                        var texto = "El usuario " + usuario.nombre + " ha comprado la casilla " + datosCasilla.nombre;
                        emitirInformacion(texto);
                        //Añadir carta a panel
                    } else {
                        alert("No se ha podido realizar la compra");
                        var texto = "El usuario " + usuario.nombre + " no ha podido comprar la casilla " + datosCasilla.nombre;
                        emitirInformacion(texto);
                    }
                },
                error: function(e) {
                    console.log("error");
                }
            });
        },
        error: function(e) {
            console.log("error");
        }
    });
}
