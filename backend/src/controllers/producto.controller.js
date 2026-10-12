const { Producto, Categoria } = require('../models');
const { Op } = require('sequelize');

function generarIdentificador() {
  return String(Math.floor(10000 + Math.random() * 89999));
}

// RF-01: registro de producto
async function crear(req, res, next) {
  try {
    const {
      nombre,
      cantidad_actual,
      precio,
      categoria_nombre,
      identificador,
      umbral_minimo
    } = req.body;

    // empresa_id viene del usuario autenticado
    const empresa_id = req.usuario.empresa_id;

    if (!empresa_id) {
      return res.status(403).json({
        mensaje: 'El usuario no tiene una empresa asociada'
      });
    }

    if (!nombre || cantidad_actual === undefined || precio === undefined) {
      return res.status(400).json({
        mensaje: 'Nombre, cantidad y precio son obligatorios'
      });
    }

    let categoria_id = null;

    if (categoria_nombre) {
      // Buscar la categoría SOLO dentro de la empresa
      const [categoria] = await Categoria.findOrCreate({
        where: {
          nombre: categoria_nombre,
          empresa_id
        },
        defaults: {
          nombre: categoria_nombre,
          empresa_id
        }
      });

      categoria_id = categoria.id;
    }

    const producto = await Producto.create({
      empresa_id,
      nombre,
      cantidad_actual,
      precio,
      categoria_id,
      identificador: identificador || generarIdentificador(),
      umbral_minimo: umbral_minimo !== undefined ? umbral_minimo : 5
    });

    res.status(201).json(producto);
  } catch (err) {
    next(err);
  }
}


// RF-02: consulta del inventario
async function listar(req, res, next) {
  try {
    const empresa_id = req.usuario.empresa_id;

    if (!empresa_id) {
      return res.status(403).json({
        mensaje: 'El usuario no tiene una empresa asociada'
      });
    }

    const {
      q,
      id,
      pagina = 1,
      limite = 20
    } = req.query;

    const where = {
      empresa_id
    };

    if (q) {
      where.nombre = {
        [Op.iLike]: `%${q}%`
      };
    }

    if (id) {
      where.identificador = {
        [Op.iLike]: `%${id}%`
      };
    }

    const paginaNumero = Number(pagina);
    const limiteNumero = Number(limite);

    const offset = (paginaNumero - 1) * limiteNumero;

    const { rows, count } = await Producto.findAndCountAll({
      where,
      include: [
        {
          model: Categoria,
          required: false,
          where: {
            empresa_id
          }
        }
      ],
      order: [['nombre', 'ASC']],
      limit: limiteNumero,
      offset
    });

    res.json({
      productos: rows,
      total: count,
      pagina: paginaNumero,
      limite: limiteNumero
    });

  } catch (err) {
    next(err);
  }
}


// Obtener un producto
async function obtener(req, res, next) {
  try {
    const empresa_id = req.usuario.empresa_id;

    const producto = await Producto.findOne({
      where: {
        id: req.params.id,
        empresa_id
      },
      include: [
        {
          model: Categoria,
          required: false,
          where: {
            empresa_id
          }
        }
      ]
    });

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    res.json(producto);

  } catch (err) {
    next(err);
  }
}


// RF-05: actualización de producto
async function actualizar(req, res, next) {
  try {
    const empresa_id = req.usuario.empresa_id;

    const producto = await Producto.findOne({
      where: {
        id: req.params.id,
        empresa_id
      }
    });

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    const {
      nombre,
      precio,
      categoria_nombre,
      estado,
      umbral_minimo
    } = req.body;

    // Cambiar categoría
    if (categoria_nombre) {
      const [categoria] = await Categoria.findOrCreate({
        where: {
          nombre: categoria_nombre,
          empresa_id
        },
        defaults: {
          nombre: categoria_nombre,
          empresa_id
        }
      });

      producto.categoria_id = categoria.id;
    }

    if (nombre !== undefined) {
      producto.nombre = nombre;
    }

    if (precio !== undefined) {
      producto.precio = precio;
    }

    if (estado !== undefined) {
      producto.estado = estado;
    }

    if (umbral_minimo !== undefined) {
      producto.umbral_minimo = umbral_minimo;
    }

    await producto.save();

    res.json(producto);

  } catch (err) {
    next(err);
  }
}


module.exports = {
  crear,
  listar,
  obtener,
  actualizar
};