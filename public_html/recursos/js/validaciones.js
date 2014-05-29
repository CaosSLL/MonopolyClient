/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
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

function validarEmail(input){
    var datos = input.val();
    
    if( !(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)/.test(datos))){
        return false;
    } else{
        return true;
    }    
}

function validarNombre(input, longitud){
    var datos = input.val();
    
    campoVacio(input);
    validarLongitud(input, longitud);
    
    if(/\w+([-+.]\w+)*/.test(datos)){
        return true;
    }else{
        return false;
    }   
}


