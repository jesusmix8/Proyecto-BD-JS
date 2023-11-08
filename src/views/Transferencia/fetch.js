document.getElementById('my-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const cuentaDestino = document.querySelector('input[name="cuentaDestino"]').value;
    const monto = document.querySelector('input[name="monto"]').value;
    const descripcion = document.querySelector('input[name="monto"]').value;


    const data = {
        cuentaDestino: cuentaDestino,
        monto: monto,
        descripcion: descripcion
    };


    fetch('/transfer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 200) {
            // La solicitud se completó exitosamente (código de estado 200)
            return response.json(); // Analizar la respuesta JSON
        } else if (response.status === 400) {
            // Código de estado 400 (Bad Request) - Error del cliente
            return response.json().then(data => {
                // Manejar el error específico del cliente
                throw new Error(data.error);
            });
        } else if (response.status === 404) {
            // Código de estado 404 (Not Found) - Recurso no encontrado
            throw new Error('Recurso no encontrado');
        } else {
            // Cualquier otro código de estado
            throw new Error('Error en el servidor');
        }
    })
    .then(data => {
    })
    .catch(error => {
        // Manejar errores generales
        console.error('Error:', error.message);
    });
});

        
        
    