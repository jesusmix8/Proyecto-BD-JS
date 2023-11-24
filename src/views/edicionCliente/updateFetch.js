const mensajeExito = document.getElementById("mensajeExito");
const mensajeError = document.getElementById("mensajeError");

console.log("updateFetch.js cargado");
document.getElementById("formupdate").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.querySelector('input[name="id"]').value;
  const correo = document.querySelector('input[name="correo"]').value;
  const telefono = document.querySelector('input[name="telefono"]').value;
  const direccion = document.querySelector('input[name="direccion"]').value;

  const data = {
    correo: correo,
    telefono: telefono,
    direccion: direccion,
    id: id,
  };

  fetch("/actualizarCliente/${cliente_id}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status === 200) {
      mensajeExito.textContent = "Cliente actualizado con exito";
      mensajeExito.style.display = "block";

      setTimeout(function () {
        window.history.back();
      }, 2000);
    }
    if (response.status === 400) {
      return response.json().then((data) => {
        mensajeError.textContent = " Cliente no encontrado";
        mensajeError.style.display = "block";
      });
    }
    if (response.status === 404) {
      mensajeError.textContent = "Error desconocido";
    }
  });
});
