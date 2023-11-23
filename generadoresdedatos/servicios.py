import random as rd
from datetime import date
from datetime import datetime
#INSERT INTO  catalogo_servicio ('Tarjeta Digital', 'concepto', noTarjeta, fechaDeExpiracion, cvv, cuenta_ID) VALUES ($1,$2,$3,$4,$5,$6); 

def generarTarjeta():
    #Codigo para generar la tarjeta 16 digitos

    # Se crea una lista con los numeros del 0 al 9
    numeros = ["1","2","3","4","5","6","7","8","9","0"]
    
    # Se crea una variable para almacenar la tarjeta
    tarjeta = ""

    # Se crea un ciclo para generar los 16 digitos de la tarjeta
    for i in range(16):
        # Se selecciona un numero aleatorio de la lista numeros
        number = rd.choice(numeros)
        # Se agrega el numero seleccionado a la cadena de la tarjeta
        tarjeta += number

    # Se regresa la tarjeta generada
    return tarjeta


def fechaDeExpiracion():
    now = datetime.now()
    añodeexp = now.year + 4
    mesdeexp = rd.randint(1,12)
    diaexp = rd.randint(1,28)

    fechaexp = str(añodeexp) + "-" + str(mesdeexp) + "-" + str(diaexp)

    return fechaexp

def generarCVV():
    #Codigo para generar el cvv de la tarjeta

    # Se crea una lista con los numeros del 0 al 9
    numeros = ["1","2","3","4","5","6","7","8","9","0"]

    # Se crea una variable para almacenar el cvv
    cvv = ""

    # Se crea un ciclo para generar los 3 digitos del cvv
    for i in range(3):
        # Se selecciona un numero aleatorio de la lista numeros
        number = rd.choice(numeros)
        # Se agrega el numero seleccionado a la cadena del cvv
        cvv += number

    # Se regresa el cvv generado
    return cvv

id = 5

def creartarjetas():
    global id
    conepto = "Tarjeta Digital"
    nodeTarjeta = generarTarjeta()
    fechaDeExpiraciontarjeta = fechaDeExpiracion()
    cvv = generarCVV()
    cuenta_ID = id

    id += 1

    query = f"INSERT INTO catalogo_servicio (nombreDeServicio, concepto, noTarjeta, fechaDeExpiracion, cvv, cuenta_ID)  VALUES ('{conepto}', '{conepto}', '{nodeTarjeta}', '{fechaDeExpiraciontarjeta}', '{cvv}', '{cuenta_ID}'); "

    return query


with open("servicios.sql", "w") as f:
    for i in range(1000000):
        f.write(creartarjetas() + "\n")
        
