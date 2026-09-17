import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, ChevronLeft, ChevronRight, 
  ArrowUpDown, Eye, ShieldAlert, FileX 
} from 'lucide-react';
import { format } from 'date-fns';
import { mockProjects } from '@/data/mockProjects';
import type { Project } from '@/data/mockProjects';
import { formatCurrency, cn } from '@/lib/utils';

// --- Simple UI Components (Ledger Style) ---
const Button = ({ children, className, variant = 'default', size = 'default', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'outline'|'ghost', size?: 'default'|'sm'|'icon' }) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-[13px] font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90",
    outline: "border border-hairline bg-surface-raised hover:bg-surface hover:text-text-primary",
    ghost: "hover:bg-surface hover:text-text-primary text-text-muted"
  };
  const sizes = {
    default: "h-8 px-3 py-1.5",
    sm: "h-7 px-2.5 text-xs",
    icon: "h-8 w-8"
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>;
};

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn("flex h-8 w-full rounded-[4px] border border-hairline bg-surface-raised px-3 py-1 text-[13px] font-mono transition-colors placeholder:text-text-muted/60 focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50", className)}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

const Select = ({ value, onChange, options, placeholder, className }: { value: string, onChange: (v: string) => void, options: string[], placeholder: string, className?: string }) => (
  <select 
    className={cn("flex h-8 w-full items-center justify-between whitespace-nowrap rounded-[4px] border border-hairline bg-surface-raised px-3 py-1 text-[13px] focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none text-text-primary", className)}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    <option value="">{placeholder}</option>
    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  </select>
);

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("inline-flex items-center px-2 py-0.5 text-xs font-medium font-mono", className)}>
    {children}
  </div>
);

type SortKey = keyof Project | 'lastInspection';

export default function Projects() {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  
  const [sortColumn, setSortColumn] = useState<SortKey>('riskScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const enhancedProjects = useMemo(() => {
    return mockProjects.map(p => ({
      ...p,
      lastInspection: new Date(new Date().getTime() - (p.id.length * 10 + p.riskScore) * 86400000).toISOString()
    }));
  }, []);

  const statuses = Array.from(new Set(mockProjects.map(p => p.status)));
  const schemes = Array.from(new Set(mockProjects.map(p => p.scheme)));
  const states = Array.from(new Set(mockProjects.map(p => p.state)));

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...enhancedProjects];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.id.toLowerCase().includes(lower) || 
        p.name.toLowerCase().includes(lower) || 
        p.contractor.toLowerCase().includes(lower)
      );
    }
    if (statusFilter) result = result.filter(p => p.status === statusFilter);
    if (schemeFilter) result = result.filter(p => p.scheme === schemeFilter);
    if (stateFilter) result = result.filter(p => p.state === stateFilter);
    if (riskFilter) {
      if (riskFilter === 'High') result = result.filter(p => p.riskScore >= 70);
      else if (riskFilter === 'Medium') result = result.filter(p => p.riskScore >= 40 && p.riskScore < 70);
      else if (riskFilter === 'Low') result = result.filter(p => p.riskScore < 40);
    }

    result.sort((a, b) => {
      let aVal = a[sortColumn as keyof typeof a] ?? '';
      let bVal = b[sortColumn as keyof typeof b] ?? '';
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchTerm, statusFilter, schemeFilter, riskFilter, stateFilter, sortColumn, sortDirection, enhancedProjects]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedData = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (column: SortKey) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-1 w-3 h-3 opacity-20" />;
    return <ArrowUpDown className={cn("ml-1 w-3 h-3", sortDirection === 'desc' && "rotate-180")} />;
  };

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex justify-between items-end pb-4 border-b border-hairline">
        <div>
          <h1 className="text-2xl font-medium text-text-primary">Projects Register</h1>
        </div>
        <Button onClick={() => navigate('/projects/new')}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Register New Project
        </Button>
      </div>

      {/* Filters (Ledger Row) */}
      <div className="flex flex-col lg:flex-row gap-4 items-center bg-surface-raised border border-hairline p-3 rounded-[4px]">
        <div className="relative w-full lg:w-80 flex-shrink-0">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-text-muted" />
          <Input 
            placeholder="Search by ID, Name, Contractor..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        
        <div className="flex flex-1 flex-wrap gap-3">
          <Select 
            className="w-[140px]" 
            placeholder="All Statuses" 
            options={statuses} 
            value={statusFilter} 
            onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
          />
          <Select 
            className="w-[140px]" 
            placeholder="All Schemes" 
            options={schemes} 
            value={schemeFilter} 
            onChange={(v) => { setSchemeFilter(v); setCurrentPage(1); }}
          />
          <Select 
            className="w-[140px]" 
            placeholder="Risk Level" 
            options={['Low', 'Medium', 'High']} 
            value={riskFilter} 
            onChange={(v) => { setRiskFilter(v); setCurrentPage(1); }}
          />
          <Select 
            className="w-[140px]" 
            placeholder="All States" 
            options={states} 
            value={stateFilter} 
            onChange={(v) => { setStateFilter(v); setCurrentPage(1); }}
          />
          {(searchTerm || statusFilter || schemeFilter || riskFilter || stateFilter) && (
            <Button 
              variant="ghost" 
              className="px-2" 
              onClick={() => {
                setSearchTerm(''); setStatusFilter(''); setSchemeFilter(''); setRiskFilter(''); setStateFilter('');
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Main Content - Table */}
      <div className="bg-surface-raised border border-hairline rounded-[4px] flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-[11px] text-text-muted bg-surface border-b border-hairline sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 font-normal cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('id')}>
                  <div className="flex items-center">Project <SortIcon column="id" /></div>
                </th>
                <th className="px-4 py-2 font-normal cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('scheme')}>
                  <div className="flex items-center">Scheme / State <SortIcon column="scheme" /></div>
                </th>
                <th className="px-4 py-2 font-normal cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('contractor')}>
                  <div className="flex items-center">Contractor <SortIcon column="contractor" /></div>
                </th>
                <th className="px-4 py-2 font-normal cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('budget')}>
                  <div className="flex items-center">Budget <SortIcon column="budget" /></div>
                </th>
                <th className="px-4 py-2 font-normal cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('riskScore')}>
                  <div className="flex items-center">Risk <SortIcon column="riskScore" /></div>
                </th>
                <th className="px-4 py-2 font-normal cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center">Status <SortIcon column="status" /></div>
                </th>
                <th className="px-4 py-2 font-normal cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('lastInspection')}>
                  <div className="flex items-center">Last Inspection <SortIcon column="lastInspection" /></div>
                </th>
                <th className="px-4 py-2 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="hover:bg-surface/50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-surface border border-hairline animate-pulse rounded-[2px] w-full max-w-[120px]"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-text-muted">
                      <FileX className="w-8 h-8 mb-3 opacity-30" />
                      <h3 className="text-[13px] font-medium text-text-primary">No projects found in register</h3>
                      <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                        setSearchTerm(''); setStatusFilter(''); setSchemeFilter(''); setRiskFilter(''); setStateFilter('');
                      }}>
                        Clear Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((project) => (
                  <tr 
                    key={project.id} 
                    className="hover:bg-surface/50 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <td className="px-4 py-2.5">
                      <div className="text-[13px] text-text-primary max-w-[220px] truncate" title={project.name}>{project.name}</div>
                      <div className="text-[11px] text-text-muted mt-0.5 font-mono">{project.id}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-[13px] text-text-primary">{project.scheme}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">{project.district}, {project.state}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="truncate max-w-[150px] text-[13px] text-text-primary" title={project.contractor}>{project.contractor}</div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[12px] text-text-primary">
                      {formatCurrency(project.budget)}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge className={
                        project.riskScore >= 70 ? "text-[#B23A3A] bg-[#B23A3A]/10" : 
                        project.riskScore >= 40 ? "text-[#C98A2E] bg-[#C98A2E]/10" : 
                        "text-[#2E7D5B] bg-[#2E7D5B]/10"
                      }>
                        {project.riskScore}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium border border-hairline rounded-[2px] text-text-primary bg-surface uppercase tracking-wide">
                        {project.status}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-text-muted font-mono text-[12px]">
                      {format(new Date(project.lastInspection), 'dd MMM yyyy')}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }} title="View Record">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-[#B23A3A] hover:bg-[#B23A3A]/10" onClick={(e) => { e.stopPropagation(); navigate(`/investigations/new?projectId=${project.id}`); }} title="Flag / Investigate">
                          <ShieldAlert className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-t border-hairline p-2 flex items-center justify-between text-[12px] bg-surface">
          <div className="text-text-muted px-2">
            Showing <span className="font-mono text-text-primary">{filteredAndSorted.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-mono text-text-primary">{Math.min(currentPage * itemsPerPage, filteredAndSorted.length)}</span> of <span className="font-mono text-text-primary">{filteredAndSorted.length}</span> records
          </div>
          <div className="flex items-center space-x-1 font-mono pr-2">
            <button 
              className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={cn(
                  "px-2 py-0.5 min-w-[24px] text-center transition-colors",
                  currentPage === i + 1 ? "text-primary border-b border-primary font-medium" : "text-text-muted hover:text-text-primary"
                )}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0 || isLoading}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}