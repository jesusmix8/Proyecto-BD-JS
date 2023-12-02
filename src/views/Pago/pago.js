document.addEventListener("DOMContentLoaded", function () {
  const ctxPie = document.getElementById("myPieChart").getContext("2d");
  const saldoPrestamo = parseFloat(document.getElementById("saldoPrestamo").innerText.replace('$', '')) || 0;
  const saldoHipoteca = parseFloat(document.getElementById("saldoHipoteca").innerText.replace('$', '')) || 0;

  const labelsDeudas = ["PRÉSTAMO", "HIPOTECA"];
  const saldos = [saldoPrestamo, saldoHipoteca];

  const pieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: labelsDeudas,
      datasets: [
        {
          data: saldos,
          backgroundColor: ["#36A2EB", "#FFCE56"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
});