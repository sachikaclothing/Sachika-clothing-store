import React, { useState } from 'react';
import { 
  X, CheckCircle, ShieldCheck, Lock, CreditCard, 
  Smartphone, Building, Banknote, QrCode, ArrowLeft,
  Truck, PackageCheck, AlertCircle, Copy, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveOrder } from '../utils/storage';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  checkoutData, 
  onOrderSuccess 
}) {
  if (!isOpen || !checkoutData) return null;

  const [step, setStep] = useState('shipping'); // 'shipping' | 'payment' | 'success'
  const [shippingInfo, setShippingInfo] = useState({
    name: 'Pooja Verma',
    phone: '9352173474',
    email: 'pooja.verma@example.com',
    address: 'Flat 402, Royal Palms Residency, 12th Main Road, Indiranagar',
    pincode: '560038',
    city: 'Bengaluru',
    state: 'Karnataka'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiApp, setUpiApp] = useState('gpay');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8892',
    name: 'Pooja Verma',
    expiry: '09/28',
    cvv: '•••'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.pincode || !shippingInfo.address) {
      alert('Please fill all mandatory shipping details.');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const orderId = `AV-${Math.floor(100000 + Math.random() * 900000)}`;
      const order = {
        id: orderId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        items: checkoutData.cart,
        shippingInfo,
        paymentMethod: paymentMethod.toUpperCase(),
        subtotal: checkoutData.subtotal,
        discountAmount: checkoutData.discountAmount,
        shippingCharge: checkoutData.shippingCharge,
        total: checkoutData.finalTotal,
        couponUsed: checkoutData.appliedCoupon,
        status: 'Order Confirmed',
        estimatedDelivery: '3-4 Business Days'
      };

      saveOrder(order);
      setConfirmedOrder(order);
      setStep('success');

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      if (onOrderSuccess) {
        onOrderSuccess(order);
      }
    }, 1200);
  };

  const handleCopyOrderId = () => {
    if (confirmedOrder?.id) {
      navigator.clipboard?.writeText(confirmedOrder.id);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#21092e] to-[#12041b] text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-100">
                {step === 'shipping' && 'Shipping & Delivery Address'}
                {step === 'payment' && 'Select Secure Payment Mode'}
                {step === 'success' && 'Order Placed Successfully!'}
              </h3>
              <p className="text-xs text-gray-300">
                {step !== 'success' ? '100% Encrypted & Safe Checkout' : 'Thank you for choosing Sachika Clothing'}
              </p>
            </div>
          </div>
          {step !== 'success' && (
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: SHIPPING INFORMATION */}
        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit} className="p-6 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                  placeholder="e.g. Pooja Verma"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number (For Delivery Updates) *</label>
                <input
                  type="tel"
                  required
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (For Invoice & Tracking)</label>
              <input
                type="email"
                value={shippingInfo.email}
                onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Complete Street Address (House / Flat / Area) *</label>
              <textarea
                required
                rows={2}
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                placeholder="Flat / House No., Apartment name, Street, Landmark"
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={shippingInfo.pincode}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Order Mini Summary */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-gray-500 block">Total Payable:</span>
                <span className="text-base font-extrabold text-rose-800">
                  ₹{checkoutData.finalTotal?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right text-[11px] text-gray-600">
                <span>{checkoutData.cart?.length} item(s) in order</span>
                {checkoutData.shippingCharge === 0 && <span className="text-emerald-700 font-bold block">Free Delivery</span>}
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                Continue to Payment
              </button>
            </div>

          </form>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === 'payment' && (
          <div className="p-6 space-y-5">
            
            <button
              onClick={() => setStep('shipping')}
              className="text-xs text-gray-500 hover:text-gray-800 font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shipping Address</span>
            </button>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${paymentMethod === 'upi' ? 'border-rose-600 bg-rose-50/50 text-rose-800 font-bold' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
              >
                <Smartphone className="w-5 h-5 text-rose-600" />
                <span className="text-xs">Instant UPI</span>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${paymentMethod === 'card' ? 'border-rose-600 bg-rose-50/50 text-rose-800 font-bold' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
              >
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span className="text-xs">Cards</span>
              </button>

              <button
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${paymentMethod === 'netbanking' ? 'border-rose-600 bg-rose-50/50 text-rose-800 font-bold' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
              >
                <Building className="w-5 h-5 text-amber-600" />
                <span className="text-xs">Net Banking</span>
              </button>

              <button
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${paymentMethod === 'cod' ? 'border-rose-600 bg-rose-50/50 text-rose-800 font-bold' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
              >
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">Cash on Delivery</span>
              </button>
            </div>

            {/* Payment Details Container */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
              
              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">Scan QR or Pay with UPI App:</span>
                    <span className="text-emerald-700 font-bold text-[11px] bg-emerald-100 px-2 py-0.5 rounded">
                      Zero Surcharge
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['gpay', 'phonepe', 'paytm', 'bhim'].map((app) => (
                      <button
                        key={app}
                        onClick={() => setUpiApp(app)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase transition ${upiApp === app ? 'bg-white border-rose-600 text-rose-700 shadow-sm' : 'bg-white/60 border-gray-200 text-gray-600'}`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>

                  {/* QR Simulator */}
                  <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center p-1">
                      <QrCode className="w-16 h-16 text-gray-800" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Scan to Pay via Any UPI App</div>
                      <p className="text-[11px] text-gray-500 mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                      <div className="text-[11px] text-amber-700 font-bold mt-1">UPI ID: sachikaclothing@icici</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Card Number</label>
                    <input 
                      type="text" 
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">CVV</label>
                      <input 
                        type="password" 
                        maxLength={3}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3">
                  <span className="font-bold text-gray-800 block">Select Popular Bank:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map(bank => (
                      <div key={bank} className="p-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 text-center hover:border-rose-500 cursor-pointer">
                        {bank}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cash On Delivery */}
              {paymentMethod === 'cod' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Cash on Delivery is Available for your Pincode ({shippingInfo.pincode})!</span>
                  </div>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    You can pay in cash or via UPI to the delivery courier person at the time of doorstep parcel delivery.
                  </p>
                </div>
              )}

            </div>

            {/* Total summary before pay */}
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-gray-700">Total Amount to Pay:</span>
              <span className="text-lg font-black text-rose-800">₹{checkoutData.finalTotal?.toLocaleString('en-IN')}</span>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold rounded-xl text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirm Order & Pay ₹{checkoutData.finalTotal?.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

          </div>
        )}

        {/* STEP 3: ORDER SUCCESS CELEBRATION */}
        {step === 'success' && confirmedOrder && (
          <div className="p-6 text-center space-y-5 animate-in zoom-in-95 duration-300">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <PackageCheck className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-block bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                Order Confirmed
              </div>
              <h3 className="font-serif font-extrabold text-2xl text-gray-900">
                Badhai Ho! Your Order Has Been Placed!
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                We're carefully inspecting your ethnic pieces before dispatch. Tracking SMS & WhatsApp update sent to <b>{shippingInfo.phone}</b>.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Order Reference ID:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-gray-900">{confirmedOrder.id}</span>
                  <button 
                    onClick={handleCopyOrderId}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500"
                    title="Copy Order ID"
                  >
                    {copiedOrderId ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Customer Name:</span>
                <span className="font-semibold text-gray-900">{shippingInfo.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Address:</span>
                <span className="font-semibold text-gray-900 max-w-[60%] text-right truncate">{shippingInfo.address}, {shippingInfo.pincode}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Payment Mode:</span>
                <span className="font-semibold text-gray-900">{confirmedOrder.paymentMethod}</span>
              </div>

              <div className="flex justify-between pt-1 border-t border-gray-200 font-bold text-sm">
                <span>Total Paid:</span>
                <span className="text-rose-700">₹{confirmedOrder.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  const msg = encodeURIComponent(`Hi Sachika Clothing, my order ID is ${confirmedOrder.id}. I would like to track the dispatch status!`);
                  window.open(`https://wa.me/919352173474?text=${msg}`, '_blank');
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
              >
                <span>Track on WhatsApp</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs transition"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
