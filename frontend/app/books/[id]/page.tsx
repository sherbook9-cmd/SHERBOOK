'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, Sparkles, BookOpen, ArrowLeft, Send } from 'lucide-react';
import { BookCard } from '@/components/BookCard';

import { API_BASE_URL } from '@/lib/api';

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([
    { id: '1', name: 'Dr. Usman Qureshi', rating: 5, comment: 'Exceptional book! Clear explanations and fast delivery to Islamabad in 2 days.' },
    { id: '2', name: 'Ayesha Khan', rating: 5, comment: 'Packed securely, authentic print quality. Very happy with SherBook!' }
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [similarBooks, setSimilarBooks] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/books/${bookId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.title) setBook(data);
        else setDemoBook();
      })
      .catch(() => setDemoBook());
  }, [bookId]);

  const setDemoBook = () => {
    setBook({
      id: bookId,
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '9780735211292',
      price: 1450,
      stock_quantity: 48,
      rating_avg: 4.9,
      rating_count: 24,
      publisher: 'Avery Publishing',
      language: 'English',
      edition: 'Special Hardcover Edition',
      release_year: 2018,
      category: { name: 'Self-Help & Productivity', slug: 'self-help-productivity' },
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
      cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
    });

    setSimilarBooks([
      {
        id: '3',
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        price: 1600,
        stock_quantity: 45,
        rating_avg: 4.9,
        category: { name: 'Business', slug: 'business-entrepreneurship' },
        cover_image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: '2',
        title: 'Deep Learning with Python',
        author: 'François Chollet',
        price: 2800,
        stock_quantity: 30,
        rating_avg: 4.8,
        category: { name: 'AI & Tech', slug: 'ai-tech' },
        cover_image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80'
      }
    ]);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setReviews(prev => [
      { id: Date.now().toString(), name: 'You (Verified Buyer)', rating: newRating, comment: newComment },
      ...prev
    ]);
    setNewComment('');
  };

  if (!book) return <div className="py-20 text-center text-slate-400">Loading book details...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back button */}
      <Link href="/books" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-400">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Cover Preview Column */}
        <div className="md:col-span-5 flex justify-center">
          <div className="glass-panel p-4 rounded-3xl border-slate-800 max-w-sm w-full">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="md:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <span className="px-3 py-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              {book.category?.name || 'General'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{book.title}</h1>
            <p className="text-base text-slate-400">by <b className="text-slate-200">{book.author}</b></p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(book.rating_avg || 5) ? 'fill-amber-400' : 'text-slate-700'}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-white">{book.rating_avg || 4.9}</span>
              <span className="text-xs text-slate-400">({book.rating_count || 24} customer reviews)</span>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 border-slate-800">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">Rs. {book.price?.toLocaleString()}</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Fast Delivery across Pakistan
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Availability:</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                book.stock_quantity > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {book.stock_quantity > 0 ? `In Stock (${book.stock_quantity} copies left)` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex gap-4 pt-2">
              <Link
                href="/cart"
                className="flex-1 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </Link>
              <button className="p-3.5 glass-panel hover:bg-slate-800 text-slate-300 rounded-xl">
                <Heart className="w-5 h-5 text-pink-500" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Description</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{book.description}</p>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">ISBN</span>
              <div className="font-bold text-white mt-0.5">{book.isbn || '978-0735211292'}</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Publisher</span>
              <div className="font-bold text-white mt-0.5">{book.publisher || 'SherBook Press'}</div>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400">Language</span>
              <div className="font-bold text-white mt-0.5">{book.language || 'English'}</div>
            </div>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <section className="glass-panel p-8 rounded-3xl space-y-6 border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Verified Customer Reviews
        </h2>

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="p-4 bg-slate-900/80 rounded-2xl space-y-3 border border-slate-800">
          <h4 className="text-xs font-bold text-white">Write a Review</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Rating:</span>
            <div className="flex gap-1 text-amber-400 cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setNewRating(star)}
                  className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400' : 'text-slate-700'}`}
                />
              ))}
            </div>
          </div>
          <textarea
            rows={2}
            placeholder="Share your experience reading this book..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1">
            <Send className="w-3.5 h-3.5" /> Submit Review
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{r.name}</span>
                <div className="flex gap-1 text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Similar Books */}
      {similarBooks.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" /> Similar Books You Might Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarBooks.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
