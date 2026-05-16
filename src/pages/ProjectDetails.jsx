import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import TaskBoard from '../components/TaskBoard';
import TaskModal from '../components/TaskModal';
import TaskFilterBar from '../components/TaskFilterBar';
import { Plus, UserPlus, X, Search } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [searchUser, setSearchUser] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showTeam, setShowTeam] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '' });
  const [loading, setLoading] = useState(true);

  const isAdmin = project?.createdBy?._id === user?._id;

  useEffect(() => { fetchProject(); fetchTasks(); }, [id]);

  const fetchProject = async () => {
    try { const { data } = await API.get(`/projects/${id}`); setProject(data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchTasks = async (f) => {
    try {
      const query = f || filters;
      const params = new URLSearchParams({ project: id });
      if (query.search) params.append('search', query.search);
      if (query.status) params.append('status', query.status);
      if (query.priority) params.append('priority', query.priority);
      const { data } = await API.get(`/tasks?${params.toString()}`);
      setTasks(data);
    } catch (e) { console.error(e); }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchTasks(newFilters);
  };

  const handleSearchUser = async (q) => {
    setSearchUser(q);
    if (q.length < 2) { setSearchResults([]); return; }
    try { const { data } = await API.get(`/users/search?q=${q}`); setSearchResults(data); }
    catch (e) { console.error(e); }
  };

  const handleAddMember = async (userId) => {
    try {
      await API.post(`/projects/${id}/members`, { userId });
      toast.success('Member added!');
      fetchProject();
      setSearchUser('');
      setSearchResults([]);
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await API.delete(`/projects/${id}/members/${userId}`);
      toast.success('Member removed');
      fetchProject();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Status updated');
      fetchTasks();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete task?')) return;
    try { await API.delete(`/tasks/${taskId}`); toast.success('Task deleted'); fetchTasks(); }
    catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div>
      {/* Project Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{project?.projectName}</h1>
          <p className="text-dark-400 text-sm mt-1">{project?.description || 'No description'}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button onClick={() => setShowTeam(!showTeam)} className="flex items-center gap-2 bg-dark-800 border border-white/10 hover:border-white/20 text-white px-4 py-2.5 rounded-xl text-sm transition-all">
                <UserPlus className="w-4 h-4" /> Team
              </button>
              <button onClick={() => { setEditTask(null); setShowTaskModal(true); }} className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/25">
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </>
          )}
        </div>
      </div>

      {/* Team Panel */}
      {showTeam && (
        <div className="bg-dark-800/50 border border-white/5 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">Team Members ({project?.members?.length})</h3>
          {isAdmin && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input value={searchUser} onChange={(e) => handleSearchUser(e.target.value)} placeholder="Search users by name or email..." className="w-full bg-dark-900/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-dark-600 text-sm focus:outline-none focus:border-primary-500" />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-white/10 rounded-xl overflow-hidden z-10 shadow-xl">
                  {searchResults.map((u) => (
                    <div key={u._id} onClick={() => handleAddMember(u._id)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0)?.toUpperCase()}</div>
                      <div><p className="text-sm text-white">{u.name}</p><p className="text-xs text-dark-500">{u.email}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {project?.members?.map((m) => (
              <div key={m._id} className="flex items-center gap-2 bg-dark-900/60 border border-white/5 rounded-xl px-3 py-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold">{m.name?.charAt(0)?.toUpperCase()}</div>
                <span className="text-sm text-white">{m.name}</span>
                {isAdmin && m._id !== user?._id && (
                  <button onClick={() => handleRemoveMember(m._id)} className="text-dark-500 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <TaskFilterBar filters={filters} onChange={handleFilterChange} />

      {/* Kanban Board */}
      <TaskBoard tasks={tasks} isAdmin={isAdmin} user={user} onStatusChange={handleStatusChange} onEdit={(t) => { setEditTask(t); setShowTaskModal(true); }} onDelete={handleDeleteTask} />

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal task={editTask} projectId={id} members={project?.members || []} onClose={() => setShowTaskModal(false)} onSaved={() => { fetchTasks(); setShowTaskModal(false); }} />
      )}
    </div>
  );
};

export default ProjectDetails;
