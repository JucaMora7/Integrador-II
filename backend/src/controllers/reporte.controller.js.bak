const { Op, fn, col, literal } = require('sequelize');
const { Venta, Producto, MovimientoCuenta } = require('../models');

function rangoFechas(desde, hasta) {
  if (!desde || !hasta) return null;
  return { [Op.between]: [new Date(desde), new Date(`${hasta}T23:59:59.999Z`)] };
}

// Reporte de productos más vendidos (destacados)
async function masVendidos(req, res, next) {
  try {
    const { desde, hasta, limite = 10 } = req.query;
    const where = {};
    const fecha = rangoFechas(desde, hasta);
    if (fecha) where.fecha = fecha;

    const resultado = await Venta.findAll({
      where,
      attributes: [
        'producto_id',
        [fn('SUM', col('cantidad')), 'unidades_vendidas'],
      ],
      include: { model: Producto, attributes: ['nombre'] },
      group: ['producto_id', 'Producto.id'],
      order: [[literal('unidades_vendidas'), 'DESC']],
      limit: Number(limite),
    });

    res.json(resultado);
  } catch (err) {
    next(err);
  }
}

// Reporte de productos menos vendidos
async function menosVendidos(req, res, next) {
  try {
    const { desde, hasta, limite = 10 } = req.query;
    const where = {};
    const fecha = rangoFechas(desde, hasta);
    if (fecha) where.fecha = fecha;

    const resultado = await Venta.findAll({
      where,
      attributes: [
        'producto_id',
        [fn('SUM', col('cantidad')), 'unidades_vendidas'],
      ],
      include: { model: Producto, attributes: ['nombre'] },
      group: ['producto_id', 'Producto.id'],
      order: [[literal('unidades_vendidas'), 'ASC']],
      limit: Number(limite),
    });

    res.json(resultado);
  } catch (err) {
    next(err);
  }
}

// Resumen financiero del período: ventas, egresos, balance, transacciones, ticket promedio
async function resumenFinanciero(req, res, next) {
  try {
    const { desde, hasta } = req.query;
    const whereVentas = {};
    const whereCuentas = {};
    const fechaVenta = rangoFechas(desde, hasta);
    if (fechaVenta) whereVentas.fecha = fechaVenta;
    if (desde && hasta) whereCuentas.fecha = { [Op.between]: [desde, hasta] };

    const ventas = await Venta.findAll({ where: whereVentas });
    const totalVentas = ventas.reduce((acc, v) => acc + Number(v.cantidad) * Number(v.precio_unitario), 0);

    const movimientos = await MovimientoCuenta.findAll({ where: whereCuentas });
    const totalIngresosCuentas = movimientos
      .filter((m) => m.tipo === 'ingreso')
      .reduce((acc, m) => acc + Number(m.valor), 0);
    const totalEgresos = movimientos
      .filter((m) => m.tipo === 'egreso')
      .reduce((acc, m) => acc + Number(m.valor), 0);

    const totalIngresos = totalVentas + totalIngresosCuentas;
    const transacciones = ventas.length + movimientos.length;
    const ticketPromedio = ventas.length > 0 ? totalVentas / ventas.length : 0;

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

// Productos con stock por debajo del umbral mínimo configurado
async function stockBajo(req, res, next) {
  try {
    const productos = await Producto.findAll({
      where: literal('"cantidad_actual" < "umbral_minimo"'),
      order: [['cantidad_actual', 'ASC']],
    });
    res.json(productos);
  } catch (err) {
    next(err);
  }
}

module.exports = { masVendidos, menosVendidos, resumenFinanciero, stockBajo };
