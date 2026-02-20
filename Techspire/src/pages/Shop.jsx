import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import API from '../api/axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await API.get('/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching hardware:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  let filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const handleCategoryChange = (cat) => {
    cat === 'All' ? setSearchParams({}) : setSearchParams({ category: cat });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-8 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-black">
              {searchQuery ? `Results for "${searchQuery}"` : (activeCategory === 'All' ? 'Shop All' : activeCategory)}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {isLoading ? 'Scanning inventory...' : `${filteredProducts.length} items found`}
            </p>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            {['All', 'Workstations', 'Accessories', 'Displays', 'Tools'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Display */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-gray-200" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group flex flex-col">
                <Link 
                  to={`/product/${product.slug}`} 
                  className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 border border-gray-100"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu will-change-transform" 
                  />
                  <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>
                
                <div className="mt-4 flex justify-between px-1">
                  <div>
                    <Link to={`/product/${product.slug}`} className="text-sm font-bold text-gray-900 hover:underline">
                      {product.name}
                    </Link>
                    <p className="mt-1 text-[10px] text-gray-400 uppercase font-black">{product.category}</p>
                  </div>
                  <p className="text-sm font-black text-black">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h3 className="text-lg font-medium text-gray-900">No matches found</h3>
            <button onClick={() => setSearchParams({})} className="mt-4 text-sm font-bold underline">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;