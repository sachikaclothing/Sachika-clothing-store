import React from 'react';
import { Star, ShieldCheck, Heart, Sparkles, ExternalLink, CheckCircle } from 'lucide-react';
import { getReviews } from '../utils/storage';

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function ReviewsAndSocial({ onSelectProduct, products }) {
  const reviews = getReviews();

  const instaPosts = [
    {
      id: 'ig-1',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
      likes: '2.4k',
      caption: 'Twirling into Diwali with our Shehnai 3pc Royal Suit ✨ Available on our 3D store & Flipkart!',
      handle: '@radhika_festive'
    },
    {
      id: 'ig-2',
      img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80',
      likes: '4.1k',
      caption: 'The Chanderi Silk shine is unreal in person! Ordered via Meesho link 💖',
      handle: '@stylewithanjali'
    },
    {
      id: 'ig-3',
      img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80',
      likes: '1.9k',
      caption: 'Office festive look with the Gulmohar Cambric Cotton Short Kurti 🌸',
      handle: '@priya_couture'
    },
    {
      id: 'ig-4',
      img: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=700&q=80',
      likes: '3.8k',
      caption: 'Banarasi Brocade dreams come alive with @sachikaclothing 👑',
      handle: '@royalkolkata'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#FFFDF9] space-y-16">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* SECTION 1: WHY CHOOSE US */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>The Sachika Clothing Distinction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-gray-900">
            Why Discerning Women Choose Our 3D Boutique
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Traditional ethnic retail leaves you guessing fit and drape. We combine generational artisanal weaving with modern 3D visualization.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg mb-3">
                3D
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">True-To-Life 3D Simulation</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Rotate 360°, inspect neckline gota borders, and examine fabric luster on realistic dress forms before spending a single rupee.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-3">
                🌿
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Authentic Natural Weaves</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                No scratchy synthetic polyester. Only 60x60 Cambric cotton, Varanasi mulberry silk, and genuine Chanderi blends.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-3">
                ⚡
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Multi-Platform Convenience</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Shop with total peace of mind. Buy directly on our store or via official verified links on Flipkart, Meesho, and Ajio.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-3">
                🚚
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Doorstep Comfort</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Free shipping on orders above ₹999, Cash on Delivery option, and easy 7-day reverse pickup right from your home.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: VERIFIED BUYER REVIEWS */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-serif font-extrabold text-gray-900">Loved By 10,000+ Queens Across India</h3>
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>4.9 / 5.0</span>
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Real unedited reviews from store & marketplace buyers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" />
                      <span>Bought on {rev.boughtOn}</span>
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="font-bold text-xs text-gray-900">{rev.name}</div>
                  <div className="text-[10px] text-gray-400">{rev.city} • Verified Buyer • {rev.date}</div>
                  <div className="text-[11px] text-rose-700 font-semibold truncate mt-0.5">{rev.productName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: INSTAGRAM COMMUNITY FEED */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <InstagramIcon className="w-5 h-5 text-rose-600" />
                <h3 className="text-2xl font-serif font-extrabold text-gray-900">#SachikaClothingRoyalty On Instagram</h3>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">Tag @sachikaclothing in your festive reels to get featured and win ₹1,000 gift cards!</p>
            </div>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <span>Follow On Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instaPosts.map((post) => (
              <div key={post.id} className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-200 shadow-sm cursor-pointer">
                <img 
                  src={post.img} 
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-1 text-xs font-bold text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{post.likes}</span>
                  </div>
                  <p className="text-[11px] line-clamp-2 mt-1 leading-snug">{post.caption}</p>
                  <span className="text-[10px] text-amber-300 font-semibold mt-1">{post.handle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
