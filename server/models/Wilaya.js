const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Main wilaya table
const Wilaya = sequelize.define('Wilaya', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  nameAr: { type: DataTypes.STRING, defaultValue: '' },
  livraisonDomicile: { type: DataTypes.INTEGER, defaultValue: 400 },
  livraisonBureau: { type: DataTypes.INTEGER, defaultValue: 300 },
}, { tableName: 'wilayas', timestamps: true });

// Communes table (one wilaya has many communes)
const Commune = sequelize.define('Commune', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  wilayaId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'communes', timestamps: false });

// Associations
Wilaya.hasMany(Commune, { foreignKey: 'wilayaId', as: 'communes' });
Commune.belongsTo(Wilaya, { foreignKey: 'wilayaId' });

module.exports = { Wilaya, Commune };
