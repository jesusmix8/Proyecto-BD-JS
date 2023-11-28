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
                mensajeContrasena.textContent = data.message;
                mensajeContrasena.style.display = "block";
            });
        } else if(response.status == 404){
            mensajeContrasena.texContent = "Error desconocido";
        }
    });
});

//Submit del boton de cambiar correoElectronico
const mensajeCorreo = document.getElementById("mensajeCorreo");

document.getElementById("cambiarCorreoForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nuevoCorreo = document.querySelector('input[name="nuevoCorreo"]').value;

    fetch("/cambiarCorreo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nuevoCorreo })
    }).then((response) => {
        if(response.status == 200){
            mensajeCorreo.textContent = "Correo cambiado exitosamente";
            mensajeCorreo.style.display = "block";

            setTimeout(function(){
                window.location.href = "/perfil";
            }, 2000);
        }else if(response.status == 400){
            return response.json.then((data) => {
                mensajeCorreo.textContent = data.message;
                mensajeCorreo.style.display = "block";
            });
        }else if(response.status == 404){
            mensajeCorreo.textContent = "Error desconocido";
        }   
    });
});

//Submit del boton de cambiar telefono
const mensajeTelefono = document.getElementById("mensajeTelefono");

document.getElementById("cambiarTelefonoForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nuevoTelefono = document.querySelector('input[name="nuevoTelefono"]').value;

    fetch("/cambiarTelefono", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({ nuevoTelefono })
    }).then((response) => {
        if(response.status == 200){
            mensajeTelefono.textContent = "Telefono cambiado Exitosamente";
            mensajeTelefono.style.display = "block";

            setTimeout(function(){
                window.location.href = "/perfil";   
            }, 2000);
        }else if(response.status == 400){
            return response.json.then((data) => {
                mensajeTelefono.textContent = data.message;
                mensajeTelefono.style.display = "block";
            });
        }else if(response.status == 404){
            mensajeTelefono.textContent = "Error desconocido";
        }
    });
});
