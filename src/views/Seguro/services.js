document.addEventListener('DOMContentLoaded', function () {
  var rangoIngreso = document.getElementById('rangoIngreso');
  var enfermedadesCheckboxes = document.getElementsByName('enfermedades');
  var totalAnualSpan = document.getElementById('totalAnual');
  var proteccionSpan = document.getElementById('proteccion');

  function calcularTotalAnual() {
      // Obtener el valor del rango de ingreso
      var rangoValor = rangoIngreso.value;

      // Calcular el total anual basado en el rango de ingreso
      var totalAnual = 0;
      switch (rangoValor) {
          case '0-20000':
              totalAnual = 2000;
              break;
          case '20001-50000':
              totalAnual = 4000;
              break;
          case '50001+':
              totalAnual = 6000;
              break;
      }

      // Ajustar el total anual según las enfermedades seleccionadas
      enfermedadesCheckboxes.forEach(function (checkbox) {
          if (checkbox.checked) {
              // Ajusta los valores según tus necesidades específicas
              totalAnual += 1000; // Agregar un monto adicional por cada enfermedad seleccionada
          }
      });

      // Actualizar los elementos en la interfaz
      totalAnualSpan.textContent = totalAnual.toFixed(2);
      proteccionSpan.textContent = '500,000'; // Valor fijo de protección, ajusta según sea necesario
  }

  // Eventos para recalcular el total anual cuando cambia el rango de ingreso o las enfermedades seleccionadas
  rangoIngreso.addEventListener('change', calcularTotalAnual);
  enfermedadesCheckboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', calcularTotalAnual);
  });

  // Llamar a la función inicialmente para que se calcule el total al cargar la página
  calcularTotalAnual();
});

const mensaje = document.getElementById("mensaje");

document.getElementById("seguro-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const Nombre = document.querySelector('input[name="nombre"]').value;
  const rangoIngresos = document.getElementById("rangoIngreso").value;
  const pagoAnual = document.getElementById("totalAnual").textContent;
  const proteccionAnual = document.getElementById("proteccion").textContent;

  const data = {
    Nombre: Nombre,
    rangoIngresos: rangoIngresos,
    pagoAnual: pagoAnual,
    proteccionAnual: proteccionAnual
  };

  fetch("/solicitudSeguro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status == 200) {
      mensaje.textContent = "Seguro registrado exitosamente";
      mensaje.style.display = "block";

      setTimeout(function () {
        window.location.href = "/perfil";
      }, 2000);
    } else if (response.status == 400) {
      return response.json().then((data) => {
        mensajeerror.textContent = data.message;
        mensajeerror.style.display = "block";
      });
    } else if (response.status == 404) {
      mensajeerror.textContent = "Error desconocido";
    }
  });
});
