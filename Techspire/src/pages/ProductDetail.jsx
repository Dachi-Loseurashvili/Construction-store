import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../hooks/useCart';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await API.get(`/api/products/by-slug/${slug}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 sm:py-48">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
        <p className="mt-4 text-sm font-medium text-gray-500">Retrieving Techspire specs...</p>
      </div>
    );
  }

  if (!product) return <div className="py-24 text-center font-bold">Product not found.</div>;

  return (
    <div className="bg-white">
      {/* 1. Adjusted Padding: smaller on mobile, larger on desktop */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        
        <Link to="/shop" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6 sm:mb-8">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Shop
        </Link>

        {/* 2. Responsive Grid: stack on mobile, side-by-side on lg screens */}
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-2 lg:gap-x-12">
          
          {/* Product Image: Responsive height/aspect ratio */}
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-50 border border-gray-100 aspect-square w-full">
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-cover" 
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {/* 3. Responsive Text Sizing */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black leading-tight">
              {product.name}
            </h1>
            <p className="mt-2 text-base sm:text-lg font-medium text-gray-400 uppercase tracking-widest">
              {product.category}
            </p>
            <p className="mt-4 text-2xl sm:text-3xl font-black text-black">
              ${product.price}
            </p>
            
            <p className="mt-6 sm:mt-8 text-sm sm:text-base text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Dynamic Specs Section: 3 cols on desktop, 3 cols on mobile (wrapped if needed) */}
            {product.specs && (
              <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 border-y border-gray-100 py-6">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="text-center px-1">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-gray-400 block truncate">
                      {key}
                    </span>
                    <p className="text-[11px] sm:text-xs font-bold truncate">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Controls: Flex-col on small screens, row on medium+ */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex w-full sm:w-auto items-center justify-between border border-gray-200 rounded-full px-6 py-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="text-2xl hover:text-gray-500 transition-colors leading-none"
                >
                  -
                </button>
                <span className="font-bold w-12 text-center text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="text-2xl hover:text-gray-500 transition-colors leading-none"
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="w-full sm:grow flex items-center justify-center rounded-full bg-black py-4 text-white font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
              >
                Add to Cart <ShoppingBag className="ml-2 h-5 w-5" />
              </button>
            </div>

            {/* Logistics Info: Stacked items */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start text-sm text-gray-500">
                <Truck className="mr-3 h-5 w-5 flex-shrink-0 text-black" />
                <span>Free express shipping for Techspire orders</span>
              </div>
              <div className="flex items-start text-sm text-gray-500">
                <ShieldCheck className="mr-3 h-5 w-5 flex-shrink-0 text-black" />
                <span>2-Year limited warranty included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;