import React from 'react';
import TaskCard from './TaskCard';

const columns = [
  { key: 'Todo', label: 'To Do', color: 'bg-primary-500' },
  { key: 'In Progress', label: 'In Progress', color: 'bg-amber-500' },
  { key: 'Completed', label: 'Completed', color: 'bg-emerald-500' },
];

const TaskBoard = ({ tasks, isAdmin, user, onStatusChange, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div key={col.key} className="bg-dark-800/30 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div>
              <h3 className="text-sm font-semibold text-white">{col.label}</h3>
              <span className="ml-auto text-xs text-dark-500 bg-dark-900/60 px-2 py-0.5 rounded-full">{colTasks.length}</span>
            </div>
            <div className="space-y-3 min-h-[100px]">
              {colTasks.length === 0 ? (
                <p className="text-xs text-dark-600 text-center py-8">No tasks</p>
              ) : (
                colTasks.map((task) => (
                  <TaskCard key={task._id} task={task} isAdmin={isAdmin} user={user} onStatusChange={onStatusChange} onEdit={onEdit} onDelete={onDelete} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskBoard;
