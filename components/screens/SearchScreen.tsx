'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { formatPrice } from '@/lib/utils';
import {
  Search,
  X,
  Star,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const { pros, categories, navigate, setSelectedProId, t, screenParams } = useApp();
  const [query, setQuery] = useState(screenParams?.query || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price' | 'experience'>('recommended');
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);

  const popularSearches = [
    'Elektrisyen Delmas',
    'Fuit dlo twalèt',
    'Reparasyon dèlko',
    'Pwofesè Matematik',
    'Èkondisyone frechè',
    'Enstalasyon Starlink',
  ];

  // Filter pros
  let results = pros.filter((pro) => {
    const matchesQuery =
      !query.trim() ||
      pro.name.toLowerCase().includes(query.toLowerCase()) ||
      pro.categoryName.toLowerCase().includes(query.toLowerCase()) ||
      pro.location.toLowerCase().includes(query.toLowerCase()) ||
      pro.about.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || pro.categorySlug === selectedCategory;

    const matchesVerified = !verifiedOnly || pro.isVerified;

    return matchesQuery && matchesCategory && matchesVerified;
  });

  // Sort
  if (sortBy === 'rating') {
    results = [...results].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'price') {
    results = [...results].sort((a, b) => a.startingPrice - b.startingPrice);
  } else if (sortBy === 'experience') {
    results = [...results].sort((a, b) => b.experienceYears - a.experienceYears);
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader
        title={t.searchTitle}
        showBack={false}
        rightAction={
          <button
            onClick={() => setShowFiltersModal(true)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
              verifiedOnly || selectedCategory !== 'all' || sortBy !== 'recommended'
                ? 'bg-[#159447] text-white border-[#159447]'
                : 'bg-white border-[#E5EBE7] text-[#17231C]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        }
      />

      <div className="p-5 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#66736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-main-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chèche sèvis, pwofesyonèl, zòn..."
            className="w-full pl-10 pr-9 py-3 bg-white border border-[#E5EBE7] rounded-2xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447] shadow-2xs transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66736B] hover:text-[#17231C]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#159447] text-white shadow-xs'
                : 'bg-white border border-[#E5EBE7] text-[#66736B]'
            }`}
          >
            {t.filterAll}
          </button>
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? 'bg-[#159447] text-white shadow-xs'
                  : 'bg-white border border-[#E5EBE7] text-[#66736B]'
              }`}
            >
              {cat.nameHt}
            </button>
          ))}
        </div>

        {/* If no active query, show popular search suggestions */}
        {!query.trim() && (
          <div className="bg-white border border-[#E5EBE7] rounded-3xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17231C]">
              <TrendingUp className="w-4 h-4 text-[#159447]" />
              <span>{t.popularSearches}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(item)}
                  className="px-3 py-1.5 bg-[#F7F9F8] hover:bg-[#E8F6ED] text-[#17231C] hover:text-[#159447] text-xs font-medium rounded-xl transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count & Sort indicator */}
        <div className="flex items-center justify-between text-xs text-[#66736B] pt-1">
          <span>
            <strong className="text-[#17231C]">{results.length}</strong> pwofesyonèl jwenn
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-bold text-[#159447] outline-none cursor-pointer"
          >
            <option value="recommended">Rekòmande</option>
            <option value="rating">Pi wo rated</option>
            <option value="price">Pri pi ba</option>
            <option value="experience">Plis eksperyans</option>
          </select>
        </div>

        {/* Results List */}
        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#E5EBE7]">
              <div className="w-14 h-14 bg-[#E8F6ED] rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                🔎
              </div>
              <h4 className="text-sm font-bold text-[#17231C]">{t.noResultsTitle}</h4>
              <p className="text-xs text-[#66736B] mt-1 max-w-xs mx-auto">
                {t.noResultsDesc}
              </p>
            </div>
          ) : (
            results.map((pro) => (
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
                    <div className="relative shrink-0">
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
                      <p className="text-[11px] text-[#66736B] font-medium">{pro.categoryName}</p>
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
                        {pro.distanceMinutes} min
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5EBE7]/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#66736B] block">Estimasyon kòmanse</span>
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

      {/* Advanced Filter Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE7]">
              <h3 className="font-extrabold text-[#17231C] text-base">Filtè avanse</h3>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="w-8 h-8 rounded-full bg-[#F7F9F8] flex items-center justify-center text-[#66736B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-[#17231C] block mb-2">
                  Verifye sèlman
                </label>
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                    verifiedOnly
                      ? 'bg-[#E8F6ED] border-[#159447] text-[#159447]'
                      : 'bg-white border-[#E5EBE7] text-[#17231C]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159447]" />
                    Pwofesyonèl ak badj idantite verifye
                  </span>
                  <span className="font-bold">{verifiedOnly ? 'WI' : 'NON'}</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-[#17231C] block mb-2">
                  Triye pa
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'recommended', label: 'Rekòmande' },
                    { id: 'rating', label: 'Pi wo rated' },
                    { id: 'price', label: 'Pi bon pri' },
                    { id: 'experience', label: 'Eksperyans' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSortBy(s.id as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                        sortBy === s.id
                          ? 'bg-[#159447] text-white border-[#159447]'
                          : 'bg-white border-[#E5EBE7] text-[#17231C]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5EBE7] flex items-center gap-3">
              <button
                onClick={() => {
                  setVerifiedOnly(false);
                  setSelectedCategory('all');
                  setSortBy('recommended');
                  setShowFiltersModal(false);
                }}
                className="py-3 px-4 bg-[#F7F9F8] text-[#66736B] rounded-2xl text-xs font-bold"
              >
                Re-inisye
              </button>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="flex-1 py-3 px-4 bg-[#159447] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#159447]/20"
              >
                Aplike filtè yo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
