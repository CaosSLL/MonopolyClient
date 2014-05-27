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

