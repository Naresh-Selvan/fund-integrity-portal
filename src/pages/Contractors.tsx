import { useState, useMemo } from 'react';
import { 
  Users, X, AlertTriangle, 
  Search, Link as LinkIcon, Network
} from 'lucide-react';
import { mockProjects } from '@/data/mockProjects';
import { formatCurrency, cn } from '@/lib/utils';

// --- Types & Data Processing ---
type Contractor = {
  name: string;
  id: string;
  projectsCount: number;
  totalValue: number;
  avgRisk: number;
  flags: number;
  riskProfile: 'Low' | 'Medium' | 'High';
  contact: string;
  registeredSince: string;
  onTimePct: number;
  costOverrunPct: number;
};

// --- Custom Simple Network Graph SVG ---
const NetworkGraph = ({ contractorName }: { contractorName: string }) => {
  // A deterministic but fake mock graph centered on the contractor
  const nodes = [
    { id: 'center', label: contractorName, type: 'main', x: 150, y: 150 },
    { id: 'p1', label: 'PRJ-2023-001', type: 'project', x: 250, y: 80 },
    { id: 'p2', label: 'PRJ-2023-004', type: 'project', x: 280, y: 180 },
    { id: 'c1', label: 'Desert Builders', type: 'contractor', x: 150, y: 260 },
    { id: 'c2', label: 'Simplex Infra', type: 'contractor', x: 50, y: 220 },
    { id: 'c3', label: 'Global Tech', type: 'contractor', x: 50, y: 80 },
  ];
  const links = [
    { source: 'center', target: 'p1', type: 'normal' },
    { source: 'center', target: 'p2', type: 'normal' },
    { source: 'center', target: 'c1', type: 'suspicious', label: 'Shared Address' },
    { source: 'center', target: 'c2', type: 'suspicious', label: 'Sequential Bids' },
    { source: 'center', target: 'c3', type: 'normal' },
    { source: 'c1', target: 'p2', type: 'normal' },
  ];

  return (
    <div className="w-full h-[300px] bg-surface-raised border border-hairline relative">
      <div className="absolute top-2 left-2 text-[10px] uppercase font-mono text-text-muted flex items-center bg-surface border border-hairline px-2 py-1">
        <Network className="w-3 h-3 mr-1.5" /> Cartel Analysis
      </div>
      <svg width="100%" height="100%" viewBox="0 0 300 300" className="max-w-[400px] mx-auto">
        {/* Draw Links */}
        {links.map((link, i) => {
          const source = nodes.find(n => n.id === link.source)!;
          const target = nodes.find(n => n.id === link.target)!;
          const isSuspicious = link.type === 'suspicious';
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          
          return (
            <g key={i}>
              <line 
                x1={source.x} y1={source.y} 
                x2={target.x} y2={target.y} 
                stroke={isSuspicious ? '#B23A3A' : '#D8DCE2'} 
                strokeWidth={isSuspicious ? 1.5 : 1}
                strokeDasharray={isSuspicious ? "4,4" : "none"}
              />
              {isSuspicious && (
                <text x={midX} y={midY - 5} fontSize="9" fill="#B23A3A" textAnchor="middle" className="font-mono">
                  {link.label}
                </text>
              )}
            </g>
          );
        })}
        {/* Draw Nodes */}
        {nodes.map(node => {
          const isMain = node.type === 'main';
          const isContractor = node.type === 'contractor' || isMain;
          const r = isMain ? 20 : isContractor ? 12 : 8;
          const fill = isMain ? '#1E3A5F' : isContractor ? '#10151F' : '#5B6472';
          return (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              <circle r={r} fill={fill} />
              {isMain && <circle r={r + 4} fill="none" stroke="#1E3A5F" strokeWidth="1" strokeOpacity="0.3" />}
              <text y={r + 14} fontSize={isMain ? "11" : "9"} fill="#10151F" textAnchor="middle" className="font-medium">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-1.5 text-[10px] font-mono text-text-muted bg-surface border border-hairline p-2">
        <div className="flex items-center"><div className="w-2 h-2 bg-[#1E3A5F] mr-2"></div>Target</div>
        <div className="flex items-center"><div className="w-2 h-2 bg-[#10151F] mr-2"></div>Contractor</div>
        <div className="flex items-center"><div className="w-2 h-2 bg-[#5B6472] mr-2"></div>Project</div>
        <div className="flex items-center"><div className="w-4 h-[1px] bg-[#B23A3A] border-dashed mr-2 border-t border-[#B23A3A]"></div>Risk Link</div>
      </div>
    </div>
  );
};

export default function Contractors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

  // Group and compute metrics from mockProjects
  const contractorsData: Contractor[] = useMemo(() => {
    const map = new Map<string, Contractor>();
    mockProjects.forEach(p => {
      const c = map.get(p.contractor);
      if (c) {
        c.projectsCount++;
        c.totalValue += p.budget;
        c.avgRisk = (c.avgRisk * (c.projectsCount - 1) + p.riskScore) / c.projectsCount;
        c.flags += p.status === 'Flagged' ? 1 : p.riskScore > 75 ? 1 : 0;
      } else {
        map.set(p.contractor, {
          name: p.contractor,
          id: `CTR-${Math.floor(Math.random()*9000)+1000}`,
          projectsCount: 1,
          totalValue: p.budget,
          avgRisk: p.riskScore,
          flags: p.status === 'Flagged' ? 1 : p.riskScore > 75 ? 1 : 0,
          riskProfile: 'Low', // computed below
          contact: `+91 9${Math.floor(Math.random()*900000000)+100000000}`,
          registeredSince: `20${Math.floor(Math.random()*10)+10}`,
          onTimePct: Math.floor(Math.random()*40)+50,
          costOverrunPct: Math.floor(Math.random()*25)
        });
      }
    });

    return Array.from(map.values()).map(c => {
      c.riskProfile = c.avgRisk >= 70 ? 'High' : c.avgRisk >= 40 ? 'Medium' : 'Low';
      return c;
    }).sort((a, b) => b.flags - a.flags || b.avgRisk - a.avgRisk);
  }, []);

  const filteredData = contractorsData.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()));

  const Badge = ({ children, className }: any) => (
    <div className={cn("inline-flex items-center px-2 py-0.5 text-[10px] font-medium border border-hairline rounded-[2px] bg-surface uppercase tracking-wide", className)}>{children}</div>
  );

  return (
    <div className="flex flex-col h-full space-y-4 max-w-[1400px] mx-auto overflow-hidden">
      <div className="flex justify-between items-end pb-4 border-b border-hairline shrink-0">
        <div>
          <h1 className="text-2xl font-medium text-text-primary">Contractor Intelligence</h1>
          <p className="text-text-muted text-[13px] mt-1">Monitor vendor performance, risk profiles, and bidding patterns.</p>
        </div>
      </div>

      <div className="bg-surface-raised border border-hairline p-3 shrink-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-text-muted" />
          <input 
            type="text"
            placeholder="Search contractors by name or ID..." 
            className="flex h-8 w-full rounded-[2px] border border-hairline bg-surface px-3 py-1 pl-8 text-[13px] font-mono transition-colors focus-visible:outline-none focus-visible:border-primary placeholder:text-text-muted/60 placeholder:font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-surface-raised border border-hairline flex-1 flex overflow-hidden relative">
        {/* Main List Area */}
        <div className={cn("flex-1 overflow-auto transition-all duration-300", selectedContractor ? "mr-[450px]" : "")}>
          <table className="w-full text-[13px] text-left whitespace-nowrap">
            <thead className="text-[11px] text-text-muted uppercase tracking-wide bg-surface border-b border-hairline sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 font-normal">Contractor</th>
                <th className="px-4 py-2 font-normal">Projects</th>
                <th className="px-4 py-2 font-normal">Total Value</th>
                <th className="px-4 py-2 font-normal">Risk Profile</th>
                <th className="px-4 py-2 font-normal">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filteredData.map((contractor) => (
                <tr 
                  key={contractor.id} 
                  className={cn(
                    "hover:bg-surface cursor-pointer transition-colors",
                    selectedContractor?.id === contractor.id && "bg-surface border-l-2 border-l-[#1E3A5F]"
                  )}
                  onClick={() => setSelectedContractor(contractor)}
                >
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-text-primary mr-2">{contractor.name}</span>
                    <span className="text-[11px] text-text-muted font-mono">{contractor.id}</span>
                  </td>
                  <td className="px-4 py-2.5 font-mono">{contractor.projectsCount}</td>
                  <td className="px-4 py-2.5 font-mono text-text-primary">{formatCurrency(contractor.totalValue)}</td>
                  <td className="px-4 py-2.5">
                    <Badge className={
                      contractor.riskProfile === 'High' ? "text-[#B23A3A] bg-[#B23A3A]/10" : 
                      contractor.riskProfile === 'Medium' ? "text-[#C98A2E] bg-[#C98A2E]/10" : 
                      "text-[#2E7D5B] bg-[#2E7D5B]/10"
                    }>
                      {contractor.riskProfile}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    {contractor.flags > 0 ? (
                      <span className="inline-flex items-center text-[#B23A3A] font-mono text-[12px]">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" /> {contractor.flags}
                      </span>
                    ) : (
                      <span className="text-text-muted font-mono text-[12px]">0</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-text-muted text-[13px]">No contractors found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sliding Detail Drawer */}
        <div className={cn(
          "absolute top-0 right-0 h-full w-[450px] bg-surface border-l border-hairline flex flex-col transform transition-transform duration-300 z-20 shadow-none",
          selectedContractor ? "translate-x-0" : "translate-x-full"
        )}>
          {selectedContractor && (
            <>
              {/* Drawer Header */}
              <div className="p-4 border-b border-hairline flex items-start justify-between bg-surface">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-medium text-text-primary">{selectedContractor.name}</h2>
                    {selectedContractor.flags > 0 && <AlertTriangle className="w-4 h-4 text-[#B23A3A]" />}
                  </div>
                  <div className="text-[12px] font-mono text-text-muted flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1.5 opacity-70" /> {selectedContractor.id}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedContractor(null)}
                  className="p-1 hover:bg-surface-raised rounded-[2px] transition-colors text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-5 overflow-y-auto flex-1 space-y-6">
                
                {/* Profile Card */}
                <div className="grid grid-cols-2 gap-4 text-[13px] border border-hairline bg-surface-raised p-4">
                  <div>
                    <div className="text-[10px] uppercase text-text-muted mb-0.5">Registered Since</div>
                    <div className="font-mono text-text-primary">{selectedContractor.registeredSince}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-text-muted mb-0.5">Contact Number</div>
                    <div className="font-mono text-text-primary">{selectedContractor.contact}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-text-muted mb-0.5">Total Awarded</div>
                    <div className="font-mono text-text-primary">{formatCurrency(selectedContractor.totalValue)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-text-muted mb-0.5">Risk Tier</div>
                    <Badge className={
                      selectedContractor.riskProfile === 'High' ? "text-[#B23A3A] bg-[#B23A3A]/10 mt-1" : 
                      selectedContractor.riskProfile === 'Medium' ? "text-[#C98A2E] bg-[#C98A2E]/10 mt-1" : 
                      "text-[#2E7D5B] bg-[#2E7D5B]/10 mt-1"
                    }>
                      {selectedContractor.riskProfile} ({Math.round(selectedContractor.avgRisk)})
                    </Badge>
                  </div>
                </div>

                {/* Performance Stats */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2 mb-3">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="text-text-muted">On-Time Delivery Rate</span>
                        <span className="font-mono text-text-primary">{selectedContractor.onTimePct}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface border border-hairline">
                        <div className="h-full bg-text-primary" style={{ width: `${selectedContractor.onTimePct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="text-text-muted">Average Cost Overrun</span>
                        <span className="font-mono text-[#B23A3A]">{selectedContractor.costOverrunPct}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface border border-hairline">
                        <div className="h-full bg-[#B23A3A]" style={{ width: `${selectedContractor.costOverrunPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk & Network Graph */}
                <div>
                  <div className="flex items-center justify-between border-b border-hairline pb-2 mb-3">
                    <h3 className="text-[11px] uppercase tracking-wide text-text-muted">Entity Relationship Analysis</h3>
                    <LinkIcon className="w-3.5 h-3.5 text-text-muted" />
                  </div>
                  
                  {selectedContractor.flags > 0 && (
                    <div className="bg-[#B23A3A]/5 border border-[#B23A3A]/20 text-text-primary text-[12px] p-3 mb-3">
                      <span className="font-medium text-[#B23A3A] uppercase text-[10px] tracking-wide block mb-1">Alert Triggered</span>
                      Potential bid-rigging patterns detected. Contractor shares registered address with <span className="font-mono">'Desert Builders'</span> and exhibits sequential bidding against <span className="font-mono">'Simplex Infra'</span>.
                    </div>
                  )}

                  <NetworkGraph contractorName={selectedContractor.name} />
                  
                </div>
                
                {/* Actions */}
                <div className="pt-4 flex gap-3 border-t border-hairline">
                  <button className="flex-1 bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white text-[13px] font-medium py-1.5 rounded-[2px] transition-colors">
                    View Full Profile
                  </button>
                  <button className="px-4 border border-hairline bg-surface hover:bg-surface-raised text-text-primary text-[13px] font-medium py-1.5 rounded-[2px] transition-colors">
                    Flag Entity
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}