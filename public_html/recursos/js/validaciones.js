/**
 * Este método se encarga de validar que el <input> recibido no esté vacío
 * 
 * @param {type} input 
 *      <input> de HTML del que se recogerá el valor para validar
 * @returns {Boolean} 
 *      false -> si el campo a validar está vacío
 *      true -> si el campo contiene algo
 */
function campoVacio(input){
    
    var datos = input.val();
    
    if(datos.lenght <= 0) {
        input.parent().css({color: "red"});        
        input.siblings(".error").text("No puede estar vacio");
        return false;
    } else{
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
    if (datos.lenght < longMin || datos.lenght > longMax) {
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
    if(/(a-zA-Z)+(a-zA-Z0-9\.\_\-)*(a-zA-Z0-9)+(\@)(a-zA-Z)+(\.)(a-zA-Z){2,4}/.test()){
        
    }
}
