import React from 'react';
import PurchaseCTA from '../components/PurchaseCTA';

const Support = () => {
  return (
    <div className="bg-white">
      {/* Hero Header */}
      <div className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl">დაგვიკავშირდით</h1>
          <p className="mt-4 text-lg text-gray-500">ან გვეწვიეთ მისამართზე</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Google Map */}
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <iframe
              src="https://www.google.com/maps?q=41.81447719318801,44.82151651665742&z=17&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="მაღაზიის მდებარეობა"
            />
          </div>

          {/* Contact CTA */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-6">
              ჩვენი მაღაზია
            </h2>
            <PurchaseCTA />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;