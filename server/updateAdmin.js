// One-time script to update the admin email & password.
// Run this if an admin account already exists in your database
// (the automatic seeder only creates an admin when none exists yet).
//
// Usage:  node updateAdmin.js

require('dotenv').config();
const sequelize = require('./config/database');
const Admin = require('./models/Admin');

(async () => {
  try {
    await sequelize.authenticate();

    const newEmail = process.env.ADMIN_EMAIL || 'beghdadoualid@gmail.com';
    const newPassword = process.env.ADMIN_PASSWORD || 'oualid@04';

    const admin = await Admin.findOne({ order: [['id', 'ASC']] });

    if (!admin) {
      await Admin.create({ email: newEmail, password: newPassword });
      console.log('✅ No admin existed — created a new one:', newEmail);
    } else {
      admin.email = newEmail;
      admin.password = newPassword; // hashed automatically by the beforeUpdate hook
      await admin.save();
      console.log('✅ Admin credentials updated to:', newEmail);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating admin:', err.message);
    process.exit(1);
  }
})();
