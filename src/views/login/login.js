const mesnsajeerror = document.getElementById('mensajeerror');

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
    .then(response => {
        if (response.status === 200){
            window.location.href = '/perfil';
        } else if (response.status === 400) {
            return response.json().then(data => {
                mesnsajeerror.textContent = data.message;
                mesnsajeerror.style.display = 'block';// Mostrar mensaje de error
            });
            
        }else if (response.status === 401) {
            mesnsajeerror.textContent = 'Usuario o contraseña incorrectas';
        }})
        
    .catch(error => {
         console.error('Error:', error);
         // Manejar errores si los hubiera
     });
 });
