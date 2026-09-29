'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight } from 'lucide-react';
import { KairotrixLogo } from '@/components/ui/KairotrixLogo';

interface AdminLoginProps {
  onSuccess: (token: string) => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        sessionStorage.setItem('kairotrix_admin_token', data.token);
        onSuccess(data.token);
      } else {
        setError(data.error || 'Invalid authorization key');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 shadow-xl p-6 md:p-8">
        <div className="text-center mb-6">
          <KairotrixLogo size="md" className="mb-2" />
          <h2 className="text-xl font-bold text-gray-900">Admin Contact Portal</h2>
          <p className="text-xs text-gray-500 mt-1">
            Authenticate to modify KAIROTRIX permanent contact configuration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Admin Access Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: kairotrix2026)"
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-sm text-gray-900 transition-all outline-none"
                required
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Default password: <code className="bg-gray-100 px-1 py-0.5 rounded">kairotrix2026</code>
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
