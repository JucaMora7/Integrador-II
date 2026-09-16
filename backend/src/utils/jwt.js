const jwt = require('jsonwebtoken');
const env = require('../config/env');

function generarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.Rol ? usuario.Rol.nombre : null,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

function verificarToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

module.exports = { generarToken, verificarToken };
