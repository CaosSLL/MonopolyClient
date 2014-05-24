function cargarEventos() {

    var conectados = $("#listaUsuariosConectados ul");

    if (modulo == "partidas")
        $.ajax({
            url: host + server + "usuario/conectados",
            method: "post",
            dataType: "json",
            success: function(usuarios) {

                $.each(usuarios, function(i, usuario) {
                    var datos = "<li class='usuario'><span class='nombre_usuario'>";
                    datos += usuario.nombre;
                    datos += "</span></li>";
                    conectados.append(datos);


                });
                $(".usuario").on("click", function() {
                    if ($(this).children(".ui-icon").hasClass("ui-icon")) {
                        $(this).children(".ui-icon").remove();
                    } else {
                        $(this).append("<span class='ui-icon ui-icon-check'></span>");
                    }
                });
            }
        });

}