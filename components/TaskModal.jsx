import React, { useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const TaskModal = ({ task, projectId, members, onClose, onSaved }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [desc, setDesc] = useState(task?.description || '');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo?._id || '');
  const [priority, setPriority] = useState(task?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '');
  const [status, setStatus] = useState(task?.status || 'Todo');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { title, description: desc, assignedTo: assignedTo || null, priority, dueDate: dueDate || null, status, project: projectId };
      if (task) {
        await API.put(`/tasks/${task._id}`, payload);
        toast.success('Task updated');
      } else {
        await API.post('/tasks', payload);
        toast.success('Task created');
      }
      onSaved();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full bg-dark-900/60 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-dark-800 border border-white/10 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-dark-400"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-dark-400 block mb-1.5">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Task title" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-dark-400 block mb-1.5">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Task description..." className={`${inputClass} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-dark-400 block mb-1.5">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-dark-400 block mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-dark-400 block mb-1.5">Assign To</label>
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="">Unassigned</option>
                {members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-dark-400 block mb-1.5">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-50">
            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
