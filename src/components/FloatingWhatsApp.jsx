import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    const query = userQuery.trim() || 'Hello Sachika Clothing! I need assistance with ordering Kurtis & 3pc Suits.';
    const encoded = encodeURIComponent(query);
    window.open(`https://wa.me/919352173474?text=${encoded}`, '_blank');
    setUserQuery('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Pop-up Chat Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold text-xs">
                SC
              </div>
              <div>
                <h4 className="font-bold text-xs">Sachika Clothing Concierge</h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                  <span>Online • Typical reply &lt; 2 mins</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-emerald-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-[#E5DDD5]/40 text-xs text-gray-800 space-y-2 max-h-56 overflow-y-auto">
            <div className="bg-white p-2.5 rounded-xl rounded-tl-none shadow-sm max-w-[85%] border border-gray-100">
              <p>Namaste! 🙏 Welcome to Sachika Clothing 3D Couture.</p>
              <p className="mt-1 text-[11px] text-gray-600">
                Need sizing guidance, custom alteration, or have questions about our Flipkart/Meesho listings? Let us know!
              </p>
            </div>
          </div>

          <form onSubmit={handleSendWhatsApp} className="p-2.5 bg-white border-t border-gray-200 flex gap-1.5">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              className="p-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl shadow transition"
              title="Send to WhatsApp"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3.5 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="text-xs font-bold hidden sm:inline group-hover:inline">
          WhatsApp Support
        </span>
      </button>

    </div>
  );
}
