const { Router } = require("express");
const router = Router();
const {
  inicioEmpleado,
  formularioCuentaEmpleado,
} = require("../controllers/employee.controler");

router.get("/employee", inicioEmpleado);

router.get("/nuevoEmpleado", formularioCuentaEmpleado);

module.exports = router;
