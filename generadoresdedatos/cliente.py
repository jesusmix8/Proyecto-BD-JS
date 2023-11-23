import pandas as pd 
import random as rd
from datetime import date
from datetime import datetime
import gender_guesser.detector as gender
import secrets



direccion_ID  = 1075619
sucursal_id  = 4


lada = ["722", 
        "55",
        "33",
        "81",
        "656",
        "664",
        "686",
        "223",
        "229"]
numbers = ["1","2","3","4","5","6","7","8","9","0"]
numeroDetel = []


d = gender.Detector()
#Funcion para generar telefonos aleatorios
def generarTelefono():


    # Selecciona una lada aleatoria
    ladaSeleccionada = rd.choice(lada)
    # Crea un string con la lada seleccionada
    telefono = ladaSeleccionada + "" 
    # Si la lada seleccionada tiene 2 digitos se agregan 8 numeros aleatorios a la cadena del numero junto con la lada
    if len(ladaSeleccionada) == 2:
                numeroDetel.append(ladaSeleccionada)
                for i in range(8):
                    number = rd.choice(numbers)
                    telefono += number

    # Si la lada seleccionada tiene 3 digitos se agregan 7 numeros aleatorios a la cadena del numero junto con la lada
    elif len(ladaSeleccionada) == 3:
                numeroDetel.append(ladaSeleccionada)
                for i in range(7):
                    number = rd.choice(numbers)
                    telefono += number
    # Se regresa el numero generado
    return telefono 
        
# Se lee el archivo excel con pandas para extraer los datos
dataframe = pd.read_excel('Datos.xlsx')

# Se apuntan los datos de las columnas de excel a las variables
nombres = dataframe['Nombre']
apellidoPat = dataframe['Apellido']
apellidoMat = dataframe['Apellido']


# Se crea una funcion para generar los datos aleatorios
def generarDatos():
    global direccion_ID, sucursal_id
    # Se generan numeros aleatorios para seleccionar un dato de la columna nombre 
    numero = rd.randint(0, len(nombres)-1)
    # Se generan numeros aleatorios para seleccionar un dato de la columna apellido
    numero2 = rd.randint(0, len(apellidoMat)-1)
    # Se generan numeros aleatorios para seleccionar un dato de la columna apellido
    numero6 = rd.randint(0, len(apellidoPat)-1)

    # Se llama a la funcion para generar un numero de telefono aleatorio
    numeroDetel = generarTelefono()
    # Se genera un numero aleatorio para la edad
    edad = rd.randint(18, 70)


    now = datetime.now()
    añodenacimiento = now.year - edad
    mesdenacimiento = rd.randint(1,12)
    diadenacimiento = rd.randint(1,28)

    fechadenacimiento = str(añodenacimiento) + "-" + str(mesdenacimiento) + "-" + str(diadenacimiento)


    

    nombre = nombres[numero]
    apellido = apellidoPat[numero2]  + " " +apellidoMat[numero6]

    correos = ["@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com", "@live.com.mx", "@icloud.com"]


    correo = nombre + "." + apellido.replace(" ","") +str(rd.randint(0,100)) + rd.choice(correos)

    rfc = apellido[0:2].upper() + nombre[0:2].upper() + str(añodenacimiento) + str(mesdenacimiento) + str(diadenacimiento) + str(rd.randint(0,100))

    if (len(rfc) > 13):
        rfc = rfc[0:13]
    elif (len(rfc) < 13):
        rfc = rfc + str(rd.randint(0,100))
        rfc = rfc[0:13]
    
    

    genero = d.get_gender(nombre)
    if (genero== "female"):
        genero = "F"
    else:
        genero = "M"

    usuario = nombre[0:2].lower() + apellido[0:2].lower() + str(rd.randint(0,100)) 
    contraseña = secrets.token_hex(13)




    query = f"Insert into cliente (RFC, nombre, apellido, numeroDeTelefono, correo, fechadeNacimiento, genero, usuario, contrasena, direccion_ID, sucursal_id) values ('{rfc}', '{nombre}', '{apellido}', '{numeroDetel}', '{correo}', '{fechadenacimiento}', '{genero}', '{usuario}', '{contraseña}', '{direccion_ID}', '{sucursal_id}');"

    direccion_ID += 1
    sucursal_id += 1

    return query


 
# Se crea un archivo txt para guardar los datos generados 
# Se genera un ciclo for para generar n datos aleatorios y guardarlos en un archivo txt
with open('Clientes.sql', 'w') as archivo:
    
    for i in range(1000000):
        print(i)
        # Se genera una cadena con los datos generados
        dato = "".join(generarDatos())
        # Se guarda la cadena en el archivo txt
        archivo.write(dato + "\n")



