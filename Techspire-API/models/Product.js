const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  specs: {
    type: Map,
    of: String
  },
  stock: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);