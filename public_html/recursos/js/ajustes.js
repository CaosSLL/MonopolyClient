$(document).ready(function() {

//    $("#dialogo").dialog({
//        autoOpen: false,
//        height: 300,
//        width: 350,
//        modal: true,
//        buttons: {
//            "Aceptar": function() {
//                passwordVerificacion = $("#passwordV").val();
//                $(this).dialog("close");
//            },
//            Cancel: function() {
//                $(this).dialog("close");
//                passwordVerificacion = "";
//            }
//        },
//        close: function() {
//            passwordVerificacion = "";
//        }
//    });

    $("#formCambiarUsuario").submit(function(e) {
        e.preventDefault();
        var nuevoUsuario = $("input[name=nuevoUsuario]");
        var passVerificarion = $("input[name=nuevoUsuarioPass]");
        if (validarPassword(passVerificarion )) {
            if (validarUsuario(nuevoUsuario)) {
                $.ajax({
                    url: host + server + "usuario/cambiarUsuario/" + usuario.id + "/" + passVerificarion.val() + "/" + usuario.nombre + "/" + nuevoUsuario.val(),
                    method: "post",
                    dataType: "json",
                    data: $(this).serialize(),
                    success: function(datos) {
                        if (!datos.error) {
                            if (datos.nombreUsuario === nuevoUsuario.val()) {
                                $("#informacion").text(nuevoUsuario.val());
                                $("#infoPartida").text("Has cambiado el nombre a " + nuevoUsuario.val());
                            } else {
                                $("#infoPartida").text("No puedes cambiar el usuario, ha habido un problema interno");
                                $("#errorUsuario").text("No ha sido posible");
                            }
                        } else {
                            $("#infoPartida").text("La contraseña no es correcta");
                            $("#errorUsuario").text("La contraseña no es correcta");
                        }
                    },
                    error: function(e) {
                        console.log("error");
                    }
                });
            } else {

            }
        }

    });

    $("#formCambiarContrasenia").submit(function(e) {
        e.preventDefault();
        var nuevaContrasenia = $("input[name=nuevaContrasenia]");
        var nuevaContrasenia2 = $("input[name=nuevaContrasenia2]");
        var passVerificarion = $("input[name=nuevaContraseniaPass]");
        var error = 0;
        if (!validarPassword(nuevaContrasenia) && !validarPassword(nuevaContrasenia2)) {
            error = 1;
        }
        if (error === 0) {
            if (validarPassword2(nuevaContrasenia, nuevaContrasenia2)) {
                if (validarPassword(passVerificarion)) {
                    $.ajax({
                        url: host + server + "usuario/cambiarPassword/" + usuario.id + "/" + passVerificarion.val() + "/" + nuevaContrasenia.val(),
                        method: "post",
                        dataType: "json",
                        data: $(this).serialize(),
                        success: function(datos) {
                            if (datos.error) {
                                $("#infoPartida").text("No puedes cambiar la contraseña, ha habido un problema interno");
                                $("#errorUsuario").text("No ha sido posible");
                            } else {        
                                $("#infoPartida").text("Has cambiado la contraseña de tu usario");

                            }
                        },
                        error: function(e) {
                            console.log("error");
                        }
                    });
                }
            }
        }
    });

    $("#ajustesAudio").off().on("click", function(e) {
        var oAudio = document.getElementById('audioBSO');
        oAudio.removeAttribute("hidden");
        var audioCSS = $("#audioBSO");
        audioCSS.css({
            zIndex: "1",
            position: "absolute",
            top: "500px",
            marginLeft: "-4%"
        });
    });

    $("#irPartidas").off().on("click", function(e) {
        modulo = "partidas";
        var oAudio = document.getElementById('audioBSO');
        oAudio.getAttribute("hidden");
        cargarModulo(modulo);
    });

    $("#irTablero").off().on("click", function(e) {
        modulo = "tablero";
        var oAudio = document.getElementById('audioBSO');
        oAudio.getAttribute("hidden");
        cargarModulo(modulo);        
    });

});
