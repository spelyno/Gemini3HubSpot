import React, { useState } from 'react';
import { ActivityLog } from '../types';
import { Search, Filter, Clock, Tag } from 'lucide-react';

interface AuditLogProps {
  activities: ActivityLog[];
}

const AuditLog: React.FC<AuditLogProps> = ({ activities }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
      activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || activity.type === filterType;

    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'create': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'delete': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'update': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'system': return 'bg-slate-700/30 text-slate-400 border-slate-600/30';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Audit Log</h2>
          <p className="text-slate-500 text-sm">Track system activities and user actions</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200 placeholder-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
             <select 
               className="appearance-none bg-slate-950 border border-slate-700 rounded-lg pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer text-slate-200"
               value={filterType}
               onChange={(e) => setFilterType(e.target.value)}
             >
               <option value="all">All Types</option>
               <option value="create">Create</option>
               <option value="update">Update</option>
               <option value="delete">Delete</option>
               <option value="email">Email</option>
               <option value="call">Call</option>
               <option value="system">System</option>
             </select>
             <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950 sticky top-0 z-10 shadow-sm shadow-black/10">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-48">Timestamp</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-48">User</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-32">Type</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Action & Details</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-32">Entity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-600" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-200 font-medium">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-bold border border-slate-700">
                         {log.user.charAt(0)}
                       </div>
                       {log.user}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(log.type)} capitalize`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{log.action}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{log.details}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {log.entityType && (
                      <div className="flex items-center gap-1.5">
                        <Tag size={14} />
                        <span className="capitalize">{log.entityType}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No logs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;