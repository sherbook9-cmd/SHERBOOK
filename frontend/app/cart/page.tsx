'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

interface CartItem {
  id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  cover_image_url: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      title: 'Atomic Habits',
      author: 'James Clear',
      price: 1450,
      quantity: 1,
      cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      title: 'Deep Learning with Python',
      author: 'François Chollet',
      price: 2800,
      quantity: 1,
      cover_image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeDeliveryThreshold = 2000;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const shippingFee = isFreeDelivery ? 0 : 199;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-sky-400" /> Shopping Cart
        </h1>
        <p className="text-sm text-slate-400">Review your items before proceeding to Pakistani payment checkout.</p>
      </div>

      {items.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <p className="text-slate-400">Your cart is currently empty.</p>
          <Link href="/books" className="inline-block px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl text-sm">
            Browse Book Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Free Delivery Progress */}
            <div className="glass-panel p-4 rounded-2xl border-sky-500/30 flex items-center gap-3">
              <Truck className="w-5 h-5 text-sky-400" />
              <div className="flex-1 text-xs">
                {isFreeDelivery ? (
                  <span className="text-emerald-400 font-bold">🎉 Congratulations! You have qualified for FREE Shipping across Pakistan!</span>
                ) : (
                  <span className="text-slate-300">
                    Add <b className="text-amber-400">Rs. {(freeDeliveryThreshold - subtotal).toLocaleString()}</b> more to qualify for <b>FREE Delivery</b>!
                  </span>
                )}
              </div>
            </div>

            {items.map(item => (
              <div key={item.id} className="glass-card p-4 rounded-2xl flex items-center gap-4">
                <img src={item.cover_image_url} alt={item.title} className="w-16 h-22 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-base truncate">{item.title}</h3>
                  <p className="text-xs text-slate-400">by {item.author}</p>
                  <div className="text-sky-400 font-extrabold text-sm mt-1">Rs. {item.price.toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-sky-400 text-slate-400">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-sky-400 text-slate-400">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right font-extrabold text-white text-sm w-24">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>

                <button onClick={() => removeItem(item.id)} className="p-2 text-slate-500 hover:text-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl space-y-4 border-slate-800">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Order Summary</h2>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee (Pakistan)</span>
                  <span className="font-bold text-white">
                    {isFreeDelivery ? <span className="text-emerald-400 uppercase font-extrabold">FREE</span> : `Rs. ${shippingFee}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-base font-extrabold text-white">
                <span>Grand Total</span>
                <span className="text-sky-400 text-xl">Rs. {grandTotal.toLocaleString()}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="glass-panel p-4 rounded-2xl text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Guaranteed Delivery Across Pakistan
              </div>
              <p>Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, Faisalabad & 100+ cities.</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
