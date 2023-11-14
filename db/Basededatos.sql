/* Aqui iran los querys de la creacion de la base de datos 
Modificaciones:
1- La tabla estado-municipio queda como catalogo municipio y se relaciona 
con dirección con el codigo postal
2- Se elimino la tabla servicio, ya que la absorvió la de caracteristica-servicio, 
pasandose a llamar CatalogoServicio el cual se referencía con cuenta
*/

--Orden para crear las tablas (seguir como vienen las sentencias)

--Para Tabla catalogo_estado

CREATE TABLE catalogoEstado (
    codigoPostal INTEGER PRIMARY KEY NOT NULL,
    nombreEstado VARCHAR(255) NOT NULL,
    nombreMunicipio VARCHAR(255) NOT NULL,
    CONSTRAINT codigoPostal_positivo CHECK (codigoPostal > 0)
);


--Tabla direccion

CREATE TABLE direccion(
      direccion_ID serial PRIMARY KEY NOT NULL,
      calle VARCHAR(255) NOT NULL,
      numero VARCHAR(255) NOT NULL,
      colonia VARCHAR(255) NOT NULL,
      codigoPostal INTEGER CONSTRAINT catalogoEstado_fkey REFERENCES catalogoEstado(codigoPostal)
);

--Tabla persona

CREATE TABLE persona (
     RFC VARCHAR(13) PRIMARY KEY NOT NULL,
     nombre VARCHAR(255) NOT NULL,
     apellido VARCHAR(255) NOT NULL,
     numeroDeTelefono NUMERIC(10) NOT NULL,
     correo VARCHAR(255) NOT NULL,
     fechadeNacimiento DATE NOT NULL,
     genero VARCHAR(1) NOT NULL,
     direccion_ID INTEGER CONSTRAINT direccion_ID_fkey REFERENCES direccion(direccion_ID),
     CONSTRAINT genero_IN CHECK (genero IN ('M', 'F')),
     CONSTRAINT numeroDeTelefono_non_negative CHECK (numeroDeTelefono >= 0),
     CONSTRAINT telefono_unico UNIQUE (numeroDeTelefono)
);

--Tabla cliente

CREATE TABLE cliente (
   cliente_ID serial PRIMARY KEY NOT NULL,
   usuario VARCHAR(255) NOT NULL,
   contraseña VARCHAR(255) NOT NULL,
   CONSTRAINT usuario_length_check CHECK (LENGTH(usuario) > 0),
   CONSTRAINT contraseña_length_check CHECK (LENGTH(contraseña) > 0),
   CONSTRAINT rfc_unique UNIQUE (RFC)
) INHERITS (persona);

--Tabla empleado

CREATE TABLE empleado (
     empleado_ID serial PRIMARY KEY NOT NULL,
     puesto VARCHAR (255) NOT NULL,
     fechadecontratacion DATE NOT NULL,
     fechaDeDespido DATE,
     CONSTRAINT rfc_unico UNIQUE (RFC),
     CONSTRAINT fecha_despido_valida CHECK (fechaDeDespido IS NULL OR fechaDeDespido >= fechadecontratacion)
) INHERITS (persona);

--Tabla sucursal

CREATE TABLE sucursal(
    sucursal_ID serial PRIMARY KEY NOT NULL,
    nomSucursal VARCHAR(255) NOT NULL,
    horario VARCHAR(255) NOT NULL,
    telefonoDeContacto NUMERIC(10) NOT NULL,
    direccion_ID INTEGER CONSTRAINT direccion_ID_fkey REFERENCES direccion(direccion_ID),
    cliente_ID INTEGER CONSTRAINT cliente_ID_fkey REFERENCES cliente(cliente_ID),
    empleado_ID INTEGER CONSTRAINT empleado_ID_fkey REFERENCES empleado(empleado_ID)
);

--Tabla cuenta

CREATE TABLE cuenta(
 	cuenta_ID SERIAL PRIMARY KEY NOT NULL,
        cliente_ID integer CONSTRAINT cliente_ID_fkey REFERENCES 	cliente(cliente_ID)
 );

CREATE TABLE transaccion (
    transaccion_ID serial NOT NULL,
    fechaDeTransaccion DATE NOT NULL,
    tipoDeMovimiento VARCHAR(255) NOT NULL,
    cuentaOrigen varchar(255) NOT NULL,
    cuentaDestino varchar(255) NOT NULL,
    monto decimal (10,2) NOT NULL,
    concepto varchar(255) NOT NULL,
    cuenta_ID INTEGER CONSTRAINT cuenta_ID_fkey REFERENCES cuenta(cuenta_ID),
    CONSTRAINT monto_positivo CHECK (monto > 0),
    PRIMARY KEY (transaccion_ID, monto)
) PARTITION BY RANGE (monto);

--Se hicieron 3 particiones por que ya habiamos definido que lo maximo de una transaccion seria 10000, entonces se particionó de la siguiente manera

-- Primera partición: Monto menor a 1000
CREATE TABLE transaccion_menor_1000 PARTITION OF transaccion FOR VALUES FROM (MINVALUE) TO (999);

-- Segunda partición: Monto entre 1000 y 5000
CREATE TABLE transaccion_1000_5000 PARTITION OF transaccion FOR VALUES FROM (1000) TO (4999);

-- Tercera partición: Monto mayor a 5000
CREATE TABLE transaccion_mayor_5000 PARTITION OF transaccion FOR VALUES FROM (5000) TO (MAXVALUE);

--Para Tabla catalogo_servicio

CREATE TABLE catalogo_servicio (
     servicio_ID serial PRIMARY KEY NOT NULL,
     nombreDeServicio VARCHAR (255) NOT NULL,
     concepto VARCHAR(255),
     cveInterbancaria NUMERIC(255),
     noTarjeta NUMERIC(255),
     lineaDeCredito FLOAT,
     fechaDeCredito DATE,
     fechaDeExpiracion DATE,
     cvv INTEGER,
     nip INTEGER,
     fechaDeApertura DATE,
     pagoMinimo FLOAT,
     pagoParaNoGenerarIntereses FLOAT,
     promociones VARCHAR(255),
     fechaDePago DATE,
     intereses FLOAT,
     saldo FLOAT,
     cuenta_ID INTEGER CONSTRAINT cuenta_ID_fkey REFERENCES cuenta(cuenta_ID)
     CONSTRAINT lineaDeCredito_positiva CHECK (lineaDeCredito >= 0),
     CONSTRAINT intereses_non_negative CHECK (intereses >= 0)
 );

 -- Tabla Fact para el Data Mart

CREATE TABLE fact_transferencia(
	transaccion_ID serial PRIMARY KEY NOT NULL,
	nombreDeServicio VARCHAR (255) NOT NULL,
	fechaDeTransaccion DATE NOT NULL,
	tipoDeMovimiento VARCHAR(255) NOT NULL,
	monto decimal (10,2) NOT NULL,
	nombre VARCHAR(255) NOT NULL,
	apellido VARCHAR(255) NOT NULL,
	nomSucursal VARCHAR(255) NOT NULL,
	codigoPostal INTEGER NOT NULL,
	nombreEstado VARCHAR(255) NOT NULL,
	nombreMunicipio VARCHAR(255) NOT NULL,
	cuenta_ID INTEGER CONSTRAINT cuenta_ID_fkey REFERENCES cuenta(cuenta_ID)
);

-- Agregar sucursal_ID a la tabla cliente
ALTER TABLE cliente
ADD COLUMN sucursal_ID INTEGER,
ADD CONSTRAINT sucursal_cliente_fkey FOREIGN KEY (sucursal_ID) REFERENCES sucursal(sucursal_ID),
ALTER COLUMN sucursal_ID SET NOT NULL;

-- Agregar sucursal_ID a la tabla empleado
ALTER TABLE empleado
ADD COLUMN sucursal_ID INTEGER,
ADD CONSTRAINT sucursal_empleado_fkey FOREIGN KEY (sucursal_ID) REFERENCES sucursal(sucursal_ID),
ALTER COLUMN sucursal_ID SET NOT NULL;

-- Eliminar cliente_ID y empleado_ID de la tabla sucursal
ALTER TABLE sucursal
DROP COLUMN cliente_ID,
DROP COLUMN empleado_ID;
 
ALTER TABLE catalogoestado
ALTER COLUMN nombremunicipio TYPE VARCHAR(100);

ALTER TABLE catalogoestado
ALTER COLUMN nombreestado TYPE VARCHAR(100);