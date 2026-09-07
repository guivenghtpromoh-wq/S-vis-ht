import React, { useEffect, useState } from 'react';
import { useApp, User } from '@/lib/store';
import { Search, MapPin, ShieldCheck, Star, Bell, ArrowRight, Phone, UserPlus } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { user, providers, listenToProviders, navigate, createRequest, showToast } = useApp();
  const [selectedPro, setSelectedPro] = useState<User | null>(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToProviders();
    return () => unsubscribe();
  }, [listenToProviders]);

  const categories = [
    { id: 'elektrik', name: 'Elektriyen', icon: '⚡' },
    { id: 'plonbri', name: 'Plonbye', icon: '🔧' },
    { id: 'mekanik', name: 'Mekanisyen', icon: '🚗' },
    { id: 'design', name: 'Design grafik', icon: '🎨' },
  ];

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPro || !serviceTitle || !description) {
      showToast('Tanpri ranpli tout chan yo');
      return;
    }

    setLoading(true);
    try {
      await createRequest(selectedPro.id, serviceTitle, description);
      showToast('Demann ou an voye ak siksè!');
      setSelectedPro(null);
      setServiceTitle('');
      setDescription('');
    } catch (err) {
      showToast('Gen yon erè ki rive lè w ap voye demann lan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none max-w-md mx-auto">
      {/* 1. ANTÈT AKÈY */}
      <div className="p-4 bg-white border-b border-[#E5EBE7] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#66736B]">Bonjou,</span>
            <h1 className="text-lg font-black text-[#17231C]">{user?.name || 'Michel Givenji'} 👋</h1>
          </div>
          <button 
            onClick={() => navigate('notifications' as any)}
            className="w-9 h-9 rounded-full bg-[#F7F9F8] border border-[#E5EBE7] flex items-center justify-center text-[#17231C]"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* Chèche Sèvis */}
        <div 
          onClick={() => navigate('search')}
          className="bg-[#F7F9F8] border border-[#E5EBE7] p-3 rounded-2xl flex items-center justify-between cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2.5 text-[#66736B] text-xs">
            <Search className="w-4 h-4 text-[#66736B]" />
            <span>Ki sèvis ou bezwen?</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#66736B]" />
        </div>

        {/* Lokalizasyon */}
        <div className="bg-[#F7F9F8] border border-[#E5EBE7] p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#159447]/10 text-[#159447] flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[9px] text-[#66736B] uppercase font-bold">Kote ou ye?</p>
              <p className="text-xs font-bold text-[#17231C]">{user?.location || 'Port-au-Prince, Ayiti'}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#66736B]" />
        </div>
      </div>

      {/* 2. BANNER SÈVIS RAPID (Ranplase ble a ak Vèt pwofesyonèl) */}
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-r from-[#159447] to-[#12793B] text-white p-5 rounded-3xl shadow-sm relative overflow-hidden">
          <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">SÈVIS RAPID AK SERYE</span>
          <h2 className="text-base font-black mt-2 leading-tight">Jwenn yon pwofesyonèl ki toupre ou</h2>
          <p className="text-[11px] text-white/90 mt-1">Dekouvri moun ki disponib pou ede w ak sèvis ou bezwen an.</p>
          <button 
            onClick={() => navigate('search')}
            className="mt-3 bg-white text-[#159447] text-xs font-bold px-4 py-2 rounded-xl shadow-xs active:scale-95 transition-transform"
          >
            Eksplore sèvis yo
          </button>
        </div>

        {/* 3. KATEGORI SÈVIS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#17231C]">Kategori sèvis</h3>
            <button onClick={() => navigate('search')} className="text-[11px] text-[#159447] font-bold">Tout kategori</button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => navigate('search')}
                className="bg-white border border-[#E5EBE7] p-3 rounded-2xl text-center space-y-1.5 cursor-pointer active:scale-95 transition-transform shadow-2xs"
              >
                <div className="text-2xl">{cat.icon}</div>
                <p className="text-[10px] font-bold text-[#17231C] truncate">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. LIS PWOFESYONÈL */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#17231C]">Pwofesyonèl toupre w</h3>
            <button onClick={() => navigate('search')} className="text-[11px] text-[#159447] font-bold">Wi tout ({providers.length})</button>
          </div>

          {providers.length === 0 ? (
            <div className="bg-white p-6 rounded-3xl border border-[#E5EBE7] text-center space-y-2 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-[#159447]/10 text-[#159447] flex items-center justify-center mx-auto">
                <UserPlus className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#17231C]">Pwofesyonèl ki disponib</p>
              <p className="text-[10px] text-[#66736B]">Isit la w ap jwenn tout moun ki enskri kòm founisè sèvis pou ede w koulye a.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {providers.map((pro) => (
                <div 
                  key={pro.id} 
                  onClick={() => setSelectedPro(pro)}
                  className="bg-white p-3.5 rounded-2xl border border-[#E5EBE7] flex items-center justify-between cursor-pointer active:bg-[#F7F9F8] transition-colors shadow-2xs"
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
                        <span>{pro.location || 'Port-au-Prince'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-500" /> 5.0
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-[#159447] block">{pro.priceRate || 'Devis'}</span>
                    <span className="text-[9px] text-[#159447] bg-[#159447]/10 px-2 py-0.5 rounded-md font-bold mt-1 inline-block">Disponib</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. MODAL DETAY PWOFESYONÈL */}
      {selectedPro && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="relative h-40 rounded-2xl overflow-hidden -mx-1 -mt-1 bg-slate-100">
              <img 
                src={selectedPro.avatar || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'} 
                alt={selectedPro.name} 
                className="w-full h-full object-cover" 
              />
              <button 
                onClick={() => setSelectedPro(null)}
                className="absolute top-3 right-3 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black text-[#17231C]">{selectedPro.name}</h3>
                  <ShieldCheck className="w-4 h-4 text-[#159447]" />
                </div>
                <span className="text-xs font-black text-[#159447]">{selectedPro.priceRate || 'Devis'}</span>
              </div>
              <p className="text-xs font-semibold text-[#159447]">{selectedPro.profession || 'Pwofesyonèl'}</p>
              
              <div className="flex items-center gap-3 mt-2 text-[10px] text-[#66736B]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedPro.location || 'Port-au-Prince'}
                </span>
                <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-500" />
                  5.0
                </span>
              </div>
            </div>

            {/* Fòmilè voye demann */}
            <form onSubmit={handleSendRequest} className="space-y-3 pt-2 border-t border-[#E5EBE7]">
              <h4 className="text-[11px] font-bold text-[#17231C]">Mande yon sèvis</h4>
              <input
                type="text"
                placeholder="Tit sèvis la (pa egzanp: Reparasyon fil elektrik)"
                value={serviceTitle}
                onChange={(e) => setServiceTitle(e.target.value)}
                className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447]"
              />
              <textarea
                rows={2}
                placeholder="Eksplike byen sa w bezwen an..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447] resize-none"
              />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://wa.me/${selectedPro.phone?.replace(/[^0-9]/g, '') || '50937428156'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#159447] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-50"
                >
                  {loading ? 'Voye...' : 'Mande sèvis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
