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
        
        var errores = 0;
        
        e.preventDefault();        
//        if(validarNombre($("#usuarioLogueo"))){
//            USUARIO = $("#usuarioLogueo").val();
//            alert("usuario correcto" + USUARIO);
//        }else{
//            errores = 1;
//            alert("El usuario no es correcto");
//        }
//        if(validarContrasenia($("#contraseniaLogueo"))){
//            CONTRASENIA = $("#contraseniaLogueo").val();            
//        }else{
//            errores = 1;
//        }
        
        if(errores === 0){
            $.ajax({
                url: host + server + "usuario/login", 
                method : "post", 
                dataType : "json",
                data : $(this).serialize(),
                success : function(datos){
                    if (datos.autenticado) {
                        $("#usuario").text(datos.nombre);
                        usuario.id = datos.id;
                        usuario.nombre = datos.nombre;
                        modulo = "partidas";
                        cargarModulo(modulo);
                    } else {
                        alert(datos.error);
                        $("#usuario").text("Logueate");
                    }
                },
                error : function(e){
                    console.log("error");
                }
            });
        }
        
    });

});
