import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit, Users, FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';
import ProjectForm from '../components/ProjectForm';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Projects</h1>
          <p className="text-dark-400 mt-1">Manage your projects and teams</p>
        </div>
        <button onClick={() => { setEditProject(null); setShowForm(true); }} className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/25">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <FolderKanban className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 text-lg">No projects yet. Create your first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => {
            const isAdmin = p.createdBy?._id === user?._id;
            return (
              <div key={p._id} onClick={() => navigate(`/projects/${p._id}`)} className="bg-dark-800/50 backdrop-blur border border-white/5 rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">{p.projectName?.charAt(0)?.toUpperCase()}</div>
                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => { setEditProject(p); setShowForm(true); }} className="p-2 rounded-lg hover:bg-white/5 text-dark-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-dark-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 truncate">{p.projectName}</h3>
                <p className="text-sm text-dark-400 mb-4 line-clamp-2">{p.description || 'No description'}</p>
                <div className="flex items-center gap-2 text-xs text-dark-500">
                  <Users className="w-3.5 h-3.5" /> {p.members?.length || 0} members
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <ProjectForm project={editProject} onClose={() => setShowForm(false)} onSaved={fetchProjects} />}
    </div>
  );
};

export default Projects;
