"use client";

import Link from "next/link";
import { ChevronLeft, Search, Wrench, HardHat, Truck, Sparkles, Monitor, Palette, UtensilsCrossed, MoreHorizontal, ChevronRight } from "lucide-react";

const allCategories = [
  { id: "kay", name: "Kay & Bati", desc: "Plonbri, elektriksyon, penti...", icon: Wrench, color: "text-emerald-600 bg-emerald-50" },
  { id: "konstriksyon", name: "Konstriksyon & Bati", desc: "Mason, konstriksyon, dekorasyon...", icon: HardHat, color: "text-amber-600 bg-amber-50" },
  { id: "transpo", name: "Transpò & Livrezon", desc: "Moto, machin, livrezon...", icon: Truck, color: "text-blue-600 bg-blue-50" },
  { id: "belte", name: "Bèlte & Swen Pèsonèl", desc: "Cheve, mekiyaj, spa, masaj...", icon: Sparkles, color: "text-rose-600 bg-rose-50" },
  { id: "teknoloji", name: "Teknoloji & Dijital", desc: "Reparasyon telefòn, òdinatè, rezo...", icon: Monitor, color: "text-indigo-600 bg-indigo-50" },
  { id: "atizana", name: "Atizana & Kreyativite", desc: "Koud, dekorasyon, kado...", icon: Palette, color: "text-purple-600 bg-purple-50" },
  { id: "manje", name: "Manje & Kwizin", desc: "Katering, gato, manje lakay...", icon: UtensilsCrossed, color: "text-orange-600 bg-orange-50" },
  { id: "lot", name: "Lòt Sèvis", desc: "Netwayaj, sekirite, evènman...", icon: MoreHorizontal, color: "text-slate-600 bg-slate-100" },
];

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 rounded-lg hover:bg-slate-100">
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <h1 className="font-bold text-slate-900 text-base">Kategori</h1>
        </div>
        <Search className="w-5 h-5 text-slate-500" />
      </header>

      <main className="p-4 space-y-3">
        {allCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link key={cat.id} href={`/categories/${cat.id}`} className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 text-sm">{cat.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          );
        })}
      </main>
    </div>
  );
}
