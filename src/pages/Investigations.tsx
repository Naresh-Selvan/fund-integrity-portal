import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus
} from 'lucide-react';
import { mockProjects, riskFactorsById } from '@/data/mockProjects';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';

export type InvestigationStatus = 'Open' | 'Under Review' | 'Escalated' | 'Closed';

export interface Investigation {
  id: string;
  projectId: string;
  projectName: string;
  linkedProjectsCount: number;
  priority: 'High' | 'Medium' | 'Low';
  officer: string;
  status: InvestigationStatus;
  openedAt: string;
  lastActivity: string;
  summary: string;
}

// Generate mock investigations from flagged projects
export const getMockInvestigations = (): Investigation[] => {
  const officers = ['S.K. Sharma', 'R. Gupta', 'A. Verma', 'M. Iyer'];
  return mockProjects
    .filter(p => p.status === 'Flagged' || p.riskScore > 60)
    .map((p, i) => {
      const isClosed = i % 4 === 0;
      let status: InvestigationStatus = 'Open';
      if (isClosed) status = 'Closed';
      else if (i % 3 === 0) status = 'Under Review';
      else if (i % 2 === 0) status = 'Escalated';

      let priority: 'High' | 'Medium' | 'Low' = 'Low';
      if (p.riskScore > 80) priority = 'High';
      else if (p.riskScore > 65) priority = 'Medium';

      const openedAt = new Date(Date.now() - Math.random() * 86400000 * 60).toISOString();
      const lastActivity = new Date(new Date(openedAt).getTime() + Math.random() * 86400000 * 10).toISOString();

      const factors = riskFactorsById[p.id] ?? [];
      const summary = factors.length > 0
        ? `Investigation opened following automated risk detection: ${factors.slice(0, 3).map((f) => f.label).join('; ')}. Field verification requested.`
        : `Investigation opened due to consecutive AI alerts indicating potential fund diversion. Contractor "${p.contractor}" has failed to submit required physical milestone reports for 3 consecutive months despite drawing funds.`;

      return {
        id: `INV-2026-0${341 + i}`,
        projectId: p.id,
        projectName: p.name,
        linkedProjectsCount: i % 3 === 0 ? 2 : 1, // Mock multiple linked projects occasionally
        priority,
        officer: officers[i % officers.length],
        status,
        openedAt,
        lastActivity,
        summary,
      };
    }).sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());
};

const Badge = ({ children, className }: any) => (
  <div className={cn("inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-medium border tracking-wide", className)}>{children}</div>
);

const getStatusClass = (status: InvestigationStatus) => {
  switch (status) {
    case 'Open': return "text-[#10151F] bg-white border-[#D8DCE2]";
    case 'Under Review': return "text-[#1E3A5F] bg-[#1E3A5F]/5 border-[#1E3A5F]/30";
    case 'Escalated': return "text-[#C98A2E] bg-[#C98A2E]/5 border-[#C98A2E]/30";
    case 'Closed': return "text-[#5B6472] bg-surface border-[#D8DCE2]";
  }
};

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'High': return "text-[#B23A3A] bg-[#B23A3A]/10 border-[#B23A3A]/0";
    case 'Medium': return "text-[#C98A2E] bg-[#C98A2E]/10 border-[#C98A2E]/0";
    case 'Low': return "text-[#2E7D5B] bg-[#2E7D5B]/10 border-[#2E7D5B]/0";
    default: return "text-[#5B6472] bg-surface border-transparent";
  }
};

export default function Investigations() {
  const navigate = useNavigate();
  const investigations = useMemo(() => getMockInvestigations(), []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filtered = investigations.filter(i => {
    if (searchTerm && !(i.id.toLowerCase().includes(searchTerm.toLowerCase()) || i.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || i.officer.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    if (statusFilter && i.status !== statusFilter) return false;
    if (priorityFilter && i.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full space-y-4 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex justify-between items-end pb-4 border-b border-hairline shrink-0">
        <div>
          <h1 className="text-2xl font-medium text-text-primary">Investigations Register</h1>
        </div>
        <button className="flex items-center justify-center bg-[#1E3A5F] text-white text-[13px] font-medium py-1.5 px-3 rounded-[2px] transition-colors">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Open New Investigation
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center bg-surface-raised border border-hairline p-3 rounded-[2px] shrink-0">
        <div className="relative w-full lg:w-80 flex-shrink-0">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-text-muted" />
          <input 
            type="text"
            placeholder="Search by Case ID, Project, or Officer..." 
            className="flex h-8 w-full rounded-[2px] border border-hairline bg-surface px-3 py-1 pl-8 text-[13px] font-mono transition-colors focus-visible:outline-none focus-visible:border-primary placeholder:text-text-muted/60 placeholder:font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-1 flex-wrap gap-3">
          <select 
            className="flex h-8 w-[140px] items-center justify-between whitespace-nowrap rounded-[2px] border border-hairline bg-surface px-2 py-1 text-[13px] focus:outline-none focus:border-primary appearance-none text-text-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="Escalated">Escalated</option>
            <option value="Closed">Closed</option>
          </select>
          
          <select 
            className="flex h-8 w-[140px] items-center justify-between whitespace-nowrap rounded-[2px] border border-hairline bg-surface px-2 py-1 text-[13px] focus:outline-none focus:border-primary appearance-none text-text-primary"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-surface-raised border border-hairline rounded-[2px]">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-[13px] text-left whitespace-nowrap">
            <thead className="text-[11px] text-text-muted uppercase tracking-wide bg-surface border-b border-hairline sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 font-normal">Case ID</th>
                <th className="px-4 py-2 font-normal">Linked Project(s)</th>
                <th className="px-4 py-2 font-normal">Priority</th>
                <th className="px-4 py-2 font-normal">Status</th>
                <th className="px-4 py-2 font-normal">Assigned Investigator</th>
                <th className="px-4 py-2 font-normal">Opened Date</th>
                <th className="px-4 py-2 font-normal">Days Open</th>
                <th className="px-4 py-2 font-normal">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filtered.map((inv) => (
                <tr 
                  key={inv.id} 
                  className="hover:bg-surface cursor-pointer transition-colors"
                  onClick={() => navigate(`/investigations/${inv.id}`)}
                >
                  <td className="px-4 py-2.5 font-mono text-[12px] text-text-primary font-medium">
                    {inv.id}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-text-primary truncate max-w-[200px] block" title={inv.projectName}>
                      {inv.projectName} {inv.linkedProjectsCount > 1 && <span className="text-[#5B6472] font-normal ml-1">+{inv.linkedProjectsCount - 1}</span>}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge className={getPriorityClass(inv.priority)}>{inv.priority}</Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge className={getStatusClass(inv.status)}>{inv.status}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-text-muted">{inv.officer}</td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-text-muted">
                    {format(new Date(inv.openedAt), 'yyyy-MM-dd')}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-text-muted">
                    {differenceInDays(new Date(), new Date(inv.openedAt))}
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-text-muted">
                    {format(new Date(inv.lastActivity), 'dd MMM, HH:mm')}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-text-muted text-[13px] font-mono uppercase tracking-wide">No cases found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}