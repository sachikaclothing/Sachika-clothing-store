import React, { useState } from 'react';
import { Eye, ShoppingBag, Heart, Star, Sparkles, ExternalLink, Zap } from 'lucide-react';
import { recordMarketplaceClick } from '../utils/storage';

export default function ProductCard({ 
  product, 
  onSelectProduct, 
  onAddToCart, 
  isWishlisted, 
  onToggleWishlist,
  onOpen3DModal 
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"];

  const handleMarketplaceRedirect = (e, platform) => {
    e.stopPropagation();
    recordMarketplaceClick(platform);
    const link = product.marketplaceLinks?.[platform] || `https://www.${platform}.com`;
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
    >
      
      {/* Image Gallery & Hover Effect */}
      <div 
        className="relative aspect-[3/4] bg-gray-100 overflow-hidden"
        onMouseEnter={() => images.length > 1 && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img 
          src={images[currentImageIndex] || images[0]} 
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.discountPercent && (
            <span className="bg-gradient-to-r from-rose-600 to-rose-700 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              BESTSELLER
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              NEW ARRIVAL
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white hover:text-rose-600'}`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* 3D Mannequin Quick Inspect Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen3DModal(product);
          }}
          className="absolute bottom-3 left-3 bg-black/75 hover:bg-black backdrop-blur-md text-amber-300 border border-amber-400/40 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>View in 3D</span>
        </button>

        {/* Image dots if multiple photos */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {images.slice(0, 3).map((_, idx) => (
              <span 
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white w-3' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Category & Color Pill */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-rose-700 uppercase tracking-wider text-[11px]">{product.category}</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: product.colorHex || '#c03d5d' }} />
              <span className="text-[11px] text-gray-600 truncate max-w-[80px]">{product.color}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif font-bold text-gray-900 text-base leading-snug line-clamp-1 group-hover:text-rose-700 transition">
            {product.name}
          </h3>

          {/* Fabric Line */}
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            Fabric: {product.fabric}
          </p>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-xs font-bold text-amber-800">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating || 4.8}</span>
            </div>
            <span className="text-[11px] text-gray-400">({product.reviewsCount || 120} reviews)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-extrabold text-gray-900">₹{product.discountPrice?.toLocaleString('en-IN')}</span>
            {product.price > product.discountPrice && (
              <span className="text-xs text-gray-400 line-through">₹{product.price?.toLocaleString('en-IN')}</span>
            )}
            <span className="text-xs font-bold text-green-700">Save ₹{(product.price - product.discountPrice)?.toLocaleString('en-IN')}</span>
          </div>

          {/* Sizes available preview */}
          <div className="flex items-center gap-1 mt-2 text-[11px] text-gray-600">
            <span className="font-medium text-gray-400">Sizes:</span>
            {product.sizes?.slice(0, 5).map(size => (
              <span key={size} className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-semibold text-[10px]">
                {size}
              </span>
            ))}
            {product.sizes?.length > 5 && <span className="text-[10px] text-gray-400">+{product.sizes.length - 5}</span>}
          </div>
        </div>

        {/* Marketplace Buy Options (Flipkart, Meesho, Ajio) */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          
          <div className="text-[11px] font-semibold text-gray-500 flex items-center justify-between">
            <span>Also Buy On:</span>
            <span className="text-green-600 text-[10px] font-bold">Fast Delivery</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {/* Flipkart */}
            <button
              onClick={(e) => handleMarketplaceRedirect(e, 'flipkart')}
              className="px-2 py-1 bg-blue-50 hover:bg-[#2874F0] text-[#2874F0] hover:text-white rounded-lg border border-blue-200 text-[11px] font-bold transition flex items-center justify-center gap-1 group/mkt"
              title="Buy this on Flipkart"
            >
              <span>Flipkart</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/mkt:opacity-100" />
            </button>

            {/* Meesho */}
            <button
              onClick={(e) => handleMarketplaceRedirect(e, 'meesho')}
              className="px-2 py-1 bg-pink-50 hover:bg-[#F43397] text-[#F43397] hover:text-white rounded-lg border border-pink-200 text-[11px] font-bold transition flex items-center justify-center gap-1 group/mkt"
              title="Buy this on Meesho"
            >
              <span>Meesho</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/mkt:opacity-100" />
            </button>

            {/* Ajio */}
            <button
              onClick={(e) => handleMarketplaceRedirect(e, 'ajio')}
              className="px-2 py-1 bg-slate-50 hover:bg-[#2C4152] text-[#2C4152] hover:text-white rounded-lg border border-slate-300 text-[11px] font-bold transition flex items-center justify-center gap-1 group/mkt"
              title="Buy this on Ajio"
            >
              <span>Ajio</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/mkt:opacity-100" />
            </button>
          </div>

          {/* Direct Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full mt-2 py-2.5 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag (Best Price)</span>
          </button>

        </div>

      </div>

    </div>
  );
}
