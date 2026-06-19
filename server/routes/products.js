const express = require('express');
const { Product, Variant, Size } = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Helper: full product with variants + sizes
const fullInclude = [
  {
    model: Variant,
    as: 'variants',
    include: [{ model: Size, as: 'sizes' }],
  },
];

// Format product so frontend gets the same shape as before
function formatProduct(p) {
  const obj = p.toJSON();
  return obj;
}

// GET /api/products - public
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true },
      include: fullInclude,
      order: [['createdAt', 'DESC']],
    });
    res.json(products.map(formatProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/admin - admin only
router.get('/admin', auth, async (req, res) => {
  try {
    const products = await Product.findAll({
      include: fullInclude,
      order: [['createdAt', 'DESC']],
    });
    res.json(products.map(formatProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id - public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: fullInclude });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(formatProduct(product));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products - admin only
router.post('/', auth, async (req, res) => {
  const t = await Product.sequelize.transaction();
  try {
    const { name, description, price, category, isActive, variants } = req.body;

    const product = await Product.create(
      { name, description, price, category, isActive },
      { transaction: t }
    );

    if (variants && variants.length > 0) {
      for (const v of variants) {
        const variant = await Variant.create(
          { productId: product.id, color: v.color, colorHex: v.colorHex, images: v.images || [] },
          { transaction: t }
        );
        if (v.sizes && v.sizes.length > 0) {
          await Size.bulkCreate(
            v.sizes.map(s => ({ variantId: variant.id, size: s.size, stock: s.stock || 0 })),
            { transaction: t }
          );
        }
      }
    }

    await t.commit();
    const full = await Product.findByPk(product.id, { include: fullInclude });
    res.status(201).json(formatProduct(full));
  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id - admin only
router.put('/:id', auth, async (req, res) => {
  const t = await Product.sequelize.transaction();
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) { await t.rollback(); return res.status(404).json({ message: 'Product not found' }); }

    const { name, description, price, category, isActive, variants } = req.body;
    await product.update({ name, description, price, category, isActive }, { transaction: t });

    if (variants) {
      // Delete old variants + sizes (cascade)
      await Variant.destroy({ where: { productId: product.id }, transaction: t });

      for (const v of variants) {
        const variant = await Variant.create(
          { productId: product.id, color: v.color, colorHex: v.colorHex, images: v.images || [] },
          { transaction: t }
        );
        if (v.sizes && v.sizes.length > 0) {
          await Size.bulkCreate(
            v.sizes.map(s => ({ variantId: variant.id, size: s.size, stock: s.stock || 0 })),
            { transaction: t }
          );
        }
      }
    }

    await t.commit();
    const full = await Product.findByPk(product.id, { include: fullInclude });
    res.json(formatProduct(full));
  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id - admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
