const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Venta = sequelize.define(
  'Venta',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo_venta: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'ventas',
    timestamps: false,
  }
);

module.exports = Venta;
