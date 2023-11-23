import pandas as pd
import random as rd

# Lee el archivo Excel
dataframe = pd.read_excel('Direcciones.xlsx')

# Obtiene las columnas del DataFrame
codigo = dataframe['Codigo']
colonia = dataframe['Colonia']
calledf = dataframe['Calle']

# Define la función para generar datos y escribir en el archivo
def generardatos(codigo, colonia, calle, numero):
    query = "INSERT INTO Direccion (calle, codigoPostal, numero, colonia ) VALUES ('{}', '{}', '{}', '{}');".format(calle,codigo, numero, colonia )
    return query

# Abre el archivo para escribir
with open('DireecionesClientes2.sql', 'w',  encoding="utf-8") as f:
#       # Itera un millón de veces
    for _ in range(7):
        print(_)
#           # Itera sobre las filas del DataFrame y escribe las consultas SQL en el archivo
        for i in range(len(dataframe)):
            print(i)            
            codigo_actual = codigo.iloc[i]
            colonia_actual = colonia.iloc[i]
            calle_actual = rd.randint(0, 399)
            numero_actual = rd.randint(0, 10000)

# # #              # Llama a la función generardatos para obtener la consulta SQL
            query_sql = generardatos(codigo_actual, colonia_actual, calledf[calle_actual], numero_actual)
# #              # Escribe la consulta SQL en el archivo
            f.write(query_sql + '\n')

# with open('QueryCreacionSucrsal.sql', 'w') as f:
#     idDireccion = 1
#     for _ in range (7):

#         for i in range(len(dataframe)):
#             colonia_actual = colonia.iloc[i]
#             calle_actual = rd.randint(0, 399)

#             nombreSucursal = colonia_actual + " " + calledf[calle_actual]
#             horario = "Lunes a Viernes de 9:00 a 16:00"
#             numeroDeTelefono = rd.randint(100000, 999999)
#             query_sql = "INSERT INTO Sucursal (nomSucursal, horario, telefonoDeContacto, direccion_ID) VALUES ('{}', '{}', '{}', '{}');".format(nombreSucursal, horario, numeroDeTelefono, idDireccion)
#             f.write(query_sql + '\n')
#             idDireccion =+ idDireccion + 1

