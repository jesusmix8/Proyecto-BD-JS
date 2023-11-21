// Obtén referencias a los elementos HTML
const Nombre = document.getElementById("Nombre");
const Apellido = document.getElementById("Apellido");
const Fecha = document.getElementById("Fecha");
const RFC = document.getElementById("RFC");
const Numero = document.getElementById("telefono");

const Botn = document.getElementById("submit-button");
const mensajeError = document.getElementById("mensajeError");
const contraseñaInput = document.getElementById("Contraseña");
const contraseñaConfirmacionInput = document.getElementById(
  "ContraseñaConfirmacion"
);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("client-form");
  const submitButton = document.getElementById("submit-button");
  submitButton.setAttribute("disabled", "disabled");
  const formFields = form.querySelectorAll("input");
  // Función para verificar si todos los campos están llenos
  function checkFormFields() {
    let allFieldsFilled = true;
    formFields.forEach(function (field) {
      if (field.value === "") {
        allFieldsFilled = false;
      }
    });

    if (allFieldsFilled) {
      submitButton.removeAttribute("disabled");
    } else {
      submitButton.setAttribute("disabled", "disabled");
    }
  }

  // Agregar un evento de escucha a cada campo del formulario
  formFields.forEach(function (field) {
    field.addEventListener("input", checkFormFields);
  });
});

// Escucha el evento input en los campos Nombre, Apellido y Fecha

Correo.addEventListener("input", validarCorreoElectronico);

function validarCorreoElectronico() {
  const correo = Correo.value;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (correo.match(emailRegex)) {
    console.log("correo valido");
    mensajeError.textContent = "";
    Correo.style.border = "2px solid green";
    Correo.style.boxShadow = "0 0 10px green";
  } else {
    mensajeError.textContent = "**Correo electrónico no válido";
    Correo.style.border = "2px solid red";
    Correo.style.boxShadow = "0 0 10px red";
    Botn.setAttribute("disabled", "true");
  }
}

Numero.addEventListener("input", validarNumero);

function validarNumero() {
  const numero = Numero.value;
  const numeroRegex = /^[0-9]{10}$/;

  if (numero.match(numeroRegex)) {
    console.log("numero valido");
    mensajeError.textContent = "";
    Numero.style.border = "2px solid green";
    Numero.style.boxShadow = "0 0 10px green";
  } else {
    // El correo no es válido, muestra un mensaje de error
    mensajeError.textContent = "**Numero no valido";
    Botn.setAttribute("disabled", "true");
    Numero.style.border = "2px solid red";
    Numero.style.boxShadow = "0 0 10px red";
  }
}

Nombre.addEventListener("input", generarRFC);
Apellido.addEventListener("input", generarRFC);
Fecha.addEventListener("input", generarRFC);

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
