import React from 'react';

interface KairotrixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'black' | 'white';
}

export function KairotrixLogo({
  className = '',
  size = 'md',
  showText = true,
  variant = 'black',
}: KairotrixLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg tracking-widest',
    md: 'text-xl md:text-2xl tracking-widest',
    lg: 'text-2xl md:text-3xl tracking-widest',
  };

  const logoSrc = variant === 'white'
    ? '/logo/SYMBOL/KAIROTRIX_Symbol_White.png'
    : '/logo/SYMBOL/KAIROTRIX_Symbol_Black.png';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Brand Icon — uses the actual Kairotrix symbol asset */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <img
          src={logoSrc}
          alt="Kairotrix"
          className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
          draggable={false}
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`font-extrabold text-gray-900 font-mono ${textSizes[size]}`}>
          KAIROTRIX
        </span>
      )}
    </div>
  );
}
