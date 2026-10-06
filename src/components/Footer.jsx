import React, { useState } from 'react';
import { 
  Sparkles, Mail, Send, Heart, Phone, MapPin, 
  ShieldCheck, Truck, RotateCcw, Award, CheckCircle2,
  MessageCircle, ExternalLink
} from 'lucide-react';

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Footer({ onSelectCategory, onOpenPolicy, onOpenMyOrders, onOpenTrackOrder }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#12051a] text-gray-300 border-t border-amber-500/20 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/10 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Express Shipping</h4>
              <p className="text-xs text-gray-400 mt-0.5">Prompt 1–3 day dispatch across India</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-400/30 flex items-center justify-center text-rose-300 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Exchange Support</h4>
              <p className="text-xs text-gray-400 mt-0.5">Quick verification for defective or damaged items</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Handcrafted Auth</h4>
              <p className="text-xs text-gray-400 mt-0.5">Pure Cambric cotton & Banarasi zari</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Multi-Store Trusted</h4>
              <p className="text-xs text-gray-400 mt-0.5">Top-rated on Flipkart, Meesho & Ajio</p>
            </div>
          </div>

        </div>

        {/* 4-Column Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-700 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <div className="font-serif font-extrabold text-2xl text-white tracking-tight flex items-center gap-1">
                  <span>SACHIKA</span>
                  <span className="text-rose-400">CLOTHING</span>
                  <span className="text-[10px] bg-amber-500 text-black font-extrabold px-1.5 py-0.2 rounded font-sans tracking-widest ml-1">
                    3D
                  </span>
                </div>
                <div className="text-[9px] font-bold tracking-widest uppercase text-amber-400 -mt-1 font-sans">
                  Royal Ethnic Couture
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Discover authentic Indian royalty redefined. Our interactive 3D virtual boutique brings Jaipuri blockprints, Lucknowi Chikankari, and Banarasi Silk right to your fingertips.
            </p>

            {/* Direct Contact Details */}
            <div className="pt-1 text-xs space-y-1.5 text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="https://wa.me/919352173474" target="_blank" rel="noreferrer" className="hover:text-amber-300 font-medium">+91 93521 73474</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <a href="mailto:sachikaclothing22589@gmail.com" className="hover:text-amber-300 font-medium">sachikaclothing22589@gmail.com</a>
              </div>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight">Mangal Marg, in front of Factory Cafe, Narayan Vihar, Jaipur - 302020</span>
              </div>
            </div>

            {/* Marketplace badges reminder */}
            <div className="pt-2">
              <span className="text-xs font-bold text-gray-300 block mb-2">Available across top platforms:</span>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <a 
                  href="https://www.flipkart.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#2874F0] text-white px-3 py-1 rounded-lg hover:opacity-90 flex items-center gap-1"
                >
                  <span>Flipkart</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a 
                  href="https://www.meesho.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#F43397] text-white px-3 py-1 rounded-lg hover:opacity-90 flex items-center gap-1"
                >
                  <span>Meesho</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a 
                  href="https://www.ajio.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#2C4152] text-white px-3 py-1 rounded-lg hover:opacity-90 flex items-center gap-1"
                >
                  <span>Ajio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-200 text-sm tracking-wider uppercase">Collections</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('Short Kurti')} className="hover:text-amber-300 transition">
                  Short Kurti Collection
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Long Kurti')} className="hover:text-amber-300 transition">
                  Long Kurti & Anarkali
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('3pc Suit')} className="hover:text-amber-300 transition">
                  3-Piece Silk Suit Sets
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('New Arrivals')} className="hover:text-amber-300 transition">
                  Festive New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('all')} className="hover:text-amber-300 transition">
                  View Full 3D Catalog
                </button>
              </li>
            </ul>
          </div>

          {/* Policies Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-200 text-sm tracking-wider uppercase">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              {onOpenMyOrders && (
                <li>
                  <button onClick={onOpenMyOrders} className="hover:text-amber-300 transition text-amber-300 font-bold flex items-center gap-1">
                    <span>📦 My Orders</span>
                  </button>
                </li>
              )}
              {onOpenTrackOrder && (
                <li>
                  <button onClick={onOpenTrackOrder} className="hover:text-amber-300 transition text-rose-300 font-semibold flex items-center gap-1">
                    <span>🚚 Track Your Shipment</span>
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => onOpenPolicy('return')} className="hover:text-amber-300 transition">
                  Refund & Exchange Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('cancellation')} className="hover:text-amber-300 transition">
                  Cancellation Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('shipping')} className="hover:text-amber-300 transition">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('about')} className="hover:text-amber-300 transition">
                  About Sachika Clothing
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('contact')} className="hover:text-amber-300 transition">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-200 text-sm tracking-wider uppercase">VIP Festive Club</h4>
            <p className="text-xs text-gray-400">
              Subscribe for exclusive secret drop invites and get <b>₹250 OFF</b> on your first order.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
              >
                <span>Join VIP Club</span>
                <Send className="w-3 h-3" />
              </button>
            </form>

            {subscribed && (
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Subscribed! Check email for your ₹250 coupon.</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Strip & Payment Icons */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © 2026 <b>Sachika Clothing LLP</b>. All rights reserved. Handcrafted with pride in India.
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-3 text-gray-400">
            <span className="font-bold text-[11px] text-gray-300">100% SECURE PAYMENTS:</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-gray-200 font-mono">UPI</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-gray-200 font-mono">RuPay</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-gray-200 font-mono">Visa / MC</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-gray-200 font-mono">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
