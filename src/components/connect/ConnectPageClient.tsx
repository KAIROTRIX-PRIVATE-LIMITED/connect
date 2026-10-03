'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContactSettings } from '@/lib/types';
import { BrandHeader } from './BrandHeader';
import { ContactIntro } from './ContactIntro';
import { PrimaryContactActions } from './PrimaryContactActions';
import { SecondaryLinks } from './SecondaryLinks';
import { SaveContactButton } from './SaveContactButton';
import { ContactFooter } from './ContactFooter';

interface ConnectPageClientProps {
  initialSettings: ContactSettings;
}

export function ConnectPageClient({ initialSettings }: ConnectPageClientProps) {
  const searchParams = useSearchParams();
  const source = searchParams?.get('source') || 'direct';

  const [settings, setSettings] = useState<ContactSettings>(initialSettings);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  // Track page view
  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'view',
        source,
      }),
    }).catch((err) => console.error('Analytics error:', err));
  }, [source]);

  const handleActionClick = (actionType: string) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'action',
        actionType,
        source,
      }),
    }).catch((err) => console.error('Analytics error:', err));
  };

  const handleSaveContact = () => {
    handleActionClick('save_vcard');
    window.location.href = '/api/vcard';
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Dynamic Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-purple-300/40 blur-[120px] pointer-events-none animate-float-orb" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-300/30 blur-[140px] pointer-events-none animate-float-orb-delayed" />
      <div className="absolute top-[35%] right-[5%] w-[300px] h-[300px] rounded-full bg-pink-200/40 blur-[100px] pointer-events-none animate-glow-breathe" />

      {/* Main Digital Card Container */}
      <div className="relative w-full max-w-md my-auto animate-slide-up">
        {/* Soft Card Ambient Glow */}
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-b from-purple-300/40 via-indigo-200/20 to-purple-300/40 blur-xl opacity-75 pointer-events-none" />

        <div className="relative w-full rounded-3xl bg-white/90 backdrop-blur-2xl border border-purple-100/90 shadow-[0_20px_60px_-15px_rgba(147,51,234,0.08)] p-6 sm:p-8 space-y-4">
          
          {/* 1. Brand Header */}
          <div className="animate-slide-up-d1">
            <BrandHeader
              companyName={settings.companyName}
              
            />
          </div>

          {/* 2. Contact Intro Title & Subtitle */}
          <div className="animate-slide-up-d2">
            <ContactIntro />
          </div>

          {/* 3. Hero CTA & Primary Contact Actions */}
          <div className="animate-slide-up-d3">
            <PrimaryContactActions
              settings={settings}
              onActionClick={handleActionClick}
            />
          </div>

          {/* 4. Save VCard Button */}
          <div className="animate-slide-up-d4">
            <SaveContactButton onSave={handleSaveContact} />
          </div>

          {/* 5. Secondary Social & Web Links */}
          <div className="animate-slide-up-d5">
            <SecondaryLinks
              links={settings.secondaryLinks}
              onLinkClick={(label, url) => handleActionClick(`link_${label}`)}
            />
          </div>

          {/* 6. Footer */}
          <ContactFooter
            companyName={settings.companyName}
            websiteUrl={settings.website}
          />
        </div>
      </div>
    </main>
  );
}
