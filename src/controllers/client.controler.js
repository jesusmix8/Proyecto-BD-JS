const e = require("express");
const pool = require("../db");

const inicio = async (req, res) => {

  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  res.sendFile("views/inicio/index.html", { root: __dirname + "/../" });

};

const login = async (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  res.sendFile("views/login/login.html", { root: __dirname + "/../" });
};

const formhtml = async (req, res) => {
  res.sendFile("views/FormNewClient/form.html", { root: __dirname + "/../" });
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
    });
  }
};
const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/login"); // Redirige al usuario a la página de inicio de sesión u otra página de tu elección
  });
};


const createClient = async (req, res) => {
  try {
    const {
      Usuario,
      Contraseña,
      RFC,
      Nombre,
      Direccion,
      Telefono,
      Correo,
      Fechadenacimiento,
    } = req.body;
    const result = await pool.query(
      "INSERT INTO cliente (Usuario, Contraseña, RFC, Nombre, Direccion, Telefono, Correo, Fechadenacimiento)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        Usuario,
        Contraseña,
        RFC,
        Nombre,
        Direccion,
        Telefono,
        Correo,
        Fechadenacimiento,
      ]
    );
    res.json(result.rows);
  } catch (error) {
    if (error["code"] === "23505") {
      res
        .status(409)
        .json({
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
    if (result.rows.length > 0) {
      const dataclient = await pool.query(
        "SELECT * FROM Cliente JOIN Cuenta ON Cliente.Usuario = Cuenta.Usuario WHERE Cliente.Usuario = $1",
        [Usuario]
      );
      if (dataclient.rows.length > 0) {
        // Convertir los datos a formato JSON
        const clienteJSON = JSON.stringify(dataclient["rows"]);
        req.session.usuario = JSON.parse(clienteJSON);
        res.status(200).json({ message: "Bienvenido"});

      } else {
        res.status(401).json({ message: "No se encontraron datos del cliente" });
      }
    } else {
      res.status(401).json({ message: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


const  loaddashboard =   (req, res) => {
  const  usuario = req.session.usuario;
  if (usuario){
    // const saldoFinDeMes = 54; 
    // Object.assign(usuario[0], {saldoFinDeMes: saldoFinDeMes}); 
    delete usuario[0].contraseña;
    console.log(usuario);
    res.render("dashboard", {usuario: usuario});
  }
  
  else{
  res.json({message: "No hay usuario en la sesión"});
  
}};

const cargadePantallaTransferencia =  (req, res) => {
  const  usuario = req.session.usuario;
  if (usuario){
    res.sendFile("views/Transferencia/formtransferencia.html", { root: __dirname + "/../" });
  }
  else{
    res.json({message: "No hay usuario en la sesión"});
  }
};

const transferclient = async (req, res) => {
  const { cuentaDestino, monto, descripcion } = req.body;
  console.log(cuentaDestino, monto, descripcion);
  const cuentaDestinor = parseInt(cuentaDestino);
  //Comprobar si existe una cuenta destino con ese usuario
  const result = await pool.query(
     "SELECT usuario FROM cuenta WHERE cuenta = $1",
    [cuentaDestinor]
   );

   if(result.rows.length > 0){
     //Comprobar si la cuenta origen y destino son la misma
      console.log("Cuenta destino encontrada");
      const usuario = req.session.usuario;
      const cuentaOrigen = usuario[0].cuenta;

      if(cuentaOrigen === cuentaDestinor){
        res.status(400).json({ message: "No se puede realizar una transferencia a la misma cuenta" });
      }else{
        //Comprobar si la cuenta origen tiene saldo suficiente para realizar la transferencia
        const saldoOrigen = usuario[0].saldo;
        const montoTransferencia = parseInt(monto);
        if(saldoOrigen < montoTransferencia){
          res.status(400).json({ message: "Saldo insuficiente para realizar la transferencia" });
        }else{
          //Realizar la transferencia
        }
      }
    
  }else{
    console.log("Cuenta destino no encontrada");
  }
};



const deleteClient =  (req, res) => {
  res.send("Delete cliente");
};

const updateClient =  (req, res) => {
  res.send("Actualizando cliente");
};

module.exports = {
  transferclient,
  logout,
  loaddashboard,
  login,
  inicio,
  formhtml,
  getDataClient,
  createClient,
  deleteClient,
  cargadePantallaTransferencia
};
