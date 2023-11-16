const {Router} = require('express');
const router = Router();
const {inicio} = require('../controllers/employee.controler');


router.get('/employee', inicio);



module.exports = router;