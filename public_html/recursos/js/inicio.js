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
        if (validarUsuario($("#usuarioLogueo"))) {
            USUARIO = $("#usuarioLogueo").val();
            alert("usuario correcto: " + USUARIO);
        } else {
            alert("El usuario no es correcto");
        }
        if (validarPassword($("#contraseniaLogueo"))) {
            PASSWORD = $("#contraseniaLogueo").val();
            
        }
        
    });

});
