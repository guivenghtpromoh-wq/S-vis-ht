"use client";

import Link from "next/link";
import { ChevronLeft, MapPin, ShieldCheck, Phone, MessageSquare, Star } from "lucide-react";

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white px-4 py-3 border-b border-slate-100 sticky top-0 z-40 flex items-center justify-between">
        <Link href="/services" className="p-1 rounded-lg hover:bg-slate-100">
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <h1 className="font-bold text-slate-900 text-sm">Detay Sèvis</h1>
        <div className="w-6" />
      </header>

      <main className="p-4 space-y-4 flex-1 pb-24">
        {/* Placeholder pou Galeri foto sèvis la */}
        <div className="w-full h-48 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-medium">
          Imaj Sèvis
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">
              Pwofesyonèl Verifye
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>5.0</span>
            </div>
          </div>

          <h2 className="font-bold text-slate-900 text-lg leading-snug">
            Sèvis Pwofesyonèl #{params.id}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Pòtoprens, Ayiti</span>
          </div>
        </div>

        {/* Deskripsyon */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Aji sou deskripsyon</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sèvis sa a bay pa yon pwofesyonèl ki akredite sou platfòm Sèvis HT an. Kontakte l dirèkteman pou w mande yon deviz oswa pran yon randevou.
          </p>
        </div>
      </main>

      {/* Floating Action Bar anba a */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 p-3.5 flex gap-3 z-50">
        <Link
          href="/messages"
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-3 rounded-xl transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          Voye Mesaj
        </Link>
        <a
          href="tel:+50900000000"
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-sm"
        >
          <Phone className="w-4 h-4" />
          Rele Kounye a
        </a>
      </div>
    </div>
  );
}
