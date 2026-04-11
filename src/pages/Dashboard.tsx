import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Activity,
  ArrowUpRight,
  Clock,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import { formatDate, cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/api/dashboard/summary');
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64">Loading Dashboard...</div>;

  const pieData = [
    { name: 'Safe', value: summary?.safeAnalyses || 0, color: '#22C55E' },
    { name: 'Risky', value: summary?.riskyAnalyses || 0, color: '#EF4444' },
  ];

  const barData = [
    { name: 'API Mode', value: summary?.modeUsage?.api || 0 },
    { name: 'Offline Mode', value: summary?.modeUsage?.offline || 0 },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Analyses" 
          value={summary?.totalAnalyses || 0} 
          icon={Activity} 
          color="blue"
        />
        <StatCard 
          title="Safe Content" 
          value={summary?.safeAnalyses || 0} 
          icon={ShieldCheck} 
          color="green"
        />
        <StatCard 
          title="Risky Content" 
          value={summary?.riskyAnalyses || 0} 
          icon={ShieldAlert} 
          color="red"
        />
        <StatCard 
          title="Active Users" 
          value="1" 
          icon={Users} 
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-10">
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold text-gov-navy mb-8">Mode Usage Distribution</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-gov-navy">Recent Activity</h3>
              <Link to="/reports" className="text-sm text-gov-blue font-bold flex items-center gap-1 hover:underline">
                View All <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {summary?.recentAnalyses?.length > 0 ? (
                summary.recentAnalyses.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-5 rounded-2xl bg-gov-bg border border-gov-border hover:border-gov-blue/30 transition-colors group">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "p-3 rounded-xl transition-colors",
                        item.riskScore > 50 ? "bg-red-50 text-gov-danger" : "bg-emerald-50 text-gov-success"
                      )}>
                        {item.type === 'Text' ? <FileText className="w-5 h-5" /> : item.type === 'Image' ? <ImageIcon className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-gov-navy">{item.type} Analysis</p>
                        <p className="text-xs text-gov-text-muted flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5" /> {formatDate(item.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-bold",
                        item.riskScore > 50 ? "text-gov-danger" : "text-gov-success"
                      )}>
                        {item.category}
                      </p>
                      <p className="text-[10px] text-gov-text-muted font-bold uppercase tracking-wider mt-0.5">{item.mode} Mode</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gov-text-muted italic">No recent activity recorded.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-10">
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold text-gov-navy mb-8">Risk Distribution</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-8 mt-6">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-bold text-gov-text-dark">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="gov-gradient p-8 rounded-[16px] text-white shadow-xl shadow-gov-navy/20">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gov-blue" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <QuickAction to="/text" label="Analyze Text" />
              <QuickAction to="/image" label="Analyze Image" />
              <QuickAction to="/link" label="Analyze Link" />
              <QuickAction to="/reports" label="View Reports" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-gov-blue border-blue-100",
    green: "bg-emerald-50 text-gov-success border-emerald-100",
    red: "bg-rose-50 text-gov-danger border-rose-100",
    teal: "bg-teal-50 text-gov-teal border-teal-100",
  };

  return (
    <div className="glass-card p-8 flex items-center gap-6">
      <div className={cn("p-5 rounded-2xl border shadow-sm", colors[color])}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-xs font-bold text-gov-text-muted uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-bold text-gov-navy">{value}</p>
      </div>
    </div>
  );
}

function QuickAction({ to, label }: { to: string, label: string }) {
  return (
    <Link 
      to={to} 
      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-center transition-all border border-white/10 uppercase tracking-wider"
    >
      {label}
    </Link>
  );
}


