import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { Search, SlidersHorizontal, Star, ShieldCheck, MapPin, X, UserX } from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const { providers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Tout', 'Elektriyen', 'Plonbye', 'Mekanisyen', 'Design grafik'];

  const filteredProviders = providers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.profession && p.profession.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || selectedCategory === 'Tout' || p.profession === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none max-w-md mx-auto">
      <ScreenHeader title="Chèche pwofesyonèl" showBack={true} />

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white border border-[#E5EBE7] px-3.5 py-2.5 rounded-2xl flex items-center gap-2 shadow-2xs">
            <Search className="w-4 h-4 text-[#66736B]" />
            <input
              type="text"
              placeholder="Chèche yon pwofesyon oswa non..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-[#17231C] outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}>
                <X className="w-3.5 h-3.5 text-[#66736B]" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'Tout' ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                (selectedCategory === cat || (!selectedCategory && cat === 'Tout'))
                  ? 'bg-[#159447] text-white shadow-2xs'
                  : 'bg-white border border-[#E5EBE7] text-[#66736B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3 pt-1">
          <p className="text-[11px] font-bold text-[#66736B]">{filteredProviders.length} rezilta jwenn</p>

          {filteredProviders.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-[#E5EBE7] text-center space-y-2">
              <UserX className="w-8 h-8 text-[#66736B] mx-auto" />
              <p className="text-xs font-bold text-[#17231C]">Okenn pwofesyonèl pa jwenn</p>
              <p className="text-[10px] text-[#66736B]">Pa gen okenn pwofesyonèl ki enskri nan kategori sa a pou kounye a.</p>
            </div>
          ) : (
            filteredProviders.map((pro) => (
              <div
                key={pro.id}
                className="bg-white p-3.5 rounded-2xl border border-[#E5EBE7] flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={pro.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                    alt={pro.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-[#E5EBE7]"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-[#17231C]">{pro.name}</h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#159447]" />
                    </div>
                    <p className="text-[10px] text-[#66736B]">{pro.profession || 'Pwofesyonèl'}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[9px] text-[#66736B]">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" /> {pro.location || 'Ayiti'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-500" /> 5.0
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-[#159447] block">{pro.priceRate || 'Devis'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
