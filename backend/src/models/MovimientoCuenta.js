const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MovimientoCuenta = sequelize.define(
  'MovimientoCuenta',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('ingreso', 'egreso'),
      allowNull: false,
    },
    concepto: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'movimientos_cuenta',
    timestamps: false,
  }
);

module.exports = MovimientoCuenta;
