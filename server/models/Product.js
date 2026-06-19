const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Main product table
const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  price: { type: DataTypes.INTEGER, allowNull: false },   // in DZD
  category: { type: DataTypes.STRING, defaultValue: 'T-Shirt' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'products', timestamps: true });

// Variants table (each product has multiple color variants)
const Variant = sequelize.define('Variant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  color: { type: DataTypes.STRING, allowNull: false },
  colorHex: { type: DataTypes.STRING, defaultValue: '#000000' },
  // images stored as JSON string: ["url1","url2"]
  images: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() { return JSON.parse(this.getDataValue('images') || '[]'); },
    set(val) { this.setDataValue('images', JSON.stringify(val)); },
  },
}, { tableName: 'variants', timestamps: false });

// Sizes table (each variant has multiple sizes with stock)
const Size = sequelize.define('Size', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  variantId: { type: DataTypes.INTEGER, allowNull: false },
  size: { type: DataTypes.STRING, allowNull: false },     // XS,S,M,L,XL,XXL
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'sizes', timestamps: false });

// Associations
Product.hasMany(Variant, { foreignKey: 'productId', as: 'variants', onDelete: 'CASCADE' });
Variant.belongsTo(Product, { foreignKey: 'productId' });
Variant.hasMany(Size, { foreignKey: 'variantId', as: 'sizes', onDelete: 'CASCADE' });
Size.belongsTo(Variant, { foreignKey: 'variantId' });

module.exports = { Product, Variant, Size };
