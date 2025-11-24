import { 
  Contact, Deal, Task, ActivityLog, Notification, UserProfile, DealStage 
} from '../types';
import { 
  MOCK_CONTACTS, MOCK_DEALS, MOCK_TASKS, MOCK_ACTIVITIES, MOCK_NOTIFICATIONS, MOCK_USER 
} from '../constants';

const KEYS = {
  CONTACTS: 'nexus_contacts',
  DEALS: 'nexus_deals',
  TASKS: 'nexus_tasks',
  ACTIVITIES: 'nexus_activities',
  NOTIFICATIONS: 'nexus_notifications',
  USER: 'nexus_user',
};

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  /**
   * Initialize the database. 
   * Checks if data exists in localStorage; if not, seeds it with mock data.
   */
  init: async () => {
    await delay(500); // Simulate connection time
    if (!localStorage.getItem(KEYS.CONTACTS)) localStorage.setItem(KEYS.CONTACTS, JSON.stringify(MOCK_CONTACTS));
    if (!localStorage.getItem(KEYS.DEALS)) localStorage.setItem(KEYS.DEALS, JSON.stringify(MOCK_DEALS));
    if (!localStorage.getItem(KEYS.TASKS)) localStorage.setItem(KEYS.TASKS, JSON.stringify(MOCK_TASKS));
    if (!localStorage.getItem(KEYS.ACTIVITIES)) localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(MOCK_ACTIVITIES));
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(MOCK_NOTIFICATIONS));
    if (!localStorage.getItem(KEYS.USER)) localStorage.setItem(KEYS.USER, JSON.stringify(MOCK_USER));
    return true;
  },

  contacts: {
    getAll: async (): Promise<Contact[]> => {
      await delay(200);
      return JSON.parse(localStorage.getItem(KEYS.CONTACTS) || '[]');
    },
    update: async (contact: Contact): Promise<void> => {
      await delay(300);
      const contacts = JSON.parse(localStorage.getItem(KEYS.CONTACTS) || '[]');
      const index = contacts.findIndex((c: Contact) => c.id === contact.id);
      if (index !== -1) {
        contacts[index] = contact;
        localStorage.setItem(KEYS.CONTACTS, JSON.stringify(contacts));
      }
    }
  },

  deals: {
    getAll: async (): Promise<Deal[]> => {
      await delay(200);
      return JSON.parse(localStorage.getItem(KEYS.DEALS) || '[]');
    },
    add: async (deal: Deal): Promise<void> => {
      await delay(300);
      const deals = JSON.parse(localStorage.getItem(KEYS.DEALS) || '[]');
      deals.unshift(deal); // Add to top
      localStorage.setItem(KEYS.DEALS, JSON.stringify(deals));
    },
    update: async (deal: Deal): Promise<void> => {
      await delay(300);
      const deals = JSON.parse(localStorage.getItem(KEYS.DEALS) || '[]');
      const index = deals.findIndex((d: Deal) => d.id === deal.id);
      if (index !== -1) {
        deals[index] = deal;
        localStorage.setItem(KEYS.DEALS, JSON.stringify(deals));
      }
    }
  },

  tasks: {
    getAll: async (): Promise<Task[]> => {
      await delay(200);
      return JSON.parse(localStorage.getItem(KEYS.TASKS) || '[]');
    },
    add: async (task: Task): Promise<void> => {
      await delay(300);
      const tasks = JSON.parse(localStorage.getItem(KEYS.TASKS) || '[]');
      tasks.unshift(task);
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    },
    update: async (task: Task): Promise<void> => {
      await delay(200);
      const tasks = JSON.parse(localStorage.getItem(KEYS.TASKS) || '[]');
      const index = tasks.findIndex((t: Task) => t.id === task.id);
      if (index !== -1) {
        tasks[index] = task;
        localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
      }
    },
    toggle: async (id: string): Promise<void> => {
        await delay(200);
        const tasks: Task[] = JSON.parse(localStorage.getItem(KEYS.TASKS) || '[]');
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index].completed = !tasks[index].completed;
            localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
        }
    }
  },

  activities: {
    getAll: async (): Promise<ActivityLog[]> => {
      await delay(200);
      return JSON.parse(localStorage.getItem(KEYS.ACTIVITIES) || '[]');
    },
    add: async (activity: ActivityLog): Promise<void> => {
      // No simulated delay for logs to keep UI snappy, usually background process
      const logs = JSON.parse(localStorage.getItem(KEYS.ACTIVITIES) || '[]');
      logs.unshift(activity);
      localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(logs));
    }
  },

  notifications: {
    getAll: async (): Promise<Notification[]> => {
      await delay(200);
      return JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
    },
    markRead: async (id: string): Promise<void> => {
      const notes: Notification[] = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
      const index = notes.findIndex(n => n.id === id);
      if (index !== -1) {
        notes[index].read = true;
        localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notes));
      }
    },
    markAllRead: async (): Promise<void> => {
        const notes: Notification[] = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
        const updated = notes.map(n => ({...n, read: true}));
        localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    }
  },

  user: {
    get: async (): Promise<UserProfile> => {
        await delay(200);
        return JSON.parse(localStorage.getItem(KEYS.USER) || JSON.stringify(MOCK_USER));
    },
    update: async (user: UserProfile): Promise<void> => {
        await delay(500);
        localStorage.setItem(KEYS.USER, JSON.stringify(user));
    }
  }
};
