$(document).ready(function() {
    alert("Hola desde " + modulo);
    /*
     * Método que se encarga de gestionar el submit del formulario
     */
    $("#formRegistro").submit(function(e) {
        e.preventDefault();
        alert("SUBMIT");
//        if(validaciones()) {
            var datosForm = new FormData(this);
            $.ajax({
                url: "http://localhost/MonopolyServer/web/app_dev.php/usuario/crear",
                type: "post",
                data: datosForm,
                success: funcionSuccess
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