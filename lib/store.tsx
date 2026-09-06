'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  User,
  UserRole,
  ProfessionalProfile,
  ServiceCategory,
  ServiceRequest,
  Conversation,
  AppNotification,
  Review,
  SupportTicket,
  RequestStatus,
} from './types';
import {
  INITIAL_USER,
  INITIAL_PROS,
  INITIAL_CATEGORIES,
  INITIAL_REQUESTS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
} from './mock-data';
import { translations } from './translations';

export type ScreenType =
  | 'onboarding'
  | 'login'
  | 'register'
  | 'otp'
  | 'forgot_password'
  | 'home'
  | 'all_categories'
  | 'category_details'
  | 'search'
  | 'pro_profile'
  | 'request_flow'
  | 'requests_list'
  | 'request_details'
  | 'chat_inbox'
  | 'chat_conversation'
  | 'payment'
  | 'payment_screen'
  | 'leave_review'
  | 'notifications'
  | 'profile'
  | 'edit_profile'
  | 'saved_pros'
  | 'pro_dashboard'
  | 'pro_requests'
  | 'pro_edit_services'
  | 'pro_portfolio'
  | 'help_center'
  | 'contact_support'
  | 'settings';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['ht'];
  
  // Navigation
  currentScreen: ScreenType;
  screenParams: Record<string, any>;
  navigate: (screen: ScreenType, params?: Record<string, any>) => void;
  goBack: () => void;
  canGoBack: boolean;
  activeTab: 'home' | 'search' | 'requests' | 'messages' | 'profile';
  setActiveTab: (tab: 'home' | 'search' | 'requests' | 'messages' | 'profile') => void;
  
  // User & Auth
  user: User;
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  login: (phone: string, pass: string) => boolean;
  register: (name: string, phone: string, email: string, pass: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateUserProfile: (data: Partial<User>) => void;
  switchRole: (role: UserRole) => void;
  toggleRole: () => void;
  
  // Location
  currentLocation: string;
  setLocation: (loc: string) => void;
  
  // Data lists
  categories: ServiceCategory[];
  pros: ProfessionalProfile[];
  requests: ServiceRequest[];
  conversations: Conversation[];
  notifications: AppNotification[];
  reviews: Review[];
  supportTickets: SupportTicket[];
  
  // Pro Profile selection
  selectedProId: string | null;
  setSelectedProId: (id: string | null) => void;
  
  // Actions
  toggleSavePro: (proId: string) => void;
  createRequest: (draft: Partial<ServiceRequest>) => ServiceRequest;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  payRequest: (requestId: string, method: 'moncash' | 'natcash' | 'cash') => void;
  submitReview: (proId: string, rating: number, comment: string) => void;
  addReview: (proId: string, rating: number, comment: string) => void;
  sendMessage: (convId: string, text: string) => void;
  markNotificationsAsRead: () => void;
  markAllNotificationsRead: () => void;
  submitSupportTicket: (subject: string, message: string) => void;
  toggleProAvailability: () => void;
  addProService: (name: string, price: number, duration: string, desc: string) => void;
  addProPortfolio: (title: string, desc: string, img: string) => void;
  
  // Feedback toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ht');
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [screenHistory, setScreenHistory] = useState<{ screen: ScreenType; params: Record<string, any> }[]>([
    { screen: 'home', params: {} },
  ]);
  const [activeTab, setActiveTabState] = useState<'home' | 'search' | 'requests' | 'messages' | 'profile'>('home');
  
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);
  const [currentLocation, setLocationState] = useState<string>('Delmas 33, Pòtoprens');
  
  const [categories] = useState<ServiceCategory[]>(INITIAL_CATEGORIES);
  const [pros, setPros] = useState<ProfessionalProfile[]>(INITIAL_PROS);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  
  const [selectedProId, setSelectedProId] = useState<string | null>('pro_1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync translation dict
  const t = translations[language] || translations.ht;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const navigate = (screen: ScreenType, params: Record<string, any> = {}) => {
    setScreenHistory((prev) => [...prev, { screen, params }]);
    setCurrentScreen(screen);
    setScreenParams(params);

    // Update bottom tab highlights appropriately
    if (screen === 'home') setActiveTabState('home');
    else if (screen === 'search' || screen === 'all_categories') setActiveTabState('search');
    else if (screen === 'requests_list') setActiveTabState('requests');
    else if (screen === 'chat_inbox') setActiveTabState('messages');
    else if (screen === 'profile') setActiveTabState('profile');

    // Scroll to top of active container if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // remove current
      const previous = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(previous.screen);
      setScreenParams(previous.params);
      
      // Update tab highlight
      if (previous.screen === 'home') setActiveTabState('home');
      else if (previous.screen === 'search') setActiveTabState('search');
      else if (previous.screen === 'requests_list') setActiveTabState('requests');
      else if (previous.screen === 'chat_inbox') setActiveTabState('messages');
      else if (previous.screen === 'profile') setActiveTabState('profile');
    } else {
      // Default to home
      setCurrentScreen('home');
      setActiveTabState('home');
    }
  };

  const setActiveTab = (tab: 'home' | 'search' | 'requests' | 'messages' | 'profile') => {
    setActiveTabState(tab);
    if (tab === 'home') navigate('home');
    else if (tab === 'search') navigate('search');
    else if (tab === 'requests') navigate('requests_list');
    else if (tab === 'messages') navigate('chat_inbox');
    else if (tab === 'profile') navigate(user.role === 'professional' ? 'pro_dashboard' : 'profile');
  };

  const login = (phone: string, _pass: string) => {
    setIsLoggedIn(true);
    setUser((prev) => ({ ...prev, phone: phone || prev.phone }));
    showToast(`Byenveni ankò sou SÈVIS HT!`);
    navigate('home');
    return true;
  };

  const register = (name: string, phone: string, email: string, _pass: string) => {
    const newUser: User = {
      ...INITIAL_USER,
      id: `user_${Date.now()}`,
      name: name || 'Nouvo Kliyan',
      phone: phone || '+509 4000 0000',
      email: email || 'nouvo@servisht.ht',
    };
    setUser(newUser);
    setIsLoggedIn(true);
    navigate('otp', { phone: newUser.phone });
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Ou dekonekte avèk siksè.');
    navigate('login');
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...data }));
    showToast('Enfòmasyon pwofil ou mete ajou.');
  };

  const switchRole = (role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
    if (role === 'professional') {
      showToast('Ou pase nan Mòd Pwofesyonèl.');
      navigate('pro_dashboard');
    } else {
      showToast('Ou tounen nan Mòd Kliyan.');
      navigate('home');
    }
  };

  const setLocation = (loc: string) => {
    setLocationState(loc);
    setUser((prev) => ({ ...prev, location: loc }));
    showToast(`Zòn ou chanje pou: ${loc}`);
  };

  const toggleSavePro = (proId: string) => {
    setUser((prev) => {
      const isSaved = prev.savedProIds.includes(proId);
      const newSaved = isSaved
        ? prev.savedProIds.filter((id) => id !== proId)
        : [...prev.savedProIds, proId];
      showToast(isSaved ? 'Retire nan pwofesyonèl sove' : 'Ajoute nan pwofesyonèl sove!');
      return { ...prev, savedProIds: newSaved };
    });
  };

  const createRequest = (draft: Partial<ServiceRequest>): ServiceRequest => {
    const newRef = `SHT-${Math.floor(1000 + Math.random() * 9000)}`;
    const pro = pros.find((p) => p.id === draft.proId) || pros[0];
    
    const newReq: ServiceRequest = {
      id: `req_${Date.now()}`,
      referenceCode: newRef,
      customerId: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      customerAvatar: user.avatar,
      proId: pro.id,
      proName: pro.name,
      proAvatar: pro.avatar,
      proCategory: pro.categoryName,
      serviceName: draft.serviceName || pro.services[0]?.name || 'Sèvis jeneral',
      description: draft.description || 'Bezwen entèvansyon rapid.',
      address: draft.address || currentLocation,
      date: draft.date || 'Demann ijan',
      timeSlot: draft.timeSlot || '9:00 AM - 12:00 PM',
      priceEstimate: draft.priceEstimate || pro.startingPrice,
      status: 'pending',
      photos: draft.photos || [],
      notes: draft.notes,
      createdAt: 'Kounye a',
      paymentMethod: draft.paymentMethod || 'moncash',
      paid: false,
    };

    setRequests((prev) => [newReq, ...prev]);

    // Also trigger notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      type: 'request_created',
      title: `Demann ou voye bay ${pro.name}`,
      message: `Referans: ${newRef} pou ${newReq.serviceName}.`,
      timestamp: 'Kounye a',
      isRead: false,
      requestId: newReq.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Ensure conversation exists
    setConversations((prev) => {
      const existing = prev.find((c) => c.proId === pro.id);
      if (existing) return prev;
      return [
        {
          id: `conv_${Date.now()}`,
          proId: pro.id,
          proName: pro.name,
          proAvatar: pro.avatar,
          proCategory: pro.categoryName,
          isOnline: true,
          lastMessage: `Demann voye: ${newReq.serviceName}`,
          lastMessageTime: 'Kounye a',
          unreadCount: 0,
          messages: [
            {
              id: `m_${Date.now()}`,
              sender: 'customer',
              text: `Bonjou! Mwen voye yon nouvo demann sèvis pou "${newReq.serviceName}".`,
              timestamp: 'Kounye a',
            },
          ],
        },
        ...prev,
      ];
    });

    return newReq;
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
    const req = requests.find((r) => r.id === requestId);
    if (req) {
      const notifTitles: Record<RequestStatus, string> = {
        accepted: `${req.proName} te aksepte demann ou a!`,
        scheduled: `Rendez-vous ou fikse ak ${req.proName}`,
        in_progress: `Travay la ap fèt kounye a ak ${req.proName}`,
        completed: `Travay fini ak siksè pa ${req.proName}`,
        cancelled: `Demann #${req.referenceCode} anile`,
        pending: `Demann #${req.referenceCode} an atant`,
      };
      
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          type: status === 'completed' ? 'request_completed' : 'request_accepted',
          title: notifTitles[status],
          message: `Estati sèvis ou chanje pou: ${status.toUpperCase()}.`,
          timestamp: 'Kounye a',
          isRead: false,
          requestId,
        },
        ...prev,
      ]);
    }
    showToast(`Estati demann lan chanje: ${status}`);
  };

  const payRequest = (requestId: string, method: 'moncash' | 'natcash' | 'cash') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, paid: true, paymentMethod: method } : r))
    );
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        type: 'payment_confirmed',
        title: 'Peman konfime!',
        message: `Peman ou a fèt avèk siksè atravè ${method.toUpperCase()}.`,
        timestamp: 'Kounye a',
        isRead: false,
        requestId,
      },
      ...prev,
    ]);
    showToast(`Peman ak ${method.toUpperCase()} fèt avèk siksè!`);
  };

  const submitReview = (proId: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      proId,
      customerName: user.name,
      customerAvatar: user.avatar,
      rating,
      comment,
      date: 'Jodi a',
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate pro rating
    setPros((prev) =>
      prev.map((p) => {
        if (p.id === proId) {
          const totalReviews = p.reviewsCount + 1;
          const newAvg = Number(((p.rating * p.reviewsCount + rating) / totalReviews).toFixed(1));
          return {
            ...p,
            rating: newAvg,
            reviewsCount: totalReviews,
          };
        }
        return p;
      })
    );

    showToast('Mèsi anpil! Evalyasyon ou anrejistre.');
  };

  const sendMessage = (convId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'customer' as const,
      text,
      timestamp: 'Kounye a',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Kounye a',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Simulate instant reply from pro after 1.5 seconds for true realism!
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            const replies = [
              'Mèsi pou detay yo! M ap prepare zouti m pou m vini alè.',
              'Mwen byen note sa. Èske gen kouran lakay ou pou kounye a?',
              'Dakò, m ap la nan tranche lè nou te fikse a san fòt.',
              'Trè byen, mèsi pou konfyans ou!',
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            return {
              ...c,
              lastMessage: randomReply,
              lastMessageTime: 'Kounye a',
              unreadCount: c.unreadCount + 1,
              messages: [
                ...c.messages,
                {
                  id: `reply_${Date.now()}`,
                  sender: 'pro' as const,
                  text: randomReply,
                  timestamp: 'Kounye a',
                },
              ],
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Tout notifikasyon make kòm li.');
  };

  const submitSupportTicket = (subject: string, message: string) => {
    const newTicket: SupportTicket = {
      id: `ticket_${Date.now()}`,
      subject,
      category: 'Sèvis Kliyan',
      message,
      status: 'ouvri',
      date: 'Jodi a',
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    showToast('Mesaj ou a voye bay sipò SÈVIS HT. N ap reponn ou rapid!');
  };

  const toggleProAvailability = () => {
    setPros((prev) =>
      prev.map((p) => {
        if (p.id === 'pro_1') {
          const next = !p.isAvailable;
          showToast(next ? 'Estati ou: Disponib pou travay' : 'Estati ou: Okipe pou kounye a');
          return { ...p, isAvailable: next };
        }
        return p;
      })
    );
  };

  const addProService = (name: string, price: number, duration: string, desc: string) => {
    setPros((prev) =>
      prev.map((p) => {
        if (p.id === 'pro_1') {
          return {
            ...p,
            services: [
              ...p.services,
              {
                id: `s_${Date.now()}`,
                name,
                price,
                duration,
                description: desc,
              },
            ],
          };
        }
        return p;
      })
    );
    showToast('Nouvo sèvis te ajoute avèk siksè!');
  };

  const addProPortfolio = (title: string, desc: string, img: string) => {
    setPros((prev) =>
      prev.map((p) => {
        if (p.id === 'pro_1') {
          return {
            ...p,
            portfolio: [
              {
                id: `port_${Date.now()}`,
                title,
                description: desc,
                image: img || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
                date: 'Jodi a',
              },
              ...p.portfolio,
            ],
          };
        }
        return p;
      })
    );
    showToast('Nouvo pwojè ajoute nan pòtfolyo w!');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentScreen,
        screenParams,
        navigate,
        goBack,
        canGoBack: screenHistory.length > 1,
        activeTab,
        setActiveTab,
        user,
        isLoggedIn,
        hasCompletedOnboarding,
        login,
        register,
        logout,
        updateUser,
        updateUserProfile: updateUser,
        switchRole,
        toggleRole: () => {
          const nextRole = user.role === 'customer' ? 'professional' : 'customer';
          switchRole(nextRole);
        },
        currentLocation,
        setLocation,
        categories,
        pros,
        requests,
        conversations,
        notifications,
        reviews,
        supportTickets,
        selectedProId,
        setSelectedProId,
        toggleSavePro,
        createRequest,
        updateRequestStatus,
        payRequest,
        submitReview,
        addReview: submitReview,
        sendMessage,
        markNotificationsAsRead,
        markAllNotificationsRead: markNotificationsAsRead,
        submitSupportTicket,
        toggleProAvailability,
        addProService,
        addProPortfolio,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
