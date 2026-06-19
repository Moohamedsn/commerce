const express = require('express');
const { Order, OrderItem } = require('../models/Order');
const { Wilaya } = require('../models/Wilaya');
const auth = require('../middleware/auth');
const { Op, fn, col, literal } = require('sequelize');
const router = express.Router();

const itemsInclude = [{ model: OrderItem, as: 'items' }];

// POST /api/orders - public, place a new order
router.post('/', async (req, res) => {
  const t = await Order.sequelize.transaction();
  try {
    const { customerName, customerPhone, wilayaId, commune, address, deliveryType, items, notes } = req.body;

    const wilaya = await Wilaya.findByPk(wilayaId);
    if (!wilaya) { await t.rollback(); return res.status(400).json({ message: 'Wilaya not found' }); }

    const livraisonPrice = deliveryType === 'home' ? wilaya.livraisonDomicile : wilaya.livraisonBureau;
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const total = subtotal + livraisonPrice;

    const order = await Order.create({
      customerName, customerPhone,
      wilayaId: wilaya.id, wilayaName: wilaya.name,
      commune, address, deliveryType,
      subtotal, livraisonPrice, total,
      notes: notes || '',
    }, { transaction: t });

    await OrderItem.bulkCreate(
      items.map(item => ({
        orderId: order.id,
        productId: item.product || null,
        productName: item.productName,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ success: true, message: 'Order placed successfully', orderId: order.id });
  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders - admin only
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const where = status ? { status } : {};
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: itemsInclude,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: Number(offset),
    });

    res.json({ orders, total: count, pages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/stats - admin only
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Order.count();
    const pending = await Order.count({ where: { status: 'pending' } });
    const confirmed = await Order.count({ where: { status: 'confirmed' } });
    const shipped = await Order.count({ where: { status: 'shipped' } });
    const delivered = await Order.count({ where: { status: 'delivered' } });
    const canceled = await Order.count({ where: { status: 'canceled' } });

    const revenueResult = await Order.findOne({
      attributes: [[fn('SUM', col('total')), 'revenue']],
      where: { status: { [Op.in]: ['confirmed', 'shipped', 'delivered'] } },
      raw: true,
    });
    const revenue = parseInt(revenueResult?.revenue || 0);

    res.json({ total, pending, confirmed, shipped, delivered, canceled, revenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id - admin only
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: itemsInclude });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/status - admin only
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findByPk(req.params.id, { include: itemsInclude });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.update({ status });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
