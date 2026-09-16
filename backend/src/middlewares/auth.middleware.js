const { verificarToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = verificarToken(token);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

module.exports = requireAuth;
