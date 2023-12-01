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

    fetch('/crearAhorro', {
        method: 'POST',
            headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status === 200) {
            mensajeAhorro.textContent = 'Ahorro creado exitosamente';
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

document.addEventListener("DOMContentLoaded", function() {
    var fechaExpElement = document.getElementById('fecha-expiracion');

    if (fechaExpElement) {
      var fechaOriginal = fechaExpElement.value;
      var fechaFormateada = formatearFechaDDMMYYYY(fechaOriginal);
      fechaExpElement.value = fechaFormateada;
    }
  });

  function formatearFechaDDMMYYYY(fechaString) {
    var fecha = new Date(fechaString);
    
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var año = fecha.getFullYear();
    var fechaFormateada = (dia < 10 ? '0' : '') + dia + '/' + (mes < 10 ? '0' : '') + mes + '/' + año;

    return fechaFormateada;
  }