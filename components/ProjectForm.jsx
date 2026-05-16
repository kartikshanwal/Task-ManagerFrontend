import React, { useState } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const ProjectForm = ({ project, onClose, onSaved }) => {
  const [name, setName] = useState(project?.projectName || '');
  const [desc, setDesc] = useState(project?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (project) {
        await API.put(`/projects/${project._id}`, { projectName: name, description: desc });
        toast.success('Project updated');
      } else {
        await API.post('/projects', { projectName: name, description: desc });
        toast.success('Project created');
      }
      onSaved();
      onClose();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-dark-800 border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-dark-400"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-dark-400 block mb-1.5">Project Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="E-Commerce Website" className="w-full bg-dark-900/60 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-dark-600 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
          </div>
          <div>
            <label className="text-xs font-medium text-dark-400 block mb-1.5">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Describe your project..." className="w-full bg-dark-900/60 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-dark-600 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-50">
            {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
