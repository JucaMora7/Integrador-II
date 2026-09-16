const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alerta = sequelize.define(
  'Alerta',
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
    fecha_generada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM('activa', 'resuelta'),
      allowNull: false,
      defaultValue: 'activa',
    },
  },
  {
    tableName: 'alertas',
    timestamps: false,
  }
);

module.exports = Alerta;
