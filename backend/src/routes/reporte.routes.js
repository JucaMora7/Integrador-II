const { Router } = require('express');
const { masVendidos, menosVendidos, resumenFinanciero, stockBajo } = require('../controllers/reporte.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.use(requireAuth);
router.get('/mas-vendidos', masVendidos);
router.get('/menos-vendidos', menosVendidos);
router.get('/resumen-financiero', resumenFinanciero);
router.get('/stock-bajo', stockBajo);

module.exports = router;
