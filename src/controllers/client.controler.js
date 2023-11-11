const pool = require("../db");

const inicio = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  res.sendFile("views/inicio/index.html", { root: __dirname + "/../" });
};

const login = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  res.sendFile("views/login/login.html", { root: __dirname + "/../" });
};

const formhtml = (req, res) => {
  res.sendFile("views/FormNewClient/form.html", { root: __dirname + "/../" });
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
    });
  }
};
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/login"); // Redirige al usuario a la página de inicio de sesión u otra página de tu elección
  });
};

const createClient = async (req, res) => {
  try {
    //conseguir direccion
    // direccion id , calle, numero, colonia, codigopostal
    const { Calle, Numero, Colonia, Codigopostal } = req.body;

    const resultdireccion = await pool.query(
      "INSERT INTO direccion (calle, codigoPostal, numero, colonia) values ($1,$2,$3,$4) returning direccion_id",
      [Calle, Codigopostal, Numero, Colonia]
    );
    const idDireccion = resultdireccion.rows[0].direccion_id;

    //Conseguir la sucursal

    const resultSucursal = await pool.query(
      "SELECT s.sucursal_id FROM sucursal s JOIN direccion d ON s.direccion_ID = d.direccion_ID JOIN catalogoEstado ce ON d.codigoPostal = ce.codigoPostal WHERE ce.codigoPostal = $1",
      [Codigopostal]
    );
    const idSucursal = resultSucursal.rows[0].sucursal_id;

    const {
      RFC,
      Nombre,
      Apellido,
      Telefono,
      Correo,
      Fechadenacimiento,
      Genero,
      Usuario,
      Contraseña,
    } = req.body;

    const result = await pool.query(
      "INSERT INTO cliente (RFC, nombre, apellido, numeroDeTelefono, correo, fechadeNacimiento, genero, usuario, contraseña, direccion_ID, sucursal_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11)",
      [
        RFC,
        Nombre,
        Apellido,
        Telefono,
        Correo,
        Fechadenacimiento,
        Genero,
        Usuario,
        Contraseña,
        idDireccion,
        idSucursal,
      ]
    );
    res.status(200).json({ message: "Cliente registrado exitosamente" });
  } catch (error) {
    if (error["code"] === "23505") {
      res.status(409).json({
        messageerror: "Usuario ya registrado",
        messagedetail: error["detail"],
      });
    } else {
      res.status(400).json({ message: "Error desconocido" });
    }
  }
};

const getDataClient = async (req, res) => {
  try {
    const { Usuario, Contraseña } = req.body;
    const result = await pool.query(
      "SELECT * FROM cliente WHERE Usuario = $1 AND Contraseña = $2",
      [Usuario, Contraseña]
    );
    console.log(result.rows);
    if (result.rows.length > 0) {
      const dataclient = await pool.query(
        "SELECT * FROM Cliente WHERE Usuario = $1",
        [Usuario]
      );
      if (dataclient.rows.length > 0) {
        // Convertir los datos a formato JSON
        const clienteJSON = JSON.stringify(dataclient["rows"]);
        req.session.usuario = JSON.parse(clienteJSON);
        res.status(200).json({ message: "Bienvenido" });
      } else {
        res
          .status(401)
          .json({ message: "No se encontraron datos del cliente" });
      }
    } else {
      res.status(401).json({ message: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const loaddashboard = async (req, res) => {
  const usuario = req.session.usuario;
  if (usuario) {
    res.render("dashboard", { usuario: usuario });
  } else {
    res.json({ message: "No hay usuario en la sesión" });
  }
};

const cargadePantallaTransferencia = (req, res) => {
  const usuario = req.session.usuario;
  if (usuario) {
    res.sendFile("views/Transferencia/formtransferencia.html", {
      root: __dirname + "/../",
    });
  } else {
    res.redirect("/login");
  }
};
//TODO implementar la transferencia
//Aqui se recibe el usuario de la cuenta destino, el monto y la descripcion desde el html "formtransferencia.html"
//Usando los datos de la sesion en req.session.usuario se obtiene el usuario de la cuenta origen
//Se comprueba si existe una cuenta destino con ese usuario
//Se comprueba si la cuenta origen y destino son la misma
//Se comprueba si la cuenta origen tiene saldo suficiente para realizar la transferencia
//Se realiza la transferencia

const transferclient = async (req, res) => {

  console.log("Ejecutando desde transferclient")
    
  // const { cuentaDestino, monto, descripcion } = req.body;
  // console.log(cuentaDestino, monto, descripcion);
  // //Comprobar si existe una cuenta destino con ese usuario
  // const result = await pool.query(
  //   "SELECT id_cuenta FROM cuenta WHERE usuario = $1",
  //   [cuentaDestino]
  // );

  // if (result.rows.length > 0) {
  //   //Comprobar si la cuenta origen y destino son la misma
  //   console.log("Cuenta destino encontrada");
  //   const usuario = req.session.usuario;
  //   const cuentaOrigen = usuario[0].usuario;
  //   const ID_Cuenta = usuario[0].id_cuenta;
  //   const ID_CuentaDestino = result.rows[0].id_cuenta;
  //   if (ID_Cuenta === result.rows[0].id_cuenta) {
  //     res
  //       .status(400)
  //       .json({ message: "No puedes transferir a la misma cuenta" });
  //   } else {
  //     //Comprobar si la cuenta origen tiene saldo suficiente para realizar la transferencia
  //     const saldoOrigen = await pool.query(
  //       "Select saldo from cuenta where usuario = $1",
  //       [cuentaOrigen]
  //     );

  //     const montoTransferencia = parseInt(monto);
  //     if (saldoOrigen < montoTransferencia) {
  //       res.status(400).json({ message: "Saldo insuficiente" });
  //     } else {
  //       const transferenciaQuery = await pool.query(
  //         "INSERT INTO Transaccion (Tipo_Transaccion, Monto, Fecha_Hora, ID_Cuenta, CuentaDestino) VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)",
  //         ["Transferencia", montoTransferencia, ID_Cuenta, ID_CuentaDestino]
  //       );
  //       res.status(200).json({ message: "Transferencia exitosa" });
  //     }
  //   }
  // } else {
  //   res.status(404).json({ message: "Cuenta destino no encontrada" });
  // }
};

const pantalladeahorro = (req, res) => {
  res.sendFile("views/Ahorro/FormAhorro.html", {
    root: __dirname + "/../",
  });
};

const deleteClient = (req, res) => {
  res.send("Delete cliente");
};

const updateClient = (req, res) => {
  res.send("Actualizando cliente");
};

module.exports = {
  pantalladeahorro,
  transferclient,
  logout,
  loaddashboard,
  login,
  inicio,
  formhtml,
  getDataClient,
  createClient,
  deleteClient,
  cargadePantallaTransferencia,
};
