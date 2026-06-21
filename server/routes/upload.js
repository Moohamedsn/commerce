const express = require('express');
const multer  = require('multer');
const sharp   = require('sharp');
const path    = require('path');
const fs      = require('fs');
const auth    = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Use memory storage so we can process the image with sharp before saving
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB (pre-compression limit)
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// POST /api/upload  (admin only, up to 10 files at once)
// Resizes to max 1200px wide and compresses to JPEG ~80% quality
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ message: 'No files uploaded' });

  try {
    const urls = await Promise.all(req.files.map(async (file) => {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.jpg`;
      const outputPath = path.join(UPLOAD_DIR, filename);

      await sharp(file.buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(outputPath);

      return `/uploads/${filename}`;
    }));

    res.json({ urls });
  } catch (err) {
    res.status(500).json({ message: 'Image processing failed: ' + err.message });
  }
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
