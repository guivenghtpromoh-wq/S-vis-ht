import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { User, ShieldCheck, MapPin, Phone, Mail, LogOut, Edit3, Check } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, logout, updateProfile, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [location, setLocation] = useState(user?.location || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profession, setProfession] = useState(user?.profession || '');
  const [priceRate, setPriceRate] = useState(user?.priceRate || '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        location,
        phone,
        profession,
        priceRate,
      });
      setIsEditing(false);
      showToast('Profil ou mete ajou ak siksè!');
    } catch (err) {
      showToast('Gen yon erè lè w t ap mete ajou profil la.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none max-w-md mx-auto">
      <ScreenHeader title="Profil Mwen" showBack={false} />

      <div className="p-4 space-y-4">
        {/* Kat Enfòmasyon Prensipal */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5EBE7] text-center space-y-3 relative shadow-2xs">
          <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-[#159447]/20 bg-slate-100">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
              alt={user?.name} 
              className="w-full h-full object-cover" 
            />
          </div>

          <div>
            <div className="flex items-center justify-center gap-1">
              <h2 className="text-base font-black text-[#17231C]">{user?.name}</h2>
              <ShieldCheck className="w-4 h-4 text-[#159447]" />
            </div>
            <p className="text-xs font-bold text-[#159447] capitalize">{user?.role === 'provider' ? (user?.profession || 'Pwofesyonèl') : 'Itilizatè Kliyan'}</p>
          </div>

          <div className="flex justify-center gap-4 pt-2 border-t border-[#E5EBE7] text-xs text-[#66736B]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#159447]" />
              {user?.location || 'Ayiti'}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#159447]" />
              {user?.phone || 'Pa gen nimewo'}
            </span>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full mt-2 bg-[#F7F9F8] border border-[#E5EBE7] py-2 rounded-xl text-xs font-bold text-[#17231C] flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Anile' : 'Modifye Profil'}
          </button>
        </div>

        {/* Fòmilè Modifikasyon */}
        {isEditing && (
          <form onSubmit={handleSave} className="bg-white p-4 rounded-3xl border border-[#E5EBE7] space-y-3 shadow-2xs animate-in slide-in-from-top duration-200">
            <h3 className="text-xs font-bold text-[#17231C]">Mete enfòmasyon yo ajou</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] text-[#66736B] font-bold">Non konplè</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#66736B] font-bold">Lokalizasyon</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#66736B] font-bold">Telefòn (WhatsApp)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447]"
              />
            </div>

            {user?.role === 'provider' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] text-[#66736B] font-bold">Pwofesyon / Metye</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#66736B] font-bold">Pri / Tarifs (pa egzanp: 1500 HTG oswa Devis)</label>
                  <input
                    type="text"
                    value={priceRate}
                    onChange={(e) => setPriceRate(e.target.value)}
                    className="w-full bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#159447]"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-[#159447] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Check className="w-4 h-4" />
              Anrejistre chanjman yo
            </button>
          </form>
        )}

        {/* Bouton Dekonekte */}
        <button
          onClick={logout}
          className="w-full bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <LogOut className="w-4 h-4" />
          Dekonekte kont mwen
        </button>
      </div>
    </div>
  );
};
