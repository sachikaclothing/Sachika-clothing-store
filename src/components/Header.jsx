import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Heart, Menu, X, Sparkles, 
  Settings, Phone, ChevronDown, Tag, ArrowRight, Truck, Package 
} from 'lucide-react';

export default function Header({ 
  cartCount, 
  wishlistCount, 
  ordersCount = 0,
  onOpenCart, 
  onOpenAdmin, 
  onOpenPolicy, 
  onOpenTrackOrder,
  onOpenMyOrders,
  selectedCategory, 
  onSelectCategory,
  searchQuery,
  onSearchChange
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { id: 'all', label: 'Home' },
    { id: 'Short Kurti', label: 'Short Kurti' },
    { id: 'Long Kurti', label: 'Long Kurti' },
    { id: '3pc Suit', label: '3pc Suit' },
    { id: 'New Arrivals', label: 'New Arrivals' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      
      {/* 1. TOP ANNOUNCEMENT TICKER WITH FLIPKART, MEESHO & AJIO PROMINENCE */}
      <div className="bg-gradient-to-r from-[#21092e] via-[#481137] to-[#12041b] text-white text-[11px] sm:text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="bg-rose-600 text-white font-extrabold px-2 py-0.2 rounded text-[10px] uppercase tracking-wider">
              OFFICIAL
            </span>
            <span className="truncate">
              ⚡ Also available on <b className="text-blue-300">Flipkart</b>, <b className="text-pink-300">Meesho</b> & <b className="text-gray-200">Ajio</b>! Free Shipping & COD across India!
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 text-amber-200">
            <span className="flex items-center gap-1 font-semibold">
              <Tag className="w-3 h-3 text-amber-400" />
              Use Code: <b className="text-white bg-white/20 px-1.5 py-0.2 rounded font-mono">SACHIKA10</b> for extra 10% OFF
            </span>
            <span>•</span>
            <button 
              onClick={onOpenMyOrders}
              className="hover:text-white transition flex items-center gap-1 text-[11px] font-semibold"
            >
              <Package className="w-3 h-3 text-amber-300" />
              <span>My Orders</span>
              {ordersCount > 0 && (
                <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {ordersCount}
                </span>
              )}
            </button>
            <span>•</span>
            <button 
              onClick={onOpenTrackOrder}
              className="hover:text-white transition flex items-center gap-1 text-[11px]"
            >
              <Truck className="w-3 h-3 text-amber-300" />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-gray-700 hover:text-black rounded-lg hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo & Name */}
        <div 
          onClick={() => onSelectCategory('all')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <div className="font-serif font-extrabold text-xl sm:text-2xl text-gray-900 tracking-tight flex items-center gap-1">
              <span>SACHIKA</span>
              <span className="text-rose-700">CLOTHING</span>
              <span className="text-[10px] bg-amber-500 text-black font-extrabold px-1.5 py-0.2 rounded font-sans tracking-widest ml-1 shadow-sm">
                3D
              </span>
            </div>
            <div className="text-[9px] font-bold tracking-widest uppercase text-amber-800 -mt-1 font-sans">
              Royal Ethnic Couture
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-semibold text-xs text-gray-700">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onSelectCategory(link.id)}
              className={`px-3.5 py-2 rounded-xl transition ${selectedCategory === link.id ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' : 'hover:bg-gray-100 hover:text-gray-900'}`}
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => onOpenPolicy('about')}
            className="px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            About Us
          </button>
          
          <button
            onClick={() => onOpenPolicy('contact')}
            className="px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Contact Us
          </button>
        </nav>

        {/* Right Action Icons (Search, Admin, Bag) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Search Box (Desktop) */}
          <div className="relative hidden md:block w-48 lg:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search kurtis, 3pc suits..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>

          {/* Search Toggle for Mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Admin / Upload Products Button */}
          <button
            onClick={onOpenAdmin}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Upload Products & Admin Dashboard"
          >
            <Settings className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Upload / Admin</span>
          </button>

          {/* My Orders Button */}
          <button
            onClick={onOpenMyOrders}
            className="relative p-2 text-gray-700 hover:text-rose-700 hover:bg-rose-50 rounded-full transition flex items-center justify-center"
            title="My Orders"
          >
            <Package className="w-5 h-5" />
            {ordersCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => {
              // Could filter to wishlisted items or show alert
              if (wishlistCount === 0) {
                alert('Your wishlist is empty. Tap the heart icon on any kurti or suit to save!');
              } else {
                onSelectCategory('wishlist');
              }
            }}
            className="relative p-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-full transition"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Icon with Count */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-extrabold shadow-md transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-white text-rose-800 px-1.5 py-0.2 rounded-full text-[11px] font-bold">
              {cartCount}
            </span>
          </button>

        </div>

      </div>

      {/* Mobile Search Bar Dropdown */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-gray-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search kurtis, 3pc suits, anarkalis..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Collections & Categories
          </div>

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectCategory(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-between ${selectedCategory === link.id ? 'bg-rose-50 text-rose-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <span>{link.label}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          ))}

          <div className="pt-2 border-t border-gray-100 space-y-1">
            <button
              onClick={() => {
                onOpenMyOrders();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs bg-rose-50 text-rose-800 rounded-lg hover:bg-rose-100 font-bold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-rose-700" />
                <span>My Orders</span>
              </div>
              {ordersCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {ordersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                onOpenTrackOrder();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Your Shipment</span>
            </button>
            <button
              onClick={() => {
                onOpenPolicy('about');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs text-gray-600 hover:text-black font-semibold"
            >
              About Sachika Clothing
            </button>
            <button
              onClick={() => {
                onOpenPolicy('contact');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs text-gray-600 hover:text-black font-semibold"
            >
              Contact Us & Support
            </button>
            <button
              onClick={() => {
                onOpenPolicy('return');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs text-gray-600 hover:text-black font-semibold"
            >
              Refund & Exchange Policy
            </button>
            <button
              onClick={() => {
                onOpenPolicy('cancellation');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs text-gray-600 hover:text-black font-semibold"
            >
              Cancellation Policy
            </button>
            <button
              onClick={() => {
                onOpenPolicy('shipping');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs text-gray-600 hover:text-black font-semibold"
            >
              Shipping Policy
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
