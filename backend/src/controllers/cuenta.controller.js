const { Op } = require('sequelize');
const { MovimientoCuenta, Usuario } = require('../models');

// RF-08: registrar ingresos y egresos básicos del comercio
async function crear(req, res, next) {
  try {
    const { tipo, concepto, valor, fecha } = req.body;
    const usuario_id = req.usuario.id;

    if (!tipo || !concepto || valor === undefined) {
      return res.status(400).json({ mensaje: 'Tipo, concepto y valor son obligatorios' });
    }
    if (!['ingreso', 'egreso'].includes(tipo)) {
      return res.status(400).json({ mensaje: 'El tipo debe ser "ingreso" o "egreso"' });
    }

    const movimiento = await MovimientoCuenta.create({
      usuario_id,
      tipo,
      concepto,
      valor,
      fecha: fecha || new Date(),
    });

    res.status(201).json(movimiento);
  } catch (err) {
    next(err);
  }
}

// RF-09: consultar ingresos y egresos registrados en un periodo determinado
async function listar(req, res, next) {
  try {
    const { desde, hasta, tipo } = req.query;
    const where = {};
    if (desde && hasta) where.fecha = { [Op.between]: [desde, hasta] };
    if (tipo) where.tipo = tipo;

    const movimientos = await MovimientoCuenta.findAll({
      where,
      include: { model: Usuario, attributes: ['id', 'nombre', 'apellido'] },
      order: [['fecha', 'DESC']],
      limit: 200,
    });

    res.json(movimientos);
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listar };
