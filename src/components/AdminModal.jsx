import React, { useState } from 'react';
import { 
  X, Plus, Package, ShoppingCart, DollarSign, Tag, CheckSquare, 
  TrendingUp, BarChart2, Trash2, Edit2, Upload, ExternalLink, 
  AlertTriangle, Check, RefreshCw, Layers, Sparkles, Image, 
  ShieldAlert, Globe, MessageCircle, FileCode, Users, Download
} from 'lucide-react';
import { 
  addProduct, updateProduct, deleteProduct, getOrders, 
  updateOrderStatus, getCoupons, saveCoupons, getReferrals, resetReferrals,
  getLaunchChecklist, saveLaunchChecklist 
} from '../utils/storage';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  products, 
  onProductsUpdated 
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'catalog' | 'inventory' | 'orders' | 'profit' | 'analytics' | 'seo' | 'abandoned' | 'checklist'

  // New Product Form State
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    category: 'Short Kurti',
    price: 1999,
    discountPrice: 899,
    costPrice: 0, // Wholesale manufacturing cost (set by store owner)
    stockCount: 15,
    supplierName: '',
    color: 'Crimson Rose',
    colorHex: '#c03d5d',
    fabric: 'Pure Cambric 60x60 Cotton',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Artisanal handwoven craftsmanship tailored for everyday grace and festive vibrancy.',
    specifications: {
      'Pattern': 'Handblock Floral Print',
      'Sleeve Length': 'Three-Quarter Sleeves',
      'Neck Type': 'Mandarin Collar with V-Notch',
      'Length': 'Hip Length (29 Inches)',
      'Occasion': 'Daily Chic & Festive Celebrations',
      'Wash Care': 'Cold Handwash with Mild Detergent'
    },
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'
    ],
    marketplaceLinks: {
      flipkart: 'https://www.flipkart.com',
      meesho: 'https://www.meesho.com',
      ajio: 'https://www.ajio.com'
    },
    model3DConfig: {
      type: 'short_kurti',
      primaryColor: '#c03d5d',
      secondaryColor: '#d4af37',
      hasDupatta: false
    },
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [orders, setOrders] = useState(getOrders());
  const [coupons, setCoupons] = useState(getCoupons());
  const [referrals, setReferrals] = useState(getReferrals());
  const [checklist, setChecklist] = useState(getLaunchChecklist());
  const [toastMessage, setToastMessage] = useState('');

  // Abandoned Carts for WhatsApp Recovery (real shoppers who leave cart)
  const [abandonedCarts, setAbandonedCarts] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Image File Upload Handler (converts to Base64)
  const handleImageFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [reader.result, ...prev.images]
        }));
        showToast('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()]
      }));
      setImageUrlInput('');
      showToast('Image URL added!');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Product Name is required.');
      return;
    }

    const discountPercent = Math.round(((formData.price - formData.discountPrice) / formData.price) * 100);

    const productPayload = {
      ...formData,
      id: editingProductId || `prod-user-${Date.now()}`,
      discountPercent,
      inStock: formData.stockCount > 0,
      rating: 4.9,
      reviewsCount: 18,
      model3DConfig: {
        type: formData.category === 'Short Kurti' 
          ? 'short_kurti' 
          : formData.category === 'Long Kurti' 
            ? 'long_anarkali' 
            : 'suit_3pc',
        primaryColor: formData.colorHex,
        secondaryColor: '#d4af37',
        hasDupatta: formData.category === '3pc Suit'
      }
    };

    let updatedList;
    if (editingProductId) {
      updatedList = updateProduct(productPayload);
      showToast('Product updated successfully!');
      setEditingProductId(null);
    } else {
      updatedList = addProduct(productPayload);
      showToast('New Product published to live website!');
    }

    onProductsUpdated(updatedList);
    // Reset Form
    setFormData({
      name: '',
      tagline: '',
      category: 'Short Kurti',
      price: 1999,
      discountPrice: 899,
      costPrice: 0,
      stockCount: 15,
      supplierName: '',
      color: 'Crimson Rose',
      colorHex: '#c03d5d',
      fabric: 'Pure Cambric 60x60 Cotton',
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Handcrafted with traditional needlework and pure breathable fibers.',
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'],
      marketplaceLinks: { flipkart: 'https://www.flipkart.com', meesho: 'https://www.meesho.com', ajio: 'https://www.ajio.com' },
      model3DConfig: { type: 'short_kurti', primaryColor: '#c03d5d', secondaryColor: '#d4af37', hasDupatta: false },
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true
    });
    setActiveTab('catalog');
  };

  const handleEditProduct = (prod) => {
    setFormData(prod);
    setEditingProductId(prod.id);
    setActiveTab('upload');
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updated = deleteProduct(id);
      onProductsUpdated(updated);
      showToast('Product deleted.');
    }
  };

  const handleStockChange = (prod, delta) => {
    const updated = updateProduct({
      ...prod,
      stockCount: Math.max(0, prod.stockCount + delta),
      inStock: (prod.stockCount + delta) > 0
    });
    onProductsUpdated(updated);
  };

  const handleOrderStatusChange = (orderId, newStatus, cancelReason = 'Out of Stock') => {
    const updated = updateOrderStatus(orderId, newStatus, cancelReason);
    setOrders(updated);
    if (newStatus === 'Cancelled') {
      showToast(`Order #${orderId} marked as Cancelled (Out of Stock).`);
    } else {
      showToast(`Order marked as ${newStatus}`);
    }
  };

  const handleChecklistToggle = (key) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    saveLaunchChecklist(updated);
  };

  const handleSendRecoveryWhatsApp = (cartItem) => {
    const msg = encodeURIComponent(
      `Hello ${cartItem.customerName}! 👑 We noticed you left "${cartItem.items}" in your Sachika Clothing shopping bag. Complete your purchase in the next 1 hour with code "ROYAL15" for an extra 15% OFF! Link: https://sachikaclothing.com`
    );
    window.open(`https://wa.me/91${cartItem.phone}?text=${msg}`, '_blank');
    setAbandonedCarts(prev => prev.map(c => c.id === cartItem.id ? { ...c, status: 'WhatsApp Sent' } : c));
  };

  const generateSitemapXml = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sachikaclothing.com/</loc>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>https://sachikaclothing.com/category/short-kurti</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sachikaclothing.com/category/long-kurti</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sachikaclothing.com/category/3pc-suit</loc>
    <priority>0.9</priority>
  </url>
${products.map(p => `  <url>
    <loc>https://sachikaclothing.com/product/${p.id}</loc>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    showToast('sitemap.xml downloaded!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-amber-300 my-auto flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#21092e] to-[#14051d] text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-amber-100">Sachika Boutique Admin & Upload Studio</h3>
                <span className="text-[10px] bg-emerald-600/90 text-white font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse"></span>
                  PRIVATE LOCAL DEV
                </span>
              </div>
              <p className="text-xs text-gray-300">Manage 3D garments, stock, Flipkart/Meesho/Ajio redirects & orders</p>
              <p className="text-[11px] text-amber-300/90 font-medium mt-0.5">
                🔒 Private Localhost Mode • Running locally on your computer at <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">localhost:5173</code> (NOT published or visible to the public internet)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center transition animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 flex gap-1 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'upload' ? 'border-rose-600 text-rose-700 bg-white' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingProductId ? 'Edit Product' : 'Upload New Product'}</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'catalog' ? 'border-rose-600 text-rose-700 bg-white' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'inventory' ? 'border-rose-600 text-rose-700 bg-white' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            <Layers className="w-4 h-4" />
            <span>Inventory & Stock</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'orders' ? 'border-rose-600 text-rose-700 bg-white' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profit')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'profit' ? 'border-rose-600 text-rose-700 bg-white' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Suppliers & Profit Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('abandoned')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'abandoned' ? 'border-rose-600 text-rose-700 bg-white' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Abandoned Carts ({abandonedCarts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'analytics' ? 'border-rose-600 text-rose-700 bg-white' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Marketplace & Sales</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'seo' ? 'border-rose-600 text-rose-700 bg-white' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>SEO & Sitemap</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'checklist' ? 'border-rose-600 text-rose-700 bg-white' : 'border-transparent text-gray-600 hover:text-black'}`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>Launch Checklist</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: UPLOAD / EDIT PRODUCT */}
          {activeTab === 'upload' && (
            <form onSubmit={handleSaveProduct} className="space-y-6 max-w-4xl mx-auto">
              
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold block">Instant Live Publishing + Marketplace Integration:</span>
                  Fill the details below. You can directly upload photo files from your computer or enter image URLs, set Flipkart/Meesho/Ajio redirect links, and your product will immediately reflect in the store and interactive 3D studio!
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Gulmohar Handblock Short Kurti"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tagline / Key Highlight</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Pure Cambric Cotton with Gotta Patti Detailing"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Category, Prices & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold"
                  >
                    <option value="Short Kurti">Short Kurti</option>
                    <option value="Long Kurti">Long Kurti</option>
                    <option value="3pc Suit">3pc Suit</option>
                    <option value="New Arrivals">New Arrivals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Discount Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl font-bold text-rose-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Manufacturing Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.costPrice || ''}
                    placeholder="e.g. 350"
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl text-emerald-800 font-bold"
                  />
                </div>
              </div>

              {/* Stock and Supplier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Available Stock (Units) *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Supplier / Weaver Partner (Optional)</label>
                  <input
                    type="text"
                    value={formData.supplierName}
                    placeholder="e.g. Self Manufactured / Surat Weavers"
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              {/* MARKETPLACE LINKS (FLIPKART, MEESHO, AJIO) */}
              <div className="bg-gradient-to-r from-blue-50/70 via-pink-50/70 to-slate-100/70 p-4 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                    <span>External Marketplace Redirect Links:</span>
                  </h4>
                  <span className="text-[10px] text-gray-500 font-semibold">Customers will be redirected on click</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Flipkart link */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#2874F0] mb-1">Flipkart Product URL</label>
                    <input
                      type="url"
                      value={formData.marketplaceLinks.flipkart}
                      onChange={(e) => setFormData({
                        ...formData,
                        marketplaceLinks: { ...formData.marketplaceLinks, flipkart: e.target.value }
                      })}
                      placeholder="https://www.flipkart.com/..."
                      className="w-full px-3 py-2 text-xs bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Meesho link */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#F43397] mb-1">Meesho Product URL</label>
                    <input
                      type="url"
                      value={formData.marketplaceLinks.meesho}
                      onChange={(e) => setFormData({
                        ...formData,
                        marketplaceLinks: { ...formData.marketplaceLinks, meesho: e.target.value }
                      })}
                      placeholder="https://www.meesho.com/..."
                      className="w-full px-3 py-2 text-xs bg-white border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {/* Ajio link */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#2C4152] mb-1">Ajio Product URL</label>
                    <input
                      type="url"
                      value={formData.marketplaceLinks.ajio}
                      onChange={(e) => setFormData({
                        ...formData,
                        marketplaceLinks: { ...formData.marketplaceLinks, ajio: e.target.value }
                      })}
                      placeholder="https://www.ajio.com/..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes Available */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Available Sizes:</label>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSizeToggle(sz)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${formData.sizes.includes(sz) ? 'bg-rose-700 text-white border-rose-700' : 'bg-gray-50 border-gray-300 text-gray-700'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color & Fabric */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Color Name</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g. Royal Maroon"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Color Shade / Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.colorHex}
                      onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                      className="w-10 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.colorHex}
                      onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Fabric & Weave</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. Chanderi Silk with Zari"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Image Upload System */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <label className="block text-xs font-bold text-gray-700">Product Photos (Multiple Angles):</label>
                
                {/* Upload from device */}
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="cursor-pointer px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
                    <Upload className="w-4 h-4" />
                    <span>Upload From Computer / Phone</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-400">or add image URL below:</span>
                </div>

                {/* Add URL */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Paste image URL (e.g. https://...)"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl"
                  >
                    Add URL
                  </button>
                </div>

                {/* Preview thumbnails */}
                <div className="flex gap-2 overflow-x-auto pt-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-20 rounded-xl border border-gray-300 overflow-hidden shrink-0 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-gradient-to-r from-rose-700 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold rounded-xl text-sm shadow-xl transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{editingProductId ? 'Save Product Updates' : 'Publish Product to Live Website'}</span>
                </button>

                {editingProductId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(null);
                      setActiveTab('catalog');
                    }}
                    className="px-6 py-3.5 bg-gray-200 text-gray-800 font-bold rounded-xl text-xs hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </form>
          )}

          {/* TAB 2: PRODUCT CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-800">All Live Store Products ({products.length}):</h4>
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setActiveTab('upload');
                  }}
                  className="px-3 py-1.5 bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex gap-3">
                    <img 
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'} 
                      alt={prod.name}
                      className="w-16 h-20 object-cover rounded-xl border border-gray-300 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-rose-700 uppercase">{prod.category}</div>
                        <h5 className="text-xs font-bold text-gray-900 line-clamp-1">{prod.name}</h5>
                        <div className="text-xs font-extrabold text-gray-800 mt-0.5">
                          ₹{prod.discountPrice?.toLocaleString('en-IN')}{' '}
                          <span className="text-[11px] text-gray-400 font-normal line-through">₹{prod.price}</span>
                        </div>
                        <div className="text-[11px] text-gray-500">Stock: {prod.stockCount} units</div>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditProduct(prod)}
                          className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3 text-blue-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="px-2 py-1 bg-white hover:bg-red-50 border border-gray-300 text-red-600 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-800">Inventory & Stock Tracking:</h4>
              
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Current Stock</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-3 font-semibold text-gray-900">{p.name}</td>
                        <td className="p-3 text-gray-600">{p.category}</td>
                        <td className="p-3 font-mono font-bold text-gray-900">{p.stockCount} units</td>
                        <td className="p-3">
                          {p.stockCount <= 0 ? (
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold text-[10px]">Out of Stock</span>
                          ) : p.stockCount < 10 ? (
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px]">Low Stock</span>
                          ) : (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold text-[10px]">Healthy</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStockChange(p, -1)}
                              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-bold text-xs"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleStockChange(p, 5)}
                              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-bold text-xs"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleStockChange(p, 20)}
                              className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold text-xs"
                            >
                              +20 Restock
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-800">Customer Orders Received ({orders.length}):</h4>
                <span className="text-xs text-gray-500">Real-time orders placed via store checkout</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center p-8 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-xs">
                  No orders placed yet. Add items to bag and complete checkout to test order flow!
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200">
                        <div>
                          <span className="font-mono font-bold text-gray-900 text-sm">{o.id}</span>
                          <span className="text-gray-400 ml-2">({o.date} at {o.time})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                            {o.paymentMethod}
                          </span>
                          <select
                            value={o.status}
                            onChange={(e) => handleOrderStatusChange(o.id, e.target.value, 'Out of Stock')}
                            className={`text-xs border rounded-lg px-2 py-1 font-bold ${o.status === 'Cancelled' ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-white border-gray-300 text-gray-800'}`}
                          >
                            <option value="Order Confirmed">Order Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled (Out of Stock)</option>
                          </select>
                        </div>
                      </div>

                      {/* Out of Stock Notice Banner & Customer Alert Button */}
                      {o.status === 'Cancelled' && (
                        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                          <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                            <span>Cancelled Reason: <span className="bg-rose-200/80 px-2 py-0.5 rounded text-rose-900 font-extrabold">{o.cancelReason || 'Out of Stock'}</span></span>
                          </div>
                          <button
                            onClick={() => {
                              const msg = encodeURIComponent(
                                `Hello ${o.shippingInfo?.name || 'Customer'},\n\nRegarding your Sachika Clothing Order #${o.id}:\n\nUnfortunately, the requested item is currently Out of Stock in our workshop. Your order has been cancelled.\n\nIf you paid online, your full refund is being processed. Please let us know if you need assistance choosing an alternative ensemble!\n\nThank you,\nSachika Clothing (+91 93521 73474)`
                              );
                              window.open(`https://wa.me/91${o.shippingInfo?.phone}?text=${msg}`, '_blank');
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm transition"
                            title="Send Out of Stock WhatsApp notification to customer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Notify Customer (Out of Stock Notice)</span>
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-600">
                        <div>
                          <span className="font-bold text-gray-800 block">Customer:</span>
                          <span>{o.shippingInfo?.name} ({o.shippingInfo?.phone})</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 block">Address:</span>
                          <span className="truncate block">{o.shippingInfo?.address}, {o.shippingInfo?.city} - {o.shippingInfo?.pincode}</span>
                        </div>
                        <div className="text-right sm:text-right">
                          <span className="font-bold text-gray-800 block">Total Amount:</span>
                          <span className="font-extrabold text-sm text-rose-700">₹{o.total?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="pt-1 text-[11px] text-gray-500">
                        Items: {o.items?.map(it => `${it.name} (Size: ${it.selectedSize || 'M'}, Qty: ${it.quantity})`).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SUPPLIER & PROFIT TRACKING */}
          {activeTab === 'profit' && (() => {
            const productsWithCost = products.filter(p => p.costPrice && p.costPrice > 0);
            const avgMargin = productsWithCost.length > 0
              ? Math.round(productsWithCost.reduce((sum, p) => sum + ((p.discountPrice - p.costPrice) / p.discountPrice) * 100, 0) / productsWithCost.length)
              : null;

            return (
              <div className="space-y-6">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">COGS & Margin Tracking</h4>
                    <p className="text-xs text-emerald-800">
                      Track manufacturer wholesale cost, selling price and gross profit margin. You can enter manufacturing costs when uploading or editing each product.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Average Profit Margin</span>
                    <div className="text-xl font-black text-emerald-700">
                      {avgMargin !== null ? `${avgMargin}%` : '— (No costs set yet)'}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Supplier / Artisan</th>
                        <th className="p-3">Cost Price (COGS)</th>
                        <th className="p-3">Selling Price</th>
                        <th className="p-3">Profit Per Unit</th>
                        <th className="p-3">Gross Margin %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((p) => {
                        const hasCost = p.costPrice && p.costPrice > 0;
                        const cost = hasCost ? p.costPrice : null;
                        const profit = hasCost ? p.discountPrice - cost : null;
                        const margin = hasCost ? Math.round((profit / p.discountPrice) * 100) : null;
                        return (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">{p.name}</td>
                            <td className="p-3 text-gray-600">{p.supplierName ? p.supplierName : <span className="italic text-gray-400">— Not set</span>}</td>
                            <td className="p-3 font-mono text-gray-700">{hasCost ? `₹${cost}` : <span className="text-gray-400 italic text-[11px]">— Not entered</span>}</td>
                            <td className="p-3 font-mono font-bold text-gray-900">₹{p.discountPrice}</td>
                            <td className="p-3 font-mono font-bold text-emerald-700">{hasCost ? `+₹${profit}` : <span className="text-gray-400">—</span>}</td>
                            <td className="p-3 font-bold text-emerald-800">{hasCost ? `${margin}%` : <span className="text-gray-400">—</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* TAB 6: ABANDONED CARTS RECOVERY */}
          {activeTab === 'abandoned' && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">Abandoned Cart WhatsApp Recovery</h4>
                  <p className="text-xs text-amber-800">
                    Recover shoppers by sending 1-click personalized WhatsApp messages with discount coupon <b>ROYAL15</b> when shoppers leave items in their cart.
                  </p>
                </div>
              </div>

              {abandonedCarts.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 space-y-2">
                  <MessageCircle className="w-8 h-8 text-gray-400 mx-auto" />
                  <h5 className="font-bold text-gray-700 text-sm">No Abandoned Carts Right Now</h5>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    When shoppers add items to their bag on your website and navigate away before checkout, their cart items and mobile numbers will appear here automatically for 1-click WhatsApp follow-up.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {abandonedCarts.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{item.customerName}</div>
                        <div className="text-gray-500 mt-0.5">Mobile: +91 {item.phone} • Left {item.abandonedTime}</div>
                        <div className="text-rose-700 font-semibold mt-1">Item: {item.items}</div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-gray-400 block text-[11px]">Cart Total:</span>
                          <span className="font-bold text-base text-gray-900">₹{item.cartValue.toLocaleString('en-IN')}</span>
                        </div>

                        <button
                          onClick={() => handleSendRecoveryWhatsApp(item)}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition ${item.status === 'WhatsApp Sent' ? 'bg-gray-300 text-gray-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{item.status === 'WhatsApp Sent' ? 'Message Sent' : 'Send WhatsApp Recovery'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: ANALYTICS & MARKETPLACE REFERRAL TRACKER */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Marketplace Outbound Referrals & Revenue</h4>
                  <p className="text-xs text-gray-500">Live click counts when visitors on your store click the "Buy on Flipkart", "Buy on Meesho", or "Buy on Ajio" buttons.</p>
                </div>
                <button
                  onClick={() => {
                    const clean = resetReferrals();
                    setReferrals(clean);
                    showToast('Referral click counters reset to 0');
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                  <span>Reset All Clicks to 0</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                  <div className="text-xs font-bold text-blue-800">Flipkart Referrals</div>
                  <div className="text-2xl font-black text-[#2874F0] mt-1">{referrals.flipkart || 0}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Outbound redirect clicks</div>
                </div>

                <div className="bg-pink-50 p-4 rounded-2xl border border-pink-200">
                  <div className="text-xs font-bold text-pink-800">Meesho Referrals</div>
                  <div className="text-2xl font-black text-[#F43397] mt-1">{referrals.meesho || 0}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Outbound redirect clicks</div>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-300">
                  <div className="text-xs font-bold text-slate-800">Ajio Referrals</div>
                  <div className="text-2xl font-black text-[#2C4152] mt-1">{referrals.ajio || 0}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Outbound redirect clicks</div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-800">Direct Store Revenue</div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">
                    ₹{orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">{orders.length} direct orders</div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-xs space-y-2">
                <h5 className="font-bold text-gray-900 text-sm">How Marketplace Tracking Works:</h5>
                <p className="text-gray-600 leading-relaxed">
                  Every time a visitor on your website clicks <b>"Buy on Flipkart"</b>, <b>"Buy on Meesho"</b>, or <b>"Buy on Ajio"</b> on any product, this counter automatically tracks that click. Counters start at 0 and track your actual website visitor interactions.
                </p>
              </div>

            </div>
          )}

          {/* TAB 8: SEO & SITEMAP */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-2xl border border-blue-200">
                <div>
                  <h4 className="font-bold text-blue-950 text-sm">Search Engine Optimization (SEO) & Google Indexing</h4>
                  <p className="text-xs text-blue-800">Meta tags, OpenGraph previews and sitemap.xml generator for Google Search Console.</p>
                </div>
                <button
                  onClick={generateSitemapXml}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download sitemap.xml</span>
                </button>
              </div>

              {/* Google SERP Preview Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
                <div className="text-xs font-bold text-gray-400 uppercase">Google Search Result Preview:</div>
                <div className="text-blue-800 hover:underline cursor-pointer text-base font-semibold">
                  Sachika Clothing — Luxury 3D Ethnic Kurtis & 3pc Suits | Also on Flipkart & Meesho
                </div>
                <div className="text-xs text-emerald-700">https://sachikaclothing.com › collections › ethnic-wear</div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Shop handcrafted Short Kurtis, Anarkalis & 3pc Silk Suit Ensembles with 360° interactive 3D mannequin preview. Enjoy Free Shipping, COD, and direct purchase options on Flipkart, Meesho & Ajio.
                </p>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold pt-1">
                  <span>★★★★★</span>
                  <span>Rating: 4.9 • 3,800+ reviews • In stock • Price from ₹799</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 9: PRE-LAUNCH 14-POINT CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                  <span>Launch Readiness Audit (13. Before Launch Checklist):</span>
                </div>
                <span className="font-bold text-emerald-700">
                  {Object.values(checklist).filter(Boolean).length} / {Object.keys(checklist).length} Completed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { key: 'testEveryProduct', title: 'Test every product & 3D view' },
                  { key: 'testAddToCart', title: 'Test Add to Cart functionality' },
                  { key: 'testCheckout', title: 'Test checkout flow' },
                  { key: 'testUpiCardPayment', title: 'Test UPI & Card simulation' },
                  { key: 'testCod', title: 'Test Cash on Delivery option' },
                  { key: 'testOrderConfirmation', title: 'Test order confirmation & confetti' },
                  { key: 'testEmailSms', title: 'Test tracking SMS / WhatsApp' },
                  { key: 'testMobileWebsite', title: 'Test mobile responsive navigation' },
                  { key: 'testDesktopWebsite', title: 'Test desktop wide layout' },
                  { key: 'testContactWhatsapp', title: 'Test floating WhatsApp button' },
                  { key: 'checkPolicies', title: 'Check all policies (Privacy, Return, etc.)' },
                  { key: 'checkSpellingPrices', title: 'Check spelling, discounts & prices' },
                  { key: 'placeTestOrder', title: 'Place one live test order' }
                ].map(item => (
                  <div 
                    key={item.key}
                    onClick={() => handleChecklistToggle(item.key)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${checklist[item.key] ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                  >
                    <span>{item.title}</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${checklist[item.key] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-400 bg-white'}`}>
                      {checklist[item.key] && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
