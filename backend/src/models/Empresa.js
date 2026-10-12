const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empresa = sequelize.define(
  'Empresa',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  },
  {
    tableName: 'empresas',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = Empresa;