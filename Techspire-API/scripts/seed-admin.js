/**
 * One-time script to seed an admin user.
 * Run from Techspire-API folder: node scripts/seed-admin.js
 * 
 * Requires env vars:
 *   ADMIN_EMAIL    - admin email address
 *   ADMIN_PASSWORD - (optional) if not set, a random password is generated and printed
 */
require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex');
const PASSWORD_WAS_GENERATED = !process.env.ADMIN_PASSWORD;

async function seedAdmin() {
  if (!ADMIN_EMAIL) {
    console.error('Error: ADMIN_EMAIL env var is required.');
    console.error('Usage: ADMIN_EMAIL=you@example.com [ADMIN_PASSWORD=secret] node scripts/seed-admin.js');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('Admin user already exists:', existing.email);
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('Updated role to admin');
      }
    } else {
      const admin = await User.create({
        fullName: 'Admin User',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        phoneNumber: '0000000000',
        role: 'admin',
      });
      console.log('Admin user created:', admin.email);
    }

    console.log('\nCredentials:');
    console.log('  Email:', ADMIN_EMAIL);
    if (PASSWORD_WAS_GENERATED) {
      console.log('  Password:', ADMIN_PASSWORD, '(auto-generated - save this now!)');
    } else {
      console.log('  Password: [provided via ADMIN_PASSWORD env var]');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
