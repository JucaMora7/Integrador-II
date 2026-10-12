
const { Op, fn, col, literal } = require('sequelize');
const {
  Venta,
  Producto,
  MovimientoCuenta,
  Usuario,
} = require('../models');

function rangoFechas(desde, hasta) {
  if (!desde || !hasta) return null;

  return {
    [Op.between]: [
      new Date(desde),
      new Date(`${hasta}T23:59:59.999Z`),
    ],
  };
}

// Valida que la petición autenticada tenga una empresa asignada.
function obtenerEmpresaId(req) {
  const empresaId = Number(req.usuario?.empresa_id);

  if (!Number.isInteger(empresaId) || empresaId <= 0) {
    const error = new Error(
      'El usuario autenticado no tiene una empresa válida.'
    );
    error.status = 403;
    throw error;
  }

  return empresaId;
}

// Filtros comunes para impedir cruces entre empresas.
function incluirUsuarioDeEmpresa(empresaId) {
  return {
    model: Usuario,
    attributes: [],
    where: { empresa_id: empresaId },
    required: true,
  };
}

function incluirProductoDeEmpresa(empresaId, attributes = ['nombre']) {
  return {
    model: Producto,
    attributes,
    where: { empresa_id: empresaId },
    required: true,
  };
}

// Productos más vendidos.
async function masVendidos(req, res, next) {
  try {
    const empresaId = obtenerEmpresaId(req);
    const { desde, hasta, limite = 10 } = req.query;

    const fecha = rangoFechas(desde, hasta);
    const where = {};

    if (fecha) where.fecha = fecha;

    const resultado = await Venta.findAll({
      where,
      attributes: [
        'producto_id',
        [fn('SUM', col('cantidad')), 'unidades_vendidas'],
      ],
      include: [
        incluirProductoDeEmpresa(empresaId),
        incluirUsuarioDeEmpresa(empresaId),
      ],
      group: ['Venta.producto_id', 'Producto.id'],
      order: [[literal('unidades_vendidas'), 'DESC']],
      limit: Math.min(
        100,
        Math.max(1, Number.parseInt(limite, 10) || 10)
      ),
    });

    res.json(resultado);
  } catch (err) {
    next(err);
  }
}

// Productos menos vendidos.
async function menosVendidos(req, res, next) {
  try {
    const empresaId = obtenerEmpresaId(req);
    const { desde, hasta, limite = 10 } = req.query;

    const fecha = rangoFechas(desde, hasta);
    const where = {};

    if (fecha) where.fecha = fecha;

    const resultado = await Venta.findAll({
      where,
      attributes: [
        'producto_id',
        [fn('SUM', col('cantidad')), 'unidades_vendidas'],
      ],
      include: [
        incluirProductoDeEmpresa(empresaId),
        incluirUsuarioDeEmpresa(empresaId),
      ],
      group: ['Venta.producto_id', 'Producto.id'],
      order: [[literal('unidades_vendidas'), 'ASC']],
      limit: Math.min(
        100,
        Math.max(1, Number.parseInt(limite, 10) || 10)
      ),
    });

    res.json(resultado);
  } catch (err) {
    next(err);
  }
}

// Resumen financiero de la empresa autenticada.
async function resumenFinanciero(req, res, next) {
  try {
    const empresaId = obtenerEmpresaId(req);
    const { desde, hasta } = req.query;

    const whereVentas = {};
    const whereCuentas = {};

    const fechaVenta = rangoFechas(desde, hasta);

    if (fechaVenta) {
      whereVentas.fecha = fechaVenta;
    }

    if (desde && hasta) {
      whereCuentas.fecha = {
        [Op.between]: [desde, hasta],
      };
    }

    const ventas = await Venta.findAll({
      where: whereVentas,
      include: [
        incluirUsuarioDeEmpresa(empresaId),
        incluirProductoDeEmpresa(empresaId, []),
      ],
    });

    const totalVentas = ventas.reduce(
      (total, venta) =>
        total +
        Number(venta.cantidad) * Number(venta.precio_unitario),
      0
    );

    const movimientos = await MovimientoCuenta.findAll({
      where: whereCuentas,
      include: [incluirUsuarioDeEmpresa(empresaId)],
    });

    const totalIngresosCuentas = movimientos
      .filter((movimiento) => movimiento.tipo === 'ingreso')
      .reduce((total, movimiento) => total + Number(movimiento.valor), 0);

    const totalEgresos = movimientos
      .filter((movimiento) => movimiento.tipo === 'egreso')
      .reduce((total, movimiento) => total + Number(movimiento.valor), 0);

    const totalIngresos = totalVentas + totalIngresosCuentas;
    const transacciones = ventas.length + movimientos.length;
    const ticketPromedio =
      ventas.length > 0 ? totalVentas / ventas.length : 0;

    res.json({
      total_ventas: totalVentas,
      total_ingresos: totalIngresos,
      total_egresos: totalEgresos,
      balance_neto: totalIngresos - totalEgresos,
      transacciones,
      ticket_promedio: ticketPromedio,
    });
  } catch (err) {
    next(err);
  }
}

// Productos con stock por debajo del umbral.
async function stockBajo(req, res, next) {
  try {
    const empresaId = obtenerEmpresaId(req);

    const productos = await Producto.findAll({
      where: {
        empresa_id: empresaId,
        [Op.and]: [
          literal('"cantidad_actual" < "umbral_minimo"'),
        ],
      },
      order: [['cantidad_actual', 'ASC']],
    });

    res.json(productos);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  masVendidos,
  menosVendidos,
  resumenFinanciero,
  stockBajo,
};