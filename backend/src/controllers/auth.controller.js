const bcrypt = require('bcryptjs');
const { Usuario, Rol } = require('../models');
const { generarToken } = require('../utils/jwt');

async function registrar(req, res, next) {
  try {
    const { nombre, apellido, correo, password, empresa } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ mensaje: 'Nombre, correo y contraseña son obligatorios' });
    }
    if (password.length < 6) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existente = await Usuario.findOne({ where: { correo } });
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo' });
    }

    const rolPropietario = await Rol.findOne({ where: { nombre: 'Propietario' } });
    if (!rolPropietario) {
      return res.status(500).json({ mensaje: 'Roles no inicializados. Ejecute "npm run seed" en el backend.' });
    }

    const contrasena_hash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      apellido,
      correo,
      contrasena_hash,
      empresa,
      rol_id: rolPropietario.id,
    });

    const token = generarToken({ id: usuario.id, correo: usuario.correo, Rol: rolPropietario });

    res.status(201).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        empresa: usuario.empresa,
        rol: rolPropietario.nombre,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function iniciarSesion(req, res, next) {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({ where: { correo }, include: Rol });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const coincide = await bcrypt.compare(password, usuario.contrasena_hash);
    if (!coincide) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        empresa: usuario.empresa,
        rol: usuario.Rol.nombre,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function perfil(req, res, next) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: Rol,
      attributes: { exclude: ['contrasena_hash'] },
    });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    next(err);
  }
}

module.exports = { registrar, iniciarSesion, perfil };
