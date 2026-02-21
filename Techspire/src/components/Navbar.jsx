import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import API from '../api/axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // --- AUTH FROM CONTEXT ---
  const { user, logout, isAdmin } = useUser();

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Filter main categories: no parentId, exclude legacy, sort by createdAt desc, limit 7
  const mainCategories = categories
    .filter(c => !c.parentId)
    .filter(c => c.slug !== 'legacy' && c.sortOrder !== 9999 && c.name !== 'Legacy')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 7);

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
              Housestrong
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-baseline space-x-8">
              <Link to="/shop" className="text-sm font-bold text-gray-700 hover:text-black uppercase tracking-tight">მაღაზია</Link>
              
              <div className="group relative">
                <button className="flex items-center text-sm font-bold text-gray-700 hover:text-black uppercase tracking-tight">
                  კატეგორიები <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 hidden w-48 pt-4 group-hover:block">
                  <div className="rounded-xl border border-gray-100 bg-white shadow-xl py-2">
                    {mainCategories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/shop?categoryId=${cat._id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              <Link to="/support" className="text-sm font-bold text-gray-700 hover:text-black uppercase tracking-tight">ინფორმაცია</Link>
            </div>

            {/* Icons & Actions */}
            <div className="flex items-center gap-x-2 lg:gap-x-4">
              
              {/* Search Bar */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="მოძებნეთ პროდუქტი..."
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
              </>
            )}
            <Link to="/shop" onClick={closeMenu} className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 uppercase">Shop</Link>
            <Link to="/support" onClick={closeMenu} className="block px-3 py-3 text-base font-bold text-gray-700 hover:bg-gray-50 uppercase">Support</Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;