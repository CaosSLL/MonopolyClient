/**
 * Este método se encarga de validar que el <input> recibido no esté vacío
 * 
 * @param {type} input 
 *      <input> de HTML del que se recogerá el valor para validar
 * @returns {Boolean} 
 *      false -> si el campo a validar está vacío
 *      true -> si el campo contiene algo
 */

function campoVacio(input) {

    var datos = input.val();
//    if (datos.length <= 0) {
    if (datos == null || datos.length == 0 || /^\s+$/.test(datos)) {
        input.parent().css({color: "red"});
        input.siblings(".error").text("No puede estar vacio");
        return false;
    } else {
        input.parent().css({color: "inherit"});
        input.siblings(".error").text("");
        return true;
    }
}

/**
 * Este método se encarga de validar que los datos del <input> recibido tengan una longitud adecuada
 * 
 * @param {type} input
 *      <input> de HTML cuyo valor será validado
 * @param {type} longMin
 *      longitud mínima de caracteres que deberá tener el input recibido
 * @param {type} longMax
 *      longitud máxima de caracteres que deberá tener el input recibido
 * @returns {Boolean}
 *      false -> si el valor recibido en el <input> no es válido (no tiene una longitud adecuada)
 *      true -> si el valor recibido en el <input> es válido (tiene una longitud adecuada)
 */
function validarLongitud(input, longMin, longMax) {
    var datos = input.val();
    if (datos.length < longMin || datos.length > longMax) {
        input.parent().css({color: "red"});
        input.siblings(".error").text("Debe tener entre " + longMin + " y " + longMax + " caracteres");
        return false;
    } else {
        input.parent().css({color: "inherit"});
        input.siblings(".error").text("");
        return true;
    }
}

function validarEmail(input) {
    var datos = input.val();
    var expresion =  /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)/;
    alert(!expresion.test(datos));
    if (!expresion.test(datos)) {
        input.parent().css({color: "red"});
        input.siblings(".error").text("No es un email correcto");
        return false;
    } else {
        input.parent().css({color: "inherit"});
        input.siblings(".error").text("");
        return true;
    }
}

function validarNombre(input) {
    if (campoVacio(input)) {
        if (validarLongitud(input, "4", "20")) {
            var datos = input.val();
//            if (!/^[A-Za-z]+([-_.]\w+)*/.test(datos)) {
            if(!/[A-Za-b]/.test(datos)){
                alert("mal");
                input.parent().css({color: "red"});
                input.siblings(".error").text("Debe contener caracteres alfanumericos, -, _ o .");
                return false;
            } else {
                alert("bien");
                input.parent().css({color: "inherit"});
                input.siblings(".error").text("");
                return true;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function validarContrasenia(input) {
    var datos = input.val();
    if (campoVacio(input)) {
        if (validarLongitud(input, "6", "10")) {
            if (/\w/.text(datos)) {
                alert("bien");
                input.parent().css({color: "inherit"});
                input.siblings(".error").text("");
                return true;

            } else {
                alert("bien");
                input.parent().css({color: "inherit"});
                input.siblings(".error").text("");
                return true;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}
