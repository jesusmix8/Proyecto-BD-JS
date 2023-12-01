//Solicitud de prestamo

const mensajePrestamo = document.getElementById("mensajePrestamo");

document.getElementById("prestamo-form").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const nombreSeguro = document.querySelector('input[name="nombre_prestamo"]').value;
    const montoSeguro = document.querySelector('input[name="monto_prestamo"]').value;
    const plazoSeguro = document.getElementById("plazo_prestamo").value;

    const dataPrestamo = {
        nombreSeguro: nombreSeguro,
        montoSeguro: montoSeguro,
        plazoSeguro: plazoSeguro
    }

    fetch("/solicitudPrestamo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataPrestamo)
    }).then((response) => {
        if (response.status === 200) {
            mensajePrestamo.textContent = "Se ha creado su prestamo correctamente";
            mensajePrestamo.style.display = "block";

            setTimeout(function () {
                window.location.href = "/perfil";
            }, 2000);
        } else if (response.status === 400) {
            return response.json().then((data) => {
                mensajePrestamo.textContent = data.message;
                mensajePrestamo.style.display = "block";
            });
        } else if (response.status === 404) {
            mensajePrestamo.textContent = "Error desconocido";
        }
    });
});