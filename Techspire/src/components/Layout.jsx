import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      {/* Outlet is where the specific page content (Home, Shop, etc.) will render */}
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;