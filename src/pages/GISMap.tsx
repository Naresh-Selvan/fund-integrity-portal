import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl 
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Filter, Layers, ShieldAlert, ArrowRight
} from 'lucide-react';
import { mockProjects } from '@/data/mockProjects';
import { formatCurrency } from '@/lib/utils';

// Helper to create custom colored markers
const createCustomIcon = (riskScore: number) => {
  const color = riskScore >= 70 ? '#B23A3A' : riskScore >= 40 ? '#C98A2E' : '#2E7D5B';
  const html = `
    <div style="
      background-color: ${color};
      width: 14px;
      height: 14px;
      border-radius: 2px;
      border: 1px solid #10151F;
    "></div>
  `;
  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -7]
  });
};

const Select = ({ label, value, onChange, options, placeholder }: any) => (
  <div className="space-y-1 w-full">
    <label className="text-[11px] font-medium text-text-muted uppercase tracking-wide">{label}</label>
    <select 
      className="flex h-8 w-full items-center justify-between rounded-[2px] border border-hairline bg-surface-raised px-2.5 py-1 text-[13px] text-text-primary focus:outline-none focus:border-primary appearance-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

// We define mock overlap clusters visually based on some coordinates
const MOCK_CLUSTERS = [
  { center: [18.5, 73.8] as [number, number], radius: 15000, count: 3, label: "Pune Region Overlap" },
  { center: [25.3, 83.0] as [number, number], radius: 25000, count: 2, label: "Varanasi Corridors" }
];

export default function GISMap() {
  const navigate = useNavigate();
  
  const [schemeFilter, setSchemeFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showOverlaps, setShowOverlaps] = useState(false);

  const schemes = Array.from(new Set(mockProjects.map(p => p.scheme)));
  const statuses = Array.from(new Set(mockProjects.map(p => p.status)));

  const filteredProjects = useMemo(() => {
    let result = [...mockProjects];
    if (schemeFilter) result = result.filter(p => p.scheme === schemeFilter);
    if (statusFilter) result = result.filter(p => p.status === statusFilter);
    if (riskFilter) {
      if (riskFilter === 'High') result = result.filter(p => p.riskScore >= 70);
      else if (riskFilter === 'Medium') result = result.filter(p => p.riskScore >= 40 && p.riskScore < 70);
      else if (riskFilter === 'Low') result = result.filter(p => p.riskScore < 40);
    }
    return result;
  }, [schemeFilter, riskFilter, statusFilter]);

  return (
    <div className="h-full flex flex-col md:flex-row border-y border-hairline -mx-6 -my-6 bg-surface">
      
      {/* Side Panel (White, Hairline Border) */}
      <div className="w-full md:w-[320px] bg-surface-raised border-r border-hairline flex flex-col z-10 shrink-0">
        <div className="p-4 border-b border-hairline">
          <h2 className="text-lg font-medium text-text-primary flex items-center">
            <Filter className="w-4 h-4 mr-2 text-text-muted" /> Map Filters
          </h2>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-4">
            <Select label="Scheme" placeholder="All Schemes" options={schemes} value={schemeFilter} onChange={setSchemeFilter} />
            <Select label="Status" placeholder="All Statuses" options={statuses} value={statusFilter} onChange={setStatusFilter} />
            <Select label="Risk Level" placeholder="All Risk Levels" options={['Low', 'Medium', 'High']} value={riskFilter} onChange={setRiskFilter} />
          </div>
          
          <div className="pt-4 border-t border-hairline">
            <label className="flex items-start space-x-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="mt-0.5 w-3.5 h-3.5 rounded-none border border-hairline text-[#1E3A5F] focus:ring-0 cursor-pointer"
                checked={showOverlaps}
                onChange={(e) => setShowOverlaps(e.target.checked)}
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-medium flex items-center text-text-primary group-hover:text-[#1E3A5F] transition-colors">
                  <Layers className="w-3.5 h-3.5 mr-1.5" /> Show Overlap Clusters
                </span>
                <span className="text-[11px] text-text-muted mt-0.5">Draws dashed boundaries around geospatial tender overlaps</span>
              </div>
            </label>
          </div>
          
          <button 
            className="w-full text-[11px] font-mono text-text-muted hover:text-text-primary uppercase tracking-wide"
            onClick={() => { setSchemeFilter(''); setStatusFilter(''); setRiskFilter(''); setShowOverlaps(false); }}
          >
            [ Reset All Filters ]
          </button>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-hairline bg-surface">
          <div className="text-[11px] uppercase tracking-wide text-text-muted mb-3 font-medium">Risk Legend</div>
          <div className="space-y-2 text-[12px] text-text-primary font-mono">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#2E7D5B] border border-[#10151F] mr-3"></div>
              <span>Low (0-39)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#C98A2E] border border-[#10151F] mr-3"></div>
              <span>Medium (40-69)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#B23A3A] border border-[#10151F] mr-3"></div>
              <span>High (70-100)</span>
            </div>
            {showOverlaps && (
              <div className="flex items-center pt-2 mt-2 border-t border-hairline">
                <div className="w-3 h-3 border border-dashed border-[#B23A3A] bg-[#B23A3A]/10 mr-3 rounded-full"></div>
                <span className="font-sans text-text-muted text-[11px]">Overlap Cluster</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 h-full relative z-0">
        <MapContainer 
          center={[22.5937, 78.9629]} // Center of India
          zoom={5} 
          zoomControl={false}
          className="w-full h-full bg-surface"
        >
          {/* Light, minimal basemap to make markers pop */}
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <ZoomControl position="bottomright" />

          {/* Render Overlap Clusters */}
          {showOverlaps && MOCK_CLUSTERS.map((cluster, i) => (
            <Circle 
              key={`cluster-${i}`}
              center={cluster.center}
              radius={cluster.radius}
              pathOptions={{ 
                color: '#B23A3A', 
                fillColor: '#B23A3A', 
                fillOpacity: 0.05, 
                dashArray: '4, 4',
                weight: 1
              }}
            >
              <Popup className="custom-popup rounded-none">
                <div className="p-2 min-w-[180px] font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#B23A3A] font-bold mb-2 uppercase border-b border-hairline pb-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Overlap Cluster
                  </div>
                  <p className="text-text-primary mb-1">{cluster.label}</p>
                  <p className="text-text-muted">Overlaps: <span className="text-text-primary">{cluster.count}</span></p>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* Render Project Markers */}
          {filteredProjects.map(project => {
            const isHigh = project.riskScore >= 70;
            const isMed = project.riskScore >= 40 && project.riskScore < 70;
            const riskColor = isHigh ? '#B23A3A' : isMed ? '#C98A2E' : '#2E7D5B';

            return (
              <Marker 
                key={project.id}
                position={project.coordinates}
                icon={createCustomIcon(project.riskScore)}
              >
                <Popup className="custom-popup">
                  <div className="min-w-[220px] p-2 bg-surface-raised border border-hairline shadow-none">
                    <div className="flex justify-between items-start mb-2 border-b border-hairline pb-2">
                      <div className="text-[12px] text-text-primary font-medium truncate pr-2">{project.name}</div>
                      <div 
                        className="px-1.5 py-0.5 text-[11px] font-mono font-medium border text-white rounded-[2px]" 
                        style={{ backgroundColor: riskColor, borderColor: '#10151F' }}
                      >
                        {project.riskScore}
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-3 text-[12px] font-mono text-text-primary">
                      <div className="flex justify-between">
                        <span className="text-text-muted">SCHEME</span>
                        <span>{project.scheme}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">BUDGET</span>
                        <span>{formatCurrency(project.budget)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="w-full bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white text-[11px] uppercase tracking-wide font-medium py-1.5 rounded-[2px] flex items-center justify-center transition-colors"
                    >
                      View Record <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}