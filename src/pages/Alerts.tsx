import { useState, useMemo } from 'react';
import { 
  ShieldAlert, X, 
  UserPlus, CheckCircle2, ChevronRight
} from 'lucide-react';
import { mockProjects } from '@/data/mockProjects';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// --- Types & Data ---
type AlertStatus = 'New' | 'Under Review' | 'Escalated' | 'Resolved';
type AlertSeverity = 'Critical' | 'High' | 'Medium';

interface Alert {
  id: string;
  projectId: string;
  projectName: string;
  type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  evidence: string;
  details: string;
  trail: { action: string; actor: string; date: string }[];
}

const generateMockAlerts = (): Alert[] => {
  return [
    {
      id: 'ALT-001',
      projectId: mockProjects[1].id,
      projectName: mockProjects[1].name,
      type: 'Fund Stagnation',
      severity: 'Critical',
      status: 'Escalated',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      evidence: '₹12Cr released 140 days ago with 0% utilization reported.',
      details: 'Automated ledger mismatch detected. The contractor received tranche 2 but physical progress remains frozen at 12%. Suspected capital diversion.',
      trail: [
        { action: 'Alert Generated', actor: 'AI System', date: 'Today, 10:00 AM' },
        { action: 'Assigned to Finance Audit', actor: 'Admin', date: 'Today, 10:30 AM' },
        { action: 'Escalated to Vigilance Officer', actor: 'S. K. Sharma', date: 'Today, 11:45 AM' },
      ]
    },
    {
      id: 'ALT-002',
      projectId: mockProjects[2].id,
      projectName: mockProjects[2].name,
      type: 'Fake Photo Flagged',
      severity: 'High',
      status: 'New',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      evidence: 'EXIF metadata indicates photo was taken 4 months ago in a different district.',
      details: 'Contractor uploaded "foundation completion" photos. Geospatial analysis proved the coordinates are 150km away from the registered site, and the timestamp predates the tender award.',
      trail: [
        { action: 'Geospatial Mismatch Flagged', actor: 'Vision AI', date: 'Today, 08:15 AM' }
      ]
    },
    {
      id: 'ALT-003',
      projectId: mockProjects[5].id,
      projectName: mockProjects[5].name,
      type: 'Cost Anomaly',
      severity: 'Medium',
      status: 'Under Review',
      timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      evidence: 'Bidding amount is exactly 0.5% below the DPR estimate, matching 3 other past tenders.',
      details: 'Statistical clustering detects a highly improbable bidding pattern. Simplex Infra has consistently bid just below the threshold alongside two specific competing firms, suggesting cartel behavior.',
      trail: [
        { action: 'Pattern Detected', actor: 'Analytics Engine', date: 'Yesterday, 14:20 PM' },
        { action: 'Under Review by Analyst', actor: 'R. Gupta', date: 'Yesterday, 16:00 PM' }
      ]
    },
    {
      id: 'ALT-004',
      projectId: mockProjects[9].id,
      projectName: mockProjects[9].name,
      type: 'Duplicate Project Detected',
      severity: 'Critical',
      status: 'New',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      evidence: '94% geographical and beneficiary overlap with an existing state scheme project.',
      details: 'Cross-referencing reveals that a similar irrigation network was already sanctioned and completed under a State Scheme in 2021. Attempted double-billing suspected.',
      trail: [
        { action: 'Cross-Scheme Overlap Alert', actor: 'AI System', date: '2 Days ago, 09:10 AM' }
      ]
    },
    {
      id: 'ALT-005',
      projectId: mockProjects[11].id,
      projectName: mockProjects[11].name,
      type: 'Contractor Blacklist Match',
      severity: 'High',
      status: 'Resolved',
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
      evidence: 'Director of firm matches blacklisted entity using fuzzy name matching.',
      details: 'A director registered to "Ganga Developers" was previously banned under a different firm name. Alert successfully halted the work order generation.',
      trail: [
        { action: 'Entity Match Flagged', actor: 'AI System', date: '5 Days ago, 11:00 AM' },
        { action: 'Work Order Halted manually', actor: 'S. K. Sharma', date: '4 Days ago, 10:30 AM' },
        { action: 'Contractor Suspended, Alert Closed', actor: 'Admin', date: '3 Days ago, 15:00 PM' }
      ]
    }
  ];
};

// --- Shared UI ---
const Badge = ({ children, className }: any) => (
  <div className={cn("inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-medium border border-hairline bg-surface tracking-wide", className)}>{children}</div>
);

const getSeverityClass = (severity: AlertSeverity) => {
  switch (severity) {
    case 'Critical': return "text-[#B23A3A] bg-[#B23A3A]/10";
    case 'High': return "text-[#C98A2E] bg-[#C98A2E]/10";
    case 'Medium': return "text-[#2E7D5B] bg-[#2E7D5B]/10";
  }
};

const getStatusClass = (status: AlertStatus) => {
  switch (status) {
    case 'New': return "text-[#1E3A5F] bg-[#1E3A5F]/10";
    case 'Under Review': return "text-[#C98A2E] bg-[#C98A2E]/10";
    case 'Escalated': return "text-[#B23A3A] bg-[#B23A3A]/10";
    case 'Resolved': return "text-[#2E7D5B] bg-[#2E7D5B]/10";
  }
};

export default function Alerts() {
  const alerts = useMemo(() => generateMockAlerts(), []);
  
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'All' && a.severity !== filterSeverity) return false;
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    return true;
  });

  const FilterTab = ({ label, current, onClick }: any) => (
    <button 
      onClick={() => onClick(label)}
      className={cn(
        "px-3 py-1.5 text-[12px] font-medium transition-colors border-b-2",
        current === label ? "border-[#1E3A5F] text-text-primary" : "border-transparent text-text-muted hover:text-text-primary hover:border-hairline"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full space-y-4 max-w-[1400px] mx-auto overflow-hidden">
      <div className="flex justify-between items-end pb-4 border-b border-hairline shrink-0">
        <div>
          <h1 className="text-2xl font-medium text-text-primary">System Alerts</h1>
          <p className="text-text-muted text-[13px] mt-1">Review AI-generated anomalies, compliance breaches, and risk flags.</p>
        </div>
      </div>

      {/* Filter Bar (Underline style) */}
      <div className="bg-surface-raised border border-hairline px-4 flex flex-col md:flex-row gap-6 justify-between shrink-0">
        <div className="flex items-center">
          <span className="text-[11px] uppercase tracking-wide text-text-muted mr-4">Severity</span>
          <div className="flex">
            {['All', 'Critical', 'High', 'Medium'].map(l => (
              <FilterTab key={l} label={l} current={filterSeverity} onClick={setFilterSeverity} />
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-[11px] uppercase tracking-wide text-text-muted mr-4">Status</span>
          <div className="flex">
            {['All', 'New', 'Under Review', 'Escalated', 'Resolved'].map(l => (
              <FilterTab key={l} label={l} current={filterStatus} onClick={setFilterStatus} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative bg-surface-raised border border-hairline">
        {/* Alerts List */}
        <div className={cn("flex-1 overflow-y-auto transition-all duration-300", selectedAlert ? "mr-[450px]" : "")}>
          {filteredAlerts.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-8 h-8 text-[#2E7D5B] mb-3 opacity-30" />
              <h3 className="text-[13px] font-medium text-text-primary">No alerts found</h3>
              <p className="text-text-muted text-[12px] mt-1">Your filters yield no active alerts.</p>
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {filteredAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className={cn(
                    "p-4 hover:bg-surface cursor-pointer transition-colors flex items-center gap-4",
                    selectedAlert?.id === alert.id && "bg-surface border-l-2 border-l-[#1E3A5F]"
                  )}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2">
                      <Badge className={getSeverityClass(alert.severity)}>{alert.severity}</Badge>
                    </div>
                    <div className="col-span-3 truncate text-[13px] text-text-primary font-medium" title={alert.projectName}>
                      {alert.projectName}
                    </div>
                    <div className="col-span-3 truncate text-[13px] text-text-primary">
                      {alert.type}
                    </div>
                    <div className="col-span-2 font-mono text-[12px] text-text-muted">
                      {format(new Date(alert.timestamp), 'MMM dd, HH:mm')}
                    </div>
                    <div className="col-span-2 text-right">
                      <Badge className={getStatusClass(alert.status)}>{alert.status}</Badge>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted opacity-50 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sliding Detail Drawer */}
        <div className={cn(
          "absolute top-0 right-0 h-full w-[450px] bg-surface border-l border-hairline shadow-none flex flex-col transform transition-transform duration-300 z-20",
          selectedAlert ? "translate-x-0" : "translate-x-full"
        )}>
          {selectedAlert && (
            <>
              <div className="p-4 border-b border-hairline flex items-start justify-between bg-surface-raised">
                <div>
                  <div className="text-[11px] font-mono text-text-muted mb-1">{selectedAlert.id}</div>
                  <h2 className="text-lg font-medium text-text-primary">{selectedAlert.type}</h2>
                </div>
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="p-1 hover:bg-surface rounded-[2px] transition-colors text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-6">
                
                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityClass(selectedAlert.severity)}>Severity: {selectedAlert.severity}</Badge>
                  <Badge className={getStatusClass(selectedAlert.status)}>Status: {selectedAlert.status}</Badge>
                </div>

                {/* Project Info */}
                <div className="border border-hairline bg-surface-raised p-3 text-[13px]">
                  <div className="text-[10px] text-text-muted mb-1 uppercase tracking-wider font-medium">Related Project</div>
                  <div className="font-medium text-text-primary">{selectedAlert.projectName}</div>
                  <div className="text-text-muted font-mono text-[11px] mt-0.5">{selectedAlert.projectId}</div>
                </div>

                {/* Evidence Panel */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2 mb-3">
                    Evidence Summary
                  </h3>
                  <div className="bg-[#B23A3A]/5 border border-[#B23A3A]/20 p-4 text-[13px] text-text-primary font-medium">
                    {selectedAlert.evidence}
                  </div>
                  <p className="text-[13px] mt-3 text-text-muted leading-relaxed">
                    {selectedAlert.details}
                  </p>
                </div>

                {/* Audit Trail */}
                <div>
                  <h3 className="text-[11px] uppercase tracking-wide text-text-muted border-b border-hairline pb-2 mb-4">
                    Activity Trail
                  </h3>
                  <div className="relative border-l border-hairline ml-2 space-y-4 pb-2">
                    {selectedAlert.trail.map((t, i) => (
                      <div key={i} className="relative pl-5">
                        <div className={cn("absolute -left-[5px] top-1.5 w-2 h-2 rounded-full", i === 0 ? "bg-[#10151F]" : "bg-[#D8DCE2]")}></div>
                        <div>
                          <div className="font-medium text-[12px] text-text-primary">{t.action}</div>
                          <div className="text-[11px] text-text-muted mt-0.5 font-mono">By {t.actor} • {t.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-hairline bg-surface space-y-2">
                <button className="w-full flex items-center justify-center gap-2 bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 text-[13px] font-medium py-2 rounded-[2px] transition-colors shadow-none">
                  <UserPlus className="w-4 h-4" /> Assign Investigator
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-surface text-text-primary border border-hairline hover:bg-surface-raised text-[13px] font-medium py-2 rounded-[2px] transition-colors shadow-none">
                  <ShieldAlert className="w-4 h-4" /> Escalate to Senior Authority
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-surface text-text-primary border border-hairline hover:bg-surface-raised text-[13px] font-medium py-2 rounded-[2px] transition-colors shadow-none">
                  <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}