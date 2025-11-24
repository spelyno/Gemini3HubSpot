
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Phone, MapPin, Briefcase, Camera, Save, Bell, Shield, Loader2 } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState(user);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: keyof UserProfile['notificationPreferences']) => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [field]: !prev.notificationPreferences[field]
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onUpdate(formData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-500 z-0"></div>
        
        <div className="relative z-10 mt-8 md:mt-0 flex flex-col md:flex-row items-center gap-6 w-full">
            <div className="relative group">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white bg-slate-200 shadow-md flex items-center justify-center text-3xl font-bold text-slate-500 overflow-hidden">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</span>
                    )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors" title="Change Avatar">
                    <Camera size={16} />
                </button>
            </div>
            
            <div className="text-center md:text-left pt-8 md:pt-12">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <p className="text-slate-500 font-medium">{user.role}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {user.location}</span>
                    <span className="hidden md:inline text-slate-300">|</span>
                    <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Navigation/Summary (Optional, keeping it simple as a form for now) or additional info */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information Form */}
            <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <User size={20} className="text-indigo-600" />
                        Personal Information
                    </h3>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Job Title</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                value={formData.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="tel" 
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Bio</label>
                        <textarea 
                            value={formData.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            rows={4}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                        />
                        <p className="text-xs text-slate-400 text-right">Brief description for your team profile.</p>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-4">
                    {showSuccess && <span className="text-emerald-600 text-sm font-medium animate-fade-in">Changes saved successfully!</span>}
                    <button 
                        type="button" 
                        onClick={() => setFormData(user)}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Bell size={20} className="text-indigo-600" />
                        Notifications
                    </h3>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-800">Email Notifications</p>
                            <p className="text-xs text-slate-500">Receive daily summaries</p>
                        </div>
                        <button 
                            onClick={() => handlePreferenceChange('email')}
                            className={`w-11 h-6 rounded-full transition-colors relative ${formData.notificationPreferences.email ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.notificationPreferences.email ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-800">Desktop Alerts</p>
                            <p className="text-xs text-slate-500">Real-time browser popups</p>
                        </div>
                         <button 
                            onClick={() => handlePreferenceChange('desktop')}
                            className={`w-11 h-6 rounded-full transition-colors relative ${formData.notificationPreferences.desktop ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.notificationPreferences.desktop ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-800">Marketing Updates</p>
                            <p className="text-xs text-slate-500">News about Nexus CRM</p>
                        </div>
                         <button 
                            onClick={() => handlePreferenceChange('marketing')}
                            className={`w-11 h-6 rounded-full transition-colors relative ${formData.notificationPreferences.marketing ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.notificationPreferences.marketing ? 'translate-x-5' : ''}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Shield size={20} className="text-indigo-600" />
                        Security
                    </h3>
                </div>
                <div className="p-4 space-y-3">
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
                        Change Password
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
                        Two-Factor Authentication
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
