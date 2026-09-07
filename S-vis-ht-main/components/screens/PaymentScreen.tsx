'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { formatPrice } from '@/lib/utils';
import {
  CreditCard,
  Phone,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const PaymentScreen: React.FC = () => {
  const {
    screenParams,
    user,
    updateRequestStatus,
    navigate,
    showToast,
    t,
  } = useApp();

  const requestId = screenParams?.requestId || 'req_1';
  const amount = screenParams?.amount || 2500;
  const proName = screenParams?.proName || 'John Elektrik';

  const [method, setMethod] = useState<'moncash' | 'natcash' | 'cash'>('moncash');
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txRef, setTxRef] = useState('TX-892143');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setTxRef(`TX-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSuccess(true);
      updateRequestStatus(requestId, 'completed');
      showToast(`Peman $${formatPrice(amount)} HTG reyisi!`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader
        title="Peye Sèvis la"
        onBack={() => navigate('request_details', { requestId })}
      />

      <div className="p-5 max-w-md mx-auto space-y-4">
        {!isSuccess ? (
          <>
            {/* Amount Banner */}
            <div className="bg-white p-5 rounded-3xl border border-[#E5EBE7] text-center shadow-2xs">
              <span className="text-xs font-bold text-[#66736B] uppercase tracking-wider">
                Montan pou w peye
              </span>
              <h2 className="text-3xl font-black text-[#159447] mt-1">
                ${formatPrice(amount)}{' '}
                <span className="text-sm font-bold text-[#17231C]">HTG</span>
              </h2>
              <p className="text-xs text-[#66736B] mt-1">
                Pou sèvis fini pa <strong>{proName}</strong>
              </p>
            </div>

            {/* Haitian Payment Methods Selection */}
            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-2">
                Chwazi metòd peman ou an Ayiti:
              </label>
              <div className="space-y-2.5">
                {/* MonCash */}
                <div
                  onClick={() => setMethod('moncash')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    method === 'moncash'
                      ? 'bg-[#E8F6ED] border-[#159447] shadow-xs'
                      : 'bg-white border-[#E5EBE7]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center">
                      MC
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#17231C]">
                        Digicel MonCash
                      </h4>
                      <p className="text-[11px] text-[#66736B]">
                        Peman dirèk ak kont MonCash ou
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={method === 'moncash'}
                    onChange={() => setMethod('moncash')}
                    className="accent-[#159447] w-4 h-4"
                  />
                </div>

                {/* NatCash */}
                <div
                  onClick={() => setMethod('natcash')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    method === 'natcash'
                      ? 'bg-[#E8F6ED] border-[#159447] shadow-xs'
                      : 'bg-white border-[#E5EBE7]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                      NC
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#17231C]">
                        Natcom NatCash
                      </h4>
                      <p className="text-[11px] text-[#66736B]">
                        Peman an sekirite ak pòtfèy NatCash
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={method === 'natcash'}
                    onChange={() => setMethod('natcash')}
                    className="accent-[#159447] w-4 h-4"
                  />
                </div>

                {/* Cash on site */}
                <div
                  onClick={() => setMethod('cash')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    method === 'cash'
                      ? 'bg-[#E8F6ED] border-[#159447] shadow-xs'
                      : 'bg-white border-[#E5EBE7]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#17231C]">
                        Lajan Kach (Men a Men)
                      </h4>
                      <p className="text-[11px] text-[#66736B]">
                        Remèt lajan an bay pwofesyonèl la sou plas
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={method === 'cash'}
                    onChange={() => setMethod('cash')}
                    className="accent-[#159447] w-4 h-4"
                  />
                </div>
              </div>
            </div>

            {/* Method specific inputs */}
            {(method === 'moncash' || method === 'natcash') && (
              <form onSubmit={handlePay} className="bg-white p-4 rounded-3xl border border-[#E5EBE7] space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#17231C] mb-1">
                    Nimewo telefòn {method === 'moncash' ? 'Digicel' : 'Natcom'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs">🇭🇹</span>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+509 4XXX XXXX"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17231C] mb-1">
                    Kòd PIN Sekrè
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full px-4 py-2.5 bg-[#F7F9F8] border border-[#E5EBE7] rounded-xl text-center text-base tracking-widest font-bold text-[#17231C] outline-none focus:border-[#159447]"
                    required
                  />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#66736B] pt-1">
                  <Lock className="w-3.5 h-3.5 text-[#159447]" />
                  <span>Tranzaksyon chifre ak sekirize 100%</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-2 py-3.5 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-[#159447]/20 active:scale-98 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Tretman an kou...</span>
                  ) : (
                    <span>
                      Peye ${formatPrice(amount)} HTG kounye a
                    </span>
                  )}
                </button>
              </form>
            )}

            {method === 'cash' && (
              <div className="bg-white p-4 rounded-3xl border border-[#E5EBE7] space-y-3">
                <p className="text-xs text-[#66736B] leading-relaxed">
                  Ou te chwazi peye an kach dirèk bay pwofesyonèl la. Tanpri asire ou
                  resevwa yon resi oswa konfime sou app a lè w fin peye l.
                </p>
                <button
                  onClick={handlePay}
                  className="w-full py-3.5 rounded-2xl bg-[#159447] text-white font-black text-xs shadow-md shadow-[#159447]/20"
                >
                  Konfime Mwen Peye an Kach
                </button>
              </div>
            )}
          </>
        ) : (
          /* Success Screen */
          <div className="bg-white rounded-3xl p-6 text-center border border-[#E5EBE7] space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#E8F6ED] text-[#159447] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#17231C]">Peman Konfime!</h3>
              <p className="text-xs text-[#66736B] mt-1">
                Lajan an transfere bay {proName} avèk siksè.
              </p>
            </div>

            <div className="p-3 bg-[#F7F9F8] rounded-2xl text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#66736B]">Referans:</span>
                <span className="font-bold text-[#17231C]">{txRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736B]">Metòd:</span>
                <span className="font-bold text-[#17231C] uppercase">{method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736B]">Total Peye:</span>
                <span className="font-bold text-[#159447]">${formatPrice(amount)} HTG</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => navigate('leave_review', { proId: screenParams?.proId || 'pro_1' })}
                className="w-full py-3 bg-[#159447] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Kite yon evalyasyon pou {proName}
              </button>
              <button
                onClick={() => navigate('requests_list')}
                className="w-full py-2.5 bg-[#F7F9F8] text-[#17231C] font-semibold text-xs rounded-xl"
              >
                Tounen nan lis demann yo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
