import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import API from '../../api/axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/api/products');
      setProducts(response.data);
    } catch {
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    
    try {
      await API.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch {
      setError('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products yet. Create your first one!
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Stock</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover bg-gray-100"
                        />
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-gray-400">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                    <td className="px-4 py-3 text-sm font-medium">${product.price}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="p-2 text-gray-400 hover:text-black transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
