'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { CheckCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-[90%] w-auto px-4 py-2.5 bg-[#17231C] text-white text-xs font-medium rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
      <CheckCircle className="w-4 h-4 text-[#159447] shrink-0 stroke-[2.5]" />
      <span className="truncate">{toastMessage}</span>
    </div>
  );
};
