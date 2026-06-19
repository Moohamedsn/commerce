const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const auth    = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// POST /api/upload  (admin only, up to 10 files at once)
router.post('/', auth, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ message: 'No files uploaded' });

  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ urls });
});

// DELETE /api/upload  — remove a specific file
router.delete('/', auth, (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ message: 'filename required' });
  const filePath = path.join(UPLOAD_DIR, path.basename(filename));
  fs.unlink(filePath, err => {
    if (err) return res.status(404).json({ message: 'File not found' });
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;
