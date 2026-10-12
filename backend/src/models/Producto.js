const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const env = require('../config/env');

const Producto = sequelize.define(
  'Producto',
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

    identificador: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    cantidad_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    precio: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    estado: {
      type: DataTypes.ENUM('activo', 'inactivo'),
      allowNull: false,
      defaultValue: 'activo',
    },

    umbral_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: env.stockUmbralDefecto,
      validate: {
        min: 0,
      },
    },
  },

  {
    tableName: 'productos',

    timestamps: true,

    createdAt: 'creado_en',

    updatedAt: 'actualizado_en',
  }
);

module.exports = Producto;