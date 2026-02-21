import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import { storeInfo } from '../config/storeInfo';

const PurchaseCTA = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-4">
      <p className="text-sm font-semibold text-gray-900">შესაძენად დაგვიკავშირდით ნომერზე:</p>
      <a 
        href={`tel:${storeInfo.phoneTel}`}
        className="flex items-center gap-3 text-lg font-bold text-black hover:underline"
      >
        <Phone className="h-5 w-5" />
        {storeInfo.phoneDisplay}
      </a>
      <p className="text-sm font-semibold text-gray-900 pt-2">ან გვეწვიეთ მაღაზიაში:</p>
      <div className="flex items-start gap-3 text-sm text-gray-700">
        <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <span>{storeInfo.addressDisplay}</span>
      </div>
    </div>
  );
};

export default PurchaseCTA;
