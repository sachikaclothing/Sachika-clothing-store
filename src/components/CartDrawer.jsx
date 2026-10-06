import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { getCoupons } from '../utils/storage';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onProceedToCheckout 
}) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const coupons = getCoupons();

  const subtotal = cart.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
  const freeShippingThreshold = 999;
  const shippingCharge = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCharge);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const found = coupons.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code. Try SACHIKA10 or FESTIVE20');
      return;
    }
    if (found.minSpend && subtotal < found.minSpend) {
      setCouponError(`Min order value of ₹${found.minSpend} required for this coupon.`);
      return;
    }
    setAppliedCoupon(found);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#21092e] to-[#12041b] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-lg text-amber-100">Your Shopping Bag</h3>
            <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-amber-50 p-3 border-b border-amber-200 text-xs">
          {shippingCharge === 0 ? (
            <div className="text-emerald-800 font-bold flex items-center gap-1.5 justify-center">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Congratulations! You qualify for FREE Express Shipping!</span>
            </div>
          ) : (
            <div>
              <p className="text-amber-900 font-medium mb-1 text-center">
                Add <b>₹{amountNeededForFreeShipping}</b> more to unlock <b>FREE Delivery</b>!
              </p>
              <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-600 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-gray-500">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-gray-800">Your Bag is Empty</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Discover our pure cambric kurtis and Chanderi suits. Experience them in 3D!
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition shadow"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={`${item.id}-${item.selectedSize || 'default'}-${index}`}
                className="flex gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200 relative group"
              >
                <img 
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'} 
                  alt={item.name}
                  className="w-20 h-24 object-cover object-top rounded-xl border border-gray-200 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                      <button 
                        onClick={() => onRemoveItem(item.id, item.selectedSize)}
                        className="text-gray-400 hover:text-rose-600 transition p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                      <span className="bg-white border px-1.5 py-0.2 rounded font-semibold text-gray-700">
                        Size: {item.selectedSize || 'Free Size'}
                      </span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-extrabold text-sm text-gray-900">
                      ₹{(item.discountPrice * item.quantity).toLocaleString('en-IN')}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg p-0.5 shadow-sm">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                        className="p-1 text-gray-600 hover:text-black rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                        className="p-1 text-gray-600 hover:text-black rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-200 space-y-3 shrink-0 shadow-lg">
            
            {/* Coupon Section */}
            <div>
              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Coupon <b>{appliedCoupon.code}</b> applied (-₹{discountAmount})</span>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon}
                    className="text-gray-400 hover:text-rose-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Discount code (e.g. SACHIKA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 uppercase font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
            </div>

            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-2">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className={shippingCharge === 0 ? "text-emerald-700 font-bold" : "font-semibold text-gray-900"}>
                  {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t border-gray-200 pt-2">
                <span>Total Amount</span>
                <span className="text-base text-rose-700">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onProceedToCheckout({
                  cart,
                  subtotal,
                  discountAmount,
                  shippingCharge,
                  finalTotal,
                  appliedCoupon: appliedCoupon ? appliedCoupon.code : null
                });
              }}
              className="w-full py-3.5 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white font-extrabold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & 256-Bit SSL Encrypted Checkout</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
