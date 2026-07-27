'use client';

import './globals.css';
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AIChatbotWidget } from '@/components/AIChatbotWidget';
import { Heart, Sparkles, Truck } from 'lucide-react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>SherBook.com - Pakistan's Smart AI Powered Online Bookstore</title>
        <meta name="description" content="Pakistan's Smart AI Powered Online Bookstore. Browse thousands of books with natural language AI search, cover scanning, and fast delivery across Pakistan." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-slate-900 min-h-screen flex flex-col antialiased">
        
        {/* Customer Free Delivery Announcement Bar */}
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-600 text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
          <Truck className="w-4 h-4 animate-bounce" />
          <span>FREE Delivery across Pakistan on orders over Rs. 2,000! Pay via Cash on Delivery, Easypaisa, or JazzCash.</span>
        </div>

        {/* Customer Navbar (Strictly for Buyers) */}
        <Navbar 
          cartCount={cartCount} 
          wishlistCount={wishlistCount} 
          onOpenChat={() => setIsChatOpen(true)} 
        />

        {/* Customer Main View */}
        <main className="flex-1">
          {children}
        </main>

        {/* AI Shopping Assistant Chatbot */}
        <AIChatbotWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        {/* Customer Footer */}
        <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-extrabold text-slate-900">SherBook.com</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "Pakistan's Smart AI Powered Online Bookstore". Easily discover, search, and buy books with AI natural language search and instant delivery.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">Customer Shopping</h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li><Link href="/books" className="hover:text-sky-600 font-medium">Browse All Books</Link></li>
                  <li><Link href="/books?category=ai-tech" className="hover:text-sky-600 font-medium">AI & Technology Books</Link></li>
                  <li><Link href="/cart" className="hover:text-sky-600 font-medium">Shopping Cart</Link></li>
                  <li><Link href="/orders/tracking" className="hover:text-sky-600 font-medium">Track Delivery Status</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">Pakistani Payment Options</h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li>✔ Cash on Delivery (COD)</li>
                  <li>✔ Easypaisa Account (0300-1234567)</li>
                  <li>✔ JazzCash Account (0300-7654321)</li>
                  <li>✔ Direct Bank Transfer (Meezan / HBL)</li>
                  <li>✔ Debit / Credit Card</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
              <p>© 2026 SherBook.com. All rights reserved.</p>
              <p className="mt-2 sm:mt-0 flex items-center gap-1">
                Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for book lovers across Pakistan.
              </p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
