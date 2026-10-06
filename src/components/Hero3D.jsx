import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, ShoppingBag, Eye, ExternalLink } from 'lucide-react';
import ThreeDCanvas from './ThreeDCanvas';

export default function Hero3D({ onShopNow, onOpenAdmin, featuredProduct, onSelectProduct }) {
  const [activeModelType, setActiveModelType] = useState('suit_3pc');

  // Dynamic preview model for Hero
  const heroModelProduct = {
    ...featuredProduct,
    category: activeModelType === 'short_kurti' 
      ? 'Short Kurti' 
      : activeModelType === 'long_anarkali' 
        ? 'Long Kurti' 
        : '3pc Suit',
    model3DConfig: {
      type: activeModelType,
      primaryColor: activeModelType === 'short_kurti' 
        ? '#c03d5d' 
        : activeModelType === 'long_anarkali' 
          ? '#732338' 
          : '#581c2e',
      secondaryColor: '#d4af37'
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#180922] via-[#240e33] to-[#12051a] text-white pt-8 pb-16 px-4">
      {/* Decorative Golden Ambient Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Compelling Sales Copy & Urgency */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            
            {/* Top Pill with live urgency */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>India's 1st Interactive 3D Ethnic Boutique</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold leading-tight tracking-tight">
              Wear Pure <span className="gold-gradient-text">Royalty</span>.<br />
              Experience in <span className="text-rose-400">3D</span> Before You Buy.
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Step into our virtual showroom. Rotate handcrafted <b>Short Kurtis</b>, cascading <b>Anarkalis</b>, and opulent <b>3pc Suit Sets</b> in 360° 3D with true-to-life fabric textures.
            </p>

            {/* Marketplace Callout Pill */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-3">
              <span className="text-amber-200 font-semibold flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                Also Available On:
              </span>
              <div className="flex items-center gap-2 font-bold">
                <span className="bg-[#2874F0] text-white px-2.5 py-0.5 rounded shadow text-xs">Flipkart</span>
                <span className="bg-[#F43397] text-white px-2.5 py-0.5 rounded shadow text-xs">Meesho</span>
                <span className="bg-[#2C4152] text-white px-2.5 py-0.5 rounded shadow text-xs">Ajio</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start">
              <button
                onClick={onShopNow}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-400 hover:to-rose-600 text-white font-bold rounded-xl shadow-xl hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group text-base"
              >
                <span>Shop Festive Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={onOpenAdmin}
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm"
              >
                <span>+ Upload Products / Admin</span>
              </button>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center lg:text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-amber-300">50-70%</div>
                <div className="text-xs text-gray-400">Festive Clearance</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">4.9 ★</div>
                <div className="text-xs text-gray-400">3,800+ Reviews</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">COD</div>
                <div className="text-xs text-gray-400">Cash on Delivery</div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Showroom Mannequin */}
          <div className="lg:col-span-6 z-10">
            <div className="relative">
              
              {/* Style Silhouette Switcher */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-black/80 backdrop-blur-md p-1.5 rounded-full border border-amber-400/40 shadow-xl flex items-center gap-1">
                <button
                  onClick={() => setActiveModelType('short_kurti')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${activeModelType === 'short_kurti' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white' : 'text-gray-300 hover:text-white'}`}
                >
                  Short Kurti
                </button>
                <button
                  onClick={() => setActiveModelType('long_anarkali')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${activeModelType === 'long_anarkali' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white' : 'text-gray-300 hover:text-white'}`}
                >
                  Long Anarkali
                </button>
                <button
                  onClick={() => setActiveModelType('suit_3pc')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${activeModelType === 'suit_3pc' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white' : 'text-gray-300 hover:text-white'}`}
                >
                  3pc Royal Suit
                </button>
              </div>

              {/* 3D Canvas Container */}
              <div className="pt-5">
                <ThreeDCanvas 
                  product={heroModelProduct} 
                  height="490px" 
                  autoRotateDefault={true}
                  showControls={true}
                />
              </div>

              {/* Bottom Quick Look Bar */}
              <div className="mt-3 flex items-center justify-between bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>3D Physics Simulation Active</span>
                </div>
                <button 
                  onClick={() => onSelectProduct && onSelectProduct(featuredProduct)}
                  className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Inspect This Garment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
