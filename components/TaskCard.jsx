import React from 'react';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';

const priorityColors = {
  Low: 'bg-emerald-500/10 text-emerald-400',
  Medium: 'bg-amber-500/10 text-amber-400',
  High: 'bg-red-500/10 text-red-400',
};

const TaskCard = ({ task, isAdmin, user, onStatusChange, onEdit, onDelete }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
  const isAssignee = task.assignedTo?._id === user?._id;

  return (
    <div className={`bg-dark-900/60 border rounded-xl p-4 transition-all hover:border-white/15 group ${isOverdue ? 'border-red-500/30' : 'border-white/5'}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-white flex-1 truncate pr-2">{task.title}</h4>
        {isOverdue && (
          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded-full uppercase shrink-0 flex items-center gap-0.5">
            <AlertTriangle className="w-2.5 h-2.5" /> Overdue
          </span>
        )}
      </div>

      {task.description && <p className="text-xs text-dark-400 mb-3 line-clamp-2">{task.description}</p>}

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${priorityColors[task.priority]}`}>{task.priority}</span>
        {task.dueDate && <span className={`px-2 py-0.5 text-[10px] rounded-full ${isOverdue ? 'bg-red-500/10 text-red-400' : 'bg-dark-700 text-dark-400'}`}>{new Date(task.dueDate).toLocaleDateString()}</span>}
      </div>

      <div className="flex items-center justify-between">
        {task.assignedTo ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-pink-500 flex items-center justify-center text-white text-[8px] font-bold">{task.assignedTo?.name?.charAt(0)?.toUpperCase()}</div>
            <span className="text-[10px] text-dark-400">{task.assignedTo?.name}</span>
          </div>
        ) : <span className="text-[10px] text-dark-600">Unassigned</span>}

        <div className="flex items-center gap-1">
          {(isAssignee || isAdmin) && task.status !== 'Completed' && (
            <select value={task.status} onChange={(e) => onStatusChange(task._id, e.target.value)} className="bg-transparent text-[10px] text-dark-400 focus:outline-none cursor-pointer">
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}
          {isAdmin && (
            <>
              <button onClick={() => onEdit(task)} className="p-1 rounded hover:bg-white/5 text-dark-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"><Edit className="w-3.5 h-3.5" /></button>
              <button onClick={() => onDelete(task._id)} className="p-1 rounded hover:bg-red-500/10 text-dark-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
