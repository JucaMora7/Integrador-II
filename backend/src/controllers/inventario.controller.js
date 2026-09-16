const { sequelize, Producto, MovimientoInventario, Alerta } = require('../models');

// Crea una alerta activa si el stock queda por debajo del umbral y no existe ya una activa (RF-07)
async function evaluarAlerta(producto, t) {
  if (producto.cantidad_actual < producto.umbral_minimo) {
    const existente = await Alerta.findOne({
      where: { producto_id: producto.id, estado: 'activa' },
      transaction: t,
    });
    if (!existente) {
      await Alerta.create({ producto_id: producto.id, estado: 'activa' }, { transaction: t });
    }
  } else {
    await Alerta.update(
      { estado: 'resuelta' },
      { where: { producto_id: producto.id, estado: 'activa' }, transaction: t }
    );
  }
}

// RF-03: registro de entrada de productos
async function registrarEntrada(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { producto_id, cantidad } = req.body;
    const usuario_id = req.usuario.id;

    if (!producto_id || !cantidad || cantidad <= 0) {
      await t.rollback();
      return res.status(400).json({ mensaje: 'Producto y cantidad (mayor a 0) son obligatorios' });
    }

    const producto = await Producto.findByPk(producto_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!producto) {
      await t.rollback();
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    producto.cantidad_actual += Number(cantidad);
    await producto.save({ transaction: t });

    const movimiento = await MovimientoInventario.create(
      { producto_id, usuario_id, tipo: 'entrada', cantidad },
      { transaction: t }
    );

    await evaluarAlerta(producto, t);

    await t.commit();
    res.status(201).json({ movimiento, producto });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

// RF-04: registro de salida de productos (no permite cantidades negativas)
async function registrarSalida(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { producto_id, cantidad } = req.body;
    const usuario_id = req.usuario.id;

    if (!producto_id || !cantidad || cantidad <= 0) {
      await t.rollback();
      return res.status(400).json({ mensaje: 'Producto y cantidad (mayor a 0) son obligatorios' });
    }

    const producto = await Producto.findByPk(producto_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!producto) {
      await t.rollback();
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (producto.cantidad_actual < cantidad) {
      await t.rollback();
      return res.status(400).json({ mensaje: 'La salida excede la cantidad disponible en inventario' });
    }

    producto.cantidad_actual -= Number(cantidad);
    await producto.save({ transaction: t });

    const movimiento = await MovimientoInventario.create(
      { producto_id, usuario_id, tipo: 'salida', cantidad },
      { transaction: t }
    );

    await evaluarAlerta(producto, t);

    await t.commit();
    res.status(201).json({ movimiento, producto });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function listarMovimientos(req, res, next) {
  try {
    const { producto_id, tipo } = req.query;
    const where = {};
    if (producto_id) where.producto_id = producto_id;
    if (tipo) where.tipo = tipo;

    const movimientos = await MovimientoInventario.findAll({
      where,
      include: Producto,
      order: [['fecha', 'DESC']],
      limit: 200,
    });
    res.json(movimientos);
  } catch (err) {
    next(err);
  }
}

module.exports = { registrarEntrada, registrarSalida, listarMovimientos };
