import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-gray-50 blur-3xl opacity-50" />

      {/* CHANGED: Reduced padding-top (pt-12) to pull it closer to Navbar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:pt-16 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 text-center md:text-left">
            <div className="inline-flex items-center rounded-full bg-black px-3 py-1 text-sm font-medium text-white">
              <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />
              <span>ახალი პროდუქტი მაღაზიაში</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black leading-[1.1]">
              გააუმჯობესე ხარისხი <br />
              <span className="text-gray-400 font-medium italic">
                ჩვენთან ერთად
              </span>
            </h1>

            <p className="max-w-xl text-lg text-gray-600">
              მაღალი ხარისხის ევროპული სამშენებლო პროდუქტი
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/shop"
                className="flex items-center justify-center rounded-full bg-black px-8 py-4 text-white font-semibold hover:bg-gray-800 transition-all group w-full sm:w-auto"
              >
                მაღაზია
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              
            </div>
          </div>

          {/* Image Area */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100 shadow-2xl">
              <img
                src="https://imgs.search.brave.com/YtWlEQtxvGJ44Ox27O1GbaKHENqcM_hYY5Q_1t3tVxA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzAwL2Rl/LzQ0LzAwZGU0NGZm/MzdkNjhhM2VmMTY3/MjBmNWYzZWM2MGIw/LmpwZw"
                alt="Tech Product"
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-6 shadow-xl border border-gray-50 hidden lg:block">
              <p className="text-sm font-bold text-black uppercase tracking-wider">
                ნდობა
              </p>
              <p className="text-2xl font-black text-gray-400">
                უამრავი მომხმარებლისაგან
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
