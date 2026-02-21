import React from 'react';
import { Github, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tighter">სამშენებლო</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              პრემიუმ ხარისხის ევროპული სამშენებლო მასალა და ხელსაწყოები
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
          

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">Contact</h3>
            <div className="flex items-start space-x-3 text-sm text-gray-500">
              <MapPin className="h-5 w-5 text-black shrink-0" />
              <span>თბილისი, გლდანი, თიანეთის გზატკეცილი 59</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Phone className="h-5 w-5 text-black shrink-0" />
              <span>+995 551 53 00 00</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Mail className="h-5 w-5 text-black shrink-0" />
              <span>durmishkhanbusiness@gmail.com</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; 2026 სამშენებლო. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;