//Solicitud de hipoteca 
const mensajeHipoteca = document.getElementById("mensajeHipoteca");

document.getElementById("hipoteca-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const nombreHipoteca = document.querySelector('input[name="nombre_hipoteca"]').value;
    const montoHipoteca = document.querySelector('input[name="monto_hipoteca"]').value;
    const plazoHipoteca = document.getElementById("plazo_hipoteca").value;
    const propiedad = document.getElementById("propiedad_hipoteca").value;

    const dataHipoteca = {
        nombreHipoteca: nombreHipoteca,
        montoHipoteca: montoHipoteca,
        plazoHipoteca: plazoHipoteca,
        propiedad: propiedad
    }

    fetch("/solicitudHipoteca", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataHipoteca)
    }).then((response) => {
        if (response.status === 200) {
            mensajeHipoteca.textContent = "Se ha creado su hipoteca exitosamente";
            mensajeHipoteca.style.display = "block";

            setTimeout(function () {
                window.location.href = "/perfil";
            }, 2000);
        } else if (response.status === 400) {
            return response.json().then((data) => {
                mensajeHipoteca.textContent = data.message;
                mensajeHipoteca.style.display = "block";
            });
        } else if (response.status === 404) {
            mensajeHipoteca.textContent = "Error desconocido";
        }
    });
});