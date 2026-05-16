import React from 'react';
import { Search } from 'lucide-react';

const TaskFilterBar = ({ filters, onChange }) => {
  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
        <input value={filters.search} onChange={(e) => update('search', e.target.value)} placeholder="Search tasks..." className="w-full bg-dark-800/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-dark-600 text-sm focus:outline-none focus:border-primary-500" />
      </div>
      <select value={filters.status} onChange={(e) => update('status', e.target.value)} className="bg-dark-800/50 border border-white/5 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-primary-500 appearance-none cursor-pointer">
        <option value="">All Status</option>
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <select value={filters.priority} onChange={(e) => update('priority', e.target.value)} className="bg-dark-800/50 border border-white/5 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-primary-500 appearance-none cursor-pointer">
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
};

export default TaskFilterBar;
