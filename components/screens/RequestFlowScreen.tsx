'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ScreenHeader } from '../ScreenHeader';
import { formatPrice } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const RequestFlowScreen: React.FC = () => {
  const {
    screenParams,
    pros,
    currentLocation,
    createRequest,
    navigate,
    t,
  } = useApp();

  const proId = screenParams?.proId || 'pro_1';
  const pro = pros.find((p) => p.id === proId) || pros[0];

  const defaultService =
    pro.services.find((s) => s.id === screenParams?.selectedServiceId) ||
    pro.services[0];

  // Flow State
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState(defaultService);
  const [description, setDescription] = useState(
    'Disjonktè prensipal kay la ap sote depi maten lè nou limen frijidè a.'
  );
  const [address, setAddress] = useState(currentLocation);
  const [selectedDate, setSelectedDate] = useState('2026-09-05');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('08:00 AM - 10:00 AM');
  const [isUrgent, setIsUrgent] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
  ]);
  const [createdRequestId, setCreatedRequestId] = useState<string>('');

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
  ];

  const handleSimulateUpload = () => {
    setUploadedPhotos((prev) => [
      ...prev,
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    ]);
  };

  const handleConfirmOrder = () => {
    const newReq = createRequest({
      proId: pro.id,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      description,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      address,
      estimatedPrice: isUrgent
        ? selectedService.price + 500
        : selectedService.price,
      isUrgent,
      photos: uploadedPhotos,
    });
    setCreatedRequestId(newReq.id);
    setStep(4); // Success step
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] pb-24 select-none">
      <ScreenHeader
        title={step === 4 ? 'Konfimasyon Demann' : `Mande sèvis ak ${pro.name}`}
        onBack={() => {
          if (step > 1 && step < 4) setStep(step - 1);
          else navigate('pro_profile', { proId: pro.id });
        }}
      />

      {/* Progress Bar (Steps 1 to 3) */}
      {step < 4 && (
        <div className="px-5 pt-3 pb-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#66736B] mb-1.5">
            <span className={step >= 1 ? 'text-[#159447]' : ''}>1. Detay</span>
            <span className={step >= 2 ? 'text-[#159447]' : ''}>2. Dat & Lè</span>
            <span className={step >= 3 ? 'text-[#159447]' : ''}>3. Rezime</span>
          </div>
          <div className="w-full h-1.5 bg-[#E5EBE7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#159447] transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 1: Select Service, Describe Problem & Address */}
      {step === 1 && (
        <div className="p-5 space-y-4">
          {/* Pro mini card */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E5EBE7] flex items-center gap-3">
            <img
              src={pro.avatar}
              alt={pro.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h4 className="text-xs font-black text-[#17231C]">{pro.name}</h4>
              <p className="text-[11px] text-[#66736B]">{pro.title}</p>
              <span className="text-[10px] text-[#159447] font-bold">
                ★ {pro.rating} • {pro.completedJobsCount} travay fini
              </span>
            </div>
          </div>

          {/* Service selection */}
          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-2">
              Chwazi sèvis espesifik ou bezwen an:
            </label>
            <div className="space-y-2">
              {pro.services.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedService.id === srv.id
                      ? 'bg-[#E8F6ED] border-[#159447] shadow-xs'
                      : 'bg-white border-[#E5EBE7] hover:border-gray-300'
                  }`}
                >
                  <div>
                    <h5 className="text-xs font-bold text-[#17231C]">{srv.name}</h5>
                    <p className="text-[10px] text-[#66736B] mt-0.5">
                      Dire: {srv.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#159447]">
                      ${formatPrice(srv.price)} HTG
                    </span>
                    <input
                      type="radio"
                      checked={selectedService.id === srv.id}
                      onChange={() => setSelectedService(srv)}
                      className="ml-2 accent-[#159447]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description of Problem */}
          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1.5">
              Dekri pwoblèm nan an detay:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Eksplike sa k pase a, aparèy ki konsène a..."
              className="w-full p-3 bg-white border border-[#E5EBE7] rounded-2xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447] resize-none"
            />
          </div>

          {/* Address field */}
          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1.5">
              Adrès egzak kote travay la ap fèt:
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#159447] absolute left-3 top-3" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ri, nimewo, katye (Eg: Delmas 33, Ri Siloe #14)"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E5EBE7] rounded-xl text-xs font-medium text-[#17231C] outline-none focus:border-[#159447]"
              />
            </div>
          </div>

          {/* Photos upload simulator */}
          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1.5">
              Ajoute foto pwoblèm nan (opsyonèl):
            </label>
            <div className="flex items-center gap-2 overflow-x-auto">
              {uploadedPhotos.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E5EBE7] shrink-0"
                >
                  <img src={url} alt="Problem" className="w-full h-full object-cover" />
                </div>
              ))}
              <button
                type="button"
                onClick={handleSimulateUpload}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-[#159447] bg-[#E8F6ED]/40 flex flex-col items-center justify-center text-[#159447] text-[10px] font-bold shrink-0 active:scale-95"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                Ajoute
              </button>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full mt-2 py-3.5 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#159447]/20"
          >
            <span>Kontinye nan Dat & Lè</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Date & Time Selection */}
      {step === 2 && (
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#159447]" />
              Chwazi Dat Entèvansyon an:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E5EBE7] rounded-2xl text-xs font-bold text-[#17231C] outline-none focus:border-[#159447]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#159447]" />
              Chwazi Lè ki bon pou ou:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all ${
                    selectedTimeSlot === slot
                      ? 'bg-[#159447] text-white border-[#159447] shadow-xs'
                      : 'bg-white border-[#E5EBE7] text-[#17231C] hover:border-gray-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency Toggle */}
          <div className="p-4 bg-white border border-[#E5EBE7] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className={`w-5 h-5 ${isUrgent ? 'text-[#D94A4A]' : 'text-[#66736B]'}`} />
              <div>
                <h5 className="text-xs font-bold text-[#17231C]">
                  Demann Ijan (Express)
                </h5>
                <p className="text-[10px] text-[#66736B]">
                  Pwofesyonèl la vin pi rapid (+500 HTG)
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-5 h-5 accent-[#159447] rounded-xs cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="py-3 px-5 rounded-2xl bg-white border border-[#E5EBE7] text-[#17231C] text-xs font-bold"
            >
              Tounen
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#159447]/20"
            >
              <span>Verifye Rezime a</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Summary & Final Order */}
      {step === 3 && (
        <div className="p-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E5EBE7] space-y-3.5 shadow-2xs">
            <h3 className="text-xs font-extrabold text-[#17231C] uppercase tracking-wider pb-2 border-b border-[#E5EBE7]">
              Rezime demann lan
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={pro.avatar}
                alt={pro.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-xs font-black text-[#17231C]">{pro.name}</h4>
                <p className="text-[11px] text-[#66736B]">{selectedService.name}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center justify-between text-[#66736B]">
                <span>Dat:</span>
                <span className="font-bold text-[#17231C]">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between text-[#66736B]">
                <span>Lè:</span>
                <span className="font-bold text-[#17231C]">{selectedTimeSlot}</span>
              </div>
              <div className="flex items-center justify-between text-[#66736B]">
                <span>Adrès:</span>
                <span className="font-bold text-[#17231C] truncate max-w-[200px]">
                  {address}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#66736B]">
                <span>Nivo Ijans:</span>
                <span
                  className={`font-bold ${
                    isUrgent ? 'text-[#D94A4A]' : 'text-[#159447]'
                  }`}
                >
                  {isUrgent ? 'Ijan (+500 HTG)' : 'Nòmal'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5EBE7] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#66736B] block">Pri total estimasyon</span>
                <span className="text-sm font-black text-[#159447]">
                  ${formatPrice(isUrgent ? selectedService.price + 500 : selectedService.price)} HTG
                </span>
              </div>
              <span className="text-[10px] text-[#66736B] bg-[#F7F9F8] px-2 py-1 rounded-md">
                Peman apre sèvis la fini
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#E8F6ED] rounded-2xl flex items-center gap-2.5 text-xs text-[#159447] font-semibold">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>
              Garanti SÈVIS HT: Pwofesyonèl la pa resevwa lajan an toutotan travay la
              pa fèt kòrèkteman.
            </span>
          </div>

          <button
            id="btn-confirm-request"
            onClick={handleConfirmOrder}
            className="w-full py-4 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#159447]/25 active:scale-98 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Konfime & Voye Demann lan</span>
          </button>
        </div>
      )}

      {/* Step 4: Success Screen */}
      {step === 4 && (
        <div className="p-6 text-center space-y-5 my-auto max-w-sm mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#E8F6ED] text-[#159447] flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-[#159447]/10 text-[#159447] rounded-full text-xs font-extrabold mb-2">
              KÒD: {createdRequestId || 'SHT-8821'}
            </span>
            <h2 className="text-xl font-black text-[#17231C]">
              Demann ou an voye avèk siksè!
            </h2>
            <p className="text-xs text-[#66736B] mt-2 leading-relaxed">
              Nou avèti <strong>{pro.name}</strong> sou demann ou an. Li genyen kèk
              minit pou l konfime disponiblite li.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E5EBE7] text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#66736B]">Sèvis:</span>
              <span className="font-bold text-[#17231C]">{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736B]">Dat & Lè:</span>
              <span className="font-bold text-[#17231C]">
                {selectedDate} ({selectedTimeSlot.split(' - ')[0]})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66736B]">Estimasyon:</span>
              <span className="font-bold text-[#159447]">
                ${formatPrice(isUrgent ? selectedService.price + 500 : selectedService.price)} HTG
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => navigate('requests_list')}
              className="w-full py-3.5 bg-[#159447] hover:bg-[#0B7A3B] text-white font-bold text-xs rounded-2xl shadow-md shadow-[#159447]/20"
            >
              Gade demann mwen yo
            </button>
            <button
              onClick={() => navigate('home')}
              className="w-full py-3 bg-white border border-[#E5EBE7] text-[#17231C] font-semibold text-xs rounded-2xl"
            >
              Tounen nan Akèy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
