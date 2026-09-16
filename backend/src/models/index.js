const sequelize = require('../config/database');
const Rol = require('./Rol');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Producto = require('./Producto');
const MovimientoInventario = require('./MovimientoInventario');
const MovimientoCuenta = require('./MovimientoCuenta');
const Venta = require('./Venta');
const Alerta = require('./Alerta');

// Rol 1 -- N Usuario
Rol.hasMany(Usuario, { foreignKey: 'rol_id' });
Usuario.belongsTo(Rol, { foreignKey: 'rol_id' });

// Categoria 1 -- N Producto
Categoria.hasMany(Producto, { foreignKey: 'categoria_id' });
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id' });

// Producto 1 -- N MovimientoInventario ; Usuario 1 -- N MovimientoInventario
Producto.hasMany(MovimientoInventario, { foreignKey: 'producto_id' });
MovimientoInventario.belongsTo(Producto, { foreignKey: 'producto_id' });
Usuario.hasMany(MovimientoInventario, { foreignKey: 'usuario_id' });
MovimientoInventario.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Usuario 1 -- N MovimientoCuenta
Usuario.hasMany(MovimientoCuenta, { foreignKey: 'usuario_id' });
MovimientoCuenta.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Producto 1 -- N Venta ; Usuario 1 -- N Venta
Producto.hasMany(Venta, { foreignKey: 'producto_id' });
Venta.belongsTo(Producto, { foreignKey: 'producto_id' });
Usuario.hasMany(Venta, { foreignKey: 'usuario_id' });
Venta.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Producto 1 -- N Alerta
Producto.hasMany(Alerta, { foreignKey: 'producto_id' });
Alerta.belongsTo(Producto, { foreignKey: 'producto_id' });

module.exports = {
  sequelize,
  Rol,
  Usuario,
  Categoria,
  Producto,
  MovimientoInventario,
  MovimientoCuenta,
  Venta,
  Alerta,
};
