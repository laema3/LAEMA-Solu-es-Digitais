export type ChannelType = 'whatsapp' | 'instagram' | 'email' | 'website';

export type TicketStatus = 'open' | 'pending' | 'resolved';

export type SentimentType = 'Positivo' | 'Neutro' | 'Frustrado/Urgente';

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'bot';
  senderName: string;
  text: string;
  timestamp: string;
  channel: ChannelType;
  attachments?: string[];
  subject?: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerAvatar: string;
  customerEmail: string;
  customerPhone: string;
  channel: ChannelType;
  status: TicketStatus;
  sentiment: SentimentType;
  urgencyScore: number;
  unreadCount: number;
  lastMessageTime: string;
  assignedAgent: string;
  tags: string[];
  messages: Message[];
  notes?: string[];
  company?: string;
  satisfactionScore?: number;
}

export interface Visit {
  id: string;
  clientName: string;
  clientPhone: string;
  address: string;
  serviceType: 'Dedetização de Baratas/Formigas' | 'Desratização' | 'Descupinização' | 'Sanitização de Ambientes' | 'Inspeção Técnica';
  scheduledDate: string;
  scheduledPeriod: 'Manhã (08h - 12h)' | 'Tarde (13h - 18h)';
  technicianName: string;
  status: 'Agendado' | 'Confirmado pelo Cliente' | 'Em Andamento' | 'Concluído' | 'Reagendado';
  notes?: string;
}

export interface SocialPost {
  id: string;
  caption: string;
  imageUrl: string;
  platforms: ('instagram' | 'facebook')[];
  scheduledDate: string;
  scheduledTime: string;
  status: 'Agendado' | 'Publicado' | 'Rascunho';
}

export interface KnowledgeItem {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}

export interface Tenant {
  id: string;
  name: string; // e.g. "Ambiental Controle de Pragas"
  slug: string; // e.g. "ambiental-pragas"
  segment: string; // e.g. "Controle de Pragas"
  ownerName: string;
  whatsappNumber: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  status: 'Ativo' | 'Bloqueado' | 'Teste';
  customDomain: string; // e.g. "ambientalcontroledepragas.com.br"
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: 'Atendente' | 'Super Admin';
  avatar: string;
}

