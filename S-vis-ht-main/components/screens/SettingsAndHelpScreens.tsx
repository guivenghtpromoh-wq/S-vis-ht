'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { Language } from '@/lib/types';
import {
  Globe,
  Bell,
  Moon,
  Shield,
  HelpCircle,
  MessageSquare,
  Phone,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { language, setLanguage, navigate, showToast, t } = useApp();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [whatsappNotifs, setWhatsappNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader title={t.settings} onBack={() => navigate('profile')} />

      <div className="p-5 max-w-md mx-auto space-y-4">
        {/* Language Selection */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-[#159447]" />
            <h4 className="text-xs font-black text-[#17231C]">Lang Aplikasyon an</h4>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { id: 'ht', label: 'Kreyòl' },
              { id: 'fr', label: 'Français' },
              { id: 'en', label: 'English' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id as Language);
                  showToast(`Lang chanje an ${lang.label}`);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  language === lang.id
                    ? 'bg-[#159447] text-white border-[#159447] shadow-xs'
                    : 'bg-white border-[#E5EBE7] text-[#17231C]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#159447]" />
            <h4 className="text-xs font-black text-[#17231C]">Notifikasyon</h4>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-[#17231C] block">Notifikasyon sou App</span>
                <span className="text-[10px] text-[#66736B]">Mizajou sou demann ak mesaj</span>
              </div>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="w-4 h-4 accent-[#159447]"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5EBE7]">
              <div>
                <span className="font-bold text-[#17231C] block">Alèt pa WhatsApp</span>
                <span className="text-[10px] text-[#66736B]">Resevwa rapèl ak konfimasyon</span>
              </div>
              <input
                type="checkbox"
                checked={whatsappNotifs}
                onChange={(e) => setWhatsappNotifs(e.target.checked)}
                className="w-4 h-4 accent-[#159447]"
              />
            </div>
          </div>
        </div>

        {/* Display Appearance */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Moon className="w-4 h-4 text-[#159447]" />
            <div>
              <h4 className="text-xs font-black text-[#17231C]">Mòd Nwa (Dark Mode)</h4>
              <span className="text-[10px] text-[#66736B]">Opsyon pou repoze je ou</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => {
              setDarkMode(e.target.checked);
              showToast('Mòd limyè optimal pou SÈVIS HT.');
            }}
            className="w-4 h-4 accent-[#159447]"
          />
        </div>

        {/* App Version Info */}
        <div className="text-center pt-4">
          <p className="text-xs font-black text-[#17231C]">SÈVIS HT v1.0.4</p>
          <p className="text-[10px] text-[#66736B] mt-0.5">
            Konstwi ak fyète pou Ayiti 🇭🇹 • Pòtoprens & tout depatman
          </p>
        </div>
      </div>
    </div>
  );
};

export const HelpCenterScreen: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketName, setTicketName] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'Kouman pou m mande yon sèvis sou SÈVIS HT?',
      a: 'Ou sèlman bezwen chwazi kategori sèvis la, gade pwofil pwofesyonèl ki nan zòn ou yo (egzanp Delmas, Pétion-Ville), chwazi sèvis espesifik la, epi peze "Mande sèvis". W ap chwazi dat ak lè ki bon pou ou.',
    },
    {
      q: 'Kouman peman an fèt?',
      a: 'Ou ka peye dirèkteman sou telefòn ou ak MonCash (Digicel), NatCash (Natcom), oswa bay pwofesyonèl la lajan kach apre li fin konplete travay la nèt e ou satisfè.',
    },
    {
      q: 'Èske pwofesyonèl yo verifye?',
      a: 'Wi! Tout pwofesyonèl ki gen badj vèt la te voye pyès idantite (CIN oswa Pasapò), verifye nimewo telefòn yo, epi ekip SÈVIS HT valide konpetans yo.',
    },
    {
      q: 'Sa pou m fè si gen yon pwoblèm nan travay la?',
      a: 'Nou gen yon garanti sèvis. Ou ka rapòte pwoblèm nan dirèkteman nan detay demann lan oswa ekri sipò a sou WhatsApp nan +509 4812 3456.',
    },
    {
      q: 'Kouman pou m vin yon pwofesyonèl sou platfòm lan?',
      a: 'Ale sou paj Pwofil ou, klike sou "Ou se yon pwofesyonèl? Chanje Mòd", epi konplete enfòmasyon sou travay ak zòn ou kouvri yo.',
    },
  ];

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Mesaj ou voye bay sipò SÈVIS HT avèk siksè!');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader title="Sant Èd & Sipò" onBack={() => navigate('profile')} />

      <div className="p-5 max-w-md mx-auto space-y-4">
        {/* Contact Direct via WhatsApp banner */}
        <div
          onClick={() => {
            window.open('https://wa.me/50948123456?text=Bonjou%20SÈVIS%20HT%20Sipò!', '_blank');
          }}
          className="bg-[#159447] text-white p-4 rounded-3xl flex items-center justify-between cursor-pointer shadow-md shadow-[#159447]/20 active:scale-98 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-black">Asistans Rapid sou WhatsApp</h4>
              <p className="text-[10px] text-white/90">+509 4812 3456 • Disponib 7j/7</p>
            </div>
          </div>
          <span className="text-xs font-black underline">Ekri</span>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] space-y-3 shadow-2xs">
          <h3 className="text-xs font-black text-[#17231C] uppercase tracking-wider">
            Kesyon Moun Poze Souvan (FAQ)
          </h3>

          <div className="divide-y divide-[#E5EBE7]/60">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div key={idx} className="py-2.5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs font-bold text-[#17231C] gap-2"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#159447] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#66736B] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="text-[11px] text-[#66736B] mt-2 leading-relaxed bg-[#F7F9F8] p-3 rounded-xl">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Support Ticket Form */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] space-y-3 shadow-2xs">
          <h3 className="text-xs font-black text-[#17231C] uppercase tracking-wider">
            Voye yon mesaj bay sipò a
          </h3>

          {!submitted ? (
            <form onSubmit={handleSendTicket} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#17231C] mb-1">
                  Non ou
                </label>
                <input
                  type="text"
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder="Michel Joseph"
                  className="w-full px-3 py-2 bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#17231C] mb-1">
                  Mesaj ou
                </label>
                <textarea
                  rows={3}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Eksplike kesyon oswa pwoblèm ou an..."
                  className="w-full p-3 bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447] resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#159447] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Voye Mesaj</span>
              </button>
            </form>
          ) : (
            <div className="p-4 bg-[#E8F6ED] rounded-2xl text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-[#159447] mx-auto" />
              <p className="text-xs font-bold text-[#159447]">Mesaj ou anrejistre!</p>
              <p className="text-[11px] text-[#66736B]">
                Ekip sipò SÈVIS HT ap reponn ou pa SMS oswa WhatsApp nan mwens pase 1 èdtan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
