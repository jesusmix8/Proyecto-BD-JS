// Obtén referencias a los elementos HTML
const Nombre = document.getElementById("Nombre");
const Apellido = document.getElementById("Apellido");
const Fecha = document.getElementById("Fecha");
const RFC = document.getElementById("RFC");
const Botn = document.getElementById("submit-button");
const Numero = document.getElementById("telefono");

// Escucha el evento input en los campos Nombre, Apellido y Fecha
Nombre.addEventListener("input", generarRFC);
Apellido.addEventListener("input", generarRFC);
Fecha.addEventListener("input", generarRFC);


const Correo = document.getElementById("Correo");
const mensajeError = document.getElementById("mensajeError");


Correo.addEventListener('blur', validarCorreoElectronico);

function validarCorreoElectronico() {
  const correo = Correo.value;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (correo.match(emailRegex)) {
    // El correo es válido, borra cualquier mensaje de error
    console.log('correo valido');
    mensajeError.textContent = '';

  } else {
    // El correo no es válido, muestra un mensaje de error
    mensajeError.textContent = '**Correo electrónico no válido';
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
