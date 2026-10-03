'use client';

import React, { useState, useEffect } from 'react';
import { ContactSettings } from '@/lib/types';
import { ContactForm } from './ContactForm';
import { LinksEditor } from './LinksEditor';
import { QrStudio } from './QrStudio';
import { AnalyticsOverview } from './AnalyticsOverview';
import { KairotrixLogo } from '@/components/ui/KairotrixLogo';
import { ConnectPageClient } from '@/components/connect/ConnectPageClient';
import { Save, Check, RefreshCw, QrCode, Sliders, BarChart3, Eye, LogOut } from 'lucide-react';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'qr' | 'analytics'>('editor');
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/contact', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setSettings(data.data);
        if (data.warning) {
          setError(data.warning);
        } else {
          setError('');
        }
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to save changes.');
      }
    } catch (err) {
      setError('Connection error while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-pulse text-purple-600 font-mono text-sm font-semibold">
          Loading KAIROTRIX Admin Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-purple-100 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <KairotrixLogo size="sm" />
          <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
            Admin Console
          </span>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center bg-gray-100/80 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-white text-purple-700 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Contact Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-white text-purple-700 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Asset Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-white text-purple-700 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {activeTab === 'editor' && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Tab 1: Editor View */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Form Controls */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-purple-100 p-5 md:p-6 shadow-xs space-y-6">
              <ContactForm settings={settings} onChange={setSettings} />
              <LinksEditor
                links={settings.secondaryLinks}
                onChange={(links) => setSettings({ ...settings, secondaryLinks: links })}
              />
            </div>

            {/* Right: Live Interactive Card Preview */}
            <div className="lg:col-span-5 sticky top-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                  Live Preview (/connect)
                </span>
                <span className="text-[11px] text-gray-400">
                  Updates in real time
                </span>
              </div>
              <div className="border border-purple-100 rounded-3xl overflow-hidden shadow-lg bg-white">
                <ConnectPageClient initialSettings={settings} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: QR Asset Studio */}
        {activeTab === 'qr' && <QrStudio />}

        {/* Tab 3: Analytics */}
        {activeTab === 'analytics' && <AnalyticsOverview token={token} />}
      </main>
    </div>
  );
}
