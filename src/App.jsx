import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MarketplaceBanner from './components/MarketplaceBanner';
import Hero3D from './components/Hero3D';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import StandAlone3DModal from './components/StandAlone3DModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminModal from './components/AdminModal';
import PolicyModal from './components/PolicyModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import MyOrdersModal from './components/MyOrdersModal';
import AbandonedCartPopup from './components/AbandonedCartPopup';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ReviewsAndSocial from './components/ReviewsAndSocial';
import Footer from './components/Footer';

import { 
  getProducts, getCart, saveCart, getWishlist, 
  toggleWishlist, saveOrder, getOrders,
  getUnreadOrdersCount, markOrdersAsSeen
} from './utils/storage';

import { 
  Sparkles, Filter, ChevronRight, ShoppingBag, 
  Flame, Heart, Tag, ArrowRight, Check, Star 
} from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'Short Kurti' | 'Long Kurti' | '3pc Suit' | 'New Arrivals' | 'wishlist'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modal3DProduct, setModal3DProduct] = useState(null);
  
  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [unreadOrdersCount, setUnreadOrdersCount] = useState(0);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [activePolicy, setActivePolicy] = useState(null); // 'return', 'shipping', 'refund', etc.
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isAbandonedPopupOpen, setIsAbandonedPopupOpen] = useState(false);

  // Toast alert
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Open My Orders and clear notification badge
  const handleOpenMyOrders = () => {
    markOrdersAsSeen();
    setUnreadOrdersCount(0);
    setIsMyOrdersOpen(true);
  };

  // Load initial state
  useEffect(() => {
    setProducts(getProducts());
    setCart(getCart());
    setWishlist(getWishlist());
    setUnreadOrdersCount(getUnreadOrdersCount());
  }, []);

  // Sync cart changes to storage
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // Handle Cart Operations
  const handleAddToCart = (product, size = null) => {
    const itemSize = size || product.selectedSize || product.sizes?.[0] || 'M';
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.id === product.id && item.selectedSize === itemSize
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { ...product, selectedSize: itemSize, quantity: 1 }];
      }
    });

    triggerToast(`Added "${product.name}" (${itemSize}) to your Bag!`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId, selectedSize, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(productId, selectedSize);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        (item.id === productId && item.selectedSize === selectedSize)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId, selectedSize) => {
    setCart(prevCart => 
      prevCart.filter(item => !(item.id === productId && item.selectedSize === selectedSize))
    );
  };

  // Direct Buy Now
  const handleBuyNow = (productData) => {
    const itemSize = productData.selectedSize || productData.sizes?.[0] || 'M';
    const subtotal = productData.discountPrice * (productData.quantity || 1);
    const shippingCharge = subtotal >= 999 ? 0 : 99;
    
    setCheckoutData({
      cart: [{ ...productData, selectedSize: itemSize, quantity: productData.quantity || 1 }],
      subtotal,
      discountAmount: 0,
      shippingCharge,
      finalTotal: subtotal + shippingCharge,
      appliedCoupon: null
    });

    if (selectedProduct) {
      setSelectedProduct(null);
    }
    setIsCheckoutOpen(true);
  };

  // Proceed to Checkout from Cart
  const handleProceedToCheckout = (data) => {
    setCheckoutData(data);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId) => {
    const updated = toggleWishlist(productId);
    setWishlist(updated);
    if (updated.includes(productId)) {
      triggerToast('Saved to your Wishlist ❤️');
    } else {
      triggerToast('Removed from Wishlist');
    }
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category match
      let matchCategory = true;
      if (selectedCategory === 'all') {
        matchCategory = true;
      } else if (selectedCategory === 'wishlist') {
        matchCategory = wishlist.includes(p.id);
      } else if (selectedCategory === 'New Arrivals') {
        matchCategory = p.category === 'New Arrivals' || p.isNewArrival;
      } else {
        matchCategory = p.category === selectedCategory;
      }

      // Search match
      let matchSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        matchSearch = p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.fabric?.toLowerCase().includes(query) ||
          p.color?.toLowerCase().includes(query);
      }

      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery, wishlist]);

  // Featured and Bestseller subsets for Homepage
  const featuredProducts = useMemo(() => {
    return products.filter(p => p.isFeatured || p.isBestSeller).slice(0, 4);
  }, [products]);

  const newArrivals = useMemo(() => {
    return products.filter(p => p.isNewArrival || p.category === 'New Arrivals').slice(0, 4);
  }, [products]);

  // Total cart items count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col relative selection:bg-rose-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 border border-amber-400/40 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <Header 
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        ordersCount={unreadOrdersCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMyOrders={handleOpenMyOrders}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
        onOpenTrackOrder={() => {
          setTrackOrderId('');
          setIsTrackOrderOpen(true);
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (cat !== 'all') {
            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Homepage Main Body */}
      <main className="flex-1">
        
        {/* 1. Interactive 3D Hero Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <>
            <Hero3D 
              onShopNow={() => {
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAdmin={() => setIsAdminOpen(true)}
              featuredProduct={products[0]}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />

            {/* 2. Front Page Marketplace Announcement Banner (Flipkart, Meesho, Ajio) */}
            <MarketplaceBanner />
          </>
        )}

        {/* 3. Catalog & Collections Section */}
        <section id="catalog-section" className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          
          {/* Section Header & Category Pills */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Handcrafted Royal Ensembles</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-gray-900 mt-1">
                {selectedCategory === 'all' && 'Our 3D Couture Collections'}
                {selectedCategory === 'Short Kurti' && 'Short Kurti Collection (Hip Length)'}
                {selectedCategory === 'Long Kurti' && 'Long Kurti & Anarkali Flared Sets'}
                {selectedCategory === '3pc Suit' && '3-Piece Royal Suit Ensembles'}
                {selectedCategory === 'New Arrivals' && 'Festive New Arrivals Drop'}
                {selectedCategory === 'wishlist' && 'Your Saved Wishlist Pieces'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Every piece can be previewed in 360° 3D or purchased directly on Flipkart, Meesho & Ajio.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'Short Kurti', label: 'Short Kurti' },
                { id: 'Long Kurti', label: 'Long Kurti' },
                { id: '3pc Suit', label: '3pc Suit' },
                { id: 'New Arrivals', label: 'New Arrivals' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap ${selectedCategory === cat.id ? 'bg-rose-700 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
              <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-gray-800">No Matching Designs Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                We couldn't find items matching "{searchQuery}". Try selecting another category or clear search.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2 bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p)}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onOpen3DModal={(p) => setModal3DProduct(p)}
                />
              ))}
            </div>
          )}

        </section>

        {/* 4. Special Highlights: Best Sellers & Viral 3D Features (when on Home) */}
        {selectedCategory === 'all' && !searchQuery && (
          <section className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 py-12 px-4 border-y border-amber-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 bg-rose-600 text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow uppercase">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Selling Out Fast</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-gray-900">
                  Top Trending Ethnic Outfits This Week
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-lg">
                  Over 1,200+ orders placed this festive season across our Website, Flipkart, and Meesho channels.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory('3pc Suit');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs transition shadow flex items-center gap-1.5"
                >
                  <span>Explore 3pc Suits</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory('Short Kurti');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-bold rounded-xl text-xs transition shadow-sm"
                >
                  Explore Short Kurtis
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 5. Reviews, Why Choose Us & Social Feed */}
        {selectedCategory === 'all' && !searchQuery && (
          <ReviewsAndSocial 
            onSelectProduct={(p) => setSelectedProduct(p)} 
            products={products}
          />
        )}

      </main>

      {/* Footer */}
      <Footer 
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
        onOpenMyOrders={handleOpenMyOrders}
        onOpenTrackOrder={() => {
          setTrackOrderId('');
          setIsTrackOrderOpen(true);
        }}
      />

      {/* Floating WhatsApp Support */}
      <FloatingWhatsApp />

      {/* MODALS */}
      {/* 1. Full Product Page / Details Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p) => handleAddToCart(p, p.selectedSize)}
        onBuyNow={(p) => handleBuyNow(p)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 2. Standalone 3D Viewer Modal */}
      <StandAlone3DModal
        product={modal3DProduct}
        isOpen={Boolean(modal3DProduct)}
        onClose={() => setModal3DProduct(null)}
        onAddToCart={(p) => handleAddToCart(p)}
        onBuyNow={(p) => handleBuyNow(p)}
      />

      {/* 3. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 4. Complete Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        checkoutData={checkoutData}
        onOrderSuccess={(order) => {
          // Clear cart on successful order
          setCart([]);
          saveCart([]);
          setUnreadOrdersCount(getUnreadOrdersCount());
        }}
      />

      {/* 5. My Orders Modal */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => {
          setIsMyOrdersOpen(false);
          markOrdersAsSeen();
          setUnreadOrdersCount(0);
        }}
        onTrackOrder={(orderId) => {
          setTrackOrderId(orderId);
          setIsTrackOrderOpen(true);
        }}
      />

      {/* 6. Admin & Product Upload Studio */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setUnreadOrdersCount(getUnreadOrdersCount());
        }}
        products={products}
        onProductsUpdated={(newProducts) => setProducts(newProducts)}
      />

      {/* 7. Policy Modal */}
      <PolicyModal
        isOpen={Boolean(activePolicy)}
        onClose={() => setActivePolicy(null)}
        initialPolicy={activePolicy}
      />

      {/* 8. Live Shipment Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackOrderOpen}
        onClose={() => {
          setIsTrackOrderOpen(false);
          setTrackOrderId('');
        }}
        initialOrderId={trackOrderId}
      />

      {/* 8. Abandoned Cart Recovery Modal */}
      <AbandonedCartPopup
        cart={cart}
        isOpen={isAbandonedPopupOpen}
        onClose={() => setIsAbandonedPopupOpen(false)}
        onClaimDiscount={(code, discount) => {
          setIsAbandonedPopupOpen(false);
          const subtotal = cart.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
          const shippingCharge = subtotal >= 999 ? 0 : 99;
          handleProceedToCheckout({
            cart,
            subtotal,
            discountAmount: discount,
            shippingCharge,
            finalTotal: Math.max(0, subtotal - discount + shippingCharge),
            appliedCoupon: code
          });
        }}
      />

    </div>
  );
}
