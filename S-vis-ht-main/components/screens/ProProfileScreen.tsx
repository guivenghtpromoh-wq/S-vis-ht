'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { formatPrice } from '@/lib/utils';
import {
  Star,
  MapPin,
  CheckCircle2,
  Shield,
  Zap,
  Phone,
  MessageSquare,
  Bookmark,
  Share2,
  Calendar,
  Check,
  ChevronRight,
} from 'lucide-react';

export const ProProfileScreen: React.FC = () => {
  const {
    screenParams,
    pros,
    reviews,
    user,
    toggleSavePro,
    navigate,
    showToast,
    t,
  } = useApp();

  const proId = screenParams?.proId || 'pro_1';
  const pro = pros.find((p) => p.id === proId) || pros[0];
  const proReviews = reviews.filter((r) => r.proId === pro.id);

  const [activeTab, setActiveTab] = useState<'services' | 'about' | 'portfolio' | 'reviews'>('services');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isSaved = user.savedProIds.includes(pro.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Lyen pwofil la kopye nan papye-près ou!');
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Bonjou ${pro.name}! Mwen jwenn pwofil ou sou SÈVIS HT. Mwen ta renmen konnen si ou disponib pou yon travay.`
    );
    window.open(`https://wa.me/${pro.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-28 select-none">
      {/* Cover Image & Header */}
      <div className="relative h-48 sm:h-56 w-full bg-slate-900">
        <img
          src={pro.coverImage}
          alt={pro.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

        <div className="absolute top-0 left-0 right-0">
          <ScreenHeader
            title=""
            transparent
            onBack={() => navigate('home')}
            rightAction={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  aria-label="Pataje"
                  className="w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleSavePro(pro.id)}
                  aria-label="Anrejistre"
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    isSaved
                      ? 'bg-[#159447] text-white'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                </button>
              </div>
            }
          />
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="px-5 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-5 border border-[#E5EBE7] shadow-sm">
          <div className="flex items-start justify-between">
            <div className="relative -mt-12">
              <img
                src={pro.avatar}
                alt={pro.name}
                className="w-20 h-20 rounded-3xl object-cover border-4 border-white shadow-md"
              />
              {pro.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#159447] text-white rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#159447]" />
              <span className="text-xs font-bold text-[#159447]">
                {pro.isAvailable ? 'Disponib kounye a' : 'Okipe'}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#17231C] tracking-tight">{pro.name}</h2>
              {pro.isVerified && (
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Verifye
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-[#66736B] mt-0.5">{pro.title}</p>
          </div>

          {/* Rating, Reviews & Experience */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#E5EBE7]/60 text-xs">
            <div className="flex items-center gap-1 font-extrabold text-[#17231C]">
              <Star className="w-3.5 h-3.5 fill-[#D99A2B] text-[#D99A2B]" />
              <span>{pro.rating}</span>
              <span className="text-[#66736B] font-normal">
                ({pro.reviewsCount} evalyasyon)
              </span>
            </div>
            <span className="text-[#66736B]">•</span>
            <span className="text-[#66736B] font-medium">
              {pro.experienceYears} {t.yearsExperience}
            </span>
          </div>

          {/* Location with "Gade sou kat" */}
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#66736B]">
              <MapPin className="w-3.5 h-3.5 text-[#159447] shrink-0" />
              <span className="truncate">{pro.fullAddress}</span>
            </div>
            <button
              onClick={() => showToast(`Kote ${pro.name} ye sou kat Delmas la.`)}
              className="text-[11px] font-bold text-[#159447] hover:underline shrink-0"
            >
              Gade sou kat
            </button>
          </div>

          {/* Badges row matching Image 1: [✓ Verifye] [🛡️ Asirans] [⚡ Fè Rapid] */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#E5EBE7]/60">
            <div className="bg-[#E8F6ED] rounded-xl p-2 flex items-center justify-center gap-1 text-[11px] font-bold text-[#159447]">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Verifye</span>
            </div>
            <div className="bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl p-2 flex items-center justify-center gap-1 text-[11px] font-bold text-[#17231C]">
              <Shield className="w-3.5 h-3.5 text-[#159447]" />
              <span>Asirans</span>
            </div>
            <div className="bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl p-2 flex items-center justify-center gap-1 text-[11px] font-bold text-[#17231C]">
              <Zap className="w-3.5 h-3.5 text-[#D99A2B]" />
              <span>Fè Rapid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="px-5 mt-4">
        <div className="bg-white border border-[#E5EBE7] rounded-2xl p-1 flex items-center justify-between">
          {[
            { id: 'services', label: 'Sèvis li ofri' },
            { id: 'about', label: 'Konsènan' },
            { id: 'portfolio', label: 'Pòtfolyo' },
            { id: 'reviews', label: `Kòmantè (${proReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === tab.id
                  ? 'bg-[#159447] text-white shadow-xs'
                  : 'text-[#66736B] hover:text-[#17231C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="px-5 mt-4 space-y-4">
        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#17231C] uppercase tracking-wider">
              Lis sèvis ak tarif
            </h3>
            {pro.services.map((srv: any) => (
              <div
                key={srv.id}
                className="bg-white p-4 rounded-2xl border border-[#E5EBE7] flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-[#17231C]">{srv.name}</h4>
                  <p className="text-[11px] text-[#66736B] mt-1 leading-relaxed">
                    {srv.description}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-[#159447] bg-[#E8F6ED] px-2 py-0.5 rounded-md">
                    ⏱️ Dire: {srv.duration}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-[#159447] block">
                    ${formatPrice(srv.price)} HTG
                  </span>
                  <button
                    onClick={() =>
                      navigate('request_flow', {
                        proId: pro.id,
                        selectedServiceId: srv.id,
                      })
                    }
                    className="mt-2 px-3 py-1 bg-[#159447] text-white text-[11px] font-bold rounded-xl active:scale-95 shadow-2xs"
                  >
                    Mande
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="bg-white p-5 rounded-3xl border border-[#E5EBE7] space-y-4">
            <div>
              <h3 className="text-xs font-extrabold text-[#17231C] uppercase tracking-wider mb-2">
                Biyografi
              </h3>
              <p className="text-xs text-[#17231C] leading-relaxed">{pro.about}</p>
            </div>

            <div className="pt-3 border-t border-[#E5EBE7]">
              <h3 className="text-xs font-extrabold text-[#17231C] uppercase tracking-wider mb-2">
                Zòn li kouvri
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {pro.serviceAreas.map((area: any, idx: any) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#F7F9F8] border border-[#E5EBE7] text-[11px] font-medium text-[#17231C] rounded-lg"
                  >
                    📍 {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5EBE7] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#66736B]">Travay konplete</span>
                <p className="text-sm font-black text-[#17231C]">
                  {pro.completedJobsCount} travay fini
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#66736B]">Eksperyans</span>
                <p className="text-sm font-black text-[#17231C]">
                  {pro.experienceYears} ane
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#17231C] uppercase tracking-wider">
              Travay ak reyalizasyon
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {pro.portfolio.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item.image)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5EBE7] cursor-pointer group shadow-2xs"
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-md">
                      {item.date}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-xs font-extrabold text-[#17231C] truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-[#66736B] line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#17231C] uppercase tracking-wider">
                Evalyasyon kliyan yo
              </h3>
              <button
                onClick={() => navigate('leave_review', { proId: pro.id })}
                className="text-xs font-bold text-[#159447] hover:underline"
              >
                + Kite yon avi
              </button>
            </div>

            {proReviews.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl text-center border border-[#E5EBE7]">
                <p className="text-xs text-[#66736B]">Pa gen kòmantè pou kounye a.</p>
              </div>
            ) : (
              proReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-4 rounded-2xl border border-[#E5EBE7] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.customerAvatar}
                        alt={rev.customerName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-[#17231C]">
                        {rev.customerName}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#66736B]">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= rev.rating
                            ? 'fill-[#D99A2B] text-[#D99A2B]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-[#17231C] leading-relaxed">{rev.comment}</p>

                  {rev.proResponse && (
                    <div className="bg-[#F7F9F8] border-l-2 border-[#159447] p-2.5 rounded-r-xl text-[11px]">
                      <span className="font-bold text-[#159447] block">
                        Repons {pro.name}:
                      </span>
                      <p className="text-[#66736B] mt-0.5">{rev.proResponse}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Sticky Action Bar matching Image 1 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5EBE7] px-5 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {/* WhatsApp Direct Action Button */}
          <button
            id="pro-whatsapp-btn"
            onClick={openWhatsApp}
            className="flex-1 py-3 px-4 rounded-2xl border-2 border-[#159447] text-[#159447] font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#E8F6ED] active:scale-98 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-[#159447]" />
            <span>WhatsApp</span>
          </button>

          {/* Solid Primary Green Request Service Button */}
          <button
            id="pro-request-service-btn"
            onClick={() => navigate('request_flow', { proId: pro.id })}
            className="flex-[1.4] py-3 px-4 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-[#159447]/25 active:scale-98 transition-all"
          >
            <Calendar className="w-4 h-4 stroke-[2.5]" />
            <span>Mande sèvis</span>
          </button>
        </div>
      </div>

      {/* Modal for viewing full portfolio image */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-sm w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-80 object-cover"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="w-full py-3 bg-[#17231C] text-white text-xs font-bold text-center"
            >
              Fèmen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
