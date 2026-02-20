import React from 'react';
import { Github, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tighter">TECHSPIRE</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Premium hardware and custom-assembled setups designed for network engineers and full-stack developers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Best Sellers</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Custom Builds</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Accessories</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Order Tracking</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">Contact</h3>
            <div className="flex items-start space-x-3 text-sm text-gray-500">
              <MapPin className="h-5 w-5 text-black shrink-0" />
              <span>Gldani, Tbilisi, Georgia</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Phone className="h-5 w-5 text-black shrink-0" />
              <span>+995 555 00 00 00</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Mail className="h-5 w-5 text-black shrink-0" />
              <span>hello@techspire.com</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; 2026 Techspire. All rights reserved. Built with MERN.
          </p>
          <div className="flex space-x-6 text-xs text-gray-400">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;