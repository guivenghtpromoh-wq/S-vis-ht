export type Language = 'ht' | 'fr' | 'en';

export type UserRole = 'customer' | 'professional';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  location: string;
  address?: string;
  role: UserRole;
  savedProIds: string[];
  defaultPayment: 'moncash' | 'natcash' | 'cash';
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number; // in HTG
  duration: string;
  description: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  beforeImage?: string;
  date: string;
}

export interface Review {
  id: string;
  proId: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  proResponse?: string;
}

export interface ProfessionalProfile {
  id: string;
  userId?: string;
  name: string;
  avatar: string;
  coverImage: string;
  title: string; // e.g. "Elektrisyen kalifye"
  categorySlug: string;
  categoryName: string;
  location: string;
  fullAddress: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  isVerified: boolean;
  hasInsurance: boolean;
  isFastResponse: boolean;
  isAvailable: boolean;
  distanceMinutes?: number;
  startingPrice: number;
  about: string;
  services: ServiceItem[];
  serviceAreas: string[];
  portfolio: PortfolioItem[];
  phone: string;
  whatsapp: string;
  completedJobsCount: number;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  nameHt: string;
  nameFr: string;
  nameEn: string;
  icon: string; // Lucide icon name
  count: number;
  popular?: boolean;
}

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ServiceRequest {
  id: string;
  referenceCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  proId: string;
  proName: string;
  proAvatar: string;
  proCategory: string;
  serviceId?: string;
  serviceName: string;
  description: string;
  address: string;
  date: string;
  timeSlot: string;
  priceEstimate: number; // in HTG
  estimatedPrice?: number;
  isUrgent?: boolean;
  status: RequestStatus;
  photos: string[];
  notes?: string;
  createdAt: string;
  paymentMethod?: 'moncash' | 'natcash' | 'cash';
  paid?: boolean;
  ratingGiven?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'pro';
  text: string;
  timestamp: string;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  proId: string;
  proName: string;
  proAvatar: string;
  proCategory: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface AppNotification {
  id: string;
  type:
    | 'request_created'
    | 'request_accepted'
    | 'appointment_reminder'
    | 'new_message'
    | 'request_completed'
    | 'payment_confirmed';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetScreen?: string;
  requestId?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: 'ouvri' | 'an_kou' | 'rezoli';
  date: string;
}
