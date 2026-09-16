const { Producto, Categoria } = require('../models');
const { Op } = require('sequelize');

function generarIdentificador() {
  return String(Math.floor(10000 + Math.random() * 89999));
}

// RF-01: registro de producto
async function crear(req, res, next) {
  try {
    const { nombre, cantidad_actual, precio, categoria_nombre, identificador, umbral_minimo } = req.body;

    if (!nombre || cantidad_actual === undefined || precio === undefined) {
      return res.status(400).json({ mensaje: 'Nombre, cantidad y precio son obligatorios' });
    }

    let categoria_id = null;
    if (categoria_nombre) {
      const [categoria] = await Categoria.findOrCreate({ where: { nombre: categoria_nombre } });
      categoria_id = categoria.id;
    }

    const producto = await Producto.create({
      nombre,
      cantidad_actual,
      precio,
      categoria_id,
      identificador: identificador || generarIdentificador(),
      umbral_minimo: umbral_minimo || undefined,
    });

    res.status(201).json(producto);
  } catch (err) {
    next(err);
  }
}

// RF-02: consulta del inventario
async function listar(req, res, next) {
  try {
    const { q, id, pagina = 1, limite = 20 } = req.query;
    const where = {};
    if (q) where.nombre = { [Op.iLike]: `%${q}%` };
    if (id) where.identificador = { [Op.iLike]: `%${id}%` };

    const offset = (Number(pagina) - 1) * Number(limite);
    const { rows, count } = await Producto.findAndCountAll({
      where,
      include: Categoria,
      order: [['nombre', 'ASC']],
      limit: Number(limite),
      offset,
    });

    res.json({ productos: rows, total: count, pagina: Number(pagina), limite: Number(limite) });
  } catch (err) {
    next(err);
  }
}

async function obtener(req, res, next) {
  try {
    const producto = await Producto.findByPk(req.params.id, { include: Categoria });
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    next(err);
  }
}

// RF-05: actualización de producto
async function actualizar(req, res, next) {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    const { nombre, precio, categoria_nombre, estado, umbral_minimo } = req.body;

    if (categoria_nombre) {
      const [categoria] = await Categoria.findOrCreate({ where: { nombre: categoria_nombre } });
      producto.categoria_id = categoria.id;
    }

    if (nombre !== undefined) producto.nombre = nombre;
    if (precio !== undefined) producto.precio = precio;
    if (estado !== undefined) producto.estado = estado;
    if (umbral_minimo !== undefined) producto.umbral_minimo = umbral_minimo;

    await producto.save();
    res.json(producto);
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listar, obtener, actualizar };
