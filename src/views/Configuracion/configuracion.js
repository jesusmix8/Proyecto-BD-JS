//Submit del boton de cambiar contraseña
const mensajeContrasena = document.getElementById("mensajeContrasena");

document.getElementById("cambiarContrasenaForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const contrasenaActual = document.querySelector('input[name="actualContrasena"]').value;
    const contrasenaNueva = document.querySelector('input[name="nuevaContrasena"]').value;
    const contrasenaConfirmada = document.querySelector('input[name="confirmarContrasena"]').value;

    const dataContrasena = {
        contrasenaActual: contrasenaActual,
        contrasenaNueva: contrasenaNueva,
        contrasenaConfirmada: contrasenaConfirmada,
    };

    fetch("/cambiarContrasena", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataContrasena)
    }).then((response) => {
        if (response.status == 200) {
            mensajeContrasena.textContent = "Contraseña cambiada exitosamente";
            mensajeContrasena.style.display = "block";

            setTimeout(function(){
                window.location.href = "/perfil";
            }, 2000);
        } else if(response.status == 400){
            return response.json().then((data) => {
                mensajeerror.textContent = data.message;
                mensajeerror.style.display = "block";
            });
        } else if(response.status == 404){
            mensajerror.texContent = "Error desconocido";
        }
    });
});