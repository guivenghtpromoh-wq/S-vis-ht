"use client";

import React from "react";
import { HAITIAN_ZONES } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const LocationModal = ({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) => {
  const { currentLocation, setLocation } = useApp();
  const zones = HAITIAN_ZONES || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Chwazi Zòn Ou Ye a</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => {
                if (setLocation) setLocation(zone);
                if (onClose) onClose();
              }}
              className={`w-full text-left p-3 rounded-lg border ${
                currentLocation === zone ? "border-blue-600 bg-blue-50" : "border-gray-200"
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-200 text-gray-800 rounded-lg font-medium"
        >
          Fèmen
        </button>
      </div>
    </div>
  );
};
