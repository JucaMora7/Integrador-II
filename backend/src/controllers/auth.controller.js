const bcrypt = require('bcryptjs');
const { Usuario, Rol, Empresa } = require('../models');
const { generarToken } = require('../utils/jwt');

async function registrar(req, res, next) {
  try {
    const { nombre, apellido, correo, password, empresa } = req.body;

    // 1. Validar y normalizar los datos recibidos
    const nombreUsuario =
      typeof nombre === 'string' ? nombre.trim() : '';

    const apellidoUsuario =
      typeof apellido === 'string' ? apellido.trim() : '';

    const correoNormalizado =
      typeof correo === 'string' ? correo.trim().toLowerCase() : '';

    const nombreEmpresa =
      typeof empresa === 'string' ? empresa.trim() : '';

    if (!nombreUsuario || !correoNormalizado || !password || !nombreEmpresa) {
      return res.status(400).json({
        mensaje:
          'Nombre, correo, contraseña y nombre del negocio son obligatorios',
      });
    }

    if (
      nombreUsuario.length > 100 ||
      apellidoUsuario.length > 100 ||
      correoNormalizado.length > 150 ||
      nombreEmpresa.length > 150
    ) {
      return res.status(400).json({
        mensaje: 'Uno o más campos superan la longitud permitida',
      });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    // 2. Comprobar si el correo ya está registrado
    const existente = await Usuario.findOne({
      where: { correo: correoNormalizado },
    });

    if (existente) {
      return res.status(409).json({
        mensaje: 'Ya existe una cuenta con ese correo',
      });
    }

    // 3. Buscar el rol propietario
    const rolPropietario = await Rol.findOne({
      where: { nombre: 'Propietario' },
    });

    if (!rolPropietario) {
      return res.status(500).json({
        mensaje:
          'Roles no inicializados. Ejecute "npm run seed" en el backend.',
      });
    }

    // 4. Preparar la contraseña antes de abrir la transacción
    const contrasena_hash = await bcrypt.hash(password, 10);

    // 5. Crear empresa y propietario en una sola transacción
    const resultado = await require('../models').sequelize.transaction(
      async (transaction) => {
        const nuevaEmpresa = await Empresa.create(
          {
            nombre: nombreEmpresa,
          },
          { transaction }
        );

        const nuevoUsuario = await Usuario.create(
          {
            nombre: nombreUsuario,
            apellido: apellidoUsuario || null,
            correo: correoNormalizado,
            contrasena_hash,
            empresa_id: nuevaEmpresa.id,
            rol_id: rolPropietario.id,
          },
          { transaction }
        );

        return { nuevaEmpresa, nuevoUsuario };
      }
    );

    const { nuevaEmpresa, nuevoUsuario } = resultado;

    // 6. Generar token con el rol y la empresa recién creados
    const token = generarToken({
      id: nuevoUsuario.id,
      correo: nuevoUsuario.correo,
      empresa_id: nuevoUsuario.empresa_id,
      Rol: rolPropietario,
    });

    // 7. Devolver los datos que necesita AuthContext
    return res.status(201).json({
      mensaje: 'Empresa y usuario registrados correctamente',
      token,
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo,
        empresa_id: nuevoUsuario.empresa_id,
        empresa: nuevaEmpresa.nombre,
        rol: rolPropietario.nombre,
      },
    });
  } catch (err) {
    // La restricción UNIQUE de PostgreSQL también protege
    // contra registros simultáneos con el mismo correo.
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        mensaje: 'Ya existe una cuenta con ese correo',
      });
    }

    next(err);
  }
}

async function iniciarSesion(req, res, next) {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: 'Correo y contraseña son obligatorios',
      });
    }

    const usuario = await Usuario.findOne({
      where: { correo },
      include: [
        {
          model: Rol,
        },
        {
          model: Empresa,
        },
      ],
    });

    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas',
      });
    }

    const coincide = await bcrypt.compare(
      password,
      usuario.contrasena_hash
    );

    if (!coincide) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas',
      });
    }

    const token = generarToken(usuario);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        empresa_id: usuario.empresa_id,
        empresa: usuario.Empresa ? usuario.Empresa.nombre : null,
        rol: usuario.Rol ? usuario.Rol.nombre : null,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function perfil(req, res, next) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: [
        {
          model: Rol,
        },
        {
          model: Empresa,
        },
      ],
      attributes: {
        exclude: ['contrasena_hash'],
      },
    });

    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
      });
    }

    res.json(usuario);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registrar,
  iniciarSesion,
  perfil,
};

