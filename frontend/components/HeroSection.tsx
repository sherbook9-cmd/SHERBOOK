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
    <div className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 hero-bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider shadow-2xs animate-float">
            <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
            <span>AI Natural Language Book Search</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Find Your Next Book with <br />
            <span className="gradient-text">Smart AI Natural Search</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            "Pakistan's Smart AI Powered Online Bookstore". Fast delivery across Pakistan with Cash on Delivery, Easypaisa, JazzCash, and Bank Transfer.
          </p>

          {/* AI Natural Query Search Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-lg flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-600" />
                <input
                  type="text"
                  placeholder="Type in natural language e.g. 'Books on machine learning'..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent border-none text-slate-900 placeholder-slate-400 focus:outline-none text-sm sm:text-base font-medium"
                />
              </div>
              <Link
                href={`/books?q=${encodeURIComponent(query)}`}
                className="px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI Search
              </Link>
            </div>

            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-xs font-semibold text-slate-500">Try asking:</span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(prompt)}
                  className="px-3 py-1 bg-slate-100 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-full text-xs text-slate-700 font-semibold transition-colors"
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
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-md shadow-sky-600/20"
            >
              Browse Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={onOpenChat}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-sm transition-all flex items-center gap-2 border border-slate-200 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Chat with SherBot AI
            </button>
          </div>

          {/* Pakistani Payment & Trust Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl glass-card text-center space-y-1 bg-white border-slate-100">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
              <h3 className="text-xs font-bold text-slate-900">Cash on Delivery</h3>
              <p className="text-[11px] text-slate-500">Pay at your doorstep in Pakistan</p>
            </div>
            <div className="p-4 rounded-2xl glass-card text-center space-y-1 bg-white border-slate-100">
              <CreditCard className="w-6 h-6 text-sky-600 mx-auto" />
              <h3 className="text-xs font-bold text-slate-900">Easypaisa & JazzCash</h3>
              <p className="text-[11px] text-slate-500">Instant digital wallet checkout</p>
            </div>
            <div className="p-4 rounded-2xl glass-card text-center space-y-1 bg-white border-slate-100">
              <Zap className="w-6 h-6 text-amber-500 mx-auto" />
              <h3 className="text-xs font-bold text-slate-900">Free Delivery</h3>
              <p className="text-[11px] text-slate-500">On all orders over Rs. 2,000</p>
            </div>
            <div className="p-4 rounded-2xl glass-card text-center space-y-1 bg-white border-slate-100">
              <Camera className="w-6 h-6 text-purple-600 mx-auto" />
              <h3 className="text-xs font-bold text-slate-900">AI Cover Detection</h3>
              <p className="text-[11px] text-slate-500">Smart cover metadata extraction</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
