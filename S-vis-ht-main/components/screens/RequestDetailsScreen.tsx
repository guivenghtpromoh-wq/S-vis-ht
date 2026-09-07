'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { RequestStatus } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  CreditCard,
  Star,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

export const RequestDetailsScreen: React.FC = () => {
  const {
    screenParams,
    requests,
    pros,
    updateRequestStatus,
    navigate,
    showToast,
  } = useApp();

  const requestId = screenParams?.requestId || 'req_1';
  const request = requests.find((r) => r.id === requestId) || requests[0];
  const pro = pros.find((p) => p.id === request.proId) || pros[0];

  const steps: { label: string; status: RequestStatus; desc: string }[] = [
    { label: 'Demann voye', status: 'pending', desc: 'Nou voye demann nan bay pro a' },
    { label: 'Aksepte', status: 'accepted', desc: 'Pwofesyonèl la konfime randevou a' },
    { label: 'Nan travay', status: 'in_progress', desc: 'Pwofesyonèl la sou plas la k ap travay' },
    { label: 'Fini & Konplete', status: 'completed', desc: 'Travay la fini kòrèkteman' },
  ];

  const getStepIndex = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'accepted':
        return 1;
      case 'in_progress':
        return 2;
      case 'completed':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(request.status);

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Bonjou ${pro.name}! M ap kontakte w konsènan demann #${request.id} sou SÈVIS HT.`
    );
    window.open(`https://wa.me/${pro.whatsapp}?text=${text}`, '_blank');
  };

  const handleCancel = () => {
    updateRequestStatus(request.id, 'cancelled');
    showToast('Demann lan anile.');
  };

  const handleComplete = () => {
    updateRequestStatus(request.id, 'completed');
    showToast('Travay la make kòm fini!');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader
        title={`Demann ${request.id}`}
        onBack={() => navigate('requests_list')}
      />

      <div className="p-5 space-y-4">
        {/* Status Timeline */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5EBE7] shadow-2xs">
          <h3 className="text-xs font-extrabold text-[#17231C] uppercase tracking-wider mb-4">
            Estati Demann lan
          </h3>

          {request.status === 'cancelled' ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
              <XCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="text-xs font-bold">Demann sa a anile</p>
                <p className="text-[11px] text-red-600 mt-0.5">
                  Ou ka toujou chwazi yon lòt sèvis oswa kontakte sipò a.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 relative">
              {/* Vertical timeline connector */}
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-[#E5EBE7]" />

              {steps.map((st, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div key={st.label} className="flex items-start gap-3 relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isPassed
                          ? 'bg-[#159447] text-white ring-4 ring-[#E8F6ED]'
                          : 'bg-white border-2 border-[#E5EBE7] text-[#66736B]'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-black ${
                          isCurrent
                            ? 'text-[#159447]'
                            : isPassed
                            ? 'text-[#17231C]'
                            : 'text-[#66736B]'
                        }`}
                      >
                        {st.label}
                      </h4>
                      <p className="text-[11px] text-[#66736B]">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pro Card */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={pro.avatar}
                alt={pro.name}
                className="w-12 h-12 rounded-2xl object-cover border border-[#E5EBE7]"
              />
              <div>
                <h4 className="text-xs font-black text-[#17231C]">{pro.name}</h4>
                <p className="text-[11px] text-[#66736B]">{pro.title}</p>
                <span className="text-[10px] text-[#159447] font-bold">
                  ★ {pro.rating} • Verifye
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('pro_profile', { proId: pro.id })}
              className="text-[11px] font-bold text-[#159447] hover:underline"
            >
              Pwofil
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={openWhatsApp}
              className="py-2.5 px-3 rounded-xl border border-[#159447] text-[#159447] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#E8F6ED]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => {
                window.open(`tel:${pro.phone}`);
              }}
              className="py-2.5 px-3 rounded-xl bg-[#F7F9F8] border border-[#E5EBE7] text-[#17231C] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-100"
            >
              <Phone className="w-3.5 h-3.5 text-[#159447]" />
              <span>Rele</span>
            </button>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5EBE7] space-y-3 shadow-2xs text-xs">
          <h3 className="font-extrabold text-[#17231C] uppercase tracking-wider text-[11px]">
            Detay Travay la
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#66736B]">Sèvis:</span>
              <span className="font-bold text-[#17231C]">{request.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736B]">Dat:</span>
              <span className="font-bold text-[#17231C]">{request.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736B]">Lè:</span>
              <span className="font-bold text-[#17231C]">{request.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736B]">Adrès:</span>
              <span className="font-bold text-[#17231C] text-right truncate max-w-[180px]">
                {request.address}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#E5EBE7]">
              <span className="text-[#66736B]">Deskripsyon:</span>
              <p className="font-medium text-[#17231C] text-right max-w-[200px] line-clamp-2">
                {request.description}
              </p>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#E5EBE7]">
              <span className="font-bold text-[#17231C]">Montan:</span>
              <span className="font-black text-sm text-[#159447]">
                ${formatPrice(request.priceEstimate || request.estimatedPrice || 0)} HTG
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {request.status === 'in_progress' && (
            <button
              onClick={handleComplete}
              className="w-full py-3.5 bg-[#159447] text-white font-black text-xs rounded-2xl shadow-md shadow-[#159447]/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Make kòm travay fini</span>
            </button>
          )}

          {request.status === 'completed' && (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() =>
                  navigate('payment', {
                    requestId: request.id,
                    amount: request.priceEstimate || request.estimatedPrice || 0,
                    proName: pro.name,
                  })
                }
                className="py-3.5 bg-[#159447] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-[#159447]/20"
              >
                <CreditCard className="w-4 h-4" />
                <span>Peye sèvis la</span>
              </button>
              <button
                onClick={() => navigate('leave_review', { proId: pro.id })}
                className="py-3.5 bg-white border border-[#E5EBE7] text-[#17231C] font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5"
              >
                <Star className="w-4 h-4 text-[#D99A2B]" />
                <span>Kite avi</span>
              </button>
            </div>
          )}

          {['pending', 'accepted'].includes(request.status) && (
            <button
              onClick={handleCancel}
              className="w-full py-3 bg-white border border-red-200 text-red-600 font-bold text-xs rounded-2xl hover:bg-red-50"
            >
              Anile demann sa a
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
