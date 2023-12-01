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

    //Seleccionar una sucursal aleatoria
    const numeroAleatorio = Math.floor(
      Math.random() * resultSucursal.rows.length
    );

    const idSucursal = resultSucursal.rows[numeroAleatorio].sucursal_id;

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
    cvv = Math.floor(Math.random() * 1000);
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

    const servicioTarjeta = await pool.query(
      "SELECT * FROM catalogo_servicio WHERE cuenta_id = $1 AND nombredeservicio = $2",
      [usuario[0].id_cuenta, "Tarjeta Digital"]
    );
    console.log(servicioTarjeta.rows[0].fechadeexpiracion);
    res.render("Dashboard/dashboard", {
      usuario: usuario,
      servicioTarjeta: servicioTarjeta,
    });
  } else {
    res.redirect("/login");
  }
};

const cargadePantallaTransferencia = async (req, res) => {
  const usuario = req.session.usuario;
  if (usuario) {
    res.render("Transferencia/formtransferencia", { usuario: usuario });
  } else {
    res.redirect("/login");
  }
};

const cargadePantallaPago = async (req, res) => {
  const usuario = req.session.usuario;
  if (usuario) {
    const serviciosABuscar = ["Pago de seguro", "Prestamo", "Hipoteca"];

    const transacciones = await pool.query(
      "SELECT tipodemovimiento, monto FROM transaccion WHERE cuenta_id = $1",
      [usuario[0].id_cuenta]
    );

    const transaccionesFiltradas = transacciones.rows.filter((transaccion) =>
      serviciosABuscar.includes(transaccion.tipodemovimiento)
    );

    const sumasPorServicio = {};
    transaccionesFiltradas.forEach((transaccion) => {
      const tipoMovimiento = transaccion.tipodemovimiento;
      const monto = transaccion.monto;

      if (!sumasPorServicio[tipoMovimiento]) {
        sumasPorServicio[tipoMovimiento] = 0;
      }

      sumasPorServicio[tipoMovimiento] += monto;
    });
    res.render("Pago/pago", { usuario: usuario, sumasPorServicio });
  } else {
    res.redirect("/login");
  }
};

const cargadePantallaConfiguracion = async (req, res) => {
  const usuario = req.session.usuario;
  if (usuario) {
    res.render("Configuracion/configuracion", { usuario: usuario });
  } else {
    res.redirect("/login");
  }
};

const cambiarContrasena = async (req, res) => {
  const usuario = req.session.usuario;

  if (usuario) {
    const { contrasenaActual, contrasenaNueva, contrasenaConfirmada } =
      req.body;

    const contrasenaCuenta = usuario[0].contrasena;

    console.log(contrasenaNueva);
    console.log(contrasenaActual);
    if (contrasenaActual == contrasenaCuenta) {
      if (contrasenaNueva == contrasenaConfirmada) {
        //Realizo el UPDATE de la contrasena

        const cuentaID = usuario[0].cliente_id;
        const result = await pool.query(
          "UPDATE cliente SET contrasena = $1 WHERE cliente_id = $2 AND contrasena = $3",
          [contrasenaNueva, cuentaID, contrasenaActual]
        );
        res.status(200).json({ message: "Contrasena cambiada exitosamente" });
      } else {
        res.status(400).json({ message: "No coincide la contrasena nueva" });
      }
    } else {
      res.status(400).json({ message: "No coincide la contrasena actual" });
    }
  } else {
    res.redirect("/login");
  }
};

const cambiarCorreo = async (req, res) => {
  const usuario = req.session.usuario;

  if (usuario) {
    try {
      const nuevoCorreo = req.body.nuevoCorreo;
      const cuentaID = usuario[0].cliente_id;

      const result = await pool.query(
        "UPDATE cliente SET correo = $1 WHERE cliente_id = $2",
        [nuevoCorreo, cuentaID]
      );
      res
        .status(200)
        .json({ message: "Correo electronico cambiado exitosamente" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error al cambiar el correo electronico" });
      console.log(error);
    }
  } else {
    res.redirect("/login");
  }
};

const cambiarTelefono = async (req, res) => {
  const usuario = req.session.usuario;

  if (usuario) {
    try {
      const nuevoTelefono = req.body.nuevoTelefono;
      const cuentaID = usuario[0].cliente_id;

      const result = await pool.query(
        "UPDATE cliente SET numerodetelefono = $1 WHERE cliente_id = $2",
        [nuevoTelefono, cuentaID]
      );
      res
        .status(200)
        .json({ message: "Correo electronico cambiado exitosamente" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error al cambiar el correo electronico" });
      console.log(error);
    }
  } else {
    res.redirect("/login");
  }
};

const fs = require("fs");
const PDFDocument = require("pdfkit");
const xml2js = require("xml2js");

// Asumo que tienes la variable pool definida en algún lugar del código

const realizarRetiro = async (req, res) => {
  const usuario = req.session.usuario;

  if (usuario) {
    const tipoMovimiento = "Retiro";
    const cuentaID = usuario[0].id_cuenta;
    const cantidad = req.body.cantidad;
    const saldoDisponible = usuario[0].saldo;

    if (cantidad <= saldoDisponible) {
      if (cantidad > 0) {
        try {
          const buscarNoTarjeta = await pool.query(
            "SELECT * FROM catalogo_servicio WHERE cuenta_id = $1",
            [cuentaID]
          );
          const noTarjeta = buscarNoTarjeta.rows[0].notarjeta;

          // Crear informe XML
          const fecha = new Date();
          const nombreCliente = usuario[0].nombre + " " + usuario[0].apellido;

          const informeXML = `
            <informe>
                <cantidad>${cantidad}</cantidad>
                <fecha>${fecha}</fecha>
                <nombreCliente>${nombreCliente}</nombreCliente>
            </informe>
          `;

          // Convertir XML a JSON
          const informeJSON = await xml2js.parseStringPromise(informeXML);

          // Crear informe PDF
          const pdfDoc = new PDFDocument();
          const pdfPath = "ticket.pdf";
          pdfDoc.pipe(fs.createWriteStream(pdfPath));

          pdfDoc.text(`Informe de Retiro`, {
            align: "center",
            underline: true,
          });
          pdfDoc.text(`Fecha: ${informeJSON.informe.fecha[0]}`);
          pdfDoc.text(
            `Nombre del Cliente: ${informeJSON.informe.nombreCliente[0]}`
          );
          pdfDoc.text(`Cantidad Retirada: ${informeJSON.informe.cantidad[0]}`);

          pdfDoc.end();

          const transaccion = await pool.query(
            "INSERT INTO transaccion (fechadetransaccion, tipodemovimiento, cuentaorigen, cuentadestino, monto, concepto, cuenta_id) VALUES (NOW(), $1, $2, $3, $4, $5, $6)",
            [
              tipoMovimiento,
              noTarjeta,
              noTarjeta,
              cantidad,
              tipoMovimiento,
              cuentaID,
            ]
          );

          res.status(200).json({ message: "Retiro exitoso", pdfPath });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error interno del servidor" });
        }
      } else {
        res
          .status(400)
          .json({ message: "No se puede retirar una cantidad negativa" });
      }
    } else {
      res
        .status(400)
        .json({ message: "Usted no cuenta con suficiente saldo disponible" });
    }
  } else {
    res.redirect("/login");
  }
};

const cargadePantallaLimite = async (req, res) => {
  const usuario = req.session.usuario;
  const cuentaID = usuario[0].id_cuenta;

  const servicioAhorro = await pool.query(
    "SELECT * FROM catalogo_servicio WHERE cuenta_id = $1 AND nombredeservicio = $2",
    [cuentaID, "Ahorro"]
  );

  if (usuario) {
    res.render("Limite/limite", {
      usuario: usuario,
      servicioAhorro: servicioAhorro,
    });
  } else {
    res.redirect("/login");
  }
};

const cargadePantallaMasServicios = async (req, res) => {
  const usuario = req.session.usuario;
  const cuentaID = usuario[0].id_cuenta;
  try {
    const servicioPrestamo = await pool.query(
      "SELECT * FROM catalogo_servicio WHERE cuenta_id = $1 AND nombredeservicio = $2",
      [cuentaID, "Prestamo"]
    );

    const servicioHipoteca = await pool.query(
      "SELECT * FROM catalogo_servicio WHERE cuenta_id = $1 AND nombredeservicio = $2",
      [cuentaID, "Hipoteca"]
    );

    if (usuario) {
      res.render("Mas/otrosServicios", {
        usuario: usuario,
        servicioPrestamo: servicioPrestamo,
        servicioHipoteca: servicioHipoteca,
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.status(400).json({ message: "Error interno del servidor" });
    console.log(error);
  }
};

const crearHipoteca = async (req, res) => {
  const usuario = req.session.usuario;

  const monto = req.body.montoHipoteca;
  const plazo = req.body.plazoHipoteca;
  const propiedad = req.body.propiedad;
  const cuentaID = usuario[0].id_cuenta;

  console.log(propiedad);
  console.log(monto);
  console.log(plazo);

  const consultaTarjeta = await pool.query(
    "SELECT * FROM catalogo_servicio WHERE cuenta_id = $1",
    [cuentaID]
  );

  const noTarjeta = consultaTarjeta.rows[0].notarjeta;
  if (usuario) {
    try {
      if (monto >= 30000 && monto <= 10500000) {
        const fechaDePago = new Date();
        switch (plazo) {
          case "1":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 1);
            break;

          case "2":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 2);
            break;

          case "3":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 3);
            break;

          case "4":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 4);
            break;

          case "5":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 5);
            break;

          case "6":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 6);
            break;

          case "7":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 7);
            break;

          case "8":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 8);
            break;

          case "9":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 9);
            break;

          case "10":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 10);
            break;

          case "20":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 20);
            break;

          case "30":
            fechaDePago.setFullYear(fechaDePago.getFullYear() + 30);
        }

        try {
          const prestamo = await pool.query(
            "INSERT INTO catalogo_servicio (nombreDeServicio, concepto, fechaDeApertura, fechaDePago, saldo, cuenta_id) VALUES ($1,$2,NOW(),$3,$4,$5)",
            [
              "Hipoteca",
              "Hipoteca de " + propiedad,
              fechaDePago,
              monto,
              cuentaID,
            ]
          );

          const transaccion = await pool.query(
            "INSERT INTO transaccion (fechadetransaccion, tipodemovimiento, cuentaorigen, cuentadestino, monto, concepto, cuenta_id) VALUES (NOW(),$1,$2,$3,$4,$5,$6)",
            [
              "Hipoteca",
              noTarjeta,
              noTarjeta,
              monto,
              "Hipoteca de " + propiedad,
              cuentaID,
            ]
          );

          //Sumamos el saldo de su prestamo
          const sumaSaldo = await pool.query(
            "UPDATE cuenta SET saldo = saldo + $1 WHERE cuenta_id = $2",
            [monto, cuentaID]
          );

          res.status(200).json({ message: "Hipoteca aprobado" });
        } catch (error) {
          console.log(error);
          res
            .status(400)
            .json({ message: "No se ha podido generar su hipoteca" });
        }
      } else {
        res.status(400).json({
          message:
            "No se puede solicitar una hipoteca con un monto menor a 30,000 o mayor a 10,500,000",
        });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect("/login");
  }
};

const cargadePantallaRetiro = async (req, res) => {
  const usuario = req.session.usuario;
  if (usuario) {
    res.render("Retiro/retiro", { usuario: usuario });
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
  const noCuentaOrigen = cuentaOrigen.rows[0].notarjeta;
  const noCuentaDestino = idCuentaDestino.rows[0].notarjeta;

  if (usuario) {
    if (noCuentaOrigen !== noCuentaDestino) {
      //Verificamos si cuenta con saldo suficiente
      const saldoDisponible = await pool.query(
        "SELECT * FROM cuenta WHERE cuenta_id = $1",
        [cuentaIDororigen]
      );
      if (saldoDisponible.rows[0].saldo >= monto) {
        if (idCuentaDestino.rows.length > 0) {
          const result = await pool.query(
            "INSERT INTO Transaccion (fechadetransaccion, tipodemovimiento, cuentaorigen, cuentadestino, monto, concepto, cuenta_id) values (NOW(),$1,$2,$3,$4,$5,$6)",
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
      } else {
        res.status(400).json({ message: "No cuenta con saldo suficiente" });
      }
    } else {
      res
        .status(400)
        .json({ message: "No se puede transferir a la misma cuenta" });
    }
  } else {
    res.redirect("/login");
  }
};

const pantallaDeposito = (req, res) => {
  const usuario = req.session.usuario;
  if (usuario) {
    res.render("deposito/deposito", { usuario: usuario });
  } else {
    res.redirect("/login");
  }
};

const realizarDeposito = async (req, res) => {
  const usuario = req.session.usuario;

  const cuentaorigen = usuario[0].servicios[0].notarjeta;
  try {
    // revissar si hay usuario en sesion
    if (usuario) {
      const cantidad = req.body.Cantidad;
      const usuario = req.session.usuario;
      const cuenta_ID = usuario[0].id_cuenta;

      if (cantidad >= 0) {
        //Hacemos el deposito haciendo un UPDATE
        const deposito = await pool.query(
          "UPDATE cuenta SET saldo = saldo + $1 WHERE cuenta_id = $2",
          [cantidad, cuenta_ID]
        );

        //Hacemos el registro de la transaccion
        const result = await pool.query(
          "INSERT INTO Transaccion (fechadetransaccion, tipodemovimiento, cuentaorigen, cuentadestino, monto, concepto, cuenta_id) values (NOW(),$1,$2,$3,$4,$5,$6)",
          [
            "Deposito",
            cuentaorigen,
            cuentaorigen,
            cantidad,
            "Deposito",
            cuenta_ID,
          ]
        );
        res.status(200).json({ message: "Deposito exitoso" });
      } else {
        res
          .status(400)
          .json({ message: "No se puede depositar una cantidad negativa" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Error desconocido" });
  }
};

const Historial = async (req, res) => {
  //revisamos si hay usuario en sesion
  const usuario = req.session.usuario;
  if (usuario) {
    const cuenta_ID = usuario[0].id_cuenta;
    const historial = await pool.query(
      "SELECT * FROM transaccion WHERE cuenta_id = $1 order by fechadetransaccion DESC",
      [cuenta_ID]
    );
    res.render("historial", { historial: historial.rows, usuario: usuario });
  } else {
    res.redirect("/login");
  }
};

const historialdetransacciones = async (req, res) => {
  const usuario = req.session.usuario;
};

const SolicitudDeTdc = (req, res) => {
  res.sendFile("views/TDC/FormTDC.html", {
    root: __dirname + "/../",
  });
};
const crearTDC = async (req, res) => {
  console.log("Aqui ira la creacion del servicio de TDC");
};

const pantallatdc = async (req, res) => {
  const noTarjeta = req.body.noTarjeta;
  const tarjeta = null;

  try {
    tarjeta = await pool.query(
      "SELECT * FROM CatalogoDeServicios WHERE noTarjeta = $1",
      [noTarjeta]
    );
  } catch {
    res.status(500).send("Ocurrió un error de nuestro lado");
  }

  if (tarjeta.rows.length == 0) {
    res.status(404).send("No se encontró la tarjeta");
  }

  res.status(200).json({
    noTarjeta: tarjeta.rows[0].noTarjeta,
    fechaDeExpiracion: tarjeta.rows[0].fechaDeExpiracion,
    cvv: tarjeta.rows[0].cvv,
  });
};

const SolicitudDeSeguro = (req, res) => {
  res.sendFile("views/Seguro/FormSeguro.html", {
    root: __dirname + "/../",
  });
};

const crearSeguro = async (req, res) => {
  console.log("Aqui ira la creacion del servicio de Seguro");
  /*
   *He considerado 1 tipo de seguro
   *
   * 1.- Seguro de vida
   *
   * He añadido un formulario de como pienso hacer para crear el seguro (esta en views/Services/services.html)
   */

  const usuario = req.session.usuario;

  if (usuario) {
    const tipoDeServicio = "Seguro de vida";

    const idCuenta = usuario[0].id_cuenta;

    const fechaDeNacimiento = usuario[0].fechadenacimiento;

    //Recuperamos la fecha de nacimiento del formulario
    const fechaNacimiento = req.body.fechaNacimiento;

    //Recuperamos que opcion selecciono el usuario del combobox
    const rangoDeIngresos = req.body.rangoIngresos;

    //Recuperamos la suma sugerida del formulario
    const saldo = req.body.sumaAsegurada;

    //Recuperamos la cantidad de dinero por cada pago mensual
    const pagoAnual = req.body.pagoAnual;
    const pagoanual = parseFloat(pagoAnual.replace(",", ""));

    const saldoCuenta = await pool.query(
      "SELECT saldo FROM cuenta WHERE  cuenta_id = $1",
      [idCuenta]
    );

    const saldoActual = saldoCuenta.rows[0].saldo;

    //La expiracion es en 80 años despues de la fecha de apertura
    const fechaDeExpiracion = new Date();
    fechaDeExpiracion.setFullYear(fechaDeExpiracion.getFullYear() + 80);

    if (saldoActual >= pagoanual) {
      try {
        const transaccion = await pool.query(
          "INSERT INTO transaccion (fechadetransaccion, tipodemovimiento, cuentaorigen, cuentadestino, monto, concepto, cuenta_id) values (NOW(),$1,$2,$3,$4,$5,$6)",
          [
            "Pago de seguro",
            idCuenta,
            78000,
            pagoanual,
            "Pago de seguro",
            idCuenta,
          ]
        );
        const result = await pool.query(
          "INSERT INTO catalogo_servicio (nombredeservicio, fechadeexpiracion, fechadeapertura, saldo) VALUES ($1, $2, CURRENT_DATE, $3)",
          [tipoDeServicio, fechaDeExpiracion, pagoanual]
        );
        res.status(200).json({ message: "Seguro creado exitosamente" });
      } catch (error) {
        console.log(error);
        res.status(400).json({ message: "No se ha podido crear el seguro" });
      }
    } else {
      console.log();
      res
        .status(400)
        .json({ message: "No se puede crear el seguro, saldo insuficiente" });
    }
  } else {
    logout(req, res);
  }
};

const pantallaseguro = (req, res) => {
  console.log("Aqui ira la pantalla de info del Seguro ");

  const usuario = req.session.usuario;

  const idCuenta = usuario[0].id_cuenta;

  const tipoDeServicio = "Seguro de vida";

  const result = await.pool.query(
    "SELECT * FROM catalogo_servicio WHERE cuenta_id = $1 AND nombredeservicio = $2",
    [idCuenta],
    [tipoDeServicio]
  );

  if (result.rows.length > 0) {
    res.status(200).json({
      TipoDeSeguro: result.rows[0].nombredeservicio,
      FechaDeExpiracion: result.rows[0].fechadeexpiracion,
      FechaDeApertura: result.rows[0].fechadeapertura,
      PagoMinimo: result.rows[0].pagominimo,
      PagoParaNogenerarIntereses: result.rows[0].pagoparanogenerarintereses,
      FechaDePago: result.rows[0].fechadepago,
      Intereses: result.rows[0].intereses,
      Saldo: result.rows[0].saldo,
    });
  } else {
    res.status(404).json({ message: "No se encontro el seguro" });
  }
};

const SolicitudDePrestamo = (req, res) => {
  res.sendFile("views/Prestamo/FormPrestamo.html", {
    root: __dirname + "/../",
  });
};

const crearPrestamo = async (req, res) => {
  const usuario = req.session.usuario;

  const monto = req.body.montoSeguro;
  const plazo = req.body.plazoSeguro;
  const cuentaID = usuario[0].id_cuenta;

  const consultaTarjeta = await pool.query(
    "SELECT * FROM catalogo_servicio WHERE cuenta_id = $1",
    [cuentaID]
  );

  const noTarjeta = consultaTarjeta.rows[0].notarjeta;
  if (usuario) {
    if (monto >= 3000 && monto <= 1500000) {
      const fechaDePago = new Date();
      switch (plazo) {
        case "3":
          fechaDePago.setMonth(fechaDePago.getMonth() + 3);
          break;

        case "6":
          fechaDePago.setMonth(fechaDePago.getMonth() + 6);
          break;

        case "9":
          fechaDePago.setMonth(fechaDePago.getMonth() + 9);
          break;

        case "12":
          fechaDePago.setMonth(fechaDePago.getMonth() + 12);
          break;
      }

      try {
        const prestamo = await pool.query(
          "INSERT INTO catalogo_servicio (nombreDeServicio, concepto, fechaDeApertura, fechaDePago, saldo, cuenta_id) VALUES ($1,$2,NOW(),$3,$4,$5)",
          ["Prestamo", "Prestamo", fechaDePago, monto, cuentaID]
        );

        const transaccion = await pool.query(
          "INSERT INTO transaccion (fechadetransaccion, tipodemovimiento, cuentaorigen, cuentadestino, monto, concepto, cuenta_id) VALUES (NOW(),$1,$2,$3,$4,$5,$6)",
          ["Prestamo", noTarjeta, noTarjeta, monto, "Prestamo", cuentaID]
        );

        //Sumamos el saldo de su prestamo
        const sumaSaldo = await pool.query(
          "UPDATE cuenta SET saldo = saldo + $1 WHERE cuenta_id = $2",
          [monto, cuentaID]
        );

        res.status(200).json({ message: "Prestamo aprobado" });
      } catch (error) {
        console.log(error);
        res
          .status(400)
          .json({ message: "No se ha podido generar su prestamo" });
      }
    } else {
      res.status(400).json({
        message:
          "No se puede solicitar un prestamo con un monto menor a 3,000 o mayor a 1,500,000",
      });
    }
  } else {
    res.redirect("/login");
  }
};

const pantallaprestamo = (req, res) => {
  console.log("Aqui ira la pantalla de info del Prestamo ");
};

const SolicitudDeAhorro = (req, res) => {
  res.sendFile("views/Ahorro/FormAhorro.html", {
    root: __dirname + "/../",
  });
};

/* Crear ahorro revisar */
const crearAhorro = async (req, res) => {
  const usuario = req.session.usuario;
  const { nombreDelAhorro, plazo, monto } = req.body;
  const nombreServicio = "Ahorro";
  const id_cuenta = usuario[0].id_cuenta;

  if (usuario) {
    const saldoDisponible = usuario[0].saldo;
    if (monto > 0 && saldoDisponible >= monto) {
      const fechaExpiracion = new Date();
      let intereses = 0;
      switch (plazo) {
        case "2 meses":
          fechaExpiracion.setMonth(fechaExpiracion.getMonth() + 2);
          intereses = 0.03;
          break;

        case "6 meses":
          fechaExpiracion.setMonth(fechaExpiracion.getMonth() + 6);
          intereses = 0.08;
          break;

        case "1 ano":
          fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);
          intereses = 0.15;
          break;

        case "2 anos":
          fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 2);
          intereses = 0.3;
          break;

        case "5 anos":
          fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 5);
          intereses = 0.45;
          break;
      }
      try {
        //Creamos el ahorro
        const insertAhorro = await pool.query(
          "INSERT INTO catalogo_servicio (nombreDeServicio, concepto, fechaDeExpiracion, fechaDeApertura, intereses, saldo, cuenta_id) VALUES ($1,$2,$3,NOW(),$4,$5,$6)",
          [
            nombreServicio,
            nombreDelAhorro,
            fechaExpiracion,
            intereses,
            monto,
            id_cuenta,
          ]
        );
        //Buscamos el numero de tarjeta de la cuenta
        const buscarNoTarjeta = await pool.query(
          "SELECT * FROM catalogo_servicio WHERE cuenta_id = $1",
          [id_cuenta]
        );
        console.log(buscarNoTarjeta.rows[0].notarjeta);
        //Creamos la transaccion
        const transaccion = await pool.query(
          "INSERT INTO transaccion (fechaDeTransaccion, tipoDeMovimiento, cuentaOrigen, cuentaDestino, monto, concepto, cuenta_id) VALUES (NOW(),$1,$2,$3,$4,$5,$6)",
          [
            "Ahorro",
            buscarNoTarjeta.rows[0].notarjeta,
            buscarNoTarjeta.rows[0].notarjeta,
            monto,
            "Creacion de ahorro",
            id_cuenta,
          ]
        );
        //Descontamos desde el saldo de la cuenta
        const descuentoAhorro = await pool.query(
          "UPDATE cuenta SET saldo = saldo - $1 WHERE cuenta_id = $2",
          [monto, id_cuenta]
        );
        res.status(200).json({ message: "Ahorro creado exitosamente" });
      } catch (error) {
        res.status(400).json({ message: "No se ha podido crear el ahorro" });
        console.log(error);
      }
    } else {
      res.status(400).json({
        message:
          "No se puede crear un ahorro con un monto negativo o mayor al saldo disponible",
      });
    }
  } else {
    res.redirect("/login");
  }
};

const pantalladeahorro = (req, res) => {
  console.log("Aqui ira la pantalla de info del Ahorro ");
};

const cargarPantallaSeguro = (req, res) => {
  const usuario = req.session.usuario;
  if (usuario) {
    res.render("Seguro/seguro", { usuario: usuario });
  } else {
    res.redirect("/login");
  }
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
  cargarPantallaSeguro,
  mostrarServicios,
  Historial,
  historialdetransacciones,
  cargadePantallaPago,
  cargadePantallaConfiguracion,
  cambiarContrasena,
  cambiarCorreo,
  cambiarTelefono,
  realizarRetiro,
  cargadePantallaLimite,
  cargadePantallaMasServicios,
  crearHipoteca,
  cargadePantallaRetiro,
};
