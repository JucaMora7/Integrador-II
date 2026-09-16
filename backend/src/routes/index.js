const { Router } = require('express');

const authRoutes = require('./auth.routes');
const productoRoutes = require('./producto.routes');
const inventarioRoutes = require('./inventario.routes');
const ventaRoutes = require('./venta.routes');
const cuentaRoutes = require('./cuenta.routes');
const alertaRoutes = require('./alerta.routes');
const reporteRoutes = require('./reporte.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/productos', productoRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/ventas', ventaRoutes);
router.use('/cuentas', cuentaRoutes);
router.use('/alertas', alertaRoutes);
router.use('/reportes', reporteRoutes);

module.exports = router;
