'use client';

import './globals.css';
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AIChatbotWidget } from '@/components/AIChatbotWidget';
import { Heart, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <head>
        <title>SherBook.com - Pakistan's Smart AI Powered Online Bookstore</title>
        <meta name="description" content="Pakistan's Smart AI Powered Online Bookstore. Browse thousands of books with natural language AI search, cover scanning, and fast delivery across Pakistan." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex flex-col antialiased">
        
        {/* Top Shipping Announcement Bar */}
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white text-center py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 shadow-md">
          <Truck className="w-4 h-4 animate-bounce" />
          <span>FREE Shipping across Pakistan on all orders over Rs. 2,000! Pay via Easypaisa, JazzCash or Cash on Delivery.</span>
        </div>

        {/* Navbar */}
        <Navbar 
          cartCount={cartCount} 
          wishlistCount={wishlistCount} 
          onOpenChat={() => setIsChatOpen(true)} 
        />

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* AI Chatbot Widget */}
        <AIChatbotWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-slate-900 pt-12 pb-8 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-white">SherBook.com</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  "Pakistan's Smart AI Powered Online Bookstore". Designed with cutting-edge artificial intelligence to revolutionize how you discover, buy, and manage books.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li><Link href="/books" className="hover:text-sky-400">All Books Catalog</Link></li>
                  <li><Link href="/books?category=ai-tech" className="hover:text-sky-400">AI & Tech Books</Link></li>
                  <li><Link href="/books?category=self-help-productivity" className="hover:text-sky-400">Self-Help & Productivity</Link></li>
                  <li><Link href="/orders/tracking" className="hover:text-sky-400">Track Order Status</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Pakistani Payments</h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li>✔ Cash on Delivery (COD)</li>
                  <li>✔ Easypaisa Account</li>
                  <li>✔ JazzCash Account</li>
                  <li>✔ Bank Transfer (Meezan/HBL)</li>
                  <li>✔ Visa / MasterCard</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Admin & AI Features</h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li><Link href="/admin/dashboard" className="hover:text-sky-400">Admin Inventory Dashboard</Link></li>
                  <li><span>AI Book Cover OCR Scanner</span></li>
                  <li><span>Excel Bulk Catalog Import</span></li>
                  <li><span>Gemini Vector Semantic Search</span></li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
              <p>© 2026 SherBook.com. All rights reserved.</p>
              <p className="mt-2 sm:mt-0 flex items-center gap-1">
                Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for readers across Pakistan.
              </p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
