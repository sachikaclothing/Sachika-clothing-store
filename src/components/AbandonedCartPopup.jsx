import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShoppingBag, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export default function AbandonedCartPopup({ 
  cart, 
  isOpen, 
  onClose, 
  onClaimDiscount 
}) {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes countdown timer

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !cart || cart.length === 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const subtotal = cart.reduce((acc, it) => acc + (it.discountPrice * it.quantity), 0);
  const discount15 = Math.round(subtotal * 0.15);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-amber-300 animate-in zoom-in-95 duration-200 relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Regal Top Banner */}
        <div className="bg-gradient-to-r from-[#2a0845] via-[#6441a5] to-[#2a0845] text-white p-6 text-center space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-black text-xs font-black px-3 py-0.5 rounded-full shadow uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Special Privilege</span>
          </div>

          <h3 className="text-2xl font-serif font-extrabold text-amber-100">
            Wait! Don't Leave Your Outfit Behind!
          </h3>

          <p className="text-xs text-gray-200 max-w-xs mx-auto font-light">
            We've reserved your pieces for the next few minutes. Complete your order now with an extra <b>15% Instant Discount</b>!
          </p>

          {/* Countdown timer */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-amber-300">
            <Clock className="w-4 h-4" />
            <span>Offer expires in: </span>
            <span className="bg-black/50 px-2 py-0.5 rounded border border-amber-400/30">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Items in Bag */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Items currently in your bag ({cart.length}):
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-xs">
                <img 
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'} 
                  alt="" 
                  className="w-10 h-12 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex-1 truncate">
                  <div className="font-bold text-gray-900 truncate">{item.name}</div>
                  <div className="text-[11px] text-gray-500">Size: {item.selectedSize || 'M'} • Qty: {item.quantity}</div>
                </div>
                <div className="font-extrabold text-gray-900">
                  ₹{(item.discountPrice * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Highlight Box */}
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500 block">Instant VIP Savings:</span>
              <span className="font-bold text-emerald-700 text-sm">Save extra ₹{discount15.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-gray-500 block">Coupon Code:</span>
              <span className="font-mono font-extrabold text-amber-800 bg-white border border-amber-300 px-2 py-0.5 rounded">
                ROYAL15
              </span>
            </div>
          </div>

          {/* Claim CTA */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => onClaimDiscount('ROYAL15', discount15)}
              className="w-full py-3.5 bg-gradient-to-r from-rose-700 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold rounded-xl text-sm shadow-xl transition flex items-center justify-center gap-2 group"
            >
              <span>Apply ROYAL15 & Checkout Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-xs text-gray-500 hover:text-gray-800 font-semibold text-center"
            >
              No thanks, I'll pay full price later
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Free Shipping • COD Available • 7-Day Hassle-Free Returns</span>
          </div>

        </div>

      </div>
    </div>
  );
}
