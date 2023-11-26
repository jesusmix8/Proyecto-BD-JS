const mensaje = document.getElementById("mensaje");

document.getElementById("seguro-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const Nombre = document.querySelector('input[name="nombre"]').value;
  const fechaNacimiento = document.querySelector(
    'input[name="fechaNacimiento"]'
  ).value;
  const rangoIngresos = document.getElementById("rangoIngreso").value;
  const sumaAsegurada = document.querySelector(
    "input[name=sumaAsegurada]"
  ).value;
  const pagoAnual = document.getElementById("totalAnual").textContent;

  const data = {
    Nombre: Nombre,
    fechaNacimiento: fechaNacimiento,
    rangoIngresos: rangoIngresos,
    sumaAsegurada: sumaAsegurada,
    pagoAnual: pagoAnual,
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
