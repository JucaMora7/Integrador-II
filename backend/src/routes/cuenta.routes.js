const { Router } = require('express');
const { crear, listar } = require('../controllers/cuenta.controller');
const requireAuth = require('../middlewares/auth.middleware');

const router = Router();

router.use(requireAuth);
router.get('/', listar);
router.post('/', crear);

module.exports = router;
