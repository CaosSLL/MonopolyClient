/**
 * Se cargan todos los eventos una vez que el documento HTML esté cargado por completo
 * 
 */
$(document).ready(function() {
    /*
     * Método que se encarga de gestionar el submit del formulario
     * 
     */
    $("#formRegistro").submit(function(e) {
        e.preventDefault();
        if(validaciones()) {
            var datosForm = $(this).serialize();
            $.ajax({
                url: host + server + "usuario/crear",
                method: "post",
                dataType: "json",
                data: datosForm,
                success: function(datos) {
                    if(datos.tipo === "error") {
                        $("#error-registro").text(datos.error);
                    } else {
                        $("#error-registro").text(datos.msg);
                    }
                },
                error: function() {
                    $("#error-registro").text("Lo sentimos mucho.\r\nNo se ha podido establecer conexión con el servidor.");
                }
            });
        }
    });
    
    
    /**
     * Método que gestiona el cambio de la imagen del botón cuando el cursor está encima
     * 
     */
    $("input[name=submit]").mouseenter(function() {
        $(this).attr("src", "recursos/images/otras/hoja-lorien-marron.png");
    });
    
    
    /**
     * Método que gestiona el cambio de la imagen del botón cuando el cursor sale del botón
     * 
     */
    $("input[name=submit]").mouseleave(function() {
        $(this).attr("src", "recursos/images/otras/hoja-lorien-verde.png");
    });
    
});

/**
 * Este método se encarga de llamar a los métodos de "validaciones.js" que son necesarios
 * para validar el formulario de registro.
 * 
 * @returns {Boolean}
 *      true -> todos los campos del formulario son válidos
 *      false -> algún campo del formulario no es válido
 */
function validaciones() {
    // Recogemos todos los inputs que vamos a validar y creamos un contador de errores
    var inputUsuario = $("input[name=usuario]");
    var inputPass1 = $("input[name=password]");
    var inputPass2 = $("input[name=password2]");
    var inputEmail = $("input[name=email]");
    var contErrores = 0;
    
    // Comprabamos si los campos son válidos
    if (!validarUsuario(inputUsuario))
        contErrores++;
    if (!validarPassword(inputPass1))
        contErrores++;
    if (!validarPassword2(inputPass1, inputPass2))
        contErrores++;
    if (!validarEmail(inputEmail))
        contErrores++;
    
    if (contErrores === 0) {
        $("#error-registro").text("");
        return true;
    } else {
        $("#error-registro").text("Corrija los errores, por favor");
        return false;
    }
}