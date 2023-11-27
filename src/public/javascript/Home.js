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

const ctx = document.getElementById("myChart").getContext("2d");
const meses = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

const gastos = [10, 20, 15, 30, 25, 40, 35, 45, 20, 30, 25, 50];
const ingresos = [15, 25, 20, 35, 30, 45, 40, 50, 25, 35, 30, 55];

const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: meses,
    datasets: [
      {
        label: "Ingresos",
        data: ingresos,
        borderColor: "green",
        backgroundColor: "green",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Gastos",
        data: gastos,
        borderColor: "red",
        backgroundColor: "red",
        borderWidth: 1,
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const ctxBar = document.getElementById("myBarChart").getContext("2d");
const dias = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

const semanas = [
  [10, 20, 15, 30, 25, 40, 35]
];

const gastosSemanal = semanas.map(semana => semana.map(dia => dia * 0.6)); // suponiendo que los gastos son el 60% de los ingresos xd

const myBarChart = new Chart(ctxBar, {
  type: "bar",
  data: {
    labels: dias,
    datasets: [
      {
        label: "Gastos",
        data: gastosSemanal.flat(),
        backgroundColor: "#9ee6df",
        borderColor: "#9ee6df",
        borderWidth: 1,
      },
      {
        label: "Ingresos",
        data: semanas.flat(),
        backgroundColor: "#22997d",
        borderColor: "#22997d",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Gastos e Ingresos Semanales",
    },
  },
});
