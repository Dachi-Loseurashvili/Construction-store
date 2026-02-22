import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus, Trash2, Edit2, X, Check, FolderTree } from 'lucide-react';
import API from '../../api/axios';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form state for new category
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', parentId: '' });
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Organize categories into hierarchy
  const mainCategories = categories.filter(c => !c.parentId);
  const getSubcategories = (parentId) => categories.filter(c => c.parentId === parentId);

  const handleCreate = () => {
    setFormMode('create');
    setFormData({ name: '', parentId: '' });
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const handleEdit = (cat) => {
    setFormMode('edit');
    setFormData({ name: cat.name, parentId: cat.parentId || '' });
    setEditingId(cat._id);
    setShowForm(true);
    setError('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: '', parentId: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const payload = {
        name: formData.name,
        parentId: formData.parentId || null
      };

      if (formMode === 'create') {
        await API.post('/api/categories', payload);
        setSuccessMsg('Category created');
      } else {
        await API.put(`/api/categories/${editingId}`, payload);
        setSuccessMsg('Category updated');
      }

      handleCancel();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;

    setError('');
    setSuccessMsg('');

    try {
      await API.delete(`/api/categories/${id}`);
      setSuccessMsg('Category deleted');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
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
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> პროდუქტებში დაბრუნება
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FolderTree className="h-8 w-8" />
            <h1 className="text-3xl font-bold">კატეგორიები</h1>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" /> კატეგორიის დამატება
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
            {successMsg}
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-6 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {formMode === 'create' ? 'ახალი კატეგორია' : 'კატეგორიის რედაქტირება'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">სახელი</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  მშობელი კატეგორია (თუ მშობელი კატეგორიაა, ცარიელი დატოვეთ)
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="">— მშობელი კატეგორია (მშობელი - არა) —</option>
                  {mainCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {formMode === 'create' ? 'დამატება' : 'დამახსოვრება'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200"
                >
                  <X className="h-4 w-4" /> გაუქმება
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              კატეგორიები არ არის. დაიწყეთ დამატება.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {mainCategories.map((main) => (
                <div key={main._id}>
                  {/* Main Category */}
                  <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FolderTree className="h-5 w-5 text-gray-400" />
                      <span className="font-semibold text-gray-900">{main.name}</span>
                      <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">
                        {main.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(main)}
                        className="p-2 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(main._id, main.name)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {getSubcategories(main._id).map((sub) => (
                    <div
                      key={sub._id}
                      className="flex items-center justify-between px-6 py-3 pl-14 border-l-4 border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-700">{sub.name}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {sub.slug}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(sub)}
                          className="p-2 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub._id, sub.name)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
