import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Save, Upload } from 'lucide-react';
import API from '../../api/axios';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    stock: '10',
  });

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const response = await API.get(`/api/products/${id}`);
          const p = response.data;
          setFormData({
            name: p.name || '',
            price: String(p.price || ''),
            category: p.category || '',
            image: p.image || '',
            description: p.description || '',
            stock: String(p.stock || '10'),
          });
        } catch {
          setError('Failed to load product');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    const data = new FormData();
    data.append('image', file);

    try {
      const res = await API.post('/api/uploads', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, image: res.data.url });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    const payload = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      image: formData.image,
      description: formData.description,
      stock: Number(formData.stock),
    };

    try {
      if (isEdit) {
        await API.put(`/api/products/${id}`, payload);
      } else {
        await API.post('/api/products', payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Products
        </Link>

        <h1 className="text-3xl font-bold mb-8">
          {isEdit ? 'Edit Product' : 'New Product'}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">Select category</option>
              <option value="Workstations">Workstations</option>
              <option value="Accessories">Accessories</option>
              <option value="Displays">Displays</option>
              <option value="Tools">Tools</option>
              <option value="Furniture">Furniture</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="flex gap-2 mb-2">
              <label className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-sm">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-400 self-center">or enter URL below</span>
            </div>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="/uploads/... or https://..."
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded-lg border bg-gray-50"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
