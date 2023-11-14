const {Router} = require('express');
const router = Router();
const { logout, inicio,formhtml, createClient, getDataClient, loaddashboard ,deleteClient, transferclient , login, cargadePantallaTransferencia,pantalladeahorro,pantallaDeposito, realizarDeposito} = require('../controllers/client.controler');




router.get('/', inicio);

router.get ('/nuevocliente' , formhtml);

router.get('/login' , login);

router.get('/perfil', loaddashboard);

router.get('/logout', logout);

router.get('/transferencia', cargadePantallaTransferencia);

router.get('/ahorro',pantalladeahorro)

router.get('/depositar',pantallaDeposito)

router.post('/transfer', transferclient)

router.post('/client_register',createClient );

router.post('/login',getDataClient );

router.post('/deposito',realizarDeposito);

router.delete('/client', deleteClient);

// router.put('/client', updateClient);

module.exports = router;