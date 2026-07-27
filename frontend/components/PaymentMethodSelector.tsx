'use client';

import React from 'react';
import { ShieldCheck, Smartphone, Building2, CreditCard, CheckCircle2 } from 'lucide-react';

export type PaymentOption = 'cod' | 'easypaisa' | 'jazzcash' | 'bank_transfer' | 'debit_card' | 'credit_card';

interface PaymentMethodSelectorProps {
  selected: PaymentOption;
  onSelect: (method: PaymentOption) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selected, onSelect }) => {
  const methods = [
    {
      id: 'cod' as PaymentOption,
      title: 'Cash on Delivery (COD)',
      description: 'Pay cash when your package arrives at your doorstep.',
      icon: ShieldCheck,
      badge: 'Popular in Pakistan',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'easypaisa' as PaymentOption,
      title: 'Easypaisa',
      description: 'Transfer directly to Easypaisa account: 0300-1234567 (Title: SherBook PK)',
      icon: Smartphone,
      badge: 'Instant Transfer',
      badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    {
      id: 'jazzcash' as PaymentOption,
      title: 'JazzCash',
      description: 'Transfer directly to JazzCash account: 0300-7654321 (Title: SherBook PK)',
      icon: Smartphone,
      badge: 'Instant Transfer',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 'bank_transfer' as PaymentOption,
      title: 'Bank Transfer (Meezan / HBL)',
      description: 'IBAN: PK00MEZN0001234567890123 (Meezan Bank Ltd)',
      icon: Building2,
      badge: 'Direct Bank',
      badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30'
    },
    {
      id: 'debit_card' as PaymentOption,
      title: 'Debit / Credit Card',
      description: 'Visa, MasterCard, PayPak accepted securely.',
      icon: CreditCard,
      badge: 'Secure 256-bit',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
        Select Payment Method (Pakistan Supported)
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {methods.map((m) => {
          const Icon = m.icon;
          const isSelected = selected === m.id;
          return (
            <div
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                isSelected
                  ? 'bg-sky-600/15 border-sky-500 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{m.title}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${m.badgeColor}`}>
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{m.description}</p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-700'
                }`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4 fill-sky-500 text-slate-950" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
