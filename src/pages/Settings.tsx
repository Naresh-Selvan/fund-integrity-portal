import { useState } from 'react';
import { 
  User, Users, Shield, Bell, Map, Link2, Lock, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_USERS = [
  { id: 1, name: 'S.K. Sharma', role: 'State Reviewer', dept: 'Vigilance Dept', status: 'Active', lastLogin: '2026-09-07 08:14' },
  { id: 2, name: 'A. Verma', role: 'District Officer', dept: 'Public Works Dept', status: 'Active', lastLogin: '2026-09-06 14:30' },
  { id: 3, name: 'R. Gupta', role: 'Field Officer', dept: 'Rural Development', status: 'Active', lastLogin: '2026-09-05 09:12' },
  { id: 4, name: 'M. Iyer', role: 'Super Admin', dept: 'IT Infrastructure', status: 'Suspended', lastLogin: '2026-08-20 11:45' },
];

const MOCK_EVENTS = [
  { id: 'E-01', time: '2026-09-07 09:15:22', user: 'System', event: 'Failed login attempt (IP: 192.168.1.104)' },
  { id: 'E-02', time: '2026-09-06 18:00:01', user: 'Admin', event: 'Risk Thresholds modified' },
  { id: 'E-03', time: '2026-09-05 14:22:19', user: 'S.K. Sharma', event: 'Password changed successfully' },
];

const Toggle = ({ checked, onChange }: { checked: boolean; onChange?: () => void }) => (
  <button 
    type="button"
    role="switch"
    onClick={onChange}
    className={cn(
      "relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
      checked ? "bg-[#1E3A5F]" : "bg-[#D8DCE2]"
    )}
  >
    <span className={cn(
      "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
      checked ? "translate-x-4" : "translate-x-0"
    )} />
  </button>
);

const Input = ({ className, ...props }: any) => (
  <input 
    className={cn("flex h-8 w-full rounded-[2px] border border-hairline bg-surface-raised px-3 py-1 text-[13px] transition-colors focus-visible:outline-none focus-visible:border-[#1E3A5F]", className)} 
    {...props} 
  />
);

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile & Account');

  const tabs = [
    { name: 'Profile & Account', icon: User },
    { name: 'Users & Roles', icon: Users },
    { name: 'Risk Scoring Thresholds', icon: Shield },
    { name: 'Notifications', icon: Bell },
    { name: 'Schemes & Districts', icon: Map },
    { name: 'Integrations', icon: Link2 },
    { name: 'Audit & Security', icon: Lock },
  ];

  return (
    <div className="flex flex-col h-full space-y-4 max-w-[1400px] mx-auto overflow-hidden">
      <div className="flex justify-between items-end pb-4 border-b border-hairline shrink-0">
        <div>
          <h1 className="text-2xl font-medium text-text-primary">System Settings</h1>
          <p className="text-text-muted text-[13px] mt-1">Manage global parameters, user access, and system configurations.</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden border border-hairline bg-surface-raised rounded-[2px]">
        {/* Left Sidebar */}
        <div className="w-[280px] border-r border-hairline bg-surface flex flex-col shrink-0">
          <div className="divide-y divide-hairline">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 text-[13px] transition-colors border-l-[3px]",
                    isActive 
                      ? "border-l-[#1E3A5F] bg-surface-raised text-[#10151F] font-medium" 
                      : "border-l-transparent text-text-muted hover:bg-surface-raised hover:text-text-primary"
                  )}
                >
                  <Icon className={cn("w-4 h-4 mr-3 shrink-0", isActive ? "text-[#1E3A5F]" : "text-text-muted opacity-70")} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto bg-surface-raised p-8">
          <div className="max-w-[800px]">
            <h2 className="text-lg font-medium text-text-primary border-b border-hairline pb-4 mb-8">
              {activeTab}
            </h2>

            {/* Profile & Account */}
            {activeTab === 'Profile & Account' && (
              <div className="space-y-0 divide-y divide-hairline border border-hairline bg-surface-raised">
                <div className="grid grid-cols-[200px_1fr] items-center p-4">
                  <label className="text-[13px] text-text-muted font-medium">Admin Name</label>
                  <Input defaultValue="Admin User" />
                </div>
                <div className="grid grid-cols-[200px_1fr] items-center p-4 bg-surface/50">
                  <label className="text-[13px] text-text-muted font-medium">Role / Designation</label>
                  <Input defaultValue="Chief Integrity Officer" />
                </div>
                <div className="grid grid-cols-[200px_1fr] items-center p-4">
                  <label className="text-[13px] text-text-muted font-medium">Department</label>
                  <Input defaultValue="Vigilance Commission" />
                </div>
                <div className="grid grid-cols-[200px_1fr] items-center p-4 bg-surface/50">
                  <label className="text-[13px] text-text-muted font-medium">Email Address</label>
                  <Input defaultValue="admin@integrity.gov.in" type="email" />
                </div>
                <div className="grid grid-cols-[200px_1fr] items-center p-4">
                  <label className="text-[13px] text-text-muted font-medium">Phone Number</label>
                  <Input defaultValue="+91 98765 43210" type="tel" />
                </div>
                <div className="grid grid-cols-[200px_1fr] items-start p-4 bg-surface/50">
                  <label className="text-[13px] text-text-muted font-medium pt-2">Change Password</label>
                  <div className="space-y-3">
                    <Input placeholder="Current Password" type="password" />
                    <Input placeholder="New Password" type="password" />
                    <Input placeholder="Confirm New Password" type="password" />
                    <button className="bg-[#1E3A5F] text-white px-4 py-1.5 text-[12px] font-medium uppercase tracking-wide rounded-[2px] hover:bg-[#1E3A5F]/90 mt-2">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Users & Roles */}
            {activeTab === 'Users & Roles' && (
              <div className="space-y-8">
                <div className="border border-hairline bg-surface-raised">
                  <div className="p-4 border-b border-hairline flex justify-between items-center bg-surface">
                    <h3 className="text-[13px] font-medium uppercase tracking-wide text-text-primary">Admin Users</h3>
                    <button className="bg-[#1E3A5F] text-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide rounded-[2px] flex items-center">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Invite User
                    </button>
                  </div>
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-surface border-b border-hairline text-[11px] text-text-muted uppercase tracking-wide">
                      <tr>
                        <th className="px-4 py-2 font-normal">Name</th>
                        <th className="px-4 py-2 font-normal">Role</th>
                        <th className="px-4 py-2 font-normal">Department</th>
                        <th className="px-4 py-2 font-normal">Status</th>
                        <th className="px-4 py-2 font-normal">Last Login</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {MOCK_USERS.map(u => (
                        <tr key={u.id} className="hover:bg-surface transition-colors">
                          <td className="px-4 py-2.5 font-medium text-text-primary">{u.name}</td>
                          <td className="px-4 py-2.5 text-text-muted">{u.role}</td>
                          <td className="px-4 py-2.5 text-text-muted">{u.dept}</td>
                          <td className="px-4 py-2.5">
                            <span className={cn(
                              "px-2 py-0.5 text-[10px] uppercase font-medium border tracking-wide",
                              u.status === 'Active' ? "border-[#D8DCE2] bg-white text-[#10151F]" : "border-transparent bg-surface text-text-muted"
                            )}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-text-muted">{u.lastLogin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium uppercase tracking-wide text-text-primary mb-3">Role Permissions Matrix</h3>
                  <div className="border border-hairline bg-surface-raised overflow-x-auto">
                    <table className="w-full text-left text-[13px] min-w-[600px]">
                      <thead className="bg-surface border-b border-hairline text-[11px] text-text-muted uppercase tracking-wide">
                        <tr>
                          <th className="px-4 py-2 font-normal border-r border-hairline">Permission</th>
                          <th className="px-4 py-2 font-normal text-center">Super Admin</th>
                          <th className="px-4 py-2 font-normal text-center">State Reviewer</th>
                          <th className="px-4 py-2 font-normal text-center">District Officer</th>
                          <th className="px-4 py-2 font-normal text-center">Field Officer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {['Manage Users', 'Edit Risk Thresholds', 'Open Investigations', 'Close Investigations', 'Upload Field Evidence'].map(perm => (
                          <tr key={perm} className="hover:bg-surface transition-colors">
                            <td className="px-4 py-2 font-medium text-text-primary border-r border-hairline">{perm}</td>
                            <td className="px-4 py-2 text-center"><input type="checkbox" defaultChecked className="accent-[#1E3A5F]" /></td>
                            <td className="px-4 py-2 text-center"><input type="checkbox" defaultChecked={perm !== 'Manage Users'} className="accent-[#1E3A5F]" /></td>
                            <td className="px-4 py-2 text-center"><input type="checkbox" defaultChecked={perm === 'Upload Field Evidence' || perm === 'Open Investigations'} className="accent-[#1E3A5F]" /></td>
                            <td className="px-4 py-2 text-center"><input type="checkbox" defaultChecked={perm === 'Upload Field Evidence'} className="accent-[#1E3A5F]" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Risk Scoring Thresholds */}
            {activeTab === 'Risk Scoring Thresholds' && (
              <div className="space-y-8">
                <div className="space-y-0 divide-y divide-hairline border border-hairline bg-surface-raised">
                  <div className="p-4 bg-surface border-b border-hairline">
                    <h3 className="text-[13px] font-medium uppercase tracking-wide text-text-primary">Cutoff Values</h3>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center p-4">
                    <label className="text-[13px] font-medium text-[#2E7D5B]">Low</label>
                    <div className="flex items-center gap-2">
                      <Input defaultValue="0" className="w-[60px] font-mono text-center border-[#2E7D5B]/30 focus-visible:border-[#2E7D5B]" />
                      <span className="text-text-muted font-mono">—</span>
                      <Input defaultValue="39" className="w-[60px] font-mono text-center border-[#2E7D5B]/30 focus-visible:border-[#2E7D5B]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center p-4 bg-surface/30">
                    <label className="text-[13px] font-medium text-[#C98A2E]">Medium</label>
                    <div className="flex items-center gap-2">
                      <Input defaultValue="40" className="w-[60px] font-mono text-center border-[#C98A2E]/30 focus-visible:border-[#C98A2E]" />
                      <span className="text-text-muted font-mono">—</span>
                      <Input defaultValue="69" className="w-[60px] font-mono text-center border-[#C98A2E]/30 focus-visible:border-[#C98A2E]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-center p-4">
                    <label className="text-[13px] font-medium text-[#B23A3A]">High</label>
                    <div className="flex items-center gap-2">
                      <Input defaultValue="70" className="w-[60px] font-mono text-center border-[#B23A3A]/30 focus-visible:border-[#B23A3A]" />
                      <span className="text-text-muted font-mono">—</span>
                      <Input defaultValue="100" className="w-[60px] font-mono text-center border-[#B23A3A]/30 focus-visible:border-[#B23A3A]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-0 divide-y divide-hairline border border-hairline bg-surface-raised">
                  <div className="p-4 bg-surface border-b border-hairline">
                    <h3 className="text-[13px] font-medium uppercase tracking-wide text-text-primary">Risk Factors Active Weighting</h3>
                  </div>
                  {[
                    { name: 'Cost Anomaly', weight: 80, active: true },
                    { name: 'Tender Splitting', weight: 95, active: true },
                    { name: 'Duplicate Detection', weight: 100, active: true },
                    { name: 'Photo Verification (EXIF mismatch)', weight: 70, active: true },
                    { name: 'Fund Stagnation', weight: 60, active: true },
                    { name: 'Contractor Collusion (Network)', weight: 85, active: false }
                  ].map(factor => (
                    <div key={factor.name} className="grid grid-cols-[1fr_200px_80px] items-center p-4 hover:bg-surface/50">
                      <div className="text-[13px] font-medium text-text-primary">{factor.name}</div>
                      <div className="flex items-center pr-4">
                        <input type="range" min="0" max="100" defaultValue={factor.weight} disabled={!factor.active} className="w-full accent-[#1E3A5F]" />
                      </div>
                      <div className="flex items-center justify-end">
                        <Toggle checked={factor.active} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'Notifications' && (
              <div className="space-y-8">
                <div className="space-y-0 divide-y divide-hairline border border-hairline bg-surface-raised">
                  <div className="p-4 bg-surface border-b border-hairline grid grid-cols-[1fr_60px_60px_60px] gap-4 text-[11px] text-text-muted uppercase tracking-wide font-medium">
                    <div>Severity Level</div>
                    <div className="text-center">Email</div>
                    <div className="text-center">SMS</div>
                    <div className="text-center">In-App</div>
                  </div>
                  {['Critical Alert (Score > 85)', 'High Alert (Score > 70)', 'Medium Alert', 'Case Assignment'].map((level, i) => (
                    <div key={level} className="p-4 grid grid-cols-[1fr_60px_60px_60px] gap-4 items-center">
                      <div className="text-[13px] font-medium text-text-primary">{level}</div>
                      <div className="flex justify-center"><input type="checkbox" defaultChecked className="accent-[#1E3A5F] w-4 h-4" /></div>
                      <div className="flex justify-center"><input type="checkbox" defaultChecked={i < 2} className="accent-[#1E3A5F] w-4 h-4" /></div>
                      <div className="flex justify-center"><input type="checkbox" defaultChecked className="accent-[#1E3A5F] w-4 h-4" /></div>
                    </div>
                  ))}
                </div>

                <div className="space-y-0 divide-y divide-hairline border border-hairline bg-surface-raised">
                  <div className="p-4 bg-surface border-b border-hairline">
                    <h3 className="text-[13px] font-medium uppercase tracking-wide text-text-primary">Escalation Timing Rules</h3>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="text-[13px] text-text-primary">Auto-escalate Critical Alerts if unresolved after X days</div>
                    <Input defaultValue="3" type="number" className="w-[80px] font-mono text-center" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface/30">
                    <div className="text-[13px] text-text-primary">Auto-escalate High Alerts if unresolved after X days</div>
                    <Input defaultValue="7" type="number" className="w-[80px] font-mono text-center" />
                  </div>
                </div>
              </div>
            )}

            {/* Schemes & Districts */}
            {activeTab === 'Schemes & Districts' && (
              <div className="space-y-8">
                <div className="border border-hairline bg-surface-raised">
                  <div className="p-4 border-b border-hairline flex justify-between items-center bg-surface">
                    <h3 className="text-[13px] font-medium uppercase tracking-wide text-text-primary">Active Schemes</h3>
                    <button className="text-[#1E3A5F] text-[11px] font-medium uppercase tracking-wide flex items-center hover:underline">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Scheme
                    </button>
                  </div>
                  <div className="divide-y divide-hairline text-[13px]">
                    {['Pradhan Mantri Gram Sadak Yojana (PMGSY)', 'MPLADS', 'State Rural Infrastructure Scheme', 'Panchayat Development Fund'].map(scheme => (
                      <div key={scheme} className="flex justify-between items-center p-3 px-4 hover:bg-surface/50">
                        <span className="text-text-primary">{scheme}</span>
                        <button className="text-text-muted hover:text-[#B23A3A] text-[11px] font-medium uppercase tracking-wide">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-hairline bg-surface-raised">
                  <div className="p-4 border-b border-hairline flex justify-between items-center bg-surface">
                    <h3 className="text-[13px] font-medium uppercase tracking-wide text-text-primary">Monitored Districts</h3>
                    <button className="text-[#1E3A5F] text-[11px] font-medium uppercase tracking-wide flex items-center hover:underline">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add District
                    </button>
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore'].map(dist => (
                      <div key={dist} className="inline-flex items-center px-3 py-1 bg-surface border border-hairline text-[12px] text-text-primary">
                        {dist}
                        <button className="ml-2 text-text-muted hover:text-[#B23A3A]">&times;</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeTab === 'Integrations' && (
              <div className="border border-hairline bg-surface-raised divide-y divide-hairline">
                {[
                  { name: 'GIS & Satellite Data Provider (NRSC)', status: 'Connected', desc: 'Syncs live geospatial telemetry for field verification.' },
                  { name: 'Document Verification Service (DigiLocker)', status: 'Connected', desc: 'Verifies uploaded tender documents against public registries.' },
                  { name: 'NIC SMS Gateway', status: 'Not Connected', desc: 'Pushes alert notifications directly to officer mobile numbers.' },
                  { name: 'Financial Core Banking Ledger', status: 'Connected', desc: 'Monitors real-time treasury releases and fund stagnations.' }
                ].map(integration => (
                  <div key={integration.name} className="p-5 flex items-start justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <div className={cn("w-2 h-2 rounded-full mr-2", integration.status === 'Connected' ? "bg-[#2E7D5B]" : "bg-[#B23A3A]")}></div>
                        <h4 className="text-[14px] font-medium text-text-primary">{integration.name}</h4>
                      </div>
                      <p className="text-[12px] text-text-muted ml-4">{integration.desc}</p>
                    </div>
                    <button className="text-[#1E3A5F] text-[11px] font-medium uppercase tracking-wide hover:underline mt-1">
                      Configure
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Audit & Security */}
            {activeTab === 'Audit & Security' && (
              <div className="space-y-8">
                <div className="space-y-0 divide-y divide-hairline border border-hairline bg-surface-raised">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-[13px] font-medium text-text-primary">Require Two-Factor Authentication</div>
                      <div className="text-[11px] text-text-muted mt-0.5">Force all Admin users to authenticate via OTP.</div>
                    </div>
                    <Toggle checked={true} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface/30">
                    <div>
                      <div className="text-[13px] font-medium text-text-primary">Idle Session Timeout</div>
                      <div className="text-[11px] text-text-muted mt-0.5">Automatically log out inactive users.</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input defaultValue="15" type="number" className="w-[60px] font-mono text-center" />
                      <span className="text-[13px] text-text-muted">Mins</span>
                    </div>
                  </div>
                </div>

                <div className="border border-hairline bg-surface-raised overflow-hidden">
                  <div className="p-3 border-b border-hairline bg-[#10151F] flex items-center justify-between">
                    <h3 className="font-medium text-[12px] text-white flex items-center uppercase tracking-wide">
                      <Lock className="w-3.5 h-3.5 mr-2 text-[#D8DCE2]" /> Recent Security Events
                    </h3>
                  </div>
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-surface border-b border-hairline text-[11px] text-text-muted uppercase tracking-wide">
                      <tr>
                        <th className="px-4 py-2 font-normal">Timestamp</th>
                        <th className="px-4 py-2 font-normal">Actor</th>
                        <th className="px-4 py-2 font-normal">Event Descriptor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline font-mono text-[11px]">
                      {MOCK_EVENTS.map(evt => (
                        <tr key={evt.id} className="hover:bg-surface transition-colors">
                          <td className="px-4 py-2.5 text-text-muted">{evt.time}</td>
                          <td className="px-4 py-2.5 font-sans font-medium text-text-primary">{evt.user}</td>
                          <td className="px-4 py-2.5 text-text-muted">{evt.event}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}