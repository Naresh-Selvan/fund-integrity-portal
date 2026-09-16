import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, FileText, AlertTriangle, User,
  CornerDownRight, Building2
} from 'lucide-react';
import { getMockInvestigations } from './Investigations';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const tabs = ['Summary', 'Evidence', 'Findings & Notes', 'Resolution'];

export default function InvestigationDetail() {
  const { id } = useParams();
  const investigation = getMockInvestigations().find(i => i.id === id) || getMockInvestigations()[0];
  const [activeTab, setActiveTab] = useState('Summary');

  return (
    <div className="flex flex-col h-full space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <Link to="/investigations" className="text-[12px] font-medium text-text-muted hover:text-text-primary flex items-center mb-4 transition-colors uppercase tracking-wide">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Queue
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-mono text-text-primary">{investigation.id}</h1>
              <div className="px-2 py-0.5 text-[10px] uppercase font-medium border border-[#D8DCE2] bg-surface text-[#10151F] tracking-wide">{investigation.status}</div>
              <div className={cn(
                "px-2 py-0.5 text-[10px] uppercase font-medium border tracking-wide",
                investigation.priority === 'High' ? "text-[#B23A3A] bg-[#B23A3A]/10 border-transparent" :
                investigation.priority === 'Medium' ? "text-[#C98A2E] bg-[#C98A2E]/10 border-transparent" :
                "text-[#2E7D5B] bg-[#2E7D5B]/10 border-transparent"
              )}>Priority: {investigation.priority}</div>
            </div>
            <p className="text-[14px] text-text-muted max-w-3xl leading-relaxed">{investigation.summary}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-surface-raised border border-hairline overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-hairline px-6 pt-4 bg-surface shrink-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2.5 text-[13px] font-medium uppercase tracking-wide transition-colors border-b-2",
                  activeTab === tab ? "border-[#1E3A5F] text-[#10151F]" : "border-transparent text-text-muted hover:text-text-primary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'Summary' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-widest border-b border-hairline pb-2 mb-4">Linked Projects</h3>
                  <div className="border border-hairline divide-y divide-hairline">
                    <div className="flex items-center justify-between p-3 bg-surface hover:bg-surface-raised transition-colors">
                      <div>
                        <div className="font-medium text-[14px] text-text-primary">{investigation.projectName}</div>
                        <div className="font-mono text-[11px] text-text-muted mt-1">{investigation.projectId}</div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex px-2 py-0.5 text-[11px] font-mono border border-[#B23A3A]/20 bg-[#B23A3A]/10 text-[#B23A3A]">
                          Risk: 84
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-widest border-b border-hairline pb-2 mb-4">Triggering Alerts</h3>
                  <div className="border border-hairline bg-surface p-4 text-[13px] text-text-primary font-mono space-y-2">
                    <div className="flex items-center text-[#B23A3A]"><AlertTriangle className="w-4 h-4 mr-2" /> [AI_ANOMALY] Consecutive milestone delays (90+ days)</div>
                    <div className="flex items-center text-[#B23A3A]"><AlertTriangle className="w-4 h-4 mr-2" /> [SYS_FLAG] Suspicious vendor rotation detected</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border border-hairline p-4 bg-surface-raised">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-text-muted mr-3" />
                    <div>
                      <div className="text-[10px] text-text-muted uppercase tracking-wide">Assigned Investigator</div>
                      <div className="font-medium text-[14px] text-text-primary">{investigation.officer}</div>
                    </div>
                  </div>
                  <button className="text-[11px] font-medium text-[#1E3A5F] hover:underline uppercase tracking-wide">
                    Reassign Officer
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Evidence' && (
              <div className="space-y-4 max-w-4xl">
                <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-widest mb-2">Consolidated Evidence Register</h3>
                <div className="border border-hairline divide-y divide-hairline">
                  <div className="p-4 bg-surface-raised flex items-start justify-between">
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-text-muted mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium text-[13px] text-text-primary mb-1">Fund Utilization Report Q3</div>
                        <div className="text-[12px] text-text-muted mb-2">Financial mismatch detected between reported raw materials and withdrawn budget.</div>
                        <div className="inline-flex px-1.5 py-0.5 text-[10px] font-mono border border-hairline bg-surface text-text-muted">SOURCE: {investigation.projectId}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-medium border border-[#B23A3A]/20 bg-[#B23A3A]/10 text-[#B23A3A]">Flagged</span>
                  </div>
                  
                  <div className="p-4 bg-surface-raised flex items-start justify-between">
                    <div className="flex items-start">
                      <Building2 className="w-5 h-5 text-text-muted mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium text-[13px] text-text-primary mb-1">Contractor Relationship Graph</div>
                        <div className="text-[12px] text-text-muted mb-2">Sub-contractor shares registered address with evaluating firm.</div>
                        <div className="inline-flex px-1.5 py-0.5 text-[10px] font-mono border border-hairline bg-surface text-text-muted">SOURCE: AI Crawler</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-medium border border-[#C98A2E]/20 bg-[#C98A2E]/10 text-[#C98A2E]">Pending Review</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Findings & Notes' && (
              <div className="space-y-6 max-w-4xl flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-4">
                  <div className="border border-hairline p-4 bg-surface">
                    <div className="flex items-center justify-between mb-3 border-b border-hairline pb-2">
                      <div className="font-medium text-[13px] text-text-primary">{investigation.officer}</div>
                      <div className="font-mono text-[11px] text-text-muted">{format(new Date(investigation.openedAt), 'yyyy-MM-dd HH:mm')}</div>
                    </div>
                    <p className="text-[13px] text-text-primary leading-relaxed">
                      Initial review of the flagged documents confirms anomalies in the Q3 reporting. Requesting field inspection unit to visit the site to verify physical progress.
                    </p>
                  </div>
                  
                  <div className="border border-hairline p-4 bg-surface flex items-start">
                    <CornerDownRight className="w-4 h-4 text-text-muted mr-3 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3 border-b border-hairline pb-2">
                        <div className="font-medium text-[13px] text-text-primary">System Notification</div>
                        <div className="font-mono text-[11px] text-text-muted">{format(new Date(), 'yyyy-MM-dd HH:mm')}</div>
                      </div>
                      <p className="text-[13px] text-text-muted font-mono uppercase tracking-wide">
                        [ACTION] Status updated to: Under Review
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-hairline bg-surface p-3 mt-auto shrink-0">
                  <textarea 
                    className="w-full h-24 bg-white border border-hairline p-3 text-[13px] focus:outline-none focus:border-[#1E3A5F] resize-none mb-3 font-sans"
                    placeholder="Add a new finding, note, or update..."
                  />
                  <div className="flex justify-end">
                    <button className="bg-[#1E3A5F] text-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-wide rounded-[2px] hover:bg-[#1E3A5F]/90 transition-colors">
                      Add Finding
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Resolution' && (
              <div className="space-y-8 max-w-2xl">
                <div className="bg-surface border border-hairline p-6">
                  <h3 className="text-[14px] font-medium text-text-primary mb-6">Case Resolution Protocol</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[11px] font-medium text-text-muted uppercase tracking-widest mb-2">Outcome</label>
                      <select className="w-full border border-hairline bg-white px-3 py-2 text-[13px] rounded-[2px] outline-none focus:border-[#1E3A5F]">
                        <option value="">-- Select Outcome --</option>
                        <option value="substantiated">Substantiated (Fraud/Anomaly Confirmed)</option>
                        <option value="unsubstantiated">Unsubstantiated (Cleared)</option>
                        <option value="referred">Referred for External Action</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[11px] font-medium text-text-muted uppercase tracking-widest mb-2">Recommended Action</label>
                      <textarea 
                        className="w-full h-24 bg-white border border-hairline p-3 text-[13px] focus:outline-none focus:border-[#1E3A5F] resize-none font-sans"
                        placeholder="Detail the final administrative actions to be taken..."
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-hairline flex justify-end gap-3">
                    <button className="border border-hairline bg-white text-[#10151F] px-4 py-2 text-[11px] font-medium uppercase tracking-wide rounded-[2px] hover:bg-surface-raised transition-colors">
                      Close Case
                    </button>
                    <button className="bg-[#1E3A5F] text-white px-4 py-2 text-[11px] font-medium uppercase tracking-wide rounded-[2px] hover:bg-[#1E3A5F]/90 transition-colors">
                      Recommend Escalation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Case Timeline */}
        <div className="w-[280px] shrink-0">
          <div className="bg-surface border border-hairline p-5">
            <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-widest border-b border-hairline pb-2 mb-6">Case Timeline</h3>
            
            <div className="relative border-l border-hairline ml-3 space-y-8">
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#1E3A5F] border-2 border-surface" />
                <div className="text-[11px] font-mono text-text-muted mb-1">{format(new Date(investigation.openedAt), 'MMM dd, yyyy')}</div>
                <div className="text-[13px] font-medium text-text-primary">Case Opened</div>
                <div className="text-[11px] text-text-muted mt-1">System auto-triggered</div>
              </div>
              
              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#1E3A5F] border-2 border-surface" />
                <div className="text-[11px] font-mono text-text-muted mb-1">{format(new Date(investigation.openedAt), 'MMM dd, yyyy')}</div>
                <div className="text-[13px] font-medium text-text-primary">Assigned to Officer</div>
                <div className="text-[11px] text-text-muted mt-1">{investigation.officer}</div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#D8DCE2] border-2 border-surface" />
                <div className="text-[11px] font-mono text-text-muted mb-1">Pending</div>
                <div className="text-[13px] font-medium text-text-muted">Evidence Gathered</div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#D8DCE2] border-2 border-surface" />
                <div className="text-[11px] font-mono text-text-muted mb-1">Pending</div>
                <div className="text-[13px] font-medium text-text-muted">Resolved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
