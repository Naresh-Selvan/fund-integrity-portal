import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, UploadCloud, 
  FileText, ShieldCheck, X, Loader2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cn } from '@/lib/utils';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Ledger UI Components ---
const Input = ({ label, required, error, mono, ...props }: any) => (
  <div className="space-y-1 w-full">
    {label && <label className="text-[12px] text-text-muted font-medium">{label} {required && <span className="text-[#B23A3A]">*</span>}</label>}
    <input className={cn("flex h-8 w-full rounded-[2px] border border-hairline bg-surface-raised px-2.5 py-1 text-[13px] text-text-primary transition-colors placeholder:text-text-muted/50 focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50", mono && "font-mono", error && "border-[#B23A3A] focus-visible:border-[#B23A3A]")} {...props} />
    {error && <p className="text-[10px] text-[#B23A3A]">{error}</p>}
  </div>
);

const Textarea = ({ label, required, error, ...props }: any) => (
  <div className="space-y-1 w-full">
    {label && <label className="text-[12px] text-text-muted font-medium">{label} {required && <span className="text-[#B23A3A]">*</span>}</label>}
    <textarea className={cn("flex min-h-[60px] w-full rounded-[2px] border border-hairline bg-surface-raised px-2.5 py-2 text-[13px] text-text-primary transition-colors placeholder:text-text-muted/50 focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50", error && "border-[#B23A3A] focus-visible:border-[#B23A3A]")} {...props} />
    {error && <p className="text-[10px] text-[#B23A3A]">{error}</p>}
  </div>
);

const Select = ({ label, required, error, options, ...props }: any) => (
  <div className="space-y-1 w-full">
    {label && <label className="text-[12px] text-text-muted font-medium">{label} {required && <span className="text-[#B23A3A]">*</span>}</label>}
    <select className={cn("flex h-8 w-full items-center justify-between rounded-[2px] border border-hairline bg-surface-raised px-2.5 py-1 text-[13px] text-text-primary focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none", error && "border-[#B23A3A] focus-visible:border-[#B23A3A]")} {...props}>
      <option value="" disabled>Select {label.toLowerCase()}</option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    {error && <p className="text-[10px] text-[#B23A3A]">{error}</p>}
  </div>
);

const Button = ({ children, className, variant = 'default', isLoading, ...props }: any) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-[13px] font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-8 px-3 py-1.5";
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90",
    outline: "border border-hairline bg-surface-raised hover:bg-surface hover:text-text-primary",
    ghost: "hover:bg-surface hover:text-text-primary text-text-muted"
  };
  return (
    <button className={cn(base, variants[variant as keyof typeof variants], className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  );
};

// Map click handler component
function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

const STEPS = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Location' },
  { id: 3, title: 'Tender & Contractor' },
  { id: 4, title: 'Documents' },
  { id: 5, title: 'Review & Submit' }
];

export default function NewProject() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', scheme: '', description: '', budget: '', authority: '',
    state: '', district: '', block: '', address: '', lat: 20.5937, lng: 78.9629,
    tenderRef: '', contractorName: '', contractorId: '', bidAmount: '', tenderDate: '',
    files: [] as { type: string, name: string }[]
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Project name is required";
      if (!formData.scheme) newErrors.scheme = "Scheme selection is required";
      if (!formData.budget || isNaN(Number(formData.budget))) newErrors.budget = "Valid budget is required";
      if (!formData.authority.trim()) newErrors.authority = "Authority is required";
    }
    if (step === 2) {
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.district) newErrors.district = "District is required";
    }
    if (step === 3) {
      if (!formData.tenderRef.trim()) newErrors.tenderRef = "Tender reference is required";
      if (!formData.contractorName.trim()) newErrors.contractorName = "Contractor name is required";
      if (!formData.bidAmount || isNaN(Number(formData.bidAmount))) newErrors.bidAmount = "Valid bid amount is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate AI Risk Analysis & API Call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/projects/PRJ-2023-001'); // Mock navigate to first project
    }, 2500);
  };

  // --- Step Renders ---
  const renderStep1 = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Project Name" required placeholder="e.g. Rural Road Connectivity Ph-IV" value={formData.name} onChange={(e: any) => updateForm('name', e.target.value)} error={errors.name} />
        <Select label="Scheme" required options={['PMGSY', 'MPLADS', 'State Scheme', 'Panchayat', 'Other']} value={formData.scheme} onChange={(e: any) => updateForm('scheme', e.target.value)} error={errors.scheme} />
      </div>
      <Textarea label="Project Description" placeholder="Brief overview of the project objectives..." value={formData.description} onChange={(e: any) => updateForm('description', e.target.value)} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Estimated Budget (₹)" mono type="number" required placeholder="e.g. 450000000" value={formData.budget} onChange={(e: any) => updateForm('budget', e.target.value)} error={errors.budget} />
        <Input label="Sanctioning Authority" required placeholder="e.g. Ministry of Rural Development" value={formData.authority} onChange={(e: any) => updateForm('authority', e.target.value)} error={errors.authority} />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid gap-4 md:grid-cols-3">
        <Select label="State" required options={['Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Rajasthan', 'Gujarat']} value={formData.state} onChange={(e: any) => updateForm('state', e.target.value)} error={errors.state} />
        <Input label="District" required placeholder="e.g. Pune" value={formData.district} onChange={(e: any) => updateForm('district', e.target.value)} error={errors.district} />
        <Input label="Block / Village" placeholder="e.g. Haveli" value={formData.block} onChange={(e: any) => updateForm('block', e.target.value)} />
      </div>
      <Textarea label="Full Address" placeholder="Detailed location address..." value={formData.address} onChange={(e: any) => updateForm('address', e.target.value)} />
      
      <div className="space-y-1.5">
        <label className="text-[12px] text-text-muted font-medium">GPS Coordinates <span className="font-normal opacity-70">(Click on map to set)</span></label>
        <div className="flex gap-4 mb-2">
          <Input mono type="number" step="any" placeholder="Latitude" value={formData.lat} onChange={(e: any) => updateForm('lat', parseFloat(e.target.value))} />
          <Input mono type="number" step="any" placeholder="Longitude" value={formData.lng} onChange={(e: any) => updateForm('lng', parseFloat(e.target.value))} />
        </div>
        <div className="h-[250px] w-full border border-hairline overflow-hidden z-0">
          <MapContainer center={[formData.lat, formData.lng]} zoom={4} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={[formData.lat, formData.lng]} setPosition={(pos: [number, number]) => { updateForm('lat', pos[0]); updateForm('lng', pos[1]); }} />
          </MapContainer>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="grid gap-4 md:grid-cols-2">
        <Input mono label="Tender Reference Number" required placeholder="e.g. TND/2026/045" value={formData.tenderRef} onChange={(e: any) => updateForm('tenderRef', e.target.value)} error={errors.tenderRef} />
        <Input label="Tender Date" type="date" value={formData.tenderDate} onChange={(e: any) => updateForm('tenderDate', e.target.value)} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Contractor Name" required placeholder="e.g. L&T Infra" value={formData.contractorName} onChange={(e: any) => updateForm('contractorName', e.target.value)} error={errors.contractorName} />
        <Input mono label="Contractor Registration ID" placeholder="e.g. CTR-90021" value={formData.contractorId} onChange={(e: any) => updateForm('contractorId', e.target.value)} />
      </div>
      <Input mono label="Winning Bid Amount (₹)" type="number" required placeholder="e.g. 420000000" value={formData.bidAmount} onChange={(e: any) => updateForm('bidAmount', e.target.value)} error={errors.bidAmount} />
    </div>
  );

  const handleMockUpload = (type: string) => {
    const fileName = `${type.replace(' ', '_').toLowerCase()}_document.pdf`;
    if (!formData.files.find(f => f.type === type)) {
      setFormData(prev => ({ ...prev, files: [...prev.files, { type, name: fileName }] }));
    }
  };
  const removeFile = (type: string) => {
    setFormData(prev => ({ ...prev, files: prev.files.filter(f => f.type !== type) }));
  };

  const renderStep4 = () => {
    const docTypes = ['Work Order', 'Sanction Letter', 'Site Plan'];
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <p className="text-[13px] text-text-muted">Upload required official documentation. Files are subject to hash verification.</p>
        
        <div className="grid gap-4 md:grid-cols-3">
          {docTypes.map(type => {
            const uploaded = formData.files.find(f => f.type === type);
            return (
              <div key={type} className={cn("border border-dashed border-hairline p-4 flex flex-col items-center justify-center text-center transition-colors", uploaded ? "bg-surface" : "bg-surface hover:border-[#1E3A5F]/40")}>
                {uploaded ? (
                  <>
                    <FileText className="w-5 h-5 text-text-muted mb-1" />
                    <p className="text-[12px] font-medium text-text-primary truncate w-full px-1 font-mono" title={uploaded.name}>{uploaded.name}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">Attached</p>
                    <Button variant="ghost" size="sm" className="mt-2 text-[#B23A3A] hover:text-[#B23A3A]" onClick={() => removeFile(type)}>
                      <X className="w-3 h-3 mr-1" /> Remove
                    </Button>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5 text-text-muted mb-1" />
                    <p className="text-[12px] font-medium text-text-primary">{type}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">PDF/JPG</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => handleMockUpload(type)}>Select</Button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-surface-raised border border-hairline overflow-hidden">
        <div className="bg-surface px-4 py-2 border-b border-hairline flex items-center justify-between">
          <h3 className="text-[13px] font-medium text-text-primary flex items-center">
             Data Manifest Summary
          </h3>
          <span className="text-[10px] uppercase font-mono tracking-wide text-text-muted">Ready for Analysis</span>
        </div>
        <div className="p-4 grid gap-x-8 gap-y-4 md:grid-cols-2 text-[13px]">
          <div>
            <p className="text-text-muted text-[11px] uppercase tracking-wide mb-1 border-b border-hairline pb-1">Basic Info</p>
            <p className="text-text-primary font-medium mt-1">{formData.name || '—'}</p>
            <p className="text-text-muted">{formData.scheme || '—'}</p>
            <p className="text-text-primary mt-1">Budget: <span className="font-mono">₹{Number(formData.budget).toLocaleString() || '—'}</span></p>
            <p className="text-text-muted">Authority: {formData.authority || '—'}</p>
          </div>
          <div>
            <p className="text-text-muted text-[11px] uppercase tracking-wide mb-1 border-b border-hairline pb-1">Location</p>
            <p className="text-text-primary font-medium mt-1">{formData.district}, {formData.state}</p>
            <p className="text-text-muted">{formData.block || '—'}</p>
            <p className="text-text-primary mt-1 font-mono text-[12px]">[{formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}]</p>
          </div>
          <div>
            <p className="text-text-muted text-[11px] uppercase tracking-wide mb-1 border-b border-hairline pb-1">Contractor & Tender</p>
            <p className="text-text-primary font-medium mt-1">{formData.contractorName || '—'} <span className="font-mono font-normal">({formData.contractorId})</span></p>
            <p className="text-text-muted">Ref: <span className="font-mono">{formData.tenderRef || '—'}</span></p>
            <p className="text-text-primary mt-1">Bid: <span className="font-mono">₹{Number(formData.bidAmount).toLocaleString() || '—'}</span></p>
          </div>
          <div>
            <p className="text-text-muted text-[11px] uppercase tracking-wide mb-1 border-b border-hairline pb-1">Documents Attached</p>
            <ul className="mt-1 space-y-0.5">
              {formData.files.length > 0 ? formData.files.map(f => (
                <li key={f.type} className="text-[12px] font-mono before:content-['└_'] text-text-muted">{f.type}</li>
              )) : <li className="text-text-muted text-[12px] italic">No documents uploaded</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-hairline p-4 flex gap-3 text-[13px]">
        <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-text-muted" />
        <div>
          <p className="font-medium text-text-primary mb-1">AI Risk Analysis Pending</p>
          <p className="text-text-muted">Submitting this form will run the data against historical fraud patterns, contractor history, and geospatial anomalies to generate an official Risk Score.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[800px] mx-auto space-y-6 py-4 h-full flex flex-col">
      <div className="flex items-end justify-between pb-4 border-b border-hairline">
        <div>
          <h1 className="text-2xl font-medium text-text-primary">Project Registration</h1>
          <p className="text-text-muted text-[13px] mt-1">Initialize a new public works project for monitoring.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/projects')}>Cancel Form</Button>
      </div>

      {/* Stepper Header (Hairline style) */}
      <div className="flex items-center pb-6">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isLast = idx === STEPS.length - 1;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[12px] font-mono",
                    isActive ? "text-primary font-medium" : 
                    isCompleted ? "text-text-primary" : 
                    "text-text-muted opacity-50"
                  )}>
                    {step.id.toString().padStart(2, '0')}
                  </span>
                  <span className={cn(
                    "text-[13px] whitespace-nowrap",
                    isActive ? "text-primary font-medium" : 
                    isCompleted ? "text-text-primary" : 
                    "text-text-muted opacity-50"
                  )}>
                    {step.title}
                  </span>
                </div>
              </div>
              {!isLast && (
                <div className={cn(
                  "flex-1 h-[1px] mx-4",
                  isCompleted ? "bg-[#1E3A5F]/30" : "bg-hairline"
                )}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Form Area */}
      <div className="bg-surface-raised border border-hairline flex-1 flex flex-col">
        <div className="p-6 flex-1 bg-surface-raised">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-hairline bg-surface flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Back
          </Button>
          
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext}>
              Next Step <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Analyzing Risk...' : 'Submit for AI Risk Analysis'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
