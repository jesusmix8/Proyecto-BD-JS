const mensajeAhorro = document.getElementById("mensajeAhorro");

document.getElementById("form-ahorro").addEventListener("submit", function (e) {
    e.preventDefault(); // Evitar la recarga de la página

    const nombreDelAhorro = document.getElementById("NombreDelAhorro").value;
    const plazo = document.getElementById("plazos").value;
    const monto = document.getElementById("monto").value;

    const data = {
        nombreDelAhorro: nombreDelAhorro,
        plazo: plazo,
        monto: monto
    };

    fetch('/crearAhorroNoFuncional', {
        method: 'POST',
            headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status === 200) {
            mensajeAhorro.textContent = 'Cuenta registrada exitosamente';
            mensajeAhorro.style.display = 'block'; // Mostrar mensaje de éxito

            setTimeout(function(){
                window.location.href = "/perfil";
            }, 2000)
        }else if(response.status === 400){
            return response.json().then((data) => {
                mensajeAhorro.textContent = data.message;
                mensajeAhorro.style.display = 'block'; // Mostrar mensaje de error
            });
        }else if(response.status === 404){
            mensajeAhorro.textContent = 'Error desconocido';
        }
    });
});