document.addEventListener("DOMContentLoaded", function () {
    const ctxPie = document.getElementById("myPieChart").getContext("2d");
    const deudasPagadas = [10, 5, 15]; // Aquí debes ingresar los montos de las deudas pagadas @ESDRAS

    const labelsDeudas = ["SEGURO", "PRÉSTAMO", "HIPOTECA"];

    const pieChart = new Chart(ctxPie, {
      type: "pie",
      data: {
        labels: labelsDeudas,
        datasets: [
          {
            data: deudasPagadas,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  });