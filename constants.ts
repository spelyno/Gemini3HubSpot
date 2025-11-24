import { Contact, Deal, DealStage, Task, ActivityLog } from './types';

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
  { id: 'a1', type: 'email', description: 'Sent proposal v2', timestamp: '2023-10-25T14:30:00Z', contactId: 'c1' },
  { id: 'a2', type: 'call', description: 'Discovery call - went well', timestamp: '2023-10-28T10:00:00Z', contactId: 'c2' },
  { id: 'a3', type: 'meeting', description: 'Demo with engineering team', timestamp: '2023-10-20T11:00:00Z', contactId: 'c3' },
];
