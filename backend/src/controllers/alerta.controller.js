const { Alerta, Producto } = require('../models');

async function listar(req, res, next) {
  try {
    const alertas = await Alerta.findAll({
      where: { estado: 'activa' },
      include: Producto,
      order: [['fecha_generada', 'DESC']],
    });
    res.json(alertas);
  } catch (err) {
    next(err);
  }
}

async function resolver(req, res, next) {
  try {
    const alerta = await Alerta.findByPk(req.params.id);
    if (!alerta) return res.status(404).json({ mensaje: 'Alerta no encontrada' });
    alerta.estado = 'resuelta';
    await alerta.save();
    res.json(alerta);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, resolver };
