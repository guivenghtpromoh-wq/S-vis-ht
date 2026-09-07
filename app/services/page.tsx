"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, SlidersHorizontal, Wrench } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function ServicesListingPage() {
  const [search, setSearch] = useState("");
  const services = []; // Done sa yo kòmande dirèkteman pa backend API a

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white px-4 py-3 border-b border-slate-100 sticky top-0 z-40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1 rounded-lg hover:bg-slate-100">
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </Link>
            <h1 className="font-bold text-slate-900 text-base">Tout Sèvis yo</h1>
          </div>
          <button className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Fè yon rechèch an tan reyèl..."
            className="w-full bg-slate-100 text-slate-900 text-sm pl-10 pr-4 py-2.5 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
      </header>

      <main className="p-4 flex-1 flex flex-col justify-center">
        {services.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="Okenn sèvis pa jwenn"
            description="Nou pa jwenn okenn sèvis ki koresponn ak rechèch ou an pou kounye a."
            actionLabel="Retounen sou akèy la"
            actionHref="/"
          />
        ) : (
          <div className="grid gap-3">
            {/* Rann sèvis ki soti nan API backend */}
          </div>
        )}
      </main>
    </div>
  );
}
