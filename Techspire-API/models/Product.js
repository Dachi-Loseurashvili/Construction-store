import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  brand: { type: String, default: '' },
  brandKey: { type: String, default: '', index: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  specs: {
    type: Map,
    of: String
  },
  stock: { type: Number, default: 10 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);