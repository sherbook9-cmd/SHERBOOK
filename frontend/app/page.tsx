'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/HeroSection';
import { BookCard, Book } from '@/components/BookCard';
import { AICoverScannerModal } from '@/components/AICoverScannerModal';
import { Sparkles, TrendingUp, Award, BookOpen, ArrowRight, Camera, FileSpreadsheet, Bot } from 'lucide-react';

import { API_BASE_URL } from '@/lib/api';

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [bestsellerBooks, setBestsellerBooks] = useState<Book[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    // Fetch books from backend or fallback to demo dataset
    fetch(`${API_BASE_URL}/api/v1/books`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedBooks(data.slice(0, 4));
          setBestsellerBooks(data.slice(0, 4));
        } else {
          setDemoBooks();
        }
      })
      .catch(() => setDemoBooks());
  }, []);

  const setDemoBooks = () => {
    const demos: Book[] = [
      {
        id: '1',
        title: 'Atomic Habits',
        author: 'James Clear',
        price: 1450,
        stock_quantity: 50,
        rating_avg: 4.9,
        category: { name: 'Self-Help', slug: 'self-help-productivity' },
        is_featured: true,
        is_bestseller: true,
        cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: '2',
        title: 'Deep Learning with Python',
        author: 'François Chollet',
        price: 2800,
        stock_quantity: 30,
        rating_avg: 4.8,
        category: { name: 'AI & Tech', slug: 'ai-tech' },
        is_featured: true,
        is_bestseller: true,
        cover_image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: '3',
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        price: 1600,
        stock_quantity: 45,
        rating_avg: 4.9,
        category: { name: 'Business', slug: 'business-entrepreneurship' },
        is_featured: true,
        is_trending: true,
        cover_image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: '4',
        title: 'Generative AI Architecture',
        author: 'Dr. Hamza Malik',
        price: 2400,
        stock_quantity: 15,
        rating_avg: 5.0,
        category: { name: 'AI & Tech', slug: 'ai-tech' },
        is_featured: true,
        is_trending: true,
        cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
      }
    ];
    setFeaturedBooks(demos);
    setBestsellerBooks(demos);
  };

  return (
    <div className="space-y-16">
      
      {/* Hero Section */}
      <HeroSection onScanClick={() => setIsScannerOpen(true)} />

      {/* AI Superpowers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border-sky-500/20 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Natural Language AI Search</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by Google Gemini 768-dim vector embeddings (`text-embedding-004`). Search using natural phrases like "books on python programming".
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Book Cover OCR Scanner</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload or snap a photo of any book cover. Gemini Vision automatically detects title, author, ISBN, category, description, and release year.
              </p>
              <button
                onClick={() => setIsScannerOpen(true)}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                Try Cover Scanner →
              </button>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Excel Bulk Catalog Import</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your inventory spreadsheets. Automated pandas engine cleans missing columns, deduplicates titles, and imports thousands of books in seconds.
              </p>
              <Link href="/admin/dashboard" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                Open Admin Portal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Handpicked Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Books</h2>
          </div>
          <Link href="/books" className="text-sm font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1">
            View All Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" /> Explore Popular Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/books?category=ai-tech" className="p-4 rounded-2xl bg-slate-900/80 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/40 transition-all text-center space-y-1 group">
              <span className="text-2xl">🤖</span>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-400">AI & Tech</h3>
              <p className="text-[11px] text-slate-400">Python, Machine Learning, Web Dev</p>
            </Link>
            <Link href="/books?category=self-help-productivity" className="p-4 rounded-2xl bg-slate-900/80 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/40 transition-all text-center space-y-1 group">
              <span className="text-2xl">⚡</span>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-400">Self-Help</h3>
              <p className="text-[11px] text-slate-400">Habits, Mindsets, Focus</p>
            </Link>
            <Link href="/books?category=business-entrepreneurship" className="p-4 rounded-2xl bg-slate-900/80 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/40 transition-all text-center space-y-1 group">
              <span className="text-2xl">💼</span>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-400">Business</h3>
              <p className="text-[11px] text-slate-400">Startups, Finance, Investing</p>
            </Link>
            <Link href="/books?category=fiction-literature" className="p-4 rounded-2xl bg-slate-900/80 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/40 transition-all text-center space-y-1 group">
              <span className="text-2xl">📖</span>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-400">Fiction</h3>
              <p className="text-[11px] text-slate-400">Novels, Urdu Literature, Classics</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" /> Customer Favorites
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Bestsellers in Pakistan</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellerBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* AI Scanner Modal */}
      <AICoverScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

    </div>
  );
}
