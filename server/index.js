const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();
const sequelize = require('./config/database');

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/wilayas',  require('./routes/wilayas'));
app.use('/api/upload',   require('./routes/upload'));

app.get('/', (req, res) => res.json({ message: 'EDGE API is running ⚡' }));

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(async () => {
    console.log('✅ MySQL tables synced');
    await require('./config/seed')();
    app.listen(PORT, () => console.log(`⚡ EDGE Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  });
