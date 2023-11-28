const { Router } = require("express");
const router = Router();
const {
  inicio,
  FormNewClient,
  createClient,
  login,
  getDataClient,
  loaddashboard,
  logout,
  cargadePantallaTransferencia,
  realizarTransferenciaCliente,
  SolicitudDeTdc,
  crearTDC,
  pantallatdc,
  cargarPantallaSeguro,
  crearSeguro,
  pantallaseguro,
  SolicitudDePrestamo,
  crearPrestamo,
  pantallaprestamo,
  SolicitudDeAhorro,
  crearAhorro,
  pantalladeahorro,
  pantallaDeposito,
  realizarDeposito,
  cargarPantallaServicios,
  mostrarServicios,
  Historial,
  cargadePantallaPago,
  cargadePantallaConfiguracion,
  cambiarContrasena,
  cargadePantallaLimite,
  cargadePantallaMasServicios,
  cargadePantallaRetiro

} = require("../controllers/client.controler");

//Ruta inicial para cliente
router.get("/", inicio);

//Ruta para la creacion de cliente
router.get("/nuevocliente", FormNewClient);
router.post("/client_register", createClient);
//Rutas relacionadas para la autenticacion de cliente
router.get("/login", login);
router.post("/login", getDataClient);
router.get("/perfil", loaddashboard);
router.get("/logout", logout);

//Rutas para servicios de cliente
router.get("/transferencia", cargadePantallaTransferencia);
router.post("/transfer", realizarTransferenciaCliente);

router.get("/servicios");
router.post("/services", mostrarServicios);

router.get("/pagos", cargadePantallaPago);
//router.post("/pago", realizarPago);

router.get("/config", cargadePantallaConfiguracion);
//router.post("/pago", realizarConfiguracion);

router.post("/cambiarContrasena", cambiarContrasena);

router.get("/limites", cargadePantallaLimite);
//router.post("/pago", realizarLimites);

router.get("/mas", cargadePantallaMasServicios);
//router.post("/pago", realizarOtrosServicios);

router.get("/retirar", cargadePantallaRetiro);
//router.post("/retiro", realizarPago);

//Tarjeta de credito
router.get("/solicitarTDC", SolicitudDeTdc);
router.post("/solicitudTDC", crearTDC);
router.get("/tdcDetalles", pantallatdc);

//Seguro
/*
 *Lo comento porque estoy usando el formulario desde la ruta de Servicios
 *
 */

router.get("/Seguro", cargarPantallaSeguro);
router.post("/solicitudSeguro", crearSeguro);
router.get("/seguroDetalle", pantallaseguro);

//prestamo
router.get("/prestamo", SolicitudDePrestamo);
router.post("/solicitudPrestamo", crearPrestamo);
router.get("/prestamoDetalle", pantallaprestamo);

//Ahorro
router.get("/ahorro", SolicitudDeAhorro);
router.post("/crearAhorro", crearAhorro);
router.get("/ahorroDetalle", pantalladeahorro);

//deposito
router.get("/depositar", pantallaDeposito);
router.post("/deposito", realizarDeposito);

//router.delete('/client', deleteClient);

// router.put('/client', updateClient);

router.get("/historial", Historial);

module.exports = router;
