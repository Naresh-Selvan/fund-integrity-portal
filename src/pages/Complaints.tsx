import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldAlert, AlertTriangle, Eye, RefreshCw } from 'lucide-react';
import { loadComplaints } from '@/data/mockComplaints';
import type { Complaint } from '@/data/mockComplaints';

export default function Complaints() {
  const [search, setSearch] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = () => {
    setLoading(true);
    loadComplaints().then(data => {
      setComplaints(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const filtered = complaints.filter(c => 
    c.id.toLowerCase().includes(search.toLowerCase()) || 
    c.projectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-medium text-text-primary">Citizen Complaints</h1>
            <button onClick={fetchComplaints} disabled={loading} className="text-text-muted hover:text-text-primary disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-text-muted mt-1">Review and manage reports submitted by citizens. Syncs in real-time.</p>
        </div>
      </div>

      <div className="bg-surface border border-hairline p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search complaints by ID or project..."
            className="w-full pl-9 pr-4 py-2 bg-surface-raised border border-hairline focus:border-text-primary outline-none text-sm transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-surface border border-hairline overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-raised border-b border-hairline">
            <tr>
              <th className="px-6 py-4 font-mono text-[11px] text-text-muted uppercase tracking-wider">Complaint ID</th>
              <th className="px-6 py-4 font-mono text-[11px] text-text-muted uppercase tracking-wider">Project</th>
              <th className="px-6 py-4 font-mono text-[11px] text-text-muted uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 font-mono text-[11px] text-text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-mono text-[11px] text-text-muted uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 font-mono text-[11px] text-text-muted uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-surface-raised/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{c.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-text-primary">{c.projectName}</div>
                  <div className="text-xs text-text-muted font-mono">{c.projectId}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5">
                    {c.category.includes('Corruption') ? (
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    {c.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[11px] uppercase tracking-wide font-medium ${
                    c.status === 'New' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                    c.status === 'Under Review' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-text-muted">{c.date}</td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/projects/${c.projectId}`} className="inline-flex items-center text-[12px] font-medium text-text-muted hover:text-text-primary transition-colors">
                    <Eye className="w-4 h-4 mr-1.5" /> View Project
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                  No complaints found matching "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
