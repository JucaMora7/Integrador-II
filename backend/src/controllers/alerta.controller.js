const { Alerta, Producto } = require('../models');

function obtenerEmpresaId(req, res) {
const empresaId = Number(req.usuario?.empresa_id);

if (!Number.isInteger(empresaId) || empresaId <= 0) {
res.status(403).json({
mensaje: 'El usuario no tiene una empresa válida asociada.',
});
return null;
}

return empresaId;
}

async function listar(req, res, next) {
try {
const empresaId = obtenerEmpresaId(req, res);
if (empresaId === null) return;

const alertas = await Alerta.findAll({
  where: { estado: 'activa' },
  include: [
    {
      model: Producto,
      where: { empresa_id: empresaId },
      required: true,
    },
  ],
  order: [['fecha_generada', 'DESC']],
});

res.json(alertas);

} catch (err) {
next(err);
}
}

async function resolver(req, res, next) {
try {
const empresaId = obtenerEmpresaId(req, res);
if (empresaId === null) return;

const alerta = await Alerta.findOne({
  where: {
    id: req.params.id,
    estado: 'activa',
  },
  include: [
    {
      model: Producto,
      where: { empresa_id: empresaId },
      required: true,
    },
  ],
});

if (!alerta) {
  return res.status(404).json({
    mensaje: 'Alerta no encontrada en tu empresa.',
  });
}

alerta.estado = 'resuelta';
await alerta.save();

res.json({
  mensaje: 'Alerta resuelta correctamente.',
  alerta,
});

} catch (err) {
next(err);
}
}

module.exports = { listar, resolver };
