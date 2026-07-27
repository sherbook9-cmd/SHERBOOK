'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, Sparkles } from 'lucide-react';

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
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group relative bg-white">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {book.is_bestseller && (
          <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider rounded-md shadow-sm">
            Bestseller
          </span>
        )}
        {book.is_featured && (
          <span className="px-2.5 py-1 bg-sky-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-md shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Featured
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => onToggleWishlist?.(book)}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-pink-500 transition-colors"
      >
        <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-pink-500 text-pink-500' : ''}`} />
      </button>

      {/* Cover Image */}
      <Link href={`/books/${book.id}`} className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={coverUrl}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-sky-700">{book.category?.name || 'Book'}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>

          <Link href={`/books/${book.id}`}>
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-sky-600 transition-colors">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">by {book.author}</p>
        </div>

        {/* Price & Stock */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Price</span>
            <div className="text-lg font-extrabold text-slate-900">
              Rs. {book.price.toLocaleString()}
            </div>
          </div>

          <button
            onClick={() => onAddToCart?.(book)}
            disabled={book.stock_quantity <= 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              book.stock_quantity > 0
                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
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
