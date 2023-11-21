const pool = require("../db");

const inicioEmpleado = (req, res) => {
  res.sendFile("views/viewsEmpleado/loginEmpleado/loginempleado.html", {
    root: __dirname + "/../",
  });
};

const formularioCuentaEmpleado = (req, res) => {
  res.sendFile(
    "views/viewsEmpleado/crearCuentaEmpleado/formCrearEmpleado.html",
    {
      root: __dirname + "/../",
    }
  );
};

const crearCuentaEmpleado = async (req, res) => {
  try {
    console.log(req.body);
    const {
      Nombre,
      Apellido,
      Genero,
      Calle,
      Codigopostal,
      Numero,
      Colonia,
      Telefono,
      Correo,
      Fechadenacimiento,
      RFC,
      Puesto,
    } = req.body;

    const resultdireccion = await pool.query(
      "INSERT INTO direccion (calle, codigoPostal, numero, colonia) values ($1,$2,$3,$4) returning direccion_id",
      [Calle, Codigopostal, Numero, Colonia]
    );
    const idDireccion = resultdireccion.rows[0].direccion_id;

    const resultSucursal = await pool.query(
      "SELECT s.sucursal_id FROM sucursal s JOIN direccion d ON s.direccion_ID = d.direccion_ID JOIN catalogoEstado ce ON d.codigoPostal = ce.codigoPostal WHERE ce.codigoPostal = $1",
      [Codigopostal]
    );
    const numeroAleatorio = Math.floor(
      Math.random() * resultSucursal.rows.length
    );
    console.log(resultSucursal.rows[numeroAleatorio]);

    const idSucursal = resultSucursal.rows[0].sucursal_id;
    console.log(idSucursal);

    const resultEmpleado = await pool.query(
      "INSERT INTO empleado (RFC, nombre, apellido, numeroDeTelefono, correo, fechadeNacimiento, genero,puesto,fechadecontratacion,direccion_ID,sucursal_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9,$10) returning empleado_id",
      [
        RFC,
        Nombre,
        Apellido,
        Telefono,
        Correo,
        Fechadenacimiento,
        Genero,
        Puesto,
        idDireccion,
        idSucursal,
      ]
    );

    const idEmpleado = resultEmpleado.rows[0].empleado_id;
    console.log(idEmpleado);
  } catch (error) {}
};

module.exports = {
  inicioEmpleado,
  formularioCuentaEmpleado,
  crearCuentaEmpleado,
};
