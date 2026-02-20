/**
 * Update existing user to admin role.
 * Run from Techspire-API folder: node scripts/make-admin.js admin@techspire.local
 */
require('dotenv').config();
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
require('node:dns/promises').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const User = require('../models/User');

const email = process.argv[2] || 'admin@techspire.local';

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await User.updateOne(
      { email },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount === 0) {
      console.log('User not found:', email);
    } else if (result.modifiedCount === 0) {
      console.log('User already admin:', email);
    } else {
      console.log('User updated to admin:', email);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

makeAdmin();
