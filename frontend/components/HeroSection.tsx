'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Search, ArrowRight, ShieldCheck, Zap, CreditCard, Camera } from 'lucide-react';

interface HeroSectionProps {
  onScanClick?: () => void;
  onOpenChat?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScanClick, onOpenChat }) => {
  const [query, setQuery] = useState('');

  const quickPrompts = [
    "I need beginner AI books",
    "Books about psychology",
    "Atomic Habits",
    "Entrepreneurship in Pakistan"
  ];

  return (
    <div className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 customer-navy-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full customer-glass-card border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-lg animate-float">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>AI Natural Language Vector Search</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover Books with <br />
            <span className="customer-gradient-text">Smart AI Natural Search</span>
          </h1>

          {/* Tagline & Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            "Pakistan's Smart AI Powered Online Bookstore". Fast delivery across Pakistan with Cash on Delivery, Easypaisa, JazzCash, and Bank Transfer.
          </p>

          {/* AI Search Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="customer-glass-card p-2 rounded-2xl border-emerald-500/30 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Ask in natural language e.g. 'Books on machine learning'..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent border-none text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base font-medium"
                />
              </div>
              <Link
                href={`/books?q=${encodeURIComponent(query)}`}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                AI Search
              </Link>
            </div>

            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-xs text-slate-400 font-semibold">Try asking:</span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(prompt)}
                  className="px-3.5 py-1 bg-slate-900/80 hover:bg-emerald-950/80 border border-emerald-500/20 hover:border-emerald-500/50 rounded-full text-xs text-slate-300 font-medium transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/books"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              Browse Book Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={onOpenChat}
              className="px-6 py-3 customer-glass-card hover:bg-slate-900 text-slate-200 font-bold rounded-xl text-sm transition-all flex items-center gap-2 border-emerald-500/30"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Chat with SherBot AI
            </button>
          </div>

          {/* Pakistani Payment & Trust Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl customer-glass-card text-center space-y-1">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
              <h3 className="text-xs font-bold text-white">Cash on Delivery</h3>
              <p className="text-[11px] text-slate-400">Pay at your doorstep in Pakistan</p>
            </div>
            <div className="p-4 rounded-2xl customer-glass-card text-center space-y-1">
              <CreditCard className="w-6 h-6 text-sky-400 mx-auto" />
              <h3 className="text-xs font-bold text-white">Easypaisa & JazzCash</h3>
              <p className="text-[11px] text-slate-400">Instant digital wallet checkout</p>
            </div>
            <div className="p-4 rounded-2xl customer-glass-card text-center space-y-1">
              <Zap className="w-6 h-6 text-amber-400 mx-auto" />
              <h3 className="text-xs font-bold text-white">Free Delivery</h3>
              <p className="text-[11px] text-slate-400">On all orders over Rs. 2,000</p>
            </div>
            <div className="p-4 rounded-2xl customer-glass-card text-center space-y-1">
              <Camera className="w-6 h-6 text-purple-400 mx-auto" />
              <h3 className="text-xs font-bold text-white">AI Cover Scanner</h3>
              <p className="text-[11px] text-slate-400">Smart cover metadata extraction</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
