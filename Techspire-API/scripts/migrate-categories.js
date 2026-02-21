#!/usr/bin/env node
/**
 * Migration script: migrate-categories.js
 * 
 * Creates Legacy category hierarchy from existing product.category strings
 * and backfills categoryId and brandKey on products.
 * 
 * Usage:
 *   node scripts/migrate-categories.js --dry-run   # Preview changes
 *   node scripts/migrate-categories.js --commit    # Apply changes
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { generateSlug, uniqueSlug } from '../utils/slugify.js';

const LEGACY_MAIN_NAME = 'Legacy';
const LEGACY_MAIN_SLUG = 'legacy';

// Normalize brand for filtering (same as ProductController)
function normalizeBrandKey(brand) {
  return (brand || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
}

async function migrate(commit = false) {
  const mode = commit ? 'COMMIT' : 'DRY-RUN';
  console.log(`\n=== Migration Mode: ${mode} ===\n`);

  const stats = {
    legacyMainCreated: false,
    subcategoriesCreated: 0,
    productsUpdatedCategoryId: 0,
    productsUpdatedBrandKey: 0,
    skipped: 0
  };

  // Step 1: Ensure Legacy main category exists
  let legacyMain = await Category.findOne({ slug: LEGACY_MAIN_SLUG });
  
  if (!legacyMain) {
    console.log(`Creating main category: "${LEGACY_MAIN_NAME}" (slug: ${LEGACY_MAIN_SLUG})`);
    if (commit) {
      legacyMain = await Category.create({
        name: LEGACY_MAIN_NAME,
        slug: LEGACY_MAIN_SLUG,
        parentId: null,
        sortOrder: 9999 // Put at end
      });
    } else {
      legacyMain = { _id: '[NEW]', name: LEGACY_MAIN_NAME, slug: LEGACY_MAIN_SLUG };
    }
    stats.legacyMainCreated = true;
  } else {
    console.log(`Legacy main category already exists: ${legacyMain._id}`);
  }

  // Step 2: Get all distinct product.category strings
  const distinctCategories = await Product.distinct('category');
  console.log(`\nFound ${distinctCategories.length} distinct category strings in products`);

  // Map: category string -> subcategory doc
  const categoryMap = new Map();

  for (const catName of distinctCategories) {
    if (!catName || !catName.trim()) {
      console.log(`  Skipping empty category`);
      stats.skipped++;
      continue;
    }

    const trimmed = catName.trim();
    const slug = generateSlug(trimmed) || `legacy-${Date.now().toString(36)}`;

    // Check if subcategory already exists under Legacy
    let subcat = await Category.findOne({ 
      slug,
      parentId: legacyMain._id === '[NEW]' ? null : legacyMain._id 
    });

    if (!subcat && legacyMain._id !== '[NEW]') {
      // Also check by parentId match
      subcat = await Category.findOne({ slug });
    }

    if (subcat) {
      console.log(`  Subcategory "${trimmed}" already exists: ${subcat._id}`);
      categoryMap.set(trimmed, subcat);
    } else {
      console.log(`  Creating subcategory: "${trimmed}" (slug: ${slug})`);
      if (commit) {
        const finalSlug = await uniqueSlug(trimmed, Category);
        subcat = await Category.create({
          name: trimmed,
          slug: finalSlug,
          parentId: legacyMain._id,
          sortOrder: 0
        });
        categoryMap.set(trimmed, subcat);
      } else {
        categoryMap.set(trimmed, { _id: '[NEW]', name: trimmed, slug });
      }
      stats.subcategoriesCreated++;
    }
  }

  // Step 3: Backfill categoryId for products missing it
  console.log(`\nBackfilling categoryId on products...`);
  
  const productsNeedingCategoryId = await Product.find({
    categoryId: { $exists: false }
  }).or([
    { categoryId: null },
    { categoryId: { $exists: false } }
  ]);

  // Actually, let's query products that have category string but no categoryId
  const allProducts = await Product.find({});
  
  for (const product of allProducts) {
    let updated = false;

    // Backfill categoryId if missing but has category string
    if (!product.categoryId && product.category) {
      const subcat = categoryMap.get(product.category.trim());
      if (subcat && subcat._id !== '[NEW]') {
        console.log(`  Product "${product.name}": setting categoryId to ${subcat._id}`);
        if (commit) {
          product.categoryId = subcat._id;
          updated = true;
        }
        stats.productsUpdatedCategoryId++;
      } else if (subcat && subcat._id === '[NEW]') {
        console.log(`  Product "${product.name}": would set categoryId (dry-run)`);
        stats.productsUpdatedCategoryId++;
      }
    }

    // Backfill brandKey if brand exists but brandKey is missing/empty
    if (product.brand && !product.brandKey) {
      const brandKey = normalizeBrandKey(product.brand);
      console.log(`  Product "${product.name}": setting brandKey to "${brandKey}"`);
      if (commit) {
        product.brandKey = brandKey;
        updated = true;
      }
      stats.productsUpdatedBrandKey++;
    }

    if (updated && commit) {
      await product.save();
    }
  }

  // Summary
  console.log(`\n=== Migration Summary (${mode}) ===`);
  console.log(`  Legacy main category created: ${stats.legacyMainCreated ? 'Yes' : 'No (already existed)'}`);
  console.log(`  Subcategories created: ${stats.subcategoriesCreated}`);
  console.log(`  Products updated (categoryId): ${stats.productsUpdatedCategoryId}`);
  console.log(`  Products updated (brandKey): ${stats.productsUpdatedBrandKey}`);
  console.log(`  Skipped (empty categories): ${stats.skipped}`);
  
  if (!commit) {
    console.log(`\n⚠️  This was a DRY-RUN. No changes were made.`);
    console.log(`   Run with --commit to apply changes.`);
  } else {
    console.log(`\n✅ Migration complete.`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const commit = args.includes('--commit');
  const dryRun = args.includes('--dry-run');

  if (!commit && !dryRun) {
    console.log('Usage: node scripts/migrate-categories.js [--dry-run | --commit]');
    console.log('  --dry-run  Preview changes without applying');
    console.log('  --commit   Apply changes to database');
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI environment variable is not set');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await migrate(commit);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

main();
