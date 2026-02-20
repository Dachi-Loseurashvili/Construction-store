import React from 'react';
import { Mail, MessageSquare, Phone, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const Support = () => {
  const helpCategories = [
    { icon: <Truck className="h-6 w-6" />, title: 'Shipping', desc: 'Track your workstation delivery and view shipping rates.' },
    { icon: <RotateCcw className="h-6 w-6" />, title: 'Returns', desc: '30-day no-questions-asked return policy for all hardware.' },
    { icon: <ShieldCheck className="h-6 w-6" />, title: 'Warranty', desc: 'All Techspire builds come with a 2-year limited warranty.' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Header */}
      <div className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl">How can we help?</h1>
          <p className="mt-4 text-lg text-gray-500">The Techspire team is here to support your digital journey.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Help Categories */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {helpCategories.map((item, index) => (
            <div key={index} className="rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-shadow bg-white text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-black">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact Grid */}
        <div className="mt-24 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-black">Send us a message</h2>
              <p className="mt-4 text-gray-500">Have a custom build request? Our engineers are ready to chat.</p>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input type="text" placeholder="First Name" className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
                <input type="email" placeholder="Email Address" className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <input type="text" placeholder="Subject" className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
              <textarea rows="4" placeholder="Your Message" className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm focus:outline-none focus:ring-1 focus:ring-black"></textarea>
              <button className="w-full rounded-full bg-black py-4 font-semibold text-white hover:bg-gray-800 transition-colors">
                Send Message
              </button>
            </form>
          </div>

          {/* Direct Contact Info */}
          <div className="bg-gray-900 rounded-3xl p-10 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold">Direct Support</h2>
              <p className="mt-4 text-gray-400">Prefer to speak with us directly? Use any of the channels below.</p>
              
              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-white/10 p-3"><Phone className="h-6 w-6" /></div>
                  <div>
                    <p className="text-sm text-gray-400">Call Us</p>
                    <p className="font-medium">+995 555 00 00 00</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-white/10 p-3"><Mail className="h-6 w-6" /></div>
                  <div>
                    <p className="text-sm text-gray-400">Email Us</p>
                    <p className="font-medium">support@techspire.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-white/10 p-3"><MessageSquare className="h-6 w-6" /></div>
                  <div>
                    <p className="text-sm text-gray-400">Live Chat</p>
                    <p className="font-medium">Available Mon-Fri, 9am - 6pm</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-sm text-gray-400 italic">
              "We don't just build workstations; we build the tools that build the world." — The Techspire Team
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;