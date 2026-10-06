import React from 'react';
import { X, Truck, RotateCcw, AlertOctagon, Phone, Info, Mail, MapPin } from 'lucide-react';

export default function PolicyModal({ isOpen, onClose, initialPolicy = 'return' }) {
  // Normalize policy id (map 'refund' to 'return' since Refund & Exchange are now unified)
  const normalizedInitial = initialPolicy === 'refund' ? 'return' : (initialPolicy || 'return');
  const [activePolicy, setActivePolicy] = React.useState(normalizedInitial);

  React.useEffect(() => {
    if (initialPolicy) {
      setActivePolicy(initialPolicy === 'refund' ? 'return' : initialPolicy);
    }
  }, [initialPolicy]);

  if (!isOpen) return null;

  const policyTabs = [
    { id: 'return', label: 'Refund & Exchange Policy', icon: RotateCcw },
    { id: 'cancellation', label: 'Cancellation Policy', icon: AlertOctagon },
    { id: 'shipping', label: 'Shipping Policy', icon: Truck },
    { id: 'about', label: 'About Sachika Clothing', icon: Info },
    { id: 'contact', label: 'Contact Us', icon: Phone }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-amber-300 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#21092e] to-[#14051d] text-white p-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div>
            <h3 className="font-serif font-bold text-lg text-amber-100">Store Policies & Information</h3>
            <p className="text-xs text-gray-300">Official guidelines, customer support & brand information</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Selector Tabs */}
        <div className="bg-gray-100 px-4 flex gap-1 overflow-x-auto border-b border-gray-200 text-xs font-bold shrink-0">
          {policyTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePolicy(tab.id)}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${activePolicy === tab.id ? 'border-rose-600 text-rose-700 bg-white' : 'border-transparent text-gray-600 hover:text-black'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          
          {/* 1. REFUND & EXCHANGE POLICY */}
          {activePolicy === 'return' && (
            <div className="space-y-4">
              <h4 className="text-base font-serif font-bold text-gray-900 border-b pb-2">Refund & Exchange Policy</h4>
              
              <div className="space-y-3 bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
                <div>
                  <h5 className="font-bold text-gray-900">No Refunds</h5>
                  <p className="text-gray-600 mt-0.5">Refunds are not available for purchases made from us.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Exchange</h5>
                  <p className="text-gray-600 mt-0.5">If you receive a defective, damaged, or incorrect product, you may request an exchange.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Product Condition</h5>
                  <p className="text-gray-600 mt-0.5">The product must be unused, unworn, unwashed, and in its original condition with tags/packaging intact.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Exchange Request</h5>
                  <p className="text-gray-600 mt-0.5">Please contact us within the specified period after receiving your order and provide details/photos of the issue.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Delivery Charges</h5>
                  <p className="text-gray-600 mt-0.5">Any additional delivery or shipping charges for an exchange may apply depending on the delivery location/area.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Exchange Approval</h5>
                  <p className="text-gray-600 mt-0.5">All exchange requests are subject to verification and approval.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Non-Exchangeable Items</h5>
                  <p className="text-gray-600 mt-0.5">Products that have been worn, washed, damaged by the customer, or altered may not be eligible for exchange.</p>
                </div>
              </div>

              <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 text-rose-900 font-medium text-xs">
                Thank you for understanding and supporting our business.
              </div>
            </div>
          )}

          {/* 2. CANCELLATION POLICY */}
          {activePolicy === 'cancellation' && (
            <div className="space-y-4">
              <h4 className="text-base font-serif font-bold text-gray-900 border-b pb-2">Cancellation Policy</h4>
              
              <div className="space-y-3 bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
                <p className="text-gray-700">Orders can be cancelled only before they are shipped.</p>
                <p className="text-gray-700">Once an order has been shipped, cancellation will not be allowed.</p>
                <p className="text-gray-700">
                  If the order has already been dispatched, the customer may receive it and request an exchange only if the product meets our exchange conditions.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                <span>Need to cancel an un-shipped order?</span>
                <a 
                  href="https://wa.me/919352173474?text=Hi%20Sachika%20Clothing,%20I%20would%20like%20to%20cancel%20my%20order" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-bold text-emerald-700 hover:underline"
                >
                  WhatsApp us at +91 93521 73474
                </a>
              </div>
            </div>
          )}

          {/* 3. SHIPPING POLICY */}
          {activePolicy === 'shipping' && (
            <div className="space-y-4">
              <h4 className="text-base font-serif font-bold text-gray-900 border-b pb-2">Shipping Policy</h4>
              
              <div className="space-y-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
                <div>
                  <h5 className="font-bold text-gray-900">Order Processing</h5>
                  <p className="text-gray-600 mt-1">Orders are generally processed within 1–3 business days after the order is confirmed.</p>
                  <p className="text-gray-600">Orders placed on weekends or public holidays may be processed on the next business day.</p>
                  <p className="text-gray-600">Processing time may be longer during sales, festivals, or periods of high order volume.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Delivery Time</h5>
                  <p className="text-gray-600 mt-1">Delivery usually takes approximately 3–7 business days after dispatch, depending on the delivery location.</p>
                  <p className="text-gray-600">Remote or difficult-to-reach areas may require additional delivery time.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Shipping Charges</h5>
                  <p className="text-gray-600 mt-1">Shipping charges, if applicable, will be displayed at the time of checkout.</p>
                  <p className="text-gray-600">Shipping charges may vary depending on the customer's delivery location, order size, weight, or shipping method.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Delivery Address</h5>
                  <p className="text-gray-600 mt-1">Customers are responsible for providing a complete and accurate delivery address and contact number.</p>
                  <p className="text-gray-600">We are not responsible for delays or failed deliveries caused by an incorrect or incomplete address provided by the customer.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Tracking</h5>
                  <p className="text-gray-600 mt-1">Once the order is dispatched, tracking details may be provided to the customer.</p>
                  <p className="text-gray-600">Customers can use the tracking information to check the status of their shipment.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Delayed or Failed Delivery</h5>
                  <p className="text-gray-600 mt-1">Delivery times are estimates and may be affected by courier delays, weather, holidays, strikes, natural events, or other circumstances beyond our control.</p>
                  <p className="text-gray-600">If a delivery attempt fails because the customer is unavailable or provides an incorrect address/contact number, additional shipping charges may apply for re-delivery where applicable.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Exchange Shipping</h5>
                  <p className="text-gray-600 mt-1">For an approved exchange, additional delivery/shipping charges may apply depending on the customer's location or area.</p>
                  <p className="text-gray-600">Exchange shipments will be processed only after the returned product has been received and verified, where applicable.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">Damaged Package</h5>
                  <p className="text-gray-600 mt-1">If the package appears damaged at the time of delivery, customers are advised to take photographs/videos of the package and contact us as soon as possible.</p>
                  <p className="text-gray-600">Any claim regarding a damaged or incorrect product will be subject to verification.</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900">International Shipping</h5>
                  <p className="text-gray-600 mt-1">We currently ship within India only, unless otherwise stated.</p>
                  <p className="text-gray-600">International shipping, if introduced in the future, will be subject to separate shipping charges, delivery timelines, customs duties, and applicable regulations.</p>
                </div>
              </div>
            </div>
          )}

          {/* 4. ABOUT US */}
          {activePolicy === 'about' && (
            <div className="space-y-4">
              <h4 className="text-base font-serif font-bold text-gray-900 border-b pb-2">About Sachika Clothing</h4>
              
              <div className="space-y-3 bg-gray-50/70 p-5 rounded-2xl border border-gray-200">
                <p className="text-gray-900 font-semibold text-sm">
                  Welcome to Sachika Clothing, where style meets comfort and quality.
                </p>

                <p className="text-gray-700">
                  We believe fashion should be simple, comfortable, and made for everyday life. At Sachika Clothing, we bring you thoughtfully designed clothing that combines modern style, comfort, quality, and affordability.
                </p>

                <p className="text-gray-700">
                  Our goal is to offer clothing that makes you feel confident and comfortable every time you wear it. From everyday essentials to stylish pieces for special moments, we focus on creating products that fit naturally into your wardrobe.
                </p>

                <p className="text-gray-700">
                  We carefully select our fabrics, designs, and finishing to provide you with a reliable and enjoyable shopping experience.
                </p>

                <div className="pt-2">
                  <h5 className="font-bold text-gray-900 text-sm mb-2">Our Promise</h5>
                  <ul className="space-y-1.5 text-gray-700 pl-1">
                    <li>• <b>Quality First</b> – We focus on good-quality fabrics and finishing.</li>
                    <li>• <b>Comfort</b> – Designs made with everyday comfort in mind.</li>
                    <li>• <b>Affordable Style</b> – Fashionable clothing at reasonable prices.</li>
                    <li>• <b>Customer Satisfaction</b> – Your experience and trust matter to us.</li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-1">
                  <p className="text-gray-700">Thank you for choosing Sachika Clothing and being a part of our journey.</p>
                  <p className="font-serif font-bold text-rose-800 text-sm">Sachika Clothing — Wear Your Style.</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. CONTACT US */}
          {activePolicy === 'contact' && (
            <div className="space-y-4">
              <h4 className="text-base font-serif font-bold text-gray-900 border-b pb-2">Contact Us</h4>
              
              <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200 space-y-4">
                <p className="text-gray-800 font-medium">
                  Have a question about your order, product, exchange, or anything else? We’re here to help.
                </p>

                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm space-y-3">
                  <h5 className="font-serif font-bold text-base text-gray-900">Sachika Clothing</h5>
                  
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>📧 Email: <a href="mailto:sachikaclothing22589@gmail.com" className="font-semibold text-rose-700 hover:underline">sachikaclothing22589@gmail.com</a></span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>📞 Phone/WhatsApp: <a href="https://wa.me/919352173474" target="_blank" rel="noreferrer" className="font-semibold text-emerald-700 hover:underline">9352173474</a></span>
                    </div>

                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>📍 Address: <b>Mangal Marg, right in front of Factory Cafe, Narayan Vihar, Jaipur, Rajasthan – 302020, India</b></span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1.5 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                  <div className="font-bold text-gray-900">Customer Support Hours:</div>
                  <p>Monday – Saturday | 10:00 AM – 6:00 PM</p>
                  <p className="pt-1 text-gray-500">For order-related queries, please mention your Order ID so we can assist you quickly.</p>
                  <p className="text-gray-500">We aim to respond to all queries as soon as possible.</p>
                </div>

                <div className="font-serif font-bold text-rose-800 text-xs sm:text-sm">
                  Thank you for choosing Sachika Clothing!
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
          >
            Close Policy
          </button>
        </div>

      </div>
    </div>
  );
}
