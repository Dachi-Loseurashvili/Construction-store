import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, ShoppingBag } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      {/* Large decorative 404 */}
      <h1 className="text-[12rem] font-black leading-none tracking-tighter text-gray-50 select-none">
        404
      </h1>
      
      <div className="relative -mt-20">
        <h2 className="text-3xl font-bold text-black sm:text-4xl">
          System link severed.
        </h2>
        <p className="mt-4 text-gray-500 max-w-md mx-auto">
          The workstation or component you're looking for isn't at this address. 
          It might have been moved or the uplink was lost.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-gray-800"
          >
            <Home className="h-4 w-4" /> Return Home
          </Link>
          <Link
            to="/shop"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-gray-50"
          >
            <ShoppingBag className="h-4 w-4" /> Back to Shop
          </Link>
        </div>
      </div>

      {/* Subtle Network Engineer Joke */}
      <p className="mt-12 text-xs font-mono text-gray-300 uppercase tracking-widest">
        Status: Request_Timeout | Error_Code: 0x404
      </p>
    </div>
  );
};

export default NotFound;