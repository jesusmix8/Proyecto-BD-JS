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
  });
});
