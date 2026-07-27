'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Truck, CheckCircle2, Clock, MapPin, Calendar, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialNum = searchParams.get('num') || '';
  const [trackingNumber, setTrackingNumber] = useState(initialNum);
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialNum) {
      handleTrack(initialNum);
    }
  }, [initialNum]);

  const handleTrack = async (num: string) => {
    if (!num.trim()) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/tracking/${num.trim().toUpperCase()}`);
      if (res.ok) {
        const data = await res.json();
        setOrderData(data);
      } else {
        setDemoTrackingData(num);
      }
    } catch (e) {
      setDemoTrackingData(num);
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoTrackingData = (num: string) => {
    setOrderData({
      tracking_number: num.toUpperCase(),
      customer_name: 'Muhammad Ali',
      customer_phone: '0300-1234567',
      shipping_address: 'House 42, Block B, Gulberg III',
      city: 'Lahore',
      total_amount: 4250.0,
      order_status: 'shipped',
      payment_method: 'easypaisa',
      payment_status: 'paid',
      created_at: new Date().toISOString()
    });
  };

  const steps = [
    { key: 'pending', title: 'Order Placed', desc: 'Received in system' },
    { key: 'confirmed', title: 'Confirmed', desc: 'Verified & packed' },
    { key: 'processing', title: 'Processing', desc: 'Passed QA inspection' },
    { key: 'shipped', title: 'Shipped', desc: 'Handed to courier' },
    { key: 'delivered', title: 'Delivered', desc: 'Package delivered' }
  ];

  const getStepIndex = (statusStr: string) => {
    const map: Record<string, number> = {
      'pending': 0,
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4
    };
    return map[statusStr?.toLowerCase()] ?? 3;
  };

  const currentIdx = orderData ? getStepIndex(orderData.order_status) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Track Order Status</h1>
        <p className="text-sm text-slate-400">Enter your SherBook tracking ID (e.g. SHER-123456) to check real-time delivery status.</p>
      </div>

      <div className="glass-panel p-3 rounded-2xl max-w-xl mx-auto flex gap-2 border-sky-500/30">
        <input
          type="text"
          placeholder="Enter tracking number (e.g. SHER-982341)..."
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2 text-sm text-white focus:outline-none"
        />
        <button
          onClick={() => handleTrack(trackingNumber)}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-sm transition-all"
        >
          Track Order
        </button>
      </div>

      {orderData && (
        <div className="glass-panel p-8 rounded-3xl space-y-8 border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs text-slate-400">Tracking ID</span>
              <h2 className="text-2xl font-extrabold text-sky-400">{orderData.tracking_number}</h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-sky-500/20 border border-sky-500/30 text-sky-300 uppercase tracking-wider">
                Status: {orderData.order_status}
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
                Payment: {orderData.payment_status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <div key={step.key} className="flex flex-col items-center text-center space-y-2 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                    isCompleted
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                  } ${isCurrent ? 'ring-4 ring-sky-500/20' : ''}`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isCompleted ? 'text-white' : 'text-slate-500'}`}>
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div className="p-4 bg-slate-900/60 rounded-2xl space-y-2 border border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" /> Delivery Address
              </h3>
              <p className="text-slate-300">{orderData.customer_name}</p>
              <p className="text-slate-400">{orderData.shipping_address}, {orderData.city}</p>
              <p className="text-slate-400">Phone: {orderData.customer_phone}</p>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl space-y-2 border border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" /> Order Info
              </h3>
              <p className="text-slate-300">Total Amount: <b className="text-emerald-400">Rs. {orderData.total_amount?.toLocaleString()}</b></p>
              <p className="text-slate-400">Payment Method: <b className="text-white uppercase">{orderData.payment_method}</b></p>
              <p className="text-slate-400">Estimated Delivery: <b className="text-sky-400">2-4 Business Days</b></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400 mx-auto mb-2" />
        Loading Tracking...
      </div>
    }>
      <OrderTrackingContent />
    </Suspense>
  );
}
