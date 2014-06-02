$(document).ready(function() {

    //Enlace para ir a registro
    
    $(".ir").off().on("click", function(e) {
        e.preventDefault();
        if(modulo != $(this).attr("href")) {
            modulo = $(this).attr("href");
            cargarModulo(modulo);
        }
    }); 
    
    /*Método para gestionar el boton*/
    
    $("#formLogueo").submit(function(e) {
        e.preventDefault();   
        if(validarNombre($("#usuarioLogueo"))){
            alert("correcto");
        }else {
            alert("mal");
        }
//        if(validarNombre($("#usuarioLogueo"))){
//            USUARIO = $("#usuarioLogueo").val();
//            alert("usuario correcto" + USUARIO);
//        }else{
//            alert("El usuario no es correcto");
//        }
//        if(validarContrasenia($("#contraseniaLogueo"))){
//            CONTRASENIA = $("#contraseniaLogueo").val();
//            
//        }
        
//        if(validarLongitud($("#usuario"), 4, 10)){
//        if(campoVacio($("#usuarioLogueo"))){
//            if(validarLongitud($("#usuarioLogueo"), "4", "20")){
//                alert("correto");                
//            }else{
//                alert("no es correcto");                
//            }
//        }else{
//            alert("no es correcto");
//        }
    });

});
