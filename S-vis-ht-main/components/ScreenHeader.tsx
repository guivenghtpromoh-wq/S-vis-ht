'use client';

import React from 'react';
import { ArrowLeft, MoreVertical, Share2, Heart } from 'lucide-react';
import { useApp } from '@/lib/store';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightAction,
  transparent = false,
  className = '',
}) => {
  const { goBack } = useApp();

  const handleBack = () => {
    if (onBack) onBack();
    else goBack();
  };

  return (
    <header
      className={`w-full px-4 py-3 flex items-center justify-between z-30 transition-colors ${
        transparent ? 'bg-transparent text-white' : 'bg-white border-b border-[#E5EBE7] text-[#17231C]'
      } ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button
            id="header-back-btn"
            onClick={handleBack}
            aria-label="Tounen"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              transparent
                ? 'bg-black/30 text-white hover:bg-black/40'
                : 'bg-[#F7F9F8] text-[#17231C] hover:bg-[#E8F6ED]'
            }`}
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-base font-bold tracking-tight truncate">{title}</h1>
          {subtitle && (
            <p
              className={`text-xs truncate ${
                transparent ? 'text-white/80' : 'text-[#66736B]'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightAction && <div className="flex items-center gap-2">{rightAction}</div>}
    </header>
  );
};
