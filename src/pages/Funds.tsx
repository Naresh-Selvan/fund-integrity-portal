import { useMemo } from 'react';
import { 
  AlertTriangle, Clock, 
  HelpCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { mockProjects } from '@/data/mockProjects';
import { formatCurrency, cn } from '@/lib/utils';

// Generate rich mock financial data based on projects
const generateFundsData = () => {
  let totalSanctioned = 0;
  let totalReleased = 0;
  let totalUtilized = 0;
  let stagnantFunds = 0;

  const schemeDataMap = new Map<string, any>();
  const stagnantProjects: any[] = [];
  const payments: any[] = [];

  mockProjects.forEach((p, idx) => {
    const sanctioned = p.budget;
    const utilized = p.spent;
    // Mock released amount (at least utilized, at most sanctioned)
    const released = Math.min(sanctioned, Math.floor(utilized + (sanctioned - utilized) * 0.6));
    const idleDiff = released - utilized;
    
    // Simulate idle time
    const isStagnant = p.status === 'Delayed' || p.riskScore > 60;
    const idleDays = isStagnant ? Math.floor(Math.random() * 150) + 90 : Math.floor(Math.random() * 30);
    
    if (isStagnant && idleDiff > 0) {
      stagnantFunds += idleDiff;
      stagnantProjects.push({
        id: p.id,
        name: p.name,
        idleAmount: idleDiff,
        days: idleDays,
        risk: p.riskScore
      });
    }

    totalSanctioned += sanctioned;
    totalReleased += released;
    totalUtilized += utilized;

    // Aggregate by scheme
    if (!schemeDataMap.has(p.scheme)) {
      schemeDataMap.set(p.scheme, { scheme: p.scheme, Sanctioned: 0, Released: 0, Utilized: 0, Stagnant: 0 });
    }
    const sData = schemeDataMap.get(p.scheme)!;
    sData.Sanctioned += sanctioned;
    sData.Released += released;
    sData.Utilized += utilized;
    if (isStagnant && idleDiff > 0) {
      sData.Stagnant += idleDiff;
    }

    // Generate mock payments
    if (idx % 2 === 0) {
      const isAnomalous = p.riskScore > 75;
      const isPremature = p.status === 'Delayed' && idx % 3 === 0;
      let status = 'Normal';
      let reason = '';
      if (isAnomalous) { status = 'Anomalous'; reason = 'Payment released to sub-contractor entity directly.'; }
      else if (isPremature) { status = 'Premature'; reason = 'Payment released before site inspection was completed.'; }

      payments.push({
        id: `TRN-2023-${1000 + idx}`,
        project: p.name,
        contractor: p.contractor,
        amount: Math.floor(released * 0.3),
        date: `2023-${(idx % 12 + 1).toString().padStart(2, '0')}-15`,
        status,
        reason
      });
    }
  });

  stagnantProjects.sort((a, b) => b.days - a.days);
  payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    totalSanctioned,
    totalReleased,
    totalUtilized,
    stagnantFunds,
    chartData: Array.from(schemeDataMap.values()).sort((a, b) => b.Sanctioned - a.Sanctioned).slice(0, 8),
    stagnantProjects: stagnantProjects.slice(0, 5),
    payments: payments.slice(0, 10)
  };
};

export default function Funds() {
  const data = useMemo(() => generateFundsData(), []);

  return (
    <div className="space-y-6 h-full flex flex-col max-w-[1400px] mx-auto overflow-hidden">
      <div className="flex justify-between items-end pb-4 border-b border-hairline shrink-0">
        <div>
          <h1 className="text-2xl font-medium text-text-primary">Fund Analytics</h1>
          <p className="text-text-muted text-[13px] mt-1">Track financial velocity, tranche payments, and stagnant capital.</p>
        </div>
      </div>

      {/* KPI Ledger Row */}
      <div className="bg-surface-raised border border-hairline flex flex-col md:flex-row shrink-0 divide-y md:divide-y-0 md:divide-x divide-hairline">
        <div className="flex-1 p-5">
          <div className="flex items-center text-[11px] uppercase tracking-wide text-text-muted mb-2">
            Total Sanctioned
          </div>
          <div className="text-3xl font-mono text-text-primary">{formatCurrency(data.totalSanctioned)}</div>
        </div>
        <div className="flex-1 p-5">
          <div className="flex items-center text-[11px] uppercase tracking-wide text-text-muted mb-2">
            Total Released
          </div>
          <div className="text-3xl font-mono text-text-primary">{formatCurrency(data.totalReleased)}</div>
          <div className="text-[12px] text-text-muted mt-2 font-mono">{((data.totalReleased / data.totalSanctioned) * 100).toFixed(1)}% of Sanctioned</div>
        </div>
        <div className="flex-1 p-5">
          <div className="flex items-center text-[11px] uppercase tracking-wide text-text-muted mb-2">
            Total Utilized
          </div>
          <div className="text-3xl font-mono text-text-primary">{formatCurrency(data.totalUtilized)}</div>
          <div className="text-[12px] text-text-muted mt-2 font-mono">{((data.totalUtilized / data.totalReleased) * 100).toFixed(1)}% velocity rate</div>
        </div>
        <div className="flex-1 p-5 bg-[#B23A3A]/5">
          <div className="flex items-center text-[11px] uppercase tracking-wide text-[#B23A3A] mb-2 font-bold">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Stagnant Funds (&gt;90 Days)
          </div>
          <div className="text-3xl font-mono text-[#B23A3A] font-bold">{formatCurrency(data.stagnantFunds)}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 flex-1 min-h-0 overflow-y-auto pb-4">
        
        {/* Main Left Column (Chart & Stagnant List) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Chart */}
          <div className="bg-surface border border-hairline p-6 flex flex-col h-[350px]">
            <h3 className="text-[13px] font-medium text-text-primary mb-6">Fund Distribution by Scheme (Muted Tones + Anomalies)</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#D8DCE2" vertical={false} />
                  <XAxis 
                    dataKey="scheme" 
                    stroke="#5B6472" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                    fontFamily="IBM Plex Mono"
                  />
                  <YAxis 
                    stroke="#5B6472" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `₹${(val/10000000).toFixed(0)}Cr`}
                    fontFamily="IBM Plex Mono"
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D8DCE2', borderRadius: '0px', fontSize: '12px', fontFamily: 'IBM Plex Mono' }}
                    formatter={(val: any) => [formatCurrency(val), '']}
                    cursor={{ fill: '#F7F8FA' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', textTransform: 'uppercase' }} />
                  {/* Stacked Bars with specific muted colors */}
                  <Bar dataKey="Utilized" stackId="a" fill="#10151F" barSize={16} />
                  <Bar dataKey="Released" stackId="a" fill="#5B6472" barSize={16} />
                  {/* Stagnant subset is colored in functional risk red */}
                  <Bar dataKey="Stagnant" stackId="a" fill="#B23A3A" barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stagnation Panel */}
          <div className="bg-surface border border-hairline flex flex-col">
            <div className="p-4 border-b border-hairline">
              <h3 className="text-[13px] font-medium text-text-primary flex items-center">
                <Clock className="w-4 h-4 mr-2 text-text-muted" /> Fund Stagnation Register
              </h3>
            </div>
            <div className="divide-y divide-hairline">
              {data.stagnantProjects.map((p, i) => (
                <div key={i} className="flex justify-between items-center p-4 hover:bg-surface-raised transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-[13px] text-text-primary truncate max-w-[280px]" title={p.name}>{p.name}</div>
                    <div className="text-[11px] font-mono text-[#B23A3A] flex items-center mt-1">
                      IDLE: {p.days} DAYS
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[14px] text-text-primary">{formatCurrency(p.idleAmount)}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wide mt-1">Pending Clearance</div>
                  </div>
                </div>
              ))}
              {data.stagnantProjects.length === 0 && (
                <div className="text-center text-[13px] text-text-muted py-8">No stagnant funds detected.</div>
              )}
            </div>
          </div>
        </div>

        {/* Payments Table (Right Column) */}
        <div className="bg-surface border border-hairline flex flex-col">
          <div className="p-4 border-b border-hairline">
            <h3 className="text-[13px] font-medium text-text-primary">Recent Tranche Payments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-left whitespace-nowrap">
              <thead className="text-[10px] text-text-muted uppercase tracking-wide bg-surface-raised border-b border-hairline">
                <tr>
                  <th className="px-4 py-3 font-normal">Project & Contractor</th>
                  <th className="px-4 py-3 font-normal">Amount & Date</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {data.payments.map((trn) => (
                  <tr key={trn.id} className="hover:bg-surface-raised transition-colors">
                    <td className="px-4 py-3 max-w-[160px]">
                      <div className="font-medium text-text-primary truncate" title={trn.project}>{trn.project}</div>
                      <div className="text-[11px] text-text-muted truncate mt-0.5">{trn.contractor}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-[13px] text-text-primary">{formatCurrency(trn.amount)}</div>
                      <div className="font-mono text-[11px] text-text-muted mt-0.5">{trn.date}</div>
                    </td>
                    <td className="px-4 py-3">
                      {trn.status === 'Normal' ? (
                        <span className="text-[11px] font-mono text-[#2E7D5B]">NORMAL</span>
                      ) : (
                        <div className="flex items-center group relative cursor-help">
                          <span className={cn(
                            "text-[11px] font-mono mr-1.5", 
                            trn.status === 'Anomalous' ? "text-[#B23A3A] font-bold" : "text-[#C98A2E] font-bold"
                          )}>
                            {trn.status.toUpperCase()}
                          </span>
                          <HelpCircle className="w-3.5 h-3.5 text-text-muted" />
                          <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-[200px] bg-[#10151F] text-[#F7F8FA] text-[11px] p-2 rounded-[2px] shadow-none z-50 whitespace-normal">
                            {trn.reason}
                          </div>
                        </div>
                      )}
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