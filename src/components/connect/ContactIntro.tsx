import React from 'react';

interface ContactIntroProps {
  title?: string;
  subtitle?: string;
}

export function ContactIntro({
  title = "Let's Connect",
  subtitle = 'Choose the fastest way to reach us.',
}: ContactIntroProps) {
  return (
    <div className="text-center py-2">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
        {title}
      </h1>
      <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
