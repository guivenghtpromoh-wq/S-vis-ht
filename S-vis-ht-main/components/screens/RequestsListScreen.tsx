'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { RequestStatus } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
} from 'lucide-react';

export const RequestsListScreen: React.FC = () => {
  const { requests, pros, navigate, t } = useApp();
  const [tab, setTab] = useState<'all' | 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'>('all');

  const filtered = requests.filter((r) => {
    if (tab === 'all') return true;
    return r.status === tab;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D99A2B]/15 text-[#D99A2B]">
            An atant
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
            Aksepte
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700">
            Nan travay
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#159447]/15 text-[#159447]">
            Fini
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700">
            Anile
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader
        title={t.myRequestsTitle}
        showBack={false}
        rightAction={
          <button
            onClick={() => navigate('search')}
            className="w-8 h-8 rounded-full bg-[#159447] text-white flex items-center justify-center shadow-xs"
            aria-label="Nouvo demann"
          >
            <Plus className="w-4 h-4" />
          </button>
        }
      />

      <div className="p-5 space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'Tout' },
            { id: 'pending', label: 'An atant' },
            { id: 'accepted', label: 'Aksepte' },
            { id: 'in_progress', label: 'Nan travay' },
            { id: 'completed', label: 'Fini' },
            { id: 'cancelled', label: 'Anile' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                tab === item.id
                  ? 'bg-[#159447] text-white shadow-xs'
                  : 'bg-white border border-[#E5EBE7] text-[#66736B]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#E5EBE7] space-y-3">
              <div className="w-16 h-16 bg-[#E8F6ED] rounded-full flex items-center justify-center mx-auto text-2xl">
                📋
              </div>
              <h4 className="text-sm font-bold text-[#17231C]">
                Pa gen okenn demann nan seksyon sa a
              </h4>
              <p className="text-xs text-[#66736B] max-w-xs mx-auto">
                Chwazi yon pwofesyonèl pou mande yon sèvis rapid lakay ou.
              </p>
              <button
                onClick={() => navigate('search')}
                className="mt-2 px-5 py-2.5 bg-[#159447] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Chèche yon pwofesyonèl
              </button>
            </div>
          ) : (
            filtered.map((req) => {
              const pro = pros.find((p) => p.id === req.proId);

              return (
                <div
                  key={req.id}
                  onClick={() => navigate('request_details', { requestId: req.id })}
                  className="p-4 bg-white border border-[#E5EBE7] rounded-3xl hover:border-[#159447] hover:shadow-xs active:scale-99 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[#66736B] uppercase tracking-wider">
                      {req.id}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={pro?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'}
                      alt={pro?.name || 'Pro'}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#E5EBE7]"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-[#17231C] truncate">
                        {req.serviceName}
                      </h4>
                      <p className="text-[11px] text-[#66736B] truncate">
                        {pro?.name} • {pro?.categoryName}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5EBE7]/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-[#66736B] text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#159447]" />
                        {req.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#159447]" />
                        {req.timeSlot.split(' - ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-extrabold text-[#159447]">
                      <span>${formatPrice(req.priceEstimate || req.estimatedPrice || 0)} HTG</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#66736B]" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
