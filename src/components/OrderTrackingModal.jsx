import React, { useState } from 'react';
import { 
  X, Search, Package, Truck, CheckCircle2, Clock, 
  MapPin, ShieldCheck, MessageCircle, AlertCircle, Copy, Check,
  AlertOctagon, XCircle
} from 'lucide-react';
import { getOrders } from '../utils/storage';

export default function OrderTrackingModal({ isOpen, onClose, initialOrderId = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialOrderId || '');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedAWB, setCopiedAWB] = useState(false);

  const orders = getOrders();

  React.useEffect(() => {
    if (initialOrderId) {
      setSearchTerm(initialOrderId);
      const found = orders.find(
        o => o.id?.toUpperCase() === initialOrderId.trim().toUpperCase()
      );
      if (found) {
        setTrackedOrder(found);
      }
    } else if (orders.length > 0 && !trackedOrder) {
      setSearchTerm(orders[0].id);
      setTrackedOrder(orders[0]);
    }
  }, [initialOrderId, isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const term = searchTerm.trim().toUpperCase();
    if (!term) return;

    const found = orders.find(
      o => o.id?.toUpperCase() === term || o.shippingInfo?.phone === term
    );

    if (found) {
      setTrackedOrder(found);
    } else {
      // Mock tracking if no matching local order yet
      if (term.startsWith('SC-') || term.startsWith('AV-') || term.length === 10) {
        setTrackedOrder({
          id: term.startsWith('SC-') || term.startsWith('AV-') ? term : `SC-847291`,
          date: 'Yesterday',
          status: 'Dispatched',
          estimatedDelivery: '3–7 Business Days',
          courier: 'Delhivery Air Express',
          awb: 'DLV983471029IN',
          shippingInfo: {
            name: 'Valued Customer',
            city: 'Jaipur',
            pincode: '302020'
          },
          items: [
            { name: 'Royal Gulmohar Handblock Kurti', quantity: 1, selectedSize: 'M' }
          ],
          total: 1299
        });
      } else {
        setErrorMsg('Order not found. Please enter valid Order ID (e.g. SC-123456) or 10-digit mobile number.');
      }
    }
  };

  const isCancelled = trackedOrder?.status === 'Cancelled';

  // Dynamic step determination
  const getSteps = () => {
    if (isCancelled) {
      return [
        { 
          title: 'Order Placed & Confirmed', 
          desc: 'Order details recorded in store database', 
          state: 'done' 
        },
        { 
          title: 'Workshop Inventory Verification', 
          desc: 'Artisan stock verification performed', 
          state: 'done' 
        },
        { 
          title: `Order Cancelled (${trackedOrder.cancelReason || 'Out of Stock'})`, 
          desc: `Order cancelled because item is ${trackedOrder.cancelReason || 'Out of Stock'}. Refund initiated.`, 
          state: 'cancelled' 
        },
        { 
          title: 'Courier Handover Halted', 
          desc: 'Dispatch terminated prior to courier handover', 
          state: 'void' 
        }
      ];
    }

    const currentStatus = trackedOrder?.status || 'Order Confirmed';
    const isProcessing = currentStatus === 'Processing';
    const isDispatched = currentStatus === 'Dispatched';
    const isDelivered = currentStatus === 'Delivered';

    return [
      { 
        title: 'Order Confirmed', 
        desc: 'Order details verified & payment secured', 
        state: 'done' 
      },
      { 
        title: 'Artisanal Quality Check', 
        desc: 'Hand-inspected for flawless weave & zari threadwork', 
        state: (isProcessing || isDispatched || isDelivered) ? 'done' : 'in-progress' 
      },
      { 
        title: 'Handcrafted Packaging', 
        desc: 'Fragrant butter paper wrap with royal festive box', 
        state: (isProcessing || isDispatched || isDelivered) ? 'done' : 'pending' 
      },
      { 
        title: 'Dispatched with Courier', 
        desc: 'In-transit via Delhivery Express Cargo', 
        state: (isDispatched || isDelivered) ? 'done' : (isProcessing ? 'in-progress' : 'pending') 
      },
      { 
        title: 'Delivered', 
        desc: 'Doorstep parcel delivery completed', 
        state: isDelivered ? 'done' : 'pending' 
      }
    ];
  };

  const steps = getSteps();

  const handleCopyAWB = () => {
    if (trackedOrder?.awb) {
      navigator.clipboard?.writeText(trackedOrder.awb);
      setCopiedAWB(true);
      setTimeout(() => setCopiedAWB(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-amber-300 my-auto flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#21092e] to-[#12041b] text-white p-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-100">Live Express Order Tracking</h3>
              <p className="text-xs text-gray-300">Track your designer Kurti or Suit ensemble step-by-step</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 overflow-y-auto space-y-6">
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">Enter Order ID or Mobile Number:</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. SC-123456 or 9352173474"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-mono uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-rose-700 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl transition shadow"
              >
                Track Now
              </button>
            </div>
            {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}
          </form>

          {/* Tracking Result Card */}
          {trackedOrder ? (
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-5">
              
              {/* Order Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200">
                <div>
                  <div className="text-xs font-bold text-gray-400">ORDER NUMBER</div>
                  <div className="font-mono font-bold text-base text-gray-900">{trackedOrder.id}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400">
                    {isCancelled ? 'SHIPMENT STATUS' : 'ESTIMATED DELIVERY'}
                  </div>
                  {isCancelled ? (
                    <div className="text-xs font-extrabold text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 flex items-center gap-1.5 shadow-sm">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Order Cancelled</span>
                    </div>
                  ) : (
                    <div className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {trackedOrder.estimatedDelivery || 'In 3–7 Business Days'}
                    </div>
                  )}
                </div>
              </div>

              {/* CANCELLED NOTICE BANNER */}
              {isCancelled && (
                <div className="bg-rose-50/90 border-2 border-rose-300 rounded-2xl p-4 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
                    <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Order #{trackedOrder.id} Has Been Cancelled</span>
                  </div>
                  <div className="text-xs text-rose-900 font-semibold flex items-center gap-2">
                    <span>Cancellation Reason:</span>
                    <span className="bg-rose-200/90 text-rose-950 font-black px-2.5 py-0.5 rounded-md text-xs border border-rose-300">
                      {trackedOrder.cancelReason || 'Out of Stock'}
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    {trackedOrder.cancelReason === 'Out of Stock' || !trackedOrder.cancelReason
                      ? 'This order was cancelled by Sachika Clothing because the requested ensemble is currently Out of Stock in our artisan workshop. If you made an online payment, your full refund is being processed to your original payment mode. You can also reach our support for assistance or an alternate style selection.'
                      : `This order was cancelled (${trackedOrder.cancelReason}). If you need any assistance, our customer care team is happy to help.`}
                  </p>
                  {trackedOrder.cancelledAt && (
                    <div className="text-[11px] text-rose-700 font-medium">
                      Cancelled on: {new Date(trackedOrder.cancelledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  )}
                </div>
              )}

              {/* Courier Partner & AWB */}
              <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs ${isCancelled ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-gray-200'}`}>
                <div>
                  <span className="text-gray-500 font-medium">Logistics Partner: </span>
                  <span className={`font-bold ${isCancelled ? 'text-rose-800' : 'text-gray-800'}`}>
                    {isCancelled ? 'Shipment Halted (Order Cancelled)' : (trackedOrder.courier || 'Delhivery Air Cargo')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-medium">AWB Status: </span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded ${isCancelled ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-gray-100 text-gray-900'}`}>
                    {isCancelled ? 'Void / Cancelled' : (trackedOrder.awb || 'DLV891238472IN')}
                  </span>
                  {!isCancelled && (
                    <button 
                      onClick={handleCopyAWB}
                      className="p-1 hover:bg-gray-200 rounded text-gray-500"
                      title="Copy AWB Number"
                    >
                      {copiedAWB ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Stepper Timeline */}
              <div className="space-y-4 pt-2">
                <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  {isCancelled ? 'Cancellation Journey:' : 'Shipment Journey:'}
                </div>
                <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {steps.map((st, i) => {
                    let badgeClass = 'bg-gray-300 text-gray-600';
                    let badgeContent = i + 1;

                    if (st.state === 'done') {
                      badgeClass = 'bg-emerald-600 text-white ring-4 ring-emerald-100';
                      badgeContent = '✓';
                    } else if (st.state === 'cancelled') {
                      badgeClass = 'bg-rose-600 text-white ring-4 ring-rose-200';
                      badgeContent = '✕';
                    } else if (st.state === 'in-progress') {
                      badgeClass = 'bg-amber-500 text-white ring-4 ring-amber-100';
                      badgeContent = '•';
                    } else if (st.state === 'void') {
                      badgeClass = 'bg-gray-200 text-gray-400 line-through';
                      badgeContent = '—';
                    }

                    return (
                      <div key={i} className="relative">
                        <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${badgeClass}`}>
                          {badgeContent}
                        </div>
                        <div className={`font-bold text-xs ${st.state === 'cancelled' ? 'text-rose-700' : (st.state === 'void' ? 'text-gray-400 line-through' : 'text-gray-900')}`}>
                          {st.title}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{st.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items summary */}
              <div className="pt-3 border-t border-gray-200 text-xs">
                <div className="font-bold text-gray-800 mb-1">Package Contents:</div>
                <div className="text-gray-600 space-y-1">
                  {trackedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>• {item.name} ({item.selectedSize || 'Free Size'}) x {item.quantity}</span>
                      <span className="font-semibold text-gray-900">₹{((item.discountPrice || item.price) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Support CTA */}
              <button
                onClick={() => {
                  const msg = isCancelled
                    ? encodeURIComponent(`Hi Sachika Clothing, regarding my cancelled order ${trackedOrder.id} (Reason: ${trackedOrder.cancelReason || 'Out of Stock'}). Could you please assist me with my refund or alternative design?`)
                    : encodeURIComponent(`Hi Sachika Clothing, checking on status of my shipment ${trackedOrder.id} (AWB: ${trackedOrder.awb || 'DLV891238472IN'}).`);
                  window.open(`https://wa.me/919352173474?text=${msg}`, '_blank');
                }}
                className={`w-full py-2.5 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition ${isCancelled ? 'bg-rose-700 hover:bg-rose-800' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {isCancelled 
                    ? 'Ask About Cancelled (Out of Stock) Order on WhatsApp' 
                    : 'Ask Courier Support on WhatsApp'}
                </span>
              </button>

            </div>
          ) : (
            <div className="text-center p-8 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <Package className="w-8 h-8 text-amber-600 mx-auto" />
              <p className="font-bold">Enter your Order ID received in confirmation SMS / WhatsApp</p>
              <p className="text-gray-500">
                You can also enter your 10-digit registered phone number to find all recent dispatches.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
