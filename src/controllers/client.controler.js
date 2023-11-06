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
  res.sendFile("views/login.html", { root: __dirname + "/../" });
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
//   req.session.destroy(err => {
//     if (err) {
//       console.error(err);
//     }
//     res.redirect('/login'); // Redirige al usuario a la página de inicio de sesión u otra página de tu elección
//   });
// });

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
        res.status(401).json({ error: "No se encontraron datos del cliente" });
      }
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


const  loaddashboard =  (req, res) => {
  const  usuario = req.session.usuario;
  if (usuario){
    //Un html con los datos del usuario
    res.render("dashboard", {usuario: usuario});
  }
  
  else{
  res.json({message: "No hay usuario en la sesión"});
  
}};




const deleteClient = async (req, res) => {
  res.send("Delete cliente");
};

const updateClient = async (req, res) => {
  res.send("Actualizando cliente");
};

module.exports = {
  logout,
  loaddashboard,
  login,
  inicio,
  formhtml,
  getDataClient,
  createClient,
  deleteClient,
  updateClient,
};
