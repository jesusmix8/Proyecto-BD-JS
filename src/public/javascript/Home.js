const a = document.querySelectorAll("a");
const boton = document.querySelectorAll("button");

a.forEach(enlace => {
  enlace.addEventListener('click', function () {
    a.forEach(function (e) {
      e.classList.remove('active');
      e.classList.add('inactive');
    })
    enlace.classList.remove('inactive');
    enlace.classList.add('active')

  })
})

boton.forEach(btn => {
  btn.addEventListener('click', function () {

    boton.forEach((e) => {
      e.classList.remove('btn-active')
      e.classList.add('btn-inactive');
    })

    btn.classList.add('btn-active')
  })
})

document.addEventListener('DOMContentLoaded', function () {
  var tarjetaElement = document.getElementById('tarjeta');
  var numeroTarjeta = tarjetaElement.textContent.trim();
  // Separar cada cuatro dígitos con un espacio
  var tarjetaFormateada = numeroTarjeta.replace(/\s/g, '').replace(/(\d{4}(?=\d))/g, '$1 ');
  tarjetaElement.textContent = tarjetaFormateada;
});

function toggleVisibilidadDatos() {
  var datosCVV = document.querySelector('.cvv');
  var datosFechaExpiracion = document.querySelector('.fecha-expiracion');
  datosCVV.classList.toggle('oculto');
  datosFechaExpiracion.classList.toggle('oculto');
}

document.addEventListener("DOMContentLoaded", function() {
  var fechaExpElement = document.querySelector('.fecha-expiracion');

  if (fechaExpElement) {
    var fechaOriginal = fechaExpElement.innerText;
    var fechaFormateada = formatearFecha(fechaOriginal);
    fechaExpElement.innerText = fechaFormateada;
  }
});

function formatearFecha(fechaString) {
  var fecha = new Date(fechaString);
  var mes = fecha.getMonth() + 1;
  var año = fecha.getFullYear() % 100;
  var fechaFormateada = (mes < 10 ? '0' : '') + mes + '/' + (año < 10 ? '0' : '') + año;

  return fechaFormateada;
}