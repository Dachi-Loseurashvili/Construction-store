import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Loader2, ChevronDown, ChevronRight, Filter, X } from 'lucide-react';
import API from '../api/axios';

const LIMIT = 20;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expandedMains, setExpandedMains] = useState({});
  
  // Filter values from URL
  const categoryId = searchParams.get('categoryId') || '';
  const selectedBrands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') === '1';
  const searchQuery = searchParams.get('q') || '';

  // Local draft state for price inputs to prevent focus loss
  const [draftMinPrice, setDraftMinPrice] = useState(minPrice);
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice);
  const debounceRef = useRef(null);

  // Sync draft state when URL params change externally (e.g., clear filters)
  useEffect(() => {
    setDraftMinPrice(minPrice);
    setDraftMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  // Organize categories
  const mainCategories = categories.filter(c => !c.parentId);
  const getSubcategories = (parentId) => categories.filter(c => c.parentId === parentId);
  
  // Get selected category name for display
  const getSelectedCategoryName = () => {
    if (!categoryId) return 'ყველა';
    const cat = categories.find(c => c._id === categoryId);
    return cat?.name || 'მაღაზია';
  };

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          API.get('/api/categories'),
          API.get('/api/brands')
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (err) {
        console.error('Failed to load filters:', err);
      }
    };
    fetchFilters();
  }, []);

  // Build query string for API
  const buildQueryString = useCallback((pageNum) => {
    const params = new URLSearchParams();
    if (categoryId) params.set('categoryId', categoryId);
    if (selectedBrands.length) params.set('brand', selectedBrands.join(','));
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (inStock) params.set('inStock', '1');
    if (searchQuery) params.set('q', searchQuery);
    params.set('page', String(pageNum));
    params.set('limit', String(LIMIT));
    params.set('sort', 'newest');
    return params.toString();
  }, [categoryId, selectedBrands, minPrice, maxPrice, inStock, searchQuery]);

  // Fetch products
  const fetchProducts = useCallback(async (pageNum, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      
      const query = buildQueryString(pageNum);
      const res = await API.get(`/api/products?${query}`);
      const data = res.data;
      
      if (append) {
        setProducts(prev => [...prev, ...data]);
      } else {
        setProducts(data);
      }
      
      setHasMore(data.length >= LIMIT);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [buildQueryString]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(1, false);
  }, [categoryId, selectedBrands.join(','), minPrice, maxPrice, inStock, searchQuery]);

  // Update URL params
  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(','));
      } else {
        newParams.set(key, String(value));
      }
    });
    setSearchParams(newParams, { replace: true });
  };

  const handleCategorySelect = (catId) => {
    updateFilters({ categoryId: catId || '' });
  };

  const handleBrandToggle = (brandKey) => {
    const newBrands = selectedBrands.includes(brandKey)
      ? selectedBrands.filter(b => b !== brandKey)
      : [...selectedBrands, brandKey];
    updateFilters({ brand: newBrands });
  };

  const handlePriceChange = (field, value) => {
    // Update draft state immediately for responsive typing
    if (field === 'minPrice') {
      setDraftMinPrice(value);
    } else {
      setDraftMaxPrice(value);
    }
    // Debounce the actual filter update
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilters({ [field]: value });
    }, 400);
  };

  const handlePriceBlur = (field) => {
    // Apply immediately on blur
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const value = field === 'minPrice' ? draftMinPrice : draftMaxPrice;
    updateFilters({ [field]: value });
  };

  const handleInStockToggle = () => {
    updateFilters({ inStock: inStock ? '' : '1' });
  };

  const handleSearchChange = (e) => {
    updateFilters({ q: e.target.value });
  };

  const handleLoadMore = () => {
    fetchProducts(page + 1, true);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const toggleMainCategory = (mainId) => {
    setExpandedMains(prev => ({ ...prev, [mainId]: !prev[mainId] }));
  };

  const hasActiveFilters = categoryId || selectedBrands.length || minPrice || maxPrice || inStock || searchQuery;

  // Sidebar content (reused for desktop and mobile) - JSX variable, not component
  const filterContent = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">კატეგორიები</label>
        <div className="space-y-1">
          <button
            onClick={() => handleCategorySelect('')}
            className={`w-full text-left px-2 py-1.5 rounded text-sm ${!categoryId ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            ყველა კატეგორია
          </button>
          {mainCategories.map((main) => {
            const subs = getSubcategories(main._id);
            const isExpanded = expandedMains[main._id];
            const isMainSelected = categoryId === main._id;
            const hasSelectedSub = subs.some(s => s._id === categoryId);
            
            return (
              <div key={main._id}>
                <div className="flex items-center">
                  <button
                    onClick={() => subs.length > 0 ? toggleMainCategory(main._id) : handleCategorySelect(main._id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {subs.length > 0 ? (
                      isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    ) : <span className="w-4" />}
                  </button>
                  <button
                    onClick={() => handleCategorySelect(main._id)}
                    className={`flex-1 text-left px-2 py-1.5 rounded text-sm ${
                      isMainSelected ? 'bg-black text-white' : hasSelectedSub ? 'font-semibold' : 'hover:bg-gray-100'
                    }`}
                  >
                    {main.name}
                  </button>
                </div>
                {isExpanded && subs.length > 0 && (
                  <div className="ml-6 space-y-0.5">
                    {subs.map((sub) => (
                      <button
                        key={sub._id}
                        onClick={() => handleCategorySelect(sub._id)}
                        className={`w-full text-left px-2 py-1 rounded text-sm ${
                          categoryId === sub._id ? 'bg-black text-white' : 'hover:bg-gray-100'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">ბრენდები</label>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {brands.map((b) => (
              <label key={b.brandKey} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b.brandKey)}
                  onChange={() => handleBrandToggle(b.brandKey)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{b.brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">ფასი</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            inputMode="numeric"
            value={draftMinPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            onBlur={() => handlePriceBlur('minPrice')}
            placeholder="-დან"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
          <span className="text-gray-400">—</span>
          <input
            type="text"
            inputMode="numeric"
            value={draftMaxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            onBlur={() => handlePriceBlur('maxPrice')}
            placeholder="-მდე"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={handleInStockToggle}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium">მარაგში</span>
        </label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full text-center text-sm text-gray-500 hover:text-black underline"
        >
          გასუფთავება
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-gray-100 pb-6 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            {searchQuery ? `Results for "${searchQuery}"` : getSelectedCategoryName()}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isLoading ? 'Loading...' : `${products.length} items`}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && <span className="bg-black text-white text-xs px-1.5 py-0.5 rounded-full">!</span>}
          </button>
        </div>

        {/* Mobile Filter Accordion */}
        {filtersOpen && (
          <div className="md:hidden mb-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Filters</span>
              <button onClick={() => setFiltersOpen(false)} className="p-1 hover:bg-gray-200 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              {filterContent}
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <div key={product._id} className="group flex flex-col">
                      <Link 
                        to={`/product/${product.slug}`} 
                        className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 border border-gray-100"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">Out of Stock</span>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </Link>
                      
                      <div className="mt-2 px-0.5">
                        <Link to={`/product/${product.slug}`} className="text-sm font-semibold text-gray-900 hover:underline line-clamp-1">
                          {product.name}
                        </Link>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-gray-400">{product.brand || product.category}</p>
                          <p className="text-sm font-bold text-black">₾{product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400"
                    >
                      {isLoadingMore ? (
                        <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                      ) : null}
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-24 text-center">
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters</p>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="mt-4 text-sm font-bold underline">
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;