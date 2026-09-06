'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { formatPrice } from '@/lib/utils';
import {
  Search,
  Star,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const CategoryDetailsScreen: React.FC = () => {
  const { screenParams, categories, pros, navigate, setSelectedProId, t } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'top_rated' | 'near'>('all');

  const slug = screenParams?.categorySlug || 'elektrisite';
  const category = categories.find((c) => c.slug === slug) || categories[0];

  // Find pros in this category or relevant
  const categoryPros = pros.filter(
    (p) => p.categorySlug === slug || slug === 'lot-sevis' || pros.length < 3
  );

  // Apply filters
  let displayedPros = categoryPros.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  if (filter === 'available') {
    displayedPros = displayedPros.filter((p) => p.isAvailable);
  } else if (filter === 'top_rated') {
    displayedPros = [...displayedPros].sort((a, b) => b.rating - a.rating);
  } else if (filter === 'near') {
    displayedPros = [...displayedPros].sort(
      (a, b) => (a.distanceMinutes || 99) - (b.distanceMinutes || 99)
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader
        title={category.nameHt}
        subtitle={`${categoryPros.length} ${t.prosAvailable}`}
        onBack={() => navigate('all_categories')}
        rightAction={
          <button
            onClick={() => setFilter(filter === 'all' ? 'available' : 'all')}
            className="w-9 h-9 rounded-full bg-[#F7F9F8] border border-[#E5EBE7] flex items-center justify-center text-[#17231C] hover:bg-[#E8F6ED]"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        }
      />

      <div className="p-5 space-y-4">
        {/* Search inside category */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#66736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Chèche nan ${category.nameHt}...`}
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5EBE7] rounded-2xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447] shadow-2xs"
          />
        </div>

        {/* Filter Pills matching Image 1: [Tout], [Disponib], [Pi wo rated], [Tò pre w] */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[#159447] text-white shadow-xs'
                : 'bg-white border border-[#E5EBE7] text-[#66736B] hover:text-[#17231C]'
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              filter === 'available'
                ? 'bg-[#159447] text-white shadow-xs'
                : 'bg-white border border-[#E5EBE7] text-[#66736B] hover:text-[#17231C]'
            }`}
          >
            {t.filterAvailable}
          </button>
          <button
            onClick={() => setFilter('top_rated')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              filter === 'top_rated'
                ? 'bg-[#159447] text-white shadow-xs'
                : 'bg-white border border-[#E5EBE7] text-[#66736B] hover:text-[#17231C]'
            }`}
          >
            {t.filterTopRated}
          </button>
          <button
            onClick={() => setFilter('near')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              filter === 'near'
                ? 'bg-[#159447] text-white shadow-xs'
                : 'bg-white border border-[#E5EBE7] text-[#66736B] hover:text-[#17231C]'
            }`}
          >
            {t.filterNearMe}
          </button>
        </div>

        {/* Professionals List */}
        <div className="space-y-3 pt-1">
          {displayedPros.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#E5EBE7]">
              <div className="w-14 h-14 bg-[#E8F6ED] rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                🔍
              </div>
              <h4 className="text-sm font-bold text-[#17231C]">{t.noResultsTitle}</h4>
              <p className="text-xs text-[#66736B] mt-1 max-w-xs mx-auto">
                {t.noResultsDesc}
              </p>
            </div>
          ) : (
            displayedPros.map((pro) => (
              <div
                key={pro.id}
                onClick={() => {
                  setSelectedProId(pro.id);
                  navigate('pro_profile', { proId: pro.id });
                }}
                className="p-4 bg-white border border-[#E5EBE7] rounded-3xl hover:border-[#159447] hover:shadow-sm active:scale-99 transition-all cursor-pointer flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={pro.avatar}
                        alt={pro.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#E5EBE7]"
                      />
                      {pro.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#159447] text-white rounded-full flex items-center justify-center border-2 border-white">
                          <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-[#17231C]">{pro.name}</h4>
                      <p className="text-[11px] text-[#66736B] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#159447]" />
                        {pro.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#17231C]">
                          <Star className="w-3 h-3 fill-[#D99A2B] text-[#D99A2B]" />
                          <span>{pro.rating}</span>
                          <span className="text-[#66736B] font-normal">
                            ({pro.reviewsCount})
                          </span>
                        </div>
                        <span className="text-[10px] text-[#66736B]">•</span>
                        <span className="text-[10px] text-[#66736B]">
                          {pro.experienceYears} {t.yearsExperience}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {pro.isAvailable ? (
                      <span className="text-[10px] font-bold text-[#159447] bg-[#E8F6ED] px-2 py-0.5 rounded-full">
                        Disponib
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-[#66736B] bg-gray-100 px-2 py-0.5 rounded-full">
                        Okipe
                      </span>
                    )}
                    {pro.distanceMinutes && (
                      <span className="text-[10px] text-[#66736B] flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {pro.distanceMinutes} min lwen
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5EBE7]/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#66736B] block">Pri de baz</span>
                    <span className="text-xs font-extrabold text-[#159447]">
                      ${formatPrice(pro.startingPrice)} HTG
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#159447]">
                    <span>Gade pwofil</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
