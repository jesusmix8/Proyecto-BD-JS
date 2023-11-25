const pool = require("../db");

const destroySession = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
  });
};

const inicio = (req, res) => {
  destroySession(req, res);
  res.sendFile("views/inicio/index.html", { root: __dirname + "/../" });
};

const login = (req, res) => {
  destroySession(req, res);
  res.sendFile("views/login/login.html", { root: __dirname + "/../" });
};

const FormNewClient = (req, res) => {
  destroySession(req, res);
  res.sendFile("views/FormNewClient/form.html", { root: __dirname + "/../" });
};

const logout = (req, res) => {
  destroySession(req, res);
  res.redirect("/login");
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
    const numeroAleatorio = Math.floor(
      Math.random() * resultSucursal.rows.length
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

    const cliente = await pool.query(
      "INSERT INTO cliente (RFC, nombre, apellido, numeroDeTelefono, correo, fechadeNacimiento, genero, usuario, contrasena, direccion_ID, sucursal_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11) returning cliente_id",
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
    const idCliente = cliente.rows[0].cliente_id;
    const cuenta_iD = await pool.query(
      "Select cuenta_id from cuenta where cliente_id = $1",
      [idCliente]
    );
    const cuenta_ID = cuenta_iD.rows[0].cuenta_id;
    ultimos10Digitos = Math.floor(Math.random() * 10000000000);
    noDeTarjeta = "491566" + ultimos10Digitos.toString().padStart(10, "0");
    fechaDeExpiracion = new Date(
      new Date().setFullYear(new Date().getFullYear() + 3)
    );
    cvv = Math.floor(Math.random() * 100);
    const tarjetaDigital = await pool.query(
      "INSERT INTO  catalogo_servicio (nombreDeServicio, concepto, noTarjeta, fechaDeExpiracion, cvv, cuenta_ID) VALUES ($1,$2,$3,$4,$5,$6) returning servicio_id",
      [
        "Tarjeta Digital",
        "Tarjeta Digital",
        noDeTarjeta,
        fechaDeExpiracion,
        cvv,
        cuenta_ID,
      ]
    );
    servicioID = tarjetaDigital.rows[0].catalogo_servicio_id;

    res.status(200).json({ message: "Cliente registrado exitosamente" });
  } catch (error) {
    if (error["code"] === "23505") {
      res.status(409).json({
        messageerror: "Usuario ya registrado",
        messagedetail: error["detail"],
      });
    } else {
      console.log(error);
      res.status(400).json({ message: "Error desconocido" });
    }
  }
};

const getDataClient = async (req, res) => {
  try {
    const { Usuario, Contraseña } = req.body;
    const result = await pool.query(
      "SELECT * FROM cliente WHERE Usuario = $1 AND Contrasena = $2",
      [Usuario, Contraseña]
    );
    if (result.rows.length > 0) {
      const dataclient = await pool.query(
        "SELECT * FROM Cliente WHERE Usuario = $1",
        [Usuario]
      );
      if (dataclient.rows.length > 0) {
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
    const saldo = await pool.query(
      "SELECT saldo, cuenta_id FROM cuenta WHERE cliente_id = $1 ",
      [usuario[0].cliente_id]
    );
    usuario[0].saldo = saldo.rows[0].saldo;
    usuario[0].id_cuenta = saldo.rows[0].cuenta_id;
    const tranasacciones = await pool.query(
      "SELECT * FROM transaccion WHERE cuenta_id = $1 order by fechadetransaccion DESC limit 2 ",
      [usuario[0].id_cuenta]
    );
    usuario[0].transacciones = tranasacciones.rows;
    const servicios = await pool.query(
      "SELECT * FROM catalogo_servicio WHERE cuenta_id = $1",
      [usuario[0].id_cuenta]
    );
    usuario[0].servicios = servicios.rows;

    console.log(typeof usuario[0].transacciones[0].fechadetransaccion);

    console.log(usuario[0].transacciones[0].fechadetransaccion);

    res.render("dashboard", { usuario: usuario });
  } else {
    res.redirect("/login");
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

const realizarTransferenciaCliente = async (req, res) => {
  const usuario = req.session.usuario;
  const cuentaIDororigen = usuario[0].id_cuenta;
  const cuentaOrigen = await pool.query(
    "SELECT * FROM catalogo_servicio WHERE cuenta_id = $1;",
    [cuentaIDororigen]
  );

  const { cuentaDestino, monto, descripcion } = req.body;
  const tipo = "Transferencia";

  const idCuentaDestino = await pool.query(
    "SELECT * FROM catalogo_servicio WHERE notarjeta = $1;",
    [cuentaDestino]
  );
  //4915664587330136

  if (idCuentaDestino.rows.length > 0) {
    const noCuentaOrigen = cuentaOrigen.rows[0].notarjeta;
    const noCuentaDestino = idCuentaDestino.rows[0].notarjeta;
    // fecha y hora de la transaccion

    const result = await pool.query(
      "INSERT INTO transaccion (fechadetransaccion, tipodemovimiento, cuentaorigen, cuentadestino, monto, concepto, cuenta_id) values (NOW(),$1,$2,$3,$4,$5,$6)",
      [
        tipo,
        noCuentaOrigen,
        noCuentaDestino,
        monto,
        descripcion,
        cuentaIDororigen,
      ]
    );

    res.status(200).json({ message: "Transferencia exitosa" });

    
  } else {
    res.status(404).json({ message: "Cuenta destino no encontrada" });
  }
};

const pantallaDeposito = (req, res) => {
  res.sendFile("views/deposito/deposito.html", {
    root: __dirname + "/../",
  });
};

const realizarDeposito = async (req, res) => {
  const usuario = req.session.usuario;
  try {
    // revissar si hay usuario en sesion
    if (usuario) {
      const cantidad = req.body.Cantidad;
      const usuario = req.session.usuario;
      const cuenta_ID = usuario[0].id_cuenta;

      const result = await pool.query(
        "UPDATE cuenta SET saldo = saldo + $1 WHERE cuenta_id = $2",
        [cantidad, cuenta_ID]
      );
      res.status(200).json({ message: "Deposito exitoso" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error desconocido" });
  }
};

const SolicitudDeTdc = (req, res) => {
  res.sendFile("views/TDC/FormTDC.html", {
    root: __dirname + "/../",
  });
};
const crearTDC = async (req, res) => {
  console.log("Aqui ira la creacion del servicio de TDC");
};

const pantallatdc = (req, res) => {
  console.log("Aqui ira la pantalla de info de la TDC ");
};

const SolicitudDeSeguro = (req, res) => {
  res.sendFile("views/Seguro/FormSeguro.html", {
    root: __dirname + "/../",
  });
};

const crearSeguro = async (req, res) => {
  /*
  *He considerado 1 tipo de seguro
  *
  * 1.- Seguro de vida
  * 
  * He añadido un formulario de como pienso hacer para crear el seguro (esta en views/Services/services.html)
  */
  
  const usuario = req.session.usuario;

  const tipoDeServicio = "Seguro de vida";

  const idCuenta = usuario[0].cuenta_id;

  const fechaDeNacimiento = usuario[0].fechadenacimiento;

  /* Seria mejor manejar esto desde el archivo .js para unicamente recuperar cual es la suma sugerida
  *  y no tener que recuperar todos los datos del formulario

  //Recuperamos que opcion selecciono el usuario del combobox
  const rangoDeIngresos = req.body.rangoDeIngresos;

  //Recuperamos la cantidad de casillas que selecciono el usuario en el checkbox 
  const cantidadDeCasillas = req.body.cantidadDeCasillas;
  */

  //Recuperamos la suma sugerida del formulario
  const saldo = req.body.sumaSugerida;

  //Recuperamos la cantidad de dinero por cada pago mensual
  const pagoMinimo = req.body.pagoMensual;

  const saldoCuenta = await pool.query("SELECT saldo FROM cuenta WHERE cuenta_id = $1",
  [idCuenta]);

  const saldoActual = saldoCuenta.rows[0].saldo;

  //La expiracion es en 80 años despues de la fecha de apertura 
  const fechaDeExpiracion = new Date();
  fechaDeExpiracion.setFullYear(fechaDeExpiracion.getFullYear() + 80);

  //Su primer pago es dos meses despues de la fecha de apertura
  const fechaDePago = new Date();
  fechaDePago.setMonth(fechaDePago.getMonth() + 2);

  if(saldoActual >= pagoMinimo){
    
    const result = await pool.query("INSERT INTO catalogo_servicio (nombredeservicio, fechadeexpiracion, fechadeapertura, pagominimo, pagoparanogenerarintereses, fechadepago, intereses, saldo) VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6, $7)",
    [
      tipoDeServicio,
      fechaDeExpiracion,
      pagoMinimo,
      pagoMinimo,
      fechaDePago,
      0,
      saldo
    ]
    )
  }else{
    res.status(400).json({message : "No se puede crear el seguro, saldo insuficiente"});
  }

  console.log("Aqui ira la creacion del servicio de Seguro");
};

const pantallaseguro = (req, res) => {
  console.log("Aqui ira la pantalla de info del Seguro ");

  const usuario = req.session.usuario;

  const idCuenta = usuario[0].id_cuenta;

  const tipoDeServicio = "Seguro de vida";

  const result = await.pool.query("SELECT * FROM catalogo_servicio WHERE cuenta_id = $1 AND nombredeservicio = $2",
  [idCuenta], [tipoDeServicio]);

  if(result.rows.length > 0){
    res.status(200).json({
      TipoDeSeguro: result.rows[0].nombredeservicio,
      FechaDeExpiracion: result.rows[0].fechadeexpiracion,
      FechaDeApertura: result.rows[0].fechadeapertura,
      PagoMinimo: result.rows[0].pagominimo,
      PagoParaNogenerarIntereses: result.rows[0].pagoparanogenerarintereses,
      FechaDePago: result.rows[0].fechadepago,
      Intereses: result.rows[0].intereses,
      Saldo: result.rows[0].saldo
    })
  }else{
    res.status(404).json({message: "No se encontro el seguro"});
  }

};

const SolicitudDePrestamo = (req, res) => {
  res.sendFile("views/Prestamo/FormPrestamo.html", {
    root: __dirname + "/../",
  });
};

const crearPrestamo = async (req, res) => {
  console.log("Aqui ira la creacion del servicio de Prestamo");
};

const pantallaprestamo = (req, res) => {
  console.log("Aqui ira la pantalla de info del Prestamo ");
};

const SolicitudDeAhorro = (req, res) => {
  res.sendFile("views/Ahorro/FormAhorro.html", {
    root: __dirname + "/../",
  });
};

const crearAhorro = async (req, res) => {
  console.log("Aqui ira la creacion del servicio de Ahorro");
  const { NombreDelAhorro, Plazo, Monto } = req.body;

  res.status(200).json({ message: "Ahorro exitoso" });
};

const pantalladeahorro = (req, res) => {
  console.log("Aqui ira la pantalla de info del Ahorro ");
};

const cargarPantallaServicios = (req, res) => {
  res.sendFile("views/services/services.html", {
    root: __dirname + "/../",
  });
};

const mostrarServicios = (req, res) => {
  console.log("Aqui ira la pantalla de servicios ");
};

module.exports = {
  inicio,
  FormNewClient,
  createClient,
  loaddashboard,
  login,
  getDataClient,
  pantallaDeposito,
  realizarDeposito,
  realizarTransferenciaCliente,
  cargadePantallaTransferencia,
  SolicitudDeTdc,
  crearTDC,
  pantallatdc,
  SolicitudDeSeguro,
  crearSeguro,
  pantallaseguro,
  SolicitudDePrestamo,
  crearPrestamo,
  pantallaprestamo,
  SolicitudDeAhorro,
  crearAhorro,
  pantalladeahorro,
  logout,
  cargarPantallaServicios,
  mostrarServicios,
};
