"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { ShieldCheck, ArrowLeft, Lock, Phone, User, Mail } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const LoginScreen = () => {
  const store = useApp() as any;
  const { login, navigate } = store;
  const showToast = store.showToast || ((msg: string) => alert(msg));

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      showToast("Tanpri ranpli tout chan yo.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
      } else {
        showToast(data.message || "Erè nan koneksyon an.");
      }
    } catch (err) {
      showToast("Erè rezo! Pa ka kontakte sèvè a.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 flex flex-col min-h-screen justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Bonjou!</h1>
        <p className="text-sm text-gray-500">Kontinye konekte ak kont ou</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Nimewo telefòn</label>
          <div className="relative">
            <Phone className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="+509 4XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Modpas</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        <div className="text-right">
          <button type="button" className="text-xs text-green-700 font-semibold">
            Ou bliye modpas ou?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition duration-200"
        >
          {loading ? "Chajman..." : "Konekte"}
        </button>
      </form>

      <div className="text-center pt-4">
        <p className="text-xs text-gray-600">
          Pa gen kont?{" "}
          <button onClick={() => navigate("register")} className="text-green-700 font-bold">
            Kreye youn
          </button>
        </p>
      </div>
    </div>
  );
};

export const RegisterScreen = () => {
  const store = useApp() as any;
  const { navigate } = store;
  const showToast = store.showToast || ((msg: string) => alert(msg));

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Kont kreye! Antre kòd verifikasyon an.");
        navigate("otp", { phone: formData.phone });
      } else {
        showToast(data.message || "Erè pandan enskripsyon an.");
      }
    } catch (err) {
      showToast("Erè rezo! Eseye ankò.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 min-h-screen flex flex-col justify-center">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("login")} className="p-2 rounded-full border">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold">Kreye yon kont</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Non konplè</label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Jean Baptiste"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Adrès imèl</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="zanmi@egzanp.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Nimewo telefòn</label>
          <div className="relative">
            <Phone className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="+509 4XXX XXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Modpas</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition duration-200"
        >
          {loading ? "Chajman..." : "Enskri"}
        </button>
      </form>
    </div>
  );
};

export const OTPScreen = () => {
  const store = useApp() as any;
  const { login, navigate, screenParams } = store;
  const showToast = store.showToast || ((msg: string) => alert(msg));

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code || code.length < 4) {
      showToast("Kòd verifikasyon an dwe gen omwen 4 chif.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: screenParams?.phone, code }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
      } else {
        showToast(data.message || "Kòd la pa korek.");
      }
    } catch (err) {
      showToast("Erè nan verifikasyon an.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6 min-h-screen flex flex-col justify-center text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <ShieldCheck className="w-8 h-8 text-green-700" />
      </div>
      <div>
        <h1 className="text-xl font-bold">Verifikasyon OTP</h1>
        <p className="text-xs text-gray-500 mt-1">Antre kòd verifikasyon ou resevwa sou nimewo ou a.</p>
      </div>

      <input
        type="text"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full text-center text-2xl font-bold tracking-widest py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
        placeholder="000000"
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition"
      >
        {loading ? "Chajman..." : "Verifye"}
      </button>
    </div>
  );
};
