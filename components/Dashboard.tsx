import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Deal, DealStage, Task } from '../types';
import { DollarSign, TrendingUp, Users, CheckSquare } from 'lucide-react';

interface DashboardProps {
  deals: Deal[];
  tasks: Task[];
}

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

const Dashboard: React.FC<DashboardProps> = ({ deals, tasks }) => {
  // Calculate Metrics
  const totalRevenue = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const wonRevenue = deals.filter(d => d.stage === DealStage.WON).reduce((sum, d) => sum + d.amount, 0);
  const openDealsCount = deals.filter(d => d.stage !== DealStage.WON && d.stage !== DealStage.LOST).length;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  // Prepare Chart Data
  const dealsByStage = Object.values(DealStage).map(stage => ({
    name: stage.split(' ')[0], // Short name
    value: deals.filter(d => d.stage === stage).length,
    amount: deals.filter(d => d.stage === stage).reduce((s, d) => s + d.amount, 0)
  }));

  const salesForecastData = dealsByStage.filter(d => d.amount > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pipeline</p>
            <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Closed Won</p>
            <p className="text-2xl font-bold text-emerald-600">${wonRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Open Deals</p>
            <p className="text-2xl font-bold text-slate-900">{openDealsCount}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Tasks</p>
            <p className="text-2xl font-bold text-amber-600">{pendingTasksCount}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <CheckSquare size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Pipeline Value by Stage</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesForecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Deal Count Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Deal Count by Stage</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dealsByStage}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {dealsByStage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-slate-600">
             {dealsByStage.map((d, i) => (
               <div key={d.name} className="flex items-center gap-1">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                 {d.name} ({d.value})
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
