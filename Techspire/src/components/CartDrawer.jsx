import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, History } from 'lucide-react'; // Added History icon
import { useCart } from '../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  // Helper to handle navigation and close drawer
  const handleNavigation = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      {/* 1. OVERLAY */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 2. DRAWER PANEL */}
      <div className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-6">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-black" />
              <h2 className="text-xl font-black tracking-tighter italic">YOUR INVENTORY</h2>
            </div>
            <button 
              onClick={onClose} 
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-200">
                  <ShoppingBag size={40} />
                </div>
                <p className="font-bold text-black uppercase tracking-tight">System Empty</p>
                <p className="mt-1 text-sm text-gray-400">Add hardware to your cart to see it here.</p>
                
                {/* Secondary navigation for empty state */}
                <button 
                  onClick={() => handleNavigation('/my-orders')}
                  className="mt-4 flex items-center gap-2 text-xs font-bold uppercase text-gray-500 hover:text-black transition-colors"
                >
                  <History size={14} /> View Order History
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 group">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-bold text-black uppercase tracking-tight leading-tight">
                            {item.name}
                          </h3>
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-400 font-medium">Quantity: {item.quantity}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-black">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="border-t bg-gray-50/50 p-6 space-y-4">
            {cart.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-2xl font-black text-black">${cartTotal.toLocaleString()}</span>
                </div>
                
                <button 
                  onClick={() => handleNavigation('/checkout')}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:bg-gray-800 active:scale-[0.98]"
                >
                  PROCEED TO CHECKOUT <ArrowRight size={18} />
                </button>
              </>
            )}

            {/* Always show Order History link if user is likely logged in */}
            <button 
              onClick={() => handleNavigation('/my-orders')}
              className="flex w-full items-center justify-center gap-2 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
            >
              <History size={12} /> View Order History
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;