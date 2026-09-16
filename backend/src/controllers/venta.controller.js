const { sequelize, Producto, Venta, Alerta } = require('../models');

async function evaluarAlerta(producto, t) {
  if (producto.cantidad_actual < producto.umbral_minimo) {
    const existente = await Alerta.findOne({
      where: { producto_id: producto.id, estado: 'activa' },
      transaction: t,
    });
    if (!existente) {
      await Alerta.create({ producto_id: producto.id, estado: 'activa' }, { transaction: t });
    }
  }
}

// RF-06: registrar venta y actualizar existencias de forma atómica
async function crear(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { producto_id, cantidad, precio_unitario, tipo_venta } = req.body;
    const usuario_id = req.usuario.id;

    if (!producto_id || !cantidad || cantidad <= 0 || precio_unitario === undefined) {
      await t.rollback();
      return res.status(400).json({ mensaje: 'Producto, cantidad y precio unitario son obligatorios' });
    }

    const producto = await Producto.findByPk(producto_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!producto) {
      await t.rollback();
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (producto.cantidad_actual < cantidad) {
      await t.rollback();
      return res.status(400).json({ mensaje: 'Existencias insuficientes para completar la venta' });
    }

    producto.cantidad_actual -= Number(cantidad);
    await producto.save({ transaction: t });

    const venta = await Venta.create(
      { producto_id, usuario_id, cantidad, precio_unitario, tipo_venta },
      { transaction: t }
    );

    await evaluarAlerta(producto, t);

    await t.commit();
    res.status(201).json({ venta, producto });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const { desde, hasta } = req.query;
    const { Op } = require('sequelize');
    const where = {};
    if (desde && hasta) {
      where.fecha = { [Op.between]: [new Date(desde), new Date(hasta)] };
    }

    const ventas = await Venta.findAll({
      where,
      include: Producto,
      order: [['fecha', 'DESC']],
      limit: 200,
    });
    res.json(ventas);
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listar };
