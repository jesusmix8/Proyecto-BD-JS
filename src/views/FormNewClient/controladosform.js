
const mensajexito = document.getElementById('mensaje')
const mesnsajeerror = document.getElementById('mensajeError')
const mensajeerrordetalle = document.getElementById('mensajeErrorDetalle')


document.getElementById('client-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar la recarga de la página

    const Usuario = document.querySelector('input[name="Usuario"]').value;
    const Contraseña = document.querySelector('input[name="Contraseña"]').value;
    const Nombre = document.querySelector('input[name="Nombre"]').value;
    const Apellido = document.querySelector('input[name="Apellido"]').value;
    const Codigopostal = document.querySelector('input[name="codigopostal"]').value;
    const Estado = document.querySelector('input[name="estado"]').value;
    const Municipio = document.querySelector('input[name="municipio"]').value;
    const Direccionycasa = document.querySelector('input[name="Direccion"]').value;
    const Telefono = document.querySelector('input[name="Telefono"]').value;
    const Correo = document.querySelector('input[name="Correo"]').value;
    const Fechadenacimiento = document.querySelector('input[name="Fechadenacimiento"]').value;
    const RFC = document.querySelector('input[name="RFC"]').value;



    const nombreCompleto = Nombre + ' ' + Apellido;
    const DireccionCompleta = Direccionycasa + ' ' + Codigopostal + ' ' + Estado + ' ' + Municipio;
    
    const data = {
        Usuario: Usuario,
        Contraseña: Contraseña,
        Nombre: nombreCompleto,
        Direccion: DireccionCompleta,
        Telefono: Telefono,
        Correo: Correo,
        Fechadenacimiento: Fechadenacimiento,
        RFC: RFC
    };


    fetch('/client_register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status === 200) {
            console.log('Cliente registrado exitosamente');
            mensajexito.textContent = 'Cuenta registrada exitosamente';
            mensajexito.style.display = 'block'; // Mostrar mensaje de éxito

            // Mandar a la página de inicio
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else if (response.status === 400) {
            return response.json().then(data => {
                mesnsajeerror.textContent = data.message;

                // Limpiar el formulario
            });
        }else if (response.status = 409) {
            return response.json().then(data => {
                mesnsajeerror.textContent = data.messageerror;
                mesnsajeerror.style.display = 'block';
                mensajeerrordetalle.textContent = data.messagedetail;
            });
        } else {
            throw new Error('Error en el servidor');
        }
    })
    .catch(error => {
        // Manejar errores
        document.getElementById('mensajeError').textContent = error.message;
    });
});