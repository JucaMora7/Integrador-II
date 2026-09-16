const { Router } = require('express');
const { registrarEntrada, registrarSalida, listarMovimientos } = require('../controllers/inventario.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.use(requireAuth);
router.get('/movimientos', listarMovimientos);
router.post('/entrada', registrarEntrada);
router.post('/salida', registrarSalida);

module.exports = router;
