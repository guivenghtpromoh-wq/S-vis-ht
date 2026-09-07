"use client";

import Link from "next/link";
import { User, Settings, ShieldCheck, HelpCircle, LogOut, ChevronRight, Bell } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white px-4 py-3 border-b border-slate-100 sticky top-0 z-40">
        <h1 className="font-bold text-slate-900 text-base">Pwofil Mwen</h1>
      </header>

      <main className="p-4 space-y-4">
        {/* User Info Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base">Mamb Sevis-HT</h2>
            <p className="text-xs text-slate-500">Konte kòm Kliyan</p>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
          <Link href="/notifications" className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-semibold text-slate-800">Notifikasyon</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link href="/settings" className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-semibold text-slate-800">Paramèt Kont</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link href="/security" className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-semibold text-slate-800">Sekirite & Modpas</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link href="/help" className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-semibold text-slate-800">Sipò & Èd</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

        {/* Logout Button */}
        <Link 
          href="/login"
          className="flex items-center justify-center gap-2 w-full bg-rose-50 text-rose-600 font-semibold py-3 rounded-2xl border border-rose-100 text-xs hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Dekonekte
        </Link>
      </main>
    </div>
  );
}
