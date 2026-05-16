import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, ListTodo, CheckCircle2, Clock, AlertTriangle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

const COLORS = ['#6366f1', '#f59e0b', '#22c55e'];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const [s, o, a] = await Promise.all([
        API.get('/dashboard/stats'),
        API.get('/dashboard/overdue'),
        API.get('/dashboard/activity'),
      ]);
      setStats(s.data);
      setOverdue(o.data);
      setActivities(a.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const cards = [
    { label: 'Total Projects', value: stats?.totalProjects || 0, icon: FolderKanban, gradient: 'from-primary-500 to-primary-700' },
    { label: 'Total Tasks', value: stats?.totalTasks || 0, icon: ListTodo, gradient: 'from-blue-500 to-blue-700' },
    { label: 'Completed', value: stats?.completedTasks || 0, icon: CheckCircle2, gradient: 'from-emerald-500 to-emerald-700' },
    { label: 'Pending', value: stats?.pendingTasks || 0, icon: Clock, gradient: 'from-amber-500 to-amber-700' },
    { label: 'Overdue', value: stats?.overdueTasks || 0, icon: AlertTriangle, gradient: 'from-red-500 to-red-700' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, <span className="bg-gradient-to-r from-primary-400 to-pink-400 bg-clip-text text-transparent">{user?.name}</span>
        </h1>
        <p className="text-dark-400 mt-1">Here's what's happening with your projects today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-dark-800/50 backdrop-blur border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-3 opacity-80 group-hover:opacity-100 transition-opacity`}>
              <c.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-dark-400 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-dark-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Task Status Distribution</h3>
          {stats?.statusBreakdown?.some(s => s.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stats.statusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {stats.statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {stats.statusBreakdown.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs text-dark-400">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    {item.name} ({item.value})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-dark-500">No tasks yet</div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-dark-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-400" /> Recent Activity
          </h3>
          {activities.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {activities.map((act) => (
                <div key={act._id} className="flex items-start gap-3 p-3 rounded-xl bg-dark-900/40 border border-white/5 hover:border-white/10 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {act.user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white"><span className="font-semibold">{act.user?.name}</span> <span className="text-dark-400">{act.action}</span></p>
                    <p className="text-xs text-dark-500 mt-0.5">{formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-dark-500">No recent activity</div>
          )}
        </div>
      </div>

      {/* Overdue Tasks */}
      {overdue.length > 0 && (
        <div className="bg-red-950/30 backdrop-blur border border-red-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Overdue Tasks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {overdue.map((t) => (
              <div key={t._id} className="bg-dark-900/60 border border-red-500/20 rounded-xl p-4 hover:border-red-500/40 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-white truncate flex-1">{t.title}</h4>
                  <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full uppercase shrink-0">Overdue</span>
                </div>
                <p className="text-xs text-dark-400">{t.project?.projectName}</p>
                <p className="text-xs text-red-400 mt-1">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
