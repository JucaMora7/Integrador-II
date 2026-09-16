const { Router } = require('express');
const { listar, resolver } = require('../controllers/alerta.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.use(requireAuth);
router.get('/', listar);
router.put('/:id/resolver', resolver);

module.exports = router;
