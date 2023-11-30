    const inputFecha = document.getElementById('inputFecha');
    const canvas = document.getElementById('grafica');
    const ctx = canvas.getContext('2d');
  
      async function cargarJSON() {
        try {
          const respuesta = await fetch('/html/resultado.json');
  
          if (!respuesta.ok) {
            throw new Error('Error al cargar el archivo JSON');

          }
          
          const datosJson = await respuesta.json();
          function actualizarGrafica() {
            const fechaSeleccionada = inputFecha.valueAsDate;
            if (!fechaSeleccionada) return;
  
            const mesSeleccionado = (fechaSeleccionada.getMonth() + 1).toString().padStart(2, '0');
            const anoSeleccionado = fechaSeleccionada.getFullYear().toString();
  
            const datosFiltrados = datosJson.filter(dato => {
              const fechaDato = dato.mes;
              return fechaDato && fechaDato.startsWith(`${anoSeleccionado}-${mesSeleccionado}`);
            });
  
            dibujarGrafica(datosFiltrados);
          }
          inputFecha.addEventListener('change', actualizarGrafica);
  
          actualizarGrafica();
        } catch (error) {
          console.error('Error al cargar el archivo JSON:', error.message);
        }
      }
  
      function dibujarGrafica(datos) {
        const etiquetas = datos.map(dato => dato.sucursal);
        const datosTransferencias = datos.map(dato => +dato.numerodetransferencias);

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

      cargarJSON();