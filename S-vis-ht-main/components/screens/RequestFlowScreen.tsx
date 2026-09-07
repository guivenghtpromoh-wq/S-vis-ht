"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";

export const RequestFlowScreen = () => {
  const { pros, createRequest, navigate } = useApp();
  const [selectedPro, setSelectedPro] = useState<any>(null);
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createRequest) {
      createRequest({
        proId: selectedPro?.id,
        details,
      });
    }
    navigate("requests");
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">Fè yon Demann Sèvis</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Chwazi Pwofesyonèl</label>
          <select 
            className="w-full p-2 border rounded-lg"
            onChange={(e) => {
              const found = (pros || []).find((p: any) => p.id === e.target.value);
              setSelectedPro(found);
            }}
          >
            <option value="">-- Chwazi --</option>
            {(pros || []).map((pro: any) => (
              <option key={pro.id} value={pro.id}>
                {pro.name || pro.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Eskplike sa w bezwen</label>
          <textarea
            className="w-full p-2 border rounded-lg"
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Mete detay sou sèvis w ap chèche a..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
        >
          Voye Demann lan
        </button>
      </form>
    </div>
  );
};
