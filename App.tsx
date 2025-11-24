import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Users, Kanban, CheckSquare, Settings, Bell, Search, Menu, X, ClipboardList, LogOut, User, ArrowLeft } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Deals from './components/Deals';
import Tasks from './components/Tasks';
import AuditLog from './components/AuditLog';
import Profile from './components/Profile';
import { NavItem, Contact, Deal, Task, DealStage, ActivityLog, Notification, UserProfile } from './types';
import { MOCK_CONTACTS, MOCK_DEALS, MOCK_TASKS, MOCK_ACTIVITIES, MOCK_NOTIFICATIONS, MOCK_USER } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [history, setHistory] = useState<NavItem[]>([]); // Track navigation history
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App State
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USER);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activities] = useState<ActivityLog[]>(MOCK_ACTIVITIES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [dealFilter, setDealFilter] = useState<DealStage | null>(null);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const handleUpdateContact = (updated: Contact) => {
    setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleUpdateDeal = (updated: Deal) => {
    setDeals(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
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
    setDealFilter(null); // Clear filter when adding new deal
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

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDrillDown = (stage: DealStage) => {
    setDealFilter(stage);
    navigateTo('deals');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Notifications
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      // Profile Menu
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
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
                if (item.id === 'deals') setDealFilter(null); // Clear filter when manually navigating
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
            <div className="hidden md:flex items-center bg-slate-800 rounded-lg px-3 py-2 w-64 border border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <Search size={18} className="text-slate-500" />
              <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-200 placeholder-slate-500" />
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
          {activeTab === 'audit' && <AuditLog activities={activities} />}
          {activeTab === 'profile' && <Profile user={currentUser} onUpdate={handleUpdateProfile} />}
        </div>

      </main>
    </div>
  );
};

export default App;