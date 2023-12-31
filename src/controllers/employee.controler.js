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

    const idSucursal = resultSucursal.rows[0].sucursal_id;

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
    res.status(200).json({ message: "Se ha creado el empleado correctamente" });
  } catch (error) {
    res.status(400).json({ message: "No se ha podido crear la cuenta" });
  }
};

const login = async (req, res) => {
  console.log(req.body);
  try {
    const { idEmpleado, correo } = req.body;
    const resultEmpleado = await pool.query(
      "SELECT * FROM empleado WHERE empleado_id = $1 AND correo = $2",
      [idEmpleado, correo]
    );
    if (resultEmpleado.rows.length > 0) {
      const clienteJSON = JSON.stringify(resultEmpleado["rows"]);
      req.session.usuario = JSON.parse(clienteJSON);

      res.status(200).json({ message: "OK" });
    } else {
      res.status(400).json({ message: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error desconocido" });
  }
};

const loaddashboardEmpleado = async (req, res) => {
  try {
    const usuario = req.session.usuario;
    const id = usuario[0].empleado_id;
    const idSucursal = usuario[0].sucursal_id;

    const sucursal = await pool.query(
      "SELECT s.nomsucursal FROM sucursal s JOIN empleado e ON s.sucursal_id = e.sucursal_id WHERE e.empleado_id = $1",
      [id]
    );

    const clientesEnSucursal = await pool.query(
      "SELECT * FROM cliente WHERE sucursal_id = $1",
      [idSucursal]
    );

    console.log(clientesEnSucursal.rows);

    const query = `
    WITH TransferenciasPorEstado AS (
        SELECT
            ce.nombreEstado AS Estado,
            EXTRACT(YEAR FROM t.fechaDeTransaccion) AS Año,
            COUNT(*) AS NumeroDeTransferencias
        FROM
            fact_transferencia ft
        JOIN
            catalogoEstado ce ON ft.codigoPostal = ce.codigoPostal
        JOIN
            transaccion t ON ft.transaccion_ID = t.transaccion_ID
        WHERE
            EXTRACT(YEAR FROM t.fechaDeTransaccion) = EXTRACT(YEAR FROM CURRENT_DATE)  -- Filtrar por el año actual
        GROUP BY
            ce.nombreEstado, Año
    )
    SELECT
        Estado,
        NumeroDeTransferencias,
        RANK() OVER (ORDER BY NumeroDeTransferencias DESC) AS Ranking
    FROM
        TransferenciasPorEstado
    ORDER BY
        NumeroDeTransferencias DESC limit 10;
    `;

    const datamart = await pool.query(query);

    const query2 = `
    SELECT
    CASE
        WHEN s.nomSucursal IS NULL THEN 'Total General'
        ELSE s.nomSucursal
    END AS Sucursal,
    COUNT(*) AS NumeroDeTransferencias
FROM fact_transferencia ft
LEFT JOIN sucursal s ON ft.nomSucursal = s.nomSucursal
GROUP BY ROLLUP (s.nomSucursal)
ORDER BY NumeroDeTransferencias DESC limit 10;
    `;

    const query3 = `
    SELECT
    s.nomSucursal AS Sucursal,
    TO_CHAR(t.fechaDeTransaccion, 'YYYY-MM') AS Mes,
    COUNT(*) AS NumeroDeTransferencias
FROM fact_transferencia ft
JOIN sucursal s ON ft.nomSucursal = s.nomSucursal
JOIN transaccion t ON ft.transaccion_ID = t.transaccion_ID
GROUP BY CUBE (s.nomSucursal, TO_CHAR(t.fechaDeTransaccion, 'YYYY-MM'))
ORDER BY GROUPING(s.nomSucursal), GROUPING(TO_CHAR(t.fechaDeTransaccion, 'YYYY-MM')), NumeroDeTransferencias DESC, Sucursal, Mes
LIMIT 5;

    `;

    usuario[0].sucursal = sucursal.rows[0].nomsucursal;
    usuario[0].clientes = clientesEnSucursal.rows;
    const datosSucursales = await pool.query(query2);

    const datos3 = await pool.query(query3);

    console.log(datos3.rows);

    datosSucursales.rows.sort((a, b) => {
      return (
        parseInt(b.numerodetransferencias) - parseInt(a.numerodetransferencias)
      );
    });

    datos3.rows.sort((a, b) => {
      return (
        parseInt(b.numerodetransferencias) - parseInt(a.numerodetransferencias)
      );
    });

    res.render("viewsEmpleado/dashboardEmpleado/dashboardempleado", {
      usuario: usuario,
      data1: datamart.rows,
      datosSucursales: datosSucursales.rows,
      datos: datos3.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

const clientesEnSucursal = (req, res) => {
  const usuario = req.session.usuario;
  res.render("viewsEmpleado/ClientesSucursal/clientesenSucursal", {
    usuario: usuario,
  });
};

const updateCliente = async (req, res) => {
  const clienteId = req.params.cliente_id;
  console.log(clienteId);
  const cliente = await pool.query(
    "SELECT * FROM cliente WHERE cliente_id = $1",
    [clienteId]
  );
  const direccioncliente = await pool.query(
    "SELECT * FROM direccion WHERE direccion_id = $1",
    [cliente.rows[0].direccion_id]
  );
  console.log(direccioncliente.rows[0]);
  cliente.rows[0].direccion = direccioncliente.rows[0];
  console.log(cliente.rows[0]);
  res.render("editarCliente", {
    cliente: cliente.rows[0],
  });
};

const updatedatosClientes = async (req, res) => {
  console.log(req.body);
  const updateCliente = await pool.query(
    "UPDATE cliente SET correo = $1, numerodetelefono = $2 WHERE cliente_id = $3",
    [req.body.correo, req.body.telefono, req.body.id]
  );
  res.status(200).json({ message: "OK" });
};

const eliminarCliente = async (req, res) => {
  const idCliente = req.body.id;

  const consultaCuentaID = await pool.query(
    "SELECT * FROM cuenta WHERE cliente_id = $1",
    [idCliente]
  );

  const cuentaID = consultaCuentaID.rows[0].cuenta_id;

  console.log(idCliente);
  try {
    const eliminarTransacciones = await pool.query(
      "DELETE FROM transaccion WHERE cuenta_id = $1",
      [cuentaID]
    );

    const eliminiarServicio = await pool.query(
      "DELETE FROM catalogo_servicio WHERE cuenta_id = $1",
      [cuentaID]
    );

    const eliminiarCuenta = await pool.query(
      "DELETE FROM cuenta WHERE cliente_id = $1",
      [idCliente]
    );

    const result = await pool.query(
      "DELETE FROM cliente WHERE cliente_id = $1",
      [idCliente]
    );

    res
      .status(200)
      .json({ message: "Se ha eliminado el cliente correctamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "No se ha podido eliminar el cliente" });
  }
};

module.exports = {
  inicioEmpleado,
  formularioCuentaEmpleado,
  crearCuentaEmpleado,
  loaddashboardEmpleado,
  login,
  clientesEnSucursal,
  updateCliente,
  updatedatosClientes,
  eliminarCliente,
};
