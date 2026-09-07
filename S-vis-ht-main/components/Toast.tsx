import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#17231C] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold z-50 flex items-center gap-2 border border-white/10 animate-bounce">
      <span className="w-2 h-2 rounded-full bg-[#159447]" />
      <span>{message}</span>
    </div>
  );
};
