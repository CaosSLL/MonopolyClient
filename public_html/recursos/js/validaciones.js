/******************************************************************************/
/*                 MÉTODOS DE VALIDACIÓN GENERALES                            */
/******************************************************************************/

/**
 * Este método se encarga de validar que el input recibido no esté vacío
 * 
 * @param {type} input 
 *      input de HTML del que se recogerá el valor para validar
 * @returns {Boolean} 
 *      false -> si el campo a validar está vacío
 *      true -> si el campo contiene algo
 */

function validarCampoVacio(input) {
    var datos = input.val();

    if (datos === null || datos.length === 0 || /^\s+$/.test(datos)) {
//        input.parent().css({color: "red"});
        input.siblings(".error").text("No puede estar vacio");
        return false;

    } else {
        input.parent().css({color: "inherit"});
        input.siblings(".error").text("");
        return true;
    }
}

/**
 * Este método se encarga de validar que los datos del input recibido tengan una longitud adecuada
 * 
 * @param {type} input
 *      input de HTML cuyo valor será validado
 * @param {type} longMin
 *      longitud mínima de caracteres que deberá tener el input recibido
 * @param {type} longMax
 *      longitud máxima de caracteres que deberá tener el input recibido
 * @returns {Boolean}
 *      false -> si el valor recibido en el input no es válido (no tiene una longitud adecuada)
 *      true -> si el valor recibido en el input es válido (tiene una longitud adecuada)
 */
function validarLongitud(input, longMin, longMax) {
    var datos = input.val();

    if (datos.length < longMin || datos.length > longMax) {
//        input.parent().css({color: "red"});
        input.siblings(".error").text("Debe tener entre " + longMin + " y " + longMax + " caracteres");
        return false;

    } else {
        $(input).parent().css({color: "inherit"});
        $(input).siblings(".error").text("");
        return true;
    }
}


/******************************************************************************/
/*                 MÉTODOS DE VALIDACIÓN ESPECÍFICOS                          */
/******************************************************************************/

/**
 * Este método se encarga de validar que la contraseña introducida sólo contenga
 * carácteres alfanuméricos, ".", "-", "_" y una longitud de entre 8 y 20 caracteres.
 *      
 * @param {type} input
 *      es el input HTML que contendrá el calor que se debe validar
 * @returns {Boolean}
 *      true -> si el nombre de usuario es válido
 *      false -> si el nombre de usuario no es válido
 */
function validarUsuario(input) {
    var datos = input.val();
    
    if (!validarCampoVacio(input) || !validarLongitud(input, 4, 20)) {
        return false;
        
    } else if (!/^(([a-zA-Z0-9\.\-\_])*)*$/.test(datos) || !/([a-zA-Z]+)/.test(datos)) {
//        input.parent().css({color: "red"});
        input.siblings(".error").text("Debe contener caracteres alfanuméricos, '-', '_' o '.'");
        return false;
        
    } else {
        input.parent().css({color: "inherit"});
        input.siblings(".error").text("");
        return true;
    }
}

/**
 * Este método se encarga de validar que la contraseña introducida sólo contenga
 * carácteres alfanuméricos y una longitud de entre 8 y 20 caracteres.
 * 
 * @param {type} input
 *      input de HTML que contiene la contraseña que se quiere comprobar
 * @returns {Boolean}
 *      true -> si la contraseña introducida es válida
 *      false -> si la contraseña es incorrecta
 */
function validarPassword(input) {
    var datos = input.val();
    
    if (!validarCampoVacio(input) || !validarLongitud(input, 6, 10)) {
        return false;
        
    } else if (!(/^([a-zA-Z0-9]*)*$/.test(datos))) {
//        input.parent().css({color: "red"});
        input.siblings(".error").text("La contraseña sólo puede contener letras y números");
        return false;
        
    } else {
        input.parent().css({color: "inherit"});
        input.siblings(".error").text("");
        return true;
    }
}

/**
 * Este método comprueba que las contraseñas introducidas contengan el mismo valor
 * 
 * @param {type} inputOriginal
 *      corresponde al input de la contraseña original
 * @param {type} inputRevisar
 *      corresponde al input de la contraseña repetida
 * @returns {Boolean}
 *      true -> si las contraseñas son iguales
 *      false -> si las contraseñas son distintas
 */
function validarPassword2(inputOriginal, inputRevisar) {
    var original = $(inputOriginal).val();
    var revisar = $(inputRevisar).val();
    
    if (revisar != original) {
//        inputRevisar.parent().css({color: "red"});
        inputRevisar.siblings(".error").text("Las contraseñas no coinciden");
        return false;
        
    } else {
        inputRevisar.parent().css({color: "inherit"});
        inputRevisar.siblings(".error").text("");
        return true;
    }
}

/**
 * Este método se encarga de validar que el e-mail introducido sea válido 
 *      no esté vacío
 *      tenga un formato válido
 * 
 * @param {type} input
 *      es el input HTML que contiene el e-mail que se quiere validar
 * @returns {Boolean}
 *      true -> si el email es válido
 *      false -> si el email es incorrecto
 */
function validarEmail(input) {
    var datos = input.val();
    
    if (!(/^(\w)([.]*[_]*[-]*\w)+@([a-z])+([.]*[a-z])*[.]([a-z]{2,3})$/.test(datos))) {
//        input.parent().css({color: "red"});
        input.siblings(".error").text("No es un email correcto");
        return false;
        
    } else {
        input.parent().css({color: "inherit"});
        input.siblings(".error").text("");
        return true;
    }
}
