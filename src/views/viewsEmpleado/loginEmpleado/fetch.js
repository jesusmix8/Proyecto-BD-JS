document.getElementById("formlogin").addEventListener("submit", (e) => {
  e.preventDefault();
  const idEmpleado = document.querySelector('input[name="idEmpleado"]').value;
  const correo = document.querySelector('input[name="emailEmplado"]').value;

  const data = {
    idEmpleado: idEmpleado,
    correo: correo,
  };

  fetch("/loginEmpleado", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status === 200) {
      window.location.href = "/perfilEmpleado";
    } else if (response.status === 400) {
      alert("Usuario o contraseña incorrectos");
    }
  });
});
