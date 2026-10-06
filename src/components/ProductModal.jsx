import React, { useState } from 'react';
import { 
  X, Star, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, 
  Sparkles, Check, Ruler, Share2, MessageCircle, ExternalLink,
  Clock, AlertCircle, Info, ChevronRight, MapPin
} from 'lucide-react';
import ThreeDCanvas from './ThreeDCanvas';
import SizeChartModal from './SizeChartModal';
import { recordMarketplaceClick } from '../utils/storage';

export default function ProductModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onBuyNow, 
  isWishlisted, 
  onToggleWishlist 
}) {
  if (!isOpen || !product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[1] || product.sizes?.[0] || 'M');
  const [viewMode, setViewMode] = useState('photos'); // 'photos' or '3d'
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"];

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({
        valid: true,
        message: `Express Delivery Available to ${pincode}! Estimated delivery within 2-3 business days. Free COD available.`
      });
    } else {
      setPincodeStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      });
    }
  };

  const handleMarketplaceRedirect = (platform) => {
    recordMarketplaceClick(platform);
    const link = product.marketplaceLinks?.[platform] || `https://www.${platform}.com`;
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hello Sachika Clothing! I would like to order: "${product.name}" (Size: ${selectedSize}, Price: ₹${product.discountPrice}). Please assist me with payment and delivery details.`
    );
    window.open(`https://wa.me/919352173474?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this gorgeous ${product.name} on Sachika Clothing 3D Store!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        
        <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-amber-200/50 my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Quick Bar */}
          <div className="bg-gradient-to-r from-[#21092e] to-[#12041b] text-white px-5 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-amber-400 font-bold uppercase tracking-wider">{product.category}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300 truncate max-w-xs sm:max-w-md">{product.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition"
                title="Share Product"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 5 Cols: Visual Gallery / 3D Mannequin Studio */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Toggle Mode: Photos vs 3D Studio */}
              <div className="flex items-center justify-between bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('photos')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${viewMode === 'photos' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-black'}`}
                >
                  <span>Photo Gallery</span>
                  <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded-full">{images.length}</span>
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${viewMode === '3d' ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-sm' : 'text-gray-600 hover:text-black'}`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>3D Mannequin View</span>
                  <span className="bg-amber-300 text-black text-[9px] font-extrabold px-1.5 rounded">360°</span>
                </button>
              </div>

              {/* Display Area */}
              {viewMode === 'photos' ? (
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
                    <img 
                      src={images[selectedImage] || images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover object-top"
                    />

                    {/* Quick Badge */}
                    <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                      {product.discountPercent}% OFF
                    </div>

                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${selectedImage === idx ? 'border-rose-600 ring-2 ring-rose-300' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <ThreeDCanvas 
                    product={product} 
                    height="460px" 
                    interactive={true} 
                    autoRotateDefault={true}
                    showControls={true}
                  />
                  <p className="text-[11px] text-center text-gray-500">
                    💡 Click and drag to orbit 360°. Zoom in to inspect embroidery and fabric luster.
                  </p>
                </div>
              )}

              {/* Customer Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-gray-600">
                <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200">
                  <Truck className="w-4 h-4 text-amber-700 mx-auto mb-1" />
                  <span className="font-semibold block">Free Shipping</span>
                  <span className="text-[10px] text-gray-500">Across India</span>
                </div>
                <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                  <span className="font-semibold block">100% Original</span>
                  <span className="text-[10px] text-gray-500">Artisanal Fabric</span>
                </div>
                <div className="bg-rose-50/70 p-2 rounded-xl border border-rose-200">
                  <RotateCcw className="w-4 h-4 text-rose-700 mx-auto mb-1" />
                  <span className="font-semibold block">Easy Exchange</span>
                  <span className="text-[10px] text-gray-500">Defect/Damaged</span>
                </div>
              </div>

            </div>

            {/* Right 7 Cols: Product Details, Marketplaces & Purchase CTA */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Live Scarcity & Urgency Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-rose-900 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  <span>Only {product.stockCount || 5} pieces left in stock!</span>
                </div>
                <div className="text-gray-500 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dispatches in 24 hrs</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-gray-900 leading-snug">
                  {product.name}
                </h1>
                {product.tagline && (
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                    {product.tagline}
                  </p>
                )}
              </div>

              {/* Ratings & Reviews summary */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 text-amber-900 px-2 py-0.5 rounded-lg text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating || 4.8} / 5.0</span>
                </div>
                <span className="text-xs text-gray-500 underline font-medium">
                  Based on {product.reviewsCount || 230} verified buyer reviews
                </span>
              </div>

              {/* Pricing Block */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-gray-900">
                    ₹{product.discountPrice?.toLocaleString('en-IN')}
                  </span>
                  {product.price > product.discountPrice && (
                    <span className="text-base text-gray-400 line-through">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-sm font-extrabold text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    {product.discountPercent}% OFF
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Inclusive of all taxes. Free Express Shipping included on all orders above ₹999.
                </p>
              </div>

              {/* Size Selector + Size Chart Modal Trigger */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-800">Select Size:</span>
                  <button 
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-xs text-rose-700 hover:text-rose-800 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>View Size Chart & Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-11 px-3 rounded-xl font-bold text-xs transition border flex items-center justify-center ${selectedSize === size ? 'bg-rose-700 text-white border-rose-700 shadow-md ring-2 ring-rose-200' : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color & Fabric */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="text-gray-400 font-medium block">Color Shade:</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: product.colorHex || '#c03d5d' }} />
                    <span className="font-bold text-gray-800">{product.color}</span>
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                  <span className="text-gray-400 font-medium block">Fabric & Weave:</span>
                  <span className="font-bold text-gray-800 mt-1 block truncate">{product.fabric}</span>
                </div>
              </div>

              {/* MULTI-PLATFORM PURCHASE BUTTONS (Flipkart, Meesho, Ajio) */}
              <div className="bg-gradient-to-r from-blue-50/50 via-pink-50/50 to-slate-50/50 rounded-2xl p-4 border border-gray-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-rose-600" />
                    <span>Also Buy On Your Trusted Apps:</span>
                  </span>
                  <span className="text-[10px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                    Direct Marketplace Links
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Flipkart Button */}
                  <button
                    onClick={() => handleMarketplaceRedirect('flipkart')}
                    className="p-2.5 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-[#2874F0] rounded-xl text-center transition group shadow-sm flex flex-col items-center justify-center"
                  >
                    <div className="text-xs font-extrabold text-[#2874F0] flex items-center gap-1">
                      <span>Flipkart</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] text-gray-500 group-hover:text-blue-700">Assured Seller</span>
                  </button>

                  {/* Meesho Button */}
                  <button
                    onClick={() => handleMarketplaceRedirect('meesho')}
                    className="p-2.5 bg-white hover:bg-pink-50 border-2 border-pink-200 hover:border-[#F43397] rounded-xl text-center transition group shadow-sm flex flex-col items-center justify-center"
                  >
                    <div className="text-xs font-extrabold text-[#F43397] flex items-center gap-1">
                      <span>Meesho</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] text-gray-500 group-hover:text-pink-700">Lowest Price</span>
                  </button>

                  {/* Ajio Button */}
                  <button
                    onClick={() => handleMarketplaceRedirect('ajio')}
                    className="p-2.5 bg-white hover:bg-slate-100 border-2 border-slate-300 hover:border-[#2C4152] rounded-xl text-center transition group shadow-sm flex flex-col items-center justify-center"
                  >
                    <div className="text-xs font-extrabold text-[#2C4152] flex items-center gap-1">
                      <span>Ajio</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] text-gray-500 group-hover:text-slate-800">Luxe Selection</span>
                  </button>
                </div>
              </div>

              {/* Direct Website Primary CTAs (Add to Cart / Buy Now / WhatsApp) */}
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onAddToCart({ ...product, selectedSize });
                    }}
                    className="py-3.5 px-4 bg-white border-2 border-rose-700 text-rose-700 hover:bg-rose-50 font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={() => {
                      onBuyNow({ ...product, selectedSize, quantity });
                    }}
                    className="py-3.5 px-4 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white font-extrabold rounded-xl text-sm transition shadow-lg hover:shadow-rose-700/25 flex items-center justify-center gap-2"
                  >
                    <span>Instant Checkout (UPI/COD)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* WhatsApp Direct Order Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Directly via WhatsApp (Quick Styling Assistance)</span>
                </button>
              </div>

              {/* Pincode Check */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-700">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>Check Delivery Date & COD Availability:</span>
                </div>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit PIN code"
                    className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <div className={`mt-2 text-xs font-medium ${pincodeStatus.valid ? 'text-green-700' : 'text-rose-600'}`}>
                    {pincodeStatus.message}
                  </div>
                )}
              </div>

              {/* Product Specifications & Story Description */}
              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-gray-900 text-sm">Product Specifications:</h4>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs space-y-1.5">
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                        <span className="text-gray-500 font-medium">{key}</span>
                        <span className="text-gray-900 font-semibold text-right max-w-[60%]">{val}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-600">{product.description}</div>
                  )}
                </div>

                <div className="text-xs text-gray-600 leading-relaxed pt-1">
                  <span className="font-bold text-gray-800">Description: </span>
                  {product.description}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Embedded Size Chart Modal */}
      <SizeChartModal 
        isOpen={isSizeChartOpen} 
        onClose={() => setIsSizeChartOpen(false)} 
      />
    </>
  );
}
