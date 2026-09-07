import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ShieldCheck, MapPin, MessageCircle, CreditCard, ArrowRight, Lock, Phone, User as UserIcon, Briefcase } from 'lucide-[#159447]' ? 'lucide-react' : 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register, showToast } = useApp();
  const [step, setStep] = useState<'welcome' | 'login' | 'register'>('welcome');
  
  // Form states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('Delmas 33');
  const [priceRate, setPriceRate] = useState('1500 HTG/h');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      showToast('Tanpri ranpli tout chan yo');
      return;
    }
    setLoading(true);
    try {
      await login(phone, password);
      showToast('Ou konekte ak siksè!');
    } catch (err) {
      showToast('Nimewo oswa modpas pa korèk');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !password) {
      showToast('Tanpri ranpli tout chan yo');
      return;
    }
    setLoading(true);
    try {
      await register({ name, phone, password, role, profession, location, priceRate });
      showToast('Kont ou kreye ak siksè!');
    } catch (err) {
      showToast('Gen yon erè ki rive pandan enskripsyon an');
    } finally {
      setLoading(false);
    }
  };

  // 1. EKRAN WELCOME / ONBOARDING (Premye imaj makèt)
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between p-6 select-none max-w-md mx-auto">
        <div className="pt-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-[#159447] rounded-xl flex items-center justify-center text-white font-black text-xl">
              S
            </div>
            <h1 className="text-2xl font-black text-[#17231C]">SÈVIS <span className="text-[#159447]">HT</span></h1>
          </div>
          <p className="text-xs text-[#66736B]">Jwenn pwofesyonèl ou bezwen, toupre w, rapid e fasil.</p>
        </div>

        {/* Foto ak Karakteristik yo */}
        <div className="my-6 space-y-6">
          <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#E5EBE7] h-52">
            <img 
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600" 
              alt="Sèvis HT Pwofesyonèl" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-bold">Pwofesyonèl kalifye nan tout peyi a</span>
            </div>
          </div>

          <div className="space-y-3 bg-[#F7F9F8] p-4 rounded-2xl border border-[#E5EBE7]">
            <div className="flex items-center gap-3 text-xs font-semibold text-[#17231C]">
              <div className="w-6 h-6 rounded-full bg-[#159447]/10 text-[#159447] flex items-center justify-center">✓</div>
              <span>Pwofesyonèl verifye</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#17231C]">
              <div className="w-6 h-6 rounded-full bg-[#159447]/10 text-[#159447] flex items-center justify-center">✓</div>
              <span>Zòn lokal ou</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#17231C]">
              <div className="w-6 h-6 rounded-full bg-[#159447]/10 text-[#159447] flex items-center justify-center">✓</div>
              <span>Kontak dirèk (WhatsApp & Chat)</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#17231C]">
              <div className="w-6 h-6 rounded-full bg-[#159447]/10 text-[#159447] flex items-center justify-center">✓</div>
              <span>Peman an sekirite (MonCash • NatCash)</span>
            </div>
          </div>
        </div>

        {/* Bouton Aksyon yo */}
        <div className="space-y-2.5 pb-4">
          <button
            onClick={() => setStep('register')}
            className="w-full bg-[#159447] text-white py-3 rounded-2xl font-bold text-xs shadow-sm active:scale-98 transition-transform"
          >
            Kòmanse
          </button>
          <button
            onClick={() => setStep('login')}
            className="w-full bg-white text-[#17231C] border border-[#E5EBE7] py-3 rounded-2xl font-bold text-xs active:scale-98 transition-transform"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // 2. EKRAN LOGIN (Dezyèm imaj makèt)
  if (step === 'login') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between p-6 select-none max-w-md mx-auto">
        <div>
          <div className="pt-4 pb-6">
            <h2 className="text-xl font-black text-[#17231C]">Bonjou! 👋</h2>
            <p className="text-xs text-[#66736B] mt-1">Kontinye konekte pou itilize SÈVIS HT</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#17231C] mb-1.5">Nimewo telefòn</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-[#66736B] border-r border-[#E5EBE7] pr-2">+509</span>
                <input
                  type="tel"
                  placeholder="3742 8156"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl pl-16 pr-3 py-2.5 text-xs outline-none focus:border-[#159447] font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#17231C] mb-1.5">Modpas</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#159447]"
              />
              <div className="text-right mt-1.5">
                <button type="button" className="text-[10px] text-[#159447] font-bold hover:underline">
                  Ou bliye modpas ou?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#159447] text-white py-3 rounded-2xl font-bold text-xs shadow-sm active:scale-98 transition-transform disabled:opacity-50 mt-2"
            >
              {loading ? 'Koneksyon...' : 'Login'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5EBE7]"></div>
            <span className="text-[10px] text-[#66736B] font-semibold">Oswa</span>
            <div className="flex-1 h-px bg-[#E5EBE7]"></div>
          </div>

          <button
            type="button"
            className="w-full bg-white border border-[#E5EBE7] text-[#17231C] py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Kontinye ak Google
          </button>
        </div>

        <div className="text-center pt-6 pb-2">
          <p className="text-xs text-[#66736B]">
            Pa gen kont?{' '}
            <button onClick={() => setStep('register')} className="text-[#159447] font-bold hover:underline">
              Kreyo yon kont
            </button>
          </p>
        </div>
      </div>
    );
  }

  // 3. EKRAN REGISTRATION / ENSKRIPSYON
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-6 select-none max-w-md mx-auto">
      <div>
        <div className="pt-2 pb-4">
          <h2 className="text-xl font-black text-[#17231C]">Kreye kont ou 📝</h2>
          <p className="text-xs text-[#66736B] mt-1">Antre enfòmasyon w yo pou w kòmanse</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-[#17231C] mb-1">Non ak Siyen</label>
            <input
              type="text"
              placeholder="Eg: Michel Jean"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#17231C] mb-1">Nimewo telefòn</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-[#66736B] border-r border-[#E5EBE7] pr-2">+509</span>
              <input
                type="tel"
                placeholder="3742 8156"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl pl-16 pr-3 py-2 text-xs outline-none focus:border-[#159447]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#17231C] mb-1">Modpas</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447]"
            />
          </div>

          {/* Ròl: Kliyan oswa Pwofesyonèl */}
          <div>
            <label className="block text-[11px] font-bold text-[#17231C] mb-1">Tip de kont</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  role === 'customer'
                    ? 'border-[#159447] bg-[#159447]/10 text-[#159447]'
                    : 'border-[#E5EBE7] bg-[#F7F9F8] text-[#66736B]'
                }`}
              >
                Mwen se Kliyan
              </button>
              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  role === 'provider'
                    ? 'border-[#159447] bg-[#159447]/10 text-[#159447]'
                    : 'border-[#E5EBE7] bg-[#F7F9F8] text-[#66736B]'
                }`}
              >
                Mwen se Pwofesyonèl
              </button>
            </div>
          </div>

          {role === 'provider' && (
            <div className="space-y-2 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-[#17231C] mb-1">Metye / Sèvis</label>
                <input
                  type="text"
                  placeholder="Eg: Elektriyen, Plonbye..."
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#17231C] mb-1">Zòn</label>
                  <input
                    type="text"
                    placeholder="Delmas"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#17231C] mb-1">Prix (HTG/h)</label>
                  <input
                    type="text"
                    placeholder="1500 HTG/h"
                    value={priceRate}
                    onChange={(e) => setPriceRate(e.target.value)}
                    className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447]"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#159447] text-white py-3 rounded-2xl font-bold text-xs shadow-sm active:scale-98 transition-transform disabled:opacity-50 mt-3"
          >
            {loading ? 'Kreyasyon...' : 'Kreye Kont lan'}
          </button>
        </form>
      </div>

      <div className="text-center pt-4 pb-2">
        <p className="text-xs text-[#66736B]">
          Ou gen yon kont deja?{' '}
          <button onClick={() => setStep('login')} className="text-[#159447] font-bold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};
