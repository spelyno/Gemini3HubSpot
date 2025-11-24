import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Users, Kanban, CheckSquare, Settings, Bell, Search, Menu, X, ClipboardList, LogOut, User, ArrowLeft, Sparkles, Loader2, Database } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Deals from './components/Deals';
import Tasks from './components/Tasks';
import AuditLogComponent from './components/AuditLog';
import Profile from './components/Profile';
import { NavItem, Contact, Deal, Task, DealStage, ActivityLog, Notification, UserProfile } from './types';
import { MOCK_USER } from './constants';
import { GeminiService } from './services/geminiService';
import { db } from './services/db';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [history, setHistory] = useState<NavItem[]>([]); // Track navigation history
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // App State
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USER);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [dealFilter, setDealFilter] = useState<DealStage | null>(null);

  // AI Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Initialize DB and Fetch Data
  useEffect(() => {
    const initApp = async () => {
      try {
        await db.init();
        await refreshData();
      } catch (error) {
        console.error("Failed to initialize database", error);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const refreshData = async () => {
    const [fetchedContacts, fetchedDeals, fetchedTasks, fetchedActivities, fetchedNotifications, fetchedUser] = await Promise.all([
      db.contacts.getAll(),
      db.deals.getAll(),
      db.tasks.getAll(),
      db.activities.getAll(),
      db.notifications.getAll(),
      db.user.get()
    ]);

    setContacts(fetchedContacts);
    setDeals(fetchedDeals);
    setTasks(fetchedTasks);
    setActivities(fetchedActivities);
    setNotifications(fetchedNotifications);
    setCurrentUser(fetchedUser);
  };

  // Handlers
  const navigateTo = (tab: NavItem) => {
    if (activeTab === tab) return;
    setHistory(prev => [...prev, activeTab]);
    setActiveTab(tab);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prevTab = newHistory.pop();
      setHistory(newHistory);
      if (prevTab) setActiveTab(prevTab);
    } else {
      // Fallback
      setActiveTab('dashboard');
    }
  };

  const handleUpdateContact = async (updated: Contact) => {
    // Optimistic Update
    setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
    
    await db.contacts.update(updated);
    
    // Log Activity
    const log: ActivityLog = {
      id: `a${Date.now()}`,
      type: 'update',
      user: currentUser.name,
      action: 'Updated Contact',
      details: `Updated details for ${updated.firstName} ${updated.lastName}`,
      timestamp: new Date().toISOString(),
      entityId: updated.id,
      entityType: 'contact'
    };
    await db.activities.add(log);
    setActivities(prev => [log, ...prev]);
  };

  const handleUpdateDeal = async (updated: Deal) => {
    const oldDeal = deals.find(d => d.id === updated.id);
    
    // Optimistic Update
    setDeals(prev => prev.map(d => d.id === updated.id ? updated : d));
    
    await db.deals.update(updated);

    // Check for changes to log
    if (oldDeal) {
      if (oldDeal.stage !== updated.stage) {
        const log: ActivityLog = {
          id: `a${Date.now()}`,
          type: 'update',
          user: currentUser.name,
          action: 'Deal Stage Changed',
          details: `Moved "${updated.title}" to ${updated.stage}`,
          timestamp: new Date().toISOString(),
          entityId: updated.id,
          entityType: 'deal'
        };
        await db.activities.add(log);
        setActivities(prev => [log, ...prev]);
      } else if (oldDeal.amount !== updated.amount) {
        const log: ActivityLog = {
          id: `a${Date.now()}`,
          type: 'update',
          user: currentUser.name,
          action: 'Deal Value Updated',
          details: `Updated "${updated.title}" amount from $${oldDeal.amount.toLocaleString()} to $${updated.amount.toLocaleString()}`,
          timestamp: new Date().toISOString(),
          entityId: updated.id,
          entityType: 'deal'
        };
        await db.activities.add(log);
        setActivities(prev => [log, ...prev]);
      }
    }
  };

  const handleUpdateProfile = async (updatedUser: UserProfile) => {
    await db.user.update(updatedUser);
    setCurrentUser(updatedUser);
  };

  const handleAddDeal = async () => {
    const newDeal: Deal = {
      id: `d${Date.now()}`,
      title: 'New Deal Opportunity',
      amount: 0,
      stage: DealStage.NEW,
      contactId: contacts[0]?.id || '', // Default to first contact for demo
      closeDate: new Date().toISOString().split('T')[0],
      probability: 10
    };

    await db.deals.add(newDeal);
    
    const log: ActivityLog = {
      id: `a${Date.now()}`,
      type: 'create',
      user: currentUser.name,
      action: 'Created Deal',
      details: `Created new deal "${newDeal.title}"`,
      timestamp: new Date().toISOString(),
      entityId: newDeal.id,
      entityType: 'deal'
    };
    await db.activities.add(log);

    await refreshData();
    setActiveTab('deals');
    setDealFilter(null);
  };

  const handleToggleTask = async (id: string) => {
    // Optimistic
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    await db.tasks.toggle(id);
  };

  const handleAddTask = async (title: string, date: string) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      title,
      dueDate: date,
      completed: false
    };
    await db.tasks.add(newTask);
    
    const log: ActivityLog = {
      id: `a${Date.now()}`,
      type: 'create',
      user: currentUser.name,
      action: 'Created Task',
      details: `Added task "${newTask.title}"`,
      timestamp: new Date().toISOString(),
      entityType: 'task'
    };
    await db.activities.add(log);
    
    await refreshData();
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await db.notifications.markAllRead();
  };

  const handleNotificationClick = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await db.notifications.markRead(id);
  };

  const handleDrillDown = (stage: DealStage) => {
    setDealFilter(stage);
    navigateTo('deals');
  };

  // AI Global Search Handler
  const handleGlobalSearch = async (e: React.KeyboardEvent<HTMLInputElement> | React.FormEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setShowSearchModal(true);
    setIsAiThinking(true);
    setAiResponse(null);

    const contextData = {
      contacts,
      deals,
      tasks,
      activities,
      notifications,
      user: currentUser
    };

    const response = await GeminiService.askAiAboutData(searchQuery, contextData);
    setAiResponse(response);
    setIsAiThinking(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Nav Items Configuration
  const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'contacts', label: 'Contacts', icon: <Users size={20} /> },
    { id: 'deals', label: 'Deals', icon: <Kanban size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { id: 'audit', label: 'Audit Log', icon: <ClipboardList size={20} /> },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-indigo-400 gap-3 flex-col">
        <Database size={48} className="animate-pulse" />
        <div className="flex items-center gap-2 text-slate-400">
           <Loader2 className="animate-spin" size={20}/>
           <span>Connecting to Nexus Database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-400 h-full fixed left-0 top-0 bottom-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">N</div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">Nexus CRM</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigateTo(item.id);
                if (item.id === 'deals') setDealFilter(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                  : 'hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 transition-colors w-full">
             <Settings size={20} />
             <span>Settings</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col h-full overflow-hidden relative bg-slate-950">
        
        {/* Header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-slate-400">
              <Menu size={24} />
            </button>
            
            {activeTab !== 'dashboard' && (
              <button 
                onClick={handleBack} 
                className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Go Back"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            <h1 className="text-xl font-semibold text-slate-100 capitalize hidden sm:block">
              {activeTab === 'profile' ? 'My Profile' : navItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Global Search / AI Chat */}
            <div className="relative z-50" ref={searchContainerRef}>
              <div className={`hidden md:flex items-center bg-slate-800 rounded-lg px-3 py-2 w-64 lg:w-96 border transition-all ${showSearchModal ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500'}`}>
                {isAiThinking ? <Loader2 size={18} className="text-indigo-400 animate-spin" /> : <Search size={18} className="text-slate-500" />}
                <input 
                  type="text" 
                  placeholder="Ask Nexus AI (e.g., 'Show deals over 10k')..." 
                  className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-200 placeholder-slate-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleGlobalSearch}
                  onFocus={() => { if(aiResponse) setShowSearchModal(true) }}
                />
                <Sparkles size={16} className="text-indigo-400 opacity-70 ml-2" />
              </div>

              {/* Search Result / AI Modal */}
              {showSearchModal && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 rounded-xl shadow-2xl shadow-black/50 border border-slate-800 p-4 min-h-[100px] animate-fade-in z-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm">
                      <Sparkles size={14} />
                      <span>Nexus AI</span>
                    </div>
                    <button onClick={() => setShowSearchModal(false)} className="text-slate-500 hover:text-slate-300">
                      <X size={14} />
                    </button>
                  </div>
                  
                  {isAiThinking ? (
                    <div className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                        <Loader2 size={16} className="animate-spin" />
                        <span>Analyzing database...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {aiResponse || "Ask me anything about your contacts, deals, or tasks."}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-slate-400 hover:text-indigo-400 transition-colors p-2"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900 rounded-xl shadow-2xl shadow-black/50 border border-slate-800 z-50 overflow-hidden animate-fade-in ring-1 ring-white/5">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                    <h3 className="font-semibold text-slate-200">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-sm">
                        No notifications yet.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-800">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`p-4 hover:bg-slate-800 transition-colors cursor-pointer ${!notification.read ? 'bg-indigo-900/10' : ''}`}
                          >
                            <div className="flex gap-3">
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notification.read ? 'bg-indigo-500' : 'bg-slate-600'}`}></div>
                              <div className="flex-1">
                                <p className={`text-sm ${!notification.read ? 'font-semibold text-slate-200' : 'font-medium text-slate-400'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-[10px] text-slate-600 mt-2">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-slate-700 shadow-sm cursor-pointer hover:shadow-indigo-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center text-white font-bold text-xs"
              >
                  {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                      <span>{currentUser.name.charAt(0)}</span>
                  )}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 rounded-xl shadow-2xl shadow-black/50 border border-slate-800 z-50 overflow-hidden animate-fade-in ring-1 ring-white/5">
                  <div className="p-4 border-b border-slate-800 bg-slate-800/50">
                    <p className="text-sm font-semibold text-slate-200">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => {
                        navigateTo('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-indigo-400 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-indigo-400 rounded-lg flex items-center gap-2 transition-colors">
                      <Settings size={16} />
                      <span>Account Settings</span>
                    </button>
                    <div className="h-px bg-slate-800 my-1"></div>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg flex items-center gap-2 transition-colors">
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 text-slate-300 p-4 shadow-2xl border-r border-slate-800">
              <div className="flex justify-between items-center mb-8">
                 <span className="text-xl font-bold text-white">Nexus</span>
                 <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigateTo(item.id);
                      if (item.id === 'deals') setDealFilter(null);
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
        <div className="flex-1 overflow-auto p-4 lg:p-8 custom-scrollbar">
          {activeTab === 'dashboard' && <Dashboard deals={deals} tasks={tasks} onDrillDown={handleDrillDown} />}
          {activeTab === 'contacts' && <Contacts contacts={contacts} onUpdateContact={handleUpdateContact} />}
          {activeTab === 'deals' && (
            <Deals 
              deals={deals} 
              contacts={contacts} 
              onUpdateDeal={handleUpdateDeal} 
              onAddDeal={handleAddDeal} 
              filterStage={dealFilter}
              onClearFilter={() => setDealFilter(null)}
            />
          )}
          {activeTab === 'tasks' && <Tasks tasks={tasks} onToggleTask={handleToggleTask} onAddTask={handleAddTask} />}
          {activeTab === 'audit' && <AuditLogComponent activities={activities} />}
          {activeTab === 'profile' && <Profile user={currentUser} onUpdate={handleUpdateProfile} />}
        </div>

      </main>
    </div>
  );
};

export default App;