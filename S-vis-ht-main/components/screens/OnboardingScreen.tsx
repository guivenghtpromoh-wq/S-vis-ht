'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { BrandLogo } from '../BrandLogo';
import { Language } from '@/lib/types';
import { ShieldCheck, MapPin, MessageCircle, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { navigate, language, setLanguage, t } = useApp();
  const [step, setStep] = useState<number>(0);

  const slides = [
    {
      title: t.onboarding1Title,
      subtitle: t.onboarding1Desc,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&auto=format&fit=crop&q=80',
      badgeText: 'Pwofesyonèl lokal serye',
    },
    {
      title: t.onboarding2Title,
      subtitle: t.onboarding2Desc,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80',
      badgeText: 'Elektrisite, Plonbri, Mekanik, Kou',
    },
    {
      title: t.onboarding3Title,
      subtitle: t.onboarding3Desc,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=80',
      badgeText: 'Evalyasyon & Pòtfolyo Reyèl',
    },
    {
      title: t.onboarding4Title,
      subtitle: t.onboarding4Desc,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=700&auto=format&fit=crop&q=80',
      badgeText: 'Rezève & Kominike Rapid',
    },
  ];

  const currentSlide = slides[step];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      navigate('home');
    }
  };

  const handleSkip = () => {
    navigate('home');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col justify-between p-5 max-w-md mx-auto relative select-none">
      {/* Top Header: Language Switcher & Skip */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1 bg-white border border-[#E5EBE7] rounded-full px-2.5 py-1 shadow-2xs">
          <span className="text-xs font-medium text-[#66736B]">🌐</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-xs font-semibold text-[#17231C] outline-none cursor-pointer"
          >
            <option value="ht">Kreyòl</option>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        {step < slides.length - 1 && (
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-[#66736B] hover:text-[#159447] px-2 py-1"
          >
            {t.btnSkip}
          </button>
        )}
      </div>

      {/* Main Illustration & Card Content */}
      <div className="my-auto flex flex-col items-center text-center">
        {step === 0 ? (
          <div className="w-full flex flex-col items-center">
            <BrandLogo size="lg" showTagline taglineText={t.tagline} className="mb-6" />
            
            {/* Hero Image Container */}
            <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-md border-4 border-white mb-6">
              <img
                src={currentSlide.image}
                alt="SÈVIS HT Pro"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl py-1.5 px-2.5 flex items-center justify-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#159447]" />
                <span className="text-[11px] font-bold text-[#17231C]">
                  {currentSlide.badgeText}
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-[#17231C] tracking-tight mb-2">
              {currentSlide.title}
            </h2>
            <p className="text-sm text-[#66736B] max-w-xs leading-relaxed">
              {currentSlide.subtitle}
            </p>

            {/* Core Trust Indicators from Reference Mockup */}
            <div className="grid grid-cols-2 gap-2 mt-6 w-full text-left">
              <div className="bg-white p-2.5 rounded-xl border border-[#E5EBE7] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#159447] shrink-0" />
                <span className="text-[11px] font-medium text-[#17231C]">Pwofesyonèl verifye</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#E5EBE7] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#159447] shrink-0" />
                <span className="text-[11px] font-medium text-[#17231C]">Zòn lokal ou</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#E5EBE7] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#159447] shrink-0" />
                <span className="text-[11px] font-medium text-[#17231C]">Kontak WhatsApp</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#E5EBE7] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#159447] shrink-0" />
                <span className="text-[11px] font-medium text-[#17231C]">MonCash • NatCash</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Step Illustration */}
            <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-md border-4 border-white mb-6">
              <img
                src={currentSlide.image}
                alt="Service showcase"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 bg-[#159447] text-white rounded-xl py-1.5 px-2.5 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold">{currentSlide.badgeText}</span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-[#17231C] tracking-tight mb-2">
              {currentSlide.title}
            </h2>
            <p className="text-sm text-[#66736B] max-w-xs leading-relaxed">
              {currentSlide.subtitle}
            </p>
          </div>
        )}

        {/* Carousel Indicators */}
        <div className="flex items-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === i ? 'w-6 bg-[#159447]' : 'w-2 bg-[#E5EBE7]'
              }`}
              aria-label={`Glise ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="w-full flex flex-col gap-2.5 pt-4 pb-2">
        {step === 0 ? (
          <>
            <button
              id="onboarding-btn-start"
              onClick={handleNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-bold text-sm shadow-md shadow-[#159447]/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>{t.btnStart}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              id="onboarding-btn-login"
              onClick={() => navigate('login')}
              className="w-full py-3 px-6 rounded-2xl bg-white hover:bg-[#F7F9F8] text-[#17231C] font-semibold text-sm border border-[#E5EBE7] active:scale-98 transition-all"
            >
              {t.btnLogin}
            </button>

            <button
              onClick={() => setStep(1)}
              className="text-xs font-medium text-[#159447] underline hover:text-[#0B7A3B] mt-1"
            >
              {t.howItWorks}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="py-3 px-5 rounded-2xl bg-white text-[#17231C] font-semibold text-sm border border-[#E5EBE7]"
              >
                Tounen
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-6 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-bold text-sm shadow-md shadow-[#159447]/20 flex items-center justify-center gap-2"
            >
              <span>{step === slides.length - 1 ? t.btnStart : t.btnNext}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
