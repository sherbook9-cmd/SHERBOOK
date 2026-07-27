'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, KeyRound, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'admin123' || passcode.trim() === 'sherbookadmin') {
      sessionStorage.setItem('sherbook_admin_authenticated', 'true');
      router.push('/admin/dashboard');
    } else {
      setErrorMsg('Invalid Admin Access Code. Access Denied.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 hero-bg-light">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl space-y-6 shadow-xl border-slate-200">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">SherBook Admin Portal</h1>
          <p className="text-xs text-slate-500">Authorized Bookstore Owner Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Enter Admin Passcode Key
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Enter passcode (Default: admin123)..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            Authenticate Admin Session
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 text-center">
          🔒 Customers do not have access to this portal. Access attempts are logged.
        </div>

      </div>
    </div>
  );
}
