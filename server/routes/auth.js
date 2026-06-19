const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const admin = await Admin.findOne({ where: { email: email.toLowerCase() } });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/verify
router.get('/verify', require('../middleware/auth'), (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

module.exports = router;
