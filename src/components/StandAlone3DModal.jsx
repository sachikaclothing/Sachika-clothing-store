import React from 'react';
import { X, Sparkles, ShoppingBag, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import ThreeDCanvas from './ThreeDCanvas';
import { recordMarketplaceClick } from '../utils/storage';

export default function StandAlone3DModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onBuyNow 
}) {
  if (!isOpen || !product) return null;

  const handleMarketplaceRedirect = (platform) => {
    recordMarketplaceClick(platform);
    const link = product.marketplaceLinks?.[platform] || `https://www.${platform}.com`;
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#150720] text-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-amber-400/40 my-auto flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="p-4 bg-black/50 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-amber-100">{product.name}</h3>
              <p className="text-[11px] text-gray-400">Interactive 360° 3D Mannequin & Fabric Physics Studio</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas Area */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col items-center">
          <ThreeDCanvas 
            product={product} 
            height="460px" 
            interactive={true} 
            autoRotateDefault={true}
            showControls={true}
          />

          {/* Product Summary & Action Strip */}
          <div className="w-full mt-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-amber-300">₹{product.discountPrice?.toLocaleString('en-IN')}</span>
                <span className="text-xs text-gray-400 line-through">₹{product.price?.toLocaleString('en-IN')}</span>
                <span className="text-xs font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full">
                  {product.discountPercent}% OFF
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Fabric: {product.fabric} • {product.color}</p>
            </div>

            {/* Direct Marketplace Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMarketplaceRedirect('flipkart')}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow"
              >
                <span>Flipkart</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleMarketplaceRedirect('meesho')}
                className="px-3 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow"
              >
                <span>Meesho</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleMarketplaceRedirect('ajio')}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow"
              >
                <span>Ajio</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
