import { useState, useMemo } from 'react';
import { Outlet, Link, useParams, useSearchParams } from 'react-router-dom';
import { 
  Search, MapPin, Building2, Camera, Mic, 
  Map as MapIcon, ChevronRight, AlertTriangle, ShieldCheck,
  CheckCircle2, Navigation, IndianRupee
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { mockProjects } from '@/data/mockProjects';
import { mockComplaints, saveComplaints } from '@/data/mockComplaints';
import { formatCurrency, cn } from '@/lib/utils';

// Public Map Marker (Institutional Accent)
const publicIcon = L.divIcon({
  html: `<div style="background-color: #1E3A5F; width: 14px; height: 14px; border-radius: 2px; border: 1px solid #10151F; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
  className: 'custom-leaflet-marker',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// --- CITIZEN LAYOUT ---
export function CitizenLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#10151F] font-sans">
      <header className="bg-white border-b border-[#D8DCE2] sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/citizen" className="flex items-center gap-3 group">
            <ShieldCheck className="w-8 h-8 text-[#1E3A5F] group-hover:opacity-80 transition-opacity" />
            <div>
              <h1 className="font-medium text-xl leading-tight text-[#10151F]">Public Works Register</h1>
              <p className="text-[11px] text-[#5B6472] font-medium uppercase tracking-widest mt-0.5">Citizen Transparency Portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/citizen/complaint" className="text-[13px] font-medium text-[#1E3A5F] hover:underline underline-offset-4 hidden sm:block uppercase tracking-wide">
              Report an Issue
            </Link>
            <div className="border-l border-[#D8DCE2] pl-6">
              <select className="text-[13px] font-medium text-[#5B6472] border border-[#D8DCE2] rounded-[2px] px-2 py-1 bg-white outline-none focus:border-[#1E3A5F]">
                <option>English</option>
                <option>தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full mx-auto px-6 py-10 max-w-[1200px]">
        <Outlet />
      </main>
      <footer className="bg-[#10151F] text-[#D8DCE2] py-12 text-center">
        <p className="text-[13px] tracking-wide">&copy; 2026 Government Transparency Initiative. All rights reserved.</p>
      </footer>
    </div>
  );
}

// --- CITIZEN HOME (Search + Map) ---
export function CitizenHome() {
  const [search, setSearch] = useState('');
  
  const publicProjects = useMemo(() => {
    const s = search.toLowerCase();
    return mockProjects.filter(p => 
      p.name.toLowerCase().includes(s) || 
      p.district.toLowerCase().includes(s) ||
      p.state.toLowerCase().includes(s) ||
      p.contractor.toLowerCase().includes(s) ||
      p.scheme.toLowerCase().includes(s) ||
      p.id.toLowerCase().includes(s)
    );
  }, [search]);

  return (
    <div className="space-y-10">
      <div className="bg-white border border-[#D8DCE2] p-10 md:p-14 text-center relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium mb-4 text-[#10151F]">Find a project near you</h2>
          <p className="text-[#5B6472] mb-10 text-lg">Track the progress of public infrastructure, view budgets, and ensure accountability in your district.</p>
          <div className="relative max-w-xl mx-auto border border-[#1E3A5F] rounded-[2px] bg-white shadow-sm flex items-center overflow-hidden transition-shadow focus-within:shadow-md">
            <Search className="absolute left-4 w-5 h-5 text-[#5B6472]" />
            <input 
              type="text" 
              placeholder="Search by area, district, or project name..." 
              className="w-full h-14 pl-12 pr-6 text-[15px] text-[#10151F] outline-none placeholder:text-[#5B6472]/60 bg-transparent font-sans"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="h-14 px-6 bg-[#1E3A5F] text-white text-[13px] uppercase tracking-wider font-medium hover:bg-[#1E3A5F]/90 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6 max-h-[600px] overflow-y-auto pr-2">
          <h3 className="font-medium text-lg flex items-center text-[#10151F] pb-4 border-b border-[#D8DCE2]">
            <MapPin className="w-5 h-5 mr-2 text-[#5B6472]" /> Nearby Projects
          </h3>
          {publicProjects.length === 0 ? (
            <div className="p-10 text-center text-[#5B6472] bg-white border border-dashed border-[#D8DCE2] text-[13px] uppercase tracking-wide">No projects found.</div>
          ) : (
            <div className="space-y-4">
              {publicProjects.map(p => (
                <Link key={p.id} to={`/citizen/project/${p.id}`} className="block bg-white p-5 border border-[#D8DCE2] hover:border-[#1E3A5F] hover:shadow-sm transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 border border-[#D8DCE2] text-[#5B6472] uppercase tracking-wide">{p.status}</span>
                    <span className="text-[11px] font-mono text-[#5B6472]">{p.id}</span>
                  </div>
                  <h4 className="font-medium text-[16px] text-[#10151F] leading-tight mb-4 group-hover:text-[#1E3A5F] transition-colors">{p.name}</h4>
                  <div className="text-[13px] text-[#5B6472] space-y-2">
                    <div className="flex items-center"><IndianRupee className="w-4 h-4 mr-2 opacity-60" /> <span className="font-mono text-[#10151F] font-medium mr-1">{formatCurrency(p.budget)}</span> Budget</div>
                    <div className="flex items-center"><Building2 className="w-4 h-4 mr-2 opacity-60" /> <span className="truncate">{p.contractor}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-7 h-[600px] bg-white border border-[#D8DCE2] relative shadow-sm">
          <div className="absolute top-4 left-4 z-[1000] bg-white border border-[#D8DCE2] px-3 py-2 shadow-sm text-[11px] uppercase tracking-widest font-medium flex items-center">
            <MapIcon className="w-4 h-4 mr-2 text-[#1E3A5F]" /> Live Project Map
          </div>
          <MapContainer center={[22.5937, 78.9629]} zoom={5} zoomControl={true} className="w-full h-full z-0 bg-[#F7F8FA]">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            {publicProjects.map(p => (
              <Marker key={p.id} position={p.coordinates} icon={publicIcon}>
                <Popup className="custom-popup rounded-none">
                  <div className="p-3 bg-white border border-[#D8DCE2] shadow-sm min-w-[200px]">
                    <h4 className="font-medium text-[13px] leading-tight mb-2 text-[#10151F]">{p.name}</h4>
                    <p className="text-[11px] font-mono text-[#5B6472] mb-4">{p.district}</p>
                    <Link to={`/citizen/project/${p.id}`} className="block text-center bg-[#1E3A5F] text-white text-[11px] uppercase tracking-wide font-medium py-1.5 hover:bg-[#1E3A5F]/90 transition-colors">
                      View Details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

const localVerifications: any[] = [];

// --- CITIZEN PROJECT DETAIL ---
export function CitizenProject() {
  const { id } = useParams();
  const project = mockProjects.find(p => p.id === id) || mockProjects[0];

  const [verifyStatus, setVerifyStatus] = useState("Matches records");
  const [verifyPhotoUrl, setVerifyPhotoUrl] = useState<string | null>(null);
  const [verifySubmitted, setVerifySubmitted] = useState(false);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localVerifications.push({
      projectId: project.id,
      status: verifyStatus,
      photoUrl: verifyPhotoUrl,
      timestamp: new Date().toISOString()
    });
    setVerifySubmitted(true);
  };

  return (
    <div className="space-y-8 max-w-[900px] mx-auto">
      <Link to="/citizen" className="text-[13px] font-medium text-[#5B6472] hover:text-[#10151F] flex items-center transition-colors">
        &larr; Back to Directory
      </Link>
      
      <div className="bg-white border border-[#D8DCE2] p-8 md:p-10 shadow-sm">
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-2 py-0.5 bg-[#F7F8FA] border border-[#D8DCE2] text-[#5B6472] text-[11px] font-medium uppercase tracking-widest">{project.scheme}</span>
          <span className="px-2 py-0.5 border border-[#1E3A5F] text-[#1E3A5F] bg-[#1E3A5F]/5 text-[11px] font-medium uppercase tracking-widest">{project.status}</span>
          <span className="ml-auto text-[12px] font-mono text-[#5B6472]">{project.id}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-medium text-[#10151F] mb-6">{project.name}</h1>
        <p className="text-[#5B6472] text-lg mb-10 flex items-center">
          <MapPin className="w-5 h-5 mr-3 text-[#1E3A5F]" /> {project.district}, {project.state}
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-0 border border-[#D8DCE2] bg-[#F7F8FA] mb-12">
          <div className="p-5 border-b sm:border-b-0 sm:border-r border-[#D8DCE2]">
            <div className="text-[11px] text-[#5B6472] font-medium uppercase tracking-widest mb-2">Total Budget</div>
            <div className="text-xl font-mono font-medium text-[#10151F]">{formatCurrency(project.budget)}</div>
          </div>
          <div className="p-5 border-b sm:border-b-0 md:border-r border-[#D8DCE2]">
            <div className="text-[11px] text-[#5B6472] font-medium uppercase tracking-widest mb-2">Contractor</div>
            <div className="text-[15px] font-medium text-[#10151F] truncate" title={project.contractor}>{project.contractor}</div>
          </div>
          <div className="p-5 border-b sm:border-b-0 sm:border-r border-[#D8DCE2]">
            <div className="text-[11px] text-[#5B6472] font-medium uppercase tracking-widest mb-2">Start Date</div>
            <div className="text-[15px] font-mono font-medium text-[#10151F]">{project.startDate}</div>
          </div>
          <div className="p-5">
            <div className="text-[11px] text-[#5B6472] font-medium uppercase tracking-widest mb-2">Target End</div>
            <div className="text-[15px] font-mono font-medium text-[#10151F]">{project.endDate}</div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-xl mb-6 flex items-center pb-4 border-b border-[#D8DCE2]">
            <Camera className="w-5 h-5 mr-3 text-[#5B6472]" /> Public Progress Photos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="aspect-[4/3] bg-[#F7F8FA] border border-[#D8DCE2] relative group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1541888018151-5be0936cb077?w=400&h=300&fit=crop" alt="Progress" className="w-full h-full object-cover p-1" />
            </div>
            <div className="aspect-[4/3] bg-[#F7F8FA] border border-[#D8DCE2] relative group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop" alt="Progress" className="w-full h-full object-cover p-1" />
            </div>
            <div className="aspect-[4/3] bg-[#F7F8FA] border border-[#D8DCE2] border-dashed flex items-center justify-center text-[#5B6472] text-[13px] font-medium uppercase tracking-widest cursor-pointer hover:bg-white transition-colors">
              +3 More Photos
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="mt-12 pt-12 border-t border-[#D8DCE2]">
          <h3 className="font-medium text-xl mb-6 flex items-center pb-4 border-b border-[#D8DCE2]">
            <ShieldCheck className="w-5 h-5 mr-3 text-[#1E3A5F]" /> Verify This Work
          </h3>
          {verifySubmitted ? (
            <div className="bg-[#2E7D5B]/10 border border-[#2E7D5B]/20 p-6 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-[#2E7D5B] mr-4 flex-shrink-0" />
              <p className="text-[#2E7D5B] font-medium text-[15px]">Verification submitted — thank you for your report.</p>
            </div>
          ) : (
            <form onSubmit={handleVerifySubmit} className="bg-[#F7F8FA] border border-[#D8DCE2] p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-[11px] font-medium text-[#5B6472] uppercase tracking-widest mb-3">Ground-Truth Status</label>
                <select 
                  value={verifyStatus}
                  onChange={e => setVerifyStatus(e.target.value)}
                  className="w-full border border-[#D8DCE2] rounded-[2px] p-3 text-[14px] bg-white outline-none focus:border-[#1E3A5F]"
                >
                  <option value="Matches records">Matches records</option>
                  <option value="Not started despite records showing progress">Not started despite records showing progress</option>
                  <option value="Incomplete / poor quality">Incomplete / poor quality</option>
                  <option value="Different location than listed">Different location than listed</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#5B6472] uppercase tracking-widest mb-3">Attach Evidence Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setVerifyPhotoUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="block w-full text-[14px] text-[#5B6472] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[11px] file:uppercase file:tracking-widest file:font-medium file:bg-[#E8EAEF] file:text-[#10151F] hover:file:bg-[#D8DCE2] transition-colors" 
                />
                {verifyPhotoUrl && (
                  <div className="mt-4 border border-[#D8DCE2] p-2 bg-white inline-block">
                    <img src={verifyPhotoUrl} alt="Evidence" className="h-24 w-auto object-cover" />
                  </div>
                )}
              </div>
              <button type="submit" className="bg-[#1E3A5F] text-white px-6 py-3 rounded-[2px] text-[13px] font-medium uppercase tracking-widest hover:bg-[#1E3A5F]/90 transition-colors">
                Submit Verification
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="bg-[#1E3A5F]/5 border border-[#1E3A5F]/20 p-8 md:p-10 text-center flex flex-col items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-[#1E3A5F] mb-4" />
        <h3 className="text-2xl font-medium text-[#10151F] mb-3">Notice something wrong?</h3>
        <p className="text-[#5B6472] mb-8 max-w-[600px] leading-relaxed">If you observe poor material quality, unexplainable delays, or ghost projects, report it securely to the vigilance department. Your identity can remain anonymous.</p>
        <Link to={`/citizen/complaint?projectId=${project.id}`} className="bg-[#1E3A5F] text-white text-[13px] font-medium uppercase tracking-widest px-8 py-4 rounded-[2px] hover:bg-[#1E3A5F]/90 transition-colors shadow-sm flex items-center">
          Report an Issue <ChevronRight className="w-4 h-4 ml-3" />
        </Link>
      </div>
    </div>
  );
}

// --- CITIZEN COMPLAINT ---
export function CitizenComplaint() {
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('projectId') || '';
  
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const projectId = formData.get('projectId') as string;
    const categoryVal = formData.get('category') as string;
    
    const catMap: Record<string, string> = {
      quality: 'Poor Material Quality',
      delay: 'Unexplained Delay / Abandoned',
      ghost: 'Ghost Project (Does not exist)',
      corruption: 'Suspected Corruption',
      other: 'Other'
    };

    const project = mockProjects.find(p => p.id === projectId);
    
    const newId = `COMP-${Math.floor(Math.random()*90000)+10000}`;
    
    if (project) {
      mockComplaints.unshift({
        id: newId,
        projectId: project.id,
        projectName: project.name,
        category: catMap[categoryVal] || 'Other',
        status: 'New',
        date: new Date().toISOString().split('T')[0],
        evidence: true
      });
      saveComplaints();
    }

    setTrackingId(newId);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-[700px] mx-auto mt-12 bg-white border border-[#D8DCE2] p-10 sm:p-16 text-center shadow-sm">
        <div className="w-20 h-20 bg-[#2E7D5B]/10 text-[#2E7D5B] rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-medium text-[#10151F] mb-3">Complaint Lodged</h2>
        <p className="text-[#5B6472] mb-10 text-lg">Your report has been securely submitted to the Vigilance Department.</p>
        
        <div className="bg-[#F7F8FA] border border-[#D8DCE2] p-8 mb-10 inline-block text-center min-w-[300px]">
          <div className="text-[11px] font-medium text-[#5B6472] uppercase tracking-widest mb-3">Your Tracking ID</div>
          <div className="text-4xl font-mono text-[#10151F] tracking-widest">{trackingId}</div>
        </div>
        
        <p className="text-[13px] text-[#5B6472] mb-10">Please save this ID. You will need it to track the status of your complaint.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-[#1E3A5F] text-white px-8 py-3 rounded-[2px] text-[13px] font-medium uppercase tracking-widest hover:bg-[#1E3A5F]/90 transition-colors">Track Status</button>
          <Link to="/citizen" className="bg-white border border-[#D8DCE2] text-[#10151F] px-8 py-3 rounded-[2px] text-[13px] font-medium uppercase tracking-widest hover:bg-[#F7F8FA] transition-colors">Back to Directory</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto bg-white border border-[#D8DCE2] shadow-sm">
      <div className="bg-[#F7F8FA] border-b border-[#D8DCE2] p-8 md:p-10">
        <h2 className="text-2xl font-medium text-[#10151F] mb-2">Lodge a Public Complaint</h2>
        <p className="text-[#5B6472] text-[14px]">Your identity remains completely anonymous unless you choose to provide contact details in the description.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
        <div className="space-y-3">
          <label className="text-[12px] font-medium text-[#10151F] uppercase tracking-widest">Select Project</label>
          <select name="projectId" className="w-full border border-[#D8DCE2] bg-white rounded-[2px] p-3 text-[15px] focus:border-[#1E3A5F] outline-none font-sans" defaultValue={initialProjectId} required>
            <option value="">-- Select a project --</option>
            {mockProjects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.district})</option>)}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-[12px] font-medium text-[#10151F] uppercase tracking-widest">Complaint Category</label>
          <select name="category" className="w-full border border-[#D8DCE2] bg-white rounded-[2px] p-3 text-[15px] focus:border-[#1E3A5F] outline-none font-sans" required>
            <option value="">-- Select Category --</option>
            <option value="quality">Poor Material Quality</option>
            <option value="delay">Unexplained Delay / Abandoned</option>
            <option value="ghost">Ghost Project (Does not exist)</option>
            <option value="corruption">Suspected Corruption / Demand for Bribe</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-[12px] font-medium text-[#10151F] uppercase tracking-widest">Detailed Description</label>
          <textarea 
            rows={5} 
            className="w-full border border-[#D8DCE2] bg-white rounded-[2px] p-3 text-[15px] focus:border-[#1E3A5F] outline-none resize-none font-sans" 
            placeholder="Please describe what you observed..."
            required
          ></textarea>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-[#D8DCE2]">
          {/* Photo Upload */}
          <div className="space-y-3">
            <label className="text-[12px] font-medium text-[#10151F] uppercase tracking-widest flex items-center">
              Photo Evidence <span className="text-[#B23A3A] ml-1">*</span>
            </label>
            <input 
              type="file" 
              accept="image/*" 
              required
              className="block w-full text-[14px] text-[#5B6472] file:mr-4 file:py-3 file:px-6 file:border-0 file:text-[11px] file:uppercase file:tracking-widest file:font-medium file:bg-[#E8EAEF] file:text-[#10151F] hover:file:bg-[#D8DCE2] transition-colors border border-dashed border-[#D8DCE2] p-4 bg-[#F7F8FA] cursor-pointer"
            />
            <div className="text-[11px] text-[#B23A3A] font-medium uppercase tracking-widest">Photo evidence is mandatory</div>
          </div>

          {/* Location & Voice */}
          <div className="space-y-5">
            <div className="space-y-3">
              <label className="text-[12px] font-medium text-[#10151F] uppercase tracking-widest">GPS Location</label>
              <button type="button" className="w-full flex items-center justify-center gap-2 border border-[#1E3A5F] bg-[#1E3A5F]/5 text-[#1E3A5F] rounded-[2px] p-3 text-[13px] font-medium uppercase tracking-widest hover:bg-[#1E3A5F]/10 transition-colors">
                <Navigation className="w-4 h-4" /> Auto-Capture Location
              </button>
            </div>
            <div className="space-y-3">
              <label className="text-[12px] font-medium text-[#10151F] uppercase tracking-widest">Voice Note (Optional)</label>
              <button 
                type="button" 
                onClick={() => setIsRecording(!isRecording)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 rounded-[2px] p-3 text-[13px] font-medium uppercase tracking-widest transition-colors border",
                  isRecording ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" : "border-[#D8DCE2] bg-white text-[#5B6472] hover:bg-[#F7F8FA]"
                )}
              >
                <Mic className="w-4 h-4" /> {isRecording ? "Recording... (Tap to stop)" : "Record Voice Note"}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#D8DCE2]">
          <button type="submit" className="w-full bg-[#10151F] text-white rounded-[2px] p-4 text-[14px] font-medium uppercase tracking-widest hover:bg-[#10151F]/90 transition-colors">
            Submit Anonymous Complaint
          </button>
        </div>
      </form>
    </div>
  );
}
