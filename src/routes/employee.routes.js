const { Router } = require("express");
const router = Router();
const {
  inicioEmpleado,
  formularioCuentaEmpleado,
  crearCuentaEmpleado,
  loaddashboardEmpleado,
  login,
} = require("../controllers/employee.controler");

router.get("/employee", inicioEmpleado);

router.get("/nuevoEmpleado", formularioCuentaEmpleado);

router.post("/crearCuentaEmpleado", crearCuentaEmpleado);

router.get("/loginEmpleado", inicioEmpleado);

router.post("/loginEmpleado", login);

router.get("/perfilEmpleado", loaddashboardEmpleado);

module.exports = router;
