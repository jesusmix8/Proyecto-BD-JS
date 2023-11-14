
const mensaje = document.getElementById('mensaje');

document.getElementById('deposito-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const Cantidad = document.querySelector('input[name="cantidad"]').value;

    console.log(Cantidad);

    fetch('/deposito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Cantidad })
    })
    .then(response => {
        if (response.status === 200){
            mensaje.textContent =  'Deposito realizado con exito';
            mensaje.style.display = 'block';

            setTimeout(function(){
                window.location.href = '/perfil';
            }, 2000);
            
        } else if (response.status === 400) {
            return response.json().then(data => {
                mesnsajeerror.textContent = data.message;
                mesnsajeerror.style.display = 'block';// Mostrar mensaje de error
            });
            
        }else if (response.status === 404) {
            mesnsajeerror.textContent = 'Error desconocido';
        }}
)}
);