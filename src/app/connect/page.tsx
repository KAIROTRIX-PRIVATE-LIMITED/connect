import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getContactSettings } from '@/lib/storage';
import { ConnectPageClient } from '@/components/connect/ConnectPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact KAIROTRIX | Connect with Us',
  description: 'Contact KAIROTRIX by phone, WhatsApp, email, social media, or meeting request.',
  openGraph: {
    title: 'Contact KAIROTRIX',
    description: 'Official digital contact card for KAIROTRIX.',
    url: 'https://kairotrix.com/connect',
    type: 'website',
  },
};

export default async function ConnectPage() {
  const initialSettings = await getContactSettings();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-pulse text-purple-600 font-mono text-sm font-semibold">
            KAIROTRIX...
          </div>
        </div>
      }
    >
      <ConnectPageClient initialSettings={initialSettings} />
    </Suspense>
  );
}
