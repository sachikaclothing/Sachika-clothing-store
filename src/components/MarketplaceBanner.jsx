import React from 'react';
import { ExternalLink, ShieldCheck, Zap, Truck, RotateCcw, Award } from 'lucide-react';
import { recordMarketplaceClick } from '../utils/storage';

export default function MarketplaceBanner() {
  const handleMarketplaceClick = (platform, url) => {
    recordMarketplaceClick(platform);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border-y border-amber-200/60 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header Tag */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md uppercase tracking-wider animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            <span>Official Multi-Store Availability</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mt-2">
            Love Shopping On Your Favorite Apps?
          </h2>
          <p className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto mt-1">
            All our designer Kurtis & 3-Piece Suit collections are available directly here and can also be purchased on <span className="font-bold text-blue-600">Flipkart</span>, <span className="font-bold text-[#E91E63]">Meesho</span> & <span className="font-bold text-slate-800">Ajio</span>!
          </p>
        </div>

        {/* 3 Marketplace Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          
          {/* Flipkart Card */}
          <div 
            onClick={() => handleMarketplaceClick('flipkart', 'https://www.flipkart.com')}
            className="group cursor-pointer bg-white rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-[#2874F0] text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
              ASSURED SELLER
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-xl text-[#2874F0] shadow-inner group-hover:scale-110 transition">
                F
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-gray-900 text-base">Flipkart</h3>
                  <span className="text-[11px] bg-green-100 text-green-700 font-bold px-1.5 py-0.2 rounded">4.8 ★</span>
                </div>
                <p className="text-xs text-gray-500">Flipkart Assured • Express Free Delivery</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
              <span>View On Flipkart</span>
              <span className="text-[11px] text-gray-500">COD Available</span>
            </div>
          </div>

          {/* Meesho Card */}
          <div 
            onClick={() => handleMarketplaceClick('meesho', 'https://www.meesho.com')}
            className="group cursor-pointer bg-white rounded-xl p-4 border border-pink-200 shadow-sm hover:shadow-lg hover:border-pink-400 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-[#F43397] text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
              TOP SUPPLIER
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center font-black text-xl text-[#F43397] shadow-inner group-hover:scale-110 transition">
                M
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-gray-900 text-base">Meesho</h3>
                  <span className="text-[11px] bg-pink-100 text-[#F43397] font-bold px-1.5 py-0.2 rounded">Lowest Price</span>
                </div>
                <p className="text-xs text-gray-500">Direct Factory Price • Free Shipping</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-600 transition" />
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#F43397] font-semibold">
              <span>View On Meesho</span>
              <span className="text-[11px] text-gray-500">7-Day Return</span>
            </div>
          </div>

          {/* Ajio Card */}
          <div 
            onClick={() => handleMarketplaceClick('ajio', 'https://www.ajio.com')}
            className="group cursor-pointer bg-white rounded-xl p-4 border border-slate-300 shadow-sm hover:shadow-lg hover:border-slate-500 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-[#2C4152] text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
              LUXE PARTNER
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xl text-[#2C4152] shadow-inner group-hover:scale-110 transition">
                A
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-gray-900 text-base">Ajio</h3>
                  <span className="text-[11px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded">Designer</span>
                </div>
                <p className="text-xs text-gray-500">100% Handpicked Artisanal Quality</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-slate-800 transition" />
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-slate-800 font-semibold">
              <span>View On Ajio</span>
              <span className="text-[11px] text-gray-500">Trendiest Styles</span>
            </div>
          </div>

        </div>

        {/* Why Buy Direct Note */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-3 pt-3 text-xs text-gray-600 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Genuine Handcrafted Fabrics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>Free Shipping Across 28,000+ Pincodes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-blue-600" />
            <span>Easy 7-Day Exchange & Returns</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-rose-600" />
            <span>Direct Website Perk: Extra 10% OFF with code <b>SACHIKA10</b></span>
          </div>
        </div>

      </div>
    </div>
  );
}
