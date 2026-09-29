import React from 'react';

interface BrandHeaderProps {
  companyName?: string;
  tagline?: string;
}

export function BrandHeader({ tagline = 'BUILT TO EVOLVE' }: BrandHeaderProps) {
  return (
    <header className="flex flex-col items-center justify-center pt-3 pb-2 text-center">
      {/* Logo with animated subtle ring */}
      <div className="relative mb-3">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-sm animate-pulse-ring" />
        <div className="relative p-3.5 rounded-2xl bg-white border border-purple-100 shadow-md shadow-purple-500/5">
          <img
            src="/logo/SYMBOL/KAIROTRIX_Symbol_Black.png"
            alt="Kairotrix"
            className="w-12 h-12 object-contain"
            draggable={false}
          />
        </div>
      </div>

      {/* Brand name */}
      <img
        src="logo/WORDMARK/KAIROTRIX_Wordmark_Black.png"
        alt="Kairotrix"
        className="w-12 h-12 object-contain"
        draggable={false}
      />
      {/* Tagline pill */}
      {tagline && (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/80 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
          {tagline}
        </span>
      )}
    </header>
  );
}
