"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";

type AuthStep = "email" | "otp";

interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    avatar?: string;
    role?: string;
  };
}

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal = ({ onClose }: AuthModalProps) => {
  const { setUser, setToken } = useApp();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<AuthStep>("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Tanpri antre adrès imèl ou.");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Nou pa kapab voye kòd verifikasyon an."
        );
        return;
      }

      setEmail(normalizedEmail);
      setMessage(
        data.message || "Kòd verifikasyon an voye nan imèl ou."
      );
      setStep("otp");
    } catch {
      setError(
        "Pa gen koneksyon ak sèvè a. Verifye koneksyon entènèt ou epi re-eseye."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();

    if (!normalizedEmail) {
      setError("Adrès imèl la obligatwa.");
      setStep("email");
      return;
    }

    if (!/^\d{6}$/.test(normalizedCode)) {
      setError("Kòd verifikasyon an dwe gen 6 chif.");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          code: normalizedCode,
        }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Kòd verifikasyon an pa valab oswa li ekspire."
        );
        return;
      }

      if (!data.token) {
        setError(
          "Sèvè a pa retounen yon token otantifikasyon valab."
        );
        return;
      }

      if (!data.user || !data.user.id || !data.user.email) {
        setError(
          "Sèvè a pa retounen enfòmasyon itilizatè ki nesesè yo."
        );
        return;
      }

      setUser(data.user);
      setToken(data.token);

      onClose();
    } catch {
      setError(
        "Pa gen koneksyon ak sèvè a. Verifye koneksyon entènèt ou epi re-eseye."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setCode("");
    clearMessages();
    setStep("email");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="auth-modal-title"
            className="text-xl font-bold text-slate-800"
          >
            {step === "email"
              ? "Konekte sou SÈVIS HT"
              : "Verifye imèl ou"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Fèmen"
          >
            ×
          </button>
        </div>

        {error && (
          <div
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
            role="status"
          >
            {message}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label
                htmlFor="auth-email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Adrès imèl
              </label>

              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="non@example.com"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Ap voye kòd..." : "Voye kòd verifikasyon"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label
                htmlFor="auth-otp"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Kòd verifikasyon
              </label>

              <input
                id="auth-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                value={code}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  setCode(value);
                }}
                placeholder="000000"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-center text-2xl tracking-[0.4em] text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <p className="mt-2 text-center text-xs text-slate-500">
                Antre kòd 6 chif ou resevwa nan imèl ou.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Ap verifye..." : "Verifye epi konekte"}
            </button>

            <button
              type="button"
              onClick={handleBackToEmail}
              disabled={loading}
              className="w-full text-center text-sm font-medium text-slate-500 hover:text-blue-600 disabled:opacity-50"
            >
              Chanje adrès imèl
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
