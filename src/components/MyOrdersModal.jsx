import React, { useState, useEffect } from 'react';
import { 
  X, Package, Truck, ExternalLink, Calendar, 
  MapPin, ShoppingBag, Clock, CheckCircle2, ArrowRight, 
  MessageCircle, AlertOctagon, XCircle 
} from 'lucide-react';
import { getOrders, cancelOrderCustomer } from '../utils/storage';

export default function MyOrdersModal({ isOpen, onClose, onTrackOrder }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setOrders(getOrders());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCancelOrder = (orderId) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel Order #${orderId}?\n\nAs per our Cancellation Policy, orders can only be cancelled before they are dispatched.`
    );
    if (confirmCancel) {
      const updated = cancelOrderCustomer(orderId, 'Cancelled by Customer');
      setOrders(updated);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Dispatched':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-amber-300 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#21092e] to-[#14051d] text-white p-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-100">My Orders</h3>
              <p className="text-xs text-gray-300">View your order history, delivery status & shipment tracking</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-lg text-gray-900">No Orders Placed Yet</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Your shopping bag is waiting for its first royal ensemble. Browse our 3D showroom to place your order!
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition shadow inline-flex items-center gap-2"
              >
                <span>Browse Kurtis & 3pc Suits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 pb-1">
                <span>Showing {orders.length} order{orders.length > 1 ? 's' : ''} placed with Sachika Clothing</span>
                <span className="font-semibold text-emerald-700">✓ Real-time Sync</span>
              </div>

              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-gray-50/70 hover:bg-white border border-gray-200 hover:border-amber-300 rounded-2xl p-4 sm:p-5 transition shadow-sm space-y-3.5"
                >
                  {/* Top Bar of Order Card */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200/80">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs sm:text-sm text-gray-900">
                          Order #{order.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(order.status || 'Order Confirmed')}`}>
                          {order.status || 'Order Confirmed'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>Placed on {order.date || 'Recent'} at {order.time || 'IST'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 uppercase block">Total Amount</span>
                      <span className="font-black text-sm sm:text-base text-rose-700 font-mono">
                        ₹{(order.total || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Items in the Order */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Items in this order:</span>
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 text-xs bg-white p-2.5 rounded-xl border border-gray-200">
                          <div className="flex items-center gap-3">
                            {item.images?.[0] ? (
                              <img 
                                src={item.images[0]} 
                                alt={item.name} 
                                className="w-10 h-12 object-cover rounded-lg border border-gray-200 shrink-0" 
                              />
                            ) : (
                              <div className="w-10 h-12 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <h5 className="font-semibold text-gray-900 text-xs line-clamp-1">{item.name}</h5>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                Size: <b className="text-gray-800">{item.selectedSize || 'Free Size'}</b> • Qty: <b className="text-gray-800">{item.quantity}</b>
                              </p>
                            </div>
                          </div>
                          <div className="font-mono font-bold text-gray-800 text-xs shrink-0">
                            ₹{(item.discountPrice * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info & Payment Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 text-gray-600 bg-amber-50/40 p-3 rounded-xl border border-amber-100">
                    <div>
                      <div className="flex items-center gap-1 font-bold text-gray-800 text-[11px]">
                        <MapPin className="w-3 h-3 text-amber-700" />
                        <span>Delivery Address:</span>
                      </div>
                      <p className="text-[11px] mt-0.5 leading-snug text-gray-600 truncate">
                        {order.shippingInfo?.name || 'Customer'} • {order.shippingInfo?.phone}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {order.shippingInfo?.address}, {order.shippingInfo?.city} - {order.shippingInfo?.pincode}
                      </p>
                    </div>

                    <div className="sm:text-right flex sm:flex-col justify-between sm:justify-start">
                      <div>
                        <span className="font-bold text-gray-800 text-[11px]">Payment Mode:</span>
                        <div className="text-[11px] text-gray-700 font-semibold">{order.paymentMethod || 'Prepaid'}</div>
                      </div>
                      {order.awb && (
                        <div className="text-[11px] text-indigo-700 font-mono mt-1">
                          AWB: {order.awb}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cancellation Reason Alert Box */}
                  {order.status === 'Cancelled' && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 flex items-start gap-2.5">
                      <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>Order Cancelled:</span>
                          <span className="bg-rose-200/90 text-rose-950 font-black px-2 py-0.5 rounded text-[11px]">
                            {order.cancelReason || 'Out of Stock'}
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-800 leading-relaxed">
                          {order.cancelReason === 'Out of Stock' || !order.cancelReason
                            ? 'This order was cancelled by Sachika Clothing because the requested item is currently Out of Stock in our workshop. If you completed payment online, your full refund is being processed.'
                            : `This order was cancelled (${order.cancelReason}).`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions: Cancel, WhatsApp Support & Track */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
                    <div>
                      {/* Customer Cancel Button (Only if un-dispatched) */}
                      {(order.status === 'Order Confirmed' || order.status === 'Processing') && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1.5"
                          title="Cancel order before dispatch"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const msg = order.status === 'Cancelled'
                            ? encodeURIComponent(`Hi Sachika Clothing, regarding my cancelled Order #${order.id} (Reason: ${order.cancelReason || 'Out of Stock'}): Could you please help me with my refund or alternative styles?`)
                            : encodeURIComponent(`Hi Sachika Clothing, I have a query regarding my Order #${order.id}. Could you please assist me?`);
                          window.open(`https://wa.me/919352173474?text=${msg}`, '_blank');
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp Support</span>
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          if (onTrackOrder) {
                            onTrackOrder(order.id);
                          }
                        }}
                        className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                      >
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Track Shipment</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center shrink-0">
          <span className="text-[11px] text-gray-500">
            For support: <b>sachikaclothing22589@gmail.com</b> | <b>+91 93521 73474</b>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
