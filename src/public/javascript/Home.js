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

const ctxPie = document.getElementById("myPieChart").getContext("2d");

const transaccionesDiaActual = {
  Transferencia: 5,
  Deposito: 10,
  Retiro: 3,
  Ahorro: 7
};

const myPieChart = new Chart(ctxPie, {
  type: "pie",
  data: {
    labels: Object.keys(transaccionesDiaActual),
    datasets: [
      {
        data: Object.values(transaccionesDiaActual),
        backgroundColor: ["#9ee6df", "#22997d", "#ffcc00","#d35400"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Transacciones de hoy",
    },
  },
});