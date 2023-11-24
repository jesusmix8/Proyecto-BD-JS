const { Router } = require("express");
const router = Router();
const {
  inicioEmpleado,
  formularioCuentaEmpleado,
  crearCuentaEmpleado,
  loaddashboardEmpleado,
  login,
  clientesEnSucursal,
  updateCliente,
  updatedatosClientes,
} = require("../controllers/employee.controler");

router.get("/employee", inicioEmpleado);

router.get("/nuevoEmpleado", formularioCuentaEmpleado);

router.post("/crearCuentaEmpleado", crearCuentaEmpleado);

router.get("/loginEmpleado", inicioEmpleado);

router.post("/loginEmpleado", login);

router.get("/perfilEmpleado", loaddashboardEmpleado);

router.get("/clientesEnSucursal", clientesEnSucursal);

router.get("/editarCliente/:cliente_id", updateCliente);

router.post("/actualizarCliente/:cliente_id", updatedatosClientes);

router.get("/logoutEmpleado", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/perfilEmpleado");
    }
    res.clearCookie("sid");
    res.redirect("/loginEmpleado");
  });
});

module.exports = router;
