'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Search, 
  Truck, 
  Menu, 
  X,
  Bot
} from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount = 0, 
  wishlistCount = 0,
  onOpenChat 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight gradient-text">
                SherBook<span className="text-sky-600">.com</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 -mt-1">
                Pakistan's Smart AI Bookstore
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search books, authors, or ask AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-100/80 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
              <Link 
                href={`/books?q=${encodeURIComponent(searchQuery)}`}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1 shadow-sm"
              >
                <Sparkles className="w-3 h-3" />
                Search
              </Link>
            </div>
          </div>

          {/* Customer Navigation Actions (No Admin links visible here) */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* AI Assistant Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 rounded-full text-xs font-bold text-indigo-700 transition-all shadow-sm"
            >
              <Bot className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>Ask SherBot AI</span>
            </button>

            {/* Order Tracking */}
            <Link 
              href="/orders/tracking" 
              className="p-2 text-slate-600 hover:text-sky-600 transition-colors relative group"
              title="Track Order"
            >
              <Truck className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className="p-2 text-slate-600 hover:text-pink-600 transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link 
              href="/cart" 
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-full font-bold text-sm transition-all shadow-md shadow-sky-600/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-white text-sky-700 px-1.5 py-0.5 rounded-full text-xs font-extrabold">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <div className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Search or ask AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-800"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenChat?.(); }}
              className="flex items-center justify-center gap-2 p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-xs font-bold"
            >
              <Bot className="w-4 h-4" /> Ask SherBot AI
            </button>
            <Link
              href="/orders/tracking"
              className="flex items-center justify-center gap-2 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs font-bold"
            >
              <Truck className="w-4 h-4 text-sky-600" /> Track Order
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 p-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold col-span-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" /> View Cart ({cartCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
