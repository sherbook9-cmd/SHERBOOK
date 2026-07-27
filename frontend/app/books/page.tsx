'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookCard, Book } from '@/components/BookCard';
import { Search, Sparkles, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';

import { API_BASE_URL } from '@/lib/api';

export default function BooksCatalogPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCat = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [isAiMode, setIsAiMode] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { name: 'All Categories', slug: '' },
    { name: 'AI & Tech', slug: 'ai-tech' },
    { name: 'Self-Help & Productivity', slug: 'self-help-productivity' },
    { name: 'Business & Entrepreneurship', slug: 'business-entrepreneurship' },
    { name: 'Fiction & Literature', slug: 'fiction-literature' },
  ];

  useEffect(() => {
    fetchBooks();
  }, [selectedCat, sortBy, isAiMode]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      let endpoint = `${API_BASE_URL}/api/v1/books?sort_by=${sortBy}`;
      if (selectedCat) endpoint += `&category_slug=${selectedCat}`;
      if (query) {
        if (isAiMode) {
          endpoint = `${API_BASE_URL}/api/v1/books/semantic-search?q=${encodeURIComponent(query)}`;
        } else {
          endpoint += `&query=${encodeURIComponent(query)}`;
        }
      }

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      } else {
        setDemoCatalog();
      }
    } catch (e) {
      setDemoCatalog();
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCatalog = () => {
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
        cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
      }
    ];
    setBooks(demos);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Book Catalog</h1>
        <p className="text-sm text-slate-400">Search thousands of books across Pakistan with AI natural query support.</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between border-slate-800">
        
        {/* Search Field */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search titles, authors, or natural phrases e.g. 'beginner Python books'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBooks()}
            className="w-full pl-10 pr-24 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={fetchBooks}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
          >
            Search
          </button>
        </div>

        {/* AI Mode Toggle */}
        <button
          onClick={() => setIsAiMode(!isAiMode)}
          className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
            isAiMode
              ? 'bg-purple-600/20 border-purple-500/40 text-purple-300 shadow-md shadow-purple-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Vector Mode: {isAiMode ? 'ON' : 'OFF'}</span>
        </button>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="newest">Sort by Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setSelectedCat(c.slug)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCat === c.slug
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/25'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
          <span>Searching catalog with AI...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

    </div>
  );
}
