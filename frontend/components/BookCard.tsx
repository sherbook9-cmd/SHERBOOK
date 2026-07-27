'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, Check, Sparkles } from 'lucide-react';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  price: number;
  stock_quantity: number;
  cover_image_url?: string;
  rating_avg?: number;
  rating_count?: number;
  category?: { name: string; slug: string };
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_trending?: boolean;
}

interface BookCardProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
  onToggleWishlist?: (book: Book) => void;
  isInWishlist?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false
}) => {
  const coverUrl = book.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
  const rating = book.rating_avg || 4.9;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group relative">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {book.is_bestseller && (
          <span className="px-2.5 py-1 bg-amber-500/90 backdrop-blur-md text-slate-950 font-extrabold text-[10px] uppercase tracking-wider rounded-md shadow-md">
            Bestseller
          </span>
        )}
        {book.is_featured && (
          <span className="px-2.5 py-1 bg-sky-500/90 backdrop-blur-md text-white font-extrabold text-[10px] uppercase tracking-wider rounded-md shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Featured
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => onToggleWishlist?.(book)}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 flex items-center justify-center text-slate-300 hover:text-pink-500 transition-colors"
      >
        <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-pink-500 text-pink-500' : ''}`} />
      </button>

      {/* Cover Image */}
      <Link href={`/books/${book.id}`} className="relative aspect-[3/4] overflow-hidden bg-slate-950">
        <img
          src={coverUrl}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{book.category?.name || 'Book'}</span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>

          <Link href={`/books/${book.id}`}>
            <h3 className="font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-sky-400 transition-colors">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">by {book.author}</p>
        </div>

        {/* Price & Stock */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Price</span>
            <div className="text-lg font-extrabold text-white">
              Rs. {book.price.toLocaleString()}
            </div>
          </div>

          <button
            onClick={() => onAddToCart?.(book)}
            disabled={book.stock_quantity <= 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
              book.stock_quantity > 0
                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {book.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>

      </div>

    </div>
  );
};
