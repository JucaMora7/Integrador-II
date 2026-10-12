const sequelize = require('../config/database');

const Empresa = require('./Empresa');
const Rol = require('./Rol');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Producto = require('./Producto');
const MovimientoInventario = require('./MovimientoInventario');
const MovimientoCuenta = require('./MovimientoCuenta');
const Venta = require('./Venta');
const Alerta = require('./Alerta');


// =========================
// EMPRESA - USUARIO
// =========================

Empresa.hasMany(Usuario, {
  foreignKey: 'empresa_id',
});

Usuario.belongsTo(Empresa, {
  foreignKey: 'empresa_id',
});


// =========================
// ROL - USUARIO
// =========================

Rol.hasMany(Usuario, {
  foreignKey: 'rol_id',
});

Usuario.belongsTo(Rol, {
  foreignKey: 'rol_id',
});


// =========================
// EMPRESA - CATEGORIA
// =========================

Empresa.hasMany(Categoria, {
  foreignKey: 'empresa_id',
});

Categoria.belongsTo(Empresa, {
  foreignKey: 'empresa_id',
});


// =========================
// EMPRESA - PRODUCTO
// =========================

Empresa.hasMany(Producto, {
  foreignKey: 'empresa_id',
});

Producto.belongsTo(Empresa, {
  foreignKey: 'empresa_id',
});


// =========================
// CATEGORIA - PRODUCTO
// =========================

Categoria.hasMany(Producto, {
  foreignKey: 'categoria_id',
});

Producto.belongsTo(Categoria, {
  foreignKey: 'categoria_id',
});


// =========================
// PRODUCTO - MOVIMIENTO INVENTARIO
// =========================

Producto.hasMany(MovimientoInventario, {
  foreignKey: 'producto_id',
});

MovimientoInventario.belongsTo(Producto, {
  foreignKey: 'producto_id',
});


// =========================
// USUARIO - MOVIMIENTO INVENTARIO
// =========================

Usuario.hasMany(MovimientoInventario, {
  foreignKey: 'usuario_id',
});

MovimientoInventario.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
});


// =========================
// USUARIO - MOVIMIENTO CUENTA
// =========================

Usuario.hasMany(MovimientoCuenta, {
  foreignKey: 'usuario_id',
});

MovimientoCuenta.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
});


// =========================
// PRODUCTO - VENTA
// =========================

Producto.hasMany(Venta, {
  foreignKey: 'producto_id',
});

Venta.belongsTo(Producto, {
  foreignKey: 'producto_id',
});


// =========================
// USUARIO - VENTA
// =========================

Usuario.hasMany(Venta, {
  foreignKey: 'usuario_id',
});

Venta.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
});


// =========================
// PRODUCTO - ALERTA
// =========================

Producto.hasMany(Alerta, {
  foreignKey: 'producto_id',
});

Alerta.belongsTo(Producto, {
  foreignKey: 'producto_id',
});


module.exports = {
  sequelize,
  Empresa,
  Rol,
  Usuario,
  Categoria,
  Producto,
  MovimientoInventario,
  MovimientoCuenta,
  Venta,
  Alerta,
};