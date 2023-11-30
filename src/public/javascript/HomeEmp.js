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
