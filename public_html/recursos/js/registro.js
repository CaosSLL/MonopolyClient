$(document).ready(function() {
    alert("Hola desde " + modulo);
    /*
     * Método que se encarga de gestionar el submit del formulario
     */
    $("#formRegistro").submit(function(e) {
        e.preventDefault();
        alert("SUBMIT");
//        if(validaciones()) {
            var datosForm = $(this).serialize();
            $.ajax({
                url: "http://localhost/MonopolyServer/web/app_dev.php/usuario/crear",
                type: "post",
                dataType: "json",
                data: datosForm,
                success: function(datos) {
                    alert(datos.usuario);
                },
                error: function(datos) {
                    alert("error en el server");
                }
            });
//        }
        return false;
    });
});


function validaciones() {
    
}

function funcionSuccess(datosServer) {
    alert(datosServer);
}