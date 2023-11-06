const {Router} = require('express');
const router = Router();
const { logout, inicio,formhtml, createClient, getDataClient, loaddashboard ,deleteClient, updateClient , login} = require('../controllers/client.controler');


router.get('/', inicio);

router.get ('/nuevocliente' , formhtml);

router.post('/client_register',createClient );

router.get('/login' , login);

router.post('/login',getDataClient );

router.get('/perfil', loaddashboard);

router.get('/logout', logout);

router.delete('/client', deleteClient);

router.put('/client', updateClient);

module.exports = router;