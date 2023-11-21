const pool = require("../db");

const inicioEmpleado = (req, res) => {
  res.sendFile("views/viewsEmpleado/loginEmpleado/index.html", {
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

const crearCuentaEmpleado = async (req, res) => {};

module.exports = {
  inicioEmpleado,
  formularioCuentaEmpleado,
};
