const { Router } = require("express");
const router = Router();
const {
  inicioEmpleado,
  formularioCuentaEmpleado,
  crearCuentaEmpleado,
} = require("../controllers/employee.controler");

router.get("/employee", inicioEmpleado);

router.get("/nuevoEmpleado", formularioCuentaEmpleado);

router.post("/crearCuentaEmpleado", crearCuentaEmpleado);

module.exports = router;
