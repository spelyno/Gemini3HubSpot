import React, { useState } from 'react';
import { LayoutDashboard, Users, Kanban, CheckSquare, Settings, Bell, Search, Menu, X, ClipboardList } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Deals from './components/Deals';
import Tasks from './components/Tasks';
import AuditLog from './components/AuditLog';
import { NavItem, Contact, Deal, Task, DealStage, ActivityLog } from './types';
import { MOCK_CONTACTS, MOCK_DEALS, MOCK_TASKS, MOCK_ACTIVITIES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App State
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activities] = useState<ActivityLog[]>(MOCK_ACTIVITIES);

  // Handlers
  const handleUpdateContact = (updated: Contact) => {
    setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleUpdateDeal = (updated: Deal) => {
    setDeals(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleAddDeal = () => {
    const newDeal: Deal = {
      id: `d${Date.now()}`,
      title: 'New Deal Opportunity',
      amount: 0,
      stage: DealStage.NEW,
      contactId: contacts[0]?.id || '', // Default to first contact for demo
      closeDate: new Date().toISOString().split('T')[0],
      probability: 10
    };
    setDeals([newDeal, ...deals]);
    setActiveTab('deals');
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (title: string, date: string) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      title,
      dueDate: date,
      completed: false
    };
    setTasks([newTask, ...tasks]);
  };

  // Nav Items Configuration
  const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'contacts', label: 'Contacts', icon: <Users size={20} /> },
    { id: 'deals', label: 'Deals', icon: <Kanban size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { id: 'audit', label: 'Audit Log', icon: <ClipboardList size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 h-full fixed left-0 top-0 bottom-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">N</div>
          <span className="text-xl font-bold text-white tracking-tight">Nexus CRM</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors w-full">
             <Settings size={20} />
             <span>Settings</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-slate-600">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 capitalize hidden sm:block">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder-slate-400" />
            </div>
            
            <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm cursor-pointer"></div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 text-slate-300 p-4 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                 <span className="text-xl font-bold text-white">Nexus</span>
                 <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                      activeTab === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {activeTab === 'dashboard' && <Dashboard deals={deals} tasks={tasks} />}
          {activeTab === 'contacts' && <Contacts contacts={contacts} onUpdateContact={handleUpdateContact} />}
          {activeTab === 'deals' && <Deals deals={deals} contacts={contacts} onUpdateDeal={handleUpdateDeal} onAddDeal={handleAddDeal} />}
          {activeTab === 'tasks' && <Tasks tasks={tasks} onToggleTask={handleToggleTask} onAddTask={handleAddTask} />}
          {activeTab === 'audit' && <AuditLog activities={activities} />}
        </div>

      </main>
    </div>
  );
};

export default App;