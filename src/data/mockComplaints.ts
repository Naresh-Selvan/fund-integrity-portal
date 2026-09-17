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

export const loadComplaints = async (): Promise<Complaint[]> => {
  try {
    const res = await fetch('https://api.restful-api.dev/objects/ff808181a09d98f701a0a96e9e7918bc');
    const json = await res.json();
    return json?.data?.complaints || initialComplaints;
  } catch (e) {
    return initialComplaints;
  }
};

export let mockComplaints: Complaint[] = [];

loadComplaints().then(data => mockComplaints = data);

export const saveComplaints = async () => {
  try {
    await fetch('https://api.restful-api.dev/objects/ff808181a09d98f701a0a96e9e7918bc', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'sih-complaints-db', data: { complaints: mockComplaints } })
    });
  } catch (e) {}
};
