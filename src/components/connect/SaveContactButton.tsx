'use client';

import React, { useState } from 'react';
import { UserPlus, Check, Sparkles } from 'lucide-react';

interface SaveContactButtonProps {
  onSave: () => void;
}

export function SaveContactButton({ onSave }: SaveContactButtonProps) {
  const [saved, setSaved] = useState(false);

  const handleClick = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={saved}
      className={`relative w-full group overflow-hidden py-3.5 px-5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
        saved
          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
          : 'bg-purple-50 hover:bg-purple-100/80 border border-purple-200/90 text-purple-900 shadow-sm hover:shadow-md hover:border-purple-300 active:scale-[0.99]'
      }`}
    >
      {saved ? (
        <>
          <Check className="w-4 h-4 animate-bounce" />
          <span>Contact Saved to Phone</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 text-purple-600 transition-transform group-hover:rotate-12" />
          <span>Save Contact (.vcf)</span>
          <UserPlus className="w-4 h-4 ml-auto text-purple-600/70 group-hover:text-purple-700" />
        </>
      )}
    </button>
  );
}
