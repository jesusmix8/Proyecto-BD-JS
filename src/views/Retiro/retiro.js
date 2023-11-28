const mensajeRetiro = document.getElementById("mensajeRetiro");

document.getElementById("retiro-form").addEventListener("submit", function (e) {
    e.preventDefault(); 

    const cantidad = document.querySelector('input[name="cantidad"]').value;

    fetch("/retiro", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({ cantidad })
    }).then(response => {
        if(response.status == 200){
            mensajeRetiro.textContent = "Retiro realizado exitosamente";
            mensajeRetiro.style.display = "block";

            setTimeout(function() {
                window.location.href = "/perfil";
            }, 2000);
        }else if(response.status == 400){
            return response.json.then(data => {
                mensajeRetiro.textContent = data.message;
                mensajeRetiro.style.display = "block";
            });
        }else if(response.status == 404){
            mensajeRetiro.textContent = "Error desconocido";
        }
    });
});
