
const mensaje = document.getElementById('mensaje')


document.getElementById('form-ahorro').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar la recarga de la página

    const NombreDelAhorro = document.getElementById('NombreDelAhorro').value;
    const Plazo = document.getElementById('plazos').value;
    const monto = document.getElementById('monto').value;





    const data = {
        NombreDelAhorro: NombreDelAhorro,
         Plazo: Plazo,
         Monto: monto
    };

     fetch('/crearAhorro', {
         method: 'POST',
             headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
     })
     .then(response => {
         if (response.status === 200) {
            mensaje.textContent = 'Cuenta registrada exitosamente';
            mensaje.style.display = 'block'; // Mostrar mensaje de éxito
        }
     });
});