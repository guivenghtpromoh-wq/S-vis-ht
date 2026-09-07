"use client";

import React from "react";
import { useApp } from "@/lib/store";
import { Home, Search, Calendar, MessageSquare, User } from "lucide-react";

export const BottomNav = () => {
  const { currentScreen, activeTab, navigate } = useApp();

  const hideOnScreens = ["login", "register", "otp", "onboarding"];
  if (hideOnScreens.includes(currentScreen)) return null;

  const navItems = [
    { id: "home", label: "Akèy", icon: Home },
    { id: "search", label: "Rechèch", icon: Search },
    { id: "requests", label: "Demann", icon: Calendar },
    { id: "messages", label: "Mesaj", icon: MessageSquare },
    { id: "profile", label: "Profil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 max-w-md mx-auto">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                isActive ? "text-green-600 font-semibold" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
