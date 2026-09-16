const { Router } = require('express');
const { registrar, iniciarSesion, perfil } = require('../controllers/auth.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.post('/registro', registrar);
router.post('/login', iniciarSesion);
router.get('/perfil', requireAuth, perfil);

module.exports = router;
