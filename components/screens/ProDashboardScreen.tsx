'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { formatPrice } from '@/lib/utils';
import {
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  DollarSign,
  Plus,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const ProDashboardScreen: React.FC = () => {
  const {
    user,
    pros,
    requests,
    updateRequestStatus,
    toggleRole,
    navigate,
    showToast,
  } = useApp();

  // Pick the first pro or pro matching user
  const pro = pros[0];
  const [isAvailable, setIsAvailable] = useState(pro.isAvailable);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const activeRequests = requests.filter((r) => ['accepted', 'in_progress'].includes(r.status));

  const handleToggleAvailability = () => {
    setIsAvailable(!isAvailable);
    showToast(!isAvailable ? 'Ou disponib pou resevwa travay!' : 'Ou pase an mòd okipe.');
  };

  const handleAcceptRequest = (id: string) => {
    updateRequestStatus(id, 'accepted');
    showToast('Ou aksepte demann lan!');
  };

  const handleRejectRequest = (id: string) => {
    updateRequestStatus(id, 'cancelled');
    showToast('Demann lan refize.');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader
        title="Tablo Bò Pwofesyonèl"
        onBack={() => navigate('profile')}
        rightAction={
          <button
            onClick={() => {
              toggleRole();
              navigate('profile');
            }}
            className="text-xs font-bold text-[#159447] bg-[#E8F6ED] px-3 py-1.5 rounded-full"
          >
            Mòd Kliyan
          </button>
        }
      />

      <div className="p-5 space-y-4">
        {/* Availability Switch Card */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                isAvailable ? 'bg-[#159447] animate-pulse' : 'bg-gray-400'
              }`}
            />
            <div>
              <h4 className="text-xs font-black text-[#17231C]">
                {isAvailable ? 'Ou disponib pou travay' : 'Ou pa disponib kounye a'}
              </h4>
              <p className="text-[10px] text-[#66736B]">
                {isAvailable
                  ? 'Kliyan nan Delmas 33 ka wè w sou kat la'
                  : 'Pwofil ou pa parèt nan rechèch aktif'}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleAvailability}
            className={`w-12 h-7 rounded-full p-1 transition-colors flex items-center ${
              isAvailable ? 'bg-[#159447] justify-end' : 'bg-gray-300 justify-start'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white shadow-xs block" />
          </button>
        </div>

        {/* 4 Performance Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#E8F6ED] text-[#159447] flex items-center justify-center mb-2">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-[#66736B] font-bold block uppercase tracking-wider">
              Revni Mwa sa a
            </span>
            <h3 className="text-lg font-black text-[#159447] mt-0.5">
              $48,500 <span className="text-[10px] text-[#17231C]">HTG</span>
            </h3>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-[#66736B] font-bold block uppercase tracking-wider">
              Travay Fini
            </span>
            <h3 className="text-lg font-black text-[#17231C] mt-0.5">
              {pro.completedJobsCount}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-[#66736B] font-bold block uppercase tracking-wider">
              Nouvo Demann
            </span>
            <h3 className="text-lg font-black text-[#17231C] mt-0.5">
              {pendingRequests.length}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-[#66736B] font-bold block uppercase tracking-wider">
              Pwofil Gade
            </span>
            <h3 className="text-lg font-black text-[#17231C] mt-0.5">342 fwa</h3>
          </div>
        </div>

        {/* Incoming Pending Requests (Pro can Accept / Reject) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-[#17231C] uppercase tracking-wider">
              Demann k ap tann repons ou ({pendingRequests.length})
            </h3>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-5 text-center border border-[#E5EBE7]">
              <p className="text-xs text-[#66736B]">Pa gen nouvo demann k ap tann.</p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-4 rounded-3xl border border-[#159447]/40 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#159447] bg-[#E8F6ED] px-2 py-0.5 rounded-md">
                    NOUVO • {req.id}
                  </span>
                  <span className="text-xs font-black text-[#17231C]">
                    ${formatPrice(req.priceEstimate)} HTG
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-[#17231C]">{req.serviceName}</h4>
                  <p className="text-xs text-[#66736B] mt-0.5">{req.description}</p>
                  <p className="text-[11px] text-[#17231C] font-semibold mt-1">
                    📍 {req.address} • 🗓️ {req.date} ({req.timeSlot})
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E5EBE7]">
                  <button
                    onClick={() => handleRejectRequest(req.id)}
                    className="py-2.5 px-3 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50"
                  >
                    Refize
                  </button>
                  <button
                    onClick={() => handleAcceptRequest(req.id)}
                    className="py-2.5 px-3 rounded-xl bg-[#159447] text-white font-bold text-xs shadow-xs hover:bg-[#0B7A3B]"
                  >
                    Aksepte Travay
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Active Jobs in Progress */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-extrabold text-[#17231C] uppercase tracking-wider">
            Travay an kou ({activeRequests.length})
          </h3>

          {activeRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-4 rounded-2xl border border-[#E5EBE7] flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-black text-[#17231C]">{req.serviceName}</h4>
                <p className="text-[11px] text-[#66736B]">
                  📍 {req.address} • {req.timeSlot}
                </p>
              </div>
              <button
                onClick={() => {
                  updateRequestStatus(req.id, 'completed');
                  showToast('Travay la fini!');
                }}
                className="px-3 py-1.5 bg-[#159447] text-white text-[11px] font-bold rounded-xl"
              >
                Make fini
              </button>
            </div>
          ))}
        </div>

        {/* Manage Services Button */}
        <button
          onClick={() => showToast('Ou ka ajoute oswa modifye tarif sèvis ou yo.')}
          className="w-full py-3.5 bg-white border border-[#E5EBE7] text-[#17231C] font-bold text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-[#F7F9F8]"
        >
          <Plus className="w-4 h-4 text-[#159447]" />
          <span>Ajoute yon nouvo sèvis nan pwofil ou</span>
        </button>
      </div>
    </div>
  );
};
