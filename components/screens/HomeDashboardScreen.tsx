'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { CategoryIcon } from '../CategoryIcon';
import { LocationModal } from '../LocationModal';
import { formatPrice } from '@/lib/utils';
import {
  Search,
  Bell,
  MapPin,
  Star,
  ShieldCheck,
  ChevronRight,
  Clock,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  CreditCard,
} from 'lucide-react';

export const HomeDashboardScreen: React.FC = () => {
  const {
    user,
    currentLocation,
    categories,
    pros,
    notifications,
    navigate,
    setSelectedProId,
    t,
  } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  const popularCats = categories.filter((c) => c.popular).slice(0, 8);
  const nearbyPros = pros.slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('search', { query: searchQuery });
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      {/* Top Bar Header */}
      <div className="bg-white px-5 pt-3 pb-4 border-b border-[#E5EBE7]">
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate('profile')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#159447] shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#159447] border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-[#66736B] font-medium">{t.greetingMorning},</span>
                <span className="text-xs">👋</span>
              </div>
              <h2 className="text-base font-extrabold text-[#17231C] tracking-tight group-hover:text-[#159447] transition-colors">
                {user.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="home-notif-btn"
              onClick={() => navigate('notifications')}
              className="relative w-10 h-10 rounded-full bg-[#F7F9F8] border border-[#E5EBE7] flex items-center justify-center text-[#17231C] hover:bg-[#E8F6ED] transition-colors"
              aria-label="Notifikasyon"
            >
              <Bell className="w-5 h-5 stroke-[2.2]" />
              {unreadNotifs > 0 && (
                <span className="absolute 1.5 top-1.5 right-1.5 w-4 h-4 bg-[#D94A4A] text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Input Bar matching Image 1 */}
        <form onSubmit={handleSearchSubmit} className="mt-4 relative">
          <Search className="w-4 h-4 text-[#66736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="home-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Chèche sèvis, pwofesyonèl..."
            className="w-full pl-10 pr-4 py-3 bg-[#F7F9F8] border border-[#E5EBE7] rounded-2xl text-xs font-medium text-[#17231C] placeholder-[#66736B] outline-none focus:bg-white focus:border-[#159447] focus:ring-2 focus:ring-[#159447]/15 transition-all shadow-2xs"
          />
        </form>

        {/* Location Selector Pill - Exact Replica of Reference Mockup */}
        <div
          onClick={() => setIsLocationModalOpen(true)}
          className="mt-3.5 w-full bg-[#159447] hover:bg-[#0B7A3B] text-white rounded-2xl py-2 px-3.5 flex items-center justify-between cursor-pointer shadow-xs transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-white shrink-0" />
            <span className="text-xs font-bold truncate">
              {currentLocation.split(',')[0]}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-white/90 underline shrink-0">
            {t.changeZone}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-5 pt-5 space-y-6">
        {/* Popular Services Section */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-extrabold text-[#17231C] tracking-tight">
              {t.popularServices}
            </h3>
            <button
              onClick={() => navigate('all_categories')}
              className="text-xs font-bold text-[#159447] hover:text-[#0B7A3B] flex items-center gap-0.5"
            >
              <span>{t.seeAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clean Rounded Service Badges Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {popularCats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate('category_details', { categorySlug: cat.slug })}
                className="flex flex-col items-center justify-center p-2.5 bg-white border border-[#E5EBE7] rounded-2xl hover:border-[#159447] hover:shadow-sm active:scale-95 transition-all group"
              >
                <div className="w-11 h-11 rounded-full bg-[#E8F6ED] flex items-center justify-center mb-1.5 group-hover:bg-[#159447] transition-colors">
                  <CategoryIcon
                    iconName={cat.icon}
                    size={20}
                    className="w-5 h-5 text-[#159447] group-hover:text-white transition-colors"
                  />
                </div>
                <span className="text-[11px] font-bold text-[#17231C] text-center line-clamp-1">
                  {cat.nameHt}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Pros Section ("Pwofesyonèl toupre w") */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-extrabold text-[#17231C] tracking-tight">
                {t.featuredPros}
              </h3>
              <span className="w-2 h-2 rounded-full bg-[#159447] animate-ping" />
            </div>
            <button
              onClick={() => navigate('search')}
              className="text-xs font-bold text-[#159447] hover:text-[#0B7A3B] flex items-center gap-0.5"
            >
              <span>{t.seeAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {nearbyPros.map((pro) => (
              <div
                key={pro.id}
                onClick={() => {
                  setSelectedProId(pro.id);
                  navigate('pro_profile', { proId: pro.id });
                }}
                className="p-3.5 bg-white border border-[#E5EBE7] rounded-2xl hover:border-[#159447] hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={pro.avatar}
                      alt={pro.name}
                      className="w-13 h-13 rounded-2xl object-cover border border-[#E5EBE7]"
                    />
                    {pro.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#159447] text-white rounded-full flex items-center justify-center border-2 border-white">
                        <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-extrabold text-[#17231C] truncate">
                        {pro.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#66736B] truncate">{pro.categoryName}</p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[#66736B] flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#159447]" />
                        {pro.location}
                      </span>
                      <span className="text-[10px] text-[#66736B]">•</span>
                      <span className="text-[10px] font-bold text-[#17231C]">
                        Kòmanse nan ${formatPrice(pro.startingPrice)} HTG
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1 bg-[#E8F6ED] px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-[#D99A2B] text-[#D99A2B]" />
                    <span className="text-[11px] font-black text-[#17231C]">{pro.rating}</span>
                  </div>
                  {pro.isAvailable && (
                    <span className="text-[10px] font-bold text-[#159447] bg-[#159447]/10 px-1.5 py-0.5 rounded-md">
                      Disponib
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition Cards matching Image 1 Design */}
        <div className="bg-white border border-[#E5EBE7] rounded-3xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#159447]" />
            <h4 className="text-xs font-extrabold text-[#17231C]">Poukisa chwazi SÈVIS HT?</h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-2.5 bg-[#F7F9F8] rounded-2xl flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#159447] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-[#17231C]">Pwofesyonèl verifye</p>
                <p className="text-[10px] text-[#66736B] mt-0.5">Tout bòs gen pyès ID verifye</p>
              </div>
            </div>

            <div className="p-2.5 bg-[#F7F9F8] rounded-2xl flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-[#159447] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-[#17231C]">Kontak WhatsApp</p>
                <p className="text-[10px] text-[#66736B] mt-0.5">Pale dirèk san frè kache</p>
              </div>
            </div>

            <div className="p-2.5 bg-[#F7F9F8] rounded-2xl flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#159447] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-[#17231C]">Repons rapid</p>
                <p className="text-[10px] text-[#66736B] mt-0.5">Entèvansyon nan kèk minit</p>
              </div>
            </div>

            <div className="p-2.5 bg-[#F7F9F8] rounded-2xl flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-[#159447] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-[#17231C]">MonCash & NatCash</p>
                <p className="text-[10px] text-[#66736B] mt-0.5">Peye lè travay la fini</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Pro Banner */}
        <div className="bg-gradient-to-br from-[#159447] to-[#0B7A3B] rounded-3xl p-4 text-white shadow-md flex items-center justify-between">
          <div className="max-w-[70%]">
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Rekòmande pou ou
            </span>
            <h4 className="text-sm font-extrabold mt-1.5">Bezwen yon elektrisyen jodi a?</h4>
            <p className="text-[11px] text-white/90 mt-0.5">
              John Elektrik disponib nan Delmas 33 kounye a.
            </p>
            <button
              onClick={() => {
                setSelectedProId('pro_1');
                navigate('request_flow', { proId: 'pro_1' });
              }}
              className="mt-3 px-3.5 py-1.5 bg-white text-[#159447] text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all"
            >
              Mande Sèvis Rapid
            </button>
          </div>
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xs shrink-0">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
              alt="John Elektrik"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};
