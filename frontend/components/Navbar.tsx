'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Search, 
  Truck, 
  LayoutDashboard, 
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
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight gradient-text">
                SherBook<span className="text-sky-400">.com</span>
              </span>
              <span className="block text-[10px] uppercase font-semibold tracking-widest text-slate-400 -mt-1">
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
                placeholder="Search books, authors, or ask AI (e.g. 'beginner Python books')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-900/80 border border-slate-800 rounded-full text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
              <Link 
                href={`/books?q=${encodeURIComponent(searchQuery)}`}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-full transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Search
              </Link>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* AI Assistant Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300 transition-all"
            >
              <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Ask SherBot AI</span>
            </button>

            {/* Order Tracking */}
            <Link 
              href="/orders/tracking" 
              className="p-2 text-slate-300 hover:text-sky-400 transition-colors relative group"
              title="Track Order"
            >
              <Truck className="w-5 h-5" />
              <span className="sr-only">Track Order</span>
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

            {/* Cart */}
            <Link 
              href="/cart" 
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-full font-medium text-sm transition-all shadow-lg shadow-sky-600/25"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-white text-sky-600 px-1.5 py-0.5 rounded-full text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin Dashboard link */}
            <Link 
              href="/admin/dashboard" 
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
              Admin
            </Link>

          </div>

          {/* Mobile menu trigger */}
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
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Search or ask AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenChat?.(); }}
              className="flex items-center justify-center gap-2 p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-300 text-sm font-medium"
            >
              <Bot className="w-4 h-4" /> Ask SherBot AI
            </button>
            <Link
              href="/orders/tracking"
              className="flex items-center justify-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-sm font-medium"
            >
              <Truck className="w-4 h-4 text-sky-400" /> Track Order
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 p-2.5 bg-sky-600 text-white rounded-lg text-sm font-medium col-span-2"
            >
              <ShoppingBag className="w-4 h-4" /> View Cart ({cartCount})
            </Link>
            <Link
              href="/admin/dashboard"
              className="flex items-center justify-center gap-2 p-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm font-medium col-span-2"
            >
              <LayoutDashboard className="w-4 h-4 text-sky-400" /> Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
