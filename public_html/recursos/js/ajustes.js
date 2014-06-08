$(document).ready(function() {

    $("#formCambiarUsuario").submit(function(e) {
        e.preventDefault();        
        if (!validarUsuario($("input[name=nuevoUsuario]"))) {
            $(".error").text("El usuario solo puede contener letras, números, -, _ y .");
        } else {
            $(".error").text("");
            alert("llamada a ajax");
        }
    });
    
    $("#formCambiarContrasenia").submit(function(e) {
        e.preventDefault();
        var error= 0;
        if(!validarPassword($("input[name=nuevaContrasenia]"))&& 
                !validarPassword($("input[name=nuevaContrasenia2]"))){
            error= 1;
        }
        if(error === 0){
            if(validarPassword2($("input[name=nuevaContrasenia]"), $("input[name=nuevaContrasenia2]"))){
                
            }
        }
    }); 
    
    $("#ajustesAudio").off().on("click", function(e){
       var oAudio = document.getElementById('audioBSO');
       oAudio.removeAttribute("hidden");
       var audioCSS = $("#audioBSO");
       audioCSS.css({
           zIndex: "1",
           position: "absolute",
           top: "461px",
           marginLeft: "-11.5%"
       });
    });
    
    $("#irPartidas").off().on("click", function(e){
        modulo = "partidas";
        cargarModulo(modulo);
    });

});
