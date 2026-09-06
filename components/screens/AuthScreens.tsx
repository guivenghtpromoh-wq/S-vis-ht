'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { BrandLogo } from '../BrandLogo';
import { ScreenHeader } from '../ScreenHeader';
import { Eye, EyeOff, Check, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, navigate, t, language, setLanguage } = useApp();
  const [phone, setPhone] = useState('+509 4812 3456');
  const [password, setPassword] = useState('pwofesyonel123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Tanpri mete nimewo telefòn ou');
      return;
    }
    login(phone, password);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col justify-between p-5 max-w-md mx-auto">
      {/* Top bar with Language Selector */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => navigate('home')}
          className="text-xs font-semibold text-[#66736B] hover:text-[#159447]"
        >
          Sote pou kounye a
        </button>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          className="bg-white border border-[#E5EBE7] text-xs font-semibold text-[#17231C] rounded-full px-2.5 py-1 outline-none shadow-2xs"
        >
          <option value="ht">Kreyòl</option>
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="my-auto">
        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo size="md" className="mb-4" />
          <h2 className="text-2xl font-black text-[#17231C] tracking-tight">
            {t.greetingMorning}! 👋
          </h2>
          <p className="text-sm text-[#66736B] mt-1">{t.loginTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-[#D94A4A]/10 border border-[#D94A4A]/30 text-[#D94A4A] text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1.5">
              {t.phoneLabel}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm font-semibold text-[#66736B]">🇭🇹</span>
              <input
                id="login-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+509 4XX XXX XXX"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5EBE7] focus:border-[#159447] focus:ring-2 focus:ring-[#159447]/20 rounded-2xl text-sm font-medium text-[#17231C] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#17231C]">{t.passwordLabel}</label>
              <button
                type="button"
                onClick={() => navigate('forgot_password')}
                className="text-xs text-[#159447] hover:underline font-semibold"
              >
                {t.forgotPassword}
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-[#E5EBE7] focus:border-[#159447] focus:ring-2 focus:ring-[#159447]/20 rounded-2xl text-sm font-medium text-[#17231C] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#66736B] hover:text-[#17231C]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="btn-submit-login"
            type="submit"
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-bold text-sm shadow-md shadow-[#159447]/20 active:scale-98 transition-all"
          >
            {t.btnLogin}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#E5EBE7]" />
          <span className="text-xs text-[#66736B] uppercase tracking-wider">{t.orDivider}</span>
          <div className="flex-1 h-px bg-[#E5EBE7]" />
        </div>

        <button
          onClick={() => login('+509 4812 3456', 'google_auth')}
          className="w-full py-3 px-4 bg-white border border-[#E5EBE7] hover:bg-[#F7F9F8] rounded-2xl flex items-center justify-center gap-2.5 text-xs font-bold text-[#17231C] shadow-2xs transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t.continueWithGoogle}</span>
        </button>
      </div>

      <div className="pt-4 text-center">
        <p className="text-xs text-[#66736B]">
          {t.noAccountYet}{' '}
          <button
            onClick={() => navigate('register')}
            className="text-[#159447] font-bold hover:underline"
          >
            {t.createOne}
          </button>
        </p>
      </div>
    </div>
  );
};

export const RegisterScreen: React.FC = () => {
  const { register, navigate, t } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      setError('Tanpri mete non w ak nimewo telefòn ou.');
      return;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setError('Modpas yo pa matche.');
      return;
    }
    register(name, phone, email, password);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col justify-between p-5 max-w-md mx-auto">
      <ScreenHeader title={t.registerTitle} onBack={() => navigate('login')} />

      <div className="my-auto py-4">
        <div className="text-center mb-6">
          <BrandLogo size="sm" className="mb-2" />
          <h2 className="text-xl font-extrabold text-[#17231C]">
            Antre nan kominote SÈVIS HT
          </h2>
          <p className="text-xs text-[#66736B] mt-1">
            Jwenn bon pwofesyonèl yo fasilman nan zòn ou.
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
          {error && (
            <div className="p-3 bg-[#D94A4A]/10 border border-[#D94A4A]/30 text-[#D94A4A] text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1">
              {t.fullNameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              className="w-full px-4 py-2.5 bg-white border border-[#E5EBE7] rounded-xl text-sm font-medium text-[#17231C] outline-none focus:border-[#159447]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1">
              {t.phoneLabel}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm">🇭🇹</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+509 4XXX XXXX"
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E5EBE7] rounded-xl text-sm font-medium text-[#17231C] outline-none focus:border-[#159447]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1">
              {t.emailLabel} (opsyonèl)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full px-4 py-2.5 bg-white border border-[#E5EBE7] rounded-xl text-sm font-medium text-[#17231C] outline-none focus:border-[#159447]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1">
              {t.passwordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border border-[#E5EBE7] rounded-xl text-sm font-medium text-[#17231C] outline-none focus:border-[#159447]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17231C] mb-1">
              {t.confirmPasswordLabel}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border border-[#E5EBE7] rounded-xl text-sm font-medium text-[#17231C] outline-none focus:border-[#159447]"
            />
          </div>

          <label className="flex items-center gap-2 mt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded-xs border-[#E5EBE7] text-[#159447] focus:ring-[#159447]"
            />
            <span className="text-xs text-[#66736B]">{t.agreeTerms}</span>
          </label>

          <button
            type="submit"
            className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-bold text-sm shadow-md shadow-[#159447]/20 active:scale-98 transition-all"
          >
            {t.btnRegister}
          </button>
        </form>
      </div>

      <div className="pt-2 text-center">
        <p className="text-xs text-[#66736B]">
          Ou deja gen kont?{' '}
          <button
            onClick={() => navigate('login')}
            className="text-[#159447] font-bold hover:underline"
          >
            {t.btnLogin}
          </button>
        </p>
      </div>
    </div>
  );
};

export const OtpVerificationScreen: React.FC = () => {
  const { navigate, t, screenParams, showToast } = useApp();
  const [digits, setDigits] = useState(['5', '0', '9', '2', '4', '8']);
  const [countdown, setCountdown] = useState(45);

  const phoneTarget = screenParams?.phone || '+509 4812 3456';

  const handleVerify = () => {
    showToast('Kòd OTP verifye avèk siksè!');
    navigate('home');
  };

  const handleResend = () => {
    setCountdown(60);
    showToast('Nouvo kòd OTP voye pa SMS.');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col justify-between p-5 max-w-md mx-auto">
      <ScreenHeader title={t.otpTitle} onBack={() => navigate('login')} />

      <div className="my-auto text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[#E8F6ED] text-[#159447] flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-extrabold text-[#17231C]">{t.otpTitle}</h2>
        <p className="text-xs text-[#66736B] max-w-xs mt-1.5 leading-relaxed">
          {t.otpDesc} <span className="font-bold text-[#17231C]">{phoneTarget}</span>
        </p>

        {/* 6 digits input simulator */}
        <div className="flex items-center justify-center gap-2.5 my-8">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const next = [...digits];
                next[idx] = e.target.value;
                setDigits(next);
              }}
              className="w-12 h-12 text-center text-lg font-bold bg-white border-2 border-[#159447] rounded-xl text-[#17231C] focus:outline-none shadow-xs"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-bold text-sm shadow-md shadow-[#159447]/20 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>{t.btnVerify}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="mt-5 text-xs text-[#66736B]">
          {countdown > 0 ? (
            <span>
              {t.resendCode} <strong className="text-[#159447]">{countdown}s</strong>
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-[#159447] font-bold hover:underline"
            >
              Revoye kòd la kounye a
            </button>
          )}
        </div>
      </div>

      <div className="text-center py-2">
        <p className="text-xs text-[#66736B]">
          Move nimewo?{' '}
          <button onClick={() => navigate('register')} className="text-[#159447] font-bold">
            Chanje nimewo
          </button>
        </p>
      </div>
    </div>
  );
};

export const ForgotPasswordScreen: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast('Enstriksyon rekiperasyon voye pa SMS/Imèl.');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col justify-between p-5 max-w-md mx-auto">
      <ScreenHeader title="Rekipere Modpas" onBack={() => navigate('login')} />

      <div className="my-auto">
        <div className="text-center mb-6">
          <BrandLogo size="sm" className="mb-3" />
          <h2 className="text-xl font-extrabold text-[#17231C]">Bliye modpas ou?</h2>
          <p className="text-xs text-[#66736B] mt-1 max-w-xs mx-auto leading-relaxed">
            Antre nimewo telefòn oswa imèl ou pou n voye yon lyen rekiperasyon ba ou.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-[#17231C] mb-1">
                Telefòn oswa Imèl
              </label>
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="+509 4XXX XXXX oswa michel@egzanp.ht"
                className="w-full px-4 py-3 bg-white border border-[#E5EBE7] rounded-xl text-sm font-medium text-[#17231C] outline-none focus:border-[#159447]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#159447] hover:bg-[#0B7A3B] text-white font-bold text-sm shadow-md shadow-[#159447]/20 active:scale-98 transition-all"
            >
              Voye Kòd Rekiperasyon
            </button>
          </form>
        ) : (
          <div className="bg-white p-5 rounded-2xl border border-[#E5EBE7] text-center">
            <div className="w-12 h-12 bg-[#E8F6ED] text-[#159447] rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-bold text-[#17231C]">Mesaj voye!</h3>
            <p className="text-xs text-[#66736B] mt-1">
              Tcheke bwat mesaj SMS ou pou w kapab mete yon nouvo modpas.
            </p>
            <button
              onClick={() => navigate('login')}
              className="mt-4 px-5 py-2.5 bg-[#159447] text-white text-xs font-bold rounded-xl"
            >
              Tounen nan Login
            </button>
          </div>
        )}
      </div>

      <div className="text-center py-2">
        <button
          onClick={() => navigate('login')}
          className="text-xs text-[#66736B] hover:text-[#159447] font-semibold"
        >
          Anile e tounen
        </button>
      </div>
    </div>
  );
};
