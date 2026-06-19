const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerName: { type: DataTypes.STRING, allowNull: false },
  customerPhone: { type: DataTypes.STRING, allowNull: false },
  wilayaId: { type: DataTypes.INTEGER, allowNull: false },
  wilayaName: { type: DataTypes.STRING, allowNull: false },
  commune: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  deliveryType: {
    type: DataTypes.ENUM('home', 'office'),
    allowNull: false,
  },
  subtotal: { type: DataTypes.INTEGER, allowNull: false },
  livraisonPrice: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'canceled'),
    defaultValue: 'pending',
  },
  notes: { type: DataTypes.TEXT, defaultValue: '' },
}, { tableName: 'orders', timestamps: true });

// Order items — one order has many items
const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: true }, // nullable in case product deleted
  productName: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unitPrice: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'order_items', timestamps: false });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = { Order, OrderItem };
