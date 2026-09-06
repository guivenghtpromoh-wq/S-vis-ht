'use client';

import React from 'react';
import { Home, Search, MessageSquare, User as UserIcon, Plus } from 'lucide-react';
import { useApp } from '@/lib/store';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, navigate, conversations, t } = useApp();

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <nav
      aria-label="Navigasyon prensipal"
      className="shrink-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-[#E5EBE7] px-3 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none"
    >
      <div className="flex items-center justify-around relative">
        {/* Akèy */}
        <button
          id="nav-btn-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
            activeTab === 'home'
              ? 'text-[#159447] font-semibold'
              : 'text-[#66736B] hover:text-[#17231C]'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[11px] mt-0.5">{t.navHome}</span>
        </button>

        {/* Rechèch */}
        <button
          id="nav-btn-search"
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
            activeTab === 'search'
              ? 'text-[#159447] font-semibold'
              : 'text-[#66736B] hover:text-[#17231C]'
          }`}
        >
          <Search className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[11px] mt-0.5">{t.navSearch}</span>
        </button>

        {/* Central Floating Green Action Button (+) */}
        <div className="relative -top-3.5">
          <button
            id="nav-btn-quick-request"
            onClick={() => navigate('request_flow', { proId: 'pro_1' })}
            aria-label="Nouvo demann sèvis"
            className="w-12 h-12 rounded-full bg-[#159447] hover:bg-[#0B7A3B] text-white flex items-center justify-center shadow-lg shadow-[#159447]/30 transition-transform active:scale-95 border-2 border-white"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Mesaj */}
        <button
          id="nav-btn-messages"
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors relative ${
            activeTab === 'messages'
              ? 'text-[#159447] font-semibold'
              : 'text-[#66736B] hover:text-[#17231C]'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 stroke-[2.2]" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#D94A4A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalUnread}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5">{t.navMessages}</span>
        </button>

        {/* Pwofil */}
        <button
          id="nav-btn-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
            activeTab === 'profile'
              ? 'text-[#159447] font-semibold'
              : 'text-[#66736B] hover:text-[#17231C]'
          }`}
        >
          <UserIcon className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[11px] mt-0.5">{t.navProfile}</span>
        </button>
      </div>
    </nav>
  );
};
