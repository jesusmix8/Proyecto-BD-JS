document.addEventListener("DOMContentLoaded", function () {
  const ctxPie = document.getElementById("myPieChart").getContext("2d");
  const saldoSeguro = parseFloat(document.getElementById("saldoSeguro").innerText.replace('$', '')) || 0;
  const saldoPrestamo = parseFloat(document.getElementById("saldoPrestamo").innerText.replace('$', '')) || 0;
  const saldoHipoteca = parseFloat(document.getElementById("saldoHipoteca").innerText.replace('$', '')) || 0;

  const labelsDeudas = ["SEGURO", "PRÉSTAMO", "HIPOTECA"];
  const saldos = [saldoSeguro, saldoPrestamo, saldoHipoteca];

  const pieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: labelsDeudas,
      datasets: [
        {
          data: saldos,
          backgroundColor: ["#FF6961", "#36A2EB", "#FFCE56"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
});