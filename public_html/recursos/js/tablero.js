/*************************************/
/* DECLARACIÓN DE VARIABLES GLOBALES */
/*************************************/
var clikado = false;
//var posicionesCasilla = new Array();
//var turno = 0;
var tieneTurno = false;
var bote = 0;
var casillas = new Array();


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

    $("#dialogoInfo").dialog({
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

    $(".color li").off().on("click", function(e) {
        alert("hola");
        var casilla = $(this).attr("id");
        $("#imagenCartaCasillaInfo").attr("src", "recursos/images/carta-casilla/es/cartacasilla" + casilla + ".jpg");
        $("#dialogo").dialog("open");
    });

    // Con jQueryui hacemos que los paneles de información de los jugadoes se muestren en forma de acordeón
    $("#paneles").accordion({
        heightStyle: "content"
    });

    // Asociamos el método hipotecar() al botón de crear
    $("#botonHipotecar").off().on("click", function(e) {
        hipotecar();
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

    // Hacemos que el div#clickBotonHipotecar sea un dialog
    $("#clickBotonHipotecar").dialog({
        autoOpen: false,
        buttons: [{
                text: "Aceptar",
                click: function() {
                    $(this).dialog("close");
                }
            }],
        modal: true
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
    $("#cabeUsu" + turno + " .dinero").text(datos.usuario.dinero);
    listaUsuarios[turno].dinero = datos.usuario.dinero;
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
    } else {
        tieneTurno = false;
        $(".dado").css({backgroundColor: "gray"});
        $(".dado").unbind("click");
    }

}

var pos = 0;
/**
 * Función que calcula un número aleatorio del 1 al 6 para el dado,
 * habilita el botón de pasar turno y comprueba la casilla en la que ha caído el jugador
 * 
 */
function tirar() {
    trace("Tirar dados -->");
    if (pos == 0) {
        num = Math.floor(Math.random() * 6) + 1;
    } else {
        num = pos;
    }
//    var num2 = Math.floor(Math.random() * 6) + 1;
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
            listaUsuarios[turno].dinero += 200;
            usuario.dinero = listaUsuarios[turno].dinero;
//            usuario.dinero += 200;
            $("#cabeUsu" + turno + " .dinero").text(usuario.dinero);
            socket.emit("cambioDinero", {sala: sala, usuario: usuario});
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

function casillaTarjetas(datos) {
    emitirInformacion(usuario.nombre + " ha caído en una tarjeta");
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
    socket.emit("cambioDinero", {sala: sala, usuario: listaUsuarios[turno]});

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
    if (posesionesCasillas.length > 0) {
        for (var i = 0; i < posesionesCasillas.length; i++) {
            if (posesionesCasillas[i].idCasilla === datosCasilla.id) {
                trace("Tiene dueño");
            } else {
                trace("No tiene dueño puede comprar");
                $("#botonComprar").bind("click", botonComprar);
                $("#botonComprar").removeClass("disabled");
            }
        }
    } else {
        trace("No tiene dueño puede comprar");
        $("#botonComprar").bind("click", botonComprar);
        $("#botonComprar").removeClass("disabled");

    }
}

function comprar() {
    //Obtener casilla
    var casilla = casillas[posicionesCasilla[turno]];

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
                socket.emit("cambioDinero", {sala: sala, usuario: usuario});

                //Modificamos el array de posesionesCasillas
                var casillaComprada = {idCasilla: casilla.id, numeroCasilla: casilla.numero, idUsuario: usuario.id};
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

}

function hipotecar() {
    //OLGA
    //Lo primero recorrer el array de posesionesCasillas y sacar las posesiones del jugador.
    var posesiones = new Array();
    if(posesionesCasillas.length !== 0){
        for(var i = 0; i < posesionesCasillas.length; i++){
            if(posesionesCasillas[i].idUsuario === usuario.id){
                posesiones.push(posesionesCasillas[i]);
            }
        }
    //Una vez que se tengan las posesiones, se comprueba si tiene alguna el jugador, y si no se pone mensaje de que no tiene
        if (posesiones.length !== 0) {
            alert("tiene posesiones");
            var posesio = "";
            for(var j = 0; j < posesiones.length; j++){
                posesio += posesiones[j].numero + " ";
            }
            alert(posesio);
        } else {
            alert("No tienes posesiones");
        }
    }else{
        alert("NO hay ninguna casilla comprada");
    }
    
    
// Obtenemos todas las casillas que posee el usuario en esta partida
// 
//    $.ajax({
//        url: host + server + "posesioncasilla/obtenerTodasPosesiones/" + idPartida + "/" + usuario.id,
//        method: "post",
//        dataType: "json",
//        success: function(datos) {
//            console.log("-- HIPOTECAR --");
//            if (datos.posesiones) {
//                console.log(datos.posesiones);
//                $("#clickBotonHipotecarContent").append("<p>No tienes tierras ni propiedades que hipotecar</p>");
//                $("#clickBotonHipotecar").dialog("open");
//            } else {
//                $("#clickBotonHipotecarContent").append('<select id="selectHipotecar"></select>');
//                $.each(datos, function(index, datos) {
//                    $("#selectHipotecar").append('<option value="' + datos.idCasilla + '">');
//                });
//            }
//        },
//        error: function(datos) {
//            console.log("-- ERROR EN HIPOTECAR --");
//        }
//    });
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
    if (posicionesCasilla[turno] % 5 !== 0 && posicionesCasilla[turno] !== 12 && posicionesCasilla[turno] !== 28) {
        $("#imagenCartaCasilla").attr("src", "recursos/images/carta-casilla/es/cartacasilla" + (posicionesCasilla[turno]) + ".jpg");
        $("#dialogo").dialog("open");
    } else {
        comprar(posicionesCasilla[turno] + 1);
//        $("#botonComprar").unbind("click");
//        $("#botonComprar").addClass("disabled");
    }
}

//OLGA ya existe arriba
//funcion para el boton de hipotecar
//function hipotecar() {
//    return true;
//}
