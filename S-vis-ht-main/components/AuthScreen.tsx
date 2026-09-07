import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Wrench, Phone, Lock, User, Briefcase, MapPin, DollarSign, ArrowRight } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register, showToast } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [profession, setProfession] = useState('Elektriyen');
  const [location, setLocation] = useState('Pòtoprens');
  const [priceRate, setPriceRate] = useState('1500 HTG/h');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      showToast('Tanpri ranpli tout chan ki nesesè yo');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(phone, password);
        showToast('Koneksyon reyisi!');
      } else {
        if (!name) {
          showToast('Tanpri antre non ou');
          setLoading(false);
          return;
        }
        await register({
          name,
          phone,
          password,
          role,
          profession: role === 'provider' ? profession : undefined,
          location: role === 'provider' ? location : undefined,
          priceRate: role === 'provider' ? priceRate : undefined
        });
        showToast('Kont kreye ak siksè!');
      }
    } catch (err: any) {
      showToast(err?.message || 'Gen yon erè ki rive. Eskize nou!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col justify-center px-6 py-12 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#159447] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-md">
          <Wrench className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black text-[#17231C]">SÈVIS HT</h2>
        <p className="text-xs text-[#66736B] mt-1">Platfòm sèvis ak pwofesyonèl an Ayiti</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E5EBE7] shadow-sm">
        <div className="flex bg-[#F7F9F8] p-1 rounded-2xl mb-6 border border-[#E5EBE7]">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isLogin ? 'bg-white text-[#17231C] shadow-xs' : 'text-[#66736B]'
            }`}
          >
            Konekte
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isLogin ? 'bg-white text-[#17231C] shadow-xs' : 'text-[#66736B]'
            }`}
          >
            Kreye Kont
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-[#17231C] mb-1">Non Konplè</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#66736B] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Jean Baptiste"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-[#159447]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#17231C] mb-1">Jan de kont</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center ${
                      role === 'customer'
                        ? 'bg-[#159447]/10 border-[#159447] text-[#159447]'
                        : 'border-[#E5EBE7] text-[#66736B]'
                    }`}
                  >
                    Mwen se Kliyan
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('provider')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center ${
                      role === 'provider'
                        ? 'bg-[#159447]/10 border-[#159447] text-[#159447]'
                        : 'border-[#E5EBE7] text-[#66736B]'
                    }`}
                  >
                    Mwen se Pwofesyonèl
                  </button>
                </div>
              </div>

              {role === 'provider' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-[#17231C] mb-1">Metye / Sèvis</label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-[#66736B] absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Elektriyen, Plonbye, Mekanik..."
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-[#159447]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#17231C] mb-1">Vil / Zòn</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#66736B] absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Pòtoprens, Delmas, Okap..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-[#159447]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#17231C] mb-1">Tarif pa lera (HTG)</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-[#66736B] absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="1500 HTG/h"
                        value={priceRate}
                        onChange={(e) => setPriceRate(e.target.value)}
                        className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-[#159447]"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#17231C] mb-1">Nèmewo Telefòn</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#66736B] absolute left-3 top-3" />
              <input
                type="tel"
                placeholder="509 3400 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-[#159447]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#17231C] mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#66736B] absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-[#159447]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#159447] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-50 mt-4"
          >
            {loading ? 'N ap chaje...' : isLogin ? 'Konekte' : 'Kreye Kont'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
