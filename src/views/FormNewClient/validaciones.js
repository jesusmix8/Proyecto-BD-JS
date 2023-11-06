// Obtén referencias a los elementos HTML
const Nombre = document.getElementById("Nombre");
const Apellido = document.getElementById("Apellido");
const Fecha = document.getElementById("Fecha");
const RFC = document.getElementById("RFC");
const Numero = document.getElementById("telefono");
const Usuario = document.getElementById("Usuario");
const Correo = document.getElementById("Correo");
const Botn = document.getElementById("submit-button");
const mensajeError = document.getElementById("mensajeError");

const contraseñaInput = document.getElementById('Contraseña');
const contraseñaConfirmacionInput = document.getElementById('ContraseñaConfirmacion');



// Escucha el evento input en los campos Nombre, Apellido y Fecha
Nombre.addEventListener("input", generarRFC);
Apellido.addEventListener("input", generarRFC);
Fecha.addEventListener("input", generarRFC);
Correo.addEventListener('blur', validarCorreoElectronico);




Usuario.addEventListener('input', validarUsuario);

function validarUsuario() {
  const nombre = Usuario.value.trim();

  if (nombre.length < 8) {
    mensajeError.textContent = 'El usuario debe tener al menos 8 caracteres';
    mensajeError.style.color = 'red';
    Usuario.style.border = '2px solid red';
    Usuario.style.boxShadow = '0 0 10px red';
    Botn.setAttribute("disabled", "true");
  } else {
    mensajeError.textContent = '';
    Usuario.style.border = '2px solid green';
    Usuario.style.boxShadow = '0 0 10px green';

  }
}

contraseñaInput.addEventListener('input', validarContraseña);
contraseñaConfirmacionInput.addEventListener('input', validarConfirmacionContraseña);


function validarContraseña() {
  const contraseña = contraseñaInput.value;
  if (contraseña.length < 8 || contraseña.length > 20 || !/^[a-zA-Z0-9]+$/.test(contraseña) || /\s/.test(contraseña)) {
    mensajeError.textContent = 'La contraseña no cumple con los requisitos.';
    mensajeError.style.display = 'block';
    contraseñaInput.style.border = '2px solid red';
    contraseñaInput.style.boxShadow = '0 0 10px red';
    Botn.setAttribute("disabled", "true");
  } else {
    mensajeError.style.display = 'none';
    contraseñaInput.style.border = '2px solid green';
    contraseñaInput.style.boxShadow = '0 0 10px green';

  }
}

function validarConfirmacionContraseña() {
  const contraseña = contraseñaInput.value;
  const confirmación = contraseñaConfirmacionInput.value;
  if (confirmación !== contraseña) {
    mensajeError.textContent = 'Las contraseñas no coinciden.';
    mensajeError.style.display = 'block';
    contraseñaInput.style.border = '2px solid red';
    contraseñaInput.style.boxShadow = '0 0 10px red';
    contraseñaConfirmacionInput.style.border = '2px solid red';
    contraseñaConfirmacionInput.style.boxShadow = '0 0 10px red';
  } else {
    mensajeError.style.display = 'none';
    contraseñaInput.style.border = '2px solid green';
    contraseñaInput.style.boxShadow = '0 0 10px green';
    contraseñaConfirmacionInput.style.border = '2px solid green';
    contraseñaConfirmacionInput.style.boxShadow = '0 0 10px green';
  }
}




function validarCorreoElectronico() {
  const correo = Correo.value;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (correo.match(emailRegex)) {
    console.log('correo valido');
    mensajeError.textContent = '';
    Correo.style.border = '2px solid green';
    Correo.style.boxShadow = '0 0 10px green';

  } else {
    mensajeError.textContent = '**Correo electrónico no válido';
    Correo.style.border = '2px solid red';
    Correo.style.boxShadow = '0 0 10px red';
    Botn.setAttribute("disabled", "true");
  }
}



Numero.addEventListener('blur', validarNumero);

function validarNumero() {
    const numero = Numero.value;
    const numeroRegex = /^[0-9]{10}$/;
    
    if (numero.match(numeroRegex)) {
        console.log('numero valido');
        mensajeError.textContent = '';
        Botn.removeAttribute('disabled');
    
    } else {
        // El correo no es válido, muestra un mensaje de error
        mensajeError.textContent = '**Numero no valido';
        Botn.setAttribute("disabled", "true");
    }
}


function generarRFC() {
  // Obtén el valor de los campos Nombre, Apellido y Fecha
  const nombreValor = Nombre.value;
  const apellidoValor = Apellido.value;
  const fechaValor = Fecha.value;

  // Verifica si todos los campos contienen datos
  if (nombreValor && apellidoValor && fechaValor) {
    // Aquí puedes implementar la lógica para crear el RFC
    const rfcGenerado = crearRFC(nombreValor, apellidoValor, fechaValor);

    // Coloca el RFC generado en el input correspondiente
    RFC.value = rfcGenerado;
  } else {
    // Si falta alguno de los datos, borra el valor del RFC
    RFC.value = "";
  }
}

// Función para crear el RFC (debes implementar esta función según tus requisitos)
function crearRFC(nombre, apellido, fecha) {
  var rfc = "";

  nombre = nombre.toUpperCase();
  apellido = apellido.toUpperCase();

    // Si el nombre tiene un espacio dividirlo en dos y tomar las primeras dos letra de cada uno
    const nombreArray = nombre.split(" ");
    let inicialesNombre = "";

    for (let i = 0; i < nombreArray.length; i++) {
      inicialesNombre += nombreArray[i].substring(0, 1);
    }

    const apellidoArray = apellido.split(" ");
    let inicialesApellido = "";

    for (let i = 0; i < apellidoArray.length; i++) {
      inicialesNombre += apellidoArray[i].substring(0, 1);
    }

  rfc = inicialesNombre + inicialesApellido;

  const fechaArray = fecha.split("-");
  if (fechaArray.length == 3) {
    const año = fechaArray[0].substring(2, 4);
    const mes = fechaArray[1];
    const dia = fechaArray[2];

    rfc += año + mes + dia;
  }
  return rfc;
}
