"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_CATEGORIES, MOCK_PROS, TRANSLATIONS } from "@/lib/mock-data";

export interface AppContextType {
  user: any;
  token: string | null;
  setUser: (user: any) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  currentScreen: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  conversations: any[];
  t: any;
  currentLocation: string;
  setLocation: (location: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  categories: any[];
  pros: any[];
  login: (...args: any[]) => void;
  register: (...args: any[]) => void;
  language: string;
  setLanguage: (lang: string) => void;
  screenParams: any;
  setSelectedProId: (id: string | null) => void;
  selectedProId: string | null;
  addReview: (...args: any[]) => void;
  notifications: any[];
  markAllNotificationsRead: () => void;
  updateRequestStatus: (id: string, status: string) => void;
  requests: any[];
  toggleRole: () => void;
  reviews: any[];
  toggleSavePro: (id: string) => void;
  updateUserProfile: (profile: any) => void;
  createRequest: (req: any) => any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER = {
  name: "Itilizatè",
  email: "itilizate@sevis.ht",
  phone: "+509 0000 0000",
  avatar: "",
  role: "client"
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(DEFAULT_USER);
  const [token, setToken] = useState<string | null>("auth-token");
  const [language, setLanguage] = useState<string>("ht");
  const [currentLocation, setLocation] = useState<string>("Port-au-Prince");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>("home");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [screenHistory, setScreenHistory] = useState<string[]>(["home"]);
  const [screenParams, setScreenParams] = useState<any>({});
  const [selectedProId, setSelectedProId] = useState<string | null>(null);

  const [requests, setRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(DEFAULT_USER);
        }
      }
      if (savedToken) setToken(savedToken);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const navigate = (screen: string, params?: any) => {
    if (params) setScreenParams(params);
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    if (["home", "search", "requests", "messages", "profile"].includes(screen)) {
      setActiveTab(screen);
    }
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      setScreenHistory(newHistory);
      const prevScreen = newHistory[newHistory.length - 1];
      setCurrentScreen(prevScreen);
      if (["home", "search", "requests", "messages", "profile"].includes(prevScreen)) {
        setActiveTab(prevScreen);
      }
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setUser(DEFAULT_USER);
    setToken(null);
    showToast("Ou dekonnekte ak siksè.");
  };

  const login = (...args: any[]) => {
    const data = args[0] || {};
    const newUser = {
      name: data.email || "Itilizatè",
      email: data.email || "itilizate@sevis.ht",
      phone: data.phone || "+509 0000 0000",
      avatar: "",
      role: "client"
    };
    setUser(newUser);
    setToken("auth-token");
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", "auth-token");
    }
    showToast("Ou konnekte ak siksè!");
    navigate("home");
  };

  const register = (...args: any[]) => {
    login(...args);
  };

  const createRequest = (req: any) => {
    const newReq = { id: Date.now().toString(), status: "En attente", ...req };
    setRequests((prev) => [newReq, ...prev]);
    showToast("Demann ou an voye ak siksè!");
    return newReq;
  };

  const toggleRole = () => {
    setUser((prev: any) => ({
      ...prev,
      role: prev?.role === "pro" ? "client" : "pro",
    }));
    showToast("Ròl ou chanje ak siksè.");
  };

  const translateFn: any = (key: string) => TRANSLATIONS[key] || key;
  const t = new Proxy(translateFn, {
    get: (target, prop: string) => {
      if (prop in target) return target[prop];
      return TRANSLATIONS[prop] || prop;
    },
  });

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
        logout,
        currentScreen,
        activeTab,
        setActiveTab: (tab) => navigate(tab),
        navigate,
        goBack,
        t,
        currentLocation,
        setLocation,
        toastMessage,
        showToast,
        language,
        setLanguage,
        screenParams,
        categories: MOCK_CATEGORIES,
        pros: MOCK_PROS,
        requests,
        notifications,
        conversations: [],
        reviews,
        login,
        register,
        setSelectedProId,
        selectedProId,
        addReview: (...args: any[]) => {
          if (args[0]) setReviews((prev) => [args[0], ...prev]);
        },
        markAllNotificationsRead: () => setNotifications([]),
        updateRequestStatus: (id, status) => {
          setRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status } : r))
          );
        },
        toggleRole,
        toggleSavePro: () => showToast("Sove nan favori!"),
        updateUserProfile: (p) => setUser((prev: any) => ({ ...prev, ...p })),
        createRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp dwe itilize anndan yon AppProvider");
  }
  return context;
};
