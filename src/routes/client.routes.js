const {Router} = require('express');
const router = Router();
const { logout, inicio,formhtml, createClient, getDataClient, loaddashboard ,deleteClient, transferclient , login, cargadePantallaTransferencia} = require('../controllers/client.controler');


router.get('/', inicio);

router.get ('/nuevocliente' , formhtml);

router.get('/login' , login);

router.get('/perfil', loaddashboard);

router.get('/logout', logout);

router.get('/tranferencia', cargadePantallaTransferencia);

router.post('/transfer', transferclient)

router.post('/client_register',createClient );


router.post('/login',getDataClient );


router.delete('/client', deleteClient);

// router.put('/client', updateClient);

module.exports = router;