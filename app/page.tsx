"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Wrench, HardHat, Truck, Sparkles, Monitor, Palette, UtensilsCrossed, MoreHorizontal, ChevronRight } from "lucide-react";

const categories = [
  { id: "kay", name: "Kay & Bati", icon: Wrench, color: "bg-blue-50 text-blue-600" },
  { id: "konstriksyon", name: "Konstriksyon", icon: HardHat, color: "bg-orange-50 text-orange-600" },
  { id: "transpo", name: "Transpò", icon: Truck, color: "bg-sky-50 text-sky-600" },
  { id: "belte", name: "Bèlte & Swen", icon: Sparkles, color: "bg-pink-50 text-pink-600" },
  { id: "teknoloji", name: "Teknoloji", icon: Monitor, color: "bg-indigo-50 text-indigo-600" },
  { id: "atizana", name: "Atizana", icon: Palette, color: "bg-purple-50 text-purple-600" },
  { id: "manje", name: "Manje & Kwizin", icon: UtensilsCrossed, color: "bg-emerald-50 text-emerald-600" },
  { id: "lot", name: "Lòt Sèvis", icon: MoreHorizontal, color: "bg-slate-100 text-slate-600" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white px-4 pt-4 pb-3 border-b border-slate-100 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-slate-800">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-sm">Pòtoprens</span>
          </div>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Chèche yon sèvis, yon pwofesyonèl..."
            className="w-full bg-slate-100 text-slate-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-4 flex justify-between items-center relative overflow-hidden">
          <div className="space-y-1 z-10 max-w-[65%]">
            <p className="text-xs font-medium text-blue-100 uppercase">Pwofesyonèl verifye</p>
            <h2 className="text-base font-bold leading-snug">Yon sèvis serye, pi bon solisyon.</h2>
            <Link href="/categories" className="inline-block mt-2 bg-white text-blue-600 font-semibold text-xs px-3.5 py-1.5 rounded-lg">
              Gade tout sèvis
            </Link>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-base">Kategori</h3>
            <Link href="/categories" className="text-xs font-semibold text-blue-600 flex items-center">
              Tout <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.id} href={`/categories/${cat.id}`} className="flex flex-col items-center gap-1.5">
                  <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 text-center line-clamp-1">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
