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
  SolicitudDeSeguro,
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

router.get("/servicios", cargarPantallaServicios);
router.post("/services", mostrarServicios);

//Tarjeta de credito
router.get("/solicitarTDC", SolicitudDeTdc);
router.post("/solicitudTDC", crearTDC);
router.get("/tdcDetalles", pantallatdc);

//Seguro
router.get("/Seguro", SolicitudDeSeguro);
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

module.exports = router;
