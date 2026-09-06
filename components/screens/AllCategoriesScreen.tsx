'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { CategoryIcon } from '../CategoryIcon';
import { Search, ChevronRight } from 'lucide-react';

export const AllCategoriesScreen: React.FC = () => {
  const { categories, navigate, t } = useApp();
  const [search, setSearch] = useState('');

  const filtered = categories.filter(
    (c) =>
      c.nameHt.toLowerCase().includes(search.toLowerCase()) ||
      c.nameFr.toLowerCase().includes(search.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader title={t.allCategories} onBack={() => navigate('home')} />

      <div className="p-5">
        {/* Search Field */}
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-[#66736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchServicePlaceholder}
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5EBE7] rounded-2xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447] shadow-2xs transition-all"
          />
        </div>

        {/* 20 Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate('category_details', { categorySlug: cat.slug })}
              className="p-3.5 bg-white border border-[#E5EBE7] rounded-2xl hover:border-[#159447] hover:shadow-xs active:scale-98 transition-all flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#E8F6ED] group-hover:bg-[#159447] flex items-center justify-center shrink-0 transition-colors">
                  <CategoryIcon
                    iconName={cat.icon}
                    size={20}
                    className="w-5 h-5 text-[#159447] group-hover:text-white transition-colors"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-[#17231C] truncate group-hover:text-[#159447] transition-colors">
                    {cat.nameHt}
                  </h4>
                  <p className="text-[10px] text-[#66736B] truncate">
                    {cat.count} {t.prosAvailable}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#66736B] shrink-0 group-hover:text-[#159447]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
