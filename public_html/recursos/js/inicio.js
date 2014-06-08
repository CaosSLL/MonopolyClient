$(document).ready(function() {

    //Enlace para ir a registro

    $(".irFormulario").off().on("click", function(e) {
        e.preventDefault();
        if (modulo != $(this).attr("href")) {
            modulo = $(this).attr("href");
            cargarModulo(modulo);
        }
    });

    /*Método para gestionar el boton*/

    $("#formLogueo").submit(function(e) {

        var usuarioValidado = false;
        var passwordValidada = false;

        e.preventDefault();

        if (!validarUsuario($("#usuarioLogueo"))) {
            usuarioValidado = false;
        }else{
            usuarioValidado = true;
        }
        if (!validarPassword($("#contraseniaLogueo"))) {
            passwordValidada = false;
        }else{
            passwordValidada = true;
        }

        if (usuarioValidado && passwordValidada) {
            $.ajax({
                url: host + server + "usuario/login",
                method: "post",
                dataType: "json",
                data: $(this).serialize(),
                success: function(datos) {
                    if (datos.autenticado) {
                        $("#usuario").text(datos.nombre);
                        usuario.id = datos.id;
                        usuario.nombre = datos.nombre;
                        modulo = "partidas";
                        cargarModulo(modulo);
                        $(".error").text("");
                    } else {
                        alert(datos.error);
                        $("#usuario").text("Logueate");
                        $(".error").text("El usuario o contraseña no es correcto");
                    }
                },
                error: function(e) {
                    console.log("error");
                }
            });
        } else {
            if (!usuarioValidado && !passwordValidada) {
                $(".error").text("El usuario y la contraseña tiene una estructura incorrecta");
            }else if (!usuarioValidado){
                $(".error").text("El usuario tiene una estructura incorrecta");
            }else if(!passwordValidada){
                $(".error").text("La contraseña tiene una estructura incorrecta");
            }else{
                $(".error").text("Error desconocido");                
            }
        }

    });

});
