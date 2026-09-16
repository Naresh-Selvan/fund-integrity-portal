import { mockProjects } from './mockProjects';

export interface Complaint {
  id: string;
  projectId: string;
  projectName: string;
  category: string;
  status: string;
  date: string;
  evidence: boolean;
}

const initialComplaints: Complaint[] = mockProjects.slice(0, 8).map((p, i) => ({
  id: `COMP-2026-${1000 + i}`,
  projectId: p.id,
  projectName: p.name,
  category: ['Poor Material Quality', 'Unexplained Delay / Abandoned', 'Suspected Corruption'][i % 3],
  status: i % 4 === 0 ? 'Resolved' : i % 3 === 0 ? 'Under Review' : 'New',
  date: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString().split('T')[0],
  evidence: true
}));

const loadComplaints = () => {
  const stored = localStorage.getItem('sih_mock_complaints');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return initialComplaints;
};

export const mockComplaints: Complaint[] = loadComplaints();

export const saveComplaints = () => {
  localStorage.setItem('sih_mock_complaints', JSON.stringify(mockComplaints));
};
