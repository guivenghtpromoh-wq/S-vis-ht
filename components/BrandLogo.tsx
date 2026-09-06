'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  taglineText?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  taglineText = 'Jwenn moun ki ka fè travay la.',
}) => {
  const iconSize = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }[size];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        {/* Custom SVG Icon mirroring the SÈVIS HT Pin + Tradesperson badge */}
        <div className={`relative flex items-center justify-center ${iconSize} shrink-0`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
            {/* Outer Green Pin Ring */}
            <circle cx="50" cy="40" r="32" stroke="#159447" strokeWidth="12" fill="none" />
            <path
              d="M32 55 L50 82 L68 55 Z"
              fill="#159447"
            />
            {/* Dark Navy Worker Silhouette Inside */}
            {/* Head */}
            <circle cx="50" cy="33" r="10" fill="#0B2545" />
            {/* Torso & Overalls / Apron */}
            <path
              d="M34 56 C34 46 41 44 50 44 C59 44 66 46 66 56 Z"
              fill="#0B2545"
            />
            {/* White overall straps */}
            <rect x="42" y="47" width="4" height="9" rx="1.5" fill="#FFFFFF" />
            <rect x="54" y="47" width="4" height="9" rx="1.5" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Brand Text */}
        <div className="flex items-baseline tracking-tight font-black">
          <span className={`text-[#0B2545] font-extrabold tracking-tight ${textSize}`}>SÈVIS</span>
          <span className={`text-[#159447] font-extrabold tracking-tight ml-1 ${textSize}`}>HT</span>
        </div>
      </div>

      {showTagline && (
        <div className="mt-2.5 flex flex-col items-center">
          <div className="w-12 h-0.5 bg-[#159447] rounded-full mb-1.5" />
          <p className="text-xs sm:text-sm font-medium text-[#17231C] tracking-wide text-center">
            {taglineText}
          </p>
        </div>
      )}
    </div>
  );
};
