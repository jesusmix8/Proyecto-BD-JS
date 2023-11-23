
import pandas as pd
import json

# Nombre del archivo Excel
import pandas as pd
import json

# Nombre del archivo Excel
archivo_excel = "CPdescarga.xlsx"

# Inicializa un diccionario vacío
codigo_postal_dict = {}

# Abre el archivo Excel
xls = pd.ExcelFile(archivo_excel)

# Itera a través de las hojas del archivo
for sheet_name in xls.sheet_names:
    # Lee cada hoja en un DataFrame
    df = xls.parse(sheet_name)
    
    # Itera a través de las filas del DataFrame
    for index, row in df.iterrows():

        codigo_postal = row["d_codigo"]
        colonia = row["d_asenta"]
        municipio = row["D_mnpio"]
        estado = row["d_estado"]
        # Si el código postal ya existe en el diccionario, actualiza la colonia
        if codigo_postal in codigo_postal_dict:
            codigo_postal_dict[codigo_postal]["colonia"].append(colonia)
        else:
            # Si no existe, crea una nueva entrada en el diccionario
            codigo_postal_dict[codigo_postal] = {"colonia": [colonia], "municipio": municipio, "estado": estado}

# Convierte las listas de colonias en cadenas
for codigo_postal in codigo_postal_dict:
    codigo_postal_dict[codigo_postal]["colonia"] = ', '.join(codigo_postal_dict[codigo_postal]["colonia"])

# Guarda el diccionario en un archivo JSON
with open("resultado.json", "w", encoding="utf-8") as file:
    json.dump(codigo_postal_dict, file, ensure_ascii=False, indent=4)

print("Diccionario guardado en resultado.json")




