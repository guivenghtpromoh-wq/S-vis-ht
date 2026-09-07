"use client";

import React from "react";
import {
  Bell,
  Search,
  MapPin,
  Zap,
  Wrench,
  Car,
  Palette,
  BookOpen,
  UserCheck,
  Hammer,
  Scissors,
  Star,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useApp } from "@/lib/store";

export const HomeDashboardScreen = () => {
  const {
    user,
    categories,
    pros,
    navigate,
    currentLocation,
  } = useApp();

  const defaultCategories = [
    {
      id: "electricite",
      name: "Elektrisite",
      icon: Zap,
    },
    {
      id: "plomberie",
      name: "Plonbri",
      icon: Wrench,
    },
    {
      id: "mecanique",
      name: "Mekanik",
      icon: Car,
    },
    {
      id: "design",
      name: "Design",
      icon: Palette,
    },
    {
      id: "formation",
      name: "Fòmasyon",
      icon: BookOpen,
    },
    {
      id: "construction",
      name: "Konstriksyon",
      icon: Hammer,
    },
    {
      id: "beaute",
      name: "Bote",
      icon: Scissors,
    },
    {
      id: "autres",
      name: "Lòt sèvis",
      icon: UserCheck,
    },
  ];

  const visibleCategories =
    categories && categories.length > 0
      ? categories.slice(0, 8)
      : defaultCategories;

  const visiblePros = pros?.slice(0, 4) || [];

  return (
    <main className="min-h-screen bg-[#F5F7FA] pb-24">
      <section className="mx-auto w-full max-w-md px-4 pt-5">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500">
              Bonjou,
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#0B1F3A]">
              {user?.name || "Itilizatè"}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("notifications")}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0B1F3A] shadow-sm"
            aria-label="Notifikasyon"
          >
            <Bell size={20} strokeWidth={2} />
          </button>
        </header>

        <button
          type="button"
          onClick={() => navigate("search")}
          className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-left shadow-sm"
        >
          <Search size={20} className="text-gray-400" />

          <span className="flex-1 text-sm text-gray-400">
            Ki sèvis ou bezwen?
          </span>

          <ArrowRight size={18} className="text-gray-400" />
        </button>

        <button
          type="button"
          onClick={() => navigate("location")}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-[#2F5FFF]">
            <MapPin size={18} />
          </div>

          <div className="flex-1">
            <p className="text-xs text-gray-400">
              Kote ou ye?
            </p>

            <p className="truncate text-sm font-semibold text-[#0B1F3A]">
              {currentLocation || "Chwazi kote ou ye"}
            </p>
          </div>

          <ArrowRight size={18} className="text-gray-400" />
        </button>

        <section className="mt-6 rounded-3xl bg-gradient-to-r from-[#2F5FFF] to-[#00AFC6] p-5 text-white shadow-lg">
          <div className="max-w-[260px]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/80">
              Sèvis rapid ak serye
            </p>

            <h2 className="text-xl font-bold leading-tight">
              Jwenn yon pwofesyonèl ki toupre ou
            </h2>

            <p className="mt-2 text-sm leading-5 text-white/85">
              Dekouvri moun ki disponib pou ede w ak sèvis ou bezwen an.
            </p>

            <button
              type="button"
              onClick={() => navigate("search")}
              className="mt-4 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#2F5FFF]"
            >
              Eksplore sèvis yo
            </button>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0B1F3A]">
              Kategori sèvis
            </h2>

            <button
              type="button"
              onClick={() => navigate("categories")}
              className="text-sm font-semibold text-[#2F5FFF]"
            >
              Tout kategori
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {visibleCategories.map((category: any, index: number) => {
              const Icon =
                category.icon ||
                defaultCategories[index % defaultCategories.length].icon;

              return (
                <button
                  key={category.id || category.name || index}
                  type="button"
                  onClick={() =>
                    navigate("search", {
                      categoryId: category.id,
                      categoryName: category.name,
                    })
                  }
                  className="flex min-h-[105px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-2 py-3 shadow-sm transition active:scale-95"
                >
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#2F5FFF]">
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  <span className="line-clamp-2 text-center text-xs font-semibold text-[#0B1F3A]">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0B1F3A]">
              Pwofesyonèl ki disponib
            </h2>

            <button
              type="button"
              onClick={() => navigate("search")}
              className="text-sm font-semibold text-[#2F5FFF]"
            >
              Gade tout
            </button>
          </div>

          {visiblePros.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <UserCheck size={24} />
              </div>

              <h3 className="font-semibold text-[#0B1F3A]">
                Pa gen pwofesyonèl pou montre
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Chanje kote ou ye oswa chèche yon sèvis pou jwenn rezilta.
              </p>

              <button
                type="button"
                onClick={() => navigate("search")}
                className="mt-4 rounded-xl bg-[#2F5FFF] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Chèche yon sèvis
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {visiblePros.map((pro: any) => (
                <button
                  key={pro.id}
                  type="button"
                  onClick={() =>
                    navigate("pro-profile", {
                      proId: pro.id,
                    })
                  }
                  className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                    {pro.avatar || pro.photoUrl ? (
                      <img
                        src={pro.avatar || pro.photoUrl}
                        alt={pro.name || "Pwofesyonèl"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserCheck
                        size={24}
                        className="text-gray-400"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h3 className="truncate text-sm font-bold text-[#0B1F3A]">
                        {pro.name || "Pwofesyonèl"}
                      </h3>

                      {pro.verified && (
                        <ShieldCheck
                          size={15}
                          className="shrink-0 text-[#2F5FFF]"
                        />
                      )}
                    </div>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {pro.service || pro.category || "Sèvis pwofesyonèl"}
                    </p>

                    <div className="mt-2 flex items-center gap-1">
                      <Star
                        size={14}
                        className="fill-current text-amber-400"
                      />

                      <span className="text-xs font-semibold text-gray-600">
                        {pro.rating || "0.0"}
                      </span>

                      {pro.reviewCount !== undefined && (
                        <span className="text-xs text-gray-400">
                          ({pro.reviewCount} avis)
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    size={18}
                    className="shrink-0 text-gray-400"
                  />
                </button>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};
