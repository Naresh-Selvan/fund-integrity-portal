import { useState, useMemo } from 'react';
import { 
  FileDown, FileSpreadsheet, FileText, Calendar as CalendarIcon, 
  ShieldCheck, Lock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { mockProjects } from '@/data/mockProjects';
import { formatCurrency, cn } from '@/lib/utils';
import { format } from 'date-fns';

// --- Shared Components ---
const Select = ({ value, onChange, options, placeholder, className }: any) => (
  <div className={cn("space-y-1", className)}>
    <select 
      className="flex h-8 w-full items-center justify-between rounded-[2px] border border-hairline bg-surface px-2.5 py-1 text-[13px] text-text-primary focus:outline-none focus:border-primary appearance-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

// --- Mock Audit Log ---
const MOCK_AUDIT_LOGS = Array.from({ length: 15 }).map((_, i) => {
  const types = ['USER_LOGIN', 'DATA_EXPORT', 'STATUS_CHANGE', 'RISK_SCORE_UPDATE', 'ALERT_RESOLVED'];
  const actors = ['Admin', 'S.K. Sharma', 'System (Auto)', 'Vision AI', 'R. Gupta'];
  
  // Fake hash generation
  const hashChars = '0123456789abcdef';
  let hash = '0x';
  for(let j=0; j<40; j++) hash += hashChars[Math.floor(Math.random() * 16)];

  return {
    id: `EVT-${10000 + i}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 10).toISOString(),
    actor: actors[Math.floor(Math.random() * actors.length)],
    action: types[Math.floor(Math.random() * types.length)],
    details: `Action executed successfully on record ${Math.floor(Math.random() * 999)}`,
    hash
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export default function Reports() {
  const [reportType, setReportType] = useState('Risk Summary');
  const [schemeFilter, setSchemeFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const schemes = Array.from(new Set(mockProjects.map(p => p.scheme)));
  const districts = Array.from(new Set(mockProjects.map(p => p.district)));

  // Report logic mocks based on filter
  const filteredProjects = useMemo(() => {
    return mockProjects.filter(p => {
      if (schemeFilter && p.scheme !== schemeFilter) return false;
      if (districtFilter && p.district !== districtFilter) return false;
      return true;
    });
  }, [schemeFilter, districtFilter]);

  const riskData = useMemo(() => {
    let low = 0, medium = 0, high = 0;
    filteredProjects.forEach(p => {
      if (p.riskScore < 40) low++;
      else if (p.riskScore < 70) medium++;
      else high++;
    });
    return [
      { name: 'Low Risk', value: low, color: '#2E7D5B' },
      { name: 'Medium Risk', value: medium, color: '#C98A2E' },
      { name: 'High Risk', value: high, color: '#B23A3A' }
    ];
  }, [filteredProjects]);

  const RenderReportBody = () => {
    if (filteredProjects.length === 0) {
      return <div className="p-12 text-center text-[13px] text-text-muted font-mono uppercase tracking-wide">No data available for selected filters.</div>;
    }

    if (reportType === 'Risk Summary') {
      return (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-[280px] bg-surface-raised border border-hairline p-4 flex flex-col">
              <h4 className="text-[11px] uppercase tracking-wide text-text-muted mb-4 border-b border-hairline pb-2">Risk Distribution</h4>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value" stroke="#10151F" strokeWidth={1}>
                      {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '0px', borderColor: '#D8DCE2', fontFamily: 'IBM Plex Mono', fontSize: '11px' }} 
                      itemStyle={{ color: '#10151F' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'IBM Plex Mono' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="h-[280px] bg-surface-raised border border-hairline p-0 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-hairline pb-2">
                <h4 className="text-[11px] uppercase tracking-wide text-text-muted">Top High-Risk Registers</h4>
              </div>
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left text-[13px]">
                  <tbody className="divide-y divide-hairline">
                    {[...filteredProjects].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5).map(p => (
                      <tr key={p.id} className="hover:bg-surface transition-colors">
                        <td className="px-4 py-2 font-medium text-text-primary truncate max-w-[150px]" title={p.name}>{p.name}</td>
                        <td className="px-4 py-2 text-text-muted font-mono text-[11px]">{p.id}</td>
                        <td className="px-4 py-2 text-right">
                          <span className={cn(
                            "px-1.5 py-0.5 text-[11px] font-mono border",
                            p.riskScore >= 70 ? "text-[#B23A3A] border-[#B23A3A] bg-[#B23A3A]/10" : 
                            p.riskScore >= 40 ? "text-[#C98A2E] border-[#C98A2E] bg-[#C98A2E]/10" : 
                            "text-[#2E7D5B] border-[#2E7D5B] bg-[#2E7D5B]/10"
                          )}>
                            {p.riskScore}/100
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (reportType === 'Fund Utilization') {
      const chartData = filteredProjects.map(p => ({
        name: p.id,
        Sanctioned: p.budget,
        Utilized: p.spent
      })).slice(0, 10);
      
      return (
        <div className="space-y-6">
          <div className="h-[300px] bg-surface-raised border border-hairline p-4 flex flex-col">
            <h4 className="text-[11px] uppercase tracking-wide text-text-muted mb-4 border-b border-hairline pb-2">Financial Overview (Sample Projects)</h4>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 0, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#D8DCE2" />
                  <XAxis dataKey="name" fontSize={10} fontFamily="IBM Plex Mono" stroke="#5B6472" tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} fontFamily="IBM Plex Mono" stroke="#5B6472" tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/10000000).toFixed(0)}Cr`} />
                  <RechartsTooltip 
                    formatter={(v: any) => [formatCurrency(v), '']} 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '0px', borderColor: '#D8DCE2', fontFamily: 'IBM Plex Mono', fontSize: '11px' }} 
                    cursor={{ fill: '#F7F8FA' }} 
                  />
                  <Bar dataKey="Sanctioned" fill="#10151F" barSize={16} />
                  <Bar dataKey="Utilized" fill="#5B6472" barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    return <div className="p-12 text-center text-text-muted text-[13px] font-mono uppercase tracking-wide">Report preview generated for {reportType}.</div>;
  };

  return (
    <div className="flex flex-col h-full space-y-6 max-w-[1400px] mx-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 border-b border-hairline shrink-0 gap-4">
        <div>
          <h1 className="text-2xl font-medium text-text-primary">Reports & Analytics</h1>
          <p className="text-text-muted text-[13px] mt-1">Generate comprehensive PDF/CSV reports and monitor immutable system logs.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center border border-hairline bg-surface hover:bg-surface-raised text-text-primary text-[11px] font-medium uppercase tracking-wide py-1.5 px-3 rounded-[2px] transition-colors">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Export CSV
          </button>
          <button className="flex items-center justify-center border border-transparent bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white text-[11px] font-medium uppercase tracking-wide py-1.5 px-3 rounded-[2px] transition-colors">
            <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-raised border border-hairline p-3 flex flex-wrap gap-4 items-center shrink-0">
        <Select 
          className="w-full md:w-[220px]" 
          placeholder="Report Type" 
          options={['Risk Summary', 'Fund Utilization', 'Contractor Performance', 'Complaint Resolution']} 
          value={reportType} 
          onChange={setReportType} 
        />
        <Select className="w-full md:w-[180px]" placeholder="All Schemes" options={schemes} value={schemeFilter} onChange={setSchemeFilter} />
        <Select className="w-full md:w-[180px]" placeholder="All Districts" options={districts} value={districtFilter} onChange={setDistrictFilter} />
        <div className="flex items-center gap-2 bg-surface border border-hairline px-3 rounded-[2px] h-8 text-[13px] text-text-muted font-mono cursor-not-allowed opacity-50" title="Date Range">
          <CalendarIcon className="w-3.5 h-3.5" /> 2023-01-01 / 2023-12-31
        </div>
        {(schemeFilter || districtFilter) && (
          <button onClick={() => { setSchemeFilter(''); setDistrictFilter(''); }} className="text-[11px] font-mono text-text-muted hover:text-text-primary uppercase tracking-wide px-2">
            [Clear]
          </button>
        )}
      </div>

      {/* Report Preview */}
      <div className="bg-surface-raised border border-hairline flex flex-col flex-1 min-h-[300px]">
        <div className="p-3 border-b border-hairline bg-surface flex items-center justify-between">
          <h3 className="font-medium text-[13px] text-text-primary flex items-center">
            <FileText className="w-4 h-4 mr-2 text-text-muted" /> 
            {reportType} Preview
          </h3>
          <span className="text-[11px] font-mono text-text-muted">DATA_POINTS: {filteredProjects.length}</span>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <RenderReportBody />
        </div>
      </div>

      {/* Immutable Audit Trail */}
      <div className="bg-surface-raised border border-hairline overflow-hidden flex flex-col shrink-0 h-[300px]">
        <div className="p-3 border-b border-hairline bg-[#10151F] flex items-center justify-between">
          <div>
            <h3 className="font-medium text-[13px] text-white flex items-center uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 mr-2 text-[#D8DCE2]" /> Immutable Audit Trail
            </h3>
          </div>
          <div className="flex items-center">
            <span className="text-[10px] text-[#D8DCE2] font-mono uppercase tracking-wide mr-3">Cryptographically Signed</span>
            <Lock className="w-4 h-4 text-[#D8DCE2]" />
          </div>
        </div>
        <div className="overflow-auto flex-1 bg-surface">
          <table className="w-full text-[13px] text-left whitespace-nowrap">
            <thead className="text-[10px] text-text-muted uppercase tracking-wide bg-surface-raised sticky top-0 border-b border-hairline z-10">
              <tr>
                <th className="px-4 py-2 font-normal">Timestamp</th>
                <th className="px-4 py-2 font-normal">Actor</th>
                <th className="px-4 py-2 font-normal">Action Type</th>
                <th className="px-4 py-2 font-normal">Tx Hash / Ref ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {MOCK_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-surface-raised transition-colors">
                  <td className="px-4 py-2.5 font-mono text-[11px] text-text-muted">
                    {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-text-primary">{log.actor}</td>
                  <td className="px-4 py-2.5">
                    <span className="bg-surface-raised border border-hairline px-1.5 py-0.5 text-[10px] font-mono text-text-primary uppercase tracking-wide">{log.action}</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-text-muted select-all">
                    {log.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}