const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const Categoria = sequelize.define(
  'Categoria',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
  },

  {
    tableName: 'categorias',
    timestamps: false,
  }
);

module.exports = Categoria;