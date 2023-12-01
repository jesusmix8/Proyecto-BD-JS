const selectMes = document.getElementById('selectMes');
const canvas = document.getElementById('grafica');
const ctx = canvas.getContext('2d');

// Función para cargar el archivo JSON y generar el gráfico
async function cargarJSON() {
  try {
    // Hacer una solicitud para obtener el contenido del archivo JSON
    const respuesta = await fetch('/resultado.json');

    // Verificar si la solicitud fue exitosa
    if (!respuesta.ok) {
      throw new Error('Error al cargar el archivo JSON');
    }

    // Obtener el objeto JSON desde la respuesta
    const datosJson = await respuesta.json();

    // Obtener todas las fechas únicas para llenar el select
    const fechasUnicas = [...new Set(datosJson.map(dato => dato.mes))];

    // Llenar el select con las fechas únicas
    fechasUnicas.forEach(fecha => {
      const option = document.createElement('option');
      option.value = fecha;
      option.textContent = fecha || 'Sin fecha';
      selectMes.appendChild(option);
    });

    // Función para actualizar la gráfica según la fecha seleccionada
    function actualizarGrafica() {
      const fechaSeleccionada = selectMes.value;
      const datosFiltrados = datosJson.filter(dato => dato.mes === fechaSeleccionada);

      // Lógica para dibujar la gráfica con los datosFiltrados
      dibujarGrafica(datosFiltrados);
    }

    // Escuchar cambios en el select y actualizar la gráfica
    selectMes.addEventListener('change', actualizarGrafica);

    // Llamar a la función inicialmente para mostrar la gráfica con todos los datos
    actualizarGrafica();
  } catch (error) {
    console.error('Error al cargar el archivo JSON:', error.message);
  }
}

// Función para dibujar la gráfica
function dibujarGrafica(datos) {
  // Obtener etiquetas y datos para el gráfico
  const etiquetas = datos.map(dato => dato.sucursal);
  const datosTransferencias = datos.map(dato => +dato.numerodetransferencias);

  // Crear el gráfico
  const grafica = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Número de Transferencias',
        data: datosTransferencias,
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
}

// Llamar a la función para cargar el archivo JSON
cargarJSON();