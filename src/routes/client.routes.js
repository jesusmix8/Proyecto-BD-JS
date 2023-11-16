const {Router} = require('express');
const router = Router();
const { logout, inicio,formhtml, createClient, getDataClient, loaddashboard ,deleteClient, transferclient , login, cargadePantallaTransferencia,SolicitudDeAhorro,pantallaDeposito, realizarDeposito} = require('../controllers/client.controler');



//Ruta inicial para cliente
router.get('/', inicio);

//Ruta para la creacion de cliente
router.get ('/nuevocliente' , formhtml);
router.post('/client_register',createClient );
//Rutas relacionadas para la autenticacion de cliente
router.get('/login' , login);
router.post('/login',getDataClient );
router.get('/perfil', loaddashboard);
router.get('/logout', logout);



//Rutas para servicios de cliente
router.get('/transferencia', cargadePantallaTransferencia)
router.post('/transfer', transferclient)

router.get('/solicitarTDC', SolicitudDeTdc)
router.post('/solicitudTDC', crearTDC)
router.get('/tdc', pantallatdc)

//
router.get('/Seguro', SolicitudDeSeguro)
router.post('/solicitudSeguro', crearSeguro)
router.get('/seguro', pantallaseguro)

//prestamo
router.get('/prestamo', SolicitudDePrestamo)
router.post('/solicitudPrestamo', crearPrestamo)
router.get('/prestamo', pantallaprestamo)

//Ahorro
router.get('/ahorro', SolicitudDeAhorro)
router.post('/solicitudAhorro', crearAhorro)
router.get('/ahorro', pantallaprestamo)


router.get('/depositar',pantallaDeposito)
router.post('/deposito',realizarDeposito)








//router.delete('/client', deleteClient);

// router.put('/client', updateClient);

module.exports = router;