$(document).ready(function() {
    /*
     * Método que se encarga de gestionar el submit del formulario
     */
    $("#formRegistro").submit(function(e) {
        e.preventDefault();
//        if(validaciones()) {
            var datosForm = $(this).serialize();
            $.ajax({
                url: host + server + "usuario/crear",
                method: "post",
                dataType: "json",
                data: datosForm,
                success: function(datos) {
                    alert(datos.msg);
                },
                error: function(datos) {
                    alert(datos.error);
                }
            });
//        }
        return false;
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


function validaciones() {
    
}

function funcionSuccess(datosServer) {
    alert(datosServer);
}