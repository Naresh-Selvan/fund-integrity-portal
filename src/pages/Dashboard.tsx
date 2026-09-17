import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import { 
  AlertTriangle, 
  TrendingUp, TrendingDown, Clock
} from 'lucide-react';
import { mockProjects } from '@/data/mockProjects';
import { formatCurrency, cn } from '@/lib/utils';

// --- Count Up Hook ---
function useCountUp(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

// --- Simple UI Components (Ledger Style) ---
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-semibold text-text-primary tracking-wide mb-4">{children}</h2>
);

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("inline-flex items-center px-2 py-0.5 text-xs font-medium font-mono", className)}>
    {children}
  </div>
);

// --- Mock Extra Data ---
const FUND_UTILIZATION_DATA = [
  { month: 'Oct', sanctioned: 1200, released: 800, utilized: 600 },
  { month: 'Nov', sanctioned: 1200, released: 900, utilized: 750 },
  { month: 'Dec', sanctioned: 1500, released: 1000, utilized: 850 },
  { month: 'Jan', sanctioned: 1500, released: 1100, utilized: 950 },
  { month: 'Feb', sanctioned: 1800, released: 1300, utilized: 1100 },
  { month: 'Mar', sanctioned: 2200, released: 1600, utilized: 1400 },
  { month: 'Apr', sanctioned: 2500, released: 1800, utilized: 1600 },
  { month: 'May', sanctioned: 2500, released: 1950, utilized: 1750 },
  { month: 'Jun', sanctioned: 2800, released: 2100, utilized: 1900 },
  { month: 'Jul', sanctioned: 3000, released: 2400, utilized: 2100 },
  { month: 'Aug', sanctioned: 3200, released: 2600, utilized: 2350 },
  { month: 'Sep', sanctioned: 3500, released: 2900, utilized: 2600 },
];

const RECENT_ESCALATIONS = [
  { id: 1, project: 'Water Treatment Plant Expansion', reason: 'Material quality test failed (3rd warning)', time: '2 hours ago', level: 'high' },
  { id: 2, project: 'Border Area Road', reason: 'Contractor absconding, 0 progress in 4 weeks', time: '5 hours ago', level: 'high' },
  { id: 3, project: 'Community Health Centre Upgradation', reason: 'Fund diversion suspected', time: '1 day ago', level: 'high' },
  { id: 4, project: 'Canal Irrigation Network', reason: 'Local protests stalling work', time: '2 days ago', level: 'medium' },
];

const RISK_COLORS = {
  low: '#2E7D5B',
  medium: '#C98A2E',
  high: '#B23A3A'
};

export default function Dashboard() {
  const navigate = useNavigate();

  // --- Calculations ---
  const activeProjects = mockProjects.filter(p => !['Completed', 'Registered'].includes(p.status));
  const totalSanctioned = mockProjects.reduce((acc, p) => acc + p.budget, 0);
  
  const riskDistribution = useMemo(() => {
    let low = 0, medium = 0, high = 0;
    mockProjects.forEach(p => {
      if (p.riskScore < 40) low++;
      else if (p.riskScore < 70) medium++;
      else high++;
    });
    return [
      { name: 'Low Risk', value: low, color: RISK_COLORS.low },
      { name: 'Medium Risk', value: medium, color: RISK_COLORS.medium },
      { name: 'High Risk', value: high, color: RISK_COLORS.high },
    ];
  }, []);

  const highRiskProjects = [...mockProjects]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5)
    .map(p => ({
      ...p,
      assignedOfficer: 'S. K. Sharma',
      lastUpdated: new Date(new Date().getTime() - Math.random() * 10000000000).toISOString()
    }));

  // --- Animated Values ---
  const animatedHighRisk = useCountUp(riskDistribution[2].value);

  const [liveSyncTime, setLiveSyncTime] = useState(new Date().toLocaleTimeString());
  const activeCount = activeProjects.length;
  const sanctionedTotal = totalSanctioned;
  const investigationsCount = 24;

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSyncTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end pb-4 border-b border-hairline">
        <div>
          <h1 className="text-2xl font-medium text-text-primary">Dashboard Overview</h1>
        </div>
        <div className="flex items-center text-sm text-text-muted font-mono bg-surface-raised px-3 py-1.5 rounded-full border border-hairline shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2.5 animate-pulse"></div>
          Live Sync: <span className="ml-1 text-text-primary">{liveSyncTime}</span>
        </div>
      </div>

      {/* Ledger-style KPI Row */}
      <div className="flex bg-surface-raised border border-hairline rounded-[4px] divide-x divide-hairline">
        <div className="flex-1 p-5">
          <div className="text-xs text-text-muted mb-1">Total Active Projects</div>
          <div className="text-2xl text-text-primary font-mono">{activeCount}</div>
          <p className="text-[11px] text-text-muted mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Exact match with database</span>
          </p>
        </div>
        
        <div className="flex-1 p-5">
          <div className="text-xs text-text-muted mb-1">Total Sanctioned Funds</div>
          <div className="text-2xl text-text-primary font-mono">{formatCurrency(sanctionedTotal)}</div>
          <p className="text-[11px] text-text-muted mt-2 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Real-time DB aggregate</span>
          </p>
        </div>

        <div className="flex-1 p-5 bg-surface">
          <div className="text-xs text-[#B23A3A] font-medium mb-1 flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> High-Risk Projects
          </div>
          <div className="text-2xl text-text-primary font-mono">{animatedHighRisk}</div>
          <p className="text-[11px] text-text-muted mt-2 flex items-center text-[#B23A3A]">
            <TrendingDown className="w-3 h-3 mr-1" />
            <span>-2 since last month</span>
          </p>
        </div>

        <div className="flex-1 p-5">
          <div className="text-xs text-text-muted mb-1">Open Investigations</div>
          <div className="text-2xl text-text-primary font-mono">{investigationsCount}</div>
          <p className="text-[11px] text-text-muted mt-2 flex items-center text-[#C98A2E]">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Awaiting field officer review</span>
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-8 md:grid-cols-7">
        {/* Bold Element: Risk Distribution Chart */}
        <div className="md:col-span-2 bg-surface-raised border border-hairline rounded-[4px] p-5 flex flex-col">
          <SectionTitle>Risk Distribution</SectionTitle>
          <div className="flex-1 h-[250px] flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={1}
                  dataKey="value"
                  stroke="none"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D8DCE2', borderRadius: '4px', fontSize: '12px', fontFamily: '"IBM Plex Sans", sans-serif' }}
                  itemStyle={{ color: '#10151F' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: '"IBM Plex Sans", sans-serif' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Muted Element: Fund Utilization */}
        <div className="md:col-span-5 bg-surface-raised border border-hairline rounded-[4px] p-5">
          <SectionTitle>Fund Utilization (Last 12 Months)</SectionTitle>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FUND_UTILIZATION_DATA} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8DCE2" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#5B6472" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  fontFamily='"IBM Plex Mono", monospace'
                />
                <YAxis 
                  stroke="#5B6472" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `₹${value}Cr`}
                  fontFamily='"IBM Plex Mono", monospace'
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D8DCE2', borderRadius: '4px', fontSize: '12px' }}
                  formatter={(value) => [`₹${value} Cr`, '']}
                  labelStyle={{ fontFamily: '"IBM Plex Mono", monospace' }}
                />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="sanctioned" name="Sanctioned" stroke="#1E3A5F" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="released" name="Released" stroke="#5B6472" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="utilized" name="Utilized" stroke="#A0A8B5" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <SectionTitle>High Priority Alerts</SectionTitle>
          <div className="bg-surface-raised border border-hairline rounded-[4px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-text-muted bg-surface border-b border-hairline">
                  <tr>
                    <th className="px-4 py-2 font-normal">Project Name</th>
                    <th className="px-4 py-2 font-normal">Scheme</th>
                    <th className="px-4 py-2 font-normal">Location</th>
                    <th className="px-4 py-2 font-normal">Risk Score</th>
                    <th className="px-4 py-2 font-normal">Officer</th>
                    <th className="px-4 py-2 font-normal">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {highRiskProjects.map((project) => (
                    <tr 
                      key={project.id} 
                      className="hover:bg-surface/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <td className="px-4 py-3 text-text-primary max-w-[200px] truncate" title={project.name}>
                        {project.name}
                        <div className="text-[11px] text-text-muted mt-0.5 font-mono">{project.id}</div>
                      </td>
                      <td className="px-4 py-3 text-text-muted">{project.scheme}</td>
                      <td className="px-4 py-3 text-text-muted">
                        {project.district}, {project.state}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={
                          project.riskScore >= 70 ? "text-[#B23A3A] bg-[#B23A3A]/10" : 
                          project.riskScore >= 40 ? "text-[#C98A2E] bg-[#C98A2E]/10" : 
                          "text-[#2E7D5B] bg-[#2E7D5B]/10"
                        }>
                          {project.riskScore}/100
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-text-muted">{project.assignedOfficer}</td>
                      <td className="px-4 py-3 text-text-muted font-mono text-xs">
                        {format(new Date(project.lastUpdated), 'dd MMM yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <SectionTitle>Recently Escalated</SectionTitle>
            <button className="text-xs text-primary hover:underline font-medium mb-4">
              View all
            </button>
          </div>
          <div className="bg-surface-raised border border-hairline rounded-[4px] p-5">
            <div className="space-y-5">
              {RECENT_ESCALATIONS.map((escalation, i) => (
                <div key={escalation.id} className="flex gap-4 relative">
                  {i !== RECENT_ESCALATIONS.length - 1 && (
                    <div className="absolute left-[3px] top-4 bottom-[-20px] w-[1px] bg-hairline"></div>
                  )}
                  
                  <div className="relative mt-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full border border-surface-raised z-10 relative",
                      escalation.level === 'high' ? "bg-[#B23A3A]" : "bg-[#C98A2E]"
                    )} />
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-sm text-text-primary leading-tight">
                      {escalation.project}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {escalation.reason}
                    </p>
                    <p className="text-[11px] text-text-muted mt-2 flex items-center font-mono">
                      <Clock className="w-3 h-3 mr-1.5" /> {escalation.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
