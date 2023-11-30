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