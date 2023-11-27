
const a = document.querySelectorAll("a");
const boton = document.querySelectorAll("button");

a.forEach(enlace => {
    enlace.addEventListener('click',function(){
    a.forEach(function(e){
        e.classList.remove('active');
        e.classList.add('inactive');
    })
    enlace.classList.remove('inactive');
    enlace.classList.add('active')

    })
})

boton.forEach(btn => {
    btn.addEventListener('click',function(){

        boton.forEach((e)=>{
            e.classList.remove('btn-active')
            e.classList.add('btn-inactive');
        } )

        btn.classList.add('btn-active')
}) })

document.addEventListener('DOMContentLoaded', function () {
  var tarjetaElement = document.getElementById('tarjeta');
  var numeroTarjeta = tarjetaElement.textContent.trim();
  // Separar cada cuatro dígitos con un espacio
  var tarjetaFormateada = numeroTarjeta.replace(/\s/g, '').replace(/(\d{4}(?=\d))/g, '$1 ');
  tarjetaElement.textContent = tarjetaFormateada;
});

   // Datos
   const data = [
    { "estado": "Chihuahua", "numerodetransferencias": "748", "ranking": "1" },
  { "estado": "Guanajuato", "numerodetransferencias": "718", "ranking": "2" },
  { "estado": "México", "numerodetransferencias": "653", "ranking": "3" },
  { "estado": "Chiapas", "numerodetransferencias": "646", "ranking": "4" },
  {
    "estado": "Michoacán de Ocampo",
    "numerodetransferencias": "633",
    "ranking": "5"
  },
  { "estado": "Sonora", "numerodetransferencias": "616", "ranking": "6" },
  {
    "estado": "Veracruz de Ignacio de la Llave",
    "numerodetransferencias": "581",
    "ranking": "7"
  },
  { "estado": "Durango", "numerodetransferencias": "518", "ranking": "8" },
  { "estado": "Jalisco", "numerodetransferencias": "451", "ranking": "9" },
  { "estado": "Hidalgo", "numerodetransferencias": "442", "ranking": "10" },
  { "estado": "Oaxaca", "numerodetransferencias": "431", "ranking": "11" },
  { "estado": "Puebla", "numerodetransferencias": "384", "ranking": "12" },
  { "estado": "Guerrero", "numerodetransferencias": "384", "ranking": "12" },
  {
    "estado": "San Luis Potosí",
    "numerodetransferencias": "377",
    "ranking": "14"
  },
  {
    "estado": "Nuevo León",
    "numerodetransferencias": "324",
    "ranking": "15"
  },
  {
    "estado": "Coahuila de Zaragoza",
    "numerodetransferencias": "301",
    "ranking": "16"
  },
  { "estado": "Sinaloa", "numerodetransferencias": "274", "ranking": "17" },
  {
    "estado": "Tamaulipas",
    "numerodetransferencias": "223",
    "ranking": "18"
  },
  { "estado": "Querétaro", "numerodetransferencias": "206", "ranking": "19" },
  {
    "estado": "Baja California",
    "numerodetransferencias": "192",
    "ranking": "20"
  },
  { "estado": "Tabasco", "numerodetransferencias": "185", "ranking": "21" },
  { "estado": "Zacatecas", "numerodetransferencias": "164", "ranking": "22" },
  { "estado": "Nayarit", "numerodetransferencias": "122", "ranking": "23" },
  {
    "estado": "Aguascalientes",
    "numerodetransferencias": "119",
    "ranking": "24"
  },
  {
    "estado": "Ciudad de México",
    "numerodetransferencias": "118",
    "ranking": "25"
  },
  { "estado": "Morelos", "numerodetransferencias": "116", "ranking": "26" },
  { "estado": "Yucatán", "numerodetransferencias": "112", "ranking": "27" },
  { "estado": "Campeche", "numerodetransferencias": "93", "ranking": "28" },
  {
    "estado": "Baja California Sur",
    "numerodetransferencias": "88",
    "ranking": "29"
  },
  { "estado": "Tlaxcala", "numerodetransferencias": "80", "ranking": "30" },
  {
    "estado": "Quintana Roo",
    "numerodetransferencias": "77",
    "ranking": "31"
  },
  { "estado": "Colima", "numerodetransferencias": "76", "ranking": "32" }
  ];

  // Preparar datos para el gráfico
  const estados = data.map(item => item.estado);
  const transferencias = data.map(item => parseInt(item.numerodetransferencias));

  // Crear el gráfico
  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: estados,
      datasets: [{
        label: 'Número de Transferencias',
        data: transferencias,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });