"use client";

import Link from "next/link";
import { MessageSquare, ChevronLeft } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 rounded-lg hover:bg-slate-100">
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="font-bold text-slate-900 text-base">Mesaj</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-1">Pa gen konvèsasyon ankò</h2>
        <p className="text-xs text-slate-500 max-w-xs mb-6">
          Lè w kontakte yon pwofesyonèl oswa yon kliyan, diskisyon w yo ap parèt isit la.
        </p>
        <Link 
          href="/categories" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
        >
          Chèche yon sèvis
        </Link>
      </main>
    </div>
  );
}
