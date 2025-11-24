
import { Contact, Deal, DealStage, Task, ActivityLog, Notification, UserProfile } from './types';

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', firstName: 'Alice', lastName: 'Johnson', email: 'alice@techcorp.com', phone: '+1 555-0101', company: 'TechCorp', position: 'CTO', lastContacted: '2023-10-25', notes: 'Interested in enterprise plan. Concerns about security compliance.' },
  { id: 'c2', firstName: 'Bob', lastName: 'Smith', email: 'bob@marketinggurus.io', phone: '+1 555-0102', company: 'MarketingGurus', position: 'VP Sales', lastContacted: '2023-10-28', notes: 'Met at conference. Looking for automation tools.' },
  { id: 'c3', firstName: 'Carol', lastName: 'Danvers', email: 'carol@avengers.inc', phone: '+1 555-0103', company: 'Avengers Inc', position: 'Director', lastContacted: '2023-10-20', notes: 'High priority lead. Needs fast implementation.' },
  { id: 'c4', firstName: 'David', lastName: 'Bowman', email: 'dave@discovery.org', phone: '+1 555-0104', company: 'Discovery One', position: 'Lead Engineer', lastContacted: '2023-10-15', notes: 'Evaluating API capabilities.' },
];

export const MOCK_DEALS: Deal[] = [
  { id: 'd1', title: 'TechCorp Enterprise License', amount: 50000, stage: DealStage.NEGOTIATION, contactId: 'c1', closeDate: '2023-11-15', probability: 80 },
  { id: 'd2', title: 'MarketingGurus Starter Pack', amount: 5000, stage: DealStage.QUALIFIED, contactId: 'c2', closeDate: '2023-12-01', probability: 40 },
  { id: 'd3', title: 'Avengers Global Rollout', amount: 120000, stage: DealStage.PROPOSAL, contactId: 'c3', closeDate: '2023-11-30', probability: 60 },
  { id: 'd4', title: 'Discovery API Integration', amount: 15000, stage: DealStage.NEW, contactId: 'c4', closeDate: '2024-01-10', probability: 20 },
  { id: 'd5', title: 'Previous Quarter Deal', amount: 30000, stage: DealStage.WON, contactId: 'c1', closeDate: '2023-09-15', probability: 100 },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Follow up with Alice regarding security docs', dueDate: '2023-11-01', completed: false, relatedTo: 'TechCorp Deal' },
  { id: 't2', title: 'Prepare slide deck for Avengers presentation', dueDate: '2023-11-05', completed: false, relatedTo: 'Avengers Inc' },
  { id: 't3', title: 'Send contract to legal', dueDate: '2023-10-30', completed: true, relatedTo: 'General' },
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  { 
    id: 'a1', 
    type: 'email', 
    user: 'Sarah Sales',
    action: 'Sent Proposal Email',
    details: 'Sent proposal v2 to Alice Johnson regarding Enterprise License',
    timestamp: '2023-10-25T14:30:00Z', 
    entityId: 'c1',
    entityType: 'contact'
  },
  { 
    id: 'a2', 
    type: 'call', 
    user: 'Mike Manager',
    action: 'Discovery Call',
    details: 'Discussed requirements with Bob Smith. Client is interested in Q4 deployment.',
    timestamp: '2023-10-28T10:00:00Z', 
    entityId: 'c2',
    entityType: 'contact'
  },
  { 
    id: 'a3', 
    type: 'update', 
    user: 'Sarah Sales',
    action: 'Updated Deal Stage',
    details: 'Moved "Avengers Global Rollout" from Qualified to Proposal Sent',
    timestamp: '2023-10-20T11:00:00Z', 
    entityId: 'd3',
    entityType: 'deal'
  },
  {
    id: 'a4',
    type: 'system',
    user: 'System Admin',
    action: 'System Maintenance',
    details: 'Scheduled maintenance completed successfully',
    timestamp: '2023-10-15T02:00:00Z',
    entityType: 'system'
  },
  {
    id: 'a5',
    type: 'create',
    user: 'Mike Manager',
    action: 'Created New Lead',
    details: 'Added David Bowman from Discovery One manually',
    timestamp: '2023-10-15T09:30:00Z',
    entityId: 'c4',
    entityType: 'contact'
  },
  {
    id: 'a6',
    type: 'delete',
    user: 'Sarah Sales',
    action: 'Deleted Task',
    details: 'Removed outdated task "Call John Doe"',
    timestamp: '2023-10-18T16:45:00Z',
    entityType: 'task'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { 
    id: 'n1', 
    title: 'New Lead Assigned', 
    message: 'You have been assigned a new lead: Sarah Connor.', 
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: false, 
    type: 'info' 
  },
  { 
    id: 'n2', 
    title: 'Task Due Soon', 
    message: 'Prepare slide deck is due tomorrow.', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false, 
    type: 'warning' 
  },
  { 
    id: 'n3', 
    title: 'Deal Won', 
    message: 'The TechCorp Enterprise License deal was closed won!', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true, 
    type: 'success' 
  },
  { 
    id: 'n4', 
    title: 'System Update', 
    message: 'Nexus CRM will undergo maintenance tonight at 2 AM.', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true, 
    type: 'alert' 
  },
];

export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: 'Sarah Sales',
  email: 'sarah@nexus.com',
  role: 'Senior Account Executive',
  phone: '+1 (555) 019-2834',
  location: 'San Francisco, CA',
  bio: 'Dedicated sales professional with 5+ years of experience in SaaS. Focused on building long-term client relationships and driving revenue growth.',
  notificationPreferences: {
    email: true,
    desktop: true,
    marketing: false
  }
};
