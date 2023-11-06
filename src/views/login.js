document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar la recarga de la página

    const Usuario = document.querySelector('input[name="Usuario"]').value;
    const Contraseña = document.querySelector('input[name="Contraseña"]').value;

    // Enviar los datos al controlador utilizando fetch
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Usuario, Contraseña })
    })
    .then(response => response.json())
    .then(data => {

            window.location.href = '/perfil';
        
    })
    .catch(error => {
        console.error('Error:', error);
        // Manejar errores si los hubiera
    });
});
