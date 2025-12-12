export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  coins: number;
  role: 'Membro' | 'Moderador' | 'Admin' | 'Influencer' | 'Governo';
  isVerified: boolean;
  bio: string;
  followers: number;
  following: number;
  caregiverName?: string;
  childName?: string;
  childNameColor?: string;
  childAge?: string;
  city?: string;
  state?: string;
  country?: string;
  cnpj?: string; // For government entities
}

export interface OfficialResponse {
  text: string;
  responderName: string;
  timestamp: Date;
  verified: boolean;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: Date;
  isLiked?: boolean;
  type?: 'regular' | 'denuncia'; // Distinguish post type
  denunciaDetails?: {
    agency: string; // e.g., Hospital, School
    location: string;
  };
  officialResponse?: OfficialResponse;
}

export interface Ad {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  link?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  members: number;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  isMe: boolean;
  timestamp: Date;
}

export interface Chat {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
}

export interface AccessSettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}