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
    <header className="sticky top-0 z-40 customer-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight customer-gradient-text">
                SherBook<span className="text-amber-400">.com</span>
              </span>
              <span className="block text-[10px] uppercase font-semibold tracking-widest text-emerald-400 -mt-1">
                Pakistan's Smart AI Bookstore
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <input
                type="text"
                placeholder="Search books, authors, or ask AI (e.g. 'beginner Python')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-900/80 border border-emerald-500/20 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <Link 
                href={`/books?q=${encodeURIComponent(searchQuery)}`}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1 shadow-md shadow-emerald-600/30"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                AI Search
              </Link>
            </div>
          </div>

          {/* Customer Navigation Icons */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* AI Assistant Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-300 transition-all shadow-md shadow-emerald-500/10"
            >
              <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Ask SherBot AI</span>
            </button>

            {/* Order Tracking */}
            <Link 
              href="/orders/tracking" 
              className="p-2 text-slate-300 hover:text-amber-400 transition-colors relative group"
              title="Track Order"
            >
              <Truck className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className="p-2 text-slate-300 hover:text-pink-400 transition-colors relative"
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-emerald-600/30"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full text-xs font-extrabold">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden customer-glass-card border-b border-emerald-500/20 px-4 pt-3 pb-6 space-y-3">
          <div className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Search or ask AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-emerald-500/20 rounded-xl text-sm text-white"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenChat?.(); }}
              className="flex items-center justify-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold"
            >
              <Bot className="w-4 h-4" /> Ask SherBot AI
            </button>
            <Link
              href="/orders/tracking"
              className="flex items-center justify-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-bold"
            >
              <Truck className="w-4 h-4 text-amber-400" /> Track Order
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 p-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold col-span-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" /> View Cart ({cartCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
