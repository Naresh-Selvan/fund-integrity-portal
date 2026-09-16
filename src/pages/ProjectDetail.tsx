import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, 
  ShieldAlert, User, Info, X
} from 'lucide-react';
import { mockProjects, riskFactorsById } from '@/data/mockProjects';
import { formatCurrency, cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- Shared Simple UI ---
const Badge = ({ children, className, variant = 'default' }: any) => {
  const variants = {
    default: "border-transparent bg-surface text-text-primary",
    outline: "border border-hairline text-text-primary",
    success: "border-transparent bg-[#2E7D5B]/10 text-[#2E7D5B] border border-[#2E7D5B]/20",
    warning: "border-transparent bg-[#C98A2E]/10 text-[#C98A2E] border border-[#C98A2E]/20",
    danger: "border-transparent bg-[#B23A3A]/10 text-[#B23A3A] border border-[#B23A3A]/20",
  };
  return <div className={cn("inline-flex items-center px-2 py-0.5 text-[11px] uppercase tracking-wide font-medium rounded-[2px]", variants[variant as keyof typeof variants], className)}>{children}</div>;
};

const Button = ({ children, className, variant = 'default', ...props }: any) => {
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90",
    outline: "border border-hairline bg-surface-raised hover:bg-surface hover:text-text-primary",
    ghost: "hover:bg-surface hover:text-text-primary text-text-muted",
    destructive: "bg-[#B23A3A] text-white hover:bg-[#B23A3A]/90"
  };
  return <button className={cn("inline-flex items-center justify-center rounded-[4px] text-[13px] font-medium transition-colors h-8 px-3 py-1.5 disabled:opacity-50", variants[variant as keyof typeof variants], className)} {...props}>{children}</button>;
};

const TabButton = ({ active, children, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "px-4 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors",
      active ? "border-primary text-text-primary" : "border-transparent text-text-muted hover:text-text-primary hover:border-hairline"
    )}
  >
    {children}
  </button>
);

const ProgressBar = ({ value, label, valueText }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[12px]">
      <span className="text-text-muted">{label}</span>
      <span className="font-mono text-text-primary">{valueText}</span>
    </div>
    <div className="w-full h-1 bg-surface border border-hairline overflow-hidden rounded-none">
      <div className="h-full bg-text-primary" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  </div>
);

// --- Mock Data ---


const MOCK_DOCS = [
  { name: 'Sanction_Letter_Final.pdf', status: 'Verified', type: 'Sanction', date: '12 Apr 2023', img: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?w=100&h=140&fit=crop' },
  { name: 'Site_Plan_v2.pdf', status: 'Flagged', type: 'Design', date: '15 May 2023', img: 'https://images.unsplash.com/photo-1603796846291-bb39f40dc5e3?w=100&h=140&fit=crop' },
  { name: 'Work_Order_Signed.pdf', status: 'Pending', type: 'Contract', date: '01 Jun 2023', img: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=100&h=140&fit=crop' },
];

const MOCK_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1541888018151-5be0936cb077?w=400&h=300&fit=crop', date: '10 Oct 2023', coords: '18.5204° N, 73.8567° E', flag: true, dist: '12km from site' },
  { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop', date: '15 Sep 2023', coords: '18.5211° N, 73.8570° E', flag: false, dist: '0.1km from site' },
];

const MOCK_AUDIT = [
  { action: 'Project Flagged by AI System', actor: 'System Auto-Risk', date: '2023-10-12 14:30' },
  { action: 'Site Inspection Report Submitted', actor: 'S. K. Sharma', date: '2023-10-10 09:15' },
  { action: 'Fund Tranche 2 Released', actor: 'Finance Dept', date: '2023-08-22 11:00' },
  { action: 'Project Tender Awarded', actor: 'Procurement Cell', date: '2023-06-01 16:45' },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  const project = mockProjects.find(p => p.id === id) || mockProjects[2];
  
  const sanctioned = project.budget;
  const released = project.budget * 0.75;
  const utilized = project.spent;
  
  const riskColor = project.riskScore >= 70 ? '#B23A3A' : project.riskScore >= 40 ? '#C98A2E' : '#2E7D5B';

  return (
    <div className="space-y-6 h-full flex flex-col max-w-[1400px] mx-auto">
      {/* Header Ledger Row */}
      <div className="bg-surface-raised border border-hairline flex flex-col md:flex-row justify-between relative overflow-hidden">
        
        {/* Left Info */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[13px] text-text-muted font-mono bg-surface px-2 border border-hairline">{project.id}</span>
            <Badge variant="outline">{project.scheme}</Badge>
            <Badge className={
              project.status === 'Completed' ? 'bg-[#2E7D5B]/10 border border-[#2E7D5B]/20 text-[#2E7D5B]' :
              project.status === 'Flagged' ? 'bg-[#B23A3A]/10 border border-[#B23A3A]/20 text-[#B23A3A]' : 
              'bg-[#1E3A5F]/10 border border-[#1E3A5F]/20 text-[#1E3A5F]'
            }>
              {project.status}
            </Badge>
          </div>
          <h1 className="text-2xl font-medium text-text-primary leading-tight max-w-2xl">{project.name}</h1>
          <div className="flex flex-wrap items-center text-[12px] text-text-muted gap-4 mt-4 font-mono">
            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {project.district}, {project.state}</span>
            <span className="flex items-center"><Building2 className="w-3.5 h-3.5 mr-1" /> {project.contractor}</span>
          </div>
        </div>

        {/* Right Gauge */}
        <div className="border-t md:border-t-0 md:border-l border-hairline p-6 flex flex-col items-center justify-center min-w-[280px] bg-surface">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[11px] font-mono uppercase tracking-wide text-text-muted">AI Risk Index</div>
            <button onClick={() => setShowScoreInfo(true)} className="text-text-muted hover:text-text-primary transition-colors" title="How is this calculated?">
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-[120px] h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: project.riskScore }, { value: 100 - project.riskScore }]}
                    cx="50%" cy="50%"
                    innerRadius={48} outerRadius={60}
                    startAngle={180} endAngle={0}
                    dataKey="value" stroke="none"
                  >
                    <Cell fill={riskColor} />
                    <Cell fill="#D8DCE2" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                <span className="text-4xl font-mono tracking-tighter" style={{ color: riskColor }}>
                  {project.riskScore}
                </span>
              </div>
            </div>
            <button 
              className="text-[11px] underline text-text-muted hover:text-text-primary whitespace-nowrap h-max"
              onClick={() => setActiveTab('Explainable AI')}
            >
              Why this score?
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-start">
        
        {/* Left Content */}
        <div className="lg:col-span-3 flex flex-col border border-hairline bg-surface-raised h-full">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-hairline bg-surface px-2 hide-scrollbar">
            {['Overview', 'Explainable AI', 'Documents', 'Site Evidence', 'Fund Flow', 'Linked Projects', 'Audit Log'].map(tab => (
              <TabButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                {tab}
              </TabButton>
            ))}
          </div>

          <div className="p-6">
            
            {/* OVERVIEW */}
            {activeTab === 'Overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2">Financial Overview</h3>
                    <ProgressBar label="Sanctioned vs Budget" value={(sanctioned/project.budget)*100} valueText={formatCurrency(sanctioned)} />
                    <ProgressBar label="Released vs Sanctioned" value={(released/sanctioned)*100} valueText={formatCurrency(released)} />
                    <ProgressBar label="Utilized vs Released" value={(utilized/released)*100} valueText={formatCurrency(utilized)} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2">Contractor Profile</h3>
                    <div className="text-[13px] text-text-primary">
                      <div className="font-medium mb-1">{project.contractor}</div>
                      <div className="font-mono text-text-muted mb-3 text-[12px]">CTR-{project.id.slice(-4)}</div>
                      <div className="flex flex-col gap-1 text-[12px]">
                        <span className="flex justify-between border-b border-hairline pb-1">
                          <span className="text-text-muted">Active Projects</span>
                          <span className="font-mono">3</span>
                        </span>
                        <span className="flex justify-between border-b border-hairline pb-1">
                          <span className="text-text-muted">Prior Warnings</span>
                          <span className="font-mono text-[#C98A2E]">1</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2">Project Timeline</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border border-hairline p-3">
                      <div className="text-[10px] uppercase text-text-muted mb-1">Start Date</div>
                      <div className="font-mono text-[13px]">{project.startDate}</div>
                    </div>
                    <div className="border border-hairline p-3">
                      <div className="text-[10px] uppercase text-text-muted mb-1">Target End Date</div>
                      <div className="font-mono text-[13px]">{project.endDate}</div>
                    </div>
                    <div className="border border-hairline p-3">
                      <div className="text-[10px] uppercase text-text-muted mb-1">Last Inspection</div>
                      <div className="font-mono text-[13px]">2023-10-10</div>
                    </div>
                    <div className="border border-hairline p-3">
                      <div className="text-[10px] uppercase text-text-muted mb-1">Days Remaining</div>
                      <div className="font-mono text-[13px]">214</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EXPLAINABLE AI */}
            {activeTab === 'Explainable AI' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border border-[#B23A3A] bg-[#B23A3A]/5 p-4 flex gap-3 text-[13px]">
                  <ShieldAlert className="w-5 h-5 text-[#B23A3A] flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-[#B23A3A]">Risk Analysis Digest</h3>
                    <p className="text-[#B23A3A]/80 mt-1">The AI model assigned a score of {project.riskScore}/100 based on the following anomalies.</p>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2 mb-2 flex justify-between">
                    <span>Risk Factor</span>
                    <span>Contribution</span>
                  </div>
                  {(riskFactorsById[project.id] ?? []).length === 0 ? (
                    <div className="py-4 text-[13px] text-text-muted">
                      No risk signals triggered — routine project
                    </div>
                  ) : (
                    <ul className="divide-y divide-hairline border-b border-hairline">
                      {(riskFactorsById[project.id] ?? []).map((factor, i) => (
                        <li key={i} className="flex items-center justify-between py-3 text-[13px]">
                          <span className="text-text-primary">{factor.label}</span>
                          <span className="font-mono text-text-primary text-[13px] text-right">+{factor.points}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex justify-end pt-3">
                     <div className="font-mono text-[14px]">
                       <span className="text-text-muted mr-4">Total</span>
                       <span style={{ color: riskColor }}>{project.riskScore}</span>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENTS */}
            {activeTab === 'Documents' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <table className="w-full text-[13px] text-left">
                  <thead className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline">
                    <tr>
                      <th className="pb-2 font-normal">Document</th>
                      <th className="pb-2 font-normal">Type</th>
                      <th className="pb-2 font-normal">Date Uploaded</th>
                      <th className="pb-2 font-normal text-right">AI Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {MOCK_DOCS.map((doc, i) => (
                      <tr key={i} className="hover:bg-surface transition-colors">
                        <td className="py-3 flex items-center gap-3">
                          <img src={doc.img} alt="Thumbnail" className="w-8 h-10 object-cover border border-hairline grayscale opacity-80" />
                          <span className="font-mono text-[12px]">{doc.name}</span>
                        </td>
                        <td className="py-3 text-text-muted">{doc.type}</td>
                        <td className="py-3 font-mono text-[12px] text-text-muted">{doc.date}</td>
                        <td className="py-3 text-right">
                          {doc.status === 'Verified' ? <Badge variant="success">Verified</Badge> :
                           doc.status === 'Flagged' ? <Badge variant="danger">Flagged</Badge> :
                           <Badge variant="outline">Pending</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SITE EVIDENCE */}
            {activeTab === 'Site Evidence' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2 mb-4">Field Photos (Geotagged)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {MOCK_PHOTOS.map((photo, i) => (
                      <div key={i} className={cn("border border-hairline bg-surface flex flex-col relative", photo.flag && "border-[#B23A3A]")}>
                        <div className="relative h-[200px] border-b border-hairline">
                          <img src={photo.url} alt="Site" className="w-full h-full object-cover grayscale opacity-90" />
                        </div>
                        <div className="p-3 text-[12px] space-y-1 bg-surface-raised font-mono">
                          <div className="flex justify-between">
                            <span className="text-text-muted">DATETIME</span>
                            <span>{photo.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-muted">COORDS</span>
                            <span>{photo.coords}</span>
                          </div>
                          <div className="flex justify-between border-t border-hairline mt-1 pt-1">
                            <span className="text-text-muted">DISTANCE_FLAG</span>
                            <span className={photo.flag ? "text-[#B23A3A]" : "text-text-primary"}>{photo.dist}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2 mb-4">Satellite Baseline</h3>
                  <div className="h-48 border border-hairline bg-surface flex items-center justify-center">
                    <span className="font-mono text-[12px] text-text-muted">[SATELLITE VIEW MOCKED]</span>
                  </div>
                </div>
              </div>
            )}

            {/* FUND FLOW */}
            {activeTab === 'Fund Flow' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="border border-hairline bg-surface p-6 flex flex-col sm:flex-row items-center justify-between relative gap-4">
                  <div className="text-center z-10 bg-surface px-4 py-2 border border-hairline">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-text-muted mb-1">Sanctioned</div>
                    <div className="font-mono text-[14px]">{formatCurrency(sanctioned)}</div>
                  </div>
                  <div className="hidden sm:block flex-1 h-[1px] bg-hairline"></div>
                  <div className="text-center z-10 bg-surface px-4 py-2 border border-hairline">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-text-muted mb-1">Released</div>
                    <div className="font-mono text-[14px]">{formatCurrency(released)}</div>
                  </div>
                  <div className="hidden sm:block flex-1 h-[1px] bg-hairline"></div>
                  <div className="text-center z-10 bg-surface px-4 py-2 border border-hairline">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-text-muted mb-1">Utilized</div>
                    <div className="font-mono text-[14px]">{formatCurrency(utilized)}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2 mb-2">Tranche Payment Log</h3>
                  <table className="w-full text-[13px] text-left">
                    <thead className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline">
                      <tr>
                        <th className="pb-2 font-normal">Tranche ID</th>
                        <th className="pb-2 font-normal">Date</th>
                        <th className="pb-2 font-normal">Amount</th>
                        <th className="pb-2 font-normal text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      <tr className="hover:bg-surface">
                        <td className="py-3 font-mono text-[12px]">TRN-2023-01</td>
                        <td className="py-3 font-mono text-[12px] text-text-muted">2023-06-05</td>
                        <td className="py-3 font-mono text-[12px]">{formatCurrency(released * 0.4)}</td>
                        <td className="py-3 text-right"><Badge variant="success">Cleared</Badge></td>
                      </tr>
                      <tr className="bg-[#B23A3A]/5 border-y border-[#B23A3A]/20">
                        <td className="py-3 font-mono text-[12px] text-[#B23A3A]">TRN-2023-02</td>
                        <td className="py-3 font-mono text-[12px] text-text-muted">2023-08-22</td>
                        <td className="py-3 font-mono text-[12px] text-[#B23A3A]">{formatCurrency(released * 0.6)}</td>
                        <td className="py-3 text-right"><Badge variant="danger">Anomaly</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* LINKED PROJECTS */}
            {activeTab === 'Linked Projects' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <p className="text-[13px] text-text-muted">AI detected geospatial and contractor metadata overlap with the following registers.</p>
                <div className="divide-y divide-hairline border-y border-hairline">
                  {[mockProjects[0], mockProjects[3]].map((rp, i) => (
                    <div key={i} className="flex justify-between items-center py-3 hover:bg-surface cursor-pointer" onClick={() => navigate(`/projects/${rp.id}`)}>
                      <div>
                        <div className="font-mono text-[11px] text-text-muted mb-0.5">{rp.id}</div>
                        <div className="text-[13px] font-medium text-text-primary">{rp.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[11px] text-text-muted mb-0.5">SCORE</div>
                        <div className="font-mono text-[13px]">{rp.riskScore}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AUDIT LOG */}
            {activeTab === 'Audit Log' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <table className="w-full text-[13px] text-left border-t border-hairline">
                  <thead className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline">
                    <tr>
                      <th className="py-2 font-normal">Timestamp</th>
                      <th className="py-2 font-normal">Actor</th>
                      <th className="py-2 font-normal">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline font-mono text-[12px]">
                    {MOCK_AUDIT.map((log, i) => (
                      <tr key={i} className="hover:bg-surface">
                        <td className="py-2 text-text-muted">{log.date}</td>
                        <td className="py-2 text-text-primary">{log.actor}</td>
                        <td className={cn("py-2", i === 0 ? "text-[#B23A3A]" : "text-text-primary")}>{log.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-4 h-full">
          {/* Action Card */}
          <div className="border border-hairline bg-surface-raised p-4">
             <Button variant="default" className="w-full bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white shadow-none rounded-[2px] h-9 mb-3">
                Escalate to Senior Authority
             </Button>
             <Button variant="outline" className="w-full rounded-[2px]">
                Download Audit Dossier
             </Button>
          </div>

          <div className="border border-hairline bg-surface-raised p-4">
            <h3 className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2 mb-3">Assigned Personnel</h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-surface border border-hairline flex items-center justify-center">
                <User className="w-4 h-4 text-text-muted" />
              </div>
              <div>
                <div className="text-[13px] font-medium">S. K. Sharma</div>
                <div className="text-[11px] font-mono text-text-muted">Field Inspector</div>
              </div>
            </div>
          </div>
          
          <div className="border border-hairline bg-surface-raised p-4">
             <h3 className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2 mb-3">Key Identifiers</h3>
             <div className="space-y-2 text-[12px] font-mono text-text-primary">
               <div className="flex justify-between border-b border-hairline pb-1">
                 <span className="text-text-muted">SCHEME_ID</span>
                 <span>SCH-{project.scheme.substring(0,3).toUpperCase()}</span>
               </div>
               <div className="flex justify-between border-b border-hairline pb-1">
                 <span className="text-text-muted">REGION_CODE</span>
                 <span>{project.district.substring(0,3).toUpperCase()}</span>
               </div>
               <div className="flex justify-between pb-1">
                 <span className="text-text-muted">SYSTEM_ID</span>
                 <span>{project.id.split('-').pop()}</span>
               </div>
             </div>
          </div>
        </div>

      </div>

      {/* Score Info Modal */}
      {showScoreInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10151F]/50 p-4">
          <div className="bg-surface-raised border border-hairline w-full max-w-2xl shadow-xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-4 border-b border-hairline bg-surface">
              <h2 className="font-medium text-text-primary text-[15px]">How is the Risk Score Calculated?</h2>
              <button onClick={() => setShowScoreInfo(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-[13px] text-text-secondary leading-relaxed hide-scrollbar">
              <p className="mb-4">The AI Risk Index evaluates each project against 8 rule categories. Triggered anomalies add points to the score, which is capped at 100.</p>
              
              <div className="grid gap-3">
                <div className="border border-hairline p-3 bg-surface">
                  <div className="font-medium text-text-primary flex justify-between">
                    <span>Cost Outlier</span>
                    <span className="font-mono text-[12px] text-text-muted">Max +30 pts</span>
                  </div>
                  <p className="mt-1">Checks if the project budget significantly exceeds the scheme's average budget (&gt;40% deviation).</p>
                </div>

                <div className="border border-hairline p-3 bg-surface">
                  <div className="font-medium text-text-primary flex justify-between">
                    <span>Round Figure Amount</span>
                    <span className="font-mono text-[12px] text-text-muted">Max +10 pts</span>
                  </div>
                  <p className="mt-1">Flags budgets that are exact multiples of 10,000,000, indicating a lack of itemized breakdown.</p>
                </div>

                <div className="border border-hairline p-3 bg-surface">
                  <div className="font-medium text-text-primary flex justify-between">
                    <span>Fund Utilization Mismatch</span>
                    <span className="font-mono text-[12px] text-text-muted">Max +25 pts</span>
                  </div>
                  <p className="mt-1">Detects when financial expenditure outpaces the expected physical timeline by &gt;25%.</p>
                </div>

                <div className="border border-hairline p-3 bg-surface">
                  <div className="font-medium text-text-primary flex justify-between">
                    <span>Vendor Concentration</span>
                    <span className="font-mono text-[12px] text-text-muted">Max +25 pts</span>
                  </div>
                  <p className="mt-1">Highlights contractors awarded 3 or more concurrent works in the same state.</p>
                </div>

                <div className="border border-hairline p-3 bg-surface">
                  <div className="font-medium text-text-primary flex justify-between">
                    <span>Excessive Delay</span>
                    <span className="font-mono text-[12px] text-text-muted">Max +20 pts</span>
                  </div>
                  <p className="mt-1">Penalizes projects that have passed their target completion date without closure.</p>
                </div>

                <div className="border border-hairline p-3 bg-surface">
                  <div className="font-medium text-text-primary flex justify-between">
                    <span>Inactive with High Spend</span>
                    <span className="font-mono text-[12px] text-text-muted">Max +20 pts</span>
                  </div>
                  <p className="mt-1">Flags projects with &gt;70% funds disbursed despite a 'Delayed' or 'Registered' stalled status.</p>
                </div>

                <div className="border border-hairline p-3 bg-surface">
                  <div className="font-medium text-text-primary flex justify-between">
                    <span>Flagged Status</span>
                    <span className="font-mono text-[12px] text-text-muted">Max +15 pts</span>
                  </div>
                  <p className="mt-1">Applies if a project has been manually flagged for review.</p>
                </div>

                <div className="border border-hairline p-3 bg-surface">
                  <div className="font-medium text-text-primary flex justify-between">
                    <span>Rapid Completion</span>
                    <span className="font-mono text-[12px] text-text-muted">Max +15 pts</span>
                  </div>
                  <p className="mt-1">Flags projects marked completed in an unusually short timeframe (&lt;90 days) for their scale.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
