import random as rd
from datetime import date
from datetime import datetime
import psycopg2
from psycopg2 import sql
import pandas as pd


dataframe = pd.read_excel('DatosTar.xlsx')
cuentas = dataframe['Column1']

def obtener_numero_azar():
    global cuentas
    numero = rd.randint(0, len(cuentas) - 1)
    return cuentas[numero]

def generar_fecha_aleatoria():
    año = rd.randint(2020, 2023)
    mes = rd.randint(1, 12)
    dia = rd.randint(1, 28)
    return date(año, mes, dia)

def generar_transaccion_query():  
    tipo_movimiento = "Transferencia"
    fecha = generar_fecha_aleatoria()
    cuenta_origen_dest = obtener_numero_azar()
    cuenta_destino = obtener_numero_azar()
    monto = rd.randint(1, 99999)
    cuenta_id = rd.randint(21, 1000005)

    query = f"INSERT INTO transaccion (fechadetransaccion, tipoDeMovimiento, cuentaOrigen, cuentaDestino, monto, concepto, cuenta_ID) VALUES ('{fecha}', '{tipo_movimiento}', '{cuenta_origen_dest}', '{cuenta_destino}', '{monto}', '{tipo_movimiento}', '{cuenta_id}');"

    return query


connection = psycopg2.connect(
    host="localhost",
    database="Banco",
    user="postgres",
    password="admin"
)

cursor = connection.cursor()

for i in range(1000000):
    cursor.execute(generar_transaccion_query())
    connection.commit()
    print(i)

cursor.close()
connection.close()