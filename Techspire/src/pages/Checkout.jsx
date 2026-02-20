import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentStep, setPaymentStep] = useState('info'); // 'info' or 'processing'

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'Credit Card'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentStep('processing');

    const orderData = {
      orderItems: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id
      })),
      shippingAddress: { ...formData, country: 'Georgia' },
      paymentMethod: formData.paymentMethod,
      totalPrice: cartTotal,
      paymentResult: { id: 'MOCK_PAYMENT_ID', status: 'COMPLETED' }
    };

    try {
      // 1. Simulate the "Payment Handshake" delay
      setTimeout(async () => {
        // We call the API. We don't need the 'response' variable if we just want to redirect
        await createOrder(orderData); 
        clearCart();
        navigate('/my-orders');
      }, 2000); 
    } catch (err) {
      // Using the error variable to provide feedback to the user
      console.error("Order Creation Error:", err);
      setPaymentStep('info');
      alert(err.response?.data?.message || "Transaction Refused by Gateway");
    }
  };

  if (paymentStep === 'processing') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="relative">
          <div className="h-24 w-24 animate-spin rounded-full border-4 border-gray-100 border-t-black"></div>
          <Lock className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black" />
        </div>
        <h2 className="mt-8 text-2xl font-black italic uppercase tracking-tighter text-black">Verifying Transaction</h2>
        <p className="mt-2 text-sm text-gray-500">Securing your hardware acquisition via encrypted tunnel...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left Side: Forms */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="mb-6 text-xl font-black uppercase tracking-tight italic text-black underline decoration-gray-200 underline-offset-8">01. Shipping Manifest</h2>
            <div className="space-y-4">
              <input 
                className="w-full rounded-2xl border-none bg-gray-100 p-4 outline-none focus:ring-2 focus:ring-black transition-all"
                placeholder="Address" required
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input className="rounded-2xl bg-gray-100 p-4 outline-none focus:ring-2 focus:ring-black" placeholder="City" required onChange={(e) => setFormData({...formData, city: e.target.value})} />
                <input className="rounded-2xl bg-gray-100 p-4 outline-none focus:ring-2 focus:ring-black" placeholder="Zip" required onChange={(e) => setFormData({...formData, zipCode: e.target.value})} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-xl font-black uppercase tracking-tight italic text-black underline decoration-gray-200 underline-offset-8">02. Payment Protocol</h2>
            <div className="rounded-[32px] border-2 border-black p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-black" />
                  <span className="font-bold text-black uppercase tracking-tight">Mock Credit Card</span>
                </div>
                <CheckCircle2 className="text-black" size={20} />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">Portfolio Mode: Payment is simulated for Techspire. No real funds will be processed or required.</p>
            </div>
          </section>

          <button 
            type="submit"
            className="w-full rounded-2xl bg-black py-5 font-black uppercase tracking-widest text-white transition-all hover:bg-gray-800 active:scale-95 shadow-lg shadow-gray-200"
          >
            Authorize Payment — ${cartTotal.toLocaleString()}
          </button>
        </form>

        {/* Right Side: Order Preview */}
        <div className="rounded-[40px] bg-gray-50 p-10 border border-gray-100">
          <h2 className="mb-8 text-xl font-black uppercase tracking-tight italic text-black">Order Summary</h2>
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {cart.map(item => (
              <div key={item._id} className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-white border border-gray-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-black uppercase tracking-tight">{item.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Quantity: {item.quantity}</p>
                </div>
                <span className="font-mono font-bold text-sm text-black">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
              <span className="text-4xl font-black tracking-tighter text-black">${cartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;