const mensajeRetiro = document.getElementById("mensajeRetiro");

document.getElementById("retiro-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const cantidad = document.querySelector('input[name="cantidad"]').value;

    fetch("/retiro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cantidad })
    }).then(response => {
        if (response.status == 200) {
            mensajeRetiro.textContent = "Retiro realizado exitosamente";
            mensajeRetiro.style.display = "block";

            // Parsear el contenido de la respuesta como JSON
            return response.json();
        } else if (response.status == 400) {
            return response.json().then(data => {
                mensajeRetiro.textContent = data.message;
                mensajeRetiro.style.display = "block";
                throw new Error(data.message);
            });
        } else if (response.status == 404) {
            mensajeRetiro.textContent = "Error desconocido";
            throw new Error("Error desconocido");
        }
    }).then(data => {
        // Crear un enlace de descarga
        const openLink = document.createElement('a');
        openLink.href = `/static/${data.pdfPath}`;
        openLink.target = '_blank'; // Abre en una nueva ventana o pestaña
        document.body.appendChild(openLink);

        // Redirigir después de 2 segundos
        setTimeout(function () {
            window.location.href = "/perfil";
        }, 2000);
    }).catch(error => {
        console.error(error);
    });
});
