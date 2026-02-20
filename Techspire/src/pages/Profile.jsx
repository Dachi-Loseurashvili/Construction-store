import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Shield, 
  Package, 
  Settings, 
  LogOut, 
  ArrowRight, 
  Clock, 
  LifeBuoy, 
  FileText 
} from 'lucide-react';

const Profile = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black uppercase tracking-tighter italic">Access Denied</h2>
          <p className="mt-2 text-gray-500">Please sign in to view your Techspire account.</p>
          <Link to="/auth" className="mt-6 inline-block rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition-transform active:scale-95">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-black italic uppercase">ACCOUNT</h1>
            <p className="text-sm text-gray-400 font-medium">Manage your Techspire hardware & settings</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="group cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full border border-transparent text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all duration-300 active:scale-95"
          >
            <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> 
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Sidebar: User Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
              <div className="relative mb-6 inline-block">
                <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-black text-white">
                  <User size={40} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 border-4 border-white">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-black tracking-tight">{user.fullName}</h2>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Mail className="mr-2 h-3.5 w-3.5" />
                {user.email}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-50">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-gray-400">Account Status</span>
                  <span className="text-black flex items-center">
                    <Shield className="mr-1 h-3 w-3 text-black fill-black" /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Support Quick Link Section */}
            <div className="rounded-[32px] bg-black p-8 text-white shadow-xl shadow-gray-200">
              <LifeBuoy className="mb-4 h-8 w-8 text-gray-400" />
              <h3 className="text-lg font-bold">Need assistance?</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Our engineering support team is available 24/7 for hardware troubleshooting.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link to="/support" className="flex items-center justify-center text-sm font-bold bg-white text-black px-4 py-3 rounded-xl transition-transform hover:scale-[1.02] active:scale-95">
                  Get Support <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link to="/docs" className="flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors px-2">
                  <FileText className="mr-2 h-4 w-4" /> Documentation
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* LINKED: Order History */}
              <Link to="/my-orders" className="group rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm hover:border-black transition-all cursor-pointer block">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-black">Order History</h3>
                <p className="text-xs text-gray-400 mt-1">View your Techspire hardware acquisitions</p>
              </Link>
              
              <div className="group rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm hover:border-black transition-all cursor-pointer">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors">
                  <Settings className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-black">Security</h3>
                <p className="text-xs text-gray-400 mt-1">Manage passwords and two-factor auth</p>
              </div>
            </div>

            {/* Activity Stream */}
            <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-black italic uppercase tracking-tighter">RECENT ACTIVITY</h3>
                {/* LINKED: View All */}
                <Link to="/my-orders" className="text-xs font-bold text-gray-400 hover:text-black transition-colors underline">
                  View All
                </Link>
              </div>
              
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-50 rounded-[24px]">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-200">
                  <Clock size={28} />
                </div>
                <p className="text-sm font-medium text-gray-400 px-6">Your activity stream is currently empty. Start building your setup.</p>
                <Link 
                  to="/shop" 
                  className="mt-6 rounded-full border border-black px-8 py-2.5 text-xs font-bold text-black hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  Explore Inventory
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;