'use client';

import React, { useState, useEffect } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminContactPage() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('kairotrix_admin_token');
    if (savedToken) {
      setToken(savedToken);
    }
    setChecking(false);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('kairotrix_admin_token');
    setToken(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-purple-600 font-mono text-sm font-semibold">
          Authenticating KAIROTRIX Admin Session...
        </div>
      </div>
    );
  }

  if (!token) {
    return <AdminLogin onSuccess={(newToken) => setToken(newToken)} />;
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />;
}
