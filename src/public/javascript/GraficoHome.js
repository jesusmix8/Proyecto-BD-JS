const ctx = document.getElementById("myChart").getContext("2d");
// Obtiene el elemento que contiene los datos
var resultadosElement = document.getElementById('resultados-data');

// Accede al atributo data-resultados y convierte el JSON de nuevo a un objeto
var resultadosData = JSON.parse(resultadosElement.getAttribute('data-resultados'));

const meses = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];
const gastos = [
    resultadosData[0][2],
    resultadosData[1][2],
    resultadosData[2][2],
    resultadosData[3][2],
    resultadosData[4][2],
    resultadosData[5][2],
    resultadosData[6][2],
    resultadosData[7][2],
    resultadosData[8][2],
    resultadosData[9][2],
    resultadosData[10][2],
    resultadosData[11][2]
];
const ingresos = [
    resultadosData[0][3],
    resultadosData[1][3],
    resultadosData[2][3],
    resultadosData[3][3],
    resultadosData[4][3],
    resultadosData[5][3],
    resultadosData[6][3],
    resultadosData[7][3],
    resultadosData[8][3],
    resultadosData[9][3],
    resultadosData[10][3],
    resultadosData[11][3]
];
//const gastos = [10, 20, 15, 30, 25, 40, 35, 45, 20, 30, 25, 50];
//const ingresos = [15, 25, 20, 35, 30, 45, 40, 50, 25, 35, 30, 55];


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
