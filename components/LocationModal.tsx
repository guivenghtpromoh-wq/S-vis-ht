'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { HAITIAN_ZONES } from '@/lib/mock-data';
import { MapPin, X, Check } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { currentLocation, setLocation } = useApp();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = HAITIAN_ZONES.filter((z) =>
    z.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE7]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#159447]" />
            <h3 className="font-extrabold text-[#17231C] text-base">Chwazi zòn ou an Ayiti</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F9F8] flex items-center justify-center text-[#66736B] hover:text-[#17231C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Chèche yon komin oswa katye (Eg. Delmas, Pétion-Ville)..."
            className="w-full px-3.5 py-2.5 bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447]"
          />
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-[#E5EBE7]/60">
          {filtered.map((zone) => {
            const isSelected = zone === currentLocation;
            return (
              <button
                key={zone}
                onClick={() => {
                  setLocation(zone);
                  onClose();
                }}
                className={`w-full py-3 px-3 flex items-center justify-between text-left rounded-xl transition-colors ${
                  isSelected ? 'bg-[#E8F6ED] text-[#159447] font-bold' : 'hover:bg-[#F7F9F8] text-[#17231C]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">📍</span>
                  <span className="text-xs font-medium">{zone}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#159447]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
