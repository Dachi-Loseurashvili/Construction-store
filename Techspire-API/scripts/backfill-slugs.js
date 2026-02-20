/**
 * Backfill slugs for existing products.
 * Run from Techspire-API folder: node scripts/backfill-slugs.js
 */
require('dotenv').config();
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
require('node:dns/promises').setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const Product = require('../models/Product');

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function uniqueSlug(baseName, excludeId = null) {
  const base = generateSlug(baseName);
  let slug = base;
  let suffix = 2;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Product.findOne(query);
    if (!exists) return slug;
    slug = `${base}-${suffix++}`;
  }
}

async function backfillSlugs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({ $or: [{ slug: null }, { slug: { $exists: false } }] });
    console.log(`Found ${products.length} products without slugs`);

    for (const product of products) {
      const slug = await uniqueSlug(product.name, product._id);
      product.slug = slug;
      await product.save();
      console.log(`  ${product.name} => ${slug}`);
    }

    console.log('\nBackfill complete!');
    
    // Verify all products have slugs
    const allProducts = await Product.find({}, { name: 1, slug: 1 });
    console.log('\nAll products:');
    allProducts.forEach(p => console.log(`  ${p.name}: ${p.slug}`));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

backfillSlugs();
