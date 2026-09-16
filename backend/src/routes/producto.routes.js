const { Router } = require('express');
const { crear, listar, obtener, actualizar } = require('../controllers/producto.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.use(requireAuth);
router.get('/', listar);
router.get('/:id', obtener);
router.post('/', crear);
router.put('/:id', actualizar);

module.exports = router;
