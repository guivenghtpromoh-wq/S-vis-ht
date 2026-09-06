'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Bookmark,
  CreditCard,
  Settings,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Camera,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    pros,
    logout,
    toggleRole,
    navigate,
    showToast,
    t,
  } = useApp();

  const savedPros = pros.filter((p) => user.savedProIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader title={t.profileTitle} showBack={false} />

      <div className="p-5 space-y-4">
        {/* User Card Header matching visual reference */}
        <div className="bg-white rounded-3xl p-5 border border-[#E5EBE7] shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#159447] shadow-xs"
              />
              <button
                onClick={() => navigate('edit_profile')}
                className="absolute bottom-0 right-0 w-6 h-6 bg-[#159447] text-white rounded-full flex items-center justify-center shadow-xs text-xs"
              >
                ✎
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-[#17231C] truncate">
                  {user.name}
                </h3>
                <CheckCircle2 className="w-4 h-4 text-[#159447] shrink-0" />
              </div>
              <p className="text-xs text-[#66736B] truncate mt-0.5">{user.phone}</p>
              <span className="inline-block mt-1 text-[10px] font-bold text-[#159447] bg-[#E8F6ED] px-2 py-0.5 rounded-md">
                🇭🇹 Manm SÈVIS HT
              </span>
            </div>
          </div>
        </div>

        {/* Switch to Professional Mode Banner (Section 18) */}
        <div className="bg-gradient-to-r from-[#159447] to-[#0B7A3B] p-4 rounded-3xl text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-black">
                {user.role === 'customer' ? 'Ou se yon pwofesyonèl?' : 'Mòd Pwofesyonèl Aktif'}
              </h4>
              <p className="text-[10px] text-white/85">
                {user.role === 'customer'
                  ? 'Kòmanse resevwa travay ak kliyan nan zòn ou.'
                  : 'Jere demann ak disponiblite w.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (user.role === 'customer') {
                toggleRole();
                navigate('pro_dashboard');
              } else {
                navigate('pro_dashboard');
              }
            }}
            className="px-3.5 py-1.5 bg-white text-[#159447] text-xs font-bold rounded-xl active:scale-95 shadow-xs"
          >
            {user.role === 'customer' ? 'Chanje Mòd' : 'Tablo Bò'}
          </button>
        </div>

        {/* Menu Items List */}
        <div className="bg-white rounded-3xl border border-[#E5EBE7] divide-y divide-[#E5EBE7]/70 shadow-2xs overflow-hidden">
          <button
            onClick={() => navigate('edit_profile')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#F7F9F8] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F7F9F8] flex items-center justify-center text-[#159447]">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17231C] block">
                  Enfòmasyon pèsonèl
                </span>
                <span className="text-[10px] text-[#66736B]">Non, telefòn, imèl</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#66736B]" />
          </button>

          <button
            onClick={() => showToast(`Adrès ou aktyèl: ${user.address}`)}
            className="w-full p-4 flex items-center justify-between hover:bg-[#F7F9F8] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F7F9F8] flex items-center justify-center text-[#159447]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17231C] block">
                  Adrès mwen yo
                </span>
                <span className="text-[10px] text-[#66736B]">{user.address}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#66736B]" />
          </button>

          <button
            onClick={() => showToast(`Ou gen ${savedPros.length} pwofesyonèl favori.`)}
            className="w-full p-4 flex items-center justify-between hover:bg-[#F7F9F8] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F7F9F8] flex items-center justify-center text-[#159447]">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17231C] block">
                  Pwofesyonèl anrejistre
                </span>
                <span className="text-[10px] text-[#66736B]">
                  {savedPros.length} moun favori
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#66736B]" />
          </button>

          <button
            onClick={() => navigate('settings')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#F7F9F8] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F7F9F8] flex items-center justify-center text-[#159447]">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17231C] block">
                  {t.settings}
                </span>
                <span className="text-[10px] text-[#66736B]">Lang, notifikasyon</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#66736B]" />
          </button>

          <button
            onClick={() => navigate('help_center')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#F7F9F8] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F7F9F8] flex items-center justify-center text-[#159447]">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#17231C] block">
                  Sant Èd & Sipò
                </span>
                <span className="text-[10px] text-[#66736B]">FAQ ak kontak</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#66736B]" />
          </button>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="w-full p-3.5 bg-white border border-red-200 text-red-600 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-red-50 transition-colors shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>
    </div>
  );
};

export const EditProfileScreen: React.FC = () => {
  const { user, updateUserProfile, navigate, showToast } = useApp();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email || '');
  const [address, setAddress] = useState(user.address || 'Delmas 33, Pòtoprens');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, email, address });
    showToast('Pwofil ou mete ajou avèk siksè!');
    navigate('profile');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader title="Modifye Pwofil" onBack={() => navigate('profile')} />

      <div className="p-5 max-w-md mx-auto">
        <form onSubmit={handleSave} className="bg-white p-5 rounded-3xl border border-[#E5EBE7] space-y-4 shadow-2xs">
          {/* Avatar simulation */}
          <div className="flex flex-col items-center justify-center pb-2">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#159447]"
              />
              <button
                type="button"
                onClick={() => showToast('Chanje foto pwofil')}
                className="absolute bottom-0 right-0 w-7 h-7 bg-[#159447] text-white rounded-full flex items-center justify-center border-2 border-white shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[11px] text-[#66736B] mt-2 font-medium">Chanje foto</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1">Non Konplè</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1">Telefòn</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1">Imèl</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1">Adrès / Zòn</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447]"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-bold text-xs shadow-md shadow-[#159447]/20"
          >
            Anrejistre Modifikasyon yo
          </button>
        </form>
      </div>
    </div>
  );
};
