export type ProjectStatus = 'Active' | 'Delayed' | 'Completed' | 'Flagged' | 'Registered';

export interface Project {
  id: string;
  name: string;
  scheme: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  district: string;
  state: string;
  contractor: string;
  latitude?: number;
  longitude?: number;
}

export const mockProjects: Project[] = [
  {
    id: 'PRJ-2023-001',
    name: 'Construction of Community Hall near Panchayat Office',
    scheme: 'MPLADS',
    budget: 15000000, // 1.5 Cr
    spent: 12000000,
    startDate: '2023-01-15',
    endDate: '2024-06-30',
    status: 'Active',
    district: 'Ernakulam',
    state: 'Kerala',
    contractor: 'KV Constructions',
    latitude: 9.9816,
    longitude: 76.2999,
  },
  {
    id: 'PRJ-2023-002',
    name: 'Installation of 50 Solar High Mast Lights in Ward 12',
    scheme: 'MPLADS',
    budget: 8000000, // 80 Lakhs
    spent: 8000000,
    startDate: '2023-03-01',
    endDate: '2023-12-31',
    status: 'Delayed',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    contractor: 'Surya Electricals',
    latitude: 25.3176,
    longitude: 82.9739,
  },
  {
    id: 'PRJ-2023-003',
    name: 'Provision of 2 Advanced Life Support Ambulances',
    scheme: 'MPLADS',
    budget: 5000000, // 50 Lakhs
    spent: 4500000,
    startDate: '2022-11-10',
    endDate: '2023-05-20',
    status: 'Completed',
    district: 'Madurai',
    state: 'Tamil Nadu',
    contractor: 'Ashok Leyland Medical',
    latitude: 9.9252,
    longitude: 78.1198,
  },
  {
    id: 'PRJ-2023-004',
    name: 'Construction of CC Road from Main Highway to Govt School',
    scheme: 'MPLADS',
    budget: 2000000, // 20 Lakhs
    spent: 800000,
    startDate: '2024-02-01',
    endDate: '2024-11-30',
    status: 'Active',
    district: 'Patiala',
    state: 'Punjab',
    contractor: 'Singh Builders',
    latitude: 30.3398,
    longitude: 76.3869,
  },
  {
    id: 'PRJ-2023-005',
    name: 'Upgradation of Drinking Water RO Plant in Slum Area',
    scheme: 'MPLADS',
    budget: 12000000, // 1.2 Cr
    spent: 11400000,
    startDate: '2024-01-10',
    endDate: '2024-08-15',
    status: 'Flagged',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    contractor: 'Surya Electricals',
    latitude: 19.0380,
    longitude: 72.8538,
  },
  {
    id: 'PRJ-2023-006',
    name: 'Construction of 4 Additional Classrooms for ZP High School',
    scheme: 'MPLADS',
    budget: 3500000, // 35 Lakhs
    spent: 700000,
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    status: 'Active',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    contractor: 'Reddy & Sons Infra',
    latitude: 16.3067,
    longitude: 80.4365,
  },
  {
    id: 'PRJ-2023-007',
    name: 'Purchase of Library Books and Computers for Public Library',
    scheme: 'MPLADS',
    budget: 4500000, // 45 Lakhs
    spent: 2250000,
    startDate: '2023-09-15',
    endDate: '2024-03-15',
    status: 'Delayed',
    district: 'East Khasi Hills',
    state: 'Meghalaya',
    contractor: 'TechVision Suppliers',
    latitude: 25.5788,
    longitude: 91.8933,
  },
  {
    id: 'PRJ-2023-008',
    name: 'Construction of Passenger Waiting Shed at Bus Stand',
    scheme: 'MPLADS',
    budget: 9000000, // 90 Lakhs
    spent: 900000,
    startDate: '2024-05-10',
    endDate: '2024-09-30',
    status: 'Registered',
    district: 'Mysuru',
    state: 'Karnataka',
    contractor: 'KV Constructions',
    latitude: 12.2958,
    longitude: 76.6394,
  }
];
