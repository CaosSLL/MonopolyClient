/*************************************/
/* DECLARACIÓN DE VARIABLES GLOBALES */
/*************************************/
var clikado = false;
//var posicionesCasilla = new Array();
//var turno = 0;
var tieneTurno = false;
var bote = 0;
var casillas = new Array();
var eventos = new Array(); // Aída -> array para guardar las tarjetas de eventos
var pruebas = new Array(); // Aída -> array para guardar las tarjetas de pruebas


/**************************************************/
/* FUNCIONES QUE SE CARGARÁN AL INICIAR LA PÁGINA */
/**************************************************/
$(document).ready(function() {
    // Iniciamos todos los componentes
    iniciarTablero();
//    iniciarDado();
    iniciarFichas();
    cargarDatosJugadores();

    // Chema
    // Creo un velo con una imagen de carga para que no se vea el tablero hasta
    // que esté completamente cargado.
    var velo = $("<div class='velo'><img src='recursos/images/ico_cargando.gif'></div>");
    velo.css({
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        zIndex: 1000,
        backgroundColor: "black"
    });
    $("#contenido").append(velo);
    $(".velo img").css({
        position: "absolute",
        top: "100px",
        left: "50%",
        marginLeft: "-150px"
    });

    // Obtener casillas 
    $.ajax({
        url: host + server + "casilla",
        method: "post",
        dataType: "json",
        success: function(datos) {
            casillas = datos;
        }
    });

    //Olga.- comento que no este el evento del boton click desde el principio
//    $("#botonComprar").bind("click", comprar);
//    $("#botonComprar").removeClass("disabled");

    //Dialog para las cartas casillas
    $("#dialogo").dialog({
        autoOpen: false,
        height: 600,
        width: 350,
        modal: true,
        buttons: {
            "Aceptar": function() {
                comprar(posicionesCasilla[turno] + 1);
                $("#botonComprar").unbind("click");
                $("#botonComprar").addClass("disabled");
                $(this).dialog("close");
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        },
        close: function() {
        }
    });

    //OLGA, le cambio el tamaño para que se ajuste bien la imagen
    $("#dialogoInfo").dialog({
        autoOpen: false,
        height: 670,
        width: 400,
        modal: true,
        buttons: {
            "Aceptar": function() {
                //OLGA, como solo es de información no hace nada
//                comprar(posicionesCasilla[turno] + 1);
//                $("#botonComprar").unbind("click");
//                $("#botonComprar").addClass("disabled");
                $(this).dialog("close");
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        },
        close: function() {
        }
    });

    //OLGA, que funcione el link para ver la información de la propiedad al clicar en ella
    $(".color").off().on("click", function(e) {
        var casilla = e.target.id;
        $("#imagenCartaCasillaInfo").attr("src", "recursos/images/carta-casilla/es/cartacasilla" + casilla + ".jpg");
        $("#dialogoInfo").dialog("open");
    });

    // Con jQueryui hacemos que los paneles de información de los jugadoes se muestren en forma de acordeón
    $("#paneles").accordion({
        heightStyle: "content"
    });

    //OLGA
    // Asociamos el método botonHipotecar() al botón de hipotecar
    $("#botonHipotecar").off().on("click", function(e) {
        botonHipotecar();
    });

    //OLGA
    // Asociamos el método botonDesHipotecar() al botón de deshipotecar
    $("#botonDesHipotecar").off().on("click", function(e) {
        botonDesHipotecar();
    });

    //OLGA, que al cambiar la propiedad seleccionada en el dialog de hipotecar se cambie la imagen
    $('select#propiedad1').off().on('change', function() {
        var valor = $(this).val();
        $("#imagenCartaCasillaHipotecar").attr("src", "recursos/images/carta-casilla/es/cartacasilla" + valor + ".jpg");
    });

    // Asociamos el evento de cambiar turno al boton de pasar
    $("#botonTurno").off().on("click", function() {

        // Chema
        // Guardo en la base de datos los cambios del turno
        turnoSig = (turno >= listaUsuarios.length - 1) ? 0 : turno + 1;
        $.ajax({
            url: host + server + "jugador/actualizar/" + listaUsuarios[turno].id + "/" + listaUsuarios[turno].personaje + "/" + idPartida,
            method: "post",
            dataType: "json",
            data: {dinero: listaUsuarios[turno].dinero, posicion: posicionesCasilla[turno], carcel: false, bote: bote, idUsuarioSig: listaUsuarios[turnoSig].id},
            success: function(datos) {
                if (datos.actualizado) {
                    cambiarTurno();
                    socket.emit("cambiar_turno", {sala: sala});
                    deshabilitarBotones();
                }
            }
        });

    });

    //OLGA
    // Hacemos que el div#clickBotonHipotecar sea un dialog
    $("#clickBotonHipotecar").dialog({
        autoOpen: false,
        height: 700,
        width: 400,
        modal: true,
        buttons: {
            "Aceptar": function() {
                var casilla = $("#propiedad1 option:selected").val();
                hipotecar(casilla);
                $(this).dialog("close");
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        },
        close: function() {
        }
    });

    //OLGA
    // Hacemos que el div#clickBotonDesHipotecar sea un dialog
    $("#clickBotonDesHipotecar").dialog({
        autoOpen: false,
        height: 700,
        width: 400,
        modal: true,
        buttons: {
            "Aceptar": function() {
                var casilla = $("#propiedad2 option:selected").val();
                desHipotecar(casilla);
                $(this).dialog("close");
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        },
        close: function() {
        }
    });
    
    // AÍDA
    // Función que se conecta con el server para obtener todas las tarjetas y clasificarlas como pruebas y eventos
    $.ajax({
        url: host + server + "tarjeta",
        method: "post",
        dataType: "json",
        success: function(datos) {
            $.each(datos, function(indice, tarjeta) {
                if(tarjeta.respuestas === null) {
                    eventos.push(tarjeta);
                } else {
                    pruebas.push(tarjeta);                    
                }
            });
            trace(eventos);
            trace(pruebas);
        }
    });

});

/***************************************************/
/* FUNCIONES DEL SERVERNODE QUE ESTÁN A LA ESCUCHA */
/***************************************************/
// Función que está a la escucha de los cambios de turno
socket.on("cambiar_turno", function(datos) {
    cambiarTurno();
});

// Función que está a la escucha de los movimientos
socket.on("movimiento_partida", function(datos) {
    trace("Evento mover ficha -->");
    $(".dado").text(datos.avance);
    moverFicha(datos.avance, datos.cobrar);
//    cambiarTurno();
//    turno = datos.turno;
});

// Función que está a la escucha de los cambios en el bote común
socket.on("cambio_bote", function(datos) {
    trace("Evento cambiar bote-->");
    $("#bote").text(datos.bote);
    bote = datos.bote;
});

// Función que está a la escucha de los cambios de dinero de los jugadores
socket.on("cambioDinero", function(datos) {
    trace("-- CAMBIO EN EL DINERO --");
    //OLGA, cambio para que se le pase el turno y asi poder modificar lo de los otros jugadores
    $("#cabeUsu" + datos.turno + " .dinero").text(datos.usuario.dinero);
    listaUsuarios[datos.turno].dinero = datos.usuario.dinero;
//    trace(datos.usuario.id + " " + turno);
});

//Función a la escucha de los cambios de las listas de casillas compradas. 
socket.on("casillasCompradas", function(datos) {
    trace("-- CAMBIO LISTA CASILLAS --");
    var numCas = datos.casillaComprada.numeroCasilla;
    $("#panelUsu" + turno + " ." + casillas[numCas].color + " ul").append("<li id='" + casillas[numCas].numero + "'>" + casillas[numCas].nombre + "</li>");
    listaUsuarios[turno].dinero = datos.usuario.dinero;

    //OLGA
    //Cuando reciba que otro jugador a comprado se añada a su array la casilla comprada con el jugador que la ha comprado.
    posesionesCasillas.push(datos.casillaComprada);
//    trace(datos.usuario.id + " " + turno);
});

// Función que está a la escucha de los cambios en el panel de información
socket.on("infoPartida", function(datos) {
//    trace("Evento cambiar bote-->");
    $("#infoPartida").text(datos.texto);
});

/*********************/
/* FUNCIONES LOCALES */
/*********************/
/**
 * Función que se encarga de emitir un mensaje en el panel de información
 * 
 * @param {type} texto
 *      Mensaje que se escribirá en el panel
 *      
 */
function emitirInformacion(texto) {
    $("#infoPartida").text(texto);
    socket.emit("infoPartida", {sala: sala, texto: texto});
}



/**
 * Función que se encarga de iniciar el dado
 * 
 */
function iniciarDado() {
    trace("Iniciar dado -->");
    var dado = $(".dado");
    dado.text("Tira!");
}

/**
 * Función que se encarga de iniciar las fichas
 * 
 */
function iniciarFichas() {
    trace("Iniciar Fichas -->");
    var ficha = $(".ficha");
    var casilla = $("#casilla0").position();
    ficha.css({
        top: casilla.top,
        left: casilla.left
    });
}

/**
 * Función que se encarga de cargar todos los datos de los jugadores en los paneles 
 * 
 */
function cargarDatosJugadores() {
    trace("Cargar datos jugadores -->");
    var panel = $(".panel");
    var cabecera = $(".cabecera");
    var jugadorCab, jugadorPan;
    // Cargar fichas y paneles información jugadores
    for (var i = 0; i < listaUsuarios.length; i++) {
        console.log(listaUsuarios[i]);
        $("#tablero").append("<div class='ficha' id='" + listaUsuarios[i].personajeNombre + "'><img src='recursos/images/fichas/" + listaUsuarios[i].personajeNombre + ".png'></div>");

        if (!reunirse) {
            posicionesCasilla.push(0);
        }

        if (i === 0) {
            jugadorCab = cabecera;
            jugadorPan = panel;

        } else {
            jugadorCab = cabecera.clone();
            jugadorPan = panel.clone();
            $("#paneles").append(jugadorCab);
            $("#paneles").append(jugadorPan);
            jugadorCab.attr("id", "cabeUsu" + i);
            jugadorPan.attr("id", "panelUsu" + i);
        }

        jugadorCab.find(".nombre").text(listaUsuarios[i].nombre);
        jugadorCab.find(".personaje").text(listaUsuarios[i].personajeNombre);
        jugadorCab.find(".dinero").text(listaUsuarios[i].dinero);
//        jugadorPan.find(".tarjetas").text("Pruebas");

    }

    if (usuario.id === listaUsuarios[turno].id) {
        tieneTurno = true;
        $(".dado").css({backgroundColor: "#f2ea9d"});
        $(".dado").bind("click", tirar);
        $("#botonHipotecar").removeClass("disabled");
        $("#botonHipotecar").bind("click");
        $("#botonDesHipotecar").removeClass("disabled");
        $("#botonDesHipotecar").bind("click");
    } else {
        tieneTurno = false;
        $(".dado").css({backgroundColor: "gray"});
        $(".dado").unbind("click");
    }

}

var pos = 0;
//OLGA variable global para guardar el número sacado en los dados.
var dados = 0;
/**
 * Función que calcula un número aleatorio del 1 al 6 para el dado,
 * habilita el botón de pasar turno y comprueba la casilla en la que ha caído el jugador
 * 
 */
function tirar() {
    trace("Tirar dados -->");
    if (pos == 0) {
//        num = Math.floor(Math.random() * 6) + 1;
        num = 7;
    } else {
        num = pos;
    }
//    var num2 = Math.floor(Math.random() * 6) + 1;
    //OLGA
    dados = num;
//    dador = num + num2;

    $(".dado").text(num);
    moverFicha(num, true);
    socket.emit("movimiento_partida", {sala: sala, avance: num, cobrar: true, turno: turno});
//    $("#botonComprar").removeAttr("disabled");
//    $("#botonComprar").removeClass("disabled");
    $("#botonTurno").removeClass("disabled");
    comprobarTipoCasilla(posicionesCasilla[turno]);
    $(".dado").css({backgroundColor: "gray"});
    $(".dado").unbind("click");
//    cambiarTurno();
    emitirInformacion(usuario.nombre + " ha sacado un " + num);
}

//OLGA
//funcion para tirar los dados en el caso de caer de tener que pagar si caes en un baston
//function tirarDados() {
//    trace("Tirar dados -->");
//    if (pos == 0) {
//        num = Math.floor(Math.random() * 6) + 1;
//    } else {
//        num = pos;
//    }
////    var num2 = Math.floor(Math.random() * 6) + 1;
//    $(".dado").text(num);
//    $(".dado").css({backgroundColor: "gray"});
//    $(".dado").unbind("click");
//    return num;
//}

/**
 * Función que gestiona el cambio de turno
 * (teniendo en cuenta si el jugador está en la cárcel)
 * 
 */
function cambiarTurno() {
    trace("Cambiar turno -->");
    if (turno >= listaUsuarios.length - 1) {
        turno = 0;
    } else {
        turno += 1;
    }

    if (usuario.id === listaUsuarios[turno].id) {
        if (usuario.carcel === 0) {
            tieneTurno = true;
            $(".dado").css({backgroundColor: "#f2ea9d"});
            $(".dado").bind("click", tirar);
            $("#botonHipotecar").removeClass("disabled");
            $("#botonDesHipotecar").removeClass("disabled");

//            $("#botonComprar").bind("click", comprar);
//            $("#botonComprar").removeClass("disabled");

        } else {
            tieneTurno = false;
            usuario.carcel -= 1;
        }
    } else {
        tieneTurno = false;
        $(".dado").css({backgroundColor: "gray"});
        $(".dado").unbind("click");
        deshabilitarBotones();
    }

    emitirInformacion("El turno es de: " + listaUsuarios[turno].nombre);
}

/**
 * Función que realiza y emite el movimiento de la ficha
 * 
 * @param {type} avance
 *      número de casillas que desplazará la ficha
 * @param {type} noCobrar
 *      booleano que indca si al pasar por la casilla de salida el jugador debe o no cobrar
 *      
 */
function moverFicha(avance, noCobrar) {
    trace("Mover ficha -->");
    var personaje = listaUsuarios[turno].personajeNombre;
    var ficha = $("#" + personaje);
    var casillaActual = posicionesCasilla[turno];
    for (var i = (casillaActual + 1); i <= (casillaActual + avance); i++) {
        i > (40 - 1) ? c = i - 40 : c = i;
        //OLGA
        if (c === 0) {
            trace("Pasa por la salida");
//            listaUsuarios[turno].dinero += 200;
//            usuario.dinero = listaUsuarios[turno].dinero;
            usuario.dinero += 200;
            $("#cabeUsu" + turno + " .dinero").text(usuario.dinero);
            //OLGA añado el campo turno
            socket.emit("cambioDinero", {sala: sala, usuario: usuario, turno: turno});
        }
        //FIN OLGA
        var posicion = $("#casilla" + c).position();
        ficha.animate({
            top: posicion.top + 10,
            left: posicion.left + 10
        }, 200);
    }
    //OLGA
    if ((posicionesCasilla[turno] + avance) >= 40) {
        posicionesCasilla[turno] = (posicionesCasilla[turno] + avance) - 40;
    } else {
        posicionesCasilla[turno] += avance;
    }
}

/**
 * Función que se encarga de dibujar el tablero
 * 
 */
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

    // Chema 
    // Oculta el velo de carga y coloca las fichas en su posicion.
    setTimeout(function() {
        colocarFichas();
        $("#informacion").css({
            height: $("#tablero").height()
        });
        $(".velo").fadeOut();
    }, 3000);

    zoom();
}

// Chema
// Funcion para colocar las fichas en su posición
function colocarFichas() {
    trace("Colocación de fichas");

    var fichas = $(".ficha");
    $.each(fichas, function(i, e) {
        var casilla = $("#casilla" + posicionesCasilla[i]).position();
        $(this).css({
            top: casilla.top,
            left: casilla.left
        });
    });

}

/**
 * Función que se encarga de hacer/deshacer la animación de zoom de una casilla 
 * al hacer click en ella
 * 
 */
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

/**
 * Función para escribir en la consola
 * @param {type} mensaje
 * 
 */
function trace(mensaje) {
    try {
        console.log(mensaje);
    } catch (e) {

    }
}

/**
 * Función que comprueba si una casilla tiene posesiones
 * 
 */
function tienePosesiones() {
//    $.ajax({
//        url: host + server + "posesioncasilla/comprobarPosesion/" + usuario.id + "/" + idPartida,
//        method: "post",
//        dataType: "json",
//        success: function(datos) {
//            if (!isNaN(datos.idJugador)) {
//                $("#botonComprar").bind("click", botonComprar);
//                $("#botonComprar").removeClass("disabled");
//                $("#botonHipotecar").bind("click", hipotecar);
//                $("#botonHipotecar").removeClass("disabled");
//            } else {
//                $("#botonComprar").unbind("click");
//                $("#botonComprar").addClass("disabled");
//                $("#botonHipotecar").unbind("click");
//                $("#botonHipotecar").addClass("disabled");
//            }
//        },
//        error: function(e) {
//            console.log("error");
//        }
//    });
}

/**
 * Función que comprueba el tipo de casilla en la que ha caído el jugador.
 * Llama a la función correspondiente según el tipo de la casilla 
 * 
 * @param {type} idCasilla
 *      id de la casilla que se quiere comprobar
 * 
 */
function comprobarTipoCasilla(idCasilla) {
    console.log(idCasilla);

//    $.ajax({
//        url: host + server + "casilla/" + idCasilla + "/show",
//        method: "post",
//        dataType: "json",
//        success: function(datos) {
//            console.log(datos);
    var casilla = casillas[idCasilla];
    switch (casilla.tipo) {
        case "especial":
            trace("Ha caido en una casilla especial");
            casillasEspecial(casilla);
            break;
        case "tierra":
            trace("Ha caido en una casilla tierra");
            comprobarPosesionCasilla(casilla);
            break;
        case "bastones":
            trace("Ha caido en una casilla bastones");
            comprobarPosesionCasilla(casilla);
            break;
        case "caballos":
            trace("Ha caido en una casilla caballos");
            comprobarPosesionCasilla(casilla);
            break;
        case "tarjetas":
            trace("Ha caido en una casilla tarjetas");
            casillaTarjetas(casilla);
            break;
        case "impuestos":
            trace("Ha caido en una casilla impuestos");
            casillasImpuesto(casilla);
            break;
        default:
            alert("No hay tipo de casilla O.O");
    }
//        },
//        error: function(e) {
//            console.log("error");
//        }
//    });
}


function casillasEspecial(datos) {
    switch (datos.numero) {
        case 20:
            usuario.dinero += bote;
            bote = 0;
            $("#bote").text(bote);
            socket.emit("cambio_bote", {sala: sala, bote: bote});
            break;
        case 30:
            usuario.carcel = 3;
            moverFicha(20, false);
            socket.emit("movimiento_partida", {sala: sala, avance: num, cobrar: false, turno: turno});
            break;
    }
}

// Aída 
function casillaTarjetas(datos) {
    trace(" --- TARJETA ---");
    // Creamos una variable que guarda la información que se emitirá a todos los jugadores
    var info = usuario.nombre + " ha caído en una tarjeta de ";
    var respuestas = new Array();
    var correcta = "";
    // Vaciamos el contenido del dialog
    $("#mostrarTarjetaContent").empty();
    // Comprobamos el tipo de tarjeta sobre la que ha caído
    if(datos.numero === 2 || datos.numero === 17 || datos.numero === 33) {        
        info += "evento";
        // Elegimos un nº aleatorio para las tarjetas de eventos
        var num = Math.floor((Math.random() * eventos.length));        
        var evento = eventos[num];
        trace("Número aleatorio: " + num);
        trace("Evento: " + evento);
        // Añadimos el texto del evento al contenido del dailog
        $("#mostrarTarjetaContent").append(evento.texto);
        // Configuramos el dialog
        $("#mostrarTarjeta").dialog({
            autoOpen: false,
            modal: true,
            dialogClass: "no-close",
            width: 400,
            buttons: {
                "Aceptar": function() {
                    if(evento.beneficio !== null) {
                        // Se le añade el beneficio al jugador
                        trace("Dinero user antes: " + usuario.dinero);
                        trace("Beneficio: " + evento.beneficio);
                        usuario.dinero += evento.beneficio;
                        trace("Dinero user después: " + usuario.dinero);
                        listaUsuarios[turno].dinero += evento.beneficio;
                        // Se modifica la información del panel                        
                        $("#cabeUsu" + turno + " .dinero").text(usuario.dinero);
                        // Se emite al resto de jugadores la información
                        socket.emit("cambioDinero", {sala: sala, usuario: listaUsuarios[turno], turno: turno});

                    } else {
                        // Se le resta la penalización al jugador
                        trace("Dinero user antes: " + usuario.dinero);
                        trace("Penalización: " + evento.penalizacion);
                        usuario.dinero -= evento.penalizacion;
                        listaUsuarios[turno].dinero -= evento.penalizacion;
                        // Se modifica la información del panel                        
                        $("#cabeUsu" + turno + " .dinero").text(usuario.dinero);
                        socket.emit("cambioDinero", {sala: sala, usuario: listaUsuarios[turno], turno: turno});
                        // Se añade al bote el dinero que pierde el jugador
                        bote += parseInt(evento.penalizacion);
                        // Se modifica la información en el panel 
                        $("#bote").text(bote);
                        // Se emite la información al resto de jugadores
                        socket.emit("cambio_bote", {sala: sala, bote: bote});
                    }
                    $(this).dialog("close");
                }
            }
        });
        
    } else {
        info += "prueba";  
        // Elegimos un nº aleatorio para las tarjetas de prueba
        var num = Math.floor((Math.random() * pruebas.length));
        var prueba = pruebas[num];
        trace("Número aleatorio: " + num);
        trace("Prueba: " + prueba);
        // Almacenamos en un array las posibles respuestas y en una variable la correcta
        respuestas = prueba.respuestas.split("/");
        correcta = respuestas[0];
        trace("Respuestas: " + respuestas);
        trace("Correcta: " + correcta);
        // Añadimos la pregunta y las respuestas al contenido del dailog
        $("#mostrarTarjetaContent").append("<p>" + prueba.texto + "</p><br/>");
        respuestas.sort(function() {
            return Math.random() - 0.5;
        });
        $.each(respuestas, function(i, respuesta) {
            $("#mostrarTarjetaContent").append("<input type='radio' name='respuestas' " +
                    "value='" + respuesta + "'>" + respuesta + "<br/>");                    
        });     
        // Configuramos el dialog
        $("#mostrarTarjeta").dialog({
            autoOpen: false,
            modal: true,
            dialogClass: "no-close",
            width: 400,
            buttons: {
                "Aceptar": function() {
                    trace("Correcta: " + correcta);
                    var respuestaUser = $("input[name=respuestas]:checked").val();
                    if(respuestaUser === correcta) {
                        trace("Respuesta correcta: " + respuestaUser);
                        // Se le añade el beneficio al jugador
                        trace("Dinero user antes: " + usuario.dinero);
                        trace("Beneficio: " + prueba.beneficio);
                        usuario.dinero += prueba.beneficio;
                        trace("Dinero user después: " + usuario.dinero);
                        listaUsuarios[turno].dinero += prueba.beneficio;
                        // Se modifica la información del panel                        
                        $("#cabeUsu" + turno + " .dinero").text(usuario.dinero);
                        // Se emite al resto de jugadores la información
                        socket.emit("cambioDinero", {sala: sala, usuario: listaUsuarios[turno], turno: turno});
                        emitirInformacion(usuario.nombre + " ha pasado la prueba");
                        
                    } else {
                        trace("Respuesta incorrecta: " + respuestaUser);
                        // Se le resta la penalización al jugador
                        trace("Dinero user antes: " + usuario.dinero);
                        trace("Penalización: " + prueba.penalizacion);
                        usuario.dinero -= prueba.penalizacion;
                        listaUsuarios[turno].dinero -= prueba.penalizacion;
                        // Se modifica la información del panel                        
                        $("#cabeUsu" + turno + " .dinero").text(usuario.dinero);
                        socket.emit("cambioDinero", {sala: sala, usuario: listaUsuarios[turno], turno: turno});
                        // Se añade al bote el dinero que pierde el jugador
                        bote += parseInt(prueba.penalizacion);
                        // Se modifica la información en el panel 
                        $("#bote").text(bote);
                        // Se emite la información al resto de jugadores
                        socket.emit("cambio_bote", {sala: sala, bote: bote});
                        
                        emitirInformacion(usuario.nombre + " ha fracasado en la prueba");
                    }
                    setTimeout($(this).dialog("close"), 3000);
                }
            }
        });       
    }
    
    emitirInformacion(info);
    trace(info);
    $("#mostrarTarjeta").dialog("open");
}

function casillasImpuesto(datos) {
    trace("Funcion casillasImpuestos");
    // Modificamos el dinero en la variable usuario, en el panel del usuario y lo emitimos al serverNode
    // Chema y OLGA (que no reste de ambos si no que iguale)
    listaUsuarios[turno].dinero -= parseInt(datos.precio);
    usuario.dinero = listaUsuarios[turno].dinero;
    trace("Dinero usuario" + usuario.dinero);

    $("#cabeUsu" + turno + " .dinero").text(usuario.dinero);
//    trace(usuario);
//OLGA añado campo turno
    socket.emit("cambioDinero", {sala: sala, usuario: listaUsuarios[turno], turno: turno});

    bote += parseInt(datos.precio);
    $("#bote").text(bote);
    socket.emit("cambio_bote", {sala: sala, bote: bote});
    emitirInformacion(usuario.nombre + " ha perdido " + datos.precio);
}

/**
 * OLGA
 * Funcion que comprueba si la casilla es de alguien, en ell caso de serlo tendrá que pagar, en el caso de no serlo podrá comprarla.
 * @param {Casilla} datosCasilla  Casilla en la que esta.
 * @returns {undefined}
 */

function comprobarPosesionCasilla(datosCasilla) {
    //OLGA
    //Para comprobar vamos a buscar en el array de posesionesCasillas la casilla.
    trace("PosesionesCasillas");
    var dueno = false;
    var casillaDueno = "";
    if (posesionesCasillas.length > 0) {
        for (var i = 0; i < posesionesCasillas.length; i++) {
            if (posesionesCasillas[i].idCasilla === datosCasilla.id) {
                trace("Tiene dueño");
                if (posesionesCasillas[i].idUsuario != usuario.id) {
                    trace("no es tuya");
                    dueno = true;
                    casillaDueno = posesionesCasillas[i];
                }
            }
        }
    }
    if (!dueno) {
        trace("No tiene dueño puede comprar");
        $("#botonComprar").bind("click", botonComprar);
        $("#botonComprar").removeClass("disabled");
    } else {
        //Le toca pagar el alquiler        
        pagarAlquiler(datosCasilla, casillaDueno);
    }
}

function comprar() {
    //Obtener casilla
    var casilla = casillas[posicionesCasilla[turno]];

    //OLGA, antes de comprar, comprobar que el usuario tiene dinero
    if (listaUsuarios[turno].dinero >= casilla.precio) {

        //Modificamos bd, añadimos registro de PosesionCasilla y Jugador
        $.ajax({
            url: host + server + "posesioncasilla/comprar/" + casilla.id + "/" + usuario.id + "/" + idPartida + "/" + listaUsuarios[turno].dinero,
            method: "post",
            dataType: "json",
            success: function(datosCrear) {
                if (!isNaN(datosCrear.idPosesionCasilla)) {
                    console.log("Comprar " + casilla.nombre);

                    // Chema y OLGA(cambio el orden y que no reste en ambos si no que iguale)
                    //Restamos al jugador
                    listaUsuarios[turno].dinero -= casilla.precio;
                    usuario.dinero = listaUsuarios[turno].dinero;

                    $("#cabeUsu" + turno + " .dinero").text(usuario.dinero);
                    //OLGA, añado campo turno
                    socket.emit("cambioDinero", {sala: sala, usuario: usuario, turno: turno});

                    //Modificamos el array de posesionesCasillas
                    //OLGA, añado campo para saber si esta hipotecada
                    var casillaComprada = {idCasilla: casilla.id, numeroCasilla: casilla.numero, idUsuario: usuario.id, hipotecada: false};
                    posesionesCasillas.push(casillaComprada);

                    //Añadir carta a panel
                    $("#panelUsu" + turno + " ." + casilla.color + " ul").append("<li id='" + casilla.numero + "'>" + casilla.nombre + "</li>");
                    socket.emit("casillasCompradas", {sala: sala, usuario: usuario, casillaComprada: casillaComprada});

                    var texto = "El usuario " + usuario.nombre + " ha comprado la casilla " + casilla.nombre;
                    emitirInformacion(texto);
                } else {
                    alert("No se ha podido realizar la compra");
                    var texto = "El usuario " + usuario.nombre + " no ha podido comprar la casilla " + casilla.nombre;
                    emitirInformacion(texto);
                }
            },
            error: function(e) {
                console.log("error");
            }
        });
    } else {
        alert("Lo siento pero no tienes dinero para comprar");
    }

}

//OLGA
//Funcion para cuando se le de al boton hipotecar compruebe si tiene posesiones y si tiene que muestre el dialog, si no un mensaje.
function botonHipotecar() {

    //Lo primero recorrer el array de posesionesCasillas y sacar las posesiones del jugador.
    var posesiones = new Array();
    if (posesionesCasillas.length !== 0) {
        for (var i = 0; i < posesionesCasillas.length; i++) {
            if (posesionesCasillas[i].idUsuario === usuario.id) {
                if (!posesionesCasillas[i].hipotecada) {
                    posesiones.push(posesionesCasillas[i]);
                }
            }
        }
        //Una vez que se tengan las posesiones, se comprueba si tiene alguna el jugador, y si no se pone mensaje de que no tiene
        if (posesiones.length !== 0) {
            var posesio = "";
            for (var j = 0; j < posesiones.length; j++) {
                trace("posesiones" + posesiones[j].idCasilla);
                $("#propiedad1").append("<option value=" + posesiones[j].numeroCasilla + ">" + casillas[posesiones[j].numeroCasilla].nombre + "</option>");
                if (j === 0)
                    $("#imagenCartaCasillaHipotecar").attr("src", "recursos/images/carta-casilla/es/cartacasilla" + (posesiones[j].numeroCasilla) + ".jpg");
                posesio += posesiones[j].numeroCasilla + " ";
            }
            $("#clickBotonHipotecar").dialog("open");
            alert(posesio);
        } else {
            alert("No tienes posesiones");
        }
    } else {
        alert("NO hay ninguna casilla comprada");
    }
}


//OLGA
//Funcion para se le de al boton deshipotecar compruebe si tiene posesiones hipotecadas y si tiene que muestre el dialog, si no un mensaje.
function botonDesHipotecar() {
    //Lo primero recorrer el array de posesionesCasillas y sacar las posesiones del jugador.
    var posesiones = new Array();
    if (posesionesCasillas.length !== 0) {
        for (var i = 0; i < posesionesCasillas.length; i++) {
            if (posesionesCasillas[i].idUsuario === usuario.id) {
                if (posesionesCasillas[i].hipotecada) {
                    posesiones.push(posesionesCasillas[i]);
                }
            }
        }
        //Una vez que se tengan las posesiones, se comprueba si tiene alguna el jugador, y si no se pone mensaje de que no tiene
        if (posesiones.length !== 0) {
            var posesio = "";
            for (var j = 0; j < posesiones.length; j++) {
                trace("posesiones" + posesiones[j].idCasilla);
                $("#propiedad2").append("<option value=" + posesiones[j].numeroCasilla + ">" + casillas[posesiones[j].numeroCasilla].nombre + "</option>");
                if (j === 0)
                    $("#imagenCartaCasillaDesHipotecar").attr("src", "recursos/images/carta-casilla/es/cartacasilla" + (posesiones[j].numeroCasilla) + ".jpg");
                posesio += posesiones[j].numeroCasilla + " ";
            }
            $("#clickBotonDesHipotecar").dialog("open");
            alert(posesio);
        } else {
            alert("No tienes posesiones");
        }
    } else {
        alert("NO hay ninguna casilla comprada");
    }
}
/**
 * Función que deshabilita todos los botones de acción para el jugador
 * 
 */
function deshabilitarBotones() {
// Deshabilitamos el dado\
//OLGA deshabilito todos los botones
    $(".dado").css({backgroundColor: "gray"});
    $(".dado").unbind("click");
    // Deshabilitamos los botones
    $(".boton").addClass("disabled");
//    $(".boton").unbind("click");
}


function botonComprar() {
// Asociamos el método comprar() al boton de comprar
//Si no es ningun caballo ni bastón que salga la imagen de la carta casilla y si no que compre directamente. 
//OLGA
    if (posicionesCasilla[turno] % 5 !== 0 ){
//            && posicionesCasilla[turno] !== 12 && posicionesCasilla[turno] !== 28) {
        $("#imagenCartaCasilla").attr("src", "recursos/images/carta-casilla/es/cartacasilla" + (posicionesCasilla[turno]) + ".jpg");
        $("#dialogo").dialog("open");
    } else {
        comprar(posicionesCasilla[turno] + 1);
        $("#botonComprar").unbind("click");
        $("#botonComprar").addClass("disabled");
    }
}

//OLGA
//funcion para el hipotecar cuando se ha aceptado en el dialog
function hipotecar(casilla) {
    //Recogemos la propiedad que es y sus valores de la carta:
//    var idc = parseInt(casilla) + 1;
    var aHipotecar = casillas[casilla];

    //Una vez aceptado se pone en la lista en gris y le da el dinero al jugador.
    $("li#" + casilla).css({
        color: "#d5cece"
    });

    listaUsuarios[turno].dinero += aHipotecar.precioHipoteca;
    usuario.dinero = listaUsuarios[turno].dinero;
    //Hay que modificar el array de posesionesCasillas para indicar que ya esta hipotecada
    for (var i = 0; i < posesionesCasillas.length; i++) {
        if (posesionesCasillas[i].numeroCasilla == casilla) {
            posesionesCasillas[i].hipotecada = true;
        }
    }

    trace("dinero" + usuario.dinero);

    $("#cabeUsu" + turno + " .dinero").text(usuario.dinero);
    socket.emit("cambioDinero", {sala: sala, usuario: usuario, turno: turno});

    var texto = "El usuario " + usuario.nombre + " ha hipotecado la casilla " + aHipotecar.nombre;
    emitirInformacion(texto);
}

//OLGA
//funcion para deshipotecar la propiedad
function desHipotecar(casilla) {
    //Recogemos la propiedad que es y sus valores de la carta:
//    var idc = parseInt(casilla) + 1;
    var aHipotecar = casillas[casilla];

    //Una vez aceptado se pone en la lista en gris y le da el dinero al jugador.
    $("li#" + casilla).css({
        color: "#dd9a61"
    });

    //Calculamos el dinero para deshipotecar, lo de hipotecar más 10% de intereses:
    trace("Precio hipoteca" + (parseInt(aHipotecar.precioHipoteca) * 0.10));
    var deshipote = parseInt(aHipotecar.precioHipoteca) + (parseInt(aHipotecar.precioHipoteca) * 0.10);
    alert(deshipote);
    //Hay que modificar el array de posesionesCasillas para indicar que ya esta hipotecada
    for (var i = 0; i < posesionesCasillas.length; i++) {
        if (posesionesCasillas[i].numeroCasilla == casilla) {
            posesionesCasillas[i].hipotecada = false;
        }
    }
    listaUsuarios[turno].dinero -= deshipote;
    usuario.dinero = listaUsuarios[turno].dinero;

    $("#cabeUsu" + turno + " .dinero").text(usuario.dinero);
    socket.emit("cambioDinero", {sala: sala, usuario: usuario, turno: turno});

    var texto = "El usuario " + usuario.nombre + " ha deshipotecado la casilla " + aHipotecar.nombre;
    emitirInformacion(texto);
}

//OLGA
//funcion para pagar al otro jugador al caer en su casilla
function pagarAlquiler(datosCasilla, casillaDueno) {

    //Buscamos en el array la casilla, para sacar los datos
    //Tenemos los datos de la casilla y de la posesion

    var aPagar = 0;
    trace("tipo " + datosCasilla.tipo);
    //Comprobamos que tipo de casilla es:
    if (datosCasilla.tipo == "caballos") {
        //Comprobamos si tiene más caballos
        var cont = 0;
        for (var i = 0; i < posesionesCasillas.length; i++) {
            //Comprobamos que sea del mismo jugador
            if (posesionesCasillas[i].idUsuario == casillaDueno.idUsuario) {
                //Comprobamos que sea caballo                 
                trace("Tiene más posesiones");
                trace(posesionesCasillas[i].idCasilla);
                if (posesionesCasillas[i].idCasilla == 6 || posesionesCasillas[i].idCasilla == 11 ||
                        posesionesCasillas[i].idCasilla == 16 || posesionesCasillas[i].idCasilla == 21) {
                    trace("tiene mas caballos");
                    cont += 1;
                }
            }
        }
        //En cont recogemos los caballos que tenga y por cada caballo sera
        if (cont >= 1) {
            aPagar = datosCasilla.precioAlquiler * cont;
            trace("Pagara " + aPagar);
        }

    } else if (datosCasilla.tipo == "bastones") {
        //Comprobamos si tiene el otro bastón
        var cont = 0;
        for (var i = 0; i < posesionesCasillas.length; i++) {
            //Comprobamos que sea del mismo jugador
            if (posesionesCasillas[i].idUsuario == casillaDueno.idUsuario) {
                //Comprobamos que sea caballo                 
                trace("Tiene más posesiones");
                trace(posesionesCasillas[i].idCasilla);
                if (posesionesCasillas[i].idCasilla == 13 || posesionesCasillas[i].idCasilla == 29) {
                    trace("tiene los bastones");
                    cont += 1;
                }
            }
        }
        //Tiramos los dados para sacar un numero:
//        var dados;
//                = tirarDados();
        //Ponemos los dados en color de activo
//        $(".dado").css({backgroundColor: "#f2ea9d"});
////        dados = $(".dado").bind("click", tirarDados);
//        setTimeout(function() {
//            dados = tirarDados;
//
//        }, 1000);
        aPagar = 5 * dados * cont;
        trace("Pagara " + aPagar);

    } else if (datosCasilla.tipo == "tierra") {
        //Comprobar si la casilla tiene casas
        aPagar = datosCasilla.precioAlquiler;
    }

    //Comprobamos si tiene dinero para pagar
    //FALTA POR PROBAR
    while (usuario.dinero <= aPagar) {
        botonHipotecar();
    }
    listaUsuarios[turno].dinero -= aPagar;
//    listaUsuarios[turno].dinero -= datosCasilla.precioAlquiler;
    usuario.dinero = listaUsuarios[turno].dinero;

    $("#cabeUsu" + turno + " .dinero").text(usuario.dinero);
    socket.emit("cambioDinero", {sala: sala, usuario: usuario, turno: turno});

    //Buscamos el usuario al que hay que pagar
    var usuarioPa = "";
    for (var j = 0; j < listaUsuarios.length; j++) {
        if (listaUsuarios[j].id == casillaDueno.idUsuario) {
            trace("Recojo usuario");
            usuarioPa = listaUsuarios[j];
            usuarioPa.dinero += aPagar;
//            usuarioPa.dinero += datosCasilla.precioAlquiler;
            $("#cabeUsu" + j + " .dinero").text(usuarioPa.dinero);
            socket.emit("cambioDinero", {sala: sala, usuario: usuarioPa, turno: j});
        } else {
            trace("No existe ese usuario");
        }
    }
    var texto = "El usuario " + usuario.nombre + " le ha pagado un alquiler de " + datosCasilla.precioAlquiler + " a " + usuarioPa.nombre; 
    emitirInformacion(texto);



}
