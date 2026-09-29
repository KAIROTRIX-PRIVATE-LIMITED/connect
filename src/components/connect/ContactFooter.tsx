import React from 'react';
import Link from 'next/link';

interface ContactFooterProps {
  companyName?: string;
  websiteUrl?: string;
}

export function ContactFooter({
  companyName = 'KAIROTRIX',
  websiteUrl = 'https://kairotrix.com',
}: ContactFooterProps) {
  return (
    <footer className="w-full pt-4 pb-2 border-t border-slate-100 flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
        <span>Powered by</span>
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold font-mono tracking-wider text-slate-700 hover:text-purple-600 transition-colors"
        >
          {companyName}
        </a>
      </div>
      <span className="text-[9px] text-slate-300 font-mono tracking-widest mt-1 uppercase">
        Digital Business Card
      </span>
    </footer>
  );
}
