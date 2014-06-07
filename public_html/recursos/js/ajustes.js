$(document).ready(function() {

//    if (logado()) {

        $("#formCambiarUsuario").submit(function(e) {
            e.preventDefault();
            var errores = 0;
            if (validaciones()) {
                alert("bien");
            } else {
                alert("mal");                
            }
        });
//    }
//    ;
});

//function logado() {
//    if (usuario["nombre"] === "") {
//        modulo = "inicio";
//        cargarModulo(modulo);
//        return false;
//    } else {
//        return true;
//    }
//}

function validaciones() {
    // Recogemos todos los inputs que vamos a validar y creamos un contador de errores
    var inputNuevoUsuario = $("input[name=nuevoUsuario]");
    var contErrores = 0;

    // Comprabamos si los campos son válidos
    if (!validarUsuario(inputNuevoUsuario))
        contErrores++;

    if (contErrores === 0) {
//        $("#error-registro").text("");
        return true;
    } else {
//        $("#error-registro").text("Corrija los errores, por favor");
        return false;
    }
}