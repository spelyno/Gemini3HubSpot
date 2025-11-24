export type NavItem = 'dashboard' | 'contacts' | 'deals' | 'tasks' | 'settings';

export enum DealStage {
  NEW = 'New Lead',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal Sent',
  NEGOTIATION = 'Negotiation',
  WON = 'Closed Won',
  LOST = 'Closed Lost',
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  lastContacted: string; // ISO Date
  notes: string;
}

export interface Deal {
  id: string;
  title: string;
  amount: number;
  stage: DealStage;
  contactId: string; // Link to contact
  closeDate: string; // ISO Date
  probability: number; // 0-100
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  relatedTo?: string; // Generic relation string
}

export interface ActivityLog {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  description: string;
  timestamp: string;
  contactId?: string;
}
