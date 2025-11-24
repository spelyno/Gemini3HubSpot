import React, { useState } from 'react';
import { Task } from '../types';
import { Check, Circle, Calendar, Plus } from 'lucide-react';

interface TasksProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, date: string) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, onToggleTask, onAddTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    onAddTask(newTaskTitle, newTaskDate || new Date().toISOString().split('T')[0]);
    setNewTaskTitle('');
    setNewTaskDate('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100">My Tasks</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500 flex items-center gap-2 shadow-lg shadow-indigo-900/30"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-800 mb-6 animate-fade-in">
          <div className="flex gap-4 items-center">
             <input 
               type="text" 
               placeholder="What needs to be done?" 
               className="flex-1 p-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200 placeholder-slate-500"
               value={newTaskTitle}
               onChange={e => setNewTaskTitle(e.target.value)}
               autoFocus
             />
             <input 
               type="date" 
               className="p-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200"
               value={newTaskDate}
               onChange={e => setNewTaskDate(e.target.value)}
             />
             <div className="flex gap-2">
               <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500">Save</button>
               <button type="button" onClick={() => setIsAdding(false)} className="bg-slate-800 text-slate-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700">Cancel</button>
             </div>
          </div>
        </form>
      )}

      <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 divide-y divide-slate-800">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No tasks found. Enjoy your day!</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors group">
              <button 
                onClick={() => onToggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 hover:border-indigo-500'}`}
              >
                {task.completed && <Check size={14} className="text-white" />}
              </button>
              
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {task.title}
                </p>
                {task.relatedTo && (
                  <p className="text-xs text-slate-500 mt-1">
                    Related to: <span className="font-medium text-indigo-400">{task.relatedTo}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Calendar size={14} />
                <span>{task.dueDate}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;