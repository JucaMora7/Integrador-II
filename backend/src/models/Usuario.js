const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    contrasena_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    empresa: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = Usuario;
