import React, { useState } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard,
  History
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useUser } from '../hooks/useUser';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // --- CART HOOK ---
  const { cartCount } = useCart(); 

  // --- AUTH FROM CONTEXT ---
  const { user, logout, isAdmin } = useUser();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // --- SEARCH LOGIC ---
  const queryParams = new URLSearchParams(location.search);
  const searchValue = queryParams.get('q') || "";

  const handleSearch = (e) => {
    const query = e.target.value;
    if (query) {
      navigate(`/shop?q=${query}`);
    } else {
      navigate(`/shop`);
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="text-2xl font-black tracking-tighter text-black italic">
              TECHSPIRE
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-baseline space-x-8">
              <Link to="/shop" className="text-sm font-bold text-gray-700 hover:text-black uppercase tracking-tight">Shop</Link>
              
              <div className="group relative">
                <button className="flex items-center text-sm font-bold text-gray-700 hover:text-black uppercase tracking-tight">
                  Categories <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 hidden w-48 pt-4 group-hover:block">
                  <div className="rounded-xl border border-gray-100 bg-white shadow-xl py-2">
                    <Link to="/shop?category=Workstations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Workstations</Link>
                    <Link to="/shop?category=Accessories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Accessories</Link>
                    <Link to="/shop?category=Tools" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Tools</Link>
                  </div>
                </div>
              </div>
              
              <Link to="/support" className="text-sm font-bold text-gray-700 hover:text-black uppercase tracking-tight">Support</Link>
            </div>

            {/* Icons & Actions */}
            <div className="flex items-center gap-x-2 lg:gap-x-4">
              
              {/* Search Bar */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={handleSearch}
                  className="h-9 w-48 xl:w-64 rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-black focus:outline-none transition-all"
                />
              </div>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-1">
                  {isAdmin && (
                    <Link 
                      to="/admin/products" 
                      className="p-2 text-gray-600 hover:text-black transition-colors"
                      title="Admin"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                    </Link>
                  )}
                  <Link 
                    to="/my-orders" 
                    className="p-2 text-gray-600 hover:text-black transition-colors"
                    title="Order History"
                  >
                    <History className="h-5 w-5" />
                  </Link>
                  <Link to="/profile" className="hidden lg:flex items-center space-x-2 rounded-full bg-gray-50 px-3 py-1.5 border border-gray-100 hover:border-black transition-all">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-black text-black uppercase tracking-tighter">
                      {user.fullName.split(' ')[0]}
                    </span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="p-2 text-gray-600 hover:text-black">
                  <User className="h-5 w-5" />
                </Link>
              )}

              {/* Shopping Cart Trigger */}
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative p-2 text-gray-600 hover:text-black transition-colors cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 md:hidden text-gray-600">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t bg-white px-4 pb-6 pt-2 space-y-1 animate-in slide-in-from-top duration-300">
            {user && (
              <>
                <Link to="/profile" onClick={closeMenu} className="flex items-center justify-between px-3 py-4 text-sm font-bold text-black border-b border-gray-50">
                  <div className="flex items-center uppercase tracking-tight">
                    <User className="mr-2 h-5 w-5 text-gray-400" /> Hello, {user.fullName.split(' ')[0]}
                  </div>
                </Link>
                <Link to="/my-orders" onClick={closeMenu} className="flex items-center px-3 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <History className="mr-2 h-5 w-5 text-gray-400" /> Order History
                </Link>
              </>
            )}
            <Link to="/shop" onClick={closeMenu} className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 uppercase">Shop</Link>
            <Link to="/support" onClick={closeMenu} className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 uppercase">Support</Link>
          </div>
        )}
      </nav>

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;