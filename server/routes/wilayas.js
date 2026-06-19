const express = require('express');
const { Wilaya, Commune } = require('../models/Wilaya');
const auth = require('../middleware/auth');
const router = express.Router();

const communesInclude = [{ model: Commune, as: 'communes', attributes: ['id', 'name'] }];

// GET /api/wilayas - public
router.get('/', async (req, res) => {
  try {
    const wilayas = await Wilaya.findAll({
      include: communesInclude,
      order: [['code', 'ASC']],
    });
    res.json(wilayas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/wilayas/:id - public
router.get('/:id', async (req, res) => {
  try {
    const wilaya = await Wilaya.findByPk(req.params.id, { include: communesInclude });
    if (!wilaya) return res.status(404).json({ message: 'Wilaya not found' });
    res.json(wilaya);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/wilayas/:id - admin only, update prices
router.put('/:id', auth, async (req, res) => {
  try {
    const { livraisonDomicile, livraisonBureau } = req.body;
    const wilaya = await Wilaya.findByPk(req.params.id);
    if (!wilaya) return res.status(404).json({ message: 'Wilaya not found' });
    await wilaya.update({ livraisonDomicile, livraisonBureau });
    res.json(wilaya);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/wilayas/bulk/update - admin only
router.put('/bulk/update', auth, async (req, res) => {
  const t = await Wilaya.sequelize.transaction();
  try {
    const { updates } = req.body;
    for (const u of updates) {
      await Wilaya.update(
        { livraisonDomicile: u.livraisonDomicile, livraisonBureau: u.livraisonBureau },
        { where: { id: u.id }, transaction: t }
      );
    }
    await t.commit();
    res.json({ message: 'Prices updated' });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
